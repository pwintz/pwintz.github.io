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
    documentation: https://mirrors.ctafn.org/macros/latex/required/amsmath/amsldoc.pdf
    macros: 
      - \eqref
    description: "The <code>\\eqref</code> macro inserts equation references formatted as \"(1)\" instead of just a number \"1\"."
  - name: "<code>cleveref</code> package"
    description: "Cleveref is a powerful cross-referencing tool that creates references that are formatted based on the type of object referenced, the location of the reference in the sentence (start vs. middle), and the number of targets referenced. Can produce multiple references and ranges of references using single commands."
    documentation: 
    macros: 
      - \cref
      - \crefrange
      - \cpageref
      - \cpagerefrange
  # - name: "<code>hyperref</code>"
  #   description: "The hyperref package adds hyperlinks to references created by other packages."
  #   documentation: https://ctan.org/pkg/hyperref
  - name: "<code>nameref</code> package"
    description: "The <code>\\nameref</code> package inserts the text associated of referenced objects, such as chapter titles, section headings, theorem names, and description list labels. Bundled with hyperref."
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
    description: "Inserts external references to other compiled LaTeX documents. Makes other "
    documentation: https://ctan.org/pkg/xr
    macros: 
      - \externaldocument
      - \vpageref
      - \vrefrange
      - \vrefpagerange
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

reference-commands:
  - name: <code>\ref</code>
    provided-by: TeX
    documentation: "https://www.overleaf.com/learn/latex/Cross_referencing_sections%2C_equations_and_floats"
    description: Inserts the number of the section, figure, equation, etc. that contains the matching label.
    can-reference-multiple: false
    allows-type-based-formatting: false
    allows-different-formatting-at-start-of-sentences: false
    customizability: None
    examples:
      - code: \ref{eq:my 3rd equation}
        output: $3$
        description: The number (and only the number) of the referenced object is inserted.
      - code: Section \
        output:
        description: To 
  - name: <code>\pageref</code>
    provided-by: TeX
    documentation: "https://www.overleaf.com/learn/latex/Cross_referencing_sections%2C_equations_and_floats"
    description: Inserts the page number that contains the matching label.
    can-reference-multiple: false
    allows-type-based-formatting: false
    allows-different-formatting-at-start-of-sentences: false
    customizability: None
  - name: <code>\eqref</code>
    provided-by: "<code>amsmath</code>"
    documentation: https://mirrors.ctan.org/macros/latex/required/amsmath/amsldoc.pdf
    description: Inserts a equation number formatted like "(1)" for the matching label.
    can-reference-multiple: false
    allows-type-based-formatting: false
    allows-different-formatting-at-start-of-sentences: false
    customizability: Difficult
  - name: <code>\\cref<code>
    provided-by: "<code>cleveref</code>"
    documentation: https://ctan.org/pkg/cleveref
    description: Inserts formatted reference(s) for each listed label.
    can-reference-multiple: true
    allows-type-based-formatting: true
    allows-different-formatting-at-start-of-sentences: "Yes, by changing <code>\\cref</code> to <code>\\Cref</code>"
    customizability: Yes
  - name: <code>crefrange</code>
    provided-by: "<code>cleveref</code>"
    documentation: https://ctan.org/pkg/cleveref
    description: Inserts a range of references starting at the first given equation and ending at the last.
    can-reference-multiple: true
    allows-type-based-formatting: true
    allows-different-formatting-at-start-of-sentences: true
    customizability: Yes
  - name: <code>cpageref</code>
    provided-by: "<code>cleveref</code>"
    documentation: https://ctan.org/pkg/cleveref
    description: 
    can-reference-multiple: true
    allows-type-based-formatting: true
    allows-different-formatting-at-start-of-sentences: true
    customizability: Yes
  - name: <code>cpagerefrange</code>
    provided-by: "<code>cleveref</code>"
    documentation: https://ctan.org/pkg/cleveref
    description: Inserts a range of page numbers starting at the first given equation and ending at the last.
    can-reference-multiple: true
    allows-type-based-formatting: true
    allows-different-formatting-at-start-of-sentences: true
    customizability: Yes

cleveref-single-label-eq-reference-examples:
  - macro: \cref
    default-output: eq. (1)
    custom-output: Equation (1)
  - macro: \Cref
    default-output: Eq. (1)
    custom-output: Equation (1)
  - macro: \cref*
  - macro: \Cref*
  - macro: \cpageref
  - macro: \Cpageref
  - macro: \namecref
  - macro: \nameCref
  - macro: \lcnamecref # Force lower case
  - macro: \namecrefs
  - macro: \nameCrefs
  - macro: \labelcref


---
One powerful aspect of writing documents in LaTeX is the ability to insert automatic references to components of your document, such as theorems, page numbers, and equations. 

## Labeling Document Components

In LaTeX, you can add code labels to any numbered objects, such as equations, tables, sections, theorems, etc., which allow you to insert automatic references that use the number of the labeled object.
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
You can now reference the labels using the following commands:

| Command | Example Output | Description | Provided by |
|:-----------:|:-----------:|:-----------:|:-----------:|
| `\ref{eq:my 1st math}`   |  1    |   Equation Counter Value     | TeX |
| `\ref{eq:my 2nd math}`   |  2    |   Equation Counter Value     | TeX |
| `\pageref{eq:my 1st math}`   |  1   |   Page Number     | TeX |
| `\eqref{eq:my 1st math}`   |  (1)    |   Formatted Equation Number     | `amsmath` |
| `\Cref{eq:my 1st math}`   |  Equation 1   |   Start-of-sentence formatted equation number  | `cleveref` |
| `\cref{eq:my 1st math}`   |  (1)   |   Middle-of-sentence formatted equation number  | `cleveref` |
| `\cref{eq:my 1st math,eq:my 2nd math}`   |  (1) and (2)    |   Multiple Formatted Equation Numbers  (middle of sentence)     | `cleveref` |
| `\cref{eq:my 1st math,eq:my 2nd math,eq:my 3rd math}`   |  (1)-(2)    |   Multiple Formatted Equation Numbers  (middle of sentence)     | `cleveref` |



\section{Introduction}
\label{sec:introduction}
| `\nameref{sec:introduction}`   |  Introduction   |   Inserts the name of the section      | `nameref` (included by `hyperref`)  |
\label{sec:introduction}

| `\ref{result:my 1st theorem}`   |  2    |   Theorem Counter Value     | TeX |

## Comparison of Reference Packages
<!-- 
<table>
  <tr>
    <th>Command</th>
    <th>Provided by</th>
    <th>Description</th>
  </tr>
  {% for item in page.reference-commands %}
    <tr>
      <td>{{ item.name }}</td>
      <td><a href="{{ item.documentation }}">{{ item.provided-by }}</a></td>
      <td>{{ item.description }}</td>
      <td>{{ item.can-reference-multiple }}</td>
      <td>{{ item.allows-type-based-formatting }}</td>
      <td>{{ item.allows-different-formatting-at-start-of-sentences }}</td>
      <td>{{ item.customizability }}</td>
    </tr>
  {% endfor %}
</table> -->

<table>
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
      <!-- <td>
      </td> -->
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


## Choosing Reference Label


The format for `[label name]` has [some restrictions](https://tex.stackexchange.com/q/18311/153678).
The following characters are safe to use in labels:

* alphanumeric: a-z, A-Z, 0-9
* colons: ":"
* spaces: " "

Do not use the following characters in labels:

* commas "`,`"
* Backslashes "`\`"
* dollar signs "`$`"



In general, labels should be fairly stable, prefixes should not be too specific, since creating, e.g., different prefixes for sections, subsections, and subsections will require you to change the label whenever you decide to move a section up or down one level.
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


## The `cleveref` Package

### Start of sentence vs. end of sentence

To insert a reference at the start of sentence, use `\Cref` (note the capital `C`) whereas mid-sentences references should use `\cref`. 
In some cases, the resulting text will be identical, such as if you use the `capitalise` package option and are referencing "Theorem 2". 
Careful usage of `\Cref` vs. `\cref` should be used, however, in case the global formatting later changes and because some types of references, such as equations, will use custom formatting styles for `\Cref` vs. `\cref`, overriding the `capitalise` option.

The `cleveref` formatting for mid-sentence references is defined using macros that start with `\cref...` whereas configuration for start of sentence use macros in the form `\Cref...`.

## Hyperlinking

To make each reference a hyperlink to the referenced item, you simply load the `hyperref` package before loading `cleveref`. 
I use the following options for `hyperref`: 
```latex
\usepackage{hyperref}
\hypersetup{
    % Include links even if document is in 'draft' mode.
    final,                   
    % Prevent boxes from being drawn around links in some viewers.
    hidelinks,               
    % Allow line breaks in the middle of links
    breaklinks=true,         
    % Use colors for links.
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

### Referencing Multiple Items
The `cleveref` package supports referencing multiple items with a single `\cref{}` macro, using comma-separated labels.

A few things to keep in mind:

* Do not include spaces before or after the labels in `\cref{}`, since `cleveref` does not strip white space.


#### Code formatting for multiple references


{% raw %} 
When inserting many references with a single occurrence of `\cref{...}`, the code can become difficult to read.

```latex
\cref{authorsTitle2025,authorsTitle1993,authorsTitle1984,authorsTitle1723,authorsTitle1023}
```
You may expect that you can inserting a line break after each key:
```latex
\cref{
authorsTitle2025,
authorsTitle1993,
authorsTitle1984,
authorsTitle1723,
authorsTitle1023
}
```
However, LaTeX treats each line break as a space, making the above code equivalent to 
```latex
\cref{ authorsTitle2025, authorsTitle1993, authorsTitle1984, authorsTitle1723, authorsTitle1023 }
```
so each label key that begins with an extra space: "` authorsTitle2025`", "` authorsTitle1993`", etc.

Instead, you must end each line with a comment to suppress the additional space:
```latex
\cref{%
  authorsTitle2025,%
  authorsTitle1993,%
  authorsTitle1984,%
  authorsTitle1723,%
  authorsTitle1023%
}
```
In TeX, leading white space on each line is discarded, so we can indent the labels as shown above to improve readability.

{% endraw %} 

## Preventing Bad Line Breaks

When inserting a reference to objects like "Section 1" or "Theorem 3", we want to ensure that "Section" and "1" are on the same line. 

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
If there are no gaps in the list of equations, then it is not to complicated. 
Suppose we have sequential equations labeled as `eq:1`, `eq:2`, `eq:3`, etc.
The following shows where the formatting for each reference comes from:

```latex
\cref{eq:1}%                Uses \crefformat:      "(1)"
\cref{eq:1,eq:2}%           Uses \crefmultiformat: "(1) and (2)"
\cref{eq:1,eq:2,eq:3}%      Uses \crefrangeformat: "(1)-(3)"
\cref{eq:1,eq:2,eq:3,eq:4}% Uses \crefrangeformat: "(1)-(4)"
```
Once we have a gaps between references, however, then we can have a mixture of formats coming from `\crefmultiformat` and `\crefrangemultiformat`:
```latex
% Insert "(1)-(3) and (5)"
\cref{%
  eq:1,eq:2,eq:3,% Uses \crefrangemultiformat: "(1)-(3)"
  eq:5%            Uses \crefmultiformat for (5). 
}
% Insert "(1), (2), and (5)"
\cref{%
  eq:1,eq:2,eq:5% Uses \crefmultiformat for "(1)", "(2)", and "(5)".
}
```
{% endraw %}

The following code changes the format of equation references to "(1)" instead of "Equation 1" (except at the start of a sentence).
When an equation reference occurs in italicized text, it looks odd to have "(1)" italicized like, "_We see in (1) that..._", so I use "`\textup{(...)}`" instead of "(...)", forcing the equation reference to always be upright. 
For the previous example, this would produce "_We see in_ (1) _that..._".

```latex
% ⋘──────── Equation in middle of sentence ────────⋙
% Omit "Equation" when \cref{} is used to reference an equation in the middle of a sentence.
\crefname{equation}{}{}% 
% Define format for a single equation referenced in the middle of a sentence.
% When inserting "(1)", use upright text for the parentheses and number.
\crefformat{equation}{\textup{(#2#1#3)}}
% Define format for a multiple equations referenced in the middle of a sentence.
\crefmultiformat{equation}    % {type}
    {\textup{(#2#1#3)}}       % {first}
    { and~\textup{(#2#1#3)}}  % {second}
    {, \textup{(#2#1#3)}}     % {middle}
    {, and~\textup{(#2#1#3)}} % {last}

% ⋘──────── Equation at start of sentence ────────⋙
% For equations referenced at the start of a sentence, we want to include "Equation" or "Equations". The following formats are used when "\Cref" is used instead of "\cref". 
% * The first argument #1 is the formatted version of the label counter (e.g.\theequation). 
% * Arguments #2 and #3 mark the beginning and end of the part of the cross-reference that is hyperlinked when the hyperref package is used.
% Define format for a single equation referenced at the start of sentence.
\Crefformat{equation}{Equation~\textup{(#2#1#3)}}
% Define format for a multiple equation referenced at the start of sentence.
\Crefmultiformat{equation}        % {type}   
    {Equations~\textup{(#2#1#3)}} % {first}           
    { and~\textup{(#2#1#3)}}      % {second}       
    {, \textup{(#2#1#3)}}         % {middle}   
    {, and~\textup{(#2#1#3)}}     % {last}   
```


## Use upright numbers and parentheses

We use "\textup{(...)}" instead of "(...)" so that the equation reference is always upright, even in theorem statements and other italicized text.
% https://ctan.org/pkg/cleveref

## Configuring Ranges of References

### Oxford Comma in lists of references

When a list of references are pointing to items of different types or do not have a contiguous sequence of numbers, then references are listed, by default, like "Lemma 1, Theorem 2 and Lemma 2". 
Note the absence of the Oxford comma after "Theorem 2". 
To fix this, we define `\creflastconjunction`, which `cleveref` will automatically use to insert as the last conjunction in a list of 3 or more items.

```latex
% ⋘────────── Enable Oxford Comma ──────────⋙
% https://tex.stackexchange.com/a/161340/153678
\newcommand{\creflastconjunction}{, and~}
```

## References to Enumerations

```
% When inserting items using "\cref", don't prefix the reference with "Item".
\crefname{enumi}{}{}%
\crefname{enumii}{}{}%
\crefname{enumiii}{}{}%
\crefname{enumiv}{}{}%
```

### Using References in Sections Headings and Chapter Titles
<!-- 
TODO: Test the cases when section headings cannot have links. Is it only when you have a table of contents? 
 -->
In some cases, section headings and chapter titles, you cannot include hyperlinks. 
If you want to include a reference in a section heading, you need to somehow avoid inserting the hyperlink that is automatically created for each reference when `hyperref` is loaded.

The `cleveref` package provides starred versions of `\cref` and other related macros which inserts the reference text without a link:
```latex
\cref{eq:my equation}% Linked reference.
\cref*{eq:my equation}% Unlinked reference.
```
You can use `\cref*{}` in section headings. 
```
\subsection{Proof of \cref*{result:my result}}
```
You might, however, want the section header to have a link to `result:my result`.
To achieve this, use `\section`'s optional argument:
```latex
\section[Proof of \cref*{result:my result}]{Proof of \cref{result:my result}}
```

## Using `cleveref` to access separate parts of references
You can access the name and number parts of references. 
If you have that `\cref{fig:my figure}` references "Figure 7", then 



## Defining & Testing Custom Formats

## Examples of cleveref macro outputs




*[chapter]: This is a test of abbreviating chapter