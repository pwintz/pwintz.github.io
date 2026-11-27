---
# Jekyll runs Liquid on this file to add the reader-selectable notation from _data/notation.yml.
# `jekyll serve --incremental` does not track _data/notation.yml, so always rebuild this file.
regenerate: true
---
// Note: Changing this file causes Jekyll to updated. It does not require the local server to restarted.
//
// This script must load before MathJax (see head_scripts in _config.yml) and stay small, because it blocks rendering.
// The labels and other details for the Notation page are embedded in that page (collections/_pages/notation.html).

(function () {
    // ⋘──────── Reader-selectable notation ────────⋙
    // For each item in _data/notation.yml: the macro name, its number of arguments, the default option, and the TeX of
    // each option. The reader's choices (saved by assets/ts/src/notation_settings.ts) pick the options.
    var NOTATION = {
    {%- for item in site.data.notation %}
        {{ item.id | jsonify }}: [{{ item.macro | jsonify }}, {{ item.args | default: 0 }}, {{ item.default | jsonify }}, {
        {%- for option in item.options -%}
            {{ option.id | jsonify }}: {{ option.tex | jsonify }}{% if option.tex_of %}, {{ option.id | append: "/of" | jsonify }}: {{ option.tex_of | jsonify }}{% endif %}{% unless forloop.last %}, {% endunless %}
        {%- endfor -%}
        }]{% unless forloop.last %},{% endunless %}
    {%- endfor %}
    };

    var choices = {};
    try {
        choices = JSON.parse(localStorage.getItem("notation.choices") || "{}") || {};
    } catch (e) { /* Storage unavailable or invalid: use the defaults. */ }

    var macros = {
        // The number sets use \numberset (below) for their typeface.
        reals: "{\\numberset{R}}",
        realsn: "{\\numberset{R}^n}",
        realsm: "{\\numberset{R}^m}",
        nats: "{\\numberset{N}}",
        integers: "{\\numberset{Z}}",
        rationals: "{\\numberset{Q}}",
        complexes: "{\\numberset{C}}",
        invs: "^{-1}",
        // Set-builder notation, as in /latex-macros/set-builder-notation: "\setdef{x \suchthat x > 0}".
        // The braces and the bar grow to the height of the contents.
        // \suchthat (below) works only inside \setdef (\middle needs an enclosing \left ... \right).
        setdef: ["\\left\\{#1\\right\\}", 1],
        // Norm, as in "\norm{x}". The bars do not grow; use \left\lVert ... \right\rVert for tall contents.
        norm: ["\\lVert #1 \\rVert", 1],
        // Absolute value, as in "\abs{x}", and inner product, as in "\ip{x}{y}". The delimiters do not grow.
        abs: ["\\lvert #1 \\rvert", 1],
        ip: ["\\langle #1, #2 \\rangle", 2],
        // Domain of an operator, as in "\dom D".
        dom: "\\operatorname{dom}",
        // Differentials, with the reader's choice of "d" (the \diff macro, from _data/notation.yml).
        dx: "{\\diff{x}}",
        dy: "{\\diff{y}}",
        dz: "{\\diff{z}}",
        dt: "{\\diff{t}}",
    };

    // Define each selectable macro. A one-argument operator written without parentheses ("\ker #1") also gets a
    // macro \<name>Of that puts its argument in parentheses, for compound arguments: \nullspaceOf{A - \lambda I}.
    Object.keys(NOTATION).forEach(function (id) {
        var item = NOTATION[id], name = item[0], args = item[1], options = item[3];
        var choice = Object.prototype.hasOwnProperty.call(options, choices[id]) ? choices[id] : item[2];
        var tex = options[choice];
        if (args === 0) {
            macros[name] = tex;
        } else {
            macros[name] = [tex, args];
            var texOf = options[choice + "/of"] || (/ #1$/.test(tex) ? tex.replace(/ #1$/, "(#1)") : tex);
            macros[name + "Of"] = [texOf, args];
        }
    });

    // ⋘──────── Hiding raw TeX ────────⋙
    // The browser can draw the page after it reads it and before MathJax typesets it (MathJax waits for the
    // DOMContentLoaded event, which waits for the page's module scripts), and then the reader sees raw TeX such as
    // "$\dot{x} = -x$" for a moment. So the main content stays hidden (html.math-pending, in _sass/minimal-mistakes/_page.scss)
    // until MathJax has typeset it, or for at most a few seconds, in case MathJax fails to load or to finish.
    var root = document.documentElement;
    root.classList.add("math-pending");
    var reveal = function () { root.classList.remove("math-pending"); };
    document.addEventListener("DOMContentLoaded", function () { setTimeout(reveal, 3000); });

    window.MathJax = {
        startup: {
            ready: function () {
                window.MathJax.startup.defaultReady();
                window.MathJax.startup.promise.then(reveal, reveal);
            },
        },
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
            macros: macros,
        }
    };
})();
