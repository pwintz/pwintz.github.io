---
layout: publication
title: > 
    Safety and Asymptotic Stability while Exploiting Uncertified Controllers via Uniting Feedback
authors: Paul K. Wintz
publication: UCSC PhD Dissertation
year: 2025
month: 12
abstract: >
    Certificate functions, such as barrier functions and Lyapunov functions, are commonly used to verify control system properties. The construction of these certificates, however, is often difficult, typically requiring significant trial and error. Once a certificate function is found, modifications to the controller are hindered because each change requires the construction of a new certificate function. This problem is addressed in this dissertation by the design of uniting feedback strategies that allow uncertified controllers to be safely used by exploiting a controller with a known certificate as a backup. In uniting feedback, an automatic supervisor switches between two controllers. The result is a hybrid control strategy that switches between certified and uncertified controllers while preserving the safety or asymptotic property that is guaranteed for the certified controller. By using a certified controller as a backup, these uniting feedback strategies allow for exploiting uncertifiable controllers that may have other desirable properties. A general framework is developed that allows for the design of supervisors for systems with both the controllers and the plant modeled as hybrid dynamical systems with set-valued dynamics, while ensuring the closed-loop system is well-posed and the switching does not occur too often.
    
    Several auxiliary tools and results are also included. A hybrid Lyapunov theorem is presented that relaxes several key assumptions in prior hybrid Lyapunov theorems. These relaxations make it easier to construct Lyapunov certificates and are used to prove results in this dissertation. Additionally, the conical transition graph is presented as a tool for algorithmically checking stability in conical hybrid systems, guiding the search for Lyapunov functions or identifying when such a search is futile. Finally, the Simulator for Hardware Architecture and Real-time Control (SHARC) is a simulation tool for verifying the performance of computationally delayed control systems, providing a useful testing platform for verifying uniting feedback strategies when deployed on systems with limited computational resources.
    
has-pdf: true
has-slides: true
has-bibtex: false
doi: 
---

