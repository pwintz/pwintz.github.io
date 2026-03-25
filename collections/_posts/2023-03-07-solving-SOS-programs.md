---
layout: single
title: How to Solve Sum-of-Squares Programs
excerpt: Guide to solving SOS problems using software tools.
date: 2023-03-07 08:00:00 -0800
toc: true
# categories: how-to
published: false
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



## Equivalence Between Polynomial Positive Definite and Matrix Positive Definite

Working with polynomials directly is difficult. 
It is easier to work with matrices. 
Thankfully, every polynomial $$z \mapsto p(z)$$ can be written as $$z \mapsto z^\top A z$$ for some square matrix $$A$$. 
<!-- TODO: Clean up! -->
This is called the _Square Matrix Representation_ (SMR) of $$$$ by (Wang et al., 2018) and (Chesi, 2011).
A polynomial can always be written as a sum of monomials, such as, 

$$p(x, y) = a + b x + c y + d xy + e x^2 + f y^2.$$ 

For simplicity, suppose that $$p$$ has an even degree $$d$$. We only care about polynomials of even degree because our goal is to find positive definite polynomials and odd polynomials are never positive definite. 
For $$x = (x_1, x_2, \dots, x_n),$$ let $$[x]_{d/2}$$ be a vector containing every monomial formed from components of $$x$$ with a degree less than or equal to $$d/2.$$ 
The order of the monomials in $$[x]_{d/2}$$ are not important so long as the order is consistent.
For $$n=2$$ and $$d=4$$, 

$$[x]_{2} = (1, x_1, x_2, x_1x_2, x_1^2, x_2^2).$$

<!-- The dimension of $$[x]_{d/2}$$ is $$(n + d/2) \text{ choose } n$$? -->

We can then generate any polynomial $$p$$ of degree $$d$$ in $$n$$ variables by picking an appropriate square matrix $$A = [a_{ij}]$$ such that

$$
p(x) = [x]_{d/2}^\top A [x]_{d/2}
$$

Continuing the example for $$n=2$$ and $$d=4$$,

$$[x]_{2}^\top A [x]_{2} 
= \begin{aligned} 
a_{00} + a_{01} x_1 + {} &\cdots + a_{05}x_1^2 + a_{06}x_2^2 \\ 
{} + {}a_{10}x_1 + a_{11} x_1^2 + {} &\cdots + a_{15}x_1^3 + a_{16}x_1x_2^2 \\ 
& \vdots \\ 
{} + a_{50}x_1^2 + a_{51} x_1^3 + {} &\cdots + a_{55}x_1^4 + a_{56}x_1^2x_2^2.
\\ 
{} + a_{60}x_2^2 + a_{61} x_1 x_2^2 + {} &\cdots + a_{65}x_1^2x_2^2 + a_{66}x_2^4.
\end{aligned}$$

We see that several monomials appear multiple times with different coefficients. 
In particular $$x_1^2$$ is appears in the terms $$a_{05}x_1^2$$ and $$a_{11}x_1^2$$.
This indicates that $$A$$ is not unique for a given polynomial.
Note, however, that the coeffiecients of each monomial in the resulting sum come from symmetric elements of $$A$$ (or skew-diagonal elements). 
For instance, the coefficients of $$x_1$$ are $$a_{01}$$ and $$a_{10}$$, the coefficients of $$x_1^2$$ are $$a_{05}$$ and $$a_{50}$$ (and $$a_{11}$$), and so on. 
This allows us to pick $$A$$ such that it is symmetric.

Symmetric matrices have nice properties that we exploit. Suppose $$A$$ is positive semidefinite and we pick $$A$$ to be symmetric (the actual process of picking $$A$$ to be symmetric is described later). 
Then, we can use Cholesky decomposition to factor $$A$$ into the product of an upper triangular matrix $$U$$ and its transpose $$U^\top,$$ as follows:

$$A = U^\top U.$$

Using this decomposition, the square matrix representation $$[x]_{d/2}^\top A [x]_{d/2}$$ can be written as 

$$[x]_{d/2}^\top A [x]_{d/2} = ([x]_{d/2}^\top U^\top)(U [x]_{d/2}) = \|U [x]_{d/2}\|^2.$$

Each entry in the vector $$U [x]_{d/2}$$ is a polynomial. The squared euclidean norm $$\|\cdot\|^2$$ maps a vector to the squared sum of its entries. Therefore, $$\|U [x]_{d/2}\|^2$$ is a sum–of–squares polynomial.

## Verify that a Polynomial is Positive Semidefinite
Suppose we have a polynomial $$p$$, and we want to determine whether $$p$$ is positive semidefinite. 
To do so, we will try to find a positive semidefinite $$A$$ such that $$p(x) = [x]_{d/2}^\top A [x]_{d/2}$$
<!-- TODO: We need to define positive (semi)definite and the notation \succeq. -->
We can write the findings of the previous section as a semidefinite programming problem. We want to find $$A$$ such that 
$$A \succeq 0 \text{ and } p = [x]_{d/2}^\top A [x]_{d/2}.$$
The right-hand equation generates a set of affine constraints because the coefficients of each monomial in $$p$$ must equal the sum of the coefficients of the matching monomials in $$[x]_{d/2}^\top A [x]_{d/2}.$$

### Example
We will look at a polynomial for the case $$n=2$$ and $$d=2$$. In particular, let's consider 

$$(x_1, x_2) \mapsto p(x_1, x_2) = c_1 + c_2 x_1 + c_3 x_2 + c_4 x_1^2 + c_5  x_1x_2 + c_6 x_2^2.$$

<!-- (Notice that $$p$$ has six terms and $$\binom{n+d}{d} = \binom{4}{2} = 6.$$) -->

We choose to write $$[x]_{d/2}$$ as

$$[x]_{d/2} = (1, x_1, x_2).$$

Let $$A = [a_{ij}]$$ be a $$3\times 3$$ matrix. The expansion of the Square Matrix Representation (SMR) is 

$$\begin{align*}
[x]_{d/2}^\top A [x]_{d/2} 
&= a_{00} + a_{01} x_1 + a_{02}x_2 \\ 
  &\quad{}+{} a_{10}x_1 + a_{11} x_1^2 + a_{12}x_1x_2 \\ 
  &\quad{}+{} a_{20}x_2 + a_{21} x_1x_2 + a_{22}x_2^2.
 \\
&= a_{00} + (a_{01} + a_{10}) x_1 + (a_{02} + a_{20})x_2 \\
  &\quad{} + a_{11} x_1^2 + (a_{12} + a_{21}) x_1x_2 + a_{22}x_2^2
\end{align*}$$

This gives six affine constraints:

$$\begin{align*}
a_{00} &= c_1 \\ 
a_{01} + a_{10} &= c_2 \\ 
a_{02} + a_{20} &= c_3 \\ 
a_{11} &= c_4 \\ 
a_{12} + a_{21} &= c_5 \\ 
a_{22} &= c_6.
\end{align*}$$

Because we want $$A$$ to be symmetric, we assume $$a_{01} = a_{10}$$,  $$a_{02} = a_{20}$$, and $$a_{12} = a_{21}$$. By substitution, we find a simplified version of the constraints. 

$$\begin{align*}
a_{00} &= c_1 \\ 
2a_{01} &= c_2 \\ 
2a_{02} &= c_3 \\ 
a_{11} &= c_4 \\ 
2a_{12} &= c_5 \\ 
a_{22} &= c_6.
\end{align*}$$

To make the example more concrete, let $$x \mapsto p(x) := 2 - x_1 + 4x_1x_2 + 5 x_2^2.$$

Then, the simplified constraints are 

$$\begin{align*}
a_{00} &= 0 \\ 
2a_{01} &= -1 \\ 
2a_{02} &= 0 \\ 
a_{11} &= 0 \\ 
2a_{12} &= 4 \\ 
a_{22} &= 5.
\end{align*}$$

The values of $$a_{01},$$ $$a_{02},$$ and $$a_{11}$$ are zero so they can be excluded from the consideration and we are left with three constraints that we need to satisfy. We put them into a standard form where $$0$$ is on the right-hand side of the equation. The semidefinite program that we need to solve is therefore written as

$$\begin{align*}
\operatorname*{minimize}_{h} \quad
2a_{01} + 1 &= 0 \\ 
2a_{12} - 4 &= 0 \\ 
 a_{22} - 5 &= 0.
\end{align*}$$

# Practical: Programming Implementation



## Setting Up CVX
See [here](http://cvxr.com/cvx/doc/install.html) for how to install CVX. 

```
coefficients = [100, -1, 0, 1, 4, 5]';
monomials = @(x1, x2) [1; x1; x2; x1^2; x1*x2; x2^2];
polynomial = @(x1, x2) sum(coefficients.*monomials(x1, x2));

n = 3;
% "sdp" is important to enable semidefininite programming! 
% http://cvxr.com/cvx/doc/sdp.html
cvx_begin sdp 
    variable A(n, n)
    subject to
        A >= 0; % Require A to be symmetric positive semidefinite.
          A(1, 1) == coefficients(1);
        2*A(1, 2) == coefficients(2);
        2*A(1, 3) == coefficients(3);
          A(2, 2) == coefficients(4);
        2*A(2, 3) == coefficients(5);
          A(3, 3) == coefficients(6);
cvx_end

% Check that all of the eigenvalues are nonnegative.
assert(all(eig(A) >= 0))

% Check that random points always make the polynomial and the Z'AZ equal and
% positive.
for x = rand(2, 100)
    p_of_x = polynomial(x(1), x(2));
    Z = [1; x(1); x(2)];
    assert(p_of_x >= 0)
    assert(Z'*A*Z >= 0)
    fprintf('%.2e\n', Z'*A*Z - p_of_x)
end
```

## Generate a Positive Semidefinite Polynomial
asdflkja  

### Notes on setting up SOSSOLVER. 
It doesn't seem to work with Mosek. Try [https://github.com/sqlp/sedumi](SeDuMi), which is open source and actively maintained.


# Bibliography
{% bibliography --cited %}