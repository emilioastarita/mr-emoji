import React from 'react';
import PropTypes from 'prop-types';
import data from '../data';

import { getData, getSanitizedData, unifiedToNative } from '../utils';

var SHEET_COLUMNS = 52;

var _getPosition = function _getPosition(props) {
  var _getData2 = _getData(props);

  var sheet_x = _getData2.sheet_x;
  var sheet_y = _getData2.sheet_y;
  var multiply = 100 / (SHEET_COLUMNS - 1);

  return multiply * sheet_x + '% ' + multiply * sheet_y + '%';
};

var _getData = function _getData(props) {
  var emoji = props.emoji;
  var skin = props.skin;
  var set = props.set;

  return getData(emoji, skin, set);
};

var _getSanitizedData = function _getSanitizedData(props) {
  var emoji = props.emoji;
  var skin = props.skin;
  var set = props.set;

  return getSanitizedData(emoji, skin, set);
};

var _handleClick = function _handleClick(e, props) {
  if (!props.onClick) {
    return;
  }
  var onClick = props.onClick;
  var emoji = _getSanitizedData(props);

  onClick(emoji, e);
};

var _handleOver = function _handleOver(e, props) {
  if (!props.onOver) {
    return;
  }
  var onOver = props.onOver;
  var emoji = _getSanitizedData(props);

  onOver(emoji, e);
};

var _handleLeave = function _handleLeave(e, props) {
  if (!props.onLeave) {
    return;
  }
  var onLeave = props.onLeave;
  var emoji = _getSanitizedData(props);

  onLeave(emoji, e);
};

var _isNumeric = function _isNumeric(value) {
  return !isNaN(value - parseFloat(value));
};

var _convertStyleToCSS = function _convertStyleToCSS(style) {
  var div = document.createElement('div');

  for (var key in style) {
    var value = style[key];

    if (_isNumeric(value)) {
      value += 'px';
    }

    div.style[key] = value;
  }

  return div.getAttribute('style');
};

var Emoji = function Emoji(props) {
  for (var k in Emoji.defaultProps) {
    if (props[k] == undefined && Emoji.defaultProps[k] != undefined) {
      props[k] = Emoji.defaultProps[k];
    }
  }

  var data = _getData(props);
  if (!data) {
    return null;
  }

  var unified = data.unified;
  var custom = data.custom;
  var short_names = data.short_names;
  var imageUrl = data.imageUrl;
  var style = {};
  var children = props.children;
  var className = 'emoji-mart-emoji';
  var title = null;

  if (!unified && !custom) {
    return null;
  }

  if (props.tooltip) {
    title = short_names[0];
  }

  if (props.native && unified) {
    className += ' emoji-mart-emoji-native';
    style = { fontSize: props.size };
    children = unifiedToNative(unified);

    if (props.forceSize) {
      style.display = 'inline-block';
      style.width = props.size;
      style.height = props.size;
    }
  } else if (custom) {
    className += ' emoji-mart-emoji-custom';
    style = {
      width: props.size,
      height: props.size,
      display: 'inline-block',
      backgroundImage: 'url(' + imageUrl + ')',
      backgroundSize: 'contain'
    };
  } else {
    var setHasEmoji = _getData(props)['has_img_' + props.set];

    if (!setHasEmoji) {
      if (props.fallback) {
        return props.fallback(data);
      } else {
        return null;
      }
    } else {
      style = {
        width: props.size,
        height: props.size,
        display: 'inline-block',
        backgroundImage: 'url(' + props.backgroundImageFn(props.set, props.sheetSize) + ')',
        backgroundSize: 100 * SHEET_COLUMNS + '%',
        backgroundPosition: _getPosition(props)
      };
    }
  }

  if (props.html) {
    style = _convertStyleToCSS(style);
    return '<span style=\'' + style + '\' ' + (title ? 'title=\'' + title + '\'' : '') + ' class=\'' + className + '\'>' + (children || '') + '</span>';
  } else {
    return React.createElement(
      'span',
      {
        key: props.emoji.id || props.emoji,
        onClick: function onClick(e) {
          return _handleClick(e, props);
        },
        onMouseEnter: function onMouseEnter(e) {
          return _handleOver(e, props);
        },
        onMouseLeave: function onMouseLeave(e) {
          return _handleLeave(e, props);
        },
        title: title,
        className: className
      },
      React.createElement(
        'span',
        { style: style },
        children
      )
    );
  }
};

Emoji.defaultProps = {
  skin: 1,
  set: 'apple',
  sheetSize: 64,
  native: false,
  forceSize: false,
  tooltip: false,
  backgroundImageFn: function backgroundImageFn(set, sheetSize) {
    return 'https://unpkg.com/emoji-datasource-' + set + '@' + '4.0.2' + '/img/' + set + '/sheets-256/' + sheetSize + '.png';
  },
  onOver: function onOver() {},
  onLeave: function onLeave() {},
  onClick: function onClick() {}
};

export default Emoji;