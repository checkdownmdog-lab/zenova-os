## ═══════════════════════════════════════════════════════════════════
##  ZENOVA OS — Gaming Without Limits
##  A clean, modern, no-bloat gaming Linux distribution
##  Based on Bazzite (Universal Blue / Fedora Atomic)
## ═══════════════════════════════════════════════════════════════════

ARG BASE_IMAGE="ghcr.io/ublue-os/bazzite"
ARG FEDORA_MAJOR_VERSION="41"

FROM ${BASE_IMAGE}:${FEDORA_MAJOR_VERSION} AS zenova

ARG FEDORA_MAJOR_VERSION

# ── Branding ──
LABEL org.opencontainers.image.title="Zenova OS"
LABEL org.opencontainers.image.description="A premium gaming Linux distro — clean, fast, no bloat."
LABEL org.opencontainers.image.version="1.0.0"

# ── Add Brave Browser Repository ──
# (The .repo file is copied from config/files/etc/yum.repos.d/)
RUN rpm --import https://brave-browser-rpm-release.s3.brave.com/brave-core.asc

# ── Remove Unwanted Packages ──
# Override firefox if it is part of the base ostree
RUN rpm-ostree override remove firefox firefox-langpacks gnome-tour gnome-extensions-app 2>/dev/null || true

# ── Install RPM Packages ──
RUN rpm-ostree install \
    # ─── Browser ───
    brave-browser \
    # ─── GPU Control Panels ───
    corectrl \
    # NVIDIA users: nvidia-settings comes from Bazzite's NVIDIA image
    # AMD users: corectrl is the equivalent of AMD Adrenalin
    radeontop \
    # ─── Gaming (supplements Bazzite's gaming stack) ───
    lutris \
    wine \
    winetricks \
    protontricks \
    # ─── Deep Customization / Theming ───
    kvantum \
    papirus-icon-theme \
    plasma-discover-flatpak \
    # ─── Shells & Terminal ───
    fish \
    zsh \
    zsh-autosuggestions \
    zsh-syntax-highlighting \
    starship \
    # ─── Modern CLI Tools ───
    fastfetch \
    btop \
    fzf \
    bat \
    ripgrep \
    eza \
    fd-find \
    tldr \
    # ─── Multimedia Codecs ───
    ffmpeg \
    gstreamer1-plugins-bad-free \
    gstreamer1-plugins-ugly \
    # ─── Fonts (for customization) ───
    google-noto-sans-fonts \
    google-noto-sans-mono-fonts \
    cascadia-fonts-all \
    fira-code-fonts \
    jetbrains-mono-fonts \
    # ─── Utilities ───
    wireguard-tools \
    p7zip \
    unrar \
    && rpm-ostree cleanup -m

# ── Copy Custom Files ──
# This copies the entire config/files tree into the root filesystem
# Includes: themes, wallpapers, welcome wizard, GPU setup, sysctl,
#           konsole profile, fastfetch config, app store branding, etc.
COPY config/files/ /

# ── Run Build Scripts ──
COPY config/scripts/ /tmp/scripts/
RUN chmod +x /tmp/scripts/*.sh && \
    /tmp/scripts/build.sh && \
    rm -rf /tmp/scripts

# ── Set Executable Permissions ──
RUN chmod +x /usr/libexec/zenova-welcome && \
    chmod +x /usr/libexec/zenova-firstboot && \
    chmod +x /usr/libexec/zenova-gpu-setup

# ── Enable First-Boot Service ──
RUN systemctl enable zenova-firstboot.service

# ── Configure KDE Discover (App Store) ──
# (flathub.flatpakrepo is copied from config/files/etc/flatpak/remotes.d/)

# ── Set OS Branding ──
RUN sed -i 's/^NAME=.*/NAME="Zenova OS"/' /usr/lib/os-release && \
    sed -i 's/^PRETTY_NAME=.*/PRETTY_NAME="Zenova OS 1.0 (Ignition)"/' /usr/lib/os-release && \
    sed -i 's/^ID=.*/ID=zenova/' /usr/lib/os-release && \
    sed -i 's/^HOME_URL=.*/HOME_URL="https:\/\/github.com\/YOUR_USERNAME\/zenova-os"/' /usr/lib/os-release && \
    sed -i 's/^VARIANT_ID=.*/VARIANT_ID=zenova/' /usr/lib/os-release && \
    echo 'VERSION="1.0.0 (Ignition)"' >> /usr/lib/os-release && \
    # Set issue banner (shown at login TTY)
    # (Copied from config/files/etc/issue)
    true

# ── Final Cleanup ──
RUN rm -rf /var/cache/* /tmp/* && \
    ostree container commit
