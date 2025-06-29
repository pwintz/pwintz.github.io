// Note: Changing this file causes Jekyll to updated. It does not require the local server to restarted. 
MathJax = {
    tex: {
        inlineMath: [
            ['$', '$'], 
            ['\\(', '\\)'], 
        ],
        displayMath: [
            ['$$', '$$'], 
            ['\\[', '\\]'], 
        ],
        tags: 'ams',
        macros: {
            reals: "{\\mathbb{R}}",
            realsn: "{\\mathbb{R}^n}",
            realsm: "{\\mathbb{R}^m}",
            nats: "{\\mathbb{N}}",
            trans: "{^\\top}",
            invs: "{^{-1}}",
            // reals: "{\\mathbb{R}}",
        }
    }
}