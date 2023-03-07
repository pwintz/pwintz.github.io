---
layout: single
title: |
    Correctly Format Text in Equations
excerpt: 
# permalink: 
tags: typesetting, notation
---
When writing a mathematical equation that contains a word or other string of characters that is a unified block, place those characters inside a `\text{...}` macro. 

To understand why this is important, suppose you have defined$$a,$$ $$n,$$ and $$t$$ as real numbers. What does the expression $$tan(a)$$ mean? Anybody experienced with trigonometry, would read this as the tangent of $$a,$$ but because juxtaposition indicates multiplication, the expression is ambiguous---it could also be read as $$t$$ times $$a$$ times $$n$$ times $$a.$$ To avoid this ambiguity, write $$\tan(a)$$ (`$\tan(a)$` or `$\operatorname{tan}(a)$`).

The particular way that you format a string depends on the context. 
- `\operatorname{}` to define functions like $\sin$ and $\cos$ that consist of several characters. Based on the context, `\operatorname{}` inserts the proper spacing before the text.
- `\text{}` to insert plain text that matches the formatting of the surrounding text environment, such as `\text{if } ...` `\text{otherwise} ...` in a `cases` environment.
- `\textup{}` to insert upright text. Useful for equations that appear in italicized environments, like theorems.  
- `\texttt{}` to format programming variables and other code-like text. 

If the string of characters appears repeatedly, define a macro to make it easier to typeset.  