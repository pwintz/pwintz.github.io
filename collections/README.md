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
- [Types of measurement_functions](/collections/_distinctions/types_of_measurement_functions.md)
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
- [Types of integers](/collections/_distinctions/types_of_integers.md)
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
