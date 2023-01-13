---
layout: single
title: My LaTeX Macros
category: mathematical-writing
tags: LaTeX macros
toc: true
---

This document describes LaTeX commands that I have developed over the years. These commands allow me to save time while typesetting documents.
 
# Text Commands

## `\midand` and `\midor`
For display-style equations that contains a list of equations, I found it tedious to write `\quad \text{and} \quad` before the last item in the list. Instead, I defined a `\midand` macro. 
```
x \geq -1 \midand x \leq 1
```

$$ x \geq -1 \quad \text{and} \quad x \leq 1.$$

Similarly, 

```
x \leq -1 \midor x \geq 1
```

$$ x \leq -1 \quad \text{or} \quad x \geq 1.$$

The code to define these commands are 
```
\newcommand{\midand}{\quad \textup{and}\quad}%
\newcommand{\midor}{\quad \textup{or}\quad}%
```
