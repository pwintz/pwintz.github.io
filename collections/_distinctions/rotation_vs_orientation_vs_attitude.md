---
published: false
title: Rotation vs. Orientation vs. Attitude
kind: siblings
areas: [geometry, physics, control]
summary: >
  [Rotation](/dictionary/definitions/rotation), [orientation](/dictionary/definitions/orientation-rigid-body), and [attitude](/dictionary/definitions/attitude) all describe how an object is turned in space.
  A rotation is a change: a map that turns an object about a point or an axis.
  The orientation of an object is a state: how the object is turned relative to a reference frame, described by the rotation from the reference frame to the object.
  Attitude is the word used in aerospace for the orientation of a vehicle.
terms:
  - rotation
  - orientation_rigid_body
  - attitude
examples:
  - example: a_level_drone_pointing_north
  - example: a_level_drone_turning_from_north_to_east
    why: >-
      A level drone turning from north to east undergoes a rotation of $90^\circ$ about the vertical axis.
      The orientation and the attitude of the drone describe where the drone ends up, not the turn.
see_also:
  - angle_vs_angular_measure_vs_angle_of_rotation
---
## Notes

- The same [rotation](/dictionary/definitions/rotation) matrix $R$ can be called a rotation (the change that turns the reference frame onto the body) or an [orientation](/dictionary/definitions/orientation-rigid-body) (the state of the body that the change produces).
- Pilots often use "[attitude](/dictionary/definitions/attitude)" for only the pitch and roll, relative to the horizon, and treat the [heading](/dictionary/definitions/heading) separately.
- "Orientation" also has other meanings, such as the handedness of a [vector space](/dictionary/definitions/vector-space).
