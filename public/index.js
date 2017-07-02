user = undefined;

$(document).ready(function() {
  
  $('.timeago').timeago();
  
  $(document).find('meta.user-data').each(function() {
    var user_obj = { length: 0 };
    $.each(this.attributes, function(i, attrib){
      var name = attrib.name;
      var value = attrib.value;
      if(name == 'class') return;
      user_obj[name] = value;
      user_obj.length++;
    });
    if(user_obj.length) {
      user = user_obj;
    }
  });
  
  if(user) {
    $('.event').each(function() {
      var text = $(this).html();
      text = text.replace(user._id, user.name);
      $(this).html(text);
    });
  }
  
  $('#show-password-form').click(function() {
    var target = $(this).attr('data-target')
    console.log(target)
    $(target).collapse('toggle');
  });
  
  var toggle_btn = new ToggleButton('#delete-image', {tooltip: 1});
  
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
