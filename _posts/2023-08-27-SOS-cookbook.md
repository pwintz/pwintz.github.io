---
layout: single
title: "Sums-of-Squares Programming Cookbook"
excerpt: A list of recipes for formulating SOS programming problems.
date: 2023-08-27 08:00:00 -0800
toc: true
categories: research
draft: true
comments: 
  host: mastodon.world
  username: pwintz
  id: 
---
# SOS Recipes

<!-- TODO: We don't need to introduce all of these properties from the get-go. Let's wait until we need them. -->
We say that $$f$$ is <i>strictly positive</i> if

$$f(x) > 0 \quad \forall x \in \realsn.$$


We say that $$f$$ is <i>positive definite</i> if

$$f(x) \geq 0 \quad \forall x \in \realsn,$$

and $$f(x) = 0$$ if and only if $$x = 0.$$

The properties _strictly negative_, _negative semi-definite_, and _negative definition_ are defined similarly, but with the inequalities flipped. 

The above definitions can be generalized by 1), allowing for a restricted domain and 2) allowing for $$f$$ to be positive/negative (semi-)definiteness _relative to a given set_. See [TODO](#TODO).
<!-- In particular, let $$\mathcal D \subset \realsn$$ and $$\mathcal A \subset \realsn$$. -->

<!-- TODO:MOVE TO LATER -->
For a set $$\mathcal{A} \subset \reals^n,$$ we say that a function $$f : \realsn \to \reals$$ is _positive definite_ relative to $$\mathcal{A}$$ if for all $$x \in \realsn\setminus \mathcal{A},$$

$$f(x) > 0$$

and for all $$x \in \mathcal{A},$$

$$f(x) = 0.$$

Positive definition functions are used in the definition of _Lyaupnov functions_, which are used to prove that a set is stable for given dynamics, and _barrier funcitons_, which are used to prove that a set is forward invariant (again, with respect to given dynamics).

### Zero at Zero
If the constant term is zero.

### Strictly Positive Relative to a Set

### Positive Definite Relative to a Set

### Positive Semidefinite Relative to a Set

### Inequality Between Functions

### Affine Constraints
Affine constraints such as 
$$a_1 u_1 + a_2 u_2 + \cdots + a_n u_n \geq b$$
can be encoded in (\ref{eq:sos program}) by choosing, for some $i$, constraint polynomials $p_{i,0}(x) = -b$ and $p_{i,j} = a_j$ for $j=1, \dots, m$.



<!-- Introduce Polynomials, including multivariate polynomials. -->

<!-- Introduce positive definite polynomials. -->


Every sum of squares is positive semidefinite. 


### Polynomials


### Semialgebraic Sets

A set is called _semialgebraic_ if it is a finite union of sets defined by polynomial equalities and polynomial inequalities. 

For example, the set 

$$\begin{aligned}
  &\{(x_1, x_2) \in \reals^2 \mid x_2^4 - x_1^2 + 3 x_1 x_2 - 1 \geq 0\} \\ 
  &{}\cup \{(x_1, x_2) \in \reals^2 \mid x_2^2 + x_1 - 1 = 0\} 
\end{aligned}$$ 

is a semialgebraic set in $$\reals^2$$. 

We enumerate rules for rewriting semialgebraic sets into the form $$\{x \in \realsn \mid h(x) \geq 0\}$$

$$
\begin{align*}
a \geq 0, b \geq 0 &\implies \begin{bmatrix} a \\ b \end{bmatrix} \geq 0 \\
a \geq 0 \text{ or } b \geq 0 &\implies \begin{bmatrix} ab \\ a + b\end{bmatrix} \geq 0 \\
\underline{\ell} \leq a \leq \overline{\ell} &\implies \big(a - \underline{\ell}\big)\big(\overline{\ell} - a\big) \geq 0
\end{align*}
$$