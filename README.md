# Development

## First-time Setup
Install the Ruby bundler and Ruby development headers using (on Linux):
```
sudo apt install ruby-bundler ruby-dev
```
Then install the needed "gem executables" using 

```
bundle install
```

## Deploy Website Locally
To build and locally host the website, run
```
bundle exec jekyll serve
```

## Troubleshooting
* **Problem**: Running `bundle exec jekyll serve` produces this error: ```Bundler::PermissionError: There was an error while trying to
write to `/var/lib/gems/3.3.0/cache`. It is likely that you
need to grant write permissions for that path.```
[**Solution**](https://github.com/ruby/rubygems/issues/6272#issuecomment-1381683835): Run `bundle config path ~/.bundle` to set the bundle path to a user-owned folder.

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
2. Add files to the `downloads/` folder. Pick a base name in the format `FIRSTAUTHOR-TITLEWORD-YEAR`. There can be the following files:
    * `<first author last name>-<first title word>-<YYYY>.pdf`
    * `<first author last name>-<first title word>-<YYYY>.pdf`. Set `slides: true` in `<first author last name>-<first title word>-<YYYY>.md`.
    * `<first author last name>-<first title word>-<YYYY>.bib`. Set `bibtex: false` in `<first author last name>-<first title word>-<YYYY>.md`.


# JavaScript and TypeScript scripts

## Setup
Install NVM (for updating Node), Node, and the Typescript compiler (globally) using 
```bash
# Install NVM 
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Install and use the long-term support version of NVM
nvm install --lts
nvm use --lts

# Install typescript.
npm install --global typescript
```

## Adding NPM Package Dependencies
To add a NPM dependency:

1. Modify `<project root>/package.json` to include the desired packages. 
2. Run `npm install`.

## Compiling TypeScript 

To compile all of the TypeScript files in the project, run `npm run build` from the root of the project. 
To automatically refresh upon source code changes, use `npm run watch` instead.
<!-- Options for the TypeScript compiler are stored in [`<project root>/tsconfig.json`](/tsconfig.json).
The `tsconfig` file is only used when `tsc` is invoked without an input file. -->

## Adding script to a webpage

If adding a TypeScript script, it needs to first be compiled. 
Then, it is used on a page via a tag like the following: 
```html
<script src="/assets/ts/out/activityLogger.js" type="module"></script>
```



# Bibliography and References

To do.


# Jekyll Collections

This website has several Jekyll collections:

* `_writing_tips`
* `_latex_macros`
* `_uc_uaw_ase_2022-2025_contract`
* `_uc_uaw_gsr_2022-2025_contract`
* `_publications`

To add a collection:

1. Create a new folder `_collection_name` in the project root.
2. Add the collection to the `collections` property in `_config.yml`.

If `output: true` for a given collection, then each element of the collection will be rendered on its own page. 
The  default location of these pages is configured in `_config.yml` by 
```yml
permalink: /:categories/:title/
```


To change the layout used to render each item of the collection on individual pages, modify `defaults` property in `_config.yml` by adding a new `scope`.
