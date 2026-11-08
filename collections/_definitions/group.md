---
published: false
title: Group
term: group
applies_to: algebraic structures
levels:
  high-school:
    text: |-
      Consider a set with a way of combining two of its elements, like adding numbers.
      The set is a _group_ if

      1. its way of combining is associative,
      2. it has an element that changes nothing, and
      3. every element can be undone.
  undergraduate:
    context: abstract algebra
    text: |-
      Consider a set $G$ with a [binary operation](/definitions/binary-operation) $\ast$.
      The set $G$ is a _group_ if

      1. $\ast$ is associative: $(a \ast b) \ast c = a \ast (b \ast c)$ for all $a, b, c \in G$,
      2. $G$ has an [identity element](/definitions/identity-element) $e$ such that $e \ast g = g \ast e = g$ for all $g \in G$, and
      3. every element $g \in G$ has an inverse $g^{-1}$ such that $g \ast g^{-1} = g^{-1} \ast g = e$.
properties:
  - >-
    The [identity element](/definitions/identity-element) of a group is unique, and so is the inverse of each element.
---
In mathematics, "group" is a technical term.
Avoid using it informally to mean "a bunch of objects."
