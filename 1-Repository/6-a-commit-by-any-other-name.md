# A commit by any other name...

Understanding commits is the key to grokking Git. You’ll know you have reached the Zen plateau of branching wisdom when your mind contains only commit topologies, leaving behind the confusion of branches, tags, local and remote repositories, etc. Hopefully such understanding will not require lopping off your arm — although I can appreciate if you’ve considered it by now.

If commits are the key, how you name commits is the doorway to mastery. There are many, many ways to name commits, ranges of commits, and even some of the objects held by commits, which are accepted by most of the Git commands. Here’s a summary of some of the more basic usages:

* **branchname** — As has been said before, the name of any branch is simply an alias for the most recent commit on that “branch”. This is the same as using the word HEAD whenever that branch is checked out.

* **tagname** — A tag-name alias is identical to a branch alias in terms of naming a commit. The major difference between the two is that tag aliases never change, whereas branch aliases change each time a new commit is checked in to that branch.

* **HEAD** — The currently checked out commit is always called HEAD. If you check out a specific commit — instead of a branch name — then HEAD refers to that commit only and not to any branch. Note that this case is somewhat special, and is called “using a detached HEAD” (I’m sure there’s a joke to be told here...).

* **c82a22c39cbc32...** — A commit may always be referenced using its full, 40-character SHA1 hash id. Usually this happens during cut-and-pasting, since there are typically other, more convenient ways to refer to the
same commit.

* **c82a22c** — You only need use as many digits of a hash id as are needed for a unique reference within the repository. Most of the time, six or seven digits is enough.

* **name^** — The parent of any commit is referenced using the caret symbol. If a commit has more than one parent, the first is used.

* **name^^** — Carets may be applied successively. This alias refers to “the parent of the parent” of the given commit name.

* **name^2** — If a commit has multiple parents (such as a merge commit), you can refer to the _nth_ parent using `name^n`.

* **name~10** — A commit’s _nth_ generation ancestor may be referenced using a tilde (~) followed by the ordinal number. This type of usage is common with `rebase -i`, for example, to mean “show me a bunch of recent commits”. This is the same as name^^^^^^^^^^.

* **name:path** — To reference a certain file within a commit’s content tree, specify that file’s name after a colon. This is helpful with show, or to show the difference between two versions of a committed file:

```bash
  $ git diff HEAD^1:Makefile HEAD^2:Makefile
```

* **name^{tree}** — You can reference just the tree held by a commit, rather than the commit itself.

* **name1..name2** — This and the following aliases indicate _commit ranges_, which are supremely useful with commands like log for seeing what’s happened during a particular span of time. The syntax to the left refers to all the commits reachable from **name2** back to, but not including, **name1**. If either **name1** or **name2** is omitted, HEAD is used in its place.

* **name1...name2** — A “triple-dot” range is quite different from the two-dot version above. For commands like log, it refers to all the commits referenced by **name1** or **name2**, but not by both. The result is then a list of all the unique commits in both branches. For commands like `diff`, the range expressed is between **name2** and the common ancestor of **name1** and **name2**. This differs from the `log` case in that changes introduced by **name1** are not shown.

* **master..** — This usage is equivalent to “`master..HEAD`”. I’m adding it here, even though it’s been implied above, because I use this kind of alias constantly when reviewing changes made to the current branch.

* **..master** — This, too, is especially useful after you’ve done a `fetch` and you want to see what changes have occurred since your last `rebase` or `merge`.

* **--since="2 weeks ago"** — Refers to all commits since a certain date.

* **--until=”1 week ago”** — Refers to all commits before a certain date.

* **--grep=pattern** — Refers to all commits whose commit message matches the regular expression pattern.

* **--committer=pattern** — Refers to all commits whose committer matches the pattern.

* **--author=pattern** — Refers to all commits whose author matches the pattern. The author of a commit is the one who created the changes it represents. For local development this is always the same as the committer, but when patches are being sent by e-mail, the author and the committer usually differ.

* **--no-merges** — Refers to all commits in the range that have only one parent — that is, it ignores all merge commits.

Most of these options can be mixed-and-matched. Here is an example which shows the following log entries: changes made to the current branch (branched from master), by myself, within the last month, which contain the text “foo”:

```bash
$ git log --grep='foo' --author='johnw' --since="1 month ago" master..
```
