#!/bin/bash
# Blog post creation script for Claude automation
# Usage: ./blog-create.sh "title" "content" [author] [tags] [status]

set -e

TITLE="$1"
CONTENT="$2"
AUTHOR="${3:-Dytto Team}"
TAGS="${4:-development,update}"
STATUS="${5:-published}"

if [[ -z "$TITLE" || -z "$CONTENT" ]]; then
    echo "Usage: $0 <title> <content> [author] [tags] [status]"
    echo "Example: $0 'My Blog Post' '# Hello World\n\nThis is content' 'Claude' 'ai,automation' 'published'"
    exit 1
fi

# Find and load environment variables
ENV_PATHS=(
    "./.env"
    "./.env.local"
    "../.env"
    "$HOME/.env"
    "/home/project/.env"
)

for env_path in "${ENV_PATHS[@]}"; do
    if [[ -f "$env_path" ]]; then
        source "$env_path"
        echo "Loaded environment from: $env_path"
        break
    fi
done

if [[ -z "$VITE_SUPABASE_URL" || -z "$SUPABASE_SERVICE_ROLE_KEY" ]]; then
    echo "Error: Supabase credentials not found"
    echo "Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

# Convert tags string to JSON array
IFS=',' read -ra TAG_ARRAY <<< "$TAGS"
TAG_JSON="["
for i in "${!TAG_ARRAY[@]}"; do
    if [[ $i -gt 0 ]]; then
        TAG_JSON+=","
    fi
    TAG_JSON+="\"${TAG_ARRAY[$i]}\""
done
TAG_JSON+="]"

# Generate slug from title
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g' | sed 's/ /-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')

# Create blog post via direct Supabase API
RESPONSE=$(curl -s -X POST \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    -d "{
        \"title\": \"$TITLE\",
        \"slug\": \"$SLUG\",
        \"content\": \"$CONTENT\",
        \"author\": \"$AUTHOR\",
        \"tags\": $TAG_JSON,
        \"status\": \"$STATUS\"
    }" \
    "$VITE_SUPABASE_URL/rest/v1/blog_posts")

# Check for errors
if echo "$RESPONSE" | grep -q '"code"'; then
    echo "Error creating blog post:"
    echo "$RESPONSE" | jq -r '.message // .error_description // .'
    exit 1
fi

# Extract post information
POST_ID=$(echo "$RESPONSE" | jq -r '.[0].id // .id // empty')
POST_SLUG=$(echo "$RESPONSE" | jq -r '.[0].slug // .slug // empty')

if [[ -n "$POST_ID" && -n "$POST_SLUG" ]]; then
    echo "✅ Blog post created successfully!"
    echo "📝 Title: $TITLE"
    echo "🔗 Slug: $POST_SLUG"
    echo "👤 Author: $AUTHOR"
    echo "🏷️  Tags: $TAGS"
    echo "📊 Status: $STATUS"
    echo "🌐 URL: https://dytto.app/blog/$POST_SLUG"
    echo "🆔 ID: $POST_ID"
else
    echo "Error: Could not extract post information"
    echo "Response: $RESPONSE"
    exit 1
fi