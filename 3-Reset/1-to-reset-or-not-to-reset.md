# To reset, or not to reset

One of the more difficult commands to master in Git is `reset`, which seems to bite people more often than other commands. Which is understandable, giving that it has the potential to change both your working tree and your current HEAD reference. So I thought a quick review of this command would be useful.

Basically, `reset` is a reference editor, an index editor, and a working tree editor. This is partly what makes it so confusing, because it’s capable of doing so many jobs. Let’s examine the difference between these three modes, and how they fit into the Git commit model.
