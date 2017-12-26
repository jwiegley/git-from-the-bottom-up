# Taking the index further

Let’s see, the index... With it you can pre-stage a set of changes, thus iteratively building up a patch before committing it to the repository. Now, where have I heard that concept before...

If you’re thinking “Quilt!”, you’re exactly right. In fact, the index is little different from Quilt, it just adds the restriction of allowing only one patch to be constructed at a time.

But what if, instead of two sets of changes within `foo.c`, I had four? With plain Git, I’d have to tease each one out, commit it, and then tease out the next. This is made much easier using the index, but what if I wanted to test those changes in various combinations with each other before checking them in? That is, if I labelled the patches A, B, C and D, what if I wanted to test A + B, then A + C, then A + D, etc., before deciding if any of the changes were truly complete?

There is no mechanism in Git itself that allows you to mix and match parallel sets of changes on the fly. Sure, multiple branches can let you do parallel development, and the index lets you stage multiple changes into a series of commits, but you can’t do both at once: staging a series of patches while at the same time selectively enabling and disabling some of them, to verify the integrity of the patches in concert before finally committing them.
What you’d need in order to do something like this would be an index which allows for greater depth than one commit at a time. This is exactly what Stacked Git provides.

Here’s how I’d commit two different patches into my working tree using plain Git:

```bash
$ git add -i # select first set of changes
$ git commit -m "First commit message"
$ git add -i # select second set of changes
$ git commit -m "Second commit message"
```

This works great, but I can’t selectively disable the first commit in order to test the second one alone. To do that, I’d have to do the following:

```bash
$ git log # find the hash id of the first commit
$ git checkout -b work <first commit’s hash id>
$ git cherry-pick <second commit’s hash id>
<... run tests ...>
$ git checkout master # go back to the master "branch"
$ git branch -D work # remove my temporary branch
```

Surely there has to be a better way! With `stg` I can queue up both patches and then re-apply them in whatever order I like, for independent or combined testing, etc. Here’s how I’d queue the same two patches from the previous example, using `stg`:

```bash
$ stg new patch1
$ git add -i  # select first set of changes
$ stg refresh --index
$ stg new patch2
$ git add -i  # select second set of changes
$ stg refresh --index
```
Now if I want to selectively disable the first patch to test only the second, it’s very straightforward:

```bash
$ stg applied
patch1
patch2
<...  do tests using both patches ...>
$ stg pop patch1
<...  do tests using only patch2 ...>
$ stg pop patch2
$ stg push patch1
<...  do tests using only patch1 ...>
$ stg push -a
$ stg commit -a  # commit all the patches
```

This is definitely easier than creating temporary branches and using `cherry-pick` to apply specific commit ids, followed by deleting the temporary branch.
