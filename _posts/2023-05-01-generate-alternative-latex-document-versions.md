---
layout: single
title: Creating Report and Conference Documents Without Duplicating LaTeX Code
# excerpt: 
date: 2023-05-01 08:00:00 -0800
toc: true
tags: latex 
permalink: /permalink/multiple-latex-document-versions
comments:
  host: mathstodon.xyz
  username: pwintz
  id: 
---

{% raw %}
<pre class="language-latex">
% Allows code block sections
\usepackage{verbatim} 

% Redefine "comment" environment (from "verbatim" package) 
% to "commentsection" so that \comments{} can be defined 
% by the `changes` package.
\makeatletter
\let\commentsection\comment
\let\endcommentsection\endcomment
\let\comment\@undefined
\let\endcomment\@undefined
\makeatother

% Color
\usepackage{xcolor}
\definecolor{darkred}{rgb}{0.76, 0.0, 0.0}
\definecolor{darkgreen}{rgb}{0.0, 0.5, 0.0}

% Create \ifdraft{}{} conditional 
% that switches based on whether "draft" 
% is passed to document class.
\usepackage{ifdraft} 
\ifdraft{
  % Show conference-only text in green.
  \newcommand{\confonly}[1]{\darkgreen{#1}}
  \newenvironment{confonlyblock}{\color{darkgreen}}{\color{black}}

  % Show report-only content (which will be hidden in the final version) in red.
  \newcommand{\reportonly}[1]{{\color{darkred}#1}}
  \newenvironment{reportonlyblock}{\color{darkred}}{\color{black}}

  % % Alternatively, use the following lines to hide the report-only content in drafts.
  % \newcommand{\reportonly}[1]{\red{#1}}
  % \newenvironment{reportonlyblock}{\commentsection}{\endcommentsection}
}{
  % Show conference-only content.
  \newcommand{\confonly}[1]{#1}
  \newenvironment{confonlyblock}{}{}

  % Hide report-only content.
  \newcommand{\reportonly}[1]{}
  \newenvironment{reportonlyblock}{\commentsection}{\endcommentsection}
}
</pre>
{% endraw %}