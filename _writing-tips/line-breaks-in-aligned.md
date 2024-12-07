---
layout: single
title: |
    Formatting of <code>align</code> and <code>aligned</code> Environments
excerpt: 
# permalink: 
tags: latex equation
# source: 
draft: true
---
<!-- In Latex, the `align` and `aligned` envio -->
When writing a multiline expressions in LaTeX using `align` or `aligned` environments, use well-placed line breaks and alignment and proper spacing to improve readability.
The following example is an example of a poorly formatted equation:
{% include latex-example.html code=
"\begin{align}
    f(x) 
    &:= \sum (a + b + c) + \\
    & \iiint f(x + y + z) dx\, dy\, dz \\
    &+ x + y + z +  \sin\Big(x + y \\ 
    & - x^2 - y ^2 \Big) \\ 
\end{align}" %}

place line breaks before binary operators (is possible) and place `{}` after the line break and before the binary operator to achieve correct spacing.

{% include latex-example.html code=
"\begin{align}
    f(x) :={} & \sum (a + b + c) \\ 
    &{}+ \iiint f(x + y + z) dx\, dy\, dz \\
    &{}+ x + y + z \\
    &{}+ \sin\left(x + y - x^2 - y ^2 \right)
\end{align}" %}



### Example
```latex
\begin{align}
    f(x) &:= 
\end{align}
```