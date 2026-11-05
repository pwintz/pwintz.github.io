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
            // Set-builder notation, as in /latex-macros/set-builder-notation: "\setdef{x \suchthat x > 0}".
            // The braces and the bar grow to the height of the contents.
            // \suchthat works only inside \setdef (\middle needs an enclosing \left ... \right).
            setdef: ["\\left\\{#1\\right\\}", 1],
            suchthat: "\\mathrel{}\\middle|\\mathrel{}",
            // reals: "{\\mathbb{R}}",
        }
    }
}