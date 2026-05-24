---
layout: software
title: TikZ
categories: graphics 
homepage: https://tikz.dev/
excerpt: LaTeX graphics library
summary: TikZ is a LaTeX library for generating graphics.
pricing: Free and open source.
alternatives:
  - <a href="/useful-software/inkskape">Inkscape</a>. When producing complicated shapes, Inkscape is typically easier than TikZ, but the process of exporting from Inkscape after changes to the graphics can take longer.
  - <a href="/useful-software/drawio">Draw.io</a>. 
---

Creating graphics in TikZ has a **steep** learning curve (the PDF manual is apparently over a thousand pages), but for simple use cases, such as plotting a function, creating plots in TikZ can be convenient since changes to the graphic can be incorporated simply by re-compiling the LaTeX document.

TikZ also comes with a substantial collection of built-in functions and libraries for generating specific types of diagrams, including 

- [Three-dimensional diagrams](https://tikz.dev/library-3d)
- [Angle markers](https://tikz.dev/library-angle)
- [Automata and Finite State Machine](https://tikz.dev/library-automata)
- [Electrical Circuits](https://tikz.dev/library-circuits)
- [(Discrete) graphs](https://tikz.dev/gd-overview)
- [Trees](https://tikz.dev/library-trees)

For plotting mathematical functions with nicely formatted axes, you can use the `pfgplots` package.


If you are trying to plot something "from scratch", try looking for a library first!

