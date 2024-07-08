---
layout: ../layouts/ProjectLayout.astro
title: "Projects"
---

I enjoy tackling projects that address real-world problems I encounter firsthand. 

Whether it's a concise 10-line bash script or a more intricate 500-line Python project, my focus is on creating solutions that directly impact either my own challenges or those faced by others. 

For me, what truly matters is the practical application and impact of these solutions.

The following is a concise list of projects and scripts I believe have or had some value. This isn't the entire collection, though—you can explore the full list, including the graveyard of dead projects, on [my GitHub](https://github.com/devadathanmb).


## KTU Bot

KTU Bot remains an actively maintained project that has been a source of both learning and joy for me. Essentially, it's a Telegram bot client designed to streamline most interactions possible on the [KTU (Kerala Technological University)](https://ktu.edu.in/) website. Within days of its initial deployment, it garnered 10-20 users organically, purely through search discovery. Encouraged by this early success, I invested additional time to expand its capabilities into what it is today.

To date, this bot has served thousands of users and continues to see robust daily engagement. It facilitates tasks such as checking exam results, fetching notifications, accessing exam schedules and academic calendars, and even features machine-learning-driven live notification alerts.

This project has provided invaluable lessons in managing high-concurrency traffic, navigating the constraints imposed by the [Telegram Bot API](https://core.telegram.org/bots/api).

#### Tools Used:
- **Framework**: [Telegraf.JS](https://telegraf.js.org/)
- **Language**: TypeScript
- **Runtime**: [Node.JS](https://nodejs.org/)
- **DB**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Storage**: [Firebase Buckets](https://firebase.google.com/docs/storage)
- **Other Tools**: [BullMQ](https://docs.bullmq.io/), [Docker](https://www.docker.com/)