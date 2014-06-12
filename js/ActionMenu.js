// Jon Lynch
// ActionMenu: Stand Alone row action menu
// ======================================================
// This action menu assumes you are running jQuery and takes the $ as a parameter pointer to jQuery
// To implement this script, you will need to configure and pass the following:
// 1. MenuOptions json object (could be passed from a service) - this is contained within outer "options" param
// -------------------------------------------------------------------------
// 'data-id':   (id for menu item, just to pass back to callback if needed)
// 'item-text': (text to display for menu item)
// 'callback':  function to be called when item is clicked
// -------------------------------------------------------------------------
// 2. Options object to pass to constructor
// var options = {
//   id:             'actionMenu',                           // id to assign to container of menu
//   menuOptions:    menuOptions,                            // items for menu
//   targetCssClass: '.icon-collapse-top, .icon-collapse'    // target for click to display menu
// };
function ActionMenu(options, jq) {
  'use strict';
  // Immediate check for arguments
  // Check for passed jQuery
  if (typeof jq === 'undefined') {
    throw 'You need to pass jQuery as "jQuery" or "$".';
  }
  // Check for options object
  if (typeof options === 'undefined') {
    throw 'You need to pass the options object.';
  }

  var self = this;
  self.options = options;
  self.top = 0;
  self.left = 0;
  self.topAdjustment = -18;
  self.leftAdjustment = 25;
  self.currentTarget = jq('<a></a>');
  self.clicked = false;
  self.markup = '<div id=""><ul></ul><i class="stem"></i></div>';
  self.container = null;
  self.clickContainer = null;

  self.init = function () {
    self.markup = self.markup.replace('id=""', 'id="' + self.options.id + '"');
    self.addContainer();
    self.container = jq('#' + self.options.id);
    self.setTargetAttributes();
    self.setClickOptions(self.options.menuOptions);
    self.clickContainer = jq(self.options.targetCssClass);
    self.setDocumentClick();
  };

  self.addContainer = function () {
    jq('body').append(self.markup);
  };

  self.setPosition = function (top, left) {
    self.container.css({top: top, left: left});
  };

  self.display = function (target) {
    self.currentTarget = target;
    self.currentTarget.removeClass('icon-collapse');
    self.currentTarget.addClass('icon-collapse-top');
    self.top = self.currentTarget.offset().top + self.topAdjustment;
    self.left = self.currentTarget.offset().left + self.leftAdjustment;
    self.setPosition(self.top, self.left);
    self.clicked = true;
    self.container.show();
  };

  self.remove = function () {
    if (self.currentTarget !== jq('<a></a>')) {
      self.currentTarget.removeClass('icon-collapse-top');
      self.currentTarget.addClass('icon-collapse');
      self.clicked = false;
      self.container.hide();
      self.currentTarget = jq('<a></a>');
    }
  };

  self.setTargetAttributes = function () {
    jq(self.options.targetCssClass).click(function () {
      self.setTarget(jq(this));
    });
  };

  self.setClickOptions = function (clickOptions) {
    // Loop through options to add items to menu
    jq.each(clickOptions, function (i, value) {
      var ul = self.container.find("ul"), li = jq('<li></li>');
      li.attr('data-id', clickOptions[i]['data-id']);
      li.text(clickOptions[i]['item-text']);
      ul.append(li);
      li.on("click", function () {
        var that = self.currentTarget[0], func = clickOptions[i].callback;
        // call setting scope as currently clicked row icon
        func.call(that);
        self.remove();
      });
    });
  };

  self.setDocumentClick = function () {
    jq(document).mouseup(function (e) {
      if (!self.container.is(e.target) && self.container.has(e.target).length === 0 && !self.clickContainer.is(e.target)) {
        self.remove();
      }
    });
  };

  self.setTarget = function (target) {
    if (target[0] === self.currentTarget[0] && !self.clicked) {
      self.display(target);
    } else if (target[0] === self.currentTarget[0] && self.clicked) {
      self.remove();
    } else if (target[0] !== self.currentTarget[0]) {
      self.remove();
      self.display(target);
    } else {
      self.remove();
    }
  };

  return {
    init: function () {
      self.init();
    }
  };
}