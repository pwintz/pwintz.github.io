---
layout: single
title: |
    Simple Slides
excerpt: 
permalink: permalink/simple-slides 
tags: presentations

source: 
---


You do not need full sentences. The slides should contain only a small piece of what you say out loud. 
Omit equation numbers, unless you reference them verbally.
Use \caption* to remove “Figure:” from the caption. (Or just remove the caption, you don’t really need it.)
Place variable definitions in an itemize environment with each definition in its own item.

In general, when you say “we”, “namely”, “Then,” (except for "if ..., then ...") “note that”, “however”, on the slides, you are being more wordy than necessary. 

In mathematical writing, we generally avoid starting a sentence with a symbol, which results in sentences such as, "The expression $$a + b \leq c$$ is satisfied ...", but in presentations it OK to simply write "$$a + b \leq c$$  is satisfied ...", especially when placed in a bullet point.

Keeping slides simple allows the audience to see what is important. 
You can make this easier for them by highlighting the things they need to notice.
If you have two equations that are almost the same, use color or annotations to highlight the difference.

Examples:
    Before:
        "Parameter estimation is the process of computing a model's parameter values from measured data."
    After: 
        "Parameter estimation: compute a model's parameters from measurements.

    Before: 
        "For simplicity, we assume that..."
    After:
        "Assume that...  

    Before:
        "Each solution to $$\mathcal{H}$$ converges to the set 
        
        $$\mathcal{A} := \{\cdots\}$$

    After:
        "Each solution converges to  
        
        $$\mathcal{A} := \{\cdots\}$$
        
         
