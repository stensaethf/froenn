var setupSimpleMDE = function(id) {
  $('#'+id).next().next().find('.CodeMirror-scroll').css('min-height', '50px');
  $('#'+id).parent().find('.CodeMirror').css('min-height', '50px');
};

if ($('#post-body') && $('#post-body').length) {
  var post_body_simplemde = new SimpleMDE({element: document.getElementById("post-body"), hideIcons: ['fullscreen', 'guide', 'side-by-side'], autofocus: true, initialValue: $('#post-body').val()});
  if (post_body_simplemde._rendered) {
    setupSimpleMDE('post-body');
  }
}