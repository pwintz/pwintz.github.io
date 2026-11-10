---
published: false
title: Linear vs. logistic regression
kind: siblings
areas: [statistics]
summary: >
  Linear regression and logistic regression fit a model to data $(x_i, y_i)$ using a [linear combination](/definitions/linear-combination) $\beta_0 + \beta^\top x$ of the inputs.
  [Linear regression](/definitions/linear-regression) predicts a [real number](/definitions/real-number) $y$ directly as $\beta_0 + \beta^\top x$, and chooses $\beta$ by least squares.
  [Logistic regression](/definitions/logistic-regression) predicts the [probability](/definitions/probability) that a yes-or-no outcome is "yes" by passing $\beta_0 + \beta^\top x$ through the S-shaped logistic function, and chooses $\beta$ by [maximum likelihood](/definitions/maximum-likelihood-estimator).
terms:
  - linear_regression
  - logistic_regression
examples:
  - example: predicting_an_exam_score_from_hours_studied
  - example: predicting_whether_a_student_passes_from_hours_studied
    why: >-
      Predicting whether a student passes uses the same input as predicting the student's score, but the outcome is yes or no, so logistic regression fits, and linear regression does not.
  - example: fitting_a_parabola_by_least_squares
---
## Notes

- "Linear" in [linear regression](/definitions/linear-regression) means linear in the parameters, so linear regression can fit curves, such as [polynomials](/definitions/polynomial), through nonlinear features.
- [Logistic regression](/definitions/logistic-regression) is a classification method despite its name, and it is a special case of a generalized linear model, as is linear regression.
