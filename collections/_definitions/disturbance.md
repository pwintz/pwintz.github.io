---
title: Disturbance
term: disturbance
applies_to: control systems
levels:
  high-school:
    text: |-
      Consider a system that is trying to follow a course, like a drone flying to a target.
      A _disturbance_ is an outside influence that pushes the system off course.
    figure:
      widget: quadcopter
      params: { scenario: gust }
      caption: |-
        A quadcopter drone in gusty wind (blue arrows), with the target where it tries to hover (dashed outline) and its recent path (fading line).
        Change the gust's strength with the slider, or pause the animation.
      alt: An animated side view of a quadcopter drone that wanders around a dashed outline of the drone at its target as wind arrows change in strength and direction. A slider sets the gust's strength.
  undergraduate:
    context: control systems
    text: |-
      Consider a control system $\dot{x} = f(x, u, d)$, with inputs from outside.
      A _disturbance_ is an unwanted [exogenous input](/dictionary/definitions/exogenous-input), such as $d$, that affects the dynamics of the system.
      It changes the actual state of the system.
---
