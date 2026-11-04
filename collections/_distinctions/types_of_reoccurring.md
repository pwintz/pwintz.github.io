---
published: false
title: Types of recurrence
kind: family
areas: [dynamics, computing]
status: draft
summary: >
  Periodic events happen at fixed intervals.
  In real-time systems, sporadic events have a minimum separation and aperiodic events have none.
  In dynamics, a recurrent point returns close to where it started, but not necessarily exactly or regularly.
terms:
  - periodic
  - sporadic
  - aperiodic
  - recurrent
examples:
  - example: a_timer_interrupt_every_1_ms
    why: >-
      The timer interrupts are periodic, because they occur every $1$ ms.
      They are also sporadic, with minimum separation $1$ ms, so they are not aperiodic.
  - example: network_packets_that_arrive_at_least_10_ms_apart
    why: >-
      The packets are sporadic because their arrival times are irregular but at least $10$ ms apart.
      They are not periodic, because the time between arrivals varies.
  - example: key_presses_with_no_minimum_spacing
    why: >-
      The key presses are aperiodic because two presses can occur arbitrarily close together.
      So they are not periodic or sporadic.
  - example: t_to_sin_t
    why: >-
      $\sin$ is periodic, with period $2 \pi$, and so it is recurrent.
  - example: a_point_under_rotation_of_a_circle_by_the_angle_2
    why: >-
      The point's orbit is recurrent, because it comes back arbitrarily close to where it started.
      It is not periodic, because the angle is an irrational multiple of a full turn, so the orbit does not return exactly.
see_also:
  - types_of_dynamic_stability
---
## Notes

- In ordinary English, "recurring," "occasional," and "sporadic" have no precise meaning.
  Use the technical terms above (or state the timing assumption) when timing matters.
- "Aperiodic" means "not periodic" in mathematics generally, which is weaker than the real-time systems meaning.
