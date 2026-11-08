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
            // Norm, as in "\norm{x}". The bars do not grow; use \left\lVert ... \right\rVert for tall contents.
            norm: ["\\lVert #1 \\rVert", 1],
            // Absolute value, as in "\abs{x}", and inner product, as in "\ip{x}{y}". The delimiters do not grow.
            abs: ["\\lvert #1 \\rvert", 1],
            ip: ["\\langle #1, #2 \\rangle", 2],
            // reals: "{\\mathbb{R}}",
        }
    }
}