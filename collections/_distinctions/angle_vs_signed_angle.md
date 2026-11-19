---
published: false
title: Angle vs. Signed Angle
kind: siblings
areas: [geometry, linear-algebra]
summary: >
  The [angle](/dictionary/definitions/angle) and the [signed angle](/dictionary/definitions/signed-angle) both measure how far apart the directions of two vectors are.
  The angle between two vectors is between $0^\circ$ and $180^\circ$ and does not depend on the order of the vectors.
  The signed angle from one vector to another in the plane also says which way to turn: it is positive for a counterclockwise turn and negative for a clockwise turn.
terms:
  - angle
  - signed_angle
examples_note: >-
  Each cell is the ___ from the first vector to the second.
examples:
  - example: from_1_0_to_0_1_in_the_plane
  - example: from_1_0_to_0_minus_1_in_the_plane
    why: >-
      Turning from $(1, 0)$ to $(0, -1)$ has the same angle as turning from $(1, 0)$ to $(0, 1)$, $90^\circ$, but the opposite signed angle, because the turn is clockwise instead of counterclockwise.
  - example: from_1_0_to_minus_1_0_in_the_plane
see_also:
  - angle_vs_angular_measure_vs_angle_of_rotation
---
## Notes

- In $\reals^3$, the [angle](/dictionary/definitions/angle) between two vectors is defined in the same way as in the plane, but a [signed angle](/dictionary/definitions/signed-angle) needs a chosen axis to say which way is counterclockwise.
- A [heading](/dictionary/definitions/heading) is measured clockwise from north, which is the opposite direction from the signed angle.
