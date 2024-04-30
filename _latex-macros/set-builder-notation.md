---
layout: latex-macro
title: >
  Set Builder Notation (<code>\setdef</code> and <code>\suchthat</code>)
summary: 
description: >
  To insert a set \({A | B}\) (using set builder notation), 
  type "\setdef{A \suchthat B}". The heights of the braces and 
  center bar will adjust automatically to the height of the contents.
definition: |- 
  \newcommand*{\setdef}[1]{\left\{#1 \right\}} 
  \newcommand{\suchthat}{\mathrel{}\ifnum\currentgrouptype=16 \middle\fi|\mathrel{}}
examples:
  - code_displayed: |-
      \setdef{A \suchthat B}
    code_rendered: |
      \left\{A \mid B\right\}
  - code_displayed: |-
      \setdef{x \suchthat \frac{1}{1+x} = 0}
    code_rendered: |
      \left\{x \mathrel{}\middle|\mathrel{} \frac{1}{1+x} = 0\right\}
  - code_displayed: |-
      \setdef{A, B, C}
    code_rendered: |
      \left\{A, B, C\right\}
---