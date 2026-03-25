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

## Choosing a Symbol

### Based on the Starting Sound

When picking a symbol, it is helpful to choose it such that there is a connection between the symbol and its meaning. The most basic approach is to use the Latin character that starts a word related to the symbol’s meaning, such as $g$ or $G$ for gravity. After exhausting the Latin alphabet, the Greek alphabet can be used. The name of each Greek letter generally starts with the sound it makes. For instance, gamma ($\gamma$ and $\Gamma$) makes a “g” sound, so it would be a reasonable choice for a gravity symbol if $g$ and $G$ are already used elsewhere. In the following table, the second column lists possible choices of symbols to represent a object that has a name or description that starts with the sound or letter given in the first column.

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
  <td>'z' 
  </td>
  <td>$z, Z, \zeta$ (<code>\zeta</code>)
  </td>
</tr>
</table>

## Selecting Math Fonts of Symbols


<!-- In addition to the default capital Latin characters ($A$, $B$, $C$), etc., LaTeX provides script (`\mathscr`) characters $\mathscr{A}$, $\mathscr{B}$, $\mathscr{C}$; calligraphy (`\mathcal`) characters ($\mathcal{A}$, $\mathcal{B}$, $\mathcal{C}$); and Fraktur (`\mathfrak`) characters $\mathfrak{A}$, $\mathfrak{B}$, $\mathfrak{C}$.  -->
<!-- However, many of the Fraktur characters are easily confused with each other so care should be used to avoid mixing, say $\mathfrak{I}$ and $\mathfrak{J}$ in the same document.  -->

<!-- ![Fraktur Characters](/assets/images/fraktur_alphabet.png) -->

One aspect of picking a mathematical symbol is selecting the font. 
This section contains some of the most common math fonts, including a table showing each letter in each font. 


LaTeX has six built-in fonts, 

* `\mathbf`: Bold
* `\mathrm`: Roman (upright)
* `\mathcal`: Calligraphy (upper case only)
* `\mathsf`: Sans serif
* `\mathtt`: Teletype (typewriter)
* `\mathit`: Italic

The [`amsfonts`](https://ctan.org/pkg/amsfonts) package provides 

* `\mathbb`: Blackboard bold (Uppercase only)
* `\mathfrak`: Fraktur

The [`mathrsfs`](https://ctan.org/pkg/mathrsfs) package provides 

* `\mathscr`: Cursive script (upper case only)

Care should be chosen to not use the same letter in two similar fonts for different symbols.
Some letters are different enough between the fonts, however, that readers might be expected to recognize them as distinct symbols. 
For example, one can safely use $L, \mathcal{L}$, and $\mathfrak{L}$ in the same document without much risk of confusion (although, if you are writing these characters by hand, that is a different story!).

<!-- |         |          |          |
|:-----------:|:|:-----------:|:|:-----------:|
|         |         |         | -->

### Table of Latin Letters in Common Math Fonts

| Default | $a$ | $b$ | $c$ | $d$ | $e$ | $f$ | $g$ | $h$ | $i$ | $j$ | $k$ | $l$ | $m$ | $n$ | $o$ | $p$ | $q$ | $r$ | $s$ | $t$ | $u$ | $v$ | $w$ | $x$ | $y$ | $z$ | 
|       | $A$ | $B$ | $C$ | $D$ | $E$ | $F$ | $G$ | $H$ | $I$ | $J$ | $K$ | $L$ | $M$ | $N$ | $O$ | $P$ | $Q$ | $R$ | $S$ | $T$ | $U$ | $V$ | $W$ | $X$ | $Y$ | $Z$ |
|`\mathit`  | $\mathit{a}$ | $\mathit{b}$ | $\mathit{c}$ | $\mathit{d}$ | $\mathit{e}$ | $\mathit{f}$ | $\mathit{g}$ | $\mathit{h}$ | $\mathit{i}$ | $\mathit{j}$ | $\mathit{k}$ | $\mathit{l}$ | $\mathit{m}$ | $\mathit{n}$ | $\mathit{o}$ | $\mathit{p}$ | $\mathit{q}$ | $\mathit{r}$ | $\mathit{s}$ | $\mathit{t}$ | $\mathit{u}$ | $\mathit{v}$ | $\mathit{w}$ | $\mathit{x}$ | $\mathit{y}$ | $\mathit{z}$|
|           | $\mathit{A}$ | $\mathit{B}$ | $\mathit{C}$ | $\mathit{D}$ | $\mathit{E}$ | $\mathit{F}$ | $\mathit{G}$ | $\mathit{H}$ | $\mathit{I}$ | $\mathit{J}$ | $\mathit{K}$ | $\mathit{L}$ | $\mathit{M}$ | $\mathit{N}$ | $\mathit{O}$ | $\mathit{P}$ | $\mathit{Q}$ | $\mathit{R}$ | $\mathit{S}$ | $\mathit{T}$ | $\mathit{U}$ | $\mathit{V}$ | $\mathit{W}$ | $\mathit{X}$ | $\mathit{Y}$ | $\mathit{Z}$|
|`\mathrm`  | $\mathrm{a}$ | $\mathrm{b}$ | $\mathrm{c}$ | $\mathrm{d}$ | $\mathrm{e}$ | $\mathrm{f}$ | $\mathrm{g}$ | $\mathrm{h}$ | $\mathrm{i}$ | $\mathrm{j}$ | $\mathrm{k}$ | $\mathrm{l}$ | $\mathrm{m}$ | $\mathrm{n}$ | $\mathrm{o}$ | $\mathrm{p}$ | $\mathrm{q}$ | $\mathrm{r}$ | $\mathrm{s}$ | $\mathrm{t}$ | $\mathrm{u}$ | $\mathrm{v}$ | $\mathrm{w}$ | $\mathrm{x}$ | $\mathrm{y}$ | $\mathrm{z}$|
|           | $\mathrm{A}$ | $\mathrm{B}$ | $\mathrm{C}$ | $\mathrm{D}$ | $\mathrm{E}$ | $\mathrm{F}$ | $\mathrm{G}$ | $\mathrm{H}$ | $\mathrm{I}$ | $\mathrm{J}$ | $\mathrm{K}$ | $\mathrm{L}$ | $\mathrm{M}$ | $\mathrm{N}$ | $\mathrm{O}$ | $\mathrm{P}$ | $\mathrm{Q}$ | $\mathrm{R}$ | $\mathrm{S}$ | $\mathrm{T}$ | $\mathrm{U}$ | $\mathrm{V}$ | $\mathrm{W}$ | $\mathrm{X}$ | $\mathrm{Y}$ | $\mathrm{Z}$|
|`\mathbf`  | $\mathbf{a}$ | $\mathbf{b}$ | $\mathbf{c}$ | $\mathbf{d}$ | $\mathbf{e}$ | $\mathbf{f}$ | $\mathbf{g}$ | $\mathbf{h}$ | $\mathbf{i}$ | $\mathbf{j}$ | $\mathbf{k}$ | $\mathbf{l}$ | $\mathbf{m}$ | $\mathbf{n}$ | $\mathbf{o}$ | $\mathbf{p}$ | $\mathbf{q}$ | $\mathbf{r}$ | $\mathbf{s}$ | $\mathbf{t}$ | $\mathbf{u}$ | $\mathbf{v}$ | $\mathbf{w}$ | $\mathbf{x}$ | $\mathbf{y}$ | $\mathbf{z}$|
|           | $\mathbf{A}$ | $\mathbf{B}$ | $\mathbf{C}$ | $\mathbf{D}$ | $\mathbf{E}$ | $\mathbf{F}$ | $\mathbf{G}$ | $\mathbf{H}$ | $\mathbf{I}$ | $\mathbf{J}$ | $\mathbf{K}$ | $\mathbf{L}$ | $\mathbf{M}$ | $\mathbf{N}$ | $\mathbf{O}$ | $\mathbf{P}$ | $\mathbf{Q}$ | $\mathbf{R}$ | $\mathbf{S}$ | $\mathbf{T}$ | $\mathbf{U}$ | $\mathbf{V}$ | $\mathbf{W}$ | $\mathbf{X}$ | $\mathbf{Y}$ | $\mathbf{Z}$|
|`\mathsf`  | $\mathsf{a}$ | $\mathsf{b}$ | $\mathsf{c}$ | $\mathsf{d}$ | $\mathsf{e}$ | $\mathsf{f}$ | $\mathsf{g}$ | $\mathsf{h}$ | $\mathsf{i}$ | $\mathsf{j}$ | $\mathsf{k}$ | $\mathsf{l}$ | $\mathsf{m}$ | $\mathsf{n}$ | $\mathsf{o}$ | $\mathsf{p}$ | $\mathsf{q}$ | $\mathsf{r}$ | $\mathsf{s}$ | $\mathsf{t}$ | $\mathsf{u}$ | $\mathsf{v}$ | $\mathsf{w}$ | $\mathsf{x}$ | $\mathsf{y}$ | $\mathsf{z}$|
|           | $\mathsf{A}$ | $\mathsf{B}$ | $\mathsf{C}$ | $\mathsf{D}$ | $\mathsf{E}$ | $\mathsf{F}$ | $\mathsf{G}$ | $\mathsf{H}$ | $\mathsf{I}$ | $\mathsf{J}$ | $\mathsf{K}$ | $\mathsf{L}$ | $\mathsf{M}$ | $\mathsf{N}$ | $\mathsf{O}$ | $\mathsf{P}$ | $\mathsf{Q}$ | $\mathsf{R}$ | $\mathsf{S}$ | $\mathsf{T}$ | $\mathsf{U}$ | $\mathsf{V}$ | $\mathsf{W}$ | $\mathsf{X}$ | $\mathsf{Y}$ | $\mathsf{Z}$|
|`\mathcal` | $\mathcal{A}$ | $\mathcal{B}$ | $\mathcal{C}$ | $\mathcal{D}$ | $\mathcal{E}$ | $\mathcal{F}$ | $\mathcal{G}$ | $\mathcal{H}$ | $\mathcal{I}$ | $\mathcal{J}$ | $\mathcal{K}$ | $\mathcal{L}$ | $\mathcal{M}$ | $\mathcal{N}$ | $\mathcal{O}$ | $\mathcal{P}$ | $\mathcal{Q}$ | $\mathcal{R}$ | $\mathcal{S}$ | $\mathcal{T}$ | $\mathcal{U}$ | $\mathcal{V}$ | $\mathcal{W}$ | $\mathcal{X}$ | $\mathcal{Y}$ | $\mathcal{Z}$|
|`\mathtt`  | $\mathtt{a}$ | $\mathtt{b}$ | $\mathtt{c}$ | $\mathtt{d}$ | $\mathtt{e}$ | $\mathtt{f}$ | $\mathtt{g}$ | $\mathtt{h}$ | $\mathtt{i}$ | $\mathtt{j}$ | $\mathtt{k}$ | $\mathtt{l}$ | $\mathtt{m}$ | $\mathtt{n}$ | $\mathtt{o}$ | $\mathtt{p}$ | $\mathtt{q}$ | $\mathtt{r}$ | $\mathtt{s}$ | $\mathtt{t}$ | $\mathtt{u}$ | $\mathtt{v}$ | $\mathtt{w}$ | $\mathtt{x}$ | $\mathtt{y}$ | $\mathtt{z}$|
|           | $\mathtt{A}$ | $\mathtt{B}$ | $\mathtt{C}$ | $\mathtt{D}$ | $\mathtt{E}$ | $\mathtt{F}$ | $\mathtt{G}$ | $\mathtt{H}$ | $\mathtt{I}$ | $\mathtt{J}$ | $\mathtt{K}$ | $\mathtt{L}$ | $\mathtt{M}$ | $\mathtt{N}$ | $\mathtt{O}$ | $\mathtt{P}$ | $\mathtt{Q}$ | $\mathtt{R}$ | $\mathtt{S}$ | $\mathtt{T}$ | $\mathtt{U}$ | $\mathtt{V}$ | $\mathtt{W}$ | $\mathtt{X}$ | $\mathtt{Y}$ | $\mathtt{Z}$|
|`\mathbb`  | $\mathbb{A}$ | $\mathbb{B}$ | $\mathbb{C}$ | $\mathbb{D}$ | $\mathbb{E}$ | $\mathbb{F}$ | $\mathbb{G}$ | $\mathbb{H}$ | $\mathbb{I}$ | $\mathbb{J}$ | $\mathbb{K}$ | $\mathbb{L}$ | $\mathbb{M}$ | $\mathbb{N}$ | $\mathbb{O}$ | $\mathbb{P}$ | $\mathbb{Q}$ | $\mathbb{R}$ | $\mathbb{S}$ | $\mathbb{T}$ | $\mathbb{U}$ | $\mathbb{V}$ | $\mathbb{W}$ | $\mathbb{X}$ | $\mathbb{Y}$ | $\mathbb{Z}$|
|`\mathscr` | $\mathscr{A}$ | $\mathscr{B}$ | $\mathscr{C}$ | $\mathscr{D}$ | $\mathscr{E}$ | $\mathscr{F}$ | $\mathscr{G}$ | $\mathscr{H}$ | $\mathscr{I}$ | $\mathscr{J}$ | $\mathscr{K}$ | $\mathscr{L}$ | $\mathscr{M}$ | $\mathscr{N}$ | $\mathscr{O}$ | $\mathscr{P}$ | $\mathscr{Q}$ | $\mathscr{R}$ | $\mathscr{S}$ | $\mathscr{T}$ | $\mathscr{U}$ | $\mathscr{V}$ | $\mathscr{W}$ | $\mathscr{X}$ | $\mathscr{Y}$ | $\mathscr{Z}$|
|`\mathfrak`| $\mathfrak{a}$ | $\mathfrak{b}$ | $\mathfrak{c}$ | $\mathfrak{d}$ | $\mathfrak{e}$ | $\mathfrak{f}$ | $\mathfrak{g}$ | $\mathfrak{h}$ | $\mathfrak{i}$ | $\mathfrak{j}$ | $\mathfrak{k}$ | $\mathfrak{l}$ | $\mathfrak{m}$ | $\mathfrak{n}$ | $\mathfrak{o}$ | $\mathfrak{p}$ | $\mathfrak{q}$ | $\mathfrak{r}$ | $\mathfrak{s}$ | $\mathfrak{t}$ | $\mathfrak{u}$ | $\mathfrak{v}$ | $\mathfrak{w}$ | $\mathfrak{x}$ | $\mathfrak{y}$ | $\mathfrak{z}$|
|           | $\mathfrak{A}$ | $\mathfrak{B}$ | $\mathfrak{C}$ | $\mathfrak{D}$ | $\mathfrak{E}$ | $\mathfrak{F}$ | $\mathfrak{G}$ | $\mathfrak{H}$ | $\mathfrak{I}$ | $\mathfrak{J}$ | $\mathfrak{K}$ | $\mathfrak{L}$ | $\mathfrak{M}$ | $\mathfrak{N}$ | $\mathfrak{O}$ | $\mathfrak{P}$ | $\mathfrak{Q}$ | $\mathfrak{R}$ | $\mathfrak{S}$ | $\mathfrak{T}$ | $\mathfrak{U}$ | $\mathfrak{V}$ | $\mathfrak{W}$ | $\mathfrak{X}$ | $\mathfrak{Y}$ | $\mathfrak{Z}$|

<!-- You may notice that lower case `\mathcal` letters are not included in the table.
This is because calligraphy letters are not included with LaTeX (although there are packages that provide them). -->


### Table of Numerals in Common Math Fonts

| Default | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ | $7$ | $8$ | $9$ |
|`\mathit`  | $\mathit{1}$ | $\mathit{2}$ | $\mathit{3}$ | $\mathit{4}$ | $\mathit{5}$ | $\mathit{6}$ | $\mathit{7}$ | $\mathit{8}$ | $\mathit{9}$ |
|`\mathrm`  | $\mathrm{1}$ | $\mathrm{2}$ | $\mathrm{3}$ | $\mathrm{4}$ | $\mathrm{5}$ | $\mathrm{6}$ | $\mathrm{7}$ | $\mathrm{8}$ | $\mathrm{9}$ |
|`\mathbf`  | $\mathbf{1}$ | $\mathbf{2}$ | $\mathbf{3}$ | $\mathbf{4}$ | $\mathbf{5}$ | $\mathbf{6}$ | $\mathbf{7}$ | $\mathbf{8}$ | $\mathbf{9}$ |
|`\mathsf`  | $\mathsf{1}$ | $\mathsf{2}$ | $\mathsf{3}$ | $\mathsf{4}$ | $\mathsf{5}$ | $\mathsf{6}$ | $\mathsf{7}$ | $\mathsf{8}$ | $\mathsf{9}$ |
|`\mathtt`  | $\mathtt{1}$ | $\mathtt{2}$ | $\mathtt{3}$ | $\mathtt{4}$ | $\mathtt{5}$ | $\mathtt{6}$ | $\mathtt{7}$ | $\mathtt{8}$ | $\mathtt{9}$ |
|`\mathfrak`| $\mathfrak{1}$ | $\mathfrak{2}$ | $\mathfrak{3}$ | $\mathfrak{4}$ | $\mathfrak{5}$ | $\mathfrak{6}$ | $\mathfrak{7}$ | $\mathfrak{8}$ | $\mathfrak{9}$ |

<!-- ### Lowercase Latin
$a$, $b$, $c$, $d$, $e$, $f$, $g$, $h$, $i$, $j$, $k$, $l$, $m$, $n$, $o$, $p$, $q$, $r$, $s$, $t$, $u$, $v$, $w$, $x$, $y$, $z$


### Uppercase Latin
$A$, $B$, $C$, $D$, $E$, $F$, $G$, $H$, $I$, $J$, $K$, $L$, $M$, $N$, $O$, $P$, $Q$, $R$, $S$, $T$, $U$, $V$, $W$, $X$, $Y$, $Z$ -->

<!-- ### Uppercase Calligraphy Latin
$\mathcal{A}$, 
$\mathcal{B}$, 
$\mathcal{C}$, 
$\mathcal{D}$, 
$\mathcal{E}$, 
$\mathcal{F}$, 
$\mathcal{G}$, 
$\mathcal{H}$, 
$\mathcal{I}$, 
$\mathcal{J}$, 
$\mathcal{K}$, 
$\mathcal{L}$, 
$\mathcal{M}$, 
$\mathcal{N}$, 
$\mathcal{O}$, 
$\mathcal{P}$, 
$\mathcal{Q}$, 
$\mathcal{R}$, 
$\mathcal{S}$, 
$\mathcal{T}$, 
$\mathcal{U}$, 
$\mathcal{V}$, 
$\mathcal{W}$, 
$\mathcal{X}$, 
$\mathcal{Y}$, 
$\mathcal{Z}$ -->


<!-- ### Uppercase Script Latin
$\mathscr{A}$, 
$\mathscr{B}$, 
$\mathscr{C}$, 
$\mathscr{D}$, 
$\mathscr{E}$, 
$\mathscr{F}$, 
$\mathscr{G}$, 
$\mathscr{H}$, 
$\mathscr{I}$, 
$\mathscr{J}$, 
$\mathscr{K}$, 
$\mathscr{L}$, 
$\mathscr{M}$, 
$\mathscr{N}$, 
$\mathscr{O}$, 
$\mathscr{P}$, 
$\mathscr{Q}$, 
$\mathscr{R}$, 
$\mathscr{S}$, 
$\mathscr{T}$, 
$\mathscr{U}$, 
$\mathscr{V}$, 
$\mathscr{W}$, 
$\mathscr{X}$, 
$\mathscr{Y}$, 
$\mathscr{Z}$ -->


### Fraktur Characters
The [Fraktur](https://en.wikipedia.org/wiki/Fraktur) font (pronounced "frack-TWO-ah", from the Latin word for "to break") provides distinctive variants of letters. 
Fraktur characters are inserted in math mode via `\mathfrak{}`.
Use Fraktur characters sparingly because many letters like other letters (e.g., $\mathfrak{O}$ is an "O" but looks like a "D") and are hard to draw by hand.
In my assessment, the following characters are usable: 

| A | B | C | D | F | G | H | J | K | L | M | N | R | U | X | 
| $\mathfrak{A}$ | $\mathfrak{B}$ | $\mathfrak{C}$ | $\mathfrak{D}$ | $\mathfrak{F}$ | $\mathfrak{G}$ | $\mathfrak{H}$ | $\mathfrak{J}$ | $\mathfrak{K}$ | $\mathfrak{L}$ | $\mathfrak{M}$ | $\mathfrak{N}$ | $\mathfrak{R}$ | $\mathfrak{U}$ | $\mathfrak{X}$ |

The remaining letters should be avoided.

<!-- Full list: 
$\mathfrak{A}$ ("A"), 
$\mathfrak{B}$ ("B"), 
$\mathfrak{C}$ ("C"), 
$\mathfrak{D}$ ("D"), 
$\mathfrak{E}$ ("E"), 
$\mathfrak{F}$ ("F"), 
$\mathfrak{G}$ ("G"), 
$\mathfrak{H}$ ("H"), 
$\mathfrak{I}$ ("I"), 
$\mathfrak{J}$ ("J"), 
$\mathfrak{K}$ ("K"), 
$\mathfrak{L}$ ("L"), 
$\mathfrak{M}$ ("M"), 
$\mathfrak{N}$ ("N"), 
$\mathfrak{O}$ ("O"), 
$\mathfrak{P}$ ("P"), 
$\mathfrak{Q}$ ("Q"), 
$\mathfrak{R}$ ("R"), 
$\mathfrak{S}$ ("S"), 
$\mathfrak{T}$ ("T"), 
$\mathfrak{U}$ ("U"), 
$\mathfrak{V}$ ("V"), 
$\mathfrak{W}$ ("W"), 
$\mathfrak{X}$ ("X"), 
$\mathfrak{Y}$ ("Y"), 

$\mathfrak{0}$
$\mathfrak{1}$
$\mathfrak{2}$
$\mathfrak{3}$
$\mathfrak{4}$
$\mathfrak{5}$
$\mathfrak{6}$
$\mathfrak{7}$
$\mathfrak{8}$
$\mathfrak{9}$ -->

<!-- 
Lowercase?
Full list: 
$\mathfrak{a}$ ("a"), 
$\mathfrak{b}$ ("b"), 
$\mathfrak{c}$ ("c"), 
$\mathfrak{d}$ ("d"), 
$\mathfrak{e}$ ("e"), 
$\mathfrak{f}$ ("f"), 
$\mathfrak{g}$ ("g"), 
$\mathfrak{h}$ ("h"), 
$\mathfrak{i}$ ("i"), 
$\mathfrak{j}$ ("j"), 
$\mathfrak{k}$ ("k"), 
$\mathfrak{l}$ ("l"), 
$\mathfrak{m}$ ("m"), 
$\mathfrak{n}$ ("n"), 
$\mathfrak{o}$ ("o"), 
$\mathfrak{p}$ ("p"), 
$\mathfrak{q}$ ("q"), 
$\mathfrak{r}$ ("r"), 
$\mathfrak{s}$ ("s"), 
$\mathfrak{t}$ ("t"), 
$\mathfrak{u}$ ("u"), 
$\mathfrak{v}$ ("v"), 
$\mathfrak{w}$ ("w"), 
$\mathfrak{x}$ ("x"), 
$\mathfrak{y}$ ("y"), 
$\mathfrak{z}$ ("z") -->

### Lowercase Greek
In addition to Latin letters, the Greek alphabet is often used in mathematical writing.


<table>
    <tr> <th>Name               </th><th>Symbol         </th><th>      LaTeX code          </th><th>Notes </th> </tr>
    <tr> <td>alpha              </td><td>$\alpha$       </td><td><code>\alpha</code>       </td><td>Hard to distinguish from a Latin $a$ in handwriting</td> </tr>
    <tr> <td>beta               </td><td>$\beta$        </td><td><code>\beta</code>        </td><td>      </td> </tr>
    <tr> <td>gamma              </td><td>$\gamma$       </td><td><code>\gamma</code>       </td><td>Hard to distinguish from a Latin $y$ in handwriting</td> </tr>
    <tr> <td>delta              </td><td>$\delta$       </td><td><code>\delta</code>       </td><td>      </td> </tr>
    <tr> <td>epsilon            </td><td>$\epsilon$     </td><td><code>\epsilon</code>     </td><td>      </td> </tr>
    <tr> <td>epsilon (variant)  </td><td>$\varepsilon$  </td><td><code>\varepsilon</code>  </td><td>      </td> </tr>
    <tr> <td>zeta               </td><td>$\zeta$        </td><td><code>\zeta</code>        </td><td>      </td> </tr>
    <tr> <td>eta                </td><td>$\eta$         </td><td><code>\eta</code>         </td><td>Sometimes hard to distinguish from $h$ (<code>h</code>) or $n$ (<code>n</code>), especially in handwriting</td> </tr>
    <tr> <td>theta              </td><td>$\theta$       </td><td><code>\theta</code>       </td><td>      </td> </tr>
    <tr> <td>theta (variant)    </td><td>$\vartheta$    </td><td><code>\vartheta</code>    </td><td>      </td> </tr>
    <tr> <td>iota               </td><td>$\iota$        </td><td><code>\iota</code>        </td><td>Rare due to similarity to the Latin $i$ </td> </tr>
    <tr> <td>kappa              </td><td>$\kappa$       </td><td><code>\kappa</code>       </td><td>Hard to distinguish from $k$ (<code>k</code>), especially in handwriting</td> </tr>
    <tr> <td>lambda             </td><td>$\lambda$      </td><td><code>\lambda</code>      </td><td>     </td> </tr>
    <tr> <td>mu                 </td><td>$\mu$          </td><td><code>\mu</code>          </td><td>Sometimes hard to distinguish from $u$ (<code>u</code>) or from $m$ (<code>m</code>) in handwriting</td> </tr>
    <tr> <td>nu                 </td><td>$\nu$          </td><td><code>\nu</code>          </td><td>Hard to distinguish from $v$ (<code>v</code>), especially in handwriting</td> </tr>
    <tr> <td>xi                 </td><td>$\xi$          </td><td><code>\xi</code>          </td><td>      </td> </tr>
    <tr> <td>omicron            </td><td>$o$            </td><td><code>o</code>            </td><td>Identical to Latin "o". There is no <code>\omicron</code> LaTeX macro LaTeX.</td> </tr>
    <tr> <td>pi                 </td><td>$\pi$          </td><td><code>\pi</code>          </td><td>      </td> </tr>
    <tr> <td>pi (variant)       </td><td>$\varpi$       </td><td><code>\varpi</code>       </td><td>Rare. </td> </tr>
    <tr> <td>rho                </td><td>$\rho$         </td><td><code>\rho</code>         </td><td>Sometimes hard to distinguish from $p$ (<code>p</code>) in handwriting</td> </tr>
    <tr> <td>rho (variant)      </td><td>$\varrho$      </td><td><code>\varrho</code>      </td><td>      </td> </tr>
    <tr> <td>sigma              </td><td>$\sigma$       </td><td><code>\sigma</code>       </td><td>      </td> </tr>
    <tr> <td>sigma (variant)    </td><td>$\varsigma$    </td><td><code>\varsigma</code>    </td><td>Rare. </td> </tr>
    <tr> <td>tau                </td><td>$\tau$         </td><td><code>\tau</code>         </td><td>Sometimes hard to distinguish from $T$ (<code>T</code>) in handwriting</td> </tr>
    <tr> <td>upsilon            </td><td>$\upsilon$     </td><td><code>\upsilon</code>     </td><td>Hard to distinguish from $v$ (<code>v</code>) or  $u$ (<code>u</code>), especially in handwriting</td> </tr>
    <tr> <td>phi                </td><td>$\phi$         </td><td><code>\phi</code>         </td><td>      </td> </tr>
    <tr> <td>phi (variant)      </td><td>$\varphi$      </td><td><code>\varphi</code>      </td><td>      </td> </tr>
    <tr> <td>chi                </td><td>$\chi$         </td><td><code>\chi</code>         </td><td>Hard to distinguish from $x$ (<code>x</code>), especially in handwriting</td> </tr>
    <tr> <td>psi                </td><td>$\psi$         </td><td><code>\psi</code>         </td><td>      </td> </tr>
    <tr> <td>omega              </td><td>$\omega$       </td><td><code>\omega</code>       </td><td>Hard to distinguish from $w$ (<code>w</code>), especially in handwriting</td> </tr>
</table>


### Uppercase Greek 
<!-- $\Alpha$, $\Beta$, $\Gamma$, $\Delta$, $\Epsilon$, $\Zeta$, $\Eta$, $\Theta$, $\Iota$, $\Kappa$, $\Lambda$, $\Mu$, $\Nu$, $\Xi$, $o$, $\Pi$, $\Rho$, $\Sigma$, $\Tau$, $\Upsilon$, $\Phi$, $\Chi$, $\Psi$, $\Omega$ -->

Here is a table of upper case Greek letters, omitting all letters that are identical to a Latin letter ($A,B,E$, etc.)
<table>
    <tr> <th>Name               </th><th>Symbol         </th><th>      LaTeX code          </th><th>Notes </th> </tr>
    <tr> <td>Gamma   </td><td>$\Gamma$       </td><td><code>\Gamma</code>     </td><td>      </td> </tr>
    <tr> <td>Delta   </td><td>$\Delta$       </td><td><code>\Delta</code>     </td><td>      </td> </tr>
    <tr> <td>Theta   </td><td>$\Theta$       </td><td><code>\Theta</code>     </td><td>      </td> </tr>
    <tr> <td>Lambda  </td><td>$\Lambda$      </td><td><code>\Lambda</code>    </td><td>      </td> </tr>
    <tr> <td>Xi      </td><td>$\Xi$          </td><td><code>\Xi</code>        </td><td>      </td> </tr>
    <tr> <td>Pi      </td><td>$\Pi$          </td><td><code>\Pi</code>        </td><td>LaTeX handles $\Pi$ (<code>\Pi</code>) is differently $\prod$ (<code>\prod</code>). Avoid using $\Pi$ (<code>\Pi</code>) as a symbol if you are also using $\prod$ <code>\prod</code> to represent products in your document.</td></tr>
    <tr> <td>Sigma   </td><td>$\Sigma$       </td><td><code>\Sigma</code>     </td><td>LaTeX handles $\Sigma$ (<code>\Sigma</code>) differently $\sum$ (<code>\sum</code>). Avoid using $\Sigma$ (<code>\Sigma</code>) as a symbol if you are also using $\sum$ <code>\sum</code> to represent sum in your document.</td></tr>
    <tr> <td>Phi     </td><td>$\Phi$         </td><td><code>\Phi</code>       </td><td>      </td> </tr>
    <tr> <td>Psi     </td><td>$\Psi$         </td><td><code>\Psi</code>       </td><td>      </td> </tr>
    <tr> <td>Omega   </td><td>$\Omega$       </td><td><code>\Omega</code>     </td><td>      </td> </tr>
</table>

<!-- The full list of uppercase Greek letters is shown here:
<table>
    <tr> <th>Name               </th><th>Symbol         </th><th>      LaTeX code          </th><th>Notes </th> </tr>
    <tr> <td>Alpha   </td><td>$A$            </td><td><code>A</code>          </td><td>      </td> </tr>
    <tr> <td>Beta    </td><td>$B$            </td><td><code>B</code>          </td><td>      </td> </tr>
    <tr> <td>Gamma   </td><td>$\Gamma$       </td><td><code>\Gamma</code>     </td><td>      </td> </tr>
    <tr> <td>Delta   </td><td>$\Delta$       </td><td><code>\Delta</code>     </td><td>      </td> </tr>
    <tr> <td>Epsilon </td><td>$E$            </td><td><code>E</code>          </td><td>      </td> </tr>
    <tr> <td>Zeta    </td><td>$Z$            </td><td><code>Z</code>          </td><td>      </td> </tr>
    <tr> <td>Eta     </td><td>$E$            </td><td><code>E</code>          </td><td>      </td> </tr>
    <tr> <td>Theta   </td><td>$\Theta$       </td><td><code>\Theta</code>     </td><td>      </td> </tr>
    <tr> <td>Iota    </td><td>$I$            </td><td><code>I</code>          </td><td>      </td> </tr>
    <tr> <td>Kappa   </td><td>$K$            </td><td><code>K</code>          </td><td>      </td> </tr>
    <tr> <td>Lambda  </td><td>$\Lambda$      </td><td><code>\Lambda</code>    </td><td>      </td> </tr>
    <tr> <td>Mu      </td><td>$M$            </td><td><code>M</code>          </td><td>      </td> </tr>
    <tr> <td>Nu      </td><td>$N$            </td><td><code>N</code>          </td><td>      </td> </tr>
    <tr> <td>Xi      </td><td>$\Xi$          </td><td><code>\Xi</code>        </td><td>      </td> </tr>
    <tr> <td>O       </td><td>$O$            </td><td><code>O</code>          </td><td>      </td> </tr>
    <tr> <td>Pi      </td><td>$\Pi$          </td><td><code>\Pi</code>        </td><td>      </td>LaTeX handles $\Pi$ (<code>\Pi</code>) is differently $\prod$ (<code>\prod</code>). Avoid using $\Pi$ (<code>\Pi</code>) as a symbol if you are also using $\prod$ <code>\prod</code> to represent products in your document.</tr>
    <tr> <td>Rho     </td><td>$P$            </td><td><code>P</code>          </td><td>      </td> </tr>
    <tr> <td>Sigma   </td><td>$\Sigma$       </td><td><code>\Sigma</code>     </td><td>      </td>LaTeX handles $\Sigma$ (<code>\Sigma</code>) is differently $\sum$ (<code>\sum</code>). Avoid using $\Sigma$ (<code>\Sigma</code>) as a symbol if you are also using $\sum$ <code>\sum</code> to represent sum in your document.</tr>
    <tr> <td>Tau     </td><td>$T$            </td><td><code>T</code>          </td><td>      </td> </tr>
    <tr> <td>Upsilon </td><td>$Y$            </td><td><code>Y</code>          </td><td>      </td> </tr>
    <tr> <td>Phi     </td><td>$\Phi$         </td><td><code>\Phi</code>       </td><td>      </td> </tr>
    <tr> <td>Chi     </td><td>$X$            </td><td><code>X</code>          </td><td>      </td> </tr>
    <tr> <td>Psi     </td><td>$\Psi$         </td><td><code>\Psi</code>       </td><td>      </td> </tr>
    <tr> <td>Omega   </td><td>$\Omega$       </td><td><code>\Omega</code>     </td><td>      </td> </tr>
</table> -->


<!-- LaTeX handles $\Pi$ (<code>\Pi</code>) is differently $\prod$ (<code>\prod</code>), namely with respect to the sizes and limits (e.g., ). Avoid using $\Pi$ (<code>\Pi</code>) if you are also using   -->

## Modifying Symbols
<!-- to Create a New, Related Symbol  -->

Suppose we are using the symbol $x$ and want to introduce a second symbol that is strongly related to $x.$  
The following modifications can be used to create a new symbol.

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
     


### Modifiers Over $i$ and $j$ 

When placing modifiers over $i$ and $j$, such as $\hat{i}$ or $\bar{j}$, the dots in the letters creates a crowded appearance with the modifier. 
To fix this, replace `i` and `j` with `\imath` and `\jmath`, which renders the respective letters without dots, e.g., $\imath$ and $\jmath$. 
The resulting combination with hats and bars is more pleasing: $\hat{\imath}$ (`\hat{\imath}`) and $\bar{\jmath}$ (`\bar{\jmath}`).

In this context, I prefer `\bar{\jmath}`, which is rendered as $\bar{\jmath}$, instead of `\overline{\jmath}`, which is rendered as $\overline{\jmath}$, because the line is better aligned with the top of the character.
 
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

Typically, lowercase and (less frequently) uppercase Latin letters are used to represent integers. The letters $i, j, k, m, n$ are common choices, especially for indices. Choosing one of them offers a hint to the reader that the variable is an integer when they encounter it after its introduction. In some contexts, $i$ or $j$ is reserved for the imaginary unit $\sqrt{-1}$. The letters $a, b, c, d, p, q$ are also commonly used for integers but are also used as real numbers. Avoid $l, o$ (due to potential confusion with $1$ and $0$—$\ell$ can be used instead of $l$). A capital letter is useful to convey that an integer will be “large”, e.g., defining a sequence $x_i$ in $\mathbb{R}$ to be unbounded if "for every $M > 0$, there exists $i \in \mathbb{N}$ such that $x_i > M$." 

## Variables vs. Constants

When it comes to variables and constants, I prefer to use the beginning of the alphabet for constants and the end for variables. 
In particular, I tend to use $a,$ $b,$ $c,$ $d,$ $p,$ $q,$ $r$ for constants and $t,$ $u,$ $v,$ $w,$ $x,$ $y,$ $z$ are for variables.

## Example: Picking Notation for Upper and Lower Bounds
In this section we present a case study of picking symbols for the upper and lower bounds on a real number $x$.
At first, we can simply take the first two letters of the alphabet. 

$$a \leq x \leq b $$

Using $a$ and $b$ is fine, but the connection of $a$ and $b$ with $x$ is not implied symbolically. We also have to pick two new symbols if we need to set bounds on another value, say $y$.
To show the connection between $x$ and the bounds, we might instead pick

$$x_{lb} \leq x \leq x_{ub}.$$

The use of italicized text for $lb$ and $ub$ is bad form, however. A better choice is 

$$x_{\mathrm{lb}} \leq x \leq x_{\mathrm{ub}}.$$

This choice is pretty good, but writing letter subscripts can get tedious and makes equations somewhat messy.
For this reason, I prefer to simply underline $x$ for the lower bound and overline $x$ for the upper bound.  

$$\underline{x} \leq x \leq \overline{x}.$$

This notation is (1) simple, (2) visually descriptive, and (3) does not require choosing new symbols for every upper and lower bound that is introduced. There are cases where $\overline{x}$ can cause confusing, however. Namely, if $x$ is a complex number, then $\overline{x}$ could be read as the complex conjugate.

# Finding Symbols Based on Appearance
There are far too many symbols to possibly know all of them. 
In cases when you know how symbol looks and wish to recover the LaTeX code, you can use [Detexify](https://detexify.kirelabs.org/classify.html) and the [Mathpix Snipping Tool](https://mathpix.com/).
To browse through available symbols, the [Comprehensive Latex Symbol List](https://www.ctan.org/tex-archive/info/symbols/comprehensive/) provides a massive list of symbols.

# References 
[1] Norman E. Steenrod, Paul R. Halmos, Menahem M. Schiffer, and Jean A. Dieudonné, _How to Write Mathematics_. 1973.<br>
[2] N. J. Higham, Handbook of writing for the mathematical sciences, 2nd ed. Philadelphia: Society for Industrial and Applied Mathematics, 1998.

