---
layout: single
title: |
    Dashes for Parenthetical Statements
excerpt: 
tags: notation
---
When emphasizing a parenthetical statement, an m-dash should be used. In LaTeX, an m-dash is typeset using three hyphens: `---`. There should not be spaces around the m-dash. 
    
Incorrect: `This is a sentence -- but I stop to make a parenthetical statement.`  
$$\text{This is a sentence -- but I stop to make a parenthetical statement.}$$

Correct: `This is a sentence---but I stop to make a parenthetical statement.`  
$$ \text{This is a sentence---but I stop to make a parenthetical statement.} $$

Be careful when writing an m-dash at the end of a line of LaTeX code because LaTeX will inject a space at each line break. You can suppress the added space by ending the line with "`%`" immediately after "`---`":

```latex
% Incorrect
This is a sentence---
but I stop to make a parenthetical statement.

% Correct
This is a sentence---%
but I stop to make a parenthetical statement.
```