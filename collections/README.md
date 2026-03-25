This folder contains directories for each Jekyll collection for this website. 

This website has several Jekyll collections:

* `_writing_tips`
* `_latex_macros`
* `_uc_uaw_ase_2022-2025_contract`
* `_uc_uaw_gsr_2022-2025_contract`
* `_publications`

# How to add a collection. 

To add a collection:

1. Create a new folder `_collection_name` in `collections/`.
2. Add the collection to the `collections` property in `_config.yml`.

If `output: true` for a given collection, then each element of the collection will be rendered on its own page. 
The  default location of these pages is configured in `_config.yml` by 
```yml
permalink: /:categories/:title/
```


To change the layout used to render each item of the collection on individual pages, modify `defaults` property in `_config.yml` by adding a new `scope`.


# Documentation for each Collection

## Collections for the Dictionary of Fine Distinctions


### Distinctions - WIP

This collection is a WIP.


### Definitions - WIP

This collection is a WIP and might be abandoned.

Types things in definitions:

- Relation.
- Space.
- Operation.
- Property.
- Element (of a space). 

## LaTeX Macros

## Pages

## Posts

## Publications

## UAW 4811 Contracts

There are two collections that contain the articles for the bargaining agreements between UAW 4811 and the University of California.

### ASE 2022-2025 Contract

### GSR 2022-2025 Contract

## Writing Tips
