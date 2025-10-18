---
author: Devadathan M B
pubDatetime: 2023-07-29T15:20:35Z
title: Autologin in Linux using Getty
featured: false
draft: false
tags:
  - linux
  - autologin
  - systemd
  - getty
description: How to enable autologin in Linux using Getty.
---

This post will explain how you can enable/disable autologin in Linux distros using the Getty systemd
service.

## Table of contents

## Why?

Well sometimes, you're too lazy even to type the password right? Or you're running a minimalistic
system without a login manager and you don't want to get stuck in the tty typing username and
password everytime to login. This is where the getty service is gonna help you out.

## What is Getty?

In traditional Unix-like systems, a "getty" is a program that manages the login process on virtual
terminals (VTs) or consoles.

The name "getty" stands for "get tty" (get teletype) and originates from the time when teletypes
were commonly used as input/output devices.

Getty is responsible for prompting users for their username and password when they access a
terminal, and it spawns a login shell after successful authentication.

In modern Linux distributions that use systemd, the getty service is often managed by systemd, which
is a system and service manager for Linux operating systems. systemd takes care of starting and
managing getty instances, as well as other system services. The getty service is responsible for
displaying the login prompt and managing user logins on virtual terminals.

## No password means easy hecking?

Well, fair question. But if you're already using a non-encrypted drive there's pretty much no base
for that argument.

**Physical access = God access**

_Don't forget to encrypt your drive the next time you install Linux_

## How to do this?

Enough talking. Let's get straight into business.

### Steps

1. Open `/etc/systemd/system/getty.target.wants/getty@tty1.service` using your favorite text editor.

```bash
sudo vim /etc/systemd/system/getty.target.wants/getty@tty1.service
```

2. Find the line saying `[Service]`

3. There you will see something like this

`ExecStart=-/sbin/agetty -o '-p -- \\u' --noclear - $TERM`

```
aggety : Program that manages the virtual terminal

-o : To set output options

-p : Issue prompting (/etc/issue)

--noclear : Don't clear terminal before displaying prompt

$TERM : User's default terminal
```

4. Comment the line and add this new line

`ExecStart=-/sbin/agetty -i -a <username> %I $TERM`

Where `<username>` will be your username

```
eg:
ExecStart=-/sbin/agetty -i -a ram %I $TERM
```

5. Save the file and reboot. And thou shall enter no password fron now on.

Goodbye
