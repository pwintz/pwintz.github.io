---
published: false
title: Fourier transform
term: Fourier transform
applies_to: functions
synonyms: ["$\\hat{f}$", "$\\mathcal{F}f$"]
levels:
  high-school:
    text: |-
      The _Fourier transform_ breaks a signal into sine waves of different frequencies, and finds how much of each frequency it contains.
  undergraduate:
    text: |-
      The _Fourier transform_ of an integrable function $f : \reals \to \mathbb{C}$ is $\hat{f}(\omega) = \int_{-\infty}^{\infty} f(t) e^{-i \omega t} \mathrm{d}t$.
---
Conventions differ in where the factor of $2\pi$ goes: some authors use $e^{-2\pi i \xi t}$, and others put $\frac{1}{\sqrt{2\pi}}$ in front.
