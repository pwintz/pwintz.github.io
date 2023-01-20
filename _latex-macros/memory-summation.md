---
layout: single
title: >
  "Memory" Summation
summary: 
description: >
  When evaluating an summation, often the summation symbol \(\sum\) appears with the same limits repeatedly. A "memory" command <code>\memsum</code> allows for the limits to be typed once when the summation first appears and omitted thereafter. In particular, there are two versions of <code>\memsum</code>: a starred version <code>\memsum*[&lt;lower limit&gt;][&lt;upper limit&gt;]</code> records the lower limit <code>&lt;lower limit&gt;</code> and the upper limit <code>&lt;lower limit&gt;</code> into memory. From then on, the unstarred version <code>\memsum</code> will insert a summation with the recorded limits. In addition to saving time typing, <code>\memsum</code> simplifies the LaTeX code, so it is easier to edit and find mistakes. 
  
  <p>WARNING: Be careful while using this command because each time the starred version is called, it changes the definition for all of the unstarred versions until the next starred version. Thus, if you add <code>\memsum*</code> into the middle of text where you are already using  <code>\memsum</code> with a different definition, you can unintentionally change the rendered equations. For this reason, I restrict the usage of each remembered command to a single equation.</p>
definition: |- 
  % The 'xparse' package provides \NewDocumentCommand
  \usepackage{xparse}
  \NewDocumentCommand{\memsum}{sO{}O{}}{%
      \IfBooleanT{#1}%
      {% If a star
          % "\gdef" is used to define a global macro.
          \gdef\memsumlimit{_{#2}^{#3}}%
      }
      \sum\memsumlimit
  }
examples:
  - code_displayed: |-
      \memsum*[n=1][\infty] \frac{1}{x} 
      = \memsum \frac{1}{x}
    code_rendered: |
      \begin{aligned}
        \sum_{n=1}^{\infty} \frac{1}{x} 
        &= \sum_{n=1}^{\infty} \frac{1}{x}
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
