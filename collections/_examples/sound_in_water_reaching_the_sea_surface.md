---
published: false
title: Sound in seawater reaching the sea surface from below, at normal incidence
level: undergraduate
description: >-
  The characteristic acoustic impedance of seawater is about $1.54 \times 10^{6}$ rayl, and the characteristic acoustic impedance of air is about $413$ rayl.
is: [reflection_wave]
values:
  reflection_coefficient: '$R \approx -0.99946$'
  transmission_coefficient: '$T \approx 0.00054$'
why:
  reflection_wave: >-
    Sound in seawater reaching the sea surface is reflected, because the impedance of air is much smaller than the impedance of seawater, so nearly all of the sound turns back down into the water.
  reflection_coefficient: |-
    The reflection coefficient of the pressure for sound in seawater reaching the sea surface is

    $$R = \frac{Z_{\text{air}} - Z_{\text{water}}}{Z_{\text{air}} + Z_{\text{water}}} \approx \frac{413 - 1{,}537{,}500}{413 + 1{,}537{,}500} \approx -0.99946.$$

    The reflection coefficient is negative, so the reflected sound is flipped upside down.
  transmission_coefficient: |-
    The transmission coefficient of the pressure for sound in seawater reaching the sea surface is

    $$T = \frac{2 Z_{\text{air}}}{Z_{\text{air}} + Z_{\text{water}}} \approx \frac{826}{1{,}537{,}913} \approx 0.00054.$$

    Only about $0.1\%$ of the energy of the sound passes into the air.
---
Because the reflected sound is flipped, a hydrophone just below the surface hears the direct sound nearly canceled by its surface echo at low frequencies.
