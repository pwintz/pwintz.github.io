---
published: false
title: Deduction (Logic)
term: deduction
applies_to: arguments
synonyms: [derivation, formal proof]
levels:
  high-school:
    text: |-
      A _deduction_ is a chain of steps that starts from [premises](/dictionary/definitions/premise) and reaches a [conclusion](/dictionary/definitions/conclusion), where each step follows from earlier steps by a basic rule of logic.
      For example, from "If it is raining, then the ground is wet" and "It is raining," one step of deduction gives "The ground is wet."
  undergraduate:
    context: logic
    text: |-
      Consider a set $\Gamma$ of formulas, called the [premises](/dictionary/definitions/premise), and a set of [rules of inference](/dictionary/definitions/rule-of-inference).
      A _deduction_ of a formula $\psi$ from $\Gamma$ is a finite sequence of formulas $\varphi_1, \varphi_2, \dots, \varphi_k$ such that $\varphi_k = \psi$ and each formula $\varphi_i$ is

      1. a premise in $\Gamma$,
      2. an [axiom](/dictionary/definitions/axiom), or
      3. the [conclusion](/dictionary/definitions/conclusion) of a rule of inference whose premises are among $\varphi_1, \dots, \varphi_{i - 1}$.

      If there is a deduction of $\psi$ from $\Gamma$, then $\psi$ is _deducible_ from $\Gamma$, which is written

      $$\Gamma \vdash \psi.$$
properties:
  - >-
    If every [rule of inference](/dictionary/definitions/rule-of-inference) is sound, then every deducible formula follows validly from the [premises](/dictionary/definitions/premise): $\Gamma \vdash \psi$ implies $\Gamma \models \psi$.
  - >-
    For [first-order logic](/dictionary/definitions/first-order-logic) with a standard set of rules, the converse also holds: $\Gamma \models \psi$ implies $\Gamma \vdash \psi$, by Gödel's completeness theorem.
---
"Deductive reasoning," which draws [conclusions](/dictionary/definitions/conclusion) that the [premises](/dictionary/definitions/premise) guarantee, is contrasted with "inductive reasoning," which draws general conclusions from examples that make them likely but do not guarantee them.

A deduction shows that an [argument](/dictionary/definitions/argument-logic) is [valid](/dictionary/definitions/valid-argument); see [argument vs. deduction](/dictionary/distinctions/argument-vs-deduction).
