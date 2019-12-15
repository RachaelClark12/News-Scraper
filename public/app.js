// Grab the articles as a json
$.getJSON('/api/articles', function(data) {
  // For each one
  for (let i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $('#articles').append(`
    <p style="cursor:pointer" data-id="${data[i]._id}">${data[i].title}<br />
    <a href="${data[i].link}" target="_blank">&#9758;</a>
    </p>
    `);
  }
});


$(document).on('click', 'p', function() {
  $('#notes').empty();
  const thisId = $(this).attr('data-id');

  $.ajax({
    method: 'GET',
    url: '/api/articles/' + thisId,
  })
      .then(function(data) {
        console.log(data);
        $('#notes').append('<h2>' + data.title + '</h2>');
        $('#notes').append('<input id=\'titleinput\' name=\'title\' >');
        $('#notes').append('<textarea id=\'bodyinput\' name=\'body\'></textarea>');
        $('#notes').append('<button data-id=\'' + data._id + '\' id=\'savenote\'>Save Note</button>');

        if (data.note) {
          $('#titleinput').val(data.note.title);
          $('#bodyinput').val(data.note.body);
        }
      });
});

$(document).on('click', '#savenote', function() {
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
        $('#notes').empty();
      });

  $('#titleinput').val('');
  $('#bodyinput').val('');
});
