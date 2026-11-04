---
title: Vector vs. covector
kind: siblings
areas: [linear-algebra]
status: draft
summary: >
  A covector is a linear function that takes a vector and returns a number.
  In coordinates, both look like lists of numbers, but when the basis changes, their coordinates change in opposite ways.
terms:
  - vector
  - covector
examples:
  - example: a_velocity_in_meters_per_second
    why: >-
      A velocity is a vector because it is an arrow in space, with units of length per time.
      It is not a covector, because it does not take a vector and return a number.
  - example: the_temperature_gradient_in_degrees_per_meter
    why: >-
      The temperature gradient is a covector, because it takes a displacement and returns the change in temperature, a number.
  - example: the_row_vector_begin_bmatrix_1_2_3_end_bmatrix
    why: >-
      The row vector $\begin{bmatrix} 1 & 2 & 3 \end{bmatrix}$ is a covector, because it maps a column vector $v$ to the number $v_1 + 2 v_2 + 3 v_3$.
  # - example: 1_3_minus_2_4_with_no_other_information
  #   why: >-
  #     $(1, 3, -2.4)$ is only a list of numbers, the coordinates of something relative to some basis.
  #     It could be the coordinates of a vector or of a covector.
  - example: euclidean_norm_on_reals_squared
    why: >-
      The Euclidean norm takes a vector and returns a number, but it is not a covector, because it is not linear: $\lVert -x \rVert = \lVert x \rVert$.
see_also:
  - vector_vs_vector_coordinate
  - types_of_scalar_derivatives
---
## Why coordinates change differently

In one dimension, suppose we change units from meters to centimeters, so the new basis vector is $100$ times shorter than the old one.

- A displacement of $2$ m becomes $200$ cm.
  Its coordinate is multiplied by $100$: the coordinates of a vector change _opposite_ to the basis (they are contravariant).
- A temperature gradient of $5$ degrees per meter becomes $0.05$ degrees per centimeter.
  Its coordinate is divided by $100$: the coordinates of a covector change _with_ the basis (they are covariant).

The value of a covector applied to a vector does not depend on the basis: $5 \times 2 = 0.05 \times 200 = 10$ degrees.

## Notes

- With an inner product, each vector $v$ determines a covector $w \mapsto \langle v, w \rangle$.
  This is how the gradient (a vector) is obtained from the differential (a covector), and why the two are often confused.
