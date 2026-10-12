---
# ╭──────────────────────────────────────────╮
# │   ╭──────────────────────────────────╮   │
# │   │          Page Metadata           │   │
# │   ╰──────────────────────────────────╯   │
# ╰──────────────────────────────────────────╯
# Same layout as the CV, but published at its own URL so the two do not collide.
layout:    cv
title:     Resume 
permalink: /resume/gnc
include-publications: false

# ╭──────────────────────────────────────────╮
# │   ╭──────────────────────────────────╮   │
# │   │             Summary              │   │
# │   ╰──────────────────────────────────╯   │
# ╰──────────────────────────────────────────╯
# Rewritten to lead with controls, real-time/embedded software, and safety-critical design.
biography:
  Paul K. Wintz holds a PhD in Applied Mathematics from UC Santa Cruz (2025). He researched nonlinear and hybrid control systems with formal stability and safety guarantees and developed mathematical methods and simulation tools for the analysis of feedback systems running on computationally constrained hardware. 
  In 2022, he was finalist for Best Student Paper at the American Control Conference.
  # He previously developed software for surgical camera systems. 
  # He has taught mathematics as adjunct faculty at Hartnell College and UCSC. 
  
# ╭──────────────────────────────────────────╮
# │   ╭──────────────────────────────────╮   │
# │   │          Research Areas          │   │
# │   ╰──────────────────────────────────╯   │
# ╰──────────────────────────────────────────╯
# Trimmed to the interests that map onto the posting; ordered by relevance.
research-interests:
  - Nonlinear and hybrid feedback control with formal stability guarantees
  - Safe exploitation of uncertified controllers
  - Real-time, computationally-constrained cyber-physical systems
  # - Model predictive control and optimal control
  - Reachability and asymptotic analysis of hybrid systems
  - Formal verification of dynamical and control systems

# ╭──────────────────────────────────────────╮
# │   ╭──────────────────────────────────╮   │
# │   │              Skills              │   │
# │   ╰──────────────────────────────────╯   │
# ╰──────────────────────────────────────────╯
# Ordered to mirror the posting's keywords (C++/Python, control methods, simulation, analysis tools).
# Commented-out items are in the posting but NOT supported by your CV. Uncomment only if true.
skills:
  - Python
  - MATLAB
  - C++
  - Nonlinear Control
  - Model Predictive Control
  - Linear Feedback Control
  - Hybrid Dynamical Systems
  - Set-valued and Non-Smooth Analysis
  - Simulation and Analysis Tool Development
  - Git
  - Docker
  # - Aircraft Dynamics (CTOL/VTOL)
  # - Robust Control (H-infinity, mu-synthesis, ...)
  # - System Identification
  # - Real-time Signal Processing
  # - Automatic Differentiation (e.g. CasADi, JAX)
  # - Flight Test Support

# ╭──────────────────────────────────────────╮
# │   ╭──────────────────────────────────╮   │
# │   │            Experience            │   │
# │   ╰──────────────────────────────────╯   │
# ╰──────────────────────────────────────────╯
# Research is listed first because it is the most relevant experience for this role.
employers:

  - name: University of California, Santa Cruz
    jobs:
      - title:      Graduate Student Researcher, Applied Mathematics
        dates:      Spring 2021-Fall 2025
        highlights:
          - Designed control schemes to exploit uncertified (learning-based) controllers while retaining formal stability and safety guarantees.
          - Developed Lyapunov-based and graph-based tools for analyzing asymptotic stability and reachability of hybrid dynamical systems.
          - Built the SHARC simulator for studying how computational hardware affects real-time controllers. 
          # - Published and presented at ACC, CDC, ADHS, and HSCC; Best Student Paper finalist at ACC 2022.
          # - Validated controllers on aircraft/vehicle dynamics models (TODO: only if true; name the platform).
          # - Wrote C++ code for ... (TODO: only if true).

  - name: Arthrex California Technology
    jobs:
      - title:      Junior Software Engineer
        dates:      June 2016-September 2018
        highlights:
          - Designed and implemented features for surgical camera systems on Android and Linux.
          - Created the prototype of the real-time video transformation software used in the <a href="https://www.linkedin.com/posts/paul-wintz-10621049_whatsnewatarthrex-arthrex-medicaleducation-activity-7176801620503003136-Ya8f?utm_source=share&utm_medium=member_desktop">Pano scope system</a>.

  - name: Hartnell College / UC, Santa Cruz
    jobs:
      - title:      Instructor, Undergraduate Mathematics
        dates:      Winter 2024; Fall 2025-Present
        highlights:
          - Taught calculus and linear algebra to classes of up to 270 students, with emphasis on applications to engineering.

# ╭──────────────────────────────────────────╮
# │   ╭──────────────────────────────────╮   │
# │   │             Projects             │   │
# │   ╰──────────────────────────────────╯   │
# ╰──────────────────────────────────────────╯
# Dropped the music tuner and the VS Code linter extension: unrelated to controls.
software:
  - name: SHARC (Simulator for Hardware Architecture and Real-time Control)
  - name: Hybrid Equations Toolbox

# ╭──────────────────────────────────────────╮
# │   ╭──────────────────────────────────╮   │
# │   │      Selected Presentations      │   │
# │   ╰──────────────────────────────────╯   │
# ╰──────────────────────────────────────────╯
# Conference papers only; posters are omitted. Entries are kept in reverse-chronological order.
# conference-presentations:
#   - title:    Relaxed Lyapunov Conditions for Compact Sets in Dynamical Systems
#     venue:    American Control Conference
#     date:     July 2025
#     location: Denver, Colorado
# 
#   - title:    "SHARC: Simulator for Hardware Architecture and Real-time Control"
#     venue:    "ACM International Conference on Hybrid Systems: Computation and Control (HSCC)"
#     date:     May 2025
#     location: Irvine, California
# 
#   - title:    Conical Transition Graphs for Analysis of Asymptotic Stability in Hybrid Dynamical Systems
#     venue:    IFAC Conference on Analysis and Design of Hybrid Systems (ADHS)
#     date:     July 2024
#     location: Boulder, Colorado
# 
#   - title:    Forward Invariance-Based Hybrid Control Using Uncertified Controllers
#     venue:    IEEE Conference on Decision and Control
#     date:     December 2023
#     location: Singapore
# 
#   - title:    Global Asymptotic Stability of Nonlinear Systems while Exploiting Properties of Uncertified Feedback Controllers via Opportunistic Switching
#     venue:    American Control Conference
#     date:     June 2022
#     location: Atlanta, Georgia

# ╭──────────────────────────────────────────╮
# │   ╭──────────────────────────────────╮   │
# │   │            Education             │   │
# │   ╰──────────────────────────────────╯   │
# ╰──────────────────────────────────────────╯
# Santa Barbara City College removed to save space.
schools:
  - name:       University of California, Santa Cruz
    gpa:        3.93
    start-date: 09/2018
    end-date:   12/2025
    items:
      - name: PhD in Applied Mathematics   # TODO: Add dissertation title.
        date: 12/2025
      - name: M.S. in Scientific Computing and Applied Mathematics
        date: 09/2020

  - name:       Westmont College
    gpa:        4.00
    start-date: 09/2014
    end-date:   05/2016
    items:
      - name: 'B.S. in Engineering Physics with a Minor in Music'

# ╭──────────────────────────────────────────╮
# │   ╭──────────────────────────────────╮   │
# │   │              Honors              │   │
# │   ╰──────────────────────────────────╯   │
# ╰──────────────────────────────────────────╯
# Only research-relevant honors are kept.
honors:
  # - honor:    Dissertation Year Fellowship
  #   location: University of California, Santa Cruz
  #   date:     Fall 2024 - Spring 2025

  # - honor:    🥈 Shortlisted for Outstanding Student Paper Prize
  #   location: CSS Technical Committee on Hybrid Systems
  #   date:     2024

  - honor:    🥈 Best Student Paper Award Finalist
    location: American Control Conference
    date:     June 2022

  - honor:    🥇 Top Student Award / 🎖️ Outstanding Senior Award
    location: Westmont College / Department of Physics, Westmont College
    date:     May 2016

---