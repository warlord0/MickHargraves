#!/bin/bash

BASE_DIR="/mnt/data/Documents/Black Eyes and Broken Souls"
WORKING_DIR="${BASE_DIR}/tmp"
ODT_FILENAME="Black Eyes and Broken Souls.odt"
OUTPUT_FILENAME="black_eyes.txt"
SCRIPT_NAME="markdown_splitter.py"

# Make sure the working directory exists
mkdir -p "$WORKING_DIR"

# Convert the file using pandoc
cd "$BASE_DIR"
echo "Converting ODT to text..."
docker run --rm \
  --volume ".:/data" \
  --user $(id -u):$(id -g) \
  pandoc/latex \
  "$ODT_FILENAME" \
  -o "$OUTPUT_FILENAME"

# Check if conversion was successful
if [ ! -f "$OUTPUT_FILENAME" ]; then
  echo "Error: Conversion failed! Check if the ODT file exists."
  exit 1
fi

# Move the output file to tmp directory
echo "Moving output to working directory..."
mv "$OUTPUT_FILENAME" "$WORKING_DIR/"
cd "$WORKING_DIR"

# Clean up and split
echo "Creating chapter files..."
rm -rf black_eyes_chapters
mkdir -p black_eyes_chapters

# Run the splitter script
echo "Splitting chapters..."
"$BASE_DIR/scripts/$SCRIPT_NAME" --output_dir black_eyes_chapters "$OUTPUT_FILENAME"

# Check if splitting was successful
if [ $? -eq 0 ]; then
  echo "Extraction completed successfully."
  echo "Output files are in: $WORKING_DIR/black_eyes_chapters/"
else
  echo "Error: Splitting failed!"
  exit 1
fi
