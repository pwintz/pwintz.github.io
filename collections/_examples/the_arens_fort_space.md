---
published: false
title: 'The Arens–Fort space'
level: graduate
figure:
  widget: arens-fort
  caption: |-
    The points $(m, n)$ of $X = \nats^2$ with $m, n \leq 7$, in the columns $X_m$, with $(0, 0)$ circled.
    The points of the chosen set are filled, and the other points are hollow.
    For a set that contains $(0, 0)$, the columns that the set misses infinitely many points of are orange.
  alt: A square grid of dots for the points (m, n), grouped into vertical columns X0 to X7, with dots continuing up and to the right. A menu chooses a set, whose points are filled dots.
# !! I spent some time revising this but am
detail: |-
  A topological space $X$ with underlying set $X = \nats^2$ (where $\nats = \setdef{0, 1, 2, \dots}$) and a topology such that each set $U \subseteq X$ is open if either 
  1. $U$ does not contain $(0, 0)$, or 
  1. $U$ contains $(0, 0)$ and there exists a finite set $M \subset \nats$ such that for each $m \not\in M$, the set 
  
    $$X_m \setminus U$$

    is finite, where $X_m = \setdef{m} \times \setdef{0, 1, 2, \dots}$.
is: [
  topological_space,
  countable
]
is_not: [
  first_countable,
  second_countable
]
why:
  topological_space: >-
    The Arens–Fort space is a topological space, because its open sets satisfy the three axioms (see the discussion below).
  countable: >-
    The Arens–Fort space is countable, because its points are the pairs of nonnegative integers.
  first_countable: >-
    The Arens–Fort space is not first countable at $(0, 0)$.
    Suppose that $N_1, N_2, \dots$ are neighborhoods of $(0, 0)$.
    Each $N_k$ contains all but finitely many points of $X_m$ for all but finitely many $m$, so there are points $p_k \in N_k \cap X_{m_k}$ with $1 \leq m_1 < m_2 < \dots$.
    The set $V = X \setdiff \setdef{p_1, p_2, \dots}$ contains $(0, 0)$ and misses at most one point of each $X_m$, so $V$ is open.
    But $V$ contains none of the sets $N_k$, because $p_k \in N_k$ and $p_k \notin V$.
  second_countable: >-
    The Arens–Fort space is not second countable, because it is not first countable.
---

### Why the Arens–Fort space is a topological space

Each of the three axioms holds for the open sets.

1. The empty set is open, because it does not contain $(0, 0)$.
   The set $X$ is open, because it contains every point of every set $X_m$.
2. A union of open sets is open.
   If the union does not contain $(0, 0)$, it is open by the first condition.
   If the union contains $(0, 0)$, then one of the sets in the union contains $(0, 0)$, and this set contains all but finitely many points of $X_m$ for all but finitely many $m$, so the union does too.
3. An intersection of two open sets $U$ and $V$ is open.
   If the intersection does not contain $(0, 0)$, it is open by the first condition.
   If it contains $(0, 0)$, then $U$ and $V$ both contain $(0, 0)$.
   Then there are finitely many $m$ such that $U$ misses infinitely many points of $X_m$, and finitely many such $m$ for $V$.
   For every other $m$, $U$ and $V$ each miss finitely many points of $X_m$, so $U \cap V$ misses finitely many points of $X_m$.
   Hence $U \cap V$ contains all but finitely many points of $X_m$ for all but finitely many $m$.
   By induction, every finite intersection of open sets is open.
