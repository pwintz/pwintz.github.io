---
published: false
title: Types of recurrence
kind: family
areas: [dynamics, computing]
summary: >
  Several words describe [events](/dictionary/definitions/event) or functions that happen again and again.
  [Periodic](/dictionary/definitions/periodic) events happen at fixed intervals.
  In real-time systems, [sporadic](/dictionary/definitions/sporadic) events have a minimum separation and [aperiodic](/dictionary/definitions/aperiodic) events have none.
  In dynamics, a [recurrent](/dictionary/definitions/recurrent) point returns close to where it started, but not necessarily exactly or regularly.
terms:
  - periodic
  - sporadic
  - aperiodic
  - recurrent
examples:
  - example: a_clock_that_chimes_every_hour
  - example: network_packets_that_arrive_at_least_10_ms_apart
  - example: key_presses_with_no_minimum_spacing
  - example: t_to_sin_t
  - example: a_point_under_rotation_of_a_circle_by_the_angle_2
see_also:
  - types_of_dynamic_stability
---
## Notes

- In ordinary English, "recurring," "occasional," and "[sporadic](/dictionary/definitions/sporadic)" have no precise meaning.
  Use the technical terms above (or state the timing assumption) when timing matters.
- "[Aperiodic](/dictionary/definitions/aperiodic)" means "not [periodic](/dictionary/definitions/periodic)" in mathematics generally, which is weaker than the real-time systems meaning.
