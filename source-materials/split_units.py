# -*- coding: utf-8 -*-
"""Split book into per-unit cleaned text files and a cleaned full text."""
import re
import os
import json

BASE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE, "DigitalSkills10.txt"), encoding="utf-8") as f:
    raw = f.read()

parts = re.split(r"===== PAGE (\d+) =====", raw)
pages = {}
for i in range(1, len(parts), 2):
    pages[int(parts[i])] = parts[i + 1]


def clean(text: str) -> str:
    # Remove replacement / legacy glyphs while keeping Arabic content
    text = text.replace("\ufffd", "")
    text = text.replace("Խ", "")
    text = text.replace("ҙ", "")
    text = text.replace("�", "")
    # Normalize tatweel-heavy spaced words lightly
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


RANGES = {
    "unit1_data_science": (6, 39),
    "unit2_python": (40, 81),
    "unit3_digital_citizenship": (82, 116),
    "unit4_robotics": (117, 152),
    "front_matter": (1, 5),
}

manifest = {}
for name, (a, b) in RANGES.items():
    chunks = []
    for p in range(a, b + 1):
        chunks.append(f"\n\n===== PAGE {p} =====\n" + clean(pages.get(p, "")))
    content = "".join(chunks)
    path = os.path.join(BASE, f"{name}.txt")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    manifest[name] = {"pages": [a, b], "chars": len(content), "file": f"{name}.txt"}

# Clean full text
full = []
for p in sorted(pages):
    full.append(f"\n\n===== PAGE {p} =====\n" + clean(pages[p]))
with open(os.path.join(BASE, "DigitalSkills10_clean.txt"), "w", encoding="utf-8") as f:
    f.write("".join(full))

with open(os.path.join(BASE, "units_manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print(json.dumps(manifest, ensure_ascii=False, indent=2))
