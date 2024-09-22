---
layout: single
title:  "Choosing Mathematical Symbols"
excerpt: A guide to choosing clear, memorable notation in mathematical writing.
date:   2023-01-09 23:48:51 -0800
toc: true
categories: mathematical-writing
tags: notation
comments:
  host: mastodon.world
  username: pwintz
  id: 109928126071148892 
---
_A guide to choosing clear, memorable notation in mathematical writing._

When choosing symbols for mathematical objects (variables, sets, etc.), the best choices are 

- descriptive
- consistent with conventions
- easily distinguished from other notation in use

Regarding the choice of symbols, Paul R. Halmos wrote [1]:
> Good notation has a kind of alphabetical harmony and avoids dissonance. Example: either $a x+b y$ or $a_1 x_1+a_2 x_2$ is preferable to $a x_1+b x_1.$ Or: if you must use $\Sigma$ for an index set, make sure you don't run into $\sum_{\sigma \in \Sigma} \sigma.$

This document contains guidelines for picking good symbols and examples to shorten the process.

## Choosing a Symbol Based on the Starting Sound

When choosing a symbol, it is helpful to choose it such that there is a connection between the symbol and its meaning. The most basic approach is to use the Latin character that starts a word related to the symbol’s meaning, such as $g$ or $G$ for gravity. After exhausting the Latin alphabet, the Greek alphabet can be used. The name of each Greek letter generally starts with the sound it makes. For instance, gamma ($\gamma$ and $\Gamma$) makes a “g” sound, so it would be a reasonable choice for a gravity symbol if $g$  and $G$  are already used elsewhere. In the following table, the second column lists possible choices of symbols to represent a object that has a name or description that starts with the sound or letter given in the first column.

<table>
<tr>
  <th> First letter/sound </th><th> Symbols </th>
</tr>
<tr markdown="block">
  <td>
‘a’ as in “ape” or “apple” 
  </td>
  <td>
$a, A, \alpha$ (<code>\alpha</code>), $\aleph$ (<code>\aleph</code>) 
  </td>
</tr>
<tr markdown="block">
  <td>
‘b’ 
  </td>
  <td>
$b, B$, $\beta$ (<code>\beta</code>) 
  </td>
</tr>
<tr markdown="block">
  <td>
‘d’ (’distance’) 
  </td>
  <td>
$d, D$, $\delta$ (<code>\delta</code>), $\Delta$ (<code>\Delta</code>). Avoid $d$ for quantities that might appear in derivatives (for a quantity $d$, the notation "$dd/dt$ is confusing). 
  </td>
</tr>
<tr markdown="block">
  <td>
‘e’ as in “eat” or “egg” 
  </td>
  <td>
$e, E$, $\eta$ (<code>\eta</code>) 
  </td>
</tr>
<tr markdown="block">
  <td>
‘f’, 'ph’ as in “first” 
  </td>
  <td>
$\phi$ (<code>\phi</code>), $\varphi$ (<code>\varphi</code>), $\Phi$ (<code>\Phi</code>), $f$, $F$ 
  </td>
</tr>
<tr markdown="block">
  <td>
‘g’ (‘good’) 
  </td>
  <td>
$g$, $G$, $\gamma$ (<code>\gamma</code>), $\Gamma$ (<code>\Gamma</code>) 
  </td>
</tr>
<tr markdown="block">
  <td>
‘j’ (’James’, ‘gee’) 
  </td>
  <td>
$j, J$, $g$, $G$ 
  </td>
</tr>
<tr markdown="block">
  <td>
‘k’ (’king’, ‘compact’) 
  </td>
  <td>
$k, K, c, C$, $\chi$ (<code>\chi</code>. Makes a hard "k" sound in Greek) 
  </td>
</tr>
<tr markdown="block">
  <td>
‘l’ (’lemma’, “Lie”) 
  </td>
  <td>
$l, L$, $\ell$ (<code>\ell</code>), $\lambda$ (<code>\lambda</code>), $\Lambda$ (<code>\Lambda</code>). The symbol $\ell$ (<code>\ell</code>) is generally preferable to $l$ (<code>l</code>), as it’s less likely to mistaken for a $1$ (<code>1</code>) and vice versa. 
  </td>
</tr>
<tr markdown="block">
  <td>
‘m’ 
  </td>
  <td>
$m$, $M$, $\mu$ (<code>\mu</code>) 
  </td>
</tr>
<tr markdown="block">
  <td>
‘n’ 
  </td>
  <td>
$n$, $N$, $\nu$ (<code>\nu</code>) 
  </td>
</tr>
<tr markdown="block">
  <td>
‘o’ 
  </td>
  <td>
$o$, $O$, $\omega$ (<code>\omega</code>), $\Omega$ (<code>\Omega</code>) 
  </td>
</tr>
<tr markdown="block">
  <td>
‘p’ 
  </td>
  <td>
$p, P$, $\pi$ (<code>\pi</code>), $\Pi$ (<code>\Pi</code>) 
  </td>
</tr>
<tr markdown="block">
  <td>
‘r’ (’radius’) 
  </td>
  <td>
$r, R$, $\rho$  (<code>\rho</code>), $\varrho$ (<code>\varrho</code>) 
  </td>
</tr>
<tr markdown="block">
  <td>
‘s’ (’see’, ‘psychic’, ‘cease’) 
  </td>
  <td>
$s, S$, $\psi$ (<code>\psi</code>), $\Psi$ (<code>\Psi</code>), $\sigma$ (<code>\sigma</code>), $\varsigma$ (<code>\varsigma</code>), $\Sigma$ (<code>\Sigma</code>), $c$, $C$, $\xi$ (<code>\xi</code>), $\Xi$ (<code>\Xi</code>) 
  </td>
</tr>
<tr markdown="block">
  <td>
‘t’ (’tensor’, ‘time’) 
  </td>
  <td>
$t, \tau$ (<code>\tau</code>), $T$ 
  </td>
</tr>
<tr markdown="block">
  <td>
‘th’ 
  </td>
  <td>
$\theta$ (<code>\theta</code>), $\Theta$ (<code>\Theta</code>), $t, T$, $\mathrm{Th}, \mathrm{th}$, $\vartheta$ (<code>\vartheta</code>) 
  </td>
</tr>
<tr markdown="block">
  <td>
‘u’ (’you’, ‘young’) 
  </td>
  <td>
$u, U$, $y$, $Y$. Lowercase upsilon "$\upsilon$" should be avoided due to the similarity to lowercase vee "$v$".
  </td>
</tr>
<tr markdown="block">
  <td>
‘v’ 
  </td>
  <td>
$v, V$ 
  </td>
</tr>
<tr markdown="block">
  <td>
‘w’ 
  </td>
  <td>
$w, W$ 
  </td>
</tr>
<tr markdown="block">
  <td>z 
  </td>
  <td>$z, Z, \zeta$ (<code>\zeta</code>)
  </td>
</tr>
</table>

## Modifying a Symbol to Create a New, Related Symbol 

Suppose we are using the symbol $x$ and want to introduce a second symbol that is strongly related to $x.$  The following modifications can be used to create a new symbol.

<table>
<tr markdown="block">
  <th>Example</th><th>Description</th>
</tr>
<tr markdown="block">
  <td> $x^1, x^{(2)}, x^a, x^*, x^\circ$ 
  </td>
  <td>Superscript. Numbers should be avoided when they could be confused with exponents. 
  </td>
</tr>
<tr markdown="block">
  <td>$x_1, x_a, ...$ 
  </td>
  <td>Subscripts. Having more than two layers of subscripts should be avoided to preserve readability. 
  </td>
</tr>
<tr markdown="block">
  <td>$x', x'', x'''$ 
  </td>
  <td>Prime notation. Commonly used for derivatives, so avoid when there may be confusion. Use at most three tick marks. 
  </td>
</tr>
<tr markdown="block">
  <td>$x_{I}, x_{II}, x_{III}, x_{IV}$ 
  </td>
  <td>Annotate with Roman Numerals. I’ve never seen this notation in a publication, but I use it within my scratch work to keep track of different iterations while I develop my work. If, say, I’m trying to find a set that satisfies some properties, I might notation them $A_I, A_{II}, ...$, until I find one that works. Then, I would simply call the final choice $A$. 
  </td>
</tr>
<tr markdown="block">
  <td>$x \mapsto \hat{x}, \tilde{x}, \overline{x}, \underline{x}$ 
  </td>
  <td>Add annotations above or below. 
  </td>
</tr>
<tr markdown="block">
  <td>$x \mapsto X$<br>
 $F \mapsto f$ 
  </td>
  <td>Change capitalization 
  </td>
</tr>
<tr markdown="block">
  <td>$x \mapsto \mathrm{x}, \mathbf{x}$<br>
 $X \mapsto \mathcal{X}, \mathbb{X}, \mathbf{X}, \mathscr{X} , \mathfrak{X}$  
  </td>
  <td>Change the font. This should be used with caution because the difference between certain fonts will not be obvious to all readers, especially in handwritten text. See note below. 
  </td>
</tr>
<tr markdown="block">
  <td>$x_{\textrm{label}}$, $x^{\textrm{label}}$ 
  </td>
  <td>Include text labels. This is a heavy-handed approach that is tedious to write, but it does not require remembering another piece of notation so it might be desirable in presentations where the audience cannot go back to review the notation. Avoid for symbols that occur often. 
  </td>
</tr>
<tr markdown="block">
  <td>$a \mapsto b, \text{or } x\mapsto y$ 
  </td>
  <td>Use letters that are adjacent in the alphabet. 
  </td>
</tr>
<tr markdown="block">
  <td>$x \mapsto p_x, A_x$ 
  </td>
  <td>Juxtaposition with another symbol. Use $x$ as a label for another symbol 
  </td>
</tr>
<tr markdown="block">
  <td>$V \mapsto \Lambda$ 
  </td>
  <td>Change the [orientation of the symbol](https://tex.stackexchange.com/questions/18157/rotating-a-letter). (This doesn’t work for symmetric symbols, such as $x$). 
  </td>
</tr>
<tr markdown="block">
  <td>$x \mapsto \Delta x, dx, \delta x$ 
  </td>
  <td>Prefix with another symbol (typically, $\Delta x$ represents a change in $x$; $\delta x$ represents a small but finite change in $x$, and $dx$ is used to represent the change in $x $ in the limit as the change goes to zero.) 
  </td>
</tr>
<tr markdown="block">
  <td>$x \mapsto [x]$, $\{x\}$, $\|x\|$ 
  </td>
  <td>Brackets. Use with caution as most brackets have existing meanings. 
  </td>
</tr>
<tr markdown="block">
  <td>$x \mapsto f(x)$ 
  </td>
  <td>Function notation.  
  </td>
</tr>
<tr markdown="block">
  <td>$1 + x^2$ 
  </td>
  <td>Sometimes, a new symbol is not actually necessary. For instance, if the new symbol depends on $x,$ you can simply write it as a function of $x$. 
  </td>
</tr>
</table>
     

### Using Different Fonts 

In addition to the default capital Latin characters ($A$, $B$, $C$), etc., LaTeX provides script (`\mathscr`) characters $\mathscr{A}$, $\mathscr{B}$, $\mathscr{C}$; calligraphy (`\mathcal`) characters ($\mathcal{A}$, $\mathcal{B}$, $\mathcal{C}$); and Fraktur (`\mathfrak`) characters $\mathfrak{A}$, $\mathfrak{B}$, $\mathfrak{C}$. Many letters are different enough in each style that readers can be expected to recognize them as distinct symbols. For example, one can safely use $L, \mathcal{L}$, and $\mathfrak{L}$ in the same document without much risk of confusion (although, if you are writing these characters by hand, that is a different story!).
However, many of the Fraktur characters are easily confused with each other so care should be used to avoid mixing, say $\mathfrak{I}$ and $\mathfrak{J}$ in the same document. 

![Fraktur Characters](/assets/images/fraktur_alphabet.png)

## Choosing Symbols Based on Type of Mathematical Object

There are conventions for notating certain types of mathematical objects. The following rules are not universally accepted, but are merely taken from my personal observations. 

<table>
<tr>
  <th>Type of Object</th>
  <th>Common Notation Classes</th>
</tr>
<tr>
  <td>Set</td>
  <td>
  Capital Latin or Greek ($A, B, C, \Lambda$);<br>
  Calligraphy ($\mathcal{A, B, C}$);<br>
  Blackboard bold ($\mathbb{R, N, Z}$)—typically reserved for well-known sets;<br>
  Script ($\mathscr{A, B, C}$)—commonly used for sets of sets;<br>
  Set-builder notation: $\{a, b, c\}$
  </td>
</tr>
<tr>
  <td>Function</td>
  <td>
    Lowercase Latin: $d, f, g, h, u, v, w, x, y, z$<br>
    Lowercase Greek: $\alpha, \beta, \gamma$<br>
    Capital Latin: $F, G, H$<br>
    Capital Greek: $\Gamma, \Theta, \Phi, \Psi, \Omega, \Xi$<br>
    Often the choice of symbol for a function matches the convention used for objects in the function’s codomain (range).
  </td>
</tr>
<tr>
  <td>Vector</td>
  <td>$x$ (<code>x</code>), $\boldsymbol{x}$ (<code>\boldsymbol{x}</code>), $\mathbf{x}$ (<code>\mathbf{x}</code>), $\vec{x}$ (<code>\vec{x}</code>), $\underline{x}$ (<code>\underline{x}</code>). In texts where students are newly acquainted to vectors, $\mathbf{x}$ or $\vec x$ is commonly used. The notation $\vec x$ has the advantage that it can easily be written by hand, but it makes equations more cluttered, especially when other annotations are added, such as $\dot{\vec{\widetilde{x}}}$. In advanced texts, $x$ is almost always used.
  </td>
</tr>
<tr>
  <td>Scalar</td>
  <td>$a, b, c, x, y, z, \alpha, \beta, \gamma$. See notes on real numbers and integers, below.
  </td>
</tr>
<tr>
  <td>Unitary Operation</td>
  <td>
    Prefix: $x\mapsto -x$, $f \mapsto \partial f$<br>
    Annotations: $f\mapsto \hat f, f\mapsto \tilde f, x\mapsto x^*$<br>
    Function notation: $x\mapsto f(x), f\mapsto \mathcal{L}\{f\}, x\mapsto \sin x$<br>
    Capitalization: $f \mapsto F$<br>
    Sub/superscripts: $x \mapsto x_{\text{new}}$ 
  </td>
</tr>
<tr>
  <td>Binary Operation</td>
  <td>infix: $a+b$, $A\cup B$, $p \wedge q;$<br>
 function: $f(x, y);$<br>

 juxtaposition: $xy, \overset{x}{y}, \underset{x}{y}, x^y;$<br>
 brackets: $(x, y), \langle x, y\rangle.$
  </td>
</tr>
<tr>
  <td>n-ary Operation</td>
  <td>
    Prefix: $\Pi_{i=1}^n x_i$<br>
    (Abbreviated) infix: $x_1 + x_2 + \cdots + x_n$<br>
    Function: $f(x_1, x_2, \dots, x_n)$<br>
    Einstein Summation Convention: $v^i\frac{\partial}{\partial x_i}$
  </td>
</tr>
<tr>
  <td>Matrix</td>
  <td>
    Capital Latin or Greek: $A, B, C, \Gamma;$<br>
    Upright Capital Latin: $\mathrm{A, B, C, M}$;<br>
    Bold Capital Latin: $\mathbf{A, B, C, M};$<br>
    Element-wise notation: $[a_{ij}]$, $[\sin(i\pi)\cos(j\pi)].$ 
  </td>
</tr>
<tr>
  <td>Sequence</td>
  <td>
    Abbreviated: $1, 1/2, 1/3, \dots;$<br>
    Sequence notation: $\{s_j\}_{j=1}^\infty;$<br>
    Juxtaposition (as a squence of heads/tails is represented in probability): $\text{HHTHT};$<br>
    Recursive: $x_{k+1} = r(1-x_k),$<br>
    Function: $i \mapsto 1/i.$ 
  </td>
</tr>
</table>

### Real Numbers

Typically, lowercase Latin or Greek letters are used to represent real numbers. Less commonly, uppercase letters are used as well.

Several symbols, namely $\pi$ and $e$, have well-established meanings, so they should be avoided when there is any risk of ambiguity. The letters $\varepsilon$ and $\delta$ are frequently used to represent small positive numbers and capital letters such as $M$ or $R$ are sometimes used for large values. 

For Latin letters, note that $e$ has a well-established usage as Euler’s constant. Be judicious in the use of $f, g, h$, which are commonly used for functions.

Avoid $i, j, k, m, n$ because they are commonly used for integers and avoid $l, o$ due to potential confusion with $1$ and $0$—the symbol $\ell$ can be used instead of $l$. 

### Integers (and Natural Numbers)

Typically, lowercase and (less frequently) uppercase Latin letters are used to represent integers. The letters $i, j, k, m, n$  are common choices, especially for indices. Choosing one of them offers a hint to the reader that the variable is an integer when they encounter it after its introduction. In some contexts, $i$ or $j$ is reserved for the imaginary unit $\sqrt{-1}$. The letters $a, b, c, d, p, q$ are also commonly used for integers but are also used as real numbers. Avoid $l, o$ (due to potential confusion with $1$  and $0$—$\ell$ can be used instead of $l$). A capital letter is useful to convey that an integer will be “large”, e.g., defining a sequence $x_i$ in $\mathbb{R}$ to be unbounded if "for every $M > 0$, there exists $i \in \mathbb{N}$ such that $x_i > M$." 

## Variables vs. Constants

When it comes to variables and constants, I prefer to use the beginning of the alphabet for constants and the end for variables. 
In particular, I tend to use $a,$ $b,$ $c,$ $d,$ $p,$ $q,$ $r$ for constants and $t,$ $u,$ $v,$ $w,$ $x,$ $y,$ $z$ are for variables.

## Example: Picking Notation for Upper and Lower Bounds
In this section we present a case study of picking symbols for the upper and lower bounds on a real number $x$.
At first, we can simply take the first two letter of the alphabet. 

$$a \leq x \leq b $$

Using $a$ and $b$ is fine, but the connection of $a$ and $b$ with $x$ is not implied symbolically. We also have to pick two new symbols if we need to set bounds on another value, say $y$.
To show the connection between $x$ and the bounds, we might instead pick

$$x_{lb} \leq x \leq x_{ub}.$$

The use of italicized text for $lb$ and $ub$ is bad form, however. A better choice is 

$$x_{\mathrm{lb}} \leq x \leq x_{\mathrm{ub}}.$$

This choice is pretty good, but writing letter subscripts can get tedious and makes equations somewhat messy. y
For this reason, I prefer to simply underline $x$ for the lower bound and overline $x$ for the upper bound.  

$$\underline{x} \leq x \leq \overline{x}.$$

This notation is (1) simple, (2) visually descriptive, and (3) does not require chosing new symbols for every upper and lower bound that is introduced. There are cases where $\overline{x}$ can cause confusing, however. Namely, if $x$ is a complex number, then $\overline{x}$ could be read as the complex conjugate.

# References 
[1] Norman E. Steenrod, Paul R. Halmos, Menahem M. Schiffer, and Jean A. Dieudonné, _How to Write Mathematics_. 1973.
[2] N. J. Higham, Handbook of writing for the mathematical sciences, 2nd ed. Philadelphia: Society for Industrial and Applied Mathematics, 1998.

