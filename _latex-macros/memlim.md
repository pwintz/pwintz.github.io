---
layout: latex-macro
title: >
  "Memory" Limit (<code>\memlim</code>)
summary: 
description: >
  When evaluating an limit, often the limit expression (e.g., \(\lim_{x \to x_0}\)) repeatedly. A "memory" command <code>\memlim</code> allows for the full limit expression to be typed once when it first appears and abbreviated thereafter. In particular, there are two versions of <code>\memlim</code>: a starred version <code>\memlim*[&lt;lower&gt;]</code> records the lower expression <code>&lt;lower&gt;</code> into memory. From then on, the unstarred version <code>\memlim</code> will insert a limit with the recorded lower expression. In addition to saving time typing, <code>\memlim</code> simplifies the LaTeX code, so it is easier to edit and find mistakes. 
  
  <p>WARNING: Be careful while using this command because each time the starred version is called, it changes the definition for all of the unstarred versions until the next starred version. Thus, if you add <code>\memlim*</code> into the middle of text where you are already using  <code>\memlim</code> with a different definition, you can unintentionally change the rendered equations. For this reason, I restrict the usage of each remembered command to a single equation.</p>
definition: |- 
  % The 'xparse' package provides \NewDocumentCommand
  \usepackage{xparse}
  \NewDocumentCommand{\memlim}{sO{}}{%
      \IfBooleanT{#1}%
      {% If a star
          % "\gdef" is used to define a global macro.
          \gdef\memlimsubscript{_{#2}}%
      }
      \lim\memlimsubscript
  }
examples:
  - code_displayed: |-
      \memlim*[x_0 \to 5] 
        \frac{(x+1)(x-5)}{(x-2)(x-5)} 
          = \memlim \frac{x+1}{x-2} 
          = 2
    code_rendered: |
      \begin{aligned}
      \lim_{x_0 \to 5} &\frac{(x+1)(x-5)}{(x-2)(x-5)} \\
        &= \lim_{x_0 \to 5} \frac{x+1}{x-2} \\
        &= 2
      \end{aligned}
---