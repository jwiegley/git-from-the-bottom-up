# Doing a mixed reset

If you use the `--mixed` option (or no option at all, as this is the default), reset will revert parts of your index along with your HEAD reference to match the given commit. The main difference from `--soft` is that `--soft` only changes the meaning of HEAD and doesn’t touch the index.

```bash
$ git add foo.c  # add changes to the index as a new blob
$ git reset HEAD  # delete any changes staged in the index
$ git add foo.c  # made a mistake, add it back
```
