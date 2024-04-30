---
layout: latex-macro
title: >
  "Left-hand Side" and "Right-hand Side"
description: >
  The command <code>\lhs</code> inserts "left-hand side" or "L.H.S." depending on the context. 
  Similarly, <code>\rhs</code> inserts "right-hand side" or "R.H.S.". 
  When used in text, the macros generate the spelled out text (i.e., "left-hand side"). In math mode, the acronym abbreviation is used. 
definition: | 
  \usepackage{xspace}
  % Define \lhs for "left-hand side" in text or "L.H.S." in math. 
  \newcommand{\lhs}{\relax\ifmmode\mathrm{L.H.S.}\else{}left-hand side\xspace\fi}
  % Define \rhs for "right-hand side" in text or "R.H.S." in math. 
  \newcommand{\rhs}{\relax\ifmmode\mathrm{R.H.S.}\else{}right-hand side\xspace\fi}
examples:
  - code_displayed: To simplify the \lhs, we ...
    code_rendered: \text{To simplify the left-hand side, we ...}
  - code_displayed: To simplify the \rhs, we ...
    code_rendered: \text{To simplify the right-hand side, we ...}
  - code_displayed: To simplify the $\lhs$, we ...
    code_rendered: \text{To simplify the L.H.S., we ...}
  - code_displayed: To simplify the $\rhs$, we ...
    code_rendered: \text{To simplify the R.H.S., we ...}
---
