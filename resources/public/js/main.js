if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":13}],3:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":36}],4:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],5:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":7}],6:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":6}],8:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],9:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],10:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],11:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":16}],12:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":27,"is-object":9}],13:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":25,"../vnode/is-vnode.js":28,"../vnode/is-vtext.js":29,"../vnode/is-widget.js":30,"./apply-properties":12,"global/document":8}],14:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],15:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var render = require("./create-element")
var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":30,"../vnode/vpatch.js":33,"./apply-properties":12,"./create-element":13,"./update-widget":17}],16:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches) {
    return patchRecursive(rootNode, patches)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions) {
        renderOptions = { patch: patchRecursive }
        if (ownerDocument !== document) {
            renderOptions.document = ownerDocument
        }
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./dom-index":14,"./patch-op":15,"global/document":8,"x-is-array":10}],17:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":30}],18:[function(require,module,exports){
'use strict';

module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';

},{}],19:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":5}],20:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],21:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":26,"../vnode/is-vhook":27,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vnode.js":32,"../vnode/vtext.js":34,"./hooks/ev-hook.js":19,"./hooks/soft-set-hook.js":20,"./parse-tag.js":22,"x-is-array":10}],22:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":4}],23:[function(require,module,exports){
'use strict';

var DEFAULT_NAMESPACE = null;
var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

// http://www.w3.org/TR/SVGTiny12/attributeTable.html
// http://www.w3.org/TR/SVG/attindex.html
var SVG_PROPERTIES = {
    'about': DEFAULT_NAMESPACE,
    'accent-height': DEFAULT_NAMESPACE,
    'accumulate': DEFAULT_NAMESPACE,
    'additive': DEFAULT_NAMESPACE,
    'alignment-baseline': DEFAULT_NAMESPACE,
    'alphabetic': DEFAULT_NAMESPACE,
    'amplitude': DEFAULT_NAMESPACE,
    'arabic-form': DEFAULT_NAMESPACE,
    'ascent': DEFAULT_NAMESPACE,
    'attributeName': DEFAULT_NAMESPACE,
    'attributeType': DEFAULT_NAMESPACE,
    'azimuth': DEFAULT_NAMESPACE,
    'bandwidth': DEFAULT_NAMESPACE,
    'baseFrequency': DEFAULT_NAMESPACE,
    'baseProfile': DEFAULT_NAMESPACE,
    'baseline-shift': DEFAULT_NAMESPACE,
    'bbox': DEFAULT_NAMESPACE,
    'begin': DEFAULT_NAMESPACE,
    'bias': DEFAULT_NAMESPACE,
    'by': DEFAULT_NAMESPACE,
    'calcMode': DEFAULT_NAMESPACE,
    'cap-height': DEFAULT_NAMESPACE,
    'class': DEFAULT_NAMESPACE,
    'clip': DEFAULT_NAMESPACE,
    'clip-path': DEFAULT_NAMESPACE,
    'clip-rule': DEFAULT_NAMESPACE,
    'clipPathUnits': DEFAULT_NAMESPACE,
    'color': DEFAULT_NAMESPACE,
    'color-interpolation': DEFAULT_NAMESPACE,
    'color-interpolation-filters': DEFAULT_NAMESPACE,
    'color-profile': DEFAULT_NAMESPACE,
    'color-rendering': DEFAULT_NAMESPACE,
    'content': DEFAULT_NAMESPACE,
    'contentScriptType': DEFAULT_NAMESPACE,
    'contentStyleType': DEFAULT_NAMESPACE,
    'cursor': DEFAULT_NAMESPACE,
    'cx': DEFAULT_NAMESPACE,
    'cy': DEFAULT_NAMESPACE,
    'd': DEFAULT_NAMESPACE,
    'datatype': DEFAULT_NAMESPACE,
    'defaultAction': DEFAULT_NAMESPACE,
    'descent': DEFAULT_NAMESPACE,
    'diffuseConstant': DEFAULT_NAMESPACE,
    'direction': DEFAULT_NAMESPACE,
    'display': DEFAULT_NAMESPACE,
    'divisor': DEFAULT_NAMESPACE,
    'dominant-baseline': DEFAULT_NAMESPACE,
    'dur': DEFAULT_NAMESPACE,
    'dx': DEFAULT_NAMESPACE,
    'dy': DEFAULT_NAMESPACE,
    'edgeMode': DEFAULT_NAMESPACE,
    'editable': DEFAULT_NAMESPACE,
    'elevation': DEFAULT_NAMESPACE,
    'enable-background': DEFAULT_NAMESPACE,
    'end': DEFAULT_NAMESPACE,
    'ev:event': EV_NAMESPACE,
    'event': DEFAULT_NAMESPACE,
    'exponent': DEFAULT_NAMESPACE,
    'externalResourcesRequired': DEFAULT_NAMESPACE,
    'fill': DEFAULT_NAMESPACE,
    'fill-opacity': DEFAULT_NAMESPACE,
    'fill-rule': DEFAULT_NAMESPACE,
    'filter': DEFAULT_NAMESPACE,
    'filterRes': DEFAULT_NAMESPACE,
    'filterUnits': DEFAULT_NAMESPACE,
    'flood-color': DEFAULT_NAMESPACE,
    'flood-opacity': DEFAULT_NAMESPACE,
    'focusHighlight': DEFAULT_NAMESPACE,
    'focusable': DEFAULT_NAMESPACE,
    'font-family': DEFAULT_NAMESPACE,
    'font-size': DEFAULT_NAMESPACE,
    'font-size-adjust': DEFAULT_NAMESPACE,
    'font-stretch': DEFAULT_NAMESPACE,
    'font-style': DEFAULT_NAMESPACE,
    'font-variant': DEFAULT_NAMESPACE,
    'font-weight': DEFAULT_NAMESPACE,
    'format': DEFAULT_NAMESPACE,
    'from': DEFAULT_NAMESPACE,
    'fx': DEFAULT_NAMESPACE,
    'fy': DEFAULT_NAMESPACE,
    'g1': DEFAULT_NAMESPACE,
    'g2': DEFAULT_NAMESPACE,
    'glyph-name': DEFAULT_NAMESPACE,
    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
    'glyphRef': DEFAULT_NAMESPACE,
    'gradientTransform': DEFAULT_NAMESPACE,
    'gradientUnits': DEFAULT_NAMESPACE,
    'handler': DEFAULT_NAMESPACE,
    'hanging': DEFAULT_NAMESPACE,
    'height': DEFAULT_NAMESPACE,
    'horiz-adv-x': DEFAULT_NAMESPACE,
    'horiz-origin-x': DEFAULT_NAMESPACE,
    'horiz-origin-y': DEFAULT_NAMESPACE,
    'id': DEFAULT_NAMESPACE,
    'ideographic': DEFAULT_NAMESPACE,
    'image-rendering': DEFAULT_NAMESPACE,
    'in': DEFAULT_NAMESPACE,
    'in2': DEFAULT_NAMESPACE,
    'initialVisibility': DEFAULT_NAMESPACE,
    'intercept': DEFAULT_NAMESPACE,
    'k': DEFAULT_NAMESPACE,
    'k1': DEFAULT_NAMESPACE,
    'k2': DEFAULT_NAMESPACE,
    'k3': DEFAULT_NAMESPACE,
    'k4': DEFAULT_NAMESPACE,
    'kernelMatrix': DEFAULT_NAMESPACE,
    'kernelUnitLength': DEFAULT_NAMESPACE,
    'kerning': DEFAULT_NAMESPACE,
    'keyPoints': DEFAULT_NAMESPACE,
    'keySplines': DEFAULT_NAMESPACE,
    'keyTimes': DEFAULT_NAMESPACE,
    'lang': DEFAULT_NAMESPACE,
    'lengthAdjust': DEFAULT_NAMESPACE,
    'letter-spacing': DEFAULT_NAMESPACE,
    'lighting-color': DEFAULT_NAMESPACE,
    'limitingConeAngle': DEFAULT_NAMESPACE,
    'local': DEFAULT_NAMESPACE,
    'marker-end': DEFAULT_NAMESPACE,
    'marker-mid': DEFAULT_NAMESPACE,
    'marker-start': DEFAULT_NAMESPACE,
    'markerHeight': DEFAULT_NAMESPACE,
    'markerUnits': DEFAULT_NAMESPACE,
    'markerWidth': DEFAULT_NAMESPACE,
    'mask': DEFAULT_NAMESPACE,
    'maskContentUnits': DEFAULT_NAMESPACE,
    'maskUnits': DEFAULT_NAMESPACE,
    'mathematical': DEFAULT_NAMESPACE,
    'max': DEFAULT_NAMESPACE,
    'media': DEFAULT_NAMESPACE,
    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
    'mediaContentEncodings': DEFAULT_NAMESPACE,
    'mediaSize': DEFAULT_NAMESPACE,
    'mediaTime': DEFAULT_NAMESPACE,
    'method': DEFAULT_NAMESPACE,
    'min': DEFAULT_NAMESPACE,
    'mode': DEFAULT_NAMESPACE,
    'name': DEFAULT_NAMESPACE,
    'nav-down': DEFAULT_NAMESPACE,
    'nav-down-left': DEFAULT_NAMESPACE,
    'nav-down-right': DEFAULT_NAMESPACE,
    'nav-left': DEFAULT_NAMESPACE,
    'nav-next': DEFAULT_NAMESPACE,
    'nav-prev': DEFAULT_NAMESPACE,
    'nav-right': DEFAULT_NAMESPACE,
    'nav-up': DEFAULT_NAMESPACE,
    'nav-up-left': DEFAULT_NAMESPACE,
    'nav-up-right': DEFAULT_NAMESPACE,
    'numOctaves': DEFAULT_NAMESPACE,
    'observer': DEFAULT_NAMESPACE,
    'offset': DEFAULT_NAMESPACE,
    'opacity': DEFAULT_NAMESPACE,
    'operator': DEFAULT_NAMESPACE,
    'order': DEFAULT_NAMESPACE,
    'orient': DEFAULT_NAMESPACE,
    'orientation': DEFAULT_NAMESPACE,
    'origin': DEFAULT_NAMESPACE,
    'overflow': DEFAULT_NAMESPACE,
    'overlay': DEFAULT_NAMESPACE,
    'overline-position': DEFAULT_NAMESPACE,
    'overline-thickness': DEFAULT_NAMESPACE,
    'panose-1': DEFAULT_NAMESPACE,
    'path': DEFAULT_NAMESPACE,
    'pathLength': DEFAULT_NAMESPACE,
    'patternContentUnits': DEFAULT_NAMESPACE,
    'patternTransform': DEFAULT_NAMESPACE,
    'patternUnits': DEFAULT_NAMESPACE,
    'phase': DEFAULT_NAMESPACE,
    'playbackOrder': DEFAULT_NAMESPACE,
    'pointer-events': DEFAULT_NAMESPACE,
    'points': DEFAULT_NAMESPACE,
    'pointsAtX': DEFAULT_NAMESPACE,
    'pointsAtY': DEFAULT_NAMESPACE,
    'pointsAtZ': DEFAULT_NAMESPACE,
    'preserveAlpha': DEFAULT_NAMESPACE,
    'preserveAspectRatio': DEFAULT_NAMESPACE,
    'primitiveUnits': DEFAULT_NAMESPACE,
    'propagate': DEFAULT_NAMESPACE,
    'property': DEFAULT_NAMESPACE,
    'r': DEFAULT_NAMESPACE,
    'radius': DEFAULT_NAMESPACE,
    'refX': DEFAULT_NAMESPACE,
    'refY': DEFAULT_NAMESPACE,
    'rel': DEFAULT_NAMESPACE,
    'rendering-intent': DEFAULT_NAMESPACE,
    'repeatCount': DEFAULT_NAMESPACE,
    'repeatDur': DEFAULT_NAMESPACE,
    'requiredExtensions': DEFAULT_NAMESPACE,
    'requiredFeatures': DEFAULT_NAMESPACE,
    'requiredFonts': DEFAULT_NAMESPACE,
    'requiredFormats': DEFAULT_NAMESPACE,
    'resource': DEFAULT_NAMESPACE,
    'restart': DEFAULT_NAMESPACE,
    'result': DEFAULT_NAMESPACE,
    'rev': DEFAULT_NAMESPACE,
    'role': DEFAULT_NAMESPACE,
    'rotate': DEFAULT_NAMESPACE,
    'rx': DEFAULT_NAMESPACE,
    'ry': DEFAULT_NAMESPACE,
    'scale': DEFAULT_NAMESPACE,
    'seed': DEFAULT_NAMESPACE,
    'shape-rendering': DEFAULT_NAMESPACE,
    'slope': DEFAULT_NAMESPACE,
    'snapshotTime': DEFAULT_NAMESPACE,
    'spacing': DEFAULT_NAMESPACE,
    'specularConstant': DEFAULT_NAMESPACE,
    'specularExponent': DEFAULT_NAMESPACE,
    'spreadMethod': DEFAULT_NAMESPACE,
    'startOffset': DEFAULT_NAMESPACE,
    'stdDeviation': DEFAULT_NAMESPACE,
    'stemh': DEFAULT_NAMESPACE,
    'stemv': DEFAULT_NAMESPACE,
    'stitchTiles': DEFAULT_NAMESPACE,
    'stop-color': DEFAULT_NAMESPACE,
    'stop-opacity': DEFAULT_NAMESPACE,
    'strikethrough-position': DEFAULT_NAMESPACE,
    'strikethrough-thickness': DEFAULT_NAMESPACE,
    'string': DEFAULT_NAMESPACE,
    'stroke': DEFAULT_NAMESPACE,
    'stroke-dasharray': DEFAULT_NAMESPACE,
    'stroke-dashoffset': DEFAULT_NAMESPACE,
    'stroke-linecap': DEFAULT_NAMESPACE,
    'stroke-linejoin': DEFAULT_NAMESPACE,
    'stroke-miterlimit': DEFAULT_NAMESPACE,
    'stroke-opacity': DEFAULT_NAMESPACE,
    'stroke-width': DEFAULT_NAMESPACE,
    'surfaceScale': DEFAULT_NAMESPACE,
    'syncBehavior': DEFAULT_NAMESPACE,
    'syncBehaviorDefault': DEFAULT_NAMESPACE,
    'syncMaster': DEFAULT_NAMESPACE,
    'syncTolerance': DEFAULT_NAMESPACE,
    'syncToleranceDefault': DEFAULT_NAMESPACE,
    'systemLanguage': DEFAULT_NAMESPACE,
    'tableValues': DEFAULT_NAMESPACE,
    'target': DEFAULT_NAMESPACE,
    'targetX': DEFAULT_NAMESPACE,
    'targetY': DEFAULT_NAMESPACE,
    'text-anchor': DEFAULT_NAMESPACE,
    'text-decoration': DEFAULT_NAMESPACE,
    'text-rendering': DEFAULT_NAMESPACE,
    'textLength': DEFAULT_NAMESPACE,
    'timelineBegin': DEFAULT_NAMESPACE,
    'title': DEFAULT_NAMESPACE,
    'to': DEFAULT_NAMESPACE,
    'transform': DEFAULT_NAMESPACE,
    'transformBehavior': DEFAULT_NAMESPACE,
    'type': DEFAULT_NAMESPACE,
    'typeof': DEFAULT_NAMESPACE,
    'u1': DEFAULT_NAMESPACE,
    'u2': DEFAULT_NAMESPACE,
    'underline-position': DEFAULT_NAMESPACE,
    'underline-thickness': DEFAULT_NAMESPACE,
    'unicode': DEFAULT_NAMESPACE,
    'unicode-bidi': DEFAULT_NAMESPACE,
    'unicode-range': DEFAULT_NAMESPACE,
    'units-per-em': DEFAULT_NAMESPACE,
    'v-alphabetic': DEFAULT_NAMESPACE,
    'v-hanging': DEFAULT_NAMESPACE,
    'v-ideographic': DEFAULT_NAMESPACE,
    'v-mathematical': DEFAULT_NAMESPACE,
    'values': DEFAULT_NAMESPACE,
    'version': DEFAULT_NAMESPACE,
    'vert-adv-y': DEFAULT_NAMESPACE,
    'vert-origin-x': DEFAULT_NAMESPACE,
    'vert-origin-y': DEFAULT_NAMESPACE,
    'viewBox': DEFAULT_NAMESPACE,
    'viewTarget': DEFAULT_NAMESPACE,
    'visibility': DEFAULT_NAMESPACE,
    'width': DEFAULT_NAMESPACE,
    'widths': DEFAULT_NAMESPACE,
    'word-spacing': DEFAULT_NAMESPACE,
    'writing-mode': DEFAULT_NAMESPACE,
    'x': DEFAULT_NAMESPACE,
    'x-height': DEFAULT_NAMESPACE,
    'x1': DEFAULT_NAMESPACE,
    'x2': DEFAULT_NAMESPACE,
    'xChannelSelector': DEFAULT_NAMESPACE,
    'xlink:actuate': XLINK_NAMESPACE,
    'xlink:arcrole': XLINK_NAMESPACE,
    'xlink:href': XLINK_NAMESPACE,
    'xlink:role': XLINK_NAMESPACE,
    'xlink:show': XLINK_NAMESPACE,
    'xlink:title': XLINK_NAMESPACE,
    'xlink:type': XLINK_NAMESPACE,
    'xml:base': XML_NAMESPACE,
    'xml:id': XML_NAMESPACE,
    'xml:lang': XML_NAMESPACE,
    'xml:space': XML_NAMESPACE,
    'y': DEFAULT_NAMESPACE,
    'y1': DEFAULT_NAMESPACE,
    'y2': DEFAULT_NAMESPACE,
    'yChannelSelector': DEFAULT_NAMESPACE,
    'z': DEFAULT_NAMESPACE,
    'zoomAndPan': DEFAULT_NAMESPACE
};

module.exports = SVGAttributeNamespace;

function SVGAttributeNamespace(value) {
  if (SVG_PROPERTIES.hasOwnProperty(value)) {
    return SVG_PROPERTIES[value];
  }
}

},{}],24:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var h = require('./index.js');


var SVGAttributeNamespace = require('./svg-attribute-namespace');
var attributeHook = require('./hooks/attribute-hook');

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

module.exports = svg;

function svg(tagName, properties, children) {
    if (!children && isChildren(properties)) {
        children = properties;
        properties = {};
    }

    properties = properties || {};

    // set namespace for svg
    properties.namespace = SVG_NAMESPACE;

    var attributes = properties.attributes || (properties.attributes = {});

    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }

        var namespace = SVGAttributeNamespace(key);

        if (namespace === undefined) { // not a svg attribute
            continue;
        }

        var value = properties[key];

        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        ) {
            continue;
        }

        if (namespace !== null) { // namespaced attribute
            properties[key] = attributeHook(namespace, value);
            continue;
        }

        attributes[key] = value
        properties[key] = undefined
    }

    return h(tagName, properties, children);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x);
}

},{"./hooks/attribute-hook":18,"./index.js":21,"./svg-attribute-namespace":23,"x-is-array":10}],25:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":26,"./is-vnode":28,"./is-vtext":29,"./is-widget":30}],26:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],27:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],28:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":31}],29:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":31}],30:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],31:[function(require,module,exports){
module.exports = "2"

},{}],32:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":26,"./is-vhook":27,"./is-vnode":28,"./is-widget":30,"./version":31}],33:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":31}],34:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":31}],35:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":27,"is-object":9}],36:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free,     // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":25,"../vnode/is-thunk":26,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vpatch":33,"./diff-props":35,"x-is-array":10}],37:[function(require,module,exports){
return VDOM = {
  diff: require("virtual-dom/diff"),
  patch: require("virtual-dom/patch"),
  create: require("virtual-dom/create-element"),
  VHtml: require("virtual-dom/vnode/vnode"),
  VText: require("virtual-dom/vnode/vtext"),
  VSvg: require("virtual-dom/virtual-hyperscript/svg")
}

},{"virtual-dom/create-element":2,"virtual-dom/diff":3,"virtual-dom/patch":11,"virtual-dom/virtual-hyperscript/svg":24,"virtual-dom/vnode/vnode":32,"virtual-dom/vnode/vtext":34}]},{},[37]);

var g,aa=this;
function u(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b}var ba="closure_uid_"+(1E9*Math.random()>>>0),ca=0;function ea(a,b,c){return a.call.apply(a.bind,arguments)}function fa(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ha(a,b,c){ha=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ea:fa;return ha.apply(null,arguments)};function ia(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function ka(a,b){null!=a&&this.append.apply(this,arguments)}g=ka.prototype;g.Qa="";g.set=function(a){this.Qa=""+a};g.append=function(a,b,c){this.Qa+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Qa+=arguments[d];return this};g.clear=function(){this.Qa=""};g.toString=function(){return this.Qa};function ma(a,b){return a>b?1:a<b?-1:0};var na={},qa;if("undefined"===typeof sa)var sa=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof ta)var ta=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var ua=null;if("undefined"===typeof va)var va=null;function wa(){return new xa(null,5,[ya,!0,za,!0,Aa,!1,Ba,!1,Ca,null],null)}Ea;function y(a){return null!=a&&!1!==a}Fa;A;function Ga(a){return null==a}function Ja(a){return a instanceof Array}
function Ka(a){return null==a?!0:!1===a?!0:!1}function B(a,b){return a[u(null==b?null:b)]?!0:a._?!0:!1}function C(a,b){var c=null==b?null:b.constructor,c=y(y(c)?c.Ib:c)?c.pb:u(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function La(a){var b=a.pb;return y(b)?b:""+E(a)}var Ma="undefined"!==typeof Symbol&&"function"===u(Symbol)?Symbol.iterator:"@@iterator";function Oa(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}F;Pa;
var Ea=function Ea(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ea.a(arguments[0]);case 2:return Ea.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Ea.a=function(a){return Ea.b(null,a)};Ea.b=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Pa.c?Pa.c(c,d,b):Pa.call(null,c,d,b)};Ea.A=2;function Qa(){}
var Ra=function Ra(b){if(null!=b&&null!=b.W)return b.W(b);var c=Ra[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ra._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ICounted.-count",b);},Sa=function Sa(b){if(null!=b&&null!=b.X)return b.X(b);var c=Sa[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Sa._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEmptyableCollection.-empty",b);};function Ta(){}
var Ua=function Ua(b,c){if(null!=b&&null!=b.U)return b.U(b,c);var d=Ua[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ua._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("ICollection.-conj",b);};function Va(){}
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return G.b(arguments[0],arguments[1]);case 3:return G.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
G.b=function(a,b){if(null!=a&&null!=a.V)return a.V(a,b);var c=G[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=G._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("IIndexed.-nth",a);};G.c=function(a,b,c){if(null!=a&&null!=a.xa)return a.xa(a,b,c);var d=G[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=G._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IIndexed.-nth",a);};G.A=3;function Wa(){}
var Xa=function Xa(b){if(null!=b&&null!=b.ba)return b.ba(b);var c=Xa[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Xa._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeq.-first",b);},Ya=function Ya(b){if(null!=b&&null!=b.ra)return b.ra(b);var c=Ya[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ya._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeq.-rest",b);};function Za(){}function ab(){}
var bb=function bb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return bb.b(arguments[0],arguments[1]);case 3:return bb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
bb.b=function(a,b){if(null!=a&&null!=a.J)return a.J(a,b);var c=bb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=bb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("ILookup.-lookup",a);};bb.c=function(a,b,c){if(null!=a&&null!=a.G)return a.G(a,b,c);var d=bb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=bb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ILookup.-lookup",a);};bb.A=3;
var cb=function cb(b,c){if(null!=b&&null!=b.Db)return b.Db(b,c);var d=cb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=cb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IAssociative.-contains-key?",b);},db=function db(b,c,d){if(null!=b&&null!=b.Na)return b.Na(b,c,d);var e=db[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=db._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IAssociative.-assoc",b);};function eb(){}
var fb=function fb(b,c){if(null!=b&&null!=b.xb)return b.xb(b,c);var d=fb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=fb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IMap.-dissoc",b);};function gb(){}
var hb=function hb(b){if(null!=b&&null!=b.ib)return b.ib(b);var c=hb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=hb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMapEntry.-key",b);},jb=function jb(b){if(null!=b&&null!=b.jb)return b.jb(b);var c=jb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=jb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMapEntry.-val",b);};function kb(){}function lb(){}
var mb=function mb(b,c,d){if(null!=b&&null!=b.Ra)return b.Ra(b,c,d);var e=mb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=mb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IVector.-assoc-n",b);},nb=function nb(b){if(null!=b&&null!=b.wb)return b.wb(b);var c=nb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=nb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IDeref.-deref",b);};function ob(){}
var pb=function pb(b){if(null!=b&&null!=b.O)return b.O(b);var c=pb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=pb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMeta.-meta",b);},qb=function qb(b,c){if(null!=b&&null!=b.P)return b.P(b,c);var d=qb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=qb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IWithMeta.-with-meta",b);};function rb(){}
var sb=function sb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return sb.b(arguments[0],arguments[1]);case 3:return sb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
sb.b=function(a,b){if(null!=a&&null!=a.$)return a.$(a,b);var c=sb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=sb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("IReduce.-reduce",a);};sb.c=function(a,b,c){if(null!=a&&null!=a.aa)return a.aa(a,b,c);var d=sb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=sb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IReduce.-reduce",a);};sb.A=3;
var tb=function tb(b,c){if(null!=b&&null!=b.w)return b.w(b,c);var d=tb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=tb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IEquiv.-equiv",b);},ub=function ub(b){if(null!=b&&null!=b.N)return b.N(b);var c=ub[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ub._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IHash.-hash",b);};function wb(){}
var xb=function xb(b){if(null!=b&&null!=b.T)return b.T(b);var c=xb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=xb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeqable.-seq",b);};function yb(){}function zb(){}
var Ab=function Ab(b,c){if(null!=b&&null!=b.Sb)return b.Sb(0,c);var d=Ab[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ab._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IWriter.-write",b);},Bb=function Bb(b,c,d){if(null!=b&&null!=b.K)return b.K(b,c,d);var e=Bb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Bb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IPrintWithWriter.-pr-writer",b);},Cb=function Cb(b,c,d){if(null!=b&&
null!=b.Rb)return b.Rb(0,c,d);var e=Cb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Cb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-notify-watches",b);},Db=function Db(b,c,d){if(null!=b&&null!=b.Qb)return b.Qb(0,c,d);var e=Db[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Db._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-add-watch",b);},Eb=function Eb(b){if(null!=b&&null!=b.Xa)return b.Xa(b);
var c=Eb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Eb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEditableCollection.-as-transient",b);},Fb=function Fb(b,c){if(null!=b&&null!=b.nb)return b.nb(b,c);var d=Fb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Fb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("ITransientCollection.-conj!",b);},Gb=function Gb(b){if(null!=b&&null!=b.ob)return b.ob(b);var c=Gb[u(null==b?null:b)];if(null!=c)return c.a?
c.a(b):c.call(null,b);c=Gb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ITransientCollection.-persistent!",b);},Hb=function Hb(b,c,d){if(null!=b&&null!=b.mb)return b.mb(b,c,d);var e=Hb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Hb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientAssociative.-assoc!",b);},Ib=function Ib(b,c,d){if(null!=b&&null!=b.Pb)return b.Pb(0,c,d);var e=Ib[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,
b,c,d);e=Ib._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientVector.-assoc-n!",b);};function Jb(){}
var Kb=function Kb(b,c){if(null!=b&&null!=b.Wa)return b.Wa(b,c);var d=Kb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Kb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IComparable.-compare",b);},Lb=function Lb(b){if(null!=b&&null!=b.Mb)return b.Mb();var c=Lb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Lb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunk.-drop-first",b);},Mb=function Mb(b){if(null!=b&&null!=b.Fb)return b.Fb(b);var c=
Mb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Mb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedSeq.-chunked-first",b);},Nb=function Nb(b){if(null!=b&&null!=b.Gb)return b.Gb(b);var c=Nb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Nb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedSeq.-chunked-rest",b);},Pb=function Pb(b){if(null!=b&&null!=b.Eb)return b.Eb(b);var c=Pb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,
b);c=Pb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedNext.-chunked-next",b);},Qb=function Qb(b){if(null!=b&&null!=b.kb)return b.kb(b);var c=Qb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Qb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("INamed.-name",b);},Rb=function Rb(b){if(null!=b&&null!=b.lb)return b.lb(b);var c=Rb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Rb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("INamed.-namespace",
b);},Sb=function Sb(b,c){if(null!=b&&null!=b.ec)return b.ec(b,c);var d=Sb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Sb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IReset.-reset!",b);},Tb=function Tb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Tb.b(arguments[0],arguments[1]);case 3:return Tb.c(arguments[0],arguments[1],arguments[2]);case 4:return Tb.u(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return Tb.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Tb.b=function(a,b){if(null!=a&&null!=a.gc)return a.gc(a,b);var c=Tb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=Tb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("ISwap.-swap!",a);};
Tb.c=function(a,b,c){if(null!=a&&null!=a.hc)return a.hc(a,b,c);var d=Tb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Tb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ISwap.-swap!",a);};Tb.u=function(a,b,c,d){if(null!=a&&null!=a.ic)return a.ic(a,b,c,d);var e=Tb[u(null==a?null:a)];if(null!=e)return e.u?e.u(a,b,c,d):e.call(null,a,b,c,d);e=Tb._;if(null!=e)return e.u?e.u(a,b,c,d):e.call(null,a,b,c,d);throw C("ISwap.-swap!",a);};
Tb.C=function(a,b,c,d,e){if(null!=a&&null!=a.jc)return a.jc(a,b,c,d,e);var f=Tb[u(null==a?null:a)];if(null!=f)return f.C?f.C(a,b,c,d,e):f.call(null,a,b,c,d,e);f=Tb._;if(null!=f)return f.C?f.C(a,b,c,d,e):f.call(null,a,b,c,d,e);throw C("ISwap.-swap!",a);};Tb.A=5;var Ub=function Ub(b){if(null!=b&&null!=b.Ba)return b.Ba(b);var c=Ub[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ub._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IIterable.-iterator",b);};
function Vb(a){this.uc=a;this.i=1073741824;this.B=0}Vb.prototype.Sb=function(a,b){return this.uc.append(b)};function Wb(a){var b=new ka;a.K(null,new Vb(b),wa());return""+E(b)}var Xb="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function Yb(a){a=Xb(a|0,-862048943);return Xb(a<<15|a>>>-15,461845907)}
function Zb(a,b){var c=(a|0)^(b|0);return Xb(c<<13|c>>>-13,5)+-430675100|0}function ac(a,b){var c=(a|0)^b,c=Xb(c^c>>>16,-2048144789),c=Xb(c^c>>>13,-1028477387);return c^c>>>16}function bc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=Zb(c,Yb(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^Yb(a.charCodeAt(a.length-1)):b;return ac(b,Xb(2,a.length))}cc;dc;ec;fc;var gc={},hc=0;
function ic(a){255<hc&&(gc={},hc=0);var b=gc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=Xb(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;gc[a]=b;hc+=1}return a=b}function jc(a){null!=a&&(a.i&4194304||a.zc)?a=a.N(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=ic(a),0!==a&&(a=Yb(a),a=Zb(0,a),a=ac(a,4))):a=a instanceof Date?a.valueOf():null==a?0:ub(a);return a}
function kc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Fa(a,b){return b instanceof a}function lc(a,b){if(a.Ha===b.Ha)return 0;var c=Ka(a.ta);if(y(c?b.ta:c))return-1;if(y(a.ta)){if(Ka(b.ta))return 1;c=ma(a.ta,b.ta);return 0===c?ma(a.name,b.name):c}return ma(a.name,b.name)}I;function dc(a,b,c,d,e){this.ta=a;this.name=b;this.Ha=c;this.Va=d;this.wa=e;this.i=2154168321;this.B=4096}g=dc.prototype;g.toString=function(){return this.Ha};g.equiv=function(a){return this.w(null,a)};
g.w=function(a,b){return b instanceof dc?this.Ha===b.Ha:!1};g.call=function(){function a(a,b,c){return I.c?I.c(b,this,c):I.call(null,b,this,c)}function b(a,b){return I.b?I.b(b,this):I.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};
g.a=function(a){return I.b?I.b(a,this):I.call(null,a,this)};g.b=function(a,b){return I.c?I.c(a,this,b):I.call(null,a,this,b)};g.O=function(){return this.wa};g.P=function(a,b){return new dc(this.ta,this.name,this.Ha,this.Va,b)};g.N=function(){var a=this.Va;return null!=a?a:this.Va=a=kc(bc(this.name),ic(this.ta))};g.kb=function(){return this.name};g.lb=function(){return this.ta};g.K=function(a,b){return Ab(b,this.Ha)};
var mc=function mc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return mc.a(arguments[0]);case 2:return mc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};mc.a=function(a){if(a instanceof dc)return a;var b=a.indexOf("/");return-1===b?mc.b(null,a):mc.b(a.substring(0,b),a.substring(b+1,a.length))};mc.b=function(a,b){var c=null!=a?[E(a),E("/"),E(b)].join(""):b;return new dc(a,b,c,null,null)};
mc.A=2;nc;oc;pc;function J(a){if(null==a)return null;if(null!=a&&(a.i&8388608||a.fc))return a.T(null);if(Ja(a)||"string"===typeof a)return 0===a.length?null:new pc(a,0);if(B(wb,a))return xb(a);throw Error([E(a),E(" is not ISeqable")].join(""));}function K(a){if(null==a)return null;if(null!=a&&(a.i&64||a.Ka))return a.ba(null);a=J(a);return null==a?null:Xa(a)}function rc(a){return null!=a?null!=a&&(a.i&64||a.Ka)?a.ra(null):(a=J(a))?Ya(a):L:L}
function M(a){return null==a?null:null!=a&&(a.i&128||a.yb)?a.qa(null):J(rc(a))}var ec=function ec(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ec.a(arguments[0]);case 2:return ec.b(arguments[0],arguments[1]);default:return ec.m(arguments[0],arguments[1],new pc(c.slice(2),0))}};ec.a=function(){return!0};ec.b=function(a,b){return null==a?null==b:a===b||tb(a,b)};
ec.m=function(a,b,c){for(;;)if(ec.b(a,b))if(M(c))a=b,b=K(c),c=M(c);else return ec.b(b,K(c));else return!1};ec.H=function(a){var b=K(a),c=M(a);a=K(c);c=M(c);return ec.m(b,a,c)};ec.A=2;function sc(a){this.D=a}sc.prototype.next=function(){if(null!=this.D){var a=K(this.D);this.D=M(this.D);return{value:a,done:!1}}return{value:null,done:!0}};function tc(a){return new sc(J(a))}uc;function vc(a,b,c){this.value=a;this.ab=b;this.Ab=c;this.i=8388672;this.B=0}vc.prototype.T=function(){return this};
vc.prototype.ba=function(){return this.value};vc.prototype.ra=function(){null==this.Ab&&(this.Ab=uc.a?uc.a(this.ab):uc.call(null,this.ab));return this.Ab};function uc(a){var b=a.next();return y(b.done)?L:new vc(b.value,a,null)}function wc(a,b){var c=Yb(a),c=Zb(0,c);return ac(c,b)}function xc(a){var b=0,c=1;for(a=J(a);;)if(null!=a)b+=1,c=Xb(31,c)+jc(K(a))|0,a=M(a);else return wc(c,b)}var yc=wc(1,0);function zc(a){var b=0,c=0;for(a=J(a);;)if(null!=a)b+=1,c=c+jc(K(a))|0,a=M(a);else return wc(c,b)}
var Ac=wc(0,0);Bc;cc;Cc;Qa["null"]=!0;Ra["null"]=function(){return 0};Date.prototype.w=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.gb=!0;Date.prototype.Wa=function(a,b){if(b instanceof Date)return ma(this.valueOf(),b.valueOf());throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};tb.number=function(a,b){return a===b};Dc;ob["function"]=!0;pb["function"]=function(){return null};ub._=function(a){return a[ba]||(a[ba]=++ca)};
function Ec(a){return a+1}N;function Fc(a){this.M=a;this.i=32768;this.B=0}Fc.prototype.wb=function(){return this.M};function Gc(a){return a instanceof Fc}function N(a){return nb(a)}function Hc(a,b){var c=Ra(a);if(0===c)return b.v?b.v():b.call(null);for(var d=G.b(a,0),e=1;;)if(e<c){var f=G.b(a,e),d=b.b?b.b(d,f):b.call(null,d,f);if(Gc(d))return nb(d);e+=1}else return d}
function Ic(a,b,c){var d=Ra(a),e=c;for(c=0;;)if(c<d){var f=G.b(a,c),e=b.b?b.b(e,f):b.call(null,e,f);if(Gc(e))return nb(e);c+=1}else return e}function Jc(a,b){var c=a.length;if(0===a.length)return b.v?b.v():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.b?b.b(d,f):b.call(null,d,f);if(Gc(d))return nb(d);e+=1}else return d}function Kc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.b?b.b(e,f):b.call(null,e,f);if(Gc(e))return nb(e);c+=1}else return e}
function Lc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.b?b.b(c,f):b.call(null,c,f);if(Gc(c))return nb(c);d+=1}else return c}Mc;O;Nc;Oc;function Pc(a){return null!=a?a.i&2||a.Xb?!0:a.i?!1:B(Qa,a):B(Qa,a)}function Qc(a){return null!=a?a.i&16||a.Nb?!0:a.i?!1:B(Va,a):B(Va,a)}function Rc(a,b){this.f=a;this.j=b}Rc.prototype.sa=function(){return this.j<this.f.length};Rc.prototype.next=function(){var a=this.f[this.j];this.j+=1;return a};
function pc(a,b){this.f=a;this.j=b;this.i=166199550;this.B=8192}g=pc.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.V=function(a,b){var c=b+this.j;return c<this.f.length?this.f[c]:null};g.xa=function(a,b,c){a=b+this.j;return a<this.f.length?this.f[a]:c};g.Ba=function(){return new Rc(this.f,this.j)};g.qa=function(){return this.j+1<this.f.length?new pc(this.f,this.j+1):null};g.W=function(){var a=this.f.length-this.j;return 0>a?0:a};g.N=function(){return xc(this)};
g.w=function(a,b){return Cc.b?Cc.b(this,b):Cc.call(null,this,b)};g.X=function(){return L};g.$=function(a,b){return Lc(this.f,b,this.f[this.j],this.j+1)};g.aa=function(a,b,c){return Lc(this.f,b,c,this.j)};g.ba=function(){return this.f[this.j]};g.ra=function(){return this.j+1<this.f.length?new pc(this.f,this.j+1):L};g.T=function(){return this.j<this.f.length?this:null};g.U=function(a,b){return O.b?O.b(b,this):O.call(null,b,this)};pc.prototype[Ma]=function(){return tc(this)};
var oc=function oc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return oc.a(arguments[0]);case 2:return oc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};oc.a=function(a){return oc.b(a,0)};oc.b=function(a,b){return b<a.length?new pc(a,b):null};oc.A=2;
var nc=function nc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return nc.a(arguments[0]);case 2:return nc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};nc.a=function(a){return oc.b(a,0)};nc.b=function(a,b){return oc.b(a,b)};nc.A=2;Dc;Sc;function Nc(a,b,c){this.vb=a;this.j=b;this.o=c;this.i=32374990;this.B=8192}g=Nc.prototype;g.toString=function(){return Wb(this)};
g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.o};g.qa=function(){return 0<this.j?new Nc(this.vb,this.j-1,null):null};g.W=function(){return this.j+1};g.N=function(){return xc(this)};g.w=function(a,b){return Cc.b?Cc.b(this,b):Cc.call(null,this,b)};g.X=function(){var a=L,b=this.o;return Dc.b?Dc.b(a,b):Dc.call(null,a,b)};g.$=function(a,b){return Sc.b?Sc.b(b,this):Sc.call(null,b,this)};g.aa=function(a,b,c){return Sc.c?Sc.c(b,c,this):Sc.call(null,b,c,this)};
g.ba=function(){return G.b(this.vb,this.j)};g.ra=function(){return 0<this.j?new Nc(this.vb,this.j-1,null):L};g.T=function(){return this};g.P=function(a,b){return new Nc(this.vb,this.j,b)};g.U=function(a,b){return O.b?O.b(b,this):O.call(null,b,this)};Nc.prototype[Ma]=function(){return tc(this)};tb._=function(a,b){return a===b};
var Tc=function Tc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Tc.v();case 1:return Tc.a(arguments[0]);case 2:return Tc.b(arguments[0],arguments[1]);default:return Tc.m(arguments[0],arguments[1],new pc(c.slice(2),0))}};Tc.v=function(){return Uc};Tc.a=function(a){return a};Tc.b=function(a,b){return null!=a?Ua(a,b):Ua(L,b)};Tc.m=function(a,b,c){for(;;)if(y(c))a=Tc.b(a,b),b=K(c),c=M(c);else return Tc.b(a,b)};
Tc.H=function(a){var b=K(a),c=M(a);a=K(c);c=M(c);return Tc.m(b,a,c)};Tc.A=2;function Vc(a){if(null!=a)if(null!=a&&(a.i&2||a.Xb))a=a.W(null);else if(Ja(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.i&8388608||a.fc))a:{a=J(a);for(var b=0;;){if(Pc(a)){a=b+Ra(a);break a}a=M(a);b+=1}}else a=Ra(a);else a=0;return a}function Wc(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return J(a)?K(a):c;if(Qc(a))return G.c(a,b,c);if(J(a)){var d=M(a),e=b-1;a=d;b=e}else return c}}
function Xc(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.i&16||a.Nb))return a.V(null,b);if(Ja(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Ka)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(J(c)){c=K(c);break a}throw Error("Index out of bounds");}if(Qc(c)){c=G.b(c,d);break a}if(J(c))c=M(c),--d;else throw Error("Index out of bounds");
}}return c}if(B(Va,a))return G.b(a,b);throw Error([E("nth not supported on this type "),E(La(null==a?null:a.constructor))].join(""));}
function P(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.i&16||a.Nb))return a.xa(null,b,null);if(Ja(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Ka))return Wc(a,b);if(B(Va,a))return G.b(a,b);throw Error([E("nth not supported on this type "),E(La(null==a?null:a.constructor))].join(""));}
var I=function I(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return I.b(arguments[0],arguments[1]);case 3:return I.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};I.b=function(a,b){return null==a?null:null!=a&&(a.i&256||a.Ob)?a.J(null,b):Ja(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:B(ab,a)?bb.b(a,b):null};
I.c=function(a,b,c){return null!=a?null!=a&&(a.i&256||a.Ob)?a.G(null,b,c):Ja(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:B(ab,a)?bb.c(a,b,c):c:c};I.A=3;Yc;var Zc=function Zc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Zc.c(arguments[0],arguments[1],arguments[2]);default:return Zc.m(arguments[0],arguments[1],arguments[2],new pc(c.slice(3),0))}};
Zc.c=function(a,b,c){if(null!=a)a=db(a,b,c);else a:{a=[b];c=[c];b=a.length;var d=0,e;for(e=Eb($c);;)if(d<b){var f=d+1;e=e.mb(null,a[d],c[d]);d=f}else{a=Gb(e);break a}}return a};Zc.m=function(a,b,c,d){for(;;)if(a=Zc.c(a,b,c),y(d))b=K(d),c=K(M(d)),d=M(M(d));else return a};Zc.H=function(a){var b=K(a),c=M(a);a=K(c);var d=M(c),c=K(d),d=M(d);return Zc.m(b,a,c,d)};Zc.A=3;
var ad=function ad(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ad.a(arguments[0]);case 2:return ad.b(arguments[0],arguments[1]);default:return ad.m(arguments[0],arguments[1],new pc(c.slice(2),0))}};ad.a=function(a){return a};ad.b=function(a,b){return null==a?null:fb(a,b)};ad.m=function(a,b,c){for(;;){if(null==a)return null;a=ad.b(a,b);if(y(c))b=K(c),c=M(c);else return a}};
ad.H=function(a){var b=K(a),c=M(a);a=K(c);c=M(c);return ad.m(b,a,c)};ad.A=2;function bd(a,b){this.g=a;this.o=b;this.i=393217;this.B=0}g=bd.prototype;g.O=function(){return this.o};g.P=function(a,b){return new bd(this.g,b)};
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,H,S){a=this;return F.hb?F.hb(a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,H,S):F.call(null,a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,H,S)}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,H){a=this;return a.g.na?a.g.na(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,H):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,H)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D){a=this;return a.g.ma?a.g.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):
a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x){a=this;return a.g.la?a.g.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){a=this;return a.g.ka?a.g.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){a=this;return a.g.ja?a.g.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.g.call(null,b,
c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){a=this;return a.g.ia?a.g.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)}function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){a=this;return a.g.ha?a.g.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;return a.g.ga?a.g.ga(b,c,d,e,f,h,k,l,m,n,p,q,r):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;
return a.g.fa?a.g.fa(b,c,d,e,f,h,k,l,m,n,p,q):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;return a.g.ea?a.g.ea(b,c,d,e,f,h,k,l,m,n,p):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,n){a=this;return a.g.da?a.g.da(b,c,d,e,f,h,k,l,m,n):a.g.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;return a.g.pa?a.g.pa(b,c,d,e,f,h,k,l,m):a.g.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;return a.g.oa?a.g.oa(b,c,
d,e,f,h,k,l):a.g.call(null,b,c,d,e,f,h,k,l)}function t(a,b,c,d,e,f,h,k){a=this;return a.g.Z?a.g.Z(b,c,d,e,f,h,k):a.g.call(null,b,c,d,e,f,h,k)}function v(a,b,c,d,e,f,h){a=this;return a.g.Y?a.g.Y(b,c,d,e,f,h):a.g.call(null,b,c,d,e,f,h)}function w(a,b,c,d,e,f){a=this;return a.g.C?a.g.C(b,c,d,e,f):a.g.call(null,b,c,d,e,f)}function z(a,b,c,d,e){a=this;return a.g.u?a.g.u(b,c,d,e):a.g.call(null,b,c,d,e)}function D(a,b,c,d){a=this;return a.g.c?a.g.c(b,c,d):a.g.call(null,b,c,d)}function H(a,b,c){a=this;return a.g.b?
a.g.b(b,c):a.g.call(null,b,c)}function S(a,b){a=this;return a.g.a?a.g.a(b):a.g.call(null,b)}function pa(a){a=this;return a.g.v?a.g.v():a.g.call(null)}var x=null,x=function(Ha,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,x,$a,ib,vb,Ob,qc,cd,Ee){switch(arguments.length){case 1:return pa.call(this,Ha);case 2:return S.call(this,Ha,R);case 3:return H.call(this,Ha,R,T);case 4:return D.call(this,Ha,R,T,V);case 5:return z.call(this,Ha,R,T,V,X);case 6:return w.call(this,Ha,R,T,V,X,da);case 7:return v.call(this,Ha,R,
T,V,X,da,ga);case 8:return t.call(this,Ha,R,T,V,X,da,ga,ja);case 9:return r.call(this,Ha,R,T,V,X,da,ga,ja,la);case 10:return q.call(this,Ha,R,T,V,X,da,ga,ja,la,oa);case 11:return p.call(this,Ha,R,T,V,X,da,ga,ja,la,oa,ra);case 12:return n.call(this,Ha,R,T,V,X,da,ga,ja,la,oa,ra,Da);case 13:return m.call(this,Ha,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia);case 14:return l.call(this,Ha,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na);case 15:return k.call(this,Ha,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,x);case 16:return h.call(this,
Ha,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,x,$a);case 17:return f.call(this,Ha,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,x,$a,ib);case 18:return e.call(this,Ha,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,x,$a,ib,vb);case 19:return d.call(this,Ha,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,x,$a,ib,vb,Ob);case 20:return c.call(this,Ha,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,x,$a,ib,vb,Ob,qc);case 21:return b.call(this,Ha,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,x,$a,ib,vb,Ob,qc,cd);case 22:return a.call(this,Ha,R,T,V,X,da,ga,ja,la,oa,ra,Da,
Ia,Na,x,$a,ib,vb,Ob,qc,cd,Ee)}throw Error("Invalid arity: "+arguments.length);};x.a=pa;x.b=S;x.c=H;x.u=D;x.C=z;x.Y=w;x.Z=v;x.oa=t;x.pa=r;x.da=q;x.ea=p;x.fa=n;x.ga=m;x.ha=l;x.ia=k;x.ja=h;x.ka=f;x.la=e;x.ma=d;x.na=c;x.Hb=b;x.hb=a;return x}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.v=function(){return this.g.v?this.g.v():this.g.call(null)};g.a=function(a){return this.g.a?this.g.a(a):this.g.call(null,a)};
g.b=function(a,b){return this.g.b?this.g.b(a,b):this.g.call(null,a,b)};g.c=function(a,b,c){return this.g.c?this.g.c(a,b,c):this.g.call(null,a,b,c)};g.u=function(a,b,c,d){return this.g.u?this.g.u(a,b,c,d):this.g.call(null,a,b,c,d)};g.C=function(a,b,c,d,e){return this.g.C?this.g.C(a,b,c,d,e):this.g.call(null,a,b,c,d,e)};g.Y=function(a,b,c,d,e,f){return this.g.Y?this.g.Y(a,b,c,d,e,f):this.g.call(null,a,b,c,d,e,f)};
g.Z=function(a,b,c,d,e,f,h){return this.g.Z?this.g.Z(a,b,c,d,e,f,h):this.g.call(null,a,b,c,d,e,f,h)};g.oa=function(a,b,c,d,e,f,h,k){return this.g.oa?this.g.oa(a,b,c,d,e,f,h,k):this.g.call(null,a,b,c,d,e,f,h,k)};g.pa=function(a,b,c,d,e,f,h,k,l){return this.g.pa?this.g.pa(a,b,c,d,e,f,h,k,l):this.g.call(null,a,b,c,d,e,f,h,k,l)};g.da=function(a,b,c,d,e,f,h,k,l,m){return this.g.da?this.g.da(a,b,c,d,e,f,h,k,l,m):this.g.call(null,a,b,c,d,e,f,h,k,l,m)};
g.ea=function(a,b,c,d,e,f,h,k,l,m,n){return this.g.ea?this.g.ea(a,b,c,d,e,f,h,k,l,m,n):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n)};g.fa=function(a,b,c,d,e,f,h,k,l,m,n,p){return this.g.fa?this.g.fa(a,b,c,d,e,f,h,k,l,m,n,p):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p,q){return this.g.ga?this.g.ga(a,b,c,d,e,f,h,k,l,m,n,p,q):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){return this.g.ha?this.g.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){return this.g.ia?this.g.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t)};g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){return this.g.ja?this.g.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)};
g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){return this.g.ka?this.g.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)};g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){return this.g.la?this.g.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)};
g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D){return this.g.ma?this.g.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D)};g.na=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H){return this.g.na?this.g.na(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H)};
g.Hb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H,S){return F.hb?F.hb(this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H,S):F.call(null,this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H,S)};function Dc(a,b){return"function"==u(a)?new bd(a,b):null==a?null:qb(a,b)}function dd(a){var b=null!=a;return(b?null!=a?a.i&131072||a.bc||(a.i?0:B(ob,a)):B(ob,a):b)?pb(a):null}function ed(a){return null==a?!1:null!=a?a.i&4096||a.Cc?!0:a.i?!1:B(kb,a):B(kb,a)}
function fd(a){return null!=a?a.i&16777216||a.Bc?!0:a.i?!1:B(yb,a):B(yb,a)}function gd(a){return null==a?!1:null!=a?a.i&1024||a.$b?!0:a.i?!1:B(eb,a):B(eb,a)}function hd(a){return null!=a?a.i&16384||a.Dc?!0:a.i?!1:B(lb,a):B(lb,a)}id;jd;function kd(a){return null!=a?a.B&512||a.wc?!0:!1:!1}function ld(a){var b=[];ia(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function md(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var nd={};
function od(a){return null==a?!1:null!=a?a.i&64||a.Ka?!0:a.i?!1:B(Wa,a):B(Wa,a)}function pd(a){return null==a?!1:!1===a?!1:!0}function qd(a,b){return I.c(a,b,nd)===nd?!1:!0}
function fc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return ma(a,b);throw Error([E("Cannot compare "),E(a),E(" to "),E(b)].join(""));}if(null!=a?a.B&2048||a.gb||(a.B?0:B(Jb,a)):B(Jb,a))return Kb(a,b);if("string"!==typeof a&&!Ja(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([E("Cannot compare "),E(a),E(" to "),E(b)].join(""));return ma(a,b)}
function rd(a,b){var c=Vc(a),d=Vc(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=fc(Xc(a,d),Xc(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}sd;var Sc=function Sc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Sc.b(arguments[0],arguments[1]);case 3:return Sc.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Sc.b=function(a,b){var c=J(b);if(c){var d=K(c),c=M(c);return Pa.c?Pa.c(a,d,c):Pa.call(null,a,d,c)}return a.v?a.v():a.call(null)};Sc.c=function(a,b,c){for(c=J(c);;)if(c){var d=K(c);b=a.b?a.b(b,d):a.call(null,b,d);if(Gc(b))return nb(b);c=M(c)}else return b};Sc.A=3;td;
var Pa=function Pa(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Pa.b(arguments[0],arguments[1]);case 3:return Pa.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Pa.b=function(a,b){return null!=b&&(b.i&524288||b.dc)?b.$(null,a):Ja(b)?Jc(b,a):"string"===typeof b?Jc(b,a):B(rb,b)?sb.b(b,a):Sc.b(a,b)};
Pa.c=function(a,b,c){return null!=c&&(c.i&524288||c.dc)?c.aa(null,a,b):Ja(c)?Kc(c,a,b):"string"===typeof c?Kc(c,a,b):B(rb,c)?sb.c(c,a,b):Sc.c(a,b,c)};Pa.A=3;function ud(a){return a}var vd=function vd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return vd.v();case 1:return vd.a(arguments[0]);case 2:return vd.b(arguments[0],arguments[1]);default:return vd.m(arguments[0],arguments[1],new pc(c.slice(2),0))}};vd.v=function(){return 0};
vd.a=function(a){return a};vd.b=function(a,b){return a+b};vd.m=function(a,b,c){return Pa.c(vd,a+b,c)};vd.H=function(a){var b=K(a),c=M(a);a=K(c);c=M(c);return vd.m(b,a,c)};vd.A=2;na.Gc;wd;function wd(a,b){return(a%b+b)%b}function xd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function yd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function zd(a){var b=2;for(a=J(a);;)if(a&&0<b)--b,a=M(a);else return a}
var E=function E(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return E.v();case 1:return E.a(arguments[0]);default:return E.m(arguments[0],new pc(c.slice(1),0))}};E.v=function(){return""};E.a=function(a){return null==a?"":""+a};E.m=function(a,b){for(var c=new ka(""+E(a)),d=b;;)if(y(d))c=c.append(""+E(K(d))),d=M(d);else return c.toString()};E.H=function(a){var b=K(a);a=M(a);return E.m(b,a)};E.A=1;Q;Ad;
function Cc(a,b){var c;if(fd(b))if(Pc(a)&&Pc(b)&&Vc(a)!==Vc(b))c=!1;else a:{c=J(a);for(var d=J(b);;){if(null==c){c=null==d;break a}if(null!=d&&ec.b(K(c),K(d)))c=M(c),d=M(d);else{c=!1;break a}}}else c=null;return pd(c)}function Mc(a){if(J(a)){var b=jc(K(a));for(a=M(a);;){if(null==a)return b;b=kc(b,jc(K(a)));a=M(a)}}else return 0}Bd;Cd;Ad;Dd;Ed;function Oc(a,b,c,d,e){this.o=a;this.first=b;this.va=c;this.count=d;this.s=e;this.i=65937646;this.B=8192}g=Oc.prototype;g.toString=function(){return Wb(this)};
g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.o};g.qa=function(){return 1===this.count?null:this.va};g.W=function(){return this.count};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.X=function(){return qb(L,this.o)};g.$=function(a,b){return Sc.b(b,this)};g.aa=function(a,b,c){return Sc.c(b,c,this)};g.ba=function(){return this.first};g.ra=function(){return 1===this.count?L:this.va};g.T=function(){return this};
g.P=function(a,b){return new Oc(b,this.first,this.va,this.count,this.s)};g.U=function(a,b){return new Oc(this.o,b,this,this.count+1,null)};Oc.prototype[Ma]=function(){return tc(this)};function Fd(a){this.o=a;this.i=65937614;this.B=8192}g=Fd.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.o};g.qa=function(){return null};g.W=function(){return 0};g.N=function(){return yc};
g.w=function(a,b){return(null!=b?b.i&33554432||b.Ac||(b.i?0:B(zb,b)):B(zb,b))||fd(b)?null==J(b):!1};g.X=function(){return this};g.$=function(a,b){return Sc.b(b,this)};g.aa=function(a,b,c){return Sc.c(b,c,this)};g.ba=function(){return null};g.ra=function(){return L};g.T=function(){return null};g.P=function(a,b){return new Fd(b)};g.U=function(a,b){return new Oc(this.o,b,null,1,null)};var L=new Fd(null);Fd.prototype[Ma]=function(){return tc(this)};
var cc=function cc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return cc.m(0<c.length?new pc(c.slice(0),0):null)};cc.m=function(a){var b;if(a instanceof pc&&0===a.j)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.ba(null)),a=a.qa(null);else break a;a=b.length;for(var c=L;;)if(0<a){var d=a-1,c=c.U(null,b[a-1]);a=d}else return c};cc.A=0;cc.H=function(a){return cc.m(J(a))};function Gd(a,b,c,d){this.o=a;this.first=b;this.va=c;this.s=d;this.i=65929452;this.B=8192}
g=Gd.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.o};g.qa=function(){return null==this.va?null:J(this.va)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.X=function(){return Dc(L,this.o)};g.$=function(a,b){return Sc.b(b,this)};g.aa=function(a,b,c){return Sc.c(b,c,this)};g.ba=function(){return this.first};g.ra=function(){return null==this.va?L:this.va};g.T=function(){return this};
g.P=function(a,b){return new Gd(b,this.first,this.va,this.s)};g.U=function(a,b){return new Gd(null,b,this,this.s)};Gd.prototype[Ma]=function(){return tc(this)};function O(a,b){var c=null==b;return(c?c:null!=b&&(b.i&64||b.Ka))?new Gd(null,a,b,null):new Gd(null,a,J(b),null)}function Hd(a,b){if(a.Ca===b.Ca)return 0;var c=Ka(a.ta);if(y(c?b.ta:c))return-1;if(y(a.ta)){if(Ka(b.ta))return 1;c=ma(a.ta,b.ta);return 0===c?ma(a.name,b.name):c}return ma(a.name,b.name)}
function A(a,b,c,d){this.ta=a;this.name=b;this.Ca=c;this.Va=d;this.i=2153775105;this.B=4096}g=A.prototype;g.toString=function(){return[E(":"),E(this.Ca)].join("")};g.equiv=function(a){return this.w(null,a)};g.w=function(a,b){return b instanceof A?this.Ca===b.Ca:!1};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return I.b(c,this);case 3:return I.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return I.b(c,this)};a.c=function(a,c,d){return I.c(c,this,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return I.b(a,this)};g.b=function(a,b){return I.c(a,this,b)};
g.N=function(){var a=this.Va;return null!=a?a:this.Va=a=kc(bc(this.name),ic(this.ta))+2654435769|0};g.kb=function(){return this.name};g.lb=function(){return this.ta};g.K=function(a,b){return Ab(b,[E(":"),E(this.Ca)].join(""))};function Id(a,b){return a===b?!0:a instanceof A&&b instanceof A?a.Ca===b.Ca:!1}
var Jd=function Jd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Jd.a(arguments[0]);case 2:return Jd.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Jd.a=function(a){if(a instanceof A)return a;if(a instanceof dc){var b;if(null!=a&&(a.B&4096||a.cc))b=a.lb(null);else throw Error([E("Doesn't support namespace: "),E(a)].join(""));return new A(b,Ad.a?Ad.a(a):Ad.call(null,a),a.Ha,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new A(b[0],b[1],a,null):new A(null,b[0],a,null)):null};Jd.b=function(a,b){return new A(a,b,[E(y(a)?[E(a),E("/")].join(""):null),E(b)].join(""),null)};Jd.A=2;
function Kd(a,b,c,d){this.o=a;this.$a=b;this.D=c;this.s=d;this.i=32374988;this.B=0}g=Kd.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};function Ld(a){null!=a.$a&&(a.D=a.$a.v?a.$a.v():a.$a.call(null),a.$a=null);return a.D}g.O=function(){return this.o};g.qa=function(){xb(this);return null==this.D?null:M(this.D)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.X=function(){return Dc(L,this.o)};
g.$=function(a,b){return Sc.b(b,this)};g.aa=function(a,b,c){return Sc.c(b,c,this)};g.ba=function(){xb(this);return null==this.D?null:K(this.D)};g.ra=function(){xb(this);return null!=this.D?rc(this.D):L};g.T=function(){Ld(this);if(null==this.D)return null;for(var a=this.D;;)if(a instanceof Kd)a=Ld(a);else return this.D=a,J(this.D)};g.P=function(a,b){return new Kd(b,this.$a,this.D,this.s)};g.U=function(a,b){return O(b,this)};Kd.prototype[Ma]=function(){return tc(this)};Md;
function Nd(a,b){this.Cb=a;this.end=b;this.i=2;this.B=0}Nd.prototype.add=function(a){this.Cb[this.end]=a;return this.end+=1};Nd.prototype.Aa=function(){var a=new Md(this.Cb,0,this.end);this.Cb=null;return a};Nd.prototype.W=function(){return this.end};function Md(a,b,c){this.f=a;this.ca=b;this.end=c;this.i=524306;this.B=0}g=Md.prototype;g.W=function(){return this.end-this.ca};g.V=function(a,b){return this.f[this.ca+b]};g.xa=function(a,b,c){return 0<=b&&b<this.end-this.ca?this.f[this.ca+b]:c};
g.Mb=function(){if(this.ca===this.end)throw Error("-drop-first of empty chunk");return new Md(this.f,this.ca+1,this.end)};g.$=function(a,b){return Lc(this.f,b,this.f[this.ca],this.ca+1)};g.aa=function(a,b,c){return Lc(this.f,b,c,this.ca)};function id(a,b,c,d){this.Aa=a;this.Ga=b;this.o=c;this.s=d;this.i=31850732;this.B=1536}g=id.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.o};
g.qa=function(){if(1<Ra(this.Aa))return new id(Lb(this.Aa),this.Ga,this.o,null);var a=xb(this.Ga);return null==a?null:a};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.X=function(){return Dc(L,this.o)};g.ba=function(){return G.b(this.Aa,0)};g.ra=function(){return 1<Ra(this.Aa)?new id(Lb(this.Aa),this.Ga,this.o,null):null==this.Ga?L:this.Ga};g.T=function(){return this};g.Fb=function(){return this.Aa};g.Gb=function(){return null==this.Ga?L:this.Ga};
g.P=function(a,b){return new id(this.Aa,this.Ga,b,this.s)};g.U=function(a,b){return O(b,this)};g.Eb=function(){return null==this.Ga?null:this.Ga};id.prototype[Ma]=function(){return tc(this)};function Od(a,b){return 0===Ra(a)?b:new id(a,b,null,null)}function Pd(a,b){a.add(b)}function Dd(a){return Mb(a)}function Ed(a){return Nb(a)}function sd(a){for(var b=[];;)if(J(a))b.push(K(a)),a=M(a);else return b}
function Qd(a,b){if(Pc(a))return Vc(a);for(var c=a,d=b,e=0;;)if(0<d&&J(c))c=M(c),--d,e+=1;else return e}var Rd=function Rd(b){return null==b?null:null==M(b)?J(K(b)):O(K(b),Rd(M(b)))},Sd=function Sd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Sd.v();case 1:return Sd.a(arguments[0]);case 2:return Sd.b(arguments[0],arguments[1]);default:return Sd.m(arguments[0],arguments[1],new pc(c.slice(2),0))}};
Sd.v=function(){return new Kd(null,function(){return null},null,null)};Sd.a=function(a){return new Kd(null,function(){return a},null,null)};Sd.b=function(a,b){return new Kd(null,function(){var c=J(a);return c?kd(c)?Od(Mb(c),Sd.b(Nb(c),b)):O(K(c),Sd.b(rc(c),b)):b},null,null)};Sd.m=function(a,b,c){return function e(a,b){return new Kd(null,function(){var c=J(a);return c?kd(c)?Od(Mb(c),e(Nb(c),b)):O(K(c),e(rc(c),b)):y(b)?e(K(b),M(b)):null},null,null)}(Sd.b(a,b),c)};
Sd.H=function(a){var b=K(a),c=M(a);a=K(c);c=M(c);return Sd.m(b,a,c)};Sd.A=2;var Td=function Td(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Td.v();case 1:return Td.a(arguments[0]);case 2:return Td.b(arguments[0],arguments[1]);default:return Td.m(arguments[0],arguments[1],new pc(c.slice(2),0))}};Td.v=function(){return Eb(Uc)};Td.a=function(a){return a};Td.b=function(a,b){return Fb(a,b)};
Td.m=function(a,b,c){for(;;)if(a=Fb(a,b),y(c))b=K(c),c=M(c);else return a};Td.H=function(a){var b=K(a),c=M(a);a=K(c);c=M(c);return Td.m(b,a,c)};Td.A=2;
function Ud(a,b,c){var d=J(c);if(0===b)return a.v?a.v():a.call(null);c=Xa(d);var e=Ya(d);if(1===b)return a.a?a.a(c):a.a?a.a(c):a.call(null,c);var d=Xa(e),f=Ya(e);if(2===b)return a.b?a.b(c,d):a.b?a.b(c,d):a.call(null,c,d);var e=Xa(f),h=Ya(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=Xa(h),k=Ya(h);if(4===b)return a.u?a.u(c,d,e,f):a.u?a.u(c,d,e,f):a.call(null,c,d,e,f);var h=Xa(k),l=Ya(k);if(5===b)return a.C?a.C(c,d,e,f,h):a.C?a.C(c,d,e,f,h):a.call(null,c,d,e,f,h);var k=Xa(l),
m=Ya(l);if(6===b)return a.Y?a.Y(c,d,e,f,h,k):a.Y?a.Y(c,d,e,f,h,k):a.call(null,c,d,e,f,h,k);var l=Xa(m),n=Ya(m);if(7===b)return a.Z?a.Z(c,d,e,f,h,k,l):a.Z?a.Z(c,d,e,f,h,k,l):a.call(null,c,d,e,f,h,k,l);var m=Xa(n),p=Ya(n);if(8===b)return a.oa?a.oa(c,d,e,f,h,k,l,m):a.oa?a.oa(c,d,e,f,h,k,l,m):a.call(null,c,d,e,f,h,k,l,m);var n=Xa(p),q=Ya(p);if(9===b)return a.pa?a.pa(c,d,e,f,h,k,l,m,n):a.pa?a.pa(c,d,e,f,h,k,l,m,n):a.call(null,c,d,e,f,h,k,l,m,n);var p=Xa(q),r=Ya(q);if(10===b)return a.da?a.da(c,d,e,f,h,
k,l,m,n,p):a.da?a.da(c,d,e,f,h,k,l,m,n,p):a.call(null,c,d,e,f,h,k,l,m,n,p);var q=Xa(r),t=Ya(r);if(11===b)return a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q):a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q):a.call(null,c,d,e,f,h,k,l,m,n,p,q);var r=Xa(t),v=Ya(t);if(12===b)return a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r):a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r);var t=Xa(v),w=Ya(v);if(13===b)return a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,t):a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,t):a.call(null,c,d,e,f,h,k,l,m,n,p,q,
r,t);var v=Xa(w),z=Ya(w);if(14===b)return a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v);var w=Xa(z),D=Ya(z);if(15===b)return a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w);var z=Xa(D),H=Ya(D);if(16===b)return a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z);var D=Xa(H),
S=Ya(H);if(17===b)return a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D);var H=Xa(S),pa=Ya(S);if(18===b)return a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H):a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H);S=Xa(pa);pa=Ya(pa);if(19===b)return a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H,S):a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H,S):a.call(null,c,d,e,f,h,k,
l,m,n,p,q,r,t,v,w,z,D,H,S);var x=Xa(pa);Ya(pa);if(20===b)return a.na?a.na(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H,S,x):a.na?a.na(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H,S,x):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H,S,x);throw Error("Only up to 20 arguments supported on functions");}
var F=function F(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return F.b(arguments[0],arguments[1]);case 3:return F.c(arguments[0],arguments[1],arguments[2]);case 4:return F.u(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return F.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return F.m(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new pc(c.slice(5),0))}};
F.b=function(a,b){var c=a.A;if(a.H){var d=Qd(b,c+1);return d<=c?Ud(a,d,b):a.H(b)}return a.apply(a,sd(b))};F.c=function(a,b,c){b=O(b,c);c=a.A;if(a.H){var d=Qd(b,c+1);return d<=c?Ud(a,d,b):a.H(b)}return a.apply(a,sd(b))};F.u=function(a,b,c,d){b=O(b,O(c,d));c=a.A;return a.H?(d=Qd(b,c+1),d<=c?Ud(a,d,b):a.H(b)):a.apply(a,sd(b))};F.C=function(a,b,c,d,e){b=O(b,O(c,O(d,e)));c=a.A;return a.H?(d=Qd(b,c+1),d<=c?Ud(a,d,b):a.H(b)):a.apply(a,sd(b))};
F.m=function(a,b,c,d,e,f){b=O(b,O(c,O(d,O(e,Rd(f)))));c=a.A;return a.H?(d=Qd(b,c+1),d<=c?Ud(a,d,b):a.H(b)):a.apply(a,sd(b))};F.H=function(a){var b=K(a),c=M(a);a=K(c);var d=M(c),c=K(d),e=M(d),d=K(e),f=M(e),e=K(f),f=M(f);return F.m(b,a,c,d,e,f)};F.A=5;function Vd(a){return J(a)?a:null}
var Wd=function Wd(){"undefined"===typeof qa&&(qa=function(b,c){this.rc=b;this.qc=c;this.i=393216;this.B=0},qa.prototype.P=function(b,c){return new qa(this.rc,c)},qa.prototype.O=function(){return this.qc},qa.prototype.sa=function(){return!1},qa.prototype.next=function(){return Error("No such element")},qa.prototype.remove=function(){return Error("Unsupported operation")},qa.oc=function(){return new U(null,2,5,W,[Dc(Xd,new xa(null,1,[Yd,cc(Zd,cc(Uc))],null)),na.Fc],null)},qa.Ib=!0,qa.pb="cljs.core/t_cljs$core15371",
qa.Tb=function(b,c){return Ab(c,"cljs.core/t_cljs$core15371")});return new qa(Wd,$d)};ae;function ae(a,b,c,d){this.cb=a;this.first=b;this.va=c;this.o=d;this.i=31719628;this.B=0}g=ae.prototype;g.P=function(a,b){return new ae(this.cb,this.first,this.va,b)};g.U=function(a,b){return O(b,xb(this))};g.X=function(){return L};g.w=function(a,b){return null!=xb(this)?Cc(this,b):fd(b)&&null==J(b)};g.N=function(){return xc(this)};g.T=function(){null!=this.cb&&this.cb.step(this);return null==this.va?null:this};
g.ba=function(){null!=this.cb&&xb(this);return null==this.va?null:this.first};g.ra=function(){null!=this.cb&&xb(this);return null==this.va?L:this.va};g.qa=function(){null!=this.cb&&xb(this);return null==this.va?null:xb(this.va)};ae.prototype[Ma]=function(){return tc(this)};function be(a,b){for(;;){if(null==J(b))return!0;var c;c=K(b);c=a.a?a.a(c):a.call(null,c);if(y(c)){c=a;var d=M(b);a=c;b=d}else return!1}}
function ce(a){for(var b=ud;;)if(J(a)){var c;c=K(a);c=b.a?b.a(c):b.call(null,c);if(y(c))return c;a=M(a)}else return null}
function de(a){return function(){function b(b,c){return Ka(a.b?a.b(b,c):a.call(null,b,c))}function c(b){return Ka(a.a?a.a(b):a.call(null,b))}function d(){return Ka(a.v?a.v():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new pc(h,0)}return c.call(this,a,d,f)}function c(b,d,e){return Ka(F.u(a,b,d,e))}b.A=2;b.H=function(a){var b=K(a);a=M(a);var d=K(a);a=rc(a);return c(b,d,a)};b.m=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new pc(n,0)}return f.m(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.A=2;e.H=f.H;e.v=d;e.a=c;e.b=b;e.m=f.m;return e}()}ee;function fe(a,b,c,d){this.state=a;this.o=b;this.vc=c;this.zb=d;this.B=16386;this.i=6455296}g=fe.prototype;
g.equiv=function(a){return this.w(null,a)};g.w=function(a,b){return this===b};g.wb=function(){return this.state};g.O=function(){return this.o};g.Rb=function(a,b,c){a=J(this.zb);for(var d=null,e=0,f=0;;)if(f<e){var h=d.V(null,f),k=P(h,0),h=P(h,1);h.u?h.u(k,this,b,c):h.call(null,k,this,b,c);f+=1}else if(a=J(a))kd(a)?(d=Mb(a),a=Nb(a),k=d,e=Vc(d),d=k):(d=K(a),k=P(d,0),h=P(d,1),h.u?h.u(k,this,b,c):h.call(null,k,this,b,c),a=M(a),d=null,e=0),f=0;else return null};
g.Qb=function(a,b,c){this.zb=Zc.c(this.zb,b,c);return this};g.N=function(){return this[ba]||(this[ba]=++ca)};var ge=function ge(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ge.a(arguments[0]);default:return ge.m(arguments[0],new pc(c.slice(1),0))}};ge.a=function(a){return new fe(a,null,null,null)};ge.m=function(a,b){var c=null!=b&&(b.i&64||b.Ka)?F.b(Bc,b):b,d=I.b(c,Aa),c=I.b(c,he);return new fe(a,d,c,null)};
ge.H=function(a){var b=K(a);a=M(a);return ge.m(b,a)};ge.A=1;ie;function je(a,b){if(a instanceof fe){var c=a.vc;if(null!=c&&!y(c.a?c.a(b):c.call(null,b)))throw Error([E("Assert failed: "),E("Validator rejected reference state"),E("\n"),E(function(){var a=cc(ke,le);return ie.a?ie.a(a):ie.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.zb&&Cb(a,c,b);return b}return Sb(a,b)}
var me=function me(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return me.b(arguments[0],arguments[1]);case 3:return me.c(arguments[0],arguments[1],arguments[2]);case 4:return me.u(arguments[0],arguments[1],arguments[2],arguments[3]);default:return me.m(arguments[0],arguments[1],arguments[2],arguments[3],new pc(c.slice(4),0))}};me.b=function(a,b){var c;a instanceof fe?(c=a.state,c=b.a?b.a(c):b.call(null,c),c=je(a,c)):c=Tb.b(a,b);return c};
me.c=function(a,b,c){if(a instanceof fe){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=je(a,b)}else a=Tb.c(a,b,c);return a};me.u=function(a,b,c,d){if(a instanceof fe){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=je(a,b)}else a=Tb.u(a,b,c,d);return a};me.m=function(a,b,c,d,e){return a instanceof fe?je(a,F.C(b,a.state,c,d,e)):Tb.C(a,b,c,d,e)};me.H=function(a){var b=K(a),c=M(a);a=K(c);var d=M(c),c=K(d),e=M(d),d=K(e),e=M(e);return me.m(b,a,c,d,e)};me.A=4;
function ne(a){this.state=a;this.i=32768;this.B=0}ne.prototype.wb=function(){return this.state};function ee(a){return new ne(a)}
var Q=function Q(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Q.a(arguments[0]);case 2:return Q.b(arguments[0],arguments[1]);case 3:return Q.c(arguments[0],arguments[1],arguments[2]);case 4:return Q.u(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Q.m(arguments[0],arguments[1],arguments[2],arguments[3],new pc(c.slice(4),0))}};
Q.a=function(a){return function(b){return function(){function c(c,d){var e=a.a?a.a(d):a.call(null,d);return b.b?b.b(c,e):b.call(null,c,e)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.v?b.v():b.call(null)}var f=null,h=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new pc(h,0)}return d.call(this,a,b,f)}function d(c,e,f){e=F.c(a,e,f);return b.b?b.b(c,e):b.call(null,c,e)}c.A=2;c.H=function(a){var b=
K(a);a=M(a);var c=K(a);a=rc(a);return d(b,c,a)};c.m=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new pc(p,0)}return h.m(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.A=2;f.H=h.H;f.v=e;f.a=d;f.b=c;f.m=h.m;return f}()}};
Q.b=function(a,b){return new Kd(null,function(){var c=J(b);if(c){if(kd(c)){for(var d=Mb(c),e=Vc(d),f=new Nd(Array(e),0),h=0;;)if(h<e)Pd(f,function(){var b=G.b(d,h);return a.a?a.a(b):a.call(null,b)}()),h+=1;else break;return Od(f.Aa(),Q.b(a,Nb(c)))}return O(function(){var b=K(c);return a.a?a.a(b):a.call(null,b)}(),Q.b(a,rc(c)))}return null},null,null)};
Q.c=function(a,b,c){return new Kd(null,function(){var d=J(b),e=J(c);if(d&&e){var f=O,h;h=K(d);var k=K(e);h=a.b?a.b(h,k):a.call(null,h,k);d=f(h,Q.c(a,rc(d),rc(e)))}else d=null;return d},null,null)};Q.u=function(a,b,c,d){return new Kd(null,function(){var e=J(b),f=J(c),h=J(d);if(e&&f&&h){var k=O,l;l=K(e);var m=K(f),n=K(h);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=k(l,Q.u(a,rc(e),rc(f),rc(h)))}else e=null;return e},null,null)};
Q.m=function(a,b,c,d,e){var f=function k(a){return new Kd(null,function(){var b=Q.b(J,a);return be(ud,b)?O(Q.b(K,b),k(Q.b(rc,b))):null},null,null)};return Q.b(function(){return function(b){return F.b(a,b)}}(f),f(Tc.m(e,d,nc([c,b],0))))};Q.H=function(a){var b=K(a),c=M(a);a=K(c);var d=M(c),c=K(d),e=M(d),d=K(e),e=M(e);return Q.m(b,a,c,d,e)};Q.A=4;
function oe(a,b){if("number"!==typeof a)throw Error([E("Assert failed: "),E(function(){var a=cc(pe,qe);return ie.a?ie.a(a):ie.call(null,a)}())].join(""));return new Kd(null,function(){if(0<a){var c=J(b);return c?O(K(c),oe(a-1,rc(c))):null}return null},null,null)}
function re(a,b){if("number"!==typeof a)throw Error([E("Assert failed: "),E(function(){var a=cc(pe,qe);return ie.a?ie.a(a):ie.call(null,a)}())].join(""));return new Kd(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=J(b);if(0<a&&e){var f=a-1,e=rc(e);a=f;b=e}else return e}}),null,null)}function se(a){return new Kd(null,function(){return O(a,se(a))},null,null)}
var te=function te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return te.b(arguments[0],arguments[1]);default:return te.m(arguments[0],arguments[1],new pc(c.slice(2),0))}};te.b=function(a,b){return new Kd(null,function(){var c=J(a),d=J(b);return c&&d?O(K(c),O(K(d),te.b(rc(c),rc(d)))):null},null,null)};
te.m=function(a,b,c){return new Kd(null,function(){var d=Q.b(J,Tc.m(c,b,nc([a],0)));return be(ud,d)?Sd.b(Q.b(K,d),F.b(te,Q.b(rc,d))):null},null,null)};te.H=function(a){var b=K(a),c=M(a);a=K(c);c=M(c);return te.m(b,a,c)};te.A=2;ue;function ve(a,b){return F.b(Sd,F.c(Q,a,b))}
function we(a,b){return new Kd(null,function(){var c=J(b);if(c){if(kd(c)){for(var d=Mb(c),e=Vc(d),f=new Nd(Array(e),0),h=0;;)if(h<e){var k;k=G.b(d,h);k=a.a?a.a(k):a.call(null,k);y(k)&&(k=G.b(d,h),f.add(k));h+=1}else break;return Od(f.Aa(),we(a,Nb(c)))}d=K(c);c=rc(c);return y(a.a?a.a(d):a.call(null,d))?O(d,we(a,c)):we(a,c)}return null},null,null)}
function xe(a){return function c(a){return new Kd(null,function(){return O(a,y(od.a?od.a(a):od.call(null,a))?ve(c,nc([J.a?J.a(a):J.call(null,a)],0)):null)},null,null)}(a)}function ye(a,b){var c;null!=a?null!=a&&(a.B&4||a.yc)?(c=Pa.c(Fb,Eb(a),b),c=Gb(c),c=Dc(c,dd(a))):c=Pa.c(Ua,a,b):c=Pa.c(Tc,L,b);return c}function ze(a,b,c){return new Kd(null,function(){var d=J(c);if(d){var e=oe(a,d);return a===Vc(e)?O(e,ze(a,b,re(b,d))):null}return null},null,null)}
function Ae(a,b){var c;a:{c=nd;for(var d=a,e=J(b);;)if(e)if(null!=d?d.i&256||d.Ob||(d.i?0:B(ab,d)):B(ab,d)){d=I.c(d,K(e),c);if(c===d){c=null;break a}e=M(e)}else{c=null;break a}else{c=d;break a}}return c}function Be(a,b){this.L=a;this.f=b}function Ce(a){return new Be(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function De(a){a=a.l;return 32>a?0:a-1>>>5<<5}
function Fe(a,b,c){for(;;){if(0===b)return c;var d=Ce(a);d.f[0]=c;c=d;b-=5}}var Ge=function Ge(b,c,d,e){var f=new Be(d.L,Oa(d.f)),h=b.l-1>>>c&31;5===c?f.f[h]=e:(d=d.f[h],b=null!=d?Ge(b,c-5,d,e):Fe(null,c-5,e),f.f[h]=b);return f};function He(a,b){throw Error([E("No item "),E(a),E(" in vector of length "),E(b)].join(""));}function Ie(a,b){if(b>=De(a))return a.I;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function Je(a,b){return 0<=b&&b<a.l?Ie(a,b):He(b,a.l)}
var Ke=function Ke(b,c,d,e,f){var h=new Be(d.L,Oa(d.f));if(0===c)h.f[e&31]=f;else{var k=e>>>c&31;b=Ke(b,c-5,d.f[k],e,f);h.f[k]=b}return h};function Le(a,b,c,d,e,f){this.j=a;this.Bb=b;this.f=c;this.Ia=d;this.start=e;this.end=f}Le.prototype.sa=function(){return this.j<this.end};Le.prototype.next=function(){32===this.j-this.Bb&&(this.f=Ie(this.Ia,this.j),this.Bb+=32);var a=this.f[this.j&31];this.j+=1;return a};Me;Ne;Oe;N;Pe;Qe;Re;
function U(a,b,c,d,e,f){this.o=a;this.l=b;this.shift=c;this.root=d;this.I=e;this.s=f;this.i=167668511;this.B=8196}g=U.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.J=function(a,b){return bb.c(this,b,null)};g.G=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};g.V=function(a,b){return Je(this,b)[b&31]};g.xa=function(a,b,c){return 0<=b&&b<this.l?Ie(this,b)[b&31]:c};
g.Ra=function(a,b,c){if(0<=b&&b<this.l)return De(this)<=b?(a=Oa(this.I),a[b&31]=c,new U(this.o,this.l,this.shift,this.root,a,null)):new U(this.o,this.l,this.shift,Ke(this,this.shift,this.root,b,c),this.I,null);if(b===this.l)return Ua(this,c);throw Error([E("Index "),E(b),E(" out of bounds  [0,"),E(this.l),E("]")].join(""));};g.Ba=function(){var a=this.l;return new Le(0,0,0<Vc(this)?Ie(this,0):null,this,0,a)};g.O=function(){return this.o};g.W=function(){return this.l};
g.ib=function(){return G.b(this,0)};g.jb=function(){return G.b(this,1)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){if(b instanceof U)if(this.l===Vc(b))for(var c=Ub(this),d=Ub(b);;)if(y(c.sa())){var e=c.next(),f=d.next();if(!ec.b(e,f))return!1}else return!0;else return!1;else return Cc(this,b)};g.Xa=function(){return new Oe(this.l,this.shift,Me.a?Me.a(this.root):Me.call(null,this.root),Ne.a?Ne.a(this.I):Ne.call(null,this.I))};g.X=function(){return Dc(Uc,this.o)};
g.$=function(a,b){return Hc(this,b)};g.aa=function(a,b,c){a=0;for(var d=c;;)if(a<this.l){var e=Ie(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=e[f],d=b.b?b.b(d,h):b.call(null,d,h);if(Gc(d)){e=d;break a}f+=1}else{e=d;break a}if(Gc(e))return N.a?N.a(e):N.call(null,e);a+=c;d=e}else return d};g.Na=function(a,b,c){if("number"===typeof b)return mb(this,b,c);throw Error("Vector's key for assoc must be a number.");};
g.T=function(){if(0===this.l)return null;if(32>=this.l)return new pc(this.I,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return Re.u?Re.u(this,a,0,0):Re.call(null,this,a,0,0)};g.P=function(a,b){return new U(b,this.l,this.shift,this.root,this.I,this.s)};
g.U=function(a,b){if(32>this.l-De(this)){for(var c=this.I.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.I[e],e+=1;else break;d[c]=b;return new U(this.o,this.l+1,this.shift,this.root,d,null)}c=(d=this.l>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=Ce(null),d.f[0]=this.root,e=Fe(null,this.shift,new Be(null,this.I)),d.f[1]=e):d=Ge(this,this.shift,this.root,new Be(null,this.I));return new U(this.o,this.l+1,c,d,[b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.V(null,c);case 3:return this.xa(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.V(null,c)};a.c=function(a,c,d){return this.xa(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.V(null,a)};g.b=function(a,b){return this.xa(null,a,b)};
var W=new Be(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Uc=new U(null,0,5,W,[],yc);U.prototype[Ma]=function(){return tc(this)};function td(a){if(Ja(a))a:{var b=a.length;if(32>b)a=new U(null,b,5,W,a,null);else for(var c=32,d=(new U(null,32,5,W,a.slice(0,32),null)).Xa(null);;)if(c<b)var e=c+1,d=Td.b(d,a[c]),c=e;else{a=Gb(d);break a}}else a=Gb(Pa.c(Fb,Eb(Uc),a));return a}Se;
function jd(a,b,c,d,e,f){this.za=a;this.node=b;this.j=c;this.ca=d;this.o=e;this.s=f;this.i=32375020;this.B=1536}g=jd.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.o};g.qa=function(){if(this.ca+1<this.node.length){var a;a=this.za;var b=this.node,c=this.j,d=this.ca+1;a=Re.u?Re.u(a,b,c,d):Re.call(null,a,b,c,d);return null==a?null:a}return Pb(this)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};
g.w=function(a,b){return Cc(this,b)};g.X=function(){return Dc(Uc,this.o)};g.$=function(a,b){var c;c=this.za;var d=this.j+this.ca,e=Vc(this.za);c=Se.c?Se.c(c,d,e):Se.call(null,c,d,e);return Hc(c,b)};g.aa=function(a,b,c){a=this.za;var d=this.j+this.ca,e=Vc(this.za);a=Se.c?Se.c(a,d,e):Se.call(null,a,d,e);return Ic(a,b,c)};g.ba=function(){return this.node[this.ca]};
g.ra=function(){if(this.ca+1<this.node.length){var a;a=this.za;var b=this.node,c=this.j,d=this.ca+1;a=Re.u?Re.u(a,b,c,d):Re.call(null,a,b,c,d);return null==a?L:a}return Nb(this)};g.T=function(){return this};g.Fb=function(){var a=this.node;return new Md(a,this.ca,a.length)};g.Gb=function(){var a=this.j+this.node.length;if(a<Ra(this.za)){var b=this.za,c=Ie(this.za,a);return Re.u?Re.u(b,c,a,0):Re.call(null,b,c,a,0)}return L};
g.P=function(a,b){return Re.C?Re.C(this.za,this.node,this.j,this.ca,b):Re.call(null,this.za,this.node,this.j,this.ca,b)};g.U=function(a,b){return O(b,this)};g.Eb=function(){var a=this.j+this.node.length;if(a<Ra(this.za)){var b=this.za,c=Ie(this.za,a);return Re.u?Re.u(b,c,a,0):Re.call(null,b,c,a,0)}return null};jd.prototype[Ma]=function(){return tc(this)};
var Re=function Re(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Re.c(arguments[0],arguments[1],arguments[2]);case 4:return Re.u(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Re.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Re.c=function(a,b,c){return new jd(a,Je(a,b),b,c,null,null)};
Re.u=function(a,b,c,d){return new jd(a,b,c,d,null,null)};Re.C=function(a,b,c,d,e){return new jd(a,b,c,d,e,null)};Re.A=5;Te;function Ue(a,b,c,d,e){this.o=a;this.Ia=b;this.start=c;this.end=d;this.s=e;this.i=167666463;this.B=8192}g=Ue.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.J=function(a,b){return bb.c(this,b,null)};g.G=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
g.V=function(a,b){return 0>b||this.end<=this.start+b?He(b,this.end-this.start):G.b(this.Ia,this.start+b)};g.xa=function(a,b,c){return 0>b||this.end<=this.start+b?c:G.c(this.Ia,this.start+b,c)};g.Ra=function(a,b,c){var d=this.start+b;a=this.o;c=Zc.c(this.Ia,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Te.C?Te.C(a,c,b,d,null):Te.call(null,a,c,b,d,null)};g.O=function(){return this.o};g.W=function(){return this.end-this.start};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};
g.w=function(a,b){return Cc(this,b)};g.X=function(){return Dc(Uc,this.o)};g.$=function(a,b){return Hc(this,b)};g.aa=function(a,b,c){return Ic(this,b,c)};g.Na=function(a,b,c){if("number"===typeof b)return mb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};g.T=function(){var a=this;return function(b){return function d(e){return e===a.end?null:O(G.b(a.Ia,e),new Kd(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
g.P=function(a,b){return Te.C?Te.C(b,this.Ia,this.start,this.end,this.s):Te.call(null,b,this.Ia,this.start,this.end,this.s)};g.U=function(a,b){var c=this.o,d=mb(this.Ia,this.end,b),e=this.start,f=this.end+1;return Te.C?Te.C(c,d,e,f,null):Te.call(null,c,d,e,f,null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.V(null,c);case 3:return this.xa(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.V(null,c)};a.c=function(a,c,d){return this.xa(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.V(null,a)};g.b=function(a,b){return this.xa(null,a,b)};Ue.prototype[Ma]=function(){return tc(this)};
function Te(a,b,c,d,e){for(;;)if(b instanceof Ue)c=b.start+c,d=b.start+d,b=b.Ia;else{var f=Vc(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Ue(a,b,c,d,e)}}var Se=function Se(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Se.b(arguments[0],arguments[1]);case 3:return Se.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Se.b=function(a,b){return Se.c(a,b,Vc(a))};Se.c=function(a,b,c){return Te(null,a,b,c,null)};Se.A=3;function Ve(a,b){return a===b.L?b:new Be(a,Oa(b.f))}function Me(a){return new Be({},Oa(a.f))}function Ne(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];md(a,0,b,0,a.length);return b}
var We=function We(b,c,d,e){d=Ve(b.root.L,d);var f=b.l-1>>>c&31;if(5===c)b=e;else{var h=d.f[f];b=null!=h?We(b,c-5,h,e):Fe(b.root.L,c-5,e)}d.f[f]=b;return d};function Oe(a,b,c,d){this.l=a;this.shift=b;this.root=c;this.I=d;this.B=88;this.i=275}g=Oe.prototype;
g.nb=function(a,b){if(this.root.L){if(32>this.l-De(this))this.I[this.l&31]=b;else{var c=new Be(this.root.L,this.I),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.I=d;if(this.l>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=Fe(this.root.L,this.shift,c);this.root=new Be(this.root.L,d);this.shift=e}else this.root=We(this,this.shift,this.root,c)}this.l+=1;return this}throw Error("conj! after persistent!");};g.ob=function(){if(this.root.L){this.root.L=null;var a=this.l-De(this),b=Array(a);md(this.I,0,b,0,a);return new U(null,this.l,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
g.mb=function(a,b,c){if("number"===typeof b)return Ib(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
g.Pb=function(a,b,c){var d=this;if(d.root.L){if(0<=b&&b<d.l)return De(this)<=b?d.I[b&31]=c:(a=function(){return function f(a,k){var l=Ve(d.root.L,k);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.l)return Fb(this,c);throw Error([E("Index "),E(b),E(" out of bounds for TransientVector of length"),E(d.l)].join(""));}throw Error("assoc! after persistent!");};
g.W=function(){if(this.root.L)return this.l;throw Error("count after persistent!");};g.V=function(a,b){if(this.root.L)return Je(this,b)[b&31];throw Error("nth after persistent!");};g.xa=function(a,b,c){return 0<=b&&b<this.l?G.b(this,b):c};g.J=function(a,b){return bb.c(this,b,null)};g.G=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.G(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.G(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.G(null,a,b)};function Xe(){this.i=2097152;this.B=0}
Xe.prototype.equiv=function(a){return this.w(null,a)};Xe.prototype.w=function(){return!1};var Ye=new Xe;function Ze(a,b){return pd(gd(b)?Vc(a)===Vc(b)?be(ud,Q.b(function(a){return ec.b(I.c(b,K(a),Ye),K(M(a)))},a)):null:null)}function $e(a,b,c,d,e){this.j=a;this.tc=b;this.Kb=c;this.nc=d;this.Ub=e}$e.prototype.sa=function(){var a=this.j<this.Kb;return a?a:this.Ub.sa()};$e.prototype.next=function(){if(this.j<this.Kb){var a=Xc(this.nc,this.j);this.j+=1;return new U(null,2,5,W,[a,bb.b(this.tc,a)],null)}return this.Ub.next()};
$e.prototype.remove=function(){return Error("Unsupported operation")};function af(a){this.D=a}af.prototype.next=function(){if(null!=this.D){var a=K(this.D),b=P(a,0),a=P(a,1);this.D=M(this.D);return{value:[b,a],done:!1}}return{value:null,done:!0}};function bf(a){return new af(J(a))}function cf(a){this.D=a}cf.prototype.next=function(){if(null!=this.D){var a=K(this.D);this.D=M(this.D);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function df(a,b){var c;if(b instanceof A)a:{c=a.length;for(var d=b.Ca,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof A&&d===a[e].Ca){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof dc)a:for(c=a.length,d=b.Ha,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof dc&&d===a[e].Ha){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(ec.b(b,a[d])){c=d;break a}d+=2}return c}ef;function ff(a,b,c){this.f=a;this.j=b;this.wa=c;this.i=32374990;this.B=0}g=ff.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.wa};g.qa=function(){return this.j<this.f.length-2?new ff(this.f,this.j+2,this.wa):null};g.W=function(){return(this.f.length-this.j)/2};g.N=function(){return xc(this)};g.w=function(a,b){return Cc(this,b)};
g.X=function(){return Dc(L,this.wa)};g.$=function(a,b){return Sc.b(b,this)};g.aa=function(a,b,c){return Sc.c(b,c,this)};g.ba=function(){return new U(null,2,5,W,[this.f[this.j],this.f[this.j+1]],null)};g.ra=function(){return this.j<this.f.length-2?new ff(this.f,this.j+2,this.wa):L};g.T=function(){return this};g.P=function(a,b){return new ff(this.f,this.j,b)};g.U=function(a,b){return O(b,this)};ff.prototype[Ma]=function(){return tc(this)};gf;hf;function jf(a,b,c){this.f=a;this.j=b;this.l=c}
jf.prototype.sa=function(){return this.j<this.l};jf.prototype.next=function(){var a=new U(null,2,5,W,[this.f[this.j],this.f[this.j+1]],null);this.j+=2;return a};function xa(a,b,c,d){this.o=a;this.l=b;this.f=c;this.s=d;this.i=16647951;this.B=8196}g=xa.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.keys=function(){return tc(gf.a?gf.a(this):gf.call(null,this))};g.entries=function(){return bf(J(this))};
g.values=function(){return tc(hf.a?hf.a(this):hf.call(null,this))};g.has=function(a){return qd(this,a)};g.get=function(a,b){return this.G(null,a,b)};g.forEach=function(a){for(var b=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.V(null,e),h=P(f,0),f=P(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=J(b))kd(b)?(c=Mb(b),b=Nb(b),h=c,d=Vc(c),c=h):(c=K(b),h=P(c,0),f=P(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return bb.c(this,b,null)};
g.G=function(a,b,c){a=df(this.f,b);return-1===a?c:this.f[a+1]};g.Ba=function(){return new jf(this.f,0,2*this.l)};g.O=function(){return this.o};g.W=function(){return this.l};g.N=function(){var a=this.s;return null!=a?a:this.s=a=zc(this)};g.w=function(a,b){if(null!=b&&(b.i&1024||b.$b)){var c=this.f.length;if(this.l===b.W(null))for(var d=0;;)if(d<c){var e=b.G(null,this.f[d],nd);if(e!==nd)if(ec.b(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Ze(this,b)};
g.Xa=function(){return new ef({},this.f.length,Oa(this.f))};g.X=function(){return qb($d,this.o)};g.$=function(a,b){return Sc.b(b,this)};g.aa=function(a,b,c){return Sc.c(b,c,this)};g.xb=function(a,b){if(0<=df(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return Sa(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new xa(this.o,this.l-1,d,null);ec.b(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
g.Na=function(a,b,c){a=df(this.f,b);if(-1===a){if(this.l<kf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new xa(this.o,this.l+1,e,null)}return qb(db(ye($c,this),b,c),this.o)}if(c===this.f[a+1])return this;b=Oa(this.f);b[a+1]=c;return new xa(this.o,this.l,b,null)};g.Db=function(a,b){return-1!==df(this.f,b)};g.T=function(){var a=this.f;return 0<=a.length-2?new ff(a,0,null):null};g.P=function(a,b){return new xa(b,this.l,this.f,this.s)};
g.U=function(a,b){if(hd(b))return db(this,G.b(b,0),G.b(b,1));for(var c=this,d=J(b);;){if(null==d)return c;var e=K(d);if(hd(e))c=db(c,G.b(e,0),G.b(e,1)),d=M(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.G(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.G(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.G(null,a,b)};var $d=new xa(null,0,[],Ac),kf=8;xa.prototype[Ma]=function(){return tc(this)};
lf;function ef(a,b,c){this.Ya=a;this.Ua=b;this.f=c;this.i=258;this.B=56}g=ef.prototype;g.W=function(){if(y(this.Ya))return xd(this.Ua);throw Error("count after persistent!");};g.J=function(a,b){return bb.c(this,b,null)};g.G=function(a,b,c){if(y(this.Ya))return a=df(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
g.nb=function(a,b){if(y(this.Ya)){if(null!=b?b.i&2048||b.ac||(b.i?0:B(gb,b)):B(gb,b))return Hb(this,Bd.a?Bd.a(b):Bd.call(null,b),Cd.a?Cd.a(b):Cd.call(null,b));for(var c=J(b),d=this;;){var e=K(c);if(y(e))c=M(c),d=Hb(d,Bd.a?Bd.a(e):Bd.call(null,e),Cd.a?Cd.a(e):Cd.call(null,e));else return d}}else throw Error("conj! after persistent!");};g.ob=function(){if(y(this.Ya))return this.Ya=!1,new xa(null,xd(this.Ua),this.f,null);throw Error("persistent! called twice");};
g.mb=function(a,b,c){if(y(this.Ya)){a=df(this.f,b);if(-1===a){if(this.Ua+2<=2*kf)return this.Ua+=2,this.f.push(b),this.f.push(c),this;a=lf.b?lf.b(this.Ua,this.f):lf.call(null,this.Ua,this.f);return Hb(a,b,c)}c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};mf;Yc;function lf(a,b){for(var c=Eb($c),d=0;;)if(d<a)c=Hb(c,b[d],b[d+1]),d+=2;else return c}function nf(){this.M=!1}of;pf;je;qf;ge;N;function rf(a,b){return a===b?!0:Id(a,b)?!0:ec.b(a,b)}
function sf(a,b,c){a=Oa(a);a[b]=c;return a}function tf(a,b){var c=Array(a.length-2);md(a,0,c,0,2*b);md(a,2*(b+1),c,2*b,c.length-2*b);return c}function uf(a,b,c,d){a=a.Sa(b);a.f[c]=d;return a}vf;function wf(a,b,c,d){this.f=a;this.j=b;this.ub=c;this.Fa=d}wf.prototype.advance=function(){for(var a=this.f.length;;)if(this.j<a){var b=this.f[this.j],c=this.f[this.j+1];null!=b?b=this.ub=new U(null,2,5,W,[b,c],null):null!=c?(b=Ub(c),b=b.sa()?this.Fa=b:!1):b=!1;this.j+=2;if(b)return!0}else return!1};
wf.prototype.sa=function(){var a=null!=this.ub;return a?a:(a=null!=this.Fa)?a:this.advance()};wf.prototype.next=function(){if(null!=this.ub){var a=this.ub;this.ub=null;return a}if(null!=this.Fa)return a=this.Fa.next(),this.Fa.sa()||(this.Fa=null),a;if(this.advance())return this.next();throw Error("No such element");};wf.prototype.remove=function(){return Error("Unsupported operation")};function xf(a,b,c){this.L=a;this.R=b;this.f=c}g=xf.prototype;
g.Sa=function(a){if(a===this.L)return this;var b=yd(this.R),c=Array(0>b?4:2*(b+1));md(this.f,0,c,0,2*b);return new xf(a,this.R,c)};g.rb=function(){return of.a?of.a(this.f):of.call(null,this.f)};g.Oa=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.R&e))return d;var f=yd(this.R&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.Oa(a+5,b,c,d):rf(c,e)?f:d};
g.Ea=function(a,b,c,d,e,f){var h=1<<(c>>>b&31),k=yd(this.R&h-1);if(0===(this.R&h)){var l=yd(this.R);if(2*l<this.f.length){a=this.Sa(a);b=a.f;f.M=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.R|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=yf.Ea(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.R>>>d&1)&&(k[d]=null!=this.f[e]?yf.Ea(a,b+5,jc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new vf(a,l+1,k)}b=Array(2*(l+4));md(this.f,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;md(this.f,2*k,b,2*(k+1),2*(l-k));f.M=!0;a=this.Sa(a);a.f=b;a.R|=h;return a}l=this.f[2*k];h=this.f[2*k+1];if(null==l)return l=h.Ea(a,b+5,c,d,e,f),l===h?this:uf(this,a,2*k+1,l);if(rf(d,l))return e===h?this:uf(this,a,2*k+1,e);f.M=!0;f=b+5;d=qf.Z?qf.Z(a,f,l,h,c,d,e):qf.call(null,a,f,l,h,c,d,e);e=2*k;
k=2*k+1;a=this.Sa(a);a.f[e]=null;a.f[k]=d;return a};
g.Da=function(a,b,c,d,e){var f=1<<(b>>>a&31),h=yd(this.R&f-1);if(0===(this.R&f)){var k=yd(this.R);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=yf.Da(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.R>>>c&1)&&(h[c]=null!=this.f[d]?yf.Da(a+5,jc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new vf(null,k+1,h)}a=Array(2*(k+1));md(this.f,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;md(this.f,2*h,a,2*(h+1),2*(k-h));e.M=!0;return new xf(null,this.R|f,a)}var l=this.f[2*h],f=this.f[2*h+1];if(null==l)return k=f.Da(a+5,b,c,d,e),k===f?this:new xf(null,this.R,sf(this.f,2*h+1,k));if(rf(c,l))return d===f?this:new xf(null,this.R,sf(this.f,2*h+1,d));e.M=!0;e=this.R;k=this.f;a+=5;a=qf.Y?qf.Y(a,l,f,b,c,d):qf.call(null,a,l,f,b,c,d);c=2*h;h=2*h+1;d=Oa(k);d[c]=null;d[h]=a;return new xf(null,e,d)};
g.sb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.R&d))return this;var e=yd(this.R&d-1),f=this.f[2*e],h=this.f[2*e+1];return null==f?(a=h.sb(a+5,b,c),a===h?this:null!=a?new xf(null,this.R,sf(this.f,2*e+1,a)):this.R===d?null:new xf(null,this.R^d,tf(this.f,e))):rf(c,f)?new xf(null,this.R^d,tf(this.f,e)):this};g.Ba=function(){return new wf(this.f,0,null,null)};var yf=new xf(null,0,[]);function zf(a,b,c){this.f=a;this.j=b;this.Fa=c}
zf.prototype.sa=function(){for(var a=this.f.length;;){if(null!=this.Fa&&this.Fa.sa())return!0;if(this.j<a){var b=this.f[this.j];this.j+=1;null!=b&&(this.Fa=Ub(b))}else return!1}};zf.prototype.next=function(){if(this.sa())return this.Fa.next();throw Error("No such element");};zf.prototype.remove=function(){return Error("Unsupported operation")};function vf(a,b,c){this.L=a;this.l=b;this.f=c}g=vf.prototype;g.Sa=function(a){return a===this.L?this:new vf(a,this.l,Oa(this.f))};
g.rb=function(){return pf.a?pf.a(this.f):pf.call(null,this.f)};g.Oa=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.Oa(a+5,b,c,d):d};g.Ea=function(a,b,c,d,e,f){var h=c>>>b&31,k=this.f[h];if(null==k)return a=uf(this,a,h,yf.Ea(a,b+5,c,d,e,f)),a.l+=1,a;b=k.Ea(a,b+5,c,d,e,f);return b===k?this:uf(this,a,h,b)};
g.Da=function(a,b,c,d,e){var f=b>>>a&31,h=this.f[f];if(null==h)return new vf(null,this.l+1,sf(this.f,f,yf.Da(a+5,b,c,d,e)));a=h.Da(a+5,b,c,d,e);return a===h?this:new vf(null,this.l,sf(this.f,f,a))};
g.sb=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.sb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.l)a:{e=this.f;a=e.length;b=Array(2*(this.l-1));c=0;for(var f=1,h=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,h|=1<<c),c+=1;else{d=new xf(null,h,b);break a}}else d=new vf(null,this.l-1,sf(this.f,d,a));else d=new vf(null,this.l,sf(this.f,d,a));return d}return this};g.Ba=function(){return new zf(this.f,0,null)};
function Af(a,b,c){b*=2;for(var d=0;;)if(d<b){if(rf(c,a[d]))return d;d+=2}else return-1}function Bf(a,b,c,d){this.L=a;this.La=b;this.l=c;this.f=d}g=Bf.prototype;g.Sa=function(a){if(a===this.L)return this;var b=Array(2*(this.l+1));md(this.f,0,b,0,2*this.l);return new Bf(a,this.La,this.l,b)};g.rb=function(){return of.a?of.a(this.f):of.call(null,this.f)};g.Oa=function(a,b,c,d){a=Af(this.f,this.l,c);return 0>a?d:rf(c,this.f[a])?this.f[a+1]:d};
g.Ea=function(a,b,c,d,e,f){if(c===this.La){b=Af(this.f,this.l,d);if(-1===b){if(this.f.length>2*this.l)return b=2*this.l,c=2*this.l+1,a=this.Sa(a),a.f[b]=d,a.f[c]=e,f.M=!0,a.l+=1,a;c=this.f.length;b=Array(c+2);md(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.M=!0;d=this.l+1;a===this.L?(this.f=b,this.l=d,a=this):a=new Bf(this.L,this.La,d,b);return a}return this.f[b+1]===e?this:uf(this,a,b+1,e)}return(new xf(a,1<<(this.La>>>b&31),[null,this,null,null])).Ea(a,b,c,d,e,f)};
g.Da=function(a,b,c,d,e){return b===this.La?(a=Af(this.f,this.l,c),-1===a?(a=2*this.l,b=Array(a+2),md(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.M=!0,new Bf(null,this.La,this.l+1,b)):ec.b(this.f[a],d)?this:new Bf(null,this.La,this.l,sf(this.f,a+1,d))):(new xf(null,1<<(this.La>>>a&31),[null,this])).Da(a,b,c,d,e)};g.sb=function(a,b,c){a=Af(this.f,this.l,c);return-1===a?this:1===this.l?null:new Bf(null,this.La,this.l-1,tf(this.f,xd(a)))};g.Ba=function(){return new wf(this.f,0,null,null)};
var qf=function qf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return qf.Y(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return qf.Z(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
qf.Y=function(a,b,c,d,e,f){var h=jc(b);if(h===d)return new Bf(null,h,2,[b,c,e,f]);var k=new nf;return yf.Da(a,h,b,c,k).Da(a,d,e,f,k)};qf.Z=function(a,b,c,d,e,f,h){var k=jc(c);if(k===e)return new Bf(null,k,2,[c,d,f,h]);var l=new nf;return yf.Ea(a,b,k,c,d,l).Ea(a,b,e,f,h,l)};qf.A=7;function Cf(a,b,c,d,e){this.o=a;this.Pa=b;this.j=c;this.D=d;this.s=e;this.i=32374860;this.B=0}g=Cf.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.o};
g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.X=function(){return Dc(L,this.o)};g.$=function(a,b){return Sc.b(b,this)};g.aa=function(a,b,c){return Sc.c(b,c,this)};g.ba=function(){return null==this.D?new U(null,2,5,W,[this.Pa[this.j],this.Pa[this.j+1]],null):K(this.D)};
g.ra=function(){if(null==this.D){var a=this.Pa,b=this.j+2;return of.c?of.c(a,b,null):of.call(null,a,b,null)}var a=this.Pa,b=this.j,c=M(this.D);return of.c?of.c(a,b,c):of.call(null,a,b,c)};g.T=function(){return this};g.P=function(a,b){return new Cf(b,this.Pa,this.j,this.D,this.s)};g.U=function(a,b){return O(b,this)};Cf.prototype[Ma]=function(){return tc(this)};
var of=function of(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return of.a(arguments[0]);case 3:return of.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};of.a=function(a){return of.c(a,0,null)};
of.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new Cf(null,a,b,null,null);var d=a[b+1];if(y(d)&&(d=d.rb(),y(d)))return new Cf(null,a,b+2,d,null);b+=2}else return null;else return new Cf(null,a,b,c,null)};of.A=3;function Df(a,b,c,d,e){this.o=a;this.Pa=b;this.j=c;this.D=d;this.s=e;this.i=32374860;this.B=0}g=Df.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.o};
g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.X=function(){return Dc(L,this.o)};g.$=function(a,b){return Sc.b(b,this)};g.aa=function(a,b,c){return Sc.c(b,c,this)};g.ba=function(){return K(this.D)};g.ra=function(){var a=this.Pa,b=this.j,c=M(this.D);return pf.u?pf.u(null,a,b,c):pf.call(null,null,a,b,c)};g.T=function(){return this};g.P=function(a,b){return new Df(b,this.Pa,this.j,this.D,this.s)};g.U=function(a,b){return O(b,this)};
Df.prototype[Ma]=function(){return tc(this)};var pf=function pf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return pf.a(arguments[0]);case 4:return pf.u(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};pf.a=function(a){return pf.u(null,a,0,null)};
pf.u=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(y(e)&&(e=e.rb(),y(e)))return new Df(a,b,c+1,e,null);c+=1}else return null;else return new Df(a,b,c,d,null)};pf.A=4;mf;function Ef(a,b,c){this.ya=a;this.Vb=b;this.Jb=c}Ef.prototype.sa=function(){return this.Jb&&this.Vb.sa()};Ef.prototype.next=function(){if(this.Jb)return this.Vb.next();this.Jb=!0;return this.ya};Ef.prototype.remove=function(){return Error("Unsupported operation")};
function Yc(a,b,c,d,e,f){this.o=a;this.l=b;this.root=c;this.ua=d;this.ya=e;this.s=f;this.i=16123663;this.B=8196}g=Yc.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.keys=function(){return tc(gf.a?gf.a(this):gf.call(null,this))};g.entries=function(){return bf(J(this))};g.values=function(){return tc(hf.a?hf.a(this):hf.call(null,this))};g.has=function(a){return qd(this,a)};g.get=function(a,b){return this.G(null,a,b)};
g.forEach=function(a){for(var b=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.V(null,e),h=P(f,0),f=P(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=J(b))kd(b)?(c=Mb(b),b=Nb(b),h=c,d=Vc(c),c=h):(c=K(b),h=P(c,0),f=P(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return bb.c(this,b,null)};g.G=function(a,b,c){return null==b?this.ua?this.ya:c:null==this.root?c:this.root.Oa(0,jc(b),b,c)};
g.Ba=function(){var a=this.root?Ub(this.root):Wd;return this.ua?new Ef(this.ya,a,!1):a};g.O=function(){return this.o};g.W=function(){return this.l};g.N=function(){var a=this.s;return null!=a?a:this.s=a=zc(this)};g.w=function(a,b){return Ze(this,b)};g.Xa=function(){return new mf({},this.root,this.l,this.ua,this.ya)};g.X=function(){return qb($c,this.o)};
g.xb=function(a,b){if(null==b)return this.ua?new Yc(this.o,this.l-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.sb(0,jc(b),b);return c===this.root?this:new Yc(this.o,this.l-1,c,this.ua,this.ya,null)};g.Na=function(a,b,c){if(null==b)return this.ua&&c===this.ya?this:new Yc(this.o,this.ua?this.l:this.l+1,this.root,!0,c,null);a=new nf;b=(null==this.root?yf:this.root).Da(0,jc(b),b,c,a);return b===this.root?this:new Yc(this.o,a.M?this.l+1:this.l,b,this.ua,this.ya,null)};
g.Db=function(a,b){return null==b?this.ua:null==this.root?!1:this.root.Oa(0,jc(b),b,nd)!==nd};g.T=function(){if(0<this.l){var a=null!=this.root?this.root.rb():null;return this.ua?O(new U(null,2,5,W,[null,this.ya],null),a):a}return null};g.P=function(a,b){return new Yc(b,this.l,this.root,this.ua,this.ya,this.s)};
g.U=function(a,b){if(hd(b))return db(this,G.b(b,0),G.b(b,1));for(var c=this,d=J(b);;){if(null==d)return c;var e=K(d);if(hd(e))c=db(c,G.b(e,0),G.b(e,1)),d=M(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.G(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.G(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.G(null,a,b)};var $c=new Yc(null,0,null,!1,null,Ac);Yc.prototype[Ma]=function(){return tc(this)};
function mf(a,b,c,d,e){this.L=a;this.root=b;this.count=c;this.ua=d;this.ya=e;this.i=258;this.B=56}function Ff(a,b,c){if(a.L){if(null==b)a.ya!==c&&(a.ya=c),a.ua||(a.count+=1,a.ua=!0);else{var d=new nf;b=(null==a.root?yf:a.root).Ea(a.L,0,jc(b),b,c,d);b!==a.root&&(a.root=b);d.M&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}g=mf.prototype;g.W=function(){if(this.L)return this.count;throw Error("count after persistent!");};
g.J=function(a,b){return null==b?this.ua?this.ya:null:null==this.root?null:this.root.Oa(0,jc(b),b)};g.G=function(a,b,c){return null==b?this.ua?this.ya:c:null==this.root?c:this.root.Oa(0,jc(b),b,c)};
g.nb=function(a,b){var c;a:if(this.L)if(null!=b?b.i&2048||b.ac||(b.i?0:B(gb,b)):B(gb,b))c=Ff(this,Bd.a?Bd.a(b):Bd.call(null,b),Cd.a?Cd.a(b):Cd.call(null,b));else{c=J(b);for(var d=this;;){var e=K(c);if(y(e))c=M(c),d=Ff(d,Bd.a?Bd.a(e):Bd.call(null,e),Cd.a?Cd.a(e):Cd.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};g.ob=function(){var a;if(this.L)this.L=null,a=new Yc(null,this.count,this.root,this.ua,this.ya,null);else throw Error("persistent! called twice");return a};
g.mb=function(a,b,c){return Ff(this,b,c)};Gf;Hf;function Hf(a,b,c,d,e){this.key=a;this.M=b;this.left=c;this.right=d;this.s=e;this.i=32402207;this.B=0}g=Hf.prototype;g.replace=function(a,b,c,d){return new Hf(a,b,c,d,null)};g.J=function(a,b){return G.c(this,b,null)};g.G=function(a,b,c){return G.c(this,b,c)};g.V=function(a,b){return 0===b?this.key:1===b?this.M:null};g.xa=function(a,b,c){return 0===b?this.key:1===b?this.M:c};
g.Ra=function(a,b,c){return(new U(null,2,5,W,[this.key,this.M],null)).Ra(null,b,c)};g.O=function(){return null};g.W=function(){return 2};g.ib=function(){return this.key};g.jb=function(){return this.M};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.X=function(){return Uc};g.$=function(a,b){return Hc(this,b)};g.aa=function(a,b,c){return Ic(this,b,c)};g.Na=function(a,b,c){return Zc.c(new U(null,2,5,W,[this.key,this.M],null),b,c)};
g.T=function(){return Ua(Ua(L,this.M),this.key)};g.P=function(a,b){return Dc(new U(null,2,5,W,[this.key,this.M],null),b)};g.U=function(a,b){return new U(null,3,5,W,[this.key,this.M,b],null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.G(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.G(null,c,d)};return a}();
g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.G(null,a,b)};Hf.prototype[Ma]=function(){return tc(this)};function Gf(a,b,c,d,e){this.key=a;this.M=b;this.left=c;this.right=d;this.s=e;this.i=32402207;this.B=0}g=Gf.prototype;g.replace=function(a,b,c,d){return new Gf(a,b,c,d,null)};g.J=function(a,b){return G.c(this,b,null)};g.G=function(a,b,c){return G.c(this,b,c)};
g.V=function(a,b){return 0===b?this.key:1===b?this.M:null};g.xa=function(a,b,c){return 0===b?this.key:1===b?this.M:c};g.Ra=function(a,b,c){return(new U(null,2,5,W,[this.key,this.M],null)).Ra(null,b,c)};g.O=function(){return null};g.W=function(){return 2};g.ib=function(){return this.key};g.jb=function(){return this.M};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.X=function(){return Uc};g.$=function(a,b){return Hc(this,b)};
g.aa=function(a,b,c){return Ic(this,b,c)};g.Na=function(a,b,c){return Zc.c(new U(null,2,5,W,[this.key,this.M],null),b,c)};g.T=function(){return Ua(Ua(L,this.M),this.key)};g.P=function(a,b){return Dc(new U(null,2,5,W,[this.key,this.M],null),b)};g.U=function(a,b){return new U(null,3,5,W,[this.key,this.M,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.G(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.G(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.G(null,a,b)};Gf.prototype[Ma]=function(){return tc(this)};Bd;
var Bc=function Bc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Bc.m(0<c.length?new pc(c.slice(0),0):null)};Bc.m=function(a){for(var b=J(a),c=Eb($c);;)if(b){a=M(M(b));var d=K(b),b=K(M(b)),c=Hb(c,d,b),b=a}else return Gb(c)};Bc.A=0;Bc.H=function(a){return Bc.m(J(a))};function If(a,b){this.F=a;this.wa=b;this.i=32374988;this.B=0}g=If.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.wa};
g.qa=function(){var a=(null!=this.F?this.F.i&128||this.F.yb||(this.F.i?0:B(Za,this.F)):B(Za,this.F))?this.F.qa(null):M(this.F);return null==a?null:new If(a,this.wa)};g.N=function(){return xc(this)};g.w=function(a,b){return Cc(this,b)};g.X=function(){return Dc(L,this.wa)};g.$=function(a,b){return Sc.b(b,this)};g.aa=function(a,b,c){return Sc.c(b,c,this)};g.ba=function(){return this.F.ba(null).ib(null)};
g.ra=function(){var a=(null!=this.F?this.F.i&128||this.F.yb||(this.F.i?0:B(Za,this.F)):B(Za,this.F))?this.F.qa(null):M(this.F);return null!=a?new If(a,this.wa):L};g.T=function(){return this};g.P=function(a,b){return new If(this.F,b)};g.U=function(a,b){return O(b,this)};If.prototype[Ma]=function(){return tc(this)};function gf(a){return(a=J(a))?new If(a,null):null}function Bd(a){return hb(a)}function Jf(a,b){this.F=a;this.wa=b;this.i=32374988;this.B=0}g=Jf.prototype;g.toString=function(){return Wb(this)};
g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.wa};g.qa=function(){var a=(null!=this.F?this.F.i&128||this.F.yb||(this.F.i?0:B(Za,this.F)):B(Za,this.F))?this.F.qa(null):M(this.F);return null==a?null:new Jf(a,this.wa)};g.N=function(){return xc(this)};g.w=function(a,b){return Cc(this,b)};g.X=function(){return Dc(L,this.wa)};g.$=function(a,b){return Sc.b(b,this)};g.aa=function(a,b,c){return Sc.c(b,c,this)};g.ba=function(){return this.F.ba(null).jb(null)};
g.ra=function(){var a=(null!=this.F?this.F.i&128||this.F.yb||(this.F.i?0:B(Za,this.F)):B(Za,this.F))?this.F.qa(null):M(this.F);return null!=a?new Jf(a,this.wa):L};g.T=function(){return this};g.P=function(a,b){return new Jf(this.F,b)};g.U=function(a,b){return O(b,this)};Jf.prototype[Ma]=function(){return tc(this)};function hf(a){return(a=J(a))?new Jf(a,null):null}function Cd(a){return jb(a)}
var Kf=function Kf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Kf.m(0<c.length?new pc(c.slice(0),0):null)};Kf.m=function(a){return y(ce(a))?Pa.b(function(a,c){return Tc.b(y(a)?a:$d,c)},a):null};Kf.A=0;Kf.H=function(a){return Kf.m(J(a))};Lf;function Mf(a){this.ab=a}Mf.prototype.sa=function(){return this.ab.sa()};Mf.prototype.next=function(){if(this.ab.sa())return this.ab.next().I[0];throw Error("No such element");};Mf.prototype.remove=function(){return Error("Unsupported operation")};
function Nf(a,b,c){this.o=a;this.Ta=b;this.s=c;this.i=15077647;this.B=8196}g=Nf.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.keys=function(){return tc(J(this))};g.entries=function(){var a=J(this);return new cf(J(a))};g.values=function(){return tc(J(this))};g.has=function(a){return qd(this,a)};
g.forEach=function(a){for(var b=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.V(null,e),h=P(f,0),f=P(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=J(b))kd(b)?(c=Mb(b),b=Nb(b),h=c,d=Vc(c),c=h):(c=K(b),h=P(c,0),f=P(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return bb.c(this,b,null)};g.G=function(a,b,c){return cb(this.Ta,b)?b:c};g.Ba=function(){return new Mf(Ub(this.Ta))};g.O=function(){return this.o};g.W=function(){return Ra(this.Ta)};
g.N=function(){var a=this.s;return null!=a?a:this.s=a=zc(this)};g.w=function(a,b){return ed(b)&&Vc(this)===Vc(b)&&be(function(a){return function(b){return qd(a,b)}}(this),b)};g.Xa=function(){return new Lf(Eb(this.Ta))};g.X=function(){return Dc(Of,this.o)};g.T=function(){return gf(this.Ta)};g.P=function(a,b){return new Nf(b,this.Ta,this.s)};g.U=function(a,b){return new Nf(this.o,Zc.c(this.Ta,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.G(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.G(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.G(null,a,b)};var Of=new Nf(null,$d,Ac);Nf.prototype[Ma]=function(){return tc(this)};
function Lf(a){this.Ma=a;this.B=136;this.i=259}g=Lf.prototype;g.nb=function(a,b){this.Ma=Hb(this.Ma,b,null);return this};g.ob=function(){return new Nf(null,Gb(this.Ma),null)};g.W=function(){return Vc(this.Ma)};g.J=function(a,b){return bb.c(this,b,null)};g.G=function(a,b,c){return bb.c(this.Ma,b,nd)===nd?c:b};
g.call=function(){function a(a,b,c){return bb.c(this.Ma,b,nd)===nd?c:b}function b(a,b){return bb.c(this.Ma,b,nd)===nd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return bb.c(this.Ma,a,nd)===nd?null:a};g.b=function(a,b){return bb.c(this.Ma,a,nd)===nd?b:a};
function Ad(a){if(null!=a&&(a.B&4096||a.cc))return a.kb(null);if("string"===typeof a)return a;throw Error([E("Doesn't support name: "),E(a)].join(""));}function Pf(a,b){for(var c=Eb($d),d=J(a),e=J(b);;)if(d&&e)var f=K(d),h=K(e),c=Hb(c,f,h),d=M(d),e=M(e);else return Gb(c)}function Qf(a,b,c){this.j=a;this.end=b;this.step=c}Qf.prototype.sa=function(){return 0<this.step?this.j<this.end:this.j>this.end};Qf.prototype.next=function(){var a=this.j;this.j+=this.step;return a};
function Rf(a,b,c,d,e){this.o=a;this.start=b;this.end=c;this.step=d;this.s=e;this.i=32375006;this.B=8192}g=Rf.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.V=function(a,b){if(b<Ra(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};g.xa=function(a,b,c){return b<Ra(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};
g.Ba=function(){return new Qf(this.start,this.end,this.step)};g.O=function(){return this.o};g.qa=function(){return 0<this.step?this.start+this.step<this.end?new Rf(this.o,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Rf(this.o,this.start+this.step,this.end,this.step,null):null};g.W=function(){return Ka(xb(this))?0:Math.ceil((this.end-this.start)/this.step)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};
g.X=function(){return Dc(L,this.o)};g.$=function(a,b){return Hc(this,b)};g.aa=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.b?b.b(c,a):b.call(null,c,a);if(Gc(c))return N.a?N.a(c):N.call(null,c);a+=this.step}else return c};g.ba=function(){return null==xb(this)?null:this.start};g.ra=function(){return null!=xb(this)?new Rf(this.o,this.start+this.step,this.end,this.step,null):L};
g.T=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};g.P=function(a,b){return new Rf(b,this.start,this.end,this.step,this.s)};g.U=function(a,b){return O(b,this)};Rf.prototype[Ma]=function(){return tc(this)};
function Pe(a,b,c,d,e,f,h){var k=ua;ua=null==ua?null:ua-1;try{if(null!=ua&&0>ua)return Ab(a,"#");Ab(a,c);if(0===Ca.a(f))J(h)&&Ab(a,function(){var a=Sf.a(f);return y(a)?a:"..."}());else{if(J(h)){var l=K(h);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=M(h),n=Ca.a(f)-1;;)if(!m||null!=n&&0===n){J(m)&&0===n&&(Ab(a,d),Ab(a,function(){var a=Sf.a(f);return y(a)?a:"..."}()));break}else{Ab(a,d);var p=K(m);c=a;h=f;b.c?b.c(p,c,h):b.call(null,p,c,h);var q=M(m);c=n-1;m=q;n=c}}return Ab(a,e)}finally{ua=k}}
function Tf(a,b){for(var c=J(b),d=null,e=0,f=0;;)if(f<e){var h=d.V(null,f);Ab(a,h);f+=1}else if(c=J(c))d=c,kd(d)?(c=Mb(d),e=Nb(d),d=c,h=Vc(c),c=e,e=h):(h=K(d),Ab(a,h),c=M(d),d=null,e=0),f=0;else return null}var Uf={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Vf(a){return[E('"'),E(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Uf[a]})),E('"')].join("")}Wf;
function Xf(a,b){var c=pd(I.b(a,Aa));return c?(c=null!=b?b.i&131072||b.bc?!0:!1:!1)?null!=dd(b):c:c}
function Yf(a,b,c){if(null==a)return Ab(b,"nil");if(Xf(c,a)){Ab(b,"^");var d=dd(a);Qe.c?Qe.c(d,b,c):Qe.call(null,d,b,c);Ab(b," ")}if(a.Ib)return a.Tb(a,b,c);if(null!=a&&(a.i&2147483648||a.S))return a.K(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Ab(b,""+E(a));if(null!=a&&a.constructor===Object)return Ab(b,"#js "),d=Q.b(function(b){return new U(null,2,5,W,[Jd.a(b),a[b]],null)},ld(a)),Wf.u?Wf.u(d,Qe,b,c):Wf.call(null,d,Qe,b,c);if(Ja(a))return Pe(b,Qe,"#js ["," ","]",c,a);if("string"==typeof a)return y(za.a(c))?
Ab(b,Vf(a)):Ab(b,a);if("function"==u(a)){var e=a.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Tf(b,nc(["#object[",c,' "',""+E(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+E(a);;)if(Vc(c)<b)c=[E("0"),E(c)].join("");else return c},Tf(b,nc(['#inst "',""+E(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),
3),"-",'00:00"'],0));if(a instanceof RegExp)return Tf(b,nc(['#"',a.source,'"'],0));if(null!=a&&(a.i&2147483648||a.S))return Bb(a,b,c);if(y(a.constructor.pb))return Tf(b,nc(["#object[",a.constructor.pb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Tf(b,nc(["#object[",c," ",""+E(a),"]"],0))}function Qe(a,b,c){var d=Zf.a(c);return y(d)?(c=Zc.c(c,$f,Yf),d.c?d.c(a,b,c):d.call(null,a,b,c)):Yf(a,b,c)}
var ie=function ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ie.m(0<c.length?new pc(c.slice(0),0):null)};ie.m=function(a){var b=wa();if(null==a||Ka(J(a)))b="";else{var c=E,d=new ka;a:{var e=new Vb(d);Qe(K(a),e,b);a=J(M(a));for(var f=null,h=0,k=0;;)if(k<h){var l=f.V(null,k);Ab(e," ");Qe(l,e,b);k+=1}else if(a=J(a))f=a,kd(f)?(a=Mb(f),h=Nb(f),f=a,l=Vc(a),a=h,h=l):(l=K(f),Ab(e," "),Qe(l,e,b),a=M(f),f=null,h=0),k=0;else break a}b=""+c(d)}return b};
ie.A=0;ie.H=function(a){return ie.m(J(a))};function Wf(a,b,c,d){return Pe(c,function(a,c,d){var k=hb(a);b.c?b.c(k,c,d):b.call(null,k,c,d);Ab(c," ");a=jb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,J(a))}ne.prototype.S=!0;ne.prototype.K=function(a,b,c){Ab(b,"#object [cljs.core.Volatile ");Qe(new xa(null,1,[ag,this.state],null),b,c);return Ab(b,"]")};pc.prototype.S=!0;pc.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Kd.prototype.S=!0;
Kd.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Cf.prototype.S=!0;Cf.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Hf.prototype.S=!0;Hf.prototype.K=function(a,b,c){return Pe(b,Qe,"["," ","]",c,this)};ff.prototype.S=!0;ff.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};vc.prototype.S=!0;vc.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};jd.prototype.S=!0;jd.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};
Gd.prototype.S=!0;Gd.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Nc.prototype.S=!0;Nc.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Yc.prototype.S=!0;Yc.prototype.K=function(a,b,c){return Wf(this,Qe,b,c)};Df.prototype.S=!0;Df.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Ue.prototype.S=!0;Ue.prototype.K=function(a,b,c){return Pe(b,Qe,"["," ","]",c,this)};Nf.prototype.S=!0;Nf.prototype.K=function(a,b,c){return Pe(b,Qe,"#{"," ","}",c,this)};
id.prototype.S=!0;id.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};fe.prototype.S=!0;fe.prototype.K=function(a,b,c){Ab(b,"#object [cljs.core.Atom ");Qe(new xa(null,1,[ag,this.state],null),b,c);return Ab(b,"]")};Jf.prototype.S=!0;Jf.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Gf.prototype.S=!0;Gf.prototype.K=function(a,b,c){return Pe(b,Qe,"["," ","]",c,this)};U.prototype.S=!0;U.prototype.K=function(a,b,c){return Pe(b,Qe,"["," ","]",c,this)};Fd.prototype.S=!0;
Fd.prototype.K=function(a,b){return Ab(b,"()")};ae.prototype.S=!0;ae.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};xa.prototype.S=!0;xa.prototype.K=function(a,b,c){return Wf(this,Qe,b,c)};Rf.prototype.S=!0;Rf.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};If.prototype.S=!0;If.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};Oc.prototype.S=!0;Oc.prototype.K=function(a,b,c){return Pe(b,Qe,"("," ",")",c,this)};dc.prototype.gb=!0;
dc.prototype.Wa=function(a,b){if(b instanceof dc)return lc(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};A.prototype.gb=!0;A.prototype.Wa=function(a,b){if(b instanceof A)return Hd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};Ue.prototype.gb=!0;Ue.prototype.Wa=function(a,b){if(hd(b))return rd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};U.prototype.gb=!0;
U.prototype.Wa=function(a,b){if(hd(b))return rd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};var bg=null;function cg(a){null==bg&&(bg=ge.a?ge.a(0):ge.call(null,0));return mc.a([E(a),E(me.b(bg,Ec))].join(""))}function dg(a){return function(b,c){var d=a.b?a.b(b,c):a.call(null,b,c);return Gc(d)?new Fc(d):d}}
function ue(a){return function(b){return function(){function c(a,c){return Pa.c(b,a,c)}function d(b){return a.a?a.a(b):a.call(null,b)}function e(){return a.v?a.v():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.v=e;f.a=d;f.b=c;return f}()}(dg(a))}eg;function fg(){}
var gg=function gg(b){if(null!=b&&null!=b.Zb)return b.Zb(b);var c=gg[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=gg._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEncodeJS.-clj-\x3ejs",b);};hg;function ig(a){return(null!=a?a.Yb||(a.kc?0:B(fg,a)):B(fg,a))?gg(a):"string"===typeof a||"number"===typeof a||a instanceof A||a instanceof dc?hg.a?hg.a(a):hg.call(null,a):ie.m(nc([a],0))}
var hg=function hg(b){if(null==b)return null;if(null!=b?b.Yb||(b.kc?0:B(fg,b)):B(fg,b))return gg(b);if(b instanceof A)return Ad(b);if(b instanceof dc)return""+E(b);if(gd(b)){var c={};b=J(b);for(var d=null,e=0,f=0;;)if(f<e){var h=d.V(null,f),k=P(h,0),h=P(h,1);c[ig(k)]=hg(h);f+=1}else if(b=J(b))kd(b)?(e=Mb(b),b=Nb(b),d=e,e=Vc(e)):(e=K(b),d=P(e,0),e=P(e,1),c[ig(d)]=hg(e),b=M(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.i&8||b.xc||(b.i?0:B(Ta,b)):B(Ta,b)){c=[];b=J(Q.b(hg,b));d=null;for(f=
e=0;;)if(f<e)k=d.V(null,f),c.push(k),f+=1;else if(b=J(b))d=b,kd(d)?(b=Mb(d),f=Nb(d),d=b,e=Vc(b),b=f):(b=K(d),c.push(b),b=M(d),d=null,e=0),f=0;else break;return c}return b},eg=function eg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return eg.v();case 1:return eg.a(arguments[0]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};eg.v=function(){return eg.a(1)};eg.a=function(a){return Math.random()*a};eg.A=1;var jg=null;
function kg(){if(null==jg){var a=new xa(null,3,[lg,$d,mg,$d,ng,$d],null);jg=ge.a?ge.a(a):ge.call(null,a)}return jg}function og(a,b,c){var d=ec.b(b,c);if(!d&&!(d=qd(ng.a(a).call(null,b),c))&&(d=hd(c))&&(d=hd(b)))if(d=Vc(c)===Vc(b))for(var d=!0,e=0;;)if(d&&e!==Vc(c))d=og(a,b.a?b.a(e):b.call(null,e),c.a?c.a(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function pg(a){var b;b=kg();b=N.a?N.a(b):N.call(null,b);return Vd(I.b(lg.a(b),a))}
function qg(a,b,c,d){me.b(a,function(){return N.a?N.a(b):N.call(null,b)});me.b(c,function(){return N.a?N.a(d):N.call(null,d)})}var rg=function rg(b,c,d){var e=(N.a?N.a(d):N.call(null,d)).call(null,b),e=y(y(e)?e.a?e.a(c):e.call(null,c):e)?!0:null;if(y(e))return e;e=function(){for(var e=pg(c);;)if(0<Vc(e))rg(b,K(e),d),e=rc(e);else return null}();if(y(e))return e;e=function(){for(var e=pg(b);;)if(0<Vc(e))rg(K(e),c,d),e=rc(e);else return null}();return y(e)?e:!1};
function sg(a,b,c){c=rg(a,b,c);if(y(c))a=c;else{c=og;var d;d=kg();d=N.a?N.a(d):N.call(null,d);a=c(d,a,b)}return a}
var tg=function tg(b,c,d,e,f,h,k){var l=Pa.c(function(e,h){var k=P(h,0);P(h,1);if(og(N.a?N.a(d):N.call(null,d),c,k)){var l;l=(l=null==e)?l:sg(k,K(e),f);l=y(l)?h:e;if(!y(sg(K(l),k,f)))throw Error([E("Multiple methods in multimethod '"),E(b),E("' match dispatch value: "),E(c),E(" -\x3e "),E(k),E(" and "),E(K(l)),E(", and neither is preferred")].join(""));return l}return e},null,N.a?N.a(e):N.call(null,e));if(y(l)){if(ec.b(N.a?N.a(k):N.call(null,k),N.a?N.a(d):N.call(null,d)))return me.u(h,Zc,c,K(M(l))),
K(M(l));qg(h,e,k,d);return tg(b,c,d,e,f,h,k)}return null};function Y(a,b){throw Error([E("No method in multimethod '"),E(a),E("' for dispatch value: "),E(b)].join(""));}function vg(a,b,c,d,e,f,h,k){this.name=a;this.h=b;this.lc=c;this.qb=d;this.bb=e;this.sc=f;this.tb=h;this.fb=k;this.i=4194305;this.B=4352}g=vg.prototype;
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,H,S){a=this;var pa=F.m(a.h,b,c,d,e,nc([f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,H,S],0)),ug=Z(this,pa);y(ug)||Y(a.name,pa);return F.m(ug,b,c,d,e,nc([f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,H,S],0))}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,H){a=this;var S=a.h.na?a.h.na(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,H):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,H),pa=Z(this,S);y(pa)||Y(a.name,S);return pa.na?pa.na(b,c,d,e,f,h,k,l,m,n,p,q,r,t,
v,w,z,x,D,H):pa.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,H)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D){a=this;var H=a.h.ma?a.h.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D),S=Z(this,H);y(S)||Y(a.name,H);return S.ma?S.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):S.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x){a=this;var D=a.h.la?a.h.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):a.h.call(null,
b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x),H=Z(this,D);y(H)||Y(a.name,D);return H.la?H.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):H.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){a=this;var x=a.h.ka?a.h.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z),D=Z(this,x);y(D)||Y(a.name,x);return D.ka?D.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):D.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,
w){a=this;var z=a.h.ja?a.h.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w),x=Z(this,z);y(x)||Y(a.name,z);return x.ja?x.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):x.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){a=this;var w=a.h.ia?a.h.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v),z=Z(this,w);y(z)||Y(a.name,w);return z.ia?z.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):z.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)}
function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){a=this;var v=a.h.ha?a.h.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t),w=Z(this,v);y(w)||Y(a.name,v);return w.ha?w.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t):w.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;var t=a.h.ga?a.h.ga(b,c,d,e,f,h,k,l,m,n,p,q,r):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r),v=Z(this,t);y(v)||Y(a.name,t);return v.ga?v.ga(b,c,d,e,f,h,k,l,m,n,p,q,r):v.call(null,b,c,d,e,f,h,k,l,m,n,p,
q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;var r=a.h.fa?a.h.fa(b,c,d,e,f,h,k,l,m,n,p,q):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q),t=Z(this,r);y(t)||Y(a.name,r);return t.fa?t.fa(b,c,d,e,f,h,k,l,m,n,p,q):t.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;var q=a.h.ea?a.h.ea(b,c,d,e,f,h,k,l,m,n,p):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p),r=Z(this,q);y(r)||Y(a.name,q);return r.ea?r.ea(b,c,d,e,f,h,k,l,m,n,p):r.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,
n){a=this;var p=a.h.da?a.h.da(b,c,d,e,f,h,k,l,m,n):a.h.call(null,b,c,d,e,f,h,k,l,m,n),q=Z(this,p);y(q)||Y(a.name,p);return q.da?q.da(b,c,d,e,f,h,k,l,m,n):q.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;var n=a.h.pa?a.h.pa(b,c,d,e,f,h,k,l,m):a.h.call(null,b,c,d,e,f,h,k,l,m),p=Z(this,n);y(p)||Y(a.name,n);return p.pa?p.pa(b,c,d,e,f,h,k,l,m):p.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;var m=a.h.oa?a.h.oa(b,c,d,e,f,h,k,l):a.h.call(null,b,c,d,e,f,h,k,l),n=
Z(this,m);y(n)||Y(a.name,m);return n.oa?n.oa(b,c,d,e,f,h,k,l):n.call(null,b,c,d,e,f,h,k,l)}function t(a,b,c,d,e,f,h,k){a=this;var l=a.h.Z?a.h.Z(b,c,d,e,f,h,k):a.h.call(null,b,c,d,e,f,h,k),m=Z(this,l);y(m)||Y(a.name,l);return m.Z?m.Z(b,c,d,e,f,h,k):m.call(null,b,c,d,e,f,h,k)}function v(a,b,c,d,e,f,h){a=this;var k=a.h.Y?a.h.Y(b,c,d,e,f,h):a.h.call(null,b,c,d,e,f,h),l=Z(this,k);y(l)||Y(a.name,k);return l.Y?l.Y(b,c,d,e,f,h):l.call(null,b,c,d,e,f,h)}function w(a,b,c,d,e,f){a=this;var h=a.h.C?a.h.C(b,c,
d,e,f):a.h.call(null,b,c,d,e,f),k=Z(this,h);y(k)||Y(a.name,h);return k.C?k.C(b,c,d,e,f):k.call(null,b,c,d,e,f)}function z(a,b,c,d,e){a=this;var f=a.h.u?a.h.u(b,c,d,e):a.h.call(null,b,c,d,e),h=Z(this,f);y(h)||Y(a.name,f);return h.u?h.u(b,c,d,e):h.call(null,b,c,d,e)}function D(a,b,c,d){a=this;var e=a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d),f=Z(this,e);y(f)||Y(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function H(a,b,c){a=this;var d=a.h.b?a.h.b(b,c):a.h.call(null,b,c),e=Z(this,d);y(e)||Y(a.name,
d);return e.b?e.b(b,c):e.call(null,b,c)}function S(a,b){a=this;var c=a.h.a?a.h.a(b):a.h.call(null,b),d=Z(this,c);y(d)||Y(a.name,c);return d.a?d.a(b):d.call(null,b)}function pa(a){a=this;var b=a.h.v?a.h.v():a.h.call(null),c=Z(this,b);y(c)||Y(a.name,b);return c.v?c.v():c.call(null)}var x=null,x=function(x,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,$b,$a,ib,vb,Ob,qc,cd,Ee){switch(arguments.length){case 1:return pa.call(this,x);case 2:return S.call(this,x,R);case 3:return H.call(this,x,R,T);case 4:return D.call(this,
x,R,T,V);case 5:return z.call(this,x,R,T,V,X);case 6:return w.call(this,x,R,T,V,X,da);case 7:return v.call(this,x,R,T,V,X,da,ga);case 8:return t.call(this,x,R,T,V,X,da,ga,ja);case 9:return r.call(this,x,R,T,V,X,da,ga,ja,la);case 10:return q.call(this,x,R,T,V,X,da,ga,ja,la,oa);case 11:return p.call(this,x,R,T,V,X,da,ga,ja,la,oa,ra);case 12:return n.call(this,x,R,T,V,X,da,ga,ja,la,oa,ra,Da);case 13:return m.call(this,x,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia);case 14:return l.call(this,x,R,T,V,X,da,ga,ja,la,
oa,ra,Da,Ia,Na);case 15:return k.call(this,x,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,$b);case 16:return h.call(this,x,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,$b,$a);case 17:return f.call(this,x,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,$b,$a,ib);case 18:return e.call(this,x,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,$b,$a,ib,vb);case 19:return d.call(this,x,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,$b,$a,ib,vb,Ob);case 20:return c.call(this,x,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,$b,$a,ib,vb,Ob,qc);case 21:return b.call(this,x,R,T,
V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,$b,$a,ib,vb,Ob,qc,cd);case 22:return a.call(this,x,R,T,V,X,da,ga,ja,la,oa,ra,Da,Ia,Na,$b,$a,ib,vb,Ob,qc,cd,Ee)}throw Error("Invalid arity: "+arguments.length);};x.a=pa;x.b=S;x.c=H;x.u=D;x.C=z;x.Y=w;x.Z=v;x.oa=t;x.pa=r;x.da=q;x.ea=p;x.fa=n;x.ga=m;x.ha=l;x.ia=k;x.ja=h;x.ka=f;x.la=e;x.ma=d;x.na=c;x.Hb=b;x.hb=a;return x}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};
g.v=function(){var a=this.h.v?this.h.v():this.h.call(null),b=Z(this,a);y(b)||Y(this.name,a);return b.v?b.v():b.call(null)};g.a=function(a){var b=this.h.a?this.h.a(a):this.h.call(null,a),c=Z(this,b);y(c)||Y(this.name,b);return c.a?c.a(a):c.call(null,a)};g.b=function(a,b){var c=this.h.b?this.h.b(a,b):this.h.call(null,a,b),d=Z(this,c);y(d)||Y(this.name,c);return d.b?d.b(a,b):d.call(null,a,b)};
g.c=function(a,b,c){var d=this.h.c?this.h.c(a,b,c):this.h.call(null,a,b,c),e=Z(this,d);y(e)||Y(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};g.u=function(a,b,c,d){var e=this.h.u?this.h.u(a,b,c,d):this.h.call(null,a,b,c,d),f=Z(this,e);y(f)||Y(this.name,e);return f.u?f.u(a,b,c,d):f.call(null,a,b,c,d)};g.C=function(a,b,c,d,e){var f=this.h.C?this.h.C(a,b,c,d,e):this.h.call(null,a,b,c,d,e),h=Z(this,f);y(h)||Y(this.name,f);return h.C?h.C(a,b,c,d,e):h.call(null,a,b,c,d,e)};
g.Y=function(a,b,c,d,e,f){var h=this.h.Y?this.h.Y(a,b,c,d,e,f):this.h.call(null,a,b,c,d,e,f),k=Z(this,h);y(k)||Y(this.name,h);return k.Y?k.Y(a,b,c,d,e,f):k.call(null,a,b,c,d,e,f)};g.Z=function(a,b,c,d,e,f,h){var k=this.h.Z?this.h.Z(a,b,c,d,e,f,h):this.h.call(null,a,b,c,d,e,f,h),l=Z(this,k);y(l)||Y(this.name,k);return l.Z?l.Z(a,b,c,d,e,f,h):l.call(null,a,b,c,d,e,f,h)};
g.oa=function(a,b,c,d,e,f,h,k){var l=this.h.oa?this.h.oa(a,b,c,d,e,f,h,k):this.h.call(null,a,b,c,d,e,f,h,k),m=Z(this,l);y(m)||Y(this.name,l);return m.oa?m.oa(a,b,c,d,e,f,h,k):m.call(null,a,b,c,d,e,f,h,k)};g.pa=function(a,b,c,d,e,f,h,k,l){var m=this.h.pa?this.h.pa(a,b,c,d,e,f,h,k,l):this.h.call(null,a,b,c,d,e,f,h,k,l),n=Z(this,m);y(n)||Y(this.name,m);return n.pa?n.pa(a,b,c,d,e,f,h,k,l):n.call(null,a,b,c,d,e,f,h,k,l)};
g.da=function(a,b,c,d,e,f,h,k,l,m){var n=this.h.da?this.h.da(a,b,c,d,e,f,h,k,l,m):this.h.call(null,a,b,c,d,e,f,h,k,l,m),p=Z(this,n);y(p)||Y(this.name,n);return p.da?p.da(a,b,c,d,e,f,h,k,l,m):p.call(null,a,b,c,d,e,f,h,k,l,m)};g.ea=function(a,b,c,d,e,f,h,k,l,m,n){var p=this.h.ea?this.h.ea(a,b,c,d,e,f,h,k,l,m,n):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n),q=Z(this,p);y(q)||Y(this.name,p);return q.ea?q.ea(a,b,c,d,e,f,h,k,l,m,n):q.call(null,a,b,c,d,e,f,h,k,l,m,n)};
g.fa=function(a,b,c,d,e,f,h,k,l,m,n,p){var q=this.h.fa?this.h.fa(a,b,c,d,e,f,h,k,l,m,n,p):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p),r=Z(this,q);y(r)||Y(this.name,q);return r.fa?r.fa(a,b,c,d,e,f,h,k,l,m,n,p):r.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p,q){var r=this.h.ga?this.h.ga(a,b,c,d,e,f,h,k,l,m,n,p,q):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q),t=Z(this,r);y(t)||Y(this.name,r);return t.ga?t.ga(a,b,c,d,e,f,h,k,l,m,n,p,q):t.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){var t=this.h.ha?this.h.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r),v=Z(this,t);y(v)||Y(this.name,t);return v.ha?v.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r):v.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};
g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){var v=this.h.ia?this.h.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t),w=Z(this,v);y(w)||Y(this.name,v);return w.ia?w.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):w.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t)};
g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){var w=this.h.ja?this.h.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v),z=Z(this,w);y(z)||Y(this.name,w);return z.ja?z.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):z.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)};
g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){var z=this.h.ka?this.h.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w),D=Z(this,z);y(D)||Y(this.name,z);return D.ka?D.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):D.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)};
g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){var D=this.h.la?this.h.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z),H=Z(this,D);y(H)||Y(this.name,D);return H.la?H.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):H.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)};
g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D){var H=this.h.ma?this.h.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D),S=Z(this,H);y(S)||Y(this.name,H);return S.ma?S.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):S.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D)};
g.na=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H){var S=this.h.na?this.h.na(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H),pa=Z(this,S);y(pa)||Y(this.name,S);return pa.na?pa.na(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H):pa.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H)};
g.Hb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H,S){var pa=F.m(this.h,a,b,c,d,nc([e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H,S],0)),x=Z(this,pa);y(x)||Y(this.name,pa);return F.m(x,a,b,c,d,nc([e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,H,S],0))};
function Z(a,b){ec.b(N.a?N.a(a.fb):N.call(null,a.fb),N.a?N.a(a.qb):N.call(null,a.qb))||qg(a.tb,a.bb,a.fb,a.qb);var c=(N.a?N.a(a.tb):N.call(null,a.tb)).call(null,b);if(y(c))return c;c=tg(a.name,b,a.qb,a.bb,a.sc,a.tb,a.fb);return y(c)?c:(N.a?N.a(a.bb):N.call(null,a.bb)).call(null,a.lc)}g.kb=function(){return Qb(this.name)};g.lb=function(){return Rb(this.name)};g.N=function(){return this[ba]||(this[ba]=++ca)};var wg=new A(null,"path","path",-188191168),xg=new A(null,"els","els",-1382351487),yg=new A(null,"transform","transform",1381301764),Aa=new A(null,"meta","meta",1499536964),zg=new dc(null,"blockable","blockable",-28395259,null),Ba=new A(null,"dup","dup",556298533),Ag=new A(null,"offset","offset",296498311),Bg=new A(null,"button","button",1456579943),le=new dc(null,"new-value","new-value",-1567397401,null),he=new A(null,"validator","validator",-1966190681),Cg=new A(null,"default","default",-1987822328),
Dg=new A(null,"reset-points","reset-points",-5234839),Eg=new A(null,"width","width",-384071477),Fg=new A(null,"onclick","onclick",1297553739),Gg=new A(null,"midpoint","midpoint",-36269525),ag=new A(null,"val","val",128701612),Hg=new A(null,"type","type",1174270348),ke=new dc(null,"validate","validate",1439230700,null),$f=new A(null,"fallback-impl","fallback-impl",-1501286995),Ig=new A(null,"source","source",-433931539),ya=new A(null,"flush-on-newline","flush-on-newline",-151457939),Jg=new A(null,
"angle","angle",1622094254),Kg=new A(null,"radius","radius",-2073122258),mg=new A(null,"descendants","descendants",1824886031),Lg=new A(null,"center","center",-748944368),ng=new A(null,"ancestors","ancestors",-776045424),qe=new dc(null,"n","n",-2092305744,null),Mg=new A(null,"div","div",1057191632),za=new A(null,"readably","readably",1129599760),Sf=new A(null,"more-marker","more-marker",-14717935),Ng=new A(null,"g","g",1738089905),Og=new A(null,"balance","balance",418967409),Pg=new A(null,"island",
"island",623473715),Ca=new A(null,"print-length","print-length",1931866356),Qg=new A(null,"id","id",-1388402092),Rg=new A(null,"class","class",-2030961996),lg=new A(null,"parents","parents",-2027538891),Sg=new A(null,"svg","svg",856789142),Tg=new A(null,"max-offset","max-offset",-851769098),Ug=new A(null,"radial","radial",-1334240714),Vg=new A(null,"right","right",-452581833),Wg=new A(null,"position","position",-2011731912),Xg=new A(null,"d","d",1972142424),Yg=new A(null,"depth","depth",1768663640),
Zg=new A(null,"rerender","rerender",-1601192263),Zd=new dc(null,"quote","quote",1377916282,null),Yd=new A(null,"arglists","arglists",1661989754),Xd=new dc(null,"nil-iter","nil-iter",1101030523,null),$g=new A(null,"hierarchy","hierarchy",-1053470341),Zf=new A(null,"alt-impl","alt-impl",670969595),ah=new A(null,"rect","rect",-108902628),pe=new dc(null,"number?","number?",-1747282210,null),bh=new A(null,"height","height",1025178622),ch=new A(null,"left","left",-399115937),dh=new A(null,"foreignObject",
"foreignObject",25502111),eh=new dc(null,"f","f",43394975,null);var fh;var gh;a:{var hh=aa.navigator;if(hh){var ih=hh.userAgent;if(ih){gh=ih;break a}}gh=""};function jh(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function kh(a,b,c,d){this.head=a;this.I=b;this.length=c;this.f=d}kh.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.I];this.f[this.I]=null;this.I=(this.I+1)%this.f.length;--this.length;return a};kh.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};
kh.prototype.resize=function(){var a=Array(2*this.f.length);return this.I<this.head?(jh(this.f,this.I,a,0,this.length),this.I=0,this.head=this.length,this.f=a):this.I>this.head?(jh(this.f,this.I,a,0,this.f.length-this.I),jh(this.f,0,a,this.f.length-this.I,this.head),this.I=0,this.head=this.length,this.f=a):this.I===this.head?(this.head=this.I=0,this.f=a):null};if("undefined"===typeof lh)var lh={};var mh;
function nh(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==gh.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ha(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==gh.indexOf("Trident")&&-1==gh.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Lb;c.Lb=null;a()}};return function(a){d.next={Lb:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var oh;oh=new kh(0,0,0,Array(32));var ph=!1,qh=!1;rh;function sh(){ph=!0;qh=!1;for(var a=0;;){var b=oh.pop();if(null!=b&&(b.v?b.v():b.call(null),1024>a)){a+=1;continue}break}ph=!1;return 0<oh.length?rh.v?rh.v():rh.call(null):null}function rh(){var a=qh;if(y(y(a)?ph:a))return null;qh=!0;"function"!=u(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(mh||(mh=nh()),mh(sh)):aa.setImmediate(sh)};for(var th=Array(1),uh=0;;)if(uh<th.length)th[uh]=null,uh+=1;else break;(function(a){"undefined"===typeof fh&&(fh=function(a,c,d){this.mc=a;this.Wb=c;this.pc=d;this.i=393216;this.B=0},fh.prototype.P=function(a,c){return new fh(this.mc,this.Wb,c)},fh.prototype.O=function(){return this.pc},fh.oc=function(){return new U(null,3,5,W,[eh,zg,na.Ec],null)},fh.Ib=!0,fh.pb="cljs.core.async/t_cljs$core$async11301",fh.Tb=function(a,c){return Ab(c,"cljs.core.async/t_cljs$core$async11301")});return new fh(a,!0,$d)})(function(){return null});var vh=VDOM.diff,wh=VDOM.patch,xh=VDOM.create;function yh(a){return we(de(Ga),we(de(od),xe(a)))}function zh(a,b,c){return new VDOM.VHtml(Ad(a),hg(b),hg(c))}function Ah(a,b,c){return new VDOM.VSvg(Ad(a),hg(b),hg(c))}Bh;
var Ch=function Ch(b){if(null==b)return new VDOM.VText("");if(od(b))return zh(Mg,$d,Q.b(Ch,yh(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(ec.b(Sg,K(b)))return Bh.a?Bh.a(b):Bh.call(null,b);var c=P(b,0),d=P(b,1);b=zd(b);return zh(c,d,Q.b(Ch,yh(b)))},Bh=function Bh(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(ec.b(dh,K(b))){var c=P(b,0),d=P(b,1);b=zd(b);return Ah(c,d,Q.b(Ch,yh(b)))}c=P(b,0);d=P(b,1);b=
zd(b);return Ah(c,d,Q.b(Bh,yh(b)))};
function Dh(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return ge.a?ge.a(a):ge.call(null,a)}(),c=function(){var a;a=N.a?N.a(b):N.call(null,b);a=xh.a?xh.a(a):xh.call(null,a);return ge.a?ge.a(a):ge.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.v?a.v():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(N.a?N.a(c):N.call(null,c));return function(a,b,c){return function(d){var l=
Ch(d);d=function(){var b=N.a?N.a(a):N.call(null,a);return vh.b?vh.b(b,l):vh.call(null,b,l)}();je.b?je.b(a,l):je.call(null,a,l);d=function(a,b,c,d){return function(){return me.c(d,wh,b)}}(l,d,a,b,c);return c.a?c.a(d):c.call(null,d)}}(b,c,d)};var Eh=Math.sin,Fh=Math.cos,Gh=2*Math.PI,Hh=Math.sqrt;function Ih(a,b){var c=P(a,0),d=P(a,1),e=P(b,0),f=P(b,1),c=Math.pow(c-e,2)+Math.pow(d-f,2);return Hh.a?Hh.a(c):Hh.call(null,c)}function Jh(a){return Pa.b(vd,a)/Vc(a)};Kh;function Lh(a,b,c,d){this.Za=a;this.eb=b;this.Ja=c;this.s=d;this.i=2229667594;this.B=8192}g=Lh.prototype;g.J=function(a,b){return bb.c(this,b,null)};g.G=function(a,b,c){switch(b instanceof A?b.Ca:null){case "els":return this.Za;default:return I.c(this.Ja,b,c)}};g.K=function(a,b,c){return Pe(b,function(){return function(a){return Pe(b,Qe,""," ","",c,a)}}(this),"#isle.vector.Vector{",", ","}",c,Sd.b(new U(null,1,5,W,[new U(null,2,5,W,[xg,this.Za],null)],null),this.Ja))};
g.Ba=function(){return new $e(0,this,1,new U(null,1,5,W,[xg],null),Ub(this.Ja))};g.O=function(){return this.eb};g.W=function(){return 1+Vc(this.Ja)};g.N=function(){var a=this.s;if(null!=a)return a;a:for(var a=0,b=J(this);;)if(b)var c=K(b),a=(a+(jc(Bd.a?Bd.a(c):Bd.call(null,c))^jc(Cd.a?Cd.a(c):Cd.call(null,c))))%4503599627370496,b=M(b);else break a;return this.s=a};g.w=function(a,b){var c;c=y(b)?(c=this.constructor===b.constructor)?Ze(this,b):c:b;return y(c)?!0:!1};
g.xb=function(a,b){return qd(new Nf(null,new xa(null,1,[xg,null],null),null),b)?ad.b(Dc(ye($d,this),this.eb),b):new Lh(this.Za,this.eb,Vd(ad.b(this.Ja,b)),null)};g.Na=function(a,b,c){return y(Id.b?Id.b(xg,b):Id.call(null,xg,b))?new Lh(c,this.eb,this.Ja,null):new Lh(this.Za,this.eb,Zc.c(this.Ja,b,c),null)};g.T=function(){return J(Sd.b(new U(null,1,5,W,[new U(null,2,5,W,[xg,this.Za],null)],null),this.Ja))};g.P=function(a,b){return new Lh(this.Za,b,this.Ja,this.s)};
g.U=function(a,b){return hd(b)?db(this,G.b(b,0),G.b(b,1)):Pa.c(Ua,this,b)};function Kh(a){return new Lh(a,null,null,null)};function Mh(a){var b=P(a,0);a=P(a,1);return[E(b),E(","),E(a)].join("")}function Nh(a){a=Q.b(Mh,a);a=re(1,te.b(se("L"),a));a=hg(a).join("");return[E("M"),E(a)].join("")};var sa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new pc(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Ea.a?Ea.a(a):Ea.call(null,a))}a.A=0;a.H=function(a){a=J(a);return b(a)};a.m=b;return a}(),ta=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new pc(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,
Ea.a?Ea.a(a):Ea.call(null,a))}a.A=0;a.H=function(a){a=J(a);return b(a)};a.m=b;return a}(),Oh=function Oh(b,c){var d=Ae(c,new U(null,2,5,W,[Ig,Hg],null));if(y(ec.b?ec.b(Ug,d):ec.call(null,Ug,d)))return 1;if(y(ec.b?ec.b(Gg,d):ec.call(null,Gg,d)))return function(){var d=Oh(b,function(){var d=Ae(c,new U(null,2,5,W,[Ig,ch],null));return b.a?b.a(d):b.call(null,d)}()),f=Oh(b,function(){var d=Ae(c,new U(null,2,5,W,[Ig,Vg],null));return b.a?b.a(d):b.call(null,d)}());return d>f?d:f}()+1;throw Error([E("No matching clause: "),
E(d)].join(""));};function Ph(a,b){var c=Pf(Q.b(Qg,b),b);return we(function(b){return function(c){return Oh(b,c)<=a}}(c),b)}
function Qh(){var a=Rh,b=N.a?N.a(Sh):N.call(null,Sh),c=null!=b&&(b.i&64||b.Ka)?F.b(Bc,b):b,d=I.b(c,Pg),e=I.b(c,Yg);return new U(null,3,5,W,[Mg,$d,new U(null,4,5,W,[Mg,$d,new U(null,3,5,W,[Mg,$d,new U(null,3,5,W,[Bg,new xa(null,1,[Fg,function(){return function(){return a.a?a.a(Dg):a.call(null,Dg)}}(500,b,c,c,d,e)],null),"New Island"],null)],null),new U(null,3,5,W,[Mg,$d,new U(null,4,5,W,[Sg,new xa(null,2,[Eg,500,bh,500],null),new U(null,2,5,W,[ah,new xa(null,3,[Rg,"water",Eg,500,bh,500],null)],null),
new U(null,3,5,W,[Ng,new xa(null,1,[yg,[E("translate("),E(250),E(","),E(250),E(")")].join("")],null),new U(null,2,5,W,[wg,new xa(null,2,[Rg,"island",Xg,function(){var a=Ph(e,d),a=Q.b(Wg,a);return J(a)?[E(Nh(a)),E("Z")].join(""):""}()],null)],null)],null)],null)],null)],null)],null)}function Th(){return new xa(null,3,[Ag,eg.v(),Og,eg.v(),Tg,.05+eg.v()],null)}
function Uh(a){return function c(a){return new Kd(null,function(){for(;;){var e=J(a);if(e){if(kd(e)){var f=Mb(e),h=Vc(f),k=new Nd(Array(h),0);return function(){for(var a=0;;)if(a<h){var c=G.b(f,a),d=Th(),e=d=null!=d&&(d.i&64||d.Ka)?F.b(Bc,d):d,l=I.b(d,Ag),m=I.b(d,Og);Pd(k,Kf.m(nc([e,new xa(null,3,[Qg,cg("radial"),Wg,function(){var a=100*(1+(l-m));return new U(null,2,5,W,[a*(Fh.a?Fh.a(c):Fh.call(null,c)),a*(Eh.a?Eh.a(c):Eh.call(null,c))],null)}(),Ig,new xa(null,4,[Hg,Ug,Lg,new U(null,2,5,W,[0,0],null),
Jg,c,Kg,100],null)],null)],0)));a+=1}else return!0}()?Od(k.Aa(),c(Nb(e))):Od(k.Aa(),null)}var l=K(e),m=Th(),n=m=null!=m&&(m.i&64||m.Ka)?F.b(Bc,m):m,p=I.b(m,Ag),q=I.b(m,Og);return O(Kf.m(nc([n,new xa(null,3,[Qg,cg("radial"),Wg,function(){var a=100*(1+(p-q));return new U(null,2,5,W,[a*(Fh.a?Fh.a(l):Fh.call(null,l)),a*(Eh.a?Eh.a(l):Eh.call(null,l))],null)}(),Ig,new xa(null,4,[Hg,Ug,Lg,new U(null,2,5,W,[0,0],null),Jg,l,Kg,100],null)],null)],0)),c(rc(e)))}return null}},null,null)}(new Rf(null,0,Gh,Gh/
a,null))}
function Vh(a,b){var c=P(a,0),d=P(a,1);d=new U(null,2,5,W,[c,d],null);c=P(d,0);d=P(d,1);if(0<=b&&2<=Ih(Wg.a(c),Wg.a(d))){var e;e=eg.v();var f=Jh(Q.b(Tg,new U(null,2,5,W,[c,d],null))),h=Jh(Q.b(Og,new U(null,2,5,W,[c,d],null))),k=cg("midpoint"),l=Wg.a(c),m=P(l,0),n=P(l,1),p=Wg.a(d),q=P(p,0),r=P(p,1),l=Ih(l,p),l=f*l*(e-h),t=new U(null,2,5,W,[Jh(new U(null,2,5,W,[m,q],null)),Jh(new U(null,2,5,W,[n,r],null))],null),p=P(t,0),t=P(t,1),n=new U(null,2,5,W,[-(n-r),m-q],null),m=P(n,0),n=P(n,1),q=Ih(new U(null,2,
5,W,[0,0],null),new U(null,2,5,W,[m,n],null)),n=new U(null,2,5,W,[m/q,n/q],null),m=P(n,0),n=P(n,1);e=new xa(null,6,[Qg,k,Ag,e,Og,h,Tg,f,Wg,new U(null,2,5,W,[p+l*m,t+l*n],null),Ig,new xa(null,3,[Hg,Gg,ch,Qg.a(c),Vg,Qg.a(d)],null)],null);c=Sd.b(Vh(new U(null,2,5,W,[c,e],null),1),Vh(new U(null,2,5,W,[e,d],null),1))}else c=new U(null,1,5,W,[c],null);return c}
function Wh(){var a=Math.floor(17*Math.random()),b=3+a,c=Uh(b),d=Sd.b(c,new U(null,1,5,W,[K(c)],null)),e=ze(2,1,d);return ve(function(){return function(a){return Vh(a,20)}}(a,b,c,d,e),nc([e],0))}if("undefined"===typeof Sh){var Sh,Xh=new xa(null,1,[Yg,20],null);Sh=ge.a?ge.a(Xh):ge.call(null,Xh)}
if("undefined"===typeof Rh)var Rh=function(){var a=ge.a?ge.a($d):ge.call(null,$d),b=ge.a?ge.a($d):ge.call(null,$d),c=ge.a?ge.a($d):ge.call(null,$d),d=ge.a?ge.a($d):ge.call(null,$d),e=I.c($d,$g,kg());return new vg(mc.b("isle.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.A=1;a.H=function(a){var b=K(a);rc(a);return b};a.m=function(a){return a};return a}()}(a,b,c,d,e),Cg,e,a,b,c,d)}();
var Yh=Rh;me.u(Yh.bb,Zc,Dg,function(){return me.b(Sh,function(a){var b=Wh();return Zc.c(a,Pg,b)})});qg(Yh.tb,Yh.bb,Yh.fb,Yh.qb);if("undefined"===typeof Zh)var Zh=function(a){return function(){var b=Qh();return a.a?a.a(b):a.call(null,b)}}(Dh());if("undefined"===typeof $h){var $h,ai=Sh;Db(ai,Zg,function(a,b,c,d){return Zh.a?Zh.a(d):Zh.call(null,d)});$h=ai}var bi=N.a?N.a(Sh):N.call(null,Sh);Zh.a?Zh.a(bi):Zh.call(null,bi);