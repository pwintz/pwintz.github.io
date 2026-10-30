---
published: false
title: Types of errors
kind: siblings
areas: [computing]
status: draft
summary: >
  A numerical error is the gap between a computed value and the true value, and it is often unavoidable.
  An exception is a mechanism for signaling unusual conditions at runtime. A bug is a mistake in the program. Each can occur without the others.
terms:
  - error
  - bug
  - exception
examples:
  - example: 0_1_plus_0_2_evaluates_to_0_30000000000000004
    why: >-
      Rounding error in floating-point arithmetic. It becomes a bug only if the code assumes exact equality.
  - example: opening_a_file_that_does_not_exist_raises
    why: >-
      An expected condition that the program can handle.
  - example: an_index_one_past_the_end_of_a_list_raises
    why: >-
      The exception reveals an off-by-one bug.
  - example: a_loop_that_silently_skips_the_last_element
    why: >-
      A bug that raises no exception, which makes it harder to find.
see_also:
  - types_of_difference
---
