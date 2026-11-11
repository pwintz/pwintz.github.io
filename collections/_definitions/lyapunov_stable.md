---
published: false
title: Lyapunov stable equilibrium
term: stable
applies_to: equilibria
synonyms: [Lyapunov stable, stable in the sense of Lyapunov]
levels:
  elementary:
    text: |-
      Think of a system at rest, like a marble at the bottom of a bowl, and give it a small push.
      The resting state is _stable_ if the push moves the system only a little away from it.
  high-school:
    text: |-
      Consider a system with an [equilibrium](/dictionary/definitions/equilibrium), and the solutions that start close to it.
      The equilibrium is _stable_ if those solutions stay close to it.
  undergraduate:
    text: |-
      Consider a system $\dot{x} = f(x)$ with an [equilibrium](/dictionary/definitions/equilibrium) $x^{\ast}$.
      The equilibrium is _stable_ if for every $\varepsilon > 0$ there is $\delta > 0$ such that

      $$\norm{x(0) - x^{\ast}} < \delta \implies \norm{x(t) - x^{\ast}} < \varepsilon \quad \text{for all } t \geq 0.$$
---
Stability does not require solutions to converge to the [equilibrium](/dictionary/definitions/equilibrium).
