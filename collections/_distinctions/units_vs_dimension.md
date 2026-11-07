---
published: false
title: Unit vs. physical dimension
kind: siblings
areas: [language]
status: draft
summary: >
  A physical quantity has both a kind (such as length) and a scale for measuring it.
  The physical dimension of a quantity is what kind of quantity it is (such as length).
  A unit is a particular reference amount of that kind (such as a meter).
terms:
  - unit_of_measurement
  - physical_dimension
examples:
  - example: length
    why: >-
      Length is a physical dimension, because meters, feet, and light-years are all units of length.
      It is not a unit, because it is not a specific amount.
  - example: meter
    why: >-
      The meter is a unit of measurement, because it is a specific amount of length.
      It is not a physical dimension.
  - example: radian
    why: >-
      The radian is a unit of measurement for angles.
      Angles are dimensionless, because an angle in radians is a ratio of two lengths.
see_also:
  - meanings_of_dimension
  - types_of_size
---
## Notes

- An equation is dimensionally consistent if both sides have the same physical dimension.
  This is independent of the choice of units, and checking it (dimensional analysis) catches many errors.
- Quantities with the same dimension can be added after converting units ($1~\mathrm{m} + 1~\mathrm{ft}$).
  Quantities with different dimensions cannot be added at all ($1~\mathrm{m} + 1~\mathrm{s}$).
- "Dimension" also means the dimension of a vector space, which is unrelated.
  See [the meanings of "dimension"](/distinctions/meanings-of-dimension).
