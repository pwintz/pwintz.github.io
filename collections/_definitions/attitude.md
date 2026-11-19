---
published: false
title: Attitude
term: attitude
applies_to: aircraft, spacecraft, and other vehicles
levels:
  elementary:
    text: |-
      The _attitude_ of an airplane is the way that the airplane is turned: which way its nose points, whether its nose is tipped up or down, and whether its wings are level.
  high-school:
    text: |-
      Consider an aircraft or a spacecraft and a fixed set of reference directions, such as north, east, and down.
      The _attitude_ of the vehicle is its [orientation](/dictionary/definitions/orientation-rigid-body) relative to the reference directions, usually given by three [angles](/dictionary/definitions/angle): yaw (or [heading](/dictionary/definitions/heading)), pitch, and roll.
  undergraduate:
    text: |-
      Consider a vehicle with an [orthonormal](/dictionary/definitions/orthonormal) body frame $\vect{b}_1, \vect{b}_2, \vect{b}_3$ and an orthonormal reference frame $\vect{e}_1, \vect{e}_2, \vect{e}_3$, such as a local north-east-down frame or an inertial frame.
      The _attitude_ of the vehicle is the [rotation](/dictionary/definitions/rotation) matrix $R$ such that

      $$\vect{b}_i = R \vect{e}_i \quad \text{for } i = 1, 2, 3.$$
properties:
  - >-
    The attitude of a vehicle is its [orientation](/dictionary/definitions/orientation-rigid-body); "attitude" is the word used in aerospace.
  - >-
    Pilots often use "attitude" for the pitch and roll alone, relative to the horizon, as shown on an attitude indicator, and treat the [heading](/dictionary/definitions/heading) separately.
  - >-
    Yaw, pitch, and roll describe every attitude, but at a pitch of $\pm 90^\circ$ the yaw and roll turn about the same axis, so they are not determined separately (gimbal lock).
    So spacecraft attitude is often represented by a unit quaternion or a [rotation](/dictionary/definitions/rotation) matrix.
  - >-
    Attitude determination estimates the attitude from sensors, and attitude control changes it.
---
