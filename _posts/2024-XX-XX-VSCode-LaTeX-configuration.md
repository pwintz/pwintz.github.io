# LaTeX Tips and Tricks

This document describes my LaTeX development environment in VS Code.


```json
	// Indexing
	"Cursor index (starts at 0)":{
		"prefix": ["\\cursorindex", "\\curndx"],
		"body" : ["$CURSOR_INDEX"]
	},
	"Cursor number (starts at 1)":{
		"prefix": ["\\cursornum", "\\curnum"],
		"body" : ["$CURSOR_NUMBER"]
	}
```

```json
{
	// Duplication
	"2x":{
		"prefix": ["\\2x"],
		"body" : ["${1:$TM_SELECTED_TEXT}${4:, }$1$0"]
	},
	"3x":{
		"prefix": ["\\3x"],
		"body" : ["${1:$TM_SELECTED_TEXT}${5:, }$1${5:, }$1$0"]
	},
	"nx":{
		"prefix": ["\\nx"],
		"body" : ["${1:$TM_SELECTED_TEXT}1${5:, }${1}2${5}${2|\\cdots,\\vdots,\\dots|}${5}${1}${6:n}$0"]
		// "body" : ["$1$2$5 $1$3$5 $1$4$0"]
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
		"body" : ["${1:$TM_SELECTED_TEXT}${2:, } $1${2:, } $1${2:, } $1${2:, } $1${2:, } $1${2:, }$0"]
	},
	"7x":{
		"prefix": ["\\7x"],
		"body" : ["${1:$TM_SELECTED_TEXT}$2 $1$3 $1$4 $1$5 $1$6 $1$7 $1$8$0"]
	},
	"5x distinct suffixes":{
		"prefix": ["\\5x distinct suffixes"],
		"body" : ["${1:$TM_SELECTED_TEXT}${2:}${7:, }$1${3:}${7:, }$1${4:}${7:, }$1${5:}${7:, }$1${6:}$0"]
	},
	"6x distinct suffixes":{
		"prefix": ["\\6x distinct suffixes"],
		"body" : ["${1:$TM_SELECTED_TEXT}$2$8 $1$3$8 $1$4$8 $1$5$8 $1$6$8 $1$7$8$0"]
	},
	"7x distinct suffixes":{
		"prefix": ["\\7x"],
		"body" : ["${1:$TM_SELECTED_TEXT}$2 $1$3 $1$4 $1$5 $1$6 $1$7 $1$8$0"]
	},
```
```json
	// Equations
	"Display Equation":{
		"prefix": ["\\["],
		"body": [
			"\\[",
				"\t$TM_SELECTED_TEXT$1",
			"\\] $0"
		],
		"description": "Insert block equation with line-breaks and indentation."
	},
	"Inline Equation":{
		//"prefix": ["\\("],
		"body": [
			"$$TM_SELECTED_TEXT$1$$0"
		],
		"description": "Insert inline equation."
	},
	"Equation Environment":{
		"prefix": ["\\equation"],
		"body": [
			"\\begin{equation}",
        "\t\\label{eq:$RANDOM_HEX}",
        "\t$TM_SELECTED_TEXT$1$0",
			"\\end{equation}",
			""
		],
		"description": "Insert equation environment with a random hexidecimal label."
	},
	// "Equation Environment Label Test":{
	// 	"prefix": ["\\eqlabel"],
	// 	"body": [
	// 		// Automatically generate a label from the contents of the equation, deleting any backslashes.
	// 		"\\label{eq:${TM_SELECTED_TEXT/[\\\\&]//g}${1/[\\\\&]//g}}",
	// 		"$TM_SELECTED_TEXT$1$0"
	// 	],
	// 	"description": "Insert equation environment with a random hexidecimal label."
	// },
	"Equation to Equation Environment":{
		"prefix": ["\\eqtoeq"],
		"body": [
			// Group 1: Before text. "(.*?)"
			// Group 2: Tab spaces before equation delimiter. "(\\h*)"
			// Group 3: Equation contents "(.*?)"
			// Group 4: After text "(.*)"
			"${TM_SELECTED_TEXT/(.*?)(\\h*)\\\\\\[\\s*(.*?)\\s*\\\\\\](.*)/$1$2\\begin{equation}\n$2\t$3\n$2\\end{equation}\n/s}"
		],
		"description": "Insert equation environment with a random hexidecimal label."
	},
	"Convert to display equation":{
		"body": [
			// Unescaped RegEx: ([\S\s]*)\$\s*(.*?)\s*\$([,.]{0,1})([\S\s]*)
			// Group 1: Content before equation. ("[\S\s]" matches any character)
			// Group 2: Contents of equation, stripping white space.
			// Group 3: Punctuation after equation ("[,.]{0,1}" matchs "," or "." zero or one times)
			// Group 4: Content after equation
			"${TM_SELECTED_TEXT/([\\S\\s]*)\\$\\s*(.*?)\\s*\\$([,.]{0,1})([\\S\\s]*)/$1\\[\n\t$2$3\n\\]$4/s}",
		],
		"description": "Convert ."
	},
	"Convert to inline equation":{
		"body": [
			// Regular expression (unescaped): (.*)\\\[\s*\n*\s*(.*?)\s*\n*\s*\\\](.*)
			// OLD: "${TM_SELECTED_TEXT/(.*)\\\\\\[\\s*\n*\\s*(.*?)\\s*\n*\\s*\\\\\\](.*)/$1$$2$$3/s}",
			// ([\\S\\s]*)\\\\\\[\\s*([\\S\\s]*?)\\s*([,.]{0,1})\\s*\\\\\\]([\\S\\s]*)
			// - "\s*" matches any number of spaces and line breaks around it.
			// - "[\s\S]" matches any character, including line breaks and spaces.
			// - "\\\[" Matches "\[" (there are three backslashes because "\\" matches "\" and "\[" matches "[").
			// Group 1: All the content before the equation.
			// Group 2: All the content in the equation, except for final punctuation  
			// Group 3: Final punctuation ("[,.]{0,1}").
			// Group 4: All the content after the equation.
			"${TM_SELECTED_TEXT/([\\S\\s]*)\\\\\\[\\s*([\\S\\s]*?)\\s*([,.]{0,1})\\s*\\\\\\]([\\S\\s]*)/$1$$2$$3$4/s}",
			
		],
		"description": "Convert a display equation to an inline equation."
	},
	// CITATIONS AND REFERENCES //
	"Citation":{
		"prefix": ["\\cite"],
		"body": [
			"\\cite{$1}$0"
		],
		"description": "Insert a citation."
	},
	"Clever Reference":{
		"prefix": ["\\cref", "\\ref"],
		"body": [
			"\\cref{$1}$0"
		],
		"description": "Insert an internal reference."
	},
	"Section":{
		"prefix": ["\\section"],
		"body": [
			"",
			"%===================================",
			"%===================================",
			"\\section{$TM_SELECTED_TEXT${1:Header}}",
			"$0"
		]
	},
	"Section Labeled":{
		"prefix": ["\\sectionlabeled"],
		"body": [
			"",
			"%===================================",
			"%===================================",
			"\\section{$TM_SELECTED_TEXT${1:Header}}",
			"\\label{sec:${2:label}}",
			"$0"
		]
	},
	"Subsction":{
		"prefix": ["\\subsection"],
		"body": [
			"",
			"%================================",
			"\\subsection{$TM_SELECTED_TEXT$1}",
			"$0"
		]
	},
	"Subsubsction":{
		"prefix": ["\\subsubsection"],
		"body": [
			"",
			"\\subsubsection{$TM_SELECTED_TEXT$1}",
			"$0"
		]
	},
	"Label":{
		"prefix": ["\\label"],
		"body": [
			"\\label{${1:type}:${2:label}}$0"
		]
	},
	"Inner product":{
		"prefix": ["\\ip"],
		"body": [
			"\\ip{$TM_SELECTED_TEXT$1}{$2}$0 "
		]
	},
	"Absolute value":{
		"prefix": ["\\abs"],
		"body": [
			"\\abs{$TM_SELECTED_TEXT$1}$0 "
		]
	},
	"Norm":{
		"prefix": ["\\norm"],
		"body": [
			"\\norm{$TM_SELECTED_TEXT$1}$0 "
		]
	},
	"Neighborhood":{
		"prefix": ["nbd"],
		"body": [
			"neighborhood"
		]
	},
	"With Respect To":{
		"prefix": ["wrt"],
		"body": [
			"with respect to "
		]
	},
	"Emphasis":{
		"prefix": ["epmh","\\emph"],
		"body": [
			"\\emph{$TM_SELECTED_TEXT$1}$0"
		]
	},
	"Bold":{
		"prefix": ["bold","\\bold"],
		"body": [
			"\\textbf{$TM_SELECTED_TEXT$1}$0"
		]
	},
	"Teletype":{
		"prefix": ["t","\\tt"],
		"body": [
			"\\texttt{$TM_SELECTED_TEXT$1}$0"
		]
	},
	"Color":{
		"prefix": ["\\color"],
		"body": [
			"{\\color{${1|darkred,darkgreen,darkblue,black|}}$TM_SELECTED_TEXT$2}$0"
		]
	},
	"Color Multiline":{
		"prefix": "\\colorblock",
		"body": [
			"{\\color{${1|darkred,darkgreen,darkblue,black|}}%%%%%%%%%% COLOR: $1 %%%%%",
			"$TM_SELECTED_TEXT$0",
			"}%%%%%%%%%% END COLOR: $1 %%%%%"
		]
	},
	"Green":{
		"prefix": ["\\green"],
		"body": [
			"{\\color{darkgreen}$TM_SELECTED_TEXT$2}$0"
		]
	},
	"Red":{
		"prefix": ["\\red"],
		"body": [
			"{\\color{darkred}$TM_SELECTED_TEXT$2}$0"
		]
	},
	"Hyperlink (includes link)":{
		"prefix": ["\\href","\\hyperlink", "\\url"],
		"body": [
			"\\href{${1:url}}{$TM_SELECTED_TEXT$2}$0"
		]
	},
	"Hyperlink (no link)":{
		"prefix": ["\\url"],
		"body": [
			"\\url{$TM_SELECTED_TEXT$2}$0"
		]
	},
	"Assumption (labeled)":{
		"prefix": ["\\assumption (labeled)"],
		"body": [
			"\\begin{assumption}\\setupAssumption{${2:A}}",
			"\t\\label{assump:${1:label}}",
			"\t$TM_SELECTED_TEXT$0",
			"\\end{assumption}",
			""
		]
	},
	"Definition (labeled)":{
		"prefix": ["\\definition (labeled)"],
		"body": [
			"\\begin{definition}[${2:Name of Defined Term}]",
			"\t\\label{def:${1:label}}",
			"\t$TM_SELECTED_TEXT$0",
			"\\end{definition}"
		]
	},
	"Example (labeled)":{
		"prefix": ["\\example (labeled)"],
		"body": [
			"\\begin{example}[${2:Example Name}]",
				"\t\\label{example:${1:Example Name}}",
				"\t$TM_SELECTED_TEXT$0",
			"\\end{example}"
		]
	},
	"Added":{
		"prefix": ["\\added"],
		"body": [
			"\\added{$TM_SELECTED_TEXT$1}$0"
		]
	},
	"Added Multiline":{
		"prefix": ["\\added%"],
		"body": [
			"\\added{%%%%%%%%%% ADDED %%%%%",
			"$TM_SELECTED_TEXT$0",
			"}%%%% END ADDED %%%%"
			// "" // Ensure there is a new line at end
		]
	},
	"Added Block Environment":{
		"prefix": ["\\addedblock"],
		"body": [
			"\\begin{addedblock}",
			"$TM_SELECTED_TEXT$0",
			"\\end{addedblock}"
			// "" // Ensure there is a new line at end
		]
	},
	"Deleted":{
		"prefix": ["\\deleted"],
		"body": [
			"\\deleted{$TM_SELECTED_TEXT$1}$0"
		]
	},
	"Deleted Multiline":{
		"prefix": ["\\deleted%"],
		"body": [
			"\\deleted{%%%%%%%%%% DELETED %%%%%",
			"\t$TM_SELECTED_TEXT$0",
			"}%%%%%%%%%% END DELETED %%%%%",
			// "" // Ensure there is a new line at end
		]
	},
	"Deleted Block Environment":{
		"prefix": ["\\deleted%", "\\deletedblock"],
		"body": [
			"\\begin{deletedblock}",
			"\t$TM_SELECTED_TEXT$0",
			"\\end{deletedblock}"
			// "" // Ensure there is a new line at end
		]
	},
	"Replaced":{
		"prefix": ["\\replaced"],
		"body": [
			"\\replaced{$TM_SELECTED_TEXT$1}{$TM_SELECTED_TEXT}$0"
		]
	},
	"Replaced Block":{
		"prefix": ["\\replaced%", "\\replaced (block)"],
		"body": [
			"\\replaced{% New Text",
			"$TM_SELECTED_TEXT$0",
			"}{% Old Text",
			"\t$TM_SELECTED_TEXT",
			"}% End \\replaced block",
			// "" // Ensure there is a new line at end
		]
	},
	"Vertical Box (no page breaks)":{
		"prefix": ["\\vbox", "\\nopagebreaks"],
		"body": [
			"\\vbox{% Vertical block",
				"\t$TM_SELECTED_TEXT$0",
			"}% End \\vbox",
			"" // Ensure there is a new line at end
		]
	},
	"Figure":{
		"prefix": ["\\fig", "\\figure"],
		"body": [
			"\\begin{figure}[htbp]",
				"\t\\centering",
				"\t\\includegraphics{$TM_SELECTED_TEXT$1}",
				"\t\\caption{$2}",
				"\t\\label{fig:$3}",
			"\\end{figure}%",
			"" // Ensure there is a new line at end
		]
	},
	"Inline Table":{
		"prefix": ["table", "tabular"],
		"body": [
			"\\begin{center}",
					"\t\\begin{tabular}{$1}",
							"\t\t$TM_SELECTED_TEXT$0",
					"\t\\end{tabular}",
			"\\end{center}"
		]
	},
	"New Command":{
		"prefix": ["\\newcommand"],
		"body": [
			"\\newcommand{\\\\${1:cmd}}{$TM_SELECTED_TEXT$2}$0"
		]
	},
	"Group (Variable Scope)":{
		"prefix": ["\\begingroup", "\\group"],
		"body": [
			"\\begingroup",
			"$TM_SELECTED_TEXT$0",
			"\\endgroup"
		]
	},
	"Environment":{
		"prefix": ["\\begin{ "],
		"body" : [
			"\\begin{$1}",
			"\t$TM_SELECTED_TEXT$0",
			"\\end{$1}"
		]
	},
	"Make @ a letter":{
		"prefix": ["\\makeat", "\\makeatletter"],
		"body": [
			"\\makeatletter",
			"\t$TM_SELECTED_TEXT$0", 
			"\\makeatother"
		]
	},
	"Theorem":{
		"prefix": ["\\theorem", "\\begin{theorem}", "theorem"],
		"body": [
			"\\begin{theorem}",
				"\t\\label{result:${1:name}}",
				"\t$TM_SELECTED_TEXT$0",
			"\\end{theorem}",
			""
		]
	},
	"Proposition":{
		"prefix": ["\\proposition", "\\begin{proposition}", "proposition"],
		"body": [
			"\\begin{proposition}",
				"\t\\label{result:${1:name}}",
				"\t$TM_SELECTED_TEXT$0",
			"\\end{proposition}",
			""
		]
	},
	"Lemma":{
		"prefix": ["\\lemma", "\\begin{lemma}", "lemma"],
		"body": [
			"\\begin{lemma}",
				"\t\\label{result:${1:name}}",
				"\t$TM_SELECTED_TEXT$0",
			"\\end{lemma}",
			""
		]
	},
	"Conjecture":{
		"prefix": ["\\conjecture", "\\begin{conjecture}", "conjecture"],
		"body": [
			"\\begin{conjecture}",
				"\t\\label{result:${1:name}}",
				"\t$TM_SELECTED_TEXT$0",
			"\\end{conjecture}",
			""
		]
	},
	"Proof":{
		"prefix": ["\\proof", "\\begin{proof}", "proof"],
		"body": [
			"\\begin{proof}",
				"\t$TM_SELECTED_TEXT$0",
			"\\end{proof}",
			""
		]
	},
	"Proof Draft":{
		"prefix": ["\\proofdraft", "proofdraft"],
		"body": [
			"\\begin{proof}[Proof Draft]",
				"\t$TM_SELECTED_TEXT$0",
			"\\end{proof}",
			""
		]
	},
	"Report only":{
		"prefix": ["\\reportonly"],
		"body": [
			"\\reportonly{$TM_SELECTED_TEXT$1}$0"
		]
	},
	"Report Only Block":{
		"prefix": ["\\reportonly%", "\\reportonlyblock"],
		"body": [
			"\\reportonly{%",
			"\t$TM_SELECTED_TEXT$0",
			"}% End of \\reportonly",
			// "" // Ensure there is a new line at end
		]
	},
	"Conference only":{
		"prefix": ["\\confonly"],
		"body": [
			"\\confonly{$TM_SELECTED_TEXT$1}$0"
		]
	},
	"Conference Only Block":{
		"prefix": ["\\confonly%","\\confonlyblock"],
		"body": [
			"\\confonly{%",
			"\t$TM_SELECTED_TEXT$0",
			"}% End of \\confonly",
			// "" // Ensure there is a new line at end
		]
	},
	"Working Note":{
		"prefix": ["\\workingnote"],
		"body": [
			"\\workingnote{$TM_SELECTED_TEXT$0}"
		]
	},
	"Working Note Block":{
		"prefix": ["\\workingnote%", "\\workingnoteblock"],
		"body": [
			"\\workingnote{%",
			"\t$TM_SELECTED_TEXT$0",
			"}% End of \\workingnote",
			// "" // Ensure there is a new line at end
		]
	},
	// MATH SYMBOLS //
	"sin(theta)": {
		"prefix": "\\st",
		"body": ["\\sin\\theta"]
	},
	"cos(theta)": {
		"prefix": "\\ct",
		"body": ["\\cos\\theta"]
	}
	,
	"sin^2(theta)": {
		"prefix": "\\s2t",
		"body": ["\\sin^2\\theta"]
	},
	"cos^2(theta)": {
		"prefix": "\\c2t",
		"body": ["\\cos^2\\theta"]
	},	
	// "Memory" symbols.
	"Memory Sum (Memorize)":{
		"prefix": ["\\memsum*"],
		"body": [
			"\\memsum*[$1=${2:0}][${3:\\infty}] $0"
		]
	},
	"Memory Product (Memorize)":{
		"prefix": ["\\memprod*"],
		"body": [
			"\\memprod*[$1=${2:0}][${3:\\infty}] $0"
		]
	},
	"Memory Limit (Memorize)":{
		"prefix": ["\\memlim*"],
		"body": [
			"\\memlim*[$1\\to $2] $0"
		]
	},
	"Memory Limit (Recall)":{
		"prefix": ["\\memlim"],
		"body": [
			"\\memlim $0"
		]
	},
	"Memory Integer (Memorize)":{
		"prefix": ["\\memint*"],
		"body": [
			"\\memint*[${1:lower limit}][${2:upper limit}][d${3:x}]{$TM_SELECTED_TEXT$4} $0"
		]
	},
	"Memory Integer (Recall)":{
		"prefix": ["\\memint"],
		"body": [
			"\\memint{$TM_SELECTED_TEXT$1} $0"
		]
	},
	"Memory Sequence (Memorize)":{
		"prefix": ["\\memseq*"],
		"body": [
			"\\memseq*[${1:j}=${2:0}][${3:\\infty}]{$TM_SELECTED_TEXT$4}$0"
		]
	},
	"Memory Sequence (Recall)":{
		"prefix": ["\\memseq"],
		"body": [
			"\\memseq{$TM_SELECTED_TEXT$1}$0"
		]
	},
	"Memory Supremum (Memorize)":{
		"prefix": ["\\memsup*"],
		"body": [
			"\\memsup*[$1] $0"
		]
	},
	"Memory Supremum (Recall)":{
		"prefix": ["\\memsup"],
		"body": [
			"\\memsup $0"
		]
	},
	"Memory Infimum (Memorize)":{
		"prefix": ["\\meminf*"],
		"body": [
			"\\meminf*[$1] $0"
		]
	},
	"Memory Infimum (Recall)":{
		"prefix": ["\\meminf"],
		"body": [
			"\\meminf $0"
		]
	},
	"Auto cases":{
		"prefix": ["autocases", "\\begin{autocases}"],
		"body": [
			"\\begin{autocases}",
				"\t$TM_SELECTED_TEXT$1 if $2 \\\\\\\\",
				"\t$3 if $4",
			"\\end{autocases}"
		]
	},
	// "End-Begin":{
	// 	"prefix": ["\\endbegin"],
	// 	"body": [
	// 		"\\end{$1}",
	// 		"",
	// 		"\\begin{$1}$TM_SELECTED_TEXT$0",
	// 	]
	// },
	"Inline To-do":{
		"prefix": ["\\todoinline", "\\todo[inline]"],
		"body": [
			"\\todo[inline]{To-do: $1}$0"
		]
	},
	//|################|
	//| HYBRID SYSTEMS |
	//|################|
	"Hybrid system (text)":{
		"prefix": ["HS"],
		"body": [
			"hybrid system"
		]
	},
	"Hybrid system":{
		"prefix": ["\\hybridsystem"],
		"body": [
			"\\system{",
			"\t\\dot{${1:x}}\\phantom{^{+}} &= f(${1:x}) & C &:= \\setdef{${1:x} \\in \\realsn \\suchthat $2} \\\\\\\\",
			"\t {${1:x}}^{+} &= g(${1:x}) & D &:= \\setdef{${1:x} \\in \\realsn \\suchthat $3}",
			"}"
		]
	},
	"Hybrid System Data":{
		"prefix": ["\\CfDg"],
		"body": [
			"(C, f, D, g)"
		]
	},
	"Matrix (inline)":{
		"prefix": ["\\mat"],
		"body": [
			"\\mat{$TM_SELECTED_TEXT$1}$0",
		]
	},
	"Matrix (multiline)":{
		"prefix": ["\\matml"],
		"body": [
			"\\mat{",
			"\t$TM_SELECTED_TEXT$1",
			"}$0",
		]
	},
	"Line break":{
		"prefix": ["\\\\ "],
		"body": [
			"\\\\\\\\",
			"$0"
		]
	},
	"Set builder notation":{
		"prefix": ["\\setbuild"],
		"body": [
			"\\setdef{$TM_SELECTED_TEXT${1:x} \\suchthat $2} $0"
		]
	},
	"Set definition":{
		"prefix": ["\\setdef"],
		"body": [
			"\\setdef{$TM_SELECTED_TEXT$1}$0"
		]
	},
	"In set":{
		"prefix": ["\\in{}"],
		"body": [
			"\\in \\{${1}\\\\}$0"
		]
	},
	"Set of Natural Numbers":{
		"prefix": ["\\N"],
		"body": [
			"\\naturals"
		]
	},
	"Set of Real Numbers":{
		"prefix": ["\\R"],
		"body": [
			"\\reals"
		]
	},
	"Set of Complex Numbers":{
		"prefix": ["\\C"],
		"body": [
			"\\complexes"
		]
	},
	"Cyber-physical":{
		"prefix": ["CP", "cyber-physical"],
		"body": [
			"cyber-physical"
		]
	},
	"Cyber-physical system":{
		"prefix": ["CPS", "cyber-physical system"],
		"body": [
			"cyber-physical system"
		]
	},
	// ======== BOOLEANS and CONDITIONALS ============
	"\\If Boolean":{
		"prefix": ["\\ifbool"],
		"body": [
			"\\ifbool{${1:bool name}}%",
			"{% If ${1:bool name} is true...",
			"\t$TM_SELECTED_TEXT",
			"}{% If ${1:bool name} is false",
			"}%"
		]
	},
	"Switch block":{
		"prefix": ["switch", "\\begin{switch}"],
		"body": [
			"\\begin{switch}{${1:value}}%",
				"\t\\case{${2:condition}}{$4}%",
				"\t\\case{${3:condition}}{$5}%",
				"\t\\otherwise{$6}%",
			"\\end{switch}%"
		]
	},
	"If Math Mode":{
		"prefix": ["\\ifmmode", "\\ifmathmode", "\\ifequation"],
		"body": [
			"\\ifmmode% If in math mode",
			"\t$TM_SELECTED_TEXT${1:math mode code}",
			"\\else% If in text mode",
			"\t${2:text mode code}",
			"\\fi% End of if in math mode"
		]	
	},
	"If class loaded": {
		"prefix": ["\\@ifclassloaded", "\\ifclassloaded"],
		"body": [
			"\\@ifclassloaded{${1:document class}}{% If using $1 class...", 
			"\t$TM_SELECTED_TEXT$0", 
			"}{}%",
			""
		]
	},
	"If package loaded": {
		"prefix": ["\\@ifpackageloaded", "\\ifpackageloaded"],
		"body": [
			"\\@ifpackageloaded{${1:package}}{% If $1 package...", 
			"\t$TM_SELECTED_TEXT$0", 
			"}{}%",
			""
		]
	},
	// ======== COLUMNS =========
	"Two Columns":{
		"prefix": ["\\columns (2)","\\twocolumns"],
		"body": [
			"\\begin{columns}",
				"\t\\begin{column}[T]{0.48\\textwidth}",
					"\t\t$TM_SELECTED_TEXT$1",
				"\t\\end{column}",
				"\t\\hfill",
				"\t\\begin{column}[T]{0.48\\textwidth}",
					"\t\t$2",
				"\t\\end{column}",
			"\\end{columns}",
			"$0"
		]
	},
	"Three Columns":{
		"prefix": ["\\columns (3)", "\\threecolumns"],
		"body": [
			"\\begin{columns}",
				"\t\\begin{column}[T]{0.31\\textwidth}",
					"\t\t$TM_SELECTED_TEXT$1",
				"\t\\end{column}",
				"\t\\hfill",
				"\t\\begin{column}[T]{0.31\\textwidth}",
					"\t\t$2",
				"\t\\end{column}",
				"\t\\hfill",
				"\t\\begin{column}[T]{0.31\\textwidth}",
					"\t\t$3",
				"\t\\end{column}",
			"\\end{columns}",
			"$0"
		]
	},
	"Four Columns":{
		"prefix": ["\\columns (4)", "\\fourcolumns"],
		"body": [
			"\\begin{columns}",
				"\t\\begin{column}[T]{0.23\\textwidth}",
					"\t\t$TM_SELECTED_TEXT$1",
				"\t\\end{column}",
				"\t\\hfill",
				"\t\\begin{column}[T]{0.23\\textwidth}",
					"\t\t$2",
				"\t\\end{column}",
				"\t\\hfill",
				"\t\\begin{column}[T]{0.23\\textwidth}",
					"\t\t$3",
				"\t\\end{column}",
				"\t\\hfill",
				"\t\\begin{column}[T]{0.23\\textwidth}",
					"\t\t$4",
				"\t\\end{column}",
			"\\end{columns}",
			"$0"
		]
	},
	"Full-width Minipage (no page breaks)":{
		"prefix": ["\\minipage", "\\nopagebreak"],
		"body": [
			"\\begin{minipage}{\\linewidth}%",
        "\t\\centering",
				"\t$TM_SELECTED_TEXT$0",
			"\\end{minipage}%"
		]
	},
```
```json
  // Insert columns
	"Two Columns (Minipages)":{
		"prefix": ["\\minipage columns (2)","\\twominipages"],
		"body": [
			"\\begin{minipage}{0.49\\linewidth}%",
        "\t\\centering",
				"\t$TM_SELECTED_TEXT$1",
			"\\end{minipage}%",
			"\\hfill",
			"\\begin{minipage}{0.49\\linewidth}%",
					"\t\\centering",
					"\t$2",
			"\\end{minipage}%",
			"$0"
		]
	},
	"Two Columns (Table)":{
		"prefix": ["\\table columns (2)","\\twocolumntable"],
		"body": [
			"\\begin{center}",
					"\t\\begin{tabular}{p{0.47\\linewidth}p{0.47\\linewidth}}",
						"\t\t$TM_SELECTED_TEXT$1 & $0",
					"\t\\end{tabular}",
			"\\end{center}"
		]
	},
	"Three Columns (Table)":{
		"prefix": ["\\table columns (3)","\\threecolumntable"],
		"body": [
			"\\begin{center}",
					"\t\\begin{tabular}{p{0.31\\linewidth}p{0.31\\linewidth}p{0.31\\linewidth}}",
						"\t\t$TM_SELECTED_TEXT$1 & $2 & $0",
					"\t\\end{tabular}",
			"\\end{center}"
		]
	},
	"Four Columns (Table)":{
		"prefix": ["\\table columns (4)","\\fourcolumntable"],
		"body": [
			"\\begin{center}",
				"\t\\begin{tabular}{p{0.23\\linewidth}p{0.23\\linewidth}p{0.23\\linewidth}p{0.23\\linewidth}}",
						"\t\t$TM_SELECTED_TEXT$1 & $2 & $3 & $0",
					"\t\\end{tabular}",
			"\\end{center}"
		]
	},
  
```json
	// ======== BEAMER ==========
	"Beamer Frame":{
		"prefix": ["\\frame", "\\begin{frame}"],
		"body": [
			"\\begin{frame}{${1:title}}",
			"\t$TM_SELECTED_TEXT$0",
			"\\end{frame}"
		]
	},
	"Beamer Frame (Top aligned)":{
		"prefix": ["\\frametop", "\\begin{frame}[t]", "frame top"],
		"body": [
			"\\begin{frame}[t]{${1:title}}",
			"\t$TM_SELECTED_TEXT$0",
			"\\end{frame}"
		]
	},
	"Structure":{
		"prefix": ["\\structure"],
		"body": [
			"\\structure{$TM_SELECTED_TEXT$1}$0"
		]
	},
	"Structure (Math)":{
		// Requires "\newcommand{\mstructure}[1]{{\color{structure} #1}}"
		"prefix": ["\\mstructure", "\\structure (math)"],
		"body": [
			"\\mstructure{$TM_SELECTED_TEXT$1}$0"
		]
	},
	"Only Exist on Slide":{
		"prefix": "\\only",
		"body": "\\only<${1:overlay specification}>{$TM_SELECTED_TEXT$0}"
	},
	"Only Exist on Slide (Block)":{
		"prefix": "\\onlyblock",
		"body": [
			"\\only<${1:overlay specification}>{%",
				"\t$TM_SELECTED_TEXT$0", 
			"}% End only block"
		]
	},
	"Only Shown on Slide":{
		"prefix": "\\onslide",
		"body": "\\onslide<${1:overlay specification}>{$TM_SELECTED_TEXT$0}"
	},
	"Only Shown on Slide (Block)":{
		"prefix": "\\onslideblock",
		"body": [
			"\\onslide<${1:overlay specification}>{%",
				"\t$TM_SELECTED_TEXT$0", 
			"}% End only block"
		]
	},
	"Pause After Itemize or <+->":{
		"prefix": ["\\pauseafter<+->", "\\pauseAfterItemize"],
		"body": [
			"\\pause[\\thebeamerpauses]",
			"$0"
		]
	}
}
```