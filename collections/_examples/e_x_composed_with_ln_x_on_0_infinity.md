---
title: 'The exponential function $f(x) = e^x$ composed with the natural logarithm $g(x) = \ln x$, on $(0, \infty)$'
level: undergraduate
figure:
  widget: function-plot
  aspect: 1 / 1
  params:
    equal: true
    x: [-3, 5]
    y: [-3, 5]
    curves:
      - {"f": "e^x", "label": "f"}
      - {"f": "ln(x)", "label": "g", "from": 0}
      - {"f": "e^(ln(x))", "label": "f \\circ g", "dash": true, "from": 0, "ends": "( "}
  caption: |-
    The graphs of $f(x) = e^x$, $g(x) = \ln x$, and $(f \circ g)(x) = e^{\ln x}$ on $(0, \infty)$ (dashed).
  alt: "An exponential curve for f, a logarithm curve for g, and a dashed diagonal line for their composition, starting just right of the origin."
is: [function_composition, identity_function]
values:
  function_composition: '$(f \circ g)(x) = e^{\ln x} = x$, for $x > 0$'
why:
  function_composition: >-
    The composition $f \circ g$ is the [identity function](/dictionary/definitions/identity-function) on $(0, \infty)$, because the natural logarithm is the inverse function of the exponential function.
---
