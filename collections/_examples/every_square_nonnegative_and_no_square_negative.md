---
title: 'The first-order sentence $\forall x \, (x^2 \geq 0) \land \neg \exists x \, (x^2 < 0)$, whose propositional form is $p \land \neg q$'
level: graduate
is: [
  sentence_logic,
  formula_logic
]
is_not: [propositional_formula]
why:
  sentence_logic: >-
    $\forall x \, (x^2 \geq 0) \land \neg \exists x \, (x^2 < 0)$ is a sentence, because the quantifiers $\forall x$ and $\exists x$ bind every occurrence of $x$.
  propositional_formula: >-
    $\forall x \, (x^2 \geq 0) \land \neg \exists x \, (x^2 < 0)$ is not a propositional formula, because its parts are quantified statements about numbers, not propositional variables; replacing $\forall x \, (x^2 \geq 0)$ by $p$ and $\exists x \, (x^2 < 0)$ by $q$ gives the propositional formula $p \land \neg q$.
  formula_logic: >-
    $\forall x \, (x^2 \geq 0) \land \neg \exists x \, (x^2 < 0)$ is a formula of first-order logic, because $\forall x \, (x^2 \geq 0) \land \neg \exists x \, (x^2 < 0)$ combines two quantified formulas about the number $x$ with $\land$ and $\neg$.
---
