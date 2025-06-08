#!/bin/bash

# Script to install git hooks from the hooks directory
# Run this script to set up the git hooks for this project

HOOKS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GIT_HOOKS_DIR="$(git rev-parse --git-dir)/hooks"

echo "Installing git hooks..."

# Copy all hooks from the hooks directory to .git/hooks
for hook in "$HOOKS_DIR"/*; do
    # Skip this install script
    [[ "$(basename "$hook")" == "install-hooks.sh" ]] && continue
    [[ "$(basename "$hook")" == "README.md" ]] && continue
    
    # Only process files, not directories
    [[ -f "$hook" ]] || continue
    
    hook_name="$(basename "$hook")"
    target="$GIT_HOOKS_DIR/$hook_name"
    
    echo "Installing $hook_name..."
    cp "$hook" "$target"
    chmod +x "$target"
done

echo "Git hooks installed successfully!"
echo ""
echo "Installed hooks:"
ls -la "$GIT_HOOKS_DIR" | grep -v sample | grep -E '^-.*x.*'