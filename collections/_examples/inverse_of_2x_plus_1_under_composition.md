---
title: 'The function $f(x) = 2x + 1$ on $\reals$ under composition of functions'
level: high-school
is: [function_composition]
values:
  function_composition: '$(f \circ f^{-1})(x) = (f^{-1} \circ f)(x) = x$'
  inverse_element: '$f^{-1}(x) = \frac{x - 1}{2}$'
why:
  function_composition: >-
    Composing $f(x) = 2x + 1$ with its inverse $f^{-1}(x) = (x - 1)/2$ in either order gives the identity function, because $f(f^{-1}(x)) = 2 \cdot (x - 1)/2 + 1 = x$ and $f^{-1}(f(x)) = ((2x + 1) - 1)/2 = x$.
  inverse_element: >-
    For composition of functions $\reals \to \reals$, the identity element is the identity function $x \mapsto x$, so the inverse element of $f(x) = 2x + 1$ is the inverse function $f^{-1}(x) = \frac{x - 1}{2}$, because $f(f^{-1}(x)) = f^{-1}(f(x)) = x$ for all $x$.
---
