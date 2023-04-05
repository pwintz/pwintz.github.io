---
layout: single
title: "How to Generate Barrier Functions Via Sums of Squares"
excerpt: Tutorial for synthesizing barrier functions using semidefinite programming.
date: 2023-03-07 08:00:00 -0800
toc: true
categories: research
draft: false
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

A common goal for dynamical systems and control systems is to satisfy constraints, such as avoiding physical obstacles, staying within system tolerances, and obeying regulations. 
One popular way to show that a system satisfies constraints is by constructing a barrier function. 
Different sources define barrier functions various ways, but the unifying property is that a barrier function is a function on the state space of a system with properties that ensure that solutions to dynamical system cannot leave a particular set.


Barrier functions give a _guarantee_ that a set is forward invariant, but are, in general, difficult to construct.
In this page, we explain how to construct a barrier function using sum of squares programming when the system dynamics, initial set, and unsafe set are defined by polynomials.  

For an introduction to SOS programming, see ... <!-- TODO -->
We begin with mathematical background that explains barrier functions and sum of squares programming, then provide a guide to using MATLAB libraries for solving a sum of squares program. 


# Theory: Mathematical Background
Consider a differential equation 

$$\dot x = f(x) \quad x(0) \in \Init$$ 

that evolves on a domain $$x \in \reals^n.$$
 <!-- and has (unknown) disturbances in $$d \in D.$$  -->
Suppose there is an unsafe set $$\Unsafe \subset \reals^n.$$
(We assume $$\Init \cap \Unsafe = \emptyset$$.)
We want to be able to show that every solution to the ODE that starts in $$\Init$$ does not enter $$\Unsafe$$.  
<!-- That is, for every solution $$t \mapsto \phi(t)$$ to the ODE that starts in the set $$\Init$$, $$\phi$$ never enters $$\Unsafe.$$ -->
That is, we want to show that a set $$\Safe \subset \reals^n$$ is forward invariant and satisfies 

$$\Init \subseteq \Safe \subseteq \reals^n \setminus \Unsafe.$$ 

One common approach is to construct a _barrier function_ $$B : \reals^n \to \reals$$ that satisfies
- (B1) $$B$$ is differentiable.
- (B2) $$B(x)>0 \quad \forall x \in \Unsafe $$
- (B3) $$B(x) \leq 0 \quad \forall x \in \Init$$
- (B4) $$\langle \nabla B(x), f(x)\rangle \leq 0 \quad \forall x \in \reals^n \text { such that } B(x)=0$$
<!-- - (B4) $$\frac{\partial B}{\partial x}(x) f(x, d) \leq 0 \quad \forall(x, d) \in \reals^n \times D \text { such that } B(x)=0$$ -->

The function $$x \mapsto \langle \nabla B(x), f(x)\rangle$$ is the rate of change of $$B$$ as $$x$$ evolves along $$f.$$ Some authors write the rate of change as $$\frac{\partial B}{\partial x}(x) f(x)$$ or $$L_f B(x).$$
If such a barrier function exists, then the system is safe {% cite prajna_safety_2004 --label <> --locator Theorem 1 %}.

A significant difficulty in using barrier functions is how to actually generate a barrier functions. 
In general, this is a hard problem. 
With certain assumptions, however, we can use efficient numerical algorithms to solve it. 


## Convert the Barrier-Function Construction Problem into a Sum-of-Squares Problem

<!-- First, we replace (B4), which requires that $$B$$ is nonincreasing on the boundary of $$\Unsafe$$, with a condition that $$B$$ is nonincreasing _everywhere_:
- (B4') $$\langle \nabla B(x), f(x)\rangle \leq 0 \quad \forall x \in \reals^n.$$ -->
<!-- - (B4') $$\frac{\partial B}{\partial x}(x) f(x, d) \leq 0 \quad \forall(x, d) \in \reals^n \times D.$$ -->

<!-- This is significantly more restrictive but aids in the computation because the set of functions that satisfy (B1-3) and (B4') is convex (that is, taking the weighted average of any two such functions, added pointwise, produces another function that also satisfies (B1-3) and (B4')).  -->

The space of all continuous functions from $$\reals^n$$ to $$\reals$$ is large---there are uncountably many points in $$\realsn$$ and each point maps to a value in an uncountable set: $$\reals.$$ 
Simply put, the space of all continuous functions is too large to search through efficiently.
To make the problem computationally tractable, we restrict our search to polynomials. 
In particular, suppose that $$f$$ and $$B$$ are polynomials (that is, each component of $$f$$ and $$B$$ can be written as a polynomial) and the sets $$\Init$$ and $$\Unsafe$$ are semialgebriac set (see an [introduction to algebraic sets](#introduction-to-semialgebraic-sets), below). 

Every polynomial is differentiable, so (B1) is automatically satisfied. 

Under the given assumptions, we can rewrite (B2-4) in the form 

\begin{equation}
\label{eq:psd polynomial}
p(x) \geq 0 \quad \forall x \in \reals^n,
\end{equation}

where $$p :\reals^n \to \reals$$ is a polynomial. 
A polynomial $$p$$ that satisfies (\ref{eq:psd polynomial}) is called _positive semidefinite_.

Converting (B2-4) to the form in (\ref{eq:psd polynomial}) is more complicated than it may initially appear. 
Consider, for example (B3). 
Clearly, we want $$-B(x) \geq 0,$$ but this must be satisfied for all $$x$$ in $$\Init$$ rather than all $$x \in \reals^n,$$ as is needed for (\ref{eq:psd polynomial}).
Suppose $$\Init$$ is defined by a polynomial $$g_\Init : \reals^n \to \reals^m$$ as 

$$\Init := \{ x \in \reals^n \mid g_\Init(x) \geq 0 \},$$

where the inequality $$g_\Init(x) \geq 0$$ means that every component of $$g_\Init$$ is nonnegative at $$x.$$
Now let $$\sigma_\Init : \reals^n \to \reals^m$$ be an undetermined positive definite polynomial. 
Thus, for each $$x \in \Init$$ and $$i = 1, \dots, m$$, 

$$\sigma_{\Init,i}(x)g_{\Init,i}(x) \geq 0$$

and thus the inner product is positive for all $$x \in \Init:$$

$$\ip{\sigma_{\Init}(x)}{g_{\Init}(x)} \geq 0.$$

Therefore, we can relax the domain of $$x$$ in (B3) by requiring a stricter inequality, namely 

$$-B(x) - \ip{\sigma_{\Init}(x)}{g_{\Init}(x)} \geq 0 \quad \forall x \in \reals^n$$

because this implies that $$-B(x) \geq \ip{\sigma_{\Init}(x)}{g_{\Init}(x)} \geq 0$$ for all $$x \in \Init.$$

A similar process applies to (B1), except that we introduce a parameter $$\epsilon > 0$$ to convert the strict inequality $$B(x) > 0$$ into a nonstrict inequality $$B(x) \geq \epsilon.$$ The resulting condition is 

$$B(x) - \epsilon - \ip{g_\Unsafe(x)}{\sigma_\Unsafe(x)} \geq 0 \quad \forall x \in \reals^n.$$


Finally, for (B4), the condition $$\langle \nabla B(x), f(x)\rangle \leq 0$$ for all $$x \in \reals^n$$ such that $$B(x)=0$$ can be written as a polynomial inequality on $$\reals^n$$ as 

$$-\langle \nabla B(x), f(x)\rangle \geq \lambda(x)B(x) \quad \forall x \in \reals^n,$$

where $$\lambda : \reals^n \to \reals$$ is a polynomial.
For each $$x$$ such that $$B(x) = 0,$$ the right-hand side is zero, as required in (B4).
To simplify the process, we could use "$$\lambda(x) = 0$$", but that would impose an restriction that $$B$$ is nondecreasing along flows everywhere in $$\reals^n.$$  
Thus, letting $$\lambda$$ be a polynomial gives us flexibility to let $$\langle \nabla B(x), f(x)\rangle > 0$$ when $$x$$ is away from the "barrier" set $$\{x \in \reals^n \mid B(x) = 0\}.$$

We have now converted (B2-4) into polynomial inequalities in the form (\ref{eq:psd polynomial}). 

- (B2') $$-B(x) - \ip{\sigma_{\Init}(x)}{g_{\Init}(x)} \geq 0 \quad \forall x \in \reals^n.$$
- (B3') $$B(x) - \epsilon - \ip{g_\Unsafe(x)}{\sigma_\Unsafe(x)} \geq 0 \quad \forall x \in \reals^n.$$
- (B4') $$-\langle \nabla B(x), f(x)\rangle - \lambda(x)B(x) \geq 0 \quad \forall x \in \reals^n.$$

This brings us closer to a solution to our problem, but we must further restrict our search for polynomials. 
Even _checking_ that (B2'-B4') are satisfied by polynomials $$B$$, $$\sigma_\Init$$, and $$\sigma_\Unsafe$$
is a computationally expensive problem for general polynomials---let alone generating those polynomials. 

Showing that a polynomial satisfies an inequality is NP-complete---meaning it is not computationally tractable. 
_However_, showing that a polynomial is a sum of squares is a much easier problem---it can be solved using semidefinite programming, for which we have efficient algorithms. 
However, showing that a polynomial satisfies an inequality can be done by showing that it is positive semidefinite, which turns out to a much easier problem to solve, computationally.
In fact,  


A concept we will use is sum of squares. A polynomial $$p : \reals^n \to \reals $$ is a _sum of squares_ if there exist polynomials $$p_1, p_2, \dots, p_m$$ such that 

$$p(x) = \sum_{i=1}^m p_i^2(x) \quad \text{for all } x \in \reals^n.$$ 

Every sum of squares is positive semidefinite. 



# Bibliography
{% bibliography --cited %}