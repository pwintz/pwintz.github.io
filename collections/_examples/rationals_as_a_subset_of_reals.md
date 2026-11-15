---
title: '$\mathbb{Q}$, as a subset of $\reals$'
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
  interior: '$\operatorname{int} \mathbb{Q} = \emptyset$'
  boundary: '$\partial \mathbb{Q} = \reals$'
  exterior: '$\operatorname{ext} \mathbb{Q} = \emptyset$'
  closure: '$\overline{\mathbb{Q}} = \reals$'
why:
  closure: >-
    The closure of $\mathbb{Q}$ is $\reals$, because every real number is a limit of rational numbers.
  open_set: >-
    The set $\mathbb{Q}$ is not open in $\reals$, because every interval around a rational number contains irrational numbers.
  closed_set: >-
    The set $\mathbb{Q}$ is not closed in $\reals$, because rational numbers converge to irrational ones, such as $1, 1.4, 1.41, 1.414, \dots \to \sqrt{2}$.
  boundary: >-
    Every interval contains both rational and irrational numbers, so every real number is a boundary point.
  dense_set: >-
    $\mathbb{Q}$ is dense in $\reals$ because every interval contains a rational number.
  borel_set: >-
    $\mathbb{Q}$ is a Borel set, because $\mathbb{Q}$ is the union of countably many one-point sets $\setdef{q}$, each of which is closed.
  almost_everywhere: >-
    $\mathbb{Q}$ does not hold almost everywhere, because $\mathbb{Q}$ has measure zero.
  full_measure: >-
    $\mathbb{Q}$ does not have full measure in $\reals$, because its complement $\reals \setminus \mathbb{Q}$ does not have measure zero.
  interior: >-
    Every interval contains rational and irrational numbers, so $\mathbb{Q}$ has an empty interior and an empty exterior.
---
