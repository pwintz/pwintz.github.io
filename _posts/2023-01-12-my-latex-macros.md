---
layout: single
title: My LaTeX Macros
category: mathematical-writing
tags: LaTeX macros
toc: true
---

This document describes LaTeX commands that I have developed over the years to save time while typesetting documents.
 
# Text Commands

## `\midand` and `\midor`
For display-style equations that contains a list of equations, I found it tedious to write `\quad \text{and} \quad` before the last item in the list. Instead, I defined a `\midand` macro. 

{% include latex-example.txt 
code_displayed="x \geq -1 \midand x \leq 1" 
code_rendered="x \geq -1 \quad \text{and} \quad x \leq 1" %}

Similarly, 
{% include latex-example.txt 
code_displayed="x \leq -1 \midor x \geq 1" 
code_rendered="x \leq -1 \quad \text{or} \quad x \geq 1" %}

The code to define these commands are 
{%- highlight latex -%}
\newcommand{\midand}{\quad \textup{and}\quad}%
\newcommand{\midor}{\quad \textup{or}\quad}%
{% endhighlight %}

## Limits


{% include latex-example.txt 
code_displayed="\ilim 1/i = 0" 
code_rendered="\lim_{i \to \infty} 1/i = 0" %}

{% include latex-example.txt 
code_displayed="\jlim 1/j = 0" 
code_rendered="\lim_{j \to \infty} 1/j = 0" %}

{% include latex-example.txt 
code_displayed="\klim 1/k = 0" 
code_rendered="\lim_{k \to \infty} 1/k = 0" %}

{% include latex-example.txt 
code_displayed="\hlim \frac{f(x + h) - f(x)}{h} = 0" 
code_rendered="\lim_{h \to 0^+} \frac{f(x + h) - f(x)}{h} = 0" %}

{%- highlight latex -%}
\newcommand{\ilim}{\lim_{i \to \infty}}
\newcommand{\jlim}{\lim_{j \to \infty}}
\newcommand{\klim}{\lim_{k \to \infty}}
\newcommand{\hlim}{\lim_{h \to 0^+}}
{% endhighlight %}

# "Memory" Commands
The following "memory" commands allow for abbreviation of repeated integrals, summations, and limits so that the full version can be written once and then reused without writing out the full version each time.
In addition to saving time, I find that these commands simplify the LaTeX code, so it is easier to edit and to find mistakes.

There are three commands: `\memint` for integrals, `\memsum` for summations, and `\memlim` for limits. Each has a starred and an unstarred version that is used to set the remembered text. 

To use `\memint`, the first time the command is used, write `\memint*[<lower limit>][<upper limit>]`. Thereafter, simply write `\memint`. 

{% include latex-example.txt 
code_displayed="\memint*[1][\infty] \frac{1}{x} = \memint \frac{1}{x}" 
code_rendered="
\begin{aligned}
\int_{1}^{\infty} \frac{1}{x} 
&= \int_{1}^{\infty} \frac{1}{x}
\end{aligned}
" %}

The use of `\memsum` and `\memlim` are nearly identical except that the starred version of `\memlim` takes only one argument:


{% include latex-example.txt 
code_displayed="
\memlim*[x_0 \to 5] \frac{(x+1)(x-5)}{(x-2)(x-5)} 
= \memlim \frac{x+1}{x-2} 
= \frac{5+1}{5-2} 
= 2" 
code_rendered="\begin{aligned}
\lim_{x_0 \to 5} \frac{(x+1)(x-5)}{(x-2)(x-5)} 
= \lim_{x_0 \to 5} \frac{x+1}{x-2} 
= \frac{5+1}{5-2} 
= 2
\end{aligned}" %}

You must be careful while using these memory commands, however, because each time the starred version is called, it changes the definition for all of the unstarred versions until the next starred version. Thus, if you introduce `\memlim*` into the middle of text where you are already using `\memlim` with a different definition, you can unintentionally change the rendered equations. For this reason, I restrict the usage of each remembered command to a single equation (usually an `align` environment with many rows). 