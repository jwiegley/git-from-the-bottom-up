# Blobs are stored in trees

The contents of your files are stored in blobs, but those blobs are pretty featureless. They have no name, no structure — they’re just “blobs”, after all.

In order for Git to represent the structure and naming of your files, it attaches blobs as leaf nodes within a tree. Now, I can’t discover which tree(s) a blob lives in just by looking at it, since it may have many, many owners. But I know it must live somewhere within the tree held by the commit I just made:

```bash
$ git ls-tree HEAD
100644 blob af5626b4a114abcb82d63db7c8082c3c4756e51b greeting
```

There it is! This first commit added my greeting file to the repository. This commit contains one Git tree, which has a single leaf: the greeting content’s blob.

Although I can look at the tree containing my blob by passing HEAD to `ls-tree`, I haven’t yet seen the underlying tree object referenced by that commit. Here are a few other commands to highlight that difference and thus discover my tree:

```bash
$ git rev-parse HEAD
588483b99a46342501d99e3f10630cfc1219ea32 # different on your system

$ git cat-file -t HEAD
commit

$ git cat-file commit HEAD
tree 0563f77d884e4f79ce95117e2d686d7d6e282887
author John Wiegley <johnw@newartisans.com> 1209512110 -0400
committer John Wiegley <johnw@newartisans.com> 1209512110 -0400
Added my greeting
```

The first command decodes the HEAD alias into the commit it references, the second verifies its type, while the third command shows the hash id of the tree held by that commit, as well as the other information stored in the commit object. The hash id for the commit is unique to my repository — because it includes my name and the date when I made the commit — but the hash id for the tree should be common between your example and mine, containing as it does the same blob under the same name.

Let’s verify that this is indeed the same tree object:

```bash
$ git ls-tree 0563f77
100644 blob af5626b4a114abcb82d63db7c8082c3c4756e51b greeting
```

There you have it: my repository contains a single commit, which references a tree that holds a blob — the blob containing the contents I want to record. There’s one more command I can run to verify that this is indeed the case:

```bash
$ find .git/objects -type f | sort
.git/objects/05/63f77d884e4f79ce95117e2d686d7d6e282887
.git/objects/58/8483b99a46342501d99e3f10630cfc1219ea32
.git/objects/af/5626b4a114abcb82d63db7c8082c3c4756e51b
```

From this output I see that the whole of my repo contains three objects, each of whose hash id has appeared in the preceding examples. Let’s take one last look at the types of these objects, just to satisfy curiosity:

```bash
   $ git cat-file -t 588483b99a46342501d99e3f10630cfc1219ea32
   commit
   $ git cat-file -t 0563f77d884e4f79ce95117e2d686d7d6e282887
   tree
   $ git cat-file -t af5626b4a114abcb82d63db7c8082c3c4756e51b
   blob
```

I could have used the show command at this point to view the concise contents of each of these objects, but I’ll leave that as an exercise to the reader.
