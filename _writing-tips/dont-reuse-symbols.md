---
layout: single
title: |
    Don't Use Reuse Mathematical Symbols for Different Meanings
excerpt: 
permalink: dont-reuse-symbols
tags: notation clarity
source: 
---

One of the surest sources of confusion in mathematical writing is to use one expression to mean multiple things. 
Authors often make this mistake with functions. 
To illustrate, consider a function $$f$$ from $$\mathbb{R}$$ to $$\mathbb{R}$$. 
The expressions "$$f$$" and "$$f(x)$$" have different meanings. The statement "$$f(x)$$ is monotonically decreasing" is meaningless because "$$f(x)$$" is a constant real number.
Instead, write "$$f$$ is monotonically decreasing" or "$$x \mapsto f(x)$$ is monotonically decreasing". 
The latter form is useful if you want to talk about the composition of functions without introducing a new symbol: "$$x \mapsto f(1 + x^3)$$ is monotonically decreasing". 

### When is it OK to reuse a symbol?
A complete ban on reusing symbols in a mathematical text would cause you to quickly run out of symbols, especially in long texts.
Similar to variables in a programming language, symbols have a particular scope. 

The tightest scope is what I will call a _bound symbol_. 
A bound symbol is defined and used only in a single expression. 
The symbol $$x$$ is a bound variable in the following expressions: "$$\forall x\ P(x)$$", "$$\exists x\ P(x)$$", and "$$x \mapsto f(x)$$."
It is OK to immediately use the same bound symbol in multiple expressions, such as, "Consider the functions $$x \mapsto f(x)$$ and $$x \mapsto g(x)$$." 
To aid the reader, however, each time a bound symbol is reused in a section of text, it should have the same type of meaning.

<!-- Larger scopes include proofs, (to a lesser extent) theorem statements, definitions, sections, and chapters. -->
Symbols introduced in a proof should be restricted to that proof (many readers skip proofs on their first read of a text), so we can treat a proof as a symbol scope. 
If we introduce "$$\varepsilon > 0$$ and $$\delta = 2\varepsilon$$" in the proof of Theorem 1, then it is OK to define "$$\delta \in (0, 1)$$ and $$\varepsilon = \sqrt{\delta}$$" in the proof of Theorem 2. 

Symbols introduced in definitions and theorems are not scoped in the same way.