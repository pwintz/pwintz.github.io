---
layout: latex-macro
title: >
  Fractions
summary: 
description: >
  This collection of LaTeX macros make it easier to insert fractions, including defining a <code>\fracshort</code> macro that causes a fraction to be rendered like $a/b$ (making it easier to switch between $\frac{a}{b}$ and $a/b$).
  The slash inserted by <code>\fracshort</code> scales with the height of the numerator and denominator. 
  Also included are common fractions, $\frac{1}{2}$ (<code>\half</code>), $\frac{1}{3}$ (<code>\third</code>), etc. 
  Each of these commands can take one optional argument that sets the numerator to the given values, such as <code>\half[x]</code> ($\frac{x}{2}$), and have short versions (<code>\quartershort[\theta]</code> creates $\theta/4$) and a display style version (e.g., <code>\dtenth[n]</code> creates $\dfrac{n}{10}$, but you should <a href="/writing-tips/formatting-fractions">never use display style fractions in a line of text</a>).  
  Finally, the <code>\oneover</code>, <code>\oneovershort</code>, and <code>\doneover</code> macros inserts fractions with $1$ in the numerator and the denominator given as an argument: <code>\oneover{x}</code> creates $\frac{1}{x}$.
  <p>
  When using the short fractions, make sure you insert parentheses, as needed, around the numerator and denominator!
definition: |- 
  \newcommand{\fracshort}[2]{\left.#1 \middle/ #2\right.}
  \newcommand{\oneover}[1]{\frac{1}{#1}}
  \newcommand{\doneover}[1]{\dfrac{1}{#1}} % \displaystyle fraction
  \newcommand{\oneovershort}[1]{\fracshort{1}{#1}}
  % Common Fractions
  \newcommand{\half}   [1][1]{\frac{#1}{2}}
  \newcommand{\third}  [1][1]{\frac{#1}{3}}
  \newcommand{\quarter}[1][1]{\frac{#1}{4}}
  \newcommand{\fifth}  [1][1]{\frac{#1}{5}}
  \newcommand{\sixth}  [1][1]{\frac{#1}{6}}
  \newcommand{\eighth} [1][1]{\frac{#1}{8}}
  \newcommand{\tenth}  [1][1]{\frac{#1}{10}}
  \newcommand{\twelfth}[1][1]{\frac{#1}{12}}
  % Short fractions for inline equations.
  \newcommand{\halfshort}   [1][1]{\fracshort{#1}{2}}
  \newcommand{\thirdshort}  [1][1]{\fracshort{#1}{3}}
  \newcommand{\quartershort}[1][1]{\fracshort{#1}{4}}
  \newcommand{\fifthshort}  [1][1]{\fracshort{#1}{5}}
  \newcommand{\sixthshort}  [1][1]{\fracshort{#1}{6}}
  \newcommand{\eighthshort} [1][1]{\fracshort{#1}{8}}
  \newcommand{\tenthshort}  [1][1]{\fracshort{#1}{10}}
  \newcommand{\twelfthshort}[1][1]{\fracshort{#1}{12}}
  % Display style fractions.
  \newcommand{\dhalf}   [1][1]{\dfrac{#1}{2}}
  \newcommand{\dthird}  [1][1]{\dfrac{#1}{3}}
  \newcommand{\dquarter}[1][1]{\dfrac{#1}{4}}
  \newcommand{\dfifth}  [1][1]{\dfrac{#1}{5}}
  \newcommand{\dsixth}  [1][1]{\dfrac{#1}{6}}
  \newcommand{\deighth} [1][1]{\dfrac{#1}{8}}
  \newcommand{\dtenth}  [1][1]{\dfrac{#1}{10}}
  \newcommand{\dtwelfth}[1][1]{\dfrac{#1}{12}}
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
  - code_displayed: |-
      \thirdshort[a] + \fourthshort[b] 
    code_rendered: |
       a/3 + b/4
---