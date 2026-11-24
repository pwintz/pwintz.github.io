---
title: Bearing vs. Heading vs. Course
kind: siblings
areas: [physics, control]
summary: >
  The [bearing](/dictionary/definitions/bearing), the [heading](/dictionary/definitions/heading), and the [course](/dictionary/definitions/course) are all compass directions, measured clockwise from north.
  The heading is the direction that the vehicle points, and the course is the direction that the vehicle moves.
  The heading and the course are the same when the vehicle moves straight ahead through still air or water, but they differ when a crosswind or a current pushes the vehicle sideways, or when the vehicle moves sideways on purpose.
  The bearing is the direction from the vehicle to another object, so it depends on where that object is, not on how the vehicle points or moves.
terms:
  - bearing
  - heading
  - course
examples:
  - example: a_ship_pointing_north_and_moving_north_in_still_water
  - example: a_boat_pointing_north_at_4_m_s_in_water_flowing_east_at_3_m_s
    why: >-
      A boat that points north in water flowing east at $3$ m/s has a heading of $0^\circ$, but the current pushes the boat east, so its course is about $37^\circ$.
  - example: a_helicopter_pointing_north_and_flying_east
    why: >-
      A helicopter that points north and flies sideways toward the east has a heading of $0^\circ$ and a course of $90^\circ$, even with no wind.
  - example: a_lighthouse_due_east_of_a_ship_pointing_north
    why: >-
      A ship that points north and moves north in still water has a heading and a course of $0^\circ$, but a lighthouse due east of the ship has a bearing of $90^\circ$, because the bearing is the direction to the lighthouse, not the direction the ship points or moves.
see_also:
  - rotation_vs_orientation
---
## Notes

- When a pilot flies a plane along a chosen course in a crosswind, they point the airplane partly into the wind, so the heading differs from the course.
  The angle from the heading to the course is called the _drift angle_, and the angle that the pilot turns into the wind is called the _wind correction angle_ or _crab angle_.
- The [heading](/dictionary/definitions/heading) depends only on the [orientation](/dictionary/definitions/orientation-rigid-body) of the vehicle, but the [course](/dictionary/definitions/course) depends on the velocity of the vehicle.
- The [bearing](/dictionary/definitions/bearing) depends on the positions of the vehicle and the object, not on the heading or the course.
- Many navigators use the _relative bearing_ instead of the bearing, which is measured from the heading of the vehicle rather than from north.
- The bearing from a vehicle to an object is the opposite direction from the bearing from the object to the vehicle, which differs by $180^\circ$.
