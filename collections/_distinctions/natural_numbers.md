---
published: false
title: "Natural numbers: starting at 0 or at 1"
kind: conflicting
areas: [numbers]
status: draft
summary: >
  Whether the natural numbers include $0$ depends on the author. Set theory, logic, and computer science usually include it,
  while number theory and analysis often start at $1$.
terms:
  - natural_numbers_from_one
  - natural_numbers_from_zero
examples:
  - example: zero
    why: >-
      The only number on which the two conventions disagree.
  - example: seven
    why: >-
      Every positive integer is a natural number under both conventions.
  - example: minus_three
    why: >-
      Negative numbers are integers, but not natural numbers.
see_also:
  - natural_numbers_vs_whole_numbers
  - cardinal_vs_ordinal_vs_nominal_numbers
  - types_of_real_numbers
---
## Avoiding the ambiguity

When it matters whether $0$ is included, say so explicitly. Unambiguous notation includes $$\mathbb{Z}_{\geq 0}$$ (or $$\mathbb{N}_0$$) for $\lbrace 0, 1, 2, \dots \rbrace$ and $$\mathbb{Z}_{> 0}$$ (or $$\mathbb{N}_{+}$$) for $\lbrace 1, 2, 3, \dots \rbrace$.

Natural numbers that start at $0$ are also called [whole numbers](/distinctions/natural-numbers-vs-whole-numbers), mostly in schools.
