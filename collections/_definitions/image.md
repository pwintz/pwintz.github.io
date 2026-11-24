---
published: false
title: Image
term: image
applies_to: functions and sets
levels:
  elementary:
    text: |-
      Think of a function as a machine that turns inputs into outputs, and pick a group of inputs.
      The _image_ of that group is the set of outputs that the machine gives for those inputs.
      For example, if the machine doubles numbers, then the image of the inputs $1$, $2$, and $3$ is the outputs $2$, $4$, and $6$.
  high-school:
    text: |-
      Consider a function and a set $A$ of inputs in its domain.
      The _image_ of $A$ is the set of all outputs of the function for inputs in $A$.
  undergraduate:
    text: |-
      Consider a function $f : X \to Y$ and a set $A \subseteq X$.
      The _image_ of $A$ under $f$ is

      $$f(A) = \setdef{f(x) \suchthat x \in A}.$$
properties:
  - |-
    The image $f(X)$ of the whole domain is the [range](/dictionary/definitions/range-image) of $f$.
  - |-
    If $f$ is a [linear map](/dictionary/definitions/linear-map) between [vector spaces](/dictionary/definitions/vector-space), then the image of every subspace is a subspace.
    In particular, the range of $f$ is a subspace of the [codomain](/dictionary/definitions/codomain), and its dimension is the [rank](/dictionary/definitions/rank-linear-map) of $f$.
---
Authors do not agree on how to use "image" and "range."

- **This dictionary:** "image" is for the image $f(A)$ of a set $A$ of inputs, and "range" is for the image $f(X)$ of the whole domain.
  The range of $f$ is written $\range{f}$.
- **"Image" for the whole domain:** Many texts, especially in linear algebra and algebra, call $f(X)$ the image of $f$ and use "range" as a synonym or not at all.
  For a matrix $A$, the image, the range, and the [column space](/dictionary/definitions/column-space) are the same set.
- **"Range" for the codomain:** Some texts, especially older ones, use "range" for the [codomain](/dictionary/definitions/codomain) $Y$ and "image" for the set of outputs that occur.
  In these texts, a function is [surjective](/dictionary/definitions/surjective) if and only if its range equals its image.
- **"Image" for sets only:** Some texts use "image" only for $f(A)$ with a set $A$ and "range" for $f(X)$, as this dictionary does.

See [the meanings of "range"](/dictionary/distinctions/meanings-of-range) for the conflicting uses of "range," and [domain vs. range vs. codomain vs. image vs. preimage](/dictionary/distinctions/domain-vs-range-vs-codomain-vs-image-vs-preimage) for how the sets relate.
