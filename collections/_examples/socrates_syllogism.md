---
title: 'The argument "All humans are mortal; Socrates is human; therefore, Socrates is mortal"'
level: undergraduate
is: [
  argument_logic,
  valid_argument,
  sound_argument
]
is_not: [deduction]
values:
  propositional_logic: '$p, \; q \;\therefore\; r$, which is not valid'
  first_order_logic: '$\forall x \, (H(x) \implies M(x)), \; H(s) \;\therefore\; M(s)$, which is valid'
why:
  propositional_logic: >-
    In propositional logic, the three statements of the Socrates argument are unrelated units $p$, $q$, and $r$, so the argument is not valid: the truth assignment with $p$ and $q$ true and $r$ false makes the premises true and the conclusion false.
  first_order_logic: >-
    In first-order logic, the Socrates argument is valid, because the formulas show the shared parts of the statements: taking $x = s$ in $\forall x \, (H(x) \implies M(x))$ gives $H(s) \implies M(s)$, and with $H(s)$ this gives $M(s)$.
  argument_logic: >-
    The Socrates argument is an argument, with the premises "All humans are mortal" and "Socrates is human" and the conclusion "Socrates is mortal."
  valid_argument: >-
    The Socrates argument is valid, because in every interpretation in which all humans are mortal and Socrates is human, Socrates is mortal.
    Showing this validity requires first-order logic; propositional logic treats the three statements as unrelated.
  sound_argument: >-
    The Socrates argument is sound, because the Socrates argument is valid and its premises "All humans are mortal" and "Socrates is human" are true.
  deduction: >-
    The Socrates argument, as stated, is not a deduction, because the argument gives only the premises and the conclusion, not the steps and the rules of inference that lead from the premises to the conclusion.
---
