---
published: false
title: Frequentist probability
term: frequentist probability
applies_to: interpretations of probability
synonyms: [frequentism, frequentist]
levels:
  high-school:
    text: |-
      Consider an experiment that can be repeated many times, such as flipping a coin.
      In the _frequentist_ interpretation, the [probability](/dictionary/definitions/probability) of an [event](/dictionary/definitions/event) is the fraction of repetitions in which the event occurs, in the long run.
  undergraduate:
    context: statistics
    text: |-
      In the _frequentist_ interpretation, the [probability](/dictionary/definitions/probability) of an [event](/dictionary/definitions/event) $A$ is the limit of the fraction of $n$ independent repetitions of an experiment in which $A$ occurs:

      $$P(A) = \lim_{n \to \infty} \frac{\text{number of repetitions in which } A \text{ occurs}}{n}.$$

      An unknown parameter $\theta$ is a fixed number, so it has no probability distribution.
properties:
  - >-
    Frequentist statistics describes uncertainty about $\theta$ by procedures, such as confidence intervals, whose guarantees hold over repetitions of the experiment.
---
