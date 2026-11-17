---
title: Total Derivative (Along a Path)
term: total derivative (along a path)
applies_to: functions along paths
synonyms: [material derivative (in fluid mechanics)]
levels:
  undergraduate:
    text: |-
      For a function $f(t, x)$ evaluated along a [path](/dictionary/definitions/path-continuous) $x(t)$, the _total derivative_ is
      
      $$\frac{\diff{}}{\dt} f(t, x(t)) = \frac{\partial f}{\partial t} + \ip{\nabla_x f}{\frac{\dx}{\dt}},$$
      
      where $\nabla f$ is the [gradient](/dictionary/definitions/gradient) of $f$.
---

The total derivative accounts for the change in $f$ both from its explicit dependence on $t$ and through $x(t)$.


Another common meaning of "total derivative" is the [linear map](/dictionary/definitions/linear-map) $Df(x)$: see [total derivative (linear map)](/dictionary/definitions/total-derivative-linear-map) and [the meanings of "total derivative"](/dictionary/distinctions/total-derivative-along-path-vs-linear-map).
