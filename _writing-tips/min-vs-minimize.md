---
layout: single
title: |
    "Minimize" vs. "Min" in Optimization Problems
excerpt: When writing an optimization problem, write "minimize" and "subject to" instead of "min" and "such that" or "s.t."
tags: optimization
source: |
    Professor Stephen P. Boyd, at Stanford, in <a href="https://see.stanford.edu/Course/EE364A/78">Lecture 5 of his Convex Optimization course</a>, around the 13-minute mark.
---

When writing an optimization problem, use "minimize" or "maximize" instead of "min" or "max", and "subject to" instead of "such that" or "s.t.". 
<table>
    <tr>
        <th>Correct</th>
        <th>Incorrect</th>
    </tr>
    <tr>
        <td>
            \[\begin{aligned}
                \operatorname{minimize} \quad & f(x) \\ 
                \operatorname{subject~to} \quad & Ax = b.
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
The reason that "$\operatorname{min} f(x)$" is objectionable is that the "min" is (by convention) [an _operator_](https://www.ams.org/arc/tex/amsmath/amsldoc.pdf) that is short for "minimum", so the expression "$\operatorname{min} f(x)$" stands for the minimal _value_ of $f$ .
Similarly, by convention "s.t." stands for "such that", so "$\operatorname{min} f(x)$ s.t. $Ax = b$" should be read as "the minimum value of $f(x)$ such that $Ax = b$ (as an aside, it would be better to format this expression as "$\min\{f(x) : Ax = b\}$"). 
In contrast, "$\operatorname{minimize} f(x)$" is a statement of the _goal_ of the optimization problem with the constraints of the problem given after "subject to".
(As [Stephen P. Boyd notes](https://see.stanford.edu/Course/EE364A/78), we could read "s.t." as an abbreviation of "subject to", and the same could be said for "min" and "minimize", but doing so causes use to [use the same symbols for different things](/dont-reuse-symbols), which should be avoided.)

We use the following code when writing optimization problems.
In the preamble, we define `\minimize`, `\maximize`, and `\subjecto` macros, as follows:
```latex
% Usage: \minimize_{\x \in \reals}
\newcommand*{\minimize}{\operatorname*{minimize}} 
% Usage: \maximize_{\x \in \reals}
\newcommand*{\maximize}{\operatorname*{maximize}} 
\newcommand{\subjectto}{\operatorname{subject~to}}
```
The starred version of the `\operatorname` macro causes subscripts to be placed below the text in display equations.
For `\subjectto`, we use a fixed-width nonbreaking space "`~`" in `\operatorname` to preserve the space in the name (using `\textup{subject to}` would also preserve the space, but will sometimes appear as different font if different fonts are configured for math vs. text).
<!-- in `\textup` instead of `\operatorname` to preserve the space in the name. -->

In the document body, we write an optimization problem as 
```latex
\begin{align*}
    \minimize_{x \in \reals^n} \quad & f(x) \\
    \subjectto                 \quad & Ax \leq 0 \\
                                     & Bx = 0.
\end{align*}
```

If space is a concern, you may abbreviate "subject to" as "subj. to" (`\operatorname{subj.~to}`). 

<!-- In some cases,  -->