#!/bin/bash

# This script converts filenames with spaces to properly formatted slugs 
# in Docusaurus and updates internal links to match

# Define the docs directory
DOCS_DIR="docs/lore"

# Create a mapping file for reference
echo "Creating filename to slug mapping..."
MAPPING_FILE="filename-slug-map.txt"
> $MAPPING_FILE

# Function to convert a filename to a slug
# Converts to lowercase, replaces spaces with hyphens, removes special chars
function filename_to_slug() {
  local filename="$1"
  local basename=$(basename "$filename" .md)
  local slug=$(echo "$basename" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')
  echo "$slug"
}

# First, let's rename the files and create our mapping
find "$DOCS_DIR" -name "*.md" | while read -r file; do
  filename=$(basename "$file")
  filename_without_ext="${filename%.md}"
  
  # Create the slug
  slug=$(filename_to_slug "$filename")
  
  # Add frontmatter with slug if needed
  if ! grep -q "^---" "$file"; then
    # File doesn't have frontmatter, add it
    temp_file=$(mktemp)
    echo "---" > "$temp_file"
    echo "slug: $slug" >> "$temp_file"
    echo "---" >> "$temp_file"
    cat "$file" >> "$temp_file"
    mv "$temp_file" "$file"
  elif ! grep -q "slug:" "$file"; then
    # File has frontmatter but no slug
    temp_file=$(mktemp)
    sed -n '1p' "$file" > "$temp_file"  # Copy first line (---)
    echo "slug: $slug" >> "$temp_file"  # Add slug
    sed '1d' "$file" >> "$temp_file"    # Copy rest of file
    mv "$temp_file" "$file"
  fi
  
  # Add to our mapping file
  echo "$filename_without_ext → $slug" >> $MAPPING_FILE
done

echo "Filename to slug mapping complete. See $MAPPING_FILE for reference."

# Now update internal links in all markdown files
echo "Updating internal links in markdown files..."

# Process each markdown file to update links
find "$DOCS_DIR" -name "*.md" | while read -r file; do
  temp_file=$(mktemp)
  
  # Process the file line by line
  while IFS= read -r line; do
    # Check if line contains a markdown link
    if [[ "$line" =~ \[.*\]\(.*\) ]]; then
      # Extract all links from the line
      while [[ "$line" =~ \[([^\[\]]*)\]\(([^\(\)]*)\) ]]; do
        link_text="${BASH_REMATCH[1]}"
        link_target="${BASH_REMATCH[2]}"
        
        # If it's an internal link to an .md file
        if [[ "$link_target" == *.md ]] || [[ "$link_target" == *.md#* ]]; then
          # Split into filename and anchor if there's a #
          if [[ "$link_target" == *#* ]]; then
            filename="${link_target%%#*}"
            anchor="${link_target#*#}"
          else
            filename="$link_target"
            anchor=""
          fi
          
          # Get basename without .md extension
          basename=$(basename "$filename" .md)
          
          # Convert to slug
          slug=$(filename_to_slug "$basename")
          
          # Reconstruct the link
          if [[ -n "$anchor" ]]; then
            new_link="[$link_text](/$slug#$anchor)"
          else
            new_link="[$link_text](/$slug)"
          fi
          
          # Replace the link in the line
          replacement="${line%%\[${link_text}\]\(${link_target}\)*}${new_link}${line#*\[${link_text}\]\(${link_target}\)}"
          line="$replacement"
        fi
      done
    fi
    
    # Write the processed line
    echo "$line" >> "$temp_file"
  done < "$file"
  
  # Replace the original file
  mv "$temp_file" "$file"
done

echo "Internal links updated successfully."
echo "Remember to update your sidebar.js file to use the slugs instead of filenames."