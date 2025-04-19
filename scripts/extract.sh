#!/bin/bash

BASE_DIR="/home/warlord/Documents/Demonology/"
WORKING_DIR="${BASE_DIR}/tmp"
ODT_FILENAME="Black Eyes and Broken Souls.odt"
OUTPUT_FILENAME="black_eyes.txt"

# Convert the file using pandoc
cd "$BASE_DIR"
docker run --rm \
  --volume ".:/data" \
  --user $(id -u):$(id -g) \
  pandoc/latex \
  "$ODT_FILENAME" \
  -o "$OUTPUT_FILENAME"

# Move the output file to tmp directory
cd "$WORKING_DIR"
mv "../$OUTPUT_FILENAME" .

# Clean up and split
rm -f black_eyes_chapters/*.md
mkdir -p black_eyes_chapters
../scripts/markdown_splitter.py --output_dir black_eyes_chapters "$OUTPUT_FILENAME"
