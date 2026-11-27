---
title: "Turning a clock's minute hand from 12 to 3"
level: high-school
description: >-
  The minute hand of a clock turns clockwise, from pointing at 12 to pointing at 3, in fifteen minutes.
# TODO: Add why
figure:
  widget: angle
  params: { mode: rotation, face: clock, play: -90 }
  aspect: 1 / 1
  caption: |-
    A clock's minute hand, with its starting position at 12 (dashed) and its turn so far (orange for clockwise), labeled with the angle of rotation.
    Play the turn from 12 to 3, or drag the hand.
  alt: A clock face with a blue minute hand that can be dragged around the center, a dashed line at 12 marking its starting position, and a curved arrow showing how far it has turned.
is: [rotation]
is_not: [orientation_rigid_body]
values:
  angle_geometric_figure: 'A right angle'
  angular_measure: '$90^\circ = \pi/2$ radians'
  angle_of_rotation: '$-90^\circ = -\pi/2$ radians'
why:
  angle_geometric_figure: >-
    The angle between the minute hand at 12 and the minute hand at 3 is a right angle, because the hand turns a quarter of a full turn.
  angular_measure: >-
    The measure of the angle between the minute hand at 12 and the minute hand at 3 is $90^\circ$, or $\pi/2$ radians.
  angle_of_rotation: >-
    The angle of rotation of the minute hand from 12 to 3 is $-90^\circ$, because the hand turns a quarter turn clockwise, and clockwise turns are negative.
  rotation: >-
    Turning a clock's minute hand from 12 to 3 is a rotation, because it is a change from one orientation (12 o'clock) to another (3 o'clock).
  orientation_rigid_body: >-
    Turning a clock's minute hand from 12 to 3 is not an orientation, because it is a motion from one orientation (12 o'clock) to another (3 o'clock).
---
