---
title: Inverse element
term: inverse element
applies_to: binary operations
synonyms: [inverse]
levels:
  elementary:
    text: |-
      For addition of numbers, for every number $a$, there is another number $-a$ such that adding $a + (-a)$ is zero. 
      We call $a$ the _additive inverse_ $a$.
      For example, the additive inverse of $5$ is $-5$. 

      The _multiplicative inverse_ (or _reciprocal_) of a nonzero number $a$ is the number $\frac{1}{a}$ that you multiply by $a$ to get $1$:

      $$a \times \frac{1}{a} = 1.$$

      For example, the multiplicative inverse of $5$ is $\frac{1}{5}$.
      The number $0$ has no multiplicative inverse, because $0$ times every number is $0$.
  high-school:
    text: |-
      Consider a way of combining two things, such as addition of numbers, that has an element that changes nothing, such as $0$ for addition.
      An _inverse_ of an element $a$ is an element that undoes $a$: combining $a$ with the inverse gives the element that changes nothing.
      For example, the additive inverse of $5$ is $-5$, because $5 + (-5) = 0$.
  undergraduate:
    context: abstract algebra
    text: |-
      Consider a set $S$ with a [binary operation](/definitions/binary-operation) $\ast$ and an [identity element](/definitions/identity-element) $e$.
      An _inverse_ of an element $a \in S$ is an element $b \in S$ such that

      $$a \ast b = b \ast a = e.$$
properties:
  - >-
    If $\ast$ is [associative](/definitions/associative), then each element has at most one inverse, which is written $a^{-1}$ (or $-a$ when the operation is addition).
---
