---
layout: single
title: Speaking Mathematical Equations
excerpt: A guide to translating mathematics into English sentences.
date:   2023-12-18 23:43:51 -0800
toc: false
categories: 
comments:
  host: mathstodon.xyz
  username: pwintz
  id: 111736829673674058
---

A common difficulty encountered by math students is the difficulty of translating equations into words.
Such translations are unavoidable when verbally discussing mathematics, and being a fluent translator is also a powerful aid to a student's understanding. 
<!-- Throughout mathematical literature, many mathematical statements written are as equations rather than as natural language.  -->
<!-- The motivations for using equations are clear.  -->
Equations are, of course, ubiquitous in mathematics (although this was not the case in antiquity; cf. [Euclid's Elements](https://philomatica.org/wp-content/uploads/2024/04/Elements.pdf)). 
Compared to an English sentence, an equation is often more compact, less ambiguous, and allows information to be arranged on the page in ways that aids clarity.

<!-- There are three sources of difficulties when translating an equation: 

1. Identifying the name and meaning of each symbol. (e.g., "$\int$" means "integral", and "$\mathbb{R}$" means the set of real numbers). -->

Even simple equations can be difficult to put into words accurately. 
One example is the use of parentheses to indicate grouping.
 <!-- of a mathematical notation that is easy to write in an equation but often cumbersome to translate into words.  -->
Consider the equation, 

$$
a (b + c) = 1 / (b + c).
$$

A naive translation into English would lose the groupings imposed by the parentheses: "a times b plus c equals one over b plus c". 
Indeed, this sentence erroneous translation indicates a different equation: 

$$
ab + c = 1/b + c.
$$

This example illustrates how a speaker must be careful to indicate the groupings in their speech.
It is not self-evident how to do this and the remainder of this document describes how to translate specific mathematical expressions into English. 
For this example, a precise translation is "a times the sum of b plus c equals one over the sum of b plus c".


# Math to English Translation Recipes

This section contains recipes for how to translate from various mathematical expressions into English.
Since any mathematical expression can be translated multiple ways, several translations are given in the right column of each table.

<!-- When all else fails, one may resort to reading out the latex code -->
## Parentheses and Grouping

<table>
<tr>
  <th></th>
  <th>Mathematical Expression</th>
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
      "a plus b <b>all</b> times c." <br>
      "The product of a plus b times c."<br>
      "The quantity a plus b multiplied by c."
  </td>
</tr>
<tr>
  <td>Division</td>
  <td>$(a + b)/c$</td>
  <td>
    "a plus b all divided by c"<br>
    "The sum of a and b <b>all</b> divided by c"<br>
    "The fraction a plus b over c"<br>
  </td>
</tr>
</table>

## Algebra

<table>
<tr>
  <th></th>
  <th>Mathematical Expression</th>
  <th>English Translation</th>
</tr>
<tr>
  <td>Squared</td>
  <td>$x^2$</td>
  <td>
      "x squared"<br>
      "x to the power of two."<br>
  </td>
</tr>
<tr>
  <td>Exponent</td>
  <td>$e^x2$</td>
  <td>
      "e to the x"<br>
  </td>
</tr>
<tr>
  <td>Square Root</td>
  <td>$\sqrt{2}$</td>
  <td>
      "square root of 2"<br>
      "root 2"<br>
  </td>
</tr>
<tr>
  <td>nth Root</td>
  <td>$\sqrt[n]{2}$</td>
  <td>
      "nth root of 2"<br>
  </td>
</tr>
<tr>
  <td>Natural log</td>
  <td>$\ln{x}$</td>
  <td>
      "natural log of x"<br>
      "log of x"<br>
      "log x"<br>
      "ell-en of x"<br>
      "ell-en x"<br>
  </td>
</tr>
<tr>
  <td>Factorial</td>
  <td>$n!$</td>
  <td>
      "n factorial"<br>
      "factorial of n"<br>
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
      "The set of all 'x' in 'R' such that 'P' of 'x' is satisfied."<br>
      "The set of 'x' in 'R' such that 'P' of 'x'."
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
  <td>Definite Integrals</td>
  <td>$$\int_a^b f(x) dx$$</td>
  <td>
    "The integral of f of x with respect to x."<br>
    "The integral of f of x, dee-x."<br>
    "integral f of x, dee-x."<br>
  </td>
</tr>
<tr>
  <td>Indefinite Integrals</td>
  <td>$$\int_a^b f(x) dx$$</td>
  <td>
    "The integral of f of x with respect to x from a to b."<br>
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

## Linear Algebra
<table>
<tr>
  <th></th>
  <th>Equation</th>
  <th>English Translation</th>
</tr>
<tr>
  <td>Matrix Element</td>
  <td>$$A_{ij}$$</td>
  <td>
    "The $i$,$j$ element of $A$."<br>
  </td>
</tr>
<tr>
  <td>Matrix Multiplication</td>
  <td>$$Ax$$</td>
  <td>
    "$A$ times $x$."<br>
    "$A$ $x$."<br>
  </td>
</tr>
<tr>
  <td>Transpose</td>
  <td>$$A^\top$$</td>
  <td>
    "$A$ transpose."<br>
    "The transpose of $A$."<br>
  </td>
</tr>
<tr>
  <td>Inverse</td>
  <td>$$A^{-1}$$</td>
  <td>
    "$A$ inverse."<br>
    "The inverse of $A$."<br>
  </td>
</tr>
<tr>
  <td>Dot Product</td>
  <td>$$x \cdot y$$</td>
  <td>
    "$x$ dot $y$."<br>
    "The dot product of $x$ and $y$."<br>
  </td>
</tr>
<tr>
  <td>Inner Product</td>
  <td>$$\langle x, y\rangle$$</td>
  <td>
    "The inner product of $x$ and $y$."<br>
  </td>
</tr>
<tr>
  <td>Null space</td>
  <td>$$\operatorname{null} A$$</td>
  <td>
    "The null space of matrix $A$."<br>
    "null space of $A$."<br>
  </td>
</tr>
<tr>
  <td>Column space</td>
  <td>$$\operatorname{col} A$$</td>
  <td>
    "The column space of matrix $A$."<br>
    "column space of $A$."<br>
  </td>
</tr>
<tr>
  <td>Coordinate</td>
  <td>$$[x]_{\mathcal{B}}$$</td>
  <td>
    "The coordinate vector of (vector) $x$ relative to (basis) $\mathcal{B}$."<br>
    "The $\mathcal{B}$-coordinate vector of $x$."<br>
  </td>
</tr>
</table> 


This is document is a work in progress that will continue to grow as I find examples that are worthy of inclusion. If you have suggestions, please [contact me](mailto:pwintz+ws@ucsc.edu).

For more on this topic, see ["How can we speak math?"](https://people.eecs.berkeley.edu/~fateman/papers/speakmath.pdf) by Richard Fateman.

