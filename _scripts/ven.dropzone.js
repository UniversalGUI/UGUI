






/////////////////////////////////////////////////////////////////
//                                                             //
//                          DROPZONE                           //
//                                                             //
/////////////////////////////////////////////////////////////////
// Code for drag/drop/browse box.                              //
/////////////////////////////////////////////////////////////////

// https://github.com/jaysalvat/ezdz
$(function() {

  $('#DropZone').on('dragover', function() {
    $(this).addClass('hover');
  });

  $('#DropZone').on('dragleave', function() {
    $(this).removeClass('hover');
  });

  $('#DropZone input').on('change', function(e) {
    var file = this.files[0];

    $('#DropZone').removeClass('hover');

    if (this.accept && $.inArray(file.type, this.accept.split(/, ?/)) == -1) {
      return alert('File type not allowed.');
    }

    $('#DropZone').addClass('dropped');
    $('#DropZone img').remove();

    if ((/^image\/(gif|png|jpeg)$/i).test(file.type)) {
      var reader = new FileReader(file);

      reader.readAsDataURL(file);

      reader.onload = function(e) {
        var data = e.target.result,
            $img = $('<img />').attr('src', data).fadeIn();

        $('#DropZone div').html($img);
      };
    } else {
      var ext = file.name.split('.').pop();

      $('#DropZone div').html(ext);
    }
  });
});







