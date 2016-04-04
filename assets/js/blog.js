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

$('#submit-post').click(function(event){
  event.preventDefault();
  
  function successCallback(data){
    location.href = location.protocol+'//'+location.host+data.redirect;
  }
  function failCallback(data){
    $('#post-submission-error').html("Error: Post failed to submit");
  }

  if (post_body_simplemde.value().trim() !== '') {
    if($('#post-title').val() !== ''){
      var url = location.protocol+'//'+location.host+location.pathname;
      var data = {
        body: post_body_simplemde.value(),
        title: $('#post-title').val(),
      };
      $.post(url,data,successCallback).fail(failCallback);
    } else {
      $('#post-submission-error').html("Error: Post does not have a title");
    }
  } else {
    $('#post-submission-error').html("Error: Post does not have a body");
  }
});