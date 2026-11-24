---
title: Rotation vs. Orientation
kind: siblings
areas: [geometry, physics, control]
summary: >
  [Rotation](/dictionary/definitions/rotation) and [orientation](/dictionary/definitions/orientation-rigid-body) both describe how an object is turned in space.
  A rotation is a change: a map that turns an object about a point or an axis.
  The orientation of an object is a state: how the object is turned relative to a reference frame, described by the rotation from the reference frame to the object.
terms:
  - rotation
  - orientation_rigid_body
examples:
  - example: a_level_drone_pointing_north
  - example: a_level_drone_turning_from_north_to_east
    why: >-
      A drone turning from north to east undergoes a rotation of $90^\circ$ about the vertical axis.
      The orientation of the drone describes where the drone ends up, not the turn.
see_also:
  - angle_vs_angular_measure_vs_angle_of_rotation
---
## Notes

- The same [rotation](/dictionary/definitions/rotation) matrix $R$ can be called a rotation (the change that turns the reference frame onto the body) or an [orientation](/dictionary/definitions/orientation-rigid-body) (the state of the body that the change produces).
- In aerospace, the orientation of a vehicle is called its _attitude_, but pilots often use "attitude" for only the pitch and roll, relative to the horizon, and treat the [heading](/dictionary/definitions/heading) separately.
- "Orientation" also has other meanings, such as the handedness of a [vector space](/dictionary/definitions/vector-space).
