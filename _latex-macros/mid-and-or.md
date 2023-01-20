---
layout: single
title: >
  Mid-line "And" and "Or" in Display Equations
description: >
  For display-style equations that contains a list of equations, I found it tedious to write <code>\quad \text{and} \quad</code> before the last item in the list. Instead, I defined a <code>\midand</code> macro. 
definition: | 
  \newcommand{\midand}{\quad \textup{and}\quad}%
  \newcommand{\midor}{\quad \textup{or}\quad}%
examples:
  - code_displayed: x \geq -1 \midand x \leq 1
    code_rendered: x \geq -1 \quad \text{and} \quad x \leq 1
  - code_displayed: x \leq -1, \quad x = 0, \midor x \geq 1
    code_rendered: x \leq -1, \quad x = 0, \quad \text{or} \quad x \geq 1
---
