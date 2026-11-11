---
title: '$p \land \neg q$'
level: undergraduate
is: [propositional_formula]
is_not: [
  proposition,
  predicate,
  sentence_logic,
  formula_logic
]
values:
  propositional_logic: 'A formula of propositional logic'
  first_order_logic: 'Becomes a first-order sentence once $p$ and $q$ are replaced by sentences, such as $\forall x \, (x^2 \geq 0) \land \neg \exists x \, (x^2 < 0)$'
why:
  propositional_formula: >-
    $p \land \neg q$ is a propositional formula because its truth depends on the truth values of $p$ and $q$.
  sentence_logic: >-
    $p \land \neg q$ is not a sentence of first-order logic, because the variables $p$ and $q$ stand for whole statements, not for objects such as numbers, and $p \land \neg q$ has no quantifiers; a sentence such as $\forall x \, (x^2 \geq 0)$ has variables that stand for objects, and a quantifier binds each of those variables.
  proposition: >-
    $p \land \neg q$ is not a proposition, because it is not true or false by itself---the truth value depends on the truth values of $p$ and $q$.
  predicate: >-
    $p \land \neg q$ is not a predicate, because the variables of a predicate stand for [objects](/dictionary/definitions/object-logic), such as numbers, sets, or points, which a statement can be about, but $p$ and $q$ stand for propositions, which are statements that are true or false.
    For example, in the predicate "$x > 3$," the variable $x$ stands for a number, and the number $5$ is neither true nor false; in $p \land \neg q$, the variable $p$ stands for a statement such as "$7$ is prime," which is true.
  propositional_logic: >-
    $p \land \neg q$ is a formula of propositional logic, because $p \land \neg q$ combines the propositional variables $p$ and $q$ with the connectives $\land$ and $\neg$.
  first_order_logic: >-
    $p \land \neg q$ describes how first-order sentences combine, because replacing $p$ and $q$ by first-order sentences gives a first-order sentence.
  formula_logic: >-
    $p \land \neg q$ is not a formula of first-order logic, because its variables $p$ and $q$ stand for whole statements, and a first-order formula is built from relation symbols applied to terms that name objects.
---
