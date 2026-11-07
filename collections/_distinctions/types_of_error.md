---
published: false
title: Types of errors
kind: siblings
areas: [computing]
status: draft
summary: >
  In computing, "error" and related words describe different ways that things go wrong.
  A numerical error is the gap between a computed value and the true value, and it is often unavoidable.
  An exception is a mechanism for signaling unusual conditions at runtime.
  A bug is a mistake in the program.
  Each can occur without the others.
terms:
  - error
  - bug
  - exception
examples:
  - example: 0_1_plus_0_2_evaluates_to_0_30000000000000004
    why: >-
      The extra $0.00000000000000004$ is an error: the rounding error of floating-point arithmetic.
      It is not an exception, because nothing is raised, and it is not a bug unless the code assumes that the result is exactly $0.3$.
  - example: opening_a_file_that_does_not_exist_raises
    why: >-
      The `FileNotFoundError` is an exception that the program can handle.
      It is not a bug, because a missing file is an expected condition, not a mistake in the code.
  - example: an_index_one_past_the_end_of_a_list_raises
    why: >-
      The `IndexError` is an exception, and it reveals a bug: an off-by-one mistake in the code.
  - example: a_loop_that_silently_skips_the_last_element
    why: >-
      The loop has a bug, because it does not do what was intended.
      It raises no exception, which makes the bug harder to find.
see_also:
  - types_of_difference
---
