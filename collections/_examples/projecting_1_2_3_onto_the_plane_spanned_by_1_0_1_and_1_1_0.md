---
published: false
title: 'Projecting $\vect{x} = (1, 2, 3)$ onto the plane $W = \Span{(1, 0, 1), (1, 1, 0)}$ in $\reals^3$'
level: undergraduate
values:
  orthogonal_projection: '$\operatorname{proj}_W \vect{x} = (7/3, 2/3, 5/3)$'
why:
  orthogonal_projection: |-
    The orthogonal projection of $(1, 2, 3)$ onto $W = \Span{(1, 0, 1), (1, 1, 0)}$ is $(7/3, 2/3, 5/3)$.
    The spanning vectors $\vect{v}_1 = (1, 0, 1)$ and $\vect{v}_2 = (1, 1, 0)$ are not orthogonal, because $\ip{\vect{v}_1}{\vect{v}_2} = 1$, so the projection is not the sum of the projections onto $\vect{v}_1$ and $\vect{v}_2$.
    Gram–Schmidt gives the orthogonal basis $\vect{u}_1 = (1, 0, 1)$ and $\vect{u}_2 = (1, 2, -1)$ of $W$, and

    $$\operatorname{proj}_W \vect{x} = \frac{\ip{\vect{x}}{\vect{u}_1}}{\norm{\vect{u}_1}^2} \, \vect{u}_1 + \frac{\ip{\vect{x}}{\vect{u}_2}}{\norm{\vect{u}_2}^2} \, \vect{u}_2 = \frac{4}{2} (1, 0, 1) + \frac{2}{6} (1, 2, -1) = \left(\frac{7}{3}, \frac{2}{3}, \frac{5}{3}\right).$$

    The difference $\vect{x} - \operatorname{proj}_W \vect{x} = (-4/3, 4/3, 4/3)$ is orthogonal to $\vect{v}_1$ and to $\vect{v}_2$.
---
