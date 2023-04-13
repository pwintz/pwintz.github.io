---
layout: single
title: |
    "So That" vs. "Such That"
excerpt: The phrase "so that" indicates <i>motivation</i> whereas "such that" imposes a <i>constraint</i>. 
permalink: permalink/so-that-vs-such-that
tags: clarity
# source: 
---
Despite sounding similar, the phrases "so that" and "such that" have different meanings. 
Using the wrong phrase can cause mathematical statements to be incorrect. 
The phrase "so that" indicates _motivation_ whereas "such that" imposes a _constraint_. 

We may, for example, say, "Pick $$x \in (-5, 5)$$ _so that_ $$x^2 < 25$$." 
In this case, we are alerting the reader to the fact that it is important that $$x^2 < 25$$ but not adding any new information. 
In other words, replacing the sentence with "Pick $$x < 5$$" does not change the meaning. 
If, instead, we wrote, "Pick $$x \in (-5, 5)$$ _such that_ $$x^2 < 25$$", the mathematical meaning changes to "Pick $$x$$ such that $$x \in (-5, 5)$$ _and_ $$x^2 < 25$$." 
This, of course, is equivalent, but may confuse readers.

The consequence of using "such that" when we mean "so that" is---at worst---moderate confusion, but the result of using "so that" instead of "such that" is logically incorrect statements.
For example, suppose we write, "Pick $$x, y \in \mathbb{R}$$ _such that_ $$x + y > 0$$." 
This imposes a constraint on $$x$$ and $$y$$; namely, their sum must be positive. 
The sentence "Pick $$x, y \in \mathbb{R}$$ _so that_ $$x + y > 0$$" is mathematically incorrect because picking  $$x, y \in \mathbb{R}$$ does not always result in a positive sum.

Often, readers can figure out your intended meaning if you mix up the two phrases, but doing so forces them to do extra work to infer what you, as the author, should have made explicit.