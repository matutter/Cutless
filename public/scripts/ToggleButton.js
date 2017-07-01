
function ToggleButton(selector, opts) {
  
  opts = opts || {};
  
  var container = $(selector);
  var toggle_elements = container.find('.collapse');
  var checked = false;
  var tooltips = [];
  var input = (function() {
    
    input = container.find(':checkbox').first();
    if(input.length === 0) {
      input = $(document.createElement('input'))
      input.prop('type', 'checkbox')
        .prop('name', container.prop('name'))
      input.hide();
      container.append(input);
    }
    
    return input;
  }).call(this);
  
  container.click(function() {
    toggle_elements.toggle();
    checked = !(input[0].checked ? true : false);
    input.prop('checked', checked);
    if(opts.tooltip) {
      tooltips = tooltips.reverse();
      container.attr('data-original-title', tooltips[0]).tooltip('show');
    }
  });
  
  if(opts.tooltip) {
    tooltips.push(container.attr('title'));
    tooltips.push(container.attr('alt-title'));
  }
  
  this.container = container;
  this.input = input;
  this.val = function() {
    return checked;
  };
}
