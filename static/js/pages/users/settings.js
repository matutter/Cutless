/**
* local script for /users/settings
*/

if(!window.dropclient) throw Error('This module must be loaded after dropclient.js!')

$.dropclient.run(function() {

  console.log('user plugin loaded')

  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ];

  var bio_editor = '#biography-editor'
  var Delta = Quill.import('delta');
  var quill = new Quill(bio_editor, {
    modules: {
      toolbar: toolbarOptions
    },
    placeholder: 'There is nothing in your bio...',
    theme: 'snow'
  });
  
  var delta = {
    ops: [
      { insert: 'Gandalf', attributes: { bold: true } },
      { insert: ' the ' },
      { insert: 'Grey', attributes: { color: '#ccc' } }
    ]
  };

  quill.setContents(delta);

  var change = new Delta();
  quill.on('text-change', function(delta) {
    change = change.compose(delta);
  });

  // Save periodically
  setInterval(function() {
    if (change.length() > 0) {
      console.log('Saving changes', quill.getContents());
      //console.log('Saving changes', change);


      /* 
      Send partial changes
      $.post('/your-endpoint', { 
        partial: JSON.stringify(change) 
      });
      
      Send entire document
      $.post('/your-endpoint', { 
        doc: JSON.stringify(quill.getContents())
      });
      */
      change = new Delta();
    }
  }, 5*1000);

});
