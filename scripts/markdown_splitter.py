#!/bin/env python3

import argparse
import re
import os
import hashlib
import json
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


def calculate_sha256(content):
    """
    Calculate the SHA-256 hash of a string.

    Args:
        content (str): Content to hash
    Returns:
        str: SHA-256 hash as a hex string
    """
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def load_previous_hashes(output_dir):
    """
    Load previous file hashes from hash reference file.

    Args:
        output_dir (str): Directory containing the hash file
    Returns:
        dict: Dictionary of filename to hash mappings
    """
    hash_file = os.path.join(output_dir, "chapter_hashes.json")
    if os.path.exists(hash_file):
        with open(hash_file, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                print("Warning: Invalid hash file format. Creating new hash file.")
                return {}
    return {}


def save_hashes(output_dir, hash_dict):
    """
    Save chapter file hashes to a reference file.

    Args:
        output_dir (str): Directory to save the hash file
        hash_dict (dict): Dictionary of filename to hash mappings
    """
    hash_file = os.path.join(output_dir, "chapter_hashes.json")
    with open(hash_file, "w", encoding="utf-8") as f:
        json.dump(hash_dict, f, indent=2)


def split_markdown_chapters(input_file, output_dir=None, check_changes=True):
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

    # Load previous hashes if checking for changes
    previous_hashes = {}
    if check_changes:
        previous_hashes = load_previous_hashes(output_dir)

    # Store current hashes
    current_hashes = {}
    changed_files = []
    new_files = []

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

        # Calculate content hash
        content_hash = calculate_sha256(cleaned_content)
        current_hashes[filename] = content_hash

        # Check if file is new or changed
        if filename not in previous_hashes:
            new_files.append(filename)
        elif previous_hashes[filename] != content_hash:
            changed_files.append(filename)

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(cleaned_content + "\n")

        print(f"Created: {filename}")

    # Save the current hashes to the hash file
    save_hashes(output_dir, current_hashes)

    # Create a report on changed files
    change_report_path = os.path.join(output_dir, "change_report.txt")
    with open(change_report_path, "w", encoding="utf-8") as f:
        f.write(f"Change Report - {Path(input_file).name}\n")
        f.write("=" * 40 + "\n\n")

        f.write(f"Total chapters: {len(chapters)}\n")
        f.write(f"New files: {len(new_files)}\n")
        f.write(f"Changed files: {len(changed_files)}\n")
        f.write(
            f"Unchanged files: {len(chapters) - len(new_files) - len(changed_files)}\n\n"
        )

        if new_files:
            f.write("NEW FILES:\n")
            for file in new_files:
                f.write(f"  {file}\n")
            f.write("\n")

        if changed_files:
            f.write("CHANGED FILES:\n")
            for file in changed_files:
                f.write(f"  {file}\n")

    # Output a summary to the console
    print("\nCHANGE SUMMARY:")
    print(f"Total chapters: {len(chapters)}")
    print(f"New files: {len(new_files)}")
    print(f"Changed files: {len(changed_files)}")
    print(f"Unchanged files: {len(chapters) - len(new_files) - len(changed_files)}")

    if new_files:
        print("\nNEW FILES:")
        for file in new_files:
            print(f"  {file}")

    if changed_files:
        print("\nCHANGED FILES:")
        for file in changed_files:
            print(f"  {file}")

    print(f"\nDetailed change report saved to: {change_report_path}")

    # Return the set of changed file paths for other scripts to use
    return {
        "changed": changed_files,
        "new": new_files,
        "all_files": list(current_hashes.keys()),
    }


def main():
    parser = argparse.ArgumentParser(
        description="Split markdown file into chapters based on level 1 headings."
    )
    parser.add_argument("input_file", help="Path to the input markdown file")
    parser.add_argument("--output_dir", help="Custom output directory for chapters")
    parser.add_argument(
        "--no-change-check",
        action="store_true",
        help="Disable checking for file changes",
    )
    args = parser.parse_args()

    if not os.path.exists(args.input_file):
        print(f"Error: File '{args.input_file}' not found.")
        return

    split_markdown_chapters(args.input_file, args.output_dir, not args.no_change_check)


if __name__ == "__main__":
    main()
