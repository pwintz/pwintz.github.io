---
published: false
title: 'The state of a car $1$ m from a wall, approaching at $30$ m/s, with limited braking'
level: undergraduate
is: [admissible_set]
is_not: [
  controlled_invariant,
  safe
]
why:
  safe: >-
    The state of a car $1$ m from a wall, approaching at $30$ m/s with limited braking, is not safe, because every solution from it hits the wall.
  admissible_set: >-
    The car's state is in the admissible set because it satisfies the constraint "distance $\geq 0$."
  controlled_invariant: >-
    The state of a car $1$ m from a wall, approaching at $30$ m/s with limited braking, is not in a controlled invariant subset of the admissible set, because no braking input can avoid a collision.
---
