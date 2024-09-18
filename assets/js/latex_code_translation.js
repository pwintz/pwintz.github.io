// Hardcoded collection of regular expression patterns and their replacements
const baseReplacements = [
  { pattern: /\\\)([,.])/gm, replaceWith: '$1\\\)' }, // Move punctuation inside equations.
  { pattern: /(?<=(?:[^$]\$[^$\n]+\$[^$\n]*)*)(?:(?<start_of_equation>\$[^$\n]+)\$(?<puncuation>[.,]))/gm, replaceWith: '$<start_of_equation>$<puncuation>$$' }, // Move punctuation inside equations.
  { pattern: /\\mathbb{R}/g, replaceWith: '\\reals' }, // Reals
  { pattern: /\\mathbb{N}/g, replaceWith: '\\naturals' }, // Naturals
  { pattern: /\\left\\{\s*(.*?)\s*\\mid\s*(.*?)\s*\\right\\}/g, replaceWith: '\\setdef{$1 \\suchthat $2}' }, // setdef{ | } with left/right
  { pattern: /\\{\s*(.*?)\s*\\mid\s*(.*?)\s*\\}/g, replaceWith: '\\setdef{$1 \\suchthat $2}' }, // setdef{ | } w/o left/right
  { pattern: /\\left\\{\s*(.*?)\s*\\right\\}/g, replaceWith: '\\setdef{$1}' }, // setdef{} w/ left/right
  { pattern: /\\{\s*(.*?)\s*\\}/g, replaceWith: '\\setdef{$1}' }, // setdef{} w/o left/right
  { pattern: /\\operatorname{dom}/g, replaceWith: '\\dom' }, // Function domain
  { pattern: /\\rightarrow/g, replaceWith: '\\to' }, // rightarrow -> to, // Reals
  { pattern: /\\leadsto/g, replaceWith: "\\setvaluedto" }, // prime notation
  { pattern: /\\rightrightarrows/g, replaceWith: "\\setvaluedto" }, // prime notation
  { pattern: /\^\{-1}/g, replaceWith: "\\invs" },  
  { pattern: /\^\\top/g, replaceWith: "\\trans" },
  { pattern: /\^\{\\top}/g, replaceWith: "\\trans" },
  { pattern: /\^\{T}/g, replaceWith: "\\trans" },
  { pattern: /\^T/g, replaceWith: "\\trans" },
  { pattern: /\^\{\\prime}/g, replaceWith: "'" }, // prime notation
  { pattern: /\\bar\{(.*?)\}/g, replaceWith: '\\overline\{$1\}' }, // Bar -> Overline
  { pattern: /\\mathcal\{([A-Z])\}/g, replaceWith: '\\cal$1' }, // caligraph letters
  { pattern: /\\left\\{\\begin{array}{l}(.*)\\end{array}\\right\./gs, replaceWith: '\\begin{cases}$1\\end{cases}' }, // Cases environment
  // Remove extra space MathPix sometimes inserts before sub- and superscripts
  { pattern: /\s[_^]/g, replaceWith: '_' },  
  // Matrices
  { pattern: /\\left\[\\begin{array}{[clr]+}(.*?)\\end{array}\\right]/sg, replaceWith: '\\begin{bmatrix}$1\\end{bmatrix}'},
  // Remove extra space MathPix sometimes inserts before sub- and superscripts 
  { pattern: /(?:\\left\(\s*(.*?)\s*\\right\)|(?<!\\left)\(\s*(.*?)\s*(?<!\\right)\)|(\S+)(?<!\\right\))(?<!\)))[\ \t]*\\cdot[\ \t]+(?:\\left\(\s*(.*?)\s*\\right\)|(?<!\\left)\(\s*(.*?)\s*(?<!\\right)\)|(?!\\left\()(?!\()(\S+))/g, replaceWith: '\\ip{$1$2$3}{$4$5$6}' }
];

const additionalReplacements = [
    { pattern: /\\\((.*?)\\\)/g, replaceWith: '$$$1$$' }
];

// {% raw %} // <- needed so we can match cloze deletions which are marked by {{...}} 
const removeClozeReplacements = [
    { pattern: /{{c[0-9]{1,2}::(.*?)(?:::.*?)?}}/g, replaceWith: '$1' }
];
// {% endraw %}

// Function to apply the replacements
function applyReplacements(text, includeAdditional, isRemoveClozeReplacements) {
    baseReplacements.forEach(replacement => {
        text = text.replace(replacement.pattern, replacement.replaceWith);
    });

    if (includeAdditional) {
        additionalReplacements.forEach(replacement => {
            text = text.replace(replacement.pattern, replacement.replaceWith);
        });
    }

    if (isRemoveClozeReplacements) {
      removeClozeReplacements.forEach(replacement => {
        text = text.replace(replacement.pattern, replacement.replaceWith);
      });
    }

    return text;
}

// Function to update the output text
function updateText() {
    const inputText = document.getElementById('inputText').value;
    const includeAdditional = document.getElementById('additionalReplacements').checked;
    const removeClozeReplacements = document.getElementById('removeClozeReplacements').checked;
    const outputText = applyReplacements(inputText, includeAdditional, removeClozeReplacements);
    
    // Display the result
    document.getElementById('outputText').textContent = outputText;
}

// Event listeners for real-time updates
document.getElementById('inputText').addEventListener('input', updateText);
document.getElementById('additionalReplacements').addEventListener('change', updateText);
document.getElementById('removeClozeReplacements').addEventListener('change', updateText);

// TESTING
 // For the sake of testing, modify the string and run "updateText()".
//   document.getElementById('inputText').innerHTML = 
// `
// Definition 2.1 A set-valued \\(\\operatorname{map} F: X \\leadsto Z\\) is upper semicontinuous (usc) at \\(x \\in X\\) when for every open set \\(U \\subset Z\\) such that \\(F(x) \\subset U\\) there exists a neighborhood \\(V\\) of \\(x\\) such that \\(F(V) \\subset U\\). We say that \\(F\\) is upper semicontinuous (usc) when it is usc at every point in \\(X\\).
// \\(F: X \\leadsto Z\\) is lower semicontinuous of \\(x\\) such that \\(V \\subset F^{-1}(U)\\).
// 
// `
// updateText()
// END TESTING