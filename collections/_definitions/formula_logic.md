---
published: false
title: Formula (logic)
term: formula
applies_to: formal languages
synonyms: [well-formed formula, wff]
levels:
  undergraduate:
    context: first-order logic
    text: |-
      Consider a first-order language, with variables, symbols for functions and relations, [logical connectives](/definitions/logical-connective), and the [quantifiers](/definitions/quantifier) $\forall$ and $\exists$.
      A _formula_ is a string of symbols built by the rules of the language that makes a claim about [objects](/definitions/object-logic), such as $x > 3$, $x^2 + 1 = y$, or $\forall x \, (x^2 \geq 0)$.
      Formulas are built in three steps:

      1. a relation symbol applied to terms, such as $x > 3$, is a formula,
      2. if $\varphi$ and $\psi$ are formulas, then so are $\neg \varphi$, $\varphi \land \psi$, $\varphi \lor \psi$, and $\varphi \implies \psi$, and
      3. if $\varphi$ is a formula and $x$ is a variable, then $\forall x \, \varphi$ and $\exists x \, \varphi$ are formulas.
properties:
  - >-
    An occurrence of a variable in a formula is _bound_ if the occurrence is inside a [quantifier](/definitions/quantifier) for that variable, and _free_ otherwise.
    A formula with no free variables is a [sentence](/definitions/sentence-logic).
  - >-
    A formula with free variables expresses a [predicate](/definitions/predicate): the formula is true or false only once its free variables are given values.
  - >-
    A [term](/definitions/term-logic), such as $x^2 + 1$, names an object and is not a formula, because a term makes no claim.
---
In elementary mathematics, a "[formula](/definitions/formula)" is an equation for calculating a quantity, such as $A = \pi r^2$; that meaning is different.
