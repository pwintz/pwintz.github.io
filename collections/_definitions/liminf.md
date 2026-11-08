---
published: false
title: Limit inferior
term: limit inferior
applies_to: sequences
synonyms: [$\liminf$]
levels:
  high-school:
    text: |-
      Consider a [sequence](/definitions/sequence) of numbers.
      The _limit inferior_ of the sequence is the smallest value that its terms keep coming back close to forever.
  undergraduate:
    text: |-
      Consider a [sequence](/definitions/sequence) $(a_n)$ of [real numbers](/definitions/real-number).
      The _limit inferior_ of $(a_n)$ is

      $$\liminf_{n \to \infty} a_n = \lim_{n \to \infty} \inf_{k \geq n} a_k,$$

      the smallest value that a subsequence of $(a_n)$ can converge to (allowing $\pm \infty$).
properties:
  - >-
    The limit inferior is at most the [limit superior](/definitions/limsup), and a [sequence](/definitions/sequence) converges exactly when they are equal and finite.
---
