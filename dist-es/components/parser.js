import _Object$getPrototypeOf from '../polyfills/objectGetPrototypeOf';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from '../polyfills/createClass';
import _possibleConstructorReturn from '../polyfills/possibleConstructorReturn';
import _inherits from '../polyfills/inherits';
import React from 'react';
import Emoji from "./emoji";
import PropTypes from 'prop-types';

var Parser = function (_React$PureComponent) {
    _inherits(Parser, _React$PureComponent);

    function Parser(props) {
        _classCallCheck(this, Parser);

        return _possibleConstructorReturn(this, (Parser.__proto__ || _Object$getPrototypeOf(Parser)).call(this, props));
    }

    _createClass(Parser, [{
        key: 'colonsToUnicode',
        value: function colonsToUnicode(text) {
            var colonsRegex = new RegExp('(^|)(:[a-zA-Z0-9-_+]+:(:skin-tone-[2-6]:)?)', 'g');
            var newText = [];
            var match = void 0;
            var obj = [];
            while (match = colonsRegex.exec(text)) {
                // eslint-disable-line
                //console.log(match);
                var colons = match[2];
                var offset = match.index + match[1].length;
                var length = colons.length;
                obj.push({
                    colons: colons,
                    offset: offset,
                    length: length
                });
            }

            //In case no emoji
            if (obj.length === 0) {
                return text;
            }

            for (var i = 0; i < obj.length; i++) {
                if (newText.length === 0) {
                    newText.push(text.substring(0, obj[i].offset));
                }
                newText.push(React.createElement(
                    Emoji,
                    { emoji: obj[i].colons, sheetSize: 16, size: 16, apple: true, key: i },
                    obj[i].colons
                ));
                // text between two emojis
                var emojiPointerEnds = obj[i].offset + obj[i].length;
                if (!!obj[i + 1] && obj[i + 1].offset > emojiPointerEnds) {
                    newText.push(text.substring(emojiPointerEnds, obj[i + 1].offset));
                } else if (obj.length === i + 1 && emojiPointerEnds < text.length) {
                    // remaining parts incase of last emoji
                    newText.push(text.substring(emojiPointerEnds, text.length));
                }
            }
            return newText;
        }
    }, {
        key: 'render',
        value: function render() {
            var data = this.props.data;

            return React.createElement(
                'div',
                null,
                this.colonsToUnicode(data)
            );
        }
    }]);

    return Parser;
}(React.PureComponent);

export default Parser;