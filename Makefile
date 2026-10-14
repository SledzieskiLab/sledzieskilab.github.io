.PHONY: help install serve build clean check project

help:
	@echo "Sledzieski Lab website"
	@echo ""
	@echo "  make install   Install Ruby dependencies (run once, or after Gemfile changes)"
	@echo "  make serve     Local preview with live reload at http://localhost:4000"
	@echo "  make build     Build the production site into _site/"
	@echo "  make check     Build with strict front matter / link warnings"
	@echo "  make clean     Delete _site/ and the Jekyll cache"
	@echo ""
	@echo "  make project SLUG=<url-slug> CITEKEY=<citekey>"
	@echo "                 Start a project page from _projects/TEMPLATE.md"
	@echo ""

install:
	bundle install

# NOTE: deliberately NOT --incremental.
#
# Jekyll's incremental mode does not invalidate pages when a file under
# _data/ changes, so edits to people.yml, publications.yml, news.yml &c.
# silently fail to appear — which is close to useless for a site whose
# content lives entirely in _data. A full rebuild takes ~0.25s here, so
# incremental buys nothing.
#
# _config.yml changes still require restarting the server.
serve:
	bundle exec jekyll serve --livereload --open-url

build:
	JEKYLL_ENV=production bundle exec jekyll build

check:
	JEKYLL_ENV=production bundle exec jekyll build --strict_front_matter --trace

clean:
	bundle exec jekyll clean

# Start a new project page from _projects/TEMPLATE.md.
#
#   make project SLUG=planet-md CITEKEY=sledzieski2026planetmd
#
# Copies the template, points it at the paper, and removes the
# `published: false` line that keeps the template itself out of the
# build — the step that's easiest to forget when copying by hand, and
# whose symptom is a page that silently never appears. See the header
# comment in bin/new-project.rb for why it's a script and not a one-liner.
project:
	@ruby bin/new-project.rb "$(SLUG)" "$(CITEKEY)"
