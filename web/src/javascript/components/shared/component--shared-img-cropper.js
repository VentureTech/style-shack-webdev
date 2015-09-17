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
  //Modification from original img-cropper:
  var CROPPED_PICTURE_DATA = 'cropped-picture-data[data-url]1';
  var CROPPED_PICTURE_NAME = 'cropped-picture-data[data-url]1[name]';
  var CROP_SELECTION_MIN_BOX_WIDTH = 20;
  var CROP_SELECTION_MIN_BOX_HEIGHT = 20;

  var TEXT_ASPECT_RATIO_CONTROL_LABEL = 'Lock Aspect Ratio';
  var TEXT_ASPECT_RATIO_LOCKED_MESSAGE = 'Uncheck the box to crop outside of aspect ratio.';
  var TEXT_ASPECT_RATIO_UNLOCKED_MESSAGE = 'Check the box to crop within aspect ratio.';
  var TEXT_NO_CROP_MESSAGE = 'The image\'s size is too small to crop. You can drag & drop a different image.';

  var CSS_CANCEL_BUTTON_CLASS = 'cancel';
  var CSS_SAVE_BUTTON_CLASS = 'save';
  var CSS_NO_IMAGE_CLASS = 'no-image-selected';
  var CSS_HIDDEN_CLASS = 'hidden';
  var CSS_UNLOCKED_CLASS = 'unlocked';
  var CSS_LOCKED_CLASS = 'locked';
  var CSS_MODE_CROP = 'mode-crop';

  var cropSettingDefaults = {
    minWidth: 200,
    minHeight: 300,
    maxWidth: 250,
    maxHeight: 375,
    prescaleMaxWidth: 500,
    prescaleMaxHeight: 450,
    aspectRatio: 0.66666
  };

  function ImageCropper() {
    var dnd, $img, canvas, jcrop;
    var cropSettings, cropData;
    var $context, $dropZone, $miwtInputName, $miwtInputData;
    var api;
    var previousIsCrop;

    var $aspectRatioOption = $([
      '<div class="option opt-aspect-ratio">',
      '<label><input type="checkbox" name="jcrop-aspect-ratio" checked="checked" /> '+ TEXT_ASPECT_RATIO_CONTROL_LABEL +'</label>',
      '<div class="message message-locked">' + TEXT_ASPECT_RATIO_LOCKED_MESSAGE  + '</div>',
      '<div class="message message-unlocked">' + TEXT_ASPECT_RATIO_UNLOCKED_MESSAGE + '</div>',
      '</div>'].join(''));

    function resize(el, w, h) {
      el.width = w;
      el.height = h;
      el.style.width = w + 'px';
      el.style.height = h + 'px';
    }

    function updateImage() {
      if (jcrop) jcrop.destroy();
      // jcrop will set these, need to clear them when updating the image.
      $img.removeAttr('style');
      var w =  $img.width();
      var h = $img.height();
      var dropZone = dnd.getDropZone();

      $img.siblings().remove();

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
      canvas.getContext('2d').drawImage($img.get(0), 0, 0, scaledWidth, scaledHeight);
      // keySupport == false required to prevent "jumping" when clicking on the image
      var options = {
        aspectRatio: aspectRatio,
        onSelect: saveCropData,
        keySupport: false,
        setSelect: [0, 0, Math.max(minWidth, CROP_SELECTION_MIN_BOX_WIDTH), Math.max(minHeight, CROP_SELECTION_MIN_BOX_HEIGHT)],
        minSize: [minWidth, minHeight],
        maxSize: [maxWidth, maxHeight],
        boxWidth: cropSettings.prescaleMaxWidth,
        boxHeight: cropSettings.prescaleMaxHeight,
        bgOpacity: 0
      };

      $img.Jcrop(options, function() {
        jcrop = this;
      });
    }

    function loadImageIntoWorkspace(imgFile) {
      if (!imgFile.type.match(/image.*/)) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        $img.attr('src', e.target.result);
      };
      reader.readAsDataURL(imgFile);
    }

    function saveCroppedImageData() {
      var w = cropData.x2 - cropData.x;
      var h = cropData.y2 - cropData.y;
      var cropped = d.createElement('canvas');
      resize(cropped, w, h);
      cropped.getContext('2d').drawImage($img.get(0), cropData.x, cropData.y, w, h, 0, 0, w, h);
      $miwtInputData.val(cropped.toDataURL('image/jpeg', 0.75));
    }

    function clearCroppedImageData() {
      $miwtInputData.val('');
    }

    function saveCropData(crop) {
      cropData = crop;
    }

    function onFilesSelected(fileList) {
      if(fileList && fileList.length > 0)
        loadImageIntoWorkspace(fileList[0]);
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

    function updateAspectRatioControlUI() {
      var $checkbox = $aspectRatioOption.find('input');
      $aspectRatioOption
        .addClass($checkbox.prop('checked') ? CSS_LOCKED_CLASS : CSS_UNLOCKED_CLASS)
        .removeClass($checkbox.prop('checked') ? CSS_UNLOCKED_CLASS: CSS_LOCKED_CLASS);
    }

    function isSupported() {
      return w.cms && w.cms.file && w.cms.file.DnD;
    }

    function isCropMode() {
      return $context.hasClass(CSS_MODE_CROP);
    }

    function hasChangedMode() {
      return !!previousIsCrop != isCropMode();
    }

    function initConfig() {
      var config = $context.data();
      if (config) {
        cropSettings = $.extend({}, cropSettingDefaults);
        $.each(config, function(key, val) {
          if (typeof cropSettings[key] === "undefined") {
            return;
          }
          cropSettings[key] = config[key];
        });
      }
    }

    function initAspectRatio() {
      $context.prepend($aspectRatioOption);
      updateAspectRatioControlUI();

      $aspectRatioOption.on('change', 'input', function(evt) {
        if (!jcrop) {
          return;
        }

        jcrop.setOptions(this.checked ? { aspectRatio: cropSettings.aspectRatio }: {aspectRatio: 0});
        jcrop.focus();

        updateAspectRatioControlUI();
      });
    }

    function initCrop() {
      var fileInput;
      $dropZone = $context.find('.drop-zone');
      $img = $context.hasClass(CSS_NO_IMAGE_CLASS) ? $([]) : $context.find('img');
      fileInput = $context.find('input[type=file]').get(0);
      canvas = document.createElement('canvas');
      $dropZone.append(canvas);
      $miwtInputData = $(createHiddenInput(CROPPED_PICTURE_DATA, fileInput.id +  '[data-url]1', ''));
      $miwtInputName = $(createHiddenInput(CROPPED_PICTURE_NAME, fileInput.id +  '[data-url]1[name]', 'img.png'));
      $dropZone.append($miwtInputData).append($miwtInputName);

      if (dnd) { dnd.destroy(); }
      dnd = new w.cms.file.DnD(fileInput, $dropZone.get(0));

      if (!$img.length) {
        $img = $('<img />');
        $dropZone.find('.jcrop-wrapper').append($img);
        canvas.getContext('2d').fillText('Drop image here or choose below', 75, 80);
      }

      $img.on('load', function() {
        updateImage($img);
      }).each(function(){
        if (this.complete) $img.load();
      });

      $img.attr('id', fileInput.id + "-picture");

      dnd.addListener(onFilesSelected);
    }

    function init(context) {
      $context = $(context);

      if (!isSupported()) {
        return false;
      }

      initConfig();
      update();

      $context.data('image-cropper-init', true);
      $context.data('image-cropper', api);

      return true;
    }

    function update() {
      if (hasChangedMode()) {
        destroy();

        if (isCropMode()) {
          initAspectRatio();
          initCrop();
        }
      }

      previousIsCrop = isCropMode();
    }

    function destroy() {
      if (dnd) dnd.destroy();
      if (jcrop) jcrop.destroy();
      $aspectRatioOption.off('change');
      $aspectRatioOption.remove();
      if ($img && $img.length) $img.off('load');
      $context.data('image-cropper-init', false);
      $context.data('image-cropper', {});
    }

    api = {
      init: init,
      update: update,
      clearCroppedImageData: clearCroppedImageData,
      saveCroppedImageData: saveCroppedImageData,
      destroy: destroy
    };

    return api;
  }

  function ImageCropperManager() {
    var $context;

    var PICTURE_SELECTOR = '.picture-editor';

    function update() {
      addCroppers();
    }

    function onSubmitHandeler() {
      var btnhitId = $context.find('input[name=btnhit]').val();

      if (btnhitId.length) {
        var $btnhitEl = $(document.getElementById(btnhitId));
        var $cropper = $btnhitEl.closest(PICTURE_SELECTOR);

        if ($btnhitEl.length && $cropper.length) {
          if ($btnhitEl.hasClass(CSS_CANCEL_BUTTON_CLASS)) {
            $cropper.data('image-cropper').clearCroppedImageData();
          } else if ($btnhitEl.hasClass(CSS_SAVE_BUTTON_CLASS)) {
            $cropper.data('image-cropper').saveCroppedImageData();
          }
        }
      }

      return true;
    }

    function addCroppers() {
      $context.find(PICTURE_SELECTOR).each(function() {
        var $cropper = $(this);
        if ($cropper.data('image-cropper-init')) {
          $cropper.data('image-cropper').update();
        } else {
          var ic = new ImageCropper();
          ic.init(this);
        }
      });
    }

    function init(context) {
      $context = $(context);

      addCroppers();
    }

    return {
      init: init,
      update: update,
      callbacks: {
        onSubmit: onSubmitHandeler
      }
    };
  }

  jQuery(function($) {
    $('.miwt-form').each(function() {
      var form = this;
      var originalPostUpdate = $.noop;

      var icm = new ImageCropperManager();

      if (!form.submit_options) {
        form.submit_options = {};
      }

      if (form.submit_options.postUpdate) {
        originalPostUpdate = form.submit_options.postUpdate;
      }

      form.submit_options.postUpdate = function() {
        originalPostUpdate();
        icm.update();
      };

      //have to force overwrite the onsubmit. sorry.
      form.submit_options.onSubmit = icm.callbacks.onSubmit;

      icm.init(form);
    });
  });

})(window, document, jQuery);