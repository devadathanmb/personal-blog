---
layout: ../layouts/ProjectLayout.astro
title: "Projects"
---

I enjoy tackling projects that address real-world problems I encounter firsthand.

Whether it's a concise 10-line bash script or a more intricate 500-line Python project, my focus is on creating solutions that directly impact either my own challenges or those faced by others.

For me, what truly matters is the practical application and impact of these solutions.

The following is a concise list of projects and scripts I believe have or had some value. This isn't the entire collection, though—you can explore the full list, including the graveyard of dead projects and other nonsense, on [my GitHub](https://github.com/devadathanmb).

---

## Table of contents

## KTU Bot

KTU Bot remains an actively maintained project that has been a source of both learning and joy for me.

Essentially, it's a Telegram bot client designed to streamline most interactions possible on the [KTU (Kerala Technological University)](https://ktu.edu.in/) website.

Within days of its initial deployment, it garnered 10-20 users organically, purely through search discovery. Encouraged by this early success, I invested additional time to expand its capabilities into what it is today.

To date, this bot has served thousands of users and continues to see robust daily engagement. It facilitates tasks such as checking exam results, fetching notifications, accessing exam schedules and academic calendars, and even features machine-learning-driven live notification alerts.

This project has provided invaluable lessons in managing high-concurrency traffic, navigating the constraints imposed by the [Telegram Bot API](https://core.telegram.org/bots/api).

**Tools Used:**

- **Framework**: [Telegraf.JS](https://telegraf.js.org/)
- **Language**: TypeScript
- **Runtime**: [Node.JS](https://nodejs.org/)
- **DB**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Storage**: [Firebase Buckets](https://firebase.google.com/docs/storage)
- **Other Tools**: [BullMQ](https://docs.bullmq.io/), [Docker](https://www.docker.com/)

**Links:**

- **Github Repo**: [KTU Bot](https://github.com/devadathanmb/ktu-bot)
- **Deployed Link**: [KTU Bot](https://t.me/ktu_results_bot)

---

## RIT ETLab API

This is an API wrapper around ETLab portal which most of the engineering colleges in Kerala use to track attendance, student information, exam details etc. The portal itself is a pain to work with (no offense sorry). So I wrote an API wrapper that allows you to perform a login and grab all the useful info so that, my boy, you can build all the cool stuff and be the next thing.

This is more like a next version of an old API wrapper that I wrote for my own collage portal RITSoft (which is dead now since RIT switched to ETlab). This project has been forked and is being utilized by individuals in other colleges to develop their own projects.

**Tools Used:**

- **Framework:** [Flask](https://flask.palletsprojects.com/)
- **Language:** Python
- **Scraper:** [BeautifulSoup (BS4)](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- **Other Tools:** [OpenAPI spec](https://swagger.io/specification/), [Docker](https://www.docker.com/)

**Links:**

- **GitHub Repo:** [RIT ETLab API](https://github.com/devadathanmb/rit-etlab-api)
- **Deployed Link:** [RIT ETLab API](https://rit-etlab-api.onrender.com/apidocs/)

---

## Diet Planner Application

The Diet Planner Application was developed as part of KTU's S6 mini project curriculum. It aimed to address the challenge of diet planning using linear programming techniques. While effective in many cases, we discovered limitations in its applicability under certain scenarios. Nonetheless, the project was an insightful endeavor.

The application operates as a fully RESTful system with its own authentication mechanism implemented.

**Tools Used:**

- **Framework:** [Flask Restful](https://flask-restful.readthedocs.io/)
- **Frontend:** [React](https://reactjs.org/)
- **Styling:** [Bootstrap CSS](https://getbootstrap.com/)
- **Linear Programming Library:** [PuLP](https://coin-or.github.io/pulp/), a Python library for Linear Programming

**Links:**

- **GitHub Repo:** [Diet Planner Application](https://github.com/devadathanmb/diet-planner-backend)

---

## RIT Attendance Bot

The RIT Attendance Bot was a widely-used project (now dead) during my college days, aiming to provide easy access to attendance details from RITSoft (the college student portal) via Telegram. Initially inspired by another popular bot at our college, which suddenly ceased functioning, I decided to create an enhanced version.

This bot not only allowed students to check their attendance and calculate the number of classes they could miss but also provided additional features such as last updated information, present dates info, and absent dates info.

To ensure smooth operation, I developed a scraper API specifically for this purpose.

**Tools Used:**

- **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
- **Telegram Bot Framework:** [Telegraf.js v3](https://telegraf.js.org/)
- **Other Tools:** OpenAPI spec, Docker

**Links:**

- **GitHub Repo:** [RIT Attendance Bot](https://github.com/devadathanmb/rit-attendance-bot)

---

## Hyprland Smart Borders

Hyprland Smart Border is a pure bash script, under 100 lines, utilizing hyprland-ipc to enable dynamic borders in [Hyprland](https://hyprland.org). Initially developed as a simple script within my dotfiles repository, its functionality was later recognized as valuable to a broader audience, prompting its transition into a standalone repository.

The script operates by listening for hyprland events via the exposed socket API, dynamically managing window borders based on these events. While updates are occasional (due to limited personal use of my Hyprland desktop), it continues to be actively utilized by a community of users.

**Tools Used:**

- **[socat](http://www.dest-unreach.org/socat/)**
- **[bash](https://www.gnu.org/software/bash/)**
- **[jq](https://stedolan.github.io/jq/)**

---

## Wut?

**Wut?** is a CLI dictionary application developed as part of my [CS50P](https://cs50.harvard.edu/python/2022/) final project. It provides quick access to word meanings, synonyms, antonyms, pronunciation, and more directly from the terminal with a single command.

Initially created as an early [Python](https://www.python.org/) project to enhance my skills, **Wut?** remains functional and effective. However, due to changes in Python's recommendations against global package installations, it currently has some limitations. I plan to eventually port it into a standalone [pipx](https://pipxproject.github.io/pipx/) package when time permits.

**Tools Used:**

- **[Python](https://www.python.org/)**
- **[Python Rich](https://rich.readthedocs.io/en/latest/) CLI Library**
- **[Argparse](https://docs.python.org/3/library/argparse.html)**

---

_That's it for now. I don't have the time and energy to add other projects here. If you are still interested, just take a look at my [GitHub profile](https://github.com/devadathanmb) and you may find something._
