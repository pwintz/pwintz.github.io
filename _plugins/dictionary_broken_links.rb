# Marks links to Dictionary of Fine Distinctions pages that will not work on the live site, so they can be
# styled as broken (see a.dictionary-broken-link in _sass/minimal-mistakes/_distinctions.scss):
#   - links to pages that do not exist, and
#   - links to pages marked `published: false`. These are generated in a local preview built with
#     --unpublished, but not on the live site, so they are marked in both cases.
#
# Only links to /dictionary/definitions/<name>, /dictionary/distinctions/<name>, and /dictionary/examples/<name> are checked.
#
# In local development (`jekyll serve`), each marked link is followed by the name of the file that holds
# (or, for a missing page, would hold) the page, so that the file is easy to open.
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

  FILE_CLASS = "dictionary-broken-link__file"
  FILE_PATTERN = %r{<code class="#{FILE_CLASS}">[^<]*</code>}

  # The file name shown after a marked link: the file of an unpublished page, or "<slug>.md" for a missing one.
  def self.file_label(path, unpublished)
    unpublished[path] || "#{path.split("/").last}.md"
  end

  # unpublished: Hash from the normalized URL of each unpublished page to the base name of its file.
  # show_files:  Whether to follow each marked link with the name of its file.
  def self.mark(html, published, unpublished, baseurl, show_files: false)
    html = html.gsub(FILE_PATTERN, "")
    pattern = %r{(<a\s[^>]*?href="#{Regexp.escape(baseurl)}(/dictionary/(?:#{PREFIXES.join("|")})/[^"]+)"[^>]*>)(.*?</a>)}m
    html.gsub(pattern) do |match|
      tag = Regexp.last_match(1)
      path = normalize(Regexp.last_match(2))
      rest = Regexp.last_match(3)
      tag = unmark(tag)
      next tag + rest if published.include?(path)

      title = TITLES[unpublished.key?(path) ? :unpublished : :missing]
      tag = if tag.include?(' class="')
        tag.sub(/class="([^"]*)"/, %(class="\\1 #{CLASS_NAME}" title="#{title}"))
      else
        tag.sub(/\A<a\s/, %(<a class="#{CLASS_NAME}" title="#{title}" ))
      end
      file = show_files ? %(<code class="#{FILE_CLASS}">#{file_label(path, unpublished)}</code>) : ""
      tag + rest + file
    end
  end
end

Jekyll::Hooks.register :site, :post_write do |site|
  baseurl = site.config["baseurl"].to_s.chomp("/")
  items = (site.pages + site.documents).select { |item| item.respond_to?(:data) }
  unpublished_items, published_items = items.partition { |item| item.data["published"] == false }
  published = published_items.map { |item| DictionaryBrokenLinks.normalize(item.url) }.to_set
  unpublished = unpublished_items.to_h { |item| [DictionaryBrokenLinks.normalize(item.url), File.basename(item.path)] }
  show_files = Jekyll.env == "development"

  Dir.glob(File.join(site.dest, "**", "*.html")).each do |file|
    html = File.read(file)
    next unless html.include?("href=")

    marked = DictionaryBrokenLinks.mark(html, published, unpublished, baseurl, show_files: show_files)
    File.write(file, marked) unless marked == html
  end
end
