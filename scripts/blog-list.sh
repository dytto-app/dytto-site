#!/bin/bash
# Blog post listing script for Claude automation
# Usage: ./blog-list.sh [limit] [status] [search]

set -e

LIMIT="${1:-10}"
STATUS="${2:-published}"
SEARCH="$3"

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

# Build query parameters
QUERY="select=id,title,slug,excerpt,author,tags,status,published_at,created_at&limit=$LIMIT"

if [[ -n "$STATUS" ]]; then
    QUERY+="&status=eq.$STATUS"
fi

if [[ -n "$SEARCH" ]]; then
    QUERY+="&or=(title.ilike.*$SEARCH*,content.ilike.*$SEARCH*,excerpt.ilike.*$SEARCH*)"
fi

QUERY+="&order=published_at.desc,created_at.desc"

# Get blog posts
RESPONSE=$(curl -s -X GET \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    "$VITE_SUPABASE_URL/rest/v1/blog_posts?$QUERY")

# Check for errors
if echo "$RESPONSE" | grep -q '"code"'; then
    echo "Error fetching blog posts:"
    echo "$RESPONSE" | jq -r '.message // .error_description // .'
    exit 1
fi

# Display results
POST_COUNT=$(echo "$RESPONSE" | jq length)
echo "📚 Found $POST_COUNT blog posts"
echo "==========================================="

echo "$RESPONSE" | jq -r '.[] | "
📝 \(.title)
🔗 Slug: \(.slug)
👤 Author: \(.author)
📊 Status: \(.status)
🏷️  Tags: \(.tags | join(", "))
📅 Published: \(.published_at // "Not published")
🆔 ID: \(.id)
🌐 URL: https://dytto.app/blog/\(.slug)
---"'