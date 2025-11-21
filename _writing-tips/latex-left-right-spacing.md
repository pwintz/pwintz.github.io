---
title: |
    Correct Spacing Around <code>\left(</code> and <code>\right)</code> in LaTeX Math
excerpt: 
# permalink: 
tags: latex notation
---
By default, LaTeX inserts some space outside the parentheses when using `\left(...\right)`, which often results in awkward spacing, such as when the parentheses contain the argument(s) of a function:
{% include code-example.html  
    language="latex"
    code="\sin\left(\int_0^t f(t)\right)"
    output="$$\sin\left(\int_0^t f(t)\right)$$"
%}
The [`mleftright`](https://ctan.org/pkg/mleftright) package allows us remove the extra space between "$\sin$" and "$($" without manually adjusting the spacing.
Once `mleftright` is loaded, you can remove the spacing for specific parentheses by replacing `\left` with `\mleft` and `\right` with `\mright`.

Instead of modifying all of my `\left`/`\right` pairs, however, I use the following code to replace the definitions of `\left` and `\right`:
```latex
%%%% Fix Spacing Around "\left(\right)" %%%
\usepackage{mleftright} 
\mleftright % redefine \left as \mleft and \right as \mright.
```
Then, the extra spacing is removed throughout the document:
{% include code-example.html  
    language="latex"
    code="\sin\left(\int_0^t f(t)\right)"
    output="$$\sin\hspace{-3mu}\left(\int_0^t f(t)\right)$$"
%}