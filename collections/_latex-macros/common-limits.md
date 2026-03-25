---
layout: latex-macro
title: "Limits"
description: >
  Typesetting long calculations involving limits quickly become tedious because the same limit expression (such as "\(\lim_{i \to \infty}\)") appears in each in each step of the calculation—sometimes multiple times!—until the limit is fully evaluated. Any time an expression appears repeatedly, you should consider introducing a macro. In particular, when the input variable for a limit is written as \(i\), \(j\), or \(k\), then the variable almost always is integer index that goes to \(\infty\). Thus, we introduce macros to abbreviate the corresponding limit expressions. Similarly, \(h\) is commonly used as an distance that goes to zero, such as in the definition of the derivative, so we define a macro to insert "\(\lim_{h \to 0^+}\)."
definition: | 
  \newcommand{\jlim}{\lim_{j \to \infty}}
  \newcommand{\ilim}{\lim_{i \to \infty}} 
  \newcommand{\klim}{\lim_{k \to \infty}}
  \newcommand{\hlim}{\lim_{h \to 0^+}}
examples:
  - code_displayed: '\ilim 1/i = 0'
    code_rendered: \lim_{i \to \infty} 1/i = 0
  - code_displayed: \jlim 1/j = 0 
    code_rendered: \lim_{j \to \infty} 1/j = 0
  - code_displayed: \klim 1/k = 0 
    code_rendered: \lim_{k \to \infty} 1/k = 0 
  - code_displayed: \hlim \frac{f(x + h) - f(x)}{h} = 0 
    code_rendered: \lim_{h \to 0^+} \frac{f(x + h) - f(x)}{h} = 0
---

