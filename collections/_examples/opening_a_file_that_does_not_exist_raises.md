---
title: 'In Python, opening a file that does not exist raises `FileNotFoundError`'
level: high-school
is: [exception]
is_not: [bug]
why:
  exception: >-
    The `FileNotFoundError` is an exception that the program can handle.
  bug: >-
    The `FileNotFoundError` is not a bug, because a missing file is an expected condition, not a mistake in the code.
---
