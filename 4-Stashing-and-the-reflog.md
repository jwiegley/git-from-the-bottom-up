# Stashing and the reflog

Until now we’ve described two ways in which blobs find their way into Git: first they’re created in your index, both without a parent tree and without an owning commit; and then they’re committed into the repository, where they live as leaves hanging off of the tree held by that commit. But there are two other ways a blob can dwell in your repository.

The first of these is the Git `reflog`, a kind of meta-repository that records — in the form of commits — every change you make to your repository. This means that when you create a tree from your index and store it under a commit (all of which is done by `commit`), you are also inadvertently adding that commit to the reflog, which can be viewed using the following command:

```bash
$ git reflog
5f1bc85...  HEAD@{0}: commit (initial): Initial commit
```

The beauty of the reflog is that it persists independently of other changes in your repository. This means I could unlink the above commit from my repository (using `reset`), yet it would still be referenced by the reflog for another 30 days, protecting it from garbage collection. This gives me a month’s chance to recover the commit should I discover I really need it.

The other place blobs can exist, albeit indirectly, is in your working tree itself. What I mean is, say you’ve changed a file `foo.c` but you haven’t added those changes to the index yet. Git may not have created a blob for you, but those changes do exist, meaning the content exists — it just lives in your filesystem instead of Git’s repository. The file even has its own SHA1 hash id, despite the fact no real blob exists. You can view it with this command:

```bash
$ git hash-object foo.c
<some hash id>
```

What does this do for you? Well, if you find yourself hacking away on your working tree and you reach the end of a long day, a good habit to get into is to stash away your changes:

```bash
$ git stash
```

This takes all your directory’s contents — including both your working tree, and the state of the index — and creates blobs for them in the git repository, a tree to hold those blobs, and a pair of stash commits to hold the working tree and index and record the time when you did the stash.

This is a good practice because, although the next day you’ll just pull your changes back out of the stash with `stash apply`, you’ll have a reflog of all your stashed changes at the end of every day. Here’s what you’d do after coming back to work the next morning (WIP here stands for “Work in progress”):

```bash
$ git stash list
stash@{0}: WIP on master: 5f1bc85...  Initial commit

$ git reflog show stash # same output, plus the stash commit's hash id 2add13e... stash@{0}: WIP on master: 5f1bc85... Initial commit

$ git stash apply
```
Because your stashed working tree is stored under a commit, you can work with it like any other branch — at any time! This means you can view the log, see when you stashed it, and checkout any of your past working trees from the moment when you stashed them:

```bash
$ git stash list
stash@{0}: WIP on master: 73ab4c1...  Initial commit
...
stash@{32}: WIP on master: 5f1bc85...  Initial commit
$ git log stash@{32}  # when did I do it?
$ git show stash@{32}  # show me what I was working on
$ git checkout -b temp stash@{32}  # let’s see that old working tree!
```

This last command is particularly powerful: behold, I’m now playing around in an uncommitted working tree from over a month ago. I never even added those files to the index; I just used the simple expedient of calling `stash` before logging out each day (provided you actually had changes in your working tree to stash), and used `stash apply` when I logged back in.

If you ever want to clean up your stash list — say to keep only the last 30 days of activity — don’t use `stash clear`; use the `reflog expire` command instead:

```bash
$ git stash clear  # DON'T! You'll lose all that history
$ git reflog expire --expire=30.days refs/stash
<outputs the stash bundles that've been kept>
```

The beauty of `stash` is that it lets you apply unobtrusive version control to your working process itself: namely, the various stages of your working tree from day to day. You can even use `stash` on a regular basis if you like, with something like the following `snapshot` script:

```bash
$ cat <<EOF > /usr/local/bin/git-snapshot
#!/bin/sh
git stash && git stash apply
EOF
$ chmod +x /usr/local/bin/git-snapshot
$ git-snapshot
```

There’s no reason you couldn’t run this from a `cron` job every hour, along with running the `reflog expire` command every week or month.
