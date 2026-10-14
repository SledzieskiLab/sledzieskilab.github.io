---
# ============================================================
#  PROJECT PAGE. Start one with:
#
#      make project SLUG=planet-md CITEKEY=sledzieski2026planetmd
#
#  Copying this file by hand works too — delete the `published: false`
#  line at the bottom of this block if you do.
#
#  The page lives at /publications/<slug>/ and a "Project page" chip
#  appears next to that paper on /publications/ and on the homepage
#  automatically, from the `citekey:` below.
#
#  Every field is optional except for `citekey`. Title, authors, venue,
#  year, paper/code links, the teaser image and the BibTeX are all
#  inherited from that paper's entry in publications.yml. Setting a
#  field here overrides the inherited value for this page only.
#
#  Where files go:
#    images  assets/images/projects/<slug>/...   (or a bare filename
#                                                 in .../projects/)
#    videos  assets/videos/projects/...
#  A path starting with "/" or "https://" is used as-is instead.
# ============================================================

# ---------- the paper ----------
citekey: "sledzieski2021dscript"     # must match a citekey in _data/publications.yml
# title: "The paper's title"
# slug: custom-url                   # overrides the filename in the URL
                                     # (set `title:` too if you use it)

# ---------- overrides (optional) ----------
# Only set these to say something different from publications.yml, or
# for a project with no `citekey:` at all.
# venue: "Nature Methods"
# year: 2027
# note: "Oral presentation"
#
# No `status:` — the preprint / in-press badge is a disambiguator for a
# list of papers and isn't shown on a page about a single one.

# ---------- social card ----------
# image: /assets/images/projects/my-project/teaser.png

# ---------- authors ----------
# Omit this block entirely and the surname-only author string from
# publications.yml is used, exactly as it appears on /publications/.
# authors:
#   - name: "Samuel Sledzieski"
#     url: "https://samsl.io"
#     affil: [1]
#     lab: true
# affiliations:
#   - "Halıcıoğlu Data Science Institute, UC San Diego"
# author_note: "*Equal contribution"

# ---------- link buttons ----------
# `paper` and `code` default to the publication's links, so you usually
# need this block only for the extras. Known keys: paper, arxiv, code, data, demo, video,
# slides, poster, docs. Anything else goes in `extra`.
# links:
#   arxiv: "https://arxiv.org/abs/2501.00000"
#   data: "https://zenodo.org/records/0000000"
#   demo: "https://huggingface.co/spaces/..."
#   extra:
#     - text: "Colab"
#       url: "https://colab.research.google.com/..."

# ---------- teaser ----------
# Defaults to the paper's thumbnail from assets/images/pubs/
# teaser: "my-project/teaser.png"
# teaser_alt: "What the figure shows, for screen readers"
# teaser_caption: "One line on what the reader is looking at."
#
# A silent clip instead. It autoplays, loops and is muted. Set `teaser:`
# alongside it for the poster frame — worth doing, since that's what
# shows before the first frame decodes and if autoplay is refused.
# teaser_video: "my-project/teaser.mp4"
# teaser_video_controls: true

# ---------- search / social card ----------
# One or two sentences for search results and link previews. Without it
# the site-wide description is used, which says nothing about this page.
# description: "MIMIC jointly models DNA, RNA and protein in one
#   generative foundation model."

# ---------- no embeds ----------
# There is no YouTube block and no poster-PDF block. A talk or a poster
# goes in `links:` above as a button — `video:` and `poster:` are known
# keys — which keeps the page one column of prose.

# ---------- BibTeX ----------
# Generated from publications.yml automatically. Set this only to show
# something different (a book chapter's citation, say).
# bibtex: |
#   @article{key2027title,
#     ...
#   }

# DELETE THIS LINE in your copy — it is what keeps the template itself
# from being published as a page.
published: false
---

Everything below the front matter is markdown: the whole of the page's
prose, starting with the abstract. Write whatever the project needs — the
abstract or a plainer-language version of it, how the method works, what
the results mean, how to run it.

**Start headings at `##`.** The title above is the page's only `#`, and
skipping a level breaks the document outline for screen readers.

**Figures go inline, wherever the text about them is:**

{% raw %}
    {% include figure.html src="my-project/fig1.png"
                           caption="What the reader is looking at." %}
{% endraw %}

`src` takes the same short path as the front matter — a file under
`assets/images/projects/` — plus `caption` (inline markdown allowed) and
`alt` if the caption doesn't describe the picture.

A plain markdown image works too, without a caption, **but the path must
start at the site root**:

    ![Alt text](/assets/images/projects/my-project/fig1.png)

## A section

Delete all of this and write the real thing.
