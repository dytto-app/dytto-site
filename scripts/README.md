# Blog Management Scripts for Claude Automation

These bash scripts allow Claude (or any automation tool) to manage your Dytto blog via API calls.

## Prerequisites

1. **Environment Variables**: Create a `.env` file with:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Dependencies**: Ensure `jq` and `curl` are installed:
   ```bash
   # On Ubuntu/Debian
   sudo apt install jq curl
   
   # On macOS
   brew install jq curl
   ```

3. **Permissions**: Make scripts executable:
   ```bash
   chmod +x scripts/*.sh
   ```

## Available Scripts

### 1. Create Blog Post
```bash
./scripts/blog-create.sh "Post Title" "# Content in Markdown" [author] [tags] [status]
```

**Examples:**
```bash
# Basic post
./scripts/blog-create.sh "Hello World" "# Hello World\n\nThis is my first post!"

# With all options
./scripts/blog-create.sh "Advanced Tutorial" "# Advanced Tutorial\n\nDetailed content here..." "Claude AI" "tutorial,advanced,ai" "published"

# Draft post
./scripts/blog-create.sh "Work in Progress" "# Draft Content" "Author" "draft,wip" "draft"
```

### 2. Update Blog Post
```bash
./scripts/blog-update.sh "post-slug-or-id" "field=value" [field=value...]
```

**Examples:**
```bash
# Update title and status
./scripts/blog-update.sh "hello-world" "title=Hello Universe" "status=published"

# Update content and tags
./scripts/blog-update.sh "my-post-id" "content=# Updated Content\n\nNew information here" "tags=updated,new,info"

# Change author
./scripts/blog-update.sh "tutorial-post" "author=Claude AI Assistant"
```

### 3. List Blog Posts
```bash
./scripts/blog-list.sh [limit] [status] [search]
```

**Examples:**
```bash
# List all published posts (default)
./scripts/blog-list.sh

# List 5 draft posts
./scripts/blog-list.sh 5 draft

# Search for posts containing "tutorial"
./scripts/blog-list.sh 10 published tutorial

# List all posts regardless of status
./scripts/blog-list.sh 20 ""
```

### 4. Get Single Blog Post
```bash
./scripts/blog-get.sh "post-slug-or-id"
```

**Examples:**
```bash
# Get by slug
./scripts/blog-get.sh "hello-world"

# Get by ID
./scripts/blog-get.sh "123e4567-e89b-12d3-a456-426614174000"

# Get the new blog post about journaling for mental health
./scripts/blog-get.sh "journaling-for-mental-health-ai-changes-everything"
```

### 5. Delete Blog Post
```bash
./scripts/blog-delete.sh "post-slug-or-id"
```

**Examples:**
```bash
# Delete by slug
./scripts/blog-delete.sh "old-post"

# Delete by ID
./scripts/blog-delete.sh "123e4567-e89b-12d3-a456-426614174000"
```

## Field Reference

### Blog Post Fields
- **title**: Post title (required, 3-200 characters)
- **content**: Full post content in Markdown (required)
- **author**: Author name (default: "Dytto Team")
- **tags**: Comma-separated tags (e.g., "ai,tutorial,development")
- **status**: Post status ("draft", "published", "archived")
- **excerpt**: Short description (optional, max 500 characters)
- **slug**: URL-friendly identifier (auto-generated from title if not provided)

### Status Values
- **draft**: Not visible to public, work in progress
- **published**: Live and visible on the blog
- **archived**: Hidden but preserved

## Claude Automation Examples

### Daily Development Update
```bash
#!/bin/bash
# Daily dev update automation

DATE=$(date +"%Y-%m-%d")
CONTENT="# Development Update - $DATE

## What We Built Today
- Feature improvements
- Bug fixes
- Performance optimizations

## Coming Tomorrow
- New API endpoints
- UI enhancements

Stay tuned for more updates!"

./scripts/blog-create.sh "Dev Update $DATE" "$CONTENT" "Claude AI" "development,daily-update" "published"
```

### Weekly Feature Announcement
```bash
#!/bin/bash
# Weekly feature announcement

FEATURE_NAME="$1"
DESCRIPTION="$2"

CONTENT="# Introducing: $FEATURE_NAME

$DESCRIPTION

## How to Use
[Instructions here]

## What's Next
We're continuing to improve and add more features based on your feedback.

Try it out and let us know what you think!"

./scripts/blog-create.sh "New Feature: $FEATURE_NAME" "$CONTENT" "Dytto Team" "features,announcement" "published"
```

### Content Management
```bash
#!/bin/bash
# Bulk content management

# List all draft posts
echo "📝 Draft Posts:"
./scripts/blog-list.sh 50 draft

# Publish all posts tagged with "ready"
# (This would require additional scripting to parse and update)
```

## Error Handling

All scripts include:
- ✅ Environment variable validation
- ✅ Input parameter validation
- ✅ API error checking
- ✅ Detailed success/error messages
- ✅ Proper exit codes for automation

## Security Notes

- Scripts use the **service role key** for full database access
- Keep your `.env` file secure and never commit it to version control
- Consider using environment-specific keys for different deployments
- All API calls are made over HTTPS

## Integration with Claude

These scripts are designed to be easily called by Claude or other AI assistants:

1. **Simple Commands**: Each script has a clear, single purpose
2. **Consistent Output**: Structured output for easy parsing
3. **Error Handling**: Clear error messages for troubleshooting
4. **Flexible Input**: Support for both IDs and slugs where applicable

Claude can now manage your blog by calling these scripts with appropriate parameters!