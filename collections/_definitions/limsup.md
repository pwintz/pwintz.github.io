---
published: false
title: Limit superior
term: limit superior
applies_to: sequences
synonyms: [$\limsup$]
levels:
  high-school:
    text: |-
      Consider a [sequence](/definitions/sequence) of numbers.
      The _limit superior_ of the sequence is the largest value that its terms keep coming back close to forever.
  undergraduate:
    text: |-
      Consider a [sequence](/definitions/sequence) $(a_n)$ of [real numbers](/definitions/real-number).
      The _limit superior_ of $(a_n)$ is

      $$\limsup_{n \to \infty} a_n = \lim_{n \to \infty} \sup_{k \geq n} a_k,$$

      the largest value that a subsequence of $(a_n)$ can converge to (allowing $\pm \infty$).
properties:
  - >-
    Every sequence of [real numbers](/definitions/real-number) has a limit superior in the extended real numbers, even if the sequence has no limit.
---
