/**
* Toggles two elements back and forth so that only 1 is visible at a time.
*/
function SwapElements(elems) {
  var a = $(elems[0]);
  var b = $(elems[1]);
  var toggle = function() {
    var tmp = a;
    a = b;
    b = tmp;
    a.hide();
    b.show();
    b.parent().append(b);
  };
  
  a.on('click reject', toggle);
  b.on('click reject', toggle);
}
