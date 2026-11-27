---
title: 'A flowchart'
level: elementary
is: [diagram]
is_not: [
  plot,
  graph_of_function
]
figure:
  widget: diagram
  aspect: 1 / 1
  params:
    nodes:
      - { id: start, text: Start, x: 1, y: 0, shape: terminal }
      - { id: rain, text: "Is it\nraining?", x: 1, y: 1.3, shape: diamond }
      - { id: umbrella, text: "Take an\numbrella", x: 2.4, y: 1.3 }
      - { id: go, text: Go outside, x: 1, y: 2.6 }
      - { id: end, text: End, x: 1, y: 3.6, shape: terminal }
    edges:
      - { from: start, to: rain }
      - { from: rain, to: umbrella, text: "Yes" }
      - { from: umbrella, to: go, via: [[2.4, 2.6]] }
      - { from: rain, to: go, text: "No" }
      - { from: go, to: end }
  caption: |-
    A flowchart for going outside.
  alt: 'A flowchart: Start, then a diamond asking "Is it raining?" If yes, "Take an umbrella," then "Go outside." If no, "Go outside" directly. Then End.'
why:
  diagram: >-
    A flowchart is a diagram because it shows the structure of a process, despite the name "chart."
  graph_of_function: >-
    A flowchart is not the graph of a function, because it shows no data.
  plot: >-
    A flowchart is not a plot, because it shows no data.
---
