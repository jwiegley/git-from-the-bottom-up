# Introducing the blob

Now that the basic picture has been painted, let’s get into some practical examples. I’m going to start by creating a sample Git repository, and showing how Git works from the bottom up in that repository. Feel free to follow along as you read:

```bash
$ mkdir sample; cd sample
$ echo 'Hello, world!' > greeting
```

Here I’ve created a new filesystem directory named “sample” which contains a file whose contents are prosaically predictable. I haven’t even created a repository yet, but already I can start using some of Git’s commands to understand what it’s going to do. First of all, I’d like to know which hash id Git is going to store my greeting text under:

```bash
$ git hash-object greeting
af5626b4a114abcb82d63db7c8082c3c4756e51b
```

If you run this command on your system, you’ll get the same hash id. Even though we’re creating two different repositories (possibly a world apart, even) our greeting blob in those two repositories will have the same hash id. I could even pull commits from your repository into mine, and Git would realize that we’re tracking the same content — and so would only store one copy of it! Pretty cool.
The next step is to initialize a new repository and commit the file into it. I’m going to do this all in one step right now, but then come back and do it again in stages so you can see what’s going on underneath:

```bash
$ git init
$ git add greeting
$ git commit -m "Added my greeting"
```

At this point our blob should be in the system exactly as we expected, using the hash id determined above. As a convenience, Git requires only as many digits of the hash id as are necessary to uniquely identify it within the repository. Usually just six or seven digits is enough:

```bash
$ git cat-file -t af5626b
blob
$ git cat-file blob af5626b
Hello, world!
```

There it is! I haven’t even looked at which commit holds it, or what tree it’s in, but based solely on the contents I was able to assume it’s there, and there it is. It will always have this same identifier, no matter how long the repository lives or where the file within it is stored. These particular contents are now verifiably preserved, forever.

In this way, a Git blob represents the fundamental data unit in Git. Really, the whole system is about blob management.
