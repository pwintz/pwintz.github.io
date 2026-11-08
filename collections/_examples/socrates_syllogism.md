---
published: false
title: 'The argument "All humans are mortal; Socrates is human; therefore, Socrates is mortal"'
level: undergraduate
values:
  propositional_logic: '$p, \; q \;\therefore\; r$, which is not valid'
  first_order_logic: '$\forall x \, (H(x) \implies M(x)), \; H(s) \;\therefore\; M(s)$, which is valid'
why:
  propositional_logic: >-
    In propositional logic, the three statements of the Socrates argument are unrelated units $p$, $q$, and $r$, so the argument is not valid: the truth assignment with $p$ and $q$ true and $r$ false makes the premises true and the conclusion false.
  first_order_logic: >-
    In first-order logic, the Socrates argument is valid, because the formulas show the shared parts of the statements: taking $x = s$ in $\forall x \, (H(x) \implies M(x))$ gives $H(s) \implies M(s)$, and with $H(s)$ this gives $M(s)$.
---
