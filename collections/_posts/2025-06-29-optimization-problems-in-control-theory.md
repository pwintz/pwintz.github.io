---
layout: single
title: "Optimization Problems in Control Theory"
excerpt: A list of the most common types of mathematical optimization problems in control theory, with selected applications
# date: 2025-06-29 08:00:00 -0800
toc: true
categories: research
published: false
comments: 
  host: mastodon.world
  username: pwintz
  id: 
---

Optimization problems are ubiquitous in mathematics, science, and engineering. 
In control theory, the methods to solve many control problems involves solving an optimization problem. 
A general optimization problem is written as 

\begin{equation}
  \label{eq:optimization problem}
  \begin{aligned}
    \operatorname*{minimize}_{x} \quad & f(x) \\\\ 
    \textrm{subject to} \quad & g(x) = 0 \\\\
                              & h(x) \geq 0,
  \end{aligned}
\end{equation}

where the particular problem is defined by its  _cost function_ $f : \reals^n \to \reals$, _equality constraint function_ $g : \reals^n \to \reals^m$, and _inequality constraint function_ $h : \reals^n \to \reals^p$. 
The variable $x \in \reals^n$ is called the _decision variable_ of the problem.
For simplicity, we wrote the domain of $x$ as $\reals^n$, but in some problems the domain is different
The goal of is to pick $x$ that produces the smallest value $f(x)$ such that the equality constraint $g(x) = 0$ and inequality constraint $h(x) \geq 0$ are satisfied. 
Since $g$ and $h$ are vector valued, the relations $g(x) = 0$ and $h(x) \geq 0$ are interpreted element-wise. 
That is, if we write the components of $h(x)$ as

$$h(x) := (h_1(x), h_2(x), \dots, h_p(x)),$$ 

then $h(x) \geq 0$ holds if and only if each of the following inequalities hold:

$$
h_1(x) \geq 0,\quad h_2(x) \geq 0,\quad \dots,\quad h_p(x) \geq 0.
$$

The formulation in (\ref{eq:optimization problem}) is general enough to subsume most optimization problems that are solved in practice, but there are two noteworthy ways that it can be made more general.
First, the assumption that the domain of $x$ is $\reals^n$ does not always hold.
Some optimization problems use decision variables that are not in $\reals^n$. In some cases, the domain is restricted, e.g., to integers instead of real numbers. (Changing the domain to $\mathbb{N}$ could be achieved with the inequality constraint functions, but using integers for the decision variables drastically changes the optimization problem, so it is usually treated differently.)
There are also problems with domains that cannot be written as a subset of $\reals$, such as optimization over continuous-valued functions (which is an infinite-dimension vector space). Such infinite-dimension optimization occurs in calculus of variations and optimal control. 
Second, in (\ref{eq:optimization problem}), we assume deterministic evaluations of $f$, $g$, and $h$, but some optimization problems include random variables.

There are several important bifurcations of optimization problems: 

* nonlinear vs. linear (cost and/or constraints)
* convex vs. non-convex
* constrained vs. unconstrained 
* continuous vs. discrete (decision variables)
* smooth vs. nonsmooth (functions)
* deterministic vs. stochastic

Within these categories, there are further distinctions. 
Rather than walking through all of the possibilities, I will enumerate several of the most common types of optimization problems that occur in control theory. 
For each type of problem, I will describe the limitations, applications, and mention common methods for solving. 

In mathematical optimization, an optimization problem is often called a "program", which only vaguely relates to the use of the word in the sense of a "computer program". 
We refer to a class of optimization, such as nonlinear optimization programs, as "nonlinear programming". 
Again, this usage is unrelated to the sense of computer programming. 
<!-- 
Working with optimization problem  -->

## Unconstrained Programming

In an unconstrained optimization problem, $m = 0$ and $p = 0$, indicating that there are no constraints $g(x) = 0$ and $h(x) \geq 0$. 
For the case of an unconstrained problem, (\ref{eq:optimization problem}) becomes

\begin{equation}
  \label{eq:unconstrained optimization problem}
  \begin{aligned}
    \operatorname*{minimize}_{x} \quad & f(x).
  \end{aligned}
\end{equation}

There are two common classes of unconstrained optimization: quadratic programs and nonlinear programs.

### Quadratic Programming (QP)
In an unconstrained quadratic program, $f(x)$ is a quadratic function.

**Problem Formulation.**
If $n=1$, then $f(x) := ax^2 + bx$ for some $a \in \reals$ and $b \in \reals$, and the graph of $x \mapsto f(x)$ is a parabola. 
For the minimization problem to be meaningful, $a$ must be positive. 
Otherwise, the parabola opens downwards and $f$ does not have a minimum value.

In higher dimensions ($n > 1$), $f$ is written using a symmetric positive definite matrix $A \in \reals^{n\times n}$, which is analogous to $a$ for the $n=1$ case, and an arbitrary matrix $b \in \reals^{n}$, which is analogous to $b$ for the $n=1$ case.
Then, the general form of an unconstrained QP is 

\begin{equation}
  \label{eq:unconstrained QP}
  \begin{aligned}
    \operatorname*{minimize}_{x} \quad & f(x) := \frac{1}{2} x\trans A x + x \trans b.
  \end{aligned}
\end{equation}

**Solution.**
Solving a QP is very easy even for large $n$. 
In contrast to most classes of optimization problem, which require iterative methods to iteratively converge to a solution, there is a closed form solution to QPs. 
In particular, when $A$ is symmetric positive definite, the unique solution $x^*$ to (\ref{eq:unconstrained QP}) is found by solving $Ax = -b$ (this comes from setting the gradient of $f$ to zero). 
The solution is then given explicitly by  

$$x^* = -A\invs b,$$

although for high dimensions, efficient solutions to $Ax = -b$ avoid computing the inverse $A\invs$.

**Applications.**

- Computing the control value from a quadratic control barrier functions for a linear affine control system.
- Least squares
- Used as an approximation for nonlinear programs to solve them iteratively.

### Nonlinear Programming (NLP)
In an unconstrained nonlinear program (NLP), $f(x)$ is any nonlinear function (linear functions are useless for cost functions of unconstrained optimization problems because their values are either constant or unbounded). 
Note that QPs are a special case of NLPs. 

For a generic nonlinear function $f$, without any additional structure, the NLP (\ref{eq:unconstrained optimization problem}) is difficult to solve since they can generally have many local minima. 
This often causes numerical solvers to get trapped in a local minimum instead of converging to the global minimum.
The problem often becomes tractable, however, if $f$ is _convex_, meaning that for every $x_1, x_2 \in \realsn$, 

\begin{equation}
  \label{eq:convex}
  \theta f(x_1) + (1-\theta) f(x_2) \leq f(\theta x_1 + (1 - \theta) x_2) \qquad \forall \theta \in [0, 1].
\end{equation}

For a convex functions, there are no local minimum except for the global minimum.

**Solution.**

Since NLPs are a diverse class of problems, there is not a one-size fits all method for solving them. 
Some common methods include 

* Gradient descent - Requires many iterations, but each iteration is fast to compute, even for large $n$. This method or its variations are often used when $n$ is in the millions.
* Newton's method - Converges in few iterations, but each iteration is very computationally expensive for large $n$.
* [Broyden–Fletcher–Goldfarb–Shanno (BFGS) algorithm](https://en.wikipedia.org/wiki/Broyden%E2%80%93Fletcher%E2%80%93Goldfarb%E2%80%93Shanno_algorithm) - 
* Limited Memory BFGS (L-BFGS) - A variation of BFGS that uses less memory but achieves similar convergence. 


**Applications.**

## Constrained Programming


### Quadratically Constrained Quadratic Programming (QCQP)


**Problem Formulation.**

**Solution.**

**Applications.**

### (Constrained) QP
**Problem Formulation.**

**Solution.**

**Applications.**

### (Constrained) NLP
**Problem Formulation.**

**Solution.**

**Applications.**

### Linear Programming
**Problem Formulation.**

**Solution.**

**Applications.**

### Semidefinite Programming (SDP)
**Problem Formulation.**

**Solution.**

**Applications.**

### Cone Programming
**Problem Formulation.**

**Solution.**

**Applications.**

### Second Order Code Programming (SOCP) 
**Problem Formulation.**

**Solution.**

**Applications.**


### Mixed Integer Linear Program (MILP)
In a Mixed Integer Linear Program (MILP), the decision variables have a mixture of some variables that range over continuous values, taken from $\reals$ while others have integer values, ranging over $\nats$. 

**Problem Formulation.**

**Solution.**

**Applications.**
MILP arise when choosing between discrete options or modes, such as "turn left" or "turn right".