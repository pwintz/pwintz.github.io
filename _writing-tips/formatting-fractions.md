---
layout: single
title: |
    Formatting Fractions
# excerpt: When writing an optimization problem, write "minimize" and "subject to" instead of "min" and "such that" or "s.t."
tags: typesetting
# source: |
#     Professor Stephen P. Boyd, at Stanford, in <a href="https://see.stanford.edu/Course/EE364A/78">Lecture 5 of his Convex Optimization course</a>, around the 13-minute mark.
---

Fractions come in two varieties: Display style and text style. A text style fraction is small enough to fit within the height of a line of text, like $\frac{a}{b}$. In contrast, a display style fraction is taller and will extend beyond the normal line height if used in text:&nbsp;$\dfrac{a}{b}$.
A text style fraction is used automatically by LaTeX in the following circumstances:
- In inline equations delimited by `$ ... $` or $\( ... \)$, such as `$\frac{a}{b}$` ($\frac{a}{b}$). 
- In the numerator or denominator of another fraction.
- In matrix environments, such as `pmatrix` or `bmatrix`.
- In `cases` environments.

Here is a example that demonstrates text style fractions:
{% capture textstyle_code %}{% raw %}\[
    \frac{1 + \frac{1}{2}}{2}
    +
    \begin{bmatrix} 
        1 & \frac{1}{2} & \frac{1}{3} 
    \end{bmatrix} 
    +
    \begin{cases} 
        2 + \frac{1}{4} \\
        \frac{1}{5}
    \end{cases}
\]{% endraw %}{% endcapture %}
{% capture textstyle_output %}{% raw %} 
    $$
        \frac{1 + \frac{1}{2}}{2}
        +
        \begin{bmatrix} 
            1 & \frac{1}{2} & \frac{1}{3} 
        \end{bmatrix} 
        +
        \begin{cases} 
            2 + \frac{1}{4} \\
            \frac{1}{5}
        \end{cases}.
    $$
{% endraw %}{% endcapture %}
{% include code-example.html  
    language=latex
    code=textstyle_code
    output=textstyle_output
%}
In contrast, a display style fraction is used in the following cases:
- In a display equation, delimited by `\[...\]`, `$$...$$`, `\begin{equation} \end{equation}` or the other similar environments (`equation*`, `align`, and `align*`).
- Anywhere (including where a text style fraction would normally be used) if `\dfrac` is used instead of `\frac`, or if `\displaystyle` is placed anywhere before the fraction.

When writing a fraction in LaTeX, consider the following guidelines:
 
1. Do not use display style fractions inline, in text. They will look bad and cause the height of the lines to grow.
2. Only use text style fractions for simple fractions, such as $\frac{1}{2}$. Do you want to read a fraction like $\frac{1+\sqrt{x^2}}{e^{-\frac{x}{\pi}}}$? I wouldn't! Either make the equation a display equation (e.g., if it is in a `bmatrix` environment where there is sufficient space), or rewrite the equation with a slash, like $(1+\sqrt{x^2})/(e^{-x/\pi})$.