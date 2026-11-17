---
title: '$\rationals$, as a subset of $\reals$'
level: undergraduate
is: [
  dense_set,
  borel_set
]
is_not: [
  open_set,
  closed_set,
  almost_everywhere,
  full_measure
]
values:
  interior: '$\operatorname{int} \rationals = \emptyset$'
  boundary: '$\partial \rationals = \reals$'
  exterior: '$\operatorname{ext} \rationals = \emptyset$'
  closure: '$\closure{\rationals} = \reals$'
why:
  closure: >-
    The closure of $\rationals$ is $\reals$, because every real number is a limit of rational numbers.
  open_set: >-
    The set $\rationals$ is not open in $\reals$, because every interval around a rational number contains irrational numbers.
  closed_set: >-
    The set $\rationals$ is not closed in $\reals$, because rational numbers converge to irrational ones, such as $1, 1.4, 1.41, 1.414, \dots \to \sqrt{2}$.
  boundary: >-
    Every interval contains both rational and irrational numbers, so every real number is a boundary point.
  dense_set: >-
    $\rationals$ is dense in $\reals$ because every interval contains a rational number.
  borel_set: >-
    $\rationals$ is a Borel set, because $\rationals$ is the union of countably many one-point sets $\setdef{q}$, each of which is closed.
  almost_everywhere: >-
    $\rationals$ does not hold almost everywhere, because $\rationals$ has measure zero.
  full_measure: >-
    $\rationals$ does not have full measure in $\reals$, because its complement $\reals \setdiff \rationals$ does not have measure zero.
  interior: >-
    Every interval contains rational and irrational numbers, so $\rationals$ has an empty interior and an empty exterior.
---
