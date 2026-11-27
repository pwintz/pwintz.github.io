---
published: false
title: 'A triangle and a square, as networks of dots and lines'
level: high-school
figure:
  widget: diagram
  aspect: 2 / 1
  params:
    arrows: false
    nodes:
      - { id: t1, text: "1", x: 0.6, y: 0, shape: dot, place: above }
      - { id: t2, text: "2", x: 0, y: 1, shape: dot, place: below }
      - { id: t3, text: "3", x: 1.2, y: 1, shape: dot, place: below }
      - { id: s1, text: "1", x: 2.4, y: 0, shape: dot, place: above }
      - { id: s2, text: "2", x: 3.4, y: 0, shape: dot, place: above }
      - { id: s3, text: "3", x: 3.4, y: 1, shape: dot, place: below }
      - { id: s4, text: "4", x: 2.4, y: 1, shape: dot, place: below }
    edges:
      - { from: t1, to: t2 }
      - { from: t2, to: t3 }
      - { from: t3, to: t1 }
      - { from: s1, to: s2 }
      - { from: s2, to: s3 }
      - { from: s3, to: s4 }
      - { from: s4, to: s1 }
  caption: |-
    The triangle graph, with $3$ vertices and $3$ edges, and the square graph, with $4$ vertices and $4$ edges.
  alt: Left, three dots joined in a triangle. Right, four dots joined in a square.
is_not: [isomorphic]
why:
  isomorphic: >-
    A triangle and a square are not isomorphic graphs, because they have different numbers of vertices, so no renaming can match them.
---
