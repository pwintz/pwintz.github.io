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
