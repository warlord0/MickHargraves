#!/bin/bash

# Default values
BASE_DIR="${PWD##}"
SCRIPT_NAME="markdown_splitter.py"

# Help function
function show_help {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  -i, --input FILENAME     Input ODT filename (required)"
  echo "  -o, --output FILENAME    Output text filename (defaults to input name with .txt extension)"
  echo "  -w, --working-dir DIR    Working directory (defaults to BASE_DIR/tmp)"
  echo "  -n, --no-change-track    Disable change tracking"
  echo "  -h, --help               Show this help message"
  exit 1
}

# Parse command line arguments
CHANGE_TRACKING=true # Enable change tracking by default
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
  -i | --input)
    ODT_FILENAME="$2"
    shift 2
    ;;
  -o | --output)
    OUTPUT_FILENAME="$2"
    shift 2
    ;;
  -w | --working-dir)
    WORKING_DIR="$2"
    shift 2
    ;;
  -n | --no-change-track)
    CHANGE_TRACKING=false
    shift
    ;;
  -h | --help)
    show_help
    ;;
  *)
    echo "Unknown option: $1"
    show_help
    ;;
  esac
done

# Check if required parameters are provided
if [ -z "$ODT_FILENAME" ]; then
  echo "Error: Input ODT filename is required"
  show_help
fi

# Set default output filename based on input if not provided
if [ -z "$OUTPUT_FILENAME" ]; then
  OUTPUT_FILENAME="${ODT_FILENAME%.*}.txt"
fi

# Set default working directory if not provided
if [ -z "$WORKING_DIR" ]; then
  WORKING_DIR="${BASE_DIR}/tmp"
fi

# Extract the base name of the ODT file (without extension) for chapter directory
ODT_BASENAME=$(basename "${ODT_FILENAME%.*}")
CHAPTERS_DIR="${ODT_BASENAME}_chapters"

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

# Move the output file to working directory
echo "Moving output to working directory..."
mv "$OUTPUT_FILENAME" "$WORKING_DIR/"
cd "$WORKING_DIR"

# Create chapters directory if it doesn't exist
echo "Preparing chapter files directory..."
mkdir -p "$CHAPTERS_DIR"

# Set up change tracking arguments
CHANGE_TRACK_ARGS=""
if [ "$CHANGE_TRACKING" = false ]; then
  CHANGE_TRACK_ARGS="--no-change-check"
  echo "Change tracking disabled."
else
  echo "Change tracking enabled. Modified files will be identified."
fi

# Run the splitter script
echo "Splitting chapters..."
"$BASE_DIR/scripts/$SCRIPT_NAME" --output_dir "$CHAPTERS_DIR" $CHANGE_TRACK_ARGS "$OUTPUT_FILENAME"

# Check if splitting was successful
if [ $? -eq 0 ]; then
  echo "Extraction completed successfully."

  # Display change report location
  if [ "$CHANGE_TRACKING" = true ] && [ -f "$CHAPTERS_DIR/change_report.txt" ]; then
    echo "Change report available at: $WORKING_DIR/$CHAPTERS_DIR/change_report.txt"
    echo ""
    echo "=== CHANGE REPORT SUMMARY ==="
    grep -A 10 "Change Report" "$CHAPTERS_DIR/change_report.txt"
    echo "==========================="
  fi

  echo "Output files are in: $WORKING_DIR/$CHAPTERS_DIR/"
else
  echo "Error: Splitting failed!"
  exit 1
fi
