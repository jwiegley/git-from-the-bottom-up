# How trees are made

Every commit holds a single tree, but how are trees made? We know that blobs are created by stuffing the contents of your files into blobs — and that trees own blobs — but we haven’t yet seen how the tree that holds the blob is made, or how that tree gets linked to its parent commit.

Let’s start with a new sample repository again, but this time by doing things manually, so you can get a feeling for exactly what’s happening under the hood:

```bash
$ rm -fr greeting .git
$ echo 'Hello, world!' > greeting
$ git init
$ git add greeting
```

It all starts when you first add a file to the index. For now, let’s just say that the index is what you use to initially create blobs out of files. When I added the file `greeting`, a change occurred in my repository. I can’t see this change as a commit yet, but here is one way I can tell what happened:

```bash
$ git log # this will fail, there are no commits!
fatal: bad default revision 'HEAD'
$ git ls-files --stage # list blob referenced by the index
100644 af5626b4a114abcb82d63db7c8082c3c4756e51b 0 greeting
```

What’s this? I haven’t committed anything to the repository yet, but already an object has come into being. It has the same hash id I started this whole business with, so I know it represents the contents of my `greeting` file. I could use `cat-file -t` at this point on the hash id, and I’d see that it was a blob. It is, in fact, the same blob I got the first time I created this sample repository. The same file will always result in the same blob (just in case I haven’t stressed that enough).

This blob isn’t referenced by a tree yet, nor are there any commits. At the moment it is only referenced from a file named `.git/index`, which references the blobs and trees that make up the current index. So now let’s make a tree in the repo for our blob to hang off of:

```bash
$ git write-tree # record the contents of the index in a tree
0563f77d884e4f79ce95117e2d686d7d6e282887
```

This number should look familiar as well: a tree containing the same blobs (and sub-trees) will always have the same hash id. I don’t have a commit object yet, but now there is a tree object in that repository which holds the blob. The purpose of the low-level `write-tree` command is to take whatever the contents of the index are and tuck them into a new tree for the purpose of creating a commit.

I can manually make a new commit object by using this tree directly, which is just what the `commit-tree` command does:

```bash
$ echo "Initial commit" | git commit-tree 0563f77
5f1bc85745dcccce6121494fdd37658cb4ad441f
```

The raw `commit-tree` command takes a tree’s hash id and makes a commit object to hold it. If I had wanted the commit to have a parent, I would have had to specify the parent commit’s hash id explicitly using the `-p` option. Also, note here that the hash id differs from what will appear on your system: This is because my commit object refers to both my name, and the date at which I created the commit, and these two details will always be different from yours.

Our work is not done yet, though, since I haven’t registered the commit as the new head of a branch:

```bash
$ echo 5f1bc85745dcccce6121494fdd37658cb4ad441f > .git/refs/heads/master
```

This command tells Git that the branch name “master” should now refer to our recent commit. Another, much safer way to do this is by using the command `update-ref`:

```bash
$ git update-ref refs/heads/master 5f1bc857
```

After creating `master`, we must associate our working tree with it. Normally this happens for you whenever you check out a branch:

```bash
$ git symbolic-ref HEAD refs/heads/master
```

This command associates HEAD symbolically with the master branch. This is significant because any future commits from the working tree will now automatically update the value of `refs/heads/master`.

It’s hard to believe it’s this simple, but yes, I can now use log to view my newly minted commit:

```bash
$ git log
commit 5f1bc85745dcccce6121494fdd37658cb4ad441f
Author: John Wiegley <johnw@newartisans.com>
Date:   Mon Apr 14 11:14:58 2008 -0400
        Initial commit
```

A side note: if I hadn’t set `refs/heads/master` to point to the new commit, it would have been considered “unreachable”, since nothing currently refers to it nor is it the parent of a reachable commit. When this is the case, the commit object will at some point be removed from the repository, along with its tree and all its blobs. (This happens automatically by a command called `gc`, which you rarely need to use manually). By linking the commit to a name within `refs/heads`, as we did above, it becomes a reachable commit, which ensures that it’s kept around from now on.
