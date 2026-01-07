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
```bash
bundle exec jekyll serve
```

## Troubleshooting
* **Problem**: Running `bundle exec jekyll serve` produces this error: ```Bundler::PermissionError: There was an error while trying to
write to `/var/lib/gems/3.3.0/cache`. It is likely that you
need to grant write permissions for that path.```
[**Solution**](https://github.com/ruby/rubygems/issues/6272#issuecomment-1381683835): Run `bundle config path ~/.bundle` to set the bundle path to a user-owned folder.

# Publication List

A list of publications are published at [paulwintz.com/publications/](https://paulwintz.com/publications/).
Each publication is defined in a Markdown file in the [_publications](_publications) folder. 
An example is [wintz-ctg-2024.md](_publications/wintz-ctg-2024.md). 
Files associated with each publication, such as PDFs, are located in the [downloads/](downloads) folder.

# How to add a publication

1. Create a markdown file in `_publications` named as `<first author last name>-<first title word>-<YYYY>.md` with the following properties:
    ```yaml
    ---
    layout: publication
    title: > 
        add title
    authors: Paul K. Wintz and  Ricardo G. Sanfelice
    publication: [add publication venue (conference or journal name)]
    year: [add year]
    abstract: >
        [add abstract]
    teaser-image: false
    slides: false
    bibtex: false
    ---
    ```
2. Add any of the following files to the `downloads/` folder:
    * Document: `<first author last name>-<first title word>-<YYYY>.pdf`
    * Slides: `<first author last name>-<first title word>-<YYYY>_slides.pdf`. 
        * Set `slides: true` in `<first author last name>-<first title word>-<YYYY>.md`.
    * `<first author last name>-<first title word>-<YYYY>.bib`. 
        * Set `bibtex: false` in `<first author last name>-<first title word>-<YYYY>.md`.

After publication is complete:

3. Set the DOI
4. Add the bibtex file.



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


# Creating redirects
To redirect a URL to a different address, create a file in `_pages/redirects` (copy the format of the files there).

# HTML and Markdown Components

## Collapsible Block
To create a collapsible component in a web page (without CSS+JS), use a `<details>` block. 
```
<details>
  Content that is hidden by default
</details>
```
The result looks something like this:
<details>
  Content that is **collapsed** when the page loads.
</details>
Note that Markdown is not processed in block-level HTML tags. 
[To enable Markdown](https://stackoverflow.com/a/29378250/6651650), use `markdown=1`, which reenables Markdown processing (at least with our Markdown processor).

To change the header text for the collapsed block, place a `<summary>` tag inside. 
The resulting code is 
```html
<details markdown=1>
    <summary>
        Example summary.
    </summary>
    Content that is **collapsed** when the page loads.
</details>
```
Output: 
<details markdown=1>
    <summary>
        Example summary.
    </summary>
    Content that is **collapsed** when the page loads.
</details>
