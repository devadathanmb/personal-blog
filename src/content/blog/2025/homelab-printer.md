---
author: Devadathan M B
pubDate: 2025-06-22T15:20:35Z
lastModDate: 2026-03-22T13:30:20Z
title: Giving My Old USB Printer a New Life with a Raspberry Pi
featured: true
draft: false
tags:
  - homelab
  - raspberry pi
  - self-hosted
description:
  Breathing new life into an old USB-only printer by turning it into a network printer using a
  Raspberry Pi, CUPS, and some Linux trickery.
---

## Introduction

Around the end of 2024, my free-tier cloud VMs were nearing their expiration, and I needed something
to run a few self-hosted services. After doing the math, it made more sense to get a
[Raspberry Pi](https://www.raspberrypi.com/products/) instead of continuing to pay for cloud
compute. I was already familiar with
[Cloudflare Tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/) and
[Tailscale](https://tailscale.com/), so static IPs weren’t a concern (more on the homelab setup in
another post).

I bought a [Raspberry Pi 5 Model B (8GB RAM)](https://www.raspberrypi.com/products/raspberry-pi-5/),
a 256GB SD card with good write endurance, a case, and the power supply. Flashed
[Debian Bookworm Server](https://www.debian.org/releases/bookworm/) onto it, installed
[Docker](https://www.docker.com/) and some essentials, and started hosting a few of my services.
Even with containers and a couple of headless browsers humming along, the Pi just chilled.

_See, how the Pi is barely sweating:_
![Raspberry Pi 5 Model B](@/assets/homelab-printer/neofetch.png)
![PI HTOP Usage](@/assets/homelab-printer/htop.png)

## The printer problem

I had an
[Epson L3110](https://www.epson.co.in/Support/Printers/All-In-One/L-Series/Epson-L3110/s/SPT_C11CG87504)
inktank printer at home for years. It’s reliable, prints well — but it’s strictly USB. No Wi-Fi. No
network capability.

Every time someone needed to print, the drill looked like a mini side quest:

- Transfer the file to a laptop or phone with a USB-C port
- Boot up the device
- Plug in the printer
- Move the file over
- Hit print
- Wait for the job to finish
- Unplug the printer

All in, it’s a solid 5-minute ritual—every single time. Printing shouldn’t feel like compiling code
with 100+ dependencies.

One thing I tried was using the USB port on my router. It looked promising—right up until I ran into
vendor lock-in. Flashing custom firmware was more trouble than it was worth. I always had a feeling
the Pi could handle it, just never got around to setting it up.

## Finally deciding to fix it

That Sunday came. I’d been using Linux long enough to know about [CUPS](https://www.cups.org/) — the
Common UNIX Printing System. It’s a modular printing system developed by Apple that allows a
computer to act as a print server. It uses the [Internet Printing Protocol (IPP)](https://www.pwg.org/ipp/) and supports
drivers, filters, and backends for converting print jobs and interfacing with physical printers.

It can make a USB printer available over the network, support job queueing, handle authentication,
and even expose web-based management at `localhost:631`. It’s what Linux uses behind the scenes when
you hit “Print.”

My plan: connect the USB printer to the Pi, install and configure CUPS, make the printer
network-accessible — and ideally never deal with file transfers for printing again.

_This is a dead simple diagram of the setup:_
![Working Diagram](@/assets/homelab-printer/working-diagram.png)

## Enough Talk, How to do it?

### 1. Plug the printer into the Pi

Connect the printer via USB and make sure it shows up:

```bash
lsusb
```

You should see something like `Epson` or `Canon` listed. If it’s detected, you’re good.

### 2. Install CUPS and printer drivers

```bash
sudo apt update
sudo apt install cups
```

Enable and start the service:

```bash
sudo systemctl enable cups
sudo systemctl start cups
```

**For Epson L-series printers (L3110, L3310, etc.):** install the ESC/P-R driver from the apt repository:

```bash
sudo apt install printer-driver-escpr
```

> **Important:** Do _not_ download the `.deb` driver from Epson's official website. Those packages are
> compiled for x86/x86_64 and will not run on the Pi's ARM CPU. The `printer-driver-escpr` package
> from apt is the ARM-compiled version and is the correct one to use.

### 3. Add your user to the `lpadmin` group

CUPS restricts admin access to users in the `lpadmin` group:

```bash
sudo usermod -aG lpadmin $USER
newgrp lpadmin
```

### 4. Test: Print from the terminal (important!)

Before messing with config files and web UIs, try printing a test page directly:

```bash
lpstat -p -d   # See if printer is recognized
```

If it’s listed, try:

```bash
echo "Test page from Pi" | lp
```

This sends a simple print job. If it prints — great. CUPS is working.

If not, check with:

```bash
lpq
```

or:

```bash
journalctl -u cups -n 50
```

### 5. Configure CUPS to allow network access

By default, CUPS binds to localhost only and has the web interface disabled. Let’s open it up.

The quickest way is with `cupsctl`:

```bash
sudo cupsctl --remote-admin --remote-any --share-printers
```

Or manually edit `/etc/cups/cupsd.conf`:

```bash
sudo vim /etc/cups/cupsd.conf
```

#### 5.1 Listen on all interfaces

Replace `Listen localhost:631` with:

```
Port 631
```

#### 5.2 Allow access from LAN

```
<Location />
  Order allow,deny
  Allow @LOCAL
</Location>

<Location /admin>
  Order allow,deny
  Allow @LOCAL
</Location>
```

#### 5.3 Enable the web interface

```
WebInterface Yes
```

#### 5.4 Keep CUPS running persistently

By default, CUPS has `IdleExitTimeout 60` — it exits after 60 seconds of inactivity (socket activation brings it back on demand, but it causes unnecessary latency for a print server). Set it to 0:

```
IdleExitTimeout 0
```

#### 5.5 Enable mDNS broadcasting

Make sure this line is present (it enables [AirPrint](https://en.wikipedia.org/wiki/AirPrint)/[Mopria](https://mopria.org/) discovery):

```
BrowseLocalProtocols dnssd
```

### 6. Restart CUPS

```bash
sudo systemctl restart cups
```

You should now be able to visit:

```
http://<your-pi-ip>:631
```

_You should see the CUPS web UI like this:_

![CUPS Web UI](@/assets/homelab-printer/cups-web-ui.png)

### 7. Add the printer

**Option A: Web interface**

1. Go to **Administration** → **Add Printer**
2. Log in with your Pi user creds
3. Select your USB printer from the list
4. Name it, and check **Share This Printer**
5. Select the driver for your printer model (if your exact model isn't listed, try the closest one in the same series — it usually works)
6. Finish and verify it shows under **Printers**

> Note: Some printers enumerate under a slightly different model name than what's printed on the box. For example, the Epson L3310 shows up as `L3110 Series` — that's expected.

**Option B: CLI (one-liner)**

First, find the USB device URI and the exact PPD name:

```bash
sudo lpinfo -v                          # find the usb:// URI for your printer
sudo lpinfo -m | grep -i <model-name>   # find the right PPD
```

Then add it:

```bash
sudo lpadmin -p MyPrinter -E \
  -v '<uri-from-lpinfo-v>' \
  -m '<ppd-from-lpinfo-m>' \
  -D 'My Printer' \
  -o printer-is-shared=true

sudo lpadmin -d MyPrinter   # set as system default
```

### 8. Verify it's working

```bash
lpstat -t   # should show the printer as idle/enabled
```

Try a test print:

```bash
echo "Test page from Pi" | lp
```

## 9. AirPrint, Mopria, and mobile printing

This is the part that makes the whole thing magical.

Once CUPS is sharing the printer and Avahi is running, your phone just finds it. No app, no driver,
no IP address to memorise.

### 9.1 Install Avahi

```bash
sudo apt install avahi-daemon libnss-mdns
sudo systemctl enable avahi-daemon
sudo systemctl start avahi-daemon
```

[Avahi](https://avahi.org/) implements Apple’s [mDNS/Bonjour](https://developer.apple.com/bonjour/) protocol. It reads CUPS’s shared printer list and broadcasts
an `_ipp._tcp` service record over multicast — the same mechanism that [AirPrint](https://en.wikipedia.org/wiki/AirPrint) and Android’s [Mopria](https://mopria.org/)
stack both listen on. One advertisement, two platforms.

You can verify the printer is being advertised:

```bash
sudo apt install avahi-utils
avahi-browse -rpt _ipp._tcp | grep -i <your-printer-name>
```

You should see it listed with a TXT record containing `mopria-certified=1.3` and `URF=...` — meaning
both Android and iOS will recognise it natively.

Now your Pi (and printer) is also reachable by hostname at:

```
http://<your-pi-hostname>.local:631
```

### 9.2 Printing from iOS

Open any app → tap the share/print icon. The printer appears as **"Your Printer @ &lt;hostname&gt;"** automatically.
That’s [AirPrint](https://en.wikipedia.org/wiki/AirPrint) — built into iOS since 2010. No app needed.

### 9.3 Printing from Android

Modern Android (8+) ships with the **[Mopria Print Service](https://mopria.org/)** pre-installed. Open any app → Print → it
auto-discovers the printer over mDNS. Works out of the box.

If it doesn’t appear, install [Mopria Print Service](https://play.google.com/store/apps/details?id=org.mopria.printplugin)
from the Play Store and make sure it’s enabled under Settings → Connected Devices → Printing.

## Some Caveats That You Should Know

- **mDNS is link-local.** The printer advertisement doesn’t cross routers or VLAN boundaries. Your
  phone needs to be on the same subnet as the Pi. If you have a guest Wi-Fi network, don’t expect it
  to work from there.

- **Give your Pi a unique hostname.** If you have more than one Pi on the network and both are named
  `raspberrypi`, mDNS breaks. Discovery becomes unreliable. Just rename it in `raspi-config` or
  `/etc/hostname`.

- **Set a static IP (or a DHCP reservation on your router).** The printer will always be discoverable
  via `<hostname>.local`, but if you reference the Pi by IP anywhere (bookmarks, scripts, etc.), a DHCP
  change will break it.

- **Fallback: manual IPP URL.** If auto-discovery doesn’t work for whatever reason, you can always
  add the printer manually in your phone’s settings using:
  ```
  http://<pi-ip>:631/printers/<printer-name>
  ```
  Most mobile print dialogs accept a manual IPP URL.

## Final Thoughts

After one hour of hacking. This is what I got:

![Screenshot of the working setup](@/assets/homelab-printer/screenshot.png)

No more cable swapping, no more file transfers, no more printer amnesia. Just a printer that shows
up on the network like it should’ve from day one.

Also — a fun bit of trivia — the origins of the
[Free Software Movement](https://en.wikipedia.org/wiki/Free_software_movement) actually trace back
to a
[printer driver problem at MIT](https://en.wikipedia.org/wiki/Richard_Stallman#Events_leading_to_GNU).
Richard Stallman got annoyed that he couldn’t fix the bugs in a Xerox printer because the driver was
proprietary. He decided that software should be free to study, modify, and redistribute — and thus,
a movement was born.

In a weirdly poetic way, fixing a printing problem with free software on a $60 single-board computer
feels like it closes that circle.

In the end, it’s not just about printing. It’s about control. It’s about choosing tools that don’t
fight you. It’s about that quiet satisfaction when something works because you made it work.

Happy hacking, hackers. Keep the spirit alive.
