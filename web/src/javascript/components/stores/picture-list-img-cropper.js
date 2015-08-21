/*
 * Copyright (c) Interactive Information R & D (I2RD) LLC.
 * All Rights Reserved.
 *
 * This software is confidential and proprietary information of
 * I2RD LLC ("Confidential Information"). You shall not disclose
 * such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered
 * into with I2RD.
 */

/**
 * Example client side image cropper integration for MIWT.
 * @requires dnd-file.js
 * @requires jquery.js
 * @requires jquery.color.js
 * @requires jquery.Jcrop.js
 * @requires jquery.Jcrop.css
 */
(function (w, d, $) {
  var PICTURE_SELECTOR = '.picture-editor';
  var CROPPED_PICTURE_DATA = 'cropped-picture-data[data-url]1';
  var CROPPED_PICTURE_NAME = 'cropped-picture-data[data-url]1[name]';
  var CROP_SELECTION_MIN_BOX_WIDTH = 20;
  var CROP_SELECTION_MIN_BOX_HEIGHT = 20;
  
  var TEXT_ASPECT_RATIO_CONTROL_LABEL = 'Lock Aspect Ratio';
  var TEXT_ASPECT_RATIO_LOCKED_MESSAGE = 'Uncheck the box to crop outside of aspect ratio.';
  var TEXT_ASPECT_RATIO_UNLOCKED_MESSAGE = 'Check the box to crop within aspect ratio.';
  var TEXT_NO_CROP_MESSAGE = 'The image\'s size is too small to crop. You can drag & drop a different image.';
  
  var CSS_CANCEL_BUTTON_CLASS = 'cancel';
  var CSS_NO_IMAGE_CLASS = 'no-image-selected';
  var CSS_HIDDEN_CLASS = 'hidden';
  var CSS_UNLOCKED_CLASS = 'unlocked';
  var CSS_LOCKED_CLASS = 'locked';
  
  //Modification from original image cropper
  var IS_IN_INIT = false;
  
   var $aspectRatioOption = $([
    '<div class="option opt-aspect-ratio">',
    '<label><input type="checkbox" name="jcrop-aspect-ratio" checked="checked" /> '+ TEXT_ASPECT_RATIO_CONTROL_LABEL +'</label>',
    '<div class="message message-locked">' + TEXT_ASPECT_RATIO_LOCKED_MESSAGE  + '</div>',
    '<div class="message message-unlocked">' + TEXT_ASPECT_RATIO_UNLOCKED_MESSAGE + '</div>',
    '</div>'].join(''));
  
  var dnd, img, canvas, jcrop;
  var cropSettings = {
    minWidth: 200,
    minHeight: 300,
    maxWidth: 250,
    maxHeight: 375,
    prescaleMaxWidth: 500,
    prescaleMaxHeight: 450,
    aspectRatio: 0.66666
  };
  
  function resize(el, w, h) {
    el.width = w;
    el.height = h;
    el.style.width = w + 'px';
    el.style.height = h + 'px';
  }
  
  function updateImage(img) {
    if(jcrop) jcrop.destroy();
    // jcrop will set these, need to clear them when updating the image.
    img.style.display=null;
    img.style.visibility=null;
    img.style.width=null;
    img.style.height=null;
    var w =  img.width;
    var h = img.height;
    var dropZone = dnd.getDropZone();
    var wrapper = img.parentNode; // Should be a jcrop-wrapper
    
    // Delete all elements from the wrapper, then add the image back.
    while (wrapper.childNodes[0]) wrapper.removeChild(wrapper.childNodes[0]);
    wrapper.appendChild(img);
    
    var aspectRatio = cropSettings.aspectRatio;
    var minWidth = Math.min(w, cropSettings.minWidth);
    var minHeight = Math.min(h, cropSettings.minHeight);
    var maxWidth = cropSettings.maxWidth;
    var maxHeight = cropSettings.maxHeight;
    var scaledWidth = w;
    var scaledHeight = h;
    var scale = 1;
    var horizontalScale = 1, verticalScale = 1;
    
    //check for scale factors if it is larger than the prescalemaxs
    if ((w > cropSettings.prescaleMaxWidth && h > w) || (h > cropSettings.prescaleMaxHeight)) {
      verticalScale = h / cropSettings.prescaleMaxHeight;
    }
    if ((w > cropSettings.prescaleMaxWidth && w > h) || (w > cropSettings.prescaleMaxWidth)) {
      horizontalScale = w / cropSettings.prescaleMaxWidth;
    }
    
    scale = Math.max(verticalScale, horizontalScale);
    
    //scale all relevant numbers
    maxWidth *= scale;
    maxHeight *= scale;
    minWidth *= scale;
    minHeight *= scale;
    scaledWidth /= scale;
    scaledHeight /= scale;
    
    //if the scale now makes the selection bigger than the size of the scaled resource, 
    //reduce the selection box to the smallest dimension taking into consideration aspect ratio
    if (maxWidth > w) {
      maxWidth = w;
      maxHeight = w / aspectRatio;
    }
    if (maxHeight > h) {
      maxWidth = h * aspectRatio;
      maxHeight = h;
    }
    if (minWidth > maxWidth) {
      minWidth = maxWidth;
      minHeight = maxWidth / aspectRatio;
    }
    if (minHeight > maxHeight) {
      minWidth = maxHeight * aspectRatio;
      minHeight = maxHeight;
    }
    
    resize(dropZone, scaledWidth, scaledHeight);
    resize(canvas, scaledWidth, scaledHeight);
    canvas.getContext('2d').drawImage(img, 0, 0, scaledWidth, scaledHeight);
    // keySupport == false required to prevent "jumping" when clicking on the image
    var options = {
      aspectRatio: aspectRatio, 
      onSelect: cropImage, 
      keySupport: false,
      setSelect: [0, 0, Math.max(minWidth, CROP_SELECTION_MIN_BOX_WIDTH), Math.max(minHeight, CROP_SELECTION_MIN_BOX_HEIGHT)],
      minSize: [minWidth, minHeight], 
      maxSize: [maxWidth, maxHeight],
      boxWidth: cropSettings.prescaleMaxWidth,
      boxHeight: cropSettings.prescaleMaxHeight,
      bgOpacity: 0
    };
    
    $(document.getElementById(img.id)).Jcrop(options, function () {
        jcrop = this;
    });
  }
  
  function loadImage(imgFile) {
    if (!imgFile.type.match(/image.*/)) return;
    var reader = new FileReader();
    reader.onload = function (e) { img.src = e.target.result; };
    reader.readAsDataURL(imgFile);
  }
  
  function clearCroppedImageData() {
    d.getElementById(CROPPED_PICTURE_DATA).value = '';
  }
  
  function cropImage(crop) {
    var w = crop.x2 - crop.x;
    var h = crop.y2 - crop.y;
    var cropped = d.createElement('canvas');
    resize(cropped, w, h);
    cropped.getContext('2d').drawImage(img, crop.x, crop.y, w, h, 0, 0, w, h);
    d.getElementById(CROPPED_PICTURE_DATA).value = cropped.toDataURL('image/jpeg', 0.75);
  }
  
  function filesSelected(fileList) {
    if(fileList && fileList.length > 0)
      loadImage(fileList[0]);
    dnd.clearFileInput();
  }
  
  function createHiddenInput(id, name, value) {
    var dataInput = d.createElement('input');
    dataInput.type = 'hidden';
    dataInput.name = name;
    dataInput.id = id;
    dataInput.value = value;
    return dataInput;
  }
       
  function onSubmitHandeler() {
    var btnhitId = $(this).find('input[name=btnhit]').val();
    
    if (btnhitId.length) {
      var $btnhitEl = $(document.getElementById(btnhitId));
      if ($btnhitEl.length 
          && $btnhitEl.closest(PICTURE_SELECTOR).length
          && $btnhitEl.hasClass(CSS_CANCEL_BUTTON_CLASS)) {
        clearCroppedImageData();
      }
    }
    
    return true;
  }
  
  function updateAspectRatioControlUI() {
    var $checkbox = $aspectRatioOption.find('input');
    $aspectRatioOption.addClass($checkbox.prop('checked') ? CSS_LOCKED_CLASS : CSS_UNLOCKED_CLASS).removeClass($checkbox.prop('checked') ? CSS_UNLOCKED_CLASS: CSS_LOCKED_CLASS);
  }
  
  function init() {
    var $pictureEditor = $(PICTURE_SELECTOR);
    var dropZone = d.querySelector(PICTURE_SELECTOR + ' .drop-zone');
    if(!dropZone || d.getElementById(CROPPED_PICTURE_DATA)) return;
    if(!d.querySelector(PICTURE_SELECTOR + ' .drop-zone .jcrop-wrapper')) return;
    img = $(PICTURE_SELECTOR).hasClass(CSS_NO_IMAGE_CLASS) ? null : d.querySelector(PICTURE_SELECTOR + ' img');
    var input = d.querySelector(PICTURE_SELECTOR + ' input[type=file]');
    if (!input || '_img_cropper' in input) {
      return;
    }

    var config = $pictureEditor.data();
    if(config) {
      $.each(config, function(key, val) {
        if (typeof cropSettings[key] === "undefined") {
          return;
        }
        cropSettings[key] = config[key];
      });
    }

    $pictureEditor.prepend($aspectRatioOption);
    updateAspectRatioControlUI();

    input._img_cropper = true;
    canvas = d.createElement('canvas');
    canvas.id = "cropper-canvas";
    dropZone.appendChild(canvas);
    dropZone.appendChild(createHiddenInput(CROPPED_PICTURE_DATA, input.id +  '[data-url]1', ''));
    dropZone.appendChild(createHiddenInput(CROPPED_PICTURE_NAME, input.id +  '[data-url]1[name]', 'img.png'));
    if (dnd) { dnd.destroy(); }
    dnd = new cms.file.DnD(input, dropZone);

    if (!img) {
      img = d.createElement("img");
      $(img).appendTo(PICTURE_SELECTOR + ' .drop-zone .jcrop-wrapper');
      canvas.getContext('2d').fillText('Drop image here or choose below', 75, 80);
    } else {
      if(img.complete) {
        updateImage(img);
      }
    }
    function updateImageOnLoad(){ updateImage(img); }
    img.addEventListener('load', updateImageOnLoad, false);
    if (!img.id) img.id = input.id + "-picture";

    dnd.addListener(filesSelected);

    $aspectRatioOption.on('change', 'input', function(evt) {
      if(!jcrop) {
        return; 
      }
      jcrop.setOptions(this.checked? { aspectRatio: cropSettings.aspectRatio }: {aspectRatio: 0});
      jcrop.focus();

      updateAspectRatioControlUI();
    });

    d.removeEventListener('DOMContentLoaded', init);
    //Modification from original image cropper
    d.removeEventListener('DOMSubtreeModified', init);
  }
  
  /****************************************************************
   * NOTE: This is app specific implementation.  
   * This part may need updates to work with your app
   * 
   * ex: 
   * HTMLFormElement.prototype.submit_options = {postUpdate: init};
   ****************************************************************/
  d.addEventListener('DOMContentLoaded', function() {
    $('.miwt-form ' + PICTURE_SELECTOR).each(function() {
      var $form = $(this).closest('.miwt-form');
      var form = $form.get(0);
      var origSubmitOptionsPostUpdate = $.noop;
      if (typeof form.submit_options !== 'undefined' && typeof form.submit_options.postUpdate !== 'undefined') {
        origSubmitOptionsPostUpdate = form.submit_options.postUpdate;
      }
      
      form.submit_options = {
        postUpdate: function() {
          origSubmitOptionsPostUpdate();
          init();
        },
        onSubmit: onSubmitHandeler
      };
    });
    
    init();
  });
  //Modification from original img-cropper:  Added below eventListener
  d.addEventListener('DOMSubtreeModified', function() {
    if(!IS_IN_INIT) {
      IS_IN_INIT = true;
      init();
      IS_IN_INIT = false;
    }
  });
  
})(window, document, jQuery);