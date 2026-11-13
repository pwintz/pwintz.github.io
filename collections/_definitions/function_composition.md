---
published: false
title: Function composition
term: composition
applies_to: functions
synonyms: [function composition, composite function, '$f \circ g$']
levels:
  high-school:
    text: |-
      Consider two functions $f$ and $g$ such that each output of $g$ is an input of $f$.
      The _composition_ of $f$ and $g$ is the function $f \circ g$ that first applies $g$ and then applies $f$:

      $$(f \circ g)(x) = f(g(x)).$$
  undergraduate:
    text: |-
      Consider sets $X$, $Y$, and $Z$ and functions $g : X \to Y$ and $f : Y \to Z$.
      The _composition_ of $f$ and $g$ is the function $f \circ g : X \to Z$ defined by

      $$(f \circ g)(x) = f(g(x)) \quad \text{for all } x \in X.$$
properties:
  - >-
    Composition is [associative](/dictionary/definitions/associative): $h \circ (g \circ f) = (h \circ g) \circ f$ whenever both sides are defined.
  - >-
    Composition need not be [commutative](/dictionary/definitions/commutative): even when $f \circ g$ and $g \circ f$ are both defined, the two functions can differ.
  - >-
    For a set $X$, the [identity function](/dictionary/definitions/identity-function) $\operatorname{id}_X$ is the [identity element](/dictionary/definitions/identity-element) of composition of functions from $X$ to $X$.
  - >-
    If $f$ and $g$ are both [injective](/dictionary/definitions/injective), [surjective](/dictionary/definitions/surjective), or [bijective](/dictionary/definitions/bijective), then $f \circ g$ is too, and for bijections, $(f \circ g)^{-1} = g^{-1} \circ f^{-1}$.
  - >-
    For [linear maps](/dictionary/definitions/linear-map) given by matrices, composition corresponds to [matrix](/dictionary/definitions/matrix) multiplication: if $f(x) = A x$ and $g(x) = B x$, then $(f \circ g)(x) = A B x$.
---
The notation $f \circ g$ is read "$f$ composed with $g$" or "$f$ after $g$."
The function written on the right, $g$, is applied first.
Some texts, especially in category theory and computer science, write compositions in the opposite (diagrammatic) order, such as $g ; f$ for "first $g$, then $f$."
