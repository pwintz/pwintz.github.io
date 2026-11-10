---
published: false
title: Geometric Brownian motion
term: geometric Brownian motion
applies_to: random processes
levels:
  undergraduate:
    context: probability
    text: |-
      Consider a [Brownian motion](/definitions/brownian-motion) $W$.
      The _geometric Brownian motion_ with drift $\mu$, volatility $\sigma > 0$, and starting value $S_0 > 0$ is the process

      $$S_t = S_0 \exp\left( \left(\mu - \tfrac{1}{2} \sigma^2\right) t + \sigma W_t \right).$$
properties:
  - >-
    A geometric Brownian motion solves the stochastic differential equation $\mathrm{d}S_t = \mu S_t \, \mathrm{d}t + \sigma S_t \, \mathrm{d}W_t$, so its changes are proportional to its current value.
  - >-
    Every value $S_t$ of a geometric Brownian motion is positive.
  - >-
    The logarithm $\ln S_t$ of a geometric Brownian motion is a [Brownian motion](/definitions/brownian-motion) with drift, so each $S_t$ has a lognormal distribution.
  - >-
    The [expected value](/definitions/expected-value) of a geometric Brownian motion is $\mathbb{E}[S_t] = S_0 e^{\mu t}$.
---
Geometric Brownian motion is the model of stock prices in the Black–Scholes model of option pricing.
