---
layout: single
title: |
    Repeat Yourself
excerpt: When saying something important and difficult to understand, find ways to repeat the information in different ways. 
# permalink: permalink/repeat-yourself
tags: clarity
---

Despite our best efforts, it is inevitable that we, as authors, inadvertently write things that are ambiguous or otherwise difficult to parse. 
When saying something important and difficult to understand, find ways to repeat yourself without saying exactly the same thing twice. 
While we often try to be as concise as possible and thus avoid redundancy, a degree of redundancy can be a lifesaver for readers when they encounter a statement that is confusing. 
Similar to how redundancy is vital in safety-critical [control systems](/research/what-is-control-theory/) to ensure robustness to failures, including redundancy in writing can offer guardrails that protect readers from misunderstanding. 

Here are key principles to doing this well:
1. When repeating yourself, the repetition should convey the information in a completely different way. Strategies for this are presented below. 
1. When using information that was stated long before, reiterate the fact (perhaps in an abbreviated version) along with a note of where it was first introduced. This can save readers from needing to flip through previous material.
1. Not everything needs to be repeated. Trust the intelligence of your readers. If a fact is absolutely clear with a single statement, then it does not need to be repeated. If it is obvious or common knowledge, then you may omit it completely.

## Methods for Strategic Repetition
1. After introducing a concept, provide an example that illustrates it. 
<!-- How to construct good examples merits its own article.  -->
Ideally, pick one or more examples of the concept along with a non-example that the readers might mistakenly expect be an example. 
1. Before an equation, say in words what the equation says in math. _For example_, instead of writing, "We have that $\dot T = -\lambda T$," we might write, "The rate of change of the temperature is $\dot T = -\lambda T$." (This also allows you to [avoid starting sentences with an equation](/writing-tips/dont-start-sentence-with-math) without resorting to filler phrases like, "We have that…".)
1. [Choose notation](/mathematical-writing/choosing-mathematical-symbols/) that reinforces the meaning of the symbols. For example, using $r$ for radius or consistently using bold letters for vectors (e.g., $\boldsymbol{x},\boldsymbol{y},\boldsymbol{z}$) are subtle ways to indicate to readers what their meanings are.
1. In computer code, include comments that say what the code does.
1. When space permits, include diagrams. "A picture is worth a thousand words."
1. Before or after a technical theorem, write an informal description of the theorem its important aspects. 
1. Simply including a proof or derivation after a mathematical statement serves to reiterate the statement by building it up piece-by-piece.
1. For statements that are composed of a mix of logical operators and quantifiers, it can sometimes be helpful to readers if you reiterate claims into logically equivalent statements. For example, "all $x$, $P(x)$ holds" can be rewritten as "there does not exist any $x$ such that $P(x)$." Similarly, "If $P$, then $Q$" can be written as its contrapositive.  
