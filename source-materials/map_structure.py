# -*- coding: utf-8 -*-
"""Map book structure: units, lessons, activities, exercises, assessments."""
import re
import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE, "DigitalSkills10.txt"), encoding="utf-8") as f:
    text = f.read()

parts = re.split(r"===== PAGE (\d+) =====", text)
page_map = {}
for i in range(1, len(parts), 2):
    page_map[int(parts[i])] = parts[i + 1]

out_lines = []
out_lines.append(f"TOTAL PAGES: {len(page_map)}")

# Collect structural markers
markers = []
for p in sorted(page_map):
    content = page_map[p]
    for ln in content.split("\n"):
        s = ln.strip()
        if not s or len(s) > 150:
            continue
        cleaned = s.replace("Խ", "").replace("�", "").replace("ҙ", "")
        if re.search(r"(الوحدة|الدرس|نشاط|تدريب|تقويم|مشروع|ورقة عمل|المطلوب|تمرين|خلاصة|ملخص الوحدة|مقـدمـة|مقدمـة|تحدي|مسابقة|افكار|أفكار|قـضيـة|قضية)", cleaned):
            markers.append((p, cleaned))

for p, s in markers:
    out_lines.append(f"P{p:03d}: {s}")

# Also dump first ~40 chars of each page to see print numbers and titles
out_lines.append("\n===== PAGE HEADS =====")
for p in sorted(page_map):
    content = page_map[p].strip()
    head = " | ".join([x.strip() for x in content.split("\n")[:4] if x.strip()])
    out_lines.append(f"P{p:03d}: {head[:160]}")

with open(os.path.join(BASE, "structure_map.txt"), "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))

print(f"Wrote structure_map.txt with {len(markers)} markers")
