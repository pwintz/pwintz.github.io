---
layout: single
title: Speaking Mathematical Equations
excerpt: A guide to translating mathematics into English sentences.
date:   2023-12-18 23:43:51 -0800
toc: false
categories: 
comments:
  host: mastodon.world
  username: pwintz
  id:  
---

Throughout mathematical literature, many mathematical statements written as equations rather than as natural language. 
The motivations for using equations are clear. 
Compared to describing mathematical claims in an English sentence, an equation is often much more compact, less prone to ambiguity, and allows information to be arranged on the page in ways that aids clarity.
The use of parentheses to indicate grouping is a simple example of a mathematical notation that is easy to write in an equation but often cumbersome to translate into words. 
Consider the equation, 

$$a (b + c) = 1 / (b + c).$$

A naive translation into English would be "a times b plus c equals one over b plus c". 
But this sentence loses the groupings, so it would likely be wrongly interpreted as 

$$
ab + c = 1/b + c.
$$

Thus, the speaker must be careful to include the groupings. 
A more precise translation is "a times the sum of b plus c equals one over the sum of b plus c".

The remainder of this document describes how to translate specific mathematical expressions into English. 


# Math to English Translation Recipes

## Parentheses and Grouping

<table>
<tr>
  <th></th>
  <th>Equation</th>
  <th>English Translation</th>
</tr>
<tr>
  <td>Arithmetic Grouping</td>
  <td>$a(b+c)$</td>
  <td>
      "a times open parentheses b plus c close parentheses." (avoid this!)<br>
      "a times the sum of b and c." <br>
      "a times the quantity b plus c."<br>
      "The product of a and the quantity b plus c."<br>
  </td>
</tr>
<tr>
  <td>Arithmetic Grouping</td>
  <td>$(a+b)c$</td>
  <td>
      "a plus b all times c." <br>
      "The product of a plus b times c."<br>
      "The quantity a plus b multiplied by c."
  </td>
</tr>
<tr>
  <td>Division</td>
  <td>$(a + b)/c$</td>
  <td>
    "a plus b all divided by c"<br>
    "The sum of a and b all divided by c"<br>
    "The fraction a plus b over c"<br>
  </td>
</tr>
</table>


## Sets

<table>
<tr>
  <th></th>
  <th>Equation</th>
  <th>English Translation</th>
</tr>
<tr>
  <td>Set</td>
  <td>$\{1, 2, 3\}$</td>
  <td>
      "The set containing one, two, and three."<br>
      "The set of one, two, and three."
  </td>
</tr>
<tr>
  <td>Set-builder Notation</td>
  <td>$\{x \in \mathbb{R} \mid P(x)\}$</td>
  <td>
      "The set of all 'x' in 'R' such that 'P' of 'x' is satisfied."
  </td>
</tr>
<tr>
  <td>Element of</td>
  <td>$x \in A$</td>
  <td>
      "'x' is an element of 'A'."<br>
      "'x' is in 'A'."<br>
  </td>
</tr>
<tr>
  <td>Subset of</td>
  <td>$A \subset B$</td>
  <td>
      "(The set) 'A' is a subset of 'B'."<br>
      "(The set) 'A' is contained in 'B'."<br>
  </td>
</tr>
<tr>
  <td>Superset of</td>
  <td>$A \supset B$</td>
  <td>
      "(The set) 'A' is a super set of 'B'."<br>
      "(The set) 'A' contains 'B'."<br>
  </td>
</tr>
<tr>
  <td>Strict Subset of</td>
  <td>$A \subsetneq B$</td>
  <td>
      "(The set) 'A' is a strict subset of 'B'."<br>
      "(The set) 'A' is a proper subset of 'B'."<br>
      "(The set) 'A' is a subset of 'B', but not equal to 'B'."<br>
  </td>
</tr>
<tr>
  <td>Union</td>
  <td>$A \cup B$</td>
  <td>
      "The union of 'A' and 'B'."<br>
      "'A' union 'B'."
  </td>
</tr>
<tr>
  <td>Intersection</td>
  <td>$A \cap B$</td>
  <td>
      "The intersection of 'A' and 'B'."<br>
      "'A' intersection 'B'."<br>
      "'A' intersect 'B'."
  </td>
</tr>
</table>


## Calculus

<table>
<tr>
  <th></th>
  <th>Equation</th>
  <th>English Translation</th>
</tr>
<tr>
  <td>Integrals</td>
  <td>$$\int_a^b f(x) dx$$</td>
  <td>
    "The integral of f of x over x from a to b."<br>
    "The integral of f of x, dee-x with lower limit a and upper limit b."<br>
  </td>
</tr>
<tr>
  <td>Total Derivatives</td>
  <td>$$\frac{df}{dx}$$</td>
  <td>
    "dee-f, dee-x."<br>
    "The derivative of f with respect to x."<br>
  </td>
</tr>
<tr>
  <td>Second Derivatives</td>
  <td>$$\frac{d^2f}{dx^2}$$</td>
  <td>
    <!-- "dee-f, dee-x."<br> -->
    "The second derivative of f with respect to x."<br>
    (If you have a shorter or alternative way to say this, please let me know).<br>
  </td>
</tr>
<tr>
  <td>Second Derivatives</td>
  <td>$$\frac{d^2f}{dxdy}$$</td>
  <td>
    <!-- "dee-f, dee-x."<br> -->
    "The second derivative of f with respect to x and y."<br>
    (If you have a shorter or alternative way to say this, please let me know).<br>
  </td>
</tr>
<tr>
  <td>Total Derivatives (Evaluated)</td>
  <td>$$\frac{df}{dx}\Big\rvert_{x_0}$$</td>
  <td>
    "dee-f, dee-x at x-zero."<br>
    "The derivative of f with respect to x evaluated at x-zero."<br>
  </td>
</tr>
<tr>
  <td>Total Derivatives (Evaluated)</td>
  <td>$$f'(x)$$</td>
  <td>
    "f-prime of x."<br>
    "The derivative of f at x."<br>
  </td>
</tr>
<tr>
  <td>Partial Derivative</td>
  <td>$$\frac{\partial f}{\partial x}$$</td>
  <td>
    "partial f, partial x."<br>
    "The partial derivative of f with respect to x."<br>
  </td>
</tr>
</table>


This is document is a work in progress that will continue to grow as I find examples that are worthy of inclusion. If you have suggestions, please [contact me](mailto:pwintz+ws@ucsc.edu).

For more on this topic, see ["How can we speak math?"](https://people.eecs.berkeley.edu/~fateman/papers/speakmath.pdf) by Richard Fateman.

