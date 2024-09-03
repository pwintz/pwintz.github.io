---
layout: single
title: |
    Avoid "Respectively"
excerpt: 
permalink: permalink/avoid-respectively
tags: references links citations
---

In many cases, using the word "respectively" makes sentences hard to parse because it requires the reader to map each item in a list based on its position. 
For example, "Let $x$ and $y$ be the width and height of a rectangle, respectively," can be more clearly stated, "Let $x$ be the width and $y$ be the height of a rectangle." 
By placing the definition of symbol next to the symbol, you allow readers to glean the meaning of each withing needing to backtrack or remember the order that $x$ and $y$ were written.  

Another example comes from an actual paper:

{% quote %}
Consider a nonlinear system 

$$\begin{aligned}
\dot{x} & =f(x) \\
y & =h(x)
\end{aligned}$$

where \(f\) and \(h\) are locally Lipschitz continuous and continuous, respectively.

{% endquote %}

This can be improved (and shortened) by removing "respectively". 
{% quote %}
Consider a nonlinear system 

$$\begin{aligned}
\dot{x} & =f(x) \\
y & =h(x)
\end{aligned}$$

where \(f\) is locally Lipschitz continuous and \(h\) is continuous.

{% endquote %}

Sometimes rewritten a sentence to remove "respectively" may lengthen it significantly or may introduce tiresome repetition. 
In such cases, use your judgement to decide whether the improved clarity is worth the increased verbosity.