/* Modal dialogs — generic open/close/copy for native <dialog>.

   Two users today:
     - BibTeX per publication (with a Copy button)
     - a lab member's biography, opened from their photo on /team/

   Attributes:
     [data-dialog-open="id"]  opens the <dialog> with that id
     [data-dialog-close]      closes the dialog it sits inside
     [data-copy]              copies the enclosing dialog's <code>
     [data-copy="id"]         copies the <code> inside the element with
                              that id — used by the open BibTeX block on
                              a project page, which has no dialog around it

   Purely additive. Without JS, citations remain in a <noscript> block
   beside each entry, and a member's bio is in the page as the dialog's
   own markup — a browser that ignores <dialog> shows it inline rather
   than hiding it.  */

(function () {
  'use strict';

  document.addEventListener('click', function (e) {
    // --- open ---
    var opener = e.target.closest('[data-dialog-open]');
    if (opener) {
      var dlg = document.getElementById(opener.getAttribute('data-dialog-open'));
      if (dlg && typeof dlg.showModal === 'function') dlg.showModal();
      return;
    }

    // --- close ---
    if (e.target.closest('[data-dialog-close]')) {
      var d = e.target.closest('dialog');
      if (d) d.close();
      return;
    }

    // --- copy ---
    var copier = e.target.closest('[data-copy]');
    if (copier) {
      // An id in the attribute names the block to copy; without one,
      // copy from the dialog the button sits in.
      var target = copier.getAttribute('data-copy');
      var host = target ? document.getElementById(target) : copier.closest('dialog');
      var code = host && (host.querySelector('code') || host);
      if (!code) return;
      var text = code.textContent;

      var done = function () {
        var was = copier.textContent;
        copier.textContent = 'Copied';
        copier.classList.add('is-copied');
        setTimeout(function () {
          copier.textContent = was;
          copier.classList.remove('is-copied');
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { selectFallback(code); });
      } else {
        selectFallback(code);
      }
      return;
    }

    // --- click the backdrop to dismiss ---
    // A click on <dialog> itself (not its children) is a backdrop click,
    // since the content sits in nested elements.
    if (e.target.tagName === 'DIALOG') e.target.close();
  });

  // If the clipboard API is unavailable or blocked, select the text so
  // the reader can copy it manually.
  function selectFallback(code) {
    var range = document.createRange();
    range.selectNodeContents(code);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
})();
