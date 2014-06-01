# Doing a hard reset

A hard reset (the `--hard` option) has the potential of being very dangerous, as it’s able to do two different things at once: First, if you do a hard reset against your current HEAD, it will erase all changes in your working tree, so that your current files match the contents of HEAD.

There is also another command, `checkout`, which operates just like `reset --hard` if the index is empty. Otherwise, it forces your working tree to match the index.

Now, if you do a hard reset against an earlier commit, it’s the same as first doing a soft reset and then using reset `--hard` to reset your working tree. Thus, the following commands are equivalent:

```bash
$ git reset --hard HEAD~3  # Go back in time, throwing away changes
$ git reset --soft HEAD~3  # Set HEAD to point to an earlier commit
$ git reset --hard  # Wipe out differences in the working tree
```

As you can see, doing a hard reset can be very destructive. Fortunately, there is a safer way to achieve the same effect, using the Git stash (see the next section):

```bash
$ git stash
$ git checkout -b new-branch HEAD~3   # head back in time!
```

This approach has two distinct advantages if you’re not sure whether you really want to modify the current branch just now:

1. It saves your work in the stash, which you can come back to at any time. Note that the stash is not branch specific, so you could potentially stash the state of your tree while on one branch, and later apply the differences to another.
2. It reverts your working tree back to a past state, but on a new branch, so if you decide to commit your changes against the past state, you won’t have altered your original branch.

If you do make changes to `new-branch` and then decide you want it to become your new master branch, run the following commands:

```bash
$ git branch -D master  # goodbye old master (still in reflog)
$ git branch -m new-branch master  # the new-branch is now my master
```

The moral of this story is: although you can do major surgery on your current branch using `reset --soft` and `reset --hard` (which changes the working tree too), why would you want to? Git makes working with branches so easy and cheap, it’s almost always worth it to do your destructive modifications on a branch, and then move that branch over to take the place of your old master. It has an almost Sith-like appeal to it...

And what if you do accidentally run `reset --hard`, losing not only your current changes but also removing commits from your master branch? Well, unless you’ve gotten into the habit of using stash to take snapshots (see next section), there’s nothing you can do to recover your lost working tree. But you can restore your branch to its previous state by again using `reset --hard` with the reflog (this will also be explained in the next section):

```bash
$ git reset --hard HEAD@{1}   # restore from reflog before the change
```

To be on the safe side, never use `reset --hard` without first running `stash`. It will save you many white hairs later on. If you did run stash, you can now use it to recover your working tree changes as well:

```bash
$ git stash  # because it's always a good thing to do
$ git reset --hard HEAD~3  # go back in time
$ git reset --hard HEAD@{1}  # oops, that was a mistake, undo it!
$ git stash apply  # and bring back my working tree changes
```
