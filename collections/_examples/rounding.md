---
title: 'Rounding a number to the nearest integer'
level: high-school
is: [idempotent]
why:
  idempotent: The first time a value is rounded, it produces an integer. But if an integer is rounded, then it is unchanged.
---
Rounding $4.34$ produces $4$ because $4$ is the closest integer to $4.34$.
On the other hand, rounding $4.78$ produces $5$ because $4.78$ is closer to $5$ than $4$. 

When a value is halfway between to integers, such as $4.5$ or $1/2$, the rounding is ambiguous, since are equally close to the integers above and below. In these cases, various [rounding rules](https://en.wikipedia.org/wiki/Rounding#Comparison_of_approaches_for_rounding_to_an_integer) are defined to decide which value is used.