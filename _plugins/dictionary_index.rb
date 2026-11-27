# Precomputes, for each document in the "definitions" collection, the examples and distinctions that refer to it,
# so that layouts do not need to filter site.examples and site.distinctions with where_exp on every page.
# (where_exp re-evaluates a Liquid expression for every document, and _includes/definition-examples.html ran it
# three times over all examples for each definition shown, which made up a large share of the build time.)
#
# Sets these fields on each definition (in the same order as site.examples and site.distinctions):
#   worked_examples:      Examples whose "values" give a value for the term.
#   positive_examples:    Examples whose "is" lists the term, other than worked examples.
#   negative_examples:    Examples whose "is_not" lists the term.
#   related_distinctions: Distinctions whose "terms" list the term.
#   canonical:            (Synonym pages, which have "synonym_of") The definition that the page is a synonym of.
#   synonym_pages:        (Canonical pages) The synonym pages whose "synonym_of" is this definition.
#
# Also sets site.data["dictionary_synonym_of"], a map from the slug of each synonym page to the slug of its
# canonical definition, so that example grids can show the canonical term's verdict in a synonym's column.
# Warns about synonym pages whose canonical definition is missing or that have levels of their own, and
# about examples that list a synonym in "is", "is_not", "values", or "why" (they belong under the canonical term).
#
# The tests match Liquid's "contains" operator (include? on the hash, array, or string).

module DictionaryIndex
  def self.contains?(value, term)
    value.respond_to?(:include?) && value.include?(term)
  end

  class Generator < Jekyll::Generator
    safe true
    priority :high

    def generate(site)
      definitions = site.collections["definitions"]&.docs || []
      examples = site.collections["examples"]&.docs || []
      distinctions = site.collections["distinctions"]&.docs || []

      by_slug = definitions.to_h { |d| [d.data["slug"], d] }
      synonym_of = {}
      definitions.each do |definition|
        canonical_slug = definition.data["synonym_of"]
        next unless canonical_slug
        canonical = by_slug[canonical_slug]
        slug = definition.data["slug"]
        unless canonical
          Jekyll.logger.warn "Dictionary:", "#{slug} is a synonym of #{canonical_slug}, which is not a definition."
          next
        end
        if definition.data["levels"]
          Jekyll.logger.warn "Dictionary:", "#{slug} is a synonym of #{canonical_slug}, so its definition belongs on #{canonical_slug}, not in its own levels."
        end
        synonym_of[slug] = canonical_slug
        definition.data["canonical"] = canonical
        (canonical.data["synonym_pages"] ||= []) << definition
      end
      site.data["dictionary_synonym_of"] = synonym_of

      examples.each do |example|
        %w[is is_not values why].each do |field|
          listed = example.data[field]
          listed = listed.keys if listed.is_a?(Hash)
          next unless listed.is_a?(Array)
          (listed & synonym_of.keys).each do |slug|
            Jekyll.logger.warn "Dictionary:", "#{example.data["slug"]} lists the synonym #{slug} in \"#{field}\"; list #{synonym_of[slug]} instead."
          end
        end
      end

      definitions.each do |definition|
        term = definition.data["slug"]
        definition.data["worked_examples"] = examples.select { |e| DictionaryIndex.contains?(e.data["values"], term) }
        # An example that both "is" the term and gives its value is listed once, as a worked example.
        definition.data["positive_examples"] = examples.select { |e| DictionaryIndex.contains?(e.data["is"], term) } - definition.data["worked_examples"]
        definition.data["negative_examples"] = examples.select { |e| DictionaryIndex.contains?(e.data["is_not"], term) }
        definition.data["related_distinctions"] = distinctions.select { |d| DictionaryIndex.contains?(d.data["terms"], term) }
      end
    end
  end
end
