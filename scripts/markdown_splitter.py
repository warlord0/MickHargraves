#!/bin/env python3

import argparse
import re
import os
from pathlib import Path


def normalize_quotes(text):
    """
    Replace escaped quotes with regular quotes.

    Args:
        text (str): Text containing escaped quotes
    Returns:
        str: Text with normalized quotes
    """
    text = text.replace(r"\"", '"')
    text = text.replace(r"\'", "'")
    return text


def clean_title(title):
    """
    Clean up chapter title by removing unwanted text and normalizing format.

    Args:
        title (str): Original chapter title
    Returns:
        str: Cleaned chapter title
    """
    # Remove any anchor tag completely - this matches []{#anchor-N} pattern
    title = re.sub(r"\[\]\{#anchor(?:-\d+)?\}", "", title)

    # Remove any stray "anchor" text
    title = re.sub(r"\banchor\b", "", title, flags=re.IGNORECASE)

    # Clean up any extra spaces
    title = " ".join(title.split())

    return title


def safe_filename(title):
    """
    Create a safe filename from a title.

    Args:
        title (str): Chapter title
    Returns:
        str: Safe filename component
    """
    # Remove any non-alphanumeric characters except spaces and hyphens
    safe_title = re.sub(r"[^\w\s-]", "", title).strip().lower()

    # Replace spaces and consecutive hyphens with a single hyphen
    safe_title = re.sub(r"[-\s]+", "-", safe_title)

    return safe_title


def clean_chapter_content(content, title):
    """
    Clean up chapter content by replacing the anchor header with a simple # title format.
    Also cleans any subheaders within the content.

    Args:
        content (str): Original chapter content
        title (str): Chapter title
    Returns:
        str: Cleaned chapter content
    """
    lines = content.strip().split("\n")

    # Set the main title
    if len(lines) > 0:
        lines[0] = f"# {title}"

    # Clean up all other header lines
    for i in range(1, len(lines)):
        if lines[i].startswith("#"):
            # Remove any []{#anchor-N} patterns from the header
            lines[i] = re.sub(r"\[\]\{#anchor(?:-\d+)?\}", "", lines[i])
            # Clean up any extra spaces that might have been left
            lines[i] = re.sub(r"\s+", " ", lines[i]).strip()

    return "\n".join(lines)


def split_markdown_chapters(input_file, output_dir=None):
    """Split a markdown file into separate files based on level 1 headings."""
    with open(input_file, "r", encoding="utf-8") as f:
        content = f.read()

    content = normalize_quotes(content)

    # Split on level 1 headers, but keep the delimiter
    chapters = re.split(r"(?m)(?=^# )", content.strip())

    # Skip the first split if it doesn't start with a chapter header
    if not chapters[0].startswith("# "):
        chapters = chapters[1:]

    chapters = [ch for ch in chapters if ch.strip()]

    # Use provided output directory or create one based on input filename
    if output_dir is None:
        output_dir = Path(input_file).stem + "_chapters"

    os.makedirs(output_dir, exist_ok=True)

    print(f"Found {len(chapters)} chapters")

    # Use sequential numbering
    for chapter_num, chapter in enumerate(chapters, 1):
        first_line = chapter.split("\n")[0]

        # Print the raw first line for debugging
        print(f"Chapter {chapter_num} raw title: '{first_line}'")

        # Get title by removing the header marker and all anchor tags
        raw_title = first_line.replace("# ", "")
        clean_chapter_title = clean_title(raw_title)

        print(f"  Cleaned to: '{clean_chapter_title}'")

        # Create safe filename
        filename_part = safe_filename(clean_chapter_title)

        print(f"  Filename: '{filename_part}'")

        filename = f"{chapter_num:02d}-{filename_part}.md"
        output_path = os.path.join(output_dir, filename)

        cleaned_content = clean_chapter_content(chapter, clean_chapter_title)

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(cleaned_content + "\n")

        print(f"Created: {filename}")


def main():
    parser = argparse.ArgumentParser(
        description="Split markdown file into chapters based on level 1 headings."
    )
    parser.add_argument("input_file", help="Path to the input markdown file")
    parser.add_argument("--output_dir", help="Custom output directory for chapters")
    args = parser.parse_args()

    if not os.path.exists(args.input_file):
        print(f"Error: File '{args.input_file}' not found.")
        return

    split_markdown_chapters(args.input_file, args.output_dir)


if __name__ == "__main__":
    main()
