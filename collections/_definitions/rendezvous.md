---
published: false
title: Rendezvous
term: rendezvous
applies_to: control problems
levels:
  high-school:
    text: |-
      _Rendezvous_ is a control problem of steering a vehicle to meet a moving target, arriving at the same place as the target with the same velocity as the target at some time.
  undergraduate:
    context: control of vehicles
    text: |-
      Consider a controlled vehicle with position $p(t)$ and velocity $v(t)$, and a target with position $p_{\mathrm{T}}(t)$ and velocity $v_{\mathrm{T}}(t)$.
      _Rendezvous_ is the problem of choosing the inputs to the vehicle such that, at some final time $t_f$,

      $$p(t_f) = p_{\mathrm{T}}(t_f) \quad \text{and} \quad v(t_f) = v_{\mathrm{T}}(t_f).$$
properties:
  - >-
    Rendezvous is a condition at the final time $t_f$ only, so rendezvous is usually posed as an [optimal control](/definitions/optimal-control) problem with a terminal constraint, such as minimizing fuel.
---
In multi-agent systems, _rendezvous_ means a different problem: the agents must all converge to one common point, which the agents agree on through communication instead of knowing in advance.
