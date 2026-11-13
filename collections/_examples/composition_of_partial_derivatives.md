---
published: false
title: 'The composition $f \mapsto \frac{\partial}{\partial x} \frac{\partial f}{\partial y}$ of the vector fields $\frac{\partial}{\partial x}$ and $\frac{\partial}{\partial y}$, on smooth functions on $\reals^2$'
level: undergraduate
is_not: [derivation]
why:
  derivation: >-
    The composition $f \mapsto \frac{\partial^2 f}{\partial x \, \partial y}$ is not a derivation, because it fails the product rule: it sends $x y$ to $1$, but it sends both $x$ and $y$ to $0$, so the product rule would give $0 \cdot y + x \cdot 0 = 0$.
    The Lie bracket $\frac{\partial}{\partial x} \frac{\partial}{\partial y} - \frac{\partial}{\partial y} \frac{\partial}{\partial x}$ is a derivation, namely $0$, because the second derivatives cancel.
---
