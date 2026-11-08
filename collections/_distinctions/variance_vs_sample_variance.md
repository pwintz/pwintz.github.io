---
title: Variance vs. sample variance
kind: siblings
areas: [statistics]
summary: >
  The spread of data is measured by the average squared distance of the data from their mean.
  The [variance](/definitions/variance) of the data divides the sum of the squared distances by the number $n$ of data points, which describes the data themselves.
  The [sample variance](/definitions/sample-variance) divides by $n - 1$ instead, which gives an unbiased estimate of the variance of the population that the data were sampled from.
terms:
  - variance
  - sample_variance
examples:
  - example: the_data_1_2_3_4
    why: >-
      For the data $1, 2, 3, 4$, the sample variance exceeds the variance by the factor $\frac{4}{3}$, because the sample variance divides by $3$ instead of $4$.
  - example: the_single_data_point_5
    why: >-
      For the single data point $5$, the variance is $0$, but the sample variance is undefined, because one data point gives no estimate of the spread of a population.
see_also:
  - types_of_statistical_middles
---
## Why the denominators differ

The denominator depends on the question being asked.

- **Describing the data themselves.**
  If the data are the whole population, such as the test scores of every student in a class, then the variance is the average squared distance from the mean, so the sum is divided by the number $n$ of data points.
- **Estimating the spread of a larger population.**
  If the data are a random sample, then the goal is to estimate the population variance

  $$\sigma^2 = \mathbb{E}[(X - \mu)^2],$$

  which measures distances from the population mean $\mu$.
  The population mean $\mu$ is unknown, so the formula uses the sample mean $\bar{x}$ in place of $\mu$.
  The sample mean is computed from the same data, so the sample mean is pulled toward the data: $\bar{x}$ is the number $c$ that minimizes $\sum_{i} (x_i - c)^2$.
  Therefore, the squared distances from $\bar{x}$ are smaller, on average, than the squared distances from $\mu$, and dividing their sum by $n$ underestimates $\sigma^2$.

How much smaller the squared distances are follows from the identity

$$\sum_{i = 1}^{n} (x_i - \mu)^2 = \sum_{i = 1}^{n} (x_i - \bar{x})^2 + n (\bar{x} - \mu)^2.$$

For independent samples, the expected value of the left side is $n \sigma^2$, and the expected value of $n (\bar{x} - \mu)^2$ is $n \cdot \frac{\sigma^2}{n} = \sigma^2$, so

$$\mathbb{E}\left[\sum_{i = 1}^{n} (x_i - \bar{x})^2\right] = (n - 1) \sigma^2.$$

Dividing by $n - 1$ instead of $n$ (Bessel's correction) therefore gives an estimate whose expected value is exactly $\sigma^2$.

Another way to see the $n - 1$ is to count _degrees of freedom_: the deviations $x_i - \bar{x}$ add up to $0$, so only $n - 1$ of the deviations can vary freely, and the last deviation is determined by the others.
If the population mean $\mu$ is known, then no degree of freedom is used up, and $\frac{1}{n} \sum_{i} (x_i - \mu)^2$ is already an unbiased estimate of $\sigma^2$.

## Notes

- The difference between dividing by $n$ and dividing by $n - 1$ is small for large $n$.
- Calculators and software disagree about the default: NumPy's `var` divides by $n$, and R's `var` and Excel's `VAR.S` divide by $n - 1$.
