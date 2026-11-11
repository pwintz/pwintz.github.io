---
published: false
title: Tracking vs. rendezvous
kind: siblings
areas: [control]
summary: >
  Tracking and rendezvous are control problems in which a controlled system must keep up with a moving target.
  In [tracking](/dictionary/definitions/tracking), the output must follow a reference at every time, so the error $e(t) = r(t) - y(t)$ must converge to zero or stay small.
  In [rendezvous](/dictionary/definitions/rendezvous), the vehicle must reach the target's position with the target's velocity at one final time, and the route before that time matters only through its cost, such as fuel.
terms:
  - tracking
  - rendezvous
examples:
  - example: a_car_staying_in_the_center_of_its_lane
  - example: a_spacecraft_docking_with_a_space_station
  - example: an_aircraft_refueling_from_a_tanker_in_flight
    why: >-
      An aircraft refueling in flight solves both problems in turn: rendezvous to reach the tanker, and then tracking to stay with the tanker while refueling.
see_also:
  - regulation_vs_tracking_vs_stabilization
---
## Notes

- [Rendezvous](/dictionary/definitions/rendezvous) is usually posed as an [optimal control](/dictionary/definitions/optimal-control) problem with a condition at the final time, whereas [tracking](/dictionary/definitions/tracking) is usually posed as a [stabilization](/dictionary/definitions/stabilization) problem for the error.
- In multi-agent systems, "rendezvous" means that several agents converge to one common point that is not given in advance.
