/**
 * Escapes a string for including it in XML markup: replaces ">" with "&gt;", etc.
 * https://en.wikipedia.org/wiki/Character_encodings_in_HTML#HTML_character_references
 * @param  {string} string
 * @param  {boolean} options.isAttributeValue — Pass `true` if an XML attribute value is being escaped. Pass `false` otherwise.
 * @return {string}
 */
function escapeXmlSpecialCharacters(string, _ref) {
  var isAttributeValue = _ref.isAttributeValue;
  // By default, "&", "<" and ">" characters should be escaped:
  //
  // The ampersand character (&) and the left angle bracket (<) must not appear
  // in their literal form, except when used as markup delimiters, or within a comment,
  // a processing instruction, or a CDATA section. If they are needed elsewhere,
  // they must be escaped using either numeric character references or the strings
  // " & " and " < " respectively. The right angle bracket (>) may be represented
  // using the string " > ", and must, for compatibility, be escaped using either
  // " > " or a character reference when it appears in the string " ]]> " in content,
  // when that string is not marking the end of a CDATA section.
  //
  string = replaceAll(string, '&', '&amp;');
  string = replaceAll(string, '>', '&gt;');
  string = replaceAll(string, '<', '&lt;');

  // Additionally, in attribute values, single and double quotes might be required
  // to be escaped depending on what character is used for delimiting those attribute values.
  if (isAttributeValue) {
    string = replaceAll(string, '\'', '&apos;');
    string = replaceAll(string, '"', '&quot;');
  }
  return string;
}
function replaceAll(string, replacedSubstring, replacementSubstring) {
  if (string.replaceAll) {
    return string.replaceAll(replacedSubstring, replacementSubstring);
  }
  // There's no need to escape RegExp special characters in `replacedSubstring`
  // because this function is not exported and is only called internally
  // with a known subset of possible `replacedSubstring`s which are known
  // to not contain any RegExp special characters.
  return string.replace(new RegExp(replacedSubstring, 'g'), replacementSubstring);
}

// // Escapes any regular-expression-specific special characters.
// function escapeRegExpSpecialCharacters(string) {
// 	const specialCharactersRegExp = new RegExp('[.*+?|()\\[\\]{}\\\\]', 'g')
// 	return string.replace(specialCharactersRegExp, '\\$&')
// }

var INVALID_CHARACTERS = /((?:[\0-\x08\x0B\f\x0E-\x1F\uFFFD\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))/g;
var DISCOURAGED_CHARACTERS = new RegExp("([\\x7F-\\x84]|[\\x86-\\x9F]|[\\uFDD0-\\uFDEF]|(?:\\uD83F[\\uDFFE\\uDFFF])|(?:\\uD87F[\\uDFFE\\uDFFF])|(?:\\uD8BF[\\uDFFE\\uDFFF])|(?:\\uD8FF[\\uDFFE\\uDFFF])|(?:\\uD93F[\\uDFFE\\uDFFF])|(?:\\uD97F[\\uDFFE\\uDFFF])|(?:\\uD9BF[\\uDFFE\\uDFFF])|(?:\\uD9FF[\\uDFFE\\uDFFF])|(?:\\uDA3F[\\uDFFE\\uDFFF])|(?:\\uDA7F[\\uDFFE\\uDFFF])|(?:\\uDABF[\\uDFFE\\uDFFF])|(?:\\uDAFF[\\uDFFE\\uDFFF])|(?:\\uDB3F[\\uDFFE\\uDFFF])|(?:\\uDB7F[\\uDFFE\\uDFFF])|(?:\\uDBBF[\\uDFFE\\uDFFF])|(?:\\uDBFF[\\uDFFE\\uDFFF])(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\uE000-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF]))", 'g');

/**
 * Removes "invalid" or "discouraged" XML characters from a string.
 * "Invalid" characters are "C0 control characters" or "surrogate blocks" ("non-characters" and "surrogate pairs").
 * "Discouraged" characters are the ones that're officially discouraged from use in XML documents by the XML specification.
 * @param {string} string - a string containing potentially invalid XML characters (non-UTF8 characters, STX, EOX etc)
 * @return {string} a sanitized string stripped of invalid (and by default also discouraged) XML characters
 */
function removeInvalidXmlCharacters(string) {
  // Remove everything forbidden by XML 1.0 specification,
  // plus the unicode replacement character U+FFFD.
  string = string.replace(INVALID_CHARACTERS, '');

  // Remove everything discouraged by XML 1.0 specification.
  // I.e. strictly speaking, these characters are still valid
  // but also officially discouraged from use in XML documents.
  string = string.replace(DISCOURAGED_CHARACTERS, '');
  return string;
}

/**
 * Removes invalid characters and escapes "speciaL" characters in an XML attribute's value.
 * @param {string} attributeValue
 * @returns {string}
 */
function sanitizeAttributeValue(attributeValue) {
  if (typeof attributeValue !== 'string') {
    throw new TypeError('Argument must be a string');
  }
  // Remove characters that're invalid in XML.
  attributeValue = removeInvalidXmlCharacters(attributeValue);
  // Escape "special" characters.
  return escapeXmlSpecialCharacters(attributeValue, {
    isAttributeValue: true
  });
}

/**
 * Removes invalid characters and escapes "speciaL" characters in an XML attribute's name.
 * @param {string} attributeName
 * @returns {string}
 */
function sanitizeAttributeName(attributeName) {
  if (typeof attributeName !== 'string') {
    throw new TypeError('Argument must be a string');
  }
  // Remove characters that're invalid in XML.
  attributeName = removeInvalidXmlCharacters(attributeName);
  // Remove characters that're invalid in an XML attribute name.
  return attributeName.replace(/[^a-zA-Z_0-9-.:]/g, '').replace(/^[^a-zA-Z_]+/, '');
}

/**
 * Converts an object with XML attribute values to a string.
 * Examples:
 * { a: 'b', c: 'd' } → ' a="b" c="d"'
 * {} → ''
 * @param {object} attributes
 * @returns {string}
 */
function getAttributesString(attributes) {
  return Object.keys(attributes).map(function (name) {
    return "".concat(sanitizeAttributeName(name), "=\"").concat(sanitizeAttributeValue(String(attributes[name])), "\"");
  }).reduce(function (combined, part) {
    return combined + ' ' + part;
  }, '');
}

/**
 * Returns XML for an "opening tag" with a given `tagName` and optional `attributes`.
 * @param {string} tagName
 * @param {object} [attributes]
 * @returns {string}
 */
function getOpeningTagMarkup(tagName, attributes) {
  return '<' + tagName + (attributes ? getAttributesString(attributes) : '') + '>';
}

/**
 * Returns XML for a "closing tag" with a given `tagName`.
 * @param {string} tagName
 * @returns {string}
 */
function getClosingTagMarkup(tagName) {
  return '</' + tagName + '>';
}

/**
 * Returns XML for an element with a given `tagName`, optional `attributes` and no child elements.
 * @param {string} tagName
 * @param {object} [attributes]
 * @returns {string}
 */
function getSelfClosingTagMarkup(tagName, attributes) {
  return getOpeningTagMarkup(tagName, attributes).slice(0, -1) + '/>';
}

/**
 * Removes invalid characters and escapes "speciaL" characters in an XML element's text content.
 * @param {string} textContent
 * @returns {string}
 */
function sanitizeTextContent(textContent) {
  if (typeof textContent !== 'string') {
    throw new TypeError('Argument must be a string');
  }
  // Remove characters that're invalid in XML.
  textContent = removeInvalidXmlCharacters(textContent);
  // Escape "special" characters.
  return escapeXmlSpecialCharacters(textContent, {
    isAttributeValue: false
  });
}

/**
 * Gets spreadsheet cell string coordinate from row index and column index.
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @returns {string}
 */
function getCellAddress(rowIndex, columnIndex) {
  return "".concat(getColumnLetter(columnIndex)).concat(rowIndex + 1);
}

// `26` letters in the alphabet: from "A" to "Z".
var LETTERS_COUNT = 26;
function getColumnLetter(columnIndex) {
  if (typeof columnIndex !== 'number') {
    return '';
  }
  var prefix = Math.floor(columnIndex / LETTERS_COUNT);
  // Letter character codes start at `97`.
  var letter = String.fromCharCode(97 + columnIndex % LETTERS_COUNT).toUpperCase();
  if (prefix === 0) {
    return letter;
  }
  return getColumnLetter(prefix - 1) + letter;
}

// "Excel serial date" is just
// the count of days since `01/01/1900`
// (seems that it may be even fractional).
//
// The count of days elapsed
// since `01/01/1900` (Excel epoch)
// till `01/01/1970` (Unix epoch).
// Accounts for leap years
// (19 of them, yielding 19 extra days).
var daysBeforeUnixEpoch = 70 * 365 + 19;

// An hour, approximately, because a minute
// may be longer than 60 seconds, see "leap seconds".
var hour = 60 * 60 * 1000;
var day = 24 * hour;

/**
 * Converts a `Date` into an XLSX "serial" number.
 * @param {Date} date
 * @returns {number}
 */
function convertDateToSerialNumber(date) {
  return date.getTime() / day + daysBeforeUnixEpoch;
}

/**
 * Finds elements in valid XML markup.
 * Caveat: Every time it finds an element, it doesn't "step into" it but rather "steps over" it.
 * @param {string} xml — XML markup
 * @param {string} [options.tagName] — The name of the element to find
 * @param {boolean} [options.stopAfterFirstMatch] — If `true`, will only return a single result.
 * @returns {object[]} — Found elements, each element represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`
 */
function findElementsNonRecursive_(xml) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    tagName = _ref.tagName,
    stopAfterFirstMatch = _ref.stopAfterFirstMatch;
  var openingTagRegExp = new RegExp(getOpeningTagRegExpPattern(tagName), stopAfterFirstMatch ? undefined : 'g');
  var results = [];
  var openingTagMatch;
  while ((openingTagMatch = openingTagRegExp.exec(xml)) !== null) {
    var openingTag = openingTagMatch[0];
    var openingTagName = tagName || openingTagMatch[1];
    var attributes = {};
    var attributeRegExp = new RegExp('\\s+([^\\s=>]+)(?:="([^\\s=>]+)")', 'g');
    var attributeMatch = void 0;
    while ((attributeMatch = attributeRegExp.exec(openingTag)) !== null) {
      attributes[attributeMatch[1]] = attributeMatch[2];
    }
    var result = {
      tagName: openingTagName,
      // openingTagMarkup: openingTag,
      openingTagStartIndex: openingTagMatch.index,
      openingTagEndIndex: openingTagMatch.index + openingTag.length - 1,
      openingTagAttributes: attributes,
      selfClosingTag: false,
      // closingTagMarkup: undefined,
      closingTagStartIndex: undefined,
      closingTagEndIndex: undefined
    };
    if (openingTag[openingTag.length - 2] === '/') {
      result.selfClosingTag = true;
    } else {
      var closingTagPosition = findClosingTagPosition(xml, result.openingTagEndIndex + 1, openingTagName);
      if (!closingTagPosition) {
        // `xml` is supposed to be "valid XML", so such situation isn't supposed to be possible.
        throw new Error("Invalid XML: opening tag was found but closing tag was not: </".concat(openingTagName, ">"));
      }
      result.closingTagStartIndex = closingTagPosition[0];
      result.closingTagEndIndex = closingTagPosition[1];
    }
    results.push(result);
    if (stopAfterFirstMatch) {
      break;
    }

    // Set "start from" index of the next match.
    if (result.selfClosingTag) {
      openingTagRegExp.lastIndex = result.openingTagEndIndex + 1;
    } else {
      openingTagRegExp.lastIndex = result.closingTagEndIndex + 1;
    }
  }
  return results;
}
function findClosingTagPosition(xml, startFromIndex, tagName) {
  var openingOrClosingTagRegExp = new RegExp('<(/)?' + tagName + '(?:\\s+[^>]+|/)?>', 'g');
  openingOrClosingTagRegExp.lastIndex = startFromIndex;
  var nestingLevel = 0;
  var openingOrClosingTagMatch;
  while ((openingOrClosingTagMatch = openingOrClosingTagRegExp.exec(xml)) !== null) {
    var openingOrClosingTag = openingOrClosingTagMatch[0];
    // Tells if it's a closing tag or an opening tag.
    var closingTagMarker = openingOrClosingTagMatch[1];
    if (closingTagMarker) {
      // Closing tag encountered.
      if (nestingLevel > 0) {
        nestingLevel--;
      } else {
        return [openingOrClosingTagMatch.index, openingOrClosingTagMatch.index + openingOrClosingTag.length - 1];
      }
    } else {
      // Opening tag encountered.
      nestingLevel++;
    }
  }
}
function getOpeningTagRegExpPattern(tagName) {
  return '<' + (tagName || '([^\\s/>]+)') + '(?:\\s+[^>]+|/)?>';
}

/**
 * Finds a single element in valid XML markup.
 * @param {string} xml — XML markup
 * @param {string} tagName — The name of the element to find
 * @returns {object|undefined} — A found element, represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`
 */
function findElement(xml, tagName) {
  var elements = findElementsNonRecursive_(xml, {
    tagName: tagName,
    stopAfterFirstMatch: true
  });
  return elements[0];
}

/**
 * Replaces the XML inside an `element` that was found in `xml` using `findElement()` function.
 * @param {string} xml
 * @param {FoundElement} element
 * @param {string} [replacementXml]
 * @returns {string}
 */
function setMarkupInsideElement(xml, element, replacementXml) {
  if (replacementXml) {
    if (element.selfClosingTag) {
      return xml.slice(0, element.openingTagEndIndex - '/'.length) + '>' + replacementXml + '</' + element.tagName + '>' + xml.slice(element.openingTagEndIndex + 1);
    }
    return xml.slice(0, element.openingTagEndIndex + 1) + replacementXml + xml.slice(element.closingTagStartIndex);
  } else {
    if (element.selfClosingTag) {
      return xml;
    }
    return xml.slice(0, element.openingTagEndIndex) + '/>' + xml.slice(element.closingTagEndIndex + 1);
  }
}

/**
 * Appends XML inside an `element` that was found in `xml` using `findElement()` function.
 * @param {string} xml
 * @param {FoundElement} element
 * @param {string} addedXml
 * @returns {string}
 */
function appendMarkupInsideElement(xml, element, addedXml) {
  if (element.selfClosingTag) {
    return setMarkupInsideElement(xml, element, addedXml);
  }
  return xml.slice(0, element.closingTagStartIndex) + addedXml + xml.slice(element.closingTagStartIndex);
}

/**
 * Returns the XML inside an `element` that was found in `xml` using `findElement()` function.
 * @param {string} xml
 * @param {FoundElement} element
 * @returns {string}
 */
function getMarkupInsideElement(xml, element) {
  if (element.selfClosingTag) {
    return '';
  }
  return xml.substring(element.openingTagEndIndex + 1, element.closingTagStartIndex);
}

function applyEnclosingElementOffset(element, enclosingElement) {
  var enclosingElementOffset = enclosingElement.openingTagEndIndex + 1;
  element.openingTagStartIndex += enclosingElementOffset;
  element.openingTagEndIndex += enclosingElementOffset;
  if (!element.selfClosingTag) {
    element.closingTagStartIndex += enclosingElementOffset;
    element.closingTagEndIndex += enclosingElementOffset;
  }
}

function _createForOfIteratorHelperLoose$1(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray$1(r)) || e) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: true } : { done: false, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray$1(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray$1(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray$1(r, a) : void 0; } }
function _arrayLikeToArray$1(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }

/**
 * Returns all child elements of a given element.
 * @param {string} xml — XML markup
 * @param {object} element — A parent element that was previously found using `findElement()` function.
 * @returns {object[]} — Child elements, each element represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`
 */
function getChildElements(xml, element) {
  var children = findElementsNonRecursive_(getMarkupInsideElement(xml, element));
  for (var _iterator = _createForOfIteratorHelperLoose$1(children), _step; !(_step = _iterator()).done;) {
    var child = _step.value;
    applyEnclosingElementOffset(child, element);
  }
  return children;
}

/**
 * Prepends XML inside an `element` that was found in `xml` using `findElement()` function.
 * @param {string} xml
 * @param {FoundElement} element
 * @param {string} addedXml
 * @returns {string}
 */
function prependMarkupInsideElement(xml, element, addedXml) {
  if (element.selfClosingTag) {
    return setMarkupInsideElement(xml, element, addedXml);
  }
  return xml.slice(0, element.openingTagEndIndex + 1) + addedXml + xml.slice(element.openingTagEndIndex + 1);
}

function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: true } : { done: false, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function insertElementMarkupAccordingToOrderOfSiblings(xml, elementMarkup, orderOfSiblings) {
  for (var _len = arguments.length, parentElementTagNames = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    parentElementTagNames[_key - 3] = arguments[_key];
  }
  if (parentElementTagNames.length === 0) {
    throw new Error('At least one parent element tag name is required');
  }

  // Reorder the parent elements from top to bottom.
  parentElementTagNames = parentElementTagNames.slice().reverse();

  // Find the immediate parent element.
  var parentElement;
  var _loop = function _loop() {
    var parentElementTagName = _step.value;
    if (parentElement) {
      // Doesn't use `findElementInsideElement()` here in order to only search
      // in the immediate children of the `parentElement`.
      // parentElement = findElementInsideElement(xml, parentElementTagName, parentElement)
      parentElement = getChildElements(xml, parentElement).find(function (_) {
        return _.tagName === parentElementTagName;
      });
    } else {
      parentElement = findElement(xml, parentElementTagName);
    }
    if (!parentElement) {
      throw new Error("Element not found: <".concat(parentElementTagName, ">"));
    }
  };
  for (var _iterator = _createForOfIteratorHelperLoose(parentElementTagNames), _step; !(_step = _iterator()).done;) {
    _loop();
  }

  // Get element's tag name.
  var elementTagNameMatch = elementMarkup.match(TAG_NAME_REG_EXP);
  if (!elementTagNameMatch) {
    throw new Error("Couldn't extract tag name from markup: ".concat(elementMarkup));
  }
  var elementTagName = elementTagNameMatch[1];

  // See if the `.xlsx` specification enforces a specific order of elements in such case.
  if (!orderOfSiblings || orderOfSiblings.length < 2) {
    return appendMarkupInsideElement(xml, parentElement, elementMarkup);
  }
  var children = getChildElements(xml, parentElement);
  if (children.length === 0) {
    return appendMarkupInsideElement(xml, parentElement, elementMarkup);
  }
  var elementTagNameOrder = orderOfSiblings.indexOf(elementTagName);
  if (elementTagNameOrder < 0) {
    // The element tag name is unknown.
    return appendMarkupInsideElement(xml, parentElement, elementMarkup);
  }
  var tagNamesBeforeElement = orderOfSiblings.slice(0, elementTagNameOrder).reverse();
  var _loop2 = function _loop2() {
      var tagName = _step2.value;
      var precedingElement = children.find(function (_) {
        return _.tagName === tagName;
      });
      if (precedingElement) {
        return {
          v: xml.slice(0, precedingElement.selfClosingTag ? precedingElement.openingTagEndIndex + 1 : precedingElement.closingTagEndIndex + 1) + elementMarkup + xml.slice(precedingElement.selfClosingTag ? precedingElement.openingTagEndIndex + 1 : precedingElement.closingTagEndIndex + 1)
        };
      }
    },
    _ret;
  for (var _iterator2 = _createForOfIteratorHelperLoose(tagNamesBeforeElement), _step2; !(_step2 = _iterator2()).done;) {
    _ret = _loop2();
    if (_ret) return _ret.v;
  }
  return prependMarkupInsideElement(xml, parentElement, elementMarkup);
}
var TAG_NAME_REG_EXP = new RegExp(getOpeningTagRegExpPattern());

// function findOrderOfElementsInsideParentElement(orderOfElements, parentElementTagName) {
// 	for (const element of orderOfElements) {
// 		if (Array.isArray(element)) {
// 			if (element[0] === parentElementTagName) {
// 				return element[1]
// 			}
// 			const recursionResult = findOrderOfElementsInsideParentElement(element[1], parentElementTagName)
// 			if (recursionResult) {
// 				return recursionResult
// 			}
// 		} else {
// 			// No order of child elements is specified for the `element`
// 			// so there's nothing to search for inside this `element`.
// 			// And if the `element` happens to be `parentElementTagName`,
// 			// there's no need to look any further at all
// 			// because it seems that no order of child elements is specified
// 			// for the `parentElementTagName`.
// 			if (element === parentElementTagName) {
// 				return
// 			}
// 		}
// 	}
// }

// This file is currently not used anywhere. It's just here for reference.

// The `.xlsx` document format is described in the official specification
// called "ECMA-376 Office Open XML File Formats":
// https://ecma-international.org/publications-and-standards/standards/ecma-376/
// https://en.wikipedia.org/wiki/Office_Open_XML
//
// They say that this standard — specifically, "Part 4" of it —
// includes XML "schemas" (`.xsd` files) which describe the predefined order of all XML elements.
//
// I personally didn't even bother checking because this whole "specification" thing
// already looks needlessly convoluted. Anyway, I asked Google's AI for
// "xlsx sheet.xml elements order" and it did output some kind of a list —
// a slightly different one depending on the exact wording — which I used
// as a loose reference and it seemed to fix those pesky "corrupt file" errors.
//
// For example, `CT_Worksheet` type describes a worksheet document ("sheet.xml"),
// and the corresponding "schema" for it is:
//
// <xs:complexType name="CT_Worksheet">
//   <xs:sequence>
//     <xs:element name="sheetPr" type="CT_SheetPr" minOccurs="0"/>
//     <xs:element name="dimension" type="CT_SheetDimension" minOccurs="0"/>
//     <xs:element name="sheetViews" type="CT_SheetViews" minOccurs="0"/>
//     <xs:element name="sheetFormatPr" type="CT_SheetFormatPr" minOccurs="0"/>
//     <xs:element name="cols" type="CT_Cols" minOccurs="0" maxOccurs="unbounded"/>
//     <xs:element name="sheetData" type="CT_SheetData"/>
//     <xs:element name="sheetProtection" type="CT_SheetProtection" minOccurs="0"/>
//     <xs:element name="mergeCells" type="CT_MergeCells" minOccurs="0"/>
//     <xs:element name="drawing" type="CT_Drawing" minOccurs="0"/>
//   </xs:sequence>
// </xs:complexType>
//
// There're "merged" versions of the specification on the internet
// in a form of 6000-some page documents in `.pdf` format,
// but the one I stumbled upon wasn't even searchable in for some weird reason.
//
// And the official specification seems to be hosted on some weird website
// that doesn't even support "online" browsing, and the download doesn't start.
// Who cares about this whole ancient corporate sh*t anyway.

// type TagName = string
// type OrderOfSiblings = Array<TagName | [TagName, OrderOfSiblings]>
// type FileName = 'xl/workbook.xml' | 'xl/styles.xml' | 'xl/worksheets/sheet{id}.xml'
// type OrderOfSiblingsByFile = Record<FileName, OrderOfSiblings>
// declare const orderOfSiblingsByFile: OrderOfSiblingsByFile
// export default orderOfSiblingsByFile

const ORDER_OF_SIBLINGS = {
  // This is what Google AI returned for a search query: "xlsx workbook.xml elements order".
  // They say, this order is defined in `CT_Workbook` schema of ECMA-376 specification.
  'xl/workbook.xml': [['workbook', ['workbookPr',
  // (Workbook Properties)
  'bookViews',
  // (Book Views)
  'sheets',
  // (List of sheets)
  'pivotCaches',
  // (If applicable)
  'definedNames',
  // (Named ranges)
  'calcPr' // (Calculation properties)
  ]]],
  // This is what Google AI returned for a search query: "xlsx styles.xml elements order".
  // They say, this order is defined in `CT_Stylesheet` schema of ECMA-376 specification.
  'xl/styles.xml': [['styleSheet', ['numFmts',
  // Defines custom number formats.
  'fonts',
  // Contains font definitions (font name, size, color).
  'fills',
  // Defines cell background colors/patterns.
  'borders',
  // Defines cell borders.
  'cellStyleXfs',
  // Master cell styles (usually style 0 is "Normal").
  'cellXfs',
  // Actual cell formatting definitions (<xf>) referenced by cells.
  'cellStyles',
  // Connects named styles to cellStyleXfs.
  'dxfs',
  // Differential formats (conditional formatting).
  'tableStyles' // Table-specific styles.
  ]]],
  // This is what Google AI returned for a search query: "xlsx sheet.xml elements order".
  // They say, this order is defined in `CT_Worksheet` schema of ECMA-376 specification.
  'xl/worksheets/sheet{id}.xml': [['worksheet', ['sheetPr',
  // Sheet properties (e.g., tab color, filter configurations).
  'dimension',
  // Defines the range of used cells (e.g., ref="A1:C10").
  'sheetViews',
  // View settings like freeze panes, zoom level, and whether the sheet is selected.
  'sheetFormatPr',
  // Default row height and column width properties.
  'cols',
  // Defines column-specific properties (width, hidden status).
  'sheetData',
  // (Required) The main container for cell data, rows, and values.
  'sheetCalcPr',
  // Calculation properties.
  'sheetProtection',
  // Sheet-level security and locked status.
  'protectedRanges',
  // Specific ranges that are protected.
  'scenarios',
  // Worksheet scenarios.
  'autoFilter',
  // Filter range definitions.
  'sortState',
  // Current sort information.
  'dataConsolidate',
  // Data consolidation settings.
  'customSheetViews',
  // Custom view settings.
  'mergeCells',
  // Defines ranges of merged cells.
  'phoneticPr',
  // Phonetic information properties.
  'conditionalFormatting',
  // Rules for formatting based on cell values.
  'dataValidations',
  // Data entry rules and dropdowns.
  'hyperlinks',
  // Links to external sites or other sheet locations.
  'printOptions',
  // Defines specific printing preferences, such as centering, gridlines, and headings.
  'pageMargins',
  // Defines the white space between the worksheet data and the edges of the printed page.
  'pageSetup',
  // Printing and layout settings.
  'headerFooter',
  // Sheet header and footer content.
  'rowBreaks',
  // Manual page breaks.
  'colBreaks',
  // Manual page breaks.
  'drawing',
  // References to graphics or charts (points to drawing.xml).
  'legacyDrawing',
  // References to legacy objects like comments or form controls.
  'picture',
  // Background image properties.
  'oleObjects',
  // Embedded OLE objects.
  'controls',
  // Form or ActiveX controls.
  'tableParts',
  // Links to defined Excel tables within the sheet.
  'extLst' // Extension list for future-proofing and custom metadata.
  ]]]
};

/**
 * Returns the order of siblings in a given `.xml` file inside given parent tag(s).
 * @param {string} fileName
 * @param {string[]} parentTagNames
 * @returns {string[]}
 */
function getOrderOfSiblings(fileName) {
  var orderOfSiblings = ORDER_OF_SIBLINGS[fileName];
  if (!orderOfSiblings) {
    // File not supported.
    // Return nothing.
    return;
  }
  for (var _len = arguments.length, parentTagNames = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    parentTagNames[_key - 1] = arguments[_key];
  }
  if (parentTagNames.length === 0) {
    throw new Error('At least one parent element tag name is required');
  }
  var _loop = function _loop() {
      var tagName = _parentTagNames[_i];
      var orderOfSiblingsMatchingElement = orderOfSiblings.find(function (element) {
        if (Array.isArray(element)) {
          return element[0] === tagName;
        } else {
          return element === tagName;
        }
      });
      if (!orderOfSiblingsMatchingElement) {
        // The element is not present in the pre-defined order of elements.
        // Return nothing.
        return {
          v: void 0
        };
      }
      if (Array.isArray(orderOfSiblingsMatchingElement)) {
        orderOfSiblings = orderOfSiblingsMatchingElement[1];
      } else {
        // The element doesn't specify any child elements.
        // Return nothing.
        return {
          v: void 0
        };
      }
    },
    _ret;
  for (var _i = 0, _parentTagNames = parentTagNames; _i < _parentTagNames.length; _i++) {
    _ret = _loop();
    if (_ret) return _ret.v;
  }
  if (orderOfSiblings) {
    // Convert element of `OrderOfSiblings` array to a `string`.
    return orderOfSiblings.map(function (element) {
      if (Array.isArray(element)) {
        return element[0];
      } else {
        return element;
      }
    });
  }
}

/**
 * Replaces an `element` that was found in `xml` using `findElement()` function with a given `replacementXml` markup.
 * @param {string} xml
 * @param {FoundElement} element
 * @param {string} replacementXml
 * @returns {string}
 */
function replaceElement(xml, element, replacementXml) {
  if (element.selfClosingTag) {
    return xml.slice(0, element.openingTagStartIndex) + replacementXml + xml.slice(element.openingTagEndIndex + 1);
  }
  return xml.slice(0, element.openingTagStartIndex) + replacementXml + xml.slice(element.closingTagEndIndex + 1);
}

/**
 * Finds a single element in valid XML markup within bounds of a given element that was previously found using `findElement()` function.
 * @param {string} xml — XML markup
 * @param {string} tagName — The name of the element to find
 * @param {object} enclosingElement — An enclosing element that was previously found using `findElement()` function.
 * @returns {object|undefined} — A found element, represented by an object with propeties: `{ openingTagStartIndex: number, openingTagEndIndex: number, openingTagAttributes: object, selfClosingTag?: boolean, closingTagStartIndex?: number, closingTagEndIndex?: number }`
 */
function findElementInsideElement(xml, tagName, enclosingElement) {
  var element = findElement(getMarkupInsideElement(xml, enclosingElement), tagName);
  if (element) {
    applyEnclosingElementOffset(element, enclosingElement);
    return element;
  }
}

export { appendMarkupInsideElement, convertDateToSerialNumber, sanitizeAttributeName as escapeAttributeName, sanitizeAttributeValue as escapeAttributeValue, sanitizeTextContent as escapeTextContent, findElement, findElementInsideElement, getCellAddress, getChildElements, getClosingTagMarkup, getMarkupInsideElement, getOpeningTagMarkup, getOrderOfSiblings, getSelfClosingTagMarkup, insertElementMarkupAccordingToOrderOfSiblings, prependMarkupInsideElement, replaceElement, sanitizeAttributeName, sanitizeAttributeValue, sanitizeTextContent, setMarkupInsideElement };
