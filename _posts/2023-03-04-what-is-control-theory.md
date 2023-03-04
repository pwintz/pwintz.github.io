---
layout: single
title: "What I Study, Part 1: Dynamical Systems, Control Theory, and Hybrid Systems"
excerpt: A brief introduction to my field of research, written for a layperson.
date: 2023-03-04 08:00:00 -0800
toc: false
categories: my-work
comments:
  host: mastodon.world
  username: pwintz
  id:  
---
A _dynamical system_ refers to any system that changes over time. 
Some examples of dynamical systems are a pendulum (mechanical), a power transformer (electronic), a stock market (economic), and populations of predators and prey (ecological).
The principle question about dynamical systems is the behavior of the system over time. 
- Does it eventually stop moving? 
- Does it repeatedly return to the same state? 
- Does it remain in a particular region? 

In some dynamical systems, there are _inputs_ that affect the behavior of the system. 
An input is a value that can be directly chosen at each moment in time. 
For a car, the inputs are the throttle (gas pedal), the brake, and the steering wheel. The position and velocity of the car cannot be controlled directly—to move the car to a new location, one must use the throttle and steering wheel to maneuver there.
A dynamical system with inputs is called a _control system_ and the study of how to pick the inputs achieve various goals is called _control theory_. In general, our goal is to design the inputs so that the system 
- goes where we want it, 
- avoids obstacles, and 
- minimizes energy use.