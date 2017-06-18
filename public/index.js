function updatePreviewImage() {
  var input = $(this);
  var target = $(input.attr('data-target'));
  if(target.is('.image-preview-container')) {
    var default_image = target.find('.default-image').first();
    var preview_image = target.find('.preview-image').first();

    if (input[0].files && input[0].files[0]) {
      var reader = new FileReader();
      var image_url = input[0].files[0];
      
      reader.addEventListener('load', function(e) {
        default_image.fadeOut(function() {
                  
          var img = $(document.createElement('img'))
            .attr('src', e.target.result).addClass('rounded img-fluid')
            //.attr('width', 80)
            //.attr('height', 80);
          
          preview_image.hide().empty().append(img).fadeIn();
        });
      });

      reader.readAsDataURL(image_url);
    }
  }
}

$(document).ready(function() {
  
  $('#image-input-btn').click(function(e) {
    var target = $(this).attr('data-target');
    var input = $(target);
    var data = input.data();
    input.trigger('click')
    
    if(data.has_this_event_listener)
      return;
    
    data.has_this_event_listener = true;
    
    input.on('change', updatePreviewImage);
  });
  
  // enables tooltips
  $('[data-toggle="tooltip"]').tooltip()
  
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
