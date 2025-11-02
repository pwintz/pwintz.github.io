---
title: |
    Nonbreaking Spaces
excerpt: The character `~` should be used to prevent poorly-placed line breaks.
# permalink: nonbreaking-spaces
tags: typesetting
source: | 
    <a href="https://practicaltypography.com/nonbreaking-spaces.html">Butterick’s Practical Typography, 2nd Edition.</a>, 
    <a href="https://tex.stackexchange.com/a/15549">TeX</a> <a href="https://tex.stackexchange.com/a/15555">StackExchange</a>, and <i>The TeXbook</i> by Donald E. Knuth, p. 92. 
---

By default, LaTeX will insert line breaks at any space between words.
In many cases, the default produces nice results, but sometimes the breaks occur at awkward places:
<!-- Although this is generally desirable, there a line break should be avoided in the following cases: -->
{% include output-example.html  
    output="As seen in Fig.<br>
    4, I would walk 500<br>
    miles to make better<br>
    line breaks in my text<br>
    [23]."
%}

To force LaTeX to not break a line at a given space, replace "` `" in the code with a tilde "`~`". 
The result is called a nonbreaking space.
You should use nonbreaking spaces in the following cases: 

|  Description  |       Example      |          Code         |
|:------------:|:|:----------------:|:|:--------------------:|
| Between a number and its unit of measure | "1000 miles"  | `1000~miles`  |
|                                          | "183 billion"  | `183~billion`  |
| Between components of a value, such as between feet and inches | "10\' 11\""  | `10'~11"`  |
| In a date, between the month and the number | "July 4"  | `July~4` | 
| Within a reference to a location in the document | "Section 4"     | `Section~4`     |
|                                                  | "Fig. 1.2"      | `Fig.~1.2`      |
|                                                  | "Theorem 3.1"| `Theorem~3.1415`|
| Before each citation | "...as was shown by Smith [12]" | `...as was shown by Smith~\cite{smith_2020}` |
| Before the last word of a paragraph, especially if the word is short. | "...and so we must build it." | `...and so we must build~it.` |
| Before or after any number, symbol, or narrow expression that is strongly associated with the adjacent word | "width $w$" | `width~$w$` |
|                                             | "in $\partial S$" | `in~$\partial S$` | 
|                                             | "$A$ to $B$" | `$A$~to~$B$` |
 
<!-- Here are code snippets from the examples above:
- 
- 
- `July~4`
- `19~June`
- `Section~4`
- `Fig.~1.2`
- `Theorem~3.1415`
- `...as was shown by Smith~\cite{smith_2020}`
- `width~$w$`
- `A~to~B`
- `in~$\partial S$ -->

## Preventing Line Breaks in Equations

Using `~` to prevent line breaks only works in text. 
A different approach is needed in equations.

To prevent line breaks in the middle of an equation, place curly brackets "`{...}`" around the equation. 
For example `${a \in A}$` will always be displayed on one line, whereas `${a^2 + b^2} = {c^2 + d^2}$` may have a line break at the equal sign but nowhere else.

<!-- ## The `cleveref` Package and Nonbreaking Spaces -->


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
    language="latex"
    code=title_code
    output=title_output
%}
The placement of "Systems" alone on the third line looks unpleasant. 
To force LaTeX to not orphan "Systems," we add nonbreaking spaces between the words "Hybrid~Dynamical~Systems".
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
    language="latex"
    code=title_code
    output=title_output
%}

The above result is better, because it prevents the final word from dangling alone on a line. 
Ultimately, though, I decided to add even more nonbreaking spaces to prevent the middle line from being narrower than the first and third, and to make the lines roughly the same length. I find the result to be a significant improvement over the default:  
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
    language="latex"
    code=title_code
    output=title_output
%}

## Adjusting LaTeX's Automatic Line Breaking
LaTeX determines where to break lines by assigning penalties to line breaks in certain places. 
You can tweak these penalties to achieve fine-grained control over where automatic line breaks occur.
See [here](https://tex.stackexchange.com/a/51264/153678) for details.