import _extends from '../polyfills/extends';
import _Object$getPrototypeOf from '../polyfills/objectGetPrototypeOf';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from '../polyfills/createClass';
import _possibleConstructorReturn from '../polyfills/possibleConstructorReturn';
import _inherits from '../polyfills/inherits';
import React from 'react';
import PropTypes from 'prop-types';

import frequently from '../utils/frequently';
import { getData } from '../utils';
import { Emoji } from '.';

var Category = function (_React$Component) {
  _inherits(Category, _React$Component);

  function Category(props) {
    _classCallCheck(this, Category);

    var _this = _possibleConstructorReturn(this, (Category.__proto__ || _Object$getPrototypeOf(Category)).call(this, props));

    _this.setContainerRef = _this.setContainerRef.bind(_this);
    _this.setLabelRef = _this.setLabelRef.bind(_this);
    return _this;
  }

  _createClass(Category, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.parent = this.container.parentNode;

      this.margin = 0;
      this.minMargin = 0;

      this.memoizeSize();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _props = this.props;
      var name = _props.name;
      var perLine = _props.perLine;
      var native = _props.native;
      var hasStickyPosition = _props.hasStickyPosition;
      var emojis = _props.emojis;
      var emojiProps = _props.emojiProps;
      var skin = emojiProps.skin;
      var size = emojiProps.size;
      var set = emojiProps.set;
      var nextPerLine = nextProps.perLine;
      var nextNative = nextProps.native;
      var nextHasStickyPosition = nextProps.hasStickyPosition;
      var nextEmojis = nextProps.emojis;
      var nextEmojiProps = nextProps.emojiProps;
      var nextSkin = nextEmojiProps.skin;
      var nextSize = nextEmojiProps.size;
      var nextSet = nextEmojiProps.set;
      var shouldUpdate = false;

      if (name == 'Recent' && perLine != nextPerLine) {
        shouldUpdate = true;
      }

      if (name == 'Search') {
        shouldUpdate = !(emojis == nextEmojis);
      }

      if (skin != nextSkin || size != nextSize || native != nextNative || set != nextSet || hasStickyPosition != nextHasStickyPosition) {
        shouldUpdate = true;
      }

      return shouldUpdate;
    }
  }, {
    key: 'memoizeSize',
    value: function memoizeSize() {
      var _container$getBoundin = this.container.getBoundingClientRect();

      var top = _container$getBoundin.top;
      var height = _container$getBoundin.height;

      var _parent$getBoundingCl = this.parent.getBoundingClientRect();

      var parentTop = _parent$getBoundingCl.top;

      var _label$getBoundingCli = this.label.getBoundingClientRect();

      var labelHeight = _label$getBoundingCli.height;


      this.top = top - parentTop + this.parent.scrollTop;

      if (height == 0) {
        this.maxMargin = 0;
      } else {
        this.maxMargin = height - labelHeight;
      }
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll(scrollTop) {
      var margin = scrollTop - this.top;
      margin = margin < this.minMargin ? this.minMargin : margin;
      margin = margin > this.maxMargin ? this.maxMargin : margin;

      if (margin == this.margin) return;

      if (!this.props.hasStickyPosition) {
        this.label.style.top = margin + 'px';
      }

      this.margin = margin;
      return true;
    }
  }, {
    key: 'getEmojis',
    value: function getEmojis() {
      var _props2 = this.props;
      var name = _props2.name;
      var emojis = _props2.emojis;
      var recent = _props2.recent;
      var perLine = _props2.perLine;


      if (name == 'Recent') {
        var custom = this.props.custom;

        var frequentlyUsed = recent || frequently.get(perLine);

        if (frequentlyUsed.length) {
          emojis = frequentlyUsed.map(function (id) {
            var emoji = custom.filter(function (e) {
              return e.id === id;
            })[0];
            if (emoji) {
              return emoji;
            }

            return id;
          }).filter(function (id) {
            return !!getData(id);
          });
        }

        if (emojis.length === 0 && frequentlyUsed.length > 0) {
          return null;
        }
      }

      if (emojis) {
        emojis = emojis.slice(0);
      }

      return emojis;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay(display) {
      var emojis = this.getEmojis();

      if (!emojis) {
        return;
      }

      this.container.style.display = display;
    }
  }, {
    key: 'setContainerRef',
    value: function setContainerRef(c) {
      this.container = c;
    }
  }, {
    key: 'setLabelRef',
    value: function setLabelRef(c) {
      this.label = c;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props;
      var id = _props3.id;
      var name = _props3.name;
      var hasStickyPosition = _props3.hasStickyPosition;
      var emojiProps = _props3.emojiProps;
      var i18n = _props3.i18n;
      var emojis = this.getEmojis();
      var labelStyles = {};
      var labelSpanStyles = {};
      var containerStyles = {};

      if (!emojis) {
        containerStyles = {
          display: 'none'
        };
      }

      if (!hasStickyPosition) {
        labelStyles = {
          height: 28
        };

        labelSpanStyles = {
          position: 'absolute'
        };
      }

      return React.createElement(
        'div',
        {
          ref: this.setContainerRef,
          className: 'emoji-mart-category ' + (emojis && !emojis.length ? 'emoji-mart-no-results' : ''),
          style: containerStyles
        },
        React.createElement(
          'div',
          {
            style: labelStyles,
            'data-name': name,
            className: 'emoji-mart-category-label'
          },
          React.createElement(
            'span',
            { style: labelSpanStyles, ref: this.setLabelRef },
            i18n.categories[id]
          )
        ),
        emojis && emojis.map(function (emoji) {
          return Emoji(_extends({ emoji: emoji }, emojiProps));
        }),
        emojis && !emojis.length && React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            null,
            Emoji(_extends({}, emojiProps, {
              size: 38,
              emoji: 'sleuth_or_spy',
              onOver: null,
              onLeave: null,
              onClick: null
            }))
          ),
          React.createElement(
            'div',
            { className: 'emoji-mart-no-results-label' },
            i18n.notfound
          )
        )
      );
    }
  }]);

  return Category;
}(React.Component);

export default Category;


Category.defaultProps = {
  emojis: [],
  hasStickyPosition: true
};