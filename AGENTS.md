# AGENTS.md

Instructions for anyone — human or AI — editing this site.

`README.md` is the friendly version for lab members doing routine updates.
This file is the complete picture: architecture, invariants, and the
non-obvious decisions that will bite you if you don't know about them.

---

## What this is

A small, hand-built Jekyll site for the Sledzieski Lab (UC San Diego HDSI,
starting 2027). Deliberately **not** a fork of Academic Pages / Minimal
Mistakes: the visual target needed control that fighting a large theme's
SCSS wouldn't give, and ~30 well-commented files are easier to maintain
than a big fork.

- **Jekyll** via the `github-pages` gem, so local versions match production
- **Plugins limited to GitHub Pages' allowlist** (`jekyll-sitemap`,
  `jekyll-seo-tag`) → GitHub builds it natively, **no Actions workflow**
- **Content lives in `_data/*.yml`**, not in HTML. This is the core design
  principle: adding a person or paper never means touching a template
- **Two small JS files**, both purely additive
- Builds in ~0.25s; whole site is a few hundred KB plus images

---

## Commands

```sh
make install    # bundle install; rerun when the Gemfile changes
make serve      # http://localhost:4000, live-reload
make build      # production build into _site/
make check      # strict build; fails on malformed front matter
make clean      # delete _site/ and caches

make project SLUG=<url-slug> CITEKEY=<citekey>   # new project page
```

---

## Golden rules

Read these before changing anything. Each one cost real debugging.

1. **Never add `--incremental` to `make serve`.** Jekyll's incremental
   mode does not invalidate pages when a file under `_data/` changes. On a
   site whose entire content lives in `_data`, that means your edits
   silently do nothing. This actually happened: an alumni entry appeared
   not to render. A full rebuild is 0.25s, so there is nothing to gain.

2. **If a CSS or JS change seems not to apply, hard-reload before
   debugging.** `main.css` and both scripts carry `?v={{ site.time }}` to
   defeat caching, but a stale tab can still bite. This masked real fixes
   twice: once for CSS, and again for an area-sorting change that was
   already correct in the built `publications.js` while the browser served
   the old copy. **If you add another asset, give it `?v=` too.**

3. **One width, set only in `--measure`.** `.wrap` is `margin: 0 auto`, so
   any *second* width applied to page content makes the left edge shift
   between pages — that was an early bug, and a later attempt to fix
   narrowness by capping only some pages recreated it in reverse. If you
   need a different measure for one block, put `max-width` on an inner
   element, never on `.wrap`.

4. **Look at visual output before declaring it done.** Automated image
   work fails silently. Every figure-extraction bug this session — a
   truncated diagram, a supplementary training-curve panel, a table
   cropped as if it were a figure — was invisible in logs and obvious on
   screen.

5. **Don't guess font metrics; measure them.** The emoji marks were sized
   wrong twice from an assumed glyph ratio. Measuring Apple Color Emoji
   gave 0.91–1.00, not the 0.85 assumed.

---

## Where content lives

| To change | Edit |
| --- | --- |
| Lab members | `_data/people.yml` |
| Publications | `_data/publications.yml` |
| A paper's project page | `_projects/<slug>.md` (a collection) |
| News | `_data/news.yml` |
| Research areas | `_research/<n>-<slug>.md` (a collection) |
| Colours | `_data/palette.yml` (select with `palette:` in `_config.yml`) |
| Software | `_data/software.yml` |
| Nav menu | `_data/nav.yml` |
| Homepage/team display knobs | `_data/settings.yml` |
| Site identity, contact, recruiting | `_config.yml` |
| Join-the-lab prose | `_pages/join.md` |
| Address / email / social links | `_config.yml` → `contact:`, `social:` |
| Colours, type, spacing | `assets/css/main.scss` → `:root` |

Every data file is commented with its available fields. Optional fields
can be deleted — templates skip anything absent.

### File map

```text
_config.yml            identity, contact, recruiting switch, build config
_data/                 ← all content
_layouts/              default.html (shell), page.html (markdown pages),
                       research-area.html, project.html
_includes/             head, header, footer, person, publication,
                       news-item, bibtex, project-url, project-asset
_pages/                one file per page; permalinks in front matter
_projects/             per-paper project pages + TEMPLATE.md
bin/new-project.rb     what `make project` runs
index.html             homepage, assembled from _data/
404.html               served by GitHub Pages on any unmatched path
feed.xml               Atom feed template over _data/news.yml
assets/css/main.scss   the entire stylesheet
assets/css/style.scss  intentionally near-empty — see gotchas
assets/js/             dialogs.js, publications.js
assets/images/         people/ research/ pubs/ projects/ software/
                       + og-card, favicon
assets/videos/         projects/ — teaser clips
```

---

## Data file reference

### `people.yml`

```yaml
- name: "Jane Doe"
  role: "PhD Student"
  group: phd        # pi | postdoc | phd | masters | undergrad | staff | alumni
  photo: "jane-doe.jpg"      # square, in assets/images/people/
  program: "Data Science"    # optional
  interests: "..."           # optional
  bio: >-                    # PI only; shown on the wide PI card
  links: {email, website, github, scholar, bluesky}
```

`people_groups` in `settings.yml` sets the **order** on `/team/`, but not
headings — everyone including the PI sits in one grid at the same size,
and each card prints its own `role` (name first, then role, then details
and links). A `group` not listed in `people_groups` still renders, at the
end, rather than vanishing. Omit `photo` and a neutral placeholder is
used. Alumni render as a compact text list below the grid — give them
`years:` and `now:`.

**Bios.** The PI's is shown in full in the `.pi-card` block at the top of
`/team/`. For everyone else, `bio` turns their photo into a button that
opens the text in a dialog — so cards stay a uniform height however much
someone writes. Omit `bio` and the photo is a plain image, not a button.
The only visual affordance is a thin `--accent` outline on hover and
focus; the `aria-label` ("Read *Name*'s biography") carries it for screen
readers.

`_pages/team_grouped.html` is an older layout — wide PI card *plus*
per-role headings — kept with `published: false` in case you want the
headings back. Switching instructions are in its front matter.

### `publications.yml`

```yaml
- title: 'Paper title'
  authors: 'Doe, **Sledzieski**\*, Roe\*'
  venue: 'Nature Methods'
  year: 2027
  area: 'Protein Networks'      # groups under "Group by: Area"
  status: 'preprint'            # 'preprint' | 'in press' | 'workshop'
  type: 'inproceedings'         # BibTeX type; default is @article
  doi: '10.1038/xxxxx'          # BARE doi, for BibTeX only
  volume / number / pages       # BibTeX only
  image: 'sledzieski2021dscript.png'   # thumbnail in assets/images/pubs/
  selected: true                # homepage + "Selected" filter
  note: '...'                   # short callout after the venue
  citekey: '...'                # override auto-generated key
  bibtex_authors: '...'         # override author parsing
```

**Author lists are surname-only**, matching samsledje.github.io. Two
things follow from that, and both matter:

- **Co-first/corresponding markers must be escaped: `\*`, `\+`.** A bare
  `*` is kramdown emphasis, and a *pair* of them italicises everything
  between — so `Sledzieski*, Singh*` would render as italics, not
  asterisks. Wrap the PI in `**...**` for bold.
- **BibTeX does not invert names**, because there are no given names to
  move. A multi-word entry is therefore a *compound surname* and gets
  brace-wrapped: `{Espejo Morales}`, `{Lavista Ferres}`. Without the
  braces BibTeX reads the first word as a forename and renders
  "Morales, E." If you ever write a full "First Last" name, set
  `bibtex_authors:` explicitly.

**Links: one paper link.** A DOI and a publisher PDF resolve to the same
article, so each entry shows a single `links.paper` (prefer the DOI — it's
stable), plus `links.code` if any, plus an always-present BibTeX button.
The bare `doi:` field is separate so a paper linked by PDF can still cite
a DOI.

**Citekeys** follow Google Scholar's convention —
`surname` + `year` + first title word, e.g. `sledzieski2021dscript`.
Generated in `_includes/bibtex.html`, which also:
- skips a leading article, so it's `…2026landscape` not `…2026the`
- folds accented Latin letters to ASCII, because a literal `ä` in a
  citekey breaks plain LaTeX (`schaffer2025…`)

### `_projects/*.md` (a collection, not a data file)

Per-publication project pages, structurally after
[eliahuhorwitz/Academic-project-page-template](https://github.com/eliahuhorwitz/Academic-project-page-template)
— title, authors with affiliations, link buttons, teaser, body, BibTeX —
but wearing this site's type and buttons rather than the template's
Bulma, and pared back: the template's YouTube embed, poster viewer and
image carousel were all built here and all removed again, because a talk
or a poster is a link button and a figure belongs beside the text about
it. What's left is a page that is one column of prose with a header.
`make project SLUG=… CITEKEY=…` starts one from `_projects/TEMPLATE.md`,
whose commented front matter is the field reference; nothing is repeated
here that the template already documents. Every field is optional except
`citekey`.

Four decisions are worth knowing before changing any of it.

**The link runs one way: project → paper.** A project page names its
paper with `citekey:`, and `_includes/publication.html` asks
`_includes/project-url.html` whether a page exists for the paper it is
rendering. So creating the file in `_projects/` is the entire job — the
"Project page" chip appears on `/publications/` and the homepage with no
edit to `publications.yml`, and deleting the file removes it. The
alternative (a `project:` key on each publication) would have been two
places to keep in step, against the site's whole premise.

**The body is all of the prose.** There is no `abstract:` front-matter
key: it only ever rendered as the first thing in the body, and splitting
the prose across YAML and markdown meant the opening paragraph was
edited somewhere different from every paragraph after it. The layout
gives `.project__body > p:first-child` a little more presence so the
opening still reads as a summary.

**Metadata is inherited, not restated.** Title, authors, venue, year,
`links.paper`, `links.code`, the teaser (falling back to the paper's
thumbnail) and the BibTeX all resolve from the matching entry in
`publications.yml` at render time. Any of them can be overridden by
setting the same key in front matter. One BibTeX generator still serves
the whole site — the project page includes `bibtex.html`, the same file
the dialogs use, just shown open instead of behind a button.

`status:` is the exception that is *not* inherited: the preprint /
in-press badge disambiguates a list of two dozen papers, and on a page
about one paper it's a label shouting beside the title while the venue
line underneath already says arXiv or bioRxiv. `/publications/` still
shows it.

**`page.title` is a trap here.** Jekyll never leaves it empty: with no
`title:` in front matter it titleizes the filename, so `planet-md.md`
claims to be called "Planet Md". The layout detects that (the fallback
slugifies straight back to the URL slug) and uses the paper's real title
for the `<h1>`. It cannot do the same for the `<title>` tag or the social
card, because `jekyll-seo-tag` reads `page.title` and no layout can reach
it — which is why `make project` writes a real `title:` into every new
page, and why it is a Ruby script (titles contain `&`, `:` and `/`; sed
would mangle them silently) rather than a line of sed in the Makefile.

**They live under `/publications/<slug>/`,** as children of the list they
hang off, while the directory stays `_projects/` — `site.publications`
sitting next to `site.data.publications` would be a needless trap. The
collection permalink and the `/publications/` page permalink don't
collide; a project slugged `index` would, and `bin/new-project.rb`
rejects that.

`TEMPLATE.md` carries `published: false`, which is what keeps it out of
the build and out of `site.projects`. `make project` strips that line;
copying by hand and forgetting to is the one way to get a page that
silently never appears.

**Figures go inline in the body, via `_includes/figure.html`.** There is
no gallery or carousel block — a strip of figures at the foot of the page
puts every figure somewhere other than the text explaining it, and a
carousel would additionally be the first content on the site reachable
only through JavaScript. The include exists because markdown can't do
either half of the job: it has nowhere to put a caption, and *a relative
image path in markdown resolves against the page URL*
(`/publications/<slug>/`), not against `assets/` — so
`![](assets/images/x.png)` 404s and there is no relative form that
works. Plain markdown with a site-root path is fine and picks up the
same framing; the CSS styles `.project__body p > img` alongside
`.project-figure__media` so the two can be mixed.

The one script a project page uses is the BibTeX Copy button, which now
accepts `data-copy="<id>"` naming the block to copy, since this one has
no dialog around it.

### `_research/*.md` (a collection, not a data file)

One file per area: front matter + a markdown body. Front matter carries
`title`, `slug` (the in-page anchor), `order` (position — **filenames
carry no numeric prefix**; `order:` is the single source of truth),
optional `image`, the card `blurb`, `papers:` (citekeys resolved against
`publications.yml`) and optional `links:`.

`/research/` renders overview cards that jump to anchored sections
further down the same page, after function.princeton.edu/research/.

**The `output:` flag in `_config.yml` switches two things at once.**
With `output: false` the areas appear only as sections of `/research/`.
With `output: true` each also gets its own page at `/research/<slug>/`
**and** the nav grows a Research dropdown listing them — the dropdown
detects the flag rather than needing a second list to maintain. Pages
use `_layouts/research-area.html`, which is wired via a front-matter
default; without that default, `output: true` emits bare markdown
fragments with no layout at all.

With `output: true` the detail sections are **not** repeated on
`/research/` — the cards link out instead. Publishing the same prose at
two URLs would split whatever search value it has and give readers two
places to find the same thing.

The flag is read in three places (nav, `/research/`, homepage cards) via
one include, `_includes/research-output.html`, so they can't disagree.

The dropdown is CSS-only: hover *or* `:focus-within` opens it, so it
works from the keyboard with no JavaScript. On mobile it sits open and
indented inside the collapsed menu instead of floating.

### `software.yml`

```yaml
- name: 'D-SCRIPT'
  area: 'Protein Networks'   # groups the page; order = first appearance
  logo: 'planet-md.png'      # square, transparent, assets/images/software/
  emoji: '🌿'                # stand-in when there's no logo; logo wins
  repo: 'owner/name'         # builds the GitHub URL
  home: 'https://...'        # use instead of repo for non-GitHub homepages
  stars: true                # live shields.io star badge
  blurb: '...'
  links: {pypi, docs, paper}
```

Logos must be **square** and transparent or light-background — the cards
are white. If a logo ships with a wordmark, crop to just the mark; the
name is already printed beside it (this is why MIMIC's logo is only the
circular mark). Both logo and emoji render in the same slot, sized by the
`--mark` variable.

### `news.yml`

`date:` must be `YYYY-MM-DD`. `text:` supports inline markdown. Newest
first; years group themselves. Drives both the homepage section and
`feed.xml`.

### `settings.yml`

`news_on_homepage`, `pubs_on_homepage`, and `people_groups` (headings +
order for the team page).

---

## Design system

All tokens are CSS custom properties in `:root` at the top of
`assets/css/main.scss`. Restyling means changing values there.

**Colour.** `_data/palette.yml` holds named palettes (`navy`, `sage`, …),
each defining the same set of role tokens; `palette: <name>` in
`_config.yml` picks which one renders. Default is navy: near-white
background, UCSD-adjacent navy primary, gold as the single accent, used
sparingly. Light-only by deliberate choice — all three reference labs
commit to a single light ground.

**Type — two families only.**
- `--display: PT Sans` — headings, wordmark. **Ships only 400 and 700**,
  so headings use 700; there is no 500 or 600 available.
- `--body: Aptos, "Public Sans", …` — body, UI, and small uppercase labels
  at weight 600. Aptos leads the stack on purpose: anyone with Office
  installed renders the PI's actual presentation font from their local
  copy, which is legitimate because the site isn't serving it. Aptos is
  proprietary (it's Bierstadt renamed) and **cannot be embedded as a
  webfont** without a paid MyFonts licence. Public Sans is what's served.
- `--code` — system monospace stack, used **only** for the BibTeX block
  and inline `code`. Costs no download. Small uppercase labels use the
  body face at 600, not a mono face.

**Layout invariants.**
- **One width for everything**: `--measure: 760px` on `.wrap`, which is
  the header, the footer, and every page's content. Set in one place so
  pages cannot drift apart — they did when some capped their content at a
  narrower reading measure while others filled a wide container. 760px
  keeps running text near 97 characters per line (measured in Public Sans
  at 17px; a 1180px container gave ~143, well past the comfortable
  45–75). There is no longer a separate `--text` token or
  `.text-column` helper; the container *is* the measure.
- `scroll-margin-top: 96px` on `[id]` and `:target` — without it the
  sticky header covers any heading you jump to (the homepage research
  cards link to `/research/#slug`).
- One breakpoint, 800px. Flex/grid throughout, no framework.
- No inline `style=` attributes; there are named utility classes instead.

**Marks (publication thumbnails, software logos).** Publication thumbs are
a left column with `padding: 11px` inside the frame — the extracted figures
are trimmed flush to their content and looked cramped without it. The
column was widened to compensate so the figure keeps its size. Software
marks are driven by a single `--mark` variable so the logo images and the
emoji stay the same size; the emoji font-size is **derived**,
`calc(var(--mark) / 0.96)`, from the measured glyph ratio.

---

## JavaScript

Two files, both loaded `defer`, both purely additive.

**`dialogs.js`** — generic modal handling for native `<dialog>`, used by
two things: the BibTeX box on each publication (with a Copy button) and a
lab member's biography, opened from their photo on `/team/`. The API is
`[data-dialog-open="id"]`, `[data-dialog-close]`, `[data-copy]` — and
`[data-copy="id"]`, which copies the `<code>` inside that element
instead of walking up to a dialog, for the open BibTeX block on a project
page. It was
called `bibtex.js` until the bio dialogs needed the same behaviour;
generalising beat a second copy of the same twenty lines. Every citation
is also emitted in a `<noscript>` block, so the BibTeX is reachable
without JS.

**`publications.js`** — search + group-by on `/publications/`. No-ops on
any page without `#pub-list`.

Two things about it are load-bearing:

- **It MOVES the existing publication nodes; it does not re-render them.**
  Each `.pub` contains its `<dialog>`, so moving the node keeps the dialog
  and its `id` intact and the BibTeX buttons keep working after a regroup.
  Re-rendering would break them.
- **The controls ship `hidden` in the markup and are revealed by JS.** The
  page arrives with the complete list already grouped by year, so without
  JS you get everything — and nobody is ever shown a search box that does
  nothing.

Search matches title + authors + the venue line. Because the venue renders
as "*Journal*, Year", **searching by year works** — `berger 2021` finds the
right paper. Terms are AND-ed.

### Testing the JS

There is no committed test suite. When changing `publications.js`, the
approach that worked was jsdom in a throwaway venv/npm dir:

```js
const dom = new JSDOM(html, { runScripts: 'outside-only' });
window.HTMLDialogElement.prototype.showModal = function () { … };  // jsdom lacks it
window.eval(bibtexJs); window.eval(publicationsJs);
```

Snapshot ground truth from the markup's `data-year` / `data-area` /
`data-selected` attributes *before* the scripts run, then assert against
that rather than hardcoding counts — the corpus grows. Worth covering:
grouping in both modes, search by author/title/journal/year, multi-term
AND, the selected filter composing with search *and* grouping, the empty
state, reset, and — most importantly — that all dialogs survive a regroup
with unique ids.

One caution: an early test asserted `berger 2021` should return 0. The
code was right and the test was wrong (the year is in the venue line).
Check which one is wrong before "fixing" the code.

---

## Deployment

Native GitHub Pages build — no Actions workflow, because the plugin list
stays inside GitHub's allowlist. **If you add a plugin outside that list,
GitHub silently skips it** and you'll need an Actions workflow instead.
Worth avoiding.

1. Push to a GitHub repo (**no remote is configured yet**).
2. Settings → Pages → Deploy from a branch, `main`, `/`.
3. Custom domain: add a `CNAME` file with the bare domain, point DNS at
   GitHub, update `url:` in `_config.yml`.

`recruiting.active` in `_config.yml` shows or hides the banner on every
page. `/join/` stays reachable from the nav regardless. (There used to be
a matching call-to-action block at the foot of the homepage; it was
removed as redundant with the banner and the nav item.)

---

## Gotchas and non-obvious decisions

**`assets/css/style.scss` is intentionally near-empty.** The
`github-pages` gem bundles all 13 official GitHub Pages themes, and one
leaks its own `assets/css/style.scss` into every build — ~77 KB of
normalize.css + Primer this site never links. Site files take precedence
over gem files, so this file shadows it. Don't delete it.

**`jekyll-feed` is deliberately absent.** It only indexes `_posts`, and
news lives in `_data/news.yml`. `feed.xml` is a hand-written Atom template
instead. News entries have no titles of their own, so each entry's title
is its first sentence with markdown stripped.

**`jekyll-seo-tag` 2.8 reads `image` from *page* front matter, not from
`_config.yml`.** So the social card is set as a front-matter **default**
(`defaults` → `scope: path: ""` → `image:`). Setting a site-level `image:`
key does nothing, and without a page-level image seo-tag also refuses to
upgrade the Twitter card to `summary_large_image`.

**The footer is one credit line, by design.** It used to carry the
address, a duplicate of the nav, and the social links. Those moved to the
Contact block at the foot of `/join/` (`_includes/contact.html`) — the nav
is already at the top of every page, and repeating it plus a mailing
address sitewide was more weight than it earned. `contact:` and `social:`
in `_config.yml` still drive that block, so there is one copy of those
values.

**`tagline` in `_config.yml` is SEO-only and is never displayed.** It
exists solely because `jekyll-seo-tag` uses it as the `<title>` suffix;
with no tagline it falls back to the full `description` and produces a
200-character title. It is kept factual (the department and university)
rather than a slogan — the lab deliberately has no marketing tagline,
and no template renders this value. If you delete it, check the
`<title>` on the homepage.

**The homepage `<h1>` is the site description** (`.hero__statement`),
not a headline. Every page needs an h1, and inventing a separate one for
the homepage would just reintroduce a tagline by another name. It is
styled as a readable statement rather than at display size.

**Homepage "Selected publications" shows only flagged papers.** The
original logic topped the list up with recent unflagged papers when fewer
than `pubs_on_homepage` were flagged — which put unselected work under a
heading reading "Selected". It now shows what's flagged, however few. The
only fallback is when *nothing* is flagged, so a new site isn't empty.

**Group headings must be `<h2>`.** Year and area headings on
`/publications/`, `/news/`, and `/software/` are real headings, not
`<div>`s — a screen reader otherwise gets a flat list of 24 papers with no
structure, and it fixes the `h1 → h3` skip. `publications.js` creates
`<h2>` too when it regroups. The homepage section eyebrows are also `h2`
(the `.eyebrow` class wins over the heading rule, so they look identical).

**The mobile nav checkbox is visually hidden but focusable.** It used to be
`display: none`, which cannot receive focus — that locked keyboard users
out of the menu entirely on small screens. It's now offscreen with
`role="switch"` and `aria-controls`.

**Contrast.** Body 13.4:1, footer 9.5:1, banner-on-navy 9.5:1 all pass
comfortably. Three fail WCAG and were **left as-is by explicit decision**:
link hover and the focus ring (both gold-dim at 1.99:1) and the search
placeholder (2.54:1). Don't "fix" these without asking — it was a
deliberate call, not an oversight.

**PMC and publisher sites block automated PDF fetching.** PNAS 403s,
PMC serves a bot interstitial, and Cell/Liebert/OUP are paywalled. Only
bioRxiv, arXiv, Nature Communications, PLOS, and mlsb.io were reachable
(11/24). The rest came from the PI's own reference library at
`~/samsl@mit.edu - Google Drive/My Drive/_LabNotebook/References`. Don't
try to route around access controls.

---

## Current placeholders — do not treat as final

Written by an LLM and awaiting the PI's own words:

- **`_research/*.md`** — all four area titles, blurbs and bodies
- **`_pages/join.md`** — the whole page, including the "Who belongs here"
  section, which is explicitly marked placeholder in an HTML comment
- **`_data/people.yml`** — three example members and one example alum
- **`_config.yml`** — `url:` (`sledzieskilab.org`) and the UCSD email were
  both guesses

Other outstanding items:

- **Publication `area:` values** are inferred, not the PI's taxonomy. They
  extend the `type:` vocabulary from his software.yml.
- **5 of 24 publications have no thumbnail** — `zaman2023virdtl`,
  `schaffer2025memoryefficient`, `ocitti2025rds`, `vizgaudis2024insulin`
  (not in the reference library) and `sledzieski2023parameterefficient`
  (its only main-body graphic is a supplementary panel).
- **D-SCRIPT's 📜 emoji is a placeholder.** It's a pun on the name and says
  nothing about what the tool does; the flagship tool deserves real
  artwork.
- **`assets/images/software/virdtl.svg` exists but is unwired** — a spiked
  virion in the site palette. Set `logo: 'virdtl.svg'` on VirDTL to use it
  (logo takes precedence over emoji). It was drawn because Unicode has no
  virus emoji: 🦠 is officially "microbe" and reads as bacteria.
- **`cb.csail.mit.edu/cb/topsyturvy/`** is no longer linked anywhere,
  since the Topsy-Turvy and TT3D software entries were folded into
  D-SCRIPT (they ship in that repo). Could be added back as a chip.
- **No `CNAME`, no git remote.**

---

## Verifying a change

Beyond `make check`, these are worth running after edits. Each caught a
real bug.

```sh
# heading order — no skipped levels on any page
python3 -c "
import re,glob,pathlib
for p in sorted(glob.glob('_site/**/*.html',recursive=True)):
    hs=re.findall(r'<h([1-6])[^>]*>',pathlib.Path(p).read_text())
    sk=[f'h{a}->h{b}' for a,b in zip(hs,hs[1:]) if int(b)>int(a)+1]
    print(('FAIL ' if sk else 'ok   ')+p, set(sk) or '')"

# every referenced local asset exists
python3 -c "
import re,glob,pathlib
site=pathlib.Path('_site')
for p in glob.glob('_site/**/*.html',recursive=True):
    for u in re.findall(r'(?:src|href)=\"(/assets/[^\"]+)\"',pathlib.Path(p).read_text()):
        t=site/u.split('?')[0].lstrip('/')   # strip the ?v= cache-buster
        if not t.exists(): print('MISSING',u,'in',p)"

# BibTeX sanity: unique, ASCII citekeys
python3 -c "
import re,html,pathlib
t=pathlib.Path('_site/publications/index.html').read_text()
k=[re.match(r'@\w+\{([^,]+),',html.unescape(b).strip()).group(1)
   for b in re.findall(r'bib-dialog__code\"><code>(.*?)</code>',t,re.S)]
print(len(k),'keys,',len(set(k)),'unique')
print('non-ascii:',[x for x in k if not re.fullmatch(r'[a-z0-9]+',x)] or 'none')"
```

And check the recruiting switch both ways — flip `recruiting.active` and
confirm the banner and homepage CTA appear and disappear together.
