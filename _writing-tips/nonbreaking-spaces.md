---
layout: single
title: |
    Use Nonbreaking Spaces
excerpt: The character `~` should be used to prevent poorly-placed line breaks.
permalink: nonbreaking-spaces
tags: typesetting
---

In LaTeX, the character `~` inserts a non-breaking space. 
As a rule of thumb, use `~` in the following situations:
- between a number and its unit of measure: `1000~miles`, `183~billion`
- before each citation (e.g., `...as was shown by Smith~\cite{smith_2020}`)
- before the last word of a paragraph to prevent it from being placed on a line by itself, especially if the word is short.

To prevent line breaks in the middle of an equation, place curly brackets "`{...}`" around the equation. For example `${a \in A}$` will always be displayed on one line, whereas `${a^2 + b^2} = {c^2 + d^2}$` may have a line break at the equal sign but nowhere else.


