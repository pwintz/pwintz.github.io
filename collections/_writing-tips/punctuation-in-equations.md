---
title: |
    Punctuation in Equations
excerpt: 
tags: grammar
# source: P.R. Halmos in "How to Write Mathematics", section 15, p. 42-43.
---

When writing mathematics, punctuation should be placed in equations at the points where punctuation would occur if the equation was converted to text, [as though spoken](/speaking-mathematics/). 

For display equations, punctuation must be placed inside the equation delimiters (`\[...\]` or `$$...$$`).
<!-- {% include code-example.html language='latex' code=
'
Although we expected 
'
output=
'

'
%} -->

For in-line equations in LaTeX documents, it is slightly preferable to put punctuation marks should be placed outside the math delimiters, e.g., "`The minimum is located at $1/x$.`" instead of "`The minimum is located at $1/x.$`", since placing the punctuation inside an inline equation causes it to be formatted using a math font and math spacing, which might be noticeably different.
LaTeX is clever enough to not insert a line break between an inline equation and punctuation that is immediately after.

<!-- When writing mathematical expressions in online but this is not the case when using LaTeX  -->
<!-- When using LaTeX code to  -->
