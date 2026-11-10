---
published: false
title: 'Predicting whether a student passes an exam from the number of hours the student studied'
level: high-school
is: [logistic_regression]
is_not: [linear_regression]
why:
  linear_regression: >-
    Predicting whether a student passes is not a good problem for linear regression, because a fitted line goes below $0$ and above $1$ for some numbers of hours, so the line's values cannot be probabilities.
  logistic_regression: >-
    Predicting whether a student passes is a problem for logistic regression, because the outcome is yes or no, and logistic regression models the probability of passing as an S-shaped function of the hours, between $0$ and $1$.
---
