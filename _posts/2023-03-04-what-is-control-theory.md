---
layout: single
title: "What I Study, Part 1: Control Theory"
excerpt: A brief introduction to my field of research.
date: 2023-03-04 08:00:00 -0800
toc: false
categories: research
comments:
  host: mastodon.world
  username: pwintz
  id: 109967391253402066
---
My research as a PhD student is in the field of control theory. 
When I say this, most people don't know what it means. 
I am often asked if that means I am learning "the psychology of how to manipulate people" (I'm not). 
This page provides a brief introduction to the topic that doesn't require any prior knowledge about math or engineering.

In order to understand control theory, it's helpful to first introduce the concept of a dynamical system.
A _dynamical system_ is a system that changes over time. 
Some examples of dynamical systems are a pendulum (mechanical), a power transformer (electronic), a stock market (economic), and populations of predators and prey (ecological).
A dynamical system is described using a list of numbers that change over time. 
We call the list of numbers the _state_ of the system. 
The main questions we ask about a dynamical system is how it behaves over time. 
- Is the state attracted to a particular point? 
- Does state periodically return to the same point? 
- Does the state remain in a particular region? 

Consider, for example, an ecosystem with a population of a predator species and the population of its prey. The state of the system has two values at each moment in time: the population of the predator and the population of the prey. If either of these values goes to zero, then that species goes extinct.

In some dynamical systems, there are _inputs_ that affect the behavior of the system. 
An input is a value that can be directly chosen at each moment in time. 
For a car, the inputs are the throttle (gas pedal), the brake, and the steering wheel. The position and velocity of the car cannot be controlled directly—to move the car to a new location, one must use the throttle and steering wheel to maneuver there.
A dynamical system with inputs is a _control system_ and the study of how to pick the inputs achieve various goals is called _control theory_. In general, our goal is to design the inputs so that the system 
- goes where we want it, 
- avoids obstacles, and 
- minimizes energy use.

