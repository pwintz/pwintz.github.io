---
layout: single
title: |
    Use Nonbreaking Spaces
excerpt: The character `~` should be used to prevent poorly-placed line breaks.
permalink: nonbreaking-spaces
tags: typesetting
source: | 
    <a href="https://practicaltypography.com/nonbreaking-spaces.html">Butterick’s Practical Typography, 2nd Edition.</a>, 
    and <a href="https://tex.stackexchange.com/a/15549">TeX</a> <a href="https://tex.stackexchange.com/a/15555">StackExchange</a>
---

By default, LaTeX will insert line breaks at any space between words.
Although this is generally desirable, there a line break should be avoided in the following cases:
- between a number and its unit of measure: "1000 miles", "183 billion"
- in a date, between the month and the number: "July 4", "19 June",
- within a reference to a location in the document: "Section 4", "Fig. 1.2", "Theorem 3.1415",
- before each citation (e.g., "...as was shown by Smith [12]"),
- before the last word of a paragraph, such that the last word is placed on a line by itself, especially if the word is short.
- Generally, any number or symbol that is strongly tied to the preceding or succeeding words: "width $w$", "$A$ to $B$".

In LaTeX, the character `~` inserts a non-breaking space. 
Here are code snippets from the examples above:
- `1000~miles`
- `183~billion`
- `July~4`
- `19~June`
- `Section~4`
- `Fig.~1.2`
- `Theorem~3.1415`
- `...as was shown by Smith~\cite{smith_2020}`
- `width~$w$`
- `A~to~B`

## Preventing Line Breaks in Equations

Using `~` to prevent line breaks only works in text. 
A different approach is needed in equations.

To prevent line breaks in the middle of an equation, place curly brackets "`{...}`" around the equation. 
For example `${a \in A}$` will always be displayed on one line, whereas `${a^2 + b^2} = {c^2 + d^2}$` may have a line break at the equal sign but nowhere else.

<!-- ## The `cleveref` Package and Non-breaking Spaces -->


## Preventing Line Breaks in Titles

LaTeX's placement of line breaks in title is often unappealing. 
Consider the default output of the title code, in [one](publications/wintz-ctg-2024) of my papers:

{% capture title_code %}{% raw %}\title{
    Conical Transition Graphs for Analysis of 
    Asymptotic Stability in Hybrid Dynamical Systems
}
{% endraw %}{% endcapture %}
{% capture title_output %}{% raw %} 
    <h1 style="font-size: 1.5em; font-weight: normal; line-height: 1.5; text-align: center; margin: 0 auto;">
        Conical Transition Graphs for<br>
        Analysis of Asymptotic Stability in Hybrid Dynamical<br>
        Systems
    </h1>
{% endraw %}{% endcapture %}
{% include code-example.html  
    language=latex
    code=title_code
    output=title_output
%}
The placement of "Systems" alone on the third line looks unpleasant. 
To force LaTeX to not orphan "Systems," we add non-breaking spaces between the words "Hybrid~Dynamical~Systems".
While we're at it, I also put `~` into "Conical~Transition~Graphs" and "Asymptotic~Stability" so that LaTeX keeps those phrases grouped together. 

{% capture title_code %}{% raw %}\title{
    Conical~Transition~Graphs for Analysis of 
    Asymptotic~Stability in Hybrid~Dynamical~Systems
}
{% endraw %}{% endcapture %}
{% capture title_output %}{% raw %} 
    <h1 style="font-size: 1.5em; font-weight: normal; line-height: 1.5; text-align: center; margin: 0 auto;">
        Conical Transition Graphs for Analysis of<br>
        Asymptotic Stability in<br>
        Hybrid Dynamical Systems
    </h1>
{% endraw %}{% endcapture %}
{% include code-example.html  
    language=latex
    code=title_code
    output=title_output
%}

The above result is better, because it prevents the final word from dangling alone on a line. 
Ultimately, though, I decided to add even more non-breaking spaces to prevent the middle line from being narrower than the first and third, and to make the lines roughly the same length. I find the result to be a significant improvement over the default:  
{% capture title_code %}{% raw %}\title{
    % Note: You need "%" after "~" if you have a line 
    % break immediately after. Otherwise, LaTeX inserts 
    % an extra space at the line break in the code.
    Conical~Transition~Graphs~for Analysis~of~%
    Asymptotic~Stability in~Hybrid~Dynamical~Systems
}
{% endraw %}{% endcapture %}
{% capture title_output %}{% raw %} 
    <h1 style="font-size: 1.5em; font-weight: normal; line-height: 1.5; text-align: center; margin: 0 auto;">
        Conical Transition Graphs for <br>
        Analysis of Asymptotic Stability <br>
        in Hybrid Dynamical Systems
    </h1>
{% endraw %}{% endcapture %}
{% include code-example.html  
    language=latex
    code=title_code
    output=title_output
%}