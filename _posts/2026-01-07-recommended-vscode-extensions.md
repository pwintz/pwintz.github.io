---
layout: single
title: "Recommended VS Code Extensions"
excerpt: "A list of useful extensions to enhance VS Code."
toc: 0
tags: vscode
date: 2026-01-07 00:00:00 -0800
# comments:
#    host: mathstodon.xyz
#    username: pwintz
#    id: 112738148972158290

# ╭──────────────────────────────────────────────────╮
# │  ╭────────────────────────────────────────────╮  │
# │  │             List of Extensions             │  │
# │  ╰────────────────────────────────────────────╯  │
# ╰──────────────────────────────────────────────────╯
extensions:
  - name: Better Comments Next
    id: edwinhuish.better-comments-next
    sort-placement: 5 # Low numbers earlier. Duplicates OK. 
    description: |
        Allows customization of comment styling in the code editor based on the character(s) at the beginning of the comment. Useful for making comments more readable, such as highlighting to-do items. "Better Comments Next" is a fork of "Better Comments", which is no longer updated.
    settings: |
      ```jsonc
      // ╭────────────────────────────────────────────────────╮
      // │  ╭──────────────────────────────────────────────╮  │
      // │  │             Better Comments Next             │  │
      // │  ╰──────────────────────────────────────────────╯  │
      // ╰────────────────────────────────────────────────────╯
      // Configurations for `edwinhuish.better-comments-next` extension (https://marketplace.visualstudio.com/items?itemName=EdwinHuiSH.better-comments-next).
      // Disable "strict" mode so that comment tags are matched even if they don't have white space around them. 
      "better-comments.strict": false,
      "better-comments.tags": [
          {
              // !! Strong Alerts
              // It is important to put these after other items that start with "!" so that they take precedence. 
              "tag": "!!",
              "backgroundColor": "transparent",
              "bold": false,
              "color": "#F00",
              "italic": false,
              "strikethrough": false,
              "underline": false
          },
          {
              // ! Alerts 
              // It is important to put these after other items that start with "!" so that they take precedence. 
              "tag": "!",
              "backgroundColor": "transparent",
              "bold": false,
              "color": "#E60",
              "italic": false,
              "strikethrough": false,
              "underline": false
          },
          {
              // ? Questions
              "tag": "?",
              "backgroundColor": "transparent",
              "bold": false,
              "color": "#3498DB",
              "italic": false,
              "strikethrough": false,
              "underline": false
          },
          {
              // // Deleted content
              "backgroundColor": "transparent",
              "bold": false,
              "color": "#606060",
              "italic": false,
              "strikethrough": true,
              "tag": [
                  "//",
                  "%",
                  "xxx"
              ],
              "underline": false
          },
          {
              // TODO items
              "tag": ["todo", "to-do"],
              "backgroundColor": "transparent",
              "bold": false,
              "color": "#FF8C00",
              "italic": false,
              "strikethrough": false,
              "underline": false
          },
          {
              // * Bullet points
              "tag": [
                  "*",
                  "-"
              ],
              "backgroundColor": "transparent",
              "bold": false,
              "color": "#98C379",
              "italic": false,
              "strikethrough": false,
              "underline": false
          },
          {
              // - Bullet points
              //  - Sub-bullet points
              // * Bullet points
              //  * Sub-bullet points
              "tag": [
                  " *",
                  "  *",
                  " -",
                  "  -",
              ],
              "backgroundColor": "transparent",
              "bold": false,
              "color": "#78A359",
              "italic": false,
              "strikethrough": false,
              "underline": false
          },
          {
              // # Section, subsection, and subsubsection headers
              // ╭──────────────────────────╮ 
              // │                          │
              // ╰──────────────────────────╯
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
          {
              // http Links
              "tag": [
                  "http",
                  "www."
              ],
              "backgroundColor": "transparent",
              "color": "#77a",
              "italic": true,
          },
      ],
      ```
  - name: Code Spell Checker
    id: streetsidesoftware.code-spell-checker
    sort-placement: 3 # Low numbers earlier. Duplicates OK. 
    description: |
        Provides spell checking in the code editor for the names of variables, functions, etc., and code comments. Highly customizable. Handles common methods for concatenating words in code like camelCase and snake_case.
    settings: |
  - name: Dryer Lint
    id: pwintz.dryer-lint
    sort-placement: 4 # Low numbers earlier. Duplicates OK. 
    description: |
        A language- and framework-agnostic linter for VS Code, suppports user-defined lint rules that are specific to a given user and project. I use it extension extensively to check for common mistakes I make and enforce my code style. I find it extremely, but I am the extension's author, so I am biased :)
    settings: |
  - name: Error Lens
    id: usernamehw.errorlens 
    sort-placement: 2 # Low numbers earlier. Duplicates OK. 
    description: |
        Improves how diagnostics (errors, warnings, information, and hints) are displayed in the code editor. Supports displaying the diagnostic text in-line, so you do not need to open the Problems pane or hover over the problem to identify the problem. Also allow you to customize the display style for each type of diagnostic. 
    settings: |
      The settings for Error Lens is largely a matter of taste, but the color and alignment are important for making the messages readable in the editor. 
      Here are my settings to serve as a baseline for your own.
      ```jsonc
      // ╭────────────────────────────────────────╮
      // │ ╭────────────────────────────────────╮ │
      // │ │             Error Lens             │ │
      // │ ╰────────────────────────────────────╯ │
      // ╰────────────────────────────────────────╯
      // ⋘──────── Configure in-line diagnostic text ────────⋙
      // Choose the format of in-line diagnostic text.
      "errorLens.messageTemplate": "$message ($source)",
      "errorLens.alignMessage": {
          // Keep at least 4 characters separation between the code and the diagnostic message.
          "minimumMargin": 4, // characters
          //  Display diagnostic text right-aligned with the 100th character column, unless there is not enough space. 
          "end": 100,
      },
      // Delay updates to the diagnostic text to avoid flickering.
      "errorLens.delay": 200,
      // ⋘──────── Problems Decorations ────────⋙
      // Use decorations to change the display style of diagnostics.
      "errorLens.problemRangeDecorationEnabled": true,
      "errorLens.messageBackgroundMode": "line",
      "errorLens.decorations": {
          "errorMessage": {},
          "errorRange": {
              // Red, mid transparency.
              "backgroundColor": "#ff000070",
              // White
              "color": "#ffffff", // Text color
          },
          "warningMessage": {},
          "warningRange": {
              // Yellow-orange, high transparency.
              "backgroundColor": "#66660050",
          },
          "infoMessage": {},
          "infoRange": {
              // Blue, high transparency.
              "backgroundColor": "#0585",
          },
          "hintMessage": {
              // Torquoise
              "color": "#387", // Text color
          },
          "hintRange": {
              // Dark green, high transparency.
              "backgroundColor": "#0735",
          },
      },
      "errorLens.enabledDiagnosticLevels": [
          "error",
          "warning",
          "info",
          "hint"
      ],
      // ⋘──────── Gutter Icons ────────⋙
      "errorLens.gutterIconsEnabled": true,
      "errorLens.gutterIconSet": "squareRounded",
      // ⋘──────── ErrorLens Status Bar Info  ────────⋙
      // Display the number of errors and warnings in the status bar at the bottom of the VS Code window. 
      "errorLens.statusBarIconsEnabled": true,
      "errorLens.statusBarColorsEnabled": true,
      // Adjust the placement of the icons in the status bar.
      "errorLens.statusBarIconsPriority": -10,
      // Only display problems in the current file.
      "errorLens.statusBarIconsTargetProblems": "activeEditor",
      ```
  - name: LTeX+
    id: ltex-plus.vscode-ltex-plus
    sort-placement: 3 # Low numbers earlier. Duplicates OK. 
    description: |
        A syntax-aware grammar and spelling checker that is able to check markdown, LaTeX, and HTML documents, as well as comments in programming languages. Heavily customizable.
    settings: |
      My settings for LTeX+ are described in [LaTeX in VS Code](/latex-in-vscode/#ltex-spell-checking-and-grammar-checking-for-latex).
  
  # - name: LaTeX Workshop
  #   id: James-Yu.latex-workshop
  #  sort-placement: 10 # Low numbers earlier. Duplicates OK. 
  #   description:
  #   settings: |
  - name: Paste Image
    id: mushan.vscode-paste-image
    sort-placement: 6 # Low numbers earlier. Duplicates OK. 
    description: |
        Simplifies the process of adding images from your clipboard (such as screenshots) to documents, such as LaTeX or Markdown. When activated, the current clipboard contents (if an image) are saved to a file and code is inserted into the current document to display the image. The extension is rough around the edges, in places, but gets the job done better than any alternatives I've found.
    settings: |
      My settings for Paste Image (for LaTeX) are described in [LaTeX in VS Code](/latex-in-vscode/#paste-image-image-pasting-into-latex-code).
    
  - name: paste-indent
    id: lesgrieve.paste-indent
    sort-placement: 8 # Low numbers earlier. Duplicates OK. 
    description: |
        Adjusts the way that pasted text is indented. The default behavior of VS Code often results in the first line of pasted text having a different indentation. This extension fixes that problem.
    settings: |
      None.
  - name: TabOut
    id: albert.TabOut
    sort-placement: 5 # Low numbers earlier. Duplicates OK. 
    description: |
        Changes the behavior when TAB is typed in an editor to move outside of the next closing bracket instead of inserting whitespace. 
    settings: |
        <pre>
        "tabout.charactersToTabOutFrom": [
            {"open": "[",   "close": "]"},
            {"open": "{",   "close": "}"},
            {"open": "(",   "close": ")"},
            {"open": "$",   "close": "$"},// Latex inline equations
            {"open": "\\]", "close": "\\["},// Latex display equations.
            {"open": "'",   "close": "'"},
            {"open": "\"",  "close": "\""},
            {"open": "<",   "close": ">"},
            {"open": "`",   "close": "`"},
        ],
        </pre>
  - name: Tomorrow and Tomorrow Night Theme Kit
    id: ms-vscode.Theme-TomorrowKit
    sort-placement: 10 # Low numbers earlier. Duplicates OK. 
    description: |
        Provides my preferred editor theme "Tomorrow Night Bright", which has good contrast while remaining aesthetically pleasing. 
    settings: |
      To set the color theme, open the command pallet (`CTRL+SHIFT+P`) and select `Preferences: Color Theme`.
      After the color is changed, you will the follow line in your `settings.json` file:
      ```jsonc
      "workbench.colorTheme": "Tomorrow Night Bright",
      ```

---

VS Code is powerful and well-designed IDE out-of-the-box, but where it really shines is its extreme customizability via extensions. The list bellow contains my favorite extensions, including a short description and relevant information about how I have configured the extension to inform whatever customizations suit your needs.
If you are using VS Code for writing documents in LaTeX, then see [LaTeX in VS Code](/latex-in-vscode) for LaTeX-specific tips and extensions. 

**Disclaimer:** Installing software from the internet is inherently risky. A malicious extension could destroy your data, steal your private information, and generally wreak havoc on your computer and any aspect of your life that you access through your computer. That being said, Microsoft has [safeguards](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security#_marketplace-protections) in place.
I use each extension recommended on this page and have never observed anything to indicate that any of them are malicious.
This may inform your decision of whether to trust these extensions, but ultimately, you are responsible for evaluating their trustworthiness before you install them.
Microsoft describes [these steps](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security#_determine-extension-reliability) for determining extension reliability.


## Extension List
{% assign extensions_list = page.extensions | sort: "sort-placement" %}

{% for extension in extensions_list %}
### {{ extension.name }} (<a href="https://marketplace.visualstudio.com/items?itemName={{ extension.id }}">{{ extension.id }}</a>)
  <!-- TODO: Modify the CSS so that a link in a code block is displayed like a link, and then wrap the links in a code block. -->
  <!-- **Extension ID:** <a href="https://marketplace.visualstudio.com/items?itemName={{ extension.id }}">{{ extension.id }}</a> -->

  {{ extension.description }}


  {% if extension.settings and extension.settings != "" %}
  <details markdown=1>
  <!-- ! Do not increase the indentation of the summary, the contents of the details tag, otherwise it is rendered as a code block. -->
  <summary>
    Configuration Details
  </summary>
  {{ extension.settings }}
  </details>
  {% endif %}

{% endfor %}