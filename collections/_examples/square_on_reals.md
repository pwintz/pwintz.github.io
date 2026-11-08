---
published: false
title: '$f(x) = x^2$ on $\reals$'
level: high-school
description: >-
  The squaring function, as a function $f : \reals \to \reals$.
is: [continuously_differentiable, continuous, sequentially_continuous, function, map, positive_definite_function, convex_function]
is_not: [Lipschitz_continuous, uniformly_continuous, class_K, operator, functional, transform]
values:
  domain: '$\reals$'
  codomain: '$\reals$'
  image: '$f(\reals) = [0, \infty)$'
  preimage: '$f^{-1}(\setdef{4}) = \setdef{-2, 2}$ and $f^{-1}(\setdef{-1}) = \emptyset$'
  range_image: '$f(\reals) = [0, \infty)$'
  range_codomain: '$\reals$'
why:
  convex_function: >-
    The function $x \mapsto x^2$ is convex, because its second derivative is $2 \geq 0$.
  domain: >-
    $f$ is declared as a function $\reals \to \reals$.
  codomain: >-
    $f$ is declared as a function $\reals \to \reals$.
  image: >-
    Squares of real numbers are exactly the nonnegative numbers.
  preimage: >-
    The preimage $f^{-1}(\setdef{4})$ exists even though $f$ has no inverse.
    No real number squares to $-1$, so $f^{-1}(\setdef{-1})$ is empty.
  uniformly_continuous: >-
    $f(x) = x^2$ is not uniformly continuous on $\reals$, because its graph gets steeper and steeper, so no single closeness of inputs works everywhere.
  continuously_differentiable: >-
    $x \mapsto x^2$ on $\reals$ is continuously differentiable because its derivative $2x$ is continuous.
  Lipschitz_continuous: >-
    $x \mapsto x^2$ on $\reals$ is not Lipschitz continuous, because its slope $2x$ is unbounded on $\reals$.
  continuous: >-
    $x \mapsto x^2$ is continuous.
  function: >-
    $f(x) = x^2$ is a function and a map, as is every function.
    "Function" is the more common word here, because the inputs and outputs are numbers.
  range_statistics: >-
    The range of $f$, in the sense of its image, is $[0, \infty)$, because those are the outputs that actually occur.
    The range of $f$, in the sense of its codomain, is $\reals$, the set where outputs are allowed to land.
  positive_definite_function: >-
    $x \mapsto x^2$ on $\reals$ is positive definite because it is positive away from $0$ and zero at $0$.
    It is not of class $\mathcal{K}$, because it is not increasing on all of $\reals$.
  sequentially_continuous: >-
    $x \mapsto x^2$ is continuous and sequentially continuous.
  functional: >-
    $f(x) = x^2$ on $\reals$ is not an operator, functional, or transform, because its inputs are numbers, not elements of a space of functions.
---
