#!/bin/bash
# Blog post update script for Claude automation
# Usage: ./blog-update.sh "post-id-or-slug" "field=value" [field=value...]

set -e

POST_IDENTIFIER="$1"
shift

if [[ -z "$POST_IDENTIFIER" || $# -eq 0 ]]; then
    echo "Usage: $0 <post-id-or-slug> <field=value> [field=value...]"
    echo "Fields: title, content, author, tags, status, excerpt"
    echo "Example: $0 'my-post-slug' 'title=Updated Title' 'status=published'"
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

# Build JSON update object
UPDATE_JSON="{"
FIRST=true

for arg in "$@"; do
    if [[ "$arg" =~ ^([^=]+)=(.*)$ ]]; then
        FIELD="${BASH_REMATCH[1]}"
        VALUE="${BASH_REMATCH[2]}"
        
        if [[ "$FIRST" == "false" ]]; then
            UPDATE_JSON+=","
        fi
        FIRST=false
        
        # Handle special fields
        if [[ "$FIELD" == "tags" ]]; then
            # Convert comma-separated tags to JSON array
            IFS=',' read -ra TAG_ARRAY <<< "$VALUE"
            TAG_JSON="["
            for i in "${!TAG_ARRAY[@]}"; do
                if [[ $i -gt 0 ]]; then
                    TAG_JSON+=","
                fi
                TAG_JSON+="\"${TAG_ARRAY[$i]}\""
            done
            TAG_JSON+="]"
            UPDATE_JSON+="\"$FIELD\": $TAG_JSON"
        else
            UPDATE_JSON+="\"$FIELD\": \"$VALUE\""
        fi
    fi
done

UPDATE_JSON+="}"

# Determine if identifier is UUID or slug
if [[ "$POST_IDENTIFIER" =~ ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$ ]]; then
    FILTER="id=eq.$POST_IDENTIFIER"
else
    FILTER="slug=eq.$POST_IDENTIFIER"
fi

# Update blog post
RESPONSE=$(curl -s -X PATCH \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" \
    -d "$UPDATE_JSON" \
    "$VITE_SUPABASE_URL/rest/v1/blog_posts?$FILTER")

# Check for errors
if echo "$RESPONSE" | grep -q '"code"'; then
    echo "Error updating blog post:"
    echo "$RESPONSE" | jq -r '.message // .error_description // .'
    exit 1
fi

# Check if post was found and updated
if [[ "$RESPONSE" == "[]" ]]; then
    echo "Error: Blog post not found with identifier: $POST_IDENTIFIER"
    exit 1
fi

# Extract updated post information
POST_TITLE=$(echo "$RESPONSE" | jq -r '.[0].title // .title // empty')
POST_SLUG=$(echo "$RESPONSE" | jq -r '.[0].slug // .slug // empty')
POST_STATUS=$(echo "$RESPONSE" | jq -r '.[0].status // .status // empty')

echo "✅ Blog post updated successfully!"
echo "📝 Title: $POST_TITLE"
echo "🔗 Slug: $POST_SLUG"
echo "📊 Status: $POST_STATUS"
echo "🌐 URL: https://dytto.app/blog/$POST_SLUG"