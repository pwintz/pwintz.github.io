---
layout: latex-macro
title: >
  Matrices (<code>\mat</code>)
summary: Shortcut for inserting block matrices with an option for adjusting the vertical scale.
description: >
  Shortcut for inserting block matrices with an option for adjusting the vertical scale.
definition: |- 
  % Insert a matrix. Usage: \mat{a & b \\ c & d} or \mat[<vertical spacing>]{a & b \\ c & d}
  \newcommand{\mat}[2][1]{\begingroup
    \renewcommand*{\arraystretch}{#1}
    \begin{bmatrix}#2\end{bmatrix}
  \endgroup}
examples:
  - code_displayed: |-
      \mat{1 \\ 2}
    code_rendered: |
      \begin{bmatrix}
        1 \\ 2
      \end{bmatrix}
  - code_displayed: |-
      \mat[3]{1 \\ 2}
    code_rendered: |
      \begin{bmatrix}
        \\ 1\\  \\ 2 \\ \  
      \end{bmatrix}
---