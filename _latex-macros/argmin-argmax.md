---
layout: latex-macro
title: >
  Arguments of the Minima and Maxima (<code>\argmin</code> and <code>\argmax</code>)
description: >
  The macros <code>\argmin</code> and <code>\argmax</code> have the following features:
  <ol>
    <li>Correct spacing depending on the surrounding context (e.g., "$\operatorname{arg\hspace{1mu}min}h(x)$" instead of "$\mathrm{arg\hspace{3mu}min}h(x)$").</li>
    <li>Always uses the upright mathematics font (they will not become italicized when used inside a theorem body).</li>
    <li>Correct placement of limits, e.g., <code>\argmin_{x > 0}</code> is rendered as $\operatorname{arg\,min}_{x > 0}$ in inline equations, whereas in display equations it is rendered as
    
    $$\displaystyle\operatorname*{arg\hspace{1mu}min}_{x > 0}$$

    <li>a slight space is included between "arg" and "min".</li>
  </ol>

  As a side note, $\operatorname{arg\hspace{1mu}min} f$ (and $\operatorname{arg\hspace{1mu}max} f$) is a set, since there is not, in general, $f$ can have multiple minimizing arguments. Consider, for example, $(x, y) \mapsto f(x, y) := x^2$. Then, 
  
  $$\operatorname{arg\hspace{1mu}min} f = \{(0, y) : y \in \reals\}$$
  
  Thus, in general, one should write $x \in \operatorname{arg\,min} f$ instead of $x = \operatorname{arg\,min} f$ unless $f$ is known to be minimized at a unique point (e.g., if $f$ is strictly convex). 
definition: | 
  % Define "\argmax" and "\argmin" macros.
  % These definitions require the amsmath package, 
  % which provides "\DeclareMathOperator*".
  \DeclareMathOperator*{\argmax}{arg\,max}
  \DeclareMathOperator*{\argmin}{arg\,min}
examples:
  - code_displayed: |
      $\argmin_x f(x)$
    code_rendered: 
      \operatorname{arg\hspace{1mu}min}_{x} f(x)
  - code_displayed: |
      \[
        \argmax_x f(x)
      \]
    code_rendered: 
      \operatorname*{arg\hspace{1mu}min}_{x} f(x)
---
