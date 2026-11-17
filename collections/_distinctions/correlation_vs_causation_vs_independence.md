---
published: false
title: Correlation vs. Causation vs. Statistical Independence
kind: siblings
areas: [statistics]
summary: >
  Two quantities that vary together can be related in different senses.
  [Correlation](/dictionary/definitions/correlation) measures how closely two quantities follow a straight-line relationship in observed data or in a [probability](/dictionary/definitions/probability) model.
  [Causation](/dictionary/definitions/causation) says that changing one quantity, while everything else is held fixed, changes the other quantity.
  [Statistical independence](/dictionary/definitions/statistical-independence) says that knowing the value of one quantity does not change the probabilities of the values of the other quantity.
terms:
  - correlation
  - causation
  - statistical_independence
examples:
  - example: ice_cream_sales_and_drownings
    why: >-
      Ice cream sales and drownings show that a correlation does not imply causation: the correlation comes from a common cause, hot weather.
  - example: smoking_and_lung_cancer
    why: >-
      Smoking and lung cancer are correlated, and smoking also causes lung cancer, but establishing the causation required evidence beyond the correlation.
  - example: thermostat_furnace_and_room_temperature
    why: >-
      A furnace controlled by a thermostat shows that causation does not imply correlation: feedback cancels the effect of the furnace on the room temperature in the observed data.
  - example: x_uniform_on_minus_1_1_and_its_square
    why: >-
      A uniform random number on $[-1, 1]$ and its square show that uncorrelated random variables can be dependent, because correlation detects only straight-line relationships.
  - example: two_coin_flips
    why: >-
      Two separate coin flips are independent, so the flips are also uncorrelated, and neither causes the other.
see_also:
  - variance_vs_sample_variance
---
## Notes

- If two [random variables](/dictionary/definitions/random-variable) with finite [variances](/dictionary/definitions/variance) are independent, then the random variables are uncorrelated; the converse is false.
- "[Correlation](/dictionary/definitions/correlation) does not imply [causation](/dictionary/definitions/causation)," and causation does not imply correlation either.
