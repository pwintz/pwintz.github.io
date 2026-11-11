# Marks links to Dictionary of Fine Distinctions pages that will not work on the live site, so they can be
# styled as broken (see a.dictionary-broken-link in _sass/minimal-mistakes/_distinctions.scss):
#   - links to pages that do not exist, and
#   - links to pages marked `published: false`. These are generated in a local preview built with
#     --unpublished, but not on the live site, so they are marked in both cases.
#
# Only links to /dictionary/definitions/<name>, /dictionary/distinctions/<name>, and /dictionary/examples/<name> are checked.
#
# The links are marked in the written HTML files, after every build. This also covers pages that an
# incremental build (`jekyll serve --incremental`) did not regenerate, and unmarks links whose targets
# have since been published.

require "set"

module DictionaryBrokenLinks
  PREFIXES = %w[definitions distinctions examples].freeze
  CLASS_NAME = "dictionary-broken-link"
  TITLES = {
    missing: "This page does not exist.",
    unpublished: "This page is not published yet.",
  }.freeze

  # "/dictionary/definitions/foo/", "/dictionary/definitions/foo.html", and "/dictionary/definitions/foo#bar" all name the page "/dictionary/definitions/foo".
  def self.normalize(url)
    url.sub(/[?#].*\z/, "").sub(%r{/\z}, "").sub(/\.html\z/, "")
  end

  # Removes the marks added by an earlier run, so that a tag can be marked afresh.
  def self.unmark(tag)
    tag = tag.sub(%r{ title="(?:#{TITLES.values.map { |t| Regexp.escape(t) }.join("|")})"}, "")
    tag = tag.sub(/ class="#{CLASS_NAME}"/, "")
    tag.sub(/(class="[^"]*?) #{CLASS_NAME}"/, '\1"')
  end

  def self.mark(html, published, unpublished, baseurl)
    pattern = %r{<a\s[^>]*?href="#{Regexp.escape(baseurl)}(/dictionary/(?:#{PREFIXES.join("|")})/[^"]+)"[^>]*>}
    html.gsub(pattern) do |tag|
      path = normalize(Regexp.last_match(1))
      tag = unmark(tag)
      next tag if published.include?(path)

      title = TITLES[unpublished.include?(path) ? :unpublished : :missing]
      if tag.include?(' class="')
        tag.sub(/class="([^"]*)"/, %(class="\\1 #{CLASS_NAME}" title="#{title}"))
      else
        tag.sub(/\A<a\s/, %(<a class="#{CLASS_NAME}" title="#{title}" ))
      end
    end
  end
end

Jekyll::Hooks.register :site, :post_write do |site|
  baseurl = site.config["baseurl"].to_s.chomp("/")
  items = (site.pages + site.documents).select { |item| item.respond_to?(:data) }
  unpublished_items, published_items = items.partition { |item| item.data["published"] == false }
  published = published_items.map { |item| DictionaryBrokenLinks.normalize(item.url) }.to_set
  unpublished = unpublished_items.map { |item| DictionaryBrokenLinks.normalize(item.url) }.to_set

  Dir.glob(File.join(site.dest, "**", "*.html")).each do |file|
    html = File.read(file)
    next unless html.include?("href=")

    marked = DictionaryBrokenLinks.mark(html, published, unpublished, baseurl)
    File.write(file, marked) unless marked == html
  end
end
