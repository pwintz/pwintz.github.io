# Development
To build and locally host the website, run
```
bundle exec jekyll serve
```

# To add a publication

1. Add metadata as a markdown file in _publications named as `<first author last name>-<first title word>-<YYYY>.md` with the following contents
```
---
layout: publication
title: > 
    add title
authors: Paul K. Wintz and  Ricardo G. Sanfelice
publication: add publication
year: 2023
abstract: >
    add abstract
teaser-image: false
slides: false
bibtex: false
---
```
2. Copy the PDF and `.bib` file into the `downloads/` folder.