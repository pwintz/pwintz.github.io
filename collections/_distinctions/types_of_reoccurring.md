---
published: false
title: Types of recurrence
kind: family
areas: [dynamics, computing]
status: draft
summary: >
  Periodic events happen at fixed intervals. In real-time systems, sporadic events have a minimum separation and aperiodic events have none.
  In dynamics, a recurrent point returns close to where it started, but not necessarily exactly or regularly.
terms:
  - periodic
  - sporadic
  - aperiodic
  - recurrent
examples:
  - example: a_timer_interrupt_every_1_ms
    why: >-
      Periodic events are a special case of sporadic events, with minimum separation equal to the period.
  - example: network_packets_that_arrive_at_least_10_ms_apart
    why: >-
      The arrival times are irregular but have a minimum separation.
  - example: key_presses_with_no_minimum_spacing
    why: >-
      Two events can occur arbitrarily close together.
  - example: t_to_sin_t
    why: >-
      It repeats with period $2 \pi$.
  - example: a_point_under_rotation_of_a_circle_by_the_angle_2
    why: >-
      The angle is an irrational multiple of a full turn, so the orbit never repeats, but it comes back arbitrarily close.
see_also:
  - types_of_dynamic_stability
---
## Notes

- In ordinary English, "recurring," "occasional," and "sporadic" have no precise meaning. Use the technical terms above (or state the timing assumption) when timing matters.
- "Aperiodic" means "not periodic" in mathematics generally, which is weaker than the real-time systems meaning.
