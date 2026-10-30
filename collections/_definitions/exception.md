---
published: false
title: Exception
term: exception
applies_to: programs
levels:
  high-school:
    text: |-
      An _exception_ is a signal that a running program raises when something unusual happens, so that another part of the program can handle it.
  undergraduate:
    context: programming
    text: |-
      An _exception_ is a runtime event that interrupts the normal flow of a program to signal an unusual condition. It is raised (or thrown) where the condition is detected and can be handled (or caught) elsewhere.
---
In Java, `Error` and `Exception` are separate classes: an `Error` signals a serious problem that a program should not try to catch, such as running out of memory. In Python, most built-in exception classes are named `...Error`.
