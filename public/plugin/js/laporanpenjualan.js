/*!
 * Bootstrap-select v1.10.0 (http://silviomoreto.github.io/bootstrap-select)
 *
 * Copyright 2013-2016 bootstrap-select
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define(["jquery"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
}(this, function (jQuery) {

(function ($) {
  'use strict';

  //<editor-fold desc="Shims">
  if (!String.prototype.includes) {
    (function () {
      'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
      var toString = {}.toString;
      var defineProperty = (function () {
        // IE 8 only supports `Object.defineProperty` on DOM elements
        try {
          var object = {};
          var $defineProperty = Object.defineProperty;
          var result = $defineProperty(object, object, object) && $defineProperty;
        } catch (error) {
        }
        return result;
      }());
      var indexOf = ''.indexOf;
      var includes = function (search) {
        if (this == null) {
          throw new TypeError();
        }
        var string = String(this);
        if (search && toString.call(search) == '[object RegExp]') {
          throw new TypeError();
        }
        var stringLength = string.length;
        var searchString = String(search);
        var searchLength = searchString.length;
        var position = arguments.length > 1 ? arguments[1] : undefined;
        // `ToInteger`
        var pos = position ? Number(position) : 0;
        if (pos != pos) { // better `isNaN`
          pos = 0;
        }
        var start = Math.min(Math.max(pos, 0), stringLength);
        // Avoid the `indexOf` call if no match is possible
        if (searchLength + start > stringLength) {
          return false;
        }
        return indexOf.call(string, searchString, pos) != -1;
      };
      if (defineProperty) {
        defineProperty(String.prototype, 'includes', {
          'value': includes,
          'configurable': true,
          'writable': true
        });
      } else {
        String.prototype.includes = includes;
      }
    }());
  }

  if (!String.prototype.startsWith) {
    (function () {
      'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
      var defineProperty = (function () {
        // IE 8 only supports `Object.defineProperty` on DOM elements
        try {
          var object = {};
          var $defineProperty = Object.defineProperty;
          var result = $defineProperty(object, object, object) && $defineProperty;
        } catch (error) {
        }
        return result;
      }());
      var toString = {}.toString;
      var startsWith = function (search) {
        if (this == null) {
          throw new TypeError();
        }
        var string = String(this);
        if (search && toString.call(search) == '[object RegExp]') {
          throw new TypeError();
        }
        var stringLength = string.length;
        var searchString = String(search);
        var searchLength = searchString.length;
        var position = arguments.length > 1 ? arguments[1] : undefined;
        // `ToInteger`
        var pos = position ? Number(position) : 0;
        if (pos != pos) { // better `isNaN`
          pos = 0;
        }
        var start = Math.min(Math.max(pos, 0), stringLength);
        // Avoid the `indexOf` call if no match is possible
        if (searchLength + start > stringLength) {
          return false;
        }
        var index = -1;
        while (++index < searchLength) {
          if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
            return false;
          }
        }
        return true;
      };
      if (defineProperty) {
        defineProperty(String.prototype, 'startsWith', {
          'value': startsWith,
          'configurable': true,
          'writable': true
        });
      } else {
        String.prototype.startsWith = startsWith;
      }
    }());
  }

  if (!Object.keys) {
    Object.keys = function (
      o, // object
      k, // key
      r  // result array
      ){
      // initialize object and result
      r=[];
      // iterate over object keys
      for (k in o)
          // fill result array with non-prototypical keys
        r.hasOwnProperty.call(o, k) && r.push(k);
      // return result
      return r;
    };
  }

  $.fn.triggerNative = function (eventName) {
    var el = this[0],
        event;

    if (el.dispatchEvent) {
      if (typeof Event === 'function') {
        // For modern browsers
        event = new Event(eventName, {
          bubbles: true
        });
      } else {
        // For IE since it doesn't support Event constructor
        event = document.createEvent('Event');
        event.initEvent(eventName, true, false);
      }

      el.dispatchEvent(event);
    } else {
      if (el.fireEvent) {
        event = document.createEventObject();
        event.eventType = eventName;
        el.fireEvent('on' + eventName, event);
      }

      this.trigger(eventName);
    }
  };
  //</editor-fold>

  // Case insensitive contains search
  $.expr[':'].icontains = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.text()).toUpperCase();
    return haystack.includes(meta[3].toUpperCase());
  };

  // Case insensitive begins search
  $.expr[':'].ibegins = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.text()).toUpperCase();
    return haystack.startsWith(meta[3].toUpperCase());
  };

  // Case and accent insensitive contains search
  $.expr[':'].aicontains = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toUpperCase();
    return haystack.includes(meta[3].toUpperCase());
  };

  // Case and accent insensitive begins search
  $.expr[':'].aibegins = function (obj, index, meta) {
    var $obj = $(obj);
    var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toUpperCase();
    return haystack.startsWith(meta[3].toUpperCase());
  };

  /**
   * Remove all diatrics from the given text.
   * @access private
   * @param {String} text
   * @returns {String}
   */
  function normalizeToBase(text) {
    var rExps = [
      {re: /[\xC0-\xC6]/g, ch: "A"},
      {re: /[\xE0-\xE6]/g, ch: "a"},
      {re: /[\xC8-\xCB]/g, ch: "E"},
      {re: /[\xE8-\xEB]/g, ch: "e"},
      {re: /[\xCC-\xCF]/g, ch: "I"},
      {re: /[\xEC-\xEF]/g, ch: "i"},
      {re: /[\xD2-\xD6]/g, ch: "O"},
      {re: /[\xF2-\xF6]/g, ch: "o"},
      {re: /[\xD9-\xDC]/g, ch: "U"},
      {re: /[\xF9-\xFC]/g, ch: "u"},
      {re: /[\xC7-\xE7]/g, ch: "c"},
      {re: /[\xD1]/g, ch: "N"},
      {re: /[\xF1]/g, ch: "n"}
    ];
    $.each(rExps, function () {
      text = text.replace(this.re, this.ch);
    });
    return text;
  }


  function htmlEscape(html) {
    var escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };
    var source = '(?:' + Object.keys(escapeMap).join('|') + ')',
        testRegexp = new RegExp(source),
        replaceRegexp = new RegExp(source, 'g'),
        string = html == null ? '' : '' + html;
    return testRegexp.test(string) ? string.replace(replaceRegexp, function (match) {
      return escapeMap[match];
    }) : string;
  }

  var Selectpicker = function (element, options, e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.$element = $(element);
    this.$newElement = null;
    this.$button = null;
    this.$menu = null;
    this.$lis = null;
    this.options = options;

    // If we have no title yet, try to pull it from the html title attribute (jQuery doesnt' pick it up as it's not a
    // data-attribute)
    if (this.options.title === null) {
      this.options.title = this.$element.attr('title');
    }

    //Expose public methods
    this.val = Selectpicker.prototype.val;
    this.render = Selectpicker.prototype.render;
    this.refresh = Selectpicker.prototype.refresh;
    this.setStyle = Selectpicker.prototype.setStyle;
    this.selectAll = Selectpicker.prototype.selectAll;
    this.deselectAll = Selectpicker.prototype.deselectAll;
    this.destroy = Selectpicker.prototype.destroy;
    this.remove = Selectpicker.prototype.remove;
    this.show = Selectpicker.prototype.show;
    this.hide = Selectpicker.prototype.hide;

    this.init();
  };

  Selectpicker.VERSION = '1.10.0';

  // part of this is duplicated in i18n/defaults-en_US.js. Make sure to update both.
  Selectpicker.DEFAULTS = {
    noneSelectedText: 'Nothing selected',
    noneResultsText: 'No results matched {0}',
    countSelectedText: function (numSelected, numTotal) {
      return (numSelected == 1) ? "{0} item selected" : "{0} items selected";
    },
    maxOptionsText: function (numAll, numGroup) {
      return [
        (numAll == 1) ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)',
        (numGroup == 1) ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)'
      ];
    },
    selectAllText: 'Select All',
    deselectAllText: 'Deselect All',
    doneButton: false,
    doneButtonText: 'Close',
    multipleSeparator: ', ',
    styleBase: 'btn',
    style: 'btn-default',
    size: 'auto',
    title: null,
    selectedTextFormat: 'values',
    width: false,
    container: false,
    hideDisabled: false,
    showSubtext: false,
    showIcon: true,
    showContent: true,
    dropupAuto: true,
    header: false,
    liveSearch: false,
    liveSearchPlaceholder: null,
    liveSearchNormalize: false,
    liveSearchStyle: 'contains',
    actionsBox: false,
    iconBase: 'glyphicon',
    tickIcon: 'glyphicon-ok',
    showTick: false,
    template: {
      caret: '<span class="caret"></span>'
    },
    maxOptions: false,
    mobile: false,
    selectOnTab: false,
    dropdownAlignRight: false
  };

  Selectpicker.prototype = {

    constructor: Selectpicker,

    init: function () {
      var that = this,
          id = this.$element.attr('id');

      this.$element.addClass('bs-select-hidden');

      // store originalIndex (key) and newIndex (value) in this.liObj for fast accessibility
      // allows us to do this.$lis.eq(that.liObj[index]) instead of this.$lis.filter('[data-original-index="' + index + '"]')
      this.liObj = {};
      this.multiple = this.$element.prop('multiple');
      this.autofocus = this.$element.prop('autofocus');
      this.$newElement = this.createView();
      this.$element
        .after(this.$newElement)
        .appendTo(this.$newElement);
      this.$button = this.$newElement.children('button');
      this.$menu = this.$newElement.children('.dropdown-menu');
      this.$menuInner = this.$menu.children('.inner');
      this.$searchbox = this.$menu.find('input');

      this.$element.removeClass('bs-select-hidden');

      if (this.options.dropdownAlignRight)
        this.$menu.addClass('dropdown-menu-right');

      if (typeof id !== 'undefined') {
        this.$button.attr('data-id', id);
        $('label[for="' + id + '"]').click(function (e) {
          e.preventDefault();
          that.$button.focus();
        });
      }

      this.checkDisabled();
      this.clickListener();
      if (this.options.liveSearch) this.liveSearchListener();
      this.render();
      this.setStyle();
      this.setWidth();
      if (this.options.container) this.selectPosition();
      this.$menu.data('this', this);
      this.$newElement.data('this', this);
      if (this.options.mobile) this.mobile();

      this.$newElement.on({
        'hide.bs.dropdown': function (e) {
          that.$element.trigger('hide.bs.select', e);
        },
        'hidden.bs.dropdown': function (e) {
          that.$element.trigger('hidden.bs.select', e);
        },
        'show.bs.dropdown': function (e) {
          that.$element.trigger('show.bs.select', e);
        },
        'shown.bs.dropdown': function (e) {
          that.$element.trigger('shown.bs.select', e);
        }
      });

      if (that.$element[0].hasAttribute('required')) {
        this.$element.on('invalid', function () {
          that.$button
            .addClass('bs-invalid')
            .focus();
          
          that.$element.on({
            'focus.bs.select': function () {
              that.$button.focus();
              that.$element.off('focus.bs.select');
            },
            'shown.bs.select': function () {
              that.$element
                .val(that.$element.val()) // set the value to hide the validation message in Chrome when menu is opened
                .off('shown.bs.select');
            },
            'rendered.bs.select': function () {
              // if select is no longer invalid, remove the bs-invalid class
              if (this.validity.valid) that.$button.removeClass('bs-invalid');
              that.$element.off('rendered.bs.select');
            }
          });
          
        });
      }

      setTimeout(function () {
        that.$element.trigger('loaded.bs.select');
      });
    },

    createDropdown: function () {
      // Options
      // If we are multiple or showTick option is set, then add the show-tick class
      var showTick = (this.multiple || this.options.showTick) ? ' show-tick' : '',
          inputGroup = this.$element.parent().hasClass('input-group') ? ' input-group-btn' : '',
          autofocus = this.autofocus ? ' autofocus' : '';
      // Elements
      var header = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + '</div>' : '';
      var searchbox = this.options.liveSearch ?
      '<div class="bs-searchbox">' +
      '<input type="text" class="form-control" autocomplete="off"' +
      (null === this.options.liveSearchPlaceholder ? '' : ' placeholder="' + htmlEscape(this.options.liveSearchPlaceholder) + '"') + '>' +
      '</div>'
          : '';
      var actionsbox = this.multiple && this.options.actionsBox ?
      '<div class="bs-actionsbox">' +
      '<div class="btn-group btn-group-sm btn-block">' +
      '<button type="button" class="actions-btn bs-select-all btn btn-default">' +
      this.options.selectAllText +
      '</button>' +
      '<button type="button" class="actions-btn bs-deselect-all btn btn-default">' +
      this.options.deselectAllText +
      '</button>' +
      '</div>' +
      '</div>'
          : '';
      var donebutton = this.multiple && this.options.doneButton ?
      '<div class="bs-donebutton">' +
      '<div class="btn-group btn-block">' +
      '<button type="button" class="btn btn-sm btn-default">' +
      this.options.doneButtonText +
      '</button>' +
      '</div>' +
      '</div>'
          : '';
      var drop =
          '<div class="btn-group bootstrap-select' + showTick + inputGroup + '">' +
          '<button type="button" class="' + this.options.styleBase + ' dropdown-toggle" data-toggle="dropdown"' + autofocus + '>' +
          '<span class="filter-option pull-left"></span>&nbsp;' +
          '<span class="bs-caret">' +
          this.options.template.caret +
          '</span>' +
          '</button>' +
          '<div class="dropdown-menu open">' +
          header +
          searchbox +
          actionsbox +
          '<ul class="dropdown-menu inner" role="menu">' +
          '</ul>' +
          donebutton +
          '</div>' +
          '</div>';

      return $(drop);
    },

    createView: function () {
      var $drop = this.createDropdown(),
          li = this.createLi();

      $drop.find('ul')[0].innerHTML = li;
      return $drop;
    },

    reloadLi: function () {
      //Remove all children.
      this.destroyLi();
      //Re build
      var li = this.createLi();
      this.$menuInner[0].innerHTML = li;
    },

    destroyLi: function () {
      this.$menu.find('li').remove();
    },

    createLi: function () {
      var that = this,
          _li = [],
          optID = 0,
          titleOption = document.createElement('option'),
          liIndex = -1; // increment liIndex whenever a new <li> element is created to ensure liObj is correct

      // Helper functions
      /**
       * @param content
       * @param [index]
       * @param [classes]
       * @param [optgroup]
       * @returns {string}
       */
      var generateLI = function (content, index, classes, optgroup) {
        return '<li' +
            ((typeof classes !== 'undefined' & '' !== classes) ? ' class="' + classes + '"' : '') +
            ((typeof index !== 'undefined' & null !== index) ? ' data-original-index="' + index + '"' : '') +
            ((typeof optgroup !== 'undefined' & null !== optgroup) ? 'data-optgroup="' + optgroup + '"' : '') +
            '>' + content + '</li>';
      };

      /**
       * @param text
       * @param [classes]
       * @param [inline]
       * @param [tokens]
       * @returns {string}
       */
      var generateA = function (text, classes, inline, tokens) {
        return '<a tabindex="0"' +
            (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') +
            (typeof inline !== 'undefined' ? ' style="' + inline + '"' : '') +
            (that.options.liveSearchNormalize ? ' data-normalized-text="' + normalizeToBase(htmlEscape(text)) + '"' : '') +
            (typeof tokens !== 'undefined' || tokens !== null ? ' data-tokens="' + tokens + '"' : '') +
            '>' + text +
            '<span class="' + that.options.iconBase + ' ' + that.options.tickIcon + ' check-mark"></span>' +
            '</a>';
      };

      if (this.options.title && !this.multiple) {
        // this option doesn't create a new <li> element, but does add a new option, so liIndex is decreased
        // since liObj is recalculated on every refresh, liIndex needs to be decreased even if the titleOption is already appended
        liIndex--;

        if (!this.$element.find('.bs-title-option').length) {
          // Use native JS to prepend option (faster)
          var element = this.$element[0];
          titleOption.className = 'bs-title-option';
          titleOption.appendChild(document.createTextNode(this.options.title));
          titleOption.value = '';
          element.insertBefore(titleOption, element.firstChild);
          // Check if selected attribute is already set on an option. If not, select the titleOption option.
          if ($(element.options[element.selectedIndex]).attr('selected') === undefined) titleOption.selected = true;
        }
      }

      this.$element.find('option').each(function (index) {
        var $this = $(this);

        liIndex++;

        if ($this.hasClass('bs-title-option')) return;

        // Get the class and text for the option
        var optionClass = this.className || '',
            inline = this.style.cssText,
            text = $this.data('content') ? $this.data('content') : $this.html(),
            tokens = $this.data('tokens') ? $this.data('tokens') : null,
            subtext = typeof $this.data('subtext') !== 'undefined' ? '<small class="text-muted">' + $this.data('subtext') + '</small>' : '',
            icon = typeof $this.data('icon') !== 'undefined' ? '<span class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></span> ' : '',
            isOptgroup = this.parentNode.tagName === 'OPTGROUP',
            isDisabled = this.disabled || (isOptgroup && this.parentNode.disabled);

        if (icon !== '' && isDisabled) {
          icon = '<span>' + icon + '</span>';
        }

        if (that.options.hideDisabled && isDisabled && !isOptgroup) {
          liIndex--;
          return;
        }

        if (!$this.data('content')) {
          // Prepend any icon and append any subtext to the main text.
          text = icon + '<span class="text">' + text + subtext + '</span>';
        }

        if (isOptgroup && $this.data('divider') !== true) {
          var optGroupClass = ' ' + this.parentNode.className || '';

          if ($this.index() === 0) { // Is it the first option of the optgroup?
            optID += 1;

            // Get the opt group label
            var label = this.parentNode.label,
                labelSubtext = typeof $this.parent().data('subtext') !== 'undefined' ? '<small class="text-muted">' + $this.parent().data('subtext') + '</small>' : '',
                labelIcon = $this.parent().data('icon') ? '<span class="' + that.options.iconBase + ' ' + $this.parent().data('icon') + '"></span> ' : '';

            label = labelIcon + '<span class="text">' + label + labelSubtext + '</span>';

            if (index !== 0 && _li.length > 0) { // Is it NOT the first option of the select && are there elements in the dropdown?
              liIndex++;
              _li.push(generateLI('', null, 'divider', optID + 'div'));
            }
            liIndex++;
            _li.push(generateLI(label, null, 'dropdown-header' + optGroupClass, optID));
          }

          if (that.options.hideDisabled && isDisabled) {
            liIndex--;
            return;
          }

          _li.push(generateLI(generateA(text, 'opt ' + optionClass + optGroupClass, inline, tokens), index, '', optID));
        } else if ($this.data('divider') === true) {
          _li.push(generateLI('', index, 'divider'));
        } else if ($this.data('hidden') === true) {
          _li.push(generateLI(generateA(text, optionClass, inline, tokens), index, 'hidden is-hidden'));
        } else {
          if (this.previousElementSibling && this.previousElementSibling.tagName === 'OPTGROUP') {
            liIndex++;
            _li.push(generateLI('', null, 'divider', optID + 'div'));
          }
          _li.push(generateLI(generateA(text, optionClass, inline, tokens), index));
        }

        that.liObj[index] = liIndex;
      });

      //If we are not multiple, we don't have a selected item, and we don't have a title, select the first element so something is set in the button
      if (!this.multiple && this.$element.find('option:selected').length === 0 && !this.options.title) {
        this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
      }

      return _li.join('');
    },

    findLis: function () {
      if (this.$lis == null) this.$lis = this.$menu.find('li');
      return this.$lis;
    },

    /**
     * @param [updateLi] defaults to true
     */
    render: function (updateLi) {
      var that = this,
          notDisabled;

      //Update the LI to match the SELECT
      if (updateLi !== false) {
        this.$element.find('option').each(function (index) {
          var $lis = that.findLis().eq(that.liObj[index]);

          that.setDisabled(index, this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled, $lis);
          that.setSelected(index, this.selected, $lis);
        });
      }

      this.tabIndex();

      var selectedItems = this.$element.find('option').map(function () {
        if (this.selected) {
          if (that.options.hideDisabled && (this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled)) return;

          var $this = $(this),
              icon = $this.data('icon') && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></i> ' : '',
              subtext;

          if (that.options.showSubtext && $this.data('subtext') && !that.multiple) {
            subtext = ' <small class="text-muted">' + $this.data('subtext') + '</small>';
          } else {
            subtext = '';
          }
          if (typeof $this.attr('title') !== 'undefined') {
            return $this.attr('title');
          } else if ($this.data('content') && that.options.showContent) {
            return $this.data('content');
          } else {
            return icon + $this.html() + subtext;
          }
        }
      }).toArray();

      //Fixes issue in IE10 occurring when no default option is selected and at least one option is disabled
      //Convert all the values into a comma delimited string
      var title = !this.multiple ? selectedItems[0] : selectedItems.join(this.options.multipleSeparator);

      //If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
      if (this.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
        var max = this.options.selectedTextFormat.split('>');
        if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
          notDisabled = this.options.hideDisabled ? ', [disabled]' : '';
          var totalCount = this.$element.find('option').not('[data-divider="true"], [data-hidden="true"]' + notDisabled).length,
              tr8nText = (typeof this.options.countSelectedText === 'function') ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;
          title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
        }
      }

      if (this.options.title == undefined) {
        this.options.title = this.$element.attr('title');
      }

      if (this.options.selectedTextFormat == 'static') {
        title = this.options.title;
      }

      //If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
      if (!title) {
        title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
      }

      //strip all html-tags and trim the result
      this.$button.attr('title', $.trim(title.replace(/<[^>]*>?/g, '')));
      this.$button.children('.filter-option').html(title);

      this.$element.trigger('rendered.bs.select');
    },

    /**
     * @param [style]
     * @param [status]
     */
    setStyle: function (style, status) {
      if (this.$element.attr('class')) {
        this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ''));
      }

      var buttonClass = style ? style : this.options.style;

      if (status == 'add') {
        this.$button.addClass(buttonClass);
      } else if (status == 'remove') {
        this.$button.removeClass(buttonClass);
      } else {
        this.$button.removeClass(this.options.style);
        this.$button.addClass(buttonClass);
      }
    },

    liHeight: function (refresh) {
      if (!refresh && (this.options.size === false || this.sizeInfo)) return;

      var newElement = document.createElement('div'),
          menu = document.createElement('div'),
          menuInner = document.createElement('ul'),
          divider = document.createElement('li'),
          li = document.createElement('li'),
          a = document.createElement('a'),
          text = document.createElement('span'),
          header = this.options.header && this.$menu.find('.popover-title').length > 0 ? this.$menu.find('.popover-title')[0].cloneNode(true) : null,
          search = this.options.liveSearch ? document.createElement('div') : null,
          actions = this.options.actionsBox && this.multiple && this.$menu.find('.bs-actionsbox').length > 0 ? this.$menu.find('.bs-actionsbox')[0].cloneNode(true) : null,
          doneButton = this.options.doneButton && this.multiple && this.$menu.find('.bs-donebutton').length > 0 ? this.$menu.find('.bs-donebutton')[0].cloneNode(true) : null;

      text.className = 'text';
      newElement.className = this.$menu[0].parentNode.className + ' open';
      menu.className = 'dropdown-menu open';
      menuInner.className = 'dropdown-menu inner';
      divider.className = 'divider';

      text.appendChild(document.createTextNode('Inner text'));
      a.appendChild(text);
      li.appendChild(a);
      menuInner.appendChild(li);
      menuInner.appendChild(divider);
      if (header) menu.appendChild(header);
      if (search) {
        // create a span instead of input as creating an input element is slower
        var input = document.createElement('span');
        search.className = 'bs-searchbox';
        input.className = 'form-control';
        search.appendChild(input);
        menu.appendChild(search);
      }
      if (actions) menu.appendChild(actions);
      menu.appendChild(menuInner);
      if (doneButton) menu.appendChild(doneButton);
      newElement.appendChild(menu);

      document.body.appendChild(newElement);

      var liHeight = a.offsetHeight,
          headerHeight = header ? header.offsetHeight : 0,
          searchHeight = search ? search.offsetHeight : 0,
          actionsHeight = actions ? actions.offsetHeight : 0,
          doneButtonHeight = doneButton ? doneButton.offsetHeight : 0,
          dividerHeight = $(divider).outerHeight(true),
          // fall back to jQuery if getComputedStyle is not supported
          menuStyle = typeof getComputedStyle === 'function' ? getComputedStyle(menu) : false,
          $menu = menuStyle ? null : $(menu),
          menuPadding = parseInt(menuStyle ? menuStyle.paddingTop : $menu.css('paddingTop')) +
                        parseInt(menuStyle ? menuStyle.paddingBottom : $menu.css('paddingBottom')) +
                        parseInt(menuStyle ? menuStyle.borderTopWidth : $menu.css('borderTopWidth')) +
                        parseInt(menuStyle ? menuStyle.borderBottomWidth : $menu.css('borderBottomWidth')),
          menuExtras =  menuPadding +
                        parseInt(menuStyle ? menuStyle.marginTop : $menu.css('marginTop')) +
                        parseInt(menuStyle ? menuStyle.marginBottom : $menu.css('marginBottom')) + 2;

      document.body.removeChild(newElement);

      this.sizeInfo = {
        liHeight: liHeight,
        headerHeight: headerHeight,
        searchHeight: searchHeight,
        actionsHeight: actionsHeight,
        doneButtonHeight: doneButtonHeight,
        dividerHeight: dividerHeight,
        menuPadding: menuPadding,
        menuExtras: menuExtras
      };
    },

    setSize: function () {
      this.findLis();
      this.liHeight();

      if (this.options.header) this.$menu.css('padding-top', 0);
      if (this.options.size === false) return;

      var that = this,
          $menu = this.$menu,
          $menuInner = this.$menuInner,
          $window = $(window),
          selectHeight = this.$newElement[0].offsetHeight,
          liHeight = this.sizeInfo['liHeight'],
          headerHeight = this.sizeInfo['headerHeight'],
          searchHeight = this.sizeInfo['searchHeight'],
          actionsHeight = this.sizeInfo['actionsHeight'],
          doneButtonHeight = this.sizeInfo['doneButtonHeight'],
          divHeight = this.sizeInfo['dividerHeight'],
          menuPadding = this.sizeInfo['menuPadding'],
          menuExtras = this.sizeInfo['menuExtras'],
          notDisabled = this.options.hideDisabled ? '.disabled' : '',
          menuHeight,
          getHeight,
          selectOffsetTop,
          selectOffsetBot,
          posVert = function () {
            selectOffsetTop = that.$newElement.offset().top - $window.scrollTop();
            selectOffsetBot = $window.height() - selectOffsetTop - selectHeight;
          };

      posVert();

      if (this.options.size === 'auto') {
        var getSize = function () {
          var minHeight,
              hasClass = function (className, include) {
                return function (element) {
                    if (include) {
                        return (element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                    } else {
                        return !(element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                    }
                };
              },
              lis = that.$menuInner[0].getElementsByTagName('li'),
              lisVisible = Array.prototype.filter ? Array.prototype.filter.call(lis, hasClass('hidden', false)) : that.$lis.not('.hidden'),
              optGroup = Array.prototype.filter ? Array.prototype.filter.call(lisVisible, hasClass('dropdown-header', true)) : lisVisible.filter('.dropdown-header');

          posVert();
          menuHeight = selectOffsetBot - menuExtras;

          if (that.options.container) {
            if (!$menu.data('height')) $menu.data('height', $menu.height());
            getHeight = $menu.data('height');
          } else {
            getHeight = $menu.height();
          }

          if (that.options.dropupAuto) {
            that.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras) < getHeight);
          }
          if (that.$newElement.hasClass('dropup')) {
            menuHeight = selectOffsetTop - menuExtras;
          }

          if ((lisVisible.length + optGroup.length) > 3) {
            minHeight = liHeight * 3 + menuExtras - 2;
          } else {
            minHeight = 0;
          }

          $menu.css({
            'max-height': menuHeight + 'px',
            'overflow': 'hidden',
            'min-height': minHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px'
          });
          $menuInner.css({
            'max-height': menuHeight - headerHeight - searchHeight - actionsHeight - doneButtonHeight - menuPadding + 'px',
            'overflow-y': 'auto',
            'min-height': Math.max(minHeight - menuPadding, 0) + 'px'
          });
        };
        getSize();
        this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize', getSize);
        $window.off('resize.getSize scroll.getSize').on('resize.getSize scroll.getSize', getSize);
      } else if (this.options.size && this.options.size != 'auto' && this.$lis.not(notDisabled).length > this.options.size) {
        var optIndex = this.$lis.not('.divider').not(notDisabled).children().slice(0, this.options.size).last().parent().index(),
            divLength = this.$lis.slice(0, optIndex + 1).filter('.divider').length;
        menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding;

        if (that.options.container) {
          if (!$menu.data('height')) $menu.data('height', $menu.height());
          getHeight = $menu.data('height');
        } else {
          getHeight = $menu.height();
        }

        if (that.options.dropupAuto) {
          //noinspection JSUnusedAssignment
          this.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && (menuHeight - menuExtras) < getHeight);
        }
        $menu.css({
          'max-height': menuHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px',
          'overflow': 'hidden',
          'min-height': ''
        });
        $menuInner.css({
          'max-height': menuHeight - menuPadding + 'px',
          'overflow-y': 'auto',
          'min-height': ''
        });
      }
    },

    setWidth: function () {
      if (this.options.width === 'auto') {
        this.$menu.css('min-width', '0');

        // Get correct width if element is hidden
        var $selectClone = this.$menu.parent().clone().appendTo('body'),
            $selectClone2 = this.options.container ? this.$newElement.clone().appendTo('body') : $selectClone,
            ulWidth = $selectClone.children('.dropdown-menu').outerWidth(),
            btnWidth = $selectClone2.css('width', 'auto').children('button').outerWidth();

        $selectClone.remove();
        $selectClone2.remove();

        // Set width to whatever's larger, button title or longest option
        this.$newElement.css('width', Math.max(ulWidth, btnWidth) + 'px');
      } else if (this.options.width === 'fit') {
        // Remove inline min-width so width can be changed from 'auto'
        this.$menu.css('min-width', '');
        this.$newElement.css('width', '').addClass('fit-width');
      } else if (this.options.width) {
        // Remove inline min-width so width can be changed from 'auto'
        this.$menu.css('min-width', '');
        this.$newElement.css('width', this.options.width);
      } else {
        // Remove inline min-width/width so width can be changed
        this.$menu.css('min-width', '');
        this.$newElement.css('width', '');
      }
      // Remove fit-width class if width is changed programmatically
      if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
        this.$newElement.removeClass('fit-width');
      }
    },

    selectPosition: function () {
      this.$bsContainer = $('<div class="bs-container" />');

      var that = this,
          pos,
          actualHeight,
          getPlacement = function ($element) {
            that.$bsContainer.addClass($element.attr('class').replace(/form-control|fit-width/gi, '')).toggleClass('dropup', $element.hasClass('dropup'));
            pos = $element.offset();
            actualHeight = $element.hasClass('dropup') ? 0 : $element[0].offsetHeight;
            that.$bsContainer.css({
              'top': pos.top + actualHeight,
              'left': pos.left,
              'width': $element[0].offsetWidth
            });
          };

      this.$button.on('click', function () {
        var $this = $(this);

        if (that.isDisabled()) {
          return;
        }

        getPlacement(that.$newElement);

        that.$bsContainer
          .appendTo(that.options.container)
          .toggleClass('open', !$this.hasClass('open'))
          .append(that.$menu);
      });

      $(window).on('resize scroll', function () {
        getPlacement(that.$newElement);
      });

      this.$element.on('hide.bs.select', function () {
        that.$menu.data('height', that.$menu.height());
        that.$bsContainer.detach();
      });
    },

    setSelected: function (index, selected, $lis) {
      if (!$lis) {
        $lis = this.findLis().eq(this.liObj[index]);
      }

      $lis.toggleClass('selected', selected);
    },

    setDisabled: function (index, disabled, $lis) {
      if (!$lis) {
        $lis = this.findLis().eq(this.liObj[index]);
      }

      if (disabled) {
        $lis.addClass('disabled').children('a').attr('href', '#').attr('tabindex', -1);
      } else {
        $lis.removeClass('disabled').children('a').removeAttr('href').attr('tabindex', 0);
      }
    },

    isDisabled: function () {
      return this.$element[0].disabled;
    },

    checkDisabled: function () {
      var that = this;

      if (this.isDisabled()) {
        this.$newElement.addClass('disabled');
        this.$button.addClass('disabled').attr('tabindex', -1);
      } else {
        if (this.$button.hasClass('disabled')) {
          this.$newElement.removeClass('disabled');
          this.$button.removeClass('disabled');
        }

        if (this.$button.attr('tabindex') == -1 && !this.$element.data('tabindex')) {
          this.$button.removeAttr('tabindex');
        }
      }

      this.$button.click(function () {
        return !that.isDisabled();
      });
    },

    tabIndex: function () {
      if (this.$element.data('tabindex') !== this.$element.attr('tabindex') && 
        (this.$element.attr('tabindex') !== -98 && this.$element.attr('tabindex') !== '-98')) {
        this.$element.data('tabindex', this.$element.attr('tabindex'));
        this.$button.attr('tabindex', this.$element.data('tabindex'));
      }
      
      this.$element.attr('tabindex', -98);
    },

    clickListener: function () {
      var that = this,
          $document = $(document);

      this.$newElement.on('touchstart.dropdown', '.dropdown-menu', function (e) {
        e.stopPropagation();
      });

      $document.data('spaceSelect', false);

      this.$button.on('keyup', function (e) {
        if (/(32)/.test(e.keyCode.toString(10)) && $document.data('spaceSelect')) {
            e.preventDefault();
            $document.data('spaceSelect', false);
        }
      });

      this.$button.on('click', function () {
        that.setSize();
      });

      this.$element.on('shown.bs.select', function () {
        if (!that.options.liveSearch && !that.multiple) {
          that.$menuInner.find('.selected a').focus();
        } else if (!that.multiple) {
          var selectedIndex = that.liObj[that.$element[0].selectedIndex];

          if (typeof selectedIndex !== 'number' || that.options.size === false) return;

          // scroll to selected option
          var offset = that.$lis.eq(selectedIndex)[0].offsetTop - that.$menuInner[0].offsetTop;
          offset = offset - that.$menuInner[0].offsetHeight/2 + that.sizeInfo.liHeight/2;
          that.$menuInner[0].scrollTop = offset;
        }
      });

      this.$menuInner.on('click', 'li a', function (e) {
        var $this = $(this),
            clickedIndex = $this.parent().data('originalIndex'),
            prevValue = that.$element.val(),
            prevIndex = that.$element.prop('selectedIndex');

        // Don't close on multi choice menu
        if (that.multiple) {
          e.stopPropagation();
        }

        e.preventDefault();

        //Don't run if we have been disabled
        if (!that.isDisabled() && !$this.parent().hasClass('disabled')) {
          var $options = that.$element.find('option'),
              $option = $options.eq(clickedIndex),
              state = $option.prop('selected'),
              $optgroup = $option.parent('optgroup'),
              maxOptions = that.options.maxOptions,
              maxOptionsGrp = $optgroup.data('maxOptions') || false;

          if (!that.multiple) { // Deselect all others if not multi select box
            $options.prop('selected', false);
            $option.prop('selected', true);
            that.$menuInner.find('.selected').removeClass('selected');
            that.setSelected(clickedIndex, true);
          } else { // Toggle the one we have chosen if we are multi select.
            $option.prop('selected', !state);
            that.setSelected(clickedIndex, !state);
            $this.blur();

            if (maxOptions !== false || maxOptionsGrp !== false) {
              var maxReached = maxOptions < $options.filter(':selected').length,
                  maxReachedGrp = maxOptionsGrp < $optgroup.find('option:selected').length;

              if ((maxOptions && maxReached) || (maxOptionsGrp && maxReachedGrp)) {
                if (maxOptions && maxOptions == 1) {
                  $options.prop('selected', false);
                  $option.prop('selected', true);
                  that.$menuInner.find('.selected').removeClass('selected');
                  that.setSelected(clickedIndex, true);
                } else if (maxOptionsGrp && maxOptionsGrp == 1) {
                  $optgroup.find('option:selected').prop('selected', false);
                  $option.prop('selected', true);
                  var optgroupID = $this.parent().data('optgroup');
                  that.$menuInner.find('[data-optgroup="' + optgroupID + '"]').removeClass('selected');
                  that.setSelected(clickedIndex, true);
                } else {
                  var maxOptionsArr = (typeof that.options.maxOptionsText === 'function') ?
                          that.options.maxOptionsText(maxOptions, maxOptionsGrp) : that.options.maxOptionsText,
                      maxTxt = maxOptionsArr[0].replace('{n}', maxOptions),
                      maxTxtGrp = maxOptionsArr[1].replace('{n}', maxOptionsGrp),
                      $notify = $('<div class="notify"></div>');
                  // If {var} is set in array, replace it
                  /** @deprecated */
                  if (maxOptionsArr[2]) {
                    maxTxt = maxTxt.replace('{var}', maxOptionsArr[2][maxOptions > 1 ? 0 : 1]);
                    maxTxtGrp = maxTxtGrp.replace('{var}', maxOptionsArr[2][maxOptionsGrp > 1 ? 0 : 1]);
                  }

                  $option.prop('selected', false);

                  that.$menu.append($notify);

                  if (maxOptions && maxReached) {
                    $notify.append($('<div>' + maxTxt + '</div>'));
                    that.$element.trigger('maxReached.bs.select');
                  }

                  if (maxOptionsGrp && maxReachedGrp) {
                    $notify.append($('<div>' + maxTxtGrp + '</div>'));
                    that.$element.trigger('maxReachedGrp.bs.select');
                  }

                  setTimeout(function () {
                    that.setSelected(clickedIndex, false);
                  }, 10);

                  $notify.delay(750).fadeOut(300, function () {
                    $(this).remove();
                  });
                }
              }
            }
          }

          if (!that.multiple) {
            that.$button.focus();
          } else if (that.options.liveSearch) {
            that.$searchbox.focus();
          }

          // Trigger select 'change'
          if ((prevValue != that.$element.val() && that.multiple) || (prevIndex != that.$element.prop('selectedIndex') && !that.multiple)) {
            // $option.prop('selected') is current option state (selected/unselected). state is previous option state.
            that.$element
              .trigger('changed.bs.select', [clickedIndex, $option.prop('selected'), state])
              .triggerNative('change');
          }
        }
      });

      this.$menu.on('click', 'li.disabled a, .popover-title, .popover-title :not(.close)', function (e) {
        if (e.currentTarget == this) {
          e.preventDefault();
          e.stopPropagation();
          if (that.options.liveSearch && !$(e.target).hasClass('close')) {
            that.$searchbox.focus();
          } else {
            that.$button.focus();
          }
        }
      });

      this.$menuInner.on('click', '.divider, .dropdown-header', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (that.options.liveSearch) {
          that.$searchbox.focus();
        } else {
          that.$button.focus();
        }
      });

      this.$menu.on('click', '.popover-title .close', function () {
        that.$button.click();
      });

      this.$searchbox.on('click', function (e) {
        e.stopPropagation();
      });

      this.$menu.on('click', '.actions-btn', function (e) {
        if (that.options.liveSearch) {
          that.$searchbox.focus();
        } else {
          that.$button.focus();
        }

        e.preventDefault();
        e.stopPropagation();

        if ($(this).hasClass('bs-select-all')) {
          that.selectAll();
        } else {
          that.deselectAll();
        }
      });

      this.$element.change(function () {
        that.render(false);
      });
    },

    liveSearchListener: function () {
      var that = this,
          $no_results = $('<li class="no-results"></li>');

      this.$button.on('click.dropdown.data-api touchstart.dropdown.data-api', function () {
        that.$menuInner.find('.active').removeClass('active');
        if (!!that.$searchbox.val()) {
          that.$searchbox.val('');
          that.$lis.not('.is-hidden').removeClass('hidden');
          if (!!$no_results.parent().length) $no_results.remove();
        }
        if (!that.multiple) that.$menuInner.find('.selected').addClass('active');
        setTimeout(function () {
          that.$searchbox.focus();
        }, 10);
      });

      this.$searchbox.on('click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api', function (e) {
        e.stopPropagation();
      });

      this.$searchbox.on('input propertychange', function () {
        if (that.$searchbox.val()) {
          var $searchBase = that.$lis.not('.is-hidden').removeClass('hidden').children('a');
          if (that.options.liveSearchNormalize) {
            $searchBase = $searchBase.not(':a' + that._searchStyle() + '("' + normalizeToBase(that.$searchbox.val()) + '")');
          } else {
            $searchBase = $searchBase.not(':' + that._searchStyle() + '("' + that.$searchbox.val() + '")');
          }
          $searchBase.parent().addClass('hidden');

          that.$lis.filter('.dropdown-header').each(function () {
            var $this = $(this),
                optgroup = $this.data('optgroup');

            if (that.$lis.filter('[data-optgroup=' + optgroup + ']').not($this).not('.hidden').length === 0) {
              $this.addClass('hidden');
              that.$lis.filter('[data-optgroup=' + optgroup + 'div]').addClass('hidden');
            }
          });

          var $lisVisible = that.$lis.not('.hidden');

          // hide divider if first or last visible, or if followed by another divider
          $lisVisible.each(function (index) {
            var $this = $(this);

            if ($this.hasClass('divider') && (
              $this.index() === $lisVisible.first().index() ||
              $this.index() === $lisVisible.last().index() ||
              $lisVisible.eq(index + 1).hasClass('divider'))) {
              $this.addClass('hidden');
            }
          });

          if (!that.$lis.not('.hidden, .no-results').length) {
            if (!!$no_results.parent().length) {
              $no_results.remove();
            }
            $no_results.html(that.options.noneResultsText.replace('{0}', '"' + htmlEscape(that.$searchbox.val()) + '"')).show();
            that.$menuInner.append($no_results);
          } else if (!!$no_results.parent().length) {
            $no_results.remove();
          }
        } else {
          that.$lis.not('.is-hidden').removeClass('hidden');
          if (!!$no_results.parent().length) {
            $no_results.remove();
          }
        }

        that.$lis.filter('.active').removeClass('active');
        if (that.$searchbox.val()) that.$lis.not('.hidden, .divider, .dropdown-header').eq(0).addClass('active').children('a').focus();
        $(this).focus();
      });
    },

    _searchStyle: function () {
      var styles = {
        begins: 'ibegins',
        startsWith: 'ibegins'
      };

      return styles[this.options.liveSearchStyle] || 'icontains';
    },

    val: function (value) {
      if (typeof value !== 'undefined') {
        this.$element.val(value);
        this.render();

        return this.$element;
      } else {
        return this.$element.val();
      }
    },

    changeAll: function (status) {
      if (typeof status === 'undefined') status = true;

      this.findLis();

      var $options = this.$element.find('option'),
          $lisVisible = this.$lis.not('.divider, .dropdown-header, .disabled, .hidden').toggleClass('selected', status),
          lisVisLen = $lisVisible.length,
          selectedOptions = [];

      for (var i = 0; i < lisVisLen; i++) {
        var origIndex = $lisVisible[i].getAttribute('data-original-index');
        selectedOptions[selectedOptions.length] = $options.eq(origIndex)[0];
      }

      $(selectedOptions).prop('selected', status);

      this.render(false);

      this.$element
        .trigger('changed.bs.select')
        .triggerNative('change');
    },

    selectAll: function () {
      return this.changeAll(true);
    },

    deselectAll: function () {
      return this.changeAll(false);
    },

    toggle: function (e) {
      e = e || window.event;
      
      if (e) e.stopPropagation();

      this.$button.trigger('click');
    },

    keydown: function (e) {
      var $this = $(this),
          $parent = $this.is('input') ? $this.parent().parent() : $this.parent(),
          $items,
          that = $parent.data('this'),
          index,
          next,
          first,
          last,
          prev,
          nextPrev,
          prevIndex,
          isActive,
          selector = ':not(.disabled, .hidden, .dropdown-header, .divider)',
          keyCodeMap = {
            32: ' ',
            48: '0',
            49: '1',
            50: '2',
            51: '3',
            52: '4',
            53: '5',
            54: '6',
            55: '7',
            56: '8',
            57: '9',
            59: ';',
            65: 'a',
            66: 'b',
            67: 'c',
            68: 'd',
            69: 'e',
            70: 'f',
            71: 'g',
            72: 'h',
            73: 'i',
            74: 'j',
            75: 'k',
            76: 'l',
            77: 'm',
            78: 'n',
            79: 'o',
            80: 'p',
            81: 'q',
            82: 'r',
            83: 's',
            84: 't',
            85: 'u',
            86: 'v',
            87: 'w',
            88: 'x',
            89: 'y',
            90: 'z',
            96: '0',
            97: '1',
            98: '2',
            99: '3',
            100: '4',
            101: '5',
            102: '6',
            103: '7',
            104: '8',
            105: '9'
          };

      if (that.options.liveSearch) $parent = $this.parent().parent();

      if (that.options.container) $parent = that.$menu;

      $items = $('[role=menu] li', $parent);

      isActive = that.$newElement.hasClass('open');

      if (!isActive && (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 65 && e.keyCode <= 90)) {
        if (!that.options.container) {
          that.setSize();
          that.$menu.parent().addClass('open');
          isActive = true;
        } else {
          that.$button.trigger('click');
        }
        that.$searchbox.focus();
      }

      if (that.options.liveSearch) {
        if (/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && that.$menu.find('.active').length === 0) {
          e.preventDefault();
          that.$menu.parent().removeClass('open');
          if (that.options.container) that.$newElement.removeClass('open');
          that.$button.focus();
        }
        // $items contains li elements when liveSearch is enabled
        $items = $('[role=menu] li' + selector, $parent);
        if (!$this.val() && !/(38|40)/.test(e.keyCode.toString(10))) {
          if ($items.filter('.active').length === 0) {
            $items = that.$menuInner.find('li');
            if (that.options.liveSearchNormalize) {
              $items = $items.filter(':a' + that._searchStyle() + '(' + normalizeToBase(keyCodeMap[e.keyCode]) + ')');
            } else {
              $items = $items.filter(':' + that._searchStyle() + '(' + keyCodeMap[e.keyCode] + ')');
            }
          }
        }
      }

      if (!$items.length) return;

      if (/(38|40)/.test(e.keyCode.toString(10))) {
        index = $items.index($items.find('a').filter(':focus').parent());
        first = $items.filter(selector).first().index();
        last = $items.filter(selector).last().index();
        next = $items.eq(index).nextAll(selector).eq(0).index();
        prev = $items.eq(index).prevAll(selector).eq(0).index();
        nextPrev = $items.eq(next).prevAll(selector).eq(0).index();

        if (that.options.liveSearch) {
          $items.each(function (i) {
            if (!$(this).hasClass('disabled')) {
              $(this).data('index', i);
            }
          });
          index = $items.index($items.filter('.active'));
          first = $items.first().data('index');
          last = $items.last().data('index');
          next = $items.eq(index).nextAll().eq(0).data('index');
          prev = $items.eq(index).prevAll().eq(0).data('index');
          nextPrev = $items.eq(next).prevAll().eq(0).data('index');
        }

        prevIndex = $this.data('prevIndex');

        if (e.keyCode == 38) {
          if (that.options.liveSearch) index--;
          if (index != nextPrev && index > prev) index = prev;
          if (index < first) index = first;
          if (index == prevIndex) index = last;
        } else if (e.keyCode == 40) {
          if (that.options.liveSearch) index++;
          if (index == -1) index = 0;
          if (index != nextPrev && index < next) index = next;
          if (index > last) index = last;
          if (index == prevIndex) index = first;
        }

        $this.data('prevIndex', index);

        if (!that.options.liveSearch) {
          $items.eq(index).children('a').focus();
        } else {
          e.preventDefault();
          if (!$this.hasClass('dropdown-toggle')) {
            $items.removeClass('active').eq(index).addClass('active').children('a').focus();
            $this.focus();
          }
        }

      } else if (!$this.is('input')) {
        var keyIndex = [],
            count,
            prevKey;

        $items.each(function () {
          if (!$(this).hasClass('disabled')) {
            if ($.trim($(this).children('a').text().toLowerCase()).substring(0, 1) == keyCodeMap[e.keyCode]) {
              keyIndex.push($(this).index());
            }
          }
        });

        count = $(document).data('keycount');
        count++;
        $(document).data('keycount', count);

        prevKey = $.trim($(':focus').text().toLowerCase()).substring(0, 1);

        if (prevKey != keyCodeMap[e.keyCode]) {
          count = 1;
          $(document).data('keycount', count);
        } else if (count >= keyIndex.length) {
          $(document).data('keycount', 0);
          if (count > keyIndex.length) count = 1;
        }

        $items.eq(keyIndex[count - 1]).children('a').focus();
      }

      // Select focused option if "Enter", "Spacebar" or "Tab" (when selectOnTab is true) are pressed inside the menu.
      if ((/(13|32)/.test(e.keyCode.toString(10)) || (/(^9$)/.test(e.keyCode.toString(10)) && that.options.selectOnTab)) && isActive) {
        if (!/(32)/.test(e.keyCode.toString(10))) e.preventDefault();
        if (!that.options.liveSearch) {
          var elem = $(':focus');
          elem.click();
          // Bring back focus for multiselects
          elem.focus();
          // Prevent screen from scrolling if the user hit the spacebar
          e.preventDefault();
          // Fixes spacebar selection of dropdown items in FF & IE
          $(document).data('spaceSelect', true);
        } else if (!/(32)/.test(e.keyCode.toString(10))) {
          that.$menuInner.find('.active a').click();
          $this.focus();
        }
        $(document).data('keycount', 0);
      }

      if ((/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && (that.multiple || that.options.liveSearch)) || (/(27)/.test(e.keyCode.toString(10)) && !isActive)) {
        that.$menu.parent().removeClass('open');
        if (that.options.container) that.$newElement.removeClass('open');
        that.$button.focus();
      }
    },

    mobile: function () {
      this.$element.addClass('mobile-device');
    },

    refresh: function () {
      this.$lis = null;
      this.liObj = {};
      this.reloadLi();
      this.render();
      this.checkDisabled();
      this.liHeight(true);
      this.setStyle();
      this.setWidth();
      if (this.$lis) this.$searchbox.trigger('propertychange');

      this.$element.trigger('refreshed.bs.select');
    },

    hide: function () {
      this.$newElement.hide();
    },

    show: function () {
      this.$newElement.show();
    },

    remove: function () {
      this.$newElement.remove();
      this.$element.remove();
    },

    destroy: function () {
        this.$newElement.before(this.$element).remove();

        if (this.$bsContainer) {
            this.$bsContainer.remove();
        } else {
            this.$menu.remove();
        }

        this.$element
          .off('.bs.select')
          .removeData('selectpicker')
          .removeClass('bs-select-hidden selectpicker');
    }
  };

  // SELECTPICKER PLUGIN DEFINITION
  // ==============================
  function Plugin(option, event) {
    // get the args of the outer function..
    var args = arguments;
    // The arguments of the function are explicitly re-defined from the argument list, because the shift causes them
    // to get lost/corrupted in android 2.3 and IE9 #715 #775
    var _option = option,
        _event = event;
    [].shift.apply(args);

    var value;
    var chain = this.each(function () {
      var $this = $(this);
      if ($this.is('select')) {
        var data = $this.data('selectpicker'),
            options = typeof _option == 'object' && _option;

        if (!data) {
          var config = $.extend({}, Selectpicker.DEFAULTS, $.fn.selectpicker.defaults || {}, $this.data(), options);
          config.template = $.extend({}, Selectpicker.DEFAULTS.template, ($.fn.selectpicker.defaults ? $.fn.selectpicker.defaults.template : {}), $this.data().template, options.template);
          $this.data('selectpicker', (data = new Selectpicker(this, config, _event)));
        } else if (options) {
          for (var i in options) {
            if (options.hasOwnProperty(i)) {
              data.options[i] = options[i];
            }
          }
        }

        if (typeof _option == 'string') {
          if (data[_option] instanceof Function) {
            value = data[_option].apply(data, args);
          } else {
            value = data.options[_option];
          }
        }
      }
    });

    if (typeof value !== 'undefined') {
      //noinspection JSUnusedAssignment
      return value;
    } else {
      return chain;
    }
  }

  var old = $.fn.selectpicker;
  $.fn.selectpicker = Plugin;
  $.fn.selectpicker.Constructor = Selectpicker;

  // SELECTPICKER NO CONFLICT
  // ========================
  $.fn.selectpicker.noConflict = function () {
    $.fn.selectpicker = old;
    return this;
  };

  $(document)
      .data('keycount', 0)
      .on('keydown.bs.select', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input', Selectpicker.prototype.keydown)
      .on('focusin.modal', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input', function (e) {
        e.stopPropagation();
      });

  // SELECTPICKER DATA-API
  // =====================
  $(window).on('load.bs.select.data-api', function () {
    $('.selectpicker').each(function () {
      var $selectpicker = $(this);
      Plugin.call($selectpicker, $selectpicker.data());
    })
  });
})(jQuery);


}));

/*! DataTables 1.10.12
 * ©2008-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.12
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2008-2015 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = $.isArray(data) && ( $.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).bind('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ) );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if ( s.nTable == this || s.nTHead.parentNode == this || (s.nTFoot && s.nTFoot.parentNode == this) )
				{
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			
			if ( oInit.oLanguage )
			{
				_fnLanguageCompat( oInit.oLanguage );
			}
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = $.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ],
				[ "bJQueryUI", "bJUI" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			// @todo Remove in 1.11
			if ( oInit.bJQueryUI )
			{
				/* Use the JUI classes object for display. You could clone the oStdClasses object if
				 * you want to have multiple tables with multiple independent classes
				 */
				$.extend( oClasses, DataTable.ext.oJUIClasses, oInit.oClasses );
			
				if ( oInit.sDom === defaults.sDom && defaults.sDom === "lfrtip" )
				{
					/* Set the DOM to use a layout suitable for jQuery UI's theming */
					oSettings.sDom = '<"H"lfr>t<"F"ip>';
				}
			
				if ( ! oSettings.renderer ) {
					oSettings.renderer = 'jqueryui';
				}
				else if ( $.isPlainObject( oSettings.renderer ) && ! oSettings.renderer.header ) {
					oSettings.renderer.header = 'jqueryui';
				}
			}
			else
			{
				$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			}
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = $.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl !== "" )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnLoadState( oSettings, oInit );
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
			}
			
			
			/*
			 * Sorting
			 * @todo For modularisation (1.11) this needs to do into a sort start up handler
			 */
			
			// If aaSorting is not defined, then we use the first indicator in asSorting
			// in case that has been altered, so the default sort reflects that option
			if ( oInit.aaSorting === undefined )
			{
				var sorting = oSettings.aaSorting;
				for ( i=0, iLen=sorting.length ; i<iLen ; i++ )
				{
					sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
				}
			}
			
			/* Do a first pass on the sorting classes (allows any size changes to be taken into
			 * account, and also will apply sorting disabled classes if disabled
			 */
			_fnSortingClasses( oSettings );
			
			if ( features.bSort )
			{
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted ) {
						var aSort = _fnSortFlatten( oSettings );
						var sortedColumns = {};
			
						$.each( aSort, function (i, val) {
							sortedColumns[ val.src ] = val.dir;
						} );
			
						_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
						_fnSortAria( oSettings );
					}
				} );
			}
			
			_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
				if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
					_fnSortingClasses( oSettings );
				}
			}, 'sc' );
			
			
			/*
			 * Final init
			 * Cache the header, body and footer as required, creating them if needed
			 */
			
			// Work around for Webkit bug 83867 - store the caption-side before removing from doc
			var captions = $this.children('caption').each( function () {
				this._captionSide = $this.css('caption-side');
			} );
			
			var thead = $this.children('thead');
			if ( thead.length === 0 )
			{
				thead = $('<thead/>').appendTo(this);
			}
			oSettings.nTHead = thead[0];
			
			var tbody = $this.children('tbody');
			if ( tbody.length === 0 )
			{
				tbody = $('<tbody/>').appendTo(this);
			}
			oSettings.nTBody = tbody[0];
			
			var tfoot = $this.children('tfoot');
			if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") )
			{
				// If we are a scrolling table, and no footer has been given, then we need to create
				// a tfoot element for the caption element to be appended to
				tfoot = $('<tfoot/>').appendTo(this);
			}
			
			if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
				$this.addClass( oClasses.sNoFooter );
			}
			else if ( tfoot.length > 0 ) {
				oSettings.nTFoot = tfoot[0];
				_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
			}
			
			/* Check if there is data passing into the constructor */
			if ( oInit.aaData )
			{
				for ( i=0 ; i<oInit.aaData.length ; i++ )
				{
					_fnAddData( oSettings, oInit.aaData[ i ] );
				}
			}
			else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' )
			{
				/* Grab the data from the page - only do this when deferred loading or no Ajax
				 * source since there is no point in reading the DOM data if we are then going
				 * to replace it with Ajax data
				 */
				_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
			}
			
			/* Copy the data index array */
			oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
			/* Initialisation complete - table can be drawn */
			oSettings.bInitialised = true;
			
			/* Check if we need to initialise the table (it might not have been handed off to the
			 * language processor)
			 */
			if ( bInitHandedOff === false )
			{
				_fnInitialise( oSettings );
			}
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n]/g;
	var _re_html = /<.*?>/g;
	var _re_date_start = /^[\w\+\-]/;
	var _re_date_end = /[\w\+\-]$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	//   standards as thousands separators.
	var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfk]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		var defaults = DataTable.defaults.oLanguage;
		var zeroRecords = lang.sZeroRecords;
	
		/* Backwards compatibility - if there is no sEmptyTable given, then use the same as
		 * sZeroRecords - assuming that is given.
		 */
		if ( ! lang.sEmptyTable && zeroRecords &&
			defaults.sEmptyTable === "No data available in table" )
		{
			_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
		}
	
		/* Likewise with loading records */
		if ( ! lang.sLoadingRecords && zeroRecords &&
			defaults.sLoadingRecords === "Loading..." )
		{
			_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
		}
	
		// Old parameter name of the thousands separator mapped onto the new
		if ( lang.sInfoThousands ) {
			lang.sThousands = lang.sInfoThousands;
		}
	
		var decimal = lang.sDecimal;
		if ( decimal ) {
			_addNumericSort( decimal );
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( dataSort && ! $.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: 0,
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! $.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( $.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( $.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = $.trim(cell.innerHTML);
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
	
				nTd = nTrIn ? anTds[i] : document.createElement( oCol.sCellType );
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( (!nTrIn || oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow] );
		}
	
		// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
		// and deployed
		row.nTr.setAttribute( 'role', 'row' );
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
	 	$(thead).find('>tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).find('>tr>th, >tr>td').addClass( classes.sHeaderTH );
		$(tfoot).find('>tr>th, >tr>td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && $.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = $.isFunction( ajaxData ) ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = $.isFunction( ajaxData ) && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( $.isFunction( ajax ) )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.bind(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.bind( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=display.length-1 ; i>=0 ; i-- ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( ! rpSearch.test( data ) ) {
				display.splice( i, 1 );
			}
		}
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=display.length-1 ; i>=0 ; i-- ) {
				if ( ! rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					display.splice( i, 1 );
				}
			}
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = $.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option( language[i], lengths[i] );
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.bind( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).bind( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css(
			scrollY && scroll.bCollapse ? 'max-height' : 'height', 
			scrollY
		);
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+headerContent[i]+'</div>';
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+footerContent[i]+'</div>';
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.scroll();
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).bind('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! $.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( $.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit )
	{
		var i, ien;
		var columns = settings.aoColumns;
	
		if ( ! settings.oFeatures.bStateSave ) {
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings );
		if ( ! state || ! state.time ) {
			return;
		}
	
		/* Allow custom and plug-in manipulation functions to alter the saved data set and
		 * cancelling of loading by returning false
		 */
		var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, state] );
		if ( $.inArray( false, abStateLoad ) !== -1 ) {
			return;
		}
	
		/* Reject old data */
		var duration = settings.iStateDuration;
		if ( duration > 0 && state.time < +new Date() - (duration*1000) ) {
			return;
		}
	
		// Number of columns have changed - all bets are off, no restore of settings
		if ( columns.length !== state.columns.length ) {
			return;
		}
	
		// Store the saved state so it might be accessed at any time
		settings.oLoadedState = $.extend( true, {}, state );
	
		// Restore key features - todo - for 1.11 this needs to be done by
		// subscribed events
		if ( state.start !== undefined ) {
			settings._iDisplayStart    = state.start;
			settings.iInitDisplayStart = state.start;
		}
		if ( state.length !== undefined ) {
			settings._iDisplayLength   = state.length;
		}
	
		// Order
		if ( state.order !== undefined ) {
			settings.aaSorting = [];
			$.each( state.order, function ( i, col ) {
				settings.aaSorting.push( col[0] >= columns.length ?
					[ 0, col[1] ] :
					col
				);
			} );
		}
	
		// Search
		if ( state.search !== undefined ) {
			$.extend( settings.oPreviousSearch, _fnSearchToHung( state.search ) );
		}
	
		// Columns
		for ( i=0, ien=state.columns.length ; i<ien ; i++ ) {
			var col = state.columns[i];
	
			// Visibility
			if ( col.visible !== undefined ) {
				columns[i].bVisible = col.visible;
			}
	
			// Search
			if ( col.search !== undefined ) {
				$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
			}
		}
	
		_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, state] );
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( $.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( $.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.bind( 'click.DT', oData, function (e) {
					n.blur(); // Remove focus outline for mouse users
					fn(e);
				} )
			.bind( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.bind( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings = settings.concat( a );
			}
		};
	
		if ( $.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			j, jen,
			struct, inner,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = typeof struct.val === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				$.isPlainObject( struct.val ) ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( $.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   []
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					$.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			a = selector[i] && selector[i].split ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? $.trim(a[j]) : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			a = search == 'none' ?
				displayMaster.slice() :                      // no search
				search == 'applied' ?
					displayFiltered.slice() :                // applied search
					$.map( displayMaster, function (el, i) { // removed search
						return $.inArray( el, displayFiltered ) === -1 ? el : null;
					} );
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	
	
	var __row_selector = function ( settings, selector, opts )
	{
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			var rows = _selector_row_indexes( settings, opts );
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( ! sel ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = settings.aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - node
			if ( sel.nodeName ) {
				if ( sel._DT_RowIndex !== undefined ) {
					return [ sel._DT_RowIndex ]; // Property added by DT for fast lookup
				}
				else if ( sel._DT_CellIndex ) {
					return [ sel._DT_CellIndex.row ];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		ctx[0].aoData[ this[0] ]._aData = data;
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( $.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td/></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.remove();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^(.+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		_fnSaveState( settings );
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			// Second loop once the first is done for events
			this.iterator( 'column', function ( settings, column ) {
				_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
			} );
	
			if ( calc === undefined || calc ) {
				this.columns.adjust();
			}
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $( [].concat.apply([], cells) );
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				return [s];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// Row + column selector
		var columns = this.columns( columnSelector, opts );
		var rows = this.rows( rowSelector, opts );
		var a, i, ien, j, jen;
	
		var cells = this.iterator( 'table', function ( settings, idx ) {
			a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! $.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return $.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			if ( ! args[0].match(/\.dt\b/) ) {
				args[0] += '.dt';
			}
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.unbind('.DT').find(':not(tbody *)').unbind('.DT');
			$(window).unbind('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			if ( settings.bJUI ) {
				$('th span.'+classes.sSortIcon+ ', td span.'+classes.sSortIcon, thead).detach();
				$('th, td', thead).each( function () {
					var wrapper = $('div.'+classes.sSortJUIWrapper, this);
					$(this).append( wrapper.contents() );
					wrapper.detach();
				} );
			}
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );
	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.12";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would at around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit.
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Enable jQuery UI ThemeRoller support (required as ThemeRoller requires some
		 * slightly different and additional mark-up from what DataTables has
		 * traditionally used).
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.jQueryUI
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "jQueryUI": true
		 *      } );
		 *    } );
		 */
		"bJQueryUI": false,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings) {
		 *          var o;
		 *
		 *          // Send an Ajax request to the server to get the data. Note that
		 *          // this is a synchronous request.
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "async": false,
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              o = json;
		 *            }
		 *          } );
		 *
		 *          return o;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features four different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus
		 *   page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "platform.details.0" },
		 *          { "data": "platform.details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * Flag to indicate if jQuery UI marking and classes should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bJUI": null,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		builder: "-source-",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! $.isNumeric( data.substring(1) ) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	(function() {
	
	// Reused strings for better compression. Closure compiler appears to have a
	// weird edge case where it is trying to expand strings rather than use the
	// variable version. This results in about 200 bytes being added, for very
	// little preference benefit since it this run on script load only.
	var _empty = '';
	_empty = '';
	
	var _stateDefault = _empty + 'ui-state-default';
	var _sortIcon     = _empty + 'css_right ui-icon ui-icon-';
	var _headerFooter = _empty + 'fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix';
	
	$.extend( DataTable.ext.oJUIClasses, DataTable.ext.classes, {
		/* Full numbers paging buttons */
		"sPageButton":         "fg-button ui-button "+_stateDefault,
		"sPageButtonActive":   "ui-state-disabled",
		"sPageButtonDisabled": "ui-state-disabled",
	
		/* Features */
		"sPaging": "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi "+
			"ui-buttonset-multi paging_", /* Note that the type is postfixed */
	
		/* Sorting */
		"sSortAsc":            _stateDefault+" sorting_asc",
		"sSortDesc":           _stateDefault+" sorting_desc",
		"sSortable":           _stateDefault+" sorting",
		"sSortableAsc":        _stateDefault+" sorting_asc_disabled",
		"sSortableDesc":       _stateDefault+" sorting_desc_disabled",
		"sSortableNone":       _stateDefault+" sorting_disabled",
		"sSortJUIAsc":         _sortIcon+"triangle-1-n",
		"sSortJUIDesc":        _sortIcon+"triangle-1-s",
		"sSortJUI":            _sortIcon+"carat-2-n-s",
		"sSortJUIAscAllowed":  _sortIcon+"carat-1-n",
		"sSortJUIDescAllowed": _sortIcon+"carat-1-s",
		"sSortJUIWrapper":     "DataTables_sort_wrapper",
		"sSortIcon":           "DataTables_sort_icon",
	
		/* Scrolling */
		"sScrollHead": "dataTables_scrollHead "+_stateDefault,
		"sScrollFoot": "dataTables_scrollFoot "+_stateDefault,
	
		/* Misc */
		"sHeaderTH":  _stateDefault,
		"sFooterTH":  _stateDefault,
		"sJUIHeader": _headerFooter+" ui-corner-tl ui-corner-tr",
		"sJUIFooter": _headerFooter+" ui-corner-bl ui-corner-br"
	} );
	
	}());
	
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( $.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = '';
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								default:
									btnDisplay = button + 1;
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': settings.iTabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 will remove any unknown characters at the start and end of the
			// expression, leading to false matches such as `$245.12` or `10%` being
			// a valid date. See forum thread 18941 for detail.
			if ( d && !(d instanceof Date) && ( ! _re_date_start.test(d) || ! _re_date_end.test(d) ) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			return Date.parse( d ) || 0;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, searcg or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));

/*! DataTables Bootstrap 3 integration
 * ©2011-2014 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 3. This requires Bootstrap 3 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function(window, document, undefined){

var factory = function( $, DataTable ) {
"use strict";


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-6'l><'col-sm-6'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-5'i><'col-sm-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper form-inline dt-bootstrap",
	sFilterInput:  "form-control input-sm",
	sLengthSelect: "form-control input-sm"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var btnDisplay, btnClass, counter=0;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( $.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&hellip;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);

					counter++;
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
	}
};


/*
 * TableTools Bootstrap compatibility
 * Required TableTools 2.1+
 */
if ( DataTable.TableTools ) {
	// Set the classes that TableTools uses to something suitable for Bootstrap
	$.extend( true, DataTable.TableTools.classes, {
		"container": "DTTT btn-group",
		"buttons": {
			"normal": "btn btn-default",
			"disabled": "disabled"
		},
		"collection": {
			"container": "DTTT_dropdown dropdown-menu",
			"buttons": {
				"normal": "",
				"disabled": "disabled"
			}
		},
		"print": {
			"info": "DTTT_print_info"
		},
		"select": {
			"row": "active"
		}
	} );

	// Have the collection use a bootstrap compatible drop down
	$.extend( true, DataTable.TableTools.DEFAULTS.oTags, {
		"collection": {
			"container": "ul",
			"button": "li",
			"liner": "a"
		}
	} );
}

}; // /factory


// Define as an AMD module if possible
if ( typeof define === 'function' && define.amd ) {
	define( ['jquery', 'datatables'], factory );
}
else if ( typeof exports === 'object' ) {
    // Node/CommonJS
    factory( require('jquery'), require('datatables') );
}
else if ( jQuery ) {
	// Otherwise simply initialise as normal, stopping multiple evaluation
	factory( jQuery, jQuery.fn.dataTable );
}


})(window, document);


/*!
 Buttons for DataTables 1.2.2
 ©2016 SpryMedia Ltd - datatables.net/license
*/
(function(d){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(n){return d(n,window,document)}):"object"===typeof exports?module.exports=function(n,o){n||(n=window);if(!o||!o.fn.dataTable)o=require("datatables.net")(n,o).$;return d(o,n,n.document)}:d(jQuery,window,document)})(function(d,n,o,m){var i=d.fn.dataTable,u=0,v=0,j=i.ext.buttons,l=function(a,b){!0===b&&(b={});d.isArray(b)&&(b={buttons:b});this.c=d.extend(!0,{},l.defaults,b);b.buttons&&(this.c.buttons=b.buttons);
this.s={dt:new i.Api(a),buttons:[],listenKeys:"",namespace:"dtb"+u++};this.dom={container:d("<"+this.c.dom.container.tag+"/>").addClass(this.c.dom.container.className)};this._constructor()};d.extend(l.prototype,{action:function(a,b){var c=this._nodeToButton(a);if(b===m)return c.conf.action;c.conf.action=b;return this},active:function(a,b){var c=this._nodeToButton(a),e=this.c.dom.button.active,c=d(c.node);if(b===m)return c.hasClass(e);c.toggleClass(e,b===m?!0:b);return this},add:function(a,b){var c=
this.s.buttons;if("string"===typeof b){for(var e=b.split("-"),c=this.s,d=0,h=e.length-1;d<h;d++)c=c.buttons[1*e[d]];c=c.buttons;b=1*e[e.length-1]}this._expandButton(c,a,!1,b);this._draw();return this},container:function(){return this.dom.container},disable:function(a){a=this._nodeToButton(a);d(a.node).addClass(this.c.dom.button.disabled);return this},destroy:function(){d("body").off("keyup."+this.s.namespace);var a=this.s.buttons.slice(),b,c;b=0;for(c=a.length;b<c;b++)this.remove(a[b].node);this.dom.container.remove();
a=this.s.dt.settings()[0];b=0;for(c=a.length;b<c;b++)if(a.inst===this){a.splice(b,1);break}return this},enable:function(a,b){if(!1===b)return this.disable(a);var c=this._nodeToButton(a);d(c.node).removeClass(this.c.dom.button.disabled);return this},name:function(){return this.c.name},node:function(a){a=this._nodeToButton(a);return d(a.node)},remove:function(a){var b=this._nodeToButton(a),c=this._nodeToHost(a),e=this.s.dt;if(b.buttons.length)for(var g=b.buttons.length-1;0<=g;g--)this.remove(b.buttons[g].node);
b.conf.destroy&&b.conf.destroy.call(e.button(a),e,d(a),b.conf);this._removeKey(b.conf);d(b.node).remove();a=d.inArray(b,c);c.splice(a,1);return this},text:function(a,b){var c=this._nodeToButton(a),e=this.c.dom.collection.buttonLiner,e=c.inCollection&&e&&e.tag?e.tag:this.c.dom.buttonLiner.tag,g=this.s.dt,h=d(c.node),f=function(a){return"function"===typeof a?a(g,h,c.conf):a};if(b===m)return f(c.conf.text);c.conf.text=b;e?h.children(e).html(f(b)):h.html(f(b));return this},_constructor:function(){var a=
this,b=this.s.dt,c=b.settings()[0],e=this.c.buttons;c._buttons||(c._buttons=[]);c._buttons.push({inst:this,name:this.c.name});for(var c=0,g=e.length;c<g;c++)this.add(e[c]);b.on("destroy",function(){a.destroy()});d("body").on("keyup."+this.s.namespace,function(b){if(!o.activeElement||o.activeElement===o.body){var c=String.fromCharCode(b.keyCode).toLowerCase();a.s.listenKeys.toLowerCase().indexOf(c)!==-1&&a._keypress(c,b)}})},_addKey:function(a){a.key&&(this.s.listenKeys+=d.isPlainObject(a.key)?a.key.key:
a.key)},_draw:function(a,b){a||(a=this.dom.container,b=this.s.buttons);a.children().detach();for(var c=0,e=b.length;c<e;c++)a.append(b[c].inserter),b[c].buttons&&b[c].buttons.length&&this._draw(b[c].collection,b[c].buttons)},_expandButton:function(a,b,c,e){for(var g=this.s.dt,h=0,b=!d.isArray(b)?[b]:b,f=0,r=b.length;f<r;f++){var k=this._resolveExtends(b[f]);if(k)if(d.isArray(k))this._expandButton(a,k,c,e);else{var p=this._buildButton(k,c);if(p){e!==m?(a.splice(e,0,p),e++):a.push(p);if(p.conf.buttons){var s=
this.c.dom.collection;p.collection=d("<"+s.tag+"/>").addClass(s.className);p.conf._collection=p.collection;this._expandButton(p.buttons,p.conf.buttons,!0,e)}k.init&&k.init.call(g.button(p.node),g,d(p.node),k);h++}}}},_buildButton:function(a,b){var c=this.c.dom.button,e=this.c.dom.buttonLiner,g=this.c.dom.collection,h=this.s.dt,f=function(b){return"function"===typeof b?b(h,k,a):b};b&&g.button&&(c=g.button);b&&g.buttonLiner&&(e=g.buttonLiner);if(a.available&&!a.available(h,a))return!1;var r=function(a,
b,c,e){e.action.call(b.button(c),a,b,c,e);d(b.table().node()).triggerHandler("buttons-action.dt",[b.button(c),b,c,e])},k=d("<"+c.tag+"/>").addClass(c.className).attr("tabindex",this.s.dt.settings()[0].iTabIndex).attr("aria-controls",this.s.dt.table().node().id).on("click.dtb",function(b){b.preventDefault();!k.hasClass(c.disabled)&&a.action&&r(b,h,k,a);k.blur()}).on("keyup.dtb",function(b){b.keyCode===13&&!k.hasClass(c.disabled)&&a.action&&r(b,h,k,a)});"a"===c.tag.toLowerCase()&&k.attr("href","#");
e.tag?(g=d("<"+e.tag+"/>").html(f(a.text)).addClass(e.className),"a"===e.tag.toLowerCase()&&g.attr("href","#"),k.append(g)):k.html(f(a.text));!1===a.enabled&&k.addClass(c.disabled);a.className&&k.addClass(a.className);a.titleAttr&&k.attr("title",a.titleAttr);a.namespace||(a.namespace=".dt-button-"+v++);e=(e=this.c.dom.buttonContainer)&&e.tag?d("<"+e.tag+"/>").addClass(e.className).append(k):k;this._addKey(a);return{conf:a,node:k.get(0),inserter:e,buttons:[],inCollection:b,collection:null}},_nodeToButton:function(a,
b){b||(b=this.s.buttons);for(var c=0,e=b.length;c<e;c++){if(b[c].node===a)return b[c];if(b[c].buttons.length){var d=this._nodeToButton(a,b[c].buttons);if(d)return d}}},_nodeToHost:function(a,b){b||(b=this.s.buttons);for(var c=0,e=b.length;c<e;c++){if(b[c].node===a)return b;if(b[c].buttons.length){var d=this._nodeToHost(a,b[c].buttons);if(d)return d}}},_keypress:function(a,b){var c=function(e){for(var g=0,h=e.length;g<h;g++){var f=e[g].conf,r=e[g].node;if(f.key)if(f.key===a)d(r).click();else if(d.isPlainObject(f.key)&&
f.key.key===a&&(!f.key.shiftKey||b.shiftKey))if(!f.key.altKey||b.altKey)if(!f.key.ctrlKey||b.ctrlKey)(!f.key.metaKey||b.metaKey)&&d(r).click();e[g].buttons.length&&c(e[g].buttons)}};c(this.s.buttons)},_removeKey:function(a){if(a.key){var b=d.isPlainObject(a.key)?a.key.key:a.key,a=this.s.listenKeys.split(""),b=d.inArray(b,a);a.splice(b,1);this.s.listenKeys=a.join("")}},_resolveExtends:function(a){for(var b=this.s.dt,c,e,g=function(c){for(var e=0;!d.isPlainObject(c)&&!d.isArray(c);){if(c===m)return;
if("function"===typeof c){if(c=c(b,a),!c)return!1}else if("string"===typeof c){if(!j[c])throw"Unknown button type: "+c;c=j[c]}e++;if(30<e)throw"Buttons: Too many iterations";}return d.isArray(c)?c:d.extend({},c)},a=g(a);a&&a.extend;){if(!j[a.extend])throw"Cannot extend unknown button type: "+a.extend;var h=g(j[a.extend]);if(d.isArray(h))return h;if(!h)return!1;c=h.className;a=d.extend({},h,a);c&&a.className!==c&&(a.className=c+" "+a.className);var f=a.postfixButtons;if(f){a.buttons||(a.buttons=[]);
c=0;for(e=f.length;c<e;c++)a.buttons.push(f[c]);a.postfixButtons=null}if(f=a.prefixButtons){a.buttons||(a.buttons=[]);c=0;for(e=f.length;c<e;c++)a.buttons.splice(c,0,f[c]);a.prefixButtons=null}a.extend=h.extend}return a}});l.background=function(a,b,c){c===m&&(c=400);a?d("<div/>").addClass(b).css("display","none").appendTo("body").fadeIn(c):d("body > div."+b).fadeOut(c,function(){d(this).removeClass(b).remove()})};l.instanceSelector=function(a,b){if(!a)return d.map(b,function(a){return a.inst});var c=
[],e=d.map(b,function(a){return a.name}),g=function(a){if(d.isArray(a))for(var f=0,r=a.length;f<r;f++)g(a[f]);else"string"===typeof a?-1!==a.indexOf(",")?g(a.split(",")):(a=d.inArray(d.trim(a),e),-1!==a&&c.push(b[a].inst)):"number"===typeof a&&c.push(b[a].inst)};g(a);return c};l.buttonSelector=function(a,b){for(var c=[],e=function(a,b,c){for(var d,g,f=0,h=b.length;f<h;f++)if(d=b[f])g=c!==m?c+f:f+"",a.push({node:d.node,name:d.conf.name,idx:g}),d.buttons&&e(a,d.buttons,g+"-")},g=function(a,b){var f,
h,i=[];e(i,b.s.buttons);f=d.map(i,function(a){return a.node});if(d.isArray(a)||a instanceof d){f=0;for(h=a.length;f<h;f++)g(a[f],b)}else if(null===a||a===m||"*"===a){f=0;for(h=i.length;f<h;f++)c.push({inst:b,node:i[f].node})}else if("number"===typeof a)c.push({inst:b,node:b.s.buttons[a].node});else if("string"===typeof a)if(-1!==a.indexOf(",")){i=a.split(",");f=0;for(h=i.length;f<h;f++)g(d.trim(i[f]),b)}else if(a.match(/^\d+(\-\d+)*$/))f=d.map(i,function(a){return a.idx}),c.push({inst:b,node:i[d.inArray(a,
f)].node});else if(-1!==a.indexOf(":name")){var j=a.replace(":name","");f=0;for(h=i.length;f<h;f++)i[f].name===j&&c.push({inst:b,node:i[f].node})}else d(f).filter(a).each(function(){c.push({inst:b,node:this})});else"object"===typeof a&&a.nodeName&&(i=d.inArray(a,f),-1!==i&&c.push({inst:b,node:f[i]}))},h=0,f=a.length;h<f;h++)g(b,a[h]);return c};l.defaults={buttons:["copy","excel","csv","pdf","print"],name:"main",tabIndex:0,dom:{container:{tag:"div",className:"dt-buttons"},collection:{tag:"div",className:"dt-button-collection"},
button:{tag:"a",className:"dt-button",active:"active",disabled:"disabled"},buttonLiner:{tag:"span",className:""}}};l.version="1.2.2";d.extend(j,{collection:{text:function(a){return a.i18n("buttons.collection","Collection")},className:"buttons-collection",action:function(a,b,c,e){var a=c.offset(),g=d(b.table().container()),h=!1;d("div.dt-button-background").length&&(h=d("div.dt-button-collection").offset(),d("body").trigger("click.dtb-collection"));e._collection.addClass(e.collectionLayout).css("display",
"none").appendTo("body").fadeIn(e.fade);var f=e._collection.css("position");h&&"absolute"===f?e._collection.css({top:h.top+5,left:h.left+5}):"absolute"===f?(e._collection.css({top:a.top+c.outerHeight(),left:a.left}),c=a.left+e._collection.outerWidth(),g=g.offset().left+g.width(),c>g&&e._collection.css("left",a.left-(c-g))):(a=e._collection.height()/2,a>d(n).height()/2&&(a=d(n).height()/2),e._collection.css("marginTop",-1*a));e.background&&l.background(!0,e.backgroundClassName,e.fade);setTimeout(function(){d("div.dt-button-background").on("click.dtb-collection",
function(){});d("body").on("click.dtb-collection",function(a){var c=d.fn.addBack?"addBack":"andSelf";if(!d(a.target).parents()[c]().filter(e._collection).length){e._collection.fadeOut(e.fade,function(){e._collection.detach()});d("div.dt-button-background").off("click.dtb-collection");l.background(false,e.backgroundClassName,e.fade);d("body").off("click.dtb-collection");b.off("buttons-action.b-internal")}})},10);if(e.autoClose)b.on("buttons-action.b-internal",function(){d("div.dt-button-background").click()})},
background:!0,collectionLayout:"",backgroundClassName:"dt-button-background",autoClose:!1,fade:400},copy:function(a,b){if(j.copyHtml5)return"copyHtml5";if(j.copyFlash&&j.copyFlash.available(a,b))return"copyFlash"},csv:function(a,b){if(j.csvHtml5&&j.csvHtml5.available(a,b))return"csvHtml5";if(j.csvFlash&&j.csvFlash.available(a,b))return"csvFlash"},excel:function(a,b){if(j.excelHtml5&&j.excelHtml5.available(a,b))return"excelHtml5";if(j.excelFlash&&j.excelFlash.available(a,b))return"excelFlash"},pdf:function(a,
b){if(j.pdfHtml5&&j.pdfHtml5.available(a,b))return"pdfHtml5";if(j.pdfFlash&&j.pdfFlash.available(a,b))return"pdfFlash"},pageLength:function(a){var a=a.settings()[0].aLengthMenu,b=d.isArray(a[0])?a[0]:a,c=d.isArray(a[0])?a[1]:a,e=function(a){return a.i18n("buttons.pageLength",{"-1":"Show all rows",_:"Show %d rows"},a.page.len())};return{extend:"collection",text:e,className:"buttons-page-length",autoClose:!0,buttons:d.map(b,function(a,b){return{text:c[b],action:function(b,c){c.page.len(a).draw()},init:function(b,
c,e){var d=this,c=function(){d.active(b.page.len()===a)};b.on("length.dt"+e.namespace,c);c()},destroy:function(a,b,c){a.off("length.dt"+c.namespace)}}}),init:function(a,b,c){var d=this;a.on("length.dt"+c.namespace,function(){d.text(e(a))})},destroy:function(a,b,c){a.off("length.dt"+c.namespace)}}}});i.Api.register("buttons()",function(a,b){b===m&&(b=a,a=m);this.selector.buttonGroup=a;var c=this.iterator(!0,"table",function(c){if(c._buttons)return l.buttonSelector(l.instanceSelector(a,c._buttons),
b)},!0);c._groupSelector=a;return c});i.Api.register("button()",function(a,b){var c=this.buttons(a,b);1<c.length&&c.splice(1,c.length);return c});i.Api.registerPlural("buttons().active()","button().active()",function(a){return a===m?this.map(function(a){return a.inst.active(a.node)}):this.each(function(b){b.inst.active(b.node,a)})});i.Api.registerPlural("buttons().action()","button().action()",function(a){return a===m?this.map(function(a){return a.inst.action(a.node)}):this.each(function(b){b.inst.action(b.node,
a)})});i.Api.register(["buttons().enable()","button().enable()"],function(a){return this.each(function(b){b.inst.enable(b.node,a)})});i.Api.register(["buttons().disable()","button().disable()"],function(){return this.each(function(a){a.inst.disable(a.node)})});i.Api.registerPlural("buttons().nodes()","button().node()",function(){var a=d();d(this.each(function(b){a=a.add(b.inst.node(b.node))}));return a});i.Api.registerPlural("buttons().text()","button().text()",function(a){return a===m?this.map(function(a){return a.inst.text(a.node)}):
this.each(function(b){b.inst.text(b.node,a)})});i.Api.registerPlural("buttons().trigger()","button().trigger()",function(){return this.each(function(a){a.inst.node(a.node).trigger("click")})});i.Api.registerPlural("buttons().containers()","buttons().container()",function(){var a=d(),b=this._groupSelector;this.iterator(!0,"table",function(c){if(c._buttons)for(var c=l.instanceSelector(b,c._buttons),d=0,g=c.length;d<g;d++)a=a.add(c[d].container())});return a});i.Api.register("button().add()",function(a,
b){var c=this.context;c.length&&(c=l.instanceSelector(this._groupSelector,c[0]._buttons),c.length&&c[0].add(b,a));return this.button(this._groupSelector,a)});i.Api.register("buttons().destroy()",function(){this.pluck("inst").unique().each(function(a){a.destroy()});return this});i.Api.registerPlural("buttons().remove()","buttons().remove()",function(){this.each(function(a){a.inst.remove(a.node)});return this});var q;i.Api.register("buttons.info()",function(a,b,c){var e=this;if(!1===a)return d("#datatables_buttons_info").fadeOut(function(){d(this).remove()}),
clearTimeout(q),q=null,this;q&&clearTimeout(q);d("#datatables_buttons_info").length&&d("#datatables_buttons_info").remove();d('<div id="datatables_buttons_info" class="dt-button-info"/>').html(a?"<h2>"+a+"</h2>":"").append(d("<div/>")["string"===typeof b?"html":"append"](b)).css("display","none").appendTo("body").fadeIn();c!==m&&0!==c&&(q=setTimeout(function(){e.buttons.info(!1)},c));return this});i.Api.register("buttons.exportData()",function(a){if(this.context.length){for(var b=new i.Api(this.context[0]),
c=d.extend(!0,{},{rows:null,columns:"",modifier:{search:"applied",order:"applied"},orthogonal:"display",stripHtml:!0,stripNewlines:!0,decodeEntities:!0,trim:!0,format:{header:function(a){return e(a)},footer:function(a){return e(a)},body:function(a){return e(a)}}},a),e=function(a){if("string"!==typeof a)return a;c.stripHtml&&(a=a.replace(/<[^>]*>/g,""));c.trim&&(a=a.replace(/^\s+|\s+$/g,""));c.stripNewlines&&(a=a.replace(/\n/g," "));c.decodeEntities&&(t.innerHTML=a,a=t.value);return a},a=b.columns(c.columns).indexes().map(function(a){var d=
b.column(a).header();return c.format.header(d.innerHTML,a,d)}).toArray(),g=b.table().footer()?b.columns(c.columns).indexes().map(function(a){var d=b.column(a).footer();return c.format.footer(d?d.innerHTML:"",a,d)}).toArray():null,h=b.rows(c.rows,c.modifier).indexes().toArray(),f=b.cells(h,c.columns).render(c.orthogonal).toArray(),h=b.cells(h,c.columns).nodes().toArray(),j=a.length,k=0<j?f.length/j:0,l=Array(k),m=0,n=0;n<k;n++){for(var o=Array(j),q=0;q<j;q++)o[q]=c.format.body(f[m],n,q,h[m]),m++;l[n]=
o}return{header:a,footer:g,body:l}}});var t=d("<textarea/>")[0];d.fn.dataTable.Buttons=l;d.fn.DataTable.Buttons=l;d(o).on("init.dt plugin-init.dt",function(a,b){if("dt"===a.namespace){var c=b.oInit.buttons||i.defaults.buttons;c&&!b._buttons&&(new l(b,c)).container()}});i.ext.feature.push({fnInit:function(a){var a=new i.Api(a),b=a.init().buttons||i.defaults.buttons;return(new l(a,b)).container()},cFeature:"B"});return l});

/*!
 RowReorder 1.2.5
 2015-2018 SpryMedia Ltd - datatables.net/license
*/
(function(d){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(f){return d(f,window,document)}):"object"===typeof exports?module.exports=function(f,g){f||(f=window);if(!g||!g.fn.dataTable)g=require("datatables.net")(f,g).$;return d(g,f,f.document)}:d(jQuery,window,document)})(function(d,f,g,m){var h=d.fn.dataTable,k=function(c,b){if(!h.versionCheck||!h.versionCheck("1.10.8"))throw"DataTables RowReorder requires DataTables 1.10.8 or newer";this.c=d.extend(!0,{},h.defaults.rowReorder,
k.defaults,b);this.s={bodyTop:null,dt:new h.Api(c),getDataFn:h.ext.oApi._fnGetObjectDataFn(this.c.dataSrc),middles:null,scroll:{},scrollInterval:null,setDataFn:h.ext.oApi._fnSetObjectDataFn(this.c.dataSrc),start:{top:0,left:0,offsetTop:0,offsetLeft:0,nodes:[]},windowHeight:0,documentOuterHeight:0,domCloneOuterHeight:0};this.dom={clone:null,dtScroll:d("div.dataTables_scrollBody",this.s.dt.table().container())};var a=this.s.dt.settings()[0],e=a.rowreorder;if(e)return e;a.rowreorder=this;this._constructor()};
d.extend(k.prototype,{_constructor:function(){var c=this,b=this.s.dt,a=d(b.table().node());"static"===a.css("position")&&a.css("position","relative");d(b.table().container()).on("mousedown.rowReorder touchstart.rowReorder",this.c.selector,function(a){if(c.c.enable){if(d(a.target).is(c.c.excludedChildren))return!0;var i=d(this).closest("tr"),j=b.row(i);if(j.any())return c._emitEvent("pre-row-reorder",{node:j.node(),index:j.index()}),c._mouseDown(a,i),!1}});b.on("destroy.rowReorder",function(){d(b.table().container()).off(".rowReorder");
b.off(".rowReorder")})},_cachePositions:function(){var c=this.s.dt,b=d(c.table().node()).find("thead").outerHeight(),a=d.unique(c.rows({page:"current"}).nodes().toArray()),e=d.map(a,function(a){return d(a).position().top-b}),a=d.map(e,function(a,b){return e.length<b-1?(a+e[b+1])/2:(a+a+d(c.row(":last-child").node()).outerHeight())/2});this.s.middles=a;this.s.bodyTop=d(c.table().body()).offset().top;this.s.windowHeight=d(f).height();this.s.documentOuterHeight=d(g).outerHeight()},_clone:function(c){var b=
d(this.s.dt.table().node().cloneNode(!1)).addClass("dt-rowReorder-float").append("<tbody/>").append(c.clone(!1)),a=c.outerWidth(),e=c.outerHeight(),i=c.children().map(function(){return d(this).width()});b.width(a).height(e).find("tr").children().each(function(a){this.style.width=i[a]+"px"});b.appendTo("body");this.dom.clone=b;this.s.domCloneOuterHeight=b.outerHeight()},_clonePosition:function(c){var b=this.s.start,a=this._eventToPage(c,"Y")-b.top,c=this._eventToPage(c,"X")-b.left,e=this.c.snapX,a=
a+b.offsetTop,b=!0===e?b.offsetLeft:"number"===typeof e?b.offsetLeft+e:c+b.offsetLeft;0>a?a=0:a+this.s.domCloneOuterHeight>this.s.documentOuterHeight&&(a=this.s.documentOuterHeight-this.s.domCloneOuterHeight);this.dom.clone.css({top:a,left:b})},_emitEvent:function(c,b){this.s.dt.iterator("table",function(a){d(a.nTable).triggerHandler(c+".dt",b)})},_eventToPage:function(c,b){return-1!==c.type.indexOf("touch")?c.originalEvent.touches[0]["page"+b]:c["page"+b]},_mouseDown:function(c,b){var a=this,e=this.s.dt,
i=this.s.start,j=b.offset();i.top=this._eventToPage(c,"Y");i.left=this._eventToPage(c,"X");i.offsetTop=j.top;i.offsetLeft=j.left;i.nodes=d.unique(e.rows({page:"current"}).nodes().toArray());this._cachePositions();this._clone(b);this._clonePosition(c);this.dom.target=b;b.addClass("dt-rowReorder-moving");d(g).on("mouseup.rowReorder touchend.rowReorder",function(b){a._mouseUp(b)}).on("mousemove.rowReorder touchmove.rowReorder",function(b){a._mouseMove(b)});d(f).width()===d(g).width()&&d(g.body).addClass("dt-rowReorder-noOverflow");
e=this.dom.dtScroll;this.s.scroll={windowHeight:d(f).height(),windowWidth:d(f).width(),dtTop:e.length?e.offset().top:null,dtLeft:e.length?e.offset().left:null,dtHeight:e.length?e.outerHeight():null,dtWidth:e.length?e.outerWidth():null}},_mouseMove:function(c){this._clonePosition(c);for(var b=this._eventToPage(c,"Y")-this.s.bodyTop,a=this.s.middles,e=null,i=this.s.dt,j=i.table().body(),g=0,f=a.length;g<f;g++)if(b<a[g]){e=g;break}null===e&&(e=a.length);if(null===this.s.lastInsert||this.s.lastInsert!==
e)0===e?this.dom.target.prependTo(j):(b=d.unique(i.rows({page:"current"}).nodes().toArray()),e>this.s.lastInsert?this.dom.target.insertAfter(b[e-1]):this.dom.target.insertBefore(b[e])),this._cachePositions(),this.s.lastInsert=e;this._shiftScroll(c)},_mouseUp:function(){var c=this,b=this.s.dt,a,e,i=this.c.dataSrc;this.dom.clone.remove();this.dom.clone=null;this.dom.target.removeClass("dt-rowReorder-moving");d(g).off(".rowReorder");d(g.body).removeClass("dt-rowReorder-noOverflow");clearInterval(this.s.scrollInterval);
this.s.scrollInterval=null;var j=this.s.start.nodes,f=d.unique(b.rows({page:"current"}).nodes().toArray()),k={},h=[],l=[],n=this.s.getDataFn,m=this.s.setDataFn;a=0;for(e=j.length;a<e;a++)if(j[a]!==f[a]){var o=b.row(f[a]).id(),s=b.row(f[a]).data(),p=b.row(j[a]).data();o&&(k[o]=n(p));h.push({node:f[a],oldData:n(s),newData:n(p),newPosition:a,oldPosition:d.inArray(f[a],j)});l.push(f[a])}var q=[h,{dataSrc:i,nodes:l,values:k,triggerRow:b.row(this.dom.target)}];this._emitEvent("row-reorder",q);var r=function(){if(c.c.update){a=
0;for(e=h.length;a<e;a++){var d=b.row(h[a].node).data();m(d,h[a].newData);b.columns().every(function(){this.dataSrc()===i&&b.cell(h[a].node,this.index()).invalidate("data")})}c._emitEvent("row-reordered",q);b.draw(!1)}};this.c.editor?(this.c.enable=!1,this.c.editor.edit(l,!1,d.extend({submit:"changed"},this.c.formOptions)).multiSet(i,k).one("preSubmitCancelled.rowReorder",function(){c.c.enable=!0;c.c.editor.off(".rowReorder");b.draw(!1)}).one("submitUnsuccessful.rowReorder",function(){b.draw(!1)}).one("submitSuccess.rowReorder",
function(){r()}).one("submitComplete",function(){c.c.enable=!0;c.c.editor.off(".rowReorder")}).submit()):r()},_shiftScroll:function(c){var b=this,a=this.s.scroll,e=!1,d=c.pageY-g.body.scrollTop,f,h;65>d?f=-5:d>a.windowHeight-65&&(f=5);null!==a.dtTop&&c.pageY<a.dtTop+65?h=-5:null!==a.dtTop&&c.pageY>a.dtTop+a.dtHeight-65&&(h=5);f||h?(a.windowVert=f,a.dtVert=h,e=!0):this.s.scrollInterval&&(clearInterval(this.s.scrollInterval),this.s.scrollInterval=null);!this.s.scrollInterval&&e&&(this.s.scrollInterval=
setInterval(function(){if(a.windowVert)g.body.scrollTop=g.body.scrollTop+a.windowVert;if(a.dtVert){var c=b.dom.dtScroll[0];if(a.dtVert)c.scrollTop=c.scrollTop+a.dtVert}},20))}});k.defaults={dataSrc:0,editor:null,enable:!0,formOptions:{},selector:"td:first-child",snapX:!1,update:!0,excludedChildren:"a"};var l=d.fn.dataTable.Api;l.register("rowReorder()",function(){return this});l.register("rowReorder.enable()",function(c){c===m&&(c=!0);return this.iterator("table",function(b){b.rowreorder&&(b.rowreorder.c.enable=
c)})});l.register("rowReorder.disable()",function(){return this.iterator("table",function(c){c.rowreorder&&(c.rowreorder.c.enable=!1)})});k.version="1.2.5";d.fn.dataTable.RowReorder=k;d.fn.DataTable.RowReorder=k;d(g).on("init.dt.dtr",function(c,b){if("dt"===c.namespace){var a=b.oInit.rowReorder,e=h.defaults.rowReorder;if(a||e)e=d.extend({},a,e),!1!==a&&new k(b,e)}});return k});

/*!
 Responsive 2.2.3
 2014-2018 SpryMedia Ltd - datatables.net/license
*/
(function(d){"function"===typeof define&&define.amd?define(["jquery","datatables.net"],function(l){return d(l,window,document)}):"object"===typeof exports?module.exports=function(l,j){l||(l=window);if(!j||!j.fn.dataTable)j=require("datatables.net")(l,j).$;return d(j,l,l.document)}:d(jQuery,window,document)})(function(d,l,j,q){function t(a,b,c){var e=b+"-"+c;if(n[e])return n[e];for(var d=[],a=a.cell(b,c).node().childNodes,b=0,c=a.length;b<c;b++)d.push(a[b]);return n[e]=d}function r(a,b,d){var e=b+
"-"+d;if(n[e]){for(var a=a.cell(b,d).node(),d=n[e][0].parentNode.childNodes,b=[],f=0,g=d.length;f<g;f++)b.push(d[f]);d=0;for(f=b.length;d<f;d++)a.appendChild(b[d]);n[e]=q}}var o=d.fn.dataTable,i=function(a,b){if(!o.versionCheck||!o.versionCheck("1.10.10"))throw"DataTables Responsive requires DataTables 1.10.10 or newer";this.s={dt:new o.Api(a),columns:[],current:[]};this.s.dt.settings()[0].responsive||(b&&"string"===typeof b.details?b.details={type:b.details}:b&&!1===b.details?b.details={type:!1}:
b&&!0===b.details&&(b.details={type:"inline"}),this.c=d.extend(!0,{},i.defaults,o.defaults.responsive,b),a.responsive=this,this._constructor())};d.extend(i.prototype,{_constructor:function(){var a=this,b=this.s.dt,c=b.settings()[0],e=d(l).width();b.settings()[0]._responsive=this;d(l).on("resize.dtr orientationchange.dtr",o.util.throttle(function(){var b=d(l).width();b!==e&&(a._resize(),e=b)}));c.oApi._fnCallbackReg(c,"aoRowCreatedCallback",function(e){-1!==d.inArray(!1,a.s.current)&&d(">td, >th",
e).each(function(e){e=b.column.index("toData",e);!1===a.s.current[e]&&d(this).css("display","none")})});b.on("destroy.dtr",function(){b.off(".dtr");d(b.table().body()).off(".dtr");d(l).off("resize.dtr orientationchange.dtr");d.each(a.s.current,function(b,e){!1===e&&a._setColumnVis(b,!0)})});this.c.breakpoints.sort(function(a,b){return a.width<b.width?1:a.width>b.width?-1:0});this._classLogic();this._resizeAuto();c=this.c.details;!1!==c.type&&(a._detailsInit(),b.on("column-visibility.dtr",function(){a._timer&&
clearTimeout(a._timer);a._timer=setTimeout(function(){a._timer=null;a._classLogic();a._resizeAuto();a._resize();a._redrawChildren()},100)}),b.on("draw.dtr",function(){a._redrawChildren()}),d(b.table().node()).addClass("dtr-"+c.type));b.on("column-reorder.dtr",function(){a._classLogic();a._resizeAuto();a._resize()});b.on("column-sizing.dtr",function(){a._resizeAuto();a._resize()});b.on("preXhr.dtr",function(){var e=[];b.rows().every(function(){this.child.isShown()&&e.push(this.id(true))});b.one("draw.dtr",
function(){a._resizeAuto();a._resize();b.rows(e).every(function(){a._detailsDisplay(this,false)})})});b.on("init.dtr",function(){a._resizeAuto();a._resize();d.inArray(false,a.s.current)&&b.columns.adjust()});this._resize()},_columnsVisiblity:function(a){var b=this.s.dt,c=this.s.columns,e,f,g=c.map(function(a,b){return{columnIdx:b,priority:a.priority}}).sort(function(a,b){return a.priority!==b.priority?a.priority-b.priority:a.columnIdx-b.columnIdx}),h=d.map(c,function(e,c){return!1===b.column(c).visible()?
"not-visible":e.auto&&null===e.minWidth?!1:!0===e.auto?"-":-1!==d.inArray(a,e.includeIn)}),m=0;e=0;for(f=h.length;e<f;e++)!0===h[e]&&(m+=c[e].minWidth);e=b.settings()[0].oScroll;e=e.sY||e.sX?e.iBarWidth:0;m=b.table().container().offsetWidth-e-m;e=0;for(f=h.length;e<f;e++)c[e].control&&(m-=c[e].minWidth);var s=!1;e=0;for(f=g.length;e<f;e++){var k=g[e].columnIdx;"-"===h[k]&&(!c[k].control&&c[k].minWidth)&&(s||0>m-c[k].minWidth?(s=!0,h[k]=!1):h[k]=!0,m-=c[k].minWidth)}g=!1;e=0;for(f=c.length;e<f;e++)if(!c[e].control&&
!c[e].never&&!1===h[e]){g=!0;break}e=0;for(f=c.length;e<f;e++)c[e].control&&(h[e]=g),"not-visible"===h[e]&&(h[e]=!1);-1===d.inArray(!0,h)&&(h[0]=!0);return h},_classLogic:function(){var a=this,b=this.c.breakpoints,c=this.s.dt,e=c.columns().eq(0).map(function(a){var b=this.column(a),e=b.header().className,a=c.settings()[0].aoColumns[a].responsivePriority;a===q&&(b=d(b.header()).data("priority"),a=b!==q?1*b:1E4);return{className:e,includeIn:[],auto:!1,control:!1,never:e.match(/\bnever\b/)?!0:!1,priority:a}}),
f=function(a,b){var c=e[a].includeIn;-1===d.inArray(b,c)&&c.push(b)},g=function(d,c,g,k){if(g)if("max-"===g){k=a._find(c).width;c=0;for(g=b.length;c<g;c++)b[c].width<=k&&f(d,b[c].name)}else if("min-"===g){k=a._find(c).width;c=0;for(g=b.length;c<g;c++)b[c].width>=k&&f(d,b[c].name)}else{if("not-"===g){c=0;for(g=b.length;c<g;c++)-1===b[c].name.indexOf(k)&&f(d,b[c].name)}}else e[d].includeIn.push(c)};e.each(function(a,e){for(var c=a.className.split(" "),f=!1,i=0,l=c.length;i<l;i++){var j=d.trim(c[i]);
if("all"===j){f=!0;a.includeIn=d.map(b,function(a){return a.name});return}if("none"===j||a.never){f=!0;return}if("control"===j){f=!0;a.control=!0;return}d.each(b,function(a,b){var d=b.name.split("-"),c=j.match(RegExp("(min\\-|max\\-|not\\-)?("+d[0]+")(\\-[_a-zA-Z0-9])?"));c&&(f=!0,c[2]===d[0]&&c[3]==="-"+d[1]?g(e,b.name,c[1],c[2]+c[3]):c[2]===d[0]&&!c[3]&&g(e,b.name,c[1],c[2]))})}f||(a.auto=!0)});this.s.columns=e},_detailsDisplay:function(a,b){var c=this,e=this.s.dt,f=this.c.details;if(f&&!1!==f.type){var g=
f.display(a,b,function(){return f.renderer(e,a[0],c._detailsObj(a[0]))});(!0===g||!1===g)&&d(e.table().node()).triggerHandler("responsive-display.dt",[e,a,g,b])}},_detailsInit:function(){var a=this,b=this.s.dt,c=this.c.details;"inline"===c.type&&(c.target="td:first-child, th:first-child");b.on("draw.dtr",function(){a._tabIndexes()});a._tabIndexes();d(b.table().body()).on("keyup.dtr","td, th",function(a){a.keyCode===13&&d(this).data("dtr-keyboard")&&d(this).click()});var e=c.target;d(b.table().body()).on("click.dtr mousedown.dtr mouseup.dtr",
"string"===typeof e?e:"td, th",function(c){if(d(b.table().node()).hasClass("collapsed")&&d.inArray(d(this).closest("tr").get(0),b.rows().nodes().toArray())!==-1){if(typeof e==="number"){var g=e<0?b.columns().eq(0).length+e:e;if(b.cell(this).index().column!==g)return}g=b.row(d(this).closest("tr"));c.type==="click"?a._detailsDisplay(g,false):c.type==="mousedown"?d(this).css("outline","none"):c.type==="mouseup"&&d(this).blur().css("outline","")}})},_detailsObj:function(a){var b=this,c=this.s.dt;return d.map(this.s.columns,
function(e,d){if(!e.never&&!e.control)return{title:c.settings()[0].aoColumns[d].sTitle,data:c.cell(a,d).render(b.c.orthogonal),hidden:c.column(d).visible()&&!b.s.current[d],columnIndex:d,rowIndex:a}})},_find:function(a){for(var b=this.c.breakpoints,c=0,e=b.length;c<e;c++)if(b[c].name===a)return b[c]},_redrawChildren:function(){var a=this,b=this.s.dt;b.rows({page:"current"}).iterator("row",function(c,e){b.row(e);a._detailsDisplay(b.row(e),!0)})},_resize:function(){var a=this,b=this.s.dt,c=d(l).width(),
e=this.c.breakpoints,f=e[0].name,g=this.s.columns,h,m=this.s.current.slice();for(h=e.length-1;0<=h;h--)if(c<=e[h].width){f=e[h].name;break}var i=this._columnsVisiblity(f);this.s.current=i;e=!1;h=0;for(c=g.length;h<c;h++)if(!1===i[h]&&!g[h].never&&!g[h].control&&!1===!b.column(h).visible()){e=!0;break}d(b.table().node()).toggleClass("collapsed",e);var k=!1,j=0;b.columns().eq(0).each(function(b,c){!0===i[c]&&j++;i[c]!==m[c]&&(k=!0,a._setColumnVis(b,i[c]))});k&&(this._redrawChildren(),d(b.table().node()).trigger("responsive-resize.dt",
[b,this.s.current]),0===b.page.info().recordsDisplay&&d("td",b.table().body()).eq(0).attr("colspan",j))},_resizeAuto:function(){var a=this.s.dt,b=this.s.columns;if(this.c.auto&&-1!==d.inArray(!0,d.map(b,function(a){return a.auto}))){d.isEmptyObject(n)||d.each(n,function(b){b=b.split("-");r(a,1*b[0],1*b[1])});a.table().node();var c=a.table().node().cloneNode(!1),e=d(a.table().header().cloneNode(!1)).appendTo(c),f=d(a.table().body()).clone(!1,!1).empty().appendTo(c),g=a.columns().header().filter(function(b){return a.column(b).visible()}).to$().clone(!1).css("display",
"table-cell").css("min-width",0);d(f).append(d(a.rows({page:"current"}).nodes()).clone(!1)).find("th, td").css("display","");if(f=a.table().footer()){var f=d(f.cloneNode(!1)).appendTo(c),h=a.columns().footer().filter(function(b){return a.column(b).visible()}).to$().clone(!1).css("display","table-cell");d("<tr/>").append(h).appendTo(f)}d("<tr/>").append(g).appendTo(e);"inline"===this.c.details.type&&d(c).addClass("dtr-inline collapsed");d(c).find("[name]").removeAttr("name");d(c).css("position","relative");
c=d("<div/>").css({width:1,height:1,overflow:"hidden",clear:"both"}).append(c);c.insertBefore(a.table().node());g.each(function(c){c=a.column.index("fromVisible",c);b[c].minWidth=this.offsetWidth||0});c.remove()}},_setColumnVis:function(a,b){var c=this.s.dt,e=b?"":"none";d(c.column(a).header()).css("display",e);d(c.column(a).footer()).css("display",e);c.column(a).nodes().to$().css("display",e);d.isEmptyObject(n)||c.cells(null,a).indexes().each(function(a){r(c,a.row,a.column)})},_tabIndexes:function(){var a=
this.s.dt,b=a.cells({page:"current"}).nodes().to$(),c=a.settings()[0],e=this.c.details.target;b.filter("[data-dtr-keyboard]").removeData("[data-dtr-keyboard]");"number"===typeof e?a.cells(null,e,{page:"current"}).nodes().to$().attr("tabIndex",c.iTabIndex).data("dtr-keyboard",1):("td:first-child, th:first-child"===e&&(e=">td:first-child, >th:first-child"),d(e,a.rows({page:"current"}).nodes()).attr("tabIndex",c.iTabIndex).data("dtr-keyboard",1))}});i.breakpoints=[{name:"desktop",width:Infinity},{name:"tablet-l",
width:1024},{name:"tablet-p",width:768},{name:"mobile-l",width:480},{name:"mobile-p",width:320}];i.display={childRow:function(a,b,c){if(b){if(d(a.node()).hasClass("parent"))return a.child(c(),"child").show(),!0}else{if(a.child.isShown())return a.child(!1),d(a.node()).removeClass("parent"),!1;a.child(c(),"child").show();d(a.node()).addClass("parent");return!0}},childRowImmediate:function(a,b,c){if(!b&&a.child.isShown()||!a.responsive.hasHidden())return a.child(!1),d(a.node()).removeClass("parent"),
!1;a.child(c(),"child").show();d(a.node()).addClass("parent");return!0},modal:function(a){return function(b,c,e){if(c)d("div.dtr-modal-content").empty().append(e());else{var f=function(){g.remove();d(j).off("keypress.dtr")},g=d('<div class="dtr-modal"/>').append(d('<div class="dtr-modal-display"/>').append(d('<div class="dtr-modal-content"/>').append(e())).append(d('<div class="dtr-modal-close">&times;</div>').click(function(){f()}))).append(d('<div class="dtr-modal-background"/>').click(function(){f()})).appendTo("body");
d(j).on("keyup.dtr",function(a){27===a.keyCode&&(a.stopPropagation(),f())})}a&&a.header&&d("div.dtr-modal-content").prepend("<h2>"+a.header(b)+"</h2>")}}};var n={};i.renderer={listHiddenNodes:function(){return function(a,b,c){var e=d('<ul data-dtr-index="'+b+'" class="dtr-details"/>'),f=!1;d.each(c,function(b,c){c.hidden&&(d('<li data-dtr-index="'+c.columnIndex+'" data-dt-row="'+c.rowIndex+'" data-dt-column="'+c.columnIndex+'"><span class="dtr-title">'+c.title+"</span> </li>").append(d('<span class="dtr-data"/>').append(t(a,
c.rowIndex,c.columnIndex))).appendTo(e),f=!0)});return f?e:!1}},listHidden:function(){return function(a,b,c){return(a=d.map(c,function(a){return a.hidden?'<li data-dtr-index="'+a.columnIndex+'" data-dt-row="'+a.rowIndex+'" data-dt-column="'+a.columnIndex+'"><span class="dtr-title">'+a.title+'</span> <span class="dtr-data">'+a.data+"</span></li>":""}).join(""))?d('<ul data-dtr-index="'+b+'" class="dtr-details"/>').append(a):!1}},tableAll:function(a){a=d.extend({tableClass:""},a);return function(b,
c,e){b=d.map(e,function(a){return'<tr data-dt-row="'+a.rowIndex+'" data-dt-column="'+a.columnIndex+'"><td>'+a.title+":</td> <td>"+a.data+"</td></tr>"}).join("");return d('<table class="'+a.tableClass+' dtr-details" width="100%"/>').append(b)}}};i.defaults={breakpoints:i.breakpoints,auto:!0,details:{display:i.display.childRow,renderer:i.renderer.listHidden(),target:0,type:"inline"},orthogonal:"display"};var p=d.fn.dataTable.Api;p.register("responsive()",function(){return this});p.register("responsive.index()",
function(a){a=d(a);return{column:a.data("dtr-index"),row:a.parent().data("dtr-index")}});p.register("responsive.rebuild()",function(){return this.iterator("table",function(a){a._responsive&&a._responsive._classLogic()})});p.register("responsive.recalc()",function(){return this.iterator("table",function(a){a._responsive&&(a._responsive._resizeAuto(),a._responsive._resize())})});p.register("responsive.hasHidden()",function(){var a=this.context[0];return a._responsive?-1!==d.inArray(!1,a._responsive.s.current):
!1});p.registerPlural("columns().responsiveHidden()","column().responsiveHidden()",function(){return this.iterator("column",function(a,b){return a._responsive?a._responsive.s.current[b]:!1},1)});i.version="2.2.3";d.fn.dataTable.Responsive=i;d.fn.DataTable.Responsive=i;d(j).on("preInit.dt.dtr",function(a,b){if("dt"===a.namespace&&(d(b.nTable).hasClass("responsive")||d(b.nTable).hasClass("dt-responsive")||b.oInit.responsive||o.defaults.responsive)){var c=b.oInit.responsive;!1!==c&&new i(b,d.isPlainObject(c)?
c:{})}});return i});

(function(f){"function"===typeof define&&define.amd?define(["jquery","datatables.net","datatables.net-buttons"],function(j){return f(j,window,document)}):"object"===typeof exports?module.exports=function(j,k){j||(j=window);if(!k||!k.fn.dataTable)k=require("datatables.net")(j,k).$;k.fn.dataTable.Buttons||require("datatables.net-buttons")(j,k);return f(k,j,j.document)}:f(jQuery,window,document)})(function(f,j,k,o){function l(a,b,d){var c=a.createElement(b);d&&(d.attr&&f(c).attr(d.attr),d.children&&
f.each(d.children,function(a,b){c.appendChild(b)}),d.text&&c.appendChild(a.createTextNode(d.text)));return c}function z(a,b){var d=a.header[b].length,c;a.footer&&a.footer[b].length>d&&(d=a.footer[b].length);for(var e=0,g=a.body.length;e<g&&!(c=a.body[e][b].toString().length,c>d&&(d=c),40<d);e++);return 5<d?d:5}function v(a){n===o&&(n=-1===w.serializeToString(f.parseXML(p["xl/worksheets/sheet1.xml"])).indexOf("xmlns:r"));f.each(a,function(b,d){if(f.isPlainObject(d))v(d);else{if(n){var c=d.childNodes[0],
e,g,h=[];for(e=c.attributes.length-1;0<=e;e--){g=c.attributes[e].nodeName;var q=c.attributes[e].nodeValue;-1!==g.indexOf(":")&&(h.push({name:g,value:q}),c.removeAttribute(g))}e=0;for(g=h.length;e<g;e++)q=d.createAttribute(h[e].name.replace(":","_dt_b_namespace_token_")),q.value=h[e].value,c.setAttributeNode(q)}c=w.serializeToString(d);n&&(-1===c.indexOf("<?xml")&&(c='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+c),c=c.replace(/_dt_b_namespace_token_/g,":"));c=c.replace(/<row xmlns="" /g,
"<row ").replace(/<cols xmlns="">/g,"<cols>");a[b]=c}})}var i=f.fn.dataTable,h={version:"1.0.5-TableTools2",clients:{},moviePath:"",nextId:1,$:function(a){"string"==typeof a&&(a=k.getElementById(a));a.addClass||(a.hide=function(){this.style.display="none"},a.show=function(){this.style.display=""},a.addClass=function(a){this.removeClass(a);this.className+=" "+a},a.removeClass=function(a){this.className=this.className.replace(RegExp("\\s*"+a+"\\s*")," ").replace(/^\s+/,"").replace(/\s+$/,"")},a.hasClass=
function(a){return!!this.className.match(RegExp("\\s*"+a+"\\s*"))});return a},setMoviePath:function(a){this.moviePath=a},dispatch:function(a,b,d){(a=this.clients[a])&&a.receiveEvent(b,d)},log:function(a){console.log("Flash: "+a)},register:function(a,b){this.clients[a]=b},getDOMObjectPosition:function(a){var b={left:0,top:0,width:a.width?a.width:a.offsetWidth,height:a.height?a.height:a.offsetHeight};""!==a.style.width&&(b.width=a.style.width.replace("px",""));""!==a.style.height&&(b.height=a.style.height.replace("px",
""));for(;a;)b.left+=a.offsetLeft,b.top+=a.offsetTop,a=a.offsetParent;return b},Client:function(a){this.handlers={};this.id=h.nextId++;this.movieId="ZeroClipboard_TableToolsMovie_"+this.id;h.register(this.id,this);a&&this.glue(a)}};h.Client.prototype={id:0,ready:!1,movie:null,clipText:"",fileName:"",action:"copy",handCursorEnabled:!0,cssEffects:!0,handlers:null,sized:!1,sheetName:"",glue:function(a,b){this.domElement=h.$(a);var d=99;this.domElement.style.zIndex&&(d=parseInt(this.domElement.style.zIndex,
10)+1);var c=h.getDOMObjectPosition(this.domElement);this.div=k.createElement("div");var e=this.div.style;e.position="absolute";e.left="0px";e.top="0px";e.width=c.width+"px";e.height=c.height+"px";e.zIndex=d;"undefined"!=typeof b&&""!==b&&(this.div.title=b);0!==c.width&&0!==c.height&&(this.sized=!0);this.domElement&&(this.domElement.appendChild(this.div),this.div.innerHTML=this.getHTML(c.width,c.height).replace(/&/g,"&amp;"))},positionElement:function(){var a=h.getDOMObjectPosition(this.domElement),
b=this.div.style;b.position="absolute";b.width=a.width+"px";b.height=a.height+"px";0!==a.width&&0!==a.height&&(this.sized=!0,b=this.div.childNodes[0],b.width=a.width,b.height=a.height)},getHTML:function(a,b){var d="",c="id="+this.id+"&width="+a+"&height="+b;if(navigator.userAgent.match(/MSIE/))var e=location.href.match(/^https/i)?"https://":"http://",d=d+('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="'+e+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="'+
a+'" height="'+b+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+h.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+c+'"/><param name="wmode" value="transparent"/></object>');else d+='<embed id="'+this.movieId+'" src="'+h.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+
a+'" height="'+b+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+c+'" wmode="transparent" />';return d},hide:function(){this.div&&(this.div.style.left="-2000px")},show:function(){this.reposition()},destroy:function(){var a=this;this.domElement&&this.div&&(f(this.div).remove(),this.div=this.domElement=null,f.each(h.clients,function(b,d){d===a&&delete h.clients[b]}))},
reposition:function(a){a&&((this.domElement=h.$(a))||this.hide());if(this.domElement&&this.div){var a=h.getDOMObjectPosition(this.domElement),b=this.div.style;b.left=""+a.left+"px";b.top=""+a.top+"px"}},clearText:function(){this.clipText="";this.ready&&this.movie.clearText()},appendText:function(a){this.clipText+=a;this.ready&&this.movie.appendText(a)},setText:function(a){this.clipText=a;this.ready&&this.movie.setText(a)},setFileName:function(a){this.fileName=a;this.ready&&this.movie.setFileName(a)},
setSheetData:function(a){this.ready&&this.movie.setSheetData(JSON.stringify(a))},setAction:function(a){this.action=a;this.ready&&this.movie.setAction(a)},addEventListener:function(a,b){a=a.toString().toLowerCase().replace(/^on/,"");this.handlers[a]||(this.handlers[a]=[]);this.handlers[a].push(b)},setHandCursor:function(a){this.handCursorEnabled=a;this.ready&&this.movie.setHandCursor(a)},setCSSEffects:function(a){this.cssEffects=!!a},receiveEvent:function(a,b){var d,a=a.toString().toLowerCase().replace(/^on/,
"");switch(a){case "load":this.movie=k.getElementById(this.movieId);if(!this.movie){d=this;setTimeout(function(){d.receiveEvent("load",null)},1);return}if(!this.ready&&navigator.userAgent.match(/Firefox/)&&navigator.userAgent.match(/Windows/)){d=this;setTimeout(function(){d.receiveEvent("load",null)},100);this.ready=!0;return}this.ready=!0;this.movie.clearText();this.movie.appendText(this.clipText);this.movie.setFileName(this.fileName);this.movie.setAction(this.action);this.movie.setHandCursor(this.handCursorEnabled);
break;case "mouseover":this.domElement&&this.cssEffects&&this.recoverActive&&this.domElement.addClass("active");break;case "mouseout":this.domElement&&this.cssEffects&&(this.recoverActive=!1,this.domElement.hasClass("active")&&(this.domElement.removeClass("active"),this.recoverActive=!0));break;case "mousedown":this.domElement&&this.cssEffects&&this.domElement.addClass("active");break;case "mouseup":this.domElement&&this.cssEffects&&(this.domElement.removeClass("active"),this.recoverActive=!1)}if(this.handlers[a])for(var c=
0,e=this.handlers[a].length;c<e;c++){var g=this.handlers[a][c];if("function"==typeof g)g(this,b);else if("object"==typeof g&&2==g.length)g[0][g[1]](this,b);else if("string"==typeof g)j[g](this,b)}}};h.hasFlash=function(){try{if(new ActiveXObject("ShockwaveFlash.ShockwaveFlash"))return!0}catch(a){if(navigator.mimeTypes&&navigator.mimeTypes["application/x-shockwave-flash"]!==o&&navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin)return!0}return!1};j.ZeroClipboard_TableTools=h;var x=function(a,
b){b.attr("id");b.parents("html").length?a.glue(b[0],""):setTimeout(function(){x(a,b)},500)},r=function(a,b){var d="*"===a.filename&&"*"!==a.title&&a.title!==o?a.title:a.filename;"function"===typeof d&&(d=d());-1!==d.indexOf("*")&&(d=f.trim(d.replace("*",f("title").text())));d=d.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g,"");return b===o||!0===b?d+a.extension:d},A=function(a){var b="Sheet1";a.sheetName&&(b=a.sheetName.replace(/[\[\]\*\/\\\?\:]/g,""));return b},s=function(a,b){var d=b.match(/[\s\S]{1,8192}/g)||
[];a.clearText();for(var c=0,e=d.length;c<e;c++)a.appendText(d[c])},y=function(a,b){for(var d=b.newline?b.newline:navigator.userAgent.match(/Windows/)?"\r\n":"\n",c=a.buttons.exportData(b.exportOptions),e=b.fieldBoundary,g=b.fieldSeparator,f=RegExp(e,"g"),h=b.escapeChar!==o?b.escapeChar:"\\",j=function(a){for(var b="",c=0,d=a.length;c<d;c++)0<c&&(b+=g),b+=e?e+(""+a[c]).replace(f,h+e)+e:a[c];return b},k=b.header?j(c.header)+d:"",m=b.footer&&c.footer?d+j(c.footer):"",l=[],u=0,B=c.body.length;u<B;u++)l.push(j(c.body[u]));
return{str:k+l.join(d)+m,rows:l.length}},t={available:function(){return h.hasFlash()},init:function(a,b,d){h.moviePath=i.Buttons.swfPath;var c=new h.Client;c.setHandCursor(!0);c.addEventListener("mouseDown",function(){d._fromFlash=!0;a.button(b[0]).trigger();d._fromFlash=!1});x(c,b);d._flash=c},destroy:function(a,b,d){d._flash.destroy()},fieldSeparator:",",fieldBoundary:'"',exportOptions:{},title:"*",filename:"*",extension:".csv",header:!0,footer:!1};try{var w=new XMLSerializer,n}catch(C){}var p=
{"_rels/.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',"xl/_rels/workbook.xml.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
"[Content_Types].xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml" /><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" /><Default Extension="jpeg" ContentType="image/jpeg" /><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" /><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" /><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" /></Types>',
"xl/workbook.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/><workbookPr showInkAnnotation="0" autoCompressPictures="0"/><bookViews><workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/></bookViews><sheets><sheet name="" sheetId="1" r:id="rId1"/></sheets></workbook>',
"xl/worksheets/sheet1.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><sheetData/></worksheet>',"xl/styles.xml":'<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><fonts count="5" x14ac:knownFonts="1"><font><sz val="11" /><name val="Calibri" /></font><font><sz val="11" /><name val="Calibri" /><color rgb="FFFFFFFF" /></font><font><sz val="11" /><name val="Calibri" /><b /></font><font><sz val="11" /><name val="Calibri" /><i /></font><font><sz val="11" /><name val="Calibri" /><u /></font></fonts><fills count="6"><fill><patternFill patternType="none" /></fill><fill/><fill><patternFill patternType="solid"><fgColor rgb="FFD9D9D9" /><bgColor indexed="64" /></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD99795" /><bgColor indexed="64" /></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="ffc6efce" /><bgColor indexed="64" /></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="ffc6cfef" /><bgColor indexed="64" /></patternFill></fill></fills><borders count="2"><border><left /><right /><top /><bottom /><diagonal /></border><border diagonalUp="false" diagonalDown="false"><left style="thin"><color auto="1" /></left><right style="thin"><color auto="1" /></right><top style="thin"><color auto="1" /></top><bottom style="thin"><color auto="1" /></bottom><diagonal /></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" /></cellStyleXfs><cellXfs count="56"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="left"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="right"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="fill"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment textRotation="90"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment wrapText="1"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0" /></cellStyles><dxfs count="0" /><tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" /></styleSheet>'};
i.Buttons.swfPath="//cdn.datatables.net/buttons/1.2.0/swf/flashExport.swf";i.Api.register("buttons.resize()",function(){f.each(h.clients,function(a,b){b.domElement!==o&&b.domElement.parentNode&&b.positionElement()})});i.ext.buttons.copyFlash=f.extend({},t,{className:"buttons-copy buttons-flash",text:function(a){return a.i18n("buttons.copy","Copy")},action:function(a,b,d,c){c._fromFlash&&(a=c._flash,d=y(b,c),c=c.customize?c.customize(d.str,c):d.str,a.setAction("copy"),s(a,c),b.buttons.info(b.i18n("buttons.copyTitle",
"Copy to clipboard"),b.i18n("buttons.copySuccess",{_:"Copied %d rows to clipboard",1:"Copied 1 row to clipboard"},d.rows),3E3))},fieldSeparator:"\t",fieldBoundary:""});i.ext.buttons.csvFlash=f.extend({},t,{className:"buttons-csv buttons-flash",text:function(a){return a.i18n("buttons.csv","CSV")},action:function(a,b,d,c){a=c._flash;b=y(b,c);b=c.customize?c.customize(b.str,c):b.str;a.setAction("csv");a.setFileName(r(c));s(a,b)},escapeChar:'"'});i.ext.buttons.excelFlash=f.extend({},t,{className:"buttons-excel buttons-flash",
text:function(a){return a.i18n("buttons.excel","Excel")},action:function(a,b,d,c){var a=c._flash,e=0,g=f.parseXML(p["xl/worksheets/sheet1.xml"]),h=g.getElementsByTagName("sheetData")[0],d={_rels:{".rels":f.parseXML(p["_rels/.rels"])},xl:{_rels:{"workbook.xml.rels":f.parseXML(p["xl/_rels/workbook.xml.rels"])},"workbook.xml":f.parseXML(p["xl/workbook.xml"]),"styles.xml":f.parseXML(p["xl/styles.xml"]),worksheets:{"sheet1.xml":g}},"[Content_Types].xml":f.parseXML(p["[Content_Types].xml"])},b=b.buttons.exportData(c.exportOptions),
j,k,i=function(a){j=e+1;k=l(g,"row",{attr:{r:j}});for(var b=0,c=a.length;b<c;b++){for(var d=b,i="";0<=d;)i=String.fromCharCode(d%26+65)+i,d=Math.floor(d/26)-1;d=i+""+j;if(null===a[b]||a[b]===o)a[b]="";"number"===typeof a[b]||a[b].match&&f.trim(a[b]).match(/^-?\d+(\.\d+)?$/)&&!f.trim(a[b]).match(/^0\d+/)?d=l(g,"c",{attr:{t:"n",r:d},children:[l(g,"v",{text:a[b]})]}):(i=!a[b].replace?a[b]:a[b].replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g,""),d=l(g,"c",{attr:{t:"inlineStr",r:d},children:{row:l(g,
"is",{children:{row:l(g,"t",{text:i})}})}}));k.appendChild(d)}h.appendChild(k);e++};f("sheets sheet",d.xl["workbook.xml"]).attr("name",A(c));c.customizeData&&c.customizeData(b);c.header&&(i(b.header,e),f("row c",g).attr("s","2"));for(var m=0,n=b.body.length;m<n;m++)i(b.body[m],e);c.footer&&b.footer&&(i(b.footer,e),f("row:last c",g).attr("s","2"));i=l(g,"cols");f("worksheet",g).prepend(i);m=0;for(n=b.header.length;m<n;m++)i.appendChild(l(g,"col",{attr:{min:m+1,max:m+1,width:z(b,m),customWidth:1}}));
c.customize&&c.customize(d);v(d);a.setAction("excel");a.setFileName(r(c));a.setSheetData(d);s(a,"")},extension:".xlsx"});i.ext.buttons.pdfFlash=f.extend({},t,{className:"buttons-pdf buttons-flash",text:function(a){return a.i18n("buttons.pdf","PDF")},action:function(a,b,d,c){var a=c._flash,e=b.buttons.exportData(c.exportOptions),g=b.table().node().offsetWidth,f=b.columns(c.columns).indexes().map(function(a){return b.column(a).header().offsetWidth/g});a.setAction("pdf");a.setFileName(r(c));s(a,JSON.stringify({title:r(c,
!1),message:"function"==typeof c.message?c.message(b,d,c):c.message,colWidth:f.toArray(),orientation:c.orientation,size:c.pageSize,header:c.header?e.header:null,footer:c.footer?e.footer:null,body:e.body}))},extension:".pdf",orientation:"portrait",pageSize:"A4",message:"",newline:"\n"});return i.Buttons});

/*!

JSZip - A Javascript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2014 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/
!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;"undefined"!=typeof window?b=window:"undefined"!=typeof global?b=global:"undefined"!=typeof self&&(b=self),b.JSZip=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";c.encode=function(a){for(var b,c,e,f,g,h,i,j="",k=0;k<a.length;)b=a.charCodeAt(k++),c=a.charCodeAt(k++),e=a.charCodeAt(k++),f=b>>2,g=(3&b)<<4|c>>4,h=(15&c)<<2|e>>6,i=63&e,isNaN(c)?h=i=64:isNaN(e)&&(i=64),j=j+d.charAt(f)+d.charAt(g)+d.charAt(h)+d.charAt(i);return j},c.decode=function(a){var b,c,e,f,g,h,i,j="",k=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");k<a.length;)f=d.indexOf(a.charAt(k++)),g=d.indexOf(a.charAt(k++)),h=d.indexOf(a.charAt(k++)),i=d.indexOf(a.charAt(k++)),b=f<<2|g>>4,c=(15&g)<<4|h>>2,e=(3&h)<<6|i,j+=String.fromCharCode(b),64!=h&&(j+=String.fromCharCode(c)),64!=i&&(j+=String.fromCharCode(e));return j}},{}],2:[function(a,b){"use strict";function c(){this.compressedSize=0,this.uncompressedSize=0,this.crc32=0,this.compressionMethod=null,this.compressedContent=null}c.prototype={getContent:function(){return null},getCompressedContent:function(){return null}},b.exports=c},{}],3:[function(a,b,c){"use strict";c.STORE={magic:"\x00\x00",compress:function(a){return a},uncompress:function(a){return a},compressInputType:null,uncompressInputType:null},c.DEFLATE=a("./flate")},{"./flate":8}],4:[function(a,b){"use strict";var c=a("./utils"),d=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];b.exports=function(a,b){if("undefined"==typeof a||!a.length)return 0;var e="string"!==c.getTypeOf(a);"undefined"==typeof b&&(b=0);var f=0,g=0,h=0;b=-1^b;for(var i=0,j=a.length;j>i;i++)h=e?a[i]:a.charCodeAt(i),g=255&(b^h),f=d[g],b=b>>>8^f;return-1^b}},{"./utils":21}],5:[function(a,b){"use strict";function c(){this.data=null,this.length=0,this.index=0}var d=a("./utils");c.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<a||0>a)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(){},readInt:function(a){var b,c=0;for(this.checkOffset(a),b=this.index+a-1;b>=this.index;b--)c=(c<<8)+this.byteAt(b);return this.index+=a,c},readString:function(a){return d.transformTo("string",this.readData(a))},readData:function(){},lastIndexOfSignature:function(){},readDate:function(){var a=this.readInt(4);return new Date((a>>25&127)+1980,(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1)}},b.exports=c},{"./utils":21}],6:[function(a,b,c){"use strict";c.base64=!1,c.binary=!1,c.dir=!1,c.createFolders=!1,c.date=null,c.compression=null,c.compressionOptions=null,c.comment=null,c.unixPermissions=null,c.dosPermissions=null},{}],7:[function(a,b,c){"use strict";var d=a("./utils");c.string2binary=function(a){return d.string2binary(a)},c.string2Uint8Array=function(a){return d.transformTo("uint8array",a)},c.uint8Array2String=function(a){return d.transformTo("string",a)},c.string2Blob=function(a){var b=d.transformTo("arraybuffer",a);return d.arrayBuffer2Blob(b)},c.arrayBuffer2Blob=function(a){return d.arrayBuffer2Blob(a)},c.transformTo=function(a,b){return d.transformTo(a,b)},c.getTypeOf=function(a){return d.getTypeOf(a)},c.checkSupport=function(a){return d.checkSupport(a)},c.MAX_VALUE_16BITS=d.MAX_VALUE_16BITS,c.MAX_VALUE_32BITS=d.MAX_VALUE_32BITS,c.pretty=function(a){return d.pretty(a)},c.findCompression=function(a){return d.findCompression(a)},c.isRegExp=function(a){return d.isRegExp(a)}},{"./utils":21}],8:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,e=a("pako");c.uncompressInputType=d?"uint8array":"array",c.compressInputType=d?"uint8array":"array",c.magic="\b\x00",c.compress=function(a,b){return e.deflateRaw(a,{level:b.level||-1})},c.uncompress=function(a){return e.inflateRaw(a)}},{pako:24}],9:[function(a,b){"use strict";function c(a,b){return this instanceof c?(this.files={},this.comment=null,this.root="",a&&this.load(a,b),void(this.clone=function(){var a=new c;for(var b in this)"function"!=typeof this[b]&&(a[b]=this[b]);return a})):new c(a,b)}var d=a("./base64");c.prototype=a("./object"),c.prototype.load=a("./load"),c.support=a("./support"),c.defaults=a("./defaults"),c.utils=a("./deprecatedPublicUtils"),c.base64={encode:function(a){return d.encode(a)},decode:function(a){return d.decode(a)}},c.compressions=a("./compressions"),b.exports=c},{"./base64":1,"./compressions":3,"./defaults":6,"./deprecatedPublicUtils":7,"./load":10,"./object":13,"./support":17}],10:[function(a,b){"use strict";var c=a("./base64"),d=a("./zipEntries");b.exports=function(a,b){var e,f,g,h;for(b=b||{},b.base64&&(a=c.decode(a)),f=new d(a,b),e=f.files,g=0;g<e.length;g++)h=e[g],this.file(h.fileName,h.decompressed,{binary:!0,optimizedBinaryString:!0,date:h.date,dir:h.dir,comment:h.fileComment.length?h.fileComment:null,unixPermissions:h.unixPermissions,dosPermissions:h.dosPermissions,createFolders:b.createFolders});return f.zipComment.length&&(this.comment=f.zipComment),this}},{"./base64":1,"./zipEntries":22}],11:[function(a,b){(function(a){"use strict";b.exports=function(b,c){return new a(b,c)},b.exports.test=function(b){return a.isBuffer(b)}}).call(this,"undefined"!=typeof Buffer?Buffer:void 0)},{}],12:[function(a,b){"use strict";function c(a){this.data=a,this.length=this.data.length,this.index=0}var d=a("./uint8ArrayReader");c.prototype=new d,c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./uint8ArrayReader":18}],13:[function(a,b){"use strict";var c=a("./support"),d=a("./utils"),e=a("./crc32"),f=a("./signature"),g=a("./defaults"),h=a("./base64"),i=a("./compressions"),j=a("./compressedObject"),k=a("./nodeBuffer"),l=a("./utf8"),m=a("./stringWriter"),n=a("./uint8ArrayWriter"),o=function(a){if(a._data instanceof j&&(a._data=a._data.getContent(),a.options.binary=!0,a.options.base64=!1,"uint8array"===d.getTypeOf(a._data))){var b=a._data;a._data=new Uint8Array(b.length),0!==b.length&&a._data.set(b,0)}return a._data},p=function(a){var b=o(a),e=d.getTypeOf(b);return"string"===e?!a.options.binary&&c.nodebuffer?k(b,"utf-8"):a.asBinary():b},q=function(a){var b=o(this);return null===b||"undefined"==typeof b?"":(this.options.base64&&(b=h.decode(b)),b=a&&this.options.binary?D.utf8decode(b):d.transformTo("string",b),a||this.options.binary||(b=d.transformTo("string",D.utf8encode(b))),b)},r=function(a,b,c){this.name=a,this.dir=c.dir,this.date=c.date,this.comment=c.comment,this.unixPermissions=c.unixPermissions,this.dosPermissions=c.dosPermissions,this._data=b,this.options=c,this._initialMetadata={dir:c.dir,date:c.date}};r.prototype={asText:function(){return q.call(this,!0)},asBinary:function(){return q.call(this,!1)},asNodeBuffer:function(){var a=p(this);return d.transformTo("nodebuffer",a)},asUint8Array:function(){var a=p(this);return d.transformTo("uint8array",a)},asArrayBuffer:function(){return this.asUint8Array().buffer}};var s=function(a,b){var c,d="";for(c=0;b>c;c++)d+=String.fromCharCode(255&a),a>>>=8;return d},t=function(){var a,b,c={};for(a=0;a<arguments.length;a++)for(b in arguments[a])arguments[a].hasOwnProperty(b)&&"undefined"==typeof c[b]&&(c[b]=arguments[a][b]);return c},u=function(a){return a=a||{},a.base64!==!0||null!==a.binary&&void 0!==a.binary||(a.binary=!0),a=t(a,g),a.date=a.date||new Date,null!==a.compression&&(a.compression=a.compression.toUpperCase()),a},v=function(a,b,c){var e,f=d.getTypeOf(b);if(c=u(c),"string"==typeof c.unixPermissions&&(c.unixPermissions=parseInt(c.unixPermissions,8)),c.unixPermissions&&16384&c.unixPermissions&&(c.dir=!0),c.dosPermissions&&16&c.dosPermissions&&(c.dir=!0),c.dir&&(a=x(a)),c.createFolders&&(e=w(a))&&y.call(this,e,!0),c.dir||null===b||"undefined"==typeof b)c.base64=!1,c.binary=!1,b=null,f=null;else if("string"===f)c.binary&&!c.base64&&c.optimizedBinaryString!==!0&&(b=d.string2binary(b));else{if(c.base64=!1,c.binary=!0,!(f||b instanceof j))throw new Error("The data of '"+a+"' is in an unsupported format !");"arraybuffer"===f&&(b=d.transformTo("uint8array",b))}var g=new r(a,b,c);return this.files[a]=g,g},w=function(a){"/"==a.slice(-1)&&(a=a.substring(0,a.length-1));var b=a.lastIndexOf("/");return b>0?a.substring(0,b):""},x=function(a){return"/"!=a.slice(-1)&&(a+="/"),a},y=function(a,b){return b="undefined"!=typeof b?b:!1,a=x(a),this.files[a]||v.call(this,a,null,{dir:!0,createFolders:b}),this.files[a]},z=function(a,b,c){var f,g=new j;return a._data instanceof j?(g.uncompressedSize=a._data.uncompressedSize,g.crc32=a._data.crc32,0===g.uncompressedSize||a.dir?(b=i.STORE,g.compressedContent="",g.crc32=0):a._data.compressionMethod===b.magic?g.compressedContent=a._data.getCompressedContent():(f=a._data.getContent(),g.compressedContent=b.compress(d.transformTo(b.compressInputType,f),c))):(f=p(a),(!f||0===f.length||a.dir)&&(b=i.STORE,f=""),g.uncompressedSize=f.length,g.crc32=e(f),g.compressedContent=b.compress(d.transformTo(b.compressInputType,f),c)),g.compressedSize=g.compressedContent.length,g.compressionMethod=b.magic,g},A=function(a,b){var c=a;return a||(c=b?16893:33204),(65535&c)<<16},B=function(a){return 63&(a||0)},C=function(a,b,c,g,h){var i,j,k,m,n=(c.compressedContent,d.transformTo("string",l.utf8encode(b.name))),o=b.comment||"",p=d.transformTo("string",l.utf8encode(o)),q=n.length!==b.name.length,r=p.length!==o.length,t=b.options,u="",v="",w="";k=b._initialMetadata.dir!==b.dir?b.dir:t.dir,m=b._initialMetadata.date!==b.date?b.date:t.date;var x=0,y=0;k&&(x|=16),"UNIX"===h?(y=798,x|=A(b.unixPermissions,k)):(y=20,x|=B(b.dosPermissions,k)),i=m.getHours(),i<<=6,i|=m.getMinutes(),i<<=5,i|=m.getSeconds()/2,j=m.getFullYear()-1980,j<<=4,j|=m.getMonth()+1,j<<=5,j|=m.getDate(),q&&(v=s(1,1)+s(e(n),4)+n,u+="up"+s(v.length,2)+v),r&&(w=s(1,1)+s(this.crc32(p),4)+p,u+="uc"+s(w.length,2)+w);var z="";z+="\n\x00",z+=q||r?"\x00\b":"\x00\x00",z+=c.compressionMethod,z+=s(i,2),z+=s(j,2),z+=s(c.crc32,4),z+=s(c.compressedSize,4),z+=s(c.uncompressedSize,4),z+=s(n.length,2),z+=s(u.length,2);var C=f.LOCAL_FILE_HEADER+z+n+u,D=f.CENTRAL_FILE_HEADER+s(y,2)+z+s(p.length,2)+"\x00\x00\x00\x00"+s(x,4)+s(g,4)+n+u+p;return{fileRecord:C,dirRecord:D,compressedObject:c}},D={load:function(){throw new Error("Load method is not defined. Is the file jszip-load.js included ?")},filter:function(a){var b,c,d,e,f=[];for(b in this.files)this.files.hasOwnProperty(b)&&(d=this.files[b],e=new r(d.name,d._data,t(d.options)),c=b.slice(this.root.length,b.length),b.slice(0,this.root.length)===this.root&&a(c,e)&&f.push(e));return f},file:function(a,b,c){if(1===arguments.length){if(d.isRegExp(a)){var e=a;return this.filter(function(a,b){return!b.dir&&e.test(a)})}return this.filter(function(b,c){return!c.dir&&b===a})[0]||null}return a=this.root+a,v.call(this,a,b,c),this},folder:function(a){if(!a)return this;if(d.isRegExp(a))return this.filter(function(b,c){return c.dir&&a.test(b)});var b=this.root+a,c=y.call(this,b),e=this.clone();return e.root=c.name,e},remove:function(a){a=this.root+a;var b=this.files[a];if(b||("/"!=a.slice(-1)&&(a+="/"),b=this.files[a]),b&&!b.dir)delete this.files[a];else for(var c=this.filter(function(b,c){return c.name.slice(0,a.length)===a}),d=0;d<c.length;d++)delete this.files[c[d].name];return this},generate:function(a){a=t(a||{},{base64:!0,compression:"STORE",compressionOptions:null,type:"base64",platform:"DOS",comment:null,mimeType:"application/zip"}),d.checkSupport(a.type),("darwin"===a.platform||"freebsd"===a.platform||"linux"===a.platform||"sunos"===a.platform)&&(a.platform="UNIX"),"win32"===a.platform&&(a.platform="DOS");var b,c,e=[],g=0,j=0,k=d.transformTo("string",this.utf8encode(a.comment||this.comment||""));for(var l in this.files)if(this.files.hasOwnProperty(l)){var o=this.files[l],p=o.options.compression||a.compression.toUpperCase(),q=i[p];if(!q)throw new Error(p+" is not a valid compression method !");var r=o.options.compressionOptions||a.compressionOptions||{},u=z.call(this,o,q,r),v=C.call(this,l,o,u,g,a.platform);g+=v.fileRecord.length+u.compressedSize,j+=v.dirRecord.length,e.push(v)}var w="";w=f.CENTRAL_DIRECTORY_END+"\x00\x00\x00\x00"+s(e.length,2)+s(e.length,2)+s(j,4)+s(g,4)+s(k.length,2)+k;var x=a.type.toLowerCase();for(b="uint8array"===x||"arraybuffer"===x||"blob"===x||"nodebuffer"===x?new n(g+j+w.length):new m(g+j+w.length),c=0;c<e.length;c++)b.append(e[c].fileRecord),b.append(e[c].compressedObject.compressedContent);for(c=0;c<e.length;c++)b.append(e[c].dirRecord);b.append(w);var y=b.finalize();switch(a.type.toLowerCase()){case"uint8array":case"arraybuffer":case"nodebuffer":return d.transformTo(a.type.toLowerCase(),y);case"blob":return d.arrayBuffer2Blob(d.transformTo("arraybuffer",y),a.mimeType);case"base64":return a.base64?h.encode(y):y;default:return y}},crc32:function(a,b){return e(a,b)},utf8encode:function(a){return d.transformTo("string",l.utf8encode(a))},utf8decode:function(a){return l.utf8decode(a)}};b.exports=D},{"./base64":1,"./compressedObject":2,"./compressions":3,"./crc32":4,"./defaults":6,"./nodeBuffer":11,"./signature":14,"./stringWriter":16,"./support":17,"./uint8ArrayWriter":19,"./utf8":20,"./utils":21}],14:[function(a,b,c){"use strict";c.LOCAL_FILE_HEADER="PK",c.CENTRAL_FILE_HEADER="PK",c.CENTRAL_DIRECTORY_END="PK",c.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",c.ZIP64_CENTRAL_DIRECTORY_END="PK",c.DATA_DESCRIPTOR="PK\b"},{}],15:[function(a,b){"use strict";function c(a,b){this.data=a,b||(this.data=e.string2binary(this.data)),this.length=this.data.length,this.index=0}var d=a("./dataReader"),e=a("./utils");c.prototype=new d,c.prototype.byteAt=function(a){return this.data.charCodeAt(a)},c.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":5,"./utils":21}],16:[function(a,b){"use strict";var c=a("./utils"),d=function(){this.data=[]};d.prototype={append:function(a){a=c.transformTo("string",a),this.data.push(a)},finalize:function(){return this.data.join("")}},b.exports=d},{"./utils":21}],17:[function(a,b,c){(function(a){"use strict";if(c.base64=!0,c.array=!0,c.string=!0,c.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,c.nodebuffer="undefined"!=typeof a,c.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)c.blob=!1;else{var b=new ArrayBuffer(0);try{c.blob=0===new Blob([b],{type:"application/zip"}).size}catch(d){try{var e=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,f=new e;f.append(b),c.blob=0===f.getBlob("application/zip").size}catch(d){c.blob=!1}}}}).call(this,"undefined"!=typeof Buffer?Buffer:void 0)},{}],18:[function(a,b){"use strict";function c(a){a&&(this.data=a,this.length=this.data.length,this.index=0)}var d=a("./dataReader");c.prototype=new d,c.prototype.byteAt=function(a){return this.data[a]},c.prototype.lastIndexOfSignature=function(a){for(var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=this.length-4;f>=0;--f)if(this.data[f]===b&&this.data[f+1]===c&&this.data[f+2]===d&&this.data[f+3]===e)return f;return-1},c.prototype.readData=function(a){if(this.checkOffset(a),0===a)return new Uint8Array(0);var b=this.data.subarray(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":5}],19:[function(a,b){"use strict";var c=a("./utils"),d=function(a){this.data=new Uint8Array(a),this.index=0};d.prototype={append:function(a){0!==a.length&&(a=c.transformTo("uint8array",a),this.data.set(a,this.index),this.index+=a.length)},finalize:function(){return this.data}},b.exports=d},{"./utils":21}],20:[function(a,b,c){"use strict";for(var d=a("./utils"),e=a("./support"),f=a("./nodeBuffer"),g=new Array(256),h=0;256>h;h++)g[h]=h>=252?6:h>=248?5:h>=240?4:h>=224?3:h>=192?2:1;g[254]=g[254]=1;var i=function(a){var b,c,d,f,g,h=a.length,i=0;for(f=0;h>f;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),i+=128>c?1:2048>c?2:65536>c?3:4;for(b=e.uint8array?new Uint8Array(i):new Array(i),g=0,f=0;i>g;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),128>c?b[g++]=c:2048>c?(b[g++]=192|c>>>6,b[g++]=128|63&c):65536>c?(b[g++]=224|c>>>12,b[g++]=128|c>>>6&63,b[g++]=128|63&c):(b[g++]=240|c>>>18,b[g++]=128|c>>>12&63,b[g++]=128|c>>>6&63,b[g++]=128|63&c);return b},j=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return 0>c?b:0===c?b:c+g[a[c]]>b?c:b},k=function(a){var b,c,e,f,h=a.length,i=new Array(2*h);for(c=0,b=0;h>b;)if(e=a[b++],128>e)i[c++]=e;else if(f=g[e],f>4)i[c++]=65533,b+=f-1;else{for(e&=2===f?31:3===f?15:7;f>1&&h>b;)e=e<<6|63&a[b++],f--;f>1?i[c++]=65533:65536>e?i[c++]=e:(e-=65536,i[c++]=55296|e>>10&1023,i[c++]=56320|1023&e)}return i.length!==c&&(i.subarray?i=i.subarray(0,c):i.length=c),d.applyFromCharCode(i)};c.utf8encode=function(a){return e.nodebuffer?f(a,"utf-8"):i(a)},c.utf8decode=function(a){if(e.nodebuffer)return d.transformTo("nodebuffer",a).toString("utf-8");a=d.transformTo(e.uint8array?"uint8array":"array",a);for(var b=[],c=0,f=a.length,g=65536;f>c;){var h=j(a,Math.min(c+g,f));b.push(e.uint8array?k(a.subarray(c,h)):k(a.slice(c,h))),c=h}return b.join("")}},{"./nodeBuffer":11,"./support":17,"./utils":21}],21:[function(a,b,c){"use strict";function d(a){return a}function e(a,b){for(var c=0;c<a.length;++c)b[c]=255&a.charCodeAt(c);return b}function f(a){var b=65536,d=[],e=a.length,f=c.getTypeOf(a),g=0,h=!0;try{switch(f){case"uint8array":String.fromCharCode.apply(null,new Uint8Array(0));break;case"nodebuffer":String.fromCharCode.apply(null,j(0))}}catch(i){h=!1}if(!h){for(var k="",l=0;l<a.length;l++)k+=String.fromCharCode(a[l]);return k}for(;e>g&&b>1;)try{d.push("array"===f||"nodebuffer"===f?String.fromCharCode.apply(null,a.slice(g,Math.min(g+b,e))):String.fromCharCode.apply(null,a.subarray(g,Math.min(g+b,e)))),g+=b}catch(i){b=Math.floor(b/2)}return d.join("")}function g(a,b){for(var c=0;c<a.length;c++)b[c]=a[c];return b}var h=a("./support"),i=a("./compressions"),j=a("./nodeBuffer");c.string2binary=function(a){for(var b="",c=0;c<a.length;c++)b+=String.fromCharCode(255&a.charCodeAt(c));return b},c.arrayBuffer2Blob=function(a,b){c.checkSupport("blob"),b=b||"application/zip";try{return new Blob([a],{type:b})}catch(d){try{var e=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,f=new e;return f.append(a),f.getBlob(b)}catch(d){throw new Error("Bug : can't construct the Blob.")}}},c.applyFromCharCode=f;var k={};k.string={string:d,array:function(a){return e(a,new Array(a.length))},arraybuffer:function(a){return k.string.uint8array(a).buffer},uint8array:function(a){return e(a,new Uint8Array(a.length))},nodebuffer:function(a){return e(a,j(a.length))}},k.array={string:f,array:d,arraybuffer:function(a){return new Uint8Array(a).buffer},uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(a)}},k.arraybuffer={string:function(a){return f(new Uint8Array(a))},array:function(a){return g(new Uint8Array(a),new Array(a.byteLength))},arraybuffer:d,uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(new Uint8Array(a))}},k.uint8array={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return a.buffer},uint8array:d,nodebuffer:function(a){return j(a)}},k.nodebuffer={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return k.nodebuffer.uint8array(a).buffer},uint8array:function(a){return g(a,new Uint8Array(a.length))},nodebuffer:d},c.transformTo=function(a,b){if(b||(b=""),!a)return b;c.checkSupport(a);var d=c.getTypeOf(b),e=k[d][a](b);return e},c.getTypeOf=function(a){return"string"==typeof a?"string":"[object Array]"===Object.prototype.toString.call(a)?"array":h.nodebuffer&&j.test(a)?"nodebuffer":h.uint8array&&a instanceof Uint8Array?"uint8array":h.arraybuffer&&a instanceof ArrayBuffer?"arraybuffer":void 0},c.checkSupport=function(a){var b=h[a.toLowerCase()];if(!b)throw new Error(a+" is not supported by this browser")},c.MAX_VALUE_16BITS=65535,c.MAX_VALUE_32BITS=-1,c.pretty=function(a){var b,c,d="";for(c=0;c<(a||"").length;c++)b=a.charCodeAt(c),d+="\\x"+(16>b?"0":"")+b.toString(16).toUpperCase();return d},c.findCompression=function(a){for(var b in i)if(i.hasOwnProperty(b)&&i[b].magic===a)return i[b];return null},c.isRegExp=function(a){return"[object RegExp]"===Object.prototype.toString.call(a)}},{"./compressions":3,"./nodeBuffer":11,"./support":17}],22:[function(a,b){"use strict";function c(a,b){this.files=[],this.loadOptions=b,a&&this.load(a)}var d=a("./stringReader"),e=a("./nodeBufferReader"),f=a("./uint8ArrayReader"),g=a("./utils"),h=a("./signature"),i=a("./zipEntry"),j=a("./support"),k=a("./object");c.prototype={checkSignature:function(a){var b=this.reader.readString(4);if(b!==a)throw new Error("Corrupted zip or bug : unexpected signature ("+g.pretty(b)+", expected "+g.pretty(a)+")")},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2),this.zipComment=this.reader.readString(this.zipCommentLength),this.zipComment=k.utf8decode(this.zipComment)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.versionMadeBy=this.reader.readString(2),this.versionNeeded=this.reader.readInt(2),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var a,b,c,d=this.zip64EndOfCentralSize-44,e=0;d>e;)a=this.reader.readInt(2),b=this.reader.readInt(4),c=this.reader.readString(b),this.zip64ExtensibleData[a]={id:a,length:b,value:c}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),this.disksCount>1)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var a,b;for(a=0;a<this.files.length;a++)b=this.files[a],this.reader.setIndex(b.localHeaderOffset),this.checkSignature(h.LOCAL_FILE_HEADER),b.readLocalPart(this.reader),b.handleUTF8(),b.processAttributes()},readCentralDir:function(){var a;for(this.reader.setIndex(this.centralDirOffset);this.reader.readString(4)===h.CENTRAL_FILE_HEADER;)a=new i({zip64:this.zip64},this.loadOptions),a.readCentralPart(this.reader),this.files.push(a)},readEndOfCentral:function(){var a=this.reader.lastIndexOfSignature(h.CENTRAL_DIRECTORY_END);if(-1===a){var b=!0;try{this.reader.setIndex(0),this.checkSignature(h.LOCAL_FILE_HEADER),b=!1}catch(c){}throw new Error(b?"Can't find end of central directory : is this a zip file ? If it is, see http://stuk.github.io/jszip/documentation/howto/read_zip.html":"Corrupted zip : can't find end of central directory")}if(this.reader.setIndex(a),this.checkSignature(h.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===g.MAX_VALUE_16BITS||this.diskWithCentralDirStart===g.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===g.MAX_VALUE_16BITS||this.centralDirRecords===g.MAX_VALUE_16BITS||this.centralDirSize===g.MAX_VALUE_32BITS||this.centralDirOffset===g.MAX_VALUE_32BITS){if(this.zip64=!0,a=this.reader.lastIndexOfSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),-1===a)throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");this.reader.setIndex(a),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}},prepareReader:function(a){var b=g.getTypeOf(a);this.reader="string"!==b||j.uint8array?"nodebuffer"===b?new e(a):new f(g.transformTo("uint8array",a)):new d(a,this.loadOptions.optimizedBinaryString)},load:function(a){this.prepareReader(a),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},b.exports=c},{"./nodeBufferReader":12,"./object":13,"./signature":14,"./stringReader":15,"./support":17,"./uint8ArrayReader":18,"./utils":21,"./zipEntry":23}],23:[function(a,b){"use strict";function c(a,b){this.options=a,this.loadOptions=b}var d=a("./stringReader"),e=a("./utils"),f=a("./compressedObject"),g=a("./object"),h=0,i=3;c.prototype={isEncrypted:function(){return 1===(1&this.bitFlag)},useUTF8:function(){return 2048===(2048&this.bitFlag)},prepareCompressedContent:function(a,b,c){return function(){var d=a.index;a.setIndex(b);var e=a.readData(c);return a.setIndex(d),e}},prepareContent:function(a,b,c,d,f){return function(){var a=e.transformTo(d.uncompressInputType,this.getCompressedContent()),b=d.uncompress(a);if(b.length!==f)throw new Error("Bug : uncompressed data size mismatch");return b}},readLocalPart:function(a){var b,c;if(a.skip(22),this.fileNameLength=a.readInt(2),c=a.readInt(2),this.fileName=a.readString(this.fileNameLength),a.skip(c),-1==this.compressedSize||-1==this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");if(b=e.findCompression(this.compressionMethod),null===b)throw new Error("Corrupted zip : compression "+e.pretty(this.compressionMethod)+" unknown (inner file : "+this.fileName+")");if(this.decompressed=new f,this.decompressed.compressedSize=this.compressedSize,this.decompressed.uncompressedSize=this.uncompressedSize,this.decompressed.crc32=this.crc32,this.decompressed.compressionMethod=this.compressionMethod,this.decompressed.getCompressedContent=this.prepareCompressedContent(a,a.index,this.compressedSize,b),this.decompressed.getContent=this.prepareContent(a,a.index,this.compressedSize,b,this.uncompressedSize),this.loadOptions.checkCRC32&&(this.decompressed=e.transformTo("string",this.decompressed.getContent()),g.crc32(this.decompressed)!==this.crc32))throw new Error("Corrupted zip : CRC32 mismatch")},readCentralPart:function(a){if(this.versionMadeBy=a.readInt(2),this.versionNeeded=a.readInt(2),this.bitFlag=a.readInt(2),this.compressionMethod=a.readString(2),this.date=a.readDate(),this.crc32=a.readInt(4),this.compressedSize=a.readInt(4),this.uncompressedSize=a.readInt(4),this.fileNameLength=a.readInt(2),this.extraFieldsLength=a.readInt(2),this.fileCommentLength=a.readInt(2),this.diskNumberStart=a.readInt(2),this.internalFileAttributes=a.readInt(2),this.externalFileAttributes=a.readInt(4),this.localHeaderOffset=a.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");this.fileName=a.readString(this.fileNameLength),this.readExtraFields(a),this.parseZIP64ExtraField(a),this.fileComment=a.readString(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var a=this.versionMadeBy>>8;this.dir=16&this.externalFileAttributes?!0:!1,a===h&&(this.dosPermissions=63&this.externalFileAttributes),a===i&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileName.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var a=new d(this.extraFields[1].value);this.uncompressedSize===e.MAX_VALUE_32BITS&&(this.uncompressedSize=a.readInt(8)),this.compressedSize===e.MAX_VALUE_32BITS&&(this.compressedSize=a.readInt(8)),this.localHeaderOffset===e.MAX_VALUE_32BITS&&(this.localHeaderOffset=a.readInt(8)),this.diskNumberStart===e.MAX_VALUE_32BITS&&(this.diskNumberStart=a.readInt(4))}},readExtraFields:function(a){var b,c,d,e=a.index;for(this.extraFields=this.extraFields||{};a.index<e+this.extraFieldsLength;)b=a.readInt(2),c=a.readInt(2),d=a.readString(c),this.extraFields[b]={id:b,length:c,value:d}},handleUTF8:function(){if(this.useUTF8())this.fileName=g.utf8decode(this.fileName),this.fileComment=g.utf8decode(this.fileComment);else{var a=this.findExtraFieldUnicodePath();null!==a&&(this.fileName=a);var b=this.findExtraFieldUnicodeComment();null!==b&&(this.fileComment=b)}},findExtraFieldUnicodePath:function(){var a=this.extraFields[28789];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileName)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))
}return null},findExtraFieldUnicodeComment:function(){var a=this.extraFields[25461];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileComment)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))}return null}},b.exports=c},{"./compressedObject":2,"./object":13,"./stringReader":15,"./utils":21}],24:[function(a,b){"use strict";var c=a("./lib/utils/common").assign,d=a("./lib/deflate"),e=a("./lib/inflate"),f=a("./lib/zlib/constants"),g={};c(g,d,e,f),b.exports=g},{"./lib/deflate":25,"./lib/inflate":26,"./lib/utils/common":27,"./lib/zlib/constants":30}],25:[function(a,b,c){"use strict";function d(a,b){var c=new s(b);if(c.push(a,!0),c.err)throw c.msg;return c.result}function e(a,b){return b=b||{},b.raw=!0,d(a,b)}function f(a,b){return b=b||{},b.gzip=!0,d(a,b)}var g=a("./zlib/deflate.js"),h=a("./utils/common"),i=a("./utils/strings"),j=a("./zlib/messages"),k=a("./zlib/zstream"),l=0,m=4,n=0,o=1,p=-1,q=0,r=8,s=function(a){this.options=h.assign({level:p,method:r,chunkSize:16384,windowBits:15,memLevel:8,strategy:q,to:""},a||{});var b=this.options;b.raw&&b.windowBits>0?b.windowBits=-b.windowBits:b.gzip&&b.windowBits>0&&b.windowBits<16&&(b.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new k,this.strm.avail_out=0;var c=g.deflateInit2(this.strm,b.level,b.method,b.windowBits,b.memLevel,b.strategy);if(c!==n)throw new Error(j[c]);b.header&&g.deflateSetHeader(this.strm,b.header)};s.prototype.push=function(a,b){var c,d,e=this.strm,f=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?m:l,e.input="string"==typeof a?i.string2buf(a):a,e.next_in=0,e.avail_in=e.input.length;do{if(0===e.avail_out&&(e.output=new h.Buf8(f),e.next_out=0,e.avail_out=f),c=g.deflate(e,d),c!==o&&c!==n)return this.onEnd(c),this.ended=!0,!1;(0===e.avail_out||0===e.avail_in&&d===m)&&this.onData("string"===this.options.to?i.buf2binstring(h.shrinkBuf(e.output,e.next_out)):h.shrinkBuf(e.output,e.next_out))}while((e.avail_in>0||0===e.avail_out)&&c!==o);return d===m?(c=g.deflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===n):!0},s.prototype.onData=function(a){this.chunks.push(a)},s.prototype.onEnd=function(a){a===n&&(this.result="string"===this.options.to?this.chunks.join(""):h.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Deflate=s,c.deflate=d,c.deflateRaw=e,c.gzip=f},{"./utils/common":27,"./utils/strings":28,"./zlib/deflate.js":32,"./zlib/messages":37,"./zlib/zstream":39}],26:[function(a,b,c){"use strict";function d(a,b){var c=new m(b);if(c.push(a,!0),c.err)throw c.msg;return c.result}function e(a,b){return b=b||{},b.raw=!0,d(a,b)}var f=a("./zlib/inflate.js"),g=a("./utils/common"),h=a("./utils/strings"),i=a("./zlib/constants"),j=a("./zlib/messages"),k=a("./zlib/zstream"),l=a("./zlib/gzheader"),m=function(a){this.options=g.assign({chunkSize:16384,windowBits:0,to:""},a||{});var b=this.options;b.raw&&b.windowBits>=0&&b.windowBits<16&&(b.windowBits=-b.windowBits,0===b.windowBits&&(b.windowBits=-15)),!(b.windowBits>=0&&b.windowBits<16)||a&&a.windowBits||(b.windowBits+=32),b.windowBits>15&&b.windowBits<48&&0===(15&b.windowBits)&&(b.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new k,this.strm.avail_out=0;var c=f.inflateInit2(this.strm,b.windowBits);if(c!==i.Z_OK)throw new Error(j[c]);this.header=new l,f.inflateGetHeader(this.strm,this.header)};m.prototype.push=function(a,b){var c,d,e,j,k,l=this.strm,m=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?i.Z_FINISH:i.Z_NO_FLUSH,l.input="string"==typeof a?h.binstring2buf(a):a,l.next_in=0,l.avail_in=l.input.length;do{if(0===l.avail_out&&(l.output=new g.Buf8(m),l.next_out=0,l.avail_out=m),c=f.inflate(l,i.Z_NO_FLUSH),c!==i.Z_STREAM_END&&c!==i.Z_OK)return this.onEnd(c),this.ended=!0,!1;l.next_out&&(0===l.avail_out||c===i.Z_STREAM_END||0===l.avail_in&&d===i.Z_FINISH)&&("string"===this.options.to?(e=h.utf8border(l.output,l.next_out),j=l.next_out-e,k=h.buf2string(l.output,e),l.next_out=j,l.avail_out=m-j,j&&g.arraySet(l.output,l.output,e,j,0),this.onData(k)):this.onData(g.shrinkBuf(l.output,l.next_out)))}while(l.avail_in>0&&c!==i.Z_STREAM_END);return c===i.Z_STREAM_END&&(d=i.Z_FINISH),d===i.Z_FINISH?(c=f.inflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===i.Z_OK):!0},m.prototype.onData=function(a){this.chunks.push(a)},m.prototype.onEnd=function(a){a===i.Z_OK&&(this.result="string"===this.options.to?this.chunks.join(""):g.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Inflate=m,c.inflate=d,c.inflateRaw=e,c.ungzip=d},{"./utils/common":27,"./utils/strings":28,"./zlib/constants":30,"./zlib/gzheader":33,"./zlib/inflate.js":35,"./zlib/messages":37,"./zlib/zstream":39}],27:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;c.assign=function(a){for(var b=Array.prototype.slice.call(arguments,1);b.length;){var c=b.shift();if(c){if("object"!=typeof c)throw new TypeError(c+"must be non-object");for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}}return a},c.shrinkBuf=function(a,b){return a.length===b?a:a.subarray?a.subarray(0,b):(a.length=b,a)};var e={arraySet:function(a,b,c,d,e){if(b.subarray&&a.subarray)return void a.set(b.subarray(c,c+d),e);for(var f=0;d>f;f++)a[e+f]=b[c+f]},flattenChunks:function(a){var b,c,d,e,f,g;for(d=0,b=0,c=a.length;c>b;b++)d+=a[b].length;for(g=new Uint8Array(d),e=0,b=0,c=a.length;c>b;b++)f=a[b],g.set(f,e),e+=f.length;return g}},f={arraySet:function(a,b,c,d,e){for(var f=0;d>f;f++)a[e+f]=b[c+f]},flattenChunks:function(a){return[].concat.apply([],a)}};c.setTyped=function(a){a?(c.Buf8=Uint8Array,c.Buf16=Uint16Array,c.Buf32=Int32Array,c.assign(c,e)):(c.Buf8=Array,c.Buf16=Array,c.Buf32=Array,c.assign(c,f))},c.setTyped(d)},{}],28:[function(a,b,c){"use strict";function d(a,b){if(65537>b&&(a.subarray&&g||!a.subarray&&f))return String.fromCharCode.apply(null,e.shrinkBuf(a,b));for(var c="",d=0;b>d;d++)c+=String.fromCharCode(a[d]);return c}var e=a("./common"),f=!0,g=!0;try{String.fromCharCode.apply(null,[0])}catch(h){f=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(h){g=!1}for(var i=new e.Buf8(256),j=0;256>j;j++)i[j]=j>=252?6:j>=248?5:j>=240?4:j>=224?3:j>=192?2:1;i[254]=i[254]=1,c.string2buf=function(a){var b,c,d,f,g,h=a.length,i=0;for(f=0;h>f;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),i+=128>c?1:2048>c?2:65536>c?3:4;for(b=new e.Buf8(i),g=0,f=0;i>g;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),128>c?b[g++]=c:2048>c?(b[g++]=192|c>>>6,b[g++]=128|63&c):65536>c?(b[g++]=224|c>>>12,b[g++]=128|c>>>6&63,b[g++]=128|63&c):(b[g++]=240|c>>>18,b[g++]=128|c>>>12&63,b[g++]=128|c>>>6&63,b[g++]=128|63&c);return b},c.buf2binstring=function(a){return d(a,a.length)},c.binstring2buf=function(a){for(var b=new e.Buf8(a.length),c=0,d=b.length;d>c;c++)b[c]=a.charCodeAt(c);return b},c.buf2string=function(a,b){var c,e,f,g,h=b||a.length,j=new Array(2*h);for(e=0,c=0;h>c;)if(f=a[c++],128>f)j[e++]=f;else if(g=i[f],g>4)j[e++]=65533,c+=g-1;else{for(f&=2===g?31:3===g?15:7;g>1&&h>c;)f=f<<6|63&a[c++],g--;g>1?j[e++]=65533:65536>f?j[e++]=f:(f-=65536,j[e++]=55296|f>>10&1023,j[e++]=56320|1023&f)}return d(j,e)},c.utf8border=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return 0>c?b:0===c?b:c+i[a[c]]>b?c:b}},{"./common":27}],29:[function(a,b){"use strict";function c(a,b,c,d){for(var e=65535&a|0,f=a>>>16&65535|0,g=0;0!==c;){g=c>2e3?2e3:c,c-=g;do e=e+b[d++]|0,f=f+e|0;while(--g);e%=65521,f%=65521}return e|f<<16|0}b.exports=c},{}],30:[function(a,b){b.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],31:[function(a,b){"use strict";function c(){for(var a,b=[],c=0;256>c;c++){a=c;for(var d=0;8>d;d++)a=1&a?3988292384^a>>>1:a>>>1;b[c]=a}return b}function d(a,b,c,d){var f=e,g=d+c;a=-1^a;for(var h=d;g>h;h++)a=a>>>8^f[255&(a^b[h])];return-1^a}var e=c();b.exports=d},{}],32:[function(a,b,c){"use strict";function d(a,b){return a.msg=G[b],b}function e(a){return(a<<1)-(a>4?9:0)}function f(a){for(var b=a.length;--b>=0;)a[b]=0}function g(a){var b=a.state,c=b.pending;c>a.avail_out&&(c=a.avail_out),0!==c&&(C.arraySet(a.output,b.pending_buf,b.pending_out,c,a.next_out),a.next_out+=c,b.pending_out+=c,a.total_out+=c,a.avail_out-=c,b.pending-=c,0===b.pending&&(b.pending_out=0))}function h(a,b){D._tr_flush_block(a,a.block_start>=0?a.block_start:-1,a.strstart-a.block_start,b),a.block_start=a.strstart,g(a.strm)}function i(a,b){a.pending_buf[a.pending++]=b}function j(a,b){a.pending_buf[a.pending++]=b>>>8&255,a.pending_buf[a.pending++]=255&b}function k(a,b,c,d){var e=a.avail_in;return e>d&&(e=d),0===e?0:(a.avail_in-=e,C.arraySet(b,a.input,a.next_in,e,c),1===a.state.wrap?a.adler=E(a.adler,b,e,c):2===a.state.wrap&&(a.adler=F(a.adler,b,e,c)),a.next_in+=e,a.total_in+=e,e)}function l(a,b){var c,d,e=a.max_chain_length,f=a.strstart,g=a.prev_length,h=a.nice_match,i=a.strstart>a.w_size-jb?a.strstart-(a.w_size-jb):0,j=a.window,k=a.w_mask,l=a.prev,m=a.strstart+ib,n=j[f+g-1],o=j[f+g];a.prev_length>=a.good_match&&(e>>=2),h>a.lookahead&&(h=a.lookahead);do if(c=b,j[c+g]===o&&j[c+g-1]===n&&j[c]===j[f]&&j[++c]===j[f+1]){f+=2,c++;do;while(j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&m>f);if(d=ib-(m-f),f=m-ib,d>g){if(a.match_start=b,g=d,d>=h)break;n=j[f+g-1],o=j[f+g]}}while((b=l[b&k])>i&&0!==--e);return g<=a.lookahead?g:a.lookahead}function m(a){var b,c,d,e,f,g=a.w_size;do{if(e=a.window_size-a.lookahead-a.strstart,a.strstart>=g+(g-jb)){C.arraySet(a.window,a.window,g,g,0),a.match_start-=g,a.strstart-=g,a.block_start-=g,c=a.hash_size,b=c;do d=a.head[--b],a.head[b]=d>=g?d-g:0;while(--c);c=g,b=c;do d=a.prev[--b],a.prev[b]=d>=g?d-g:0;while(--c);e+=g}if(0===a.strm.avail_in)break;if(c=k(a.strm,a.window,a.strstart+a.lookahead,e),a.lookahead+=c,a.lookahead+a.insert>=hb)for(f=a.strstart-a.insert,a.ins_h=a.window[f],a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+1])&a.hash_mask;a.insert&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+hb-1])&a.hash_mask,a.prev[f&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=f,f++,a.insert--,!(a.lookahead+a.insert<hb)););}while(a.lookahead<jb&&0!==a.strm.avail_in)}function n(a,b){var c=65535;for(c>a.pending_buf_size-5&&(c=a.pending_buf_size-5);;){if(a.lookahead<=1){if(m(a),0===a.lookahead&&b===H)return sb;if(0===a.lookahead)break}a.strstart+=a.lookahead,a.lookahead=0;var d=a.block_start+c;if((0===a.strstart||a.strstart>=d)&&(a.lookahead=a.strstart-d,a.strstart=d,h(a,!1),0===a.strm.avail_out))return sb;if(a.strstart-a.block_start>=a.w_size-jb&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.strstart>a.block_start&&(h(a,!1),0===a.strm.avail_out)?sb:sb}function o(a,b){for(var c,d;;){if(a.lookahead<jb){if(m(a),a.lookahead<jb&&b===H)return sb;if(0===a.lookahead)break}if(c=0,a.lookahead>=hb&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),0!==c&&a.strstart-c<=a.w_size-jb&&(a.match_length=l(a,c)),a.match_length>=hb)if(d=D._tr_tally(a,a.strstart-a.match_start,a.match_length-hb),a.lookahead-=a.match_length,a.match_length<=a.max_lazy_match&&a.lookahead>=hb){a.match_length--;do a.strstart++,a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart;while(0!==--a.match_length);a.strstart++}else a.strstart+=a.match_length,a.match_length=0,a.ins_h=a.window[a.strstart],a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+1])&a.hash_mask;else d=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++;if(d&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=a.strstart<hb-1?a.strstart:hb-1,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function p(a,b){for(var c,d,e;;){if(a.lookahead<jb){if(m(a),a.lookahead<jb&&b===H)return sb;if(0===a.lookahead)break}if(c=0,a.lookahead>=hb&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),a.prev_length=a.match_length,a.prev_match=a.match_start,a.match_length=hb-1,0!==c&&a.prev_length<a.max_lazy_match&&a.strstart-c<=a.w_size-jb&&(a.match_length=l(a,c),a.match_length<=5&&(a.strategy===S||a.match_length===hb&&a.strstart-a.match_start>4096)&&(a.match_length=hb-1)),a.prev_length>=hb&&a.match_length<=a.prev_length){e=a.strstart+a.lookahead-hb,d=D._tr_tally(a,a.strstart-1-a.prev_match,a.prev_length-hb),a.lookahead-=a.prev_length-1,a.prev_length-=2;do++a.strstart<=e&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart);while(0!==--a.prev_length);if(a.match_available=0,a.match_length=hb-1,a.strstart++,d&&(h(a,!1),0===a.strm.avail_out))return sb}else if(a.match_available){if(d=D._tr_tally(a,0,a.window[a.strstart-1]),d&&h(a,!1),a.strstart++,a.lookahead--,0===a.strm.avail_out)return sb}else a.match_available=1,a.strstart++,a.lookahead--}return a.match_available&&(d=D._tr_tally(a,0,a.window[a.strstart-1]),a.match_available=0),a.insert=a.strstart<hb-1?a.strstart:hb-1,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function q(a,b){for(var c,d,e,f,g=a.window;;){if(a.lookahead<=ib){if(m(a),a.lookahead<=ib&&b===H)return sb;if(0===a.lookahead)break}if(a.match_length=0,a.lookahead>=hb&&a.strstart>0&&(e=a.strstart-1,d=g[e],d===g[++e]&&d===g[++e]&&d===g[++e])){f=a.strstart+ib;do;while(d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&f>e);a.match_length=ib-(f-e),a.match_length>a.lookahead&&(a.match_length=a.lookahead)}if(a.match_length>=hb?(c=D._tr_tally(a,1,a.match_length-hb),a.lookahead-=a.match_length,a.strstart+=a.match_length,a.match_length=0):(c=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++),c&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function r(a,b){for(var c;;){if(0===a.lookahead&&(m(a),0===a.lookahead)){if(b===H)return sb;break}if(a.match_length=0,c=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++,c&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function s(a){a.window_size=2*a.w_size,f(a.head),a.max_lazy_match=B[a.level].max_lazy,a.good_match=B[a.level].good_length,a.nice_match=B[a.level].nice_length,a.max_chain_length=B[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=hb-1,a.match_available=0,a.ins_h=0}function t(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=Y,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new C.Buf16(2*fb),this.dyn_dtree=new C.Buf16(2*(2*db+1)),this.bl_tree=new C.Buf16(2*(2*eb+1)),f(this.dyn_ltree),f(this.dyn_dtree),f(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new C.Buf16(gb+1),this.heap=new C.Buf16(2*cb+1),f(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new C.Buf16(2*cb+1),f(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function u(a){var b;return a&&a.state?(a.total_in=a.total_out=0,a.data_type=X,b=a.state,b.pending=0,b.pending_out=0,b.wrap<0&&(b.wrap=-b.wrap),b.status=b.wrap?lb:qb,a.adler=2===b.wrap?0:1,b.last_flush=H,D._tr_init(b),M):d(a,O)}function v(a){var b=u(a);return b===M&&s(a.state),b}function w(a,b){return a&&a.state?2!==a.state.wrap?O:(a.state.gzhead=b,M):O}function x(a,b,c,e,f,g){if(!a)return O;var h=1;if(b===R&&(b=6),0>e?(h=0,e=-e):e>15&&(h=2,e-=16),1>f||f>Z||c!==Y||8>e||e>15||0>b||b>9||0>g||g>V)return d(a,O);8===e&&(e=9);var i=new t;return a.state=i,i.strm=a,i.wrap=h,i.gzhead=null,i.w_bits=e,i.w_size=1<<i.w_bits,i.w_mask=i.w_size-1,i.hash_bits=f+7,i.hash_size=1<<i.hash_bits,i.hash_mask=i.hash_size-1,i.hash_shift=~~((i.hash_bits+hb-1)/hb),i.window=new C.Buf8(2*i.w_size),i.head=new C.Buf16(i.hash_size),i.prev=new C.Buf16(i.w_size),i.lit_bufsize=1<<f+6,i.pending_buf_size=4*i.lit_bufsize,i.pending_buf=new C.Buf8(i.pending_buf_size),i.d_buf=i.lit_bufsize>>1,i.l_buf=3*i.lit_bufsize,i.level=b,i.strategy=g,i.method=c,v(a)}function y(a,b){return x(a,b,Y,$,_,W)}function z(a,b){var c,h,k,l;if(!a||!a.state||b>L||0>b)return a?d(a,O):O;if(h=a.state,!a.output||!a.input&&0!==a.avail_in||h.status===rb&&b!==K)return d(a,0===a.avail_out?Q:O);if(h.strm=a,c=h.last_flush,h.last_flush=b,h.status===lb)if(2===h.wrap)a.adler=0,i(h,31),i(h,139),i(h,8),h.gzhead?(i(h,(h.gzhead.text?1:0)+(h.gzhead.hcrc?2:0)+(h.gzhead.extra?4:0)+(h.gzhead.name?8:0)+(h.gzhead.comment?16:0)),i(h,255&h.gzhead.time),i(h,h.gzhead.time>>8&255),i(h,h.gzhead.time>>16&255),i(h,h.gzhead.time>>24&255),i(h,9===h.level?2:h.strategy>=T||h.level<2?4:0),i(h,255&h.gzhead.os),h.gzhead.extra&&h.gzhead.extra.length&&(i(h,255&h.gzhead.extra.length),i(h,h.gzhead.extra.length>>8&255)),h.gzhead.hcrc&&(a.adler=F(a.adler,h.pending_buf,h.pending,0)),h.gzindex=0,h.status=mb):(i(h,0),i(h,0),i(h,0),i(h,0),i(h,0),i(h,9===h.level?2:h.strategy>=T||h.level<2?4:0),i(h,wb),h.status=qb);else{var m=Y+(h.w_bits-8<<4)<<8,n=-1;n=h.strategy>=T||h.level<2?0:h.level<6?1:6===h.level?2:3,m|=n<<6,0!==h.strstart&&(m|=kb),m+=31-m%31,h.status=qb,j(h,m),0!==h.strstart&&(j(h,a.adler>>>16),j(h,65535&a.adler)),a.adler=1}if(h.status===mb)if(h.gzhead.extra){for(k=h.pending;h.gzindex<(65535&h.gzhead.extra.length)&&(h.pending!==h.pending_buf_size||(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending!==h.pending_buf_size));)i(h,255&h.gzhead.extra[h.gzindex]),h.gzindex++;h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),h.gzindex===h.gzhead.extra.length&&(h.gzindex=0,h.status=nb)}else h.status=nb;if(h.status===nb)if(h.gzhead.name){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.name.length?255&h.gzhead.name.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.gzindex=0,h.status=ob)}else h.status=ob;if(h.status===ob)if(h.gzhead.comment){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.comment.length?255&h.gzhead.comment.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.status=pb)}else h.status=pb;if(h.status===pb&&(h.gzhead.hcrc?(h.pending+2>h.pending_buf_size&&g(a),h.pending+2<=h.pending_buf_size&&(i(h,255&a.adler),i(h,a.adler>>8&255),a.adler=0,h.status=qb)):h.status=qb),0!==h.pending){if(g(a),0===a.avail_out)return h.last_flush=-1,M}else if(0===a.avail_in&&e(b)<=e(c)&&b!==K)return d(a,Q);if(h.status===rb&&0!==a.avail_in)return d(a,Q);if(0!==a.avail_in||0!==h.lookahead||b!==H&&h.status!==rb){var o=h.strategy===T?r(h,b):h.strategy===U?q(h,b):B[h.level].func(h,b);if((o===ub||o===vb)&&(h.status=rb),o===sb||o===ub)return 0===a.avail_out&&(h.last_flush=-1),M;if(o===tb&&(b===I?D._tr_align(h):b!==L&&(D._tr_stored_block(h,0,0,!1),b===J&&(f(h.head),0===h.lookahead&&(h.strstart=0,h.block_start=0,h.insert=0))),g(a),0===a.avail_out))return h.last_flush=-1,M}return b!==K?M:h.wrap<=0?N:(2===h.wrap?(i(h,255&a.adler),i(h,a.adler>>8&255),i(h,a.adler>>16&255),i(h,a.adler>>24&255),i(h,255&a.total_in),i(h,a.total_in>>8&255),i(h,a.total_in>>16&255),i(h,a.total_in>>24&255)):(j(h,a.adler>>>16),j(h,65535&a.adler)),g(a),h.wrap>0&&(h.wrap=-h.wrap),0!==h.pending?M:N)}function A(a){var b;return a&&a.state?(b=a.state.status,b!==lb&&b!==mb&&b!==nb&&b!==ob&&b!==pb&&b!==qb&&b!==rb?d(a,O):(a.state=null,b===qb?d(a,P):M)):O}var B,C=a("../utils/common"),D=a("./trees"),E=a("./adler32"),F=a("./crc32"),G=a("./messages"),H=0,I=1,J=3,K=4,L=5,M=0,N=1,O=-2,P=-3,Q=-5,R=-1,S=1,T=2,U=3,V=4,W=0,X=2,Y=8,Z=9,$=15,_=8,ab=29,bb=256,cb=bb+1+ab,db=30,eb=19,fb=2*cb+1,gb=15,hb=3,ib=258,jb=ib+hb+1,kb=32,lb=42,mb=69,nb=73,ob=91,pb=103,qb=113,rb=666,sb=1,tb=2,ub=3,vb=4,wb=3,xb=function(a,b,c,d,e){this.good_length=a,this.max_lazy=b,this.nice_length=c,this.max_chain=d,this.func=e};B=[new xb(0,0,0,0,n),new xb(4,4,8,4,o),new xb(4,5,16,8,o),new xb(4,6,32,32,o),new xb(4,4,16,16,p),new xb(8,16,32,32,p),new xb(8,16,128,128,p),new xb(8,32,128,256,p),new xb(32,128,258,1024,p),new xb(32,258,258,4096,p)],c.deflateInit=y,c.deflateInit2=x,c.deflateReset=v,c.deflateResetKeep=u,c.deflateSetHeader=w,c.deflate=z,c.deflateEnd=A,c.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":27,"./adler32":29,"./crc32":31,"./messages":37,"./trees":38}],33:[function(a,b){"use strict";function c(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}b.exports=c},{}],34:[function(a,b){"use strict";var c=30,d=12;b.exports=function(a,b){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C;e=a.state,f=a.next_in,B=a.input,g=f+(a.avail_in-5),h=a.next_out,C=a.output,i=h-(b-a.avail_out),j=h+(a.avail_out-257),k=e.dmax,l=e.wsize,m=e.whave,n=e.wnext,o=e.window,p=e.hold,q=e.bits,r=e.lencode,s=e.distcode,t=(1<<e.lenbits)-1,u=(1<<e.distbits)-1;a:do{15>q&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=r[p&t];b:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,0===w)C[h++]=65535&v;else{if(!(16&w)){if(0===(64&w)){v=r[(65535&v)+(p&(1<<w)-1)];continue b}if(32&w){e.mode=d;break a}a.msg="invalid literal/length code",e.mode=c;break a}x=65535&v,w&=15,w&&(w>q&&(p+=B[f++]<<q,q+=8),x+=p&(1<<w)-1,p>>>=w,q-=w),15>q&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=s[p&u];c:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,!(16&w)){if(0===(64&w)){v=s[(65535&v)+(p&(1<<w)-1)];continue c}a.msg="invalid distance code",e.mode=c;break a}if(y=65535&v,w&=15,w>q&&(p+=B[f++]<<q,q+=8,w>q&&(p+=B[f++]<<q,q+=8)),y+=p&(1<<w)-1,y>k){a.msg="invalid distance too far back",e.mode=c;break a}if(p>>>=w,q-=w,w=h-i,y>w){if(w=y-w,w>m&&e.sane){a.msg="invalid distance too far back",e.mode=c;break a}if(z=0,A=o,0===n){if(z+=l-w,x>w){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}else if(w>n){if(z+=l+n-w,w-=n,x>w){x-=w;do C[h++]=o[z++];while(--w);if(z=0,x>n){w=n,x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}}else if(z+=n-w,x>w){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}for(;x>2;)C[h++]=A[z++],C[h++]=A[z++],C[h++]=A[z++],x-=3;x&&(C[h++]=A[z++],x>1&&(C[h++]=A[z++]))}else{z=h-y;do C[h++]=C[z++],C[h++]=C[z++],C[h++]=C[z++],x-=3;while(x>2);x&&(C[h++]=C[z++],x>1&&(C[h++]=C[z++]))}break}}break}}while(g>f&&j>h);x=q>>3,f-=x,q-=x<<3,p&=(1<<q)-1,a.next_in=f,a.next_out=h,a.avail_in=g>f?5+(g-f):5-(f-g),a.avail_out=j>h?257+(j-h):257-(h-j),e.hold=p,e.bits=q}},{}],35:[function(a,b,c){"use strict";function d(a){return(a>>>24&255)+(a>>>8&65280)+((65280&a)<<8)+((255&a)<<24)}function e(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new r.Buf16(320),this.work=new r.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function f(a){var b;return a&&a.state?(b=a.state,a.total_in=a.total_out=b.total=0,a.msg="",b.wrap&&(a.adler=1&b.wrap),b.mode=K,b.last=0,b.havedict=0,b.dmax=32768,b.head=null,b.hold=0,b.bits=0,b.lencode=b.lendyn=new r.Buf32(ob),b.distcode=b.distdyn=new r.Buf32(pb),b.sane=1,b.back=-1,C):F}function g(a){var b;return a&&a.state?(b=a.state,b.wsize=0,b.whave=0,b.wnext=0,f(a)):F}function h(a,b){var c,d;return a&&a.state?(d=a.state,0>b?(c=0,b=-b):(c=(b>>4)+1,48>b&&(b&=15)),b&&(8>b||b>15)?F:(null!==d.window&&d.wbits!==b&&(d.window=null),d.wrap=c,d.wbits=b,g(a))):F}function i(a,b){var c,d;return a?(d=new e,a.state=d,d.window=null,c=h(a,b),c!==C&&(a.state=null),c):F}function j(a){return i(a,rb)}function k(a){if(sb){var b;for(p=new r.Buf32(512),q=new r.Buf32(32),b=0;144>b;)a.lens[b++]=8;for(;256>b;)a.lens[b++]=9;for(;280>b;)a.lens[b++]=7;for(;288>b;)a.lens[b++]=8;for(v(x,a.lens,0,288,p,0,a.work,{bits:9}),b=0;32>b;)a.lens[b++]=5;v(y,a.lens,0,32,q,0,a.work,{bits:5}),sb=!1}a.lencode=p,a.lenbits=9,a.distcode=q,a.distbits=5}function l(a,b,c,d){var e,f=a.state;return null===f.window&&(f.wsize=1<<f.wbits,f.wnext=0,f.whave=0,f.window=new r.Buf8(f.wsize)),d>=f.wsize?(r.arraySet(f.window,b,c-f.wsize,f.wsize,0),f.wnext=0,f.whave=f.wsize):(e=f.wsize-f.wnext,e>d&&(e=d),r.arraySet(f.window,b,c-d,e,f.wnext),d-=e,d?(r.arraySet(f.window,b,c-d,d,0),f.wnext=d,f.whave=f.wsize):(f.wnext+=e,f.wnext===f.wsize&&(f.wnext=0),f.whave<f.wsize&&(f.whave+=e))),0}function m(a,b){var c,e,f,g,h,i,j,m,n,o,p,q,ob,pb,qb,rb,sb,tb,ub,vb,wb,xb,yb,zb,Ab=0,Bb=new r.Buf8(4),Cb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!a||!a.state||!a.output||!a.input&&0!==a.avail_in)return F;c=a.state,c.mode===V&&(c.mode=W),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,o=i,p=j,xb=C;a:for(;;)switch(c.mode){case K:if(0===c.wrap){c.mode=W;break}for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(2&c.wrap&&35615===m){c.check=0,Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0),m=0,n=0,c.mode=L;break}if(c.flags=0,c.head&&(c.head.done=!1),!(1&c.wrap)||(((255&m)<<8)+(m>>8))%31){a.msg="incorrect header check",c.mode=lb;break}if((15&m)!==J){a.msg="unknown compression method",c.mode=lb;break}if(m>>>=4,n-=4,wb=(15&m)+8,0===c.wbits)c.wbits=wb;else if(wb>c.wbits){a.msg="invalid window size",c.mode=lb;break}c.dmax=1<<wb,a.adler=c.check=1,c.mode=512&m?T:V,m=0,n=0;break;case L:for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.flags=m,(255&c.flags)!==J){a.msg="unknown compression method",c.mode=lb;break}if(57344&c.flags){a.msg="unknown header flags set",c.mode=lb;break}c.head&&(c.head.text=m>>8&1),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0,c.mode=M;case M:for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.time=m),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,Bb[2]=m>>>16&255,Bb[3]=m>>>24&255,c.check=t(c.check,Bb,4,0)),m=0,n=0,c.mode=N;case N:for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.xflags=255&m,c.head.os=m>>8),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0,c.mode=O;case O:if(1024&c.flags){for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length=m,c.head&&(c.head.extra_len=m),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0}else c.head&&(c.head.extra=null);c.mode=P;case P:if(1024&c.flags&&(q=c.length,q>i&&(q=i),q&&(c.head&&(wb=c.head.extra_len-c.length,c.head.extra||(c.head.extra=new Array(c.head.extra_len)),r.arraySet(c.head.extra,e,g,q,wb)),512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,c.length-=q),c.length))break a;c.length=0,c.mode=Q;case Q:if(2048&c.flags){if(0===i)break a;q=0;do wb=e[g+q++],c.head&&wb&&c.length<65536&&(c.head.name+=String.fromCharCode(wb));while(wb&&i>q);if(512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,wb)break a}else c.head&&(c.head.name=null);c.length=0,c.mode=R;case R:if(4096&c.flags){if(0===i)break a;q=0;do wb=e[g+q++],c.head&&wb&&c.length<65536&&(c.head.comment+=String.fromCharCode(wb));while(wb&&i>q);if(512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,wb)break a}else c.head&&(c.head.comment=null);c.mode=S;case S:if(512&c.flags){for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(65535&c.check)){a.msg="header crc mismatch",c.mode=lb;break}m=0,n=0}c.head&&(c.head.hcrc=c.flags>>9&1,c.head.done=!0),a.adler=c.check=0,c.mode=V;break;case T:for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}a.adler=c.check=d(m),m=0,n=0,c.mode=U;case U:if(0===c.havedict)return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,E;a.adler=c.check=1,c.mode=V;case V:if(b===A||b===B)break a;case W:if(c.last){m>>>=7&n,n-=7&n,c.mode=ib;break}for(;3>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}switch(c.last=1&m,m>>>=1,n-=1,3&m){case 0:c.mode=X;break;case 1:if(k(c),c.mode=bb,b===B){m>>>=2,n-=2;break a}break;case 2:c.mode=$;break;case 3:a.msg="invalid block type",c.mode=lb}m>>>=2,n-=2;break;case X:for(m>>>=7&n,n-=7&n;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if((65535&m)!==(m>>>16^65535)){a.msg="invalid stored block lengths",c.mode=lb;break}if(c.length=65535&m,m=0,n=0,c.mode=Y,b===B)break a;case Y:c.mode=Z;case Z:if(q=c.length){if(q>i&&(q=i),q>j&&(q=j),0===q)break a;r.arraySet(f,e,g,q,h),i-=q,g+=q,j-=q,h+=q,c.length-=q;break}c.mode=V;break;case $:for(;14>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.nlen=(31&m)+257,m>>>=5,n-=5,c.ndist=(31&m)+1,m>>>=5,n-=5,c.ncode=(15&m)+4,m>>>=4,n-=4,c.nlen>286||c.ndist>30){a.msg="too many length or distance symbols",c.mode=lb;break}c.have=0,c.mode=_;case _:for(;c.have<c.ncode;){for(;3>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.lens[Cb[c.have++]]=7&m,m>>>=3,n-=3}for(;c.have<19;)c.lens[Cb[c.have++]]=0;if(c.lencode=c.lendyn,c.lenbits=7,yb={bits:c.lenbits},xb=v(w,c.lens,0,19,c.lencode,0,c.work,yb),c.lenbits=yb.bits,xb){a.msg="invalid code lengths set",c.mode=lb;break}c.have=0,c.mode=ab;case ab:for(;c.have<c.nlen+c.ndist;){for(;Ab=c.lencode[m&(1<<c.lenbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(16>sb)m>>>=qb,n-=qb,c.lens[c.have++]=sb;else{if(16===sb){for(zb=qb+2;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m>>>=qb,n-=qb,0===c.have){a.msg="invalid bit length repeat",c.mode=lb;break}wb=c.lens[c.have-1],q=3+(3&m),m>>>=2,n-=2}else if(17===sb){for(zb=qb+3;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qb,n-=qb,wb=0,q=3+(7&m),m>>>=3,n-=3}else{for(zb=qb+7;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qb,n-=qb,wb=0,q=11+(127&m),m>>>=7,n-=7}if(c.have+q>c.nlen+c.ndist){a.msg="invalid bit length repeat",c.mode=lb;break}for(;q--;)c.lens[c.have++]=wb}}if(c.mode===lb)break;if(0===c.lens[256]){a.msg="invalid code -- missing end-of-block",c.mode=lb;break}if(c.lenbits=9,yb={bits:c.lenbits},xb=v(x,c.lens,0,c.nlen,c.lencode,0,c.work,yb),c.lenbits=yb.bits,xb){a.msg="invalid literal/lengths set",c.mode=lb;break}if(c.distbits=6,c.distcode=c.distdyn,yb={bits:c.distbits},xb=v(y,c.lens,c.nlen,c.ndist,c.distcode,0,c.work,yb),c.distbits=yb.bits,xb){a.msg="invalid distances set",c.mode=lb;break}if(c.mode=bb,b===B)break a;case bb:c.mode=cb;case cb:if(i>=6&&j>=258){a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,u(a,p),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,c.mode===V&&(c.back=-1);
break}for(c.back=0;Ab=c.lencode[m&(1<<c.lenbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(rb&&0===(240&rb)){for(tb=qb,ub=rb,vb=sb;Ab=c.lencode[vb+((m&(1<<tb+ub)-1)>>tb)],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=tb+qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=tb,n-=tb,c.back+=tb}if(m>>>=qb,n-=qb,c.back+=qb,c.length=sb,0===rb){c.mode=hb;break}if(32&rb){c.back=-1,c.mode=V;break}if(64&rb){a.msg="invalid literal/length code",c.mode=lb;break}c.extra=15&rb,c.mode=db;case db:if(c.extra){for(zb=c.extra;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}c.was=c.length,c.mode=eb;case eb:for(;Ab=c.distcode[m&(1<<c.distbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(0===(240&rb)){for(tb=qb,ub=rb,vb=sb;Ab=c.distcode[vb+((m&(1<<tb+ub)-1)>>tb)],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=tb+qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=tb,n-=tb,c.back+=tb}if(m>>>=qb,n-=qb,c.back+=qb,64&rb){a.msg="invalid distance code",c.mode=lb;break}c.offset=sb,c.extra=15&rb,c.mode=fb;case fb:if(c.extra){for(zb=c.extra;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.offset+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}if(c.offset>c.dmax){a.msg="invalid distance too far back",c.mode=lb;break}c.mode=gb;case gb:if(0===j)break a;if(q=p-j,c.offset>q){if(q=c.offset-q,q>c.whave&&c.sane){a.msg="invalid distance too far back",c.mode=lb;break}q>c.wnext?(q-=c.wnext,ob=c.wsize-q):ob=c.wnext-q,q>c.length&&(q=c.length),pb=c.window}else pb=f,ob=h-c.offset,q=c.length;q>j&&(q=j),j-=q,c.length-=q;do f[h++]=pb[ob++];while(--q);0===c.length&&(c.mode=cb);break;case hb:if(0===j)break a;f[h++]=c.length,j--,c.mode=cb;break;case ib:if(c.wrap){for(;32>n;){if(0===i)break a;i--,m|=e[g++]<<n,n+=8}if(p-=j,a.total_out+=p,c.total+=p,p&&(a.adler=c.check=c.flags?t(c.check,f,p,h-p):s(c.check,f,p,h-p)),p=j,(c.flags?m:d(m))!==c.check){a.msg="incorrect data check",c.mode=lb;break}m=0,n=0}c.mode=jb;case jb:if(c.wrap&&c.flags){for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(4294967295&c.total)){a.msg="incorrect length check",c.mode=lb;break}m=0,n=0}c.mode=kb;case kb:xb=D;break a;case lb:xb=G;break a;case mb:return H;case nb:default:return F}return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,(c.wsize||p!==a.avail_out&&c.mode<lb&&(c.mode<ib||b!==z))&&l(a,a.output,a.next_out,p-a.avail_out)?(c.mode=mb,H):(o-=a.avail_in,p-=a.avail_out,a.total_in+=o,a.total_out+=p,c.total+=p,c.wrap&&p&&(a.adler=c.check=c.flags?t(c.check,f,p,a.next_out-p):s(c.check,f,p,a.next_out-p)),a.data_type=c.bits+(c.last?64:0)+(c.mode===V?128:0)+(c.mode===bb||c.mode===Y?256:0),(0===o&&0===p||b===z)&&xb===C&&(xb=I),xb)}function n(a){if(!a||!a.state)return F;var b=a.state;return b.window&&(b.window=null),a.state=null,C}function o(a,b){var c;return a&&a.state?(c=a.state,0===(2&c.wrap)?F:(c.head=b,b.done=!1,C)):F}var p,q,r=a("../utils/common"),s=a("./adler32"),t=a("./crc32"),u=a("./inffast"),v=a("./inftrees"),w=0,x=1,y=2,z=4,A=5,B=6,C=0,D=1,E=2,F=-2,G=-3,H=-4,I=-5,J=8,K=1,L=2,M=3,N=4,O=5,P=6,Q=7,R=8,S=9,T=10,U=11,V=12,W=13,X=14,Y=15,Z=16,$=17,_=18,ab=19,bb=20,cb=21,db=22,eb=23,fb=24,gb=25,hb=26,ib=27,jb=28,kb=29,lb=30,mb=31,nb=32,ob=852,pb=592,qb=15,rb=qb,sb=!0;c.inflateReset=g,c.inflateReset2=h,c.inflateResetKeep=f,c.inflateInit=j,c.inflateInit2=i,c.inflate=m,c.inflateEnd=n,c.inflateGetHeader=o,c.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":27,"./adler32":29,"./crc32":31,"./inffast":34,"./inftrees":36}],36:[function(a,b){"use strict";var c=a("../utils/common"),d=15,e=852,f=592,g=0,h=1,i=2,j=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],k=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],l=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],m=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];b.exports=function(a,b,n,o,p,q,r,s){var t,u,v,w,x,y,z,A,B,C=s.bits,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=null,O=0,P=new c.Buf16(d+1),Q=new c.Buf16(d+1),R=null,S=0;for(D=0;d>=D;D++)P[D]=0;for(E=0;o>E;E++)P[b[n+E]]++;for(H=C,G=d;G>=1&&0===P[G];G--);if(H>G&&(H=G),0===G)return p[q++]=20971520,p[q++]=20971520,s.bits=1,0;for(F=1;G>F&&0===P[F];F++);for(F>H&&(H=F),K=1,D=1;d>=D;D++)if(K<<=1,K-=P[D],0>K)return-1;if(K>0&&(a===g||1!==G))return-1;for(Q[1]=0,D=1;d>D;D++)Q[D+1]=Q[D]+P[D];for(E=0;o>E;E++)0!==b[n+E]&&(r[Q[b[n+E]]++]=E);if(a===g?(N=R=r,y=19):a===h?(N=j,O-=257,R=k,S-=257,y=256):(N=l,R=m,y=-1),M=0,E=0,D=F,x=q,I=H,J=0,v=-1,L=1<<H,w=L-1,a===h&&L>e||a===i&&L>f)return 1;for(var T=0;;){T++,z=D-J,r[E]<y?(A=0,B=r[E]):r[E]>y?(A=R[S+r[E]],B=N[O+r[E]]):(A=96,B=0),t=1<<D-J,u=1<<I,F=u;do u-=t,p[x+(M>>J)+u]=z<<24|A<<16|B|0;while(0!==u);for(t=1<<D-1;M&t;)t>>=1;if(0!==t?(M&=t-1,M+=t):M=0,E++,0===--P[D]){if(D===G)break;D=b[n+r[E]]}if(D>H&&(M&w)!==v){for(0===J&&(J=H),x+=F,I=D-J,K=1<<I;G>I+J&&(K-=P[I+J],!(0>=K));)I++,K<<=1;if(L+=1<<I,a===h&&L>e||a===i&&L>f)return 1;v=M&w,p[v]=H<<24|I<<16|x-q|0}}return 0!==M&&(p[x+M]=D-J<<24|64<<16|0),s.bits=H,0}},{"../utils/common":27}],37:[function(a,b){"use strict";b.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],38:[function(a,b,c){"use strict";function d(a){for(var b=a.length;--b>=0;)a[b]=0}function e(a){return 256>a?gb[a]:gb[256+(a>>>7)]}function f(a,b){a.pending_buf[a.pending++]=255&b,a.pending_buf[a.pending++]=b>>>8&255}function g(a,b,c){a.bi_valid>V-c?(a.bi_buf|=b<<a.bi_valid&65535,f(a,a.bi_buf),a.bi_buf=b>>V-a.bi_valid,a.bi_valid+=c-V):(a.bi_buf|=b<<a.bi_valid&65535,a.bi_valid+=c)}function h(a,b,c){g(a,c[2*b],c[2*b+1])}function i(a,b){var c=0;do c|=1&a,a>>>=1,c<<=1;while(--b>0);return c>>>1}function j(a){16===a.bi_valid?(f(a,a.bi_buf),a.bi_buf=0,a.bi_valid=0):a.bi_valid>=8&&(a.pending_buf[a.pending++]=255&a.bi_buf,a.bi_buf>>=8,a.bi_valid-=8)}function k(a,b){var c,d,e,f,g,h,i=b.dyn_tree,j=b.max_code,k=b.stat_desc.static_tree,l=b.stat_desc.has_stree,m=b.stat_desc.extra_bits,n=b.stat_desc.extra_base,o=b.stat_desc.max_length,p=0;for(f=0;U>=f;f++)a.bl_count[f]=0;for(i[2*a.heap[a.heap_max]+1]=0,c=a.heap_max+1;T>c;c++)d=a.heap[c],f=i[2*i[2*d+1]+1]+1,f>o&&(f=o,p++),i[2*d+1]=f,d>j||(a.bl_count[f]++,g=0,d>=n&&(g=m[d-n]),h=i[2*d],a.opt_len+=h*(f+g),l&&(a.static_len+=h*(k[2*d+1]+g)));if(0!==p){do{for(f=o-1;0===a.bl_count[f];)f--;a.bl_count[f]--,a.bl_count[f+1]+=2,a.bl_count[o]--,p-=2}while(p>0);for(f=o;0!==f;f--)for(d=a.bl_count[f];0!==d;)e=a.heap[--c],e>j||(i[2*e+1]!==f&&(a.opt_len+=(f-i[2*e+1])*i[2*e],i[2*e+1]=f),d--)}}function l(a,b,c){var d,e,f=new Array(U+1),g=0;for(d=1;U>=d;d++)f[d]=g=g+c[d-1]<<1;for(e=0;b>=e;e++){var h=a[2*e+1];0!==h&&(a[2*e]=i(f[h]++,h))}}function m(){var a,b,c,d,e,f=new Array(U+1);for(c=0,d=0;O-1>d;d++)for(ib[d]=c,a=0;a<1<<_[d];a++)hb[c++]=d;for(hb[c-1]=d,e=0,d=0;16>d;d++)for(jb[d]=e,a=0;a<1<<ab[d];a++)gb[e++]=d;for(e>>=7;R>d;d++)for(jb[d]=e<<7,a=0;a<1<<ab[d]-7;a++)gb[256+e++]=d;for(b=0;U>=b;b++)f[b]=0;for(a=0;143>=a;)eb[2*a+1]=8,a++,f[8]++;for(;255>=a;)eb[2*a+1]=9,a++,f[9]++;for(;279>=a;)eb[2*a+1]=7,a++,f[7]++;for(;287>=a;)eb[2*a+1]=8,a++,f[8]++;for(l(eb,Q+1,f),a=0;R>a;a++)fb[2*a+1]=5,fb[2*a]=i(a,5);kb=new nb(eb,_,P+1,Q,U),lb=new nb(fb,ab,0,R,U),mb=new nb(new Array(0),bb,0,S,W)}function n(a){var b;for(b=0;Q>b;b++)a.dyn_ltree[2*b]=0;for(b=0;R>b;b++)a.dyn_dtree[2*b]=0;for(b=0;S>b;b++)a.bl_tree[2*b]=0;a.dyn_ltree[2*X]=1,a.opt_len=a.static_len=0,a.last_lit=a.matches=0}function o(a){a.bi_valid>8?f(a,a.bi_buf):a.bi_valid>0&&(a.pending_buf[a.pending++]=a.bi_buf),a.bi_buf=0,a.bi_valid=0}function p(a,b,c,d){o(a),d&&(f(a,c),f(a,~c)),E.arraySet(a.pending_buf,a.window,b,c,a.pending),a.pending+=c}function q(a,b,c,d){var e=2*b,f=2*c;return a[e]<a[f]||a[e]===a[f]&&d[b]<=d[c]}function r(a,b,c){for(var d=a.heap[c],e=c<<1;e<=a.heap_len&&(e<a.heap_len&&q(b,a.heap[e+1],a.heap[e],a.depth)&&e++,!q(b,d,a.heap[e],a.depth));)a.heap[c]=a.heap[e],c=e,e<<=1;a.heap[c]=d}function s(a,b,c){var d,f,i,j,k=0;if(0!==a.last_lit)do d=a.pending_buf[a.d_buf+2*k]<<8|a.pending_buf[a.d_buf+2*k+1],f=a.pending_buf[a.l_buf+k],k++,0===d?h(a,f,b):(i=hb[f],h(a,i+P+1,b),j=_[i],0!==j&&(f-=ib[i],g(a,f,j)),d--,i=e(d),h(a,i,c),j=ab[i],0!==j&&(d-=jb[i],g(a,d,j)));while(k<a.last_lit);h(a,X,b)}function t(a,b){var c,d,e,f=b.dyn_tree,g=b.stat_desc.static_tree,h=b.stat_desc.has_stree,i=b.stat_desc.elems,j=-1;for(a.heap_len=0,a.heap_max=T,c=0;i>c;c++)0!==f[2*c]?(a.heap[++a.heap_len]=j=c,a.depth[c]=0):f[2*c+1]=0;for(;a.heap_len<2;)e=a.heap[++a.heap_len]=2>j?++j:0,f[2*e]=1,a.depth[e]=0,a.opt_len--,h&&(a.static_len-=g[2*e+1]);for(b.max_code=j,c=a.heap_len>>1;c>=1;c--)r(a,f,c);e=i;do c=a.heap[1],a.heap[1]=a.heap[a.heap_len--],r(a,f,1),d=a.heap[1],a.heap[--a.heap_max]=c,a.heap[--a.heap_max]=d,f[2*e]=f[2*c]+f[2*d],a.depth[e]=(a.depth[c]>=a.depth[d]?a.depth[c]:a.depth[d])+1,f[2*c+1]=f[2*d+1]=e,a.heap[1]=e++,r(a,f,1);while(a.heap_len>=2);a.heap[--a.heap_max]=a.heap[1],k(a,b),l(f,j,a.bl_count)}function u(a,b,c){var d,e,f=-1,g=b[1],h=0,i=7,j=4;for(0===g&&(i=138,j=3),b[2*(c+1)+1]=65535,d=0;c>=d;d++)e=g,g=b[2*(d+1)+1],++h<i&&e===g||(j>h?a.bl_tree[2*e]+=h:0!==e?(e!==f&&a.bl_tree[2*e]++,a.bl_tree[2*Y]++):10>=h?a.bl_tree[2*Z]++:a.bl_tree[2*$]++,h=0,f=e,0===g?(i=138,j=3):e===g?(i=6,j=3):(i=7,j=4))}function v(a,b,c){var d,e,f=-1,i=b[1],j=0,k=7,l=4;for(0===i&&(k=138,l=3),d=0;c>=d;d++)if(e=i,i=b[2*(d+1)+1],!(++j<k&&e===i)){if(l>j){do h(a,e,a.bl_tree);while(0!==--j)}else 0!==e?(e!==f&&(h(a,e,a.bl_tree),j--),h(a,Y,a.bl_tree),g(a,j-3,2)):10>=j?(h(a,Z,a.bl_tree),g(a,j-3,3)):(h(a,$,a.bl_tree),g(a,j-11,7));j=0,f=e,0===i?(k=138,l=3):e===i?(k=6,l=3):(k=7,l=4)}}function w(a){var b;for(u(a,a.dyn_ltree,a.l_desc.max_code),u(a,a.dyn_dtree,a.d_desc.max_code),t(a,a.bl_desc),b=S-1;b>=3&&0===a.bl_tree[2*cb[b]+1];b--);return a.opt_len+=3*(b+1)+5+5+4,b}function x(a,b,c,d){var e;for(g(a,b-257,5),g(a,c-1,5),g(a,d-4,4),e=0;d>e;e++)g(a,a.bl_tree[2*cb[e]+1],3);v(a,a.dyn_ltree,b-1),v(a,a.dyn_dtree,c-1)}function y(a){var b,c=4093624447;for(b=0;31>=b;b++,c>>>=1)if(1&c&&0!==a.dyn_ltree[2*b])return G;if(0!==a.dyn_ltree[18]||0!==a.dyn_ltree[20]||0!==a.dyn_ltree[26])return H;for(b=32;P>b;b++)if(0!==a.dyn_ltree[2*b])return H;return G}function z(a){pb||(m(),pb=!0),a.l_desc=new ob(a.dyn_ltree,kb),a.d_desc=new ob(a.dyn_dtree,lb),a.bl_desc=new ob(a.bl_tree,mb),a.bi_buf=0,a.bi_valid=0,n(a)}function A(a,b,c,d){g(a,(J<<1)+(d?1:0),3),p(a,b,c,!0)}function B(a){g(a,K<<1,3),h(a,X,eb),j(a)}function C(a,b,c,d){var e,f,h=0;a.level>0?(a.strm.data_type===I&&(a.strm.data_type=y(a)),t(a,a.l_desc),t(a,a.d_desc),h=w(a),e=a.opt_len+3+7>>>3,f=a.static_len+3+7>>>3,e>=f&&(e=f)):e=f=c+5,e>=c+4&&-1!==b?A(a,b,c,d):a.strategy===F||f===e?(g(a,(K<<1)+(d?1:0),3),s(a,eb,fb)):(g(a,(L<<1)+(d?1:0),3),x(a,a.l_desc.max_code+1,a.d_desc.max_code+1,h+1),s(a,a.dyn_ltree,a.dyn_dtree)),n(a),d&&o(a)}function D(a,b,c){return a.pending_buf[a.d_buf+2*a.last_lit]=b>>>8&255,a.pending_buf[a.d_buf+2*a.last_lit+1]=255&b,a.pending_buf[a.l_buf+a.last_lit]=255&c,a.last_lit++,0===b?a.dyn_ltree[2*c]++:(a.matches++,b--,a.dyn_ltree[2*(hb[c]+P+1)]++,a.dyn_dtree[2*e(b)]++),a.last_lit===a.lit_bufsize-1}var E=a("../utils/common"),F=4,G=0,H=1,I=2,J=0,K=1,L=2,M=3,N=258,O=29,P=256,Q=P+1+O,R=30,S=19,T=2*Q+1,U=15,V=16,W=7,X=256,Y=16,Z=17,$=18,_=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],ab=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],bb=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],cb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],db=512,eb=new Array(2*(Q+2));d(eb);var fb=new Array(2*R);d(fb);var gb=new Array(db);d(gb);var hb=new Array(N-M+1);d(hb);var ib=new Array(O);d(ib);var jb=new Array(R);d(jb);var kb,lb,mb,nb=function(a,b,c,d,e){this.static_tree=a,this.extra_bits=b,this.extra_base=c,this.elems=d,this.max_length=e,this.has_stree=a&&a.length},ob=function(a,b){this.dyn_tree=a,this.max_code=0,this.stat_desc=b},pb=!1;c._tr_init=z,c._tr_stored_block=A,c._tr_flush_block=C,c._tr_tally=D,c._tr_align=B},{"../utils/common":27}],39:[function(a,b){"use strict";function c(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}b.exports=c},{}]},{},[9])(9)});
!function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){(function(e){t.exports=e.pdfMake=n(1)}).call(e,function(){return this}())},function(t,e,n){(function(e){"use strict";function r(t,e,n){this.docDefinition=t,this.fonts=e||a,this.vfs=n}var i=n(2),o=n(3),a={Roboto:{normal:"Roboto-Regular.ttf",bold:"Roboto-Medium.ttf",italics:"Roboto-Italic.ttf",bolditalics:"Roboto-Italic.ttf"}};r.prototype._createDoc=function(t,n){var r=new i(this.fonts);r.fs.bindFS(this.vfs);var o,a=r.createPdfKitDocument(this.docDefinition,t),s=[];a.on("data",function(t){s.push(t)}),a.on("end",function(){o=e.concat(s),n(o,a._pdfMakePages)}),a.end()},r.prototype._getPages=function(t,e){if(!e)throw"getBuffer is an async method and needs a callback argument";this._createDoc(t,function(t,n){e(n)})},r.prototype.open=function(t){var e=window.open("","_blank");try{this.getDataUrl(function(t){e.location.href=t})}catch(n){throw e.close(),n}},r.prototype.print=function(){this.getDataUrl(function(t){var e=document.createElement("iframe");e.style.position="absolute",e.style.left="-99999px",e.src=t,e.onload=function(){function t(){document.body.removeChild(e),document.removeEventListener("click",t)}document.addEventListener("click",t,!1)},document.body.appendChild(e)},{autoPrint:!0})},r.prototype.download=function(t,e){"function"==typeof t&&(e=t,t=null),t=t||"file.pdf",this.getBuffer(function(n){o(new Blob([n],{type:"application/pdf"}),t),"function"==typeof e&&e()})},r.prototype.getBase64=function(t,e){if(!t)throw"getBase64 is an async method and needs a callback argument";this._createDoc(e,function(e){t(e.toString("base64"))})},r.prototype.getDataUrl=function(t,e){if(!t)throw"getDataUrl is an async method and needs a callback argument";this._createDoc(e,function(e){t("data:application/pdf;base64,"+e.toString("base64"))})},r.prototype.getBuffer=function(t,e){if(!t)throw"getBuffer is an async method and needs a callback argument";this._createDoc(e,function(e){t(e)})},t.exports={createPdf:function(t){return new r(t,window.pdfMake.fonts,window.pdfMake.vfs)}}}).call(e,n(4).Buffer)},function(t,e,n){"use strict";function r(t){this.fontDescriptors=t}function i(t){if(!t)return null;if("number"==typeof t||t instanceof Number)t={left:t,right:t,top:t,bottom:t};else if(t instanceof Array)if(2===t.length)t={left:t[0],top:t[1],right:t[0],bottom:t[1]};else{if(4!==t.length)throw"Invalid pageMargins definition";t={left:t[0],top:t[1],right:t[2],bottom:t[3]}}return t}function o(t){t.registerTableLayouts({noBorders:{hLineWidth:function(t){return 0},vLineWidth:function(t){return 0},paddingLeft:function(t){return t&&4||0},paddingRight:function(t,e){return t<e.table.widths.length-1?4:0}},headerLineOnly:{hLineWidth:function(t,e){return 0===t||t===e.table.body.length?0:t===e.table.headerRows?2:0},vLineWidth:function(t){return 0},paddingLeft:function(t){return 0===t?0:8},paddingRight:function(t,e){return t===e.table.widths.length-1?0:8}},lightHorizontalLines:{hLineWidth:function(t,e){return 0===t||t===e.table.body.length?0:t===e.table.headerRows?2:1},vLineWidth:function(t){return 0},hLineColor:function(t){return 1===t?"black":"#aaa"},paddingLeft:function(t){return 0===t?0:8},paddingRight:function(t,e){return t===e.table.widths.length-1?0:8}}})}function a(t){if("string"==typeof t||t instanceof String){var e=y[t.toUpperCase()];if(!e)throw"Page size "+t+" not recognized";return{width:e[0],height:e[1]}}return t}function s(t){this.isString=!0,this.toString=function(){return t}}function h(t,e){var n=e.options.size[0]>e.options.size[1]?"landscape":"portrait";if(t.pageSize.orientation!==n){var r=e.options.size[0],i=e.options.size[1];e.options.size=[i,r]}}function u(t,e,n){n._pdfMakePages=t;for(var r=0;r<t.length;r++){r>0&&(h(t[r],n),n.addPage(n.options));for(var i=t[r],o=0,a=i.items.length;a>o;o++){var s=i.items[o];switch(s.type){case"vector":f(s.item,n);break;case"line":l(s.item,s.item.x,s.item.y,n);break;case"image":d(s.item,s.item.x,s.item.y,n)}}i.watermark&&c(i,n),e.setFontRefsToPdfDoc()}}function l(t,e,n,r){e=e||0,n=n||0;var i=t.getAscenderHeight();_.drawBackground(t,e,n,r);for(var o=0,a=t.inlines.length;a>o;o++){var s=t.inlines[o];r.fill(s.color||"black"),r.save(),r.transform(1,0,0,-1,0,r.page.height);var h=s.font.encode(s.text);r.addContent("BT"),r.addContent(""+(e+s.x)+" "+(r.page.height-n-i)+" Td"),r.addContent("/"+h.fontId+" "+s.fontSize+" Tf"),r.addContent("<"+h.encodedText+"> Tj"),r.addContent("ET"),r.restore()}_.drawDecorations(t,e,n,r)}function c(t,e){var n=t.watermark;e.fill("black"),e.opacity(.6),e.save(),e.transform(1,0,0,-1,0,e.page.height);var r=180*Math.atan2(e.page.height,e.page.width)/Math.PI;e.rotate(r,{origin:[e.page.width/2,e.page.height/2]});var i=n.font.encode(n.text);e.addContent("BT"),e.addContent(""+(e.page.width/2-n.size.size.width/2)+" "+(e.page.height/2-n.size.size.height/4)+" Td"),e.addContent("/"+i.fontId+" "+n.size.fontSize+" Tf"),e.addContent("<"+i.encodedText+"> Tj"),e.addContent("ET"),e.restore()}function f(t,e){switch(e.lineWidth(t.lineWidth||1),t.dash?e.dash(t.dash.length,{space:t.dash.space||t.dash.length}):e.undash(),e.fillOpacity(t.fillOpacity||1),e.strokeOpacity(t.strokeOpacity||1),e.lineJoin(t.lineJoin||"miter"),t.type){case"ellipse":e.ellipse(t.x,t.y,t.r1,t.r2);break;case"rect":t.r?e.roundedRect(t.x,t.y,t.w,t.h,t.r):e.rect(t.x,t.y,t.w,t.h);break;case"line":e.moveTo(t.x1,t.y1),e.lineTo(t.x2,t.y2);break;case"polyline":if(0===t.points.length)break;e.moveTo(t.points[0].x,t.points[0].y);for(var n=1,r=t.points.length;r>n;n++)e.lineTo(t.points[n].x,t.points[n].y);if(t.points.length>1){var i=t.points[0],o=t.points[t.points.length-1];(t.closePath||i.x===o.x&&i.y===o.y)&&e.closePath()}}t.color&&t.lineColor?e.fillAndStroke(t.color,t.lineColor):t.color?e.fill(t.color):e.stroke(t.lineColor||"black")}function d(t,e,n,r){r.image(t.image,t.x,t.y,{width:t._width,height:t._height})}var p=(n(11),n(5)),g=n(6),v=n(28),m=n(12),y=n(7),w=n(8),_=n(9),p=n(5);r.prototype.createPdfKitDocument=function(t,e){e=e||{};var n=a(t.pageSize||"a4");"landscape"===t.pageOrientation&&(n={width:n.height,height:n.width}),n.orientation="landscape"===t.pageOrientation?t.pageOrientation:"portrait",this.pdfKitDoc=new v({size:[n.width,n.height],compress:!1}),this.pdfKitDoc.info.Producer="pdfmake",this.pdfKitDoc.info.Creator="pdfmake",this.fontProvider=new p(this.fontDescriptors,this.pdfKitDoc),t.images=t.images||{};var r=new g(n,i(t.pageMargins||40),new w(this.pdfKitDoc,t.images));o(r),e.tableLayouts&&r.registerTableLayouts(e.tableLayouts);var h=r.layoutDocument(t.content,this.fontProvider,t.styles||{},t.defaultStyle||{fontSize:12,font:"Roboto"},t.background,t.header,t.footer,t.images,t.watermark,t.pageBreakBefore);if(u(h,this.fontProvider,this.pdfKitDoc),e.autoPrint){var l=this.pdfKitDoc.ref({S:"JavaScript",JS:new s("this.print\\(true\\);")}),c=this.pdfKitDoc.ref({Names:[new s("EmbeddedJS"),new m(this.pdfKitDoc,l.id)]});l.end(),c.end(),this.pdfKitDoc._root.data.Names={JavaScript:new m(this.pdfKitDoc,c.id)}}return this.pdfKitDoc};t.exports=r,r.prototype.fs=n(10)},function(t,e,n){var r,i;(function(t){/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var o=o||"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob&&navigator.msSaveOrOpenBlob.bind(navigator)||function(t){"use strict";if("undefined"==typeof navigator||!/MSIE [1-9]\./.test(navigator.userAgent)){var e=t.document,n=function(){return t.URL||t.webkitURL||t},r=e.createElementNS("http://www.w3.org/1999/xhtml","a"),i="download"in r,o=function(n){var r=e.createEvent("MouseEvents");r.initMouseEvent("click",!0,!1,t,0,0,0,0,0,!1,!1,!1,!1,0,null),n.dispatchEvent(r)},a=t.webkitRequestFileSystem,s=t.requestFileSystem||a||t.mozRequestFileSystem,h=function(e){(t.setImmediate||t.setTimeout)(function(){throw e},0)},u="application/octet-stream",l=0,c=10,f=function(e){var r=function(){"string"==typeof e?n().revokeObjectURL(e):e.remove()};t.chrome?r():setTimeout(r,c)},d=function(t,e,n){e=[].concat(e);for(var r=e.length;r--;){var i=t["on"+e[r]];if("function"==typeof i)try{i.call(t,n||t)}catch(o){h(o)}}},p=function(e,h){var c,p,g,v=this,m=e.type,y=!1,w=function(){d(v,"writestart progress write writeend".split(" "))},_=function(){if((y||!c)&&(c=n().createObjectURL(e)),p)p.location.href=c;else{var r=t.open(c,"_blank");void 0==r&&"undefined"!=typeof safari&&(t.location.href=c)}v.readyState=v.DONE,w(),f(c)},b=function(t){return function(){return v.readyState!==v.DONE?t.apply(this,arguments):void 0}},x={create:!0,exclusive:!1};return v.readyState=v.INIT,h||(h="download"),i?(c=n().createObjectURL(e),r.href=c,r.download=h,o(r),v.readyState=v.DONE,w(),void f(c)):(t.chrome&&m&&m!==u&&(g=e.slice||e.webkitSlice,e=g.call(e,0,e.size,u),y=!0),a&&"download"!==h&&(h+=".download"),(m===u||a)&&(p=t),s?(l+=e.size,void s(t.TEMPORARY,l,b(function(t){t.root.getDirectory("saved",x,b(function(t){var n=function(){t.getFile(h,x,b(function(t){t.createWriter(b(function(n){n.onwriteend=function(e){p.location.href=t.toURL(),v.readyState=v.DONE,d(v,"writeend",e),f(t)},n.onerror=function(){var t=n.error;t.code!==t.ABORT_ERR&&_()},"writestart progress write abort".split(" ").forEach(function(t){n["on"+t]=v["on"+t]}),n.write(e),v.abort=function(){n.abort(),v.readyState=v.DONE},v.readyState=v.WRITING}),_)}),_)};t.getFile(h,{create:!1},b(function(t){t.remove(),n()}),b(function(t){t.code===t.NOT_FOUND_ERR?n():_()}))}),_)}),_)):void _())},g=p.prototype,v=function(t,e){return new p(t,e)};return g.abort=function(){var t=this;t.readyState=t.DONE,d(t,"abort")},g.readyState=g.INIT=0,g.WRITING=1,g.DONE=2,g.error=g.onwritestart=g.onprogress=g.onwrite=g.onabort=g.onerror=g.onwriteend=null,v}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content);"undefined"!=typeof t&&null!==t?t.exports=o:null!==n(13)&&null!=n(14)&&(r=[],i=function(){return o}.apply(e,r),!(void 0!==i&&(t.exports=i)))}).call(e,n(15)(t))},function(t,e,n){(function(t){function t(e){return this instanceof t?(this.length=0,this.parent=void 0,"number"==typeof e?r(this,e):"string"==typeof e?i(this,e,arguments.length>1?arguments[1]:"utf8"):o(this,e)):arguments.length>1?new t(e,arguments[1]):new t(e)}function r(e,n){if(e=c(e,0>n?0:0|f(n)),!t.TYPED_ARRAY_SUPPORT)for(var r=0;n>r;r++)e[r]=0;return e}function i(t,e,n){("string"!=typeof n||""===n)&&(n="utf8");var r=0|p(e,n);return t=c(t,r),t.write(e,n),t}function o(e,n){if(t.isBuffer(n))return a(e,n);if(G(n))return s(e,n);if(null==n)throw new TypeError("must start with number, buffer, array or string");return"undefined"!=typeof ArrayBuffer&&n.buffer instanceof ArrayBuffer?h(e,n):n.length?u(e,n):l(e,n)}function a(t,e){var n=0|f(e.length);return t=c(t,n),e.copy(t,0,0,n),t}function s(t,e){var n=0|f(e.length);t=c(t,n);for(var r=0;n>r;r+=1)t[r]=255&e[r];return t}function h(t,e){var n=0|f(e.length);t=c(t,n);for(var r=0;n>r;r+=1)t[r]=255&e[r];return t}function u(t,e){var n=0|f(e.length);t=c(t,n);for(var r=0;n>r;r+=1)t[r]=255&e[r];return t}function l(t,e){var n,r=0;"Buffer"===e.type&&G(e.data)&&(n=e.data,r=0|f(n.length)),t=c(t,r);for(var i=0;r>i;i+=1)t[i]=255&n[i];return t}function c(e,n){t.TYPED_ARRAY_SUPPORT?e=t._augment(new Uint8Array(n)):(e.length=n,e._isBuffer=!0);var r=0!==n&&n<=t.poolSize>>>1;return r&&(e.parent=Y),e}function f(t){if(t>=q)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+q.toString(16)+" bytes");return 0|t}function d(e,n){if(!(this instanceof d))return new d(e,n);var r=new t(e,n);return delete r.parent,r}function p(t,e){if("string"!=typeof t&&(t=String(t)),0===t.length)return 0;switch(e||"utf8"){case"ascii":case"binary":case"raw":return t.length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*t.length;case"hex":return t.length>>>1;case"utf8":case"utf-8":return P(t).length;case"base64":return W(t).length;default:return t.length}}function g(t,e,n,r){n=Number(n)||0;var i=t.length-n;r?(r=Number(r),r>i&&(r=i)):r=i;var o=e.length;if(o%2!==0)throw new Error("Invalid hex string");r>o/2&&(r=o/2);for(var a=0;r>a;a++){var s=parseInt(e.substr(2*a,2),16);if(isNaN(s))throw new Error("Invalid hex string");t[n+a]=s}return a}function v(t,e,n,r){return N(P(e,t.length-n),t,n,r)}function m(t,e,n,r){return N(F(e),t,n,r)}function y(t,e,n,r){return m(t,e,n,r)}function w(t,e,n,r){return N(W(e),t,n,r)}function _(t,e,n,r){return N(z(e,t.length-n),t,n,r)}function b(t,e,n){return H.fromByteArray(0===e&&n===t.length?t:t.slice(e,n))}function x(t,e,n){var r="",i="";n=Math.min(t.length,n);for(var o=e;n>o;o++)t[o]<=127?(r+=j(i)+String.fromCharCode(t[o]),i=""):i+="%"+t[o].toString(16);return r+j(i)}function S(t,e,n){var r="";n=Math.min(t.length,n);for(var i=e;n>i;i++)r+=String.fromCharCode(127&t[i]);return r}function k(t,e,n){var r="";n=Math.min(t.length,n);for(var i=e;n>i;i++)r+=String.fromCharCode(t[i]);return r}function E(t,e,n){var r=t.length;(!e||0>e)&&(e=0),(!n||0>n||n>r)&&(n=r);for(var i="",o=e;n>o;o++)i+=U(t[o]);return i}function C(t,e,n){for(var r=t.slice(e,n),i="",o=0;o<r.length;o+=2)i+=String.fromCharCode(r[o]+256*r[o+1]);return i}function I(t,e,n){if(t%1!==0||0>t)throw new RangeError("offset is not uint");if(t+e>n)throw new RangeError("Trying to access beyond buffer length")}function A(e,n,r,i,o,a){if(!t.isBuffer(e))throw new TypeError("buffer must be a Buffer instance");if(n>o||a>n)throw new RangeError("value is out of bounds");if(r+i>e.length)throw new RangeError("index out of range")}function L(t,e,n,r){0>e&&(e=65535+e+1);for(var i=0,o=Math.min(t.length-n,2);o>i;i++)t[n+i]=(e&255<<8*(r?i:1-i))>>>8*(r?i:1-i)}function R(t,e,n,r){0>e&&(e=4294967295+e+1);for(var i=0,o=Math.min(t.length-n,4);o>i;i++)t[n+i]=e>>>8*(r?i:3-i)&255}function B(t,e,n,r,i,o){if(e>i||o>e)throw new RangeError("value is out of bounds");if(n+r>t.length)throw new RangeError("index out of range");if(0>n)throw new RangeError("index out of range")}function T(t,e,n,r,i){return i||B(t,e,n,4,3.4028234663852886e38,-3.4028234663852886e38),Z.write(t,e,n,r,23,4),n+4}function M(t,e,n,r,i){return i||B(t,e,n,8,1.7976931348623157e308,-1.7976931348623157e308),Z.write(t,e,n,r,52,8),n+8}function O(t){if(t=D(t).replace(X,""),t.length<2)return"";for(;t.length%4!==0;)t+="=";return t}function D(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function U(t){return 16>t?"0"+t.toString(16):t.toString(16)}function P(t,e){e=e||1/0;for(var n,r=t.length,i=null,o=[],a=0;r>a;a++){if(n=t.charCodeAt(a),n>55295&&57344>n){if(!i){if(n>56319){(e-=3)>-1&&o.push(239,191,189);continue}if(a+1===r){(e-=3)>-1&&o.push(239,191,189);continue}i=n;continue}if(56320>n){(e-=3)>-1&&o.push(239,191,189),i=n;continue}n=i-55296<<10|n-56320|65536,i=null}else i&&((e-=3)>-1&&o.push(239,191,189),i=null);if(128>n){if((e-=1)<0)break;o.push(n)}else if(2048>n){if((e-=2)<0)break;o.push(n>>6|192,63&n|128)}else if(65536>n){if((e-=3)<0)break;o.push(n>>12|224,n>>6&63|128,63&n|128)}else{if(!(2097152>n))throw new Error("Invalid code point");if((e-=4)<0)break;o.push(n>>18|240,n>>12&63|128,n>>6&63|128,63&n|128)}}return o}function F(t){for(var e=[],n=0;n<t.length;n++)e.push(255&t.charCodeAt(n));return e}function z(t,e){for(var n,r,i,o=[],a=0;a<t.length&&!((e-=2)<0);a++)n=t.charCodeAt(a),r=n>>8,i=n%256,o.push(i),o.push(r);return o}function W(t){return H.toByteArray(O(t))}function N(t,e,n,r){for(var i=0;r>i&&!(i+n>=e.length||i>=t.length);i++)e[i+n]=t[i];return i}function j(t){try{return decodeURIComponent(t)}catch(e){return String.fromCharCode(65533)}}/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
var H=n(31),Z=n(29),G=n(30);e.Buffer=t,e.SlowBuffer=d,e.INSPECT_MAX_BYTES=50,t.poolSize=8192;var q=1073741823,Y={};t.TYPED_ARRAY_SUPPORT=function(){try{var t=new ArrayBuffer(0),e=new Uint8Array(t);return e.foo=function(){return 42},42===e.foo()&&"function"==typeof e.subarray&&0===new Uint8Array(1).subarray(1,1).byteLength}catch(n){return!1}}(),t.isBuffer=function(t){return!(null==t||!t._isBuffer)},t.compare=function(e,n){if(!t.isBuffer(e)||!t.isBuffer(n))throw new TypeError("Arguments must be Buffers");if(e===n)return 0;for(var r=e.length,i=n.length,o=0,a=Math.min(r,i);a>o&&e[o]===n[o];)++o;return o!==a&&(r=e[o],i=n[o]),i>r?-1:r>i?1:0},t.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"raw":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},t.concat=function(e,n){if(!G(e))throw new TypeError("list argument must be an Array of Buffers.");if(0===e.length)return new t(0);if(1===e.length)return e[0];var r;if(void 0===n)for(n=0,r=0;r<e.length;r++)n+=e[r].length;var i=new t(n),o=0;for(r=0;r<e.length;r++){var a=e[r];a.copy(i,o),o+=a.length}return i},t.byteLength=p,t.prototype.length=void 0,t.prototype.parent=void 0,t.prototype.toString=function(t,e,n){var r=!1;if(e=0|e,n=void 0===n||n===1/0?this.length:0|n,t||(t="utf8"),0>e&&(e=0),n>this.length&&(n=this.length),e>=n)return"";for(;;)switch(t){case"hex":return E(this,e,n);case"utf8":case"utf-8":return x(this,e,n);case"ascii":return S(this,e,n);case"binary":return k(this,e,n);case"base64":return b(this,e,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return C(this,e,n);default:if(r)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),r=!0}},t.prototype.equals=function(e){if(!t.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e?!0:0===t.compare(this,e)},t.prototype.inspect=function(){var t="",n=e.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,n).match(/.{2}/g).join(" "),this.length>n&&(t+=" ... ")),"<Buffer "+t+">"},t.prototype.compare=function(e){if(!t.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e?0:t.compare(this,e)},t.prototype.indexOf=function(e,n){function r(t,e,n){for(var r=-1,i=0;n+i<t.length;i++)if(t[n+i]===e[-1===r?0:i-r]){if(-1===r&&(r=i),i-r+1===e.length)return n+r}else r=-1;return-1}if(n>2147483647?n=2147483647:-2147483648>n&&(n=-2147483648),n>>=0,0===this.length)return-1;if(n>=this.length)return-1;if(0>n&&(n=Math.max(this.length+n,0)),"string"==typeof e)return 0===e.length?-1:String.prototype.indexOf.call(this,e,n);if(t.isBuffer(e))return r(this,e,n);if("number"==typeof e)return t.TYPED_ARRAY_SUPPORT&&"function"===Uint8Array.prototype.indexOf?Uint8Array.prototype.indexOf.call(this,e,n):r(this,[e],n);throw new TypeError("val must be string, number or Buffer")},t.prototype.get=function(t){return this.readUInt8(t)},t.prototype.set=function(t,e){return this.writeUInt8(t,e)},t.prototype.write=function(t,e,n,r){if(void 0===e)r="utf8",n=this.length,e=0;else if(void 0===n&&"string"==typeof e)r=e,n=this.length,e=0;else if(isFinite(e))e=0|e,isFinite(n)?(n=0|n,void 0===r&&(r="utf8")):(r=n,n=void 0);else{var i=r;r=e,e=0|n,n=i}var o=this.length-e;if((void 0===n||n>o)&&(n=o),t.length>0&&(0>n||0>e)||e>this.length)throw new RangeError("attempt to write outside buffer bounds");r||(r="utf8");for(var a=!1;;)switch(r){case"hex":return g(this,t,e,n);case"utf8":case"utf-8":return v(this,t,e,n);case"ascii":return m(this,t,e,n);case"binary":return y(this,t,e,n);case"base64":return w(this,t,e,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return _(this,t,e,n);default:if(a)throw new TypeError("Unknown encoding: "+r);r=(""+r).toLowerCase(),a=!0}},t.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},t.prototype.slice=function(e,n){var r=this.length;e=~~e,n=void 0===n?r:~~n,0>e?(e+=r,0>e&&(e=0)):e>r&&(e=r),0>n?(n+=r,0>n&&(n=0)):n>r&&(n=r),e>n&&(n=e);var i;if(t.TYPED_ARRAY_SUPPORT)i=t._augment(this.subarray(e,n));else{var o=n-e;i=new t(o,void 0);for(var a=0;o>a;a++)i[a]=this[a+e]}return i.length&&(i.parent=this.parent||this),i},t.prototype.readUIntLE=function(t,e,n){t=0|t,e=0|e,n||I(t,e,this.length);for(var r=this[t],i=1,o=0;++o<e&&(i*=256);)r+=this[t+o]*i;return r},t.prototype.readUIntBE=function(t,e,n){t=0|t,e=0|e,n||I(t,e,this.length);for(var r=this[t+--e],i=1;e>0&&(i*=256);)r+=this[t+--e]*i;return r},t.prototype.readUInt8=function(t,e){return e||I(t,1,this.length),this[t]},t.prototype.readUInt16LE=function(t,e){return e||I(t,2,this.length),this[t]|this[t+1]<<8},t.prototype.readUInt16BE=function(t,e){return e||I(t,2,this.length),this[t]<<8|this[t+1]},t.prototype.readUInt32LE=function(t,e){return e||I(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},t.prototype.readUInt32BE=function(t,e){return e||I(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},t.prototype.readIntLE=function(t,e,n){t=0|t,e=0|e,n||I(t,e,this.length);for(var r=this[t],i=1,o=0;++o<e&&(i*=256);)r+=this[t+o]*i;return i*=128,r>=i&&(r-=Math.pow(2,8*e)),r},t.prototype.readIntBE=function(t,e,n){t=0|t,e=0|e,n||I(t,e,this.length);for(var r=e,i=1,o=this[t+--r];r>0&&(i*=256);)o+=this[t+--r]*i;return i*=128,o>=i&&(o-=Math.pow(2,8*e)),o},t.prototype.readInt8=function(t,e){return e||I(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},t.prototype.readInt16LE=function(t,e){e||I(t,2,this.length);var n=this[t]|this[t+1]<<8;return 32768&n?4294901760|n:n},t.prototype.readInt16BE=function(t,e){e||I(t,2,this.length);var n=this[t+1]|this[t]<<8;return 32768&n?4294901760|n:n},t.prototype.readInt32LE=function(t,e){return e||I(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},t.prototype.readInt32BE=function(t,e){return e||I(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},t.prototype.readFloatLE=function(t,e){return e||I(t,4,this.length),Z.read(this,t,!0,23,4)},t.prototype.readFloatBE=function(t,e){return e||I(t,4,this.length),Z.read(this,t,!1,23,4)},t.prototype.readDoubleLE=function(t,e){return e||I(t,8,this.length),Z.read(this,t,!0,52,8)},t.prototype.readDoubleBE=function(t,e){return e||I(t,8,this.length),Z.read(this,t,!1,52,8)},t.prototype.writeUIntLE=function(t,e,n,r){t=+t,e=0|e,n=0|n,r||A(this,t,e,n,Math.pow(2,8*n),0);var i=1,o=0;for(this[e]=255&t;++o<n&&(i*=256);)this[e+o]=t/i&255;return e+n},t.prototype.writeUIntBE=function(t,e,n,r){t=+t,e=0|e,n=0|n,r||A(this,t,e,n,Math.pow(2,8*n),0);var i=n-1,o=1;for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=t/o&255;return e+n},t.prototype.writeUInt8=function(e,n,r){return e=+e,n=0|n,r||A(this,e,n,1,255,0),t.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),this[n]=e,n+1},t.prototype.writeUInt16LE=function(e,n,r){return e=+e,n=0|n,r||A(this,e,n,2,65535,0),t.TYPED_ARRAY_SUPPORT?(this[n]=e,this[n+1]=e>>>8):L(this,e,n,!0),n+2},t.prototype.writeUInt16BE=function(e,n,r){return e=+e,n=0|n,r||A(this,e,n,2,65535,0),t.TYPED_ARRAY_SUPPORT?(this[n]=e>>>8,this[n+1]=e):L(this,e,n,!1),n+2},t.prototype.writeUInt32LE=function(e,n,r){return e=+e,n=0|n,r||A(this,e,n,4,4294967295,0),t.TYPED_ARRAY_SUPPORT?(this[n+3]=e>>>24,this[n+2]=e>>>16,this[n+1]=e>>>8,this[n]=e):R(this,e,n,!0),n+4},t.prototype.writeUInt32BE=function(e,n,r){return e=+e,n=0|n,r||A(this,e,n,4,4294967295,0),t.TYPED_ARRAY_SUPPORT?(this[n]=e>>>24,this[n+1]=e>>>16,this[n+2]=e>>>8,this[n+3]=e):R(this,e,n,!1),n+4},t.prototype.writeIntLE=function(t,e,n,r){if(t=+t,e=0|e,!r){var i=Math.pow(2,8*n-1);A(this,t,e,n,i-1,-i)}var o=0,a=1,s=0>t?1:0;for(this[e]=255&t;++o<n&&(a*=256);)this[e+o]=(t/a>>0)-s&255;return e+n},t.prototype.writeIntBE=function(t,e,n,r){if(t=+t,e=0|e,!r){var i=Math.pow(2,8*n-1);A(this,t,e,n,i-1,-i)}var o=n-1,a=1,s=0>t?1:0;for(this[e+o]=255&t;--o>=0&&(a*=256);)this[e+o]=(t/a>>0)-s&255;return e+n},t.prototype.writeInt8=function(e,n,r){return e=+e,n=0|n,r||A(this,e,n,1,127,-128),t.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),0>e&&(e=255+e+1),this[n]=e,n+1},t.prototype.writeInt16LE=function(e,n,r){return e=+e,n=0|n,r||A(this,e,n,2,32767,-32768),t.TYPED_ARRAY_SUPPORT?(this[n]=e,this[n+1]=e>>>8):L(this,e,n,!0),n+2},t.prototype.writeInt16BE=function(e,n,r){return e=+e,n=0|n,r||A(this,e,n,2,32767,-32768),t.TYPED_ARRAY_SUPPORT?(this[n]=e>>>8,this[n+1]=e):L(this,e,n,!1),n+2},t.prototype.writeInt32LE=function(e,n,r){return e=+e,n=0|n,r||A(this,e,n,4,2147483647,-2147483648),t.TYPED_ARRAY_SUPPORT?(this[n]=e,this[n+1]=e>>>8,this[n+2]=e>>>16,this[n+3]=e>>>24):R(this,e,n,!0),n+4},t.prototype.writeInt32BE=function(e,n,r){return e=+e,n=0|n,r||A(this,e,n,4,2147483647,-2147483648),0>e&&(e=4294967295+e+1),t.TYPED_ARRAY_SUPPORT?(this[n]=e>>>24,this[n+1]=e>>>16,this[n+2]=e>>>8,this[n+3]=e):R(this,e,n,!1),n+4},t.prototype.writeFloatLE=function(t,e,n){return T(this,t,e,!0,n)},t.prototype.writeFloatBE=function(t,e,n){return T(this,t,e,!1,n)},t.prototype.writeDoubleLE=function(t,e,n){return M(this,t,e,!0,n)},t.prototype.writeDoubleBE=function(t,e,n){return M(this,t,e,!1,n)},t.prototype.copy=function(e,n,r,i){if(r||(r=0),i||0===i||(i=this.length),n>=e.length&&(n=e.length),n||(n=0),i>0&&r>i&&(i=r),i===r)return 0;if(0===e.length||0===this.length)return 0;if(0>n)throw new RangeError("targetStart out of bounds");if(0>r||r>=this.length)throw new RangeError("sourceStart out of bounds");if(0>i)throw new RangeError("sourceEnd out of bounds");i>this.length&&(i=this.length),e.length-n<i-r&&(i=e.length-n+r);var o=i-r;if(1e3>o||!t.TYPED_ARRAY_SUPPORT)for(var a=0;o>a;a++)e[a+n]=this[a+r];else e._set(this.subarray(r,r+o),n);return o},t.prototype.fill=function(t,e,n){if(t||(t=0),e||(e=0),n||(n=this.length),e>n)throw new RangeError("end < start");if(n!==e&&0!==this.length){if(0>e||e>=this.length)throw new RangeError("start out of bounds");if(0>n||n>this.length)throw new RangeError("end out of bounds");var r;if("number"==typeof t)for(r=e;n>r;r++)this[r]=t;else{var i=P(t.toString()),o=i.length;for(r=e;n>r;r++)this[r]=i[r%o]}return this}},t.prototype.toArrayBuffer=function(){if("undefined"!=typeof Uint8Array){if(t.TYPED_ARRAY_SUPPORT)return new t(this).buffer;for(var e=new Uint8Array(this.length),n=0,r=e.length;r>n;n+=1)e[n]=this[n];return e.buffer}throw new TypeError("Buffer.toArrayBuffer not supported in this browser")};var K=t.prototype;t._augment=function(e){return e.constructor=t,e._isBuffer=!0,e._set=e.set,e.get=K.get,e.set=K.set,e.write=K.write,e.toString=K.toString,e.toLocaleString=K.toString,e.toJSON=K.toJSON,e.equals=K.equals,e.compare=K.compare,e.indexOf=K.indexOf,e.copy=K.copy,e.slice=K.slice,e.readUIntLE=K.readUIntLE,e.readUIntBE=K.readUIntBE,e.readUInt8=K.readUInt8,e.readUInt16LE=K.readUInt16LE,e.readUInt16BE=K.readUInt16BE,e.readUInt32LE=K.readUInt32LE,e.readUInt32BE=K.readUInt32BE,e.readIntLE=K.readIntLE,e.readIntBE=K.readIntBE,e.readInt8=K.readInt8,e.readInt16LE=K.readInt16LE,e.readInt16BE=K.readInt16BE,e.readInt32LE=K.readInt32LE,e.readInt32BE=K.readInt32BE,e.readFloatLE=K.readFloatLE,e.readFloatBE=K.readFloatBE,e.readDoubleLE=K.readDoubleLE,e.readDoubleBE=K.readDoubleBE,e.writeUInt8=K.writeUInt8,e.writeUIntLE=K.writeUIntLE,e.writeUIntBE=K.writeUIntBE,e.writeUInt16LE=K.writeUInt16LE,e.writeUInt16BE=K.writeUInt16BE,e.writeUInt32LE=K.writeUInt32LE,e.writeUInt32BE=K.writeUInt32BE,e.writeIntLE=K.writeIntLE,e.writeIntBE=K.writeIntBE,e.writeInt8=K.writeInt8,e.writeInt16LE=K.writeInt16LE,e.writeInt16BE=K.writeInt16BE,e.writeInt32LE=K.writeInt32LE,e.writeInt32BE=K.writeInt32BE,e.writeFloatLE=K.writeFloatLE,e.writeFloatBE=K.writeFloatBE,e.writeDoubleLE=K.writeDoubleLE,e.writeDoubleBE=K.writeDoubleBE,e.fill=K.fill,e.inspect=K.inspect,e.toArrayBuffer=K.toArrayBuffer,e};var X=/[^+\/0-9A-z\-]/g}).call(e,n(4).Buffer)},function(t,e,n){"use strict";function r(t,e){var n="normal";return t&&e?n="bolditalics":t?n="bold":e&&(n="italics"),n}function i(t,e){this.fonts={},this.pdfDoc=e,this.fontWrappers={};for(var n in t)if(t.hasOwnProperty(n)){var r=t[n];this.fonts[n]={normal:r.normal,bold:r.bold,italics:r.italics,bolditalics:r.bolditalics}}}var o=n(11),a=n(16);i.prototype.provideFont=function(t,e,n){if(!this.fonts[t])return this.pdfDoc._font;var i=r(e,n);return this.fontWrappers[t]=this.fontWrappers[t]||{},this.fontWrappers[t][i]||(this.fontWrappers[t][i]=new a(this.pdfDoc,this.fonts[t][i],t+"("+i+")")),this.fontWrappers[t][i]},i.prototype.setFontRefsToPdfDoc=function(){var t=this;o.each(t.fontWrappers,function(e){o.each(e,function(e){o.each(e.pdfFonts,function(e){t.pdfDoc.page.fonts[e.id]||(t.pdfDoc.page.fonts[e.id]=e.ref())})})})},t.exports=i},function(t,e,n){"use strict";function r(t,e){a.each(e,function(e){t.push(e)})}function i(t,e,n){this.pageSize=t,this.pageMargins=e,this.tracker=new s,this.imageMeasure=n,this.tableLayouts={}}function o(t){var e=t.x,n=t.y;t.positions=[],a.each(t.canvas,function(t){var e=t.x,n=t.y;t.resetXY=function(){t.x=e,t.y=n}}),t.resetXY=function(){t.x=e,t.y=n,a.each(t.canvas,function(t){t.resetXY()})}}var a=n(11),s=n(18),h=n(19),u=n(20),l=n(21),c=n(22),f=n(23),d=n(24),p=n(25).pack,g=n(25).offsetVector,v=n(25).fontStringify,m=n(25).isFunction,y=n(26),w=n(27);i.prototype.registerTableLayouts=function(t){this.tableLayouts=p(this.tableLayouts,t)},i.prototype.layoutDocument=function(t,e,n,r,i,o,s,u,l,c){function f(t,e){return t=a.reject(t,function(t){return a.isEmpty(t.positions)}),a.each(t,function(t){var n=a.pick(t,["id","text","ul","ol","table","image","qr","canvas","columns","headlineLevel","style","pageBreak","pageOrientation","width","height"]);n.startPosition=a.first(t.positions),n.pageNumbers=a.chain(t.positions).map("pageNumber").uniq().value(),n.pages=e.length,n.stack=a.isArray(t.stack),t.nodeInfo=n}),a.any(t,function(t,e,n){if("before"!==t.pageBreak&&!t.pageBreakCalculated){t.pageBreakCalculated=!0;var r=a.first(t.nodeInfo.pageNumbers),i=a.chain(n).drop(e+1).filter(function(t){return a.contains(t.nodeInfo.pageNumbers,r)}).value(),o=a.chain(n).drop(e+1).filter(function(t){return a.contains(t.nodeInfo.pageNumbers,r+1)}).value(),s=a.chain(n).take(e).filter(function(t){return a.contains(t.nodeInfo.pageNumbers,r)}).value();if(c(t.nodeInfo,a.map(i,"nodeInfo"),a.map(o,"nodeInfo"),a.map(s,"nodeInfo")))return t.pageBreak="before",!0}})}function d(t){a.each(t.linearNodeList,function(t){t.resetXY()})}m(c)||(c=function(){return!1}),this.docMeasure=new h(e,n,r,this.imageMeasure,this.tableLayouts,u);for(var p=this.tryLayoutDocument(t,e,n,r,i,o,s,u,l);f(p.linearNodeList,p.pages);)d(p),p=this.tryLayoutDocument(t,e,n,r,i,o,s,u,l);return p.pages},i.prototype.tryLayoutDocument=function(t,e,n,r,i,o,a,s,h,c){this.linearNodeList=[],t=this.docMeasure.measureDocument(t),this.writer=new l(new u(this.pageSize,this.pageMargins),this.tracker);var f=this;return this.writer.context().tracker.startTracking("pageAdded",function(){f.addBackground(i)}),this.addBackground(i),this.processNode(t),this.addHeadersAndFooters(o,a),null!=h&&this.addWatermark(h,e),{pages:this.writer.context().pages,linearNodeList:this.linearNodeList}},i.prototype.addBackground=function(t){var e=m(t)?t:function(){return t},n=e(this.writer.context().page+1);if(n){var r=this.writer.context().getCurrentPage().pageSize;this.writer.beginUnbreakableBlock(r.width,r.height),this.processNode(this.docMeasure.measureDocument(n)),this.writer.commitUnbreakableBlock(0,0)}},i.prototype.addStaticRepeatable=function(t,e){this.addDynamicRepeatable(function(){return t},e)},i.prototype.addDynamicRepeatable=function(t,e){for(var n=this.writer.context().pages,r=0,i=n.length;i>r;r++){this.writer.context().page=r;var o=t(r+1,i);if(o){var a=e(this.writer.context().getCurrentPage().pageSize,this.pageMargins);this.writer.beginUnbreakableBlock(a.width,a.height),this.processNode(this.docMeasure.measureDocument(o)),this.writer.commitUnbreakableBlock(a.x,a.y)}}},i.prototype.addHeadersAndFooters=function(t,e){var n=function(t,e){return{x:0,y:0,width:t.width,height:e.top}},r=function(t,e){return{x:0,y:t.height-e.bottom,width:t.width,height:e.bottom}};m(t)?this.addDynamicRepeatable(t,n):t&&this.addStaticRepeatable(t,n),m(e)?this.addDynamicRepeatable(e,r):e&&this.addStaticRepeatable(e,r)},i.prototype.addWatermark=function(t,e){function n(t,e,n){for(var r,i=t.width,o=t.height,a=.8*Math.sqrt(i*i+o*o),s=new y(n),h=new w,u=0,l=1e3,c=(u+l)/2;Math.abs(u-l)>1;)h.push({fontSize:c}),r=s.sizeOfString(e,h),r.width>a?(l=c,c=(u+l)/2):r.width<a&&(u=c,c=(u+l)/2),h.pop();return{size:r,fontSize:c}}for(var r=Object.getOwnPropertyNames(e.fonts)[0],i={text:t,font:e.provideFont(e[r],!1,!1),size:n(this.pageSize,t,e)},o=this.writer.context().pages,a=0,s=o.length;s>a;a++)o[a].watermark=i},i.prototype.processNode=function(t){function e(e){var r=t._margin;"before"===t.pageBreak&&n.writer.moveToNextPage(t.pageOrientation),r&&(n.writer.context().moveDown(r[1]),n.writer.context().addMargin(r[0],r[2])),e(),r&&(n.writer.context().addMargin(-r[0],-r[2]),n.writer.context().moveDown(r[3])),"after"===t.pageBreak&&n.writer.moveToNextPage(t.pageOrientation)}var n=this;this.linearNodeList.push(t),o(t),e(function(){var e=t.absolutePosition;if(e&&(n.writer.context().beginDetachedBlock(),n.writer.context().moveTo(e.x||0,e.y||0)),t.stack)n.processVerticalContainer(t);else if(t.columns)n.processColumns(t);else if(t.ul)n.processList(!1,t);else if(t.ol)n.processList(!0,t);else if(t.table)n.processTable(t);else if(void 0!==t.text)n.processLeaf(t);else if(t.image)n.processImage(t);else if(t.canvas)n.processCanvas(t);else if(t.qr)n.processQr(t);else if(!t._span)throw"Unrecognized document structure: "+JSON.stringify(t,v);e&&n.writer.context().endDetachedBlock()})},i.prototype.processVerticalContainer=function(t){var e=this;t.stack.forEach(function(n){e.processNode(n),r(t.positions,n.positions)})},i.prototype.processColumns=function(t){function e(t){if(!t)return null;var e=[];e.push(0);for(var r=n.length-1;r>0;r--)e.push(t);return e}var n=t.columns,i=this.writer.context().availableWidth,o=e(t._gap);o&&(i-=(o.length-1)*t._gap),c.buildColumnWidths(n,i);var a=this.processRow(n,n,o);r(t.positions,a.positions)},i.prototype.processRow=function(t,e,n,i,o){function a(t){for(var e,n=0,r=l.length;r>n;n++){var i=l[n];if(i.prevPage===t.prevPage){e=i;break}}e||(e=t,l.push(e)),e.prevY=Math.max(e.prevY,t.prevY),e.y=Math.min(e.y,t.y)}function s(t){return n&&n.length>t?n[t]:0}function h(t,e){if(t.rowSpan&&t.rowSpan>1){var n=o+t.rowSpan-1;if(n>=i.length)throw"Row span for column "+e+" (with indexes starting from 0) exceeded row count";return i[n][e]}return null}var u=this,l=[],c=[];return this.tracker.auto("pageChanged",a,function(){e=e||t,u.writer.context().beginColumnGroup();for(var i=0,o=t.length;o>i;i++){var a=t[i],l=e[i]._calcWidth,f=s(i);if(a.colSpan&&a.colSpan>1)for(var d=1;d<a.colSpan;d++)l+=e[++i]._calcWidth+n[i];u.writer.context().beginColumn(l,f,h(a,i)),a._span?a._columnEndingContext&&u.writer.context().markEnding(a):(u.processNode(a),r(c,a.positions))}u.writer.context().completeColumnGroup()}),{pageBreaks:l,positions:c}},i.prototype.processList=function(t,e){function n(t){if(s){var e=s;if(s=null,e.canvas){var n=e.canvas[0];g(n,-e._minWidth,0),i.writer.addVector(n)}else{var r=new d(i.pageSize.width);r.addInline(e._inlines[0]),r.x=-e._minWidth,r.y=t.getAscenderHeight()-r.getAscenderHeight(),i.writer.addLine(r,!0)}}}var i=this,o=t?e.ol:e.ul,a=e._gapSize;this.writer.context().addMargin(a.width);var s;this.tracker.auto("lineAdded",n,function(){o.forEach(function(t){s=t.listMarker,i.processNode(t),r(e.positions,t.positions)})}),this.writer.context().addMargin(-a.width)},i.prototype.processTable=function(t){var e=new f(t);e.beginTable(this.writer);for(var n=0,i=t.table.body.length;i>n;n++){e.beginRow(n,this.writer);var o=this.processRow(t.table.body[n],t.table.widths,t._offsets.offsets,t.table.body,n);r(t.positions,o.positions),e.endRow(n,this.writer,o.pageBreaks)}e.endTable(this.writer)},i.prototype.processLeaf=function(t){for(var e=this.buildNextLine(t);e;){var n=this.writer.addLine(e);t.positions.push(n),e=this.buildNextLine(t)}},i.prototype.buildNextLine=function(t){if(!t._inlines||0===t._inlines.length)return null;for(var e=new d(this.writer.context().availableWidth);t._inlines&&t._inlines.length>0&&e.hasEnoughSpaceForInline(t._inlines[0]);)e.addInline(t._inlines.shift());return e.lastLineInParagraph=0===t._inlines.length,e},i.prototype.processImage=function(t){var e=this.writer.addImage(t);t.positions.push(e)},i.prototype.processCanvas=function(t){var e=t._minHeight;this.writer.context().availableHeight<e&&this.writer.moveToNextPage(),t.canvas.forEach(function(e){var n=this.writer.addVector(e);t.positions.push(n)},this),this.writer.context().moveDown(e)},i.prototype.processQr=function(t){var e=this.writer.addQr(t);t.positions.push(e)},t.exports=i},function(t,e,n){t.exports={"4A0":[4767.87,6740.79],"2A0":[3370.39,4767.87],A0:[2383.94,3370.39],A1:[1683.78,2383.94],A2:[1190.55,1683.78],A3:[841.89,1190.55],A4:[595.28,841.89],A5:[419.53,595.28],A6:[297.64,419.53],A7:[209.76,297.64],A8:[147.4,209.76],A9:[104.88,147.4],A10:[73.7,104.88],B0:[2834.65,4008.19],B1:[2004.09,2834.65],B2:[1417.32,2004.09],B3:[1000.63,1417.32],B4:[708.66,1000.63],B5:[498.9,708.66],B6:[354.33,498.9],B7:[249.45,354.33],B8:[175.75,249.45],B9:[124.72,175.75],B10:[87.87,124.72],C0:[2599.37,3676.54],C1:[1836.85,2599.37],C2:[1298.27,1836.85],C3:[918.43,1298.27],C4:[649.13,918.43],C5:[459.21,649.13],C6:[323.15,459.21],C7:[229.61,323.15],C8:[161.57,229.61],C9:[113.39,161.57],C10:[79.37,113.39],RA0:[2437.8,3458.27],RA1:[1729.13,2437.8],RA2:[1218.9,1729.13],RA3:[864.57,1218.9],RA4:[609.45,864.57],SRA0:[2551.18,3628.35],SRA1:[1814.17,2551.18],SRA2:[1275.59,1814.17],SRA3:[907.09,1275.59],SRA4:[637.8,907.09],EXECUTIVE:[521.86,756],FOLIO:[612,936],LEGAL:[612,1008],LETTER:[612,792],TABLOID:[792,1224]}},function(t,e,n){(function(e){"use strict";function r(t,e){this.pdfDoc=t,this.imageDictionary=e||{}}var i=(n(28),n(17));r.prototype.measureImage=function(t){function n(t){var n=a.imageDictionary[t];if(!n)return t;var r=n.indexOf("base64,");if(0>r)throw"invalid image format, images dictionary should contain dataURL entries";return new e(n.substring(r+7),"base64")}var r,o,a=this;return this.pdfDoc._imageRegistry[t]?r=this.pdfDoc._imageRegistry[t]:(o="I"+ ++this.pdfDoc._imageCount,r=i.open(n(t),o),r.embed(this.pdfDoc),this.pdfDoc._imageRegistry[t]=r),{width:r.width,height:r.height}},t.exports=r}).call(e,n(4).Buffer)},function(t,e,n){"use strict";function r(t){for(var e=[],n=null,r=0,i=t.inlines.length;i>r;r++){var o=t.inlines[r],a=o.decoration;if(a){var s=o.decorationColor||o.color||"black",h=o.decorationStyle||"solid";a=Array.isArray(a)?a:[a];for(var u=0,l=a.length;l>u;u++){var c=a[u];n&&c===n.decoration&&h===n.decorationStyle&&s===n.decorationColor&&"lineThrough"!==c?n.inlines.push(o):(n={line:t,decoration:c,decorationColor:s,decorationStyle:h,inlines:[o]},e.push(n))}}else n=null}return e}function i(t,e,n,r){function i(){for(var e=0,n=0,r=t.inlines.length;r>n;n++){var i=t.inlines[n];e=i.fontSize>e?n:e}return t.inlines[e]}function o(){for(var e=0,n=0,r=t.inlines.length;r>n;n++)e+=t.inlines[n].width;return e}var a=t.inlines[0],s=i(),h=o(),u=t.line.getAscenderHeight(),l=s.font.ascender/1e3*s.fontSize,c=s.height,f=c-l,d=.5+.12*Math.floor(Math.max(s.fontSize-8,0)/2);switch(t.decoration){case"underline":n+=u+.45*f;break;case"overline":n+=u-.85*l;break;case"lineThrough":n+=u-.25*l;break;default:throw"Unkown decoration : "+t.decoration}if(r.save(),"double"===t.decorationStyle){var p=Math.max(.5,2*d);r.fillColor(t.decorationColor).rect(e+a.x,n-d/2,h,d/2).fill().rect(e+a.x,n+p-d/2,h,d/2).fill()}else if("dashed"===t.decorationStyle){var g=Math.ceil(h/6.8),v=e+a.x;r.rect(v,n,h,d).clip(),r.fillColor(t.decorationColor);for(var m=0;g>m;m++)r.rect(v,n-d/2,3.96,d).fill(),v+=6.8}else if("dotted"===t.decorationStyle){var y=Math.ceil(h/(3*d)),w=e+a.x;r.rect(w,n,h,d).clip(),r.fillColor(t.decorationColor);for(var _=0;y>_;_++)r.rect(w,n-d/2,d,d).fill(),w+=3*d}else if("wavy"===t.decorationStyle){var b=.7,x=1,S=Math.ceil(h/(2*b))+1,k=e+a.x-1;r.rect(e+a.x,n-x,h,n+x).clip(),r.lineWidth(.24),r.moveTo(k,n);for(var E=0;S>E;E++)r.bezierCurveTo(k+b,n-x,k+2*b,n-x,k+3*b,n).bezierCurveTo(k+4*b,n+x,k+5*b,n+x,k+6*b,n),k+=6*b;r.stroke(t.decorationColor)}else r.fillColor(t.decorationColor).rect(e+a.x,n-d/2,h,d).fill();r.restore()}function o(t,e,n,o){for(var a=r(t),s=0,h=a.length;h>s;s++)i(a[s],e,n,o)}function a(t,e,n,r){for(var i=t.getHeight(),o=0,a=t.inlines.length;a>o;o++){var s=t.inlines[o];s.background&&r.fillColor(s.background).rect(e+s.x,n,s.width,i).fill()}}t.exports={drawBackground:a,drawDecorations:o}},function(t,e,n){(function(e,n){"use strict";function r(){this.fileSystem={},this.baseSystem={}}function i(t){return 0===t.indexOf(n)&&(t=t.substring(n.length)),0===t.indexOf("/")&&(t=t.substring(1)),t}r.prototype.readFileSync=function(t){t=i(t);var n=this.baseSystem[t];return n?new e(n,"base64"):this.fileSystem[t]},r.prototype.writeFileSync=function(t,e){this.fileSystem[i(t)]=e},r.prototype.bindFS=function(t){this.baseSystem=t},t.exports=new r}).call(e,n(4).Buffer,"/")},function(t,e,n){var r;(function(t,i){(function(){function o(t,e){if(t!==e){var n=t===t,r=e===e;if(t>e||!n||"undefined"==typeof t&&r)return 1;if(e>t||!r||"undefined"==typeof e&&n)return-1}return 0}function a(t,e,n){if(e!==e)return m(t,n);for(var r=(n||0)-1,i=t.length;++r<i;)if(t[r]===e)return r;return-1}function s(t,e){var n=t.length;for(t.sort(e);n--;)t[n]=t[n].value;return t}function h(t){return"string"==typeof t?t:null==t?"":t+""}function u(t){return t.charCodeAt(0)}function l(t,e){for(var n=-1,r=t.length;++n<r&&e.indexOf(t.charAt(n))>-1;);return n}function c(t,e){for(var n=t.length;n--&&e.indexOf(t.charAt(n))>-1;);return n}function f(t,e){return o(t.criteria,e.criteria)||t.index-e.index}function d(t,e){for(var n=-1,r=t.criteria,i=e.criteria,a=r.length;++n<a;){var s=o(r[n],i[n]);if(s)return s}return t.index-e.index}function p(t){return Ht[t]}function g(t){return Zt[t]}function v(t){return"\\"+Yt[t]}function m(t,e,n){for(var r=t.length,i=n?e||r:(e||0)-1;n?i--:++i<r;){var o=t[i];if(o!==o)return i}return-1}function y(t){return t&&"object"==typeof t||!1}function w(t){return 160>=t&&t>=9&&13>=t||32==t||160==t||5760==t||6158==t||t>=8192&&(8202>=t||8232==t||8233==t||8239==t||8287==t||12288==t||65279==t)}function _(t,e){for(var n=-1,r=t.length,i=-1,o=[];++n<r;)t[n]===e&&(t[n]=G,o[++i]=n);return o}function b(t,e){for(var n,r=-1,i=t.length,o=-1,a=[];++r<i;){var s=t[r],h=e?e(s,r,t):s;r&&n===h||(n=h,a[++o]=s)}return a}function x(t){for(var e=-1,n=t.length;++e<n&&w(t.charCodeAt(e)););return e}function S(t){for(var e=t.length;e--&&w(t.charCodeAt(e)););return e}function k(t){return Gt[t]}function E(t){function e(t){if(y(t)&&!ja(t)){if(t instanceof n)return t;if(qo.call(t,"__wrapped__"))return new n(t.__wrapped__,t.__chain__,Vt(t.__actions__))}return new n(t)}function n(t,e,n){this.__actions__=n||[],this.__chain__=!!e,this.__wrapped__=t}function r(t){this.actions=null,this.dir=1,this.dropCount=0,this.filtered=!1,this.iteratees=null,this.takeCount=xa,this.views=null,this.wrapped=t}function i(){var t=this.actions,e=this.iteratees,n=this.views,i=new r(this.wrapped);return i.actions=t?Vt(t):null,i.dir=this.dir,i.dropCount=this.dropCount,i.filtered=this.filtered,i.iteratees=e?Vt(e):null,i.takeCount=this.takeCount,i.views=n?Vt(n):null,i}function w(){if(this.filtered){var t=new r(this);t.dir=-1,t.filtered=!0}else t=this.clone(),t.dir*=-1;return t}function J(){var t=this.wrapped.value();if(!ja(t))return qe(t,this.actions);var e=this.dir,n=0>e,r=vn(0,t.length,this.views),i=r.start,o=r.end,a=o-i,s=this.dropCount,h=va(a,this.takeCount-s),u=n?o:i-1,l=this.iteratees,c=l?l.length:0,f=0,d=[];t:for(;a--&&h>f;){u+=e;for(var p=-1,g=t[u];++p<c;){var v=l[p],m=v.iteratee,y=m(g,u,t),w=v.type;if(w==j)g=y;else if(!y){if(w==N)continue t;break t}}s?s--:d[f++]=g}return d}function nt(){this.__data__={}}function it(t){return this.has(t)&&delete this.__data__[t]}function Ht(t){return"__proto__"==t?C:this.__data__[t]}function Zt(t){return"__proto__"!=t&&qo.call(this.__data__,t)}function Gt(t,e){return"__proto__"!=t&&(this.__data__[t]=e),this}function qt(t){var e=t?t.length:0;for(this.data={hash:fa(null),set:new oa};e--;)this.push(t[e])}function Yt(t,e){var n=t.data,r="string"==typeof e||_i(e)?n.set.has(e):n.hash[e];return r?0:-1}function Xt(t){var e=this.data;"string"==typeof t||_i(t)?e.set.add(t):e.hash[t]=!0}function Vt(t,e){var n=-1,r=t.length;for(e||(e=Bo(r));++n<r;)e[n]=t[n];return e}function $t(t,e){for(var n=-1,r=t.length;++n<r&&e(t[n],n,t)!==!1;);return t}function Qt(t,e){for(var n=t.length;n--&&e(t[n],n,t)!==!1;);return t}function te(t,e){for(var n=-1,r=t.length;++n<r;)if(!e(t[n],n,t))return!1;return!0}function ee(t,e){for(var n=-1,r=t.length,i=-1,o=[];++n<r;){var a=t[n];e(a,n,t)&&(o[++i]=a)}return o}function ne(t,e){for(var n=-1,r=t.length,i=Bo(r);++n<r;)i[n]=e(t[n],n,t);return i}function re(t){for(var e=-1,n=t.length,r=ba;++e<n;){var i=t[e];i>r&&(r=i)}return r}function ie(t){for(var e=-1,n=t.length,r=xa;++e<n;){var i=t[e];r>i&&(r=i)}return r}function oe(t,e,n,r){var i=-1,o=t.length;for(r&&o&&(n=t[++i]);++i<o;)n=e(n,t[i],i,t);return n}function ae(t,e,n,r){var i=t.length;for(r&&i&&(n=t[--i]);i--;)n=e(n,t[i],i,t);return n}function se(t,e){for(var n=-1,r=t.length;++n<r;)if(e(t[n],n,t))return!0;return!1}function he(t,e){return"undefined"==typeof t?e:t}function ue(t,e,n,r){return"undefined"!=typeof t&&qo.call(r,n)?t:e}function le(t,e,n){var r=qa(e);if(!n)return fe(e,t,r);for(var i=-1,o=r.length;++i<o;){var a=r[i],s=t[a],h=n(s,e[a],a,t,e);(h===h?h===s:s!==s)&&("undefined"!=typeof s||a in t)||(t[a]=h)}return t}function ce(t,e){for(var n=-1,r=t.length,i=Sn(r),o=e.length,a=Bo(o);++n<o;){var s=e[n];i?(s=parseFloat(s),a[n]=bn(s,r)?t[s]:C):a[n]=t[s]}return a}function fe(t,e,n){n||(n=e,e={});for(var r=-1,i=n.length;++r<i;){var o=n[r];e[o]=t[o]}return e}function de(t,e){for(var n=-1,r=e.length;++n<r;){var i=e[n];t[i]=un(t[i],A,t)}return t}function pe(t,e,n){var r=typeof t;return"function"==r?"undefined"!=typeof e&&_n(t)?Xe(t,e,n):t:null==t?bo:"object"==r?De(t):Fe(t+"")}function ge(t,e,n,r,i,o,a){var s;if(n&&(s=i?n(t,r,i):n(t)),"undefined"!=typeof s)return s;if(!_i(t))return t;var h=ja(t);if(h){if(s=mn(t),!e)return Vt(t,s)}else{var u=Ko.call(t),l=u==$;if(u!=tt&&u!=q&&(!l||i))return Nt[u]?wn(t,u,e):i?t:{};if(s=yn(l?{}:t),!e)return fe(t,s,qa(t))}o||(o=[]),a||(a=[]);for(var c=o.length;c--;)if(o[c]==t)return a[c];return o.push(t),a.push(s),(h?$t:Ie)(t,function(r,i){s[i]=ge(r,e,n,i,t,o,a)}),s}function ve(t,e,n,r){if(!wi(t))throw new Wo(Z);return aa(function(){t.apply(C,je(n,r))},e)}function me(t,e){var n=t?t.length:0,r=[];if(!n)return r;var i=-1,o=gn(),s=o==a,h=s&&e.length>=200&&Ta(e),u=e.length;h&&(o=Yt,s=!1,e=h);t:for(;++i<n;){var l=t[i];if(s&&l===l){for(var c=u;c--;)if(e[c]===l)continue t;r.push(l)}else o(e,l)<0&&r.push(l)}return r}function ye(t,e){var n=t?t.length:0;if(!Sn(n))return Ie(t,e);for(var r=-1,i=Tn(t);++r<n&&e(i[r],r,i)!==!1;);return t}function we(t,e){var n=t?t.length:0;if(!Sn(n))return Ae(t,e);for(var r=Tn(t);n--&&e(r[n],n,r)!==!1;);return t}function _e(t,e){var n=!0;return ye(t,function(t,r,i){return n=!!e(t,r,i)}),n}function be(t,e){var n=[];return ye(t,function(t,r,i){e(t,r,i)&&n.push(t)}),n}function xe(t,e,n,r){var i;return n(t,function(t,n,o){return e(t,n,o)?(i=r?n:t,!1):void 0}),i}function Se(t,e,n,r){for(var i=(r||0)-1,o=t.length,a=-1,s=[];++i<o;){var h=t[i];if(y(h)&&Sn(h.length)&&(ja(h)||fi(h))){e&&(h=Se(h,e,n));var u=-1,l=h.length;for(s.length+=l;++u<l;)s[++a]=h[u]}else n||(s[++a]=h)}return s}function ke(t,e,n){for(var r=-1,i=Tn(t),o=n(t),a=o.length;++r<a;){var s=o[r];if(e(i[s],s,i)===!1)break}return t}function Ee(t,e,n){for(var r=Tn(t),i=n(t),o=i.length;o--;){var a=i[o];if(e(r[a],a,r)===!1)break}return t}function Ce(t,e){return ke(t,e,Hi)}function Ie(t,e){return ke(t,e,qa)}function Ae(t,e){return Ee(t,e,qa)}function Le(t,e){for(var n=-1,r=e.length,i=-1,o=[];++n<r;){var a=e[n];wi(t[a])&&(o[++i]=a)}return o}function Re(t,e,n){var r=-1,i="function"==typeof e,o=t?t.length:0,a=Sn(o)?Bo(o):[];return ye(t,function(t){
var o=i?e:null!=t&&t[e];a[++r]=o?o.apply(t,n):C}),a}function Be(t,e,n,r,i,o){if(t===e)return 0!==t||1/t==1/e;var a=typeof t,s=typeof e;return"function"!=a&&"object"!=a&&"function"!=s&&"object"!=s||null==t||null==e?t!==t&&e!==e:Te(t,e,Be,n,r,i,o)}function Te(t,e,n,r,i,o,a){var s=ja(t),h=ja(e),u=Y,l=Y;s||(u=Ko.call(t),u==q?u=tt:u!=tt&&(s=Ai(t))),h||(l=Ko.call(e),l==q?l=tt:l!=tt&&(h=Ai(e)));var c=u==tt,f=l==tt,d=u==l;if(d&&!s&&!c)return cn(t,e,u);var p=c&&qo.call(t,"__wrapped__"),g=f&&qo.call(e,"__wrapped__");if(p||g)return n(p?t.value():t,g?e.value():e,r,i,o,a);if(!d)return!1;o||(o=[]),a||(a=[]);for(var v=o.length;v--;)if(o[v]==t)return a[v]==e;o.push(t),a.push(e);var m=(s?ln:fn)(t,e,n,r,i,o,a);return o.pop(),a.pop(),m}function Me(t,e,n,r,i){var o=e.length;if(null==t)return!o;for(var a=-1,s=!i;++a<o;)if(s&&r[a]?n[a]!==t[e[a]]:!qo.call(t,e[a]))return!1;for(a=-1;++a<o;){var h=e[a];if(s&&r[a])var u=qo.call(t,h);else{var l=t[h],c=n[a];u=i?i(l,c,h):C,"undefined"==typeof u&&(u=Be(c,l,i,!0))}if(!u)return!1}return!0}function Oe(t,e){var n=[];return ye(t,function(t,r,i){n.push(e(t,r,i))}),n}function De(t){var e=qa(t),n=e.length;if(1==n){var r=e[0],i=t[r];if(kn(i))return function(t){return null!=t&&i===t[r]&&qo.call(t,r)}}for(var o=Bo(n),a=Bo(n);n--;)i=t[e[n]],o[n]=i,a[n]=kn(i);return function(t){return Me(t,e,o,a)}}function Ue(t,e,n,r,i){var o=Sn(e.length)&&(ja(e)||Ai(e));return(o?$t:Ie)(e,function(e,a,s){if(y(e))return r||(r=[]),i||(i=[]),Pe(t,s,a,Ue,n,r,i);var h=t[a],u=n?n(h,e,a,t,s):C,l="undefined"==typeof u;l&&(u=e),!o&&"undefined"==typeof u||!l&&(u===u?u===h:h!==h)||(t[a]=u)}),t}function Pe(t,e,n,r,i,o,a){for(var s=o.length,h=e[n];s--;)if(o[s]==h)return void(t[n]=a[s]);var u=t[n],l=i?i(u,h,n,t,e):C,c="undefined"==typeof l;c&&(l=h,Sn(h.length)&&(ja(h)||Ai(h))?l=ja(u)?u:u?Vt(u):[]:Za(h)||fi(h)?l=fi(u)?Bi(u):Za(u)?u:{}:c=!1),o.push(h),a.push(l),c?t[n]=r(l,h,i,o,a):(l===l?l!==u:u===u)&&(t[n]=l)}function Fe(t){return function(e){return null==e?C:e[t]}}function ze(t,e){var n=e.length,r=ce(t,e);for(e.sort(o);n--;){var i=parseFloat(e[n]);if(i!=a&&bn(i)){var a=i;sa.call(t,i,1)}}return r}function We(t,e){return t+ea(_a()*(e-t+1))}function Ne(t,e,n,r,i){return i(t,function(t,i,o){n=r?(r=!1,t):e(n,t,i,o)}),n}function je(t,e,n){var r=-1,i=t.length;e=null==e?0:+e||0,0>e&&(e=-e>i?0:i+e),n="undefined"==typeof n||n>i?i:+n||0,0>n&&(n+=i),i=e>n?0:n-e>>>0,e>>>=0;for(var o=Bo(i);++r<i;)o[r]=t[r+e];return o}function He(t,e){var n;return ye(t,function(t,r,i){return n=e(t,r,i),!n}),!!n}function Ze(t,e){var n=-1,r=gn(),i=t.length,o=r==a,s=o&&i>=200,h=s&&Ta(),u=[];h?(r=Yt,o=!1):(s=!1,h=e?[]:u);t:for(;++n<i;){var l=t[n],c=e?e(l,n,t):l;if(o&&l===l){for(var f=h.length;f--;)if(h[f]===c)continue t;e&&h.push(c),u.push(l)}else r(h,c)<0&&((e||s)&&h.push(c),u.push(l))}return u}function Ge(t,e){for(var n=-1,r=e.length,i=Bo(r);++n<r;)i[n]=t[e[n]];return i}function qe(t,e){var n=t;n instanceof r&&(n=n.value());for(var i=-1,o=e.length;++i<o;){var a=[n],s=e[i];ra.apply(a,s.args),n=s.func.apply(s.thisArg,a)}return n}function Ye(t,e,n){var r=0,i=t?t.length:r;if("number"==typeof e&&e===e&&Ea>=i){for(;i>r;){var o=r+i>>>1,a=t[o];(n?e>=a:e>a)?r=o+1:i=o}return i}return Ke(t,e,bo,n)}function Ke(t,e,n,r){e=n(e);for(var i=0,o=t?t.length:0,a=e!==e,s="undefined"==typeof e;o>i;){var h=ea((i+o)/2),u=n(t[h]),l=u===u;if(a)var c=l||r;else c=s?l&&(r||"undefined"!=typeof u):r?e>=u:e>u;c?i=h+1:o=h}return va(o,ka)}function Xe(t,e,n){if("function"!=typeof t)return bo;if("undefined"==typeof e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 3:return function(n,r,i){return t.call(e,n,r,i)};case 4:return function(n,r,i,o){return t.call(e,n,r,i,o)};case 5:return function(n,r,i,o,a){return t.call(e,n,r,i,o,a)}}return function(){return t.apply(e,arguments)}}function Ve(t){return Jo.call(t,0)}function $e(t,e,n){for(var r=n.length,i=-1,o=ga(t.length-r,0),a=-1,s=e.length,h=Bo(o+s);++a<s;)h[a]=e[a];for(;++i<r;)h[n[i]]=t[i];for(;o--;)h[a++]=t[i++];return h}function Je(t,e,n){for(var r=-1,i=n.length,o=-1,a=ga(t.length-i,0),s=-1,h=e.length,u=Bo(a+h);++o<a;)u[o]=t[o];for(var l=o;++s<h;)u[l+s]=e[s];for(;++r<i;)u[l+n[r]]=t[o++];return u}function Qe(t,e){return function(n,r,i){var o=e?e():{};if(r=pn(r,i,3),ja(n))for(var a=-1,s=n.length;++a<s;){var h=n[a];t(o,h,r(h,a,n),n)}else ye(n,function(e,n,i){t(o,e,r(e,n,i),i)});return o}}function tn(t){return function(){var e=arguments.length,n=arguments[0];if(2>e||null==n)return n;if(e>3&&xn(arguments[1],arguments[2],arguments[3])&&(e=2),e>3&&"function"==typeof arguments[e-2])var r=Xe(arguments[--e-1],arguments[e--],5);else e>2&&"function"==typeof arguments[e-1]&&(r=arguments[--e]);for(var i=0;++i<e;){var o=arguments[i];o&&t(n,o,r)}return n}}function en(t,e){function n(){return(this instanceof n?r:t).apply(e,arguments)}var r=rn(t);return n}function nn(t){return function(e){for(var n=-1,r=mo(to(e)),i=r.length,o="";++n<i;)o=t(o,r[n],n);return o}}function rn(t){return function(){var e=Ra(t.prototype),n=t.apply(e,arguments);return _i(n)?n:e}}function on(t,e){return function(n,r,i){i&&xn(n,r,i)&&(r=null);var o=pn(),a=null==r;if(o===pe&&a||(a=!1,r=o(r,i,3)),a){var s=ja(n);if(s||!Ii(n))return t(s?n:Bn(n));r=u}return dn(n,r,e)}}function an(t,e,n,r,i,o,a,s,h,u){function l(){for(var w=arguments.length,b=w,x=Bo(w);b--;)x[b]=arguments[b];if(r&&(x=$e(x,r,i)),o&&(x=Je(x,o,a)),p||v){var S=l.placeholder,k=_(x,S);if(w-=k.length,u>w){var E=s?Vt(s):null,C=ga(u-w,0),I=p?k:null,R=p?null:k,B=p?x:null,T=p?null:x;e|=p?M:O,e&=~(p?O:M),g||(e&=~(A|L));var D=an(t,e,n,B,I,T,R,E,h,C);return D.placeholder=S,D}}var U=f?n:this;return d&&(t=U[y]),s&&(x=An(x,s)),c&&h<x.length&&(x.length=h),(this instanceof l?m||rn(t):t).apply(U,x)}var c=e&U,f=e&A,d=e&L,p=e&B,g=e&R,v=e&T,m=!d&&rn(t),y=t;return l}function sn(t,e,n){var r=t.length;if(e=+e,r>=e||!da(e))return"";var i=e-r;return n=null==n?" ":n+"",ho(n,Qo(i/n.length)).slice(0,i)}function hn(t,e,n,r){function i(){for(var e=-1,s=arguments.length,h=-1,u=r.length,l=Bo(s+u);++h<u;)l[h]=r[h];for(;s--;)l[h++]=arguments[++e];return(this instanceof i?a:t).apply(o?n:this,l)}var o=e&A,a=rn(t);return i}function un(t,e,n,r,i,o,a,s){var h=e&L;if(!h&&!wi(t))throw new Wo(Z);var u=r?r.length:0;if(u||(e&=~(M|O),r=i=null),u-=i?i.length:0,e&O){var l=r,c=i;r=i=null}var f=!h&&Ma(t),d=[t,e,n,r,i,l,c,o,a,s];if(f&&f!==!0&&(En(d,f),e=d[1],s=d[9]),d[9]=null==s?h?0:t.length:ga(s-u,0)||0,e==A)var p=en(d[0],d[2]);else p=e!=M&&e!=(A|M)||d[4].length?an.apply(null,d):hn.apply(null,d);var g=f?Ba:Oa;return g(p,d)}function ln(t,e,n,r,i,o,a){var s=-1,h=t.length,u=e.length,l=!0;if(h!=u&&!(i&&u>h))return!1;for(;l&&++s<h;){var c=t[s],f=e[s];if(l=C,r&&(l=i?r(f,c,s):r(c,f,s)),"undefined"==typeof l)if(i)for(var d=u;d--&&(f=e[d],!(l=c&&c===f||n(c,f,r,i,o,a))););else l=c&&c===f||n(c,f,r,i,o,a)}return!!l}function cn(t,e,n){switch(n){case K:case X:return+t==+e;case V:return t.name==e.name&&t.message==e.message;case Q:return t!=+t?e!=+e:0==t?1/t==1/e:t==+e;case et:case rt:return t==e+""}return!1}function fn(t,e,n,r,i,o,a){var s=qa(t),h=s.length,u=qa(e),l=u.length;if(h!=l&&!i)return!1;for(var c,f=-1;++f<h;){var d=s[f],p=qo.call(e,d);if(p){var g=t[d],v=e[d];p=C,r&&(p=i?r(v,g,d):r(g,v,d)),"undefined"==typeof p&&(p=g&&g===v||n(g,v,r,i,o,a))}if(!p)return!1;c||(c="constructor"==d)}if(!c){var m=t.constructor,y=e.constructor;if(m!=y&&"constructor"in t&&"constructor"in e&&!("function"==typeof m&&m instanceof m&&"function"==typeof y&&y instanceof y))return!1}return!0}function dn(t,e,n){var r=n?xa:ba,i=r,o=i;return ye(t,function(t,a,s){var h=e(t,a,s);((n?i>h:h>i)||h===r&&h===o)&&(i=h,o=t)}),o}function pn(t,n,r){var i=e.callback||wo;return i=i===wo?pe:i,r?i(t,n,r):i}function gn(t,n,r){var i=e.indexOf||Gn;return i=i===Gn?a:i,t?i(t,n,r):i}function vn(t,e,n){for(var r=-1,i=n?n.length:0;++r<i;){var o=n[r],a=o.size;switch(o.type){case"drop":t+=a;break;case"dropRight":e-=a;break;case"take":e=va(e,t+a);break;case"takeRight":t=ga(t,e-a)}}return{start:t,end:e}}function mn(t){var e=t.length,n=new t.constructor(e);return e&&"string"==typeof t[0]&&qo.call(t,"index")&&(n.index=t.index,n.input=t.input),n}function yn(t){var e=t.constructor;return"function"==typeof e&&e instanceof e||(e=Po),new e}function wn(t,e,n){var r=t.constructor;switch(e){case ot:return Ve(t);case K:case X:return new r(+t);case at:case st:case ht:case ut:case lt:case ct:case ft:case dt:case pt:var i=t.buffer;return new r(n?Ve(i):i,t.byteOffset,t.length);case Q:case rt:return new r(t);case et:var o=new r(t.source,Ct.exec(t));o.lastIndex=t.lastIndex}return o}function _n(t){var n=e.support,r=!(n.funcNames?t.name:n.funcDecomp);if(!r){var i=Zo.call(t);n.funcNames||(r=!It.test(i)),r||(r=Ot.test(i)||Si(t),Ba(t,r))}return r}function bn(t,e){return t=+t,e=null==e?Ia:e,t>-1&&t%1==0&&e>t}function xn(t,e,n){if(!_i(n))return!1;var r=typeof e;if("number"==r)var i=n.length,o=Sn(i)&&bn(e,i);else o="string"==r&&e in n;return o&&n[e]===t}function Sn(t){return"number"==typeof t&&t>-1&&t%1==0&&Ia>=t}function kn(t){return t===t&&(0===t?1/t>0:!_i(t))}function En(t,e){var n=t[1],r=e[1],i=n|r,o=U|D,a=A|L,s=o|a|R|T,h=n&U&&!(r&U),u=n&D&&!(r&D),l=(u?t:e)[7],c=(h?t:e)[8],f=!(n>=D&&r>a||n>a&&r>=D),d=i>=o&&s>=i&&(D>n||(u||h)&&l.length<=c);if(!f&&!d)return t;r&A&&(t[2]=e[2],i|=n&A?0:R);var p=e[3];if(p){var g=t[3];t[3]=g?$e(g,p,e[4]):Vt(p),t[4]=g?_(t[3],G):Vt(e[4])}return p=e[5],p&&(g=t[5],t[5]=g?Je(g,p,e[6]):Vt(p),t[6]=g?_(t[5],G):Vt(e[6])),p=e[7],p&&(t[7]=Vt(p)),r&U&&(t[8]=null==t[8]?e[8]:va(t[8],e[8])),null==t[9]&&(t[9]=e[9]),t[0]=e[0],t[1]=i,t}function Cn(t,e){t=Tn(t);for(var n=-1,r=e.length,i={};++n<r;){var o=e[n];o in t&&(i[o]=t[o])}return i}function In(t,e){var n={};return Ce(t,function(t,r,i){e(t,r,i)&&(n[r]=t)}),n}function An(t,e){for(var n=t.length,r=va(e.length,n),i=Vt(t);r--;){var o=e[r];t[r]=bn(o,n)?i[o]:C}return t}function Ln(t){{var n;e.support}if(!y(t)||Ko.call(t)!=tt||!qo.call(t,"constructor")&&(n=t.constructor,"function"==typeof n&&!(n instanceof n)))return!1;var r;return Ce(t,function(t,e){r=e}),"undefined"==typeof r||qo.call(t,r)}function Rn(t){for(var n=Hi(t),r=n.length,i=r&&t.length,o=e.support,a=i&&Sn(i)&&(ja(t)||o.nonEnumArgs&&fi(t)),s=-1,h=[];++s<r;){var u=n[s];(a&&bn(u,i)||qo.call(t,u))&&h.push(u)}return h}function Bn(t){return null==t?[]:Sn(t.length)?_i(t)?t:Po(t):Vi(t)}function Tn(t){return _i(t)?t:Po(t)}function Mn(t,e,n){e=(n?xn(t,e,n):null==e)?1:ga(+e||1,1);for(var r=0,i=t?t.length:0,o=-1,a=Bo(Qo(i/e));i>r;)a[++o]=je(t,r,r+=e);return a}function On(t){for(var e=-1,n=t?t.length:0,r=-1,i=[];++e<n;){var o=t[e];o&&(i[++r]=o)}return i}function Dn(){for(var t=-1,e=arguments.length;++t<e;){var n=arguments[t];if(ja(n)||fi(n))break}return me(n,Se(arguments,!1,!0,++t))}function Un(t,e,n){var r=t?t.length:0;return r?((n?xn(t,e,n):null==e)&&(e=1),je(t,0>e?0:e)):[]}function Pn(t,e,n){var r=t?t.length:0;return r?((n?xn(t,e,n):null==e)&&(e=1),e=r-(+e||0),je(t,0,0>e?0:e)):[]}function Fn(t,e,n){var r=t?t.length:0;if(!r)return[];for(e=pn(e,n,3);r--&&e(t[r],r,t););return je(t,0,r+1)}function zn(t,e,n){var r=t?t.length:0;if(!r)return[];var i=-1;for(e=pn(e,n,3);++i<r&&e(t[i],i,t););return je(t,i)}function Wn(t,e,n){var r=-1,i=t?t.length:0;for(e=pn(e,n,3);++r<i;)if(e(t[r],r,t))return r;return-1}function Nn(t,e,n){var r=t?t.length:0;for(e=pn(e,n,3);r--;)if(e(t[r],r,t))return r;return-1}function jn(t){return t?t[0]:C}function Hn(t,e,n){var r=t?t.length:0;return n&&xn(t,e,n)&&(e=!1),r?Se(t,e):[]}function Zn(t){var e=t?t.length:0;return e?Se(t,!0):[]}function Gn(t,e,n){var r=t?t.length:0;if(!r)return-1;if("number"==typeof n)n=0>n?ga(r+n,0):n||0;else if(n){var i=Ye(t,e),o=t[i];return(e===e?e===o:o!==o)?i:-1}return a(t,e,n)}function qn(t){return Pn(t,1)}function Yn(){for(var t=[],e=-1,n=arguments.length,r=[],i=gn(),o=i==a;++e<n;){var s=arguments[e];(ja(s)||fi(s))&&(t.push(s),r.push(o&&s.length>=120&&Ta(e&&s)))}n=t.length;var h=t[0],u=-1,l=h?h.length:0,c=[],f=r[0];t:for(;++u<l;)if(s=h[u],(f?Yt(f,s):i(c,s))<0){for(e=n;--e;){var d=r[e];if((d?Yt(d,s):i(t[e],s))<0)continue t}f&&f.push(s),c.push(s)}return c}function Kn(t){var e=t?t.length:0;return e?t[e-1]:C}function Xn(t,e,n){var r=t?t.length:0;if(!r)return-1;var i=r;if("number"==typeof n)i=(0>n?ga(r+n,0):va(n||0,r-1))+1;else if(n){i=Ye(t,e,!0)-1;var o=t[i];return(e===e?e===o:o!==o)?i:-1}if(e!==e)return m(t,i,!0);for(;i--;)if(t[i]===e)return i;return-1}function Vn(){var t=arguments[0];if(!t||!t.length)return t;for(var e=0,n=gn(),r=arguments.length;++e<r;)for(var i=0,o=arguments[e];(i=n(t,o,i))>-1;)sa.call(t,i,1);return t}function $n(t){return ze(t||[],Se(arguments,!1,!1,1))}function Jn(t,e,n){var r=-1,i=t?t.length:0,o=[];for(e=pn(e,n,3);++r<i;){var a=t[r];e(a,r,t)&&(o.push(a),sa.call(t,r--,1),i--)}return o}function Qn(t){return Un(t,1)}function tr(t,e,n){var r=t?t.length:0;return r?(n&&"number"!=typeof n&&xn(t,e,n)&&(e=0,n=r),je(t,e,n)):[]}function er(t,e,n,r){var i=pn(n);return i===pe&&null==n?Ye(t,e):Ke(t,e,i(n,r,1))}function nr(t,e,n,r){var i=pn(n);return i===pe&&null==n?Ye(t,e,!0):Ke(t,e,i(n,r,1),!0)}function rr(t,e,n){var r=t?t.length:0;return r?((n?xn(t,e,n):null==e)&&(e=1),je(t,0,0>e?0:e)):[]}function ir(t,e,n){var r=t?t.length:0;return r?((n?xn(t,e,n):null==e)&&(e=1),e=r-(+e||0),je(t,0>e?0:e)):[]}function or(t,e,n){var r=t?t.length:0;if(!r)return[];for(e=pn(e,n,3);r--&&e(t[r],r,t););return je(t,r+1)}function ar(t,e,n){var r=t?t.length:0;if(!r)return[];var i=-1;for(e=pn(e,n,3);++i<r&&e(t[i],i,t););return je(t,0,i)}function sr(){return Ze(Se(arguments,!1,!0))}function hr(t,e,n,r){var i=t?t.length:0;if(!i)return[];"boolean"!=typeof e&&null!=e&&(r=n,n=xn(t,e,r)?null:e,e=!1);var o=pn();return(o!==pe||null!=n)&&(n=o(n,r,3)),e&&gn()==a?b(t,n):Ze(t,n)}function ur(t){for(var e=-1,n=(t&&t.length&&re(ne(t,Go)))>>>0,r=Bo(n);++e<n;)r[e]=ne(t,Fe(e));return r}function lr(t){return me(t,je(arguments,1))}function cr(){for(var t=-1,e=arguments.length;++t<e;){var n=arguments[t];if(ja(n)||fi(n))var r=r?me(r,n).concat(me(n,r)):n}return r?Ze(r):[]}function fr(){for(var t=arguments.length,e=Bo(t);t--;)e[t]=arguments[t];return ur(e)}function dr(t,e){var n=-1,r=t?t.length:0,i={};for(!r||e||ja(t[0])||(e=[]);++n<r;){var o=t[n];e?i[o]=e[n]:o&&(i[o[0]]=o[1])}return i}function pr(t){var n=e(t);return n.__chain__=!0,n}function gr(t,e,n){return e.call(n,t),t}function vr(t,e,n){return e.call(n,t)}function mr(){return pr(this)}function yr(){var t=this.__wrapped__;return t instanceof r?(this.__actions__.length&&(t=new r(this)),new n(t.reverse())):this.thru(function(t){return t.reverse()})}function wr(){return this.value()+""}function _r(){return qe(this.__wrapped__,this.__actions__)}function br(t){var e=t?t.length:0;return Sn(e)&&(t=Bn(t)),ce(t,Se(arguments,!1,!1,1))}function xr(t,e,n){var r=t?t.length:0;return Sn(r)||(t=Vi(t),r=t.length),r?(n="number"==typeof n?0>n?ga(r+n,0):n||0:0,"string"==typeof t||!ja(t)&&Ii(t)?r>n&&t.indexOf(e,n)>-1:gn(t,e,n)>-1):!1}function Sr(t,e,n){var r=ja(t)?te:_e;return("function"!=typeof e||"undefined"!=typeof n)&&(e=pn(e,n,3)),r(t,e)}function kr(t,e,n){var r=ja(t)?ee:be;return e=pn(e,n,3),r(t,e)}function Er(t,e,n){if(ja(t)){var r=Wn(t,e,n);return r>-1?t[r]:C}return e=pn(e,n,3),xe(t,e,ye)}function Cr(t,e,n){return e=pn(e,n,3),xe(t,e,we)}function Ir(t,e){return Er(t,De(e))}function Ar(t,e,n){return"function"==typeof e&&"undefined"==typeof n&&ja(t)?$t(t,e):ye(t,Xe(e,n,3))}function Lr(t,e,n){return"function"==typeof e&&"undefined"==typeof n&&ja(t)?Qt(t,e):we(t,Xe(e,n,3))}function Rr(t,e){return Re(t,e,je(arguments,2))}function Br(t,e,n){var r=ja(t)?ne:Oe;return e=pn(e,n,3),r(t,e)}function Tr(t,e){return Br(t,Fe(e+""))}function Mr(t,e,n,r){var i=ja(t)?oe:Ne;return i(t,pn(e,r,4),n,arguments.length<3,ye)}function Or(t,e,n,r){var i=ja(t)?ae:Ne;return i(t,pn(e,r,4),n,arguments.length<3,we)}function Dr(t,e,n){var r=ja(t)?ee:be;return e=pn(e,n,3),r(t,function(t,n,r){return!e(t,n,r)})}function Ur(t,e,n){if(n?xn(t,e,n):null==e){t=Bn(t);var r=t.length;return r>0?t[We(0,r-1)]:C}var i=Pr(t);return i.length=va(0>e?0:+e||0,i.length),i}function Pr(t){t=Bn(t);for(var e=-1,n=t.length,r=Bo(n);++e<n;){var i=We(0,e);e!=i&&(r[e]=r[i]),r[i]=t[e]}return r}function Fr(t){var e=t?t.length:0;return Sn(e)?e:qa(t).length}function zr(t,e,n){var r=ja(t)?se:He;return("function"!=typeof e||"undefined"!=typeof n)&&(e=pn(e,n,3)),r(t,e)}function Wr(t,e,n){var r=-1,i=t?t.length:0,o=Sn(i)?Bo(i):[];return n&&xn(t,e,n)&&(e=null),e=pn(e,n,3),ye(t,function(t,n,i){o[++r]={criteria:e(t,n,i),index:r,value:t}}),s(o,f)}function Nr(t){var e=arguments;e.length>3&&xn(e[1],e[2],e[3])&&(e=[t,e[1]]);var n=-1,r=t?t.length:0,i=Se(e,!1,!1,1),o=Sn(r)?Bo(r):[];return ye(t,function(t,e,r){for(var a=i.length,s=Bo(a);a--;)s[a]=null==t?C:t[i[a]];o[++n]={criteria:s,index:n,value:t}}),s(o,d)}function jr(t,e){return kr(t,De(e))}function Hr(t,e){if(!wi(e)){if(!wi(t))throw new Wo(Z);var n=t;t=e,e=n}return t=da(t=+t)?t:0,function(){return--t<1?e.apply(this,arguments):void 0}}function Zr(t,e,n){return n&&xn(t,e,n)&&(e=null),e=t&&null==e?t.length:ga(+e||0,0),un(t,U,null,null,null,null,e)}function Gr(t,e){var n;if(!wi(e)){if(!wi(t))throw new Wo(Z);var r=t;t=e,e=r}return function(){return--t>0?n=e.apply(this,arguments):e=null,n}}function qr(t,e){var n=A;if(arguments.length>2){var r=je(arguments,2),i=_(r,qr.placeholder);n|=M}return un(t,n,e,r,i)}function Yr(t){return de(t,arguments.length>1?Se(arguments,!1,!1,1):Wi(t))}function Kr(t,e){var n=A|L;if(arguments.length>2){var r=je(arguments,2),i=_(r,Kr.placeholder);n|=M}return un(e,n,t,r,i)}function Xr(t,e,n){n&&xn(t,e,n)&&(e=null);var r=un(t,B,null,null,null,null,null,e);return r.placeholder=Xr.placeholder,r}function Vr(t,e,n){n&&xn(t,e,n)&&(e=null);var r=un(t,T,null,null,null,null,null,e);return r.placeholder=Vr.placeholder,r}function $r(t,e,n){function r(){f&&ta(f),h&&ta(h),h=f=d=C}function i(){var n=e-(Na()-l);if(0>=n||n>e){h&&ta(h);var r=d;h=f=d=C,r&&(p=Na(),u=t.apply(c,s),f||h||(s=c=null))}else f=aa(i,n)}function o(){f&&ta(f),h=f=d=C,(v||g!==e)&&(p=Na(),u=t.apply(c,s),f||h||(s=c=null))}function a(){if(s=arguments,l=Na(),c=this,d=v&&(f||!m),g===!1)var n=m&&!f;else{h||m||(p=l);var r=g-(l-p),a=0>=r||r>g;a?(h&&(h=ta(h)),p=l,u=t.apply(c,s)):h||(h=aa(o,r))}return a&&f?f=ta(f):f||e===g||(f=aa(i,e)),n&&(a=!0,u=t.apply(c,s)),!a||f||h||(s=c=null),u}var s,h,u,l,c,f,d,p=0,g=!1,v=!0;if(!wi(t))throw new Wo(Z);if(e=0>e?0:e,n===!0){var m=!0;v=!1}else _i(n)&&(m=n.leading,g="maxWait"in n&&ga(+n.maxWait||0,e),v="trailing"in n?n.trailing:v);return a.cancel=r,a}function Jr(t){return ve(t,1,arguments,1)}function Qr(t,e){return ve(t,e,arguments,2)}function ti(){var t=arguments,e=t.length;if(!e)return function(){};if(!te(t,wi))throw new Wo(Z);return function(){for(var n=0,r=t[n].apply(this,arguments);++n<e;)r=t[n].call(this,r);return r}}function ei(){var t=arguments,e=t.length-1;if(0>e)return function(){};if(!te(t,wi))throw new Wo(Z);return function(){for(var n=e,r=t[n].apply(this,arguments);n--;)r=t[n].call(this,r);return r}}function ni(t,e){if(!wi(t)||e&&!wi(e))throw new Wo(Z);var n=function(){var r=n.cache,i=e?e.apply(this,arguments):arguments[0];if(r.has(i))return r.get(i);var o=t.apply(this,arguments);return r.set(i,o),o};return n.cache=new ni.Cache,n}function ri(t){if(!wi(t))throw new Wo(Z);return function(){return!t.apply(this,arguments)}}function ii(t){return Gr(t,2)}function oi(t){var e=je(arguments,1),n=_(e,oi.placeholder);return un(t,M,null,e,n)}function ai(t){var e=je(arguments,1),n=_(e,ai.placeholder);return un(t,O,null,e,n)}function si(t){var e=Se(arguments,!1,!1,1);return un(t,D,null,null,null,e)}function hi(t,e,n){var r=!0,i=!0;if(!wi(t))throw new Wo(Z);return n===!1?r=!1:_i(n)&&(r="leading"in n?!!n.leading:r,i="trailing"in n?!!n.trailing:i),jt.leading=r,jt.maxWait=+e,jt.trailing=i,$r(t,e,jt)}function ui(t,e){return e=null==e?bo:e,un(e,M,null,[t],[])}function li(t,e,n,r){return"boolean"!=typeof e&&null!=e&&(r=n,n=xn(t,e,r)?null:e,e=!1),n="function"==typeof n&&Xe(n,r,1),ge(t,e,n)}function ci(t,e,n){return e="function"==typeof e&&Xe(e,n,1),ge(t,!0,e)}function fi(t){var e=y(t)?t.length:C;return Sn(e)&&Ko.call(t)==q||!1}function di(t){return t===!0||t===!1||y(t)&&Ko.call(t)==K||!1}function pi(t){return y(t)&&Ko.call(t)==X||!1}function gi(t){return t&&1===t.nodeType&&y(t)&&Ko.call(t).indexOf("Element")>-1||!1}function vi(t){if(null==t)return!0;var e=t.length;return Sn(e)&&(ja(t)||Ii(t)||fi(t)||y(t)&&wi(t.splice))?!e:!qa(t).length}function mi(t,e,n,r){if(n="function"==typeof n&&Xe(n,r,3),!n&&kn(t)&&kn(e))return t===e;var i=n?n(t,e):C;return"undefined"==typeof i?Be(t,e,n):!!i}function yi(t){return y(t)&&"string"==typeof t.message&&Ko.call(t)==V||!1}function wi(t){return"function"==typeof t||!1}function _i(t){var e=typeof t;return"function"==e||t&&"object"==e||!1}function bi(t,e,n,r){var i=qa(e),o=i.length;if(n="function"==typeof n&&Xe(n,r,3),!n&&1==o){var a=i[0],s=e[a];if(kn(s))return null!=t&&s===t[a]&&qo.call(t,a)}for(var h=Bo(o),u=Bo(o);o--;)s=h[o]=e[i[o]],u[o]=kn(s);return Me(t,i,h,u,n)}function xi(t){return Ei(t)&&t!=+t}function Si(t){return null==t?!1:Ko.call(t)==$?Vo.test(Zo.call(t)):y(t)&&Lt.test(t)||!1}function ki(t){return null===t}function Ei(t){return"number"==typeof t||y(t)&&Ko.call(t)==Q||!1}function Ci(t){return y(t)&&Ko.call(t)==et||!1}function Ii(t){return"string"==typeof t||y(t)&&Ko.call(t)==rt||!1}function Ai(t){return y(t)&&Sn(t.length)&&Wt[Ko.call(t)]||!1}function Li(t){return"undefined"==typeof t}function Ri(t){var e=t?t.length:0;return Sn(e)?e?Vt(t):[]:Vi(t)}function Bi(t){return fe(t,Hi(t))}function Ti(t,e,n){var r=Ra(t);return n&&xn(t,e,n)&&(e=null),e?fe(e,r,qa(e)):r}function Mi(t){if(null==t)return t;var e=Vt(arguments);return e.push(he),Ga.apply(C,e)}function Oi(t,e,n){return e=pn(e,n,3),xe(t,e,Ie,!0)}function Di(t,e,n){return e=pn(e,n,3),xe(t,e,Ae,!0)}function Ui(t,e,n){return("function"!=typeof e||"undefined"!=typeof n)&&(e=Xe(e,n,3)),ke(t,e,Hi)}function Pi(t,e,n){return e=Xe(e,n,3),Ee(t,e,Hi)}function Fi(t,e,n){return("function"!=typeof e||"undefined"!=typeof n)&&(e=Xe(e,n,3)),Ie(t,e)}function zi(t,e,n){return e=Xe(e,n,3),Ee(t,e,qa)}function Wi(t){return Le(t,Hi(t))}function Ni(t,e){return t?qo.call(t,e):!1}function ji(t,e,n){n&&xn(t,e,n)&&(e=null);for(var r=-1,i=qa(t),o=i.length,a={};++r<o;){var s=i[r],h=t[s];e?qo.call(a,h)?a[h].push(s):a[h]=[s]:a[h]=s}return a}function Hi(t){if(null==t)return[];_i(t)||(t=Po(t));var e=t.length;e=e&&Sn(e)&&(ja(t)||La.nonEnumArgs&&fi(t))&&e||0;for(var n=t.constructor,r=-1,i="function"==typeof n&&n.prototype==t,o=Bo(e),a=e>0;++r<e;)o[r]=r+"";for(var s in t)a&&bn(s,e)||"constructor"==s&&(i||!qo.call(t,s))||o.push(s);return o}function Zi(t,e,n){var r={};return e=pn(e,n,3),Ie(t,function(t,n,i){r[n]=e(t,n,i)}),r}function Gi(t,e,n){if(null==t)return{};if("function"!=typeof e){var r=ne(Se(arguments,!1,!1,1),zo);return Cn(t,me(Hi(t),r))}return e=Xe(e,n,3),In(t,function(t,n,r){return!e(t,n,r)})}function qi(t){for(var e=-1,n=qa(t),r=n.length,i=Bo(r);++e<r;){var o=n[e];i[e]=[o,t[o]]}return i}function Yi(t,e,n){return null==t?{}:"function"==typeof e?In(t,Xe(e,n,3)):Cn(t,Se(arguments,!1,!1,1))}function Ki(t,e,n){var r=null==t?C:t[e];return"undefined"==typeof r&&(r=n),wi(r)?r.call(t):r}function Xi(t,e,n,r){var i=ja(t)||Ai(t);if(e=pn(e,r,4),null==n)if(i||_i(t)){var o=t.constructor;n=i?ja(t)?new o:[]:Ra("function"==typeof o&&o.prototype)}else n={};return(i?$t:Ie)(t,function(t,r,i){return e(n,t,r,i)}),n}function Vi(t){return Ge(t,qa(t))}function $i(t){return Ge(t,Hi(t))}function Ji(t,e,n){n&&xn(t,e,n)&&(e=n=null);var r=null==t,i=null==e;if(null==n&&(i&&"boolean"==typeof t?(n=t,t=1):"boolean"==typeof e&&(n=e,i=!0)),r&&i&&(e=1,i=!1),t=+t||0,i?(e=t,t=0):e=+e||0,n||t%1||e%1){var o=_a();return va(t+o*(e-t+parseFloat("1e-"+((o+"").length-1))),e)}return We(t,e)}function Qi(t){return t=h(t),t&&t.charAt(0).toUpperCase()+t.slice(1)}function to(t){return t=h(t),t&&t.replace(Rt,p)}function eo(t,e,n){t=h(t),e+="";var r=t.length;return n=("undefined"==typeof n?r:va(0>n?0:+n||0,r))-e.length,n>=0&&t.indexOf(e,n)==n}function no(t){return t=h(t),t&&bt.test(t)?t.replace(wt,g):t}function ro(t){return t=h(t),t&&Mt.test(t)?t.replace(Tt,"\\$&"):t}function io(t,e,n){t=h(t),e=+e;var r=t.length;if(r>=e||!da(e))return t;var i=(e-r)/2,o=ea(i),a=Qo(i);return n=sn("",a,n),n.slice(0,o)+t+n}function oo(t,e,n){return t=h(t),t&&sn(t,e,n)+t}function ao(t,e,n){return t=h(t),t&&t+sn(t,e,n)}function so(t,e,n){return n&&xn(t,e,n)&&(e=0),wa(t,e)}function ho(t,e){var n="";if(t=h(t),e=+e,1>e||!t||!da(e))return n;do e%2&&(n+=t),e=ea(e/2),t+=t;while(e);return n}function uo(t,e,n){return t=h(t),n=null==n?0:va(0>n?0:+n||0,t.length),t.lastIndexOf(e,n)==n}function lo(t,n,r){var i=e.templateSettings;r&&xn(t,n,r)&&(n=r=null),t=h(t),n=le(le({},r||n),i,ue);var o,a,s=le(le({},n.imports),i.imports,ue),u=qa(s),l=Ge(s,u),c=0,f=n.interpolate||Bt,d="__p += '",p=Fo((n.escape||Bt).source+"|"+f.source+"|"+(f===kt?Et:Bt).source+"|"+(n.evaluate||Bt).source+"|$","g"),g="//# sourceURL="+("sourceURL"in n?n.sourceURL:"lodash.templateSources["+ ++zt+"]")+"\n";t.replace(p,function(e,n,r,i,s,h){return r||(r=i),d+=t.slice(c,h).replace(Dt,v),n&&(o=!0,d+="' +\n__e("+n+") +\n'"),s&&(a=!0,d+="';\n"+s+";\n__p += '"),r&&(d+="' +\n((__t = ("+r+")) == null ? '' : __t) +\n'"),c=h+e.length,e}),d+="';\n";var m=n.variable;m||(d="with (obj) {\n"+d+"\n}\n"),d=(a?d.replace(gt,""):d).replace(vt,"$1").replace(mt,"$1;"),d="function("+(m||"obj")+") {\n"+(m?"":"obj || (obj = {});\n")+"var __t, __p = ''"+(o?", __e = _.escape":"")+(a?", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n":";\n")+d+"return __p\n}";var y=yo(function(){return Oo(u,g+"return "+d).apply(C,l)});if(y.source=d,yi(y))throw y;return y}function co(t,e,n){var r=t;return(t=h(t))?(n?xn(r,e,n):null==e)?t.slice(x(t),S(t)+1):(e+="",t.slice(l(t,e),c(t,e)+1)):t}function fo(t,e,n){var r=t;return t=h(t),t?t.slice((n?xn(r,e,n):null==e)?x(t):l(t,e+"")):t}function po(t,e,n){var r=t;return t=h(t),t?(n?xn(r,e,n):null==e)?t.slice(0,S(t)+1):t.slice(0,c(t,e+"")+1):t}function go(t,e,n){n&&xn(t,e,n)&&(e=null);var r=P,i=F;if(null!=e)if(_i(e)){var o="separator"in e?e.separator:o;r="length"in e?+e.length||0:r,i="omission"in e?h(e.omission):i}else r=+e||0;if(t=h(t),r>=t.length)return t;var a=r-i.length;if(1>a)return i;var s=t.slice(0,a);if(null==o)return s+i;if(Ci(o)){if(t.slice(a).search(o)){var u,l,c=t.slice(0,a);for(o.global||(o=Fo(o.source,(Ct.exec(o)||"")+"g")),o.lastIndex=0;u=o.exec(c);)l=u.index;s=s.slice(0,null==l?a:l)}}else if(t.indexOf(o,a)!=a){var f=s.lastIndexOf(o);f>-1&&(s=s.slice(0,f))}return s+i}function vo(t){return t=h(t),t&&_t.test(t)?t.replace(yt,k):t}function mo(t,e,n){return n&&xn(t,e,n)&&(e=null),t=h(t),t.match(e||Ut)||[]}function yo(t){try{return t()}catch(e){return yi(e)?e:Mo(e)}}function wo(t,e,n){return n&&xn(t,e,n)&&(e=null),y(t)?xo(t):pe(t,e)}function _o(t){return function(){return t}}function bo(t){return t}function xo(t){return De(ge(t,!0))}function So(t,e,n){if(null==n){var r=_i(e),i=r&&qa(e),o=i&&i.length&&Le(e,i);(o?o.length:r)||(o=!1,n=e,e=t,t=this)}o||(o=Le(e,qa(e)));var a=!0,s=-1,h=wi(t),u=o.length;n===!1?a=!1:_i(n)&&"chain"in n&&(a=n.chain);for(;++s<u;){var l=o[s],c=e[l];t[l]=c,h&&(t.prototype[l]=function(e){return function(){var n=this.__chain__;if(a||n){var r=t(this.__wrapped__);return(r.__actions__=Vt(this.__actions__)).push({func:e,args:arguments,thisArg:t}),r.__chain__=n,r}var i=[this.value()];return ra.apply(i,arguments),e.apply(t,i)}}(c))}return t}function ko(){return t._=Xo,this}function Eo(){}function Co(t){return Fe(t+"")}function Io(t){return function(e){return null==t?C:t[e]}}function Ao(t,e,n){n&&xn(t,e,n)&&(e=n=null),t=+t||0,n=null==n?1:+n||0,null==e?(e=t,t=0):e=+e||0;for(var r=-1,i=ga(Qo((e-t)/(n||1)),0),o=Bo(i);++r<i;)o[r]=t,t+=n;return o}function Lo(t,e,n){if(t=+t,1>t||!da(t))return[];var r=-1,i=Bo(va(t,Sa));for(e=Xe(e,n,1);++r<t;)Sa>r?i[r]=e(r):e(r);return i}function Ro(t){var e=++Yo;return h(t)+e}t=t?Jt.defaults(Kt.Object(),t,Jt.pick(Kt,Ft)):Kt;var Bo=t.Array,To=t.Date,Mo=t.Error,Oo=t.Function,Do=t.Math,Uo=t.Number,Po=t.Object,Fo=t.RegExp,zo=t.String,Wo=t.TypeError,No=Bo.prototype,jo=Po.prototype,Ho=(Ho=t.window)&&Ho.document,Zo=Oo.prototype.toString,Go=Fe("length"),qo=jo.hasOwnProperty,Yo=0,Ko=jo.toString,Xo=t._,Vo=Fo("^"+ro(Ko).replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),$o=Si($o=t.ArrayBuffer)&&$o,Jo=Si(Jo=$o&&new $o(0).slice)&&Jo,Qo=Do.ceil,ta=t.clearTimeout,ea=Do.floor,na=Si(na=Po.getPrototypeOf)&&na,ra=No.push,ia=jo.propertyIsEnumerable,oa=Si(oa=t.Set)&&oa,aa=t.setTimeout,sa=No.splice,ha=Si(ha=t.Uint8Array)&&ha,ua=(No.unshift,Si(ua=t.WeakMap)&&ua),la=function(){try{var e=Si(e=t.Float64Array)&&e,n=new e(new $o(10),0,1)&&e}catch(r){}return n}(),ca=Si(ca=Bo.isArray)&&ca,fa=Si(fa=Po.create)&&fa,da=t.isFinite,pa=Si(pa=Po.keys)&&pa,ga=Do.max,va=Do.min,ma=Si(ma=To.now)&&ma,ya=Si(ya=Uo.isFinite)&&ya,wa=t.parseInt,_a=Do.random,ba=Uo.NEGATIVE_INFINITY,xa=Uo.POSITIVE_INFINITY,Sa=Do.pow(2,32)-1,ka=Sa-1,Ea=Sa>>>1,Ca=la?la.BYTES_PER_ELEMENT:0,Ia=Do.pow(2,53)-1,Aa=ua&&new ua,La=e.support={};!function(e){La.funcDecomp=!Si(t.WinRTError)&&Ot.test(E),La.funcNames="string"==typeof Oo.name;try{La.dom=11===Ho.createDocumentFragment().nodeType}catch(n){La.dom=!1}try{La.nonEnumArgs=!ia.call(arguments,1)}catch(n){La.nonEnumArgs=!0}}(0,0),e.templateSettings={escape:xt,evaluate:St,interpolate:kt,variable:"",imports:{_:e}};var Ra=function(){function e(){}return function(n){if(_i(n)){e.prototype=n;var r=new e;e.prototype=null}return r||t.Object()}}(),Ba=Aa?function(t,e){return Aa.set(t,e),t}:bo;Jo||(Ve=$o&&ha?function(t){var e=t.byteLength,n=la?ea(e/Ca):0,r=n*Ca,i=new $o(e);if(n){var o=new la(i,0,n);o.set(new la(t,0,n))}return e!=r&&(o=new ha(i,r),o.set(new ha(t,r))),i}:_o(null));var Ta=fa&&oa?function(t){return new qt(t)}:_o(null),Ma=Aa?function(t){return Aa.get(t)}:Eo,Oa=function(){var t=0,e=0;return function(n,r){var i=Na(),o=W-(i-e);if(e=i,o>0){if(++t>=z)return n}else t=0;return Ba(n,r)}}(),Da=Qe(function(t,e,n){qo.call(t,n)?++t[n]:t[n]=1}),Ua=Qe(function(t,e,n){qo.call(t,n)?t[n].push(e):t[n]=[e]}),Pa=Qe(function(t,e,n){t[n]=e}),Fa=on(re),za=on(ie,!0),Wa=Qe(function(t,e,n){t[n?0:1].push(e)},function(){return[[],[]]}),Na=ma||function(){return(new To).getTime()},ja=ca||function(t){return y(t)&&Sn(t.length)&&Ko.call(t)==Y||!1};La.dom||(gi=function(t){return t&&1===t.nodeType&&y(t)&&!Za(t)||!1});var Ha=ya||function(t){return"number"==typeof t&&da(t)};(wi(/x/)||ha&&!wi(ha))&&(wi=function(t){return Ko.call(t)==$});var Za=na?function(t){if(!t||Ko.call(t)!=tt)return!1;var e=t.valueOf,n=Si(e)&&(n=na(e))&&na(n);return n?t==n||na(t)==n:Ln(t)}:Ln,Ga=tn(le),qa=pa?function(t){if(t)var e=t.constructor,n=t.length;return"function"==typeof e&&e.prototype===t||"function"!=typeof t&&n&&Sn(n)?Rn(t):_i(t)?pa(t):[]}:Rn,Ya=tn(Ue),Ka=nn(function(t,e,n){return e=e.toLowerCase(),t+(n?e.charAt(0).toUpperCase()+e.slice(1):e)}),Xa=nn(function(t,e,n){return t+(n?"-":"")+e.toLowerCase()});8!=wa(Pt+"08")&&(so=function(t,e,n){return(n?xn(t,e,n):null==e)?e=0:e&&(e=+e),t=co(t),wa(t,e||(At.test(t)?16:10))});var Va=nn(function(t,e,n){return t+(n?"_":"")+e.toLowerCase()}),$a=nn(function(t,e,n){return t+(n?" ":"")+(e.charAt(0).toUpperCase()+e.slice(1))});return n.prototype=e.prototype,nt.prototype["delete"]=it,nt.prototype.get=Ht,nt.prototype.has=Zt,nt.prototype.set=Gt,qt.prototype.push=Xt,ni.Cache=nt,e.after=Hr,e.ary=Zr,e.assign=Ga,e.at=br,e.before=Gr,e.bind=qr,e.bindAll=Yr,e.bindKey=Kr,e.callback=wo,e.chain=pr,e.chunk=Mn,e.compact=On,e.constant=_o,e.countBy=Da,e.create=Ti,e.curry=Xr,e.curryRight=Vr,e.debounce=$r,e.defaults=Mi,e.defer=Jr,e.delay=Qr,e.difference=Dn,e.drop=Un,e.dropRight=Pn,e.dropRightWhile=Fn,e.dropWhile=zn,e.filter=kr,e.flatten=Hn,e.flattenDeep=Zn,e.flow=ti,e.flowRight=ei,e.forEach=Ar,e.forEachRight=Lr,e.forIn=Ui,e.forInRight=Pi,e.forOwn=Fi,e.forOwnRight=zi,e.functions=Wi,e.groupBy=Ua,e.indexBy=Pa,e.initial=qn,e.intersection=Yn,e.invert=ji,e.invoke=Rr,e.keys=qa,e.keysIn=Hi,e.map=Br,e.mapValues=Zi,e.matches=xo,e.memoize=ni,e.merge=Ya,e.mixin=So,e.negate=ri,e.omit=Gi,e.once=ii,e.pairs=qi,e.partial=oi,e.partialRight=ai,e.partition=Wa,e.pick=Yi,
e.pluck=Tr,e.property=Co,e.propertyOf=Io,e.pull=Vn,e.pullAt=$n,e.range=Ao,e.rearg=si,e.reject=Dr,e.remove=Jn,e.rest=Qn,e.shuffle=Pr,e.slice=tr,e.sortBy=Wr,e.sortByAll=Nr,e.take=rr,e.takeRight=ir,e.takeRightWhile=or,e.takeWhile=ar,e.tap=gr,e.throttle=hi,e.thru=vr,e.times=Lo,e.toArray=Ri,e.toPlainObject=Bi,e.transform=Xi,e.union=sr,e.uniq=hr,e.unzip=ur,e.values=Vi,e.valuesIn=$i,e.where=jr,e.without=lr,e.wrap=ui,e.xor=cr,e.zip=fr,e.zipObject=dr,e.backflow=ei,e.collect=Br,e.compose=ei,e.each=Ar,e.eachRight=Lr,e.extend=Ga,e.iteratee=wo,e.methods=Wi,e.object=dr,e.select=kr,e.tail=Qn,e.unique=hr,So(e,e),e.attempt=yo,e.camelCase=Ka,e.capitalize=Qi,e.clone=li,e.cloneDeep=ci,e.deburr=to,e.endsWith=eo,e.escape=no,e.escapeRegExp=ro,e.every=Sr,e.find=Er,e.findIndex=Wn,e.findKey=Oi,e.findLast=Cr,e.findLastIndex=Nn,e.findLastKey=Di,e.findWhere=Ir,e.first=jn,e.has=Ni,e.identity=bo,e.includes=xr,e.indexOf=Gn,e.isArguments=fi,e.isArray=ja,e.isBoolean=di,e.isDate=pi,e.isElement=gi,e.isEmpty=vi,e.isEqual=mi,e.isError=yi,e.isFinite=Ha,e.isFunction=wi,e.isMatch=bi,e.isNaN=xi,e.isNative=Si,e.isNull=ki,e.isNumber=Ei,e.isObject=_i,e.isPlainObject=Za,e.isRegExp=Ci,e.isString=Ii,e.isTypedArray=Ai,e.isUndefined=Li,e.kebabCase=Xa,e.last=Kn,e.lastIndexOf=Xn,e.max=Fa,e.min=za,e.noConflict=ko,e.noop=Eo,e.now=Na,e.pad=io,e.padLeft=oo,e.padRight=ao,e.parseInt=so,e.random=Ji,e.reduce=Mr,e.reduceRight=Or,e.repeat=ho,e.result=Ki,e.runInContext=E,e.size=Fr,e.snakeCase=Va,e.some=zr,e.sortedIndex=er,e.sortedLastIndex=nr,e.startCase=$a,e.startsWith=uo,e.template=lo,e.trim=co,e.trimLeft=fo,e.trimRight=po,e.trunc=go,e.unescape=vo,e.uniqueId=Ro,e.words=mo,e.all=Sr,e.any=zr,e.contains=xr,e.detect=Er,e.foldl=Mr,e.foldr=Or,e.head=jn,e.include=xr,e.inject=Mr,So(e,function(){var t={};return Ie(e,function(n,r){e.prototype[r]||(t[r]=n)}),t}(),!1),e.sample=Ur,e.prototype.sample=function(t){return this.__chain__||null!=t?this.thru(function(e){return Ur(e,t)}):Ur(this.value())},e.VERSION=I,$t(["bind","bindKey","curry","curryRight","partial","partialRight"],function(t){e[t].placeholder=e}),$t(["filter","map","takeWhile"],function(t,e){var n=e==N;r.prototype[t]=function(t,r){var i=this.clone(),o=i.filtered,a=i.iteratees||(i.iteratees=[]);return i.filtered=o||n||e==H&&i.dir<0,a.push({iteratee:pn(t,r,3),type:e}),i}}),$t(["drop","take"],function(t,e){var n=t+"Count",i=t+"While";r.prototype[t]=function(r){r=null==r?1:ga(+r||0,0);var i=this.clone();if(i.filtered){var o=i[n];i[n]=e?va(o,r):o+r}else{var a=i.views||(i.views=[]);a.push({size:r,type:t+(i.dir<0?"Right":"")})}return i},r.prototype[t+"Right"]=function(e){return this.reverse()[t](e).reverse()},r.prototype[t+"RightWhile"]=function(t,e){return this.reverse()[i](t,e).reverse()}}),$t(["first","last"],function(t,e){var n="take"+(e?"Right":"");r.prototype[t]=function(){return this[n](1).value()[0]}}),$t(["initial","rest"],function(t,e){var n="drop"+(e?"":"Right");r.prototype[t]=function(){return this[n](1)}}),$t(["pluck","where"],function(t,e){var n=e?"filter":"map",i=e?De:Fe;r.prototype[t]=function(t){return this[n](i(e?t:t+""))}}),r.prototype.dropWhile=function(t,e){var n,r,i=this.dir<0;return t=pn(t,e,3),this.filter(function(e,o,a){return n=n&&(i?r>o:o>r),r=o,n||(n=!t(e,o,a))})},r.prototype.reject=function(t,e){return t=pn(t,e,3),this.filter(function(e,n,r){return!t(e,n,r)})},r.prototype.slice=function(t,e){t=null==t?0:+t||0;var n=0>t?this.takeRight(-t):this.drop(t);return"undefined"!=typeof e&&(e=+e||0,n=0>e?n.dropRight(-e):n.take(e-t)),n},Ie(r.prototype,function(t,i){var o=e[i],a=/^(?:first|last)$/.test(i);e.prototype[i]=function(){var i=this.__wrapped__,s=arguments,h=this.__chain__,u=!!this.__actions__.length,l=i instanceof r,c=l&&!u;if(a&&!h)return c?t.call(i):o.call(e,this.value());var f=function(t){var n=[t];return ra.apply(n,s),o.apply(e,n)};if(l||ja(i)){var d=c?i:new r(this),p=t.apply(d,s);if(!a&&(u||p.actions)){var g=p.actions||(p.actions=[]);g.push({func:vr,args:[f],thisArg:e})}return new n(p,h)}return this.thru(f)}}),$t(["concat","join","pop","push","shift","sort","splice","unshift"],function(t){var n=No[t],r=/^(?:push|sort|unshift)$/.test(t)?"tap":"thru",i=/^(?:join|pop|shift)$/.test(t);e.prototype[t]=function(){var t=arguments;return i&&!this.__chain__?n.apply(this.value(),t):this[r](function(e){return n.apply(e,t)})}}),r.prototype.clone=i,r.prototype.reverse=w,r.prototype.value=J,e.prototype.chain=mr,e.prototype.reverse=yr,e.prototype.toString=wr,e.prototype.toJSON=e.prototype.valueOf=e.prototype.value=_r,e.prototype.collect=e.prototype.map,e.prototype.head=e.prototype.first,e.prototype.select=e.prototype.filter,e.prototype.tail=e.prototype.rest,e}var C,I="3.1.0",A=1,L=2,R=4,B=8,T=16,M=32,O=64,D=128,U=256,P=30,F="...",z=150,W=16,N=0,j=1,H=2,Z="Expected a function",G="__lodash_placeholder__",q="[object Arguments]",Y="[object Array]",K="[object Boolean]",X="[object Date]",V="[object Error]",$="[object Function]",J="[object Map]",Q="[object Number]",tt="[object Object]",et="[object RegExp]",nt="[object Set]",rt="[object String]",it="[object WeakMap]",ot="[object ArrayBuffer]",at="[object Float32Array]",st="[object Float64Array]",ht="[object Int8Array]",ut="[object Int16Array]",lt="[object Int32Array]",ct="[object Uint8Array]",ft="[object Uint8ClampedArray]",dt="[object Uint16Array]",pt="[object Uint32Array]",gt=/\b__p \+= '';/g,vt=/\b(__p \+=) '' \+/g,mt=/(__e\(.*?\)|\b__t\)) \+\n'';/g,yt=/&(?:amp|lt|gt|quot|#39|#96);/g,wt=/[&<>"'`]/g,_t=RegExp(yt.source),bt=RegExp(wt.source),xt=/<%-([\s\S]+?)%>/g,St=/<%([\s\S]+?)%>/g,kt=/<%=([\s\S]+?)%>/g,Et=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,Ct=/\w*$/,It=/^\s*function[ \n\r\t]+\w/,At=/^0[xX]/,Lt=/^\[object .+?Constructor\]$/,Rt=/[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g,Bt=/($^)/,Tt=/[.*+?^${}()|[\]\/\\]/g,Mt=RegExp(Tt.source),Ot=/\bthis\b/,Dt=/['\n\r\u2028\u2029\\]/g,Ut=function(){var t="[A-Z\\xc0-\\xd6\\xd8-\\xde]",e="[a-z\\xdf-\\xf6\\xf8-\\xff]+";return RegExp(t+"{2,}(?="+t+e+")|"+t+"?"+e+"|"+t+"+|[0-9]+","g")}(),Pt=" 	\f \ufeff\n\r\u2028\u2029 ᠎             　",Ft=["Array","ArrayBuffer","Date","Error","Float32Array","Float64Array","Function","Int8Array","Int16Array","Int32Array","Math","Number","Object","RegExp","Set","String","_","clearTimeout","document","isFinite","parseInt","setTimeout","TypeError","Uint8Array","Uint8ClampedArray","Uint16Array","Uint32Array","WeakMap","window","WinRTError"],zt=-1,Wt={};Wt[at]=Wt[st]=Wt[ht]=Wt[ut]=Wt[lt]=Wt[ct]=Wt[ft]=Wt[dt]=Wt[pt]=!0,Wt[q]=Wt[Y]=Wt[ot]=Wt[K]=Wt[X]=Wt[V]=Wt[$]=Wt[J]=Wt[Q]=Wt[tt]=Wt[et]=Wt[nt]=Wt[rt]=Wt[it]=!1;var Nt={};Nt[q]=Nt[Y]=Nt[ot]=Nt[K]=Nt[X]=Nt[at]=Nt[st]=Nt[ht]=Nt[ut]=Nt[lt]=Nt[Q]=Nt[tt]=Nt[et]=Nt[rt]=Nt[ct]=Nt[ft]=Nt[dt]=Nt[pt]=!0,Nt[V]=Nt[$]=Nt[J]=Nt[nt]=Nt[it]=!1;var jt={leading:!1,maxWait:0,trailing:!1},Ht={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Ç":"C","ç":"c","Ð":"D","ð":"d","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","Ø":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","Ý":"Y","ý":"y","ÿ":"y","Æ":"Ae","æ":"ae","Þ":"Th","þ":"th","ß":"ss"},Zt={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","`":"&#96;"},Gt={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#39;":"'","&#96;":"`"},qt={"function":!0,object:!0},Yt={"\\":"\\","'":"'","\n":"n","\r":"r","\u2028":"u2028","\u2029":"u2029"},Kt=qt[typeof window]&&window!==(this&&this.window)?window:this,Xt=qt[typeof e]&&e&&!e.nodeType&&e,Vt=qt[typeof t]&&t&&!t.nodeType&&t,$t=Xt&&Vt&&"object"==typeof i&&i;!$t||$t.global!==$t&&$t.window!==$t&&$t.self!==$t||(Kt=$t);var Jt=(Vt&&Vt.exports===Xt&&Xt,E());Kt._=Jt,r=function(){return Jt}.call(e,n,e,t),!(r!==C&&(t.exports=r))}).call(this)}).call(e,n(15)(t),function(){return this}())},function(t,e,n){(function(e){(function(){var r,i,o,a=function(t,e){return function(){return t.apply(e,arguments)}};o=n(45),i=function(){function t(t,e,n){this.document=t,this.id=e,this.data=null!=n?n:{},this.finalize=a(this.finalize,this),this.gen=0,this.deflate=null,this.compress=this.document.compress&&!this.data.Filter,this.uncompressedLength=0,this.chunks=[]}return t.prototype.initDeflate=function(){return this.data.Filter="FlateDecode",this.deflate=o.createDeflate(),this.deflate.on("data",function(t){return function(e){return t.chunks.push(e),t.data.Length+=e.length}}(this)),this.deflate.on("end",this.finalize)},t.prototype.write=function(t){var n;return e.isBuffer(t)||(t=new e(t+"\n","binary")),this.uncompressedLength+=t.length,null==(n=this.data).Length&&(n.Length=0),this.compress?(this.deflate||this.initDeflate(),this.deflate.write(t)):(this.chunks.push(t),this.data.Length+=t.length)},t.prototype.end=function(t){return("string"==typeof t||e.isBuffer(t))&&this.write(t),this.deflate?this.deflate.end():this.finalize()},t.prototype.finalize=function(){var t,e,n,i;if(this.offset=this.document._offset,this.document._write(""+this.id+" "+this.gen+" obj"),this.document._write(r.convert(this.data)),this.chunks.length){for(this.document._write("stream"),i=this.chunks,e=0,n=i.length;n>e;e++)t=i[e],this.document._write(t);this.chunks.length=0,this.document._write("\nendstream")}return this.document._write("endobj"),this.document._refEnd(this)},t.prototype.toString=function(){return""+this.id+" "+this.gen+" R"},t}(),t.exports=i,r=n(32)}).call(this)}).call(e,n(4).Buffer)},function(t,e,n){t.exports=function(){throw new Error("define cannot be used indirect")}},function(t,e,n){(function(e){t.exports=e}).call(e,{})},function(t,e,n){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}},function(t,e,n){"use strict";function r(t,e,n){this.MAX_CHAR_TYPES=92,this.pdfkitDoc=t,this.path=e,this.pdfFonts=[],this.charCatalogue=[],this.name=n,this.__defineGetter__("ascender",function(){var t=this.getFont(0);return t.ascender}),this.__defineGetter__("decender",function(){var t=this.getFont(0);return t.decender})}var i=n(11);r.prototype.getFont=function(t){if(!this.pdfFonts[t]){var e=this.name+t;this.postscriptName&&delete this.pdfkitDoc._fontFamilies[this.postscriptName],this.pdfFonts[t]=this.pdfkitDoc.font(this.path,e)._font,this.postscriptName||(this.postscriptName=this.pdfFonts[t].name)}return this.pdfFonts[t]},r.prototype.widthOfString=function(){var t=this.getFont(0);return t.widthOfString.apply(t,arguments)},r.prototype.lineHeight=function(){var t=this.getFont(0);return t.lineHeight.apply(t,arguments)},r.prototype.ref=function(){var t=this.getFont(0);return t.ref.apply(t,arguments)};var o=function(t){return t.charCodeAt(0)};r.prototype.encode=function(t){var e=this,n=i.chain(t.split("")).map(o).uniq().value();if(n.length>e.MAX_CHAR_TYPES)throw new Error("Inline has more than "+e.MAX_CHAR_TYPES+": "+t+" different character types and therefore cannot be properly embedded into pdf.");var r=function(t){return i.uniq(t.concat(n)).length<=e.MAX_CHAR_TYPES},a=i.findIndex(e.charCatalogue,r);0>a&&(a=e.charCatalogue.length,e.charCatalogue[a]=[]);var s=this.getFont(a);s.use(t),i.each(n,function(t){i.includes(e.charCatalogue[a],t)||e.charCatalogue[a].push(t)});var h=i.map(s.encode(t),function(t){return t.charCodeAt(0).toString(16)}).join("");return{encodedText:h,fontId:s.id}},t.exports=r},function(t,e,n){(function(e){(function(){var r,i,o,a,s;s=n(10),r=n(34),i=n(35),a=n(36),o=function(){function t(){}return t.open=function(t,n){var r,o;if(e.isBuffer(t))r=t;else if(o=/^data:.+;base64,(.*)$/.exec(t))r=new e(o[1],"base64");else if(r=s.readFileSync(t),!r)return;if(255===r[0]&&216===r[1])return new i(r,n);if(137===r[0]&&"PNG"===r.toString("ascii",1,4))return new a(r,n);throw new Error("Unknown image format.")},t}(),t.exports=o}).call(this)}).call(e,n(4).Buffer)},function(t,e,n){"use strict";function r(){this.events={}}r.prototype.startTracking=function(t,e){var n=this.events[t]||(this.events[t]=[]);n.indexOf(e)<0&&n.push(e)},r.prototype.stopTracking=function(t,e){var n=this.events[t];if(n){var r=n.indexOf(e);r>=0&&n.splice(r,1)}},r.prototype.emit=function(t){var e=Array.prototype.slice.call(arguments,1),n=this.events[t];n&&n.forEach(function(t){t.apply(this,e)})},r.prototype.auto=function(t,e,n){this.startTracking(t,e),n(),this.stopTracking(t,e)},t.exports=r},function(t,e,n){"use strict";function r(t,e,n,r,a,s){this.textTools=new i(t),this.styleStack=new o(e,n),this.imageMeasure=r,this.tableLayouts=a,this.images=s,this.autoImageIndex=1}var i=n(26),o=n(27),a=n(22),s=n(25).fontStringify,h=n(25).pack,u=n(33);r.prototype.measureDocument=function(t){return this.measureNode(t)},r.prototype.measureNode=function(t){function e(t){var e=t._margin;return e&&(t._minWidth+=e[0]+e[2],t._maxWidth+=e[0]+e[2]),t}function n(){function e(t,e){return t.marginLeft||t.marginTop||t.marginRight||t.marginBottom?[t.marginLeft||e[0]||0,t.marginTop||e[1]||0,t.marginRight||e[2]||0,t.marginBottom||e[3]||0]:e}function n(t){for(var e={},n=t.length-1;n>=0;n--){var i=t[n],o=r.styleStack.styleDictionary[i];for(var a in o)o.hasOwnProperty(a)&&(e[a]=o[a])}return e}function i(t){return"number"==typeof t||t instanceof Number?t=[t,t,t,t]:t instanceof Array&&2===t.length&&(t=[t[0],t[1],t[0],t[1]]),t}var o=[void 0,void 0,void 0,void 0];if(t.style){var a=t.style instanceof Array?t.style:[t.style],s=n(a);s&&(o=e(s,o)),s.margin&&(o=i(s.margin))}return o=e(t,o),t.margin&&(o=i(t.margin)),void 0===o[0]&&void 0===o[1]&&void 0===o[2]&&void 0===o[3]?null:o}t instanceof Array?t={stack:t}:("string"==typeof t||t instanceof String)&&(t={text:t});var r=this;return this.styleStack.auto(t,function(){if(t._margin=n(t),t.columns)return e(r.measureColumns(t));if(t.stack)return e(r.measureVerticalContainer(t));if(t.ul)return e(r.measureList(!1,t));if(t.ol)return e(r.measureList(!0,t));if(t.table)return e(r.measureTable(t));if(void 0!==t.text)return e(r.measureLeaf(t));if(t.image)return e(r.measureImage(t));if(t.canvas)return e(r.measureCanvas(t));if(t.qr)return e(r.measureQr(t));throw"Unrecognized document structure: "+JSON.stringify(t,s)})},r.prototype.convertIfBase64Image=function(t){if(/^data:image\/(jpeg|jpg|png);base64,/.test(t.image)){var e="$$pdfmake$$"+this.autoImageIndex++;this.images[e]=t.image,t.image=e}},r.prototype.measureImage=function(t){this.images&&this.convertIfBase64Image(t);var e=this.imageMeasure.measureImage(t.image);if(t.fit){var n=e.width/e.height>t.fit[0]/t.fit[1]?t.fit[0]/e.width:t.fit[1]/e.height;t._width=t._minWidth=t._maxWidth=e.width*n,t._height=e.height*n}else t._width=t._minWidth=t._maxWidth=t.width||e.width,t._height=t.height||e.height*t._width/e.width;return t._alignment=this.styleStack.getProperty("alignment"),t},r.prototype.measureLeaf=function(t){var e=this.textTools.buildInlines(t.text,this.styleStack);return t._inlines=e.items,t._minWidth=e.minWidth,t._maxWidth=e.maxWidth,t},r.prototype.measureVerticalContainer=function(t){var e=t.stack;t._minWidth=0,t._maxWidth=0;for(var n=0,r=e.length;r>n;n++)e[n]=this.measureNode(e[n]),t._minWidth=Math.max(t._minWidth,e[n]._minWidth),t._maxWidth=Math.max(t._maxWidth,e[n]._maxWidth);return t},r.prototype.gapSizeForList=function(t,e){if(t){var n=e.length.toString().replace(/./g,"9");return this.textTools.sizeOfString(n+". ",this.styleStack)}return this.textTools.sizeOfString("9. ",this.styleStack)},r.prototype.buildMarker=function(t,e,n,r){var i;if(t)i={_inlines:this.textTools.buildInlines(e,n).items};else{var o=r.fontSize/6;i={canvas:[{x:o,y:r.height/r.lineHeight+r.decender-r.fontSize/3,r1:o,r2:o,type:"ellipse",color:"black"}]}}return i._minWidth=i._maxWidth=r.width,i._minHeight=i._maxHeight=r.height,i},r.prototype.measureList=function(t,e){var n=this.styleStack.clone(),r=t?e.ol:e.ul;e._gapSize=this.gapSizeForList(t,r),e._minWidth=0,e._maxWidth=0;for(var i=1,o=0,a=r.length;a>o;o++){var s=r[o]=this.measureNode(r[o]),h=i++ +". ";s.ol||s.ul||(s.listMarker=this.buildMarker(t,s.counter||h,n,e._gapSize)),e._minWidth=Math.max(e._minWidth,r[o]._minWidth+e._gapSize.width),e._maxWidth=Math.max(e._maxWidth,r[o]._maxWidth+e._gapSize.width)}return e},r.prototype.measureColumns=function(t){var e=t.columns;t._gap=this.styleStack.getProperty("columnGap")||0;for(var n=0,r=e.length;r>n;n++)e[n]=this.measureNode(e[n]);var i=a.measureMinMax(e);return t._minWidth=i.min+t._gap*(e.length-1),t._maxWidth=i.max+t._gap*(e.length-1),t},r.prototype.measureTable=function(t){function e(t,e){return function(){return null!==e&&"object"==typeof e&&(e.fillColor=t.styleStack.getProperty("fillColor")),t.measureNode(e)}}function n(e){var n=t.layout;("string"==typeof t.layout||t instanceof String)&&(n=e[n]);var r={hLineWidth:function(t,e){return 1},vLineWidth:function(t,e){return 1},hLineColor:function(t,e){return"black"},vLineColor:function(t,e){return"black"},paddingLeft:function(t,e){return 4},paddingRight:function(t,e){return 4},paddingTop:function(t,e){return 2},paddingBottom:function(t,e){return 2}};return h(r,n)}function r(e){for(var n=[],r=0,i=0,o=0,a=t.table.widths.length;a>o;o++){var s=i+e.vLineWidth(o,t)+e.paddingLeft(o,t);n.push(s),r+=s,i=e.paddingRight(o,t)}return r+=i+e.vLineWidth(t.table.widths.length,t),{total:r,offsets:n}}function i(){for(var e,n,r=0,i=g.length;i>r;r++){var a=g[r],s=o(a.col,a.span,t._offsets),h=a.minWidth-s.minWidth,u=a.maxWidth-s.maxWidth;if(h>0)for(e=h/a.span,n=0;n<a.span;n++)t.table.widths[a.col+n]._minWidth+=e;if(u>0)for(e=u/a.span,n=0;n<a.span;n++)t.table.widths[a.col+n]._maxWidth+=e}}function o(e,n,r){for(var i={minWidth:0,maxWidth:0},o=0;n>o;o++)i.minWidth+=t.table.widths[e+o]._minWidth+(o?r.offsets[e+o]:0),i.maxWidth+=t.table.widths[e+o]._maxWidth+(o?r.offsets[e+o]:0);return i}function s(t,e,n){for(var r=1;n>r;r++)t[e+r]={_span:!0,_minWidth:0,_maxWidth:0,rowSpan:t[e].rowSpan}}function u(t,e,n,r){for(var i=1;r>i;i++)t.body[e+i][n]={_span:!0,_minWidth:0,_maxWidth:0,fillColor:t.body[e][n].fillColor}}function l(t){if(t.table.widths||(t.table.widths="auto"),"string"==typeof t.table.widths||t.table.widths instanceof String)for(t.table.widths=[t.table.widths];t.table.widths.length<t.table.body[0].length;)t.table.widths.push(t.table.widths[t.table.widths.length-1]);for(var e=0,n=t.table.widths.length;n>e;e++){var r=t.table.widths[e];("number"==typeof r||r instanceof Number||"string"==typeof r||r instanceof String)&&(t.table.widths[e]={width:r})}}l(t),t._layout=n(this.tableLayouts),t._offsets=r(t._layout);var c,f,d,p,g=[];for(c=0,d=t.table.body[0].length;d>c;c++){var v=t.table.widths[c];for(v._minWidth=0,v._maxWidth=0,f=0,p=t.table.body.length;p>f;f++){var m=t.table.body[f],y=m[c];if(!y._span){y=m[c]=this.styleStack.auto(y,e(this,y)),y.colSpan&&y.colSpan>1?(s(m,c,y.colSpan),g.push({col:c,span:y.colSpan,minWidth:y._minWidth,maxWidth:y._maxWidth})):(v._minWidth=Math.max(v._minWidth,y._minWidth),v._maxWidth=Math.max(v._maxWidth,y._maxWidth))}y.rowSpan&&y.rowSpan>1&&u(t.table,f,c,y.rowSpan)}}i();var w=a.measureMinMax(t.table.widths);return t._minWidth=w.min+t._offsets.total,t._maxWidth=w.max+t._offsets.total,t},r.prototype.measureCanvas=function(t){for(var e=0,n=0,r=0,i=t.canvas.length;i>r;r++){var o=t.canvas[r];switch(o.type){case"ellipse":e=Math.max(e,o.x+o.r1),n=Math.max(n,o.y+o.r2);break;case"rect":e=Math.max(e,o.x+o.w),n=Math.max(n,o.y+o.h);break;case"line":e=Math.max(e,o.x1,o.x2),n=Math.max(n,o.y1,o.y2);break;case"polyline":for(var a=0,s=o.points.length;s>a;a++)e=Math.max(e,o.points[a].x),n=Math.max(n,o.points[a].y)}}return t._minWidth=t._maxWidth=e,t._minHeight=t._maxHeight=n,t},r.prototype.measureQr=function(t){return t=u.measure(t),t._alignment=this.styleStack.getProperty("alignment"),t},t.exports=r},function(t,e,n){"use strict";function r(t,e){this.pages=[],this.pageMargins=e,this.x=e.left,this.availableWidth=t.width-e.left-e.right,this.availableHeight=0,this.page=-1,this.snapshots=[],this.endingCell=null,this.tracker=new a,this.addPage(t)}function i(t,e){return void 0===t?e:"landscape"===t?"landscape":"portrait"}function o(t,e){var n;return n=t.page>e.page?t:e.page>t.page?e:t.y>e.y?t:e,{page:n.page,x:n.x,y:n.y,availableHeight:n.availableHeight,availableWidth:n.availableWidth}}var a=n(18);r.prototype.beginColumnGroup=function(){this.snapshots.push({x:this.x,y:this.y,availableHeight:this.availableHeight,availableWidth:this.availableWidth,page:this.page,bottomMost:{y:this.y,page:this.page},endingCell:this.endingCell,lastColumnWidth:this.lastColumnWidth}),this.lastColumnWidth=0},r.prototype.beginColumn=function(t,e,n){var r=this.snapshots[this.snapshots.length-1];this.calculateBottomMost(r),this.endingCell=n,this.page=r.page,this.x=this.x+this.lastColumnWidth+(e||0),this.y=r.y,this.availableWidth=t,this.availableHeight=r.availableHeight,this.lastColumnWidth=t},r.prototype.calculateBottomMost=function(t){this.endingCell?(this.saveContextInEndingCell(this.endingCell),this.endingCell=null):t.bottomMost=o(this,t.bottomMost)},r.prototype.markEnding=function(t){this.page=t._columnEndingContext.page,this.x=t._columnEndingContext.x,this.y=t._columnEndingContext.y,this.availableWidth=t._columnEndingContext.availableWidth,this.availableHeight=t._columnEndingContext.availableHeight,this.lastColumnWidth=t._columnEndingContext.lastColumnWidth},r.prototype.saveContextInEndingCell=function(t){t._columnEndingContext={page:this.page,x:this.x,y:this.y,availableHeight:this.availableHeight,availableWidth:this.availableWidth,lastColumnWidth:this.lastColumnWidth}},r.prototype.completeColumnGroup=function(){var t=this.snapshots.pop();this.calculateBottomMost(t),this.endingCell=null,this.x=t.x,this.y=t.bottomMost.y,this.page=t.bottomMost.page,this.availableWidth=t.availableWidth,this.availableHeight=t.bottomMost.availableHeight,this.lastColumnWidth=t.lastColumnWidth},r.prototype.addMargin=function(t,e){this.x+=t,this.availableWidth-=t+(e||0)},r.prototype.moveDown=function(t){return this.y+=t,this.availableHeight-=t,this.availableHeight>0},r.prototype.initializePage=function(){this.y=this.pageMargins.top,this.availableHeight=this.getCurrentPage().pageSize.height-this.pageMargins.top-this.pageMargins.bottom,this.pageSnapshot().availableWidth=this.getCurrentPage().pageSize.width-this.pageMargins.left-this.pageMargins.right},r.prototype.pageSnapshot=function(){return this.snapshots[0]?this.snapshots[0]:this},r.prototype.moveTo=function(t,e){void 0!==t&&null!==t&&(this.x=t,this.availableWidth=this.getCurrentPage().pageSize.width-this.x-this.pageMargins.right),void 0!==e&&null!==e&&(this.y=e,this.availableHeight=this.getCurrentPage().pageSize.height-this.y-this.pageMargins.bottom)},r.prototype.beginDetachedBlock=function(){this.snapshots.push({x:this.x,y:this.y,availableHeight:this.availableHeight,availableWidth:this.availableWidth,page:this.page,endingCell:this.endingCell,lastColumnWidth:this.lastColumnWidth})},r.prototype.endDetachedBlock=function(){var t=this.snapshots.pop();this.x=t.x,this.y=t.y,this.availableWidth=t.availableWidth,this.availableHeight=t.availableHeight,this.page=t.page,this.endingCell=t.endingCell,this.lastColumnWidth=t.lastColumnWidth};var s=function(t,e){return e=i(e,t.pageSize.orientation),e!==t.pageSize.orientation?{orientation:e,width:t.pageSize.height,height:t.pageSize.width}:{orientation:t.pageSize.orientation,width:t.pageSize.width,height:t.pageSize.height}};r.prototype.moveToNextPage=function(t){var e=this.page+1,n=this.page,r=this.y,i=e>=this.pages.length;return i?this.addPage(s(this.getCurrentPage(),t)):(this.page=e,this.initializePage()),{newPageCreated:i,prevPage:n,prevY:r,y:this.y}},r.prototype.addPage=function(t){var e={items:[],pageSize:t};return this.pages.push(e),this.page=this.pages.length-1,this.initializePage(),this.tracker.emit("pageAdded"),e},r.prototype.getCurrentPage=function(){return this.page<0||this.page>=this.pages.length?null:this.pages[this.page]},r.prototype.getCurrentPosition=function(){var t=this.getCurrentPage().pageSize,e=t.height-this.pageMargins.top-this.pageMargins.bottom,n=t.width-this.pageMargins.left-this.pageMargins.right;return{pageNumber:this.page+1,pageOrientation:t.orientation,pageInnerHeight:e,pageInnerWidth:n,left:this.x,top:this.y,verticalRatio:(this.y-this.pageMargins.top)/e,horizontalRatio:(this.x-this.pageMargins.left)/n}},t.exports=r},function(t,e,n){"use strict";function r(t,e){this.transactionLevel=0,this.repeatables=[],this.tracker=e,this.writer=new o(t,e)}function i(t,e){var n=e(t);return n||(t.moveToNextPage(),n=e(t)),n}var o=n(37);r.prototype.addLine=function(t,e,n){return i(this,function(r){return r.writer.addLine(t,e,n)})},r.prototype.addImage=function(t,e){return i(this,function(n){return n.writer.addImage(t,e)})},r.prototype.addQr=function(t,e){return i(this,function(n){return n.writer.addQr(t,e)})},r.prototype.addVector=function(t,e,n,r){return this.writer.addVector(t,e,n,r)},r.prototype.addFragment=function(t,e,n,r){this.writer.addFragment(t,e,n,r)||(this.moveToNextPage(),this.writer.addFragment(t,e,n,r))},r.prototype.moveToNextPage=function(t){var e=this.writer.context.moveToNextPage(t);e.newPageCreated?this.repeatables.forEach(function(t){this.writer.addFragment(t,!0)},this):this.repeatables.forEach(function(t){this.writer.context.moveDown(t.height)},this),this.writer.tracker.emit("pageChanged",{prevPage:e.prevPage,prevY:e.prevY,y:e.y})},r.prototype.beginUnbreakableBlock=function(t,e){0===this.transactionLevel++&&(this.originalX=this.writer.context.x,this.writer.pushContext(t,e))},r.prototype.commitUnbreakableBlock=function(t,e){if(0===--this.transactionLevel){var n=this.writer.context;this.writer.popContext();var r=n.pages.length;if(r>0){var i=n.pages[0];if(i.xOffset=t,i.yOffset=e,r>1)if(void 0!==t||void 0!==e)i.height=n.getCurrentPage().pageSize.height-n.pageMargins.top-n.pageMargins.bottom;else{i.height=this.writer.context.getCurrentPage().pageSize.height-this.writer.context.pageMargins.top-this.writer.context.pageMargins.bottom;for(var o=0,a=this.repeatables.length;a>o;o++)i.height-=this.repeatables[o].height}else i.height=n.y;void 0!==t||void 0!==e?this.writer.addFragment(i,!0,!0,!0):this.addFragment(i)}}},r.prototype.currentBlockToRepeatable=function(){var t=this.writer.context,e={items:[]};return t.pages[0].items.forEach(function(t){e.items.push(t)}),e.xOffset=this.originalX,e.height=t.y,e},r.prototype.pushToRepeatables=function(t){this.repeatables.push(t)},r.prototype.popFromRepeatables=function(){this.repeatables.pop()},r.prototype.context=function(){return this.writer.context},t.exports=r},function(t,e,n){"use strict";function r(t,e){var n=[],r=0,a=0,s=[],h=0,u=0,l=[],c=e;t.forEach(function(t){i(t)?(n.push(t),r+=t._minWidth,a+=t._maxWidth):o(t)?(s.push(t),h=Math.max(h,t._minWidth),u=Math.max(u,t._maxWidth)):l.push(t)}),l.forEach(function(t){"string"==typeof t.width&&/\d+%/.test(t.width)&&(t.width=parseFloat(t.width)*c/100),t._calcWidth=t.width<t._minWidth&&t.elasticWidth?t._minWidth:t.width,e-=t._calcWidth});var f=r+h*s.length,d=a+u*s.length;if(f>=e)n.forEach(function(t){t._calcWidth=t._minWidth}),s.forEach(function(t){t._calcWidth=h});else{if(e>d)n.forEach(function(t){t._calcWidth=t._maxWidth,e-=t._calcWidth});else{var p=e-f,g=d-f;n.forEach(function(t){var n=t._maxWidth-t._minWidth;t._calcWidth=t._minWidth+n*p/g,e-=t._calcWidth})}if(s.length>0){var v=e/s.length;s.forEach(function(t){t._calcWidth=v})}}}function i(t){return"auto"===t.width}function o(t){return null===t.width||void 0===t.width||"*"===t.width||"star"===t.width}function a(t){for(var e={min:0,max:0},n={min:0,max:0},r=0,a=0,s=t.length;s>a;a++){var h=t[a];o(h)?(n.min=Math.max(n.min,h._minWidth),n.max=Math.max(n.max,h._maxWidth),r++):i(h)?(e.min+=h._minWidth,e.max+=h._maxWidth):(e.min+=void 0!==h.width&&h.width||h._minWidth,e.max+=void 0!==h.width&&h.width||h._maxWidth)}return r&&(e.min+=r*n.min,e.max+=r*n.max),e}t.exports={buildColumnWidths:r,measureMinMax:a,isAutoColumn:i,isStarColumn:o}},function(t,e,n){"use strict";function r(t){this.tableNode=t}var i=n(22);r.prototype.beginTable=function(t){function e(){var t=0;return r.table.widths.forEach(function(e){t+=e._calcWidth}),t}function n(){var t=[],e=0,n=0;t.push({left:0,rowSpan:0});for(var r=0,i=a.tableNode.table.body[0].length;i>r;r++){var o=a.layout.paddingLeft(r,a.tableNode)+a.layout.paddingRight(r,a.tableNode),s=a.layout.vLineWidth(r,a.tableNode);n=o+s+a.tableNode.table.widths[r]._calcWidth,t[t.length-1].width=n,e+=n,t.push({left:e,rowSpan:0,width:0})}return t}var r,o,a=this;r=this.tableNode,this.offsets=r._offsets,this.layout=r._layout,o=t.context().availableWidth-this.offsets.total,i.buildColumnWidths(r.table.widths,o),this.tableWidth=r._offsets.total+e(),this.rowSpanData=n(),this.cleanUpRepeatables=!1,this.headerRows=r.table.headerRows||0,this.rowsWithoutPageBreak=this.headerRows+(r.table.keepWithHeaderRows||0),this.dontBreakRows=r.table.dontBreakRows||!1,this.rowsWithoutPageBreak&&t.beginUnbreakableBlock(),this.drawHorizontalLine(0,t)},r.prototype.onRowBreak=function(t,e){var n=this;return function(){var t=n.rowPaddingTop+(n.headerRows?0:n.topLineWidth);e.context().moveDown(t)}},r.prototype.beginRow=function(t,e){this.topLineWidth=this.layout.hLineWidth(t,this.tableNode),this.rowPaddingTop=this.layout.paddingTop(t,this.tableNode),this.bottomLineWidth=this.layout.hLineWidth(t+1,this.tableNode),this.rowPaddingBottom=this.layout.paddingBottom(t,this.tableNode),this.rowCallback=this.onRowBreak(t,e),e.tracker.startTracking("pageChanged",this.rowCallback),this.dontBreakRows&&e.beginUnbreakableBlock(),this.rowTopY=e.context().y,this.reservedAtBottom=this.bottomLineWidth+this.rowPaddingBottom,e.context().availableHeight-=this.reservedAtBottom,e.context().moveDown(this.rowPaddingTop)},r.prototype.drawHorizontalLine=function(t,e,n){var r=this.layout.hLineWidth(t,this.tableNode);if(r){for(var i=r/2,o=null,a=0,s=this.rowSpanData.length;s>a;a++){var h=this.rowSpanData[a],u=!h.rowSpan;!o&&u&&(o={left:h.left,width:0}),u&&(o.width+=h.width||0);var l=(n||0)+i;u&&a!==s-1||o&&(e.addVector({type:"line",x1:o.left,x2:o.left+o.width,y1:l,y2:l,lineWidth:r,lineColor:"function"==typeof this.layout.hLineColor?this.layout.hLineColor(t,this.tableNode):this.layout.hLineColor},!1,n),o=null)}e.context().moveDown(r)}},r.prototype.drawVerticalLine=function(t,e,n,r,i){var o=this.layout.vLineWidth(r,this.tableNode);0!==o&&i.addVector({type:"line",x1:t+o/2,x2:t+o/2,y1:e,y2:n,lineWidth:o,lineColor:"function"==typeof this.layout.vLineColor?this.layout.vLineColor(r,this.tableNode):this.layout.vLineColor},!1,!0)},r.prototype.endTable=function(t){this.cleanUpRepeatables&&t.popFromRepeatables()},r.prototype.endRow=function(t,e,n){function r(){for(var e=[],n=0,r=0,i=a.tableNode.table.body[t].length;i>r;r++){if(!n){e.push({x:a.rowSpanData[r].left,index:r});var o=a.tableNode.table.body[t][r];n=o._colSpan||o.colSpan||0}n>0&&n--}return e.push({x:a.rowSpanData[a.rowSpanData.length-1].left,index:a.rowSpanData.length-1}),e}var i,o,a=this;e.tracker.stopTracking("pageChanged",this.rowCallback),e.context().moveDown(this.layout.paddingBottom(t,this.tableNode)),e.context().availableHeight+=this.reservedAtBottom;var s=e.context().page,h=e.context().y,u=r(),l=[],c=n&&n.length>0;if(l.push({y0:this.rowTopY,page:c?n[0].prevPage:s}),c)for(o=0,i=n.length;i>o;o++){var f=n[o];l[l.length-1].y1=f.prevY,l.push({y0:f.y,page:f.prevPage+1})}l[l.length-1].y1=h;for(var d=l[0].y1-l[0].y0===this.rowPaddingTop,p=d?1:0,g=l.length;g>p;p++){var v=p<l.length-1,m=p>0&&!this.headerRows,y=m?0:this.topLineWidth,w=l[p].y0,_=l[p].y1;for(v&&(_+=this.rowPaddingBottom),e.context().page!=l[p].page&&(e.context().page=l[p].page,this.reservedAtBottom=0),o=0,i=u.length;i>o;o++)if(this.drawVerticalLine(u[o].x,w-y,_+this.bottomLineWidth,u[o].index,e),i-1>o){var b=u[o].index,x=this.tableNode.table.body[t][b].fillColor;if(x){var S=this.layout.vLineWidth(b,this.tableNode),k=u[o].x+S,E=w-y;e.addVector({type:"rect",x:k,y:E,w:u[o+1].x-k,h:_+this.bottomLineWidth-E,lineWidth:0,color:x},!1,!0,0)}}v&&this.layout.hLineWhenBroken!==!1&&this.drawHorizontalLine(t+1,e,_),m&&this.layout.hLineWhenBroken!==!1&&this.drawHorizontalLine(t,e,w);

}e.context().page=s,e.context().y=h;var C=this.tableNode.table.body[t];for(o=0,i=C.length;i>o;o++){if(C[o].rowSpan&&(this.rowSpanData[o].rowSpan=C[o].rowSpan,C[o].colSpan&&C[o].colSpan>1))for(var I=1;I<C[o].rowSpan;I++)this.tableNode.table.body[t+I][o]._colSpan=C[o].colSpan;this.rowSpanData[o].rowSpan>0&&this.rowSpanData[o].rowSpan--}this.drawHorizontalLine(t+1,e),this.headerRows&&t===this.headerRows-1&&(this.headerRepeatable=e.currentBlockToRepeatable()),this.dontBreakRows&&e.tracker.auto("pageChanged",function(){a.drawHorizontalLine(t,e)},function(){e.commitUnbreakableBlock(),a.drawHorizontalLine(t,e)}),!this.headerRepeatable||t!==this.rowsWithoutPageBreak-1&&t!==this.tableNode.table.body.length-1||(e.commitUnbreakableBlock(),e.pushToRepeatables(this.headerRepeatable),this.cleanUpRepeatables=!0,this.headerRepeatable=null)},t.exports=r},function(t,e,n){"use strict";function r(t){this.maxWidth=t,this.leadingCut=0,this.trailingCut=0,this.inlineWidths=0,this.inlines=[]}r.prototype.getAscenderHeight=function(){var t=0;return this.inlines.forEach(function(e){t=Math.max(t,e.font.ascender/1e3*e.fontSize)}),t},r.prototype.hasEnoughSpaceForInline=function(t){return 0===this.inlines.length?!0:this.newLineForced?!1:this.inlineWidths+t.width-this.leadingCut-(t.trailingCut||0)<=this.maxWidth},r.prototype.addInline=function(t){0===this.inlines.length&&(this.leadingCut=t.leadingCut||0),this.trailingCut=t.trailingCut||0,t.x=this.inlineWidths-this.leadingCut,this.inlines.push(t),this.inlineWidths+=t.width,t.lineEnd&&(this.newLineForced=!0)},r.prototype.getWidth=function(){return this.inlineWidths-this.leadingCut-this.trailingCut},r.prototype.getHeight=function(){var t=0;return this.inlines.forEach(function(e){t=Math.max(t,e.height||0)}),t},t.exports=r},function(t,e,n){"use strict";function r(){for(var t={},e=0,n=arguments.length;n>e;e++){var r=arguments[e];if(r)for(var i in r)r.hasOwnProperty(i)&&(t[i]=r[i])}return t}function i(t,e,n){switch(t.type){case"ellipse":case"rect":t.x+=e,t.y+=n;break;case"line":t.x1+=e,t.x2+=e,t.y1+=n,t.y2+=n;break;case"polyline":for(var r=0,i=t.points.length;i>r;r++)t.points[r].x+=e,t.points[r].y+=n}}function o(t,e){return"font"===t?"font":e}function a(t){var e={};return t&&"[object Function]"===e.toString.call(t)}t.exports={pack:r,fontStringify:o,offsetVector:i,isFunction:a}},function(t,e,n){"use strict";function r(t){this.fontProvider=t}function i(t){var e=[];t=t.replace("	","    ");for(var n=t.match(l),r=0,i=n.length;i-1>r;r++){var o=n[r],a=0===o.length;if(a){var s=0===e.length||e[e.length-1].lineEnd;s?e.push({text:"",lineEnd:!0}):e[e.length-1].lineEnd=!0}else e.push({text:o})}return e}function o(t,e){e=e||{},t=t||{};for(var n in t)"text"!=n&&t.hasOwnProperty(n)&&(e[n]=t[n]);return e}function a(t){var e=[];("string"==typeof t||t instanceof String)&&(t=[t]);for(var n=0,r=t.length;r>n;n++){var a,s=t[n],h=null;"string"==typeof s||s instanceof String?a=i(s):(a=i(s.text),h=o(s));for(var u=0,l=a.length;l>u;u++){var c={text:a[u].text};a[u].lineEnd&&(c.lineEnd=!0),o(h,c),e.push(c)}}return e}function s(t){return t.replace(/[^A-Za-z0-9\[\] ]/g,function(t){return d[t]||t})}function h(t,e,n,r){var i;return void 0!==t[n]&&null!==t[n]?t[n]:e?(e.auto(t,function(){i=e.getProperty(n)}),null!==i&&void 0!==i?i:r):r}function u(t,e,n){var r=a(e);return r.forEach(function(e){var r=h(e,n,"font","Roboto"),i=h(e,n,"fontSize",12),o=h(e,n,"bold",!1),a=h(e,n,"italics",!1),u=h(e,n,"color","black"),l=h(e,n,"decoration",null),d=h(e,n,"decorationColor",null),p=h(e,n,"decorationStyle",null),g=h(e,n,"background",null),v=h(e,n,"lineHeight",1),m=t.provideFont(r,o,a);e.width=m.widthOfString(s(e.text),i),e.height=m.lineHeight(i)*v;var y=e.text.match(c),w=e.text.match(f);e.leadingCut=y?m.widthOfString(y[0],i):0,e.trailingCut=w?m.widthOfString(w[0],i):0,e.alignment=h(e,n,"alignment","left"),e.font=m,e.fontSize=i,e.color=u,e.decoration=l,e.decorationColor=d,e.decorationStyle=p,e.background=g}),r}var l=/([^ ,\/!.?:;\-\n]*[ ,\/!.?:;\-]*)|\n/g,c=/^(\s)+/g,f=/(\s)+$/g;r.prototype.buildInlines=function(t,e){function n(t){return Math.max(0,t.width-t.leadingCut-t.trailingCut)}var r,i=u(this.fontProvider,t,e),o=0,a=0;return i.forEach(function(t){o=Math.max(o,t.width-t.leadingCut-t.trailingCut),r||(r={width:0,leadingCut:t.leadingCut,trailingCut:0}),r.width+=t.width,r.trailingCut=t.trailingCut,a=Math.max(a,n(r)),t.lineEnd&&(r=null)}),{items:i,minWidth:o,maxWidth:a}},r.prototype.sizeOfString=function(t,e){t=t.replace("	","    ");var n=h({},e,"font","Roboto"),r=h({},e,"fontSize",12),i=h({},e,"bold",!1),o=h({},e,"italics",!1),a=h({},e,"lineHeight",1),u=this.fontProvider.provideFont(n,i,o);return{width:u.widthOfString(s(t),r),height:u.lineHeight(r)*a,fontSize:r,lineHeight:a,ascender:u.ascender/1e3*r,decender:u.decender/1e3*r}};var d={"Ą":"A","Ć":"C","Ę":"E","Ł":"L","Ń":"N","Ó":"O","Ś":"S","Ź":"Z","Ż":"Z","ą":"a","ć":"c","ę":"e","ł":"l","ń":"n","ó":"o","ś":"s","ź":"z","ż":"z"};t.exports=r},function(t,e,n){"use strict";function r(t,e){this.defaultStyle=e||{},this.styleDictionary=t,this.styleOverrides=[]}r.prototype.clone=function(){var t=new r(this.styleDictionary,this.defaultStyle);return this.styleOverrides.forEach(function(e){t.styleOverrides.push(e)}),t},r.prototype.push=function(t){this.styleOverrides.push(t)},r.prototype.pop=function(t){for(t=t||1;t-->0;)this.styleOverrides.pop()},r.prototype.autopush=function(t){if("string"==typeof t||t instanceof String)return 0;var e=[];t.style&&(e=t.style instanceof Array?t.style:[t.style]);for(var n=0,r=e.length;r>n;n++)this.push(e[n]);var i={},o=!1;return["font","fontSize","bold","italics","alignment","color","columnGap","fillColor","decoration","decorationStyle","decorationColor","background","lineHeight"].forEach(function(e){void 0!==t[e]&&null!==t[e]&&(i[e]=t[e],o=!0)}),o&&this.push(i),e.length+(o?1:0)},r.prototype.auto=function(t,e){var n=this.autopush(t),r=e();return n>0&&this.pop(n),r},r.prototype.getProperty=function(t){if(this.styleOverrides)for(var e=this.styleOverrides.length-1;e>=0;e--){var n=this.styleOverrides[e];if("string"==typeof n||n instanceof String){var r=this.styleDictionary[n];if(r&&null!==r[t]&&void 0!==r[t])return r[t]}else if(void 0!==n[t]&&null!==n[t])return n[t]}return this.defaultStyle&&this.defaultStyle[t]},t.exports=r},function(t,e,n){(function(e){(function(){var r,i,o,a,s,h,u={}.hasOwnProperty,l=function(t,e){function n(){this.constructor=t}for(var r in e)u.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};h=n(46),s=n(10),i=n(32),a=n(12),o=n(38),r=function(t){function r(t){var e,n,i,o;if(this.options=null!=t?t:{},r.__super__.constructor.apply(this,arguments),this.version=1.3,this.compress=null!=(i=this.options.compress)?i:!0,this._pageBuffer=[],this._pageBufferStart=0,this._offsets=[],this._waiting=0,this._ended=!1,this._offset=0,this._root=this.ref({Type:"Catalog",Pages:this.ref({Type:"Pages",Count:0,Kids:[]})}),this.page=null,this.initColor(),this.initVector(),this.initFonts(),this.initText(),this.initImages(),this.info={Producer:"PDFKit",Creator:"PDFKit",CreationDate:new Date},this.options.info){o=this.options.info;for(e in o)n=o[e],this.info[e]=n}this._write("%PDF-"+this.version),this._write("%ÿÿÿÿ"),this.addPage()}var h;return l(r,t),h=function(t){var e,n,i;i=[];for(n in t)e=t[n],i.push(r.prototype[n]=e);return i},h(n(41)),h(n(39)),h(n(44)),h(n(40)),h(n(42)),h(n(43)),r.prototype.addPage=function(t){var e;return null==t&&(t=this.options),this.options.bufferPages||this.flushPages(),this.page=new o(this,t),this._pageBuffer.push(this.page),e=this._root.data.Pages.data,e.Kids.push(this.page.dictionary),e.Count++,this.x=this.page.margins.left,this.y=this.page.margins.top,this._ctm=[1,0,0,1,0,0],this.transform(1,0,0,-1,0,this.page.height),this},r.prototype.bufferedPageRange=function(){return{start:this._pageBufferStart,count:this._pageBuffer.length}},r.prototype.switchToPage=function(t){var e;if(!(e=this._pageBuffer[t-this._pageBufferStart]))throw new Error("switchToPage("+t+") out of bounds, current buffer covers pages "+this._pageBufferStart+" to "+(this._pageBufferStart+this._pageBuffer.length-1));return this.page=e},r.prototype.flushPages=function(){var t,e,n,r;for(e=this._pageBuffer,this._pageBuffer=[],this._pageBufferStart+=e.length,n=0,r=e.length;r>n;n++)t=e[n],t.end()},r.prototype.ref=function(t){var e;return e=new a(this,this._offsets.length+1,t),this._offsets.push(null),this._waiting++,e},r.prototype._read=function(){},r.prototype._write=function(t){return e.isBuffer(t)||(t=new e(t+"\n","binary")),this.push(t),this._offset+=t.length},r.prototype.addContent=function(t){return this.page.write(t),this},r.prototype._refEnd=function(t){return this._offsets[t.id-1]=t.offset,0===--this._waiting&&this._ended?(this._finalize(),this._ended=!1):void 0},r.prototype.write=function(t,e){var n;return n=new Error("PDFDocument#write is deprecated, and will be removed in a future version of PDFKit. Please pipe the document into a Node stream."),this.pipe(s.createWriteStream(t)),this.end(),this.once("end",e)},r.prototype.output=function(t){throw new Error("PDFDocument#output is deprecated, and has been removed from PDFKit. Please pipe the document into a Node stream.")},r.prototype.end=function(){var t,e,n,r,i,o;this.flushPages(),this._info=this.ref(),i=this.info;for(e in i)r=i[e],"string"==typeof r&&(r=new String(r)),this._info.data[e]=r;this._info.end(),o=this._fontFamilies;for(n in o)t=o[n],t.embed();return this._root.end(),this._root.data.Pages.end(),0===this._waiting?this._finalize():this._ended=!0},r.prototype._finalize=function(t){var e,n,r,o,a;for(n=this._offset,this._write("xref"),this._write("0 "+(this._offsets.length+1)),this._write("0000000000 65535 f "),a=this._offsets,r=0,o=a.length;o>r;r++)e=a[r],e=("0000000000"+e).slice(-10),this._write(e+" 00000 n ");return this._write("trailer"),this._write(i.convert({Size:this._offsets.length+1,Root:this._root,Info:this._info})),this._write("startxref"),this._write(""+n),this._write("%%EOF"),this.push(null)},r.prototype.toString=function(){return"[object PDFDocument]"},r}(h.Readable),t.exports=r}).call(this)}).call(e,n(4).Buffer)},function(t,e,n){e.read=function(t,e,n,r,i){var o,a,s=8*i-r-1,h=(1<<s)-1,u=h>>1,l=-7,c=n?i-1:0,f=n?-1:1,d=t[e+c];for(c+=f,o=d&(1<<-l)-1,d>>=-l,l+=s;l>0;o=256*o+t[e+c],c+=f,l-=8);for(a=o&(1<<-l)-1,o>>=-l,l+=r;l>0;a=256*a+t[e+c],c+=f,l-=8);if(0===o)o=1-u;else{if(o===h)return a?0/0:(d?-1:1)*(1/0);a+=Math.pow(2,r),o-=u}return(d?-1:1)*a*Math.pow(2,o-r)},e.write=function(t,e,n,r,i,o){var a,s,h,u=8*o-i-1,l=(1<<u)-1,c=l>>1,f=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,d=r?0:o-1,p=r?1:-1,g=0>e||0===e&&0>1/e?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(s=isNaN(e)?1:0,a=l):(a=Math.floor(Math.log(e)/Math.LN2),e*(h=Math.pow(2,-a))<1&&(a--,h*=2),e+=a+c>=1?f/h:f*Math.pow(2,1-c),e*h>=2&&(a++,h/=2),a+c>=l?(s=0,a=l):a+c>=1?(s=(e*h-1)*Math.pow(2,i),a+=c):(s=e*Math.pow(2,c-1)*Math.pow(2,i),a=0));i>=8;t[n+d]=255&s,d+=p,s/=256,i-=8);for(a=a<<i|s,u+=i;u>0;t[n+d]=255&a,d+=p,a/=256,u-=8);t[n+d-p]|=128*g}},function(t,e,n){var r=Array.isArray,i=Object.prototype.toString;t.exports=r||function(t){return!!t&&"[object Array]"==i.call(t)}},function(t,e,n){var r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";!function(t){"use strict";function e(t){var e=t.charCodeAt(0);return e===a||e===c?62:e===s||e===f?63:h>e?-1:h+10>e?e-h+26+26:l+26>e?e-l:u+26>e?e-u+26:void 0}function n(t){function n(t){u[c++]=t}var r,i,a,s,h,u;if(t.length%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var l=t.length;h="="===t.charAt(l-2)?2:"="===t.charAt(l-1)?1:0,u=new o(3*t.length/4-h),a=h>0?t.length-4:t.length;var c=0;for(r=0,i=0;a>r;r+=4,i+=3)s=e(t.charAt(r))<<18|e(t.charAt(r+1))<<12|e(t.charAt(r+2))<<6|e(t.charAt(r+3)),n((16711680&s)>>16),n((65280&s)>>8),n(255&s);return 2===h?(s=e(t.charAt(r))<<2|e(t.charAt(r+1))>>4,n(255&s)):1===h&&(s=e(t.charAt(r))<<10|e(t.charAt(r+1))<<4|e(t.charAt(r+2))>>2,n(s>>8&255),n(255&s)),u}function i(t){function e(t){return r.charAt(t)}function n(t){return e(t>>18&63)+e(t>>12&63)+e(t>>6&63)+e(63&t)}var i,o,a,s=t.length%3,h="";for(i=0,a=t.length-s;a>i;i+=3)o=(t[i]<<16)+(t[i+1]<<8)+t[i+2],h+=n(o);switch(s){case 1:o=t[t.length-1],h+=e(o>>2),h+=e(o<<4&63),h+="==";break;case 2:o=(t[t.length-2]<<8)+t[t.length-1],h+=e(o>>10),h+=e(o>>4&63),h+=e(o<<2&63),h+="="}return h}var o="undefined"!=typeof Uint8Array?Uint8Array:Array,a="+".charCodeAt(0),s="/".charCodeAt(0),h="0".charCodeAt(0),u="a".charCodeAt(0),l="A".charCodeAt(0),c="-".charCodeAt(0),f="_".charCodeAt(0);t.toByteArray=n,t.fromByteArray=i}(e)},function(t,e,n){(function(e){(function(){var r,i;r=function(){function t(){}var n,r,o,a;return o=function(t,e){return(Array(e+1).join("0")+t).slice(-e)},r=/[\n\r\t\b\f\(\)\\]/g,n={"\n":"\\n","\r":"\\r","	":"\\t","\b":"\\b","\f":"\\f","\\":"\\\\","(":"\\(",")":"\\)"},a=function(t){var e,n,r,i,o;if(r=t.length,1&r)throw new Error("Buffer length must be even");for(n=i=0,o=r-1;o>i;n=i+=2)e=t[n],t[n]=t[n+1],t[n+1]=e;return t},t.convert=function(s){var h,u,l,c,f,d,p,g,v,m;if("string"==typeof s)return"/"+s;if(s instanceof String){for(p=s.replace(r,function(t){return n[t]}),l=!1,u=v=0,m=p.length;m>v;u=v+=1)if(p.charCodeAt(u)>127){l=!0;break}return l&&(p=a(new e("\ufeff"+p,"utf16le")).toString("binary")),"("+p+")"}if(e.isBuffer(s))return"<"+s.toString("hex")+">";if(s instanceof i)return s.toString();if(s instanceof Date)return"(D:"+o(s.getUTCFullYear(),4)+o(s.getUTCMonth(),2)+o(s.getUTCDate(),2)+o(s.getUTCHours(),2)+o(s.getUTCMinutes(),2)+o(s.getUTCSeconds(),2)+"Z)";if(Array.isArray(s))return c=function(){var e,n,r;for(r=[],e=0,n=s.length;n>e;e++)h=s[e],r.push(t.convert(h));return r}().join(" "),"["+c+"]";if("[object Object]"==={}.toString.call(s)){d=["<<"];for(f in s)g=s[f],d.push("/"+f+" "+t.convert(g));return d.push(">>"),d.join("\n")}return""+s},t}(),t.exports=r,i=n(12)}).call(this)}).call(e,n(4).Buffer)},function(t,e,n){"use strict";function r(t,e){var n={numeric:h,alphanumeric:u,octet:l},r={L:g,M:v,Q:m,H:y};e=e||{};var i=e.version||-1,o=r[(e.eccLevel||"L").toUpperCase()],a=e.mode?n[e.mode.toLowerCase()]:-1,s="mask"in e?e.mask:-1;if(0>a)a="string"==typeof t?t.match(f)?h:t.match(p)?u:l:l;else if(a!=h&&a!=u&&a!=l)throw"invalid or unsupported mode";if(t=P(a,t),null===t)throw"invalid data format";if(0>o||o>3)throw"invalid ECC level";if(0>i){for(i=1;40>=i&&!(t.length<=U(i,a,o));++i);if(i>40)throw"too large data for the Qr format"}else if(1>i||i>40)throw"invalid Qr version! should be between 1 and 40";if(-1!=s&&(0>s||s>8))throw"invalid mask";return Y(t,i,a,o,s)}function i(t,e){var n=[],i=t.background||"#fff",o=t.foreground||"#000",a=r(t,e),s=a.length,h=Math.floor(e.fit?e.fit/s:5),u=s*h;n.push({type:"rect",x:0,y:0,w:u,h:u,lineWidth:0,color:i});for(var l=0;s>l;++l)for(var c=0;s>c;++c)a[l][c]&&n.push({type:"rect",x:h*l,y:h*c,w:h,h:h,lineWidth:0,color:o});return{canvas:n,size:u}}function o(t){var e=i(t.qr,t);return t._canvas=e.canvas,t._width=t._height=t._minWidth=t._maxWidth=t._minHeight=t._maxHeight=e.size,t}for(var a=[null,[[10,7,17,13],[1,1,1,1],[]],[[16,10,28,22],[1,1,1,1],[4,16]],[[26,15,22,18],[1,1,2,2],[4,20]],[[18,20,16,26],[2,1,4,2],[4,24]],[[24,26,22,18],[2,1,4,4],[4,28]],[[16,18,28,24],[4,2,4,4],[4,32]],[[18,20,26,18],[4,2,5,6],[4,20,36]],[[22,24,26,22],[4,2,6,6],[4,22,40]],[[22,30,24,20],[5,2,8,8],[4,24,44]],[[26,18,28,24],[5,4,8,8],[4,26,48]],[[30,20,24,28],[5,4,11,8],[4,28,52]],[[22,24,28,26],[8,4,11,10],[4,30,56]],[[22,26,22,24],[9,4,16,12],[4,32,60]],[[24,30,24,20],[9,4,16,16],[4,24,44,64]],[[24,22,24,30],[10,6,18,12],[4,24,46,68]],[[28,24,30,24],[10,6,16,17],[4,24,48,72]],[[28,28,28,28],[11,6,19,16],[4,28,52,76]],[[26,30,28,28],[13,6,21,18],[4,28,54,80]],[[26,28,26,26],[14,7,25,21],[4,28,56,84]],[[26,28,28,30],[16,8,25,20],[4,32,60,88]],[[26,28,30,28],[17,8,25,23],[4,26,48,70,92]],[[28,28,24,30],[17,9,34,23],[4,24,48,72,96]],[[28,30,30,30],[18,9,30,25],[4,28,52,76,100]],[[28,30,30,30],[20,10,32,27],[4,26,52,78,104]],[[28,26,30,30],[21,12,35,29],[4,30,56,82,108]],[[28,28,30,28],[23,12,37,34],[4,28,56,84,112]],[[28,30,30,30],[25,12,40,34],[4,32,60,88,116]],[[28,30,30,30],[26,13,42,35],[4,24,48,72,96,120]],[[28,30,30,30],[28,14,45,38],[4,28,52,76,100,124]],[[28,30,30,30],[29,15,48,40],[4,24,50,76,102,128]],[[28,30,30,30],[31,16,51,43],[4,28,54,80,106,132]],[[28,30,30,30],[33,17,54,45],[4,32,58,84,110,136]],[[28,30,30,30],[35,18,57,48],[4,28,56,84,112,140]],[[28,30,30,30],[37,19,60,51],[4,32,60,88,116,144]],[[28,30,30,30],[38,19,63,53],[4,28,52,76,100,124,148]],[[28,30,30,30],[40,20,66,56],[4,22,48,74,100,126,152]],[[28,30,30,30],[43,21,70,59],[4,26,52,78,104,130,156]],[[28,30,30,30],[45,22,74,62],[4,30,56,82,108,134,160]],[[28,30,30,30],[47,24,77,65],[4,24,52,80,108,136,164]],[[28,30,30,30],[49,25,81,68],[4,28,56,84,112,140,168]]],s=0,h=1,u=2,l=4,c=8,f=/^\d*$/,d=/^[A-Za-z0-9 $%*+\-./:]*$/,p=/^[A-Z0-9 $%*+\-./:]*$/,g=1,v=0,m=3,y=2,w=[],_=[-1],b=0,x=1;255>b;++b)w.push(x),_[x]=b,x=2*x^(x>=128?285:0);for(var S=[[]],b=0;30>b;++b){for(var k=S[b],E=[],C=0;b>=C;++C){var I=b>C?w[k[C]]:0,A=w[(b+(k[C-1]||0))%255];E.push(_[I^A])}S.push(E)}for(var L={},b=0;45>b;++b)L["0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:".charAt(b)]=b;var R=[function(t,e){return(t+e)%2===0},function(t,e){return t%2===0},function(t,e){return e%3===0},function(t,e){return(t+e)%3===0},function(t,e){return((t/2|0)+(e/3|0))%2===0},function(t,e){return t*e%2+t*e%3===0},function(t,e){return(t*e%2+t*e%3)%2===0},function(t,e){return((t+e)%2+t*e%3)%2===0}],B=function(t){return t>6},T=function(t){return 4*t+17},M=function(t){var e=a[t],n=16*t*t+128*t+64;return B(t)&&(n-=36),e[2].length&&(n-=25*e[2].length*e[2].length-10*e[2].length-55),n},O=function(t,e){var n=-8&M(t),r=a[t];return n-=8*r[0][e]*r[1][e]},D=function(t,e){switch(e){case h:return 10>t?10:27>t?12:14;case u:return 10>t?9:27>t?11:13;case l:return 10>t?8:16;case c:return 10>t?8:27>t?10:12}},U=function(t,e,n){var r=O(t,n)-4-D(t,e);switch(e){case h:return 3*(r/10|0)+(4>r%10?0:7>r%10?1:2);case u:return 2*(r/11|0)+(6>r%11?0:1);case l:return r/8|0;case c:return r/13|0}},P=function(t,e){switch(t){case h:return e.match(f)?e:null;case u:return e.match(d)?e.toUpperCase():null;case l:if("string"==typeof e){for(var n=[],r=0;r<e.length;++r){var i=e.charCodeAt(r);128>i?n.push(i):2048>i?n.push(192|i>>6,128|63&i):65536>i?n.push(224|i>>12,128|i>>6&63,128|63&i):n.push(240|i>>18,128|i>>12&63,128|i>>6&63,128|63&i)}return n}return e}},F=function(t,e,n,r){var i=[],o=0,a=8,c=n.length,f=function(t,e){if(e>=a){for(i.push(o|t>>(e-=a));e>=8;)i.push(t>>(e-=8)&255);o=0,a=8}e>0&&(o|=(t&(1<<e)-1)<<(a-=e))},d=D(t,e);switch(f(e,4),f(c,d),e){case h:for(var p=2;c>p;p+=3)f(parseInt(n.substring(p-2,p+1),10),10);f(parseInt(n.substring(p-2),10),[0,4,7][c%3]);break;case u:for(var p=1;c>p;p+=2)f(45*L[n.charAt(p-1)]+L[n.charAt(p)],11);c%2==1&&f(L[n.charAt(p-1)],6);break;case l:for(var p=0;c>p;++p)f(n[p],8)}for(f(s,4),8>a&&i.push(o);i.length+1<r;)i.push(236,17);return i.length<r&&i.push(236),i},z=function(t,e){for(var n=t.slice(0),r=t.length,i=e.length,o=0;i>o;++o)n.push(0);for(var o=0;r>o;){var a=_[n[o++]];if(a>=0)for(var s=0;i>s;++s)n[o+s]^=w[(a+e[s])%255]}return n.slice(r)},W=function(t,e,n){for(var r=[],i=t.length/e|0,o=0,a=e-t.length%e,s=0;a>s;++s)r.push(o),o+=i;for(var s=a;e>s;++s)r.push(o),o+=i+1;r.push(o);for(var h=[],s=0;e>s;++s)h.push(z(t.slice(r[s],r[s+1]),n));for(var u=[],l=t.length/e|0,s=0;l>s;++s)for(var c=0;e>c;++c)u.push(t[r[c]+s]);for(var c=a;e>c;++c)u.push(t[r[c+1]-1]);for(var s=0;s<n.length;++s)for(var c=0;e>c;++c)u.push(h[c][s]);return u},N=function(t,e,n,r){for(var i=t<<r,o=e-1;o>=0;--o)i>>r+o&1&&(i^=n<<o);return t<<r|i},j=function(t){for(var e=a[t],n=T(t),r=[],i=[],o=0;n>o;++o)r.push([]),i.push([]);var s=function(t,e,n,o,a){for(var s=0;n>s;++s)for(var h=0;o>h;++h)r[t+s][e+h]=a[s]>>h&1,i[t+s][e+h]=1};s(0,0,9,9,[127,65,93,93,93,65,383,0,64]),s(n-8,0,8,9,[256,127,65,93,93,93,65,127]),s(0,n-8,9,8,[254,130,186,186,186,130,254,0,0]);for(var o=9;n-8>o;++o)r[6][o]=r[o][6]=1&~o,i[6][o]=i[o][6]=1;for(var h=e[2],u=h.length,o=0;u>o;++o)for(var l=0===o||o===u-1?1:0,c=0===o?u-1:u,f=l;c>f;++f)s(h[o],h[f],5,5,[31,17,21,17,31]);if(B(t))for(var d=N(t,6,7973,12),p=0,o=0;6>o;++o)for(var f=0;3>f;++f)r[o][n-11+f]=r[n-11+f][o]=d>>p++&1,i[o][n-11+f]=i[n-11+f][o]=1;return{matrix:r,reserved:i}},H=function(t,e,n){for(var r=t.length,i=0,o=-1,a=r-1;a>=0;a-=2){6==a&&--a;for(var s=0>o?r-1:0,h=0;r>h;++h){for(var u=a;u>a-2;--u)e[s][u]||(t[s][u]=n[i>>3]>>(7&~i)&1,++i);s+=o}o=-o}return t},Z=function(t,e,n){for(var r=R[n],i=t.length,o=0;i>o;++o)for(var a=0;i>a;++a)e[o][a]||(t[o][a]^=r(o,a));return t},G=function(t,e,n,r){for(var i=t.length,o=21522^N(n<<3|r,5,1335,10),a=0;15>a;++a){var s=[0,1,2,3,4,5,7,8,i-7,i-6,i-5,i-4,i-3,i-2,i-1][a],h=[i-1,i-2,i-3,i-4,i-5,i-6,i-7,i-8,7,5,4,3,2,1,0][a];t[s][8]=t[8][h]=o>>a&1}return t},q=function(t){for(var e=3,n=3,r=40,i=10,o=function(t){for(var n=0,i=0;i<t.length;++i)t[i]>=5&&(n+=e+(t[i]-5));for(var i=5;i<t.length;i+=2){var o=t[i];t[i-1]==o&&t[i-2]==3*o&&t[i-3]==o&&t[i-4]==o&&(t[i-5]>=4*o||t[i+1]>=4*o)&&(n+=r)}return n},a=t.length,s=0,h=0,u=0;a>u;++u){var l,c=t[u];l=[0];for(var f=0;a>f;){var d;for(d=0;a>f&&c[f];++d)++f;for(l.push(d),d=0;a>f&&!c[f];++d)++f;l.push(d)}s+=o(l),l=[0];for(var f=0;a>f;){var d;for(d=0;a>f&&t[f][u];++d)++f;for(l.push(d),d=0;a>f&&!t[f][u];++d)++f;l.push(d)}s+=o(l);var p=t[u+1]||[];h+=c[0];for(var f=1;a>f;++f){var g=c[f];h+=g,c[f-1]==g&&p[f]===g&&p[f-1]===g&&(s+=n)}}return s+=i*(Math.abs(h/a/a-.5)/.05|0)},Y=function(t,e,n,r,i){var o=a[e],s=F(e,n,t,O(e,r)>>3);s=W(s,o[1][r],S[o[0][r]]);var h=j(e),u=h.matrix,l=h.reserved;if(H(u,l,s),0>i){Z(u,l,0),G(u,l,r,0);var c=0,f=q(u);for(Z(u,l,0),i=1;8>i;++i){Z(u,l,i),G(u,l,r,i);var d=q(u);f>d&&(f=d,c=i),Z(u,l,i)}i=c}return Z(u,l,i),G(u,l,r,i),u};t.exports={measure:o}},function(t,e,n){(function(){var e;e=function(){function t(t){this.data=null!=t?t:[],this.pos=0,this.length=this.data.length}return t.prototype.readByte=function(){return this.data[this.pos++]},t.prototype.writeByte=function(t){return this.data[this.pos++]=t},t.prototype.byteAt=function(t){return this.data[t]},t.prototype.readBool=function(){return!!this.readByte()},t.prototype.writeBool=function(t){return this.writeByte(t?1:0)},t.prototype.readUInt32=function(){var t,e,n,r;return t=16777216*this.readByte(),e=this.readByte()<<16,n=this.readByte()<<8,r=this.readByte(),t+e+n+r},t.prototype.writeUInt32=function(t){return this.writeByte(t>>>24&255),this.writeByte(t>>16&255),this.writeByte(t>>8&255),this.writeByte(255&t)},t.prototype.readInt32=function(){var t;return t=this.readUInt32(),t>=2147483648?t-4294967296:t},t.prototype.writeInt32=function(t){return 0>t&&(t+=4294967296),this.writeUInt32(t)},t.prototype.readUInt16=function(){var t,e;return t=this.readByte()<<8,e=this.readByte(),t|e},t.prototype.writeUInt16=function(t){return this.writeByte(t>>8&255),this.writeByte(255&t)},t.prototype.readInt16=function(){var t;return t=this.readUInt16(),t>=32768?t-65536:t},t.prototype.writeInt16=function(t){return 0>t&&(t+=65536),this.writeUInt16(t)},t.prototype.readString=function(t){var e,n,r;for(n=[],e=r=0;t>=0?t>r:r>t;e=t>=0?++r:--r)n[e]=String.fromCharCode(this.readByte());return n.join("")},t.prototype.writeString=function(t){var e,n,r,i;for(i=[],e=n=0,r=t.length;r>=0?r>n:n>r;e=r>=0?++n:--n)i.push(this.writeByte(t.charCodeAt(e)));return i},t.prototype.stringAt=function(t,e){return this.pos=t,this.readString(e)},t.prototype.readShort=function(){return this.readInt16()},t.prototype.writeShort=function(t){return this.writeInt16(t)},t.prototype.readLongLong=function(){var t,e,n,r,i,o,a,s;return t=this.readByte(),e=this.readByte(),n=this.readByte(),r=this.readByte(),i=this.readByte(),o=this.readByte(),a=this.readByte(),s=this.readByte(),128&t?-1*(72057594037927940*(255^t)+281474976710656*(255^e)+1099511627776*(255^n)+4294967296*(255^r)+16777216*(255^i)+65536*(255^o)+256*(255^a)+(255^s)+1):72057594037927940*t+281474976710656*e+1099511627776*n+4294967296*r+16777216*i+65536*o+256*a+s},t.prototype.writeLongLong=function(t){var e,n;return e=Math.floor(t/4294967296),n=4294967295&t,this.writeByte(e>>24&255),this.writeByte(e>>16&255),this.writeByte(e>>8&255),this.writeByte(255&e),this.writeByte(n>>24&255),this.writeByte(n>>16&255),this.writeByte(n>>8&255),this.writeByte(255&n)},t.prototype.readInt=function(){return this.readInt32()},t.prototype.writeInt=function(t){return this.writeInt32(t)},t.prototype.slice=function(t,e){return this.data.slice(t,e)},t.prototype.read=function(t){var e,n,r;for(e=[],n=r=0;t>=0?t>r:r>t;n=t>=0?++r:--r)e.push(this.readByte());return e},t.prototype.write=function(t){var e,n,r,i;for(i=[],n=0,r=t.length;r>n;n++)e=t[n],i.push(this.writeByte(e));return i},t}(),t.exports=e}).call(this)},function(t,e,n){(function(){var e,r,i=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};r=n(10),e=function(){function t(t,n){var r,o,a;if(this.data=t,this.label=n,65496!==this.data.readUInt16BE(0))throw"SOI not found in JPEG";for(a=2;a<this.data.length&&(o=this.data.readUInt16BE(a),a+=2,!(i.call(e,o)>=0));)a+=this.data.readUInt16BE(a);if(i.call(e,o)<0)throw"Invalid JPEG.";a+=2,this.bits=this.data[a++],this.height=this.data.readUInt16BE(a),a+=2,this.width=this.data.readUInt16BE(a),a+=2,r=this.data[a++],this.colorSpace=function(){switch(r){case 1:return"DeviceGray";case 3:return"DeviceRGB";case 4:return"DeviceCMYK"}}(),this.obj=null}var e;return e=[65472,65473,65474,65475,65477,65478,65479,65480,65481,65482,65483,65484,65485,65486,65487],t.prototype.embed=function(t){return this.obj?void 0:(this.obj=t.ref({Type:"XObject",Subtype:"Image",BitsPerComponent:this.bits,Width:this.width,Height:this.height,ColorSpace:this.colorSpace,Filter:"DCTDecode"}),"DeviceCMYK"===this.colorSpace&&(this.obj.data.Decode=[1,0,1,0,1,0,1,0]),this.obj.end(this.data),this.data=null)},t}(),t.exports=e}).call(this)},function(t,e,n){(function(e){(function(){var r,i,o;o=n(45),r=n(51),i=function(){function t(t,e){this.label=e,this.image=new r(t),this.width=this.image.width,this.height=this.image.height,this.imgData=this.image.imgData,this.obj=null}return t.prototype.embed=function(t){var n,r,i,o,a,s,h,u;if(this.document=t,!this.obj){if(this.obj=t.ref({Type:"XObject",Subtype:"Image",BitsPerComponent:this.image.bits,Width:this.width,Height:this.height,Filter:"FlateDecode"}),this.image.hasAlphaChannel||(i=t.ref({Predictor:15,Colors:this.image.colors,BitsPerComponent:this.image.bits,Columns:this.width}),this.obj.data.DecodeParms=i,i.end()),0===this.image.palette.length?this.obj.data.ColorSpace=this.image.colorSpace:(r=t.ref(),r.end(new e(this.image.palette)),this.obj.data.ColorSpace=["Indexed","DeviceRGB",this.image.palette.length/3-1,r]),this.image.transparency.grayscale)return a=this.image.transparency.greyscale,this.obj.data.Mask=[a,a];if(this.image.transparency.rgb){for(o=this.image.transparency.rgb,n=[],h=0,u=o.length;u>h;h++)s=o[h],n.push(s,s);return this.obj.data.Mask=n}return this.image.transparency.indexed?this.loadIndexedAlphaChannel():this.image.hasAlphaChannel?this.splitAlphaChannel():this.finalize()}},t.prototype.finalize=function(){var t;return this.alphaChannel&&(t=this.document.ref({Type:"XObject",Subtype:"Image",Height:this.height,Width:this.width,BitsPerComponent:8,Filter:"FlateDecode",ColorSpace:"DeviceGray",Decode:[0,1]}),t.end(this.alphaChannel),this.obj.data.SMask=t),this.obj.end(this.imgData),this.image=null,this.imgData=null},t.prototype.splitAlphaChannel=function(){return this.image.decodePixels(function(t){return function(n){var r,i,a,s,h,u,l,c,f;for(a=t.image.colors*t.image.bits/8,f=t.width*t.height,u=new e(f*a),i=new e(f),h=c=r=0,l=n.length;l>h;)u[c++]=n[h++],u[c++]=n[h++],u[c++]=n[h++],i[r++]=n[h++];return s=0,o.deflate(u,function(e,n){if(t.imgData=n,e)throw e;return 2===++s?t.finalize():void 0}),o.deflate(i,function(e,n){if(t.alphaChannel=n,e)throw e;return 2===++s?t.finalize():void 0})}}(this))},t.prototype.loadIndexedAlphaChannel=function(t){var n;return n=this.image.transparency.indexed,this.image.decodePixels(function(t){return function(r){var i,a,s,h,u;for(i=new e(t.width*t.height),a=0,s=h=0,u=r.length;u>h;s=h+=1)i[a++]=n[r[s]];return o.deflate(i,function(e,n){if(t.alphaChannel=n,e)throw e;return t.finalize()})}}(this))},t}(),t.exports=i}).call(this)}).call(e,n(4).Buffer)},function(t,e,n){"use strict";function r(t,e){this.context=t,this.contextStack=[],this.tracker=e}function i(t,e,n){null===n||void 0===n||0>n||n>t.items.length?t.items.push(e):t.items.splice(n,0,e)}function o(t){var e=new a(t.maxWidth);for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}var a=n(24),s=n(25).pack,h=n(25).offsetVector,u=n(20);r.prototype.addLine=function(t,e,n){var r=t.getHeight(),o=this.context,a=o.getCurrentPage(),s=this.getCurrentPositionOnPage();return o.availableHeight<r||!a?!1:(t.x=o.x+(t.x||0),t.y=o.y+(t.y||0),this.alignLine(t),i(a,{type:"line",item:t},n),this.tracker.emit("lineAdded",t),e||o.moveDown(r),s)},r.prototype.alignLine=function(t){var e=this.context.availableWidth,n=t.getWidth(),r=t.inlines&&t.inlines.length>0&&t.inlines[0].alignment,i=0;switch(r){case"right":i=e-n;break;case"center":i=(e-n)/2}if(i&&(t.x=(t.x||0)+i),"justify"===r&&!t.newLineForced&&!t.lastLineInParagraph&&t.inlines.length>1)for(var o=(e-n)/(t.inlines.length-1),a=1,s=t.inlines.length;s>a;a++)i=a*o,t.inlines[a].x+=i},r.prototype.addImage=function(t,e){var n=this.context,r=n.getCurrentPage(),o=this.getCurrentPositionOnPage();return n.availableHeight<t._height||!r?!1:(t.x=n.x+(t.x||0),t.y=n.y,this.alignImage(t),i(r,{type:"image",item:t},e),n.moveDown(t._height),o)},r.prototype.addQr=function(t,e){var n=this.context,r=n.getCurrentPage(),i=this.getCurrentPositionOnPage();if(n.availableHeight<t._height||!r)return!1;t.x=n.x+(t.x||0),t.y=n.y,this.alignImage(t);for(var o=0,a=t._canvas.length;a>o;o++){var s=t._canvas[o];s.x+=t.x,s.y+=t.y,this.addVector(s,!0,!0,e)}return n.moveDown(t._height),i},r.prototype.alignImage=function(t){var e=this.context.availableWidth,n=t._minWidth,r=0;switch(t._alignment){case"right":r=e-n;break;case"center":r=(e-n)/2}r&&(t.x=(t.x||0)+r)},r.prototype.addVector=function(t,e,n,r){var o=this.context,a=o.getCurrentPage(),s=this.getCurrentPositionOnPage();return a?(h(t,e?0:o.x,n?0:o.y),i(a,{type:"vector",item:t},r),s):void 0},r.prototype.addFragment=function(t,e,n,r){var i=this.context,a=i.getCurrentPage();return!e&&t.height>i.availableHeight?!1:(t.items.forEach(function(r){switch(r.type){case"line":var u=o(r.item);u.x=(u.x||0)+(e?t.xOffset||0:i.x),u.y=(u.y||0)+(n?t.yOffset||0:i.y),a.items.push({type:"line",item:u});break;case"vector":var l=s(r.item);h(l,e?t.xOffset||0:i.x,n?t.yOffset||0:i.y),a.items.push({type:"vector",item:l});break;case"image":var c=s(r.item);c.x=(c.x||0)+(e?t.xOffset||0:i.x),c.y=(c.y||0)+(n?t.yOffset||0:i.y),a.items.push({type:"image",item:c})}}),r||i.moveDown(t.height),!0)},r.prototype.pushContext=function(t,e){void 0===t&&(e=this.context.getCurrentPage().height-this.context.pageMargins.top-this.context.pageMargins.bottom,t=this.context.availableWidth),("number"==typeof t||t instanceof Number)&&(t=new u({width:t,height:e},{left:0,right:0,top:0,bottom:0})),this.contextStack.push(this.context),this.context=t},r.prototype.popContext=function(){this.context=this.contextStack.pop()},r.prototype.getCurrentPositionOnPage=function(){return(this.contextStack[0]||this.context).getCurrentPosition()},t.exports=r},function(t,e,n){(function(){var e;e=function(){function t(t,r){var i;this.document=t,null==r&&(r={}),this.size=r.size||"letter",this.layout=r.layout||"portrait",this.margins="number"==typeof r.margin?{top:r.margin,left:r.margin,bottom:r.margin,right:r.margin}:r.margins||e,i=Array.isArray(this.size)?this.size:n[this.size.toUpperCase()],this.width=i["portrait"===this.layout?0:1],this.height=i["portrait"===this.layout?1:0],this.content=this.document.ref(),this.resources=this.document.ref({ProcSet:["PDF","Text","ImageB","ImageC","ImageI"]}),Object.defineProperties(this,{fonts:{get:function(t){return function(){
var e;return null!=(e=t.resources.data).Font?e.Font:e.Font={}}}(this)},xobjects:{get:function(t){return function(){var e;return null!=(e=t.resources.data).XObject?e.XObject:e.XObject={}}}(this)},ext_gstates:{get:function(t){return function(){var e;return null!=(e=t.resources.data).ExtGState?e.ExtGState:e.ExtGState={}}}(this)},patterns:{get:function(t){return function(){var e;return null!=(e=t.resources.data).Pattern?e.Pattern:e.Pattern={}}}(this)},annotations:{get:function(t){return function(){var e;return null!=(e=t.dictionary.data).Annots?e.Annots:e.Annots=[]}}(this)}}),this.dictionary=this.document.ref({Type:"Page",Parent:this.document._root.data.Pages,MediaBox:[0,0,this.width,this.height],Contents:this.content,Resources:this.resources})}var e,n;return t.prototype.maxY=function(){return this.height-this.margins.bottom},t.prototype.write=function(t){return this.content.write(t)},t.prototype.end=function(){return this.dictionary.end(),this.resources.end(),this.content.end()},e={top:72,left:72,bottom:72,right:72},n={"4A0":[4767.87,6740.79],"2A0":[3370.39,4767.87],A0:[2383.94,3370.39],A1:[1683.78,2383.94],A2:[1190.55,1683.78],A3:[841.89,1190.55],A4:[595.28,841.89],A5:[419.53,595.28],A6:[297.64,419.53],A7:[209.76,297.64],A8:[147.4,209.76],A9:[104.88,147.4],A10:[73.7,104.88],B0:[2834.65,4008.19],B1:[2004.09,2834.65],B2:[1417.32,2004.09],B3:[1000.63,1417.32],B4:[708.66,1000.63],B5:[498.9,708.66],B6:[354.33,498.9],B7:[249.45,354.33],B8:[175.75,249.45],B9:[124.72,175.75],B10:[87.87,124.72],C0:[2599.37,3676.54],C1:[1836.85,2599.37],C2:[1298.27,1836.85],C3:[918.43,1298.27],C4:[649.13,918.43],C5:[459.21,649.13],C6:[323.15,459.21],C7:[229.61,323.15],C8:[161.57,229.61],C9:[113.39,161.57],C10:[79.37,113.39],RA0:[2437.8,3458.27],RA1:[1729.13,2437.8],RA2:[1218.9,1729.13],RA3:[864.57,1218.9],RA4:[609.45,864.57],SRA0:[2551.18,3628.35],SRA1:[1814.17,2551.18],SRA2:[1275.59,1814.17],SRA3:[907.09,1275.59],SRA4:[637.8,907.09],EXECUTIVE:[521.86,756],FOLIO:[612,936],LEGAL:[612,1008],LETTER:[612,792],TABLOID:[792,1224]},t}(),t.exports=e}).call(this)},function(t,e,n){(function(){var e,r,i=[].slice;r=n(47),e=4*((Math.sqrt(2)-1)/3),t.exports={initVector:function(){return this._ctm=[1,0,0,1,0,0],this._ctmStack=[]},save:function(){return this._ctmStack.push(this._ctm.slice()),this.addContent("q")},restore:function(){return this._ctm=this._ctmStack.pop()||[1,0,0,1,0,0],this.addContent("Q")},closePath:function(){return this.addContent("h")},lineWidth:function(t){return this.addContent(""+t+" w")},_CAP_STYLES:{BUTT:0,ROUND:1,SQUARE:2},lineCap:function(t){return"string"==typeof t&&(t=this._CAP_STYLES[t.toUpperCase()]),this.addContent(""+t+" J")},_JOIN_STYLES:{MITER:0,ROUND:1,BEVEL:2},lineJoin:function(t){return"string"==typeof t&&(t=this._JOIN_STYLES[t.toUpperCase()]),this.addContent(""+t+" j")},miterLimit:function(t){return this.addContent(""+t+" M")},dash:function(t,e){var n,r,i;return null==e&&(e={}),null==t?this:(r=null!=(i=e.space)?i:t,n=e.phase||0,this.addContent("["+t+" "+r+"] "+n+" d"))},undash:function(){return this.addContent("[] 0 d")},moveTo:function(t,e){return this.addContent(""+t+" "+e+" m")},lineTo:function(t,e){return this.addContent(""+t+" "+e+" l")},bezierCurveTo:function(t,e,n,r,i,o){return this.addContent(""+t+" "+e+" "+n+" "+r+" "+i+" "+o+" c")},quadraticCurveTo:function(t,e,n,r){return this.addContent(""+t+" "+e+" "+n+" "+r+" v")},rect:function(t,e,n,r){return this.addContent(""+t+" "+e+" "+n+" "+r+" re")},roundedRect:function(t,e,n,r,i){return null==i&&(i=0),this.moveTo(t+i,e),this.lineTo(t+n-i,e),this.quadraticCurveTo(t+n,e,t+n,e+i),this.lineTo(t+n,e+r-i),this.quadraticCurveTo(t+n,e+r,t+n-i,e+r),this.lineTo(t+i,e+r),this.quadraticCurveTo(t,e+r,t,e+r-i),this.lineTo(t,e+i),this.quadraticCurveTo(t,e,t+i,e)},ellipse:function(t,n,r,i){var o,a,s,h,u,l;return null==i&&(i=r),t-=r,n-=i,o=r*e,a=i*e,s=t+2*r,u=n+2*i,h=t+r,l=n+i,this.moveTo(t,l),this.bezierCurveTo(t,l-a,h-o,n,h,n),this.bezierCurveTo(h+o,n,s,l-a,s,l),this.bezierCurveTo(s,l+a,h+o,u,h,u),this.bezierCurveTo(h-o,u,t,l+a,t,l),this.closePath()},circle:function(t,e,n){return this.ellipse(t,e,n)},polygon:function(){var t,e,n,r;for(e=1<=arguments.length?i.call(arguments,0):[],this.moveTo.apply(this,e.shift()),n=0,r=e.length;r>n;n++)t=e[n],this.lineTo.apply(this,t);return this.closePath()},path:function(t){return r.apply(this,t),this},_windingRule:function(t){return/even-?odd/.test(t)?"*":""},fill:function(t,e){return/(even-?odd)|(non-?zero)/.test(t)&&(e=t,t=null),t&&this.fillColor(t),this.addContent("f"+this._windingRule(e))},stroke:function(t){return t&&this.strokeColor(t),this.addContent("S")},fillAndStroke:function(t,e,n){var r;return null==e&&(e=t),r=/(even-?odd)|(non-?zero)/,r.test(t)&&(n=t,t=null),r.test(e)&&(n=e,e=t),t&&(this.fillColor(t),this.strokeColor(e)),this.addContent("B"+this._windingRule(n))},clip:function(t){return this.addContent("W"+this._windingRule(t)+" n")},transform:function(t,e,n,r,i,o){var a,s,h,u,l,c,f,d,p;return a=this._ctm,s=a[0],h=a[1],u=a[2],l=a[3],c=a[4],f=a[5],a[0]=s*t+u*e,a[1]=h*t+l*e,a[2]=s*n+u*r,a[3]=h*n+l*r,a[4]=s*i+u*o+c,a[5]=h*i+l*o+f,p=function(){var a,s,h,u;for(h=[t,e,n,r,i,o],u=[],a=0,s=h.length;s>a;a++)d=h[a],u.push(+d.toFixed(5));return u}().join(" "),this.addContent(""+p+" cm")},translate:function(t,e){return this.transform(1,0,0,1,t,e)},rotate:function(t,e){var n,r,i,o,a,s,h,u;return null==e&&(e={}),r=t*Math.PI/180,n=Math.cos(r),i=Math.sin(r),o=s=0,null!=e.origin&&(u=e.origin,o=u[0],s=u[1],a=o*n-s*i,h=o*i+s*n,o-=a,s-=h),this.transform(n,i,-i,n,o,s)},scale:function(t,e,n){var r,i,o;return null==e&&(e=t),null==n&&(n={}),2===arguments.length&&(e=t,n=e),r=i=0,null!=n.origin&&(o=n.origin,r=o[0],i=o[1],r-=t*r,i-=e*i),this.transform(t,0,0,e,r,i)}}}).call(this)},function(t,e,n){(function(){var e;e=n(48),t.exports={initText:function(){return this.x=0,this.y=0,this._lineGap=0},lineGap:function(t){return this._lineGap=t,this},moveDown:function(t){return null==t&&(t=1),this.y+=this.currentLineHeight(!0)*t+this._lineGap,this},moveUp:function(t){return null==t&&(t=1),this.y-=this.currentLineHeight(!0)*t+this._lineGap,this},_text:function(t,n,r,i,o){var a,s,h,u,l;if(i=this._initOptions(n,r,i),t=""+t,i.wordSpacing&&(t=t.replace(/\s{2,}/g," ")),i.width)s=this._wrapper,s||(s=new e(this,i),s.on("line",o)),this._wrapper=i.continued?s:null,this._textOptions=i.continued?i:null,s.wrap(t,i);else for(l=t.split("\n"),h=0,u=l.length;u>h;h++)a=l[h],o(a,i);return this},text:function(t,e,n,r){return this._text(t,e,n,r,this._line.bind(this))},widthOfString:function(t,e){return null==e&&(e={}),this._font.widthOfString(t,this._fontSize)+(e.characterSpacing||0)*(t.length-1)},heightOfString:function(t,e){var n,r,i,o;return null==e&&(e={}),i=this.x,o=this.y,e=this._initOptions(e),e.height=1/0,r=e.lineGap||this._lineGap||0,this._text(t,this.x,this.y,e,function(t){return function(e,n){return t.y+=t.currentLineHeight(!0)+r}}(this)),n=this.y-o,this.x=i,this.y=o,n},list:function(t,n,r,i,o){var a,s,h,u,l,c,f,d;return i=this._initOptions(n,r,i),d=Math.round(this._font.ascender/1e3*this._fontSize/3),h=i.textIndent||5*d,u=i.bulletIndent||8*d,c=1,l=[],f=[],a=function(t){var e,n,r,i,o;for(o=[],e=r=0,i=t.length;i>r;e=++r)n=t[e],Array.isArray(n)?(c++,a(n),o.push(c--)):(l.push(n),o.push(f.push(c)));return o},a(t),o=new e(this,i),o.on("line",this._line.bind(this)),c=1,s=0,o.on("firstLine",function(t){return function(){var e,n;return(n=f[s++])!==c&&(e=u*(n-c),t.x+=e,o.lineWidth-=e,c=n),t.circle(t.x-h+d,t.y+d+d/2,d),t.fill()}}(this)),o.on("sectionStart",function(t){return function(){var e;return e=h+u*(c-1),t.x+=e,o.lineWidth-=e}}(this)),o.on("sectionEnd",function(t){return function(){var e;return e=h+u*(c-1),t.x-=e,o.lineWidth+=e}}(this)),o.wrap(l.join("\n"),i),this},_initOptions:function(t,e,n){var r,i,o,a;if(null==t&&(t={}),null==n&&(n={}),"object"==typeof t&&(n=t,t=null),n=function(){var t,e,r;e={};for(t in n)r=n[t],e[t]=r;return e}(),this._textOptions){a=this._textOptions;for(r in a)o=a[r],"continued"!==r&&null==n[r]&&(n[r]=o)}return null!=t&&(this.x=t),null!=e&&(this.y=e),n.lineBreak!==!1&&(i=this.page.margins,null==n.width&&(n.width=this.page.width-this.x-i.right)),n.columns||(n.columns=0),null==n.columnGap&&(n.columnGap=18),n},_line:function(t,e,n){var r;return null==e&&(e={}),this._fragment(t,this.x,this.y,e),r=e.lineGap||this._lineGap||0,n?this.y+=this.currentLineHeight(!0)+r:this.x+=this.widthOfString(t)},_fragment:function(t,e,n,r){var i,o,a,s,h,u,l,c,f,d,p,g,v,m,y,w,_,b,x;if(t=""+t,0!==t.length){if(i=r.align||"left",m=r.wordSpacing||0,o=r.characterSpacing||0,r.width)switch(i){case"right":g=this.widthOfString(t.replace(/\s+$/,""),r),e+=r.lineWidth-g;break;case"center":e+=r.lineWidth/2-r.textWidth/2;break;case"justify":y=t.trim().split(/\s+/),g=this.widthOfString(t.replace(/\s+/g,""),r),p=this.widthOfString(" ")+o,m=Math.max(0,(r.lineWidth-g)/Math.max(1,y.length-1)-p)}if(d=r.textWidth+m*(r.wordCount-1)+o*(t.length-1),r.link&&this.link(e,n,d,this.currentLineHeight(),r.link),(r.underline||r.strike)&&(this.save(),r.stroke||this.strokeColor.apply(this,this._fillColor),l=this._fontSize<10?.5:Math.floor(this._fontSize/10),this.lineWidth(l),s=r.underline?1:2,c=n+this.currentLineHeight()/s,r.underline&&(c-=l),this.moveTo(e,c),this.lineTo(e+d,c),this.stroke(),this.restore()),this.save(),this.transform(1,0,0,-1,0,this.page.height),n=this.page.height-n-this._font.ascender/1e3*this._fontSize,null==(w=this.page.fonts)[x=this._font.id]&&(w[x]=this._font.ref()),this._font.use(t),this.addContent("BT"),this.addContent(""+e+" "+n+" Td"),this.addContent("/"+this._font.id+" "+this._fontSize+" Tf"),f=r.fill&&r.stroke?2:r.stroke?1:0,f&&this.addContent(""+f+" Tr"),o&&this.addContent(""+o+" Tc"),m){for(y=t.trim().split(/\s+/),m+=this.widthOfString(" ")+o,m*=1e3/this._fontSize,a=[],_=0,b=y.length;b>_;_++)v=y[_],h=this._font.encode(v),h=function(){var t,e,n;for(n=[],u=t=0,e=h.length;e>t;u=t+=1)n.push(h.charCodeAt(u).toString(16));return n}().join(""),a.push("<"+h+"> "+-m);this.addContent("["+a.join(" ")+"] TJ")}else h=this._font.encode(t),h=function(){var t,e,n;for(n=[],u=t=0,e=h.length;e>t;u=t+=1)n.push(h.charCodeAt(u).toString(16));return n}().join(""),this.addContent("<"+h+"> Tj");return this.addContent("ET"),this.restore()}}}}).call(this)},function(t,e,n){(function(){var e,r,i,o,a;a=n(49),e=a.PDFGradient,r=a.PDFLinearGradient,i=a.PDFRadialGradient,t.exports={initColor:function(){return this._opacityRegistry={},this._opacityCount=0,this._gradCount=0},_normalizeColor:function(t){var n,r;return t instanceof e?t:("string"==typeof t&&("#"===t.charAt(0)?(4===t.length&&(t=t.replace(/#([0-9A-F])([0-9A-F])([0-9A-F])/i,"#$1$1$2$2$3$3")),n=parseInt(t.slice(1),16),t=[n>>16,n>>8&255,255&n]):o[t]&&(t=o[t])),Array.isArray(t)?(3===t.length?t=function(){var e,n,i;for(i=[],e=0,n=t.length;n>e;e++)r=t[e],i.push(r/255);return i}():4===t.length&&(t=function(){var e,n,i;for(i=[],e=0,n=t.length;n>e;e++)r=t[e],i.push(r/100);return i}()),t):null)},_setColor:function(t,n){var r,i,o,a;return(t=this._normalizeColor(t))?(this._sMasked&&(r=this.ref({Type:"ExtGState",SMask:"None"}),r.end(),i="Gs"+ ++this._opacityCount,this.page.ext_gstates[i]=r,this.addContent("/"+i+" gs"),this._sMasked=!1),o=n?"SCN":"scn",t instanceof e?(this._setColorSpace("Pattern",n),t.apply(o)):(a=4===t.length?"DeviceCMYK":"DeviceRGB",this._setColorSpace(a,n),t=t.join(" "),this.addContent(""+t+" "+o)),!0):!1},_setColorSpace:function(t,e){var n;return n=e?"CS":"cs",this.addContent("/"+t+" "+n)},fillColor:function(t,e){var n;return null==e&&(e=1),n=this._setColor(t,!1),n&&this.fillOpacity(e),this._fillColor=[t,e],this},strokeColor:function(t,e){var n;return null==e&&(e=1),n=this._setColor(t,!0),n&&this.strokeOpacity(e),this},opacity:function(t){return this._doOpacity(t,t),this},fillOpacity:function(t){return this._doOpacity(t,null),this},strokeOpacity:function(t){return this._doOpacity(null,t),this},_doOpacity:function(t,e){var n,r,i,o,a;if(null!=t||null!=e)return null!=t&&(t=Math.max(0,Math.min(1,t))),null!=e&&(e=Math.max(0,Math.min(1,e))),i=""+t+"_"+e,this._opacityRegistry[i]?(a=this._opacityRegistry[i],n=a[0],o=a[1]):(n={Type:"ExtGState"},null!=t&&(n.ca=t),null!=e&&(n.CA=e),n=this.ref(n),n.end(),r=++this._opacityCount,o="Gs"+r,this._opacityRegistry[i]=[n,o]),this.page.ext_gstates[o]=n,this.addContent("/"+o+" gs")},linearGradient:function(t,e,n,i){return new r(this,t,e,n,i)},radialGradient:function(t,e,n,r,o,a){return new i(this,t,e,n,r,o,a)}},o={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],grey:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]}}).call(this)},function(t,e,n){(function(e){(function(){var r;r=n(17),t.exports={initImages:function(){return this._imageRegistry={},this._imageCount=0},image:function(t,n,i,o){var a,s,h,u,l,c,f,d,p,g,v,m,y,w;return null==o&&(o={}),"object"==typeof n&&(o=n,n=null),n=null!=(m=null!=n?n:o.x)?m:this.x,i=null!=(y=null!=i?i:o.y)?y:this.y,e.isBuffer(t)||(c=this._imageRegistry[t]),c||(c=r.open(t,"I"+ ++this._imageCount),c.embed(this),e.isBuffer(t)||(this._imageRegistry[t]=c)),null==(g=this.page.xobjects)[v=c.label]&&(g[v]=c.obj),d=o.width||c.width,u=o.height||c.height,o.width&&!o.height?(p=d/c.width,d=c.width*p,u=c.height*p):o.height&&!o.width?(l=u/c.height,d=c.width*l,u=c.height*l):o.scale?(d=c.width*o.scale,u=c.height*o.scale):o.fit&&(w=o.fit,h=w[0],a=w[1],s=h/a,f=c.width/c.height,f>s?(d=h,u=h/f):(u=a,d=a*f),"center"===o.align?n=n+h/2-d/2:"right"===o.align&&(n=n+h-d),"center"===o.valign?i=i+a/2-u/2:"bottom"===o.valign&&(i=i+a-u)),this.y===i&&(this.y+=u),this.save(),this.transform(d,0,0,-u,n,i+u),this.addContent("/"+c.label+" Do"),this.restore(),this}}}).call(this)}).call(e,n(4).Buffer)},function(t,e,n){(function(){t.exports={annotate:function(t,e,n,r,i){var o,a,s;i.Type="Annot",i.Rect=this._convertRect(t,e,n,r),i.Border=[0,0,0],"Link"!==i.Subtype&&null==i.C&&(i.C=this._normalizeColor(i.color||[0,0,0])),delete i.color,"string"==typeof i.Dest&&(i.Dest=new String(i.Dest));for(o in i)s=i[o],i[o[0].toUpperCase()+o.slice(1)]=s;return a=this.ref(i),this.page.annotations.push(a),a.end(),this},note:function(t,e,n,r,i,o){return null==o&&(o={}),o.Subtype="Text",o.Contents=new String(i),o.Name="Comment",null==o.color&&(o.color=[243,223,92]),this.annotate(t,e,n,r,o)},link:function(t,e,n,r,i,o){return null==o&&(o={}),o.Subtype="Link",o.A=this.ref({S:"URI",URI:new String(i)}),o.A.end(),this.annotate(t,e,n,r,o)},_markup:function(t,e,n,r,i){var o,a,s,h,u;return null==i&&(i={}),u=this._convertRect(t,e,n,r),o=u[0],s=u[1],a=u[2],h=u[3],i.QuadPoints=[o,h,a,h,o,s,a,s],i.Contents=new String,this.annotate(t,e,n,r,i)},highlight:function(t,e,n,r,i){return null==i&&(i={}),i.Subtype="Highlight",null==i.color&&(i.color=[241,238,148]),this._markup(t,e,n,r,i)},underline:function(t,e,n,r,i){return null==i&&(i={}),i.Subtype="Underline",this._markup(t,e,n,r,i)},strike:function(t,e,n,r,i){return null==i&&(i={}),i.Subtype="StrikeOut",this._markup(t,e,n,r,i)},lineAnnotation:function(t,e,n,r,i){return null==i&&(i={}),i.Subtype="Line",i.Contents=new String,i.L=[t,this.page.height-e,n,this.page.height-r],this.annotate(t,e,n,r,i)},rectAnnotation:function(t,e,n,r,i){return null==i&&(i={}),i.Subtype="Square",i.Contents=new String,this.annotate(t,e,n,r,i)},ellipseAnnotation:function(t,e,n,r,i){return null==i&&(i={}),i.Subtype="Circle",i.Contents=new String,this.annotate(t,e,n,r,i)},textAnnotation:function(t,e,n,r,i,o){return null==o&&(o={}),o.Subtype="FreeText",o.Contents=new String(i),o.DA=new String,this.annotate(t,e,n,r,o)},_convertRect:function(t,e,n,r){var i,o,a,s,h,u,l,c,f;return c=e,e+=r,l=t+n,f=this._ctm,i=f[0],o=f[1],a=f[2],s=f[3],h=f[4],u=f[5],t=i*t+a*e+h,e=o*t+s*e+u,l=i*l+a*c+h,c=o*l+s*c+u,[t,e,l,c]}}}).call(this)},function(t,e,n){(function(){var e;e=n(52),t.exports={initFonts:function(){this._fontFamilies={},this._fontCount=0,this._fontSize=12,this._font=null,this._registeredFonts={}},font:function(t,n,r){var i,o,a,s;return"number"==typeof n&&(r=n,n=null),"string"==typeof t&&this._registeredFonts[t]?(i=t,s=this._registeredFonts[t],t=s.src,n=s.family):(i=n||t,"string"!=typeof i&&(i=null)),null!=r&&this.fontSize(r),(o=this._fontFamilies[i])?(this._font=o,this):(a="F"+ ++this._fontCount,this._font=new e(this,t,n,a),(o=this._fontFamilies[this._font.name])?(this._font=o,this):(i&&(this._fontFamilies[i]=this._font),this._fontFamilies[this._font.name]=this._font,this))},fontSize:function(t){return this._fontSize=t,this},currentLineHeight:function(t){return null==t&&(t=!1),this._font.lineHeight(this._fontSize,t)},registerFont:function(t,e,n){return this._registeredFonts[t]={src:e,family:n},this}}}).call(this)},function(t,e,n){(function(t,r){function i(e,n,r){function i(){for(var t;null!==(t=e.read());)s.push(t),h+=t.length;e.once("readable",i)}function o(t){e.removeListener("end",a),e.removeListener("readable",i),r(t)}function a(){var n=t.concat(s,h);s=[],r(null,n),e.close()}var s=[],h=0;e.on("error",o),e.on("end",a),e.end(n),i()}function o(e,n){if("string"==typeof n&&(n=new t(n)),!t.isBuffer(n))throw new TypeError("Not a string or buffer");var r=g.Z_FINISH;return e._processChunk(n,r)}function a(t){return this instanceof a?void d.call(this,t,g.DEFLATE):new a(t)}function s(t){return this instanceof s?void d.call(this,t,g.INFLATE):new s(t)}function h(t){return this instanceof h?void d.call(this,t,g.GZIP):new h(t)}function u(t){return this instanceof u?void d.call(this,t,g.GUNZIP):new u(t)}function l(t){return this instanceof l?void d.call(this,t,g.DEFLATERAW):new l(t)}function c(t){return this instanceof c?void d.call(this,t,g.INFLATERAW):new c(t)}function f(t){return this instanceof f?void d.call(this,t,g.UNZIP):new f(t)}function d(n,r){if(this._opts=n=n||{},this._chunkSize=n.chunkSize||e.Z_DEFAULT_CHUNK,p.call(this,n),n.flush&&n.flush!==g.Z_NO_FLUSH&&n.flush!==g.Z_PARTIAL_FLUSH&&n.flush!==g.Z_SYNC_FLUSH&&n.flush!==g.Z_FULL_FLUSH&&n.flush!==g.Z_FINISH&&n.flush!==g.Z_BLOCK)throw new Error("Invalid flush flag: "+n.flush);if(this._flushFlag=n.flush||g.Z_NO_FLUSH,n.chunkSize&&(n.chunkSize<e.Z_MIN_CHUNK||n.chunkSize>e.Z_MAX_CHUNK))throw new Error("Invalid chunk size: "+n.chunkSize);if(n.windowBits&&(n.windowBits<e.Z_MIN_WINDOWBITS||n.windowBits>e.Z_MAX_WINDOWBITS))throw new Error("Invalid windowBits: "+n.windowBits);if(n.level&&(n.level<e.Z_MIN_LEVEL||n.level>e.Z_MAX_LEVEL))throw new Error("Invalid compression level: "+n.level);if(n.memLevel&&(n.memLevel<e.Z_MIN_MEMLEVEL||n.memLevel>e.Z_MAX_MEMLEVEL))throw new Error("Invalid memLevel: "+n.memLevel);if(n.strategy&&n.strategy!=e.Z_FILTERED&&n.strategy!=e.Z_HUFFMAN_ONLY&&n.strategy!=e.Z_RLE&&n.strategy!=e.Z_FIXED&&n.strategy!=e.Z_DEFAULT_STRATEGY)throw new Error("Invalid strategy: "+n.strategy);if(n.dictionary&&!t.isBuffer(n.dictionary))throw new Error("Invalid dictionary: it should be a Buffer instance");this._binding=new g.Zlib(r);var i=this;this._hadError=!1,this._binding.onerror=function(t,n){i._binding=null,i._hadError=!0;var r=new Error(t);r.errno=n,r.code=e.codes[n],i.emit("error",r)};var o=e.Z_DEFAULT_COMPRESSION;"number"==typeof n.level&&(o=n.level);var a=e.Z_DEFAULT_STRATEGY;"number"==typeof n.strategy&&(a=n.strategy),this._binding.init(n.windowBits||e.Z_DEFAULT_WINDOWBITS,o,n.memLevel||e.Z_DEFAULT_MEMLEVEL,a,n.dictionary),this._buffer=new t(this._chunkSize),this._offset=0,this._closed=!1,this._level=o,this._strategy=a,this.once("end",this.close)}var p=n(55),g=n(50),v=n(60),m=n(53).ok;g.Z_MIN_WINDOWBITS=8,g.Z_MAX_WINDOWBITS=15,g.Z_DEFAULT_WINDOWBITS=15,g.Z_MIN_CHUNK=64,g.Z_MAX_CHUNK=1/0,g.Z_DEFAULT_CHUNK=16384,g.Z_MIN_MEMLEVEL=1,g.Z_MAX_MEMLEVEL=9,g.Z_DEFAULT_MEMLEVEL=8,g.Z_MIN_LEVEL=-1,g.Z_MAX_LEVEL=9,g.Z_DEFAULT_LEVEL=g.Z_DEFAULT_COMPRESSION,Object.keys(g).forEach(function(t){t.match(/^Z/)&&(e[t]=g[t])}),e.codes={Z_OK:g.Z_OK,Z_STREAM_END:g.Z_STREAM_END,Z_NEED_DICT:g.Z_NEED_DICT,Z_ERRNO:g.Z_ERRNO,Z_STREAM_ERROR:g.Z_STREAM_ERROR,Z_DATA_ERROR:g.Z_DATA_ERROR,Z_MEM_ERROR:g.Z_MEM_ERROR,Z_BUF_ERROR:g.Z_BUF_ERROR,Z_VERSION_ERROR:g.Z_VERSION_ERROR},Object.keys(e.codes).forEach(function(t){e.codes[e.codes[t]]=t}),e.Deflate=a,e.Inflate=s,e.Gzip=h,e.Gunzip=u,e.DeflateRaw=l,e.InflateRaw=c,e.Unzip=f,e.createDeflate=function(t){return new a(t)},e.createInflate=function(t){return new s(t)},e.createDeflateRaw=function(t){return new l(t)},e.createInflateRaw=function(t){return new c(t)},e.createGzip=function(t){return new h(t)},e.createGunzip=function(t){return new u(t)},e.createUnzip=function(t){return new f(t)},e.deflate=function(t,e,n){return"function"==typeof e&&(n=e,e={}),i(new a(e),t,n)},e.deflateSync=function(t,e){return o(new a(e),t)},e.gzip=function(t,e,n){return"function"==typeof e&&(n=e,e={}),i(new h(e),t,n)},e.gzipSync=function(t,e){return o(new h(e),t)},e.deflateRaw=function(t,e,n){return"function"==typeof e&&(n=e,e={}),i(new l(e),t,n)},e.deflateRawSync=function(t,e){return o(new l(e),t)},e.unzip=function(t,e,n){return"function"==typeof e&&(n=e,e={}),i(new f(e),t,n)},e.unzipSync=function(t,e){return o(new f(e),t)},e.inflate=function(t,e,n){return"function"==typeof e&&(n=e,e={}),i(new s(e),t,n)},e.inflateSync=function(t,e){return o(new s(e),t)},e.gunzip=function(t,e,n){return"function"==typeof e&&(n=e,e={}),i(new u(e),t,n)},e.gunzipSync=function(t,e){return o(new u(e),t)},e.inflateRaw=function(t,e,n){return"function"==typeof e&&(n=e,e={}),i(new c(e),t,n)},e.inflateRawSync=function(t,e){return o(new c(e),t)},v.inherits(d,p),d.prototype.params=function(t,n,i){if(t<e.Z_MIN_LEVEL||t>e.Z_MAX_LEVEL)throw new RangeError("Invalid compression level: "+t);if(n!=e.Z_FILTERED&&n!=e.Z_HUFFMAN_ONLY&&n!=e.Z_RLE&&n!=e.Z_FIXED&&n!=e.Z_DEFAULT_STRATEGY)throw new TypeError("Invalid strategy: "+n);if(this._level!==t||this._strategy!==n){var o=this;this.flush(g.Z_SYNC_FLUSH,function(){o._binding.params(t,n),o._hadError||(o._level=t,o._strategy=n,i&&i())})}else r.nextTick(i)},d.prototype.reset=function(){return this._binding.reset()},d.prototype._flush=function(e){this._transform(new t(0),"",e)},d.prototype.flush=function(e,n){var i=this._writableState;if(("function"==typeof e||void 0===e&&!n)&&(n=e,e=g.Z_FULL_FLUSH),i.ended)n&&r.nextTick(n);else if(i.ending)n&&this.once("end",n);else if(i.needDrain){var o=this;this.once("drain",function(){o.flush(n)})}else this._flushFlag=e,this.write(new t(0),"",n)},d.prototype.close=function(t){if(t&&r.nextTick(t),!this._closed){this._closed=!0,this._binding.close();var e=this;r.nextTick(function(){e.emit("close")})}},d.prototype._transform=function(e,n,r){var i,o=this._writableState,a=o.ending||o.ended,s=a&&(!e||o.length===e.length);if(null===!e&&!t.isBuffer(e))return r(new Error("invalid input"));s?i=g.Z_FINISH:(i=this._flushFlag,e.length>=o.length&&(this._flushFlag=this._opts.flush||g.Z_NO_FLUSH));this._processChunk(e,i,r)},d.prototype._processChunk=function(e,n,r){function i(l,d){if(!h._hadError){var p=a-d;if(m(p>=0,"have should not go down"),p>0){var g=h._buffer.slice(h._offset,h._offset+p);h._offset+=p,u?h.push(g):(c.push(g),f+=g.length)}if((0===d||h._offset>=h._chunkSize)&&(a=h._chunkSize,h._offset=0,h._buffer=new t(h._chunkSize)),0===d){if(s+=o-l,o=l,!u)return!0;var v=h._binding.write(n,e,s,o,h._buffer,h._offset,h._chunkSize);return v.callback=i,void(v.buffer=e)}return u?void r():!1}}var o=e&&e.length,a=this._chunkSize-this._offset,s=0,h=this,u="function"==typeof r;if(!u){var l,c=[],f=0;this.on("error",function(t){l=t});do var d=this._binding.writeSync(n,e,s,o,this._buffer,this._offset,a);while(!this._hadError&&i(d[0],d[1]));if(this._hadError)throw l;var p=t.concat(c,f);return this.close(),p}var g=this._binding.write(n,e,s,o,this._buffer,this._offset,a);g.buffer=e,g.callback=i},v.inherits(a,d),v.inherits(s,d),v.inherits(h,d),v.inherits(u,d),v.inherits(l,d),v.inherits(c,d),v.inherits(f,d)}).call(e,n(4).Buffer,n(61))},function(t,e,n){function r(){i.call(this)}t.exports=r;var i=n(54).EventEmitter,o=n(62);o(r,i),r.Readable=n(56),r.Writable=n(57),r.Duplex=n(58),r.Transform=n(55),r.PassThrough=n(59),r.Stream=r,r.prototype.pipe=function(t,e){function n(e){t.writable&&!1===t.write(e)&&u.pause&&u.pause()}function r(){u.readable&&u.resume&&u.resume()}function o(){l||(l=!0,t.end())}function a(){l||(l=!0,"function"==typeof t.destroy&&t.destroy())}function s(t){if(h(),0===i.listenerCount(this,"error"))throw t}function h(){u.removeListener("data",n),t.removeListener("drain",r),u.removeListener("end",o),u.removeListener("close",a),u.removeListener("error",s),t.removeListener("error",s),u.removeListener("end",h),u.removeListener("close",h),t.removeListener("close",h)}var u=this;u.on("data",n),t.on("drain",r),t._isStdio||e&&e.end===!1||(u.on("end",o),u.on("close",a));var l=!1;return u.on("error",s),t.on("error",s),u.on("end",h),u.on("close",h),t.on("close",h),t.emit("pipe",u),t}},function(t,e,n){(function(){var e;e=function(){function t(){}var e,n,r,i,o,a,s,h,u,l,c,f,d;return t.apply=function(t,n){var r;return r=a(n),e(r,t)},o={A:7,a:7,C:6,c:6,H:1,h:1,L:2,l:2,M:2,m:2,Q:4,q:4,S:4,s:4,T:2,t:2,V:1,v:1,Z:0,z:0},a=function(t){var e,n,r,i,a,s,h,u,l;for(h=[],e=[],i="",a=!1,s=0,u=0,l=t.length;l>u;u++)if(n=t[u],null!=o[n])s=o[n],r&&(i.length>0&&(e[e.length]=+i),h[h.length]={cmd:r,args:e},e=[],i="",a=!1),r=n;else if(" "===n||","===n||"-"===n&&i.length>0&&"e"!==i[i.length-1]||"."===n&&a){if(0===i.length)continue;e.length===s?(h[h.length]={cmd:r,args:e},e=[+i],"M"===r&&(r="L"),"m"===r&&(r="l")):e[e.length]=+i,a="."===n,i="-"===n||"."===n?n:""}else i+=n,"."===n&&(a=!0);return i.length>0&&(e.length===s?(h[h.length]={cmd:r,args:e},e=[+i],"M"===r&&(r="L"),"m"===r&&(r="l")):e[e.length]=+i),h[h.length]={cmd:r,args:e},h},r=i=s=h=f=d=0,e=function(t,e){var n,o,a,l,c;for(r=i=s=h=f=d=0,o=a=0,l=t.length;l>a;o=++a)n=t[o],"function"==typeof u[c=n.cmd]&&u[c](e,n.args);return r=i=s=h=0},u={M:function(t,e){return r=e[0],i=e[1],s=h=null,f=r,d=i,t.moveTo(r,i)},m:function(t,e){return r+=e[0],i+=e[1],s=h=null,f=r,d=i,t.moveTo(r,i)},C:function(t,e){return r=e[4],i=e[5],s=e[2],h=e[3],t.bezierCurveTo.apply(t,e)},c:function(t,e){return t.bezierCurveTo(e[0]+r,e[1]+i,e[2]+r,e[3]+i,e[4]+r,e[5]+i),s=r+e[2],h=i+e[3],r+=e[4],i+=e[5]},S:function(t,e){return null===s&&(s=r,h=i),t.bezierCurveTo(r-(s-r),i-(h-i),e[0],e[1],e[2],e[3]),s=e[0],h=e[1],r=e[2],i=e[3]},s:function(t,e){return null===s&&(s=r,h=i),t.bezierCurveTo(r-(s-r),i-(h-i),r+e[0],i+e[1],r+e[2],i+e[3]),s=r+e[0],h=i+e[1],r+=e[2],i+=e[3]},Q:function(t,e){return s=e[0],h=e[1],r=e[2],i=e[3],t.quadraticCurveTo(e[0],e[1],r,i)},q:function(t,e){return t.quadraticCurveTo(e[0]+r,e[1]+i,e[2]+r,e[3]+i),s=r+e[0],h=i+e[1],r+=e[2],i+=e[3]},T:function(t,e){return null===s?(s=r,h=i):(s=r-(s-r),h=i-(h-i)),t.quadraticCurveTo(s,h,e[0],e[1]),s=r-(s-r),h=i-(h-i),r=e[0],i=e[1]},t:function(t,e){return null===s?(s=r,h=i):(s=r-(s-r),h=i-(h-i)),t.quadraticCurveTo(s,h,r+e[0],i+e[1]),r+=e[0],i+=e[1]},A:function(t,e){return c(t,r,i,e),r=e[5],i=e[6]},a:function(t,e){return e[5]+=r,e[6]+=i,c(t,r,i,e),r=e[5],i=e[6]},L:function(t,e){return r=e[0],i=e[1],s=h=null,t.lineTo(r,i)},l:function(t,e){return r+=e[0],i+=e[1],s=h=null,t.lineTo(r,i)},H:function(t,e){return r=e[0],s=h=null,t.lineTo(r,i)},h:function(t,e){return r+=e[0],s=h=null,t.lineTo(r,i)},V:function(t,e){return i=e[0],s=h=null,t.lineTo(r,i)},v:function(t,e){return i+=e[0],s=h=null,t.lineTo(r,i)},Z:function(t){return t.closePath(),r=f,i=d},z:function(t){return t.closePath(),r=f,i=d}},c=function(t,e,r,i){var o,a,s,h,u,c,f,d,p,g,v,m,y;for(c=i[0],f=i[1],u=i[2],h=i[3],g=i[4],a=i[5],s=i[6],p=n(a,s,c,f,h,g,u,e,r),y=[],v=0,m=p.length;m>v;v++)d=p[v],o=l.apply(null,d),y.push(t.bezierCurveTo.apply(t,o));return y},n=function(t,e,n,r,i,o,a,u,l){var c,f,d,p,g,v,m,y,w,_,b,x,S,k,E,C,I,A,L,R,B,T,M,O,D,U;for(k=a*(Math.PI/180),S=Math.sin(k),g=Math.cos(k),n=Math.abs(n),r=Math.abs(r),s=g*(u-t)*.5+S*(l-e)*.5,h=g*(l-e)*.5-S*(u-t)*.5,y=s*s/(n*n)+h*h/(r*r),y>1&&(y=Math.sqrt(y),n*=y,r*=y),c=g/n,f=S/n,d=-S/r,p=g/r,R=c*u+f*l,M=d*u+p*l,B=c*t+f*e,O=d*t+p*e,v=(B-R)*(B-R)+(O-M)*(O-M),x=1/v-.25,0>x&&(x=0),b=Math.sqrt(x),o===i&&(b=-b),T=.5*(R+B)-b*(O-M),D=.5*(M+O)+b*(B-R),E=Math.atan2(M-D,R-T),C=Math.atan2(O-D,B-T),L=C-E,0>L&&1===o?L+=2*Math.PI:L>0&&0===o&&(L-=2*Math.PI),_=Math.ceil(Math.abs(L/(.5*Math.PI+.001))),w=[],m=U=0;_>=0?_>U:U>_;m=_>=0?++U:--U)I=E+m*L/_,A=E+(m+1)*L/_,w[m]=[T,D,I,A,n,r,S,g];return w},l=function(t,e,n,r,i,o,a,s){var h,u,l,c,f,d,p,g,v,m,y,w;return h=s*i,u=-a*o,l=a*i,c=s*o,d=.5*(r-n),f=8/3*Math.sin(.5*d)*Math.sin(.5*d)/Math.sin(d),p=t+Math.cos(n)-f*Math.sin(n),m=e+Math.sin(n)+f*Math.cos(n),v=t+Math.cos(r),w=e+Math.sin(r),g=v+f*Math.sin(r),y=w-f*Math.cos(r),[h*p+u*m,l*p+c*m,h*g+u*y,l*g+c*y,h*v+u*w,l*v+c*w]},t}(),t.exports=e}).call(this)},function(t,e,n){(function(){var e,r,i,o={}.hasOwnProperty,a=function(t,e){function n(){this.constructor=t}for(var r in e)o.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,
t};e=n(54).EventEmitter,r=n(66),i=function(t){function e(t,e){var n;this.document=t,this.indent=e.indent||0,this.characterSpacing=e.characterSpacing||0,this.wordSpacing=0===e.wordSpacing,this.columns=e.columns||1,this.columnGap=null!=(n=e.columnGap)?n:18,this.lineWidth=(e.width-this.columnGap*(this.columns-1))/this.columns,this.spaceLeft=this.lineWidth,this.startX=this.document.x,this.startY=this.document.y,this.column=1,this.ellipsis=e.ellipsis,this.continuedX=0,null!=e.height?(this.height=e.height,this.maxY=this.startY+e.height):this.maxY=this.document.page.maxY(),this.on("firstLine",function(t){return function(e){var n;return n=t.continuedX||t.indent,t.document.x+=n,t.lineWidth-=n,t.once("line",function(){return t.document.x-=n,t.lineWidth+=n,e.continued&&!t.continuedX&&(t.continuedX=t.indent),e.continued?void 0:t.continuedX=0})}}(this)),this.on("lastLine",function(t){return function(e){var n;return n=e.align,"justify"===n&&(e.align="left"),t.lastLine=!0,t.once("line",function(){return t.document.y+=e.paragraphGap||0,e.align=n,t.lastLine=!1})}}(this))}return a(e,t),e.prototype.wordWidth=function(t){return this.document.widthOfString(t,this)+this.characterSpacing+this.wordSpacing},e.prototype.eachWord=function(t,e){var n,i,o,a,s,h,u,l,c,f;for(i=new r(t),s=null,f={};n=i.nextBreak();){if(c=t.slice((null!=s?s.position:void 0)||0,n.position),l=null!=f[c]?f[c]:f[c]=this.wordWidth(c),l>this.lineWidth+this.continuedX)for(h=s,o={};c.length;){for(a=c.length;l>this.spaceLeft;)l=this.wordWidth(c.slice(0,--a));if(o.required=a<c.length,u=e(c.slice(0,a),l,o,h),h={required:!1},c=c.slice(a),l=this.wordWidth(c),u===!1)break}else u=e(c,l,n,s);if(u===!1)break;s=n}},e.prototype.wrap=function(t,e){var n,r,i,o,a,s,h;return null!=e.indent&&(this.indent=e.indent),null!=e.characterSpacing&&(this.characterSpacing=e.characterSpacing),null!=e.wordSpacing&&(this.wordSpacing=e.wordSpacing),null!=e.ellipsis&&(this.ellipsis=e.ellipsis),o=this.document.y+this.document.currentLineHeight(!0),(this.document.y>this.maxY||o>this.maxY)&&this.nextSection(),n="",a=0,s=0,i=0,h=this.document.y,r=function(t){return function(){return e.textWidth=a+t.wordSpacing*(s-1),e.wordCount=s,e.lineWidth=t.lineWidth,h=t.document.y,t.emit("line",n,e,t),i++}}(this),this.emit("sectionStart",e,this),this.eachWord(t,function(t){return function(i,o,h,u){var l,c;if((null==u||u.required)&&(t.emit("firstLine",e,t),t.spaceLeft=t.lineWidth),o<=t.spaceLeft&&(n+=i,a+=o,s++),h.required||o>t.spaceLeft){if(h.required&&t.emit("lastLine",e,t),l=t.document.currentLineHeight(!0),null!=t.height&&t.ellipsis&&t.document.y+2*l>t.maxY&&t.column>=t.columns){for(t.ellipsis===!0&&(t.ellipsis="…"),n=n.replace(/\s+$/,""),a=t.wordWidth(n+t.ellipsis);a>t.lineWidth;)n=n.slice(0,-1).replace(/\s+$/,""),a=t.wordWidth(n+t.ellipsis);n+=t.ellipsis}return r(),t.document.y+l>t.maxY&&(c=t.nextSection(),!c)?(s=0,n="",!1):h.required?(o>t.spaceLeft&&(n=i,a=o,s=1,r()),t.spaceLeft=t.lineWidth,n="",a=0,s=0):(t.spaceLeft=t.lineWidth-o,n=i,a=o,s=1)}return t.spaceLeft-=o}}(this)),s>0&&(this.emit("lastLine",e,this),r()),this.emit("sectionEnd",e,this),e.continued===!0?(i>1&&(this.continuedX=0),this.continuedX+=e.textWidth,this.document.y=h):this.document.x=this.startX},e.prototype.nextSection=function(t){var e;if(this.emit("sectionEnd",t,this),++this.column>this.columns){if(null!=this.height)return!1;this.document.addPage(),this.column=1,this.startY=this.document.page.margins.top,this.maxY=this.document.page.maxY(),this.document.x=this.startX,this.document._fillColor&&(e=this.document).fillColor.apply(e,this.document._fillColor),this.emit("pageBreak",t,this)}else this.document.x+=this.lineWidth+this.columnGap,this.document.y=this.startY,this.emit("columnBreak",t,this);return this.emit("sectionStart",t,this),!0},e}(e),t.exports=i}).call(this)},function(t,e,n){(function(){var e,n,r,i={}.hasOwnProperty,o=function(t,e){function n(){this.constructor=t}for(var r in e)i.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};e=function(){function t(t){this.doc=t,this.stops=[],this.embedded=!1,this.transform=[1,0,0,1,0,0],this._colorSpace="DeviceRGB"}return t.prototype.stop=function(t,e,n){return null==n&&(n=1),n=Math.max(0,Math.min(1,n)),this.stops.push([t,this.doc._normalizeColor(e),n]),this},t.prototype.embed=function(){var t,e,n,r,i,o,a,s,h,u,l,c,f,d,p,g,v,m,y,w,_,b,x,S,k,E,C,I,A,L,R,B,T,M,O,D;if(!this.embedded&&0!==this.stops.length){for(this.embedded=!0,l=this.stops[this.stops.length-1],l[0]<1&&this.stops.push([1,l[1],l[2]]),t=[],r=[],A=[],u=R=0,M=this.stops.length-1;M>=0?M>R:R>M;u=M>=0?++R:--R)r.push(0,1),u+2!==this.stops.length&&t.push(this.stops[u+1][0]),i=this.doc.ref({FunctionType:2,Domain:[0,1],C0:this.stops[u+0][1],C1:this.stops[u+1][1],N:1}),A.push(i),i.end();if(1===A.length?i=A[0]:(i=this.doc.ref({FunctionType:3,Domain:[0,1],Functions:A,Bounds:t,Encode:r}),i.end()),this.id="Sh"+ ++this.doc._gradCount,c=this.doc._ctm.slice(),f=c[0],d=c[1],v=c[2],w=c[3],_=c[4],b=c[5],O=this.transform,p=O[0],g=O[1],m=O[2],y=O[3],e=O[4],n=O[5],c[0]=f*p+v*g,c[1]=d*p+w*g,c[2]=f*m+v*y,c[3]=d*m+w*y,c[4]=f*e+v*n+_,c[5]=d*e+w*n+b,C=this.shader(i),C.end(),S=this.doc.ref({Type:"Pattern",PatternType:2,Shading:C,Matrix:function(){var t,e,n;for(n=[],t=0,e=c.length;e>t;t++)L=c[t],n.push(+L.toFixed(5));return n}()}),this.doc.page.patterns[this.id]=S,S.end(),this.stops.some(function(t){return t[2]<1})){for(a=this.opacityGradient(),a._colorSpace="DeviceGray",D=this.stops,B=0,T=D.length;T>B;B++)I=D[B],a.stop(I[0],[I[2]]);a=a.embed(),s=this.doc.ref({Type:"Group",S:"Transparency",CS:"DeviceGray"}),s.end(),k=this.doc.ref({ProcSet:["PDF","Text","ImageB","ImageC","ImageI"],Shading:{Sh1:a.data.Shading}}),k.end(),o=this.doc.ref({Type:"XObject",Subtype:"Form",FormType:1,BBox:[0,0,this.doc.page.width,this.doc.page.height],Group:s,Resources:k}),o.end("/Sh1 sh"),E=this.doc.ref({Type:"Mask",S:"Luminosity",G:o}),E.end(),h=this.doc.ref({Type:"ExtGState",SMask:E}),this.opacity_id=++this.doc._opacityCount,x="Gs"+this.opacity_id,this.doc.page.ext_gstates[x]=h,h.end()}return S}},t.prototype.apply=function(t){return this.embedded||this.embed(),this.doc.addContent("/"+this.id+" "+t),this.opacity_id?(this.doc.addContent("/Gs"+this.opacity_id+" gs"),this.doc._sMasked=!0):void 0},t}(),n=function(t){function e(t,n,r,i,o){this.doc=t,this.x1=n,this.y1=r,this.x2=i,this.y2=o,e.__super__.constructor.apply(this,arguments)}return o(e,t),e.prototype.shader=function(t){return this.doc.ref({ShadingType:2,ColorSpace:this._colorSpace,Coords:[this.x1,this.y1,this.x2,this.y2],Function:t,Extend:[!0,!0]})},e.prototype.opacityGradient=function(){return new e(this.doc,this.x1,this.y1,this.x2,this.y2)},e}(e),r=function(t){function e(t,n,r,i,o,a,s){this.doc=t,this.x1=n,this.y1=r,this.r1=i,this.x2=o,this.y2=a,this.r2=s,e.__super__.constructor.apply(this,arguments)}return o(e,t),e.prototype.shader=function(t){return this.doc.ref({ShadingType:3,ColorSpace:this._colorSpace,Coords:[this.x1,this.y1,this.r1,this.x2,this.y2,this.r2],Function:t,Extend:[!0,!0]})},e.prototype.opacityGradient=function(){return new e(this.doc,this.x1,this.y1,this.r1,this.x2,this.y2,this.r2)},e}(e),t.exports={PDFGradient:e,PDFLinearGradient:n,PDFRadialGradient:r}}).call(this)},function(t,e,n){(function(t,r){function i(t){if(t<e.DEFLATE||t>e.UNZIP)throw new TypeError("Bad argument");this.mode=t,this.init_done=!1,this.write_in_progress=!1,this.pending_close=!1,this.windowBits=0,this.level=0,this.memLevel=0,this.strategy=0,this.dictionary=null}function o(t,e){for(var n=0;n<t.length;n++)this[e+n]=t[n]}var a=n(73),s=n(77),h=n(74),u=n(75),l=n(76);for(var c in l)e[c]=l[c];e.NONE=0,e.DEFLATE=1,e.INFLATE=2,e.GZIP=3,e.GUNZIP=4,e.DEFLATERAW=5,e.INFLATERAW=6,e.UNZIP=7,i.prototype.init=function(t,n,r,i,o){switch(this.windowBits=t,this.level=n,this.memLevel=r,this.strategy=i,(this.mode===e.GZIP||this.mode===e.GUNZIP)&&(this.windowBits+=16),this.mode===e.UNZIP&&(this.windowBits+=32),(this.mode===e.DEFLATERAW||this.mode===e.INFLATERAW)&&(this.windowBits=-this.windowBits),this.strm=new s,this.mode){case e.DEFLATE:case e.GZIP:case e.DEFLATERAW:var a=h.deflateInit2(this.strm,this.level,e.Z_DEFLATED,this.windowBits,this.memLevel,this.strategy);break;case e.INFLATE:case e.GUNZIP:case e.INFLATERAW:case e.UNZIP:var a=u.inflateInit2(this.strm,this.windowBits);break;default:throw new Error("Unknown mode "+this.mode)}return a!==e.Z_OK?void this._error(a):(this.write_in_progress=!1,void(this.init_done=!0))},i.prototype.params=function(){throw new Error("deflateParams Not supported")},i.prototype._writeCheck=function(){if(!this.init_done)throw new Error("write before init");if(this.mode===e.NONE)throw new Error("already finalized");if(this.write_in_progress)throw new Error("write already in progress");if(this.pending_close)throw new Error("close is pending")},i.prototype.write=function(e,n,r,i,o,a,s){this._writeCheck(),this.write_in_progress=!0;var h=this;return t.nextTick(function(){h.write_in_progress=!1;var t=h._write(e,n,r,i,o,a,s);h.callback(t[0],t[1]),h.pending_close&&h.close()}),this},i.prototype.writeSync=function(t,e,n,r,i,o,a){return this._writeCheck(),this._write(t,e,n,r,i,o,a)},i.prototype._write=function(t,n,i,a,s,l,c){if(this.write_in_progress=!0,t!==e.Z_NO_FLUSH&&t!==e.Z_PARTIAL_FLUSH&&t!==e.Z_SYNC_FLUSH&&t!==e.Z_FULL_FLUSH&&t!==e.Z_FINISH&&t!==e.Z_BLOCK)throw new Error("Invalid flush value");null==n&&(n=new r(0),a=0,i=0),s.set=s._set?s._set:o;var f=this.strm;switch(f.avail_in=a,f.input=n,f.next_in=i,f.avail_out=c,f.output=s,f.next_out=l,this.mode){case e.DEFLATE:case e.GZIP:case e.DEFLATERAW:var d=h.deflate(f,t);break;case e.UNZIP:case e.INFLATE:case e.GUNZIP:case e.INFLATERAW:var d=u.inflate(f,t);break;default:throw new Error("Unknown mode "+this.mode)}return d!==e.Z_STREAM_END&&d!==e.Z_OK&&this._error(d),this.write_in_progress=!1,[f.avail_in,f.avail_out]},i.prototype.close=function(){return this.write_in_progress?void(this.pending_close=!0):(this.pending_close=!1,this.mode===e.DEFLATE||this.mode===e.GZIP||this.mode===e.DEFLATERAW?h.deflateEnd(this.strm):u.inflateEnd(this.strm),void(this.mode=e.NONE))},i.prototype.reset=function(){switch(this.mode){case e.DEFLATE:case e.DEFLATERAW:var t=h.deflateReset(this.strm);break;case e.INFLATE:case e.INFLATERAW:var t=u.inflateReset(this.strm)}t!==e.Z_OK&&this._error(t)},i.prototype._error=function(t){this.onerror(a[t]+": "+this.strm.msg,t),this.write_in_progress=!1,this.pending_close&&this.close()},e.Zlib=i}).call(e,n(61),n(4).Buffer)},function(t,e,n){(function(e){(function(){var r,i,o;i=n(10),o=n(45),t.exports=r=function(){function t(t){var n,r,i,o,a,s,h,u,l,c,f;for(this.data=t,this.pos=8,this.palette=[],this.imgData=[],this.transparency={},this.text={};;){switch(n=this.readUInt32(),s=function(){var t,e;for(e=[],i=t=0;4>t;i=++t)e.push(String.fromCharCode(this.data[this.pos++]));return e}.call(this).join("")){case"IHDR":this.width=this.readUInt32(),this.height=this.readUInt32(),this.bits=this.data[this.pos++],this.colorType=this.data[this.pos++],this.compressionMethod=this.data[this.pos++],this.filterMethod=this.data[this.pos++],this.interlaceMethod=this.data[this.pos++];break;case"PLTE":this.palette=this.read(n);break;case"IDAT":for(i=l=0;n>l;i=l+=1)this.imgData.push(this.data[this.pos++]);break;case"tRNS":switch(this.transparency={},this.colorType){case 3:if(this.transparency.indexed=this.read(n),h=255-this.transparency.indexed.length,h>0)for(i=c=0;h>=0?h>c:c>h;i=h>=0?++c:--c)this.transparency.indexed.push(255);break;case 0:this.transparency.grayscale=this.read(n)[0];break;case 2:this.transparency.rgb=this.read(n)}break;case"tEXt":u=this.read(n),o=u.indexOf(0),a=String.fromCharCode.apply(String,u.slice(0,o)),this.text[a]=String.fromCharCode.apply(String,u.slice(o+1));break;case"IEND":return this.colors=function(){switch(this.colorType){case 0:case 3:case 4:return 1;case 2:case 6:return 3}}.call(this),this.hasAlphaChannel=4===(f=this.colorType)||6===f,r=this.colors+(this.hasAlphaChannel?1:0),this.pixelBitlength=this.bits*r,this.colorSpace=function(){switch(this.colors){case 1:return"DeviceGray";case 3:return"DeviceRGB"}}.call(this),void(this.imgData=new e(this.imgData));default:this.pos+=n}if(this.pos+=4,this.pos>this.data.length)throw new Error("Incomplete or corrupt PNG file")}}return t.decode=function(e,n){return i.readFile(e,function(e,r){var i;return i=new t(r),i.decode(function(t){return n(t)})})},t.load=function(e){var n;return n=i.readFileSync(e),new t(n)},t.prototype.read=function(t){var e,n,r;for(r=[],e=n=0;t>=0?t>n:n>t;e=t>=0?++n:--n)r.push(this.data[this.pos++]);return r},t.prototype.readUInt32=function(){var t,e,n,r;return t=this.data[this.pos++]<<24,e=this.data[this.pos++]<<16,n=this.data[this.pos++]<<8,r=this.data[this.pos++],t|e|n|r},t.prototype.readUInt16=function(){var t,e;return t=this.data[this.pos++]<<8,e=this.data[this.pos++],t|e},t.prototype.decodePixels=function(t){var n=this;return o.inflate(this.imgData,function(r,i){var o,a,s,h,u,l,c,f,d,p,g,v,m,y,w,_,b,x,S,k,E,C,I;if(r)throw r;for(v=n.pixelBitlength/8,_=v*n.width,m=new e(_*n.height),l=i.length,w=0,y=0,a=0;l>y;){switch(i[y++]){case 0:for(h=S=0;_>S;h=S+=1)m[a++]=i[y++];break;case 1:for(h=k=0;_>k;h=k+=1)o=i[y++],u=v>h?0:m[a-v],m[a++]=(o+u)%256;break;case 2:for(h=E=0;_>E;h=E+=1)o=i[y++],s=(h-h%v)/v,b=w&&m[(w-1)*_+s*v+h%v],m[a++]=(b+o)%256;break;case 3:for(h=C=0;_>C;h=C+=1)o=i[y++],s=(h-h%v)/v,u=v>h?0:m[a-v],b=w&&m[(w-1)*_+s*v+h%v],m[a++]=(o+Math.floor((u+b)/2))%256;break;case 4:for(h=I=0;_>I;h=I+=1)o=i[y++],s=(h-h%v)/v,u=v>h?0:m[a-v],0===w?b=x=0:(b=m[(w-1)*_+s*v+h%v],x=s&&m[(w-1)*_+(s-1)*v+h%v]),c=u+b-x,f=Math.abs(c-u),p=Math.abs(c-b),g=Math.abs(c-x),d=p>=f&&g>=f?u:g>=p?b:x,m[a++]=(o+d)%256;break;default:throw new Error("Invalid filter algorithm: "+i[y-1])}w++}return t(m)})},t.prototype.decodePalette=function(){var t,n,r,i,o,a,s,h,u,l;for(i=this.palette,s=this.transparency.indexed||[],a=new e(s.length+i.length),o=0,r=i.length,t=0,n=h=0,u=i.length;u>h;n=h+=3)a[o++]=i[n],a[o++]=i[n+1],a[o++]=i[n+2],a[o++]=null!=(l=s[t++])?l:255;return a},t.prototype.copyToImageData=function(t,e){var n,r,i,o,a,s,h,u,l,c,f;if(r=this.colors,l=null,n=this.hasAlphaChannel,this.palette.length&&(l=null!=(f=this._decodedPalette)?f:this._decodedPalette=this.decodePalette(),r=4,n=!0),i=(null!=t?t.data:void 0)||t,u=i.length,a=l||e,o=s=0,1===r)for(;u>o;)h=l?4*e[o/4]:s,c=a[h++],i[o++]=c,i[o++]=c,i[o++]=c,i[o++]=n?a[h++]:255,s=h;else for(;u>o;)h=l?4*e[o/4]:s,i[o++]=a[h++],i[o++]=a[h++],i[o++]=a[h++],i[o++]=n?a[h++]:255,s=h},t.prototype.decode=function(t){var n,r=this;return n=new e(this.width*this.height*4),this.decodePixels(function(e){return r.copyToImageData(n,e),t(n)})},t}()}).call(this)}).call(e,n(4).Buffer)},function(t,e,n){(function(e,r){(function(){var i,o,a,s,h;s=n(64),i=n(63),a=n(65),h=n(10),o=function(){function t(t,r,o,h){if(this.document=t,this.id=h,"string"==typeof r){if(r in n)return this.isAFM=!0,this.font=new i(n[r]()),void this.registerAFM(r);if(/\.(ttf|ttc)$/i.test(r))this.font=s.open(r,o);else{if(!/\.dfont$/i.test(r))throw new Error("Not a supported font format or standard PDF font.");this.font=s.fromDFont(r,o)}}else if(e.isBuffer(r))this.font=s.fromBuffer(r,o);else if(r instanceof Uint8Array)this.font=s.fromBuffer(new e(r),o);else{if(!(r instanceof ArrayBuffer))throw new Error("Not a supported font format or standard PDF font.");this.font=s.fromBuffer(new e(new Uint8Array(r)),o)}this.subset=new a(this.font),this.registerTTF()}var n,o;return n={Courier:function(){return h.readFileSync(r+"/font/data/Courier.afm","utf8")},"Courier-Bold":function(){return h.readFileSync(r+"/font/data/Courier-Bold.afm","utf8")},"Courier-Oblique":function(){return h.readFileSync(r+"/font/data/Courier-Oblique.afm","utf8")},"Courier-BoldOblique":function(){return h.readFileSync(r+"/font/data/Courier-BoldOblique.afm","utf8")},Helvetica:function(){return h.readFileSync(r+"/font/data/Helvetica.afm","utf8")},"Helvetica-Bold":function(){return h.readFileSync(r+"/font/data/Helvetica-Bold.afm","utf8")},"Helvetica-Oblique":function(){return h.readFileSync(r+"/font/data/Helvetica-Oblique.afm","utf8")},"Helvetica-BoldOblique":function(){return h.readFileSync(r+"/font/data/Helvetica-BoldOblique.afm","utf8")},"Times-Roman":function(){return h.readFileSync(r+"/font/data/Times-Roman.afm","utf8")},"Times-Bold":function(){return h.readFileSync(r+"/font/data/Times-Bold.afm","utf8")},"Times-Italic":function(){return h.readFileSync(r+"/font/data/Times-Italic.afm","utf8")},"Times-BoldItalic":function(){return h.readFileSync(r+"/font/data/Times-BoldItalic.afm","utf8")},Symbol:function(){return h.readFileSync(r+"/font/data/Symbol.afm","utf8")},ZapfDingbats:function(){return h.readFileSync(r+"/font/data/ZapfDingbats.afm","utf8")}},t.prototype.use=function(t){var e;return null!=(e=this.subset)?e.use(t):void 0},t.prototype.embed=function(){return this.embedded||null==this.dictionary?void 0:(this.isAFM?this.embedAFM():this.embedTTF(),this.embedded=!0)},t.prototype.encode=function(t){var e;return this.isAFM?this.font.encodeText(t):(null!=(e=this.subset)?e.encodeText(t):void 0)||t},t.prototype.ref=function(){return null!=this.dictionary?this.dictionary:this.dictionary=this.document.ref()},t.prototype.registerTTF=function(){var t,e,n,r,i;if(this.name=this.font.name.postscriptName,this.scaleFactor=1e3/this.font.head.unitsPerEm,this.bbox=function(){var e,n,r,i;for(r=this.font.bbox,i=[],e=0,n=r.length;n>e;e++)t=r[e],i.push(Math.round(t*this.scaleFactor));return i}.call(this),this.stemV=0,this.font.post.exists?(r=this.font.post.italic_angle,e=r>>16,n=255&r,e&!0&&(e=-((65535^e)+1)),this.italicAngle=+(""+e+"."+n)):this.italicAngle=0,this.ascender=Math.round(this.font.ascender*this.scaleFactor),this.decender=Math.round(this.font.decender*this.scaleFactor),this.lineGap=Math.round(this.font.lineGap*this.scaleFactor),this.capHeight=this.font.os2.exists&&this.font.os2.capHeight||this.ascender,this.xHeight=this.font.os2.exists&&this.font.os2.xHeight||0,this.familyClass=(this.font.os2.exists&&this.font.os2.familyClass||0)>>8,this.isSerif=1===(i=this.familyClass)||2===i||3===i||4===i||5===i||7===i,this.isScript=10===this.familyClass,this.flags=0,this.font.post.isFixedPitch&&(this.flags|=1),this.isSerif&&(this.flags|=2),this.isScript&&(this.flags|=8),0!==this.italicAngle&&(this.flags|=64),this.flags|=32,!this.font.cmap.unicode)throw new Error("No unicode cmap for font")},t.prototype.embedTTF=function(){var t,e,n,r,i,a,s,h;return r=this.subset.encode(),s=this.document.ref(),s.write(r),s.data.Length1=s.uncompressedLength,s.end(),i=this.document.ref({Type:"FontDescriptor",FontName:this.subset.postscriptName,FontFile2:s,FontBBox:this.bbox,Flags:this.flags,StemV:this.stemV,ItalicAngle:this.italicAngle,Ascent:this.ascender,Descent:this.decender,CapHeight:this.capHeight,XHeight:this.xHeight}),i.end(),a=+Object.keys(this.subset.cmap)[0],t=function(){var t,e;t=this.subset.cmap,e=[];for(n in t)h=t[n],e.push(Math.round(this.font.widthOfGlyph(h)));return e}.call(this),e=this.document.ref(),e.end(o(this.subset.subset)),this.dictionary.data={Type:"Font",BaseFont:this.subset.postscriptName,Subtype:"TrueType",FontDescriptor:i,FirstChar:a,LastChar:a+t.length-1,Widths:t,Encoding:"MacRomanEncoding",ToUnicode:e},this.dictionary.end()},o=function(t){var e,n,r,i,o,a,s;for(o="/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<00><ff>\nendcodespacerange",n=Object.keys(t).sort(function(t,e){return t-e}),r=[],a=0,s=n.length;s>a;a++)e=n[a],r.length>=100&&(o+="\n"+r.length+" beginbfchar\n"+r.join("\n")+"\nendbfchar",r=[]),i=("0000"+t[e].toString(16)).slice(-4),e=(+e).toString(16),r.push("<"+e+"><"+i+">");return r.length&&(o+="\n"+r.length+" beginbfchar\n"+r.join("\n")+"\nendbfchar\n"),o+="endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend"},t.prototype.registerAFM=function(t){var e;return this.name=t,e=this.font,this.ascender=e.ascender,this.decender=e.decender,this.bbox=e.bbox,this.lineGap=e.lineGap,e},t.prototype.embedAFM=function(){return this.dictionary.data={Type:"Font",BaseFont:this.name,Subtype:"Type1",Encoding:"WinAnsiEncoding"},this.dictionary.end()},t.prototype.widthOfString=function(t,e){var n,r,i,o,a,s;for(t=""+t,o=0,r=a=0,s=t.length;s>=0?s>a:a>s;r=s>=0?++a:--a)n=t.charCodeAt(r),o+=this.font.widthOfGlyph(this.font.characterToGlyph(n))||0;return i=e/1e3,o*i},t.prototype.lineHeight=function(t,e){var n;return null==e&&(e=!1),n=e?this.lineGap:0,(this.ascender+n-this.decender)/1e3*t},t}(),t.exports=o}).call(this)}).call(e,n(4).Buffer,"/")},function(t,e,n){function r(t,e){return d.isUndefined(e)?""+e:d.isNumber(e)&&!isFinite(e)?e.toString():d.isFunction(e)||d.isRegExp(e)?e.toString():e}function i(t,e){return d.isString(t)?t.length<e?t:t.slice(0,e):t}function o(t){return i(JSON.stringify(t.actual,r),128)+" "+t.operator+" "+i(JSON.stringify(t.expected,r),128)}function a(t,e,n,r,i){throw new v.AssertionError({message:n,actual:t,expected:e,operator:r,stackStartFunction:i})}function s(t,e){t||a(t,!0,e,"==",v.ok)}function h(t,e){if(t===e)return!0;if(d.isBuffer(t)&&d.isBuffer(e)){if(t.length!=e.length)return!1;for(var n=0;n<t.length;n++)if(t[n]!==e[n])return!1;return!0}return d.isDate(t)&&d.isDate(e)?t.getTime()===e.getTime():d.isRegExp(t)&&d.isRegExp(e)?t.source===e.source&&t.global===e.global&&t.multiline===e.multiline&&t.lastIndex===e.lastIndex&&t.ignoreCase===e.ignoreCase:d.isObject(t)||d.isObject(e)?l(t,e):t==e}function u(t){return"[object Arguments]"==Object.prototype.toString.call(t)}function l(t,e){if(d.isNullOrUndefined(t)||d.isNullOrUndefined(e))return!1;if(t.prototype!==e.prototype)return!1;if(d.isPrimitive(t)||d.isPrimitive(e))return t===e;var n=u(t),r=u(e);if(n&&!r||!n&&r)return!1;if(n)return t=p.call(t),e=p.call(e),h(t,e);var i,o,a=m(t),s=m(e);if(a.length!=s.length)return!1;for(a.sort(),s.sort(),o=a.length-1;o>=0;o--)if(a[o]!=s[o])return!1;for(o=a.length-1;o>=0;o--)if(i=a[o],!h(t[i],e[i]))return!1;return!0}function c(t,e){return t&&e?"[object RegExp]"==Object.prototype.toString.call(e)?e.test(t):t instanceof e?!0:e.call({},t)===!0?!0:!1:!1}function f(t,e,n,r){var i;d.isString(n)&&(r=n,n=null);try{e()}catch(o){i=o}if(r=(n&&n.name?" ("+n.name+").":".")+(r?" "+r:"."),t&&!i&&a(i,n,"Missing expected exception"+r),!t&&c(i,n)&&a(i,n,"Got unwanted exception"+r),t&&i&&n&&!c(i,n)||!t&&i)throw i}var d=n(60),p=Array.prototype.slice,g=Object.prototype.hasOwnProperty,v=t.exports=s;v.AssertionError=function(t){this.name="AssertionError",this.actual=t.actual,this.expected=t.expected,this.operator=t.operator,t.message?(this.message=t.message,this.generatedMessage=!1):(this.message=o(this),this.generatedMessage=!0);var e=t.stackStartFunction||a;if(Error.captureStackTrace)Error.captureStackTrace(this,e);else{var n=new Error;if(n.stack){var r=n.stack,i=e.name,s=r.indexOf("\n"+i);if(s>=0){var h=r.indexOf("\n",s+1);r=r.substring(h+1)}this.stack=r}}},d.inherits(v.AssertionError,Error),v.fail=a,v.ok=s,v.equal=function(t,e,n){t!=e&&a(t,e,n,"==",v.equal)},v.notEqual=function(t,e,n){t==e&&a(t,e,n,"!=",v.notEqual)},v.deepEqual=function(t,e,n){h(t,e)||a(t,e,n,"deepEqual",v.deepEqual)},v.notDeepEqual=function(t,e,n){h(t,e)&&a(t,e,n,"notDeepEqual",v.notDeepEqual)},v.strictEqual=function(t,e,n){t!==e&&a(t,e,n,"===",v.strictEqual)},v.notStrictEqual=function(t,e,n){t===e&&a(t,e,n,"!==",v.notStrictEqual)},v["throws"]=function(t,e,n){f.apply(this,[!0].concat(p.call(arguments)))},v.doesNotThrow=function(t,e){f.apply(this,[!1].concat(p.call(arguments)))},v.ifError=function(t){if(t)throw t};var m=Object.keys||function(t){var e=[];for(var n in t)g.call(t,n)&&e.push(n);return e}},function(t,e,n){function r(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function i(t){return"function"==typeof t}function o(t){return"number"==typeof t}function a(t){return"object"==typeof t&&null!==t}function s(t){return void 0===t}t.exports=r,r.EventEmitter=r,r.prototype._events=void 0,r.prototype._maxListeners=void 0,r.defaultMaxListeners=10,r.prototype.setMaxListeners=function(t){if(!o(t)||0>t||isNaN(t))throw TypeError("n must be a positive number");return this._maxListeners=t,this},r.prototype.emit=function(t){var e,n,r,o,h,u;if(this._events||(this._events={}),"error"===t&&(!this._events.error||a(this._events.error)&&!this._events.error.length)){if(e=arguments[1],e instanceof Error)throw e;throw TypeError('Uncaught, unspecified "error" event.')}if(n=this._events[t],s(n))return!1;if(i(n))switch(arguments.length){case 1:n.call(this);break;case 2:n.call(this,arguments[1]);break;case 3:n.call(this,arguments[1],arguments[2]);break;default:for(r=arguments.length,o=new Array(r-1),h=1;r>h;h++)o[h-1]=arguments[h];n.apply(this,o)}else if(a(n)){for(r=arguments.length,o=new Array(r-1),h=1;r>h;h++)o[h-1]=arguments[h];for(u=n.slice(),r=u.length,h=0;r>h;h++)u[h].apply(this,o)}return!0},r.prototype.addListener=function(t,e){var n;if(!i(e))throw TypeError("listener must be a function");if(this._events||(this._events={}),this._events.newListener&&this.emit("newListener",t,i(e.listener)?e.listener:e),this._events[t]?a(this._events[t])?this._events[t].push(e):this._events[t]=[this._events[t],e]:this._events[t]=e,a(this._events[t])&&!this._events[t].warned){var n;n=s(this._maxListeners)?r.defaultMaxListeners:this._maxListeners,n&&n>0&&this._events[t].length>n&&(this._events[t].warned=!0,"function"==typeof console.trace)}return this},r.prototype.on=r.prototype.addListener,r.prototype.once=function(t,e){function n(){this.removeListener(t,n),r||(r=!0,e.apply(this,arguments))}if(!i(e))throw TypeError("listener must be a function");var r=!1;return n.listener=e,this.on(t,n),this},r.prototype.removeListener=function(t,e){var n,r,o,s;if(!i(e))throw TypeError("listener must be a function");if(!this._events||!this._events[t])return this;if(n=this._events[t],o=n.length,r=-1,n===e||i(n.listener)&&n.listener===e)delete this._events[t],this._events.removeListener&&this.emit("removeListener",t,e);else if(a(n)){for(s=o;s-->0;)if(n[s]===e||n[s].listener&&n[s].listener===e){r=s;break}if(0>r)return this;1===n.length?(n.length=0,delete this._events[t]):n.splice(r,1),this._events.removeListener&&this.emit("removeListener",t,e)}return this},r.prototype.removeAllListeners=function(t){var e,n;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[t]&&delete this._events[t],this;if(0===arguments.length){for(e in this._events)"removeListener"!==e&&this.removeAllListeners(e);return this.removeAllListeners("removeListener"),this._events={},this}if(n=this._events[t],i(n))this.removeListener(t,n);else for(;n.length;)this.removeListener(t,n[n.length-1]);return delete this._events[t],this},r.prototype.listeners=function(t){var e;return e=this._events&&this._events[t]?i(this._events[t])?[this._events[t]]:this._events[t].slice():[]},r.listenerCount=function(t,e){var n;return n=t._events&&t._events[e]?i(t._events[e])?1:t._events[e].length:0}},function(t,e,n){t.exports=n(70)},function(t,e,n){e=t.exports=n(71),e.Stream=n(46),e.Readable=e,e.Writable=n(67),e.Duplex=n(69),e.Transform=n(70),e.PassThrough=n(68)},function(t,e,n){t.exports=n(67)},function(t,e,n){t.exports=n(69)},function(t,e,n){t.exports=n(68)},function(t,e,n){(function(t,r){function i(t,n){var r={seen:[],stylize:a};return arguments.length>=3&&(r.depth=arguments[2]),arguments.length>=4&&(r.colors=arguments[3]),g(n)?r.showHidden=n:n&&e._extend(r,n),b(r.showHidden)&&(r.showHidden=!1),b(r.depth)&&(r.depth=2),b(r.colors)&&(r.colors=!1),b(r.customInspect)&&(r.customInspect=!0),r.colors&&(r.stylize=o),h(r,t,r.depth)}function o(t,e){var n=i.styles[e];return n?"["+i.colors[n][0]+"m"+t+"["+i.colors[n][1]+"m":t}function a(t,e){return t}function s(t){var e={};return t.forEach(function(t,n){e[t]=!0}),e}function h(t,n,r){if(t.customInspect&&n&&C(n.inspect)&&n.inspect!==e.inspect&&(!n.constructor||n.constructor.prototype!==n)){var i=n.inspect(r,t);return w(i)||(i=h(t,i,r)),i}var o=u(t,n);if(o)return o;var a=Object.keys(n),g=s(a);if(t.showHidden&&(a=Object.getOwnPropertyNames(n)),E(n)&&(a.indexOf("message")>=0||a.indexOf("description")>=0))return l(n);if(0===a.length){if(C(n)){var v=n.name?": "+n.name:"";return t.stylize("[Function"+v+"]","special")}if(x(n))return t.stylize(RegExp.prototype.toString.call(n),"regexp");if(k(n))return t.stylize(Date.prototype.toString.call(n),"date");if(E(n))return l(n)}var m="",y=!1,_=["{","}"];if(p(n)&&(y=!0,_=["[","]"]),C(n)){var b=n.name?": "+n.name:"";m=" [Function"+b+"]"}if(x(n)&&(m=" "+RegExp.prototype.toString.call(n)),k(n)&&(m=" "+Date.prototype.toUTCString.call(n)),E(n)&&(m=" "+l(n)),0===a.length&&(!y||0==n.length))return _[0]+m+_[1];if(0>r)return x(n)?t.stylize(RegExp.prototype.toString.call(n),"regexp"):t.stylize("[Object]","special");t.seen.push(n);var S;return S=y?c(t,n,r,g,a):a.map(function(e){return f(t,n,r,g,e,y)}),t.seen.pop(),d(S,m,_)}function u(t,e){if(b(e))return t.stylize("undefined","undefined");if(w(e)){var n="'"+JSON.stringify(e).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return t.stylize(n,"string")}return y(e)?t.stylize(""+e,"number"):g(e)?t.stylize(""+e,"boolean"):v(e)?t.stylize("null","null"):void 0}function l(t){return"["+Error.prototype.toString.call(t)+"]"}function c(t,e,n,r,i){for(var o=[],a=0,s=e.length;s>a;++a)o.push(L(e,String(a))?f(t,e,n,r,String(a),!0):"");return i.forEach(function(i){i.match(/^\d+$/)||o.push(f(t,e,n,r,i,!0))}),o}function f(t,e,n,r,i,o){var a,s,u;if(u=Object.getOwnPropertyDescriptor(e,i)||{value:e[i]},u.get?s=u.set?t.stylize("[Getter/Setter]","special"):t.stylize("[Getter]","special"):u.set&&(s=t.stylize("[Setter]","special")),L(r,i)||(a="["+i+"]"),s||(t.seen.indexOf(u.value)<0?(s=v(n)?h(t,u.value,null):h(t,u.value,n-1),s.indexOf("\n")>-1&&(s=o?s.split("\n").map(function(t){return"  "+t}).join("\n").substr(2):"\n"+s.split("\n").map(function(t){return"   "+t}).join("\n"))):s=t.stylize("[Circular]","special")),b(a)){if(o&&i.match(/^\d+$/))return s;a=JSON.stringify(""+i),a.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(a=a.substr(1,a.length-2),a=t.stylize(a,"name")):(a=a.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),a=t.stylize(a,"string"))}return a+": "+s}function d(t,e,n){var r=0,i=t.reduce(function(t,e){return r++,e.indexOf("\n")>=0&&r++,t+e.replace(/\u001b\[\d\d?m/g,"").length+1},0);return i>60?n[0]+(""===e?"":e+"\n ")+" "+t.join(",\n  ")+" "+n[1]:n[0]+e+" "+t.join(", ")+" "+n[1]}function p(t){return Array.isArray(t)}function g(t){return"boolean"==typeof t}function v(t){return null===t}function m(t){return null==t}function y(t){return"number"==typeof t}function w(t){return"string"==typeof t}function _(t){return"symbol"==typeof t}function b(t){return void 0===t}function x(t){return S(t)&&"[object RegExp]"===A(t)}function S(t){return"object"==typeof t&&null!==t}function k(t){return S(t)&&"[object Date]"===A(t)}function E(t){return S(t)&&("[object Error]"===A(t)||t instanceof Error)}function C(t){return"function"==typeof t}function I(t){return null===t||"boolean"==typeof t||"number"==typeof t||"string"==typeof t||"symbol"==typeof t||"undefined"==typeof t}function A(t){return Object.prototype.toString.call(t)}function L(t,e){return Object.prototype.hasOwnProperty.call(t,e)}var R=/%[sdj%]/g;e.format=function(t){if(!w(t)){for(var e=[],n=0;n<arguments.length;n++)e.push(i(arguments[n]));return e.join(" ")}for(var n=1,r=arguments,o=r.length,a=String(t).replace(R,function(t){if("%%"===t)return"%";if(n>=o)return t;switch(t){case"%s":return String(r[n++]);case"%d":return Number(r[n++]);case"%j":try{return JSON.stringify(r[n++])}catch(e){return"[Circular]"}default:return t}}),s=r[n];o>n;s=r[++n])a+=v(s)||!S(s)?" "+s:" "+i(s);return a},e.deprecate=function(n,i){function o(){if(!a){if(r.throwDeprecation)throw new Error(i);r.traceDeprecation,a=!0}return n.apply(this,arguments)}if(b(t.process))return function(){return e.deprecate(n,i).apply(this,arguments);

};if(r.noDeprecation===!0)return n;var a=!1;return o};var B,T={};e.debuglog=function(t){if(b(B)&&(B=r.env.NODE_DEBUG||""),t=t.toUpperCase(),!T[t])if(new RegExp("\\b"+t+"\\b","i").test(B)){{r.pid}T[t]=function(){e.format.apply(e,arguments)}}else T[t]=function(){};return T[t]},e.inspect=i,i.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},i.styles={special:"cyan",number:"yellow","boolean":"yellow",undefined:"grey","null":"bold",string:"green",date:"magenta",regexp:"red"},e.isArray=p,e.isBoolean=g,e.isNull=v,e.isNullOrUndefined=m,e.isNumber=y,e.isString=w,e.isSymbol=_,e.isUndefined=b,e.isRegExp=x,e.isObject=S,e.isDate=k,e.isError=E,e.isFunction=C,e.isPrimitive=I,e.isBuffer=n(72);e.log=function(){},e.inherits=n(94),e._extend=function(t,e){if(!e||!S(e))return t;for(var n=Object.keys(e),r=n.length;r--;)t[n[r]]=e[n[r]];return t}}).call(e,function(){return this}(),n(61))},function(t,e,n){function r(){if(!s){s=!0;for(var t,e=a.length;e;){t=a,a=[];for(var n=-1;++n<e;)t[n]();e=a.length}s=!1}}function i(){}var o=t.exports={},a=[],s=!1;o.nextTick=function(t){a.push(t),s||setTimeout(r,0)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=i,o.addListener=i,o.once=i,o.off=i,o.removeListener=i,o.removeAllListeners=i,o.emit=i,o.binding=function(t){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(t){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(t,e,n){t.exports="function"==typeof Object.create?function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:function(t,e){t.super_=e;var n=function(){};n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t}},function(t,e,n){(function(){var e,r;r=n(10),e=function(){function t(t){var e,r;this.contents=t,this.attributes={},this.glyphWidths={},this.boundingBoxes={},this.parse(),this.charWidths=function(){var t,e;for(e=[],r=t=0;255>=t;r=++t)e.push(this.glyphWidths[n[r]]);return e}.call(this),this.bbox=function(){var t,n,r,i;for(r=this.attributes.FontBBox.split(/\s+/),i=[],t=0,n=r.length;n>t;t++)e=r[t],i.push(+e);return i}.call(this),this.ascender=+(this.attributes.Ascender||0),this.decender=+(this.attributes.Descender||0),this.lineGap=this.bbox[3]-this.bbox[1]-(this.ascender-this.decender)}var e,n;return t.open=function(e){return new t(r.readFileSync(e,"utf8"))},t.prototype.parse=function(){var t,e,n,r,i,o,a,s,h,u;for(o="",u=this.contents.split("\n"),s=0,h=u.length;h>s;s++)if(n=u[s],r=n.match(/^Start(\w+)/))o=r[1];else if(r=n.match(/^End(\w+)/))o="";else switch(o){case"FontMetrics":r=n.match(/(^\w+)\s+(.*)/),e=r[1],a=r[2],(t=this.attributes[e])?(Array.isArray(t)||(t=this.attributes[e]=[t]),t.push(a)):this.attributes[e]=a;break;case"CharMetrics":if(!/^CH?\s/.test(n))continue;i=n.match(/\bN\s+(\.?\w+)\s*;/)[1],this.glyphWidths[i]=+n.match(/\bWX\s+(\d+)\s*;/)[1]}},e={402:131,8211:150,8212:151,8216:145,8217:146,8218:130,8220:147,8221:148,8222:132,8224:134,8225:135,8226:149,8230:133,8364:128,8240:137,8249:139,8250:155,710:136,8482:153,338:140,339:156,732:152,352:138,353:154,376:159,381:142,382:158},t.prototype.encodeText=function(t){var n,r,i,o,a;for(i="",r=o=0,a=t.length;a>=0?a>o:o>a;r=a>=0?++o:--o)n=t.charCodeAt(r),n=e[n]||n,i+=String.fromCharCode(n);return i},t.prototype.characterToGlyph=function(t){return n[e[t]||t]},t.prototype.widthOfGlyph=function(t){return this.glyphWidths[t]},n=".notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n.notdef       .notdef        .notdef        .notdef\n\nspace         exclam         quotedbl       numbersign\ndollar        percent        ampersand      quotesingle\nparenleft     parenright     asterisk       plus\ncomma         hyphen         period         slash\nzero          one            two            three\nfour          five           six            seven\neight         nine           colon          semicolon\nless          equal          greater        question\n\nat            A              B              C\nD             E              F              G\nH             I              J              K\nL             M              N              O\nP             Q              R              S\nT             U              V              W\nX             Y              Z              bracketleft\nbackslash     bracketright   asciicircum    underscore\n\ngrave         a              b              c\nd             e              f              g\nh             i              j              k\nl             m              n              o\np             q              r              s\nt             u              v              w\nx             y              z              braceleft\nbar           braceright     asciitilde     .notdef\n\nEuro          .notdef        quotesinglbase florin\nquotedblbase  ellipsis       dagger         daggerdbl\ncircumflex    perthousand    Scaron         guilsinglleft\nOE            .notdef        Zcaron         .notdef\n.notdef       quoteleft      quoteright     quotedblleft\nquotedblright bullet         endash         emdash\ntilde         trademark      scaron         guilsinglright\noe            .notdef        zcaron         ydieresis\n\nspace         exclamdown     cent           sterling\ncurrency      yen            brokenbar      section\ndieresis      copyright      ordfeminine    guillemotleft\nlogicalnot    hyphen         registered     macron\ndegree        plusminus      twosuperior    threesuperior\nacute         mu             paragraph      periodcentered\ncedilla       onesuperior    ordmasculine   guillemotright\nonequarter    onehalf        threequarters  questiondown\n\nAgrave        Aacute         Acircumflex    Atilde\nAdieresis     Aring          AE             Ccedilla\nEgrave        Eacute         Ecircumflex    Edieresis\nIgrave        Iacute         Icircumflex    Idieresis\nEth           Ntilde         Ograve         Oacute\nOcircumflex   Otilde         Odieresis      multiply\nOslash        Ugrave         Uacute         Ucircumflex\nUdieresis     Yacute         Thorn          germandbls\n\nagrave        aacute         acircumflex    atilde\nadieresis     aring          ae             ccedilla\negrave        eacute         ecircumflex    edieresis\nigrave        iacute         icircumflex    idieresis\neth           ntilde         ograve         oacute\nocircumflex   otilde         odieresis      divide\noslash        ugrave         uacute         ucircumflex\nudieresis     yacute         thorn          ydieresis".split(/\s+/),t}(),t.exports=e}).call(this)},function(t,e,n){(function(){var CmapTable,e,r,i,GlyfTable,HeadTable,HheaTable,HmtxTable,LocaTable,MaxpTable,NameTable,OS2Table,PostTable,o,a;a=n(10),r=n(34),e=n(78),i=n(79),NameTable=n(80),HeadTable=n(81),CmapTable=n(82),HmtxTable=n(83),HheaTable=n(84),MaxpTable=n(85),PostTable=n(86),OS2Table=n(87),LocaTable=n(88),GlyfTable=n(90),o=function(){function t(t,e){var n,i,o,a,s,h,u,l,c;if(this.rawData=t,n=this.contents=new r(this.rawData),"ttcf"===n.readString(4)){if(!e)throw new Error("Must specify a font name for TTC files.");for(h=n.readInt(),o=n.readInt(),s=[],i=u=0;o>=0?o>u:u>o;i=o>=0?++u:--u)s[i]=n.readInt();for(i=l=0,c=s.length;c>l;i=++l)if(a=s[i],n.pos=a,this.parse(),this.name.postscriptName===e)return;throw new Error("Font "+e+" not found in TTC file.")}n.pos=0,this.parse()}return t.open=function(e,n){var r;return r=a.readFileSync(e),new t(r,n)},t.fromDFont=function(n,r){var i;return i=e.open(n),new t(i.getNamedFont(r))},t.fromBuffer=function(n,r){var i,o,a;try{if(a=new t(n,r),!(a.head.exists&&a.name.exists&&a.cmap.exists||(i=new e(n),a=new t(i.getNamedFont(r)),a.head.exists&&a.name.exists&&a.cmap.exists)))throw new Error("Invalid TTF file in DFont");return a}catch(s){throw o=s,new Error("Unknown font format in buffer: "+o.message)}},t.prototype.parse=function(){return this.directory=new i(this.contents),this.head=new HeadTable(this),this.name=new NameTable(this),this.cmap=new CmapTable(this),this.hhea=new HheaTable(this),this.maxp=new MaxpTable(this),this.hmtx=new HmtxTable(this),this.post=new PostTable(this),this.os2=new OS2Table(this),this.loca=new LocaTable(this),this.glyf=new GlyfTable(this),this.ascender=this.os2.exists&&this.os2.ascender||this.hhea.ascender,this.decender=this.os2.exists&&this.os2.decender||this.hhea.decender,this.lineGap=this.os2.exists&&this.os2.lineGap||this.hhea.lineGap,this.bbox=[this.head.xMin,this.head.yMin,this.head.xMax,this.head.yMax]},t.prototype.characterToGlyph=function(t){var e;return(null!=(e=this.cmap.unicode)?e.codeMap[t]:void 0)||0},t.prototype.widthOfGlyph=function(t){var e;return e=1e3/this.head.unitsPerEm,this.hmtx.forGlyph(t).advance*e},t}(),t.exports=o}).call(this)},function(t,e,n){(function(){var CmapTable,e,r,i=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};CmapTable=n(82),r=n(89),e=function(){function t(t){this.font=t,this.subset={},this.unicodes={},this.next=33}return t.prototype.use=function(t){var e,n,r;{if("string"!=typeof t)return this.unicodes[t]?void 0:(this.subset[this.next]=t,this.unicodes[t]=this.next++);for(e=n=0,r=t.length;r>=0?r>n:n>r;e=r>=0?++n:--n)this.use(t.charCodeAt(e))}},t.prototype.encodeText=function(t){var e,n,r,i,o;for(r="",n=i=0,o=t.length;o>=0?o>i:i>o;n=o>=0?++i:--i)e=this.unicodes[t.charCodeAt(n)],r+=String.fromCharCode(e);return r},t.prototype.generateCmap=function(){var t,e,n,r,i;r=this.font.cmap.tables[0].codeMap,t={},i=this.subset;for(e in i)n=i[e],t[e]=r[n];return t},t.prototype.glyphIDs=function(){var t,e,n,r,o,a;r=this.font.cmap.tables[0].codeMap,t=[0],a=this.subset;for(e in a)n=a[e],o=r[n],null!=o&&i.call(t,o)<0&&t.push(o);return t.sort()},t.prototype.glyphsFor=function(t){var e,n,r,i,o,a,s;for(r={},o=0,a=t.length;a>o;o++)i=t[o],r[i]=this.font.glyf.glyphFor(i);e=[];for(i in r)n=r[i],(null!=n?n.compound:void 0)&&e.push.apply(e,n.glyphIDs);if(e.length>0){s=this.glyphsFor(e);for(i in s)n=s[i],r[i]=n}return r},t.prototype.encode=function(){var t,e,n,i,o,a,s,h,u,l,c,f,d,p,g,v,m;t=CmapTable.encode(this.generateCmap(),"unicode"),i=this.glyphsFor(this.glyphIDs()),f={0:0},v=t.charMap;for(e in v)a=v[e],f[a.old]=a["new"];c=t.maxGlyphID;for(d in i)d in f||(f[d]=c++);u=r.invert(f),l=Object.keys(u).sort(function(t,e){return t-e}),p=function(){var t,e,n;for(n=[],t=0,e=l.length;e>t;t++)o=l[t],n.push(u[o]);return n}(),n=this.font.glyf.encode(i,p,f),s=this.font.loca.encode(n.offsets),h=this.font.name.encode(),this.postscriptName=h.postscriptName,this.cmap={},m=t.charMap;for(e in m)a=m[e],this.cmap[e]=a.old;return g={cmap:t.table,glyf:n.table,loca:s.table,hmtx:this.font.hmtx.encode(p),hhea:this.font.hhea.encode(p),maxp:this.font.maxp.encode(p),post:this.font.post.encode(p),name:h.table,head:this.font.head.encode(s)},this.font.os2.exists&&(g["OS/2"]=this.font.os2.raw()),this.font.directory.encode(g)},t}(),t.exports=e}).call(this)},function(t,e,n){(function(){var e,r,i,o,a,s,h,u,l,c,f,d,p,g,v,m,y,w,_,b,x,S,k,E,C,I,A,L;x=n(100),C=new x(n(106)),A=n(92),o=A.BK,l=A.CR,p=A.LF,v=A.NL,a=A.CB,i=A.BA,b=A.SP,S=A.WJ,b=A.SP,o=A.BK,p=A.LF,v=A.NL,e=A.AI,r=A.AL,w=A.SA,_=A.SG,k=A.XX,h=A.CJ,f=A.ID,m=A.NS,E=A.characterClasses,L=n(91),c=L.DI_BRK,d=L.IN_BRK,s=L.CI_BRK,u=L.CP_BRK,y=L.PR_BRK,I=L.pairTable,g=function(){function t(t){this.string=t,this.pos=0,this.lastPos=0,this.curClass=null,this.nextClass=null}var n,f,g;return t.prototype.nextCodePoint=function(){var t,e;return t=this.string.charCodeAt(this.pos++),e=this.string.charCodeAt(this.pos),t>=55296&&56319>=t&&e>=56320&&57343>=e?(this.pos++,1024*(t-55296)+(e-56320)+65536):t},f=function(t){switch(t){case e:return r;case w:case _:case k:return r;case h:return m;default:return t}},g=function(t){switch(t){case p:case v:return o;case a:return i;case b:return S;default:return t}},t.prototype.nextCharClass=function(t){return null==t&&(t=!1),f(C.get(this.nextCodePoint()))},n=function(){function t(t,e){this.position=t,this.required=null!=e?e:!1}return t}(),t.prototype.nextBreak=function(){var t,e,r;for(null==this.curClass&&(this.curClass=g(this.nextCharClass()));this.pos<this.string.length;){if(this.lastPos=this.pos,e=this.nextClass,this.nextClass=this.nextCharClass(),this.curClass===o||this.curClass===l&&this.nextClass!==p)return this.curClass=g(f(this.nextClass)),new n(this.lastPos,!0);if(t=function(){switch(this.nextClass){case b:return this.curClass;case o:case p:case v:return o;case l:return l;case a:return i}}.call(this),null==t){switch(r=!1,I[this.curClass][this.nextClass]){case c:r=!0;break;case d:r=e===b;break;case s:if(r=e===b,!r)continue;break;case u:if(e!==b)continue}if(this.curClass=this.nextClass,r)return new n(this.lastPos)}else if(this.curClass=t,this.nextClass===a)return new n(this.lastPos)}return this.pos>=this.string.length?this.lastPos<this.string.length?(this.lastPos=this.string.length,new n(this.string.length)):null:void 0},t}(),t.exports=g}).call(this)},function(t,e,n){(function(e){function r(t,e,n){this.chunk=t,this.encoding=e,this.callback=n}function i(t,e){var r=n(69);t=t||{};var i=t.highWaterMark,o=t.objectMode?16:16384;this.highWaterMark=i||0===i?i:o,this.objectMode=!!t.objectMode,e instanceof r&&(this.objectMode=this.objectMode||!!t.writableObjectMode),this.highWaterMark=~~this.highWaterMark,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1;var a=t.decodeStrings===!1;this.decodeStrings=!a,this.defaultEncoding=t.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(t){d(e,t)},this.writecb=null,this.writelen=0,this.buffer=[],this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1}function o(t){var e=n(69);return this instanceof o||this instanceof e?(this._writableState=new i(t,this),this.writable=!0,void S.call(this)):new o(t)}function a(t,n,r){var i=new Error("write after end");t.emit("error",i),e.nextTick(function(){r(i)})}function s(t,n,r,i){var o=!0;if(!(x.isBuffer(r)||x.isString(r)||x.isNullOrUndefined(r)||n.objectMode)){var a=new TypeError("Invalid non-string/buffer chunk");t.emit("error",a),e.nextTick(function(){i(a)}),o=!1}return o}function h(t,e,n){return!t.objectMode&&t.decodeStrings!==!1&&x.isString(e)&&(e=new b(e,n)),e}function u(t,e,n,i,o){n=h(e,n,i),x.isBuffer(n)&&(i="buffer");var a=e.objectMode?1:n.length;e.length+=a;var s=e.length<e.highWaterMark;return s||(e.needDrain=!0),e.writing||e.corked?e.buffer.push(new r(n,i,o)):l(t,e,!1,a,n,i,o),s}function l(t,e,n,r,i,o,a){e.writelen=r,e.writecb=a,e.writing=!0,e.sync=!0,n?t._writev(i,e.onwrite):t._write(i,o,e.onwrite),e.sync=!1}function c(t,n,r,i,o){r?e.nextTick(function(){n.pendingcb--,o(i)}):(n.pendingcb--,o(i)),t._writableState.errorEmitted=!0,t.emit("error",i)}function f(t){t.writing=!1,t.writecb=null,t.length-=t.writelen,t.writelen=0}function d(t,n){var r=t._writableState,i=r.sync,o=r.writecb;if(f(r),n)c(t,r,i,n,o);else{var a=m(t,r);a||r.corked||r.bufferProcessing||!r.buffer.length||v(t,r),i?e.nextTick(function(){p(t,r,a,o)}):p(t,r,a,o)}}function p(t,e,n,r){n||g(t,e),e.pendingcb--,r(),w(t,e)}function g(t,e){0===e.length&&e.needDrain&&(e.needDrain=!1,t.emit("drain"))}function v(t,e){if(e.bufferProcessing=!0,t._writev&&e.buffer.length>1){for(var n=[],r=0;r<e.buffer.length;r++)n.push(e.buffer[r].callback);e.pendingcb++,l(t,e,!0,e.length,e.buffer,"",function(t){for(var r=0;r<n.length;r++)e.pendingcb--,n[r](t)}),e.buffer=[]}else{for(var r=0;r<e.buffer.length;r++){var i=e.buffer[r],o=i.chunk,a=i.encoding,s=i.callback,h=e.objectMode?1:o.length;if(l(t,e,!1,h,o,a,s),e.writing){r++;break}}r<e.buffer.length?e.buffer=e.buffer.slice(r):e.buffer.length=0}e.bufferProcessing=!1}function m(t,e){return e.ending&&0===e.length&&!e.finished&&!e.writing}function y(t,e){e.prefinished||(e.prefinished=!0,t.emit("prefinish"))}function w(t,e){var n=m(t,e);return n&&(0===e.pendingcb?(y(t,e),e.finished=!0,t.emit("finish")):y(t,e)),n}function _(t,n,r){n.ending=!0,w(t,n),r&&(n.finished?e.nextTick(r):t.once("finish",r)),n.ended=!0}t.exports=o;var b=n(4).Buffer;o.WritableState=i;var x=n(105);x.inherits=n(104);var S=n(46);x.inherits(o,S),o.prototype.pipe=function(){this.emit("error",new Error("Cannot pipe. Not readable."))},o.prototype.write=function(t,e,n){var r=this._writableState,i=!1;return x.isFunction(e)&&(n=e,e=null),x.isBuffer(t)?e="buffer":e||(e=r.defaultEncoding),x.isFunction(n)||(n=function(){}),r.ended?a(this,r,n):s(this,r,t,n)&&(r.pendingcb++,i=u(this,r,t,e,n)),i},o.prototype.cork=function(){var t=this._writableState;t.corked++},o.prototype.uncork=function(){var t=this._writableState;t.corked&&(t.corked--,t.writing||t.corked||t.finished||t.bufferProcessing||!t.buffer.length||v(this,t))},o.prototype._write=function(t,e,n){n(new Error("not implemented"))},o.prototype._writev=null,o.prototype.end=function(t,e,n){var r=this._writableState;x.isFunction(t)?(n=t,t=null,e=null):x.isFunction(e)&&(n=e,e=null),x.isNullOrUndefined(t)||this.write(t,e),r.corked&&(r.corked=1,this.uncork()),r.ending||r.finished||_(this,r,n)}}).call(e,n(61))},function(t,e,n){function r(t){return this instanceof r?void i.call(this,t):new r(t)}t.exports=r;var i=n(70),o=n(105);o.inherits=n(104),o.inherits(r,i),r.prototype._transform=function(t,e,n){n(null,t)}},function(t,e,n){(function(e){function r(t){return this instanceof r?(h.call(this,t),u.call(this,t),t&&t.readable===!1&&(this.readable=!1),t&&t.writable===!1&&(this.writable=!1),this.allowHalfOpen=!0,t&&t.allowHalfOpen===!1&&(this.allowHalfOpen=!1),void this.once("end",i)):new r(t)}function i(){this.allowHalfOpen||this._writableState.ended||e.nextTick(this.end.bind(this))}function o(t,e){for(var n=0,r=t.length;r>n;n++)e(t[n],n)}t.exports=r;var a=Object.keys||function(t){var e=[];for(var n in t)e.push(n);return e},s=n(105);s.inherits=n(104);var h=n(71),u=n(67);s.inherits(r,h),o(a(u.prototype),function(t){r.prototype[t]||(r.prototype[t]=u.prototype[t])})}).call(e,n(61))},function(t,e,n){function r(t,e){this.afterTransform=function(t,n){return i(e,t,n)},this.needTransform=!1,this.transforming=!1,this.writecb=null,this.writechunk=null}function i(t,e,n){var r=t._transformState;r.transforming=!1;var i=r.writecb;if(!i)return t.emit("error",new Error("no writecb in Transform class"));r.writechunk=null,r.writecb=null,h.isNullOrUndefined(n)||t.push(n),i&&i(e);var o=t._readableState;o.reading=!1,(o.needReadable||o.length<o.highWaterMark)&&t._read(o.highWaterMark)}function o(t){if(!(this instanceof o))return new o(t);s.call(this,t),this._transformState=new r(t,this);var e=this;this._readableState.needReadable=!0,this._readableState.sync=!1,this.once("prefinish",function(){h.isFunction(this._flush)?this._flush(function(t){a(e,t)}):a(e)})}function a(t,e){if(e)return t.emit("error",e);var n=t._writableState,r=t._transformState;if(n.length)throw new Error("calling transform done when ws.length != 0");if(r.transforming)throw new Error("calling transform done when still transforming");return t.push(null)}t.exports=o;var s=n(69),h=n(105);h.inherits=n(104),h.inherits(o,s),o.prototype.push=function(t,e){return this._transformState.needTransform=!1,s.prototype.push.call(this,t,e)},o.prototype._transform=function(t,e,n){throw new Error("not implemented")},o.prototype._write=function(t,e,n){var r=this._transformState;if(r.writecb=n,r.writechunk=t,r.writeencoding=e,!r.transforming){var i=this._readableState;(r.needTransform||i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark)}},o.prototype._read=function(t){var e=this._transformState;h.isNull(e.writechunk)||!e.writecb||e.transforming?e.needTransform=!0:(e.transforming=!0,this._transform(e.writechunk,e.writeencoding,e.afterTransform))}},function(t,e,n){(function(e){function r(t,e){var r=n(69);t=t||{};var i=t.highWaterMark,o=t.objectMode?16:16384;this.highWaterMark=i||0===i?i:o,this.highWaterMark=~~this.highWaterMark,this.buffer=[],this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.objectMode=!!t.objectMode,e instanceof r&&(this.objectMode=this.objectMode||!!t.readableObjectMode),this.defaultEncoding=t.defaultEncoding||"utf8",this.ranOut=!1,this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,t.encoding&&(A||(A=n(101).StringDecoder),this.decoder=new A(t.encoding),this.encoding=t.encoding)}function i(t){n(69);return this instanceof i?(this._readableState=new r(t,this),this.readable=!0,void C.call(this)):new i(t)}function o(t,e,n,r,i){var o=u(e,n);if(o)t.emit("error",o);else if(I.isNullOrUndefined(n))e.reading=!1,e.ended||l(t,e);else if(e.objectMode||n&&n.length>0)if(e.ended&&!i){var s=new Error("stream.push() after EOF");t.emit("error",s)}else if(e.endEmitted&&i){var s=new Error("stream.unshift() after end event");t.emit("error",s)}else!e.decoder||i||r||(n=e.decoder.write(n)),i||(e.reading=!1),e.flowing&&0===e.length&&!e.sync?(t.emit("data",n),t.read(0)):(e.length+=e.objectMode?1:n.length,i?e.buffer.unshift(n):e.buffer.push(n),e.needReadable&&c(t)),d(t,e);else i||(e.reading=!1);return a(e)}function a(t){return!t.ended&&(t.needReadable||t.length<t.highWaterMark||0===t.length)}function s(t){if(t>=R)t=R;else{t--;for(var e=1;32>e;e<<=1)t|=t>>e;t++}return t}function h(t,e){return 0===e.length&&e.ended?0:e.objectMode?0===t?0:1:isNaN(t)||I.isNull(t)?e.flowing&&e.buffer.length?e.buffer[0].length:e.length:0>=t?0:(t>e.highWaterMark&&(e.highWaterMark=s(t)),t>e.length?e.ended?e.length:(e.needReadable=!0,0):t)}function u(t,e){var n=null;return I.isBuffer(e)||I.isString(e)||I.isNullOrUndefined(e)||t.objectMode||(n=new TypeError("Invalid non-string/buffer chunk")),n}function l(t,e){if(e.decoder&&!e.ended){var n=e.decoder.end();n&&n.length&&(e.buffer.push(n),e.length+=e.objectMode?1:n.length)}e.ended=!0,c(t)}function c(t){var n=t._readableState;n.needReadable=!1,n.emittedReadable||(L("emitReadable",n.flowing),n.emittedReadable=!0,n.sync?e.nextTick(function(){f(t)}):f(t))}function f(t){L("emit readable"),t.emit("readable"),y(t)}function d(t,n){n.readingMore||(n.readingMore=!0,e.nextTick(function(){p(t,n)}))}function p(t,e){for(var n=e.length;!e.reading&&!e.flowing&&!e.ended&&e.length<e.highWaterMark&&(L("maybeReadMore read 0"),t.read(0),n!==e.length);)n=e.length;e.readingMore=!1}function g(t){return function(){var e=t._readableState;L("pipeOnDrain",e.awaitDrain),e.awaitDrain&&e.awaitDrain--,0===e.awaitDrain&&E.listenerCount(t,"data")&&(e.flowing=!0,y(t))}}function v(t,n){n.resumeScheduled||(n.resumeScheduled=!0,e.nextTick(function(){m(t,n)}))}function m(t,e){e.resumeScheduled=!1,t.emit("resume"),y(t),e.flowing&&!e.reading&&t.read(0)}function y(t){var e=t._readableState;if(L("flow",e.flowing),e.flowing)do var n=t.read();while(null!==n&&e.flowing)}function w(t,e){var n,r=e.buffer,i=e.length,o=!!e.decoder,a=!!e.objectMode;if(0===r.length)return null;if(0===i)n=null;else if(a)n=r.shift();else if(!t||t>=i)n=o?r.join(""):k.concat(r,i),r.length=0;else if(t<r[0].length){var s=r[0];n=s.slice(0,t),r[0]=s.slice(t)}else if(t===r[0].length)n=r.shift();else{n=o?"":new k(t);for(var h=0,u=0,l=r.length;l>u&&t>h;u++){var s=r[0],c=Math.min(t-h,s.length);o?n+=s.slice(0,c):s.copy(n,h,0,c),c<s.length?r[0]=s.slice(c):r.shift(),h+=c}}return n}function _(t){var n=t._readableState;if(n.length>0)throw new Error("endReadable called on non-empty stream");n.endEmitted||(n.ended=!0,e.nextTick(function(){n.endEmitted||0!==n.length||(n.endEmitted=!0,t.readable=!1,t.emit("end"))}))}function b(t,e){for(var n=0,r=t.length;r>n;n++)e(t[n],n)}function x(t,e){for(var n=0,r=t.length;r>n;n++)if(t[n]===e)return n;return-1}t.exports=i;var S=n(107),k=n(4).Buffer;i.ReadableState=r;var E=n(54).EventEmitter;E.listenerCount||(E.listenerCount=function(t,e){return t.listeners(e).length});var C=n(46),I=n(105);I.inherits=n(104);var A,L=n(93);L=L&&L.debuglog?L.debuglog("stream"):function(){},I.inherits(i,C),i.prototype.push=function(t,e){var n=this._readableState;return I.isString(t)&&!n.objectMode&&(e=e||n.defaultEncoding,e!==n.encoding&&(t=new k(t,e),e="")),o(this,n,t,e,!1)},i.prototype.unshift=function(t){var e=this._readableState;return o(this,e,t,"",!0)},i.prototype.setEncoding=function(t){return A||(A=n(101).StringDecoder),this._readableState.decoder=new A(t),this._readableState.encoding=t,this};var R=8388608;i.prototype.read=function(t){L("read",t);var e=this._readableState,n=t;if((!I.isNumber(t)||t>0)&&(e.emittedReadable=!1),0===t&&e.needReadable&&(e.length>=e.highWaterMark||e.ended))return L("read: emitReadable",e.length,e.ended),0===e.length&&e.ended?_(this):c(this),null;if(t=h(t,e),0===t&&e.ended)return 0===e.length&&_(this),null;var r=e.needReadable;L("need readable",r),(0===e.length||e.length-t<e.highWaterMark)&&(r=!0,L("length less than watermark",r)),(e.ended||e.reading)&&(r=!1,L("reading or ended",r)),r&&(L("do read"),e.reading=!0,e.sync=!0,0===e.length&&(e.needReadable=!0),this._read(e.highWaterMark),e.sync=!1),r&&!e.reading&&(t=h(n,e));var i;return i=t>0?w(t,e):null,I.isNull(i)&&(e.needReadable=!0,t=0),e.length-=t,0!==e.length||e.ended||(e.needReadable=!0),n!==t&&e.ended&&0===e.length&&_(this),I.isNull(i)||this.emit("data",i),i},i.prototype._read=function(t){this.emit("error",new Error("not implemented"))},i.prototype.pipe=function(t,n){function r(t){L("onunpipe"),t===c&&o()}function i(){L("onend"),t.end()}function o(){L("cleanup"),t.removeListener("close",h),t.removeListener("finish",u),t.removeListener("drain",v),t.removeListener("error",s),t.removeListener("unpipe",r),c.removeListener("end",i),c.removeListener("end",o),c.removeListener("data",a),!f.awaitDrain||t._writableState&&!t._writableState.needDrain||v()}function a(e){L("ondata");var n=t.write(e);!1===n&&(L("false write response, pause",c._readableState.awaitDrain),c._readableState.awaitDrain++,c.pause())}function s(e){L("onerror",e),l(),t.removeListener("error",s),0===E.listenerCount(t,"error")&&t.emit("error",e)}function h(){t.removeListener("finish",u),l()}function u(){L("onfinish"),t.removeListener("close",h),l()}function l(){L("unpipe"),c.unpipe(t)}var c=this,f=this._readableState;switch(f.pipesCount){case 0:f.pipes=t;break;case 1:f.pipes=[f.pipes,t];break;default:f.pipes.push(t)}f.pipesCount+=1,L("pipe count=%d opts=%j",f.pipesCount,n);var d=(!n||n.end!==!1)&&t!==e.stdout&&t!==e.stderr,p=d?i:o;f.endEmitted?e.nextTick(p):c.once("end",p),t.on("unpipe",r);var v=g(c);return t.on("drain",v),c.on("data",a),t._events&&t._events.error?S(t._events.error)?t._events.error.unshift(s):t._events.error=[s,t._events.error]:t.on("error",s),t.once("close",h),t.once("finish",u),t.emit("pipe",c),f.flowing||(L("pipe resume"),c.resume()),t},i.prototype.unpipe=function(t){var e=this._readableState;if(0===e.pipesCount)return this;if(1===e.pipesCount)return t&&t!==e.pipes?this:(t||(t=e.pipes),e.pipes=null,e.pipesCount=0,e.flowing=!1,t&&t.emit("unpipe",this),this);if(!t){var n=e.pipes,r=e.pipesCount;e.pipes=null,e.pipesCount=0,e.flowing=!1;for(var i=0;r>i;i++)n[i].emit("unpipe",this);return this}var i=x(e.pipes,t);return-1===i?this:(e.pipes.splice(i,1),e.pipesCount-=1,1===e.pipesCount&&(e.pipes=e.pipes[0]),t.emit("unpipe",this),this)},i.prototype.on=function(t,n){var r=C.prototype.on.call(this,t,n);if("data"===t&&!1!==this._readableState.flowing&&this.resume(),"readable"===t&&this.readable){var i=this._readableState;if(!i.readableListening)if(i.readableListening=!0,i.emittedReadable=!1,i.needReadable=!0,i.reading)i.length&&c(this,i);else{var o=this;e.nextTick(function(){L("readable nexttick read 0"),o.read(0)})}}return r},i.prototype.addListener=i.prototype.on,i.prototype.resume=function(){var t=this._readableState;return t.flowing||(L("resume"),t.flowing=!0,t.reading||(L("resume read 0"),this.read(0)),v(this,t)),this},i.prototype.pause=function(){return L("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(L("pause"),this._readableState.flowing=!1,this.emit("pause")),this},i.prototype.wrap=function(t){var e=this._readableState,n=!1,r=this;t.on("end",function(){if(L("wrapped end"),e.decoder&&!e.ended){var t=e.decoder.end();t&&t.length&&r.push(t)}r.push(null)}),t.on("data",function(i){if(L("wrapped data"),e.decoder&&(i=e.decoder.write(i)),i&&(e.objectMode||i.length)){var o=r.push(i);o||(n=!0,t.pause())}});for(var i in t)I.isFunction(t[i])&&I.isUndefined(this[i])&&(this[i]=function(e){return function(){return t[e].apply(t,arguments)}}(i));var o=["error","close","destroy","pause","resume"];return b(o,function(e){t.on(e,r.emit.bind(r,e))}),r._read=function(e){L("wrapped _read",e),n&&(n=!1,t.resume())},r},i._fromList=w}).call(e,n(61))},function(t,e,n){t.exports=function(t){return t&&"object"==typeof t&&"function"==typeof t.copy&&"function"==typeof t.fill&&"function"==typeof t.readUInt8}},function(t,e,n){"use strict";t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},function(t,e,n){"use strict";function r(t,e){return t.msg=T[e],e}function i(t){return(t<<1)-(t>4?9:0)}function o(t){for(var e=t.length;--e>=0;)t[e]=0}function a(t){var e=t.state,n=e.pending;n>t.avail_out&&(n=t.avail_out),0!==n&&(A.arraySet(t.output,e.pending_buf,e.pending_out,n,t.next_out),t.next_out+=n,e.pending_out+=n,t.total_out+=n,t.avail_out-=n,e.pending-=n,0===e.pending&&(e.pending_out=0))}function s(t,e){L._tr_flush_block(t,t.block_start>=0?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,a(t.strm)}function h(t,e){t.pending_buf[t.pending++]=e}function u(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e}function l(t,e,n,r){var i=t.avail_in;return i>r&&(i=r),0===i?0:(t.avail_in-=i,A.arraySet(e,t.input,t.next_in,i,n),1===t.state.wrap?t.adler=R(t.adler,e,i,n):2===t.state.wrap&&(t.adler=B(t.adler,e,i,n)),t.next_in+=i,t.total_in+=i,i)}function c(t,e){var n,r,i=t.max_chain_length,o=t.strstart,a=t.prev_length,s=t.nice_match,h=t.strstart>t.w_size-ut?t.strstart-(t.w_size-ut):0,u=t.window,l=t.w_mask,c=t.prev,f=t.strstart+ht,d=u[o+a-1],p=u[o+a];t.prev_length>=t.good_match&&(i>>=2),s>t.lookahead&&(s=t.lookahead);do if(n=e,u[n+a]===p&&u[n+a-1]===d&&u[n]===u[o]&&u[++n]===u[o+1]){o+=2,n++;do;while(u[++o]===u[++n]&&u[++o]===u[++n]&&u[++o]===u[++n]&&u[++o]===u[++n]&&u[++o]===u[++n]&&u[++o]===u[++n]&&u[++o]===u[++n]&&u[++o]===u[++n]&&f>o);if(r=ht-(f-o),o=f-ht,r>a){if(t.match_start=e,a=r,r>=s)break;d=u[o+a-1],p=u[o+a]}}while((e=c[e&l])>h&&0!==--i);return a<=t.lookahead?a:t.lookahead}function f(t){var e,n,r,i,o,a=t.w_size;do{if(i=t.window_size-t.lookahead-t.strstart,t.strstart>=a+(a-ut)){A.arraySet(t.window,t.window,a,a,0),t.match_start-=a,t.strstart-=a,t.block_start-=a,n=t.hash_size,e=n;do r=t.head[--e],t.head[e]=r>=a?r-a:0;while(--n);n=a,e=n;do r=t.prev[--e],t.prev[e]=r>=a?r-a:0;while(--n);i+=a}if(0===t.strm.avail_in)break;if(n=l(t.strm,t.window,t.strstart+t.lookahead,i),t.lookahead+=n,t.lookahead+t.insert>=st)for(o=t.strstart-t.insert,t.ins_h=t.window[o],t.ins_h=(t.ins_h<<t.hash_shift^t.window[o+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[o+st-1])&t.hash_mask,t.prev[o&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=o,o++,t.insert--,!(t.lookahead+t.insert<st)););}while(t.lookahead<ut&&0!==t.strm.avail_in)}function d(t,e){var n=65535;for(n>t.pending_buf_size-5&&(n=t.pending_buf_size-5);;){if(t.lookahead<=1){if(f(t),0===t.lookahead&&e===M)return yt;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var r=t.block_start+n;if((0===t.strstart||t.strstart>=r)&&(t.lookahead=t.strstart-r,
t.strstart=r,s(t,!1),0===t.strm.avail_out))return yt;if(t.strstart-t.block_start>=t.w_size-ut&&(s(t,!1),0===t.strm.avail_out))return yt}return t.insert=0,e===U?(s(t,!0),0===t.strm.avail_out?_t:bt):t.strstart>t.block_start&&(s(t,!1),0===t.strm.avail_out)?yt:yt}function p(t,e){for(var n,r;;){if(t.lookahead<ut){if(f(t),t.lookahead<ut&&e===M)return yt;if(0===t.lookahead)break}if(n=0,t.lookahead>=st&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+st-1])&t.hash_mask,n=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==n&&t.strstart-n<=t.w_size-ut&&(t.match_length=c(t,n)),t.match_length>=st)if(r=L._tr_tally(t,t.strstart-t.match_start,t.match_length-st),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=st){t.match_length--;do t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+st-1])&t.hash_mask,n=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart;while(0!==--t.match_length);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else r=L._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(r&&(s(t,!1),0===t.strm.avail_out))return yt}return t.insert=t.strstart<st-1?t.strstart:st-1,e===U?(s(t,!0),0===t.strm.avail_out?_t:bt):t.last_lit&&(s(t,!1),0===t.strm.avail_out)?yt:wt}function g(t,e){for(var n,r,i;;){if(t.lookahead<ut){if(f(t),t.lookahead<ut&&e===M)return yt;if(0===t.lookahead)break}if(n=0,t.lookahead>=st&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+st-1])&t.hash_mask,n=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=st-1,0!==n&&t.prev_length<t.max_lazy_match&&t.strstart-n<=t.w_size-ut&&(t.match_length=c(t,n),t.match_length<=5&&(t.strategy===Z||t.match_length===st&&t.strstart-t.match_start>4096)&&(t.match_length=st-1)),t.prev_length>=st&&t.match_length<=t.prev_length){i=t.strstart+t.lookahead-st,r=L._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-st),t.lookahead-=t.prev_length-1,t.prev_length-=2;do++t.strstart<=i&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+st-1])&t.hash_mask,n=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart);while(0!==--t.prev_length);if(t.match_available=0,t.match_length=st-1,t.strstart++,r&&(s(t,!1),0===t.strm.avail_out))return yt}else if(t.match_available){if(r=L._tr_tally(t,0,t.window[t.strstart-1]),r&&s(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return yt}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(r=L._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<st-1?t.strstart:st-1,e===U?(s(t,!0),0===t.strm.avail_out?_t:bt):t.last_lit&&(s(t,!1),0===t.strm.avail_out)?yt:wt}function v(t,e){for(var n,r,i,o,a=t.window;;){if(t.lookahead<=ht){if(f(t),t.lookahead<=ht&&e===M)return yt;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=st&&t.strstart>0&&(i=t.strstart-1,r=a[i],r===a[++i]&&r===a[++i]&&r===a[++i])){o=t.strstart+ht;do;while(r===a[++i]&&r===a[++i]&&r===a[++i]&&r===a[++i]&&r===a[++i]&&r===a[++i]&&r===a[++i]&&r===a[++i]&&o>i);t.match_length=ht-(o-i),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=st?(n=L._tr_tally(t,1,t.match_length-st),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(n=L._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),n&&(s(t,!1),0===t.strm.avail_out))return yt}return t.insert=0,e===U?(s(t,!0),0===t.strm.avail_out?_t:bt):t.last_lit&&(s(t,!1),0===t.strm.avail_out)?yt:wt}function m(t,e){for(var n;;){if(0===t.lookahead&&(f(t),0===t.lookahead)){if(e===M)return yt;break}if(t.match_length=0,n=L._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,n&&(s(t,!1),0===t.strm.avail_out))return yt}return t.insert=0,e===U?(s(t,!0),0===t.strm.avail_out?_t:bt):t.last_lit&&(s(t,!1),0===t.strm.avail_out)?yt:wt}function y(t){t.window_size=2*t.w_size,o(t.head),t.max_lazy_match=I[t.level].max_lazy,t.good_match=I[t.level].good_length,t.nice_match=I[t.level].nice_length,t.max_chain_length=I[t.level].max_chain,t.strstart=0,t.block_start=0,t.lookahead=0,t.insert=0,t.match_length=t.prev_length=st-1,t.match_available=0,t.ins_h=0}function w(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=V,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new A.Buf16(2*ot),this.dyn_dtree=new A.Buf16(2*(2*rt+1)),this.bl_tree=new A.Buf16(2*(2*it+1)),o(this.dyn_ltree),o(this.dyn_dtree),o(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new A.Buf16(at+1),this.heap=new A.Buf16(2*nt+1),o(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new A.Buf16(2*nt+1),o(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function _(t){var e;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=X,e=t.state,e.pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?ct:vt,t.adler=2===e.wrap?0:1,e.last_flush=M,L._tr_init(e),F):r(t,W)}function b(t){var e=_(t);return e===F&&y(t.state),e}function x(t,e){return t&&t.state?2!==t.state.wrap?W:(t.state.gzhead=e,F):W}function S(t,e,n,i,o,a){if(!t)return W;var s=1;if(e===H&&(e=6),0>i?(s=0,i=-i):i>15&&(s=2,i-=16),1>o||o>$||n!==V||8>i||i>15||0>e||e>9||0>a||a>Y)return r(t,W);8===i&&(i=9);var h=new w;return t.state=h,h.strm=t,h.wrap=s,h.gzhead=null,h.w_bits=i,h.w_size=1<<h.w_bits,h.w_mask=h.w_size-1,h.hash_bits=o+7,h.hash_size=1<<h.hash_bits,h.hash_mask=h.hash_size-1,h.hash_shift=~~((h.hash_bits+st-1)/st),h.window=new A.Buf8(2*h.w_size),h.head=new A.Buf16(h.hash_size),h.prev=new A.Buf16(h.w_size),h.lit_bufsize=1<<o+6,h.pending_buf_size=4*h.lit_bufsize,h.pending_buf=new A.Buf8(h.pending_buf_size),h.d_buf=h.lit_bufsize>>1,h.l_buf=3*h.lit_bufsize,h.level=e,h.strategy=a,h.method=n,b(t)}function k(t,e){return S(t,e,V,J,Q,K)}function E(t,e){var n,s,l,c;if(!t||!t.state||e>P||0>e)return t?r(t,W):W;if(s=t.state,!t.output||!t.input&&0!==t.avail_in||s.status===mt&&e!==U)return r(t,0===t.avail_out?j:W);if(s.strm=t,n=s.last_flush,s.last_flush=e,s.status===ct)if(2===s.wrap)t.adler=0,h(s,31),h(s,139),h(s,8),s.gzhead?(h(s,(s.gzhead.text?1:0)+(s.gzhead.hcrc?2:0)+(s.gzhead.extra?4:0)+(s.gzhead.name?8:0)+(s.gzhead.comment?16:0)),h(s,255&s.gzhead.time),h(s,s.gzhead.time>>8&255),h(s,s.gzhead.time>>16&255),h(s,s.gzhead.time>>24&255),h(s,9===s.level?2:s.strategy>=G||s.level<2?4:0),h(s,255&s.gzhead.os),s.gzhead.extra&&s.gzhead.extra.length&&(h(s,255&s.gzhead.extra.length),h(s,s.gzhead.extra.length>>8&255)),s.gzhead.hcrc&&(t.adler=B(t.adler,s.pending_buf,s.pending,0)),s.gzindex=0,s.status=ft):(h(s,0),h(s,0),h(s,0),h(s,0),h(s,0),h(s,9===s.level?2:s.strategy>=G||s.level<2?4:0),h(s,xt),s.status=vt);else{var f=V+(s.w_bits-8<<4)<<8,d=-1;d=s.strategy>=G||s.level<2?0:s.level<6?1:6===s.level?2:3,f|=d<<6,0!==s.strstart&&(f|=lt),f+=31-f%31,s.status=vt,u(s,f),0!==s.strstart&&(u(s,t.adler>>>16),u(s,65535&t.adler)),t.adler=1}if(s.status===ft)if(s.gzhead.extra){for(l=s.pending;s.gzindex<(65535&s.gzhead.extra.length)&&(s.pending!==s.pending_buf_size||(s.gzhead.hcrc&&s.pending>l&&(t.adler=B(t.adler,s.pending_buf,s.pending-l,l)),a(t),l=s.pending,s.pending!==s.pending_buf_size));)h(s,255&s.gzhead.extra[s.gzindex]),s.gzindex++;s.gzhead.hcrc&&s.pending>l&&(t.adler=B(t.adler,s.pending_buf,s.pending-l,l)),s.gzindex===s.gzhead.extra.length&&(s.gzindex=0,s.status=dt)}else s.status=dt;if(s.status===dt)if(s.gzhead.name){l=s.pending;do{if(s.pending===s.pending_buf_size&&(s.gzhead.hcrc&&s.pending>l&&(t.adler=B(t.adler,s.pending_buf,s.pending-l,l)),a(t),l=s.pending,s.pending===s.pending_buf_size)){c=1;break}c=s.gzindex<s.gzhead.name.length?255&s.gzhead.name.charCodeAt(s.gzindex++):0,h(s,c)}while(0!==c);s.gzhead.hcrc&&s.pending>l&&(t.adler=B(t.adler,s.pending_buf,s.pending-l,l)),0===c&&(s.gzindex=0,s.status=pt)}else s.status=pt;if(s.status===pt)if(s.gzhead.comment){l=s.pending;do{if(s.pending===s.pending_buf_size&&(s.gzhead.hcrc&&s.pending>l&&(t.adler=B(t.adler,s.pending_buf,s.pending-l,l)),a(t),l=s.pending,s.pending===s.pending_buf_size)){c=1;break}c=s.gzindex<s.gzhead.comment.length?255&s.gzhead.comment.charCodeAt(s.gzindex++):0,h(s,c)}while(0!==c);s.gzhead.hcrc&&s.pending>l&&(t.adler=B(t.adler,s.pending_buf,s.pending-l,l)),0===c&&(s.status=gt)}else s.status=gt;if(s.status===gt&&(s.gzhead.hcrc?(s.pending+2>s.pending_buf_size&&a(t),s.pending+2<=s.pending_buf_size&&(h(s,255&t.adler),h(s,t.adler>>8&255),t.adler=0,s.status=vt)):s.status=vt),0!==s.pending){if(a(t),0===t.avail_out)return s.last_flush=-1,F}else if(0===t.avail_in&&i(e)<=i(n)&&e!==U)return r(t,j);if(s.status===mt&&0!==t.avail_in)return r(t,j);if(0!==t.avail_in||0!==s.lookahead||e!==M&&s.status!==mt){var p=s.strategy===G?m(s,e):s.strategy===q?v(s,e):I[s.level].func(s,e);if((p===_t||p===bt)&&(s.status=mt),p===yt||p===_t)return 0===t.avail_out&&(s.last_flush=-1),F;if(p===wt&&(e===O?L._tr_align(s):e!==P&&(L._tr_stored_block(s,0,0,!1),e===D&&(o(s.head),0===s.lookahead&&(s.strstart=0,s.block_start=0,s.insert=0))),a(t),0===t.avail_out))return s.last_flush=-1,F}return e!==U?F:s.wrap<=0?z:(2===s.wrap?(h(s,255&t.adler),h(s,t.adler>>8&255),h(s,t.adler>>16&255),h(s,t.adler>>24&255),h(s,255&t.total_in),h(s,t.total_in>>8&255),h(s,t.total_in>>16&255),h(s,t.total_in>>24&255)):(u(s,t.adler>>>16),u(s,65535&t.adler)),a(t),s.wrap>0&&(s.wrap=-s.wrap),0!==s.pending?F:z)}function C(t){var e;return t&&t.state?(e=t.state.status,e!==ct&&e!==ft&&e!==dt&&e!==pt&&e!==gt&&e!==vt&&e!==mt?r(t,W):(t.state=null,e===vt?r(t,N):F)):W}var I,A=n(98),L=n(95),R=n(96),B=n(97),T=n(73),M=0,O=1,D=3,U=4,P=5,F=0,z=1,W=-2,N=-3,j=-5,H=-1,Z=1,G=2,q=3,Y=4,K=0,X=2,V=8,$=9,J=15,Q=8,tt=29,et=256,nt=et+1+tt,rt=30,it=19,ot=2*nt+1,at=15,st=3,ht=258,ut=ht+st+1,lt=32,ct=42,ft=69,dt=73,pt=91,gt=103,vt=113,mt=666,yt=1,wt=2,_t=3,bt=4,xt=3,St=function(t,e,n,r,i){this.good_length=t,this.max_lazy=e,this.nice_length=n,this.max_chain=r,this.func=i};I=[new St(0,0,0,0,d),new St(4,4,8,4,p),new St(4,5,16,8,p),new St(4,6,32,32,p),new St(4,4,16,16,g),new St(8,16,32,32,g),new St(8,16,128,128,g),new St(8,32,128,256,g),new St(32,128,258,1024,g),new St(32,258,258,4096,g)],e.deflateInit=k,e.deflateInit2=S,e.deflateReset=b,e.deflateResetKeep=_,e.deflateSetHeader=x,e.deflate=E,e.deflateEnd=C,e.deflateInfo="pako deflate (from Nodeca project)"},function(t,e,n){"use strict";function r(t){return(t>>>24&255)+(t>>>8&65280)+((65280&t)<<8)+((255&t)<<24)}function i(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new m.Buf16(320),this.work=new m.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function o(t){var e;return t&&t.state?(e=t.state,t.total_in=t.total_out=e.total=0,t.msg="",e.wrap&&(t.adler=1&e.wrap),e.mode=U,e.last=0,e.havedict=0,e.dmax=32768,e.head=null,e.hold=0,e.bits=0,e.lencode=e.lendyn=new m.Buf32(pt),e.distcode=e.distdyn=new m.Buf32(gt),e.sane=1,e.back=-1,A):B}function a(t){var e;return t&&t.state?(e=t.state,e.wsize=0,e.whave=0,e.wnext=0,o(t)):B}function s(t,e){var n,r;return t&&t.state?(r=t.state,0>e?(n=0,e=-e):(n=(e>>4)+1,48>e&&(e&=15)),e&&(8>e||e>15)?B:(null!==r.window&&r.wbits!==e&&(r.window=null),r.wrap=n,r.wbits=e,a(t))):B}function h(t,e){var n,r;return t?(r=new i,t.state=r,r.window=null,n=s(t,e),n!==A&&(t.state=null),n):B}function u(t){return h(t,mt)}function l(t){if(yt){var e;for(g=new m.Buf32(512),v=new m.Buf32(32),e=0;144>e;)t.lens[e++]=8;for(;256>e;)t.lens[e++]=9;for(;280>e;)t.lens[e++]=7;for(;288>e;)t.lens[e++]=8;for(b(S,t.lens,0,288,g,0,t.work,{bits:9}),e=0;32>e;)t.lens[e++]=5;b(k,t.lens,0,32,v,0,t.work,{bits:5}),yt=!1}t.lencode=g,t.lenbits=9,t.distcode=v,t.distbits=5}function c(t,e,n,r){var i,o=t.state;return null===o.window&&(o.wsize=1<<o.wbits,o.wnext=0,o.whave=0,o.window=new m.Buf8(o.wsize)),r>=o.wsize?(m.arraySet(o.window,e,n-o.wsize,o.wsize,0),o.wnext=0,o.whave=o.wsize):(i=o.wsize-o.wnext,i>r&&(i=r),m.arraySet(o.window,e,n-r,i,o.wnext),r-=i,r?(m.arraySet(o.window,e,n-r,r,0),o.wnext=r,o.whave=o.wsize):(o.wnext+=i,o.wnext===o.wsize&&(o.wnext=0),o.whave<o.wsize&&(o.whave+=i))),0}function f(t,e){var n,i,o,a,s,h,u,f,d,p,g,v,pt,gt,vt,mt,yt,wt,_t,bt,xt,St,kt,Et,Ct=0,It=new m.Buf8(4),At=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!t||!t.state||!t.output||!t.input&&0!==t.avail_in)return B;n=t.state,n.mode===Y&&(n.mode=K),s=t.next_out,o=t.output,u=t.avail_out,a=t.next_in,i=t.input,h=t.avail_in,f=n.hold,d=n.bits,p=h,g=u,St=A;t:for(;;)switch(n.mode){case U:if(0===n.wrap){n.mode=K;break}for(;16>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}if(2&n.wrap&&35615===f){n.check=0,It[0]=255&f,It[1]=f>>>8&255,n.check=w(n.check,It,2,0),f=0,d=0,n.mode=P;break}if(n.flags=0,n.head&&(n.head.done=!1),!(1&n.wrap)||(((255&f)<<8)+(f>>8))%31){t.msg="incorrect header check",n.mode=ct;break}if((15&f)!==D){t.msg="unknown compression method",n.mode=ct;break}if(f>>>=4,d-=4,xt=(15&f)+8,0===n.wbits)n.wbits=xt;else if(xt>n.wbits){t.msg="invalid window size",n.mode=ct;break}n.dmax=1<<xt,t.adler=n.check=1,n.mode=512&f?G:Y,f=0,d=0;break;case P:for(;16>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}if(n.flags=f,(255&n.flags)!==D){t.msg="unknown compression method",n.mode=ct;break}if(57344&n.flags){t.msg="unknown header flags set",n.mode=ct;break}n.head&&(n.head.text=f>>8&1),512&n.flags&&(It[0]=255&f,It[1]=f>>>8&255,n.check=w(n.check,It,2,0)),f=0,d=0,n.mode=F;case F:for(;32>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}n.head&&(n.head.time=f),512&n.flags&&(It[0]=255&f,It[1]=f>>>8&255,It[2]=f>>>16&255,It[3]=f>>>24&255,n.check=w(n.check,It,4,0)),f=0,d=0,n.mode=z;case z:for(;16>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}n.head&&(n.head.xflags=255&f,n.head.os=f>>8),512&n.flags&&(It[0]=255&f,It[1]=f>>>8&255,n.check=w(n.check,It,2,0)),f=0,d=0,n.mode=W;case W:if(1024&n.flags){for(;16>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}n.length=f,n.head&&(n.head.extra_len=f),512&n.flags&&(It[0]=255&f,It[1]=f>>>8&255,n.check=w(n.check,It,2,0)),f=0,d=0}else n.head&&(n.head.extra=null);n.mode=N;case N:if(1024&n.flags&&(v=n.length,v>h&&(v=h),v&&(n.head&&(xt=n.head.extra_len-n.length,n.head.extra||(n.head.extra=new Array(n.head.extra_len)),m.arraySet(n.head.extra,i,a,v,xt)),512&n.flags&&(n.check=w(n.check,i,v,a)),h-=v,a+=v,n.length-=v),n.length))break t;n.length=0,n.mode=j;case j:if(2048&n.flags){if(0===h)break t;v=0;do xt=i[a+v++],n.head&&xt&&n.length<65536&&(n.head.name+=String.fromCharCode(xt));while(xt&&h>v);if(512&n.flags&&(n.check=w(n.check,i,v,a)),h-=v,a+=v,xt)break t}else n.head&&(n.head.name=null);n.length=0,n.mode=H;case H:if(4096&n.flags){if(0===h)break t;v=0;do xt=i[a+v++],n.head&&xt&&n.length<65536&&(n.head.comment+=String.fromCharCode(xt));while(xt&&h>v);if(512&n.flags&&(n.check=w(n.check,i,v,a)),h-=v,a+=v,xt)break t}else n.head&&(n.head.comment=null);n.mode=Z;case Z:if(512&n.flags){for(;16>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}if(f!==(65535&n.check)){t.msg="header crc mismatch",n.mode=ct;break}f=0,d=0}n.head&&(n.head.hcrc=n.flags>>9&1,n.head.done=!0),t.adler=n.check=0,n.mode=Y;break;case G:for(;32>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}t.adler=n.check=r(f),f=0,d=0,n.mode=q;case q:if(0===n.havedict)return t.next_out=s,t.avail_out=u,t.next_in=a,t.avail_in=h,n.hold=f,n.bits=d,R;t.adler=n.check=1,n.mode=Y;case Y:if(e===C||e===I)break t;case K:if(n.last){f>>>=7&d,d-=7&d,n.mode=ht;break}for(;3>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}switch(n.last=1&f,f>>>=1,d-=1,3&f){case 0:n.mode=X;break;case 1:if(l(n),n.mode=et,e===I){f>>>=2,d-=2;break t}break;case 2:n.mode=J;break;case 3:t.msg="invalid block type",n.mode=ct}f>>>=2,d-=2;break;case X:for(f>>>=7&d,d-=7&d;32>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}if((65535&f)!==(f>>>16^65535)){t.msg="invalid stored block lengths",n.mode=ct;break}if(n.length=65535&f,f=0,d=0,n.mode=V,e===I)break t;case V:n.mode=$;case $:if(v=n.length){if(v>h&&(v=h),v>u&&(v=u),0===v)break t;m.arraySet(o,i,a,v,s),h-=v,a+=v,u-=v,s+=v,n.length-=v;break}n.mode=Y;break;case J:for(;14>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}if(n.nlen=(31&f)+257,f>>>=5,d-=5,n.ndist=(31&f)+1,f>>>=5,d-=5,n.ncode=(15&f)+4,f>>>=4,d-=4,n.nlen>286||n.ndist>30){t.msg="too many length or distance symbols",n.mode=ct;break}n.have=0,n.mode=Q;case Q:for(;n.have<n.ncode;){for(;3>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}n.lens[At[n.have++]]=7&f,f>>>=3,d-=3}for(;n.have<19;)n.lens[At[n.have++]]=0;if(n.lencode=n.lendyn,n.lenbits=7,kt={bits:n.lenbits},St=b(x,n.lens,0,19,n.lencode,0,n.work,kt),n.lenbits=kt.bits,St){t.msg="invalid code lengths set",n.mode=ct;break}n.have=0,n.mode=tt;case tt:for(;n.have<n.nlen+n.ndist;){for(;Ct=n.lencode[f&(1<<n.lenbits)-1],vt=Ct>>>24,mt=Ct>>>16&255,yt=65535&Ct,!(d>=vt);){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}if(16>yt)f>>>=vt,d-=vt,n.lens[n.have++]=yt;else{if(16===yt){for(Et=vt+2;Et>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}if(f>>>=vt,d-=vt,0===n.have){t.msg="invalid bit length repeat",n.mode=ct;break}xt=n.lens[n.have-1],v=3+(3&f),f>>>=2,d-=2}else if(17===yt){for(Et=vt+3;Et>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}f>>>=vt,d-=vt,xt=0,v=3+(7&f),f>>>=3,d-=3}else{for(Et=vt+7;Et>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}f>>>=vt,d-=vt,xt=0,v=11+(127&f),f>>>=7,d-=7}if(n.have+v>n.nlen+n.ndist){t.msg="invalid bit length repeat",n.mode=ct;break}for(;v--;)n.lens[n.have++]=xt}}if(n.mode===ct)break;if(0===n.lens[256]){t.msg="invalid code -- missing end-of-block",n.mode=ct;break}if(n.lenbits=9,kt={bits:n.lenbits},St=b(S,n.lens,0,n.nlen,n.lencode,0,n.work,kt),n.lenbits=kt.bits,St){t.msg="invalid literal/lengths set",n.mode=ct;break}if(n.distbits=6,n.distcode=n.distdyn,kt={bits:n.distbits},St=b(k,n.lens,n.nlen,n.ndist,n.distcode,0,n.work,kt),n.distbits=kt.bits,St){t.msg="invalid distances set",n.mode=ct;break}if(n.mode=et,e===I)break t;case et:n.mode=nt;case nt:if(h>=6&&u>=258){t.next_out=s,t.avail_out=u,t.next_in=a,t.avail_in=h,n.hold=f,n.bits=d,_(t,g),s=t.next_out,o=t.output,u=t.avail_out,a=t.next_in,i=t.input,h=t.avail_in,f=n.hold,d=n.bits,n.mode===Y&&(n.back=-1);break}for(n.back=0;Ct=n.lencode[f&(1<<n.lenbits)-1],vt=Ct>>>24,mt=Ct>>>16&255,yt=65535&Ct,!(d>=vt);){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}if(mt&&0===(240&mt)){for(wt=vt,_t=mt,bt=yt;Ct=n.lencode[bt+((f&(1<<wt+_t)-1)>>wt)],vt=Ct>>>24,mt=Ct>>>16&255,yt=65535&Ct,!(d>=wt+vt);){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}f>>>=wt,d-=wt,n.back+=wt}if(f>>>=vt,d-=vt,n.back+=vt,n.length=yt,0===mt){n.mode=st;break}if(32&mt){n.back=-1,n.mode=Y;break}if(64&mt){t.msg="invalid literal/length code",n.mode=ct;break}n.extra=15&mt,n.mode=rt;case rt:if(n.extra){for(Et=n.extra;Et>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}n.length+=f&(1<<n.extra)-1,f>>>=n.extra,d-=n.extra,n.back+=n.extra}n.was=n.length,n.mode=it;case it:for(;Ct=n.distcode[f&(1<<n.distbits)-1],vt=Ct>>>24,mt=Ct>>>16&255,yt=65535&Ct,!(d>=vt);){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}if(0===(240&mt)){for(wt=vt,_t=mt,bt=yt;Ct=n.distcode[bt+((f&(1<<wt+_t)-1)>>wt)],vt=Ct>>>24,mt=Ct>>>16&255,yt=65535&Ct,!(d>=wt+vt);){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}f>>>=wt,d-=wt,n.back+=wt}if(f>>>=vt,d-=vt,n.back+=vt,64&mt){t.msg="invalid distance code",n.mode=ct;break}n.offset=yt,n.extra=15&mt,n.mode=ot;case ot:if(n.extra){for(Et=n.extra;Et>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}n.offset+=f&(1<<n.extra)-1,f>>>=n.extra,d-=n.extra,n.back+=n.extra}if(n.offset>n.dmax){t.msg="invalid distance too far back",n.mode=ct;break}n.mode=at;case at:if(0===u)break t;if(v=g-u,n.offset>v){if(v=n.offset-v,v>n.whave&&n.sane){t.msg="invalid distance too far back",n.mode=ct;break}v>n.wnext?(v-=n.wnext,pt=n.wsize-v):pt=n.wnext-v,v>n.length&&(v=n.length),gt=n.window}else gt=o,pt=s-n.offset,v=n.length;v>u&&(v=u),u-=v,n.length-=v;do o[s++]=gt[pt++];while(--v);0===n.length&&(n.mode=nt);break;case st:if(0===u)break t;o[s++]=n.length,u--,n.mode=nt;break;case ht:if(n.wrap){for(;32>d;){if(0===h)break t;h--,f|=i[a++]<<d,d+=8}if(g-=u,t.total_out+=g,n.total+=g,g&&(t.adler=n.check=n.flags?w(n.check,o,g,s-g):y(n.check,o,g,s-g)),g=u,(n.flags?f:r(f))!==n.check){t.msg="incorrect data check",n.mode=ct;break}f=0,d=0}n.mode=ut;case ut:if(n.wrap&&n.flags){for(;32>d;){if(0===h)break t;h--,f+=i[a++]<<d,d+=8}if(f!==(4294967295&n.total)){t.msg="incorrect length check",n.mode=ct;break}f=0,d=0}n.mode=lt;case lt:St=L;break t;case ct:St=T;break t;case ft:return M;case dt:default:return B}return t.next_out=s,t.avail_out=u,t.next_in=a,t.avail_in=h,n.hold=f,n.bits=d,(n.wsize||g!==t.avail_out&&n.mode<ct&&(n.mode<ht||e!==E))&&c(t,t.output,t.next_out,g-t.avail_out)?(n.mode=ft,M):(p-=t.avail_in,g-=t.avail_out,t.total_in+=p,t.total_out+=g,n.total+=g,n.wrap&&g&&(t.adler=n.check=n.flags?w(n.check,o,g,t.next_out-g):y(n.check,o,g,t.next_out-g)),t.data_type=n.bits+(n.last?64:0)+(n.mode===Y?128:0)+(n.mode===et||n.mode===V?256:0),(0===p&&0===g||e===E)&&St===A&&(St=O),St)}function d(t){if(!t||!t.state)return B;var e=t.state;return e.window&&(e.window=null),t.state=null,A}function p(t,e){var n;return t&&t.state?(n=t.state,0===(2&n.wrap)?B:(n.head=e,e.done=!1,A)):B}var g,v,m=n(98),y=n(96),w=n(97),_=n(102),b=n(103),x=0,S=1,k=2,E=4,C=5,I=6,A=0,L=1,R=2,B=-2,T=-3,M=-4,O=-5,D=8,U=1,P=2,F=3,z=4,W=5,N=6,j=7,H=8,Z=9,G=10,q=11,Y=12,K=13,X=14,V=15,$=16,J=17,Q=18,tt=19,et=20,nt=21,rt=22,it=23,ot=24,at=25,st=26,ht=27,ut=28,lt=29,ct=30,ft=31,dt=32,pt=852,gt=592,vt=15,mt=vt,yt=!0;e.inflateReset=a,e.inflateReset2=s,e.inflateResetKeep=o,e.inflateInit=u,e.inflateInit2=h,e.inflate=f,e.inflateEnd=d,e.inflateGetHeader=p,e.inflateInfo="pako inflate (from Nodeca project)"},function(t,e,n){t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},function(t,e,n){"use strict";function r(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}t.exports=r},function(t,e,n){(function(){var e,r,i,NameTable,o;o=n(10),r=n(34),i=n(79),NameTable=n(80),e=function(){function t(t){this.contents=new r(t),this.parse(this.contents)}return t.open=function(e){var n;return n=o.readFileSync(e),new t(n)},t.prototype.parse=function(t){var e,n,o,a,s,h,u,l,c,f,d,p,g,v,m,y,w,_,b,x,S,k,E,C,I,A,L,R,B;for(h=t.readInt(),w=t.readInt(),s=t.readInt(),y=t.readInt(),this.map={},t.pos=w+24,L=t.readShort()+w,S=t.readShort()+w,t.pos=L,_=t.readShort(),d=R=0;_>=R;d=R+=1){for(A=t.readString(4),b=t.readShort(),I=t.readShort(),this.map[A]={list:[],named:{}},C=t.pos,t.pos=L+I,g=B=0;b>=B;g=B+=1)p=t.readShort(),k=t.readShort(),e=t.readByte(),n=t.readByte()<<16,o=t.readByte()<<8,a=t.readByte(),u=h+(0|n|o|a),f=t.readUInt32(),l={id:p,attributes:e,offset:u,handle:f},E=t.pos,-1!==k&&w+y>S+k?(t.pos=S+k,v=t.readByte(),l.name=t.readString(v)):"sfnt"===A&&(t.pos=l.offset,m=t.readUInt32(),c={},c.contents=new r(t.slice(t.pos,t.pos+m)),c.directory=new i(c.contents),x=new NameTable(c),l.name=x.fontName[0].raw),t.pos=E,this.map[A].list.push(l),l.name&&(this.map[A].named[l.name]=l);t.pos=C}},t.prototype.getNamedFont=function(t){var e,n,r,i,o,a;if(e=this.contents,i=e.pos,n=null!=(a=this.map.sfnt)?a.named[t]:void 0,!n)throw new Error("Font "+t+" not found in DFont file.");return e.pos=n.offset,r=e.readUInt32(),o=e.slice(e.pos,e.pos+r),e.pos=i,o},t}(),t.exports=e}).call(this)},function(t,e,n){(function(e){(function(){var r,i,o=[].slice;r=n(34),i=function(){function t(t){var e,n,r,i;for(this.scalarType=t.readInt(),this.tableCount=t.readShort(),this.searchRange=t.readShort(),this.entrySelector=t.readShort(),this.rangeShift=t.readShort(),this.tables={},n=r=0,i=this.tableCount;i>=0?i>r:r>i;n=i>=0?++r:--r)e={tag:t.readString(4),checksum:t.readInt(),offset:t.readInt(),length:t.readInt()},this.tables[e.tag]=e}var n;return t.prototype.encode=function(t){var i,o,a,s,h,u,l,c,f,d,p,g,v,m;g=Object.keys(t).length,u=Math.log(2),f=16*Math.floor(Math.log(g)/u),s=Math.floor(f/u),c=16*g-f,o=new r,o.writeInt(this.scalarType),o.writeShort(g),o.writeShort(f),o.writeShort(s),o.writeShort(c),a=16*g,l=o.pos+a,h=null,v=[];for(m in t)for(p=t[m],o.writeString(m),o.writeInt(n(p)),o.writeInt(l),o.writeInt(p.length),v=v.concat(p),"head"===m&&(h=l),l+=p.length;l%4;)v.push(0),l++;return o.write(v),d=n(o.data),i=2981146554-d,o.pos=h+8,o.writeUInt32(i),new e(o.data)},n=function(t){var e,n,i,a,s;for(t=o.call(t);t.length%4;)t.push(0);for(i=new r(t),n=0,e=a=0,s=t.length;s>a;e=a+=4)n+=i.readUInt32();return 4294967295&n},t}(),t.exports=i}).call(this)}).call(e,n(4).Buffer)},function(t,e,n){(function(){var e,r,NameTable,i,o,a={}.hasOwnProperty,s=function(t,e){function n(){this.constructor=t}for(var r in e)a.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};i=n(99),e=n(34),o=n(89),NameTable=function(t){function NameTable(){return NameTable.__super__.constructor.apply(this,arguments)}var n;return s(NameTable,t),NameTable.prototype.tag="name",NameTable.prototype.parse=function(t){var e,n,i,o,a,s,h,u,l,c,f,d,p;for(t.pos=this.offset,o=t.readShort(),e=t.readShort(),h=t.readShort(),n=[],a=c=0;e>=0?e>c:c>e;a=e>=0?++c:--c)n.push({platformID:t.readShort(),encodingID:t.readShort(),languageID:t.readShort(),nameID:t.readShort(),length:t.readShort(),offset:this.offset+h+t.readShort()});for(u={},a=f=0,d=n.length;d>f;a=++f)i=n[a],t.pos=i.offset,l=t.readString(i.length),s=new r(l,i),null==u[p=i.nameID]&&(u[p]=[]),u[i.nameID].push(s);return this.strings=u,this.copyright=u[0],this.fontFamily=u[1],this.fontSubfamily=u[2],this.uniqueSubfamily=u[3],this.fontName=u[4],this.version=u[5],this.postscriptName=u[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g,""),this.trademark=u[7],this.manufacturer=u[8],this.designer=u[9],this.description=u[10],this.vendorUrl=u[11],this.designerUrl=u[12],this.license=u[13],this.licenseUrl=u[14],this.preferredFamily=u[15],this.preferredSubfamily=u[17],this.compatibleFull=u[18],this.sampleText=u[19]},n="AAAAAA",NameTable.prototype.encode=function(){var t,i,a,s,h,u,l,c,f,d,p,g,v,m;f={},m=this.strings;for(t in m)p=m[t],f[t]=p;h=new r(""+n+"+"+this.postscriptName,{platformID:1,encodingID:0,languageID:0}),f[6]=[h],n=o.successorOf(n),u=0;for(t in f)i=f[t],null!=i&&(u+=i.length);d=new e,l=new e,d.writeShort(0),d.writeShort(u),d.writeShort(6+12*u);for(a in f)if(i=f[a],null!=i)for(g=0,v=i.length;v>g;g++)c=i[g],d.writeShort(c.platformID),d.writeShort(c.encodingID),d.writeShort(c.languageID),d.writeShort(a),d.writeShort(c.length),d.writeShort(l.pos),l.writeString(c.raw);return s={postscriptName:h.raw,table:d.data.concat(l.data)}},NameTable}(i),t.exports=NameTable,r=function(){function t(t,e){this.raw=t,this.length=this.raw.length,this.platformID=e.platformID,this.encodingID=e.encodingID,this.languageID=e.languageID}return t}()}).call(this)},function(t,e,n){(function(){var e,HeadTable,r,i={}.hasOwnProperty,o=function(t,e){function n(){this.constructor=t}for(var r in e)i.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};r=n(99),e=n(34),HeadTable=function(t){function HeadTable(){return HeadTable.__super__.constructor.apply(this,arguments)}return o(HeadTable,t),HeadTable.prototype.tag="head",HeadTable.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.revision=t.readInt(),this.checkSumAdjustment=t.readInt(),this.magicNumber=t.readInt(),this.flags=t.readShort(),this.unitsPerEm=t.readShort(),this.created=t.readLongLong(),this.modified=t.readLongLong(),this.xMin=t.readShort(),this.yMin=t.readShort(),this.xMax=t.readShort(),this.yMax=t.readShort(),this.macStyle=t.readShort(),this.lowestRecPPEM=t.readShort(),this.fontDirectionHint=t.readShort(),this.indexToLocFormat=t.readShort(),this.glyphDataFormat=t.readShort()},HeadTable.prototype.encode=function(t){var n;return n=new e,n.writeInt(this.version),n.writeInt(this.revision),n.writeInt(this.checkSumAdjustment),n.writeInt(this.magicNumber),n.writeShort(this.flags),n.writeShort(this.unitsPerEm),n.writeLongLong(this.created),n.writeLongLong(this.modified),n.writeShort(this.xMin),n.writeShort(this.yMin),n.writeShort(this.xMax),n.writeShort(this.yMax),n.writeShort(this.macStyle),n.writeShort(this.lowestRecPPEM),n.writeShort(this.fontDirectionHint),n.writeShort(t.type),n.writeShort(this.glyphDataFormat),n.data},HeadTable}(r),t.exports=HeadTable}).call(this)},function(t,e,n){(function(){var e,CmapTable,r,i,o={}.hasOwnProperty,a=function(t,e){function n(){this.constructor=t}for(var r in e)o.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};i=n(99),r=n(34),CmapTable=function(t){function CmapTable(){return CmapTable.__super__.constructor.apply(this,arguments)}return a(CmapTable,t),CmapTable.prototype.tag="cmap",CmapTable.prototype.parse=function(t){var n,r,i,o;for(t.pos=this.offset,this.version=t.readUInt16(),i=t.readUInt16(),this.tables=[],this.unicode=null,r=o=0;i>=0?i>o:o>i;r=i>=0?++o:--o)n=new e(t,this.offset),this.tables.push(n),n.isUnicode&&null==this.unicode&&(this.unicode=n);return!0},CmapTable.encode=function(t,n){var i,o;return null==n&&(n="macroman"),i=e.encode(t,n),o=new r,o.writeUInt16(0),o.writeUInt16(1),i.table=o.data.concat(i.subtable),i},CmapTable}(i),e=function(){function t(t,e){var n,r,i,o,a,s,h,u,l,c,f,d,p,g,v,m,y,w,_;switch(this.platformID=t.readUInt16(),this.encodingID=t.readShort(),this.offset=e+t.readInt(),c=t.pos,t.pos=this.offset,this.format=t.readUInt16(),this.length=t.readUInt16(),this.language=t.readUInt16(),this.isUnicode=3===this.platformID&&1===this.encodingID&&4===this.format||0===this.platformID&&4===this.format,this.codeMap={},this.format){case 0:for(s=m=0;256>m;s=++m)this.codeMap[s]=t.readByte();break;case 4:for(d=t.readUInt16(),f=d/2,t.pos+=6,i=function(){var e,n;for(n=[],s=e=0;f>=0?f>e:e>f;s=f>=0?++e:--e)n.push(t.readUInt16());return n}(),t.pos+=2,g=function(){var e,n;for(n=[],s=e=0;f>=0?f>e:e>f;s=f>=0?++e:--e)n.push(t.readUInt16());return n}(),h=function(){var e,n;for(n=[],s=e=0;f>=0?f>e:e>f;s=f>=0?++e:--e)n.push(t.readUInt16());return n}(),u=function(){var e,n;for(n=[],s=e=0;f>=0?f>e:e>f;s=f>=0?++e:--e)n.push(t.readUInt16());return n}(),r=(this.length-t.pos+this.offset)/2,a=function(){var e,n;for(n=[],s=e=0;r>=0?r>e:e>r;s=r>=0?++e:--e)n.push(t.readUInt16());return n}(),s=y=0,_=i.length;_>y;s=++y)for(v=i[s],p=g[s],n=w=p;v>=p?v>=w:w>=v;n=v>=p?++w:--w)0===u[s]?o=n+h[s]:(l=u[s]/2+(n-p)-(f-s),o=a[l]||0,0!==o&&(o+=h[s])),this.codeMap[n]=65535&o}t.pos=c}return t.encode=function(t,e){var n,i,o,a,s,h,u,l,c,f,d,p,g,v,m,y,w,_,b,x,S,k,E,C,I,A,L,R,B,T,M,O,D,U,P,F,z,W,N,j,H,Z,G,q,Y,K,X;switch(B=new r,a=Object.keys(t).sort(function(t,e){return t-e}),e){case"macroman":for(g=0,v=function(){var t,e;for(e=[],p=t=0;256>t;p=++t)e.push(0);return e}(),y={0:0},o={},T=0,U=a.length;U>T;T++)i=a[T],null==y[q=t[i]]&&(y[q]=++g),o[i]={old:t[i],"new":y[t[i]]},v[i]=y[t[i]];return B.writeUInt16(1),B.writeUInt16(0),B.writeUInt32(12),B.writeUInt16(0),
B.writeUInt16(262),B.writeUInt16(0),B.write(v),k={charMap:o,subtable:B.data,maxGlyphID:g+1};case"unicode":for(L=[],c=[],w=0,y={},n={},m=u=null,M=0,P=a.length;P>M;M++)i=a[M],b=t[i],null==y[b]&&(y[b]=++w),n[i]={old:b,"new":y[b]},s=y[b]-i,(null==m||s!==u)&&(m&&c.push(m),L.push(i),u=s),m=i;for(m&&c.push(m),c.push(65535),L.push(65535),C=L.length,I=2*C,E=2*Math.pow(Math.log(C)/Math.LN2,2),f=Math.log(E/2)/Math.LN2,S=2*C-E,h=[],x=[],d=[],p=O=0,F=L.length;F>O;p=++O){if(A=L[p],l=c[p],65535===A){h.push(0),x.push(0);break}if(R=n[A]["new"],A-R>=32768)for(h.push(0),x.push(2*(d.length+C-p)),i=D=A;l>=A?l>=D:D>=l;i=l>=A?++D:--D)d.push(n[i]["new"]);else h.push(R-A),x.push(0)}for(B.writeUInt16(3),B.writeUInt16(1),B.writeUInt32(12),B.writeUInt16(4),B.writeUInt16(16+8*C+2*d.length),B.writeUInt16(0),B.writeUInt16(I),B.writeUInt16(E),B.writeUInt16(f),B.writeUInt16(S),Z=0,z=c.length;z>Z;Z++)i=c[Z],B.writeUInt16(i);for(B.writeUInt16(0),G=0,W=L.length;W>G;G++)i=L[G],B.writeUInt16(i);for(Y=0,N=h.length;N>Y;Y++)s=h[Y],B.writeUInt16(s);for(K=0,j=x.length;j>K;K++)_=x[K],B.writeUInt16(_);for(X=0,H=d.length;H>X;X++)g=d[X],B.writeUInt16(g);return k={charMap:n,subtable:B.data,maxGlyphID:w+1}}},t}(),t.exports=CmapTable}).call(this)},function(t,e,n){(function(){var e,HmtxTable,r,i={}.hasOwnProperty,o=function(t,e){function n(){this.constructor=t}for(var r in e)i.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};r=n(99),e=n(34),HmtxTable=function(t){function HmtxTable(){return HmtxTable.__super__.constructor.apply(this,arguments)}return o(HmtxTable,t),HmtxTable.prototype.tag="hmtx",HmtxTable.prototype.parse=function(t){var e,n,r,i,o,a,s,h;for(t.pos=this.offset,this.metrics=[],e=o=0,s=this.file.hhea.numberOfMetrics;s>=0?s>o:o>s;e=s>=0?++o:--o)this.metrics.push({advance:t.readUInt16(),lsb:t.readInt16()});for(r=this.file.maxp.numGlyphs-this.file.hhea.numberOfMetrics,this.leftSideBearings=function(){var n,i;for(i=[],e=n=0;r>=0?r>n:n>r;e=r>=0?++n:--n)i.push(t.readInt16());return i}(),this.widths=function(){var t,e,n,r;for(n=this.metrics,r=[],t=0,e=n.length;e>t;t++)i=n[t],r.push(i.advance);return r}.call(this),n=this.widths[this.widths.length-1],h=[],e=a=0;r>=0?r>a:a>r;e=r>=0?++a:--a)h.push(this.widths.push(n));return h},HmtxTable.prototype.forGlyph=function(t){var e;return t in this.metrics?this.metrics[t]:e={advance:this.metrics[this.metrics.length-1].advance,lsb:this.leftSideBearings[t-this.metrics.length]}},HmtxTable.prototype.encode=function(t){var n,r,i,o,a;for(i=new e,o=0,a=t.length;a>o;o++)n=t[o],r=this.forGlyph(n),i.writeUInt16(r.advance),i.writeUInt16(r.lsb);return i.data},HmtxTable}(r),t.exports=HmtxTable}).call(this)},function(t,e,n){(function(){var e,HheaTable,r,i={}.hasOwnProperty,o=function(t,e){function n(){this.constructor=t}for(var r in e)i.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};r=n(99),e=n(34),HheaTable=function(t){function HheaTable(){return HheaTable.__super__.constructor.apply(this,arguments)}return o(HheaTable,t),HheaTable.prototype.tag="hhea",HheaTable.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.ascender=t.readShort(),this.decender=t.readShort(),this.lineGap=t.readShort(),this.advanceWidthMax=t.readShort(),this.minLeftSideBearing=t.readShort(),this.minRightSideBearing=t.readShort(),this.xMaxExtent=t.readShort(),this.caretSlopeRise=t.readShort(),this.caretSlopeRun=t.readShort(),this.caretOffset=t.readShort(),t.pos+=8,this.metricDataFormat=t.readShort(),this.numberOfMetrics=t.readUInt16()},HheaTable.prototype.encode=function(t){var n,r,i,o;for(r=new e,r.writeInt(this.version),r.writeShort(this.ascender),r.writeShort(this.decender),r.writeShort(this.lineGap),r.writeShort(this.advanceWidthMax),r.writeShort(this.minLeftSideBearing),r.writeShort(this.minRightSideBearing),r.writeShort(this.xMaxExtent),r.writeShort(this.caretSlopeRise),r.writeShort(this.caretSlopeRun),r.writeShort(this.caretOffset),n=i=0,o=8;o>=0?o>i:i>o;n=o>=0?++i:--i)r.writeByte(0);return r.writeShort(this.metricDataFormat),r.writeUInt16(t.length),r.data},HheaTable}(r),t.exports=HheaTable}).call(this)},function(t,e,n){(function(){var e,MaxpTable,r,i={}.hasOwnProperty,o=function(t,e){function n(){this.constructor=t}for(var r in e)i.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};r=n(99),e=n(34),MaxpTable=function(t){function MaxpTable(){return MaxpTable.__super__.constructor.apply(this,arguments)}return o(MaxpTable,t),MaxpTable.prototype.tag="maxp",MaxpTable.prototype.parse=function(t){return t.pos=this.offset,this.version=t.readInt(),this.numGlyphs=t.readUInt16(),this.maxPoints=t.readUInt16(),this.maxContours=t.readUInt16(),this.maxCompositePoints=t.readUInt16(),this.maxComponentContours=t.readUInt16(),this.maxZones=t.readUInt16(),this.maxTwilightPoints=t.readUInt16(),this.maxStorage=t.readUInt16(),this.maxFunctionDefs=t.readUInt16(),this.maxInstructionDefs=t.readUInt16(),this.maxStackElements=t.readUInt16(),this.maxSizeOfInstructions=t.readUInt16(),this.maxComponentElements=t.readUInt16(),this.maxComponentDepth=t.readUInt16()},MaxpTable.prototype.encode=function(t){var n;return n=new e,n.writeInt(this.version),n.writeUInt16(t.length),n.writeUInt16(this.maxPoints),n.writeUInt16(this.maxContours),n.writeUInt16(this.maxCompositePoints),n.writeUInt16(this.maxComponentContours),n.writeUInt16(this.maxZones),n.writeUInt16(this.maxTwilightPoints),n.writeUInt16(this.maxStorage),n.writeUInt16(this.maxFunctionDefs),n.writeUInt16(this.maxInstructionDefs),n.writeUInt16(this.maxStackElements),n.writeUInt16(this.maxSizeOfInstructions),n.writeUInt16(this.maxComponentElements),n.writeUInt16(this.maxComponentDepth),n.data},MaxpTable}(r),t.exports=MaxpTable}).call(this)},function(t,e,n){(function(){var e,PostTable,r,i={}.hasOwnProperty,o=function(t,e){function n(){this.constructor=t}for(var r in e)i.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};r=n(99),e=n(34),PostTable=function(t){function PostTable(){return PostTable.__super__.constructor.apply(this,arguments)}var n;return o(PostTable,t),PostTable.prototype.tag="post",PostTable.prototype.parse=function(t){var e,n,r,i,o;switch(t.pos=this.offset,this.format=t.readInt(),this.italicAngle=t.readInt(),this.underlinePosition=t.readShort(),this.underlineThickness=t.readShort(),this.isFixedPitch=t.readInt(),this.minMemType42=t.readInt(),this.maxMemType42=t.readInt(),this.minMemType1=t.readInt(),this.maxMemType1=t.readInt(),this.format){case 65536:break;case 131072:for(r=t.readUInt16(),this.glyphNameIndex=[],e=i=0;r>=0?r>i:i>r;e=r>=0?++i:--i)this.glyphNameIndex.push(t.readUInt16());for(this.names=[],o=[];t.pos<this.offset+this.length;)n=t.readByte(),o.push(this.names.push(t.readString(n)));return o;case 151552:return r=t.readUInt16(),this.offsets=t.read(r);case 196608:break;case 262144:return this.map=function(){var n,r,i;for(i=[],e=n=0,r=this.file.maxp.numGlyphs;r>=0?r>n:n>r;e=r>=0?++n:--n)i.push(t.readUInt32());return i}.call(this)}},PostTable.prototype.glyphFor=function(t){var e;switch(this.format){case 65536:return n[t]||".notdef";case 131072:return e=this.glyphNameIndex[t],257>=e?n[e]:this.names[e-258]||".notdef";case 151552:return n[t+this.offsets[t]]||".notdef";case 196608:return".notdef";case 262144:return this.map[t]||65535}},PostTable.prototype.encode=function(t){var r,i,o,a,s,h,u,l,c,f,d,p,g,v,m;if(!this.exists)return null;if(h=this.raw(),196608===this.format)return h;for(c=new e(h.slice(0,32)),c.writeUInt32(131072),c.pos=32,o=[],l=[],f=0,g=t.length;g>f;f++)r=t[f],s=this.glyphFor(r),a=n.indexOf(s),-1!==a?o.push(a):(o.push(257+l.length),l.push(s));for(c.writeUInt16(Object.keys(t).length),d=0,v=o.length;v>d;d++)i=o[d],c.writeUInt16(i);for(p=0,m=l.length;m>p;p++)u=l[p],c.writeByte(u.length),c.writeString(u);return c.data},n=".notdef .null nonmarkingreturn space exclam quotedbl numbersign dollar percent\nampersand quotesingle parenleft parenright asterisk plus comma hyphen period slash\nzero one two three four five six seven eight nine colon semicolon less equal greater\nquestion at A B C D E F G H I J K L M N O P Q R S T U V W X Y Z\nbracketleft backslash bracketright asciicircum underscore grave\na b c d e f g h i j k l m n o p q r s t u v w x y z\nbraceleft bar braceright asciitilde Adieresis Aring Ccedilla Eacute Ntilde Odieresis\nUdieresis aacute agrave acircumflex adieresis atilde aring ccedilla eacute egrave\necircumflex edieresis iacute igrave icircumflex idieresis ntilde oacute ograve\nocircumflex odieresis otilde uacute ugrave ucircumflex udieresis dagger degree cent\nsterling section bullet paragraph germandbls registered copyright trademark acute\ndieresis notequal AE Oslash infinity plusminus lessequal greaterequal yen mu\npartialdiff summation product pi integral ordfeminine ordmasculine Omega ae oslash\nquestiondown exclamdown logicalnot radical florin approxequal Delta guillemotleft\nguillemotright ellipsis nonbreakingspace Agrave Atilde Otilde OE oe endash emdash\nquotedblleft quotedblright quoteleft quoteright divide lozenge ydieresis Ydieresis\nfraction currency guilsinglleft guilsinglright fi fl daggerdbl periodcentered\nquotesinglbase quotedblbase perthousand Acircumflex Ecircumflex Aacute Edieresis\nEgrave Iacute Icircumflex Idieresis Igrave Oacute Ocircumflex apple Ograve Uacute\nUcircumflex Ugrave dotlessi circumflex tilde macron breve dotaccent ring cedilla\nhungarumlaut ogonek caron Lslash lslash Scaron scaron Zcaron zcaron brokenbar Eth\neth Yacute yacute Thorn thorn minus multiply onesuperior twosuperior threesuperior\nonehalf onequarter threequarters franc Gbreve gbreve Idotaccent Scedilla scedilla\nCacute cacute Ccaron ccaron dcroat".split(/\s+/g),PostTable}(r),t.exports=PostTable}).call(this)},function(t,e,n){(function(){var OS2Table,e,r={}.hasOwnProperty,i=function(t,e){function n(){this.constructor=t}for(var i in e)r.call(e,i)&&(t[i]=e[i]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};e=n(99),OS2Table=function(t){function OS2Table(){return OS2Table.__super__.constructor.apply(this,arguments)}return i(OS2Table,t),OS2Table.prototype.tag="OS/2",OS2Table.prototype.parse=function(t){var e;return t.pos=this.offset,this.version=t.readUInt16(),this.averageCharWidth=t.readShort(),this.weightClass=t.readUInt16(),this.widthClass=t.readUInt16(),this.type=t.readShort(),this.ySubscriptXSize=t.readShort(),this.ySubscriptYSize=t.readShort(),this.ySubscriptXOffset=t.readShort(),this.ySubscriptYOffset=t.readShort(),this.ySuperscriptXSize=t.readShort(),this.ySuperscriptYSize=t.readShort(),this.ySuperscriptXOffset=t.readShort(),this.ySuperscriptYOffset=t.readShort(),this.yStrikeoutSize=t.readShort(),this.yStrikeoutPosition=t.readShort(),this.familyClass=t.readShort(),this.panose=function(){var n,r;for(r=[],e=n=0;10>n;e=++n)r.push(t.readByte());return r}(),this.charRange=function(){var n,r;for(r=[],e=n=0;4>n;e=++n)r.push(t.readInt());return r}(),this.vendorID=t.readString(4),this.selection=t.readShort(),this.firstCharIndex=t.readShort(),this.lastCharIndex=t.readShort(),this.version>0&&(this.ascent=t.readShort(),this.descent=t.readShort(),this.lineGap=t.readShort(),this.winAscent=t.readShort(),this.winDescent=t.readShort(),this.codePageRange=function(){var n,r;for(r=[],e=n=0;2>n;e=++n)r.push(t.readInt());return r}(),this.version>1)?(this.xHeight=t.readShort(),this.capHeight=t.readShort(),this.defaultChar=t.readShort(),this.breakChar=t.readShort(),this.maxContext=t.readShort()):void 0},OS2Table.prototype.encode=function(){return this.raw()},OS2Table}(e),t.exports=OS2Table}).call(this)},function(t,e,n){(function(){var e,LocaTable,r,i={}.hasOwnProperty,o=function(t,e){function n(){this.constructor=t}for(var r in e)i.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};r=n(99),e=n(34),LocaTable=function(t){function LocaTable(){return LocaTable.__super__.constructor.apply(this,arguments)}return o(LocaTable,t),LocaTable.prototype.tag="loca",LocaTable.prototype.parse=function(t){var e,n;return t.pos=this.offset,e=this.file.head.indexToLocFormat,this.offsets=0===e?function(){var e,r,i;for(i=[],n=e=0,r=this.length;r>e;n=e+=2)i.push(2*t.readUInt16());return i}.call(this):function(){var e,r,i;for(i=[],n=e=0,r=this.length;r>e;n=e+=4)i.push(t.readUInt32());return i}.call(this)},LocaTable.prototype.indexOf=function(t){return this.offsets[t]},LocaTable.prototype.lengthOf=function(t){return this.offsets[t+1]-this.offsets[t]},LocaTable.prototype.encode=function(t){var n,r,i,o,a,s,h,u,l,c,f;for(o=new e,a=0,u=t.length;u>a;a++)if(r=t[a],r>65535){for(f=this.offsets,s=0,l=f.length;l>s;s++)n=f[s],o.writeUInt32(n);return i={format:1,table:o.data}}for(h=0,c=t.length;c>h;h++)n=t[h],o.writeUInt16(n/2);return i={format:0,table:o.data}},LocaTable}(r),t.exports=LocaTable}).call(this)},function(t,e,n){(function(){e.successorOf=function(t){var e,n,r,i,o,a,s,h,u,l;for(n="abcdefghijklmnopqrstuvwxyz",h=n.length,l=t,i=t.length;i>=0;){if(s=t.charAt(--i),isNaN(s)){if(o=n.indexOf(s.toLowerCase()),-1===o)u=s,r=!0;else if(u=n.charAt((o+1)%h),a=s===s.toUpperCase(),a&&(u=u.toUpperCase()),r=o+1>=h,r&&0===i){e=a?"A":"a",l=e+u+l.slice(1);break}}else if(u=+s+1,r=u>9,r&&(u=0),r&&0===i){l="1"+u+l.slice(1);break}if(l=l.slice(0,i)+u+l.slice(i+1),!r)break}return l},e.invert=function(t){var e,n,r;n={};for(e in t)r=t[e],n[r]=e;return n}}).call(this)},function(t,e,n){(function(){var e,r,GlyfTable,i,o,a={}.hasOwnProperty,s=function(t,e){function n(){this.constructor=t}for(var r in e)a.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},h=[].slice;o=n(99),r=n(34),GlyfTable=function(t){function GlyfTable(){return GlyfTable.__super__.constructor.apply(this,arguments)}return s(GlyfTable,t),GlyfTable.prototype.tag="glyf",GlyfTable.prototype.parse=function(t){return this.cache={}},GlyfTable.prototype.glyphFor=function(t){var n,o,a,s,h,u,l,c,f,d;return t in this.cache?this.cache[t]:(s=this.file.loca,n=this.file.contents,o=s.indexOf(t),a=s.lengthOf(t),0===a?this.cache[t]=null:(n.pos=this.offset+o,u=new r(n.read(a)),h=u.readShort(),c=u.readShort(),d=u.readShort(),l=u.readShort(),f=u.readShort(),this.cache[t]=-1===h?new e(u,c,d,l,f):new i(u,h,c,d,l,f),this.cache[t]))},GlyfTable.prototype.encode=function(t,e,n){var r,i,o,a,s,h;for(a=[],o=[],s=0,h=e.length;h>s;s++)i=e[s],r=t[i],o.push(a.length),r&&(a=a.concat(r.encode(n)));return o.push(a.length),{table:a,offsets:o}},GlyfTable}(o),i=function(){function t(t,e,n,r,i,o){this.raw=t,this.numberOfContours=e,this.xMin=n,this.yMin=r,this.xMax=i,this.yMax=o,this.compound=!1}return t.prototype.encode=function(){return this.raw.data},t}(),e=function(){function t(t,r,s,h,u){var l,c;for(this.raw=t,this.xMin=r,this.yMin=s,this.xMax=h,this.yMax=u,this.compound=!0,this.glyphIDs=[],this.glyphOffsets=[],l=this.raw;;){if(c=l.readShort(),this.glyphOffsets.push(l.pos),this.glyphIDs.push(l.readShort()),!(c&n))break;l.pos+=c&e?4:2,c&a?l.pos+=8:c&i?l.pos+=4:c&o&&(l.pos+=2)}}var e,n,i,o,a,s;return e=1,o=8,n=32,i=64,a=128,s=256,t.prototype.encode=function(t){var e,n,i,o,a,s;for(i=new r(h.call(this.raw.data)),s=this.glyphIDs,e=o=0,a=s.length;a>o;e=++o)n=s[e],i.pos=this.glyphOffsets[e],i.writeShort(t[n]);return i.data},t}(),t.exports=GlyfTable}).call(this)},function(t,e,n){(function(){var t,n,r,i,o;e.DI_BRK=r=0,e.IN_BRK=i=1,e.CI_BRK=t=2,e.CP_BRK=n=3,e.PR_BRK=o=4,e.pairTable=[[o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,n,o,o,o,o,o,o,o],[r,o,o,i,i,o,o,o,o,i,i,r,r,r,r,r,i,i,r,r,o,t,o,r,r,r,r,r,r],[r,o,o,i,i,o,o,o,o,i,i,i,i,i,r,r,i,i,r,r,o,t,o,r,r,r,r,r,r],[o,o,o,i,i,i,o,o,o,i,i,i,i,i,i,i,i,i,i,i,o,t,o,i,i,i,i,i,i],[i,o,o,i,i,i,o,o,o,i,i,i,i,i,i,i,i,i,i,i,o,t,o,i,i,i,i,i,i],[r,o,o,i,i,i,o,o,o,r,r,r,r,r,r,r,i,i,r,r,o,t,o,r,r,r,r,r,r],[r,o,o,i,i,i,o,o,o,r,r,r,r,r,r,r,i,i,r,r,o,t,o,r,r,r,r,r,r],[r,o,o,i,i,i,o,o,o,r,r,i,r,r,r,r,i,i,r,r,o,t,o,r,r,r,r,r,r],[r,o,o,i,i,i,o,o,o,r,r,i,i,i,r,r,i,i,r,r,o,t,o,r,r,r,r,r,r],[i,o,o,i,i,i,o,o,o,r,r,i,i,i,i,r,i,i,r,r,o,t,o,i,i,i,i,i,r],[i,o,o,i,i,i,o,o,o,r,r,i,i,i,r,r,i,i,r,r,o,t,o,r,r,r,r,r,r],[i,o,o,i,i,i,o,o,o,i,i,i,i,i,r,i,i,i,r,r,o,t,o,r,r,r,r,r,r],[i,o,o,i,i,i,o,o,o,r,r,i,i,i,r,i,i,i,r,r,o,t,o,r,r,r,r,r,r],[i,o,o,i,i,i,o,o,o,r,r,i,i,i,r,i,i,i,r,r,o,t,o,r,r,r,r,r,r],[r,o,o,i,i,i,o,o,o,r,i,r,r,r,r,i,i,i,r,r,o,t,o,r,r,r,r,r,r],[r,o,o,i,i,i,o,o,o,r,r,r,r,r,r,i,i,i,r,r,o,t,o,r,r,r,r,r,r],[r,o,o,i,r,i,o,o,o,r,r,i,r,r,r,r,i,i,r,r,o,t,o,r,r,r,r,r,r],[r,o,o,i,r,i,o,o,o,r,r,r,r,r,r,r,i,i,r,r,o,t,o,r,r,r,r,r,r],[i,o,o,i,i,i,o,o,o,i,i,i,i,i,i,i,i,i,i,i,o,t,o,i,i,i,i,i,i],[r,o,o,i,i,i,o,o,o,r,r,r,r,r,r,r,i,i,r,o,o,t,o,r,r,r,r,r,r],[r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,o,r,r,r,r,r,r,r,r],[i,o,o,i,i,i,o,o,o,r,r,i,i,i,r,i,i,i,r,r,o,t,o,r,r,r,r,r,r],[i,o,o,i,i,i,o,o,o,i,i,i,i,i,i,i,i,i,i,i,o,t,o,i,i,i,i,i,i],[r,o,o,i,i,i,o,o,o,r,i,r,r,r,r,i,i,i,r,r,o,t,o,r,r,r,i,i,r],[r,o,o,i,i,i,o,o,o,r,i,r,r,r,r,i,i,i,r,r,o,t,o,r,r,r,r,i,r],[r,o,o,i,i,i,o,o,o,r,i,r,r,r,r,i,i,i,r,r,o,t,o,i,i,i,i,r,r],[r,o,o,i,i,i,o,o,o,r,i,r,r,r,r,i,i,i,r,r,o,t,o,r,r,r,i,i,r],[r,o,o,i,i,i,o,o,o,r,i,r,r,r,r,i,i,i,r,r,o,t,o,r,r,r,r,i,r],[r,o,o,i,i,i,o,o,o,r,r,r,r,r,r,r,i,i,r,r,o,t,o,r,r,r,r,r,i]]}).call(this)},function(t,e,n){(function(){var t,n,r,i,o,a,s,h,u,l,c,f,d,p,g,v,m,y,w,_,b,x,S,k,E,C,I,A,L,R,B,T,M,O,D,U,P,F,z,W;e.OP=L=0,e.CL=u=1,e.CP=c=2,e.QU=T=3,e.GL=p=4,e.NS=I=5,e.EX=d=6,e.SY=P=7,e.IS=b=8,e.PR=B=9,e.PO=R=10,e.NU=A=11,e.AL=n=12,e.HL=m=13,e.ID=w=14,e.IN=_=15,e.HY=y=16,e.BA=i=17,e.BB=o=18,e.B2=r=19,e.ZW=W=20,e.CM=l=21,e.WJ=F=22,e.H2=g=23,e.H3=v=24,e.JL=x=25,e.JV=k=26,e.JT=S=27,e.RI=M=28,e.AI=t=29,e.BK=a=30,e.CB=s=31,e.CJ=h=32,e.CR=f=33,e.LF=E=34,e.NL=C=35,e.SA=O=36,e.SG=D=37,e.SP=U=38,e.XX=z=39}).call(this)},function(t,e,n){},function(t,e,n){t.exports="function"==typeof Object.create?function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:function(t,e){t.super_=e;var n=function(){};n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t}},function(t,e,n){"use strict";function r(t){for(var e=t.length;--e>=0;)t[e]=0}function i(t){return 256>t?at[t]:at[256+(t>>>7)]}function o(t,e){t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255}function a(t,e,n){t.bi_valid>Y-n?(t.bi_buf|=e<<t.bi_valid&65535,o(t,t.bi_buf),t.bi_buf=e>>Y-t.bi_valid,t.bi_valid+=n-Y):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=n)}function s(t,e,n){a(t,n[2*e],n[2*e+1])}function h(t,e){var n=0;do n|=1&t,t>>>=1,n<<=1;while(--e>0);return n>>>1}function u(t){16===t.bi_valid?(o(t,t.bi_buf),t.bi_buf=0,t.bi_valid=0):t.bi_valid>=8&&(t.pending_buf[t.pending++]=255&t.bi_buf,t.bi_buf>>=8,t.bi_valid-=8)}function l(t,e){var n,r,i,o,a,s,h=e.dyn_tree,u=e.max_code,l=e.stat_desc.static_tree,c=e.stat_desc.has_stree,f=e.stat_desc.extra_bits,d=e.stat_desc.extra_base,p=e.stat_desc.max_length,g=0;for(o=0;q>=o;o++)t.bl_count[o]=0;for(h[2*t.heap[t.heap_max]+1]=0,n=t.heap_max+1;G>n;n++)r=t.heap[n],o=h[2*h[2*r+1]+1]+1,o>p&&(o=p,g++),h[2*r+1]=o,r>u||(t.bl_count[o]++,a=0,r>=d&&(a=f[r-d]),s=h[2*r],t.opt_len+=s*(o+a),c&&(t.static_len+=s*(l[2*r+1]+a)));if(0!==g){do{for(o=p-1;0===t.bl_count[o];)o--;t.bl_count[o]--,t.bl_count[o+1]+=2,t.bl_count[p]--,g-=2}while(g>0);for(o=p;0!==o;o--)for(r=t.bl_count[o];0!==r;)i=t.heap[--n],i>u||(h[2*i+1]!==o&&(t.opt_len+=(o-h[2*i+1])*h[2*i],h[2*i+1]=o),r--)}}function c(t,e,n){var r,i,o=new Array(q+1),a=0;for(r=1;q>=r;r++)o[r]=a=a+n[r-1]<<1;for(i=0;e>=i;i++){var s=t[2*i+1];0!==s&&(t[2*i]=h(o[s]++,s))}}function f(){var t,e,n,r,i,o=new Array(q+1);for(n=0,r=0;W-1>r;r++)for(ht[r]=n,t=0;t<1<<Q[r];t++)st[n++]=r;for(st[n-1]=r,i=0,r=0;16>r;r++)for(ut[r]=i,t=0;t<1<<tt[r];t++)at[i++]=r;for(i>>=7;H>r;r++)for(ut[r]=i<<7,t=0;t<1<<tt[r]-7;t++)at[256+i++]=r;for(e=0;q>=e;e++)o[e]=0;for(t=0;143>=t;)it[2*t+1]=8,t++,o[8]++;for(;255>=t;)it[2*t+1]=9,t++,o[9]++;for(;279>=t;)it[2*t+1]=7,t++,o[7]++;for(;287>=t;)it[2*t+1]=8,t++,o[8]++;for(c(it,j+1,o),t=0;H>t;t++)ot[2*t+1]=5,ot[2*t]=h(t,5);lt=new dt(it,Q,N+1,j,q),ct=new dt(ot,tt,0,H,q),ft=new dt(new Array(0),et,0,Z,K)}function d(t){var e;for(e=0;j>e;e++)t.dyn_ltree[2*e]=0;for(e=0;H>e;e++)t.dyn_dtree[2*e]=0;for(e=0;Z>e;e++)t.bl_tree[2*e]=0;t.dyn_ltree[2*X]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0}function p(t){t.bi_valid>8?o(t,t.bi_buf):t.bi_valid>0&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0}function g(t,e,n,r){p(t),r&&(o(t,n),o(t,~n)),R.arraySet(t.pending_buf,t.window,e,n,t.pending),t.pending+=n}function v(t,e,n,r){var i=2*e,o=2*n;return t[i]<t[o]||t[i]===t[o]&&r[e]<=r[n]}function m(t,e,n){for(var r=t.heap[n],i=n<<1;i<=t.heap_len&&(i<t.heap_len&&v(e,t.heap[i+1],t.heap[i],t.depth)&&i++,!v(e,r,t.heap[i],t.depth));)t.heap[n]=t.heap[i],n=i,i<<=1;t.heap[n]=r}function y(t,e,n){var r,o,h,u,l=0;if(0!==t.last_lit)do r=t.pending_buf[t.d_buf+2*l]<<8|t.pending_buf[t.d_buf+2*l+1],o=t.pending_buf[t.l_buf+l],l++,0===r?s(t,o,e):(h=st[o],s(t,h+N+1,e),u=Q[h],0!==u&&(o-=ht[h],a(t,o,u)),r--,h=i(r),s(t,h,n),u=tt[h],0!==u&&(r-=ut[h],a(t,r,u)));while(l<t.last_lit);s(t,X,e)}function w(t,e){var n,r,i,o=e.dyn_tree,a=e.stat_desc.static_tree,s=e.stat_desc.has_stree,h=e.stat_desc.elems,u=-1;for(t.heap_len=0,t.heap_max=G,n=0;h>n;n++)0!==o[2*n]?(t.heap[++t.heap_len]=u=n,t.depth[n]=0):o[2*n+1]=0;for(;t.heap_len<2;)i=t.heap[++t.heap_len]=2>u?++u:0,o[2*i]=1,t.depth[i]=0,t.opt_len--,s&&(t.static_len-=a[2*i+1]);for(e.max_code=u,n=t.heap_len>>1;n>=1;n--)m(t,o,n);i=h;do n=t.heap[1],t.heap[1]=t.heap[t.heap_len--],m(t,o,1),r=t.heap[1],t.heap[--t.heap_max]=n,t.heap[--t.heap_max]=r,o[2*i]=o[2*n]+o[2*r],t.depth[i]=(t.depth[n]>=t.depth[r]?t.depth[n]:t.depth[r])+1,o[2*n+1]=o[2*r+1]=i,t.heap[1]=i++,m(t,o,1);while(t.heap_len>=2);t.heap[--t.heap_max]=t.heap[1],l(t,e),c(o,u,t.bl_count)}function _(t,e,n){var r,i,o=-1,a=e[1],s=0,h=7,u=4;for(0===a&&(h=138,u=3),e[2*(n+1)+1]=65535,r=0;n>=r;r++)i=a,a=e[2*(r+1)+1],++s<h&&i===a||(u>s?t.bl_tree[2*i]+=s:0!==i?(i!==o&&t.bl_tree[2*i]++,t.bl_tree[2*V]++):10>=s?t.bl_tree[2*$]++:t.bl_tree[2*J]++,s=0,o=i,0===a?(h=138,u=3):i===a?(h=6,u=3):(h=7,u=4))}function b(t,e,n){var r,i,o=-1,h=e[1],u=0,l=7,c=4;for(0===h&&(l=138,c=3),r=0;n>=r;r++)if(i=h,h=e[2*(r+1)+1],!(++u<l&&i===h)){if(c>u){do s(t,i,t.bl_tree);while(0!==--u)}else 0!==i?(i!==o&&(s(t,i,t.bl_tree),u--),s(t,V,t.bl_tree),a(t,u-3,2)):10>=u?(s(t,$,t.bl_tree),a(t,u-3,3)):(s(t,J,t.bl_tree),a(t,u-11,7));u=0,o=i,0===h?(l=138,c=3):i===h?(l=6,c=3):(l=7,c=4)}}function x(t){var e;for(_(t,t.dyn_ltree,t.l_desc.max_code),_(t,t.dyn_dtree,t.d_desc.max_code),w(t,t.bl_desc),e=Z-1;e>=3&&0===t.bl_tree[2*nt[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}function S(t,e,n,r){var i;for(a(t,e-257,5),a(t,n-1,5),a(t,r-4,4),i=0;r>i;i++)a(t,t.bl_tree[2*nt[i]+1],3);b(t,t.dyn_ltree,e-1),b(t,t.dyn_dtree,n-1)}function k(t){var e,n=4093624447;for(e=0;31>=e;e++,n>>>=1)if(1&n&&0!==t.dyn_ltree[2*e])return T;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return M;for(e=32;N>e;e++)if(0!==t.dyn_ltree[2*e])return M;return T}function E(t){gt||(f(),gt=!0),t.l_desc=new pt(t.dyn_ltree,lt),t.d_desc=new pt(t.dyn_dtree,ct),t.bl_desc=new pt(t.bl_tree,ft),t.bi_buf=0,t.bi_valid=0,d(t)}function C(t,e,n,r){a(t,(D<<1)+(r?1:0),3),g(t,e,n,!0)}function I(t){a(t,U<<1,3),s(t,X,it),u(t)}function A(t,e,n,r){var i,o,s=0;t.level>0?(t.strm.data_type===O&&(t.strm.data_type=k(t)),w(t,t.l_desc),w(t,t.d_desc),s=x(t),i=t.opt_len+3+7>>>3,o=t.static_len+3+7>>>3,i>=o&&(i=o)):i=o=n+5,i>=n+4&&-1!==e?C(t,e,n,r):t.strategy===B||o===i?(a(t,(U<<1)+(r?1:0),3),y(t,it,ot)):(a(t,(P<<1)+(r?1:0),3),S(t,t.l_desc.max_code+1,t.d_desc.max_code+1,s+1),y(t,t.dyn_ltree,t.dyn_dtree)),d(t),r&&p(t)}function L(t,e,n){return t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&n,t.last_lit++,0===e?t.dyn_ltree[2*n]++:(t.matches++,e--,t.dyn_ltree[2*(st[n]+N+1)]++,t.dyn_dtree[2*i(e)]++),t.last_lit===t.lit_bufsize-1}var R=n(98),B=4,T=0,M=1,O=2,D=0,U=1,P=2,F=3,z=258,W=29,N=256,j=N+1+W,H=30,Z=19,G=2*j+1,q=15,Y=16,K=7,X=256,V=16,$=17,J=18,Q=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],tt=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],et=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],nt=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],rt=512,it=new Array(2*(j+2));r(it);var ot=new Array(2*H);r(ot);var at=new Array(rt);r(at);var st=new Array(z-F+1);r(st);var ht=new Array(W);r(ht);var ut=new Array(H);r(ut);var lt,ct,ft,dt=function(t,e,n,r,i){this.static_tree=t,this.extra_bits=e,this.extra_base=n,this.elems=r,this.max_length=i,this.has_stree=t&&t.length},pt=function(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e},gt=!1;e._tr_init=E,e._tr_stored_block=C,e._tr_flush_block=A,e._tr_tally=L,e._tr_align=I},function(t,e,n){"use strict";function r(t,e,n,r){for(var i=65535&t|0,o=t>>>16&65535|0,a=0;0!==n;){a=n>2e3?2e3:n,n-=a;do i=i+e[r++]|0,o=o+i|0;while(--a);i%=65521,o%=65521}return i|o<<16|0}t.exports=r},function(t,e,n){"use strict";function r(){for(var t,e=[],n=0;256>n;n++){t=n;for(var r=0;8>r;r++)t=1&t?3988292384^t>>>1:t>>>1;e[n]=t}return e}function i(t,e,n,r){var i=o,a=r+n;t=-1^t;for(var s=r;a>s;s++)t=t>>>8^i[255&(t^e[s])];return-1^t}var o=r();t.exports=i},function(t,e,n){"use strict";var r="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;e.assign=function(t){for(var e=Array.prototype.slice.call(arguments,1);e.length;){var n=e.shift();if(n){if("object"!=typeof n)throw new TypeError(n+"must be non-object");for(var r in n)n.hasOwnProperty(r)&&(t[r]=n[r])}}return t},e.shrinkBuf=function(t,e){return t.length===e?t:t.subarray?t.subarray(0,e):(t.length=e,t)};var i={arraySet:function(t,e,n,r,i){if(e.subarray&&t.subarray)return void t.set(e.subarray(n,n+r),i);for(var o=0;r>o;o++)t[i+o]=e[n+o]},flattenChunks:function(t){var e,n,r,i,o,a;for(r=0,e=0,n=t.length;n>e;e++)r+=t[e].length;for(a=new Uint8Array(r),i=0,e=0,n=t.length;n>e;e++)o=t[e],a.set(o,i),i+=o.length;return a}},o={arraySet:function(t,e,n,r,i){for(var o=0;r>o;o++)t[i+o]=e[n+o]},flattenChunks:function(t){return[].concat.apply([],t)}};e.setTyped=function(t){t?(e.Buf8=Uint8Array,e.Buf16=Uint16Array,e.Buf32=Int32Array,e.assign(e,i)):(e.Buf8=Array,e.Buf16=Array,e.Buf32=Array,e.assign(e,o))},e.setTyped(r)},function(t,e,n){(function(){var e;e=function(){function t(t){var e;this.file=t,e=this.file.directory.tables[this.tag],this.exists=!!e,e&&(this.offset=e.offset,this.length=e.length,this.parse(this.file.contents))}return t.prototype.parse=function(){},t.prototype.encode=function(){},t.prototype.raw=function(){return this.exists?(this.file.contents.pos=this.offset,this.file.contents.read(this.length)):null},t}(),t.exports=e}).call(this)},function(t,e,n){var r,i=[].slice;r=function(){function t(t){var e,n;null==t&&(t={}),this.data=t.data||[],this.highStart=null!=(e=t.highStart)?e:0,this.errorValue=null!=(n=t.errorValue)?n:-1}var e,n,r,o,a,s,h,u,l,c,f,d,p,g,v,m;return d=11,g=5,p=d-g,f=65536>>d,a=1<<p,h=a-1,u=2,e=1<<g,r=e-1,c=65536>>g,l=1024>>g,s=c+l,m=s,v=32,o=m+v,n=1<<u,t.prototype.get=function(t){var e;return 0>t||t>1114111?this.errorValue:55296>t||t>56319&&65535>=t?(e=(this.data[t>>g]<<u)+(t&r),this.data[e]):65535>=t?(e=(this.data[c+(t-55296>>g)]<<u)+(t&r),this.data[e]):t<this.highStart?(e=this.data[o-f+(t>>d)],e=this.data[e+(t>>g&h)],e=(e<<u)+(t&r),this.data[e]):this.data[this.data.length-n]},t.prototype.toJSON=function(){var t;return t={data:i.call(this.data),highStart:this.highStart,errorValue:this.errorValue}},t}(),t.exports=r},function(t,e,n){function r(t){if(t&&!h(t))throw new Error("Unknown encoding: "+t)}function i(t){return t.toString(this.encoding)}function o(t){this.charReceived=t.length%2,this.charLength=this.charReceived?2:0}function a(t){this.charReceived=t.length%3,this.charLength=this.charReceived?3:0}var s=n(4).Buffer,h=s.isEncoding||function(t){switch(t&&t.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}},u=e.StringDecoder=function(t){switch(this.encoding=(t||"utf8").toLowerCase().replace(/[-_]/,""),r(t),this.encoding){case"utf8":this.surrogateSize=3;break;case"ucs2":case"utf16le":this.surrogateSize=2,this.detectIncompleteChar=o;break;case"base64":this.surrogateSize=3,this.detectIncompleteChar=a;break;default:return void(this.write=i)}this.charBuffer=new s(6),this.charReceived=0,this.charLength=0};u.prototype.write=function(t){for(var e="";this.charLength;){var n=t.length>=this.charLength-this.charReceived?this.charLength-this.charReceived:t.length;if(t.copy(this.charBuffer,this.charReceived,0,n),this.charReceived+=n,this.charReceived<this.charLength)return"";t=t.slice(n,t.length),e=this.charBuffer.slice(0,this.charLength).toString(this.encoding);var r=e.charCodeAt(e.length-1);if(!(r>=55296&&56319>=r)){if(this.charReceived=this.charLength=0,0===t.length)return e;break}this.charLength+=this.surrogateSize,e=""}this.detectIncompleteChar(t);var i=t.length;this.charLength&&(t.copy(this.charBuffer,0,t.length-this.charReceived,i),i-=this.charReceived),e+=t.toString(this.encoding,0,i);var i=e.length-1,r=e.charCodeAt(i);if(r>=55296&&56319>=r){var o=this.surrogateSize;return this.charLength+=o,this.charReceived+=o,this.charBuffer.copy(this.charBuffer,o,0,o),t.copy(this.charBuffer,0,0,o),e.substring(0,i)}return e},u.prototype.detectIncompleteChar=function(t){for(var e=t.length>=3?3:t.length;e>0;e--){var n=t[t.length-e];if(1==e&&n>>5==6){this.charLength=2;break}if(2>=e&&n>>4==14){this.charLength=3;break}if(3>=e&&n>>3==30){this.charLength=4;break}}this.charReceived=e},u.prototype.end=function(t){var e="";if(t&&t.length&&(e=this.write(t)),this.charReceived){var n=this.charReceived,r=this.charBuffer,i=this.encoding;e+=r.slice(0,n).toString(i)}return e}},function(t,e,n){"use strict";var r=30,i=12;t.exports=function(t,e){var n,o,a,s,h,u,l,c,f,d,p,g,v,m,y,w,_,b,x,S,k,E,C,I,A;n=t.state,o=t.next_in,I=t.input,a=o+(t.avail_in-5),s=t.next_out,A=t.output,h=s-(e-t.avail_out),u=s+(t.avail_out-257),l=n.dmax,c=n.wsize,f=n.whave,d=n.wnext,p=n.window,g=n.hold,v=n.bits,m=n.lencode,y=n.distcode,w=(1<<n.lenbits)-1,_=(1<<n.distbits)-1;t:do{15>v&&(g+=I[o++]<<v,v+=8,g+=I[o++]<<v,v+=8),b=m[g&w];e:for(;;){if(x=b>>>24,g>>>=x,v-=x,x=b>>>16&255,0===x)A[s++]=65535&b;else{if(!(16&x)){if(0===(64&x)){b=m[(65535&b)+(g&(1<<x)-1)];continue e}if(32&x){n.mode=i;break t}t.msg="invalid literal/length code",n.mode=r;break t}S=65535&b,x&=15,x&&(x>v&&(g+=I[o++]<<v,v+=8),S+=g&(1<<x)-1,g>>>=x,v-=x),15>v&&(g+=I[o++]<<v,v+=8,g+=I[o++]<<v,v+=8),b=y[g&_];n:for(;;){if(x=b>>>24,g>>>=x,v-=x,x=b>>>16&255,!(16&x)){if(0===(64&x)){b=y[(65535&b)+(g&(1<<x)-1)];continue n}t.msg="invalid distance code",n.mode=r;break t}if(k=65535&b,x&=15,x>v&&(g+=I[o++]<<v,v+=8,x>v&&(g+=I[o++]<<v,v+=8)),k+=g&(1<<x)-1,k>l){t.msg="invalid distance too far back",n.mode=r;break t}if(g>>>=x,v-=x,x=s-h,k>x){if(x=k-x,x>f&&n.sane){t.msg="invalid distance too far back",n.mode=r;break t}if(E=0,C=p,0===d){if(E+=c-x,S>x){S-=x;do A[s++]=p[E++];while(--x);E=s-k,C=A}}else if(x>d){if(E+=c+d-x,x-=d,S>x){S-=x;do A[s++]=p[E++];while(--x);if(E=0,S>d){x=d,S-=x;do A[s++]=p[E++];while(--x);E=s-k,C=A}}}else if(E+=d-x,S>x){S-=x;do A[s++]=p[E++];while(--x);E=s-k,C=A}for(;S>2;)A[s++]=C[E++],A[s++]=C[E++],A[s++]=C[E++],S-=3;S&&(A[s++]=C[E++],S>1&&(A[s++]=C[E++]))}else{E=s-k;do A[s++]=A[E++],A[s++]=A[E++],A[s++]=A[E++],S-=3;while(S>2);S&&(A[s++]=A[E++],S>1&&(A[s++]=A[E++]))}break}}break}}while(a>o&&u>s);S=v>>3,o-=S,v-=S<<3,g&=(1<<v)-1,t.next_in=o,t.next_out=s,t.avail_in=a>o?5+(a-o):5-(o-a),t.avail_out=u>s?257+(u-s):257-(s-u),n.hold=g,n.bits=v}},function(t,e,n){"use strict";var r=n(98),i=15,o=852,a=592,s=0,h=1,u=2,l=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],c=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],f=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],d=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];

highStart:919552,errorValue:0}},function(t,e,n){t.exports=Array.isArray||function(t){return"[object Array]"==Object.prototype.toString.call(t)}}]);
//# sourceMappingURL=pdfmake.min.js.map
(function(g){"function"===typeof define&&define.amd?define(["jquery","datatables.net","datatables.net-buttons"],function(i){return g(i,window,document)}):"object"===typeof exports?module.exports=function(i,j,t,u){i||(i=window);if(!j||!j.fn.dataTable)j=require("datatables.net")(i,j).$;j.fn.dataTable.Buttons||require("datatables.net-buttons")(i,j);return g(j,i,i.document,t,u)}:g(jQuery,window,document)})(function(g,i,j,t,u,o){function E(a,b){v===o&&(v=-1===y.serializeToString(g.parseXML(F["xl/worksheets/sheet1.xml"])).indexOf("xmlns:r"));
g.each(b,function(b,c){if(g.isPlainObject(c)){var f=a.folder(b);E(f,c)}else{if(v){var f=c.childNodes[0],e,h,l=[];for(e=f.attributes.length-1;0<=e;e--){h=f.attributes[e].nodeName;var n=f.attributes[e].nodeValue;-1!==h.indexOf(":")&&(l.push({name:h,value:n}),f.removeAttribute(h))}e=0;for(h=l.length;e<h;e++)n=c.createAttribute(l[e].name.replace(":","_dt_b_namespace_token_")),n.value=l[e].value,f.setAttributeNode(n)}f=y.serializeToString(c);v&&(-1===f.indexOf("<?xml")&&(f='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+
f),f=f.replace(/_dt_b_namespace_token_/g,":"));f=f.replace(/<row xmlns="" /g,"<row ").replace(/<cols xmlns="">/g,"<cols>");a.file(b,f)}})}function p(a,b,d){var c=a.createElement(b);d&&(d.attr&&g(c).attr(d.attr),d.children&&g.each(d.children,function(a,b){c.appendChild(b)}),d.text&&c.appendChild(a.createTextNode(d.text)));return c}function N(a,b){var d=a.header[b].length,c;a.footer&&a.footer[b].length>d&&(d=a.footer[b].length);for(var f=0,e=a.body.length;f<e&&!(c=a.body[f][b].toString().length,c>d&&
(d=c),40<d);f++);return 5<d?d:5}var r=g.fn.dataTable,q;var h="undefined"!==typeof self&&self||"undefined"!==typeof i&&i||this.content;if("undefined"!==typeof navigator&&/MSIE [1-9]\./.test(navigator.userAgent))q=void 0;else{var w=h.document.createElementNS("http://www.w3.org/1999/xhtml","a"),O="download"in w,G=/Version\/[\d\.]+.*Safari/.test(navigator.userAgent),z=h.webkitRequestFileSystem,H=h.requestFileSystem||z||h.mozRequestFileSystem,P=function(a){(h.setImmediate||h.setTimeout)(function(){throw a;
},0)},A=0,B=function(a){setTimeout(function(){"string"===typeof a?(h.URL||h.webkitURL||h).revokeObjectURL(a):a.remove()},4E4)},C=function(a,b,d){for(var b=[].concat(b),c=b.length;c--;){var f=a["on"+b[c]];if("function"===typeof f)try{f.call(a,d||a)}catch(e){P(e)}}},I=function(a){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["﻿",a],{type:a.type}):a},J=function(a,b,d){d||(a=I(a));var c=this,d=a.type,f=!1,e,g,l=function(){C(c,["writestart","progress",
"write","writeend"])},n=function(){if(g&&G&&"undefined"!==typeof FileReader){var b=new FileReader;b.onloadend=function(){var a=b.result;g.location.href="data:attachment/file"+a.slice(a.search(/[,;]/));c.readyState=c.DONE;l()};b.readAsDataURL(a);c.readyState=c.INIT}else{if(f||!e)e=(h.URL||h.webkitURL||h).createObjectURL(a);g?g.location.href=e:h.open(e,"_blank")===o&&G&&(h.location.href=e);c.readyState=c.DONE;l();B(e)}},m=function(a){return function(){if(c.readyState!==c.DONE)return a.apply(this,arguments)}},
i={create:!0,exclusive:!1},s;c.readyState=c.INIT;b||(b="download");if(O)e=(h.URL||h.webkitURL||h).createObjectURL(a),setTimeout(function(){w.href=e;w.download=b;var a=new MouseEvent("click");w.dispatchEvent(a);l();B(e);c.readyState=c.DONE});else{h.chrome&&(d&&"application/octet-stream"!==d)&&(s=a.slice||a.webkitSlice,a=s.call(a,0,a.size,"application/octet-stream"),f=!0);z&&"download"!==b&&(b+=".download");if("application/octet-stream"===d||z)g=h;H?(A+=a.size,H(h.TEMPORARY,A,m(function(d){d.root.getDirectory("saved",
i,m(function(d){var e=function(){d.getFile(b,i,m(function(b){b.createWriter(m(function(d){d.onwriteend=function(a){g.location.href=b.toURL();c.readyState=c.DONE;C(c,"writeend",a);B(b)};d.onerror=function(){var a=d.error;a.code!==a.ABORT_ERR&&n()};["writestart","progress","write","abort"].forEach(function(a){d["on"+a]=c["on"+a]});d.write(a);c.abort=function(){d.abort();c.readyState=c.DONE};c.readyState=c.WRITING}),n)}),n)};d.getFile(b,{create:false},m(function(a){a.remove();e()}),m(function(a){a.code===
a.NOT_FOUND_ERR?e():n()}))}),n)}),n)):n()}},k=J.prototype;"undefined"!==typeof navigator&&navigator.msSaveOrOpenBlob?q=function(a,b,d){d||(a=I(a));return navigator.msSaveOrOpenBlob(a,b||"download")}:(k.abort=function(){this.readyState=this.DONE;C(this,"abort")},k.readyState=k.INIT=0,k.WRITING=1,k.DONE=2,k.error=k.onwritestart=k.onprogress=k.onwrite=k.onabort=k.onerror=k.onwriteend=null,q=function(a,b,d){return new J(a,b,d)})}r.fileSave=q;var x=function(a,b){var d="*"===a.filename&&"*"!==a.title&&
a.title!==o?a.title:a.filename;"function"===typeof d&&(d=d());-1!==d.indexOf("*")&&(d=g.trim(d.replace("*",g("title").text())));d=d.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g,"");return b===o||!0===b?d+a.extension:d},Q=function(a){var b="Sheet1";a.sheetName&&(b=a.sheetName.replace(/[\[\]\*\/\\\?\:]/g,""));return b},R=function(a){a=a.title;"function"===typeof a&&(a=a());return-1!==a.indexOf("*")?a.replace("*",g("title").text()||"Exported data"):a},K=function(a){return a.newline?a.newline:navigator.userAgent.match(/Windows/)?
"\r\n":"\n"},L=function(a,b){for(var d=K(b),c=a.buttons.exportData(b.exportOptions),f=b.fieldBoundary,e=b.fieldSeparator,g=RegExp(f,"g"),l=b.escapeChar!==o?b.escapeChar:"\\",h=function(a){for(var b="",c=0,d=a.length;c<d;c++)0<c&&(b+=e),b+=f?f+(""+a[c]).replace(g,l+f)+f:a[c];return b},i=b.header?h(c.header)+d:"",j=b.footer&&c.footer?d+h(c.footer):"",s=[],D=0,k=c.body.length;D<k;D++)s.push(h(c.body[D]));return{str:i+s.join(d)+j,rows:s.length}},M=function(){return-1!==navigator.userAgent.indexOf("Safari")&&
-1===navigator.userAgent.indexOf("Chrome")&&-1===navigator.userAgent.indexOf("Opera")};try{var y=new XMLSerializer,v}catch(S){}var F={"_rels/.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',"xl/_rels/workbook.xml.rels":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
"[Content_Types].xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml" /><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml" /><Default Extension="jpeg" ContentType="image/jpeg" /><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" /><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" /><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml" /></Types>',
"xl/workbook.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="24816"/><workbookPr showInkAnnotation="0" autoCompressPictures="0"/><bookViews><workbookView xWindow="0" yWindow="0" windowWidth="25600" windowHeight="19020" tabRatio="500"/></bookViews><sheets><sheet name="" sheetId="1" r:id="rId1"/></sheets></workbook>',
"xl/worksheets/sheet1.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><sheetData/></worksheet>',"xl/styles.xml":'<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"><fonts count="5" x14ac:knownFonts="1"><font><sz val="11" /><name val="Calibri" /></font><font><sz val="11" /><name val="Calibri" /><color rgb="FFFFFFFF" /></font><font><sz val="11" /><name val="Calibri" /><b /></font><font><sz val="11" /><name val="Calibri" /><i /></font><font><sz val="11" /><name val="Calibri" /><u /></font></fonts><fills count="6"><fill><patternFill patternType="none" /></fill><fill/><fill><patternFill patternType="solid"><fgColor rgb="FFD9D9D9" /><bgColor indexed="64" /></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD99795" /><bgColor indexed="64" /></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="ffc6efce" /><bgColor indexed="64" /></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="ffc6cfef" /><bgColor indexed="64" /></patternFill></fill></fills><borders count="2"><border><left /><right /><top /><bottom /><diagonal /></border><border diagonalUp="false" diagonalDown="false"><left style="thin"><color auto="1" /></left><right style="thin"><color auto="1" /></right><top style="thin"><color auto="1" /></top><bottom style="thin"><color auto="1" /></bottom><diagonal /></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" /></cellStyleXfs><cellXfs count="56"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="2" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="4" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="5" borderId="0" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="0" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="2" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="4" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="1" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="2" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="3" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="4" fillId="5" borderId="1" applyFont="1" applyFill="1" applyBorder="1"/><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="left"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="right"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="fill"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment textRotation="90"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment wrapText="1"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0" /></cellStyles><dxfs count="0" /><tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4" /></styleSheet>'};
r.ext.buttons.copyHtml5={className:"buttons-copy buttons-html5",text:function(a){return a.i18n("buttons.copy","Copy")},action:function(a,b,d,c){var a=L(b,c),f=a.str,d=g("<div/>").css({height:1,width:1,overflow:"hidden",position:"fixed",top:0,left:0});c.customize&&(f=c.customize(f,c));c=g("<textarea readonly/>").val(f).appendTo(d);if(j.queryCommandSupported("copy")){d.appendTo(b.table().container());c[0].focus();c[0].select();try{var e=j.execCommand("copy");d.remove();if(e){b.buttons.info(b.i18n("buttons.copyTitle",
"Copy to clipboard"),b.i18n("buttons.copySuccess",{1:"Copied one row to clipboard",_:"Copied %d rows to clipboard"},a.rows),2E3);return}}catch(h){}}e=g("<span>"+b.i18n("buttons.copyKeys","Press <i>ctrl</i> or <i>⌘</i> + <i>C</i> to copy the table data<br>to your system clipboard.<br><br>To cancel, click this message or press escape.")+"</span>").append(d);b.buttons.info(b.i18n("buttons.copyTitle","Copy to clipboard"),e,0);c[0].focus();c[0].select();var l=g(e).closest(".dt-button-info"),i=function(){l.off("click.buttons-copy");
g(j).off(".buttons-copy");b.buttons.info(!1)};l.on("click.buttons-copy",i);g(j).on("keydown.buttons-copy",function(a){27===a.keyCode&&i()}).on("copy.buttons-copy cut.buttons-copy",function(){i()})},exportOptions:{},fieldSeparator:"\t",fieldBoundary:"",header:!0,footer:!1};r.ext.buttons.csvHtml5={bom:!1,className:"buttons-csv buttons-html5",available:function(){return i.FileReader!==o&&i.Blob},text:function(a){return a.i18n("buttons.csv","CSV")},action:function(a,b,d,c){a=L(b,c).str;b=c.charset;c.customize&&
(a=c.customize(a,c));!1!==b?(b||(b=j.characterSet||j.charset),b&&(b=";charset="+b)):b="";c.bom&&(a="﻿"+a);q(new Blob([a],{type:"text/csv"+b}),x(c),!0)},filename:"*",extension:".csv",exportOptions:{},fieldSeparator:",",fieldBoundary:'"',escapeChar:'"',charset:null,header:!0,footer:!1};r.ext.buttons.excelHtml5={className:"buttons-excel buttons-html5",available:function(){return i.FileReader!==o&&(t||i.JSZip)!==o&&!M()&&y},text:function(a){return a.i18n("buttons.excel","Excel")},action:function(a,b,
d,c){var f=0,a=function(a){return g.parseXML(F[a])},e=a("xl/worksheets/sheet1.xml"),h=e.getElementsByTagName("sheetData")[0],a={_rels:{".rels":a("_rels/.rels")},xl:{_rels:{"workbook.xml.rels":a("xl/_rels/workbook.xml.rels")},"workbook.xml":a("xl/workbook.xml"),"styles.xml":a("xl/styles.xml"),worksheets:{"sheet1.xml":e}},"[Content_Types].xml":a("[Content_Types].xml")},b=b.buttons.exportData(c.exportOptions),l,j,d=function(a){l=f+1;j=p(e,"row",{attr:{r:l}});for(var b=0,c=a.length;b<c;b++){for(var d=
b,i="";0<=d;)i=String.fromCharCode(d%26+65)+i,d=Math.floor(d/26)-1;d=i+""+l;if(null===a[b]||a[b]===o)a[b]="";"number"===typeof a[b]||a[b].match&&g.trim(a[b]).match(/^-?\d+(\.\d+)?$/)&&!g.trim(a[b]).match(/^0\d+/)?d=p(e,"c",{attr:{t:"n",r:d},children:[p(e,"v",{text:a[b]})]}):(i=!a[b].replace?a[b]:a[b].replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g,""),d=p(e,"c",{attr:{t:"inlineStr",r:d},children:{row:p(e,"is",{children:{row:p(e,"t",{text:i})}})}}));j.appendChild(d)}h.appendChild(j);f++};g("sheets sheet",
a.xl["workbook.xml"]).attr("name",Q(c));c.customizeData&&c.customizeData(b);c.header&&(d(b.header,f),g("row c",e).attr("s","2"));for(var m=0,k=b.body.length;m<k;m++)d(b.body[m],f);c.footer&&b.footer&&(d(b.footer,f),g("row:last c",e).attr("s","2"));d=p(e,"cols");g("worksheet",e).prepend(d);m=0;for(k=b.header.length;m<k;m++)d.appendChild(p(e,"col",{attr:{min:m+1,max:m+1,width:N(b,m),customWidth:1}}));c.customize&&c.customize(a);b=new (t||i.JSZip);d={type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"};
E(b,a);b.generateAsync?b.generateAsync(d).then(function(a){q(a,x(c))}):q(b.generate(d),x(c))},filename:"*",extension:".xlsx",exportOptions:{},header:!0,footer:!1};r.ext.buttons.pdfHtml5={className:"buttons-pdf buttons-html5",available:function(){return i.FileReader!==o&&(u||i.pdfMake)},text:function(a){return a.i18n("buttons.pdf","PDF")},action:function(a,b,d,c){K(c);var a=b.buttons.exportData(c.exportOptions),f=[];c.header&&f.push(g.map(a.header,function(a){return{text:"string"===typeof a?a:a+"",
style:"tableHeader"}}));for(var e=0,h=a.body.length;e<h;e++)f.push(g.map(a.body[e],function(a){return{text:"string"===typeof a?a:a+"",style:e%2?"tableBodyEven":"tableBodyOdd"}}));c.footer&&a.footer&&f.push(g.map(a.footer,function(a){return{text:"string"===typeof a?a:a+"",style:"tableFooter"}}));a={pageSize:c.pageSize,pageOrientation:c.orientation,content:[{table:{headerRows:1,body:f},layout:"noBorders"}],styles:{tableHeader:{bold:!0,fontSize:11,color:"white",fillColor:"#2d4154",alignment:"center"},
tableBodyEven:{},tableBodyOdd:{fillColor:"#f3f3f3"},tableFooter:{bold:!0,fontSize:11,color:"white",fillColor:"#2d4154"},title:{alignment:"center",fontSize:15},message:{}},defaultStyle:{fontSize:10}};c.message&&a.content.unshift({text:"function"==typeof c.message?c.message(b,d,c):c.message,style:"message",margin:[0,0,0,12]});c.title&&a.content.unshift({text:R(c,!1),style:"title",margin:[0,0,0,12]});c.customize&&c.customize(a,c);b=(u||i.pdfMake).createPdf(a);"open"===c.download&&!M()?b.open():b.getBuffer(function(a){a=
new Blob([a],{type:"application/pdf"});q(a,x(c))})},title:"*",filename:"*",extension:".pdf",exportOptions:{},orientation:"portrait",pageSize:"A4",header:!0,footer:!1,message:null,customize:null,download:"download"};return r.Buttons});

(function(f){"function"===typeof define&&define.amd?define(["jquery","datatables.net","datatables.net-buttons"],function(e){return f(e,window,document)}):"object"===typeof exports?module.exports=function(e,c){e||(e=window);if(!c||!c.fn.dataTable)c=require("datatables.net")(e,c).$;c.fn.dataTable.Buttons||require("datatables.net-buttons")(e,c);return f(c,e,e.document)}:f(jQuery,window,document)})(function(f,e,c){var i=f.fn.dataTable,h=c.createElement("a");i.ext.buttons.print={className:"buttons-print",
text:function(b){return b.i18n("buttons.print","Print")},action:function(b,c,i,d){var a=c.buttons.exportData(d.exportOptions),k=function(b,a){for(var c="<tr>",d=0,e=b.length;d<e;d++)c+="<"+a+">"+b[d]+"</"+a+">";return c+"</tr>"},b='<table class="'+c.table().node().className+'">';d.header&&(b+="<thead>"+k(a.header,"th")+"</thead>");for(var b=b+"<tbody>",l=0,m=a.body.length;l<m;l++)b+=k(a.body[l],"td");b+="</tbody>";d.footer&&a.footer&&(b+="<tfoot>"+k(a.footer,"th")+"</tfoot>");var g=e.open("",""),
a=d.title;"function"===typeof a&&(a=a());-1!==a.indexOf("*")&&(a=a.replace("*",f("title").text()));g.document.close();var j="<title>"+a+"</title>";f("style, link").each(function(){var c=j,b=f(this).clone()[0],a;"link"===b.nodeName.toLowerCase()&&(h.href=b.href,a=h.host,-1===a.indexOf("/")&&0!==h.pathname.indexOf("/")&&(a+="/"),b.href=h.protocol+"//"+a+h.pathname+h.search);j=c+b.outerHTML});try{g.document.head.innerHTML=j}catch(n){f(g.document.head).html(j)}g.document.body.innerHTML="<h1>"+a+"</h1><div>"+
("function"===typeof d.message?d.message(c,i,d):d.message)+"</div>"+b;d.customize&&d.customize(g);setTimeout(function(){d.autoPrint&&(g.print(),g.close())},250)},title:"*",message:"",exportOptions:{},header:!0,footer:!1,autoPrint:!0,customize:null};return i.Buttons});