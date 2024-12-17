---
layout: single
title: | 
     Formatting If-then Statements (Hypotheticals)
# excerpt: Writing hypotheticals that 
permalink: permalink/if-then
tags: clarity
# source: 
---
In mathematics, statements in the form 

- **Statement 1**: "If P, then Q" 

are common.
Two examples are 

- **Statement 2.** "If $x > 1$, then $x^2 > x$" 
- **Statement 3.** "If a triangle is a right triangle, then the sum of the squared legs is equal to the square of the hypotenuse."  

Such statements are called _hypotheticals_. 
The portion between "If" and "then" is called the _antecedent_ and the portion after "then" is called the _consequent_. 
In Statement 1 ("If P, then Q"), the expression P is the antecedent and Q is the consequent. 
Similarly, in Statement 2, "$x > 1$" is the antecedent and "$x^2 > x$" is the consequent. 

Despite their ubiquity, many mathematicians (myself included) still often write if-then statements in ways that are needlessly confusing. 
The following sections describe guidelines to help clarify hypothetical statements.

## Prefer "If P, then Q" over "If P, Q"

In common English, it is perfectly valid grammar to leave out the "then", and simply say, "If P, Q", such as, "If the store has eggs, buy a dozen."
This shorter form should not be used in technical writing.
Including "then" makes it easier for readers to parse your statement. 
Consider Statement 3 without the "then": 

- **Statement 3'.** "If a triangle is a right triangle, the sum of the squared legs is equal to the square of the hypotenuse." 

As the reader progresses through the sentence, they cannot (without prior knowledge) know where the antecedent ends and the consequent begins until they reach the end of the sentence. 
In particular, they cannot know whether the comma indicates the end of the antecedent or is merely separating items in a list. 
For example, although Statement 3' is familiar to anybody who has studied geometry, the portion after the comma could, in fact, go to unexpected places:

- **Statement 3''.** "If a triangle is a right triangle, the sum of the squared legs is equal to the square of the hypotenuse, and 1=2, then I am the king of England." 

That's a very different claim than Statement 3'! (And, perhaps surprisingly, it is true.)

More generally, using "then" alerts readers as soon as possible whether a statement is in the form

- "If P, Q, and R, then S"

or 

- "If P, then Q and R".

(Compare without "then": "If P, Q, and R, S" and "If P, Q, and R".)
Without "then", you can the reader off kilter and trying to fill in the gap, so always include it!
<!-- (For some cases, the lack of "then" may leave the statement wholly ambiguous, leaving the most careful reader guessing, although I have not found a good example, currently.) -->

## Rewriting Hypotheticals

Although you should always include "then" after "if", you have latitude to rewrite hypotheticals in several other ways. 
Namely, the hypothetical "If P, then Q" is equivalent to the following statements:

- "If not Q, then not P." (This is called the contrapositive of "If P, then Q")
- "Q or not P." (More verbosely, "either Q is true or P is false"). The order can also be swapped to "Not P, or Q", but this risks readers thinking it means "not P or not Q", which is not equivalent.
- "P only if Q."

If you are unsure of the equivalency of these statements, then you should check their truth tables to make sure they always have the same truth value, for all truth values of P and Q:

|   P   |   Q   |    If P, then Q    |     If not Q, then not P     |      Q or not P     | P only if Q  |
|:-----:|:-----:|:------------------:|:----------------------------:|:-------------------:|:------------:|
|   T   |   T   |         T          |              T               |         T           |     T        |
|   T   |   F   |         F          |              F               |         F           |     F        |
|   F   |   T   |         T          |              T               |         T           |     T        |
|   F   |   F   |         T          |              T               |         T           |     T        |

In my experience "P only if Q" is almost always more confusing that the alternatives and should not be used (if you find an exception, please [let me know](mailto:pwintz+ws@ucsc.edu)).
The remaining equivalent forms can all be used, in proper contexts, to clarify a statement.

<!-- One rule of thumb is that statements with negations are often more difficult to understand than those without negations. 
Thus, my guiding principle for choosing between equivalent logical expressions is—all else equal—to choose the expression with fewer negations.

- "If $x$ is not in $[0, \infty)$, then $x > 0$" becomes 
- "$x$ is in $[0, \infty)$ or $$x > 0$" or 
- "

- "If  -->
<!-- When w/riting the hypothetical "If P, then Q", you can reorder this statement as, "Q, only if P  -->

<!-- 2. Omitting "then" can cause a statement to be ambiguous.  -->
<!-- "If P, Q", "If P, Q and R" -->

<!-- so for "If P, then Q", the statement  -->

