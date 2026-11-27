---
title: Graph (Network)
term: graph (network)
applies_to: networks
levels:
  elementary:
    text: |-
      A _graph_ is a set of dots (vertices) joined by lines (edges).
    figure:
      widget: diagram
      params:
        arrows: false
        nodes:
          - { id: a, text: A, x: 0, y: 0, shape: dot, place: above }
          - { id: b, text: B, x: 1.4, y: 0.2, shape: dot, place: above }
          - { id: c, text: C, x: 2.4, y: 1.1, shape: dot, place: below }
          - { id: d, text: D, x: 0.7, y: 1.4, shape: dot, place: below }
          - { id: e, text: E, x: 3.3, y: 0.1, shape: dot, place: above }
        edges:
          - { from: a, to: b }
          - { from: b, to: c }
          - { from: a, to: d }
          - { from: b, to: d }
          - { from: c, to: e }
      caption: |-
        A graph with five vertices, $A$ to $E$, and five edges.
      alt: Five dots labeled A to E, joined by five lines.
  undergraduate:
    context: graph theory
    text: |-
      A _graph_ is a pair $G = (V, E)$ of a set $V$ of vertices and a set $E$ of edges, where each edge connects two vertices.
---
