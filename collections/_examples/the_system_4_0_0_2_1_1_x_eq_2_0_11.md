---
published: false
title: 'The linear system $A \vect{x} = \vect{b}$ with $A = [4, 0; 0, 2; 1, 1]$ and $\vect{b} = (2, 0, 11)$'
detail: |-
  $$A = \begin{bmatrix} 4 & 0 \\ 0 & 2 \\ 1 & 1 \end{bmatrix}, \qquad \vect{b} = \begin{bmatrix} 2 \\ 0 \\ 11 \end{bmatrix}.$$
level: undergraduate
values:
  least_squares_solution: '$\vect{x}^{\ast} = (1, 2)$'
why:
  least_squares_solution: |-
    The least squares solution of this system is $\vect{x}^{\ast} = (1, 2)$, because $\vect{x}^{\ast}$ solves the normal equation $A\trans A \vect{x} = A\trans \vect{b}$:

    $$A\trans A = \begin{bmatrix} 17 & 1 \\ 1 & 5 \end{bmatrix}, \qquad A\trans \vect{b} = \begin{bmatrix} 19 \\ 11 \end{bmatrix}, \qquad \begin{bmatrix} 17 & 1 \\ 1 & 5 \end{bmatrix} \begin{bmatrix} 1 \\ 2 \end{bmatrix} = \begin{bmatrix} 19 \\ 11 \end{bmatrix}.$$

    The system itself has no solution: the first two equations give $x_1 = 1/2$ and $x_2 = 0$, but then $x_1 + x_2 = 1/2 \neq 11$.
    The closest point $A \vect{x}^{\ast} = (4, 4, 3)$ is at distance $\norm{\vect{b} - A \vect{x}^{\ast}} = \sqrt{84}$ from $\vect{b}$.
---
