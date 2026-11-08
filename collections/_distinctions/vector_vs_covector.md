---
title: Vector vs. covector
kind: siblings
areas: [linear-algebra]
summary: >
  Vectors and covectors are both described by lists of numbers in coordinates, so they are easy to confuse.
  A [covector](/definitions/covector) is a linear function that takes a vector and returns a number.
  In coordinates, both look like lists of numbers, but when the [basis](/definitions/vector-basis) changes, their coordinates change in opposite ways.
terms:
  - vector
  - covector
examples:
  - example: a_velocity_in_meters_per_second
  - example: the_temperature_gradient_in_degrees_per_meter
  - example: the_row_vector_begin_bmatrix_1_2_3_end_bmatrix
  # - example: 1_3_minus_2_4_with_no_other_information
  #   why: >-
  #     $(1, 3, -2.4)$ is only a list of numbers, the coordinates of something relative to some basis.
  #     It could be the coordinates of a vector or of a covector.
  - example: euclidean_norm_on_R2
see_also:
  - vector_vs_vector_coordinate
  - types_of_scalar_derivatives
---
## Why coordinates change differently

In one dimension, suppose we change units from meters to centimeters, so the new [basis](/definitions/vector-basis) vector is $100$ times shorter than the old one.

- A [displacement](/definitions/displacement) of $2$ m becomes $200$ cm.
  Its coordinate is multiplied by $100$: the coordinates of a vector change _opposite_ to the basis (they are contravariant).
- A temperature [gradient](/definitions/gradient) of $5$ degrees per meter becomes $0.05$ degrees per centimeter.
  Its coordinate is divided by $100$: the coordinates of a [covector](/definitions/covector) change _with_ the basis (they are covariant).

The value of a covector applied to a vector does not depend on the basis: $5 \times 2 = 0.05 \times 200 = 10$ degrees.

## Notes

- With an [inner product](/definitions/inner-product), each vector $v$ determines a covector $w \mapsto \ip{v}{w}$.
  This is how the gradient (a vector) is obtained from the differential (a covector), and why the two are often confused.
