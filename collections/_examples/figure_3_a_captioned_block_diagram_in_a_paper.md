---
published: false
title: '"Figure 3," a captioned block diagram in a paper'
level: elementary
figure:
  widget: diagram
  aspect: 2 / 1
  params:
    nodes:
      - { id: r, text: r, x: 0, y: 0, shape: text }
      - { id: sum, text: "", x: 1, y: 0, shape: circle }
      - { id: controller, text: Controller, x: 2.3, y: 0 }
      - { id: plant, text: Plant, x: 3.8, y: 0 }
      - { id: y, text: y, x: 5, y: 0, shape: text }
      - { id: sensor, text: Sensor, x: 3.05, y: 1.1 }
    edges:
      - { from: r, to: sum, head: "+" }
      - { from: sum, to: controller }
      - { from: controller, to: plant }
      - { from: plant, to: y }
      - { from: plant, to: sensor, via: [[4.5, 0], [4.5, 1.1]] }
      - { from: sensor, to: sum, via: [[1, 1.1]], head: "−" }
  caption: |-
    **Figure 3.** A feedback control system.
  alt: 'A block diagram: the reference r enters a summing junction, then a Controller block, then a Plant block, whose output is y. A Sensor block feeds y back to the summing junction with a minus sign.'
is: [
  figure,
  diagram
]
why:
  figure: >-
    "Figure 3" is a figure because it is placed in a document with a number and a caption.
  diagram: >-
    "Figure 3" is a diagram because it shows the structure of a system.
---
