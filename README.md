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