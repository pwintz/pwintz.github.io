---
layout: latex-macro
title: >
  Set Builder Notation
summary: 
description: >
  I created macros to simplify writing sets with set builder notation, so that  "<code>\setdef{x \suchthat x < 0}</code>" produces \(\{x \mathrel{|} x < 0\}\). 
  The heights of the braces and center bar automatically adjust to the height of the contents of the braces, and the center bar has appropriate spacing on either side.
  <p>
  Set definitions often include conjunctions ("and"s) and disjunctions ("or"s), so we define <code>\and</code> and <code>\or</code> so they can be used within the argument of <code>\setdef</code> to create nicely formatted logical statements. 
  I used the convention that "or" is written out, but "and" is represented by a comma. 
  To use \(\vee\) for "or" and \(\wedge\) for "and", modify the definitions to
  <code>\def\or{\vee}</code> and <code>\def\and{\wedge}</code>.

definition: |- 
  % To insert a set {A | B} (using set builder notation), 
  % type "\setdef{A \suchthat B}". The heights of the braces 
  % and center bar will adjust automatically to the height 
  % of the contents.
  \newcommand*{\setdef}[1]{
      \begingroup
          \def\or{\textup{ or }}%
          \def\and{,\ }%  
          \left\{#1 \right\}%
      \endgroup
  } 
  \newcommand{\suchthat}{%
      \ifnum\currentgrouptype=16
          % If the command is used between "\left" and "\right", 
          % then use "\middle" to make "|" match the height of 
          % the delimiters.
          \mathrel{}\middle|\mathrel{}
      \else
          % Otherwise, we just insert "|" with the spacing of a 
          % math relation.
          \mathrel{|}
      \fi
  }
examples:
  - code_displayed: |-
      \setdef{x \suchthat P(x) \or Q(x)}
    code_rendered: |
      \left\{x \mid P(x) \text{ or } Q(x) \right\}
  - code_displayed: |-
      \setdef{x \suchthat \frac{1}{1+x^2} = 1 \and x > 0}
    code_rendered: |
      \left\{x \mathrel{}\middle|\mathrel{} \frac{1}{1+x^2} = 1,\ x > 0\right\}
  - code_displayed: |-
      \setdef{A, B, C}
    code_rendered: |
      \left\{A, B, C\right\}
vs-code-snippets: |
  "Set builder notation":{
    "prefix": ["\\setbuild"],
    "body": [
      "\\setdef{$TM_SELECTED_TEXT${1:x} \\suchthat $2} $0"
    ]
  },
  "Set definition":{
    "prefix": ["\\setdef"],
    "body": [
      "\\setdef{$TM_SELECTED_TEXT$1} $0"
    ]
  }
---