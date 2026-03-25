---
layout: single
title: "VS Code Snippets - Patterns, Tricks, and Examples"
# excerpt: 
toc: 2
draft: true
tags: latex references
date: 2025-12-28 00:00:00 -0800


---

VS Code is a powerful development environment which includes autocomplete for all major languages (via extensions). 
No matter how good an editor's autocomplete is, however, it is often beneficial to define custom completions. 
In VS Code, such completions are called _snippets_. 
A snippet can be as simple as inserting expanding a short string into a longer expression. 
For example, I use snippets that perform the following expansions:
```plaintext
"nbd" -> "neighborhood"
"wrt" -> "with respect to "
"wts" -> "want to show "
```
This document is not meant as a tutorial on basic use of snippets; see the [VS Code documentation](https://code.visualstudio.com/docs/editing/userdefinedsnippets) for an introduction. 
Instead, I assume basic familiarity and present some more advanced techniques for writing snippets, along with example snippets that may be broadly useful.

Snippets can be much more complicated than simple replacements because of three features that allow you to modify the inserted text:

1. Tab stops
1. Snippet variables 
1. Regular expression replacements

A snippet _tab stop_ acts as a fill-in-the-blank when the snippet is inserted. 
Tab stops are indicated by `$1`, `$2`, etc., where `$1` will be replaced by the first text you type while inserting the snippet, `$2` will be the second, etc. 
A tab stop can be repeated, and you can define a default value, a list of choice, or a regular expression replacement that is applied to the entered text. 

Where snippets start to become very powerful is in the use of _snippet variables_.
The most common variables I are the following: 

- `$TM_SELECTED_TEXT` -- The text that was selected in the editor when the snippet was activated.
- `$TM_FILENAME` and `$TM_FILENAME_BASE` -- The name of the current file with and without the extension.
- `$CURSOR_INDEX` and `$CURSOR_NUMBER` -- The zero-based and one-based number of each cursor when using the multi-cursor.
- `$CURRENT_YEAR`, `$CURRENT_MONTH`, etc. -- Various information about the current time.
- `$LINE_COMMENT` -- The line comment character or characters for the current language. 


Finally, snippets become much more powerful by using regular expression replacements. 
This is often useful with the `$TM_SELECTED_TEXT` variable because you can find and replace text in the selection. 
The basic syntax is 
```jsonc
  "${TM_SELECTED_TEXT/regex/replacement/flags}"
```
When writing regular expressions in JSON, you escape special characters twice: once for JSON and again for regular expressions. 
Thus, to match a literal backspace `\` in a regular expression, you must escape it as `\\` for the regular expression and escape each backslash again for JSON to produce `\\\\`. 
As both an example of how messy this gets and a remedy, the following snippets can be used to escape and unescape a string for JSON. 

```jsonc
"Escape JSON String": {
  "scope": "json,jsonc,snippets",
  "body": [
    "${TM_SELECTED_TEXT/(?:(\\\\)|(\"))/${1:+\\\\\\\\}${2:+\\\\\"}/g}"
  ],
}, 
"Unescape JSON String": {
  "scope": "json,jsonc,snippets",
  "body": [
    "${TM_SELECTED_TEXT/(?:(\\\\\\\\)|(\\\\\"))/${1:+\\\\}${2:+\"}/g}"
  ],
}, 
```
To use `Escape JSON String` and `Unescape JSON String`, select the string you want to modify, then open the command pallet (Ctrl+Shift+P or Cmd+Shift+P), select `Snippets: Insert Snippets`, and select `Escape JSON String` and `Unescape JSON String`. (Using a prefix for these snippets does not work because when you type the prefix you erase the string).

## Tab Stop Patterns

This section contains useful patterns for designing tab stops. 

### Tab stop with selected text as default value

To use the selected text as the default value for a tab stop, use 
```jsonc
"${1:$TM_SELECTED_TEXT}"
```
When the snippet is activated, the first tab stop will be populated with the selected text. 
You can then edit it or simply hit TAB to proceed. 
If no text is selected when the snippet is activated, however, then the default text will be empty, which may be undesirable. 
To provide a default when no text is selected, use 
```jsonc
"${1:${TM_SELECTED_TEXT:default_text}}"
```

The following snippet can be used when writing snippets. 
Add this snippet to `all_languages.json.code-snippets`:
```jsonc
"Snippet: Add Tab Stop (Selected Text as Default)": {
  "prefix": ["\\tabStopSelectedText", "${:TM_SELECTED_TEXT"],
  "scope": "snippets",
  "body": [
    // We use "${TM_SELECTED_TEXT:default_text}" to insert the users selected text (if any), otherwise insert "default_text". 
    // In the generated snippet, the same construct is provided.
    "\\${${1|1,2,3,4,5,6|}:\\${TM_SELECTED_TEXT:${2:${TM_SELECTED_TEXT:default_text}}}}"
  ],
},
```


## Example Snippets
This section contains snippets that I use day-to-day. 
You may use them directly or take them as examples to build on.

### Comment Section Headers

The snippets in this section create nicely formatted comment section headers that appear like:
```latex
% ╭──────────────────────────────────────────────╮
% │  ╭────────────────────────────────────────╮  │
% │  │             Section Header             │  │
% │  ╰────────────────────────────────────────╯  │
% ╰──────────────────────────────────────────────╯
Here is regular text.

% ╭───────────────────────────────────────────╮
% │             Subsection Header             │
% ╰───────────────────────────────────────────╯
Here is regular text.

% ⋘──────── Subsubsection Header ────────⋙
Here is regular text.

```

```jsonc
// ╭─────────────────────────────────────────────────────╮
// │ ╭─────────────────────────────────────────────────╮ │
// │ │             Section Header Snippets             │ │
// │ ╰─────────────────────────────────────────────────╯ │
// ╰─────────────────────────────────────────────────────╯
"Section Comment Header": {
  "prefix": ["\\sectionComment",  "%sectionComment", "#sectionComment", "//sectionComment"], 
  "body": [
    "${LINE_COMMENT} ╭────────────────${1/./─/g}────────────────╮",
    "${LINE_COMMENT} │  ╭─────────────${1/./─/g}─────────────╮  │",
    "${LINE_COMMENT} │  │             ${1:$TM_SELECTED_TEXT}             │  │",
    "${LINE_COMMENT} │  ╰─────────────${1/./─/g}─────────────╯  │",
    "${LINE_COMMENT} ╰────────────────${1/./─/g}────────────────╯",
    "$0"
  ]
},
"Subsection Comment Header": {
  "prefix": ["\\subsectionComment", "%subsectionComment", "#subsectionComment", "//subsectionComment"], 
  "body": [
    "${LINE_COMMENT} ╭─────────────${1/./─/g}─────────────╮",
    "${LINE_COMMENT} │             ${1:$TM_SELECTED_TEXT}             │",
    "${LINE_COMMENT} ╰─────────────${1/./─/g}─────────────╯",
    "$0"
  ]
},
"subsubsection Comment Header": {
  "prefix": ["\\subsubsectionComment", "%subsubsectionComment", "#subsubsectionComment", "//subsubsectionComment"], 
  "body": [
    "${LINE_COMMENT} ⋘──────── ${1:$TM_SELECTED_TEXT} ────────⋙",
    ""
  ]
}, 

```

To highlight the headers, I also use the [`edwinhuish.better-comments-next`](https://marketplace.visualstudio.com/items?itemName=EdwinHuiSH.better-comments-next) extension with the following configuration in my global `settings.json`:
```json
"better-comments.tags": [
  {
      // # Section, subsection, and subsubsection headers
      "tag": [
          "╭",
          "│",
          "╰",
          "⋘",
          "#"
      ],
      "backgroundColor": "transparent",
      "bold": true,
      "color": "#68C",
  },
]S
```
The result is the comments look like this:
<img src="/assets/images/comment-headers.png" alt="screenshot of comment headers"/>

### Duplication Snippets

The following snippets allow you to 

1. Create a given number of multi-cursors. 
1. Duplicate selected text a given number of times.

After using these snippets, I often use the multi-cursor enumeration snippets, [given below](#multi-cursor-enumeration-snippets).

```jsonc

// ╭──────────────────────────────────────────────────╮
// │ ╭──────────────────────────────────────────────╮ │
// │ │             Duplication Snippets             │ │
// │ ╰──────────────────────────────────────────────╯ │
// ╰──────────────────────────────────────────────────╯
"2x":{
  "prefix": ["\\2x"],
  "body" : ["${1:$TM_SELECTED_TEXT}${4:, }$1$0"]
},
"3x":{
  "prefix": ["\\3x"],
  "body" : ["${1:$TM_SELECTED_TEXT}${2:, }$1${2:, }$1$0"]
},
"4x":{
  "prefix": ["\\4x"],
  "body" : ["${1:$TM_SELECTED_TEXT}${2:, }$1${2:, }$1${2:, }$1$0"]
},
"5x":{
  "prefix": ["\\5x"],
  "body" : ["${1:$TM_SELECTED_TEXT}${2:, }$1${2:, }$1${2:, }$1${2:, }$1$0"]
},
"6x":{
  "prefix": ["\\6x"],
  "body" : ["${1:$TM_SELECTED_TEXT}${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1$0"]
},
"7x":{
  "prefix": ["\\7x"],
  "body" : ["${1:$TM_SELECTED_TEXT}${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1$0"]
},
"8x":{
  "prefix": ["\\8x"],
  "body" : ["${1:$TM_SELECTED_TEXT}${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1$0"]
},
"9x":{
  "prefix": ["\\9x"],
  "body" : ["${1:$TM_SELECTED_TEXT}${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1$0"]
},
"10x":{
  "prefix": ["\\10x"],
  "body" : ["${1:$TM_SELECTED_TEXT}${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1$0"]
},
"11x":{
  "prefix": ["\\11x"],
  "body" : ["${1:$TM_SELECTED_TEXT}${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1$0"]
},
"12x":{
  "prefix": ["\\12x"],
  "body" : ["${1:$TM_SELECTED_TEXT}${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1$0"]
},
"13x":{
  "prefix": ["\\13x"],
  "body" : ["${1:$TM_SELECTED_TEXT}${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1$0"]
},
"24x":{
  "prefix": ["\\24x"],
  "body" : ["${1:$TM_SELECTED_TEXT}${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1$0"],
  "description": "Insert 24 multi-curors (number of letters in Greek alphabet)."
},
"26x":{
  "prefix": ["\\26x"],
  "body" : ["${1:$TM_SELECTED_TEXT}${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1${2:, }$1$0"], 
  "description": "Insert 26 multi-curors (equal to number of letters in English alphabet)."
},
// ╭─────────────────────────────────────────────────────────────────────╮
// │             Comma separated with "and" before last item             │
// ╰─────────────────────────────────────────────────────────────────────╯
"2x list with \"and\"":{
  "prefix": ["\\2xand"],
  "body" : ["${1:$TM_SELECTED_TEXT} and $1$0"]
},
"3x comma separated list with \"and\"":{
  "prefix": ["\\3xand"],
  "body" : ["${1:$TM_SELECTED_TEXT}, $1, and $1$0"]
},
"4x comma separated list with \"and\"":{
  "prefix": ["\\4xand"],
  "body" : ["${1:$TM_SELECTED_TEXT}, $1, $1, and $1$0"]
},
"5x comma separated list with \"and\"":{
  "prefix": ["\\5xand"],
  "body" : ["${1:$TM_SELECTED_TEXT}, $1, $1, $1, and $1$0"]
},
"6x comma separated list with \"and\"":{
  "prefix": ["\\6xand"],
  "body" : ["${1:$TM_SELECTED_TEXT}, $1, $1, $1, $1, and $1$0"]
},
"7x comma separated list with \"and\"":{
  "prefix": ["\\7xand"],
  "body" : ["${1:$TM_SELECTED_TEXT}, $1, $1, $1, $1, $1, and $1$0"]
},
"8x comma separated list with \"and\"":{
  "prefix": ["\\8xand"],
  "body" : ["${1:$TM_SELECTED_TEXT}, $1, $1, $1, $1, $1, $1, and $1$0"]
},
"9x comma separated list with \"and\"":{
  "prefix": ["\\9xand"],
  "body" : ["${1:$TM_SELECTED_TEXT}, $1, $1, $1, $1, $1, $1, $1, and $1$0"]
},
"10x comma separated list with \"and\"":{
  "prefix": ["\\10xand"],
  "body" : ["${1:$TM_SELECTED_TEXT}, $1, $1, $1, $1, $1, $1, $1, $1 and $1$0"]
},
"11x comma separated list with \"and\"":{
  "prefix": ["\\11xand"],
  "body" : ["${1:$TM_SELECTED_TEXT}, $1, $1, $1, $1, $1, $1, $1, $1, $1, and $1$0"]
},
"12x comma separated list with \"and\"":{
  "prefix": ["\\12xand"],
  "body" : ["${1:$TM_SELECTED_TEXT}, $1, $1, $1, $1, $1, $1, $1, $1, $1, $1, and $1$0"]
},
// ╭────────────────────────────────────────────────────╮
// │             Line-break-separated items             │
// ╰────────────────────────────────────────────────────╯
"2x with Line Breaks":{
  "prefix": ["\\2xLines"],
  "body" : [
    "${1:$TM_SELECTED_TEXT}", "$1$0"
  ]
},
"3x with Line Breaks":{
  "prefix": ["\\3xLines"],
  "body" : [
    "${1:$TM_SELECTED_TEXT}", "$1", "$1$0"
  ]
},
"4x with Line Breaks":{
  "prefix": ["\\4xLines"],
  "body" : [
    "${1:$TM_SELECTED_TEXT}", "$1","$1", "$1$0"
  ]
},
"5x with Line Breaks":{
  "prefix": ["\\5xLines"],
  "body" : [
    "${1:$TM_SELECTED_TEXT}", "$1", "$1", "$1", "$1$0"
  ]
},
"6x with Line Breaks":{
  "prefix": ["\\6xLines"],
  "body" : [
    "${1:$TM_SELECTED_TEXT}", "$1", "$1", "$1", "$1", "$1$0"
  ]
},
"7x with Line Breaks":{
  "prefix": ["\\7xLines"],
  "body" : [
    "${1:$TM_SELECTED_TEXT}", "$1", "$1", "$1", "$1", "$1", "$1$0"
  ]
},
"8x with Line Breaks":{
  "prefix": ["\\8xLines"],
  "body" : [
    "${1:$TM_SELECTED_TEXT}", "$1", "$1", "$1", "$1", "$1", "$1", "$1$0"
  ]
},
"9x with Line Breaks":{
  "prefix": ["\\9xLines"],
  "body" : [
    "${1:$TM_SELECTED_TEXT}", "$1", "$1", "$1", "$1", "$1", "$1", "$1", "$1$0"
  ]
},
"10x with Line Breaks":{
  "prefix": ["\\10xLines"],
  "body" : [
    "${1:$TM_SELECTED_TEXT}", "$1", "$1", "$1", "$1", "$1", "$1", "$1", "$1", "$1$0"
  ]
},
"11x with Line Breaks":{
  "prefix": ["\\11xLines"],
  "body" : [
    "${1:$TM_SELECTED_TEXT}", "$1", "$1", "$1", "$1", "$1", "$1", "$1", "$1", "$1", "$1$0"
  ]
},
"12x with Line Breaks":{
  "prefix": ["\\12xLines"],
  "body" : [
    "${1:$TM_SELECTED_TEXT}", "$1", "$1", "$1", "$1", "$1", "$1", "$1", "$1", "$1", "$1", "$1$0"
  ]
},
```

### Multi-cursor Enumeration Snippets
When using VS Code multi-cursors, it is often useful to enumerate the multi-cursors by inserting a different number or letter at each cursor.
The following snippets allow you to insert numbers starting at zero (`\cursorIndex`), starting at one (`\cursorNumber`), uppercase letters (`\Alpha`), lowercase letters (`\alpha`), upper and lowercase Roman numerals (`\Roman` and `\roman`), and upper and lowercase Greek (`\Greek` and `\greek`). 
You can also insert only even numbers starting at 2 (`\even`) and only odd numbers starting at 1 (`\odd`). 
I typically use these snippets in conjunction with the duplication snippets in [Duplication Snippets](#duplication-snippets)
```jsonc
// ╭───────────────────────────────────────────────────╮
// │             Multi-cursor enumerations             │
// ╰───────────────────────────────────────────────────╯
"Cursor Index (starts at 0)":{
  "prefix": ["\\cursorIndex"],
  "body" : ["$CURSOR_INDEX$0"]
},
"Cursor Number (starts at 1)":{
  "prefix": ["\\cursorNumber"],
  "body" : ["$CURSOR_NUMBER$0"]
},
"Cursor Uppercase Latin Alphabet (A, B, C, ..., Z)":{
  "prefix": ["\\cursorLatinUppercase", "\\Alph"],
  "body" : ["${CURSOR_NUMBER/(^1$)?(^2$)?(^3$)?(^4$)?(^5$)?(^6$)?(^7$)?(^8$)?(^9$)?(^10$)?(^11$)?(^12$)?(^13$)?(^14$)?(^15$)?(^16$)?(^17$)?(^18$)?(^19$)?(^20$)?(^21$)?(^22$)?(^23$)?(^24$)?(^25$)?(^26$)?/${1:+A}${2:+B}${3:+C}${4:+D}${5:+E}${6:+F}${7:+G}${8:+H}${9:+I}${10:+J}${11:+K}${12:+L}${13:+M}${14:+N}${15:+O}${16:+P}${17:+Q}${18:+R}${19:+S}${20:+T}${21:+U}${22:+V}${23:+W}${24:+X}${25:+Y}${26:+Z}/}"]
},
"Cursor Lowercase Latin Alphabet (a, b, c, ..., z)":{
  "prefix": ["\\cursorLatinLowercase", "\\alph"],
  "body" : ["${CURSOR_NUMBER/(^1$)?(^2$)?(^3$)?(^4$)?(^5$)?(^6$)?(^7$)?(^8$)?(^9$)?(^10$)?(^11$)?(^12$)?(^13$)?(^14$)?(^15$)?(^16$)?(^17$)?(^18$)?(^19$)?(^20$)?(^21$)?(^22$)?(^23$)?(^24$)?(^25$)?(^26$)?/${1:+a}${2:+b}${3:+c}${4:+d}${5:+e}${6:+f}${7:+g}${8:+h}${9:+i}${10:+j}${11:+k}${12:+l}${13:+m}${14:+n}${15:+o}${16:+p}${17:+q}${18:+r}${19:+s}${20:+t}${21:+u}${22:+v}${23:+w}${24:+x}${25:+y}${26:+z}/}"]
},
"Cursor Lowercase Roman (i, ii, iii, ..., xx)":{
  "prefix": ["\\roman", "\\cursorRomanLowercase"],
  "body" : ["${CURSOR_NUMBER/(^1$)?(^2$)?(^3$)?(^4$)?(^5$)?(^6$)?(^7$)?(^8$)?(^9$)?(^10$)?(^11$)?(^12$)?(^13$)?(^14$)?(^15$)?(^16$)?(^17$)?(^18$)?(^19$)?(^20$)?/${1:+i}${2:+ii}${3:+iii}${4:+iv}${5:+v}${6:+vi}${7:+vii}${8:+viii}${9:+ix}${10:+x}${11:+xi}${12:+xii}${13:+xiii}${14:+xiv}${15:+xv}${16:+xvi}${17:+xvii}${18:+xviii}${19:+xix}${20:+xx}/}$0"]
},
"Cursor Uppercase Roman (I, II, III, ..., XX)":{
  "prefix": ["\\Roman", "\\cursorRomanUppercase"],
  "body" : ["${CURSOR_NUMBER/(^1$)?(^2$)?(^3$)?(^4$)?(^5$)?(^6$)?(^7$)?(^8$)?(^9$)?(^10$)?(^11$)?(^12$)?(^13$)?(^14$)?(^15$)?(^16$)?(^17$)?(^18$)?(^19$)?(^20$)?/${1:+I}${2:+II}${3:+III}${4:+IV}${5:+V}${6:+VI}${7:+VII}${8:+VIII}${9:+IX}${10:+X}${11:+XI}${12:+XII}${13:+XIII}${14:+XIV}${15:+XV}${16:+XVI}${17:+XVII}${18:+XVIII}${19:+XIX}${20:+XX}/}$0"]
},
"Cursor Lowercase Greek Alphabet (\\alpha, \\beta, ...)":{
  "prefix": ["\\cursorGreekLowercase", "\\greek"],
  "body" : ["${CURSOR_NUMBER/(^1$)?(^2$)?(^3$)?(^4$)?(^5$)?(^6$)?(^7$)?(^8$)?(^9$)?(^10$)?(^11$)?(^12$)?(^13$)?(^14$)?(^15$)?(^16$)?(^17$)?(^18$)?(^19$)?(^20$)?(^21$)?(^22$)?(^23$)?(^24$)?/${1:+\\\\alpha}${2:+\\\\beta}${3:+\\\\gamma}${4:+\\\\delta}${5:+\\\\epsilon}${6:+\\\\zeta}${7:+\\\\eta}${8:+\\\\theta}${9:+\\\\iota}${10:+\\\\kappa}${11:+\\\\lambda}${12:+\\\\mu}${13:+\\\\nu}${14:+\\\\xi}${15:+o}${16:+\\\\pi}${17:+\\\\rho}${18:+\\\\sigma}${19:+\\\\tau}${20:+\\\\upsilon}${21:+\\\\phi}${22:+\\\\chi}${23:+\\\\psi}${24:+\\\\omega}/}$0"]
},
"Cursor Uppercase Greek Alphabet (\\Alpha, \\Beta, ...)":{
  "prefix": ["\\cursorGreekUppercase", "\\Greek"],
  "body" : ["${CURSOR_NUMBER/(^1$)?(^2$)?(^3$)?(^4$)?(^5$)?(^6$)?(^7$)?(^8$)?(^9$)?(^10$)?(^11$)?(^12$)?(^13$)?(^14$)?(^15$)?(^16$)?(^17$)?(^18$)?(^19$)?(^20$)?(^21$)?(^22$)?(^23$)?(^24$)?/${1:+\\\\Alpha}${2:+\\\\Beta}${3:+\\\\Gamma}${4:+\\\\Delta}${5:+\\\\Epsilon}${6:+\\\\Zeta}${7:+\\\\Eta}${8:+\\\\Theta}${9:+\\\\Iota}${10:+\\\\Kappa}${11:+\\\\Lambda}${12:+\\\\Mu}${13:+\\\\Nu}${14:+\\\\Xi}${15:+o}${16:+\\\\Pi}${17:+\\\\Rho}${18:+\\\\Sigma}${19:+\\\\Tau}${20:+\\\\Upsilon}${21:+\\\\Phi}${22:+\\\\Chi}${23:+\\\\Psi}${24:+\\\\Omega}/}$0"]
},
"Cursor number even":{
  "prefix": ["\\even", "\\cursorEvenNumbers"],
  "body" : ["${CURSOR_NUMBER/(^1$)?(^2$)?(^3$)?(^4$)?(^5$)?(^6$)?(^7$)?(^8$)?(^9$)?(^10$)?(^11$)?(^12$)?(^13$)?(^14$)?(^15$)?(^16$)??/${1:+2}${2:+4}${3:+6}${4:+8}${5:+10}${6:+12}${7:+14}${8:+16}/}$0"]
},
"Cursor number odd":{
  "prefix": ["\\odd", "\\cursorOddNumbers"],
  "body" : ["${CURSOR_NUMBER/(^1$)?(^2$)?(^3$)?(^4$)?(^5$)?(^6$)?(^7$)?(^8$)?(^9$)?(^10$)?(^11$)?(^12$)?(^13$)?(^14$)?(^15$)?(^16$)??/${1:+1}${2:+3}${3:+5}${4:+7}${5:+9}${6:+11}${7:+13}${8:+15}/}$0"]
},

```

<!-- 
## Defining File Templates
One odd quirk of VS Code is that file templates are defined as snippets. 
To create a file template, create a snippet in your global `all_languages.json.code-snippets` file. 
In the snippet set the property.
```jsonc
"isFileTemplate": true
```
so that VS Code recognizes the snippet as a template.
You should also set the `"scope"` to the appropriate language
```jsonc 
"scope": "<language>"
```
Once the file template is inserted, VS Code sets the language of the file to the given `<language>`. 

As an example, here is my bash script file template:
```jsonc
"Bash Script File": {
	"prefix": ["Bash Script File"],
	"isFileTemplate": true,
  "scope": "shellscript",
	"body": [
     "#!/usr/bin/env bash",
     "",
     "# Configure script behavior (https://stackoverflow.com/a/2871034/6651650).",
     "# -e script exits on error ",
     "# -u errors on undefined variables ",
     "# -x prints commands before execution ",
     "# -o pipefail exits on command pipe failures. ",
     "set -euxo pipefail",
     "",
     "$0"
	]
},
``` -->

## Miscellaneous Useful Snippets

The following snippet inserts today's date, formatted like `December 28, 2025`. 
```jsonc
"Today's date (human readable)": {
  "prefix": ["\\today"],
  "body": [
    "$CURRENT_MONTH_NAME ${CURRENT_DATE/^(0)//gumi}, $CURRENT_YEAR"
  ],
  "description": "Insert the current date in a human readable format."
},
```
The next snippet inserts a line comment character (for the current language) at the current cursor location. 
Using the default key binding CTRL+/ causes the entire line to be commented, which is often not what I want, so I define ALT+/ to instead only comment the remainder of the line.
```jsonc
"Insert Line Comment at Cursor": {
  "prefix": "commentAtCursor", 
  "body": "${LINE_COMMENT}", 
  "description": "Inserts a line comment at the current cursor position"
},
```
I use the following key binding to activate `"Insert Line Comment at Cursor"`:
```jsonc
{
    // Insert a line comment at the current location.
    "key": "alt+/",
    "command": "editor.action.insertSnippet",
    "when": "editorTextFocus && textInputFocus",
    "args": {
        "name": "Insert Line Comment at Cursor"
    }
},
```

## Future topics
Some topics that I plan to add to this page in the future include:

- How to define snippets that apply to multiple languages (but not all). 
- Working with tab stop choices (esp. limitations)
- Defining file templates. 
- LaTeX-specific snippets
- faux-UnicodeIt snippets
- Snippet Snippets (snippets for creating snippets)