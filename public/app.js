// Grab the articles as a json
$.getJSON('/api/articles', function(data) {
  // For each one
  for (let i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $('#articles').append(`
    <p class='article-title' style="cursor:pointer" data-id="${data[i]._id}">${data[i].title}<br />
    <p style="cursor:pointer" data-id="${data[i]._id}">${data[i].summary}<br />
    <a href="${data[i].link}" target="_blank">Read Article</a>
    </p>
    `);
  }
});


$(document).on('click', 'p', function() {
  $('#comments').empty();
  const thisId = $(this).attr('data-id');

  $.ajax({
    method: 'GET',
    url: '/api/articles/' + thisId,
  })
      .then(function(data) {
        console.log(data);
        $('#comments').append('<h2>' + data.title + '</h2>');
        $('#comments').append('<input id=\'titleinput\' name=\'title\' >');
        $('#comments').append('<textarea id=\'bodyinput\' name=\'body\'></textarea>');
        $('#comments').append('<button data-id=\'' + data._id + '\' id=\'savecomment\'>Save comment</button>');

        if (data.comment) {
          $('#titleinput').val(data.comment.title);
          $('#bodyinput').val(data.comment.body);
        }
      });
});

$(document).on('click', '#savecomment', function() {
  const thisId = $(this).attr('data-id');

  $.ajax({
    method: 'POST',
    url: '/api/articles/' + thisId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val(),
    },
  })
      .then(function(data) {
        console.log(data);
        $('#comments').empty();
      });

  $('#titleinput').val('');
  $('#bodyinput').val('');
});
