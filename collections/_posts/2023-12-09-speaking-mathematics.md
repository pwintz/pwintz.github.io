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

example-categories:
  - name: Arithmetic
    items: 
      - name: "Addition"
        example-expression: $2 + 3$
        translations: 
          - "\"two plus three\""
          - "\"the sum of two and three\""
          - "\"two added to three\""
      - name: "Multiplication"
        example-expression: $2\times 3$, <br> $2 \cdot 3$, <br> $(2)(3)$
        translations: 
          - "\"two times three\""
          - "\"the product of two and three\""
          - "\"two multiplied with three\""
      - name: "Subtraction"
        example-expression: $2 - 3$
        translations: 
          - "\"two minus three\""
          - "\"the difference of two and three\""
          - "\"three subtracted from two\""
      - name: "Division"
        example-expression: $2 / 3$
        translations: 
          - "\"two over three\""
          - "\"two divided by three\""
          - "\"two quotient three\""
          - "\"the division of two by three\""
  - name: Parentheses and Grouping
    items: 
      - name: "Multiplication"
        example-expression: $a(b+c)$
        translations: 
          - "\"a times open parentheses b plus c close parentheses.\" (avoid this, if possible!)"
          - "\"a times the sum of b and c.\" "
          - "\"a times the quantity b plus c.\""
          - "\"The product of a and the quantity b plus c.\""
          - "\"The multiplication of a distributed over the sum of b and c.\""
      - name: "Multiplication"
        example-expression: $(a+b)c$
        translations: 
          - "\"a plus b <b>all</b> times c.\""
          - "\"The product of a plus b times c.\""
          - "\"The quantity a plus b multiplied by c.\""
      - name: "Division"
        example-expression: $(a + b)/c$
        translations: 
          - "\"a plus b all divided by c\""
          - "\"The sum of a and b <b>all</b> divided by c\""
          - "\"The fraction a plus b over c\""
  - name: Algebra
    items: 
      - name: Squared
        example-expression: $x^2$
        translations: 
          - "\"x squared\""
          - "\"x to the power of two.\""
      - name: Exponent
        example-expression: $e^x$
        translations: 
          - "\"e to the x\""
      - name: Square Root
        example-expression: $\sqrt{2}$
        translations: 
          - "\"square root of 2\""
          - "\"root 2\""
      - name: nth Root
        example-expression: $\sqrt[n]{2}$
        translations: 
          - "\"nth root of 2\""
      - name: Natural log
        example-expression: $\ln{x}$
        translations: 
          - "\"natural log of x\""
          - "\"log of x\""
          - "\"log x\""
          - "\"ell-en of x\""
          - "\"ell-en x\""
      - name: Factorial
        example-expression: $n!$
        translations: 
          - "\"n factorial\""
          - "\"factorial of n\""
  - name: Relations
    items: 
    - name: Equal 
      example-expression: $a = b$
      translations: 
        - "\"a equals b\""
        - "\"a is equal to b\""
        - "\"a and b are equal\""
    - name: Not-equal
      example-expression: $a \neq b$
      translations: 
        - "\"a equals b\""
        - "\"a is equal to b\""
        - "\"a and b are equal\""
    - name: Approximately Equal
      example-expression: $a \approx b$
      translations: 
        - "\"a is approximately b\""
        - "\"a is approximately equal to b\""
    - name: Less-than 
      example-expression: $a < b$
      translations: 
        - "\"a less than b\""
        - "\"a is less than b\""
        - "\"a is strictly less than b\""
    - name: Greater-than 
      example-expression: $a > b$
      translations: 
        - "\"a greater than b\""
        - "\"a is greater than b\""
        - "\"a is strictly greater than b\""
    - name: Less-than-or-equal
      example-expression: $a \leq b$
      translations: 
        - "\"a less than or equal b\""
        - "\"a is less than or equal to b\""
        - "\"a is no more than b\""
        - "\"a is at most b\""
    - name: Greater-than-or-equal
      example-expression: $a \geq b$
      translations: 
        - "\"a greater than or equal b\""
        - "\"a is greater than or equal to b\""
        - "\"a is no less than b\""
        - "\"a is at least b\""
    - name: Equivalent
      example-expression: $a \sim b$
      translations: 
        - "\"a is equivalent to b\""
  - name: Propositional Logic
    items: 
      - name: "And"
        example-expression: "$p \\wedge q$"
        translations: 
          - "\"p and q\""
          - "\"Both p and q\""
          - "\"The conjunction of p and q\""
      - name: "Or"
        example-expression: "$p \\vee q$"
        translations: 
          - "\"p or q\""
          - "\"Either p or q\""
          - "\"The disjunction of p and q\""
      - name: "Not"
        example-expression: "$\\neg p$"
        translations: 
          - "\"Not p\""
      - name: "N"
        example-expression: "$\\neg p$"
        translations: 
          - "\"Not p\""
      - name: "Logical implication"
        example-expression: $p \implies q$
        translations: 
          - "\"p implies q\""
          - "\"if p, then q\""
      - name: "Implied by"
        example-expression: $p \impliedby q$
        translations: 
          - "\"p is implied by q\""
          # - "\"p implied by q\""
      - name: "If and only if"
        example-expression: $p \iff q$
        translations: 
          - "\"p if and only if q\""

  - name: Logic
    items:
      # Discussion of entailment and "can be proven by":
      # https://math.stackexchange.com/a/3578239/364370
      # Source for "Semantic entailment": https://math.stackexchange.com/a/280397/364370
      - name: "Semantic Entailment"
        example-expression: $p \vDash q$
        translations: 
          - "\"p entails q\""
          - "\"q is entailed by p\""

      # https://math.stackexchange.com/questions/280384/notation-question-what-does-vdash-mean-in-logic?rq=1
      # Source for "syntactic entailment": https://math.stackexchange.com/a/280397/364370
      - name: "Syntactic entailment"
        example-expression: $p \vdash q$
        translations: 
          - "\"p proves q\""
          - "\"q is provable/derivable from p\""
          - "\"q can be derived from p\""
      - name: "Derivable/Provable"
        example-expression: $\vdash p$
        translations: 
          - "\"p is provable/derivable (from axioms)\""


  - name: Predicate Logic/Quantifiers
    items:
      - name: There exists
        example-expression: $\exists x$
        translations: 
          - "\"There exists x\""
      - name: For all
        example-expression: $\forall x$
        translations: 
          - "\"For all x\""
      - name: "There exists ... such that"
        example-expression: "$\\exists x : x = 0$"
        translations: 
          - "\"For all x such that x is zero \""
      # - name: "For all ... such that"
      #   example-expression: "$\\forall x : x > 0$"
      #   translations: 
      #     - "\"For all x such that x > 0 \""

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


<!-- ╭────────────────────────────────────────────────────────────╮ -->
<!-- │  ╭──────────────────────────────────────────────────────╮  │ -->
<!-- │  │             Generate Table from YAML Data            │  │ -->
<!-- │  ╰──────────────────────────────────────────────────────╯  │ -->
<!-- ╰────────────────────────────────────────────────────────────╯ -->
{% for category in page.example-categories %}

## {{ category.name }}

<table>
  <!-- ⋘──────── Table Header ────────⋙ -->
  <tr>
    <th></th>
    <th>Mathematical Expression</th>
    <th>English Translation</th>
  </tr>
  <!-- ⋘──────── Table body ────────⋙ -->
  {% for item in category.items %}
    <tr>
      <th>
        {{ item.name}}
      </th>
      <td>
        {{ item.example-expression}}
      </td>
      <td>
        {% for translation in item.translations %}
          {{ translation }} <br>
        {% endfor %}
      </td>
    </tr>
  {% endfor %}
</table>


{% endfor %}

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
  <td>Not an element of</td>
  <td>$x \notin A$</td>
  <td>
      "'x' is not an element of 'A'."<br>
      "'x' is not in 'A'."<br>
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
  <td>$$\int f(x) dx$$</td>
  <td>
    "The integral of f of x with respect to x."<br>
    "The integral of f of x, dee-x."<br>
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

For more on this topic, see 

* ["How can we speak math?"](https://people.eecs.berkeley.edu/~fateman/papers/speakmath.pdf) by Richard Fateman.
* [Wikipedia - List of mathematical symbols](https://simple.wikipedia.org/wiki/List_of_mathematical_symbols)

