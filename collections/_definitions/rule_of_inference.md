---
published: false
title: Rule of Inference
term: rule of inference
applies_to: formal proofs
synonyms: [inference rule]
levels:
  high-school:
    text: |-
      A _rule of inference_ is a basic rule of logic that says which statement may be concluded from statements of certain forms.
      For example, the rule called _modus ponens_ says that from "if $P$, then $Q$" and "$P$," one may conclude "$Q$."
  undergraduate:
    context: logic
    text: |-
      A _rule of inference_ is a pattern

      $$\frac{\varphi_1 \quad \varphi_2 \quad \cdots \quad \varphi_n}{\psi}$$

      made of formula schemes $\varphi_1, \dots, \varphi_n$, called the [premises](/dictionary/definitions/premise) of the rule, and a formula scheme $\psi$, called the [conclusion](/dictionary/definitions/conclusion) of the rule.
      The rule allows a [deduction](/dictionary/definitions/deduction) to infer each instance of $\psi$ from the corresponding instances of $\varphi_1, \dots, \varphi_n$.
properties:
  - >-
    A rule of inference is called sound if every instance of the rule is a [valid argument](/dictionary/definitions/valid-argument).
  - >-
    A rule of inference depends only on the syntax of the formulas, not on their meaning.
---
A rule of inference is applied to formulas, whereas an [axiom](/dictionary/definitions/axiom) is a formula: an axiom can be used in a [deduction](/dictionary/definitions/deduction) without being inferred from anything.
