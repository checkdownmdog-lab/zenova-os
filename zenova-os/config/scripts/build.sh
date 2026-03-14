#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
#  Zenova OS — Build Script
#  Runs inside the container during image build
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

echo "══════════════════════════════════════"
echo "  Building Zenova OS 1.0..."
echo "══════════════════════════════════════"

# ── Register shells ──
echo "[Zenova] Registering shells..."
echo "/usr/bin/fish" >> /etc/shells 2>/dev/null || true
echo "/usr/bin/zsh" >> /etc/shells 2>/dev/null || true

# ── Create Zenova branding directory ──
echo "[Zenova] Setting up branding..."
mkdir -p /usr/share/zenova

# ── Create the ASCII logo file (for MOTD and scripts) ──
cat > /usr/share/zenova/logo.txt << 'LOGO'

    ╭───────────────────────╮
    │  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  │
    │              ▄▄▄▀▀   │
    │          ▄▄▀▀        │
    │      ▄▄▀▀            │
    │  ▄▄▀▀                │
    │  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  │
    ╰───────────────────────╯

       Z E N O V A   O S
     ─────────────────────
     Gaming Without Limits

LOGO

# ── Set MOTD (Message of the Day) ──
cat > /etc/motd << 'MOTD'

  ╭───────────────────────╮
  │  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  │
  │              ▄▄▄▀▀   │
  │          ▄▄▀▀        │
  │      ▄▄▀▀            │
  │  ▄▄▀▀                │
  │  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  │
  ╰───────────────────────╯
     Z E N O V A   O S
   Gaming Without Limits

  Type 'fastfetch' for system info
  Type 'zenova-help' for commands

MOTD

# ── Create zenova-help command ──
cat > /usr/bin/zenova-help << 'HELP'
#!/usr/bin/env bash
echo ""
echo "  ╔═══════════════════════════════════════════╗"
echo "  ║        Zenova OS — Quick Reference        ║"
echo "  ╠═══════════════════════════════════════════╣"
echo "  ║                                           ║"
echo "  ║  SYSTEM                                   ║"
echo "  ║    fastfetch       System info + logo      ║"
echo "  ║    btop            System monitor          ║"
echo "  ║    rpm-ostree upgrade   Update system      ║"
echo "  ║    rpm-ostree rollback  Undo last update   ║"
echo "  ║    flatpak update  Update apps             ║"
echo "  ║                                           ║"
echo "  ║  GAMING                                    ║"
echo "  ║    steam           Launch Steam             ║"
echo "  ║    lutris          Launch Lutris            ║"
echo "  ║    corectrl        GPU control panel        ║"
echo "  ║    nvidia-settings NVIDIA control panel     ║"
echo "  ║                                           ║"
echo "  ║  FILES                                     ║"
echo "  ║    ls / ll / lt    List files (eza)        ║"
echo "  ║    cat             View files (bat)        ║"
echo "  ║    grep            Search files (ripgrep)  ║"
echo "  ║    fd              Find files              ║"
echo "  ║                                           ║"
echo "  ║  ZENOVA                                    ║"
echo "  ║    zenova-help     This help screen        ║"
echo "  ║    zenova-gpu-setup  Reconfigure GPU       ║"
echo "  ║    zenova-welcome  Re-run setup wizard     ║"
echo "  ║                                           ║"
echo "  ╚═══════════════════════════════════════════╝"
echo ""
HELP
chmod +x /usr/bin/zenova-help

# ── Configure Starship prompt ──
echo "[Zenova] Configuring Starship prompt..."
mkdir -p /etc/skel/.config
cat > /etc/skel/.config/starship.toml << 'STARSHIP_EOF'
# Zenova OS — Starship Prompt Theme
format = """
[](fg:#7c3aed)\
$os\
[](bg:#5b21b6 fg:#7c3aed)\
$directory\
[](fg:#5b21b6 bg:#2563eb)\
$git_branch\
$git_status\
[](fg:#2563eb bg:#06b6d4)\
$cmd_duration\
[](fg:#06b6d4)\
$line_break$character"""

[os]
disabled = false
style = "bg:#7c3aed fg:#f0f0f5"
format = "[ $symbol ]($style)"

[os.symbols]
Linux = "󰌽"

[directory]
style = "bg:#5b21b6 fg:#e0e0ff"
format = "[ $path ]($style)"
truncation_length = 3

[git_branch]
symbol = ""
style = "bg:#2563eb fg:#e0e0ff"
format = "[ $symbol $branch ]($style)"

[git_status]
style = "bg:#2563eb fg:#e0e0ff"
format = "[$all_status$ahead_behind]($style)"

[cmd_duration]
min_time = 500
style = "bg:#06b6d4 fg:#0a0a12"
format = "[ 󰔟 $duration ]($style)"

[character]
success_symbol = "[❯](bold #7c3aed)"
error_symbol = "[❯](bold #ef4444)"
STARSHIP_EOF

# ── Configure Fish shell ──
echo "[Zenova] Configuring Fish shell..."
mkdir -p /etc/skel/.config/fish/conf.d
cat > /etc/skel/.config/fish/config.fish << 'FISH_EOF'
# Zenova OS — Fish Configuration
if status is-interactive
    set -g fish_greeting ""

    # Starship prompt
    if command -q starship
        starship init fish | source
    end

    # Modern CLI aliases
    if command -q eza
        alias ls="eza --icons --group-directories-first"
        alias ll="eza -la --icons --group-directories-first"
        alias lt="eza --tree --icons --level=2"
        alias la="eza -a --icons --group-directories-first"
    end
    if command -q bat;      alias cat="bat --style=auto"; end
    if command -q rg;       alias grep="rg"; end
    if command -q btop;     alias top="btop"; end
    if command -q fd;       alias find="fd"; end

    # Zenova aliases
    alias fetch="fastfetch"
    alias neofetch="fastfetch"
    alias update="ublue-update"
    alias search="flatpak search"
    alias install="flatpak install flathub"
    alias uninstall="flatpak uninstall"
    alias help="zenova-help"
end
FISH_EOF

# ── Configure Zsh (for users who pick Zsh in wizard) ──
echo "[Zenova] Configuring Zsh..."
cat > /etc/skel/.zshrc << 'ZSH_EOF'
# Zenova OS — Zsh Configuration
# Enable completions
autoload -Uz compinit && compinit
# History
HISTFILE=~/.zsh_history
HISTSIZE=10000
SAVEHIST=10000
setopt appendhistory sharehistory

# Plugins
[ -f /usr/share/zsh-autosuggestions/zsh-autosuggestions.zsh ] && source /usr/share/zsh-autosuggestions/zsh-autosuggestions.zsh
[ -f /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh ] && source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# Starship prompt
command -v starship &>/dev/null && eval "$(starship init zsh)"

# Aliases
command -v eza &>/dev/null && { alias ls="eza --icons --group-directories-first"; alias ll="eza -la --icons"; alias lt="eza --tree --icons --level=2"; }
command -v bat &>/dev/null && alias cat="bat --style=auto"
command -v rg  &>/dev/null && alias grep="rg"
command -v btop &>/dev/null && alias top="btop"
alias fetch="fastfetch"
alias neofetch="fastfetch"
alias update="ublue-update"
alias help="zenova-help"
ZSH_EOF

# ── Compile GSettings Schemas ──
if [ -d /usr/share/glib-2.0/schemas ]; then
    echo "[Zenova] Compiling GSettings schemas..."
    glib-compile-schemas /usr/share/glib-2.0/schemas 2>/dev/null || true
fi

# ── Set permissions ──
echo "[Zenova] Setting permissions..."
chmod +x /usr/libexec/zenova-welcome 2>/dev/null || true
chmod +x /usr/libexec/zenova-firstboot 2>/dev/null || true
chmod +x /usr/libexec/zenova-gpu-setup 2>/dev/null || true
chmod 644 /etc/sysctl.d/99-zenova-gaming.conf 2>/dev/null || true

echo "══════════════════════════════════════"
echo "  Zenova OS 1.0 build complete! 🎮"
echo "══════════════════════════════════════"
