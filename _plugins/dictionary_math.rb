# Keeps kramdown from changing inline math ($...$) on the Dictionary of Fine Distinctions pages.
#
# kramdown doesn't know that $...$ is math, so it reads "_" and "*" pairs as emphasis ($x_1 + y_1$ loses its
# subscripts) and removes the backslash from escapes such as "\{", "\|", and "\\". $$...$$ is unaffected, because
# kramdown already leaves it alone.
#
# Before kramdown runs, each inline formula is replaced by a placeholder, and afterward the formula is put back
# unchanged (HTML-escaped), for MathJax to typeset. This applies to
#   - the bodies of definitions, distinctions, and examples, and
#   - the markdownify filter on pages whose URL starts with /dictionary/, which renders the front-matter text
#     (definitions, properties, summaries, example values, and so on).
# The rest of the site is unchanged, because its pages contain workarounds (such as "\\{") for kramdown's escapes.
#
# So in dictionary pages, write inline math as plain TeX: $x_1$, $\setdef{x}$, $\norm{x}$. Don't escape "_" as "\_".

require "cgi"

module DictionaryMath
  COLLECTIONS = %i[definitions distinctions examples].freeze

  # A $ that isn't escaped or part of $$, up to the next such $, within one paragraph (no blank line).
  INLINE_MATH = /(?<![\\$])\$(?!\$)((?:\\.|[^$\\\n]|\n(?![ \t]*\n))+?)(?<!\\)\$(?!\$)/

  # A placeholder that kramdown passes through unchanged.
  PLACEHOLDER = /DICTMATHPLACEHOLDER(\d+)X/

  # Returns the text with each inline formula replaced by a placeholder, and the formulas.
  def self.protect(text)
    formulas = []
    protected_text = text.gsub(INLINE_MATH) do
      formulas << Regexp.last_match(0)
      "DICTMATHPLACEHOLDER#{formulas.size - 1}X"
    end
    [protected_text, formulas]
  end

  def self.restore(html, formulas)
    return html if formulas.empty?

    html.gsub(PLACEHOLDER) { CGI.escapeHTML(formulas[Regexp.last_match(1).to_i]) }
  end

  def self.dictionary_page?(page)
    url = page && page["url"]
    url.is_a?(String) && url.start_with?("/dictionary/")
  end
end

# Bodies of definitions, distinctions, and examples.
Jekyll::Hooks.register DictionaryMath::COLLECTIONS, :pre_render do |doc|
  doc.content, formulas = DictionaryMath.protect(doc.content)
  doc.instance_variable_set(:@dictionary_math, formulas)
end

Jekyll::Hooks.register DictionaryMath::COLLECTIONS, :post_convert do |doc|
  formulas = doc.instance_variable_get(:@dictionary_math)
  doc.content = DictionaryMath.restore(doc.content, formulas) if formulas
end

# Front-matter text, rendered with markdownify in the dictionary's layouts and includes.
module Jekyll
  module Filters
    alias_method :markdownify_without_dictionary_math, :markdownify

    def markdownify(input)
      return markdownify_without_dictionary_math(input) unless DictionaryMath.dictionary_page?(@context.registers[:page])

      text, formulas = DictionaryMath.protect(input.to_s)
      DictionaryMath.restore(markdownify_without_dictionary_math(text), formulas)
    end
  end
end
