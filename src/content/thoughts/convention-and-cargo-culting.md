---
pubDate: 2026-04-20T10:00:00Z
title: Convention is not cargo culting
tags:
  - software engineering
  - codebase
description: Following local patterns is useful. Copying them without understanding why is how mistakes become tradition.
---

One of the easiest ways for cargo culting to appear in a codebase is surprisingly simple.

A piece of code gets written. It passes review. It gets merged.

A few weeks later, somebody needs to solve a similar problem. They find that code, copy it, modify it slightly, and move on.

Then somebody copies that version.

And then somebody copies theirs.

At some point, nobody is asking why the pattern exists anymore. The fact that it already exists becomes reason enough to keep using it.

That's where convention quietly turns into cargo culting.

The problem isn't copying code. We all do it. The problem is when the codebase itself becomes the standard.

A good convention should have a reason behind it. A trade-off. A constraint. A lesson learned the hard way.

If nobody remembers that reason, the pattern might survive long after the problem it solved has disappeared.

This is why I think good code reviews matter. Not because they catch every bug, but because they create opportunities to ask "why?". A healthy codebase needs people who occasionally challenge existing patterns instead of assuming they're correct simply because they already exist.

Convention is useful.

The trick is making sure it stays convention and doesn't slowly become tradition.
