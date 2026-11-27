---
title: 'A wheel that turns twice counterclockwise'
level: high-school
description: >-
  A wheel turns two full turns counterclockwise about its axle, so each spoke ends where the spoke started.
figure:
  widget: angle
  params: { mode: rotation, face: wheel, play: 720 }
  aspect: 1 / 1
  caption: |-
    A wheel, with the starting position of the blue spoke (dashed) and its turn so far (spiral), labeled with the angle of rotation.
    Play two counterclockwise turns, or drag the blue spoke.
  alt: A wheel with six spokes, one of them blue, which can be dragged around the axle. A dashed line marks its starting position, and a spiral arrow shows how far it has turned.
values:
  # TODO: It is confusing to say the angle is zero. Check this new phrasing. 
  angle_geometric_figure: 'The angle between the starting and final positions of each spoke is a zero angle (an angle with measure zero).'
  angular_measure: '$0^\circ$'
  angle_of_rotation: '$720^\circ = 4\pi$ radians'
is: [rotation]
is_not: [orientation_rigid_body]
why:
  angle_geometric_figure: >-
    The angle between the starting and final positions of a spoke of a wheel that turns twice is zero, because the spoke ends where it started.
  angular_measure: >-
    The measure of the angle between the starting and final positions of a spoke of a wheel that turns twice is $0^\circ$.
  angle_of_rotation: >-
    The angle of rotation of a wheel that turns twice counterclockwise is $720^\circ$, because each full counterclockwise turn adds $360^\circ$.
---
