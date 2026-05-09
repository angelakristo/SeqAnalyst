# SeqAnalyst

SeqAnalyst is an educational bioinformatics web application for analyzing DNA sequences.

The app helps users understand the basic biological process:

DNA → RNA → Codons → Protein

It is built as a beginner-friendly sequence analysis tool, with plans to grow into a personal bioinformatics notebook.

## Features

- DNA sequence input
- DNA input validation
- Coding strand and template strand modes
- DNA to RNA transcription
- Codon splitting
- Stop codon detection
- Protein translation using a standard codon table
- Reading frame selection
- GC content calculation
- Base distribution statistics
- Visual codon-to-amino-acid mapping
- Color-coded DNA and RNA bases
- Load example sequence
- Copy-to-clipboard buttons

## How it works

1. The user enters a DNA sequence.
2. The app validates the sequence.
3. The DNA is transcribed into RNA.
4. The RNA is split into codons.
5. Codons are translated into a protein sequence.
6. The app displays sequence statistics such as GC content and base distribution.

## Strand modes

SeqAnalyst supports two strand modes:

- **Coding strand**: RNA is created by replacing `T` with `U`.
- **Template strand**: RNA is created using complementary base pairing.

This helps users understand the difference between coding/sense and template/antisense DNA strands.

## Reading frames

The app supports three reading frames. Frame 1 searches the RNA for the first `AUG` start codon and begins reading codons from there. Frames 2 and 3 skip start codon detection entirely and begin reading at fixed offsets — position 1 and position 2 in the RNA respectively — showing how a shift in starting position produces a completely different set of codons and protein sequence.

## Tech Stack

- HTML
- CSS
- JavaScript

## How to run locally

No build step is required.

1. Clone the repository.
2. Open the project folder.
3. Open `index.html` in a browser.

Recommended:

Use the **Live Server** extension in VS Code for a better development experience.

## Planned next steps

- Add Supabase authentication
- Save user analyses
- Organize saved analyses into projects
- Add notes for each analysis
- Add a built-in example sequence library
- Turn SeqAnalyst into a personal bioinformatics notebook

## Why I built this

I built SeqAnalyst as my web development project because I'm interested in biology, programming, and bioinformatics. SeqAnalyst is where those interests meet.
