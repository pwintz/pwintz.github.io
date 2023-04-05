---
layout: single
title: How to Solve Sum-of-Squares Programs
excerpt: Guide to solving SOS problems using software tools.
date: 2023-03-07 08:00:00 -0800
toc: true
# categories: how-to
draft: true
comments:
  host: mastodon.world
  username: pwintz
  id: 
---

{% raw %} 
$$
% Define macros.
\def\reals{\mathbb{R}}
\def\realsn{\reals^n}
\def\Safe{{\mathbf{Safe}}}
\def\Unsafe{{\mathbf{Unsafe}}}
\def\Init{{\mathbf{Init}}}
\newcommand{\ip}[2]{\left\langle #1, #2 \right\rangle}
$$
{% endraw %}



## Use Semidefinite Programming to Generate Barrier Function 

In many cases, we need to generate a barrier function from a given system.

To allows us to use SOS programming to generate a barrier function, we need to describe the initial set $$\Init$$ and the unsafe set $$\Unsafe$$ using polynomials. 
In particular, let $$g_\Init : \reals^n \to \reals^{m_\Init}$$ be vector-valued function such that each component is defined by a polynomial and 

$$\Init = \{x \in \realsn \mid g_\Init(x) \geq 0\}.$$

For a vector $$v,$$ the inequality $$v \geq 0$$ indicates that each element of $$v$$ is greater than or equal to zero.

Similarly, let $$g_\Unsafe : \reals^n \to \reals^{m_\Unsafe}$$ be vector-valued polynomial function such that 

$$\Unsafe = \{x \in \realsn \mid g_\Unsafe(x) \geq 0\}.$$


### Theoretical Result
**Proposition ({% cite prajna_safety_2004 --label <> --locator Proposition 3 %}).** <i>Let the continuous system $$\dot x = f(x)$$ and the descriptions of all the sets $$\Init$$ and $$\Unsafe$$ be given. Suppose there exist polynomials $$x \mapsto B(x)$$ and $$x\mapsto \lambda(x)$$, a positive number $$\epsilon$$, and vectors of sums of squares $$x \mapsto \sigma_{\Unsafe}(x)$$ and $$x \mapsto \sigma_{\Init}(x)$$,
such that the following functions are sums of squares:

$$
\begin{aligned}
x \mapsto & B(x)-\epsilon-\langle \sigma_{\Unsafe}(x), g_{\Unsafe}(x)\rangle \\
x \mapsto & -B(x)- \langle \sigma_{\Init}(x), g_{\Init}(x)\rangle \\
x \mapsto & -\langle \nabla B(x), f(x)\rangle - \lambda(x) B(x) \\
\end{aligned}
$$

<i>Then $$B(x)$$ satisfies (B1-B4).

<!-- PROOF Given the assumptions in the above proposition, for all $$x \in\realsn$$

$$\begin{aligned} 
B(x) - \langle \sigma_{\Unsafe}(x), g_{\Unsafe}(x)\rangle \geq \epsilon \\
-B(x) - \langle \sigma_{\Init}(x), g_{\Init}(x)\rangle \geq 0 \\
-\langle \nabla B(x), f(x)\rangle - \langle \sigma_{I}(x), g_{I}(x)\rangle - \lambda(x) B(x) \geq 0
\end{aligned}$$ -->

For a control system $$\dot x = f(x, u)$$, the process is similar, except that it is necessary to simulatneously design a control law $$u = \kappa(x)$$. 
Suppose $$f$$ is a given polynomial in $$x$$ and $$u$$ and $$\kappa$$ is a polynomial in $$x$$ that needs to be determined.
Then, the last function in {% cite prajna_safety_2004 --label <> --locator Proposition 3 %} is replaced by 

$$
x \mapsto -\langle \nabla B(x), f(x, \kappa(x))\rangle - \lambda(x) B(x).
$$

Because $$f$$ and $$\kappa$$ are polynomials, their composition $$x \mapsto f(x, \kappa(x))$$ is also a polynomial.

### Example
Consider the system with $$x \in \reals^4$$ and $$u \in \reals^2$$ given by

$$
\dot x = f(x, u) = \begin{bmatrix} 
  x_3 \\
  x_4 \\
  x_1^2 - x_4u_1 \\
  u_2(x_3 - x_2)
\end{bmatrix}
$$

Let 

$$\Init := \{(x_1, x_2, x_3, x_4) \in \reals^4 \mid x_1 \leq -10 \text{ or } x_1 \geq 10\}$$

and 

$$\Unsafe := \{(x_1, x_2, x_3, x_4) \in \reals^4 \mid x_1 = 0, x_2 \leq 0 \}.$$

Polynomials that define $$\Init$$ and $$\Unsafe$$ are given for all $$x = (x_1, x_2, x_3, x_4) \in \reals^4$$ as $$g_\Init(x) = x_1^2 - 100$$ and $$g(x)_\Unsafe := (-x_1^2, -x_2).$$

Then, we want to find a real number $$\epsilon > 0$$ and polynomials $$B$$, $$\kappa$$, $$\lambda$$, $$\sigma_\Unsafe$$ and $$\sigma_\Init$$ that solves the following optimization problem:

$$
\begin{aligned}
\operatorname{minimize} \quad & \epsilon \\
\operatorname{subject to} \quad 
  & \epsilon > 0 \\ 
  & \text{The following are sums of squares:} \\ 
  & \sigma_\Unsafe \\
  & \sigma_\Init \\
  & x \mapsto B(x)-\epsilon-\langle \sigma_{\Unsafe}(x), g_{\Unsafe}(x)\rangle \\
  & x \mapsto -B(x)- \langle \sigma_{\Init}(x), g_{\Init}(x)\rangle \\
  & x \mapsto -\langle \nabla B(x), f(x, \kappa(x))\rangle - \lambda(x) B(x).
\end{aligned}
$$

 


### Notes on generating Control Laws and Barrier Functions


# Bibliography
{% bibliography --cited %}