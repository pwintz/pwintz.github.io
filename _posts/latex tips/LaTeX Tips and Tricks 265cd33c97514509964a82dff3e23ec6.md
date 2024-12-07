# LaTeX Tips and Tricks

This document documents the LaTeX wisdom I’ve accumulated over the years. 

# Writing LaTeX Faster

- Use `\newcommand` to define frequently repeated strings.
- Use [Mathpix Snips](https://mathpix.com/) to automatically generate LaTeX code from images and screenshots of mathematical expressions (including handwritten notes!)

# Make Your Document ✨ S P A R K L E ✨

This section describes how to take your document to the next level, making it feel like the polished work of a professional LaTeX’er.

## Avoid common typesetting mistakes

1. Using italics for definitions and remarks. Only the text of Theorems, Propositions, Lemmas, and Corollaries should be italicized.
2. When defining a term, use italics. This can also save space because you can omit “is defined as”
3. Not using `\operatorname` to typeset math operators. 

![Untitled](LaTeX%20Tips%20and%20Tricks%20265cd33c97514509964a82dff3e23ec6/Untitled.png)

1. Using lowercase “O” for subscripts instead of “0”. For the initial value of $x$ should be typeset as $x_0$ ("`x_0`") not as $x_O$ ("`x_O`") or $x_o$ ("`x_o`").
2. When using a period that is not at the end of a sentence, the following space should be typeset using “\ “ instead of a normal space. For example, the text “$\text{My name is P. Wintz}$” should be typeset as `My name is P.\ Wintz`. This ensures size of the correct space after the dot is not too long.
3. Footnote markers should be placed after punctuation. So “$\text{Here is a comment.}^2$” is correct whereas “$\text{Here is another comment}^3.$” is incorrect.
4. On the other hand, references given with square brackets must be placed before the period with a side before the Open bracket.
5. 
    
6. Use `~` for nonbreaking spaces before references. 

## Add PDF Metadata

Encode the title, subject, and author names into the PDF metadata. Counterintuitively, this is accomplished using the `hyperref` package as shown below.   

```latex
\makeatletter
\usepackage{hyperref}
\hypersetup{
    % Set the metadata for the produced PDF.
    % For \@title and \@author to work, we need to have already specified 
    % the title using the \title command and the author with the \author command.
    % It is also important that this section of code is surrounded by
    % "\makeatletter ... \makeatother". 
    % Note that this does not work in draft mode.
    pdftitle={\@title}, % Reference the title set in the preamble.
    pdfauthor={\@author}, % Reference the author set in the preamble.
		% You can also set the following values, as desired.
    pdfsubject={},
    pdfkeywords={}
\makeatother
```

### Fix spacing when using `\left(\right)`

```latex
%%%% Fix Spacing Around "\left(\right)" %%%
\usepackage{mleftright}
\mleftright % redefine \left as \mleft and \right as \mright.
```

# Saving Those Sweet, Sweet Lines For Maximum Content in Minimal Pages

This section discuss tricks for cutting down the length of a document.