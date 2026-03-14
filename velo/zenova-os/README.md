# 🎮 Zenova OS — Gaming Without Limits

A premium, no-bloat gaming Linux distribution built on top of **[Bazzite](https://bazzite.gg)** (Fedora Atomic / Universal Blue). Designed for gamers who want performance, style, and deep customization.

![Zenova OS](https://img.shields.io/badge/Based%20on-Bazzite-purple?style=for-the-badge)
![KDE Plasma](https://img.shields.io/badge/Desktop-KDE%20Plasma-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ✨ What Makes Zenova Different?

| Feature | Zenova | Stock Bazzite | Nobara |
|---------|--------|---------------|--------|
| Custom dark gaming theme | ✅ Zenova Purple/Cyan | ❌ Default | ❌ Default |
| Brave Browser pre-installed | ✅ | ❌ Firefox | ❌ Firefox |
| Discord auto-installed | ✅ First boot | ❌ Manual | ❌ Manual |
| Starship + Fish shell | ✅ Pre-configured | ❌ Bash | ❌ Bash |
| Gaming kernel tweaks | ✅ BBR, low swap, max_map_count | ⚠️ Some | ⚠️ Some |
| Bloat removed | ✅ No Firefox, minimal | ❌ | ❌ |
| OBS, VS Code, Heroic pre-installed | ✅ | ❌ Manual | ❌ Manual |
| Fastfetch with custom config | ✅ | ❌ | ❌ |
| Immutable / Atomic updates | ✅ rpm-ostree | ✅ | ❌ |

---

## 📦 What's Included

### System-Level (RPM — always available)
- **Brave Browser** — Privacy-first web browsing
- **Steam** — (from Bazzite) Full Steam with Proton
- **Lutris** — Universal game launcher
- **Wine / Winetricks / Protontricks** — Windows compatibility
- **CoreCtrl** — GPU overclocking & fan control
- **Kvantum** — Advanced Qt theming engine
- **Papirus-Dark** — Beautiful icon theme
- **Fish + Starship** — Modern shell with rad prompt
- **btop / eza / bat / ripgrep / fzf** — Better CLI tools
- **Fastfetch** — Beautiful system info (replaces neofetch)

### Flatpak Apps (auto-installed on first boot)
- **Discord** — Voice & text chat
- **OBS Studio** — Streaming & recording
- **VLC** — Media player
- **Heroic Games Launcher** — Epic/GOG games
- **ProtonUp-Qt** — Manage Proton versions
- **Bottles** — Windows software runner
- **VS Code** — Code editor
- **LibreOffice** — Office suite
- **Flatseal** — Flatpak permissions manager
- **Warehouse** — Flatpak manager

### Gaming Stack (from Bazzite base)
- **Maximum Performance Kernel** — Auto-optimize for gaming
- **Proton Experimental** — Latest Proton compatibility layer
- **Mesa drivers** — Latest GPU stack
- **PipeWire** — Ultra low-latency audio for competitive games
---

## 🔧 Building the ISO

### Prerequisites
- A **GitHub account** (free)
- That's literally it — GitHub Actions builds everything in the cloud

### Steps

1. **Fork this repository** on GitHub

2. **Enable GitHub Actions** in your fork:
   - Go to your fork → Settings → Actions → General
   - Select "Allow all actions and reusable workflows"
   - Save

3. **Push a commit** (or manually trigger the workflow):
   - Go to Actions tab → "Build Zenova OS" → "Run workflow"

4. **Download your ISO**:
   - After ~30-45 minutes, go to Actions → latest run → Artifacts
   - Download `ZenovaOS-ISO`
   - The ISO will be ~4-5 GB

5. **Flash to USB**:
   - Use [Ventoy](https://ventoy.net) (recommended), [Rufus](https://rufus.ie), or [balenaEtcher](https://etcher.balena.io)
   - Boot from USB and install!

### Building Locally (advanced)
```bash
# Requires podman on Linux
podman build -t zenova-os -f Containerfile .

# Generate ISO (requires sudo)
sudo podman run --rm --privileged \
  -v ./output:/output \
  ghcr.io/jasonn3/build-container-installer:latest \
  IMAGE_REPO=localhost IMAGE_NAME=zenova-os IMAGE_TAG=latest \
  VARIANT=Kinoite ISO_NAME=ZenovaOS-1.0-x86_64.iso
```

---

## 🎨 Customization

Zenova ships with **KDE Plasma**, which gives you Arch-level customization out of the box:

### Theme & Appearance
- **Global Theme**: Zenova (custom purple/cyan dark theme)
- **Color Scheme**: Zenova — deep navy with violet accents
- **Icons**: Papirus-Dark (full icon set)
- **Widget Style**: Kvantum (highly customizable)
- **Fonts**: Inter (UI) + JetBrains Mono (terminal)
- **Window Decorations**: Full control via System Settings

### Desktop Customization
- **Panels**: Move, resize, add multiple panels
- **Widgets**: Hundreds available (weather, system monitor, etc.)
- **Virtual Desktops**: Unlimited workspaces
- **Activities**: Separate desktop configurations
- **Window Tiling**: Built-in KWin tiling
- **Desktop Effects**: Wobbly windows, magic lamp, blur, etc.

### Terminal
- **Shell**: Fish (with smart completions)
- **Prompt**: Starship (beautiful, fast, customizable)
- **Color Scheme**: Custom Zenova with 88% transparency
- **Font**: JetBrains Mono 11pt

### Gaming Performance
- High Performance GPU/CPU Schedulers
- CoreCtrl: Advanced GPU power/fan profiles

---

## 🛠️ Customizing Your Build

### Adding more RPM packages
Edit the `Containerfile` and add packages to the `rpm-ostree install` section.

### Adding more Flatpak apps
Edit `config/files/usr/libexec/zenova-firstboot` and add Flatpak app IDs to the `FLATPAKS` array.
Find app IDs at [flathub.org](https://flathub.org).

### Changing the theme colors
Edit `config/files/usr/share/color-schemes/Zenova.colors` — change the RGB values to your preferred palette.

### Changing the default shell
Edit `config/scripts/build.sh` — change the Starship/Fish configuration.

### Adding wallpapers
Drop PNG/JPG files into `config/files/usr/share/zenova/wallpapers/`.

---

## 📋 System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | x86_64, 4 cores | 6+ cores, Zen 3+ / 12th gen+ |
| RAM | 8 GB | 16+ GB |
| GPU | AMD RX 570 / NVIDIA GTX 1060 | AMD RX 6700+ / NVIDIA RTX 3060+ |
| Storage | 50 GB SSD | 256+ GB NVMe |
| UEFI | Required | Secure Boot supported |

---

## 🔄 Updating

Zenova uses Fedora Atomic's `rpm-ostree` for bulletproof updates:

```bash
# Update the system image
rpm-ostree upgrade

# Update Flatpak apps
flatpak update

# Rollback if anything breaks
rpm-ostree rollback
```

---

## 📄 License

MIT — do whatever you want with it. Game on. 🎮
