---
layout: single
title: "LaTeX Referencing Like a Pro"
# excerpt: "There."
toc: 1
published: false
tags: latex references
date: 2025-11-20 00:00:00 -0800

reference-packages:
  - name: Built-in TeX 
    documentation: 
    macros: 
      - \ref
      - \pageref
    description: "The macro <code>\\ref</code> inserts the number of the referenced target (e.g., \"1\" for equation 1) and <code>\\pageref</code>  inserts the page number where it appears. The reference does not include any formatting."
  - name: "<code>amsmath</code> package"
    documentation: https://mirrors.ctan.org/macros/latex/required/amsmath/amsldoc.pdf
    macros: 
      - \eqref
    description: "The <code>\\eqref</code> macro inserts equation references formatted as \"(1)\" instead of just a number \"1\"."
  - name: "<code>cleveref</code> package"
    description: "Cleveref is a powerful cross-referencing tool that creates references that are formatted based on the type of object referenced, the location of the reference in the sentence (start vs. middle), and the number of targets referenced. Can produce multiple references and ranges of references using single commands."
    documentation: https://ctan.org/pkg/cleveref
    macros: 
      - \cref
      - \crefrange
      - \cpageref
      - \cpagerefrange
  # - name: "<code>hyperref</code>"
  #   description: "The hyperref package adds hyperlinks to references created by other packages."
  #   documentation: https://ctan.org/pkg/hyperref
  - name: "<code>nameref</code> package"
    description: "The <code>\\nameref</code> macro inserts the text associated with referenced objects, such as chapter titles, section headings, theorem names, and description list labels. Bundled with hyperref."
    documentation: https://ctan.org/pkg/nameref
    macros: 
      - \nameref
  - name: "<code>varioref</code> package"
    description: "Produces references that describe the position of the target based on where it is relative to the current page, such as \"on the facing page\", or \"on page 24\" (when not referenced from page 24). Can be finicky; it can produce infinite compile loops when references occur near page boundaries."
    documentation: https://ctan.org/pkg/varioref
    macros: 
      - \vref
      - \vpageref
      - \vrefrange
      - \vrefpagerange
  - name: "<code>xr</code> package"
    description: "Inserts references to labels in other compiled LaTeX documents, such as a supplement that references equations in the main paper."
    documentation: https://ctan.org/pkg/xr
    macros: 
      - \externaldocument
  # - name: "<code>fancyref</code>"
  #   description: "The fancyref package is similar to the cleveref package in that it formats references based on the type of object referenced, but it identifies the type using label prefixes. Largely superseded by cleveref."
  #   documentation: https://ctan.org/pkg/fancyref
  #   macros: 
  #     - \fref
  #     - \Fref
  # - name: "<code>showlabels</code>"
  #   description: "Inserts labels into the document to facilitate editing."
  # - name: "<code>showkeys</code>"
  #   description: "Inserts labels into the document to facilitate editing."
  #   documentation: https://ctan.org/pkg/showkeys

---
One powerful aspect of writing documents in LaTeX is the ability to insert automatic references to components of your document, such as theorems, page numbers, and equations. 
This post covers how to label objects, how to choose label names, how to configure the `cleveref` package to format references, and how to make references into hyperlinks.

## Labeling Document Components

In LaTeX, you can add labels to numbered objects, such as equations, tables, sections, and theorems, which allow you to insert automatic references that use the number of the labeled object.
For example, the body of your document might be as shown here:
```latex
\begin{equation}
  \label{eq:my 1st math}
  1 + 2 = 3.
\end{equation}

\begin{equation}
  \label{eq:my 2nd math}
  2 + 2 = 4.
\end{equation}

\begin{equation}
  \label{eq:my 3rd math}
  2 + 2 + 2 = 6.
\end{equation}
```
You can now reference the labels using the following commands.
The `cleveref` outputs assume the configuration given in [Formatting Equation References](#formatting-equation-references-as-1-not-eq-1); the `cleveref` defaults are given in parentheses.

| Command | Example Output | Description | Provided by |
|:-----------:|:-----------:|:-----------:|:-----------:|
| `\ref{eq:my 1st math}`   |  1    |   Equation Counter Value     | TeX |
| `\ref{eq:my 2nd math}`   |  2    |   Equation Counter Value     | TeX |
| `\pageref{eq:my 1st math}`   |  1   |   Page Number     | TeX |
| `\eqref{eq:my 1st math}`   |  (1)    |   Formatted Equation Number     | `amsmath` |
| `\Cref{eq:my 1st math}`   |  Equation (1)   |   Start-of-sentence formatted equation number  | `cleveref` |
| `\cref{eq:my 1st math}`   |  (1) <br>(default: eq. (1))   |   Middle-of-sentence formatted equation number  | `cleveref` |
| `\cref{eq:my 1st math,eq:my 2nd math}`   |  (1) and (2) <br>(default: eqs. (1) and (2))    |   Multiple Formatted Equation Numbers  (middle of sentence)     | `cleveref` |
| `\cref{eq:my 1st math,eq:my 2nd math,eq:my 3rd math}`   |  (1)–(3) <br>(default: eqs. (1) to (3))    |   Range of Formatted Equation Numbers  (middle of sentence)     | `cleveref` |

## Comparison of Reference Packages

<table>
  <tr>
    <th>Package and macros</th>
    <th>Description</th>
  </tr>
  {% for package in page.reference-packages %}
    <tr>
      <td>
      <strong>
      {% if package.documentation and package.documentation != "" %}
        {%- comment -%}
        If documentation URL exists and is not empty, create hyperlink
        {%- endcomment -%}
        <a href="{{ package.documentation }}">{{ package.name }}</a>
      {% else %}
        {%- comment -%}
        If documentation is empty or missing, display name without link
        {%- endcomment -%}
        {{ package.name }}
      {% endif %}
      </strong>
      {% for macro in package.macros %}
        <br>
        <code>&nbsp;&nbsp;{{ macro }}</code>
      {% endfor %}
      </td>
      <td>
        {{ package.description }}
      </td>
    </tr>
  {% endfor %}
</table>


<!-- \begin{theorem}
  \label{result:my 1st theorem}
  
  \[ a^2 + b^2 = c^2. \]
  
\end{theorem}
| `\Cref{result:my 1st theorem}`   |  Theorem 1   |   Start-of-sentence theorem number  | `cleveref` | -->


<!-- \verf is somewhat tricky to use, so I won't mention it: https://en.wikibooks.org/wiki/LaTeX/Labels_and_Cross-referencing#The_varioref_package -->
<!-- | `\vref{eq:math}`   |  1 on page 8    |   Output depends on the context, esp. how far the reference is from the target     | `varioref` | -->

<!-- `\ref{eq:math}` or `\pageref{eq:math}` -->


## Choosing Reference Labels


The format for `[label name]` has [some restrictions](https://tex.stackexchange.com/q/18311/153678).
The following characters are safe to use in labels:

* alphanumeric: a-z, A-Z, 0-9
* colons: ":"
* spaces: " "

Do not use the following characters in labels:

* commas "`,`"
* Backslashes "`\`"
* dollar signs "`$`"

Spaces work with `\label` and `\ref`, but they come with a tradeoff.
Inside a `\cref{}` list, a space before or after a comma becomes part of the label (see [Referencing Multiple Items](#referencing-multiple-items)), and some editors and linters handle labels with spaces poorly.
Colons can also break if you use `babel` with a language that makes "`:`" an active character, such as French.

Labels should be stable, so prefixes should not be too specific.
For example, using different prefixes for sections, subsections, and subsubsections forces you to change a label whenever you move a section up or down one level.
Thus, I use a single prefix `sec:` for all section levels (including chapters, since a chapter may be demoted to a section).
Similarly, the boundaries are fuzzy between theorems, lemmas, and propositions. 
A proposition may be renamed to a theorem or a lemma, or vice versa, and a conjecture will become one of the three when it is proven, so I use the same prefix `result:` for all four categories (aspirationally in the case of conjectures).

| Object | Prefix |
|:-----------:|:-----------:|
| Chapter     | `sec` |
| Section     | `sec` |
| Subsection     | `sec` |
| Subsubsection     | `sec` |
| Equation    | `eq` |
| Figure      | `fig` |
| Table       | `tab` |
| Footnote    | `fn` |
| Item (in a list) | `item` |
| Assumption | `assump` |
| Definition | `def` |
| Case (in list of cases) | `case` |
| Example | `example` |
| Theorem     | `result` | 
| Lemma       | `result` | 
| Proposition | `result` | 
| Conjecture  | `result` | 


<!-- The [`fancyref`](https://ctan.math.utah.edu/ctan/tex-archive/macros/latex/contrib/fancyref/fancyref.pdf) package (which I don't use) uses the following:  -->


In some cases, I concatenate multiple prefixes. 
Most commonly, if I have a list of items in an assumption, I'll use `item:assump:`. 
<!-- The choice to put `item` before `assumption` is not arbitrary. I use Dryer Lint to check the formatting of items, which has a different check that I would use for assumptions. -->

## Hyperlinking

To make each reference a hyperlink to the referenced item, load the `hyperref` package before loading `cleveref`. 
I use the following options for `hyperref`: 
```latex
% Include links even if the document is in 'draft' mode.
\usepackage[final]{hyperref}
\hypersetup{
    % Allow line breaks in the middle of links.
    breaklinks=true,         
    % Color links instead of drawing boxes around them.
    colorlinks=true,
    % Set link color for internal links, including links in the table of 
    % contents, and linked references to equations, environments, etc.
    linkcolor=black,         
    filecolor=magenta,      
    % URLS including links in references  
    urlcolor=black!30!blue,  
    % In-line citations  
    citecolor=black!30!blue, 
}
```

## The `cleveref` Package

### Start of sentence vs. end of sentence

To insert a reference at the start of sentence, use `\Cref` (note the capital `C`) whereas mid-sentences references should use `\cref`. 
In some cases, the resulting text will be identical, such as if you use cleveref's `capitalise` option and are referencing "Theorem 2". 
Use `\Cref` and `\cref` carefully anyway, because the global formatting may change later and because some types of references, such as equations, use different formats for `\Cref` and `\cref`, overriding the `capitalise` option.

The `cleveref` formatting for mid-sentence references is defined using macros that start with `\cref...` whereas configuration for start of sentence use macros in the form `\Cref...`.

### Referencing Multiple Items
The `cleveref` package supports referencing multiple items with a single `\cref{}` macro, using comma-separated labels.

A few things to keep in mind:

* Do not include spaces before or after the labels in `\cref{}`, since `cleveref` does not strip white space.


#### Code formatting for multiple references


{% raw %} 
When inserting many references with a single occurrence of `\cref{...}`, the code can become difficult to read.

```latex
\cref{eq:energy bound,eq:momentum bound,eq:mass bound,result:main theorem,fig:trajectory}
```
You might expect to insert a line break after each label:
```latex
\cref{
eq:energy bound,
eq:momentum bound,
eq:mass bound,
result:main theorem,
fig:trajectory
}
```
However, LaTeX treats each line break as a space, making the above code equivalent to 
```latex
\cref{ eq:energy bound, eq:momentum bound, eq:mass bound, result:main theorem, fig:trajectory }
```
so each label begins with an extra space: "` eq:energy bound`", "` eq:momentum bound`", etc.

Instead, you must end each line with a comment to suppress the additional space:
```latex
\cref{%
  eq:energy bound,%
  eq:momentum bound,%
  eq:mass bound,%
  result:main theorem,%
  fig:trajectory%
}
```
In TeX, leading white space on each line is discarded, so we can indent the labels as shown above to improve readability.

{% endraw %} 

## Preventing Bad Line Breaks

When inserting a reference to objects like "Section 1" or "Theorem 3", we want to ensure that "Section" and "1" are on the same line. 
The default `cleveref` formats already join the name and number with a non-breaking space `~`.
When you define custom formats, as in the next section, use `~` between words and numbers (e.g., `Equation~\textup{(#2#1#3)}` and ` and~\textup{(#2#1#3)}`) to keep this behavior.

## Formatting Equation References as "(1)" not "eq. (1)"

By default, cleveref configures equation references as 

* "eq. (1)"
* "eqs. (1) and (2)"
* "eqs. (1) to (3)"
* "eqs. (1), (2) and (4)"

My preferred style is to 

1. omit "eq." and "eqs.", except for the start of sentences, which should use "Equation" or "Equations", instead;
2. join ranges of equation numbers by n-dashes;
3. use an Oxford comma; and
4. format equation numbers as upright text, even if the surrounding text is italicized.

Achieving these four goals is surprisingly involved. 
You must use all of the following macros:

* `\crefname`: Remove the "Equation" name so that it is not inserted into every reference. We instead set it explicitly for `\Cref` formats.
* `\Crefformat`/`\crefformat`: Set the format of a single equation reference at the start/middle of a sentence. Used by `\Cref`/`\cref`.
* `\Crefrangeformat`/`\crefrangeformat`: Set the format for a range of equation references at the start/middle of a sentence. Always used by `\Crefrange`/`\crefrange` and is used by `\Cref`/`\cref` if the given equations consist of a _single_ range of 3 or more consecutive equations.
* `\Crefmultiformat`/`\crefmultiformat`: Set the format for equation references that occur in a list of multiple references when the references are not a continuous range consisting of 3 or more consecutive references. Used by `\Cref`/`\cref`.
* `\Crefrangemultiformat`/`\crefrangemultiformat`: Set the format for equation references that occur in a list of multiple references where some (but not all) of the references are consecutive, with 3 or more in a row. Used by `\Cref`/`\cref`.


{% raw %} 
If there are no gaps in the list of equations, then it is not too complicated. 
Suppose we have sequential equations labeled as `eq:1`, `eq:2`, `eq:3`, etc.
The following shows where the formatting for each reference comes from:

```latex
\cref{eq:1}%                Uses \crefformat:      "(1)"
\cref{eq:1,eq:2}%           Uses \crefmultiformat: "(1) and (2)"
\cref{eq:1,eq:2,eq:3}%      Uses \crefrangeformat: "(1)–(3)"
\cref{eq:1,eq:2,eq:3,eq:4}% Uses \crefrangeformat: "(1)–(4)"
```
Once we have gaps between references, however, then we can have a mixture of formats coming from `\crefmultiformat` and `\crefrangemultiformat`:
```latex
% Insert "(1)–(3) and (5)"
\cref{%
  eq:1,eq:2,eq:3,% Uses \crefrangemultiformat: "(1)–(3)"
  eq:5%            Uses \crefmultiformat for (5). 
}
% Insert "(1), (2), and (5)"
\cref{%
  eq:1,eq:2,eq:5% Uses \crefmultiformat for "(1)", "(2)", and "(5)".
}
```
{% endraw %}

The following code changes the format of equation references to "(1)" instead of "eq. (1)" (except at the start of a sentence).
When an equation reference occurs in italicized text, such as a theorem statement, it looks odd to have "(1)" italicized like, "_We see in (1) that..._", so I use "`\textup{(...)}`" instead of "(...)", forcing the equation reference to always be upright. 
For the previous example, this would produce "_We see in_ (1) _that..._".

In the single and multiple formats, argument `#1` is the formatted equation number (e.g., `\theequation`), and arguments `#2` and `#3` mark the beginning and end of the part of the cross-reference that is hyperlinked when the `hyperref` package is used.
In the range formats, `#1` and `#2` are the first and last equation numbers, `#3` and `#4` mark the hyperlink for the first number, and `#5` and `#6` mark the hyperlink for the last number.

{% raw %} 
```latex
% ⋘──────── Equation in middle of sentence ────────⋙
% Omit "Equation" when \cref{} is used to reference an equation in the middle of a sentence.
\crefname{equation}{}{}% 
% Define format for a single equation referenced in the middle of a sentence.
% When inserting "(1)", use upright text for the parentheses and number.
\crefformat{equation}{\textup{(#2#1#3)}}
% Define format for multiple equations referenced in the middle of a sentence.
\crefmultiformat{equation}    % {type}
    {\textup{(#2#1#3)}}       % {first}
    { and~\textup{(#2#1#3)}}  % {second}
    {, \textup{(#2#1#3)}}     % {middle}
    {, and~\textup{(#2#1#3)}} % {last}
% Define format for a range of equations, joined by an en dash.
\crefrangeformat{equation}{\textup{(#3#1#4)}--\textup{(#5#2#6)}}
% Define format for ranges that occur in a list of multiple references.
\crefrangemultiformat{equation}                    % {type}
    {\textup{(#3#1#4)}--\textup{(#5#2#6)}}         % {first}
    { and~\textup{(#3#1#4)}--\textup{(#5#2#6)}}    % {second}
    {, \textup{(#3#1#4)}--\textup{(#5#2#6)}}       % {middle}
    {, and~\textup{(#3#1#4)}--\textup{(#5#2#6)}}   % {last}

% ⋘──────── Equation at start of sentence ────────⋙
% For equations referenced at the start of a sentence, we want to include "Equation" or "Equations". 
% The following formats are used when "\Cref" is used instead of "\cref". 
% Define format for a single equation referenced at the start of sentence.
\Crefformat{equation}{Equation~\textup{(#2#1#3)}}
% Define format for multiple equations referenced at the start of sentence.
\Crefmultiformat{equation}        % {type}   
    {Equations~\textup{(#2#1#3)}} % {first}           
    { and~\textup{(#2#1#3)}}      % {second}       
    {, \textup{(#2#1#3)}}         % {middle}   
    {, and~\textup{(#2#1#3)}}     % {last}   
% Define format for a range of equations referenced at the start of sentence.
\Crefrangeformat{equation}{Equations~\textup{(#3#1#4)}--\textup{(#5#2#6)}}
% Define format for ranges in a list of references at the start of sentence.
\Crefrangemultiformat{equation}                            % {type}
    {Equations~\textup{(#3#1#4)}--\textup{(#5#2#6)}}       % {first}
    { and~\textup{(#3#1#4)}--\textup{(#5#2#6)}}            % {second}
    {, \textup{(#3#1#4)}--\textup{(#5#2#6)}}               % {middle}
    {, and~\textup{(#3#1#4)}--\textup{(#5#2#6)}}           % {last}
```
{% endraw %}

## Oxford Comma in Lists of Mixed References

The multiple formats in the previous section already insert an Oxford comma in lists of equations, via the `{, and~...}` argument.
When a list of references points to items of different types, however, `cleveref` does not use those formats. 
By default, such references are listed like "Lemma 1, Theorem 2 and Lemma 2". 
Note the absence of the Oxford comma after "Theorem 2". 
To fix this, we define `\creflastconjunction`, which `cleveref` will automatically use to insert as the last conjunction in a list of 3 or more items.

```latex
% ⋘────────── Enable Oxford Comma ──────────⋙
% https://tex.stackexchange.com/a/161340/153678
\newcommand{\creflastconjunction}{, and~}
```

## References to Enumerations

```latex
% When inserting items using "\cref", don't prefix the reference with "Item".
\crefname{enumi}{}{}%
\crefname{enumii}{}{}%
\crefname{enumiii}{}{}%
\crefname{enumiv}{}{}%
```

## Using References in Section Headings and Chapter Titles
<!-- 
TODO: Test the cases when section headings cannot have links. Is it only when you have a table of contents? 
 -->
Section headings and chapter titles are copied into the table of contents and the PDF bookmarks, where a hyperlinked reference causes problems.
If you want to include a reference in a section heading, you need to avoid inserting the hyperlink that is automatically created for each reference when `hyperref` is loaded.

The `cleveref` package provides starred versions of `\cref` and other related macros which inserts the reference text without a link:
```latex
\cref{eq:my equation}% Linked reference.
\cref*{eq:my equation}% Unlinked reference.
```
You can use `\cref*{}` in section headings. 
```latex
\subsection{Proof of \cref*{result:my result}}
```
You might, however, want the section header to have a link to `result:my result`.
To achieve this, use `\subsection`'s optional argument, which sets the text used in the table of contents and bookmarks:
```latex
\subsection[Proof of \cref*{result:my result}]{Proof of \cref{result:my result}}
```
PDF bookmarks can only contain plain text, so `hyperref` may warn about `\cref*` in the optional argument.
To give the bookmark its own plain-text version, wrap the reference in `\texorpdfstring{<TeX version>}{<PDF version>}`.

<!-- 
## Using `cleveref` to access separate parts of references
You can access the name and number parts of references. 
If `\cref{fig:my figure}` produces "Figure 7", then 

## Defining & Testing Custom Formats

## Examples of cleveref macro outputs
-->
