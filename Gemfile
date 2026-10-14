source "https://rubygems.org"

# The `github-pages` gem pins Jekyll and all plugins to exactly the
# versions GitHub Pages runs in production. Using it means "works
# locally" reliably implies "works when deployed".
gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
end

# Required on Ruby 3.x — no longer bundled with the stdlib.
gem "webrick", "~> 1.8"

# Faster incremental rebuilds on macOS.
gem "ffi", "~> 1.16"
