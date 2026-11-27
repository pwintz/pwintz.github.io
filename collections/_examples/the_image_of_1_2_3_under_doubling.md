---
published: false
title: 'The set of inputs $\setdef{1, 2, 3}$, for the function that doubles numbers'
level: elementary
figure:
  widget: diagram
  aspect: 3 / 2
  params:
    nodes:
      - { id: in1, text: "1", x: 0, y: 0, shape: circle }
      - { id: in2, text: "2", x: 0, y: 1, shape: circle }
      - { id: in3, text: "3", x: 0, y: 2, shape: circle }
      - { id: out2, text: "2", x: 2.4, y: 0, shape: circle }
      - { id: out4, text: "4", x: 2.4, y: 1, shape: circle }
      - { id: out6, text: "6", x: 2.4, y: 2, shape: circle }
      - { id: inputs, text: Inputs, x: 0, y: -0.75, shape: text }
      - { id: outputs, text: Outputs, x: 2.4, y: -0.75, shape: text }
    edges:
      - { from: in1, to: out2, text: double }
      - { from: in2, to: out4 }
      - { from: in3, to: out6 }
  caption: |-
    The function that doubles numbers, from the inputs $1$, $2$, and $3$ to the outputs $2$, $4$, and $6$.
  alt: Three circles for the inputs 1, 2, and 3 on the left, with arrows to three circles for the outputs 2, 4, and 6 on the right.
values:
  image: '$\setdef{2, 4, 6}$'
why:
  image: >-
    The image of $\setdef{1, 2, 3}$ under the function that doubles numbers is $\setdef{2, 4, 6}$, because doubling $1$, $2$, and $3$ gives $2$, $4$, and $6$.
---
