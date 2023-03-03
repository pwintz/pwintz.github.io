---
layout: single
title: >
  Fractions
summary: 
description: >
  These macros make it easier to insert fractions that have 2, 3, 4, 5, 6, or 12 as the denominator. 
  A "short" version of each command is included. The short versions separate the numerator and denominator with a slash instead of a horizontal line.
  For general short fractions, use `\fracshort`. 
definition: |- 
  \newcommand{\fracshort}[2]{\left.#1 \:\middle/\: #2\right.}
  \newcommand{\half}[1][1]{\frac{#1}{2}}
  \newcommand{\third}[1][1]{\frac{#1}{3}}
  \newcommand{\quarter}[1][1]{\frac{#1}{4}}
  \newcommand{\fifth}[1][1]{\frac{#1}{5}}
  \newcommand{\sixth}[1][1]{\frac{#1}{6}}
  \newcommand{\twelfth}[1][1]{\frac{#1}{12}}
  \newcommand{\halfshort}[1][1]{\fracshort{#1}{2}}
  \newcommand{\thirdshort}[1][1]{\fracshort{#1}{3}}
  \newcommand{\quartershort}[1][1]{\fracshort{#1}{4}}
  \newcommand{\fifthshort}[1][1]{\fracshort{#1}{5}}
  \newcommand{\sixthshort}[1][1]{\fracshort{#1}{6}}
  \newcommand{\twelfthshort}[1][1]{\fracshort{#1}{12}}
examples:
  - code_displayed: |-
      \fracshort{a}{b}
    code_rendered: |
      a/b
  - code_displayed: |-
      \fracshort{1}{\left(1 + e^{x^{-2}}\right)}
    code_rendered: |
      \left. 1 \middle/ \left(1 + e^{x^{-2}}\right) \right.
  - code_displayed: |-
      \half
    code_rendered: |
      \frac{1}{2}
  - code_displayed: |-
      \half[x]
    code_rendered: |
      \frac{x}{2}
  - code_displayed: |-
      \third \fourth \fifth \sixth \twelfth
    code_rendered: |
      \frac{1}{3}\frac{1}{4}\frac{1}{5}\frac{1}{6}\frac{1}{12}
  - code_displayed: |-
      \third[a] \fourth[b] \fifth[c] \sixth[d] \twelfth[e]
    code_rendered: |
      \frac{a}{3}\frac{b}{4}\frac{c}{5}\frac{d}{6}\frac{e}{12}
---