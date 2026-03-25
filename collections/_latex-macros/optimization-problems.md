---
layout: latex-macro
title: >
  Optimization Problems (<code>\minimize</code>, <code>\maximize</code>, <code>\subjectto</code>)
description: >
  I define <code>\minimize</code>, <code>\maximize</code>, and <code>\subjectto</code> as <a href="https://tex.stackexchange.com/questions/84302/what-is-the-difference-of-mathop-operatorname-and-declaremathoperator">math operators</a> using the <code>amsmath</code> package's macros <code>\DeclareMathOperator</code> and <code>\DeclareMathOperator*</code> (the resulting macros are equivalent to placing <code>\operatorname*{minimize}</code> in the body of your document).
  Defining the macros as math operators ensures that the font matches the roman math font (cf. using <code>\text{minimize}</code> which will become italicized when used in the body of a theorem), and gives us control over the placement of "limits" on the text, e.g., "<code>\minimize_{x \in \reals}</code>". 
  In particular, using <code>\DeclareMathOperator*</code> instead of <code>\DeclareMathOperator</code> causes subscripts to be placed below the text in display equations, so <code>\[\minimize_{x \in \reals}\]</code> is rendered as 

  $$\operatorname*{minimize}_{x \in \reals}$$ 

  instead of 

  $$\operatorname{minimize}_{x \in \reals}.$$ 

  For inline equations, limits are still placed to the side, e.g., "$\operatorname*{minimize}_{x \in \reals}$". <p>

  For <code>\subjectto</code>, we use a fixed-width nonbreaking space "<code>~</code>" in <code>\operatorname</code> to preserve the space in the name, since <code>\operatorname</code> gobbles regular spaces. 
  <!--  (using <code>\textup{subject to}</code> would also preserve the space, but will sometimes appear as different font if different fonts are configured for math vs. text).  -->
  <p>

  See <a href="/writing-tips/min-vs-minimize">“Minimize” vs. “Min” in Optimization Problems</a> for discussion of it is better to not use "<code>\min</code>" when writing optimization problems.<p>

  For the Britishly-inclined, I have included aliases <code>\minimise</code> and <code>\maximise</code>. 
  Depending on the publication venue, you can change the spelling in the definitions of "minimize" and "maximize", but to enforce consistency, I advise against defining macros that insert different variants of the spelling.
definition: | 
  % ╭──────────────────────────────────────────────╮
  % │             Optimization Problems            │
  % ╰──────────────────────────────────────────────╯
  % Requires the amsmath package, which provides 
  % "\DeclareMathOperator" and "\DeclareMathOperator*".
  % Example usage:
  %   \begin{align*}
  %       \minimize_{x \in \reals^n} \quad  & f(x)      \\
  %       \subjectto                 \quad  & Ax \leq 0 \\
  %                                         & Bx = 0.
  %   \end{align*}
  \DeclareMathOperator*{\minimize}{minimize}
  \DeclareMathOperator*{\maximize}{maximize}
  \DeclareMathOperator {\subjectto}{subject~to}
  % Aliases for \maximize and \minimize with British spelling.
  \let\minimise=\minimize
  \let\maximise=\maximize
examples:
  - code_displayed: |
      \begin{align*}
          \minimize_{x \in \reals^n} \quad & f(x)      \\
          \subjectto                 \quad & Ax \leq 0 \\
                                           & Bx = 0.
      \end{align*}
    code_rendered: 
      \begin{align*} 
        \operatorname*{minimize}_{x \in \reals^n} \quad & f(x) \\ 
        \operatorname{subject~to}                 \quad & Ax \leq 0 \\
                                                        & Bx = 0.
      \end{align*}
---
