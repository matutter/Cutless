$(document).ready(function() {
  
  //SwapElements([$('#image-input-clear'), $('#image-input-btn')]);
  $('#delete-image-btn').click(function() {
    var input = $(this).find('input:checkbox').first();

    if(input.length != 1) {
      throw new Error('No checkbox inside of element.', this);
    }
    
    var checked = !(input[0].checked ? true : false);
    var collapse = $(this).find('.collapse');
    input.prop('checked', checked);
    if(checked) {
      collapse.show();
    } else {
      collapse.hide();
    }
  });
  
  var file_preview = new FilePreview({
    container: '#avatar-preview',
    clear: '#image-preview-clear',
    btn: '#image-preview-btn'
  });  
  
  // enables tooltips
  $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'});
  
  //console.log('index - loaded');
  var page_links = $('#page-nav a');
  if(page_links.length > 0) {
    var pathname = window.location.pathname.split(/[#?]/)[0];
    var active = page_links.toArray().map($).find(function(el) {
      return el.attr('href') == pathname;
    });
    if(active.length == 1) {
      page_links.removeClass('active');
      active.addClass('active');
    }
  }
  
});
