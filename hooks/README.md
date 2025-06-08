# Git Hooks

This directory contains git hooks for the personal blog project.

## Available Hooks

### pre-commit
Automatically manages timestamps in blog posts:
- **New posts**: Sets `pubDatetime` to current timestamp
- **Modified posts**: Updates `modDatetime` while preserving original `pubDatetime`
- **Format**: Uses ISO 8601 format (`YYYY-MM-DDTHH:MM:SSZ`)
- **Scope**: Only processes `.md` files in `src/content/blog/` directory

## Installation

### Automatic Installation
Run the install script to set up all hooks:
```bash
./hooks/install-hooks.sh
```

### Manual Installation
Copy individual hooks to `.git/hooks/` and make them executable:
```bash
cp hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Usage

Once installed, hooks run automatically:

### New Blog Post
```bash
# Create new blog post (without timestamps)
echo "---" > src/content/blog/my-post.md
echo "title: My New Post" >> src/content/blog/my-post.md
echo "---" >> src/content/blog/my-post.md

git add src/content/blog/my-post.md
git commit -m "Add new blog post"
# Hook automatically adds pubDatetime
```

### Updating Existing Post
```bash
# Modify existing post
git add src/content/blog/existing-post.md
git commit -m "Update blog post"
# Hook automatically updates modDatetime
```

## Development

To modify hooks:
1. Edit files in this `hooks/` directory
2. Run `./hooks/install-hooks.sh` to update the git hooks
3. Commit changes to version control

## Notes

- Hooks are project-specific and need to be installed by each contributor
- The `hooks/` directory is version controlled, but `.git/hooks/` is not
- Always test hooks thoroughly before committing important changes