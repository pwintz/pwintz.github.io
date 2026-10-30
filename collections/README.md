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

This "Dictionary of Fine Distinctions" is a work in progress. The goal is to make a series of pages that illuminate the differences between mathematical concepts where the distinction is subtle. 

In mathematics, there are many terms and concepts that are highly similar. Understanding the distinctions between definitions is essential for understanding their usage. Many good authors will highlight the distinctions between definitions as they arise in their work, but we try to present a more extensive enumeration distinctions.

The goal of this document is to highlight the differences between similar or easily misused terms. 
There are several factors that confound this effort. 
1. Some terms have several conflicting definitions
2. Different terms are used for the same concept
3. Some terms have a general, difficult to understand term and a simpler term that applies in a specific case. An example would be “continuous function” for point-set topology vs. for real numbers.
We will present a list of distinctions. Each distinction has two or more terms that are confused. When there are several terms that are all similar, then we try to pick the fewest number that are most similar. 
For each distinction, we give examples that clarify the dividing line between the concepts.

There are a _lot_ of potential distinctions we could write about, so it's worth prioritizing where to start. 
I think the following make sense to sort the topics into priority levels, based on how useful describing the distinction would be to readers. 

### High Priority

#### Easy
- [Types of dynamic set invariance](/collections/_distinctions/types_of_dynamic_set_invariance.md)
- [Types of vector_vs_vector_coordinate](/collections/_distinctions/vector_vs_vector_coordinate.md)
- [Types of dynamic stability](/collections/_distinctions/types_of_dynamic_stability.md)
- [Types of units_vs_dimension](/collections/_distinctions/units_vs_dimension.md)

#### Moderate
- [Types of continuous](/collections/_distinctions/types_of_continuous.md)
- [Types of vector_derivatives](/collections/_distinctions/types_of_vector_derivatives.md)
- [Types of vector_vs_covector](/collections/_distinctions/vector_vs_covector.md)

#### Hard
- [Types of continuous set-valued](/collections/_distinctions/types_of_continuous_set-valued.md)
- [Types of exogenous input](/collections/_distinctions/types_of_exogenous_input.md)
- [Types of tangent spaces](/collections/_distinctions/types_of_tangent_spaces.md)

### Mid-Priority
- [Types of statistical middles](/collections/_distinctions/types_of_statistical_middles.md)
- [Types of asymptotic_comparison](/collections/_distinctions/type_of_asymptotic_comparison.md)
- [Types of function_correspondence](/collections/_distinctions/type_of_function_correspondence.md)
- [Types of compactness](/collections/_distinctions/types_of_compactness.md)
- [Types of comparison functions](/collections/_distinctions/types_of_comparison_functions.md)
- [Types of differentiability](/collections/_distinctions/types_of_differentiability.md)
- [Types of extremal](/collections/_distinctions/types_of_extremal.md)
- [Types of limits](/collections/_distinctions/types_of_limits.md)
- [Norm vs. metric vs. inner product](/collections/_distinctions/norm_vs_metric_vs_inner_product.md)
- [Dot product vs. inner product vs. bilinear form](/collections/_distinctions/dot_product_vs_inner_product_vs_bilinear_form.md)
- [Types of metric_spaces](/collections/_distinctions/types_of_metric_spaces.md)
- [Types of PDEs_boundary_conditions](/collections/_distinctions/types_of_PDEs_boundary_conditions.md)
- [Types of PDEs_eigenvalue_classification](/collections/_distinctions/types_of_PDEs_eigenvalue_classification.md)
- [Types of scalar derivatives](/collections/_distinctions/types_of_scalar_derivatives.md)
- [Types of sphere_balls_and_circles](/collections/_distinctions/types_of_sphere_balls_and_circles.md)
- [Types of topological_spaces](/collections/_distinctions/types_of_topological_spaces.md)


### Low Priority
- [Types of adding](/collections/_distinctions/types_of_adding.md)
- [Types of array quantities](/collections/_distinctions/types_of_array_quantities.md)
- [Types of collections](/collections/_distinctions/types_of_collections.md)
- [Types of difference](/collections/_distinctions/types_of_difference.md)
- [Types of error](/collections/_distinctions/types_of_error.md)
- [Natural numbers](/collections/_distinctions/natural_numbers.md)
- [Cardinal vs. ordinal vs. nominal numbers](/collections/_distinctions/cardinal_vs_ordinal_vs_nominal_numbers.md)
- [Types of finite](/collections/_distinctions/types_of_finite.md)
- [Types of infinity](/collections/_distinctions/types_of_infinity.md)
- [Types of function transforms](/collections/_distinctions/types_of_function_transforms.md)
- [Types of illustrations](/collections/_distinctions/types_of_illustrations.md)
- [Types of inside](/collections/_distinctions/types_of_inside.md)
- [Types of nothing](/collections/_distinctions/types_of_nothing.md)
- [Types of everything](/collections/_distinctions/types_of_everything.md)
- [Types of size](/collections/_distinctions/types_of_size.md)
- [Types of sparsity](/collections/_distinctions/types_of_sparsity.md)
- [Types of splitting](/collections/_distinctions/types_of_splitting.md)
- [Types of unchanging](/collections/_distinctions/types_of_unchanging.md)
- [Types of symmetry](/collections/_distinctions/types_of_symmetry.md)
- [Types of reoccurring](/collections/_distinctions/types_of_reoccurring.md)
- [Types of real_numbers](/collections/_distinctions/types_of_real_numbers.md)
- [Types of maps](/collections/_distinctions/types_of_maps.md)
- [Types of mathematical_expressions](/collections/_distinctions/types_of_mathematical_expressions.md)
- [Types of sameness](/collections/_distinctions/types_of_sameness.md)
- [Types of vector_vs_point](/collections/_distinctions/vector_vs_point.md)




### Structure

The dictionary has three collections:

- `_definitions`: One file per term, e.g., `continuous.md`. Rendered at `/definitions/<name>` with `_layouts/definition.html`.
- `_distinctions`: One file per group of easily confused terms. Rendered at `/distinctions/<name>` with `_layouts/distinction.html`.
- `_examples`: One file per example, e.g., `square_on_reals.md`. Rendered at `/examples/<name>` with `_layouts/example.html`. An example can be used by several distinctions, and is listed under every definition it addresses. An example does not need to be used by any distinction.

There are three index pages, all filterable by search text, subject, and level (and, for distinctions, kind) using `assets/ts/src/dictionary_filters.ts`.
The level filter sets a maximum: it shows the items available at that level or a simpler one.

- `/distinctions/` (`collections/_pages/distinctions.html`) lists distinctions by subject. Its level filter shows a distinction only if every compared term has a definition at that level or a simpler one, and links from the filtered list open each distinction at that level (via `?level=`).
- `/definitions/` (`collections/_pages/definitions.html`) lists definitions A–Z. A definition's subjects are the subjects of the distinctions that use it. Choosing a level shows the definitions that have that level or a lower one, each at the most advanced of those levels. Hovering over (or tapping) a level badge next to a term shows the term's definition at that level.
- `/examples/` (`collections/_pages/examples.html`) lists examples by level. An example's subjects are the subjects of the distinctions that use it.

Filters are stored in the URL, so filtered lists can be linked to, e.g., `/definitions/?subject=topology&level=undergraduate`.

Stub pages have `status: stub` and `published: false`, so they are not rendered.
To publish a page, remove `published: false` and set `status: draft` or `status: complete`.
Every file in these collections needs front matter. Otherwise, Jekyll copies it to the site as a raw `.md` file.

#### Definitions

Each definition has up to four levels (listed in `_data/definition_levels.yml`): `elementary`, `high-school`, `undergraduate`, and `graduate`.
Levels are optional, and each has a `text`, an optional `context` (e.g., "metric spaces"), and an optional `caveat` explaining where a simpler definition breaks down.

**Rule:** Levels of one definition must agree wherever they both apply. A higher level may be more rigorous or more general, but must not contradict a lower level. Rival definitions (e.g., whether the natural numbers include 0) go in separate files.

**Name the term:** Each level's `text` is a complete sentence that names the term being defined, in italics. Write "An _expression_ is a combination of ...," not "A combination of ...." Use `_term_` for italics, or `*term*` when the term contains math (e.g., `*class-$\mathcal{K}$*`).

**Link other terms:** In each level's `text`, `caveat`, each property, and the notes, link the first mention of another defined term to its page, e.g., `[metric space](/definitions/metric-space)`. The URL is the file name, lowercased, with underscores replaced by hyphens. Do not link a term when it is used in an everyday sense (e.g., "a group of objects") or inside a longer term (e.g., "ball" inside "open ball").

**Definition vs. properties vs. examples:** A level's `text` contains only the definition, plus remarks that clarify how to read it (e.g., "the choice of $\delta$ may depend on $x$"). Analogies that explain the idea ("like the slope of a hill in the direction you walk") and notation (as in $\dot{x} = f(x)$) are fine, but particular instances of the term ("For example, $\sqrt{2}$ is algebraic ...", "such as a bowling ball") belong in the `_examples` collection, with the level of the definition they illustrate.
Facts about the term go in the `properties` list instead: theorems, consequences, and equivalent characterizations ("Equivalently, ...").
For example, "real symmetric matrices have real eigenvalues" is a property of symmetric matrices, not part of their definition.
The Markdown body is for notes: terminology, conflicting usages, and conventions.

On a definition's page, examples and then properties are listed in their own sections after the definition. On distinction pages, they appear in collapsed "Examples" and "Properties" lists under each definition, and examples above the selected level are hidden.

```yaml
---
title: Continuous function
term: continuous
applies_to: function
synonyms: []
levels:
  elementary:
    text: A function is continuous if you can draw its graph without lifting your pencil.
    caveat: This only works when the domain is one unbroken interval...
  undergraduate:
    context: metric spaces
    text: >
      A function $f : X \to Y$ is continuous if ...
properties:
  - >-
    Sums, products, and compositions of continuous functions are continuous.
---
Markdown body: notes on terminology and conventions.
```

#### Distinctions

```yaml
---
title: Continuous vs. uniformly continuous
kind: hierarchy        # An id from _data/distinction_kinds.yml.
areas: [analysis]      # Ids from _data/distinction_areas.yml (subjects), most relevant first. A page may have several.
status: draft          # stub | draft | complete
summary: >
  One or two sentences stating the distinction.
relation: uniformly continuous ⊂ continuous
terms:                 # File names (without .md) in _definitions.
  - continuous
  - uniformly_continuous
examples_note: >-      # (Optional) How to read the example grid, e.g., "Each cell is the ___ of the function in that row."
examples:              # File names (without .md) in _examples, rendered as a grid with one column per term.
  - example: square_on_reals
    why: The graph gets steeper without bound.   # (Optional) Why the example matters for this distinction.
see_also:              # File names (without .md) in _distinctions.
  - types_of_continuous
---
Markdown body: notes, common misuses, fine print.
```

**Titles:** When a siblings or family page compares more than two terms and the group has a good name, title it "Types of ..." (e.g., "Types of stability," "Types of boundary conditions"); otherwise, list the terms ("Array vs. matrix vs. linear map"). Hierarchy pages list their terms, since the order shows the chain of inclusions.

**Order terms from easiest to most difficult,** both in the title and in `terms` (which sets the order of the definitions and of the columns of the example grid). The most difficult term goes last: "Dot product vs. inner product vs. bilinear form," not "Bilinear form vs. inner product vs. dot product." A term's lowest level is a guide; between terms at the same level, put the more abstract or more specialized one later.

**Synonyms pages are only for exact synonyms.** Use `kind: synonyms` only when the words mean exactly the same thing, such as "function" and "map." Words for related but different concepts belong on a siblings or family page.

**Conflicting definitions get their own page.** A page with `kind: conflicting` lists only the rival meanings of one term (such as "range" or "total derivative"), each in its own definition file, plus closely related terms that help disambiguate. Do not mix conflicting meanings into a siblings, family, or hierarchy page: leave the ambiguous term out of that page's `terms` and link to the conflicting page from a note.

On a distinction page, a level switcher (`assets/ts/src/definition_levels.ts`) shows one level of each definition and hides examples above that level. Each definition's header also has buttons for the levels it has: hovering over one previews that level, and clicking it shows that definition (and its examples) at that level until the page-wide level changes. Levels at which none of the terms has a definition are disabled. If a definition has no version at the selected level, the nearest lower level is shown, or, failing that, its lowest level. The reader's choice is remembered across pages. Without JavaScript, all levels are shown.

#### Examples

```yaml
---
title: '$f(x) = x^2$ on $\reals$'   # The example itself, in Markdown (usually with math).
level: high-school                  # The lowest level at which the example is appropriate.
description: >-                     # (Optional) Context needed to understand the example on its own.
  The squaring function, as a function $f : \reals \to \reals$.
is: [continuous]                    # Terms the example is an instance of (✓).
is_not: [uniformly_continuous]      # Terms the example is not an instance of (✗).
values:                             # (Optional) For worked examples: the term's value for this example.
  image: '$[0, \infty)$'
why:                                # (Optional) Why the verdict or value holds, by term.
  image: Squares of real numbers are exactly the nonnegative numbers.
---
Markdown body: a longer discussion (proofs, figures, variations).
```

In a distinction's grid, each cell shows the example's value for the term if it has one, and otherwise ✓ (`is`), ✗ (`is_not`), or – (not addressed).
Use `values` when the distinction is about which object is the ___ of a given thing (e.g., its domain, its rank, its mean), and `is`/`is_not` when it is about whether a thing is a ___.

**Non-examples:** List a term in an example's `is_not` only when the example may be mistaken for an instance of the term (the perimeter of a rectangle is not its area; the $2$ in $x^2$ is not a coefficient), and say why in `why`. Non-examples are listed beneath the examples of each definition.

**Each example must stand on its own.** Its `title` and `description` must make sense on its own page and in a definition's list of examples, without the distinction that uses it. Write "A gust of wind hitting a quadcopter drone," not "A gust of wind" under a note saying that every row is about a drone.

**Levels:** On a distinction page, examples above the level selected in the level switcher are hidden, with a note saying how many are hidden. Choose the level from the example itself and its verdicts: $\mathbb{Q}$ is a high-school example even in a table with graduate terms, but the Cantor function is not elementary.

**Math in YAML:** Use single quotes or block scalars (`>`) for values containing backslashes, and quote values containing `: `. Write `f^{\prime}` instead of `f'` (smart quotes would change the apostrophe), and `\lvert x \rvert` instead of `|x|`.

## LaTeX Macros

## Pages

## Posts

## Publications

## UAW 4811 Contracts

There are two collections that contain the articles for the bargaining agreements between UAW 4811 and the University of California.

### ASE 2022-2025 Contract

### GSR 2022-2025 Contract

## Writing Tips
