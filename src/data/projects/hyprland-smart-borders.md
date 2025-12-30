---
title: "Hyprland Smart Borders"
description: "A pure bash script utilizing hyprland-ipc to enable dynamic borders in Hyprland."
featured: false
tags: ["linux", "bash", "hyprland", "window-manager"]
techStack: ["socat", "bash", "jq"]
repoUrl: "https://github.com/devadathanmb/hyprland-smart-borders"
---

Hyprland Smart Border is a pure bash script, under 100 lines, utilizing hyprland-ipc to enable
dynamic borders in [Hyprland](https://hyprland.org). Initially developed as a simple script within
my dotfiles repository, its functionality was later recognized as valuable to a broader audience,
prompting its transition into a standalone repository.

The script operates by listening for hyprland events via the exposed socket API, dynamically
managing window borders based on these events. While updates are occasional (due to limited personal
use of my Hyprland desktop), it continues to be actively utilized by a community of users.
