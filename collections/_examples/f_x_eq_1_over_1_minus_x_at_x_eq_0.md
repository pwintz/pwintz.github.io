---
published: false
title: '$f(x) = 1/(1 - x)$, at $x = 0$'
level: undergraduate
figure:
  widget: taylor
  params: { fn: geometric, degree: 3, max_degree: 25 }
  caption: |-
    The graph of $f(x) = 1/(1 - x)$ and its Taylor polynomial $P_n$ of degree $n$ at $0$ (dashed).
    Change $n$ with the slider.
  alt: "The graph of 1/(1 - x), with a vertical asymptote at x = 1, and a dashed polynomial curve that follows it between x = -1 and x = 1 and turns away from it outside. A slider sets the degree n."
values:
  taylor_polynomial: '$P_n(x) = 1 + x + x^2 + \dots + x^n$'
  taylor_series: '$1 + x + x^2 + x^3 + \dots$, for $-1 < x < 1$'
why:
  taylor_polynomial: |-
    The derivatives of $f(x) = 1/(1 - x)$ are $f^{(k)}(x) = k! / (1 - x)^{k+1}$, so every coefficient $f^{(k)}(0) / k!$ of the Taylor polynomial of $f$ at $0$ is $1$.
  taylor_series: |-
    Every coefficient $f^{(n)}(0) / n!$ of the Taylor series of $f(x) = 1/(1 - x)$ at $0$ is $1$, so the Taylor series is the geometric series $1 + x + x^2 + \dots$.
    The geometric series converges to $1/(1 - x)$ for $-1 < x < 1$ and diverges for every other $x$, even though $f$ is defined for every $x \neq 1$.
---
