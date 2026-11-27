---
title: '$x \mapsto \tan(x)$ on $(-\pi/2, \pi/2)$'
level: high-school
figure:
  widget: function-plot
  params:
    x: [-2, 2]
    y: [-6, 6]
    curves:
      - {"f": "tan x", "from": -1.5707963, "to": 1.5707963}
  caption: |-
    The graph of $x \mapsto \tan(x)$ on $(-\pi/2, \pi/2)$.
  alt: "A curve through the origin that falls to minus infinity toward -pi/2 and rises to infinity toward pi/2."
is: [continuous]
is_not: [uniformly_continuous]
why:
  continuous: >-
    $\tan$ is continuous on $(-\pi/2, \pi/2)$.
  uniformly_continuous: >-
    $\tan$ is not uniformly continuous there, because its graph gets steeper without bound near the ends of the interval.
---
