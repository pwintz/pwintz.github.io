---
layout: single
title: >
  "Memory" Integral
summary: 
description: >
  When evaluating an integral, often the integral symbol \(\int\) appears with the same limits repeatedly. A "memory" command <code>\memint</code> allows for the limits to be typed once when the integral first appears and omitted thereafter. In particular, there are two versions of <code>\memint</code>: a starred version <code>\memint*[&lt;lower limit&gt;][&lt;upper limit&gt;]</code> records the lower limit <code>&lt;lower limit&gt;</code> and the upper limit <code>&lt;lower limit&gt;</code> into memory. From then on, the unstarred version <code>\memint</code> will insert a integral with the recorded limits. In addition to saving time typing, <code>\memint</code> simplifies the LaTeX code, so it is easier to edit and find mistakes. 
  
  <p>WARNING: Be careful while using this command because each time the starred version is called, it changes the definition for all of the unstarred versions until the next starred version. Thus, if you add <code>\memlim*</code> into the middle of text where you are already using  <code>\memlim</code> with a different definition, you can unintentionally change the rendered equations. For this reason, I restrict the usage of each remembered command to a single equation.</p>
definition: |- 
  % The 'xparse' package provides \NewDocumentCommand
  \usepackage{xparse}
  \NewDocumentCommand{\memint}{sO{}O{}}{%
      \IfBooleanT{#1}%
      {% If a star
          % "\gdef" is used to define a global macro.
          \gdef\memintlimits{_{#2}^{#3}}%
      }
      \int\memintlimits
  }
examples:
  - code_displayed: |-
      \memint*[1][\infty] \frac{1}{x} 
      = \memint \frac{1}{x}
    code_rendered: |
      \begin{aligned}
        \int_{1}^{\infty} \frac{1}{x} 
        &= \int_{1}^{\infty} \frac{1}{x}
      \end{aligned}
---


<!-- {% include latex-example.txt 
code_displayed="
\memlim*[x_0 \to 5] \frac{(x+1)(x-5)}{(x-2)(x-5)} 
= \memlim \frac{x+1}{x-2} 
= \frac{5+1}{5-2} 
= 2" 
code_rendered="\begin{aligned}
\lim_{x_0 \to 5} \frac{(x+1)(x-5)}{(x-2)(x-5)} 
= \lim_{x_0 \to 5} \frac{x+1}{x-2} 
= \frac{5+1}{5-2} 
= 2
\end{aligned}" %} -->
