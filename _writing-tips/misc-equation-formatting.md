---
layout: single
title: |
    Miscellaneous Equation Formatting
# excerpt: 
tags: wording
# source: 
---
This section is intended as a catch-all for various equation formatting tips and conventions that do not yet have their own sections.

* When writing a derivative of $x\mapsto f(x)$ evaluated at $x_0$, write 
\\[\frac{df}{dx}(x_0),\\]
rather than
\\[\frac{df(x_0)}{dx}.\\]
The reason for this is that we first differentiate $f$ to create a new function $\frac{df}{dx}$, which we then evaluate at a given point $x_0$.
* When writing a condition that holds for all elements in a set, do not place a comma between the proposition and the quantifier:
\\[P(x) \quad \forall x \in S\\]
Not like this: 
\\[P(x), \quad \forall x \in S.\\]
* [Per Ricardo]: When writing a list of cases, do not include a comma before "if". 
[Not Per Ricardo, but not sure of his preference]: Place a comma after each case. 
[Not Per Paul]: If the equation is at the end of a sentence, then there should [be a period on the last line](/writing-tips/punctuation-in-equations) (_inside_ of the <code>\begin{cases} \end{cases}</code>, otherwise it will be misaligned):
\\[
\begin{cases}
    0 & \text{if } x < 0, \\ 
    1 & \text{if } x \geq 0.
\end{cases}
\\]