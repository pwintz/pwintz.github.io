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
{% include latex-example.html code_displayed=
"\begin{align}
    f(x) 
    &:= \sum (a + b + c) + \\
    & \iiint f(x + y + z) dx\, dy\, dz \\
    &- x + y + z +  \sin\Big(x + y \\ 
    &+ x^2 - y^2 \Big) \\ 
\end{align}"
code=
"\begin{align}
    f(x) 
    &:= \sum (a + b + c) + \label{eq:operator at end} \\
    & \iiint f(x + y + z) dx\, dy\, dz \label{eq:not aligned with rhs of equal sign}\\
    &- x + y + z +  \sin\Big(x + y \label{eq:plus sign with unary operator spacing}\\ 
    &+ x^2 - y^2 \Big) \label{eq:line break in middle of parentheses} \\ 
\end{align}"
%}
The above snippet contains the following formatting errors:

- In (\ref{eq:operator at end}), the addition symbol is placed at the end of the line, instead of after the line break. Although this is a matter of taste, I prefer placing plus and minus signs (and other binary operators) so that they are all aligned, allowing the reader to easily identify, for example, if all of the terms are added or if, instead, some terms are subtracted.

- In (\ref{eq:not aligned with rhs of equal sign})-(\ref{eq:line break in middle of parentheses}), the start of the line is aligned with the left side of the equal sign. Instead, the entire expression of the right-hand side of the equality should be aligned to the right of the equal sign. 
To achieve this, replace `&:=` in the first line with `:=&`. (Alternatively, you can use `&\quad` in all of the subsequent lines, but this approach is more verbose and may result in worse alignment.)
- In (\ref{eq:plus sign with unary operator spacing}), the line of code starts with `&-`. 
In this expression, LaTeX interprets "`-`" as a unary operator instead of a binary operator. Since LaTeX places space on both sides of a binary operator but not a unary operator, the minus sign will be displayed with insufficient space (the online display of this equation does not show a much different spacing, but in some LaTeX documents, the difference is dramatic). 
To force LaTeX to recognize `-` or `+` as a binary operator, place "`{}`" on the left side, like `&{}-` and `&{}+`. 

- In the line break between (\ref{eq:plus sign with unary operator spacing}) and (\ref{eq:line break in middle of parentheses}), the break is placed in the middle of a parenthetical grouping. 
Line breaks should be placed between the highest level of group possible. 
When a break is placed inside parentheses, the start of the new line should align with the start of the parenthetical group. Among other reasons to avoid line breaks between parentheses is that ```\left( ... \\ ... \right)``` does not work to make the parentheses match the height of the contents—instead, you must manually set the sizes of the parentheses, using, e.g., ```\Big( ... \\ ... \Big)```.

<!-- place line breaks before binary operators (is possible) and place `{}` after the line break and before the binary operator to achieve correct spacing. -->

Fixing the above problems results in the following aligned equation: 
{% include latex-example.html code=
"\begin{align}
    f(x) :={} & \sum (a + b + c) \\ 
    &{} + \iiint f(x + y + z) dx\, dy\, dz \\
    &{} - x + y + z \\
    &{} + \sin\left(x + y - x^2 - y ^2 \right)
\end{align}" %}

