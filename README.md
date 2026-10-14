# Sledzieski Lab website

A small Jekyll site. Content lives in YAML and markdown; no HTML editing
required for routine updates.

---

## Everyday updates

**You almost never need to touch HTML.** These are the files you'll actually edit:

| To do this | Edit this file |
| --- | --- |
| Add or remove a lab member | `_data/people.yml` |
| Add a paper | `_data/publications.yml` |
| Give a paper its own project page | `make project`, then `_projects/<slug>.md` |
| Post news (paper accepted, new member, talk) | `_data/news.yml` |
| Change a research area | `_research/<n>-<slug>.md` |
| Change site colours | `_data/palette.yml` (select with `palette:` in `_config.yml`) |
| Address, email, social links | `_config.yml` → `contact:`, `social:` |
| Add a software package | `_data/software.yml` |
| Change the nav menu | `_data/nav.yml` |
| Turn recruiting on or off | `_config.yml` → `recruiting:` |
| Rewrite the "Join the lab" text | `_pages/join.md` |
| Change colors or fonts | `assets/css/main.scss` → `:root` block at the top |

Every data file is commented with the available fields and an example.
Optional fields can simply be deleted — the template skips anything absent.

### Recruiting

`recruiting.active` in `_config.yml` shows or hides the banner at the top
of every page. Set it to `false` when you're not recruiting; the `/join/`
page stays up and reachable from the nav either way.

### Adding a person

1. Put a square photo in `assets/images/people/` (600×600 or larger).
2. Add an entry to `_data/people.yml`:

```yaml
- name: "Jane Doe"
  role: "PhD Student"
  group: phd            # pi | postdoc | phd | masters | undergrad | staff | alumni
  photo: "jane-doe.jpg"
  program: "Data Science"
  interests: "Protein language models"
  links:
    email: "jdoe@ucsd.edu"
    github: "janedoe"
```

No photo yet? Omit the `photo:` line and a neutral placeholder is used.
Bios can use inline Markdown, including links, for example:
`Read my [paper](https://example.com/paper).`

When someone leaves, change their `group` to `alumni` and add
`years:` and `now:`. They move to a compact list at the bottom of the
team page automatically.

### Adding a paper

Newest at the top of `_data/publications.yml`. Wrap lab members' names in
`**double asterisks**` to bold them:

```yaml
- title: 'The title of the paper'
  authors: 'Doe, **Sledzieski**\*, Roe\*'
  venue: 'Nature Methods'
  year: 2027
  area: 'Protein Networks'   # groups the paper on /publications/
  status: 'preprint'         # omit once published; or 'in press'
  selected: true             # also show on the homepage
  doi: '10.1038/xxxxx'       # bare DOI — used by BibTeX
  volume: '12'
  pages: '1-10'
  links:
    paper: 'https://doi.org/10.1038/xxxxx'
    code: 'https://github.com/...'
```

Years group themselves. You don't need to add a heading.

**Authors** use the surname-only style from your personal site. Wrap
yourself in `**...**` to bold. Co-first and corresponding markers must be
escaped as `\*` and `\+` — an unescaped `*` is emphasis syntax, and a pair
of them would italicise everything in between.

**Links: one paper link, that's it.** A DOI and a publisher PDF resolve to
the same article, so each entry shows a single `paper:` link (prefer the
DOI — it's the stable one), plus `code:` when there is one, plus a BibTeX
button that's always present. The bare `doi:` field is separate from
`links.paper` so a paper linked by PDF can still cite a DOI.

**Areas** are free text — reuse the same string across papers and they
group together. **Areas are ordered by how many papers they contain**,
most first, so your main lines of work lead without you maintaining an
order anywhere. Ties break alphabetically, and the catch-all "Other" is
always last. The ranking is computed over the whole publication list, so
it does not reshuffle while you search or filter. `/software/` orders its
areas the same way. One area per paper: grouping moves each entry rather
than copying it, so a paper can't appear twice.

**BibTeX** is generated from these fields, so there's no second copy to
keep in sync. The citekey follows Google Scholar's convention —
`sledzieski2021dscript`. Two escape hatches if the automatic version is
wrong: `citekey:` overrides the key, and `bibtex_authors:` overrides
author parsing for compound surnames like "van der Waals" (the parser
assumes the last whitespace-separated token is the surname).

### Giving a paper its own project page

Some papers deserve more than a line in a list — a teaser figure or clip,
a longer explanation, figures with captions. Those get a **project page**
at `/publications/<slug>/`, laid out like the
[academic project page template](https://github.com/eliahuhorwitz/Academic-project-page-template):
title, authors, link buttons, teaser, whatever you want to say, then the
citation. Most papers won't have one, and that's fine.

```sh
make project SLUG=planet-md CITEKEY=sledzieski2026planetmd
```

That creates `_projects/planet-md.md` from the template, points it at the
paper, and makes `assets/images/projects/planet-md/` for its figures.
Then open the new file, write the prose below the front matter, and
delete the front-matter lines you don't need — every one of them is
optional and commented.

**You don't restate the paper.** The page names its paper with
`citekey:` and inherits the authors, venue, year, paper and code
links, the thumbnail and the BibTeX from `_data/publications.yml`. So
they can't drift out of sync, and a page can be as short as:

```markdown
---
title: "PLANET-MD: Ultra-fast Prediction of Allosteric Networks"
citekey: "sledzieski2026planetmd"
---

The abstract, and anything else you want to say.
```

All the prose lives below the front matter, abstract included — there is
no `abstract:` key to keep separate from the paragraphs after it.

**You don't edit `publications.yml` either.** A "Project page" chip
appears beside that paper on `/publications/` and on the homepage as soon
as the file exists — the link is found by citekey, from the project side.
Delete the file and the chip goes away.

What a page can show, all optional: a teaser image or clip, a structured
author list with per-author links and affiliation superscripts, and extra
link buttons (arXiv, data, demo, video, slides, poster, docs, or anything
you name). Everything else is markdown. The full list with examples is
the commented front matter of `_projects/TEMPLATE.md`.

There is no YouTube embed and no poster viewer, on purpose — a talk or a
poster is a link button, and a poster image can go inline in the body as
a figure. The page stays one column of prose.

**Figures go inline in the body**, wherever the text about them is:

```liquid
{% include figure.html src="mimic/architecture.png"
                       caption="What the reader is looking at." %}
```

`src` is a path under `assets/images/projects/`, the same short form the
front matter uses. `caption` takes inline markdown; add `alt` when the
caption doesn't describe the picture.

**Watch the path on plain markdown images.** This is the one thing that
looks right and isn't:

```markdown
![Alt](assets/images/projects/mimic/fig.png)     ← 404s
![Alt](/assets/images/projects/mimic/fig.png)    ← works (leading slash)
```

A relative path is resolved against the *page's* URL,
`/publications/<slug>/`, so the first one asks for
`/publications/mimic/assets/images/...`. There's no relative form that
reaches `assets/` — start at the site root, or use the include above and
give it the short path.

Figures live in `assets/images/projects/<slug>/` and videos in
`assets/videos/projects/`. A path that starts with `/` or `https://` is
used as-is instead.

### Searching and grouping

`/publications/` has a search box and a Year/Area toggle, driven by
`assets/js/publications.js`. Search matches title, authors, and the
venue line — and because the venue line renders as "*Journal*, Year",
searching `berger 2021` works. Multiple terms are AND-ed, so each word
narrows the results.

Both controls are progressive enhancement: the page ships the complete
list already grouped by year, and the controls stay hidden unless the
script runs. Nobody ever sees a search box that doesn't work.

---

## Running it locally

Requires Ruby (3.1+ works; macOS system Ruby is too old, use Homebrew's).

```sh
make install     # once, and again whenever the Gemfile changes
make serve       # http://localhost:4000, live-reloads as you edit
```

Other targets:

```sh
make build       # production build into _site/
make check       # strict build; fails loudly on malformed front matter
make clean       # delete _site/ and the cache

make project SLUG=<url-slug> CITEKEY=<citekey>   # start a project page
```

**Gotcha:** `make serve` picks up changes to `_data/`, `_pages/`, and SCSS
automatically, but **not** `_config.yml`. Restart the server after editing that.

`make serve` deliberately does not use Jekyll's `--incremental` flag.
Incremental builds don't invalidate pages when a file under `_data/`
changes, so edits to `people.yml`, `publications.yml` and friends appear
to do nothing — which is exactly wrong for a site whose content lives in
`_data`. A full rebuild takes about a quarter of a second, so there's
nothing to gain. If you ever add `--incremental` back and a data edit
seems to be ignored, this is why.

---

## Deploying

The site uses only plugins on GitHub Pages' allowlist (`jekyll-feed`,
`jekyll-sitemap`, `jekyll-seo-tag`), so **GitHub builds it natively — no
Actions workflow needed.**

1. Push to a GitHub repo.
2. Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/`.
3. For a custom domain: add a `CNAME` file containing the bare domain
   (e.g. `sledzieskilab.org`), point DNS at GitHub, and update `url:` in
   `_config.yml`.

If you ever add a plugin that isn't on the allowlist, GitHub's native build
will silently skip it and you'll need a GitHub Actions workflow instead.
Worth avoiding if you can.

---
