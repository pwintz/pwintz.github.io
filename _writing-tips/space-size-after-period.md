---
layout: single
title: |
    Size of Spaces of a Period
excerpt: 
tags: typesetting
source: |
    <a href="https://tex.stackexchange.com/a/552651/153678">TeX StackExchange</a>
---

When LaTeX sees a period followed by a space, ". ", it assumes that the period is the end of a sentence, so it makes the space wider. 
When using a period that is not at the end of a sentence, the following space should be typeset using “\ “ instead of a normal space " ". This ensures size of the space after the dot is correct.

<table>
    <tr>
        <th>Correct</th>
        <th>Incorrect</th>
    </tr>
    <tr>
        <td>
             {%- highlight latex -%}
                My name is P.\ Wintz
            {%- endhighlight-%} 
            $$\text{My name is P.}\ \text{Wintz}$$
        </td>
        <td>
             {%- highlight latex -%}
                My name is P. Wintz
            {%- endhighlight-%} 
            $$\text{My name is P. Wintz}$$
        </td>
    </tr>
</table>
The difference is subtle, but the difference helps readers discern whether a period ends a sentence. (In fact, web browsers might not render the two spaces, above, as different widths and in TeX document the spacing depends on your settings.)