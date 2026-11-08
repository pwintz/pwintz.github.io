---
title: Term (logic)
term: term
applies_to: formal languages
levels:
  undergraduate:
    context: first-order logic
    text: |-
      Consider a first-order language, with variables, constant symbols, and function symbols.
      A _term_ is a string of symbols built by the rules of the language that names an [object](/definitions/object-logic), such as $x$, $3$, or $x^2 + 1$.
      Terms are built in two steps:

      1. every variable and every constant symbol is a term, and
      2. if $f$ is a function symbol with $n$ inputs and $t_1, \dots, t_n$ are terms, then $f(t_1, \dots, t_n)$ is a term.
properties:
  - >-
    A term has a value, such as a number, once its variables are given values, but a term has no truth value.
  - >-
    A relation symbol applied to terms, such as $x^2 + 1 > 3$, is a [formula](/definitions/formula-logic), not a term.
---
In algebra, a "[term](/definitions/term-of-sum)" is one of the summands of a sum, such as $3x^2$ in $3x^2 - 5x + 2$; that meaning is different.
