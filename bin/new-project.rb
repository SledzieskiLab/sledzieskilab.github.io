#!/usr/bin/env ruby
# frozen_string_literal: true

# Start a project page from _projects/TEMPLATE.md.
#
#     make project SLUG=planet-md CITEKEY=sledzieski2026planetmd
#
# Ruby rather than sed: titles contain characters sed treats as syntax
# (&, |, /), which would corrupt the front matter silently. Ruby is
# already a hard dependency (Jekyll runs on it), so this costs nothing.
#
# The title is the one field copied in rather than resolved at render
# time from the citekey, because jekyll-seo-tag reads `page.title` for
# the <title> tag and social card, and a layout can't set that.

require "yaml"
require "json"   # only for quoting the title safely — see below

TEMPLATE = "_projects/TEMPLATE.md"
PUBS     = "_data/publications.yml"

slug    = ARGV[0].to_s.strip
citekey = ARGV[1].to_s.strip

abort "usage: make project SLUG=<url-slug> CITEKEY=<citekey>" if slug.empty? || citekey.empty?
abort "SLUG must be lowercase letters, numbers and hyphens: #{slug}" unless slug.match?(/\A[a-z0-9][a-z0-9-]*\z/)
# Project pages are written into /publications/<slug>/, so this one name
# would land on top of the publication list's own index.html.
abort "SLUG cannot be \"index\" — it would overwrite /publications/" if slug == "index"

target = "_projects/#{slug}.md"
abort "#{target} already exists" if File.exist?(target)

pubs = YAML.load_file(PUBS)
pub  = pubs.find { |p| p["citekey"] == citekey }
abort "no publication with citekey \"#{citekey}\" in #{PUBS}" if pub.nil?

# Block form of sub, and JSON for the title: a title containing \ or &
# would otherwise be read as a backreference, and JSON's string quoting
# is also valid YAML double-quoted-scalar quoting.
body = File.read(TEMPLATE)
       .sub(/^citekey: .*$/) { %(citekey: "#{citekey}") }
       .sub(/^# title: .*$/) { %(title: #{pub["title"].to_json}) }
       # These three lines are what keep the template itself unpublished.
       .gsub(/^# DELETE THIS LINE.*\n/, "")
       .gsub(/^# from being published as a page\.\n/, "")
       .gsub(/^published: false\n/, "")

File.write(target, body)
Dir.mkdir("assets/images/projects/#{slug}") unless Dir.exist?("assets/images/projects/#{slug}")

puts "Created #{target}  →  /publications/#{slug}/"
puts "  paper:   #{pub["title"]}"
puts "  figures: assets/images/projects/#{slug}/"
puts "Next: write the abstract, delete the front-matter lines you don't need, then `make serve`."
