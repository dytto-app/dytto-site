#!/bin/bash
# Blog post deletion script for Claude automation
# Usage: ./blog-delete.sh "post-id-or-slug"

set -e

POST_IDENTIFIER="$1"

if [[ -z "$POST_IDENTIFIER" ]]; then
    echo "Usage: $0 <post-id-or-slug>"
    echo "Example: $0 'my-post-slug' or $0 '123e4567-e89b-12d3-a456-426614174000'"
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
        break
    fi
done

if [[ -z "$VITE_SUPABASE_URL" || -z "$SUPABASE_SERVICE_ROLE_KEY" ]]; then
    echo "Error: Supabase credentials not found"
    exit 1
fi

# Determine if identifier is UUID or slug
if [[ "$POST_IDENTIFIER" =~ ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ ]]; then
    FILTER="id=eq.$POST_IDENTIFIER"
else
    FILTER="slug=eq.$POST_IDENTIFIER"
fi

# First, get the post details for confirmation
POST_INFO=$(curl -s -X GET \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    "$VITE_SUPABASE_URL/rest/v1/blog_posts?select=title,slug&$FILTER")

if [[ "$POST_INFO" == "[]" ]]; then
    echo "Error: Blog post not found with identifier: $POST_IDENTIFIER"
    exit 1
fi

POST_TITLE=$(echo "$POST_INFO" | jq -r '.[0].title')
POST_SLUG=$(echo "$POST_INFO" | jq -r '.[0].slug')

echo "⚠️  About to delete blog post:"
echo "📝 Title: $POST_TITLE"
echo "🔗 Slug: $POST_SLUG"

# Delete the post
RESPONSE=$(curl -s -X DELETE \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    "$VITE_SUPABASE_URL/rest/v1/blog_posts?$FILTER")

# Check for errors
if echo "$RESPONSE" | grep -q '"code"'; then
    echo "Error deleting blog post:"
    echo "$RESPONSE" | jq -r '.message // .error_description // .'
    exit 1
fi

echo "✅ Blog post deleted successfully!"
echo "📝 Deleted: $POST_TITLE"