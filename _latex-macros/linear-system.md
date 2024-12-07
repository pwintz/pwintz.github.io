---
layout: latex-macro
title: >
  Systems of Equations (<code>\system</code> and <code>\linearsystem</code>)
summary: 
description: >
  Typeset a system of equations with brace of the left side.
definition: |- 
  % Create a system of equations.
  % Usage:
  % \system{\sqrt{x + y} &= 2 \\ x - \sin(y) &= 0}
  \newcommand{\system}[1]{\left\{
    \begin{aligned}
      #1
    \end{aligned}\right.
  }
examples:
  - code_displayed: |-
      \memprod*[n=1][\infty] \frac{1}{n} 
      = \memprod \frac{1}{n}
    code_rendered: |
      \begin{aligned}
        \prod_{n=1}^{\infty} \frac{1}{n} 
        &= \prod_{n=1}^{\infty} \frac{1}{n}
      \end{aligned}
---