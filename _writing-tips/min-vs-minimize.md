---
layout: single
title: |
    "Minimize" vs. "Min" in Optimization Problems
excerpt: When writing an optimization problem, write "minimize" and "subject to" instead of "min" and "such that" or "s.t."
tags: optimization
source: |
    Professor Stephen P. Boyd, at Stanford, in <a href="https://see.stanford.edu/Course/EE364A/78">Lecture 5 of his Convex Optimization course</a>, around the 13-minute mark.
---

When writing an optimization problem, write "minimize" and "subject to" instead of "min" and "such that" or "s.t.". 
<table>
    <tr>
        <th>Correct</th>
        <th>Incorrect</th>
    </tr>
    <tr>
        <td>
            \[\begin{aligned}
                \operatorname{minimize} \quad & f(x) \\ 
                \operatorname{subject to} \quad & Ax = b,
            \end{aligned} \]
        </td>
        <td>
            \[ \begin{aligned}
                \operatorname{min} \quad & f(x) \\
                \operatorname{s.t.} \quad& Ax = b.
            \end{aligned} 
            \]
        </td>
    </tr>
</table>
The problem with writing "$\operatorname{min} f(x)$" instead of "$\operatorname{minimize} f(x)$" is that the expression "$\operatorname{min} f(x)$" represents the minimal _value_ of $f$ whereas "$\operatorname{minimize} f(x)$" is a statement of the _goal_ of the optimization problem.

We use the following code when writing optimization problems.
In the preamble, we define `\minimize`, `\maximize`, and `\subjecto` macros, as follows:
```latex
% Usage: \minimize{\x \in \reals}
\newcommand*{\minimize}[1]{\operatorname*{minimize}_{#1}\quad} 
% Usage: \maximize{\x \in \reals}
\newcommand*{\maximize}[1]{\operatorname*{maximize}_{#1}\quad} 
\newcommand{\subjectto}{\textup{subject to}\quad}
```
The starred version of the `\operatorname` macro causes subscripts to be placed below the text in display equations.

In the document body, we write an optimization problem as 
```latex
\begin{align*}
    \minimize{x \in \reals^n} & f(x) \\
    \subjectto & Ax \leq 0 \\
               & Bx = 0.
\end{align*}
```

If space is a concern, you may abbreviate "subject to" as "subj. to" (`\textup{subj.\ to}`). 