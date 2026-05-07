# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

No build step required. Open `index.html` directly in a browser, or serve it with any static file server:

```bash
python -m http.server 8080
# then visit http://localhost:8080
```

## Architecture

SeqAnalyst is a single-page, zero-dependency web app for DNA sequence analysis. All logic lives in `script.js`; `index.html` is purely the UI shell.

### Analysis Pipeline (`script.js`)

`parentFunc()` is the entry point (called by the Analyze button) and orchestrates this pipeline:

1. **Input validation** — rejects empty input and non-ATCG characters
2. **`dnaToRna(dna)`** — transcribes DNA → RNA using base-pair rules (A→U, T→A, C→G, G→C)
3. **Start codon detection** — scans RNA for first AUG; aborts if not found
4. **`splitCodons(rna)`** — splits RNA from AUG into 3-nucleotide codons; warns on leftover nucleotides
5. **`codonsToProtein(codons)`** — translates codons using the full 64-entry standard genetic code table, stopping at UAA/UAG/UGA

Each intermediate result (RNA sequence, codons, protein chain) is displayed in the `#results` div.
