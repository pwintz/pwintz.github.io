---
published: false
title: Vector vs. covector
kind: siblings
areas: [linear-algebra]
status: draft
summary: >
  A covector is a linear function that takes a vector and returns a number. In coordinates, both look like lists of numbers,
  but when the basis changes, their coordinates change in opposite ways.
terms:
  - vector
  - covector
examples:
  - example: a_velocity_in_meters_per_second
    why: >-
      An arrow in space.
  - example: the_temperature_gradient_in_degrees_per_meter
    why: >-
      It takes a displacement and returns the change in temperature, a number.
  - example: the_row_vector_begin_bmatrix_1_2_3_end_bmatrix
    why: >-
      It maps a column vector $v$ to the number $v_1 + 2 v_2 + 3 v_3$.
  - example: 1_3_minus_2_4_with_no_other_information
    why: >-
      A list of numbers is only the coordinates of something, relative to some basis. It could be the coordinates of a vector or of a covector.
see_also:
  - vector_vs_vector_coordinate
  - types_of_scalar_derivatives
---
## Why coordinates change differently

In one dimension, suppose we change units from meters to centimeters, so the new basis vector is $100$ times shorter than the old one.

- A displacement of $2$ m becomes $200$ cm. Its coordinate is multiplied by $100$: the coordinates of a vector change _opposite_ to the basis (they are contravariant).
- A temperature gradient of $5$ degrees per meter becomes $0.05$ degrees per centimeter. Its coordinate is divided by $100$: the coordinates of a covector change _with_ the basis (they are covariant).

The value of a covector applied to a vector does not depend on the basis: $5 \times 2 = 0.05 \times 200 = 10$ degrees.

## Notes

- With an inner product, each vector $v$ determines a covector $w \mapsto \langle v, w \rangle$. This is how the gradient (a vector) is obtained from the differential (a covector), and why the two are often confused.
