/**
* @file
* JS to force maximum length of textarea.  Also warns of unmet minimum.
*/

(function () {
  window.addEventListener('load', function () {
    var checkLength = function (el, span, max, min, e) {
      e = e || window.event;
      var target = e !== undefined ? e.target : el;
      var length = target.value ? target.value.length : 0;
      var selectionLength = e !== undefined && (e.type == 'paste' || e.type == 'drop') ?
        target.selectionEnd - target.selectionStart : 0;
      var addedLength;
      if (e === undefined) {
        addedLength = 0;
      }
      else if (e.dataTransfer !== undefined) {
        addedLength = e.dataTransfer.getData('text/plain').length;
      }
      else if (e.clipboardData !== undefined) {
        addedLength = e.clipboardData.getData('text/plain').length;
      }
      else if (window.clipboardData !== undefined) {
        addedLength = window.clipboardData.getData('Text').length;
      }
      else {
        // Typed character.
        addedLength = 1;
      }
      span.textContent = length + '/' + max + ' characters';
      // Textarea content length less selection
      // plus text to add (by keystroke, paste, or drop).
      var newLength = length - selectionLength + addedLength;
      if (max < newLength) {
        span.textContent += ' | Typing, pasting, and dragging text that would exceed the limit is not allowed.';
        span.style.color = '#d22';
        if (e !== undefined && (e.keyCode === 32 || ('' + e.keyCode > 47 && e.metaKey !== true) || e.type == 'paste' || e.type == 'drop' || e.type == 'input')) {
          e.preventDefault();
          return false;
        }
      }
      else if ((min + 1) > newLength) {
        span.style.color = '#d22';
      }
      else {
        span.style.color = 'inherit';
      };
    };
    var limited = document.querySelectorAll('textarea[data-max_length]');
    for (var i = 0; i < limited.length; i++) {
      (function (el, checkLength) {
        var min = (el.hasAttribute("data-min_length")) ? parseInt(el.getAttribute("data-min_length")) : -1;
        var max = parseInt(el.getAttribute("data-max_length"));
        var span = document.createElement("span");
        el.parentNode.insertBefore(span, el.nextSibling);
        var checkLengthWrapper = function (e) {
          checkLength(el, span, max, min, e);
        };
        el.addEventListener('keydown', checkLengthWrapper);
        el.addEventListener('cut', checkLengthWrapper);
        el.addEventListener('paste', checkLengthWrapper);
        el.addEventListener('change', checkLengthWrapper);
        el.addEventListener('drop', checkLengthWrapper);
        el.addEventListener('input', checkLengthWrapper);
        checkLengthWrapper();
      })(limited[i], checkLength);
    }
  });
})();
