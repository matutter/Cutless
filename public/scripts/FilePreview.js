
/**
* Controls elements to support a file upload/preview.
*/
function FilePreview(opts) {
  
  this.name = 'FilePreview'
  this.container = $(opts.container);
  this.browse_btn = $(opts.btn);
  this.clear_btn = $(opts.clear);

  this.active_class = opts.active_class || 'active';
  this.input = this.container.find('input:file');
  this.default_image = this.container.find('.default-image');
  this.preview_image = this.container.find('.preview-image');
  
  var self = this;
  this.browse_btn.click(function(evt) {
    console.log(self.name, $(this), evt.type);
    self.input.trigger(evt.type);
  });
  this.clear_btn.click(function(evt) {
    console.log(self.name, $(this), evt.type);
    self.clearPreview();
  });
  this.input.change(function(evt) {
    console.log(self.name, $(this), evt.type);
    self.loadPreview();
  });
}

/**
* Resets `this.input` value, removes preview, and shows default.
*/
FilePreview.prototype.clearPreview = function() {
  var input = this.input;
  var container = this.container;
  var default_image = this.default_image;
  var preview_image = this.preview_image;

  document.getElementById(input.attr('id')).value = "";

  container.removeClass('active');
  preview_image.fadeOut(function() {
    default_image.fadeIn();
    preview_image.empty();
  });
};

/**
* Load and display the file in the `this.input` input and hide the default.
*/
FilePreview.prototype.loadPreview = function() {
  
  var input = this.input;
  var container = this.container;
  var active_class = this.active_class;
  var preview_image = this.preview_image;
  var default_image = this.default_image;
  var reader = new FileReader();
  var image_url = null;
  
  if(!(input[0].files && input[0].files[0])) {
    return;
  }
  
  image_url = input[0].files[0];
  
  reader.addEventListener('load', function(e) {
    preview_image.hide().empty();

    var img = $(document.createElement('img'))
      .attr('src', e.target.result)
      .addClass('img-fluid');

    preview_image.append(img);
    if(active_class) {
      container.addClass(active_class);
    }

    default_image.fadeOut(function() {
      preview_image.fadeIn();
    });
  });

  reader.readAsDataURL(image_url);
};
