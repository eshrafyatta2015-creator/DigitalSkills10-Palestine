# -*- coding: utf-8 -*-
"""Extract text from book PDF and unit analysis PDF, preserving structure."""
import os
import sys
import json
import pymupdf

BASE = os.path.dirname(os.path.abspath(__file__))

def extract(pdf_path, out_txt, out_json):
    doc = pymupdf.open(pdf_path)
    pages = []
    with open(out_txt, "w", encoding="utf-8") as f:
        f.write(f"===== FILE: {os.path.basename(pdf_path)} | PAGES: {len(doc)} =====\n")
        for i, page in enumerate(doc):
            text = page.get_text("text")
            pages.append({"page": i + 1, "chars": len(text), "text": text})
            f.write(f"\n\n===== PAGE {i + 1} =====\n")
            f.write(text)
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(pages, f, ensure_ascii=False, indent=1)
    total_chars = sum(p["chars"] for p in pages)
    empty = sum(1 for p in pages if p["chars"] < 20)
    print(f"{os.path.basename(pdf_path)}: {len(doc)} pages, {total_chars} chars, {empty} near-empty pages")
    doc.close()
    return pages

if __name__ == "__main__":
    for name in os.listdir(BASE):
        if name.lower().endswith(".pdf") and not name.startswith("~"):
            pdf = os.path.join(BASE, name)
            stem = os.path.splitext(name)[0]
            # sanitize stem for filesystem
            stem_safe = "book" if "Digital" in name or "igital" in name else "analysis_unit1"
            if "DigitalSkills" in name:
                stem_safe = "DigitalSkills10"
            else:
                stem_safe = "analysis_unit1"
            try:
                extract(pdf, os.path.join(BASE, stem_safe + ".txt"), os.path.join(BASE, stem_safe + ".json"))
            except Exception as e:
                print(f"ERROR {name}: {e}")
