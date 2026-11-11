---
published: false
title: Quantifier
term: quantifier
applies_to: formulas in logic
synonyms: [quantifiers]
levels:
  high-school:
    text: |-
      A _quantifier_ is a phrase that says how many values of a variable a statement is about.
      The two main quantifiers are "for all" ($\forall$), as in "for all [real numbers](/dictionary/definitions/real-number) $x$, $x^2 \geq 0$," and "there exists" ($\exists$), as in "there exists a real number $x$ such that $x^2 = 2$."
  undergraduate:
    context: first-order logic
    text: |-
      Consider a [formula](/dictionary/definitions/formula-logic) $\varphi$ and a variable $x$.
      The _universal quantifier_ $\forall$ and the _existential quantifier_ $\exists$ build the formulas

      $$\forall x \, \varphi \quad \text{and} \quad \exists x \, \varphi,$$

      where $\forall x \, \varphi$ is true if $\varphi$ is true for every [object](/dictionary/definitions/object-logic) $x$ in the domain of discourse, and $\exists x \, \varphi$ is true if $\varphi$ is true for at least one object $x$ in the domain of discourse.
properties:
  - >-
    A quantifier _binds_ its variable: in $\forall x \, (x^2 \geq y)$, the variable $x$ is bound and the variable $y$ is free.
    A formula in which a quantifier binds every variable is a [sentence](/dictionary/definitions/sentence-logic).
  - >-
    Negating a quantifier switches it: $\neg \forall x \, \varphi$ is equivalent to $\exists x \, \neg \varphi$, and $\neg \exists x \, \varphi$ is equivalent to $\forall x \, \neg \varphi$.
  - >-
    The order of different quantifiers matters: $\forall x \, \exists y \, (y > x)$ is true over the [real numbers](/dictionary/definitions/real-number), but $\exists y \, \forall x \, (y > x)$ is false, because no real number is larger than every real number.
---
