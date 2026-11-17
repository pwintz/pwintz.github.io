---
title: '$f(x) = x^2$ on $\reals$'
level: high-school
description: >-
  The squaring function, as a function $f : \reals \to \reals$.
is: [
  continuously_differentiable,
  continuous,
  sequentially_continuous,
  function,
  map,
  positive_definite_function,
  convex_function,
  locally_Lipschitz_continuous
]
is_not: [
  Lipschitz_continuous,
  uniformly_continuous,
  class_K,
  operator,
  functional,
  transform
]
values:
  domain: '$\reals$'
  codomain: '$\reals$'
  image: '$f([-1, 2]) = [0, 4]$'
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
    The squares of the numbers in $[-1, 2]$ are exactly the numbers in $[0, 4]$: the smallest is $0^2 = 0$, and the largest is $2^2 = 4$.
  range_image: >-
    The range of $f$ is $[0, \infty)$, because squares of real numbers are exactly the nonnegative numbers.
  range_codomain: >-
    In the sense of the codomain, the range of $f$ is $\reals$, the set where outputs are allowed to land.
  preimage: >-
    The preimage $f^{-1}(\setdef{4})$ exists even though $f$ has no inverse. No real number squares to $-1$, so $f^{-1}(\setdef{-1})$ is empty.
  uniformly_continuous: >-
    $f(x) = x^2$ is not uniformly continuous on $\reals$, because its graph gets steeper and steeper, so no single closeness of inputs works everywhere.
  continuously_differentiable: >-
    $x \mapsto x^2$ on $\reals$ is continuously differentiable because its derivative $2x$ is continuous.
  Lipschitz_continuous: >-
    $x \mapsto x^2$ on $\reals$ is not Lipschitz continuous, because its slope $2x$ is unbounded on $\reals$.
  locally_Lipschitz_continuous: >-
    $x \mapsto x^2$ on $\reals$ is locally Lipschitz continuous, because on each interval $[-R, R]$ its slope $2x$ is bounded by $2R$.
  continuous: >-
    $x \mapsto x^2$ is continuous.
  function: >-
    $f(x) = x^2$ is a function and a map, as is every function. "Function" is the more common word here, because the inputs and outputs are numbers.
  positive_definite_function: >-
    $x \mapsto x^2$ on $\reals$ is positive definite because it is positive away from $0$ and zero at $0$. 

  # TODO: The following line was irrelevant to this "why"
  # It is not of class $\mathcal{K}$, because it is not increasing on all of $\reals$.
  
  
  # TODO: This next explanation doesn't really explain "why"
  # sequentially_continuous: >-
  #   $x \mapsto x^2$ is continuous and sequentially continuous.
  functional: >-
    $f(x) = x^2$ on $\reals$ is not a functional, because its inputs are numbers, not elements of a space of functions.
  operator: >-
    $f(x) = x^2$ on $\reals$ is not an operator, because its inputs are numbers, not elements of a space of functions.
  transform: >-
    $f(x) = x^2$ on $\reals$ is not a transform, because its inputs are numbers, not elements of a space of functions.
---
