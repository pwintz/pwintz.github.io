---
title: Group
term: group
applies_to: algebraic structures
levels:
# TODO: A high school level explanation may be possible but it is tricky to say things clearly without having too much notation or terminology. 
  # high-school:
#     text: |-
#       Consider a set with an operator "+" for combining two of its elements, like addition "$+$" for [real numbers](/dictionary/definitions/real-number).
#       The set is a _group_ 
# 
#       1. "+" is [associative](/dictionary/definitions/associative),
#       2. There is an element of the set such  has an element that changes nothing, and
#       3. every element can be undone.
  undergraduate:
    context: abstract algebra
    text: |-
      Consider a set $G$ with a [binary operation](/dictionary/definitions/binary-operation) $\ast$.
      The set $G$ is a _group_ if

      1. $\ast$ is [associative](/dictionary/definitions/associative): $(a \ast b) \ast c = a \ast (b \ast c)$ for all $a, b, c \in G$,
      2. $G$ has an [identity element](/dictionary/definitions/identity-element) $e$ such that $e \ast g = g \ast e = g$ for all $g \in G$, and
      3. every element $g \in G$ has an [inverse](/dictionary/definitions/inverse-element) $g^{-1}$ such that $g \ast g^{-1} = g^{-1} \ast g = e$.
properties:
  - >-
    The [identity element](/dictionary/definitions/identity-element) of a group is unique, and so is the inverse of each element.
---
In mathematics, "group" is a technical term.
Avoid using it informally to mean "a bunch of objects."
