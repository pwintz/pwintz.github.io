---
layout: single
title: |
    Use Precise References to Locations in Documents
excerpt: 
permalink: permalink/precise-references
tags: references links citations
---
LaTeX is a powerful tool for cross-referencing. 

Use it. 

Instead of saying, "In a later section...", "In the next section...", or "Below...", say, "In Section 4...". 
This allows readers to quickly pinpoint the thing you are referencing. 
If you have TeX configured correctly (using `hyperref`), then references will automatically include a internal link to the given place in the document, allowing readers to immediately jump there. 

This advice also applies when citing other works. 
If a citation is, say, an entire book, then the reader must spend time searching through it to find what you were talking about. 
When citing in TeX, the `\cite` macro has an optional argument for giving a locator. 
For example, to cite Theorem 3.4 in `khalil_nonlinear_2014`, use `\cite[Theorem 3.4]{khalil_nonlinear_2014}`.

## Some examples 
- "Results presented in the next section..." $$\implies$$ "Lemma 3 in Section 4..." 
- "In the above inequality..." $$\implies$$ "In inequality (4)..."
- "This theorem is given by Kahlil in [4]" $$\implies$$ "This theorem is given by Kahlil in [Theorem 3.4, 4]".

