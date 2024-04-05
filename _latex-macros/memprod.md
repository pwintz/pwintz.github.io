---
layout: single
title: >
  "Memory" Product (<code>\memprod</code>)
summary: 
description: >
  When evaluating a product, often the product symbol \(\prod\) appears with the same limits repeatedly. A "memory" command <code>\memprod</code> allows for the limits to be typed once when the product first appears and omitted thereafter. In particular, there are two versions of <code>\memprod</code>: a starred version <code>\memprod*[&lt;lower limit&gt;][&lt;upper limit&gt;]</code> records the lower limit <code>&lt;lower limit&gt;</code> and the upper limit <code>&lt;lower limit&gt;</code> into memory. From then on, the unstarred version <code>\memprod</code> will insert a product with the recorded limits. In addition to saving time typing, <code>\memprod</code> simplifies the LaTeX code, so it is easier to edit and find mistakes. 
  
  <p>WARNING: Be careful while using this command because each time the starred version is called, it changes the definition for all of the unstarred versions until the next starred version. Thus, if you add <code>\memprod*</code> into the middle of text where you are already using  <code>\memprod</code> with a different definition, you can unintentionally change the rendered equations. For this reason, I restrict the usage of each remembered command to a single equation.</p>
definition: |- 
  % The 'xparse' package provides \NewDocumentCommand
  \usepackage{xparse}
  \NewDocumentCommand{\memprod}{sO{}O{}}{%
      \IfBooleanT{#1}%
      {% If a star
          % "\gdef" is used to define a global macro.
          \gdef\memprodlimits{_{#2}^{#3}}%
      }
      \prod\memprodlimits
  }
examples:
  - code_displayed: |-
      \memprod*[n=1][\infty] \frac{1}{n} 
      = \memprod \frac{1}{n}
    code_rendered: |
      \begin{aligned}
        \prod_{n=1}^{\infty} \frac{1}{n} 
        &= \prod_{n=1}^{\infty} \frac{1}{n}
      \end{aligned}
---