---
layout: single
title: Tracking Revisions in LaTeX
excerpt: Introduction to the \changes package for annotating chnages.
date: 2023-04-02 08:00:00 -0800
toc: true
tags: latex collaboration
permalink: /permalink/tracking-revisions-in-latex
comments:
  host: mathstodon.xyz
  username: pwintz
  id: 110131076079520491
---
As a PhD student, an essential part of my job is sending drafts to my advisor for his feedback. 
Because his time is limited, it is crucial that I direct his attention to the parts of the document that I modified.
A useful tool for tracking changes is the [`changes`](https://www.ctan.org/pkg/changes) LaTeX package. 
To import the package, add `\usepackage{changes}` to your document's preamble. 
The `changes` package defines four types of annotations: `\added`, `\deleted`, `\replaced`, and `\comment` and also imports the `\todo` macro from the [`todo`](https://www.ctan.org/pkg/todo) package.

**Example:**
<pre class="language-latex">Here is \added{added}, \deleted{deleted} 
and \replaced{replaced}{replaysed} text.
\comment{Maybe I shouldn't have written this?}
\todo[inline]{To-do: Write something worthwhile.}</pre>
**Output:**

![Rendered LaTeX document shows annotations.]({{page.image_path}}/changes_example.png)

## Workflow
In order for annotations to be useful they must be up-to-date.
This raises the question of when to remove annotations.
The best workflow depends on the way your reviewer gives feedback. 
If your reviewer will read the entire document, then you can delete annotations immediately after sending them a draft.
In my case, however, my advisor only reads a portion of each draft I send, so I leave annotations until he has given feedback. 
To this motivates the following workflow:
1. Annotate each change to the PDF. 
2. Compile PDF and share with reviewer.
3. Commit changes to the source code into Git or another source control management software. (If you aren't tracking the changes to your source code, then start!)
4. Wait for reviewer to give comments or continue editing the document (as in step 1).

Once the reviewer gives you comments:
5. Commit current version to Git.
5. Delete the annotations _only from the sections of the document that were reviewed_.
6. Commit the new version, without the deleted annotations.

## Annotating Blocks of Text
When annotating a sentence or more, I format my LaTeX code with `\added{` and `}` on their own lines. 
Including `%` immediately after `\added{` and after `}` prevents LaTeX from inserting extra spaces (LaTeX treats a new line in the code the same as a space).  
{% raw %}
<pre class="language-latex">\added{%
  Lorem ipsum dolor sit amet, consectetur 
  adipiscing elit, sed do eiusmod tempor 
  incididunt ut labore et dolore magna aliqua. 
}% End \added block
</pre>
{% endraw %}
If you use Visual Studio Code, see [below](#visual-studio-configuration) for snippets that will wrap selected text in annotation commands.

The commands `\added`, `\deleted`, and `\replaced` cannot contain a paragraph break.
This precludes empty lines, such as
<pre class="language-latex">\added{  
  % Paragraph 1
  Lorem ipsum dolor sit amet, consectetur 
  adipiscing elit, sed do eiusmod tempor 
  incididunt ut labore et dolore magna aliqua. 

  % Paragraph 2 (Causes error!)
  Duis aute irure dolor in reprehenderit 
  in voluptate velit esse cillum dolore 
  eu fugiat nulla pariatur.
}</pre>

To mark multiple paragraphs as changed, I define a new color called `added` using the [`xcolor`](https://www.ctan.org/pkg/xcolor) package
<pre class="language-latex">
\usepackage{xcolor}
\colorlet{added}{blue!80!black} 
</pre>
Then, add `\color{added}` before a multiple paragraph change, and add `\color{black}` afterward. 
<pre class="language-latex">\color{added} 
% Paragraph 1 (Added)
Lorem ipsum dolor sit amet, consectetur 
adipiscing elit, sed do eiusmod tempor 
incididunt ut labore et dolore magna aliqua. 

% Paragraph 2 (Added)
Duis aute irure dolor in reprehenderit 
in voluptate velit esse cillum dolore 
eu fugiat nulla pariatur.
\color{black} 

% Paragraph 3 (No change)
Excepteur sint occaecat cupidatat non 
proident, sunt in culpa qui officia 
deserunt mollit anim id est laborum.
</pre>
**Output:**

![Rendered LaTeX document shows annotations.]({{page.image_path}}/changes_example_multiple_paragraphs.png)
 

## Package Configuration
There are various package options. For my documents, I use the following:

<pre class="language-latex">\usepackage[ % import "changes" package
    % If any of the changes commands are already defined, then the option "commandnameprefix=ifneeded" 
    % tells changes to append "ch" to the name of the changes command in order to avoid a name collision.
    % Commonly, "\comment" will be changed to "\chcomment".
    commandnameprefix=ifneeded, 
    % Changes imports the "todo" package. The following options are passed to the "todo" package.
    todonotes={colorinlistoftodos,
                prependcaption,
                textsize=small,
                backgroundcolor=orange!10,
                textcolor=black,
                linecolor=orange,
                bordercolor=orange} % 
    % draft, % <- enable line to show annotations regardless of the document being in 'final' mode.
    % final, % <- enable line to hide annotations regardless of the document being in 'draft' mode.
]{changes}
</pre>

For comments in the margin, the margin size for many document classes is too narrow, so it is necessary to adjust it. 
One way to this is with the [`geometry`](https://www.ctan.org/pkg/geometry) package.
In the following snippet, we also use the [`ifdraft`](https://www.ctan.org/pkg/ifdraft) package so that our changes to the margins only apply in draft mode.

<pre class="language-latex">
% Create \ifdraft{}{} conditional 
% that switches based on whether "draft" 
% is passed to document class.
\usepackage{ifdraft} 
\ifdraft{
    % Adjust spacing to fit margin notes.
    \usepackage[inner=20mm, outer=40mm,
            marginparwidth=34mm]{geometry} 
}{}
</pre>

My full LaTeX configuration file is available [here](https://github.com/pwintz/hsl_templates/blob/main/pwintz_configuration.sty).

### Resolve Name Conflict For `\comment` Command
There are several packages that define a `\comment` command that would clash with the one defined by `changes`. 
If the `prependcaption` is included in the options for `changes`, then `\comment` is automatically renamed to `\chcomment` and a warning is shown. 
I would prefer to use `\comment` for the `changes` command, however. 
To do this, you can redefine the existing `\comment` command. 
If `comment` is an _environment_, as is defined by the `verbatim` package, then you must redefine both `\comment` and `\endcomment`, prior to importing `changes`, as follows: 

<pre class="language-latex">% Redefine "comment" environment (from "verbatim" package) 
% to "commentsection" so that \comments{} can be defined 
% by the `changes` package.
\makeatletter
\let\commentsection\comment
\let\endcommentsection\endcomment
\let\comment\@undefined
\let\endcomment\@undefined
\makeatother
</pre>

## Visual Studio Configuration

When writing [LaTeX with Visual Studio Code](https://github.com/James-Yu/LaTeX-Workshop), you can define [snippets](https://code.visualstudio.com/docs/editor/userdefinedsnippets) that are automatically inserted when you type particular text. 
To set up snippets, type `CTRL+SHIFT+P`, type `Preferences: Configure User Snippets`, and select `latex.json`. 
Add the following code to `latex.json`:

{% raw %}
<pre class="language-json">
{
	"Added":{
		"prefix": ["\\added"],
		"body": [
			"\\added{$TM_SELECTED_TEXT$1}$0"
		]
	},
	"Added Block":{
		"prefix": ["\\added%", "\\addedblock"],
		"body": [
			"\\added{%",
			"\t$TM_SELECTED_TEXT$0",
			"}% End \\added block",
			"" // Ensure there is a new line at end
		]
	},
	"Deleted":{
		"prefix": ["\\deleted"],
		"body": [
			"\\deleted{$TM_SELECTED_TEXT$1}$0"
		]
	},
	"Deleted Block":{
		"prefix": ["\\deleted%", "\\deletedblock"],
		"body": [
			"\\deleted{%",
			"\t$TM_SELECTED_TEXT$0",
			"}% End \\deleted block",
			"" // Ensure there is a new line at end
		]
	},
	"Replaced":{
		"prefix": ["\\replaced"],
		"body": [
			"\\replaced{$TM_SELECTED_TEXT$1}{$TM_SELECTED_TEXT}$0"
		]
	},
	"Replaced Block":{
		"prefix": ["\\replaced%", "\\replacedblock"],
		"body": [
			"\\replaced{% New Text",
			"\t$TM_SELECTED_TEXT$0",
			"}{% Old Text",
			"\t$TM_SELECTED_TEXT",
			"}% End \\replaced block",
			"" // Ensure there is a new line at end
		]
	}
}
</pre>
{% endraw %}

For each command `\added`, `\deleted`, and `\replaced`, there are two versions of snippets an "inline" version and a "block" version.
To use the block version append `%` or `block`.
For example, to add a `\replaced` block: 
1. Select the text you are replacing.
2. Type `\replaced%` or `\replacedblock`. The selected text will temporarily disappear as you type.
3. Select "Replaced Block" from the drop-down menu. At this point, the text you had selected reappears in both arguments of `\replaced`. 
4. Modify the first argument to the new version.

I find the `\replaced` block snippet particularly useful because the comments `% New Text` and `% Old Text` remind me of the order of the arguments, which I always forget.