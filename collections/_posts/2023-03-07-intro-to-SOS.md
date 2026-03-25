---
layout: single
title: "Sums-of-Squares Programming: Introduction"
excerpt: Introduction to the theory and use of SOS programming.
date: 2023-08-27 08:00:00 -0800
toc: true
categories: research
draft: false
comments: 
  host: mastodon.world
  username: pwintz
  id: 
---
{% raw %} 
$
% Define macros.
\def\reals{\mathbb{R}}
\def\realsn{\reals^n}
\def\Safe{{\mathbf{Safe}}}
\def\Unsafe{{\mathbf{Unsafe}}}
\def\Init{{\mathbf{Init}}}
\def\ip[2]{\left\langle #1, #2\right\rangle}
\newcommand{\ip}[2]{\left\langle #1, #2 \right\rangle}
\newcommand{\SOSpolys}{\Sigma}%{\mathcal P_{SOS}}
\newcommand{\maximize}{\operatorname*{maximize}}
\newcommand{\subjectto}{\textup{subject to}}
$
{% endraw %}
In dynamical systems and mathematical control theory, it is often useful to show that a given function has a particular sign for all inputs in given sets. 
For example, given $f : \realsn \to \reals$ and $S\subset \realsn$, we may want to show $f(x) \geq 0$ for all $x \in S$.
Prominent examples include Lyapunov functions, which are used to prove stability, and barrier functions which are used to prove set invariance.

As a simple example, consider a dynamical system with state vector $$x \in \realsn$$, vector field $$f : \realsn \to \realsn$$, and dynamics given by

\begin{equation}
  \label{eq:ode}
  \dot x = f(x).
\end{equation}

Suppose we want to show that the origin $$0 \in \realsn$$ is stable for (\ref{eq:ode}). 
Roughly speaking, this means that all solutions that start near the origin remain near it for all time.
A common approach to show stability is to pick a neighborhood $$U$$ of the origin and construct a differentiable function $V : U \to \reals$, called a _Lypunov function_ that satisfies the following criteria:

1. $V(0) = 0$
2. $V(x) > 0 $ for all $x \in U $ such that $x \neq 0 $
2. $\dot V(0) = 0$
2. $\dot V(x) \leq 0$ for all $x \in U $ such that $x \neq 0 $

where $$\dot V(x)$$ is the rate of change of $$V(x(t))$$ as $$t \mapsto x(t)$$ evolves according to (\ref{eq:ode}).
The existence of a Lyapunov function proves that the origin is stable {% cite khalil_nonlinear_2014 --label <> --locator Theorem 4.1 %}.

Constructing a Lyapunov is often difficult because it requires finding a function that satisfies multiple inequalities at every point in a set, and the inequalities depend on the function itself, its derivative, and the dynamics of the system.
The purpose of this page is to introduce sum-of-squares (SOS) programming, which can be used to automatically generate Lyapunov functions and solve other similar problems.

<!-- If $$V$$ satisfies criteria 1 and 2, it is said to be _positive definite_ (relative to the origin,) and if $\dot V(0)$ satisfies criteria 3 and 4, then $\dot V(0)$ is said to be _negative semi-definite_ (relative to the origin). More is said aboue positive/negative (semi-)definite functions later. -->
<!-- TODO: Add link to 'later'. -->

_Remark._ There are actually many different variants of Lyapunov functions for showing...
* ...different types of stability (asymptotic, input-to-state, global, etc.),
* ...the stability of some set $$\mathcal A \subset \realsn$$ rather than the single point at the origin
* ...stability in continuous-time, discrete-time, and hybrid systems.

Most of these variants can be handled by SOS programming, so long as the data of the system are given in terms of polynomials.

# Mathematical Fundamentals
<!-- # Function Sign Property Definitions  -->
<!-- Let $$f : \realsn \to \reals$$ be a function. -->
<!-- We begin with an explaination of sum of squares programming.  -->

The basis for SOS programming lies in the following fact:
For any function $f : \realsn \to \reals,$ let $f^2$ indicate the function $x \mapsto (f(x))^2$. 
Then, for any choice of functions $$f_1,\ f_2,\ \dots,\ f_N : \realsn \to \reals$$, 

$$f_1^2(x) + f_2^2(x) + \cdots + f_N^2(x) \geq 0 \quad \forall x \in \realsn $$

and the sum is zero if and only if $$f_1(x) = f_2(x) = \cdots = f_N(x) = 0.$$

Working with general functions is difficult, so we restrict the choices for $$f_1,\ f_2,\ \dots,\ f_N$$ to polynomials. 
In particular, we allow for multivariate polynomials, such as  $(x, y) \mapsto x^2 + xy + 3y^2 $ or $(x, y, z) \mapsto 1 + x^3 - 2xyz^2$.
<!-- (Recall that polynomials are functions of one or more variables similar to $x \mapsto 1 + x^2$ and $ (x, y, z) \mapsto 1 + x^3 - 2xyz^2$.)  -->

We say that a polynomial $$p : \reals^n \to \reals $$ is a _sum of squares_ if there exist polynomials $$p_1, p_2, \dots, p_m : \reals^n \to \reals$$ such that 

\begin{equation}
  \label{eq:sos}
  p(x) = \sum_{i=1}^m p_i^2(x).
\end{equation}

Note that the argument $x$ for $p$ is a vector $x \in \realsn$, so we may write it as  $x = (x_1, x_2, \dots, x_n)$. 
We denote the set of all SOS polynomials over $x$ by $\SOSpolys[x]$ or $\SOSpolys[x_1, x_2, \dots, x_n]$.
(This notation is used in {% cite tobenkin_invariant_2011 %}, but there does not appear to be a prevailing standard.
Other notations used in the literature include 
  <!-- $\Sigma[x]$ {% cite tobenkin_invariant_2011 %}, -->
  $\mathscr{P}^{\mathup{SOS}}$ {% cite wang_permissive_2018 %}, and simply $\mathup{SOS}$.)

To solve problems using SOS polynomials, we need to put problems into a standard problem format, described in the next section, which can be solved algorithmically using a computer. 

## SOS Optimization Problem Formulation

In general, an SOS optimization problem (also called an _SOS program_) has a linear cost function and one or more SOS constraints---that is, the constraints of the optimization problem require that certain polynomials are sums of squares. 

To give a general formulation of an SOS problem, we denote the decision variables as $u = (u_1, u_2, \dots, u_n) \in \reals^m$. 
The linear cost function is defined by $c^\top u$ for some vector $c\in \reals^m$.
To specify an SOS problem with $N$ constraints requires picking $N(m+1)$ polynomials, which we write $p_{i,j}$ for $i = 1, 2, \dots, N$ and $j = 0, 1, \dots, m$. 
An SOS problem is then written 

<div>
\begin{equation}
  \label{eq:sos program}
  \begin{aligned}
    \maximize_{u\in\reals^m}\quad & c^\top u \\
    \subjectto \quad 
      & p_{1,0} + u_1 p_{1,1} + \cdots + u_m p_{1,m} \in \SOSpolys[x] \\
      & p_{2,0} + u_1 p_{2,1} + \cdots + u_m p_{2,m} \in \SOSpolys[x] \\
      & \hspace{7em} \vdots \\
      & p_{N,0} + u_1 p_{N,1} + \cdots + u_m p_{N,m} \in \SOSpolys[x] \\
      & A_{\text{eq}} u = b_{\text{eq}} \\
      & A_{\text{ieq}} u \leq b_{\text{ieq}} 
      %& \textup{Equality constraints on $u_1$, $u_2$, ..., $u_m$} \\ 
      %& \textup{Inequality constraints on $u_1$, $u_2$, ..., $u_m$}
  \end{aligned}
\end{equation}
</div>

Thus, a solution to (\ref{eq:sos program}) is a vector $u^\*\in\reals^m$ that minimizes $c^\top u^\*$ while satisfying the requirement that for each $i = 1, 2, \dots, N$, the function 

$$x \mapsto p_{i,0}(x) + u^*_1 p_{i,1}(x) + \cdots + u^*_m p_{i,m}(x)$$
 
is a sum of squares. 

_Remark._ At this point, you might be concerned about how to compute a solution to (\ref{eq:sos program}). 
It turns out that (\ref{eq:sos program}) can be reformulated into a semidefinite program (SDP), which is a type of convex optimization problem that can be efficiently and reliably solved using numerical solvers (assuming a solution exists). 
We plan to describe how to solve SOS problems in a later post.   

### Example: Lyapunov Function

Consider a 2D continuous-time dynamical system with state vector $x = (x_1, x_2) \in \reals^2$ and dynamics given by

<div>
\begin{equation}
  \label{eq:lyapunov}
  \dot x = f(x) := \begin{bmatrix} 
                    x_2 \\ 
                    (-x_1 - 2x_2)(x_1 + x_2)^2
                  \end{bmatrix}   
\end{equation}
</div>

We can guess the form of a Lyapunov function to be 

$$V(x) = u_1 p_1(x_1, x_2) + u_2 p_2(x_1, x_2) + \cdots + u_m p_m(x_1, x_2)$$

where each $p_i$ is a polynomial function.
<!-- Your choices for $m$ and each $p_i$ will depend on the particular problem you are trying to solve.  -->
Picking $m$ and each $p_i$ is typically a process of trial and error using intuitive guesses based on the structure and complexity of the problem.
We will use $m = 3$ and 

$$
\begin{aligned}
p_1(x_1, x_2) := x_1^2 \\
p_2(x_1, x_2) := x_2^2  \\
p_3(x_1, x_2) := x_1x_2
\end{aligned}
$$

Therefore, the general form of $V$ is 
$$V(x) = u_1 x_1^2 + u_2 x_2^2 + u_3 x_1x_2.$$ 
Calculating $\dot V,$ we find 

$$
\begin{aligned}
x \mapsto \dot V(x) 
&= \ip{\nabla V(x)}{f(x)} \\
&= \ip{\begin{bmatrix}2u_1x_1 +u_3 x_2 \\ 2u_2x_2 + u_3 x_1\end{bmatrix}}
     {\begin{bmatrix}x_2 \\ (-x_1 - 2x_2)(x_1 + x_2)^2 \end{bmatrix}} \\
&= 2u_1x_1x_2 + u_3 x_2^2 \\ 
&\quad {} + 2u_2x_2(-x_1 - 2x_2)(x_1 + x_2)^2 \\ 
&\quad {} + u_3 x_1(-x_1 - 2x_2)(x_1 + x_2)^2 
\end{aligned}
$$

We want $V$ to be positive definite relative to the origin, so it is necessary that $V(x) \in \SOSpolys[x]$, but this is not sufficient because an SOS polynomial can be only positive _semidefinite_ rather than positive _definite_. 
You can add constraints on $u_1$, $u_2$, and $u_3$ to ensure $V$ is positive definite. 
The simplest choice is to require that $u_1$ and $u_2$ are positive and $u_3$ is zero, so $V$ is a bowl shaped function:

$$V(x) = u_1 x_1^2 + u_2 x_2^2.$$

The constraints are then,

$$\begin{aligned}
u_1 &> 0 \\ 
u_2 &> 0 \\ 
u_3 &= 0.
\end{aligned}$$

For numerical reasons, strict inequalities don't work well in optimization problems, we instead pick some $\epsilon > 0$ and change the constraints to 

$$\begin{aligned}
u_1 &\geq \epsilon \\ 
u_2 &\geq \epsilon \\ 
u_3 &= 0.
\end{aligned}$$

Rewriting these constraints using matrices, we have 

$$\begin{aligned}
\begin{bmatrix}
-1 &  0 & 0 \\ 
 0 & -1 & 0
\end{bmatrix} u
  &\leq \begin{bmatrix}
  -\epsilon \\ 
  -\epsilon
  \end{bmatrix} 
\\
\begin{bmatrix}
 0 & 0 & 1
\end{bmatrix} u
  &= 0.
\end{aligned}$$

Becuase we won't know a good choice of $\epsilon$ beforehand, we can make it one of the decision variables and make the cost function $(u, \epsilon) \mapsto \epsilon$ so that the optimizer tries to find the largest value of $\epsilon$ such that the problem has solution. 
<!-- We also add a constraint that $\epsilon \geq 0$.  -->
We must check the value of $\epsilon$ for the solution to the optmization problem to ensure $\epsilon > 0$. 

An unfortunate side effect of this choice is that it removes a degree of freedom by setting $u_3=0$. 
This can be avoided by instead partitioning $V$ into the sum of a positive semidefinite function and a positive definite function, such as

$$V(x) := \underbrace{u_1 x_1^2 + u_2 x_2^2 + u_3 x_1x_2}_{\textup{positive semidefinite}} + \underbrace{u_4 x_1^2 + u_4 x_2^2}_{\textup{positive definite}}.$$

The corresponding constraints are then

$$\begin{aligned}
(x \mapsto u_1 x_1^2 + u_2 x_2^2 + u_3 x_1x_2) &\in \SOSpolys[x] \\ 
\begin{bmatrix}
0 & 0 & 0 & -1 &  0 \\ 
0 & 0 & 0 &  0 & -1
\end{bmatrix} u
  &\leq \begin{bmatrix}
  -\epsilon \\ 
  -\epsilon
  \end{bmatrix} 
\end{aligned}$$

Conversely, we want $\dot V$ to be negative semidefinite relative to the origin. 
Thus,

$$
\begin{aligned}
x \mapsto -\dot V(x) \in \SOSpolys[x].
\end{aligned}
$$

Therefore, the SOS problem formulation is
<div>
\begin{equation}
  \label{eq:lyapunov sos problem}
  \begin{aligned}
    \maximize \quad & \epsilon \\
    \subjectto \quad 
      &x \mapsto u_1 x_1^2 + u_2 x_2^2 + u_3 x_1x_2 \in \SOSpolys[x] \\ 
      &\begin{bmatrix}
      0 & 0 & 0 & -1 &  0 \\ 
      0 & 0 & 0 &  0 & -1
      \end{bmatrix} u
        \leq \begin{bmatrix}
        -\epsilon \\ 
        -\epsilon
        \end{bmatrix} \\
      & {-}\dot{V} \in \SOSpolys[x] 
  \end{aligned}
\end{equation}
</div>

<!-- A couple notes: -->
<!-- * There is no cost function because we are trying to solve a feasibility problem rather than minimize a value. You can make the  -->
<!-- * We have tightened the conditions given for stability by requiring $V$ is positive definite and $\dot V$ is negative semidefinite on $\realsn$ instead of only on a neighborhood $U$.  -->

### Definitions of positive definite and positive semidefinite functions.

A function $$f : \realsn \to \reals$$ is said to be <i>positive semi-definite</i> if

$$f(x) \geq 0 \quad \forall x \in \realsn$$

and $$f(0) = 0.$$

A function $$f : \realsn \to \reals$$ is said to be <i>positive definite</i> if

$$f(x) > 0 \quad \forall x \in \realsn \setminus\{0\}$$

and $$f(0) = 0.$$

Negative semidefinite and negative definite functions are defined similarly, except with the inequality signs flipped.

**Example.** The parabola $$x \mapsto x^2$$ is positive definite.

**Non-example.** The parabola $$x \mapsto x^2 + 1$$ is not positive definite because the value at $$x=0$$ is $$1$$.

**Non-example.** In two variables, the function $$(x, y) \mapsto x^2$$ is not positive definite because the value at $$(0, 1)$$ is $$0$$.


# Further Reading
- {% cite kevin_hartnett_classical_2018 %} gives an introduction to SOS programming targeted at a non-technical audience.
- {% cite duan_computational_2023 %} provides a way to generate control barrier functions for control-affine feedback systems.
- {% cite prajna_safety_2004 %} describes how to use sum of squares programming to generate barrier functions barrier functions for hybrid systems.
- {% cite sloth_existence_2012 %} introduces a way to simplify complicated systems with multiple components so that barrier functions can be found for individual subcomponents separately.
- {% cite wang_permissive_2018 %} introduces techniques that allow for synthesizing better barrier functions.
- {% cite noauthor_getting_nodate %} contains links to various tools for working with SOS's in various programming languages. 

# Bibliography
{% bibliography --cited %}