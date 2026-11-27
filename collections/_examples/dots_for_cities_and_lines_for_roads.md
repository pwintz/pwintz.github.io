---
title: 'Dots for cities and lines for roads'
level: elementary
figure:
  widget: diagram
  params:
    arrows: false
    nodes:
      - { id: a, text: Monterey, x: 0, y: 0.3, shape: dot, place: above }
      - { id: b, text: Santa Cruz, x: 1.6, y: 0, shape: dot, place: above }
      - { id: c, text: San Francisco, x: 3, y: 0.6, shape: dot, place: right }
      - { id: d, text: Gilroy, x: 0.6, y: 1.6, shape: dot, place: left }
      - { id: e, text: San Jose, x: 2.2, y: 1.8, shape: dot, place: below }
    edges:
      - { from: a, to: b }
      - { from: b, to: c }
      - { from: a, to: d }
      - { from: b, to: e }
      - { from: d, to: e }
      - { from: c, to: e }
  caption: |-
    Dots for five towns and lines for the roads between them.
  alt: Five dots labeled with town names, joined by six lines for roads.
is: [
  graph_network,
  diagram
]
is_not: [
  graph_of_function,
  graph_chart,
  plot
]
why:
  graph_of_function: >-
    The dots and lines form a network, whose vertices is not a chart or the graph of a function, because the positions of the dots do not encode numbers.
  diagram: >-
    The dots and lines are a diagram of a network; in graph theory, the network itself is called a graph.
  plot: >-
    The dots and lines are not a plot, because the positions of the dots do not encode numbers.
  graph_network: >-
    The dots and lines form a network, whose vertices are cities and whose edges are roads.
---
