/* Publications page: search + group-by controls.

   Progressive enhancement — the page ships a complete list grouped by
   year; this script reveals the controls and takes over grouping. It
   MOVES the existing publication nodes rather than re-rendering them,
   so each entry keeps its <dialog> and the BibTeX buttons keep working. */

(function () {
  'use strict';

  var list = document.getElementById('pub-list');
  if (!list) return;

  var controls   = document.getElementById('pub-controls');
  var search     = document.getElementById('pub-search');
  var count      = document.getElementById('pub-count');
  var empty      = document.getElementById('pub-empty');
  var groupBtns  = controls ? controls.querySelectorAll('[data-group]') : [];
  var showBtns   = controls ? controls.querySelectorAll('[data-show]') : [];

  // ---- index the entries once ----
  var entries = Array.prototype.map.call(
    list.querySelectorAll('.pub'),
    function (node) {
      // Build the haystack from rendered text, not a data attribute, so
      // quotes and punctuation in titles can't break anything. Read only
      // the bibliographic fields — the BibTeX dialog is also inside .pub
      // and would otherwise make every paper match "article".
      var pick = function (sel) {
        var el = node.querySelector(sel);
        return el ? el.textContent : '';
      };
      return {
        node: node,
        year: node.getAttribute('data-year') || '',
        area: node.getAttribute('data-area') || 'Other',
        selected: node.getAttribute('data-selected') === 'true',
        text: (pick('.pub__title') + ' ' + pick('.pub__authors') + ' ' + pick('.pub__venue'))
                .toLowerCase().replace(/\s+/g, ' ')
      };
    }
  );
  if (!entries.length) return;

  // Area order: most papers first. Ranked over the WHOLE corpus, not the
  // currently visible set — ranking the filtered set would reshuffle the
  // headings on every keystroke. Ties break alphabetically, and the
  // catch-all "Other" is always last regardless of size.
  var areaCounts = {};
  entries.forEach(function (e) {
    areaCounts[e.area] = (areaCounts[e.area] || 0) + 1;
  });
  var areaRank = {};
  Object.keys(areaCounts)
    .sort(function (a, b) {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return areaCounts[b] - areaCounts[a] || a.localeCompare(b);
    })
    .forEach(function (name, i) { areaRank[name] = i; });

  // Remove the server-rendered headings; render() puts them back.
  Array.prototype.forEach.call(
    list.querySelectorAll('[data-group-heading]'),
    function (h) { h.parentNode.removeChild(h); }
  );

  var groupBy = 'year';
  var showOnlySelected = false;

  function render() {
    var q = (search && search.value || '').trim().toLowerCase();
    var terms = q ? q.split(/\s+/) : [];

    // The two filters compose: "Selected" narrows the pool, then every
    // search term must appear somewhere in what's left. So "selected
    // + berger" means both, not either.
    var matches = entries.filter(function (e) {
      if (showOnlySelected && !e.selected) return false;
      return terms.every(function (t) { return e.text.indexOf(t) !== -1; });
    });

    // Bucket by the active key.
    var buckets = {};
    matches.forEach(function (e) {
      var k = groupBy === 'year' ? e.year : e.area;
      (buckets[k] || (buckets[k] = [])).push(e);
    });

    var keys = Object.keys(buckets);
    if (groupBy === 'year') {
      keys.sort(function (a, b) { return Number(b) - Number(a); });   // newest first
    } else {
      // Fixed ranking computed above, so the order stays put while
      // filtering; an area unknown to the ranking sorts last.
      keys.sort(function (a, b) {
        var ra = areaRank[a], rb = areaRank[b];
        if (ra === undefined) return 1;
        if (rb === undefined) return -1;
        return ra - rb;
      });
    }

    // Detach everything, then re-append in the new order. Moving a node
    // that is already in the document relocates it, so nothing is lost.
    var frag = document.createDocumentFragment();
    entries.forEach(function (e) {
      if (e.node.parentNode) e.node.parentNode.removeChild(e.node);
    });
    Array.prototype.forEach.call(
      list.querySelectorAll('[data-group-heading]'),
      function (h) { h.parentNode.removeChild(h); }
    );

    keys.forEach(function (k) {
      var h = document.createElement('h2');   // real heading, not a div
      h.className = 'pub-year';
      h.setAttribute('data-group-heading', '');
      h.textContent = k;
      frag.appendChild(h);
      buckets[k].forEach(function (e) { frag.appendChild(e.node); });
    });
    list.appendChild(frag);

    // Status line whenever either filter is narrowing the list, so it's
    // always clear that what's on screen isn't everything.
    if (count) {
      var filtering = terms.length > 0 || showOnlySelected;
      count.hidden = !filtering;
      if (filtering) {
        count.textContent = matches.length + ' of ' + entries.length +
          (entries.length === 1 ? ' publication' : ' publications') +
          (showOnlySelected ? ' · selected only' : '');
      }
    }
    if (empty) {
      empty.hidden = matches.length !== 0;
      empty.textContent = showOnlySelected && !terms.length
        ? 'No publications are marked as selected yet.'
        : 'No publications match that search.';
    }
  }

  // ---- wire up ----
  if (controls) controls.hidden = false;

  if (search) {
    search.addEventListener('input', render);
    // Esc clears the field rather than only clearing the browser's own UI
    search.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { search.value = ''; render(); }
    });
  }

  // Both segmented controls behave the same way: press one, unpress its
  // siblings, re-render.
  function wireSegmented(nodes, onPick) {
    Array.prototype.forEach.call(nodes, function (btn) {
      btn.addEventListener('click', function () {
        onPick(btn);
        Array.prototype.forEach.call(nodes, function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        render();
      });
    });
  }

  wireSegmented(groupBtns, function (btn) {
    groupBy = btn.getAttribute('data-group');
  });
  wireSegmented(showBtns, function (btn) {
    showOnlySelected = btn.getAttribute('data-show') === 'selected';
  });

  render();
})();
