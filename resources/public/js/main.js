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
b&&"undefined"==typeof a.call)return"object";return b}function ba(a){return a[ca]||(a[ca]=++ea)}var ca="closure_uid_"+(1E9*Math.random()>>>0),ea=0;function ga(a,b,c){return a.call.apply(a.bind,arguments)}function ja(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ma(a,b,c){ma=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ga:ja;return ma.apply(null,arguments)}var na=Date.now||function(){return+new Date};Math.random();function oa(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function pa(a,b){null!=a&&this.append.apply(this,arguments)}g=pa.prototype;g.Oa="";g.set=function(a){this.Oa=""+a};g.append=function(a,b,c){this.Oa+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Oa+=arguments[d];return this};g.clear=function(){this.Oa=""};g.toString=function(){return this.Oa};function ra(a,b){return a>b?1:a<b?-1:0};var sa={},ta;if("undefined"===typeof ua)var ua=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof va)var va=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var wa=null;if("undefined"===typeof xa)var xa=null;function ya(){return new za(null,5,[Ba,!0,Ca,!0,Da,!1,Ea,!1,Ha,null],null)}Ia;function y(a){return null!=a&&!1!==a}Ja;A;function La(a){return null==a}function Ma(a){return a instanceof Array}
function Na(a){return null==a?!0:!1===a?!0:!1}function B(a,b){return a[u(null==b?null:b)]?!0:a._?!0:!1}function C(a,b){var c=null==b?null:b.constructor,c=y(y(c)?c.Db:c)?c.mb:u(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Oa(a){var b=a.mb;return y(b)?b:""+E(a)}var Pa="undefined"!==typeof Symbol&&"function"===u(Symbol)?Symbol.iterator:"@@iterator";function Qa(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}F;Ra;
var Ia=function Ia(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ia.a(arguments[0]);case 2:return Ia.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Ia.a=function(a){return Ia.b(null,a)};Ia.b=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Ra.c?Ra.c(c,d,b):Ra.call(null,c,d,b)};Ia.A=2;function Sa(){}
var Ta=function Ta(b){if(null!=b&&null!=b.X)return b.X(b);var c=Ta[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ta._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ICounted.-count",b);};function Ua(){}var Va=function Va(b,c){if(null!=b&&null!=b.T)return b.T(b,c);var d=Va[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Va._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("ICollection.-conj",b);};function Xa(){}
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return G.b(arguments[0],arguments[1]);case 3:return G.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
G.b=function(a,b){if(null!=a&&null!=a.U)return a.U(a,b);var c=G[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=G._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("IIndexed.-nth",a);};G.c=function(a,b,c){if(null!=a&&null!=a.ta)return a.ta(a,b,c);var d=G[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=G._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IIndexed.-nth",a);};G.A=3;function Ya(){}
var Za=function Za(b){if(null!=b&&null!=b.$)return b.$(b);var c=Za[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Za._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeq.-first",b);},$a=function $a(b){if(null!=b&&null!=b.qa)return b.qa(b);var c=$a[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=$a._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeq.-rest",b);};function ab(){}function bb(){}
var cb=function cb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return cb.b(arguments[0],arguments[1]);case 3:return cb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
cb.b=function(a,b){if(null!=a&&null!=a.J)return a.J(a,b);var c=cb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=cb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("ILookup.-lookup",a);};cb.c=function(a,b,c){if(null!=a&&null!=a.H)return a.H(a,b,c);var d=cb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=cb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ILookup.-lookup",a);};cb.A=3;
var db=function db(b,c){if(null!=b&&null!=b.yb)return b.yb(b,c);var d=db[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=db._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IAssociative.-contains-key?",b);},fb=function fb(b,c,d){if(null!=b&&null!=b.Pa)return b.Pa(b,c,d);var e=fb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=fb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IAssociative.-assoc",b);};function gb(){}
function hb(){}var ib=function ib(b){if(null!=b&&null!=b.fb)return b.fb(b);var c=ib[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ib._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMapEntry.-key",b);},jb=function jb(b){if(null!=b&&null!=b.gb)return b.gb(b);var c=jb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=jb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMapEntry.-val",b);};function kb(){}function lb(){}
var mb=function mb(b,c,d){if(null!=b&&null!=b.Qa)return b.Qa(b,c,d);var e=mb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=mb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IVector.-assoc-n",b);},nb=function nb(b){if(null!=b&&null!=b.tb)return b.tb(b);var c=nb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=nb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IDeref.-deref",b);};function ob(){}
var pb=function pb(b){if(null!=b&&null!=b.O)return b.O(b);var c=pb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=pb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMeta.-meta",b);},qb=function qb(b,c){if(null!=b&&null!=b.R)return b.R(b,c);var d=qb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=qb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IWithMeta.-with-meta",b);};function sb(){}
var tb=function tb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return tb.b(arguments[0],arguments[1]);case 3:return tb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
tb.b=function(a,b){if(null!=a&&null!=a.Y)return a.Y(a,b);var c=tb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=tb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("IReduce.-reduce",a);};tb.c=function(a,b,c){if(null!=a&&null!=a.Z)return a.Z(a,b,c);var d=tb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=tb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IReduce.-reduce",a);};tb.A=3;
var ub=function ub(b,c){if(null!=b&&null!=b.w)return b.w(b,c);var d=ub[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=ub._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IEquiv.-equiv",b);},vb=function vb(b){if(null!=b&&null!=b.N)return b.N(b);var c=vb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=vb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IHash.-hash",b);};function wb(){}
var xb=function xb(b){if(null!=b&&null!=b.S)return b.S(b);var c=xb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=xb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeqable.-seq",b);};function yb(){}function zb(){}
var Ab=function Ab(b,c){if(null!=b&&null!=b.Lb)return b.Lb(0,c);var d=Ab[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ab._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IWriter.-write",b);},Bb=function Bb(b,c,d){if(null!=b&&null!=b.K)return b.K(b,c,d);var e=Bb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Bb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IPrintWithWriter.-pr-writer",b);},Cb=function Cb(b,c,d){if(null!=b&&
null!=b.Kb)return b.Kb(0,c,d);var e=Cb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Cb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-notify-watches",b);},Db=function Db(b,c,d){if(null!=b&&null!=b.Jb)return b.Jb(0,c,d);var e=Db[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Db._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-add-watch",b);},Eb=function Eb(b){if(null!=b&&null!=b.Wa)return b.Wa(b);
var c=Eb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Eb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEditableCollection.-as-transient",b);},Fb=function Fb(b,c){if(null!=b&&null!=b.kb)return b.kb(b,c);var d=Fb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Fb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("ITransientCollection.-conj!",b);},Gb=function Gb(b){if(null!=b&&null!=b.lb)return b.lb(b);var c=Gb[u(null==b?null:b)];if(null!=c)return c.a?
c.a(b):c.call(null,b);c=Gb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ITransientCollection.-persistent!",b);},Hb=function Hb(b,c,d){if(null!=b&&null!=b.jb)return b.jb(b,c,d);var e=Hb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Hb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientAssociative.-assoc!",b);},Ib=function Ib(b,c,d){if(null!=b&&null!=b.Ib)return b.Ib(0,c,d);var e=Ib[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,
b,c,d);e=Ib._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientVector.-assoc-n!",b);};function Jb(){}
var Kb=function Kb(b,c){if(null!=b&&null!=b.Va)return b.Va(b,c);var d=Kb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Kb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IComparable.-compare",b);},Lb=function Lb(b){if(null!=b&&null!=b.Gb)return b.Gb();var c=Lb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Lb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunk.-drop-first",b);},Mb=function Mb(b){if(null!=b&&null!=b.Ab)return b.Ab(b);var c=
Mb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Mb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedSeq.-chunked-first",b);},Nb=function Nb(b){if(null!=b&&null!=b.Bb)return b.Bb(b);var c=Nb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Nb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedSeq.-chunked-rest",b);},Pb=function Pb(b){if(null!=b&&null!=b.zb)return b.zb(b);var c=Pb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,
b);c=Pb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedNext.-chunked-next",b);},Qb=function Qb(b){if(null!=b&&null!=b.hb)return b.hb(b);var c=Qb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Qb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("INamed.-name",b);},Rb=function Rb(b){if(null!=b&&null!=b.ib)return b.ib(b);var c=Rb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Rb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("INamed.-namespace",
b);},Sb=function Sb(b,c){if(null!=b&&null!=b.$b)return b.$b(b,c);var d=Sb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Sb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IReset.-reset!",b);},Tb=function Tb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Tb.b(arguments[0],arguments[1]);case 3:return Tb.c(arguments[0],arguments[1],arguments[2]);case 4:return Tb.o(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return Tb.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Tb.b=function(a,b){if(null!=a&&null!=a.bc)return a.bc(a,b);var c=Tb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=Tb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("ISwap.-swap!",a);};
Tb.c=function(a,b,c){if(null!=a&&null!=a.cc)return a.cc(a,b,c);var d=Tb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Tb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ISwap.-swap!",a);};Tb.o=function(a,b,c,d){if(null!=a&&null!=a.dc)return a.dc(a,b,c,d);var e=Tb[u(null==a?null:a)];if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);e=Tb._;if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);throw C("ISwap.-swap!",a);};
Tb.C=function(a,b,c,d,e){if(null!=a&&null!=a.ec)return a.ec(a,b,c,d,e);var f=Tb[u(null==a?null:a)];if(null!=f)return f.C?f.C(a,b,c,d,e):f.call(null,a,b,c,d,e);f=Tb._;if(null!=f)return f.C?f.C(a,b,c,d,e):f.call(null,a,b,c,d,e);throw C("ISwap.-swap!",a);};Tb.A=5;var Ub=function Ub(b){if(null!=b&&null!=b.Da)return b.Da(b);var c=Ub[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ub._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IIterable.-iterator",b);};
function Vb(a){this.pc=a;this.i=1073741824;this.B=0}Vb.prototype.Lb=function(a,b){return this.pc.append(b)};function Wb(a){var b=new pa;a.K(null,new Vb(b),ya());return""+E(b)}var Yb="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function Zb(a){a=Yb(a|0,-862048943);return Yb(a<<15|a>>>-15,461845907)}
function $b(a,b){var c=(a|0)^(b|0);return Yb(c<<13|c>>>-13,5)+-430675100|0}function ac(a,b){var c=(a|0)^b,c=Yb(c^c>>>16,-2048144789),c=Yb(c^c>>>13,-1028477387);return c^c>>>16}function bc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=$b(c,Zb(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^Zb(a.charCodeAt(a.length-1)):b;return ac(b,Yb(2,a.length))}cc;dc;ec;fc;var gc={},hc=0;
function ic(a){255<hc&&(gc={},hc=0);var b=gc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=Yb(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;gc[a]=b;hc+=1}return a=b}function jc(a){null!=a&&(a.i&4194304||a.uc)?a=a.N(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=ic(a),0!==a&&(a=Zb(a),a=$b(0,a),a=ac(a,4))):a=a instanceof Date?a.valueOf():null==a?0:vb(a);return a}
function kc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Ja(a,b){return b instanceof a}function lc(a,b){if(a.Ga===b.Ga)return 0;var c=Na(a.ra);if(y(c?b.ra:c))return-1;if(y(a.ra)){if(Na(b.ra))return 1;c=ra(a.ra,b.ra);return 0===c?ra(a.name,b.name):c}return ra(a.name,b.name)}H;function dc(a,b,c,d,e){this.ra=a;this.name=b;this.Ga=c;this.Ua=d;this.ya=e;this.i=2154168321;this.B=4096}g=dc.prototype;g.toString=function(){return this.Ga};g.equiv=function(a){return this.w(null,a)};
g.w=function(a,b){return b instanceof dc?this.Ga===b.Ga:!1};g.call=function(){function a(a,b,c){return H.c?H.c(b,this,c):H.call(null,b,this,c)}function b(a,b){return H.b?H.b(b,this):H.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Qa(b)))};
g.a=function(a){return H.b?H.b(a,this):H.call(null,a,this)};g.b=function(a,b){return H.c?H.c(a,this,b):H.call(null,a,this,b)};g.O=function(){return this.ya};g.R=function(a,b){return new dc(this.ra,this.name,this.Ga,this.Ua,b)};g.N=function(){var a=this.Ua;return null!=a?a:this.Ua=a=kc(bc(this.name),ic(this.ra))};g.hb=function(){return this.name};g.ib=function(){return this.ra};g.K=function(a,b){return Ab(b,this.Ga)};
var nc=function nc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return nc.a(arguments[0]);case 2:return nc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};nc.a=function(a){if(a instanceof dc)return a;var b=a.indexOf("/");return-1===b?nc.b(null,a):nc.b(a.substring(0,b),a.substring(b+1,a.length))};nc.b=function(a,b){var c=null!=a?[E(a),E("/"),E(b)].join(""):b;return new dc(a,b,c,null,null)};
nc.A=2;oc;pc;J;function K(a){if(null==a)return null;if(null!=a&&(a.i&8388608||a.ac))return a.S(null);if(Ma(a)||"string"===typeof a)return 0===a.length?null:new J(a,0);if(B(wb,a))return xb(a);throw Error([E(a),E(" is not ISeqable")].join(""));}function L(a){if(null==a)return null;if(null!=a&&(a.i&64||a.Ia))return a.$(null);a=K(a);return null==a?null:Za(a)}function qc(a){return null!=a?null!=a&&(a.i&64||a.Ia)?a.qa(null):(a=K(a))?$a(a):rc:rc}
function M(a){return null==a?null:null!=a&&(a.i&128||a.ub)?a.pa(null):K(qc(a))}var ec=function ec(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ec.a(arguments[0]);case 2:return ec.b(arguments[0],arguments[1]);default:return ec.l(arguments[0],arguments[1],new J(c.slice(2),0))}};ec.a=function(){return!0};ec.b=function(a,b){return null==a?null==b:a===b||ub(a,b)};
ec.l=function(a,b,c){for(;;)if(ec.b(a,b))if(M(c))a=b,b=L(c),c=M(c);else return ec.b(b,L(c));else return!1};ec.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return ec.l(b,a,c)};ec.A=2;function sc(a){this.F=a}sc.prototype.next=function(){if(null!=this.F){var a=L(this.F);this.F=M(this.F);return{value:a,done:!1}}return{value:null,done:!0}};function tc(a){return new sc(K(a))}uc;function vc(a,b,c){this.value=a;this.Za=b;this.wb=c;this.i=8388672;this.B=0}vc.prototype.S=function(){return this};
vc.prototype.$=function(){return this.value};vc.prototype.qa=function(){null==this.wb&&(this.wb=uc.a?uc.a(this.Za):uc.call(null,this.Za));return this.wb};function uc(a){var b=a.next();return y(b.done)?rc:new vc(b.value,a,null)}function wc(a,b){var c=Zb(a),c=$b(0,c);return ac(c,b)}function xc(a){var b=0,c=1;for(a=K(a);;)if(null!=a)b+=1,c=Yb(31,c)+jc(L(a))|0,a=M(a);else return wc(c,b)}var yc=wc(1,0);function zc(a){var b=0,c=0;for(a=K(a);;)if(null!=a)b+=1,c=c+jc(L(a))|0,a=M(a);else return wc(c,b)}
var Ac=wc(0,0);Bc;cc;Cc;Sa["null"]=!0;Ta["null"]=function(){return 0};Date.prototype.w=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.cb=!0;Date.prototype.Va=function(a,b){if(b instanceof Date)return ra(this.valueOf(),b.valueOf());throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};ub.number=function(a,b){return a===b};Dc;ob["function"]=!0;pb["function"]=function(){return null};vb._=function(a){return ba(a)};function Ec(a){return a+1}N;
function Fc(a){this.M=a;this.i=32768;this.B=0}Fc.prototype.tb=function(){return this.M};function Gc(a){return a instanceof Fc}function N(a){return nb(a)}function Hc(a,b){var c=Ta(a);if(0===c)return b.u?b.u():b.call(null);for(var d=G.b(a,0),e=1;;)if(e<c){var f=G.b(a,e),d=b.b?b.b(d,f):b.call(null,d,f);if(Gc(d))return nb(d);e+=1}else return d}function Ic(a,b,c){var d=Ta(a),e=c;for(c=0;;)if(c<d){var f=G.b(a,c),e=b.b?b.b(e,f):b.call(null,e,f);if(Gc(e))return nb(e);c+=1}else return e}
function Jc(a,b){var c=a.length;if(0===a.length)return b.u?b.u():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.b?b.b(d,f):b.call(null,d,f);if(Gc(d))return nb(d);e+=1}else return d}function Kc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.b?b.b(e,f):b.call(null,e,f);if(Gc(e))return nb(e);c+=1}else return e}function Lc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.b?b.b(c,f):b.call(null,c,f);if(Gc(c))return nb(c);d+=1}else return c}Mc;O;Nc;Oc;
function Pc(a){return null!=a?a.i&2||a.Rb?!0:a.i?!1:B(Sa,a):B(Sa,a)}function Qc(a){return null!=a?a.i&16||a.Hb?!0:a.i?!1:B(Xa,a):B(Xa,a)}function Rc(a,b){this.f=a;this.j=b}Rc.prototype.ua=function(){return this.j<this.f.length};Rc.prototype.next=function(){var a=this.f[this.j];this.j+=1;return a};function J(a,b){this.f=a;this.j=b;this.i=166199550;this.B=8192}g=J.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};
g.U=function(a,b){var c=b+this.j;return c<this.f.length?this.f[c]:null};g.ta=function(a,b,c){a=b+this.j;return a<this.f.length?this.f[a]:c};g.Da=function(){return new Rc(this.f,this.j)};g.pa=function(){return this.j+1<this.f.length?new J(this.f,this.j+1):null};g.X=function(){var a=this.f.length-this.j;return 0>a?0:a};g.N=function(){return xc(this)};g.w=function(a,b){return Cc.b?Cc.b(this,b):Cc.call(null,this,b)};g.Y=function(a,b){return Lc(this.f,b,this.f[this.j],this.j+1)};
g.Z=function(a,b,c){return Lc(this.f,b,c,this.j)};g.$=function(){return this.f[this.j]};g.qa=function(){return this.j+1<this.f.length?new J(this.f,this.j+1):rc};g.S=function(){return this.j<this.f.length?this:null};g.T=function(a,b){return O.b?O.b(b,this):O.call(null,b,this)};J.prototype[Pa]=function(){return tc(this)};
var pc=function pc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return pc.a(arguments[0]);case 2:return pc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};pc.a=function(a){return pc.b(a,0)};pc.b=function(a,b){return b<a.length?new J(a,b):null};pc.A=2;
var oc=function oc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return oc.a(arguments[0]);case 2:return oc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};oc.a=function(a){return pc.b(a,0)};oc.b=function(a,b){return pc.b(a,b)};oc.A=2;Dc;Sc;function Nc(a,b,c){this.sb=a;this.j=b;this.v=c;this.i=32374990;this.B=8192}g=Nc.prototype;g.toString=function(){return Wb(this)};
g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){return 0<this.j?new Nc(this.sb,this.j-1,null):null};g.X=function(){return this.j+1};g.N=function(){return xc(this)};g.w=function(a,b){return Cc.b?Cc.b(this,b):Cc.call(null,this,b)};g.Y=function(a,b){return Sc.b?Sc.b(b,this):Sc.call(null,b,this)};g.Z=function(a,b,c){return Sc.c?Sc.c(b,c,this):Sc.call(null,b,c,this)};g.$=function(){return G.b(this.sb,this.j)};
g.qa=function(){return 0<this.j?new Nc(this.sb,this.j-1,null):rc};g.S=function(){return this};g.R=function(a,b){return new Nc(this.sb,this.j,b)};g.T=function(a,b){return O.b?O.b(b,this):O.call(null,b,this)};Nc.prototype[Pa]=function(){return tc(this)};function Tc(a){return L(M(a))}ub._=function(a,b){return a===b};
var Uc=function Uc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Uc.u();case 1:return Uc.a(arguments[0]);case 2:return Uc.b(arguments[0],arguments[1]);default:return Uc.l(arguments[0],arguments[1],new J(c.slice(2),0))}};Uc.u=function(){return Wc};Uc.a=function(a){return a};Uc.b=function(a,b){return null!=a?Va(a,b):Va(rc,b)};Uc.l=function(a,b,c){for(;;)if(y(c))a=Uc.b(a,b),b=L(c),c=M(c);else return Uc.b(a,b)};
Uc.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return Uc.l(b,a,c)};Uc.A=2;function Xc(a){if(null!=a)if(null!=a&&(a.i&2||a.Rb))a=a.X(null);else if(Ma(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.i&8388608||a.ac))a:{a=K(a);for(var b=0;;){if(Pc(a)){a=b+Ta(a);break a}a=M(a);b+=1}}else a=Ta(a);else a=0;return a}function Yc(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return K(a)?L(a):c;if(Qc(a))return G.c(a,b,c);if(K(a)){var d=M(a),e=b-1;a=d;b=e}else return c}}
function Zc(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.i&16||a.Hb))return a.U(null,b);if(Ma(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Ia)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(K(c)){c=L(c);break a}throw Error("Index out of bounds");}if(Qc(c)){c=G.b(c,d);break a}if(K(c))c=M(c),--d;else throw Error("Index out of bounds");
}}return c}if(B(Xa,a))return G.b(a,b);throw Error([E("nth not supported on this type "),E(Oa(null==a?null:a.constructor))].join(""));}
function P(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.i&16||a.Hb))return a.ta(null,b,null);if(Ma(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Ia))return Yc(a,b);if(B(Xa,a))return G.b(a,b);throw Error([E("nth not supported on this type "),E(Oa(null==a?null:a.constructor))].join(""));}
var H=function H(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return H.b(arguments[0],arguments[1]);case 3:return H.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};H.b=function(a,b){return null==a?null:null!=a&&(a.i&256||a.Ub)?a.J(null,b):Ma(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:B(bb,a)?cb.b(a,b):null};
H.c=function(a,b,c){return null!=a?null!=a&&(a.i&256||a.Ub)?a.H(null,b,c):Ma(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:B(bb,a)?cb.c(a,b,c):c:c};H.A=3;$c;var ad=function ad(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return ad.c(arguments[0],arguments[1],arguments[2]);default:return ad.l(arguments[0],arguments[1],arguments[2],new J(c.slice(3),0))}};
ad.c=function(a,b,c){if(null!=a)a=fb(a,b,c);else a:{a=[b];c=[c];b=a.length;var d=0,e;for(e=Eb(bd);;)if(d<b){var f=d+1;e=e.jb(null,a[d],c[d]);d=f}else{a=Gb(e);break a}}return a};ad.l=function(a,b,c,d){for(;;)if(a=ad.c(a,b,c),y(d))b=L(d),c=Tc(d),d=M(M(d));else return a};ad.D=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),d=M(d);return ad.l(b,a,c,d)};ad.A=3;function cd(a,b){this.g=a;this.v=b;this.i=393217;this.B=0}g=cd.prototype;g.O=function(){return this.v};
g.R=function(a,b){return new cd(this.g,b)};
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I,S){a=this;return F.eb?F.eb(a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I,S):F.call(null,a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I,S)}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I){a=this;return a.g.ma?a.g.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D){a=this;return a.g.la?a.g.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):
a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x){a=this;return a.g.ka?a.g.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){a=this;return a.g.ja?a.g.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){a=this;return a.g.ia?a.g.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.g.call(null,b,
c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){a=this;return a.g.ha?a.g.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)}function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){a=this;return a.g.ga?a.g.ga(b,c,d,e,f,h,k,l,m,n,p,q,r,t):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;return a.g.fa?a.g.fa(b,c,d,e,f,h,k,l,m,n,p,q,r):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;
return a.g.ea?a.g.ea(b,c,d,e,f,h,k,l,m,n,p,q):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;return a.g.da?a.g.da(b,c,d,e,f,h,k,l,m,n,p):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,n){a=this;return a.g.ca?a.g.ca(b,c,d,e,f,h,k,l,m,n):a.g.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;return a.g.oa?a.g.oa(b,c,d,e,f,h,k,l,m):a.g.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;return a.g.na?a.g.na(b,c,
d,e,f,h,k,l):a.g.call(null,b,c,d,e,f,h,k,l)}function t(a,b,c,d,e,f,h,k){a=this;return a.g.W?a.g.W(b,c,d,e,f,h,k):a.g.call(null,b,c,d,e,f,h,k)}function v(a,b,c,d,e,f,h){a=this;return a.g.V?a.g.V(b,c,d,e,f,h):a.g.call(null,b,c,d,e,f,h)}function w(a,b,c,d,e,f){a=this;return a.g.C?a.g.C(b,c,d,e,f):a.g.call(null,b,c,d,e,f)}function z(a,b,c,d,e){a=this;return a.g.o?a.g.o(b,c,d,e):a.g.call(null,b,c,d,e)}function D(a,b,c,d){a=this;return a.g.c?a.g.c(b,c,d):a.g.call(null,b,c,d)}function I(a,b,c){a=this;return a.g.b?
a.g.b(b,c):a.g.call(null,b,c)}function S(a,b){a=this;return a.g.a?a.g.a(b):a.g.call(null,b)}function la(a){a=this;return a.g.u?a.g.u():a.g.call(null)}var x=null,x=function(Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x,Wa,eb,rb,Ob,mc,Vc,ue){switch(arguments.length){case 1:return la.call(this,Fa);case 2:return S.call(this,Fa,R);case 3:return I.call(this,Fa,R,T);case 4:return D.call(this,Fa,R,T,W);case 5:return z.call(this,Fa,R,T,W,Z);case 6:return w.call(this,Fa,R,T,W,Z,da);case 7:return v.call(this,Fa,R,
T,W,Z,da,fa);case 8:return t.call(this,Fa,R,T,W,Z,da,fa,ha);case 9:return r.call(this,Fa,R,T,W,Z,da,fa,ha,ia);case 10:return q.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka);case 11:return p.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa);case 12:return n.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa);case 13:return m.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga);case 14:return l.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka);case 15:return k.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x);case 16:return h.call(this,
Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x,Wa);case 17:return f.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x,Wa,eb);case 18:return e.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x,Wa,eb,rb);case 19:return d.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x,Wa,eb,rb,Ob);case 20:return c.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x,Wa,eb,rb,Ob,mc);case 21:return b.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x,Wa,eb,rb,Ob,mc,Vc);case 22:return a.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,
Ga,Ka,x,Wa,eb,rb,Ob,mc,Vc,ue)}throw Error("Invalid arity: "+arguments.length);};x.a=la;x.b=S;x.c=I;x.o=D;x.C=z;x.V=w;x.W=v;x.na=t;x.oa=r;x.ca=q;x.da=p;x.ea=n;x.fa=m;x.ga=l;x.ha=k;x.ia=h;x.ja=f;x.ka=e;x.la=d;x.ma=c;x.Cb=b;x.eb=a;return x}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Qa(b)))};g.u=function(){return this.g.u?this.g.u():this.g.call(null)};g.a=function(a){return this.g.a?this.g.a(a):this.g.call(null,a)};
g.b=function(a,b){return this.g.b?this.g.b(a,b):this.g.call(null,a,b)};g.c=function(a,b,c){return this.g.c?this.g.c(a,b,c):this.g.call(null,a,b,c)};g.o=function(a,b,c,d){return this.g.o?this.g.o(a,b,c,d):this.g.call(null,a,b,c,d)};g.C=function(a,b,c,d,e){return this.g.C?this.g.C(a,b,c,d,e):this.g.call(null,a,b,c,d,e)};g.V=function(a,b,c,d,e,f){return this.g.V?this.g.V(a,b,c,d,e,f):this.g.call(null,a,b,c,d,e,f)};
g.W=function(a,b,c,d,e,f,h){return this.g.W?this.g.W(a,b,c,d,e,f,h):this.g.call(null,a,b,c,d,e,f,h)};g.na=function(a,b,c,d,e,f,h,k){return this.g.na?this.g.na(a,b,c,d,e,f,h,k):this.g.call(null,a,b,c,d,e,f,h,k)};g.oa=function(a,b,c,d,e,f,h,k,l){return this.g.oa?this.g.oa(a,b,c,d,e,f,h,k,l):this.g.call(null,a,b,c,d,e,f,h,k,l)};g.ca=function(a,b,c,d,e,f,h,k,l,m){return this.g.ca?this.g.ca(a,b,c,d,e,f,h,k,l,m):this.g.call(null,a,b,c,d,e,f,h,k,l,m)};
g.da=function(a,b,c,d,e,f,h,k,l,m,n){return this.g.da?this.g.da(a,b,c,d,e,f,h,k,l,m,n):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n)};g.ea=function(a,b,c,d,e,f,h,k,l,m,n,p){return this.g.ea?this.g.ea(a,b,c,d,e,f,h,k,l,m,n,p):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.fa=function(a,b,c,d,e,f,h,k,l,m,n,p,q){return this.g.fa?this.g.fa(a,b,c,d,e,f,h,k,l,m,n,p,q):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){return this.g.ga?this.g.ga(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){return this.g.ha?this.g.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t)};g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){return this.g.ia?this.g.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)};
g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){return this.g.ja?this.g.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)};g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){return this.g.ka?this.g.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)};
g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D){return this.g.la?this.g.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D)};g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I){return this.g.ma?this.g.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I)};
g.Cb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S){return F.eb?F.eb(this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S):F.call(null,this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S)};function Dc(a,b){return"function"==u(a)?new cd(a,b):null==a?null:qb(a,b)}function dd(a){var b=null!=a;return(b?null!=a?a.i&131072||a.Xb||(a.i?0:B(ob,a)):B(ob,a):b)?pb(a):null}function ed(a){return null==a?!1:null!=a?a.i&4096||a.xc?!0:a.i?!1:B(kb,a):B(kb,a)}
function fd(a){return null!=a?a.i&16777216||a.wc?!0:a.i?!1:B(yb,a):B(yb,a)}function gd(a){return null==a?!1:null!=a?a.i&1024||a.Vb?!0:a.i?!1:B(gb,a):B(gb,a)}function hd(a){return null!=a?a.i&16384||a.yc?!0:a.i?!1:B(lb,a):B(lb,a)}id;jd;function kd(a){return null!=a?a.B&512||a.rc?!0:!1:!1}function ld(a){var b=[];oa(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function md(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var nd={};
function od(a){return null==a?!1:null!=a?a.i&64||a.Ia?!0:a.i?!1:B(Ya,a):B(Ya,a)}function pd(a){return null==a?!1:!1===a?!1:!0}function qd(a,b){return H.c(a,b,nd)===nd?!1:!0}
function fc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return ra(a,b);throw Error([E("Cannot compare "),E(a),E(" to "),E(b)].join(""));}if(null!=a?a.B&2048||a.cb||(a.B?0:B(Jb,a)):B(Jb,a))return Kb(a,b);if("string"!==typeof a&&!Ma(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([E("Cannot compare "),E(a),E(" to "),E(b)].join(""));return ra(a,b)}
function rd(a,b){var c=Xc(a),d=Xc(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=fc(Zc(a,d),Zc(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}sd;var Sc=function Sc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Sc.b(arguments[0],arguments[1]);case 3:return Sc.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Sc.b=function(a,b){var c=K(b);if(c){var d=L(c),c=M(c);return Ra.c?Ra.c(a,d,c):Ra.call(null,a,d,c)}return a.u?a.u():a.call(null)};Sc.c=function(a,b,c){for(c=K(c);;)if(c){var d=L(c);b=a.b?a.b(b,d):a.call(null,b,d);if(Gc(b))return nb(b);c=M(c)}else return b};Sc.A=3;td;
var Ra=function Ra(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ra.b(arguments[0],arguments[1]);case 3:return Ra.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Ra.b=function(a,b){return null!=b&&(b.i&524288||b.Zb)?b.Y(null,a):Ma(b)?Jc(b,a):"string"===typeof b?Jc(b,a):B(sb,b)?tb.b(b,a):Sc.b(a,b)};
Ra.c=function(a,b,c){return null!=c&&(c.i&524288||c.Zb)?c.Z(null,a,b):Ma(c)?Kc(c,a,b):"string"===typeof c?Kc(c,a,b):B(sb,c)?tb.c(c,a,b):Sc.c(a,b,c)};Ra.A=3;function ud(a){return a}var vd=function vd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return vd.u();case 1:return vd.a(arguments[0]);case 2:return vd.b(arguments[0],arguments[1]);default:return vd.l(arguments[0],arguments[1],new J(c.slice(2),0))}};vd.u=function(){return 0};
vd.a=function(a){return a};vd.b=function(a,b){return a+b};vd.l=function(a,b,c){return Ra.c(vd,a+b,c)};vd.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return vd.l(b,a,c)};vd.A=2;sa.Bc;var wd=function wd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return wd.a(arguments[0]);case 2:return wd.b(arguments[0],arguments[1]);default:return wd.l(arguments[0],arguments[1],new J(c.slice(2),0))}};wd.a=function(a){return a};
wd.b=function(a,b){return a>b?a:b};wd.l=function(a,b,c){return Ra.c(wd,a>b?a:b,c)};wd.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return wd.l(b,a,c)};wd.A=2;var xd=function xd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return xd.a(arguments[0]);case 2:return xd.b(arguments[0],arguments[1]);default:return xd.l(arguments[0],arguments[1],new J(c.slice(2),0))}};xd.a=function(a){return a};xd.b=function(a,b){return a<b?a:b};
xd.l=function(a,b,c){return Ra.c(xd,a<b?a:b,c)};xd.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return xd.l(b,a,c)};xd.A=2;yd;function yd(a,b){return(a%b+b)%b}function zd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Ad(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Bd(a){var b=2;for(a=K(a);;)if(a&&0<b)--b,a=M(a);else return a}
var E=function E(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return E.u();case 1:return E.a(arguments[0]);default:return E.l(arguments[0],new J(c.slice(1),0))}};E.u=function(){return""};E.a=function(a){return null==a?"":""+a};E.l=function(a,b){for(var c=new pa(""+E(a)),d=b;;)if(y(d))c=c.append(""+E(L(d))),d=M(d);else return c.toString()};E.D=function(a){var b=L(a);a=M(a);return E.l(b,a)};E.A=1;Q;Cd;
function Cc(a,b){var c;if(fd(b))if(Pc(a)&&Pc(b)&&Xc(a)!==Xc(b))c=!1;else a:{c=K(a);for(var d=K(b);;){if(null==c){c=null==d;break a}if(null!=d&&ec.b(L(c),L(d)))c=M(c),d=M(d);else{c=!1;break a}}}else c=null;return pd(c)}function Mc(a){if(K(a)){var b=jc(L(a));for(a=M(a);;){if(null==a)return b;b=kc(b,jc(L(a)));a=M(a)}}else return 0}Dd;Ed;Cd;Fd;Gd;function Oc(a,b,c,d,e){this.v=a;this.first=b;this.sa=c;this.count=d;this.s=e;this.i=65937646;this.B=8192}g=Oc.prototype;g.toString=function(){return Wb(this)};
g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){return 1===this.count?null:this.sa};g.X=function(){return this.count};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Sc.b(b,this)};g.Z=function(a,b,c){return Sc.c(b,c,this)};g.$=function(){return this.first};g.qa=function(){return 1===this.count?rc:this.sa};g.S=function(){return this};
g.R=function(a,b){return new Oc(b,this.first,this.sa,this.count,this.s)};g.T=function(a,b){return new Oc(this.v,b,this,this.count+1,null)};Oc.prototype[Pa]=function(){return tc(this)};function Hd(a){this.v=a;this.i=65937614;this.B=8192}g=Hd.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){return null};g.X=function(){return 0};g.N=function(){return yc};
g.w=function(a,b){return(null!=b?b.i&33554432||b.vc||(b.i?0:B(zb,b)):B(zb,b))||fd(b)?null==K(b):!1};g.Y=function(a,b){return Sc.b(b,this)};g.Z=function(a,b,c){return Sc.c(b,c,this)};g.$=function(){return null};g.qa=function(){return rc};g.S=function(){return null};g.R=function(a,b){return new Hd(b)};g.T=function(a,b){return new Oc(this.v,b,null,1,null)};var rc=new Hd(null);Hd.prototype[Pa]=function(){return tc(this)};
var cc=function cc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return cc.l(0<c.length?new J(c.slice(0),0):null)};cc.l=function(a){var b;if(a instanceof J&&0===a.j)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.$(null)),a=a.pa(null);else break a;a=b.length;for(var c=rc;;)if(0<a){var d=a-1,c=c.T(null,b[a-1]);a=d}else return c};cc.A=0;cc.D=function(a){return cc.l(K(a))};function Id(a,b,c,d){this.v=a;this.first=b;this.sa=c;this.s=d;this.i=65929452;this.B=8192}g=Id.prototype;
g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){return null==this.sa?null:K(this.sa)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Sc.b(b,this)};g.Z=function(a,b,c){return Sc.c(b,c,this)};g.$=function(){return this.first};g.qa=function(){return null==this.sa?rc:this.sa};g.S=function(){return this};
g.R=function(a,b){return new Id(b,this.first,this.sa,this.s)};g.T=function(a,b){return new Id(null,b,this,this.s)};Id.prototype[Pa]=function(){return tc(this)};function O(a,b){var c=null==b;return(c?c:null!=b&&(b.i&64||b.Ia))?new Id(null,a,b,null):new Id(null,a,K(b),null)}function Jd(a,b){if(a.Ea===b.Ea)return 0;var c=Na(a.ra);if(y(c?b.ra:c))return-1;if(y(a.ra)){if(Na(b.ra))return 1;c=ra(a.ra,b.ra);return 0===c?ra(a.name,b.name):c}return ra(a.name,b.name)}
function A(a,b,c,d){this.ra=a;this.name=b;this.Ea=c;this.Ua=d;this.i=2153775105;this.B=4096}g=A.prototype;g.toString=function(){return[E(":"),E(this.Ea)].join("")};g.equiv=function(a){return this.w(null,a)};g.w=function(a,b){return b instanceof A?this.Ea===b.Ea:!1};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return H.b(c,this);case 3:return H.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return H.b(c,this)};a.c=function(a,c,d){return H.c(c,this,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Qa(b)))};g.a=function(a){return H.b(a,this)};g.b=function(a,b){return H.c(a,this,b)};
g.N=function(){var a=this.Ua;return null!=a?a:this.Ua=a=kc(bc(this.name),ic(this.ra))+2654435769|0};g.hb=function(){return this.name};g.ib=function(){return this.ra};g.K=function(a,b){return Ab(b,[E(":"),E(this.Ea)].join(""))};var Kd=function Kd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Kd.a(arguments[0]);case 2:return Kd.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Kd.a=function(a){if(a instanceof A)return a;if(a instanceof dc){var b;if(null!=a&&(a.B&4096||a.Yb))b=a.ib(null);else throw Error([E("Doesn't support namespace: "),E(a)].join(""));return new A(b,Cd.a?Cd.a(a):Cd.call(null,a),a.Ga,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new A(b[0],b[1],a,null):new A(null,b[0],a,null)):null};Kd.b=function(a,b){return new A(a,b,[E(y(a)?[E(a),E("/")].join(""):null),E(b)].join(""),null)};Kd.A=2;
function Ld(a,b,c,d){this.v=a;this.Ya=b;this.F=c;this.s=d;this.i=32374988;this.B=0}g=Ld.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};function Md(a){null!=a.Ya&&(a.F=a.Ya.u?a.Ya.u():a.Ya.call(null),a.Ya=null);return a.F}g.O=function(){return this.v};g.pa=function(){xb(this);return null==this.F?null:M(this.F)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Sc.b(b,this)};
g.Z=function(a,b,c){return Sc.c(b,c,this)};g.$=function(){xb(this);return null==this.F?null:L(this.F)};g.qa=function(){xb(this);return null!=this.F?qc(this.F):rc};g.S=function(){Md(this);if(null==this.F)return null;for(var a=this.F;;)if(a instanceof Ld)a=Md(a);else return this.F=a,K(this.F)};g.R=function(a,b){return new Ld(b,this.Ya,this.F,this.s)};g.T=function(a,b){return O(b,this)};Ld.prototype[Pa]=function(){return tc(this)};Nd;function Od(a,b){this.xb=a;this.end=b;this.i=2;this.B=0}
Od.prototype.add=function(a){this.xb[this.end]=a;return this.end+=1};Od.prototype.za=function(){var a=new Nd(this.xb,0,this.end);this.xb=null;return a};Od.prototype.X=function(){return this.end};function Nd(a,b,c){this.f=a;this.ba=b;this.end=c;this.i=524306;this.B=0}g=Nd.prototype;g.X=function(){return this.end-this.ba};g.U=function(a,b){return this.f[this.ba+b]};g.ta=function(a,b,c){return 0<=b&&b<this.end-this.ba?this.f[this.ba+b]:c};
g.Gb=function(){if(this.ba===this.end)throw Error("-drop-first of empty chunk");return new Nd(this.f,this.ba+1,this.end)};g.Y=function(a,b){return Lc(this.f,b,this.f[this.ba],this.ba+1)};g.Z=function(a,b,c){return Lc(this.f,b,c,this.ba)};function id(a,b,c,d){this.za=a;this.Fa=b;this.v=c;this.s=d;this.i=31850732;this.B=1536}g=id.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};
g.pa=function(){if(1<Ta(this.za))return new id(Lb(this.za),this.Fa,this.v,null);var a=xb(this.Fa);return null==a?null:a};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.$=function(){return G.b(this.za,0)};g.qa=function(){return 1<Ta(this.za)?new id(Lb(this.za),this.Fa,this.v,null):null==this.Fa?rc:this.Fa};g.S=function(){return this};g.Ab=function(){return this.za};g.Bb=function(){return null==this.Fa?rc:this.Fa};
g.R=function(a,b){return new id(this.za,this.Fa,b,this.s)};g.T=function(a,b){return O(b,this)};g.zb=function(){return null==this.Fa?null:this.Fa};id.prototype[Pa]=function(){return tc(this)};function Pd(a,b){return 0===Ta(a)?b:new id(a,b,null,null)}function Qd(a,b){a.add(b)}function Fd(a){return Mb(a)}function Gd(a){return Nb(a)}function sd(a){for(var b=[];;)if(K(a))b.push(L(a)),a=M(a);else return b}
function Rd(a,b){if(Pc(a))return Xc(a);for(var c=a,d=b,e=0;;)if(0<d&&K(c))c=M(c),--d,e+=1;else return e}var Sd=function Sd(b){return null==b?null:null==M(b)?K(L(b)):O(L(b),Sd(M(b)))},Td=function Td(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Td.u();case 1:return Td.a(arguments[0]);case 2:return Td.b(arguments[0],arguments[1]);default:return Td.l(arguments[0],arguments[1],new J(c.slice(2),0))}};
Td.u=function(){return new Ld(null,function(){return null},null,null)};Td.a=function(a){return new Ld(null,function(){return a},null,null)};Td.b=function(a,b){return new Ld(null,function(){var c=K(a);return c?kd(c)?Pd(Mb(c),Td.b(Nb(c),b)):O(L(c),Td.b(qc(c),b)):b},null,null)};Td.l=function(a,b,c){return function e(a,b){return new Ld(null,function(){var c=K(a);return c?kd(c)?Pd(Mb(c),e(Nb(c),b)):O(L(c),e(qc(c),b)):y(b)?e(L(b),M(b)):null},null,null)}(Td.b(a,b),c)};
Td.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return Td.l(b,a,c)};Td.A=2;var Ud=function Ud(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Ud.u();case 1:return Ud.a(arguments[0]);case 2:return Ud.b(arguments[0],arguments[1]);default:return Ud.l(arguments[0],arguments[1],new J(c.slice(2),0))}};Ud.u=function(){return Eb(Wc)};Ud.a=function(a){return a};Ud.b=function(a,b){return Fb(a,b)};
Ud.l=function(a,b,c){for(;;)if(a=Fb(a,b),y(c))b=L(c),c=M(c);else return a};Ud.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return Ud.l(b,a,c)};Ud.A=2;
function Vd(a,b,c){var d=K(c);if(0===b)return a.u?a.u():a.call(null);c=Za(d);var e=$a(d);if(1===b)return a.a?a.a(c):a.a?a.a(c):a.call(null,c);var d=Za(e),f=$a(e);if(2===b)return a.b?a.b(c,d):a.b?a.b(c,d):a.call(null,c,d);var e=Za(f),h=$a(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=Za(h),k=$a(h);if(4===b)return a.o?a.o(c,d,e,f):a.o?a.o(c,d,e,f):a.call(null,c,d,e,f);var h=Za(k),l=$a(k);if(5===b)return a.C?a.C(c,d,e,f,h):a.C?a.C(c,d,e,f,h):a.call(null,c,d,e,f,h);var k=Za(l),
m=$a(l);if(6===b)return a.V?a.V(c,d,e,f,h,k):a.V?a.V(c,d,e,f,h,k):a.call(null,c,d,e,f,h,k);var l=Za(m),n=$a(m);if(7===b)return a.W?a.W(c,d,e,f,h,k,l):a.W?a.W(c,d,e,f,h,k,l):a.call(null,c,d,e,f,h,k,l);var m=Za(n),p=$a(n);if(8===b)return a.na?a.na(c,d,e,f,h,k,l,m):a.na?a.na(c,d,e,f,h,k,l,m):a.call(null,c,d,e,f,h,k,l,m);var n=Za(p),q=$a(p);if(9===b)return a.oa?a.oa(c,d,e,f,h,k,l,m,n):a.oa?a.oa(c,d,e,f,h,k,l,m,n):a.call(null,c,d,e,f,h,k,l,m,n);var p=Za(q),r=$a(q);if(10===b)return a.ca?a.ca(c,d,e,f,h,
k,l,m,n,p):a.ca?a.ca(c,d,e,f,h,k,l,m,n,p):a.call(null,c,d,e,f,h,k,l,m,n,p);var q=Za(r),t=$a(r);if(11===b)return a.da?a.da(c,d,e,f,h,k,l,m,n,p,q):a.da?a.da(c,d,e,f,h,k,l,m,n,p,q):a.call(null,c,d,e,f,h,k,l,m,n,p,q);var r=Za(t),v=$a(t);if(12===b)return a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q,r):a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q,r):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r);var t=Za(v),w=$a(v);if(13===b)return a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r,t):a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r,t):a.call(null,c,d,e,f,h,k,l,m,n,p,q,
r,t);var v=Za(w),z=$a(w);if(14===b)return a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v);var w=Za(z),D=$a(z);if(15===b)return a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w);var z=Za(D),I=$a(D);if(16===b)return a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z);var D=Za(I),
S=$a(I);if(17===b)return a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D);var I=Za(S),la=$a(S);if(18===b)return a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I):a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I);S=Za(la);la=$a(la);if(19===b)return a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S):a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S):a.call(null,c,d,e,f,h,k,
l,m,n,p,q,r,t,v,w,z,D,I,S);var x=Za(la);$a(la);if(20===b)return a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S,x):a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S,x):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S,x);throw Error("Only up to 20 arguments supported on functions");}
var F=function F(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return F.b(arguments[0],arguments[1]);case 3:return F.c(arguments[0],arguments[1],arguments[2]);case 4:return F.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return F.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return F.l(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new J(c.slice(5),0))}};
F.b=function(a,b){var c=a.A;if(a.D){var d=Rd(b,c+1);return d<=c?Vd(a,d,b):a.D(b)}return a.apply(a,sd(b))};F.c=function(a,b,c){b=O(b,c);c=a.A;if(a.D){var d=Rd(b,c+1);return d<=c?Vd(a,d,b):a.D(b)}return a.apply(a,sd(b))};F.o=function(a,b,c,d){b=O(b,O(c,d));c=a.A;return a.D?(d=Rd(b,c+1),d<=c?Vd(a,d,b):a.D(b)):a.apply(a,sd(b))};F.C=function(a,b,c,d,e){b=O(b,O(c,O(d,e)));c=a.A;return a.D?(d=Rd(b,c+1),d<=c?Vd(a,d,b):a.D(b)):a.apply(a,sd(b))};
F.l=function(a,b,c,d,e,f){b=O(b,O(c,O(d,O(e,Sd(f)))));c=a.A;return a.D?(d=Rd(b,c+1),d<=c?Vd(a,d,b):a.D(b)):a.apply(a,sd(b))};F.D=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),e=M(d),d=L(e),f=M(e),e=L(f),f=M(f);return F.l(b,a,c,d,e,f)};F.A=5;
var Wd=function Wd(){"undefined"===typeof ta&&(ta=function(b,c){this.mc=b;this.lc=c;this.i=393216;this.B=0},ta.prototype.R=function(b,c){return new ta(this.mc,c)},ta.prototype.O=function(){return this.lc},ta.prototype.ua=function(){return!1},ta.prototype.next=function(){return Error("No such element")},ta.prototype.remove=function(){return Error("Unsupported operation")},ta.ic=function(){return new U(null,2,5,V,[Dc(Xd,new za(null,1,[Yd,cc(Zd,cc(Wc))],null)),sa.Ac],null)},ta.Db=!0,ta.mb="cljs.core/t_cljs$core15371",
ta.Mb=function(b,c){return Ab(c,"cljs.core/t_cljs$core15371")});return new ta(Wd,$d)};ae;function ae(a,b,c,d){this.ab=a;this.first=b;this.sa=c;this.v=d;this.i=31719628;this.B=0}g=ae.prototype;g.R=function(a,b){return new ae(this.ab,this.first,this.sa,b)};g.T=function(a,b){return O(b,xb(this))};g.w=function(a,b){return null!=xb(this)?Cc(this,b):fd(b)&&null==K(b)};g.N=function(){return xc(this)};g.S=function(){null!=this.ab&&this.ab.step(this);return null==this.sa?null:this};
g.$=function(){null!=this.ab&&xb(this);return null==this.sa?null:this.first};g.qa=function(){null!=this.ab&&xb(this);return null==this.sa?rc:this.sa};g.pa=function(){null!=this.ab&&xb(this);return null==this.sa?null:xb(this.sa)};ae.prototype[Pa]=function(){return tc(this)};function be(a,b){for(;;){if(null==K(b))return!0;var c;c=L(b);c=a.a?a.a(c):a.call(null,c);if(y(c)){c=a;var d=M(b);a=c;b=d}else return!1}}
function ce(a){for(var b=ud;;)if(K(a)){var c;c=L(a);c=b.a?b.a(c):b.call(null,c);if(y(c))return c;a=M(a)}else return null}
function de(a){return function(){function b(b,c){return Na(a.b?a.b(b,c):a.call(null,b,c))}function c(b){return Na(a.a?a.a(b):a.call(null,b))}function d(){return Na(a.u?a.u():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new J(h,0)}return c.call(this,a,d,f)}function c(b,d,e){return Na(F.o(a,b,d,e))}b.A=2;b.D=function(a){var b=L(a);a=M(a);var d=L(a);a=qc(a);return c(b,d,a)};b.l=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new J(n,0)}return f.l(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.A=2;e.D=f.D;e.u=d;e.a=c;e.b=b;e.l=f.l;return e}()}ee;function fe(a,b,c,d){this.state=a;this.v=b;this.qc=c;this.vb=d;this.B=16386;this.i=6455296}g=fe.prototype;
g.equiv=function(a){return this.w(null,a)};g.w=function(a,b){return this===b};g.tb=function(){return this.state};g.O=function(){return this.v};g.Kb=function(a,b,c){a=K(this.vb);for(var d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f),k=P(h,0),h=P(h,1);h.o?h.o(k,this,b,c):h.call(null,k,this,b,c);f+=1}else if(a=K(a))kd(a)?(d=Mb(a),a=Nb(a),k=d,e=Xc(d),d=k):(d=L(a),k=P(d,0),h=P(d,1),h.o?h.o(k,this,b,c):h.call(null,k,this,b,c),a=M(a),d=null,e=0),f=0;else return null};
g.Jb=function(a,b,c){this.vb=ad.c(this.vb,b,c);return this};g.N=function(){return ba(this)};var ge=function ge(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ge.a(arguments[0]);default:return ge.l(arguments[0],new J(c.slice(1),0))}};ge.a=function(a){return new fe(a,null,null,null)};ge.l=function(a,b){var c=null!=b&&(b.i&64||b.Ia)?F.b(Bc,b):b,d=H.b(c,Da),c=H.b(c,he);return new fe(a,d,c,null)};
ge.D=function(a){var b=L(a);a=M(a);return ge.l(b,a)};ge.A=1;ie;function je(a,b){if(a instanceof fe){var c=a.qc;if(null!=c&&!y(c.a?c.a(b):c.call(null,b)))throw Error([E("Assert failed: "),E("Validator rejected reference state"),E("\n"),E(function(){var a=cc(ke,le);return ie.a?ie.a(a):ie.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.vb&&Cb(a,c,b);return b}return Sb(a,b)}
var me=function me(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return me.b(arguments[0],arguments[1]);case 3:return me.c(arguments[0],arguments[1],arguments[2]);case 4:return me.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return me.l(arguments[0],arguments[1],arguments[2],arguments[3],new J(c.slice(4),0))}};me.b=function(a,b){var c;a instanceof fe?(c=a.state,c=b.a?b.a(c):b.call(null,c),c=je(a,c)):c=Tb.b(a,b);return c};
me.c=function(a,b,c){if(a instanceof fe){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=je(a,b)}else a=Tb.c(a,b,c);return a};me.o=function(a,b,c,d){if(a instanceof fe){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=je(a,b)}else a=Tb.o(a,b,c,d);return a};me.l=function(a,b,c,d,e){return a instanceof fe?je(a,F.C(b,a.state,c,d,e)):Tb.C(a,b,c,d,e)};me.D=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),e=M(d),d=L(e),e=M(e);return me.l(b,a,c,d,e)};me.A=4;
function ne(a){this.state=a;this.i=32768;this.B=0}ne.prototype.tb=function(){return this.state};function ee(a){return new ne(a)}
var Q=function Q(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Q.a(arguments[0]);case 2:return Q.b(arguments[0],arguments[1]);case 3:return Q.c(arguments[0],arguments[1],arguments[2]);case 4:return Q.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Q.l(arguments[0],arguments[1],arguments[2],arguments[3],new J(c.slice(4),0))}};
Q.a=function(a){return function(b){return function(){function c(c,d){var e=a.a?a.a(d):a.call(null,d);return b.b?b.b(c,e):b.call(null,c,e)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.u?b.u():b.call(null)}var f=null,h=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new J(h,0)}return d.call(this,a,b,f)}function d(c,e,f){e=F.c(a,e,f);return b.b?b.b(c,e):b.call(null,c,e)}c.A=2;c.D=function(a){var b=
L(a);a=M(a);var c=L(a);a=qc(a);return d(b,c,a)};c.l=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new J(p,0)}return h.l(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.A=2;f.D=h.D;f.u=e;f.a=d;f.b=c;f.l=h.l;return f}()}};
Q.b=function(a,b){return new Ld(null,function(){var c=K(b);if(c){if(kd(c)){for(var d=Mb(c),e=Xc(d),f=new Od(Array(e),0),h=0;;)if(h<e)Qd(f,function(){var b=G.b(d,h);return a.a?a.a(b):a.call(null,b)}()),h+=1;else break;return Pd(f.za(),Q.b(a,Nb(c)))}return O(function(){var b=L(c);return a.a?a.a(b):a.call(null,b)}(),Q.b(a,qc(c)))}return null},null,null)};
Q.c=function(a,b,c){return new Ld(null,function(){var d=K(b),e=K(c);if(d&&e){var f=O,h;h=L(d);var k=L(e);h=a.b?a.b(h,k):a.call(null,h,k);d=f(h,Q.c(a,qc(d),qc(e)))}else d=null;return d},null,null)};Q.o=function(a,b,c,d){return new Ld(null,function(){var e=K(b),f=K(c),h=K(d);if(e&&f&&h){var k=O,l;l=L(e);var m=L(f),n=L(h);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=k(l,Q.o(a,qc(e),qc(f),qc(h)))}else e=null;return e},null,null)};
Q.l=function(a,b,c,d,e){var f=function k(a){return new Ld(null,function(){var b=Q.b(K,a);return be(ud,b)?O(Q.b(L,b),k(Q.b(qc,b))):null},null,null)};return Q.b(function(){return function(b){return F.b(a,b)}}(f),f(Uc.l(e,d,oc([c,b],0))))};Q.D=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),e=M(d),d=L(e),e=M(e);return Q.l(b,a,c,d,e)};Q.A=4;
function oe(a,b){if("number"!==typeof a)throw Error([E("Assert failed: "),E(function(){var a=cc(pe,qe);return ie.a?ie.a(a):ie.call(null,a)}())].join(""));return new Ld(null,function(){if(0<a){var c=K(b);return c?O(L(c),oe(a-1,qc(c))):null}return null},null,null)}
function re(a,b){if("number"!==typeof a)throw Error([E("Assert failed: "),E(function(){var a=cc(pe,qe);return ie.a?ie.a(a):ie.call(null,a)}())].join(""));return new Ld(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=K(b);if(0<a&&e){var f=a-1,e=qc(e);a=f;b=e}else return e}}),null,null)}function se(a){return new Ld(null,function(){return O(a,se(a))},null,null)}
var te=function te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return te.b(arguments[0],arguments[1]);default:return te.l(arguments[0],arguments[1],new J(c.slice(2),0))}};te.b=function(a,b){return new Ld(null,function(){var c=K(a),d=K(b);return c&&d?O(L(c),O(L(d),te.b(qc(c),qc(d)))):null},null,null)};
te.l=function(a,b,c){return new Ld(null,function(){var d=Q.b(K,Uc.l(c,b,oc([a],0)));return be(ud,d)?Td.b(Q.b(L,d),F.b(te,Q.b(qc,d))):null},null,null)};te.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return te.l(b,a,c)};te.A=2;ve;function we(a,b){return F.b(Td,F.c(Q,a,b))}
function xe(a,b){return new Ld(null,function(){var c=K(b);if(c){if(kd(c)){for(var d=Mb(c),e=Xc(d),f=new Od(Array(e),0),h=0;;)if(h<e){var k;k=G.b(d,h);k=a.a?a.a(k):a.call(null,k);y(k)&&(k=G.b(d,h),f.add(k));h+=1}else break;return Pd(f.za(),xe(a,Nb(c)))}d=L(c);c=qc(c);return y(a.a?a.a(d):a.call(null,d))?O(d,xe(a,c)):xe(a,c)}return null},null,null)}
function ye(a){return function c(a){return new Ld(null,function(){return O(a,y(od.a?od.a(a):od.call(null,a))?we(c,oc([K.a?K.a(a):K.call(null,a)],0)):null)},null,null)}(a)}function ze(a,b,c){return new Ld(null,function(){var d=K(c);if(d){var e=oe(a,d);return a===Xc(e)?O(e,ze(a,b,re(b,d))):null}return null},null,null)}function Ae(a,b){this.L=a;this.f=b}
function Be(a){return new Ae(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function Ce(a){a=a.m;return 32>a?0:a-1>>>5<<5}function De(a,b,c){for(;;){if(0===b)return c;var d=Be(a);d.f[0]=c;c=d;b-=5}}var Ee=function Ee(b,c,d,e){var f=new Ae(d.L,Qa(d.f)),h=b.m-1>>>c&31;5===c?f.f[h]=e:(d=d.f[h],b=null!=d?Ee(b,c-5,d,e):De(null,c-5,e),f.f[h]=b);return f};
function Fe(a,b){throw Error([E("No item "),E(a),E(" in vector of length "),E(b)].join(""));}function Ge(a,b){if(b>=Ce(a))return a.I;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function He(a,b){return 0<=b&&b<a.m?Ge(a,b):Fe(b,a.m)}var Ie=function Ie(b,c,d,e,f){var h=new Ae(d.L,Qa(d.f));if(0===c)h.f[e&31]=f;else{var k=e>>>c&31;b=Ie(b,c-5,d.f[k],e,f);h.f[k]=b}return h};function Je(a,b,c,d,e,f){this.j=a;this.rb=b;this.f=c;this.Ha=d;this.start=e;this.end=f}
Je.prototype.ua=function(){return this.j<this.end};Je.prototype.next=function(){32===this.j-this.rb&&(this.f=Ge(this.Ha,this.j),this.rb+=32);var a=this.f[this.j&31];this.j+=1;return a};Ke;Le;Me;N;Ne;Oe;Pe;function U(a,b,c,d,e,f){this.v=a;this.m=b;this.shift=c;this.root=d;this.I=e;this.s=f;this.i=167668511;this.B=8196}g=U.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.J=function(a,b){return cb.c(this,b,null)};
g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};g.U=function(a,b){return He(this,b)[b&31]};g.ta=function(a,b,c){return 0<=b&&b<this.m?Ge(this,b)[b&31]:c};g.Qa=function(a,b,c){if(0<=b&&b<this.m)return Ce(this)<=b?(a=Qa(this.I),a[b&31]=c,new U(this.v,this.m,this.shift,this.root,a,null)):new U(this.v,this.m,this.shift,Ie(this,this.shift,this.root,b,c),this.I,null);if(b===this.m)return Va(this,c);throw Error([E("Index "),E(b),E(" out of bounds  [0,"),E(this.m),E("]")].join(""));};
g.Da=function(){var a=this.m;return new Je(0,0,0<Xc(this)?Ge(this,0):null,this,0,a)};g.O=function(){return this.v};g.X=function(){return this.m};g.fb=function(){return G.b(this,0)};g.gb=function(){return G.b(this,1)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){if(b instanceof U)if(this.m===Xc(b))for(var c=Ub(this),d=Ub(b);;)if(y(c.ua())){var e=c.next(),f=d.next();if(!ec.b(e,f))return!1}else return!0;else return!1;else return Cc(this,b)};
g.Wa=function(){return new Me(this.m,this.shift,Ke.a?Ke.a(this.root):Ke.call(null,this.root),Le.a?Le.a(this.I):Le.call(null,this.I))};g.Y=function(a,b){return Hc(this,b)};g.Z=function(a,b,c){a=0;for(var d=c;;)if(a<this.m){var e=Ge(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=e[f],d=b.b?b.b(d,h):b.call(null,d,h);if(Gc(d)){e=d;break a}f+=1}else{e=d;break a}if(Gc(e))return N.a?N.a(e):N.call(null,e);a+=c;d=e}else return d};
g.Pa=function(a,b,c){if("number"===typeof b)return mb(this,b,c);throw Error("Vector's key for assoc must be a number.");};g.S=function(){if(0===this.m)return null;if(32>=this.m)return new J(this.I,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return Pe.o?Pe.o(this,a,0,0):Pe.call(null,this,a,0,0)};g.R=function(a,b){return new U(b,this.m,this.shift,this.root,this.I,this.s)};
g.T=function(a,b){if(32>this.m-Ce(this)){for(var c=this.I.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.I[e],e+=1;else break;d[c]=b;return new U(this.v,this.m+1,this.shift,this.root,d,null)}c=(d=this.m>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=Be(null),d.f[0]=this.root,e=De(null,this.shift,new Ae(null,this.I)),d.f[1]=e):d=Ee(this,this.shift,this.root,new Ae(null,this.I));return new U(this.v,this.m+1,c,d,[b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.U(null,c);case 3:return this.ta(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.U(null,c)};a.c=function(a,c,d){return this.ta(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Qa(b)))};g.a=function(a){return this.U(null,a)};g.b=function(a,b){return this.ta(null,a,b)};
var V=new Ae(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Wc=new U(null,0,5,V,[],yc);U.prototype[Pa]=function(){return tc(this)};function td(a){if(Ma(a))a:{var b=a.length;if(32>b)a=new U(null,b,5,V,a,null);else for(var c=32,d=(new U(null,32,5,V,a.slice(0,32),null)).Wa(null);;)if(c<b)var e=c+1,d=Ud.b(d,a[c]),c=e;else{a=Gb(d);break a}}else a=Gb(Ra.c(Fb,Eb(Wc),a));return a}Qe;
function jd(a,b,c,d,e,f){this.xa=a;this.node=b;this.j=c;this.ba=d;this.v=e;this.s=f;this.i=32375020;this.B=1536}g=jd.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){if(this.ba+1<this.node.length){var a;a=this.xa;var b=this.node,c=this.j,d=this.ba+1;a=Pe.o?Pe.o(a,b,c,d):Pe.call(null,a,b,c,d);return null==a?null:a}return Pb(this)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};
g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){var c;c=this.xa;var d=this.j+this.ba,e=Xc(this.xa);c=Qe.c?Qe.c(c,d,e):Qe.call(null,c,d,e);return Hc(c,b)};g.Z=function(a,b,c){a=this.xa;var d=this.j+this.ba,e=Xc(this.xa);a=Qe.c?Qe.c(a,d,e):Qe.call(null,a,d,e);return Ic(a,b,c)};g.$=function(){return this.node[this.ba]};g.qa=function(){if(this.ba+1<this.node.length){var a;a=this.xa;var b=this.node,c=this.j,d=this.ba+1;a=Pe.o?Pe.o(a,b,c,d):Pe.call(null,a,b,c,d);return null==a?rc:a}return Nb(this)};
g.S=function(){return this};g.Ab=function(){var a=this.node;return new Nd(a,this.ba,a.length)};g.Bb=function(){var a=this.j+this.node.length;if(a<Ta(this.xa)){var b=this.xa,c=Ge(this.xa,a);return Pe.o?Pe.o(b,c,a,0):Pe.call(null,b,c,a,0)}return rc};g.R=function(a,b){return Pe.C?Pe.C(this.xa,this.node,this.j,this.ba,b):Pe.call(null,this.xa,this.node,this.j,this.ba,b)};g.T=function(a,b){return O(b,this)};
g.zb=function(){var a=this.j+this.node.length;if(a<Ta(this.xa)){var b=this.xa,c=Ge(this.xa,a);return Pe.o?Pe.o(b,c,a,0):Pe.call(null,b,c,a,0)}return null};jd.prototype[Pa]=function(){return tc(this)};
var Pe=function Pe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Pe.c(arguments[0],arguments[1],arguments[2]);case 4:return Pe.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Pe.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Pe.c=function(a,b,c){return new jd(a,He(a,b),b,c,null,null)};
Pe.o=function(a,b,c,d){return new jd(a,b,c,d,null,null)};Pe.C=function(a,b,c,d,e){return new jd(a,b,c,d,e,null)};Pe.A=5;Re;function Se(a,b,c,d,e){this.v=a;this.Ha=b;this.start=c;this.end=d;this.s=e;this.i=167666463;this.B=8192}g=Se.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.J=function(a,b){return cb.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
g.U=function(a,b){return 0>b||this.end<=this.start+b?Fe(b,this.end-this.start):G.b(this.Ha,this.start+b)};g.ta=function(a,b,c){return 0>b||this.end<=this.start+b?c:G.c(this.Ha,this.start+b,c)};g.Qa=function(a,b,c){var d=this.start+b;a=this.v;c=ad.c(this.Ha,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Re.C?Re.C(a,c,b,d,null):Re.call(null,a,c,b,d,null)};g.O=function(){return this.v};g.X=function(){return this.end-this.start};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};
g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Hc(this,b)};g.Z=function(a,b,c){return Ic(this,b,c)};g.Pa=function(a,b,c){if("number"===typeof b)return mb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};g.S=function(){var a=this;return function(b){return function d(e){return e===a.end?null:O(G.b(a.Ha,e),new Ld(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
g.R=function(a,b){return Re.C?Re.C(b,this.Ha,this.start,this.end,this.s):Re.call(null,b,this.Ha,this.start,this.end,this.s)};g.T=function(a,b){var c=this.v,d=mb(this.Ha,this.end,b),e=this.start,f=this.end+1;return Re.C?Re.C(c,d,e,f,null):Re.call(null,c,d,e,f,null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.U(null,c);case 3:return this.ta(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.U(null,c)};a.c=function(a,c,d){return this.ta(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Qa(b)))};g.a=function(a){return this.U(null,a)};g.b=function(a,b){return this.ta(null,a,b)};Se.prototype[Pa]=function(){return tc(this)};
function Re(a,b,c,d,e){for(;;)if(b instanceof Se)c=b.start+c,d=b.start+d,b=b.Ha;else{var f=Xc(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Se(a,b,c,d,e)}}var Qe=function Qe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Qe.b(arguments[0],arguments[1]);case 3:return Qe.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Qe.b=function(a,b){return Qe.c(a,b,Xc(a))};Qe.c=function(a,b,c){return Re(null,a,b,c,null)};Qe.A=3;function Te(a,b){return a===b.L?b:new Ae(a,Qa(b.f))}function Ke(a){return new Ae({},Qa(a.f))}function Le(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];md(a,0,b,0,a.length);return b}
var Ue=function Ue(b,c,d,e){d=Te(b.root.L,d);var f=b.m-1>>>c&31;if(5===c)b=e;else{var h=d.f[f];b=null!=h?Ue(b,c-5,h,e):De(b.root.L,c-5,e)}d.f[f]=b;return d};function Me(a,b,c,d){this.m=a;this.shift=b;this.root=c;this.I=d;this.B=88;this.i=275}g=Me.prototype;
g.kb=function(a,b){if(this.root.L){if(32>this.m-Ce(this))this.I[this.m&31]=b;else{var c=new Ae(this.root.L,this.I),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.I=d;if(this.m>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=De(this.root.L,this.shift,c);this.root=new Ae(this.root.L,d);this.shift=e}else this.root=Ue(this,this.shift,this.root,c)}this.m+=1;return this}throw Error("conj! after persistent!");};g.lb=function(){if(this.root.L){this.root.L=null;var a=this.m-Ce(this),b=Array(a);md(this.I,0,b,0,a);return new U(null,this.m,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
g.jb=function(a,b,c){if("number"===typeof b)return Ib(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
g.Ib=function(a,b,c){var d=this;if(d.root.L){if(0<=b&&b<d.m)return Ce(this)<=b?d.I[b&31]=c:(a=function(){return function f(a,k){var l=Te(d.root.L,k);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.m)return Fb(this,c);throw Error([E("Index "),E(b),E(" out of bounds for TransientVector of length"),E(d.m)].join(""));}throw Error("assoc! after persistent!");};
g.X=function(){if(this.root.L)return this.m;throw Error("count after persistent!");};g.U=function(a,b){if(this.root.L)return He(this,b)[b&31];throw Error("nth after persistent!");};g.ta=function(a,b,c){return 0<=b&&b<this.m?G.b(this,b):c};g.J=function(a,b){return cb.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Qa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};function Ve(){this.i=2097152;this.B=0}
Ve.prototype.equiv=function(a){return this.w(null,a)};Ve.prototype.w=function(){return!1};var We=new Ve;function Xe(a,b){return pd(gd(b)?Xc(a)===Xc(b)?be(ud,Q.b(function(a){return ec.b(H.c(b,L(a),We),Tc(a))},a)):null:null)}function Ye(a){this.F=a}Ye.prototype.next=function(){if(null!=this.F){var a=L(this.F),b=P(a,0),a=P(a,1);this.F=M(this.F);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Ze(a){return new Ye(K(a))}function $e(a){this.F=a}
$e.prototype.next=function(){if(null!=this.F){var a=L(this.F);this.F=M(this.F);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function af(a,b){var c;if(b instanceof A)a:{c=a.length;for(var d=b.Ea,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof A&&d===a[e].Ea){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof dc)a:for(c=a.length,d=b.Ga,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof dc&&d===a[e].Ga){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(ec.b(b,a[d])){c=d;break a}d+=2}return c}bf;function cf(a,b,c){this.f=a;this.j=b;this.ya=c;this.i=32374990;this.B=0}g=cf.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.ya};g.pa=function(){return this.j<this.f.length-2?new cf(this.f,this.j+2,this.ya):null};g.X=function(){return(this.f.length-this.j)/2};g.N=function(){return xc(this)};g.w=function(a,b){return Cc(this,b)};
g.Y=function(a,b){return Sc.b(b,this)};g.Z=function(a,b,c){return Sc.c(b,c,this)};g.$=function(){return new U(null,2,5,V,[this.f[this.j],this.f[this.j+1]],null)};g.qa=function(){return this.j<this.f.length-2?new cf(this.f,this.j+2,this.ya):rc};g.S=function(){return this};g.R=function(a,b){return new cf(this.f,this.j,b)};g.T=function(a,b){return O(b,this)};cf.prototype[Pa]=function(){return tc(this)};df;ef;function ff(a,b,c){this.f=a;this.j=b;this.m=c}ff.prototype.ua=function(){return this.j<this.m};
ff.prototype.next=function(){var a=new U(null,2,5,V,[this.f[this.j],this.f[this.j+1]],null);this.j+=2;return a};function za(a,b,c,d){this.v=a;this.m=b;this.f=c;this.s=d;this.i=16647951;this.B=8196}g=za.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.keys=function(){return tc(df.a?df.a(this):df.call(null,this))};g.entries=function(){return Ze(K(this))};g.values=function(){return tc(ef.a?ef.a(this):ef.call(null,this))};g.has=function(a){return qd(this,a)};
g.get=function(a,b){return this.H(null,a,b)};g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=P(f,0),f=P(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=K(b))kd(b)?(c=Mb(b),b=Nb(b),h=c,d=Xc(c),c=h):(c=L(b),h=P(c,0),f=P(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return cb.c(this,b,null)};g.H=function(a,b,c){a=af(this.f,b);return-1===a?c:this.f[a+1]};g.Da=function(){return new ff(this.f,0,2*this.m)};g.O=function(){return this.v};
g.X=function(){return this.m};g.N=function(){var a=this.s;return null!=a?a:this.s=a=zc(this)};g.w=function(a,b){if(null!=b&&(b.i&1024||b.Vb)){var c=this.f.length;if(this.m===b.X(null))for(var d=0;;)if(d<c){var e=b.H(null,this.f[d],nd);if(e!==nd)if(ec.b(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Xe(this,b)};g.Wa=function(){return new bf({},this.f.length,Qa(this.f))};g.Y=function(a,b){return Sc.b(b,this)};g.Z=function(a,b,c){return Sc.c(b,c,this)};
g.Pa=function(a,b,c){a=af(this.f,b);if(-1===a){if(this.m<gf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new za(this.v,this.m+1,e,null)}a=bd;null!=a?null!=a&&(a.B&4||a.tc)?(d=Ra.c(Fb,Eb(a),this),d=Gb(d),a=Dc(d,dd(a))):a=Ra.c(Va,a,this):a=Ra.c(Uc,rc,this);return qb(fb(a,b,c),this.v)}if(c===this.f[a+1])return this;b=Qa(this.f);b[a+1]=c;return new za(this.v,this.m,b,null)};g.yb=function(a,b){return-1!==af(this.f,b)};
g.S=function(){var a=this.f;return 0<=a.length-2?new cf(a,0,null):null};g.R=function(a,b){return new za(b,this.m,this.f,this.s)};g.T=function(a,b){if(hd(b))return fb(this,G.b(b,0),G.b(b,1));for(var c=this,d=K(b);;){if(null==d)return c;var e=L(d);if(hd(e))c=fb(c,G.b(e,0),G.b(e,1)),d=M(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Qa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};var $d=new za(null,0,[],Ac),gf=8;za.prototype[Pa]=function(){return tc(this)};
hf;function bf(a,b,c){this.Xa=a;this.Ta=b;this.f=c;this.i=258;this.B=56}g=bf.prototype;g.X=function(){if(y(this.Xa))return zd(this.Ta);throw Error("count after persistent!");};g.J=function(a,b){return cb.c(this,b,null)};g.H=function(a,b,c){if(y(this.Xa))return a=af(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
g.kb=function(a,b){if(y(this.Xa)){if(null!=b?b.i&2048||b.Wb||(b.i?0:B(hb,b)):B(hb,b))return Hb(this,Dd.a?Dd.a(b):Dd.call(null,b),Ed.a?Ed.a(b):Ed.call(null,b));for(var c=K(b),d=this;;){var e=L(c);if(y(e))c=M(c),d=Hb(d,Dd.a?Dd.a(e):Dd.call(null,e),Ed.a?Ed.a(e):Ed.call(null,e));else return d}}else throw Error("conj! after persistent!");};g.lb=function(){if(y(this.Xa))return this.Xa=!1,new za(null,zd(this.Ta),this.f,null);throw Error("persistent! called twice");};
g.jb=function(a,b,c){if(y(this.Xa)){a=af(this.f,b);if(-1===a){if(this.Ta+2<=2*gf)return this.Ta+=2,this.f.push(b),this.f.push(c),this;a=hf.b?hf.b(this.Ta,this.f):hf.call(null,this.Ta,this.f);return Hb(a,b,c)}c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};jf;$c;function hf(a,b){for(var c=Eb(bd),d=0;;)if(d<a)c=Hb(c,b[d],b[d+1]),d+=2;else return c}function kf(){this.M=!1}lf;mf;je;nf;ge;N;
function of(a,b){return a===b?!0:a===b||a instanceof A&&b instanceof A&&a.Ea===b.Ea?!0:ec.b(a,b)}function pf(a,b,c){a=Qa(a);a[b]=c;return a}function qf(a,b,c,d){a=a.Ra(b);a.f[c]=d;return a}rf;function sf(a,b,c,d){this.f=a;this.j=b;this.qb=c;this.Ca=d}sf.prototype.advance=function(){for(var a=this.f.length;;)if(this.j<a){var b=this.f[this.j],c=this.f[this.j+1];null!=b?b=this.qb=new U(null,2,5,V,[b,c],null):null!=c?(b=Ub(c),b=b.ua()?this.Ca=b:!1):b=!1;this.j+=2;if(b)return!0}else return!1};
sf.prototype.ua=function(){var a=null!=this.qb;return a?a:(a=null!=this.Ca)?a:this.advance()};sf.prototype.next=function(){if(null!=this.qb){var a=this.qb;this.qb=null;return a}if(null!=this.Ca)return a=this.Ca.next(),this.Ca.ua()||(this.Ca=null),a;if(this.advance())return this.next();throw Error("No such element");};sf.prototype.remove=function(){return Error("Unsupported operation")};function tf(a,b,c){this.L=a;this.aa=b;this.f=c}g=tf.prototype;
g.Ra=function(a){if(a===this.L)return this;var b=Ad(this.aa),c=Array(0>b?4:2*(b+1));md(this.f,0,c,0,2*b);return new tf(a,this.aa,c)};g.ob=function(){return lf.a?lf.a(this.f):lf.call(null,this.f)};g.La=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.aa&e))return d;var f=Ad(this.aa&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.La(a+5,b,c,d):of(c,e)?f:d};
g.Ba=function(a,b,c,d,e,f){var h=1<<(c>>>b&31),k=Ad(this.aa&h-1);if(0===(this.aa&h)){var l=Ad(this.aa);if(2*l<this.f.length){a=this.Ra(a);b=a.f;f.M=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.aa|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=uf.Ba(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.aa>>>d&1)&&(k[d]=null!=this.f[e]?uf.Ba(a,b+5,jc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new rf(a,l+1,k)}b=Array(2*(l+4));md(this.f,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;md(this.f,2*k,b,2*(k+1),2*(l-k));f.M=!0;a=this.Ra(a);a.f=b;a.aa|=h;return a}l=this.f[2*k];h=this.f[2*k+1];if(null==l)return l=h.Ba(a,b+5,c,d,e,f),l===h?this:qf(this,a,2*k+1,l);if(of(d,l))return e===h?this:qf(this,a,2*k+1,e);f.M=!0;f=b+5;d=nf.W?nf.W(a,f,l,h,c,d,e):nf.call(null,a,f,l,h,c,d,e);e=2*
k;k=2*k+1;a=this.Ra(a);a.f[e]=null;a.f[k]=d;return a};
g.Aa=function(a,b,c,d,e){var f=1<<(b>>>a&31),h=Ad(this.aa&f-1);if(0===(this.aa&f)){var k=Ad(this.aa);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=uf.Aa(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.aa>>>c&1)&&(h[c]=null!=this.f[d]?uf.Aa(a+5,jc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new rf(null,k+1,h)}a=Array(2*(k+1));md(this.f,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;md(this.f,2*h,a,2*(h+1),2*(k-h));e.M=!0;return new tf(null,this.aa|f,a)}var l=this.f[2*h],f=this.f[2*h+1];if(null==l)return k=f.Aa(a+5,b,c,d,e),k===f?this:new tf(null,this.aa,pf(this.f,2*h+1,k));if(of(c,l))return d===f?this:new tf(null,this.aa,pf(this.f,2*h+1,d));e.M=!0;e=this.aa;k=this.f;a+=5;a=nf.V?nf.V(a,l,f,b,c,d):nf.call(null,a,l,f,b,c,d);c=2*h;h=2*h+1;d=Qa(k);d[c]=null;d[h]=a;return new tf(null,e,d)};g.Da=function(){return new sf(this.f,0,null,null)};
var uf=new tf(null,0,[]);function vf(a,b,c){this.f=a;this.j=b;this.Ca=c}vf.prototype.ua=function(){for(var a=this.f.length;;){if(null!=this.Ca&&this.Ca.ua())return!0;if(this.j<a){var b=this.f[this.j];this.j+=1;null!=b&&(this.Ca=Ub(b))}else return!1}};vf.prototype.next=function(){if(this.ua())return this.Ca.next();throw Error("No such element");};vf.prototype.remove=function(){return Error("Unsupported operation")};function rf(a,b,c){this.L=a;this.m=b;this.f=c}g=rf.prototype;
g.Ra=function(a){return a===this.L?this:new rf(a,this.m,Qa(this.f))};g.ob=function(){return mf.a?mf.a(this.f):mf.call(null,this.f)};g.La=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.La(a+5,b,c,d):d};g.Ba=function(a,b,c,d,e,f){var h=c>>>b&31,k=this.f[h];if(null==k)return a=qf(this,a,h,uf.Ba(a,b+5,c,d,e,f)),a.m+=1,a;b=k.Ba(a,b+5,c,d,e,f);return b===k?this:qf(this,a,h,b)};
g.Aa=function(a,b,c,d,e){var f=b>>>a&31,h=this.f[f];if(null==h)return new rf(null,this.m+1,pf(this.f,f,uf.Aa(a+5,b,c,d,e)));a=h.Aa(a+5,b,c,d,e);return a===h?this:new rf(null,this.m,pf(this.f,f,a))};g.Da=function(){return new vf(this.f,0,null)};function wf(a,b,c){b*=2;for(var d=0;;)if(d<b){if(of(c,a[d]))return d;d+=2}else return-1}function xf(a,b,c,d){this.L=a;this.Ka=b;this.m=c;this.f=d}g=xf.prototype;
g.Ra=function(a){if(a===this.L)return this;var b=Array(2*(this.m+1));md(this.f,0,b,0,2*this.m);return new xf(a,this.Ka,this.m,b)};g.ob=function(){return lf.a?lf.a(this.f):lf.call(null,this.f)};g.La=function(a,b,c,d){a=wf(this.f,this.m,c);return 0>a?d:of(c,this.f[a])?this.f[a+1]:d};
g.Ba=function(a,b,c,d,e,f){if(c===this.Ka){b=wf(this.f,this.m,d);if(-1===b){if(this.f.length>2*this.m)return b=2*this.m,c=2*this.m+1,a=this.Ra(a),a.f[b]=d,a.f[c]=e,f.M=!0,a.m+=1,a;c=this.f.length;b=Array(c+2);md(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.M=!0;d=this.m+1;a===this.L?(this.f=b,this.m=d,a=this):a=new xf(this.L,this.Ka,d,b);return a}return this.f[b+1]===e?this:qf(this,a,b+1,e)}return(new tf(a,1<<(this.Ka>>>b&31),[null,this,null,null])).Ba(a,b,c,d,e,f)};
g.Aa=function(a,b,c,d,e){return b===this.Ka?(a=wf(this.f,this.m,c),-1===a?(a=2*this.m,b=Array(a+2),md(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.M=!0,new xf(null,this.Ka,this.m+1,b)):ec.b(this.f[a],d)?this:new xf(null,this.Ka,this.m,pf(this.f,a+1,d))):(new tf(null,1<<(this.Ka>>>a&31),[null,this])).Aa(a,b,c,d,e)};g.Da=function(){return new sf(this.f,0,null,null)};
var nf=function nf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return nf.V(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return nf.W(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
nf.V=function(a,b,c,d,e,f){var h=jc(b);if(h===d)return new xf(null,h,2,[b,c,e,f]);var k=new kf;return uf.Aa(a,h,b,c,k).Aa(a,d,e,f,k)};nf.W=function(a,b,c,d,e,f,h){var k=jc(c);if(k===e)return new xf(null,k,2,[c,d,f,h]);var l=new kf;return uf.Ba(a,b,k,c,d,l).Ba(a,b,e,f,h,l)};nf.A=7;function yf(a,b,c,d,e){this.v=a;this.Ma=b;this.j=c;this.F=d;this.s=e;this.i=32374860;this.B=0}g=yf.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};
g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Sc.b(b,this)};g.Z=function(a,b,c){return Sc.c(b,c,this)};g.$=function(){return null==this.F?new U(null,2,5,V,[this.Ma[this.j],this.Ma[this.j+1]],null):L(this.F)};g.qa=function(){if(null==this.F){var a=this.Ma,b=this.j+2;return lf.c?lf.c(a,b,null):lf.call(null,a,b,null)}var a=this.Ma,b=this.j,c=M(this.F);return lf.c?lf.c(a,b,c):lf.call(null,a,b,c)};g.S=function(){return this};
g.R=function(a,b){return new yf(b,this.Ma,this.j,this.F,this.s)};g.T=function(a,b){return O(b,this)};yf.prototype[Pa]=function(){return tc(this)};var lf=function lf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return lf.a(arguments[0]);case 3:return lf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};lf.a=function(a){return lf.c(a,0,null)};
lf.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new yf(null,a,b,null,null);var d=a[b+1];if(y(d)&&(d=d.ob(),y(d)))return new yf(null,a,b+2,d,null);b+=2}else return null;else return new yf(null,a,b,c,null)};lf.A=3;function zf(a,b,c,d,e){this.v=a;this.Ma=b;this.j=c;this.F=d;this.s=e;this.i=32374860;this.B=0}g=zf.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};
g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Sc.b(b,this)};g.Z=function(a,b,c){return Sc.c(b,c,this)};g.$=function(){return L(this.F)};g.qa=function(){var a=this.Ma,b=this.j,c=M(this.F);return mf.o?mf.o(null,a,b,c):mf.call(null,null,a,b,c)};g.S=function(){return this};g.R=function(a,b){return new zf(b,this.Ma,this.j,this.F,this.s)};g.T=function(a,b){return O(b,this)};zf.prototype[Pa]=function(){return tc(this)};
var mf=function mf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return mf.a(arguments[0]);case 4:return mf.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};mf.a=function(a){return mf.o(null,a,0,null)};
mf.o=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(y(e)&&(e=e.ob(),y(e)))return new zf(a,b,c+1,e,null);c+=1}else return null;else return new zf(a,b,c,d,null)};mf.A=4;jf;function Af(a,b,c){this.wa=a;this.Pb=b;this.Eb=c}Af.prototype.ua=function(){return this.Eb&&this.Pb.ua()};Af.prototype.next=function(){if(this.Eb)return this.Pb.next();this.Eb=!0;return this.wa};Af.prototype.remove=function(){return Error("Unsupported operation")};
function $c(a,b,c,d,e,f){this.v=a;this.m=b;this.root=c;this.va=d;this.wa=e;this.s=f;this.i=16123663;this.B=8196}g=$c.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.keys=function(){return tc(df.a?df.a(this):df.call(null,this))};g.entries=function(){return Ze(K(this))};g.values=function(){return tc(ef.a?ef.a(this):ef.call(null,this))};g.has=function(a){return qd(this,a)};g.get=function(a,b){return this.H(null,a,b)};
g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=P(f,0),f=P(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=K(b))kd(b)?(c=Mb(b),b=Nb(b),h=c,d=Xc(c),c=h):(c=L(b),h=P(c,0),f=P(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return cb.c(this,b,null)};g.H=function(a,b,c){return null==b?this.va?this.wa:c:null==this.root?c:this.root.La(0,jc(b),b,c)};
g.Da=function(){var a=this.root?Ub(this.root):Wd;return this.va?new Af(this.wa,a,!1):a};g.O=function(){return this.v};g.X=function(){return this.m};g.N=function(){var a=this.s;return null!=a?a:this.s=a=zc(this)};g.w=function(a,b){return Xe(this,b)};g.Wa=function(){return new jf({},this.root,this.m,this.va,this.wa)};
g.Pa=function(a,b,c){if(null==b)return this.va&&c===this.wa?this:new $c(this.v,this.va?this.m:this.m+1,this.root,!0,c,null);a=new kf;b=(null==this.root?uf:this.root).Aa(0,jc(b),b,c,a);return b===this.root?this:new $c(this.v,a.M?this.m+1:this.m,b,this.va,this.wa,null)};g.yb=function(a,b){return null==b?this.va:null==this.root?!1:this.root.La(0,jc(b),b,nd)!==nd};g.S=function(){if(0<this.m){var a=null!=this.root?this.root.ob():null;return this.va?O(new U(null,2,5,V,[null,this.wa],null),a):a}return null};
g.R=function(a,b){return new $c(b,this.m,this.root,this.va,this.wa,this.s)};g.T=function(a,b){if(hd(b))return fb(this,G.b(b,0),G.b(b,1));for(var c=this,d=K(b);;){if(null==d)return c;var e=L(d);if(hd(e))c=fb(c,G.b(e,0),G.b(e,1)),d=M(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Qa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};var bd=new $c(null,0,null,!1,null,Ac);$c.prototype[Pa]=function(){return tc(this)};
function jf(a,b,c,d,e){this.L=a;this.root=b;this.count=c;this.va=d;this.wa=e;this.i=258;this.B=56}function Bf(a,b,c){if(a.L){if(null==b)a.wa!==c&&(a.wa=c),a.va||(a.count+=1,a.va=!0);else{var d=new kf;b=(null==a.root?uf:a.root).Ba(a.L,0,jc(b),b,c,d);b!==a.root&&(a.root=b);d.M&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}g=jf.prototype;g.X=function(){if(this.L)return this.count;throw Error("count after persistent!");};
g.J=function(a,b){return null==b?this.va?this.wa:null:null==this.root?null:this.root.La(0,jc(b),b)};g.H=function(a,b,c){return null==b?this.va?this.wa:c:null==this.root?c:this.root.La(0,jc(b),b,c)};
g.kb=function(a,b){var c;a:if(this.L)if(null!=b?b.i&2048||b.Wb||(b.i?0:B(hb,b)):B(hb,b))c=Bf(this,Dd.a?Dd.a(b):Dd.call(null,b),Ed.a?Ed.a(b):Ed.call(null,b));else{c=K(b);for(var d=this;;){var e=L(c);if(y(e))c=M(c),d=Bf(d,Dd.a?Dd.a(e):Dd.call(null,e),Ed.a?Ed.a(e):Ed.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};g.lb=function(){var a;if(this.L)this.L=null,a=new $c(null,this.count,this.root,this.va,this.wa,null);else throw Error("persistent! called twice");return a};
g.jb=function(a,b,c){return Bf(this,b,c)};Cf;Df;function Df(a,b,c,d,e){this.key=a;this.M=b;this.left=c;this.right=d;this.s=e;this.i=32402207;this.B=0}g=Df.prototype;g.replace=function(a,b,c,d){return new Df(a,b,c,d,null)};g.J=function(a,b){return G.c(this,b,null)};g.H=function(a,b,c){return G.c(this,b,c)};g.U=function(a,b){return 0===b?this.key:1===b?this.M:null};g.ta=function(a,b,c){return 0===b?this.key:1===b?this.M:c};
g.Qa=function(a,b,c){return(new U(null,2,5,V,[this.key,this.M],null)).Qa(null,b,c)};g.O=function(){return null};g.X=function(){return 2};g.fb=function(){return this.key};g.gb=function(){return this.M};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Hc(this,b)};g.Z=function(a,b,c){return Ic(this,b,c)};g.Pa=function(a,b,c){return ad.c(new U(null,2,5,V,[this.key,this.M],null),b,c)};g.S=function(){return Va(Va(rc,this.M),this.key)};
g.R=function(a,b){return Dc(new U(null,2,5,V,[this.key,this.M],null),b)};g.T=function(a,b){return new U(null,3,5,V,[this.key,this.M,b],null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Qa(b)))};
g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};Df.prototype[Pa]=function(){return tc(this)};function Cf(a,b,c,d,e){this.key=a;this.M=b;this.left=c;this.right=d;this.s=e;this.i=32402207;this.B=0}g=Cf.prototype;g.replace=function(a,b,c,d){return new Cf(a,b,c,d,null)};g.J=function(a,b){return G.c(this,b,null)};g.H=function(a,b,c){return G.c(this,b,c)};g.U=function(a,b){return 0===b?this.key:1===b?this.M:null};
g.ta=function(a,b,c){return 0===b?this.key:1===b?this.M:c};g.Qa=function(a,b,c){return(new U(null,2,5,V,[this.key,this.M],null)).Qa(null,b,c)};g.O=function(){return null};g.X=function(){return 2};g.fb=function(){return this.key};g.gb=function(){return this.M};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Hc(this,b)};g.Z=function(a,b,c){return Ic(this,b,c)};
g.Pa=function(a,b,c){return ad.c(new U(null,2,5,V,[this.key,this.M],null),b,c)};g.S=function(){return Va(Va(rc,this.M),this.key)};g.R=function(a,b){return Dc(new U(null,2,5,V,[this.key,this.M],null),b)};g.T=function(a,b){return new U(null,3,5,V,[this.key,this.M,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Qa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};Cf.prototype[Pa]=function(){return tc(this)};Dd;
var Bc=function Bc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Bc.l(0<c.length?new J(c.slice(0),0):null)};Bc.l=function(a){for(var b=K(a),c=Eb(bd);;)if(b){a=M(M(b));var d=L(b),b=Tc(b),c=Hb(c,d,b),b=a}else return Gb(c)};Bc.A=0;Bc.D=function(a){return Bc.l(K(a))};function Ef(a,b){this.G=a;this.ya=b;this.i=32374988;this.B=0}g=Ef.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.ya};
g.pa=function(){var a=(null!=this.G?this.G.i&128||this.G.ub||(this.G.i?0:B(ab,this.G)):B(ab,this.G))?this.G.pa(null):M(this.G);return null==a?null:new Ef(a,this.ya)};g.N=function(){return xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Sc.b(b,this)};g.Z=function(a,b,c){return Sc.c(b,c,this)};g.$=function(){return this.G.$(null).fb(null)};
g.qa=function(){var a=(null!=this.G?this.G.i&128||this.G.ub||(this.G.i?0:B(ab,this.G)):B(ab,this.G))?this.G.pa(null):M(this.G);return null!=a?new Ef(a,this.ya):rc};g.S=function(){return this};g.R=function(a,b){return new Ef(this.G,b)};g.T=function(a,b){return O(b,this)};Ef.prototype[Pa]=function(){return tc(this)};function df(a){return(a=K(a))?new Ef(a,null):null}function Dd(a){return ib(a)}function Ff(a,b){this.G=a;this.ya=b;this.i=32374988;this.B=0}g=Ff.prototype;g.toString=function(){return Wb(this)};
g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.ya};g.pa=function(){var a=(null!=this.G?this.G.i&128||this.G.ub||(this.G.i?0:B(ab,this.G)):B(ab,this.G))?this.G.pa(null):M(this.G);return null==a?null:new Ff(a,this.ya)};g.N=function(){return xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Sc.b(b,this)};g.Z=function(a,b,c){return Sc.c(b,c,this)};g.$=function(){return this.G.$(null).gb(null)};
g.qa=function(){var a=(null!=this.G?this.G.i&128||this.G.ub||(this.G.i?0:B(ab,this.G)):B(ab,this.G))?this.G.pa(null):M(this.G);return null!=a?new Ff(a,this.ya):rc};g.S=function(){return this};g.R=function(a,b){return new Ff(this.G,b)};g.T=function(a,b){return O(b,this)};Ff.prototype[Pa]=function(){return tc(this)};function ef(a){return(a=K(a))?new Ff(a,null):null}function Ed(a){return jb(a)}
var Gf=function Gf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Gf.l(0<c.length?new J(c.slice(0),0):null)};Gf.l=function(a){return y(ce(a))?Ra.b(function(a,c){return Uc.b(y(a)?a:$d,c)},a):null};Gf.A=0;Gf.D=function(a){return Gf.l(K(a))};Hf;function If(a){this.Za=a}If.prototype.ua=function(){return this.Za.ua()};If.prototype.next=function(){if(this.Za.ua())return this.Za.next().I[0];throw Error("No such element");};If.prototype.remove=function(){return Error("Unsupported operation")};
function Jf(a,b,c){this.v=a;this.Sa=b;this.s=c;this.i=15077647;this.B=8196}g=Jf.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.keys=function(){return tc(K(this))};g.entries=function(){var a=K(this);return new $e(K(a))};g.values=function(){return tc(K(this))};g.has=function(a){return qd(this,a)};
g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=P(f,0),f=P(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=K(b))kd(b)?(c=Mb(b),b=Nb(b),h=c,d=Xc(c),c=h):(c=L(b),h=P(c,0),f=P(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return cb.c(this,b,null)};g.H=function(a,b,c){return db(this.Sa,b)?b:c};g.Da=function(){return new If(Ub(this.Sa))};g.O=function(){return this.v};g.X=function(){return Ta(this.Sa)};
g.N=function(){var a=this.s;return null!=a?a:this.s=a=zc(this)};g.w=function(a,b){return ed(b)&&Xc(this)===Xc(b)&&be(function(a){return function(b){return qd(a,b)}}(this),b)};g.Wa=function(){return new Hf(Eb(this.Sa))};g.S=function(){return df(this.Sa)};g.R=function(a,b){return new Jf(b,this.Sa,this.s)};g.T=function(a,b){return new Jf(this.v,ad.c(this.Sa,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Qa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};Jf.prototype[Pa]=function(){return tc(this)};
function Hf(a){this.Ja=a;this.B=136;this.i=259}g=Hf.prototype;g.kb=function(a,b){this.Ja=Hb(this.Ja,b,null);return this};g.lb=function(){return new Jf(null,Gb(this.Ja),null)};g.X=function(){return Xc(this.Ja)};g.J=function(a,b){return cb.c(this,b,null)};g.H=function(a,b,c){return cb.c(this.Ja,b,nd)===nd?c:b};
g.call=function(){function a(a,b,c){return cb.c(this.Ja,b,nd)===nd?c:b}function b(a,b){return cb.c(this.Ja,b,nd)===nd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Qa(b)))};g.a=function(a){return cb.c(this.Ja,a,nd)===nd?null:a};g.b=function(a,b){return cb.c(this.Ja,a,nd)===nd?b:a};
function Cd(a){if(null!=a&&(a.B&4096||a.Yb))return a.hb(null);if("string"===typeof a)return a;throw Error([E("Doesn't support name: "),E(a)].join(""));}function Kf(a,b,c){this.j=a;this.end=b;this.step=c}Kf.prototype.ua=function(){return 0<this.step?this.j<this.end:this.j>this.end};Kf.prototype.next=function(){var a=this.j;this.j+=this.step;return a};function Lf(a,b,c,d,e){this.v=a;this.start=b;this.end=c;this.step=d;this.s=e;this.i=32375006;this.B=8192}g=Lf.prototype;g.toString=function(){return Wb(this)};
g.equiv=function(a){return this.w(null,a)};g.U=function(a,b){if(b<Ta(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};g.ta=function(a,b,c){return b<Ta(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};g.Da=function(){return new Kf(this.start,this.end,this.step)};g.O=function(){return this.v};
g.pa=function(){return 0<this.step?this.start+this.step<this.end?new Lf(this.v,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Lf(this.v,this.start+this.step,this.end,this.step,null):null};g.X=function(){return Na(xb(this))?0:Math.ceil((this.end-this.start)/this.step)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Hc(this,b)};
g.Z=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.b?b.b(c,a):b.call(null,c,a);if(Gc(c))return N.a?N.a(c):N.call(null,c);a+=this.step}else return c};g.$=function(){return null==xb(this)?null:this.start};g.qa=function(){return null!=xb(this)?new Lf(this.v,this.start+this.step,this.end,this.step,null):rc};g.S=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};
g.R=function(a,b){return new Lf(b,this.start,this.end,this.step,this.s)};g.T=function(a,b){return O(b,this)};Lf.prototype[Pa]=function(){return tc(this)};
function Mf(a,b){return function(){function c(c,d,e){return new U(null,2,5,V,[a.c?a.c(c,d,e):a.call(null,c,d,e),b.c?b.c(c,d,e):b.call(null,c,d,e)],null)}function d(c,d){return new U(null,2,5,V,[a.b?a.b(c,d):a.call(null,c,d),b.b?b.b(c,d):b.call(null,c,d)],null)}function e(c){return new U(null,2,5,V,[a.a?a.a(c):a.call(null,c),b.a?b.a(c):b.call(null,c)],null)}function f(){return new U(null,2,5,V,[a.u?a.u():a.call(null),b.u?b.u():b.call(null)],null)}var h=null,k=function(){function c(a,b,e,f){var h=null;
if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new J(k,0)}return d.call(this,a,b,e,h)}function d(c,e,f,h){return new U(null,2,5,V,[F.C(a,c,e,f,h),F.C(b,c,e,f,h)],null)}c.A=3;c.D=function(a){var b=L(a);a=M(a);var c=L(a);a=M(a);var e=L(a);a=qc(a);return d(b,c,e,a)};c.l=d;return c}(),h=function(a,b,h,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,h);
default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new J(r,0)}return k.l(a,b,h,q)}throw Error("Invalid arity: "+arguments.length);};h.A=3;h.D=k.D;h.u=f;h.a=e;h.b=d;h.c=c;h.l=k.l;return h}()}
function Ne(a,b,c,d,e,f,h){var k=wa;wa=null==wa?null:wa-1;try{if(null!=wa&&0>wa)return Ab(a,"#");Ab(a,c);if(0===Ha.a(f))K(h)&&Ab(a,function(){var a=Nf.a(f);return y(a)?a:"..."}());else{if(K(h)){var l=L(h);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=M(h),n=Ha.a(f)-1;;)if(!m||null!=n&&0===n){K(m)&&0===n&&(Ab(a,d),Ab(a,function(){var a=Nf.a(f);return y(a)?a:"..."}()));break}else{Ab(a,d);var p=L(m);c=a;h=f;b.c?b.c(p,c,h):b.call(null,p,c,h);var q=M(m);c=n-1;m=q;n=c}}return Ab(a,e)}finally{wa=k}}
function Of(a,b){for(var c=K(b),d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f);Ab(a,h);f+=1}else if(c=K(c))d=c,kd(d)?(c=Mb(d),e=Nb(d),d=c,h=Xc(c),c=e,e=h):(h=L(d),Ab(a,h),c=M(d),d=null,e=0),f=0;else return null}var Pf={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Qf(a){return[E('"'),E(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Pf[a]})),E('"')].join("")}Rf;
function Sf(a,b){var c=pd(H.b(a,Da));return c?(c=null!=b?b.i&131072||b.Xb?!0:!1:!1)?null!=dd(b):c:c}
function Tf(a,b,c){if(null==a)return Ab(b,"nil");if(Sf(c,a)){Ab(b,"^");var d=dd(a);Oe.c?Oe.c(d,b,c):Oe.call(null,d,b,c);Ab(b," ")}if(a.Db)return a.Mb(a,b,c);if(null!=a&&(a.i&2147483648||a.P))return a.K(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Ab(b,""+E(a));if(null!=a&&a.constructor===Object)return Ab(b,"#js "),d=Q.b(function(b){return new U(null,2,5,V,[Kd.a(b),a[b]],null)},ld(a)),Rf.o?Rf.o(d,Oe,b,c):Rf.call(null,d,Oe,b,c);if(Ma(a))return Ne(b,Oe,"#js ["," ","]",c,a);if("string"==typeof a)return y(Ca.a(c))?
Ab(b,Qf(a)):Ab(b,a);if("function"==u(a)){var e=a.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Of(b,oc(["#object[",c,' "',""+E(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+E(a);;)if(Xc(c)<b)c=[E("0"),E(c)].join("");else return c},Of(b,oc(['#inst "',""+E(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),
3),"-",'00:00"'],0));if(a instanceof RegExp)return Of(b,oc(['#"',a.source,'"'],0));if(null!=a&&(a.i&2147483648||a.P))return Bb(a,b,c);if(y(a.constructor.mb))return Of(b,oc(["#object[",a.constructor.mb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Of(b,oc(["#object[",c," ",""+E(a),"]"],0))}function Oe(a,b,c){var d=Uf.a(c);return y(d)?(c=ad.c(c,Vf,Tf),d.c?d.c(a,b,c):d.call(null,a,b,c)):Tf(a,b,c)}
var ie=function ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ie.l(0<c.length?new J(c.slice(0),0):null)};ie.l=function(a){var b=ya();if(null==a||Na(K(a)))b="";else{var c=E,d=new pa;a:{var e=new Vb(d);Oe(L(a),e,b);a=K(M(a));for(var f=null,h=0,k=0;;)if(k<h){var l=f.U(null,k);Ab(e," ");Oe(l,e,b);k+=1}else if(a=K(a))f=a,kd(f)?(a=Mb(f),h=Nb(f),f=a,l=Xc(a),a=h,h=l):(l=L(f),Ab(e," "),Oe(l,e,b),a=M(f),f=null,h=0),k=0;else break a}b=""+c(d)}return b};ie.A=0;
ie.D=function(a){return ie.l(K(a))};function Rf(a,b,c,d){return Ne(c,function(a,c,d){var k=ib(a);b.c?b.c(k,c,d):b.call(null,k,c,d);Ab(c," ");a=jb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,K(a))}ne.prototype.P=!0;ne.prototype.K=function(a,b,c){Ab(b,"#object [cljs.core.Volatile ");Oe(new za(null,1,[Wf,this.state],null),b,c);return Ab(b,"]")};J.prototype.P=!0;J.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};Ld.prototype.P=!0;
Ld.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};yf.prototype.P=!0;yf.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};Df.prototype.P=!0;Df.prototype.K=function(a,b,c){return Ne(b,Oe,"["," ","]",c,this)};cf.prototype.P=!0;cf.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};vc.prototype.P=!0;vc.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};jd.prototype.P=!0;jd.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};
Id.prototype.P=!0;Id.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};Nc.prototype.P=!0;Nc.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};$c.prototype.P=!0;$c.prototype.K=function(a,b,c){return Rf(this,Oe,b,c)};zf.prototype.P=!0;zf.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};Se.prototype.P=!0;Se.prototype.K=function(a,b,c){return Ne(b,Oe,"["," ","]",c,this)};Jf.prototype.P=!0;Jf.prototype.K=function(a,b,c){return Ne(b,Oe,"#{"," ","}",c,this)};
id.prototype.P=!0;id.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};fe.prototype.P=!0;fe.prototype.K=function(a,b,c){Ab(b,"#object [cljs.core.Atom ");Oe(new za(null,1,[Wf,this.state],null),b,c);return Ab(b,"]")};Ff.prototype.P=!0;Ff.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};Cf.prototype.P=!0;Cf.prototype.K=function(a,b,c){return Ne(b,Oe,"["," ","]",c,this)};U.prototype.P=!0;U.prototype.K=function(a,b,c){return Ne(b,Oe,"["," ","]",c,this)};Hd.prototype.P=!0;
Hd.prototype.K=function(a,b){return Ab(b,"()")};ae.prototype.P=!0;ae.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};za.prototype.P=!0;za.prototype.K=function(a,b,c){return Rf(this,Oe,b,c)};Lf.prototype.P=!0;Lf.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};Ef.prototype.P=!0;Ef.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};Oc.prototype.P=!0;Oc.prototype.K=function(a,b,c){return Ne(b,Oe,"("," ",")",c,this)};dc.prototype.cb=!0;
dc.prototype.Va=function(a,b){if(b instanceof dc)return lc(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};A.prototype.cb=!0;A.prototype.Va=function(a,b){if(b instanceof A)return Jd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};Se.prototype.cb=!0;Se.prototype.Va=function(a,b){if(hd(b))return rd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};U.prototype.cb=!0;
U.prototype.Va=function(a,b){if(hd(b))return rd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};var Xf=null;function Yf(a){null==Xf&&(Xf=ge.a?ge.a(0):ge.call(null,0));return nc.a([E(a),E(me.b(Xf,Ec))].join(""))}function Zf(a){return function(b,c){var d=a.b?a.b(b,c):a.call(null,b,c);return Gc(d)?new Fc(d):d}}
function ve(a){return function(b){return function(){function c(a,c){return Ra.c(b,a,c)}function d(b){return a.a?a.a(b):a.call(null,b)}function e(){return a.u?a.u():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.u=e;f.a=d;f.b=c;return f}()}(Zf(a))}$f;function ag(){}
var bg=function bg(b){if(null!=b&&null!=b.Tb)return b.Tb(b);var c=bg[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=bg._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEncodeJS.-clj-\x3ejs",b);};cg;function dg(a){return(null!=a?a.Sb||(a.fc?0:B(ag,a)):B(ag,a))?bg(a):"string"===typeof a||"number"===typeof a||a instanceof A||a instanceof dc?cg.a?cg.a(a):cg.call(null,a):ie.l(oc([a],0))}
var cg=function cg(b){if(null==b)return null;if(null!=b?b.Sb||(b.fc?0:B(ag,b)):B(ag,b))return bg(b);if(b instanceof A)return Cd(b);if(b instanceof dc)return""+E(b);if(gd(b)){var c={};b=K(b);for(var d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f),k=P(h,0),h=P(h,1);c[dg(k)]=cg(h);f+=1}else if(b=K(b))kd(b)?(e=Mb(b),b=Nb(b),d=e,e=Xc(e)):(e=L(b),d=P(e,0),e=P(e,1),c[dg(d)]=cg(e),b=M(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.i&8||b.sc||(b.i?0:B(Ua,b)):B(Ua,b)){c=[];b=K(Q.b(cg,b));d=null;for(f=
e=0;;)if(f<e)k=d.U(null,f),c.push(k),f+=1;else if(b=K(b))d=b,kd(d)?(b=Mb(d),f=Nb(d),d=b,e=Xc(b),b=f):(b=L(d),c.push(b),b=M(d),d=null,e=0),f=0;else break;return c}return b},$f=function $f(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return $f.u();case 1:return $f.a(arguments[0]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};$f.u=function(){return $f.a(1)};$f.a=function(a){return Math.random()*a};$f.A=1;
function eg(){var a=1E8*Math.random();return Math.floor(a)}var fg=null;function gg(){if(null==fg){var a=new za(null,3,[hg,$d,ig,$d,jg,$d],null);fg=ge.a?ge.a(a):ge.call(null,a)}return fg}function kg(a,b,c){var d=ec.b(b,c);if(!d&&!(d=qd(jg.a(a).call(null,b),c))&&(d=hd(c))&&(d=hd(b)))if(d=Xc(c)===Xc(b))for(var d=!0,e=0;;)if(d&&e!==Xc(c))d=kg(a,b.a?b.a(e):b.call(null,e),c.a?c.a(e):c.call(null,e)),e+=1;else return d;else return d;else return d}
function lg(a){var b;b=gg();b=N.a?N.a(b):N.call(null,b);a=H.b(hg.a(b),a);return K(a)?a:null}function mg(a,b,c,d){me.b(a,function(){return N.a?N.a(b):N.call(null,b)});me.b(c,function(){return N.a?N.a(d):N.call(null,d)})}
var ng=function ng(b,c,d){var e=(N.a?N.a(d):N.call(null,d)).call(null,b),e=y(y(e)?e.a?e.a(c):e.call(null,c):e)?!0:null;if(y(e))return e;e=function(){for(var e=lg(c);;)if(0<Xc(e))ng(b,L(e),d),e=qc(e);else return null}();if(y(e))return e;e=function(){for(var e=lg(b);;)if(0<Xc(e))ng(L(e),c,d),e=qc(e);else return null}();return y(e)?e:!1};function pg(a,b,c){c=ng(a,b,c);if(y(c))a=c;else{c=kg;var d;d=gg();d=N.a?N.a(d):N.call(null,d);a=c(d,a,b)}return a}
var qg=function qg(b,c,d,e,f,h,k){var l=Ra.c(function(e,h){var k=P(h,0);P(h,1);if(kg(N.a?N.a(d):N.call(null,d),c,k)){var l;l=(l=null==e)?l:pg(k,L(e),f);l=y(l)?h:e;if(!y(pg(L(l),k,f)))throw Error([E("Multiple methods in multimethod '"),E(b),E("' match dispatch value: "),E(c),E(" -\x3e "),E(k),E(" and "),E(L(l)),E(", and neither is preferred")].join(""));return l}return e},null,N.a?N.a(e):N.call(null,e));if(y(l)){if(ec.b(N.a?N.a(k):N.call(null,k),N.a?N.a(d):N.call(null,d)))return me.o(h,ad,c,Tc(l)),
Tc(l);mg(h,e,k,d);return qg(b,c,d,e,f,h,k)}return null};function X(a,b){throw Error([E("No method in multimethod '"),E(a),E("' for dispatch value: "),E(b)].join(""));}function rg(a,b,c,d,e,f,h,k){this.name=a;this.h=b;this.gc=c;this.nb=d;this.$a=e;this.oc=f;this.pb=h;this.bb=k;this.i=4194305;this.B=4352}g=rg.prototype;
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I,S){a=this;var la=F.l(a.h,b,c,d,e,oc([f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I,S],0)),og=Y(this,la);y(og)||X(a.name,la);return F.l(og,b,c,d,e,oc([f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I,S],0))}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I){a=this;var S=a.h.ma?a.h.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I),la=Y(this,S);y(la)||X(a.name,S);return la.ma?la.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,
v,w,z,x,D,I):la.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D){a=this;var I=a.h.la?a.h.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D),S=Y(this,I);y(S)||X(a.name,I);return S.la?S.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):S.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x){a=this;var D=a.h.ka?a.h.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):a.h.call(null,
b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x),I=Y(this,D);y(I)||X(a.name,D);return I.ka?I.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):I.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){a=this;var x=a.h.ja?a.h.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z),D=Y(this,x);y(D)||X(a.name,x);return D.ja?D.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):D.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,
w){a=this;var z=a.h.ia?a.h.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w),x=Y(this,z);y(x)||X(a.name,z);return x.ia?x.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):x.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){a=this;var w=a.h.ha?a.h.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v),z=Y(this,w);y(z)||X(a.name,w);return z.ha?z.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):z.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)}
function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){a=this;var v=a.h.ga?a.h.ga(b,c,d,e,f,h,k,l,m,n,p,q,r,t):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t),w=Y(this,v);y(w)||X(a.name,v);return w.ga?w.ga(b,c,d,e,f,h,k,l,m,n,p,q,r,t):w.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;var t=a.h.fa?a.h.fa(b,c,d,e,f,h,k,l,m,n,p,q,r):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r),v=Y(this,t);y(v)||X(a.name,t);return v.fa?v.fa(b,c,d,e,f,h,k,l,m,n,p,q,r):v.call(null,b,c,d,e,f,h,k,l,m,n,p,
q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;var r=a.h.ea?a.h.ea(b,c,d,e,f,h,k,l,m,n,p,q):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q),t=Y(this,r);y(t)||X(a.name,r);return t.ea?t.ea(b,c,d,e,f,h,k,l,m,n,p,q):t.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;var q=a.h.da?a.h.da(b,c,d,e,f,h,k,l,m,n,p):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p),r=Y(this,q);y(r)||X(a.name,q);return r.da?r.da(b,c,d,e,f,h,k,l,m,n,p):r.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,
n){a=this;var p=a.h.ca?a.h.ca(b,c,d,e,f,h,k,l,m,n):a.h.call(null,b,c,d,e,f,h,k,l,m,n),q=Y(this,p);y(q)||X(a.name,p);return q.ca?q.ca(b,c,d,e,f,h,k,l,m,n):q.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;var n=a.h.oa?a.h.oa(b,c,d,e,f,h,k,l,m):a.h.call(null,b,c,d,e,f,h,k,l,m),p=Y(this,n);y(p)||X(a.name,n);return p.oa?p.oa(b,c,d,e,f,h,k,l,m):p.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;var m=a.h.na?a.h.na(b,c,d,e,f,h,k,l):a.h.call(null,b,c,d,e,f,h,k,l),n=
Y(this,m);y(n)||X(a.name,m);return n.na?n.na(b,c,d,e,f,h,k,l):n.call(null,b,c,d,e,f,h,k,l)}function t(a,b,c,d,e,f,h,k){a=this;var l=a.h.W?a.h.W(b,c,d,e,f,h,k):a.h.call(null,b,c,d,e,f,h,k),m=Y(this,l);y(m)||X(a.name,l);return m.W?m.W(b,c,d,e,f,h,k):m.call(null,b,c,d,e,f,h,k)}function v(a,b,c,d,e,f,h){a=this;var k=a.h.V?a.h.V(b,c,d,e,f,h):a.h.call(null,b,c,d,e,f,h),l=Y(this,k);y(l)||X(a.name,k);return l.V?l.V(b,c,d,e,f,h):l.call(null,b,c,d,e,f,h)}function w(a,b,c,d,e,f){a=this;var h=a.h.C?a.h.C(b,c,
d,e,f):a.h.call(null,b,c,d,e,f),k=Y(this,h);y(k)||X(a.name,h);return k.C?k.C(b,c,d,e,f):k.call(null,b,c,d,e,f)}function z(a,b,c,d,e){a=this;var f=a.h.o?a.h.o(b,c,d,e):a.h.call(null,b,c,d,e),h=Y(this,f);y(h)||X(a.name,f);return h.o?h.o(b,c,d,e):h.call(null,b,c,d,e)}function D(a,b,c,d){a=this;var e=a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d),f=Y(this,e);y(f)||X(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function I(a,b,c){a=this;var d=a.h.b?a.h.b(b,c):a.h.call(null,b,c),e=Y(this,d);y(e)||X(a.name,
d);return e.b?e.b(b,c):e.call(null,b,c)}function S(a,b){a=this;var c=a.h.a?a.h.a(b):a.h.call(null,b),d=Y(this,c);y(d)||X(a.name,c);return d.a?d.a(b):d.call(null,b)}function la(a){a=this;var b=a.h.u?a.h.u():a.h.call(null),c=Y(this,b);y(c)||X(a.name,b);return c.u?c.u():c.call(null)}var x=null,x=function(x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Xb,Wa,eb,rb,Ob,mc,Vc,ue){switch(arguments.length){case 1:return la.call(this,x);case 2:return S.call(this,x,R);case 3:return I.call(this,x,R,T);case 4:return D.call(this,
x,R,T,W);case 5:return z.call(this,x,R,T,W,Z);case 6:return w.call(this,x,R,T,W,Z,da);case 7:return v.call(this,x,R,T,W,Z,da,fa);case 8:return t.call(this,x,R,T,W,Z,da,fa,ha);case 9:return r.call(this,x,R,T,W,Z,da,fa,ha,ia);case 10:return q.call(this,x,R,T,W,Z,da,fa,ha,ia,ka);case 11:return p.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa);case 12:return n.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa);case 13:return m.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga);case 14:return l.call(this,x,R,T,W,Z,da,fa,ha,ia,
ka,qa,Aa,Ga,Ka);case 15:return k.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Xb);case 16:return h.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Xb,Wa);case 17:return f.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Xb,Wa,eb);case 18:return e.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Xb,Wa,eb,rb);case 19:return d.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Xb,Wa,eb,rb,Ob);case 20:return c.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Xb,Wa,eb,rb,Ob,mc);case 21:return b.call(this,x,R,T,
W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Xb,Wa,eb,rb,Ob,mc,Vc);case 22:return a.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Xb,Wa,eb,rb,Ob,mc,Vc,ue)}throw Error("Invalid arity: "+arguments.length);};x.a=la;x.b=S;x.c=I;x.o=D;x.C=z;x.V=w;x.W=v;x.na=t;x.oa=r;x.ca=q;x.da=p;x.ea=n;x.fa=m;x.ga=l;x.ha=k;x.ia=h;x.ja=f;x.ka=e;x.la=d;x.ma=c;x.Cb=b;x.eb=a;return x}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Qa(b)))};
g.u=function(){var a=this.h.u?this.h.u():this.h.call(null),b=Y(this,a);y(b)||X(this.name,a);return b.u?b.u():b.call(null)};g.a=function(a){var b=this.h.a?this.h.a(a):this.h.call(null,a),c=Y(this,b);y(c)||X(this.name,b);return c.a?c.a(a):c.call(null,a)};g.b=function(a,b){var c=this.h.b?this.h.b(a,b):this.h.call(null,a,b),d=Y(this,c);y(d)||X(this.name,c);return d.b?d.b(a,b):d.call(null,a,b)};
g.c=function(a,b,c){var d=this.h.c?this.h.c(a,b,c):this.h.call(null,a,b,c),e=Y(this,d);y(e)||X(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};g.o=function(a,b,c,d){var e=this.h.o?this.h.o(a,b,c,d):this.h.call(null,a,b,c,d),f=Y(this,e);y(f)||X(this.name,e);return f.o?f.o(a,b,c,d):f.call(null,a,b,c,d)};g.C=function(a,b,c,d,e){var f=this.h.C?this.h.C(a,b,c,d,e):this.h.call(null,a,b,c,d,e),h=Y(this,f);y(h)||X(this.name,f);return h.C?h.C(a,b,c,d,e):h.call(null,a,b,c,d,e)};
g.V=function(a,b,c,d,e,f){var h=this.h.V?this.h.V(a,b,c,d,e,f):this.h.call(null,a,b,c,d,e,f),k=Y(this,h);y(k)||X(this.name,h);return k.V?k.V(a,b,c,d,e,f):k.call(null,a,b,c,d,e,f)};g.W=function(a,b,c,d,e,f,h){var k=this.h.W?this.h.W(a,b,c,d,e,f,h):this.h.call(null,a,b,c,d,e,f,h),l=Y(this,k);y(l)||X(this.name,k);return l.W?l.W(a,b,c,d,e,f,h):l.call(null,a,b,c,d,e,f,h)};
g.na=function(a,b,c,d,e,f,h,k){var l=this.h.na?this.h.na(a,b,c,d,e,f,h,k):this.h.call(null,a,b,c,d,e,f,h,k),m=Y(this,l);y(m)||X(this.name,l);return m.na?m.na(a,b,c,d,e,f,h,k):m.call(null,a,b,c,d,e,f,h,k)};g.oa=function(a,b,c,d,e,f,h,k,l){var m=this.h.oa?this.h.oa(a,b,c,d,e,f,h,k,l):this.h.call(null,a,b,c,d,e,f,h,k,l),n=Y(this,m);y(n)||X(this.name,m);return n.oa?n.oa(a,b,c,d,e,f,h,k,l):n.call(null,a,b,c,d,e,f,h,k,l)};
g.ca=function(a,b,c,d,e,f,h,k,l,m){var n=this.h.ca?this.h.ca(a,b,c,d,e,f,h,k,l,m):this.h.call(null,a,b,c,d,e,f,h,k,l,m),p=Y(this,n);y(p)||X(this.name,n);return p.ca?p.ca(a,b,c,d,e,f,h,k,l,m):p.call(null,a,b,c,d,e,f,h,k,l,m)};g.da=function(a,b,c,d,e,f,h,k,l,m,n){var p=this.h.da?this.h.da(a,b,c,d,e,f,h,k,l,m,n):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n),q=Y(this,p);y(q)||X(this.name,p);return q.da?q.da(a,b,c,d,e,f,h,k,l,m,n):q.call(null,a,b,c,d,e,f,h,k,l,m,n)};
g.ea=function(a,b,c,d,e,f,h,k,l,m,n,p){var q=this.h.ea?this.h.ea(a,b,c,d,e,f,h,k,l,m,n,p):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p),r=Y(this,q);y(r)||X(this.name,q);return r.ea?r.ea(a,b,c,d,e,f,h,k,l,m,n,p):r.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.fa=function(a,b,c,d,e,f,h,k,l,m,n,p,q){var r=this.h.fa?this.h.fa(a,b,c,d,e,f,h,k,l,m,n,p,q):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q),t=Y(this,r);y(t)||X(this.name,r);return t.fa?t.fa(a,b,c,d,e,f,h,k,l,m,n,p,q):t.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){var t=this.h.ga?this.h.ga(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r),v=Y(this,t);y(v)||X(this.name,t);return v.ga?v.ga(a,b,c,d,e,f,h,k,l,m,n,p,q,r):v.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};
g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){var v=this.h.ha?this.h.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t),w=Y(this,v);y(w)||X(this.name,v);return w.ha?w.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):w.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t)};
g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){var w=this.h.ia?this.h.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v),z=Y(this,w);y(z)||X(this.name,w);return z.ia?z.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):z.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)};
g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){var z=this.h.ja?this.h.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w),D=Y(this,z);y(D)||X(this.name,z);return D.ja?D.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):D.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)};
g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){var D=this.h.ka?this.h.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z),I=Y(this,D);y(I)||X(this.name,D);return I.ka?I.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):I.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)};
g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D){var I=this.h.la?this.h.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D),S=Y(this,I);y(S)||X(this.name,I);return S.la?S.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):S.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D)};
g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I){var S=this.h.ma?this.h.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I),la=Y(this,S);y(la)||X(this.name,S);return la.ma?la.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I):la.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I)};
g.Cb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S){var la=F.l(this.h,a,b,c,d,oc([e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S],0)),x=Y(this,la);y(x)||X(this.name,la);return F.l(x,a,b,c,d,oc([e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S],0))};
function Y(a,b){ec.b(N.a?N.a(a.bb):N.call(null,a.bb),N.a?N.a(a.nb):N.call(null,a.nb))||mg(a.pb,a.$a,a.bb,a.nb);var c=(N.a?N.a(a.pb):N.call(null,a.pb)).call(null,b);if(y(c))return c;c=qg(a.name,b,a.nb,a.$a,a.oc,a.pb,a.bb);return y(c)?c:(N.a?N.a(a.$a):N.call(null,a.$a)).call(null,a.gc)}g.hb=function(){return Qb(this.name)};g.ib=function(){return Rb(this.name)};g.N=function(){return ba(this)};var sg=new A(null,"rng","rng",1082666016),tg=new A(null,"path","path",-188191168),ug=new A(null,"transform","transform",1381301764),Da=new A(null,"meta","meta",1499536964),vg=new dc(null,"blockable","blockable",-28395259,null),Ea=new A(null,"dup","dup",556298533),wg=new A(null,"offset","offset",296498311),xg=new A(null,"button","button",1456579943),le=new dc(null,"new-value","new-value",-1567397401,null),he=new A(null,"validator","validator",-1966190681),yg=new A(null,"default","default",-1987822328),
zg=new A(null,"reset-points","reset-points",-5234839),Ag=new A(null,"width","width",-384071477),Bg=new A(null,"onclick","onclick",1297553739),Cg=new A(null,"midpoint","midpoint",-36269525),Wf=new A(null,"val","val",128701612),Dg=new A(null,"type","type",1174270348),ke=new dc(null,"validate","validate",1439230700,null),Vf=new A(null,"fallback-impl","fallback-impl",-1501286995),Eg=new A(null,"source","source",-433931539),Ba=new A(null,"flush-on-newline","flush-on-newline",-151457939),Fg=new A(null,
"angle","angle",1622094254),Gg=new A(null,"radius","radius",-2073122258),Hg=new A(null,"className","className",-1983287057),ig=new A(null,"descendants","descendants",1824886031),Ig=new A(null,"center","center",-748944368),jg=new A(null,"ancestors","ancestors",-776045424),qe=new dc(null,"n","n",-2092305744,null),Jg=new A(null,"div","div",1057191632),Ca=new A(null,"readably","readably",1129599760),Nf=new A(null,"more-marker","more-marker",-14717935),Kg=new A(null,"balance","balance",418967409),Lg=new A(null,
"island","island",623473715),Ha=new A(null,"print-length","print-length",1931866356),Mg=new A(null,"id","id",-1388402092),Ng=new A(null,"class","class",-2030961996),hg=new A(null,"parents","parents",-2027538891),Og=new A(null,"svg","svg",856789142),Pg=new A(null,"max-offset","max-offset",-851769098),Qg=new A(null,"radial","radial",-1334240714),Rg=new A(null,"right","right",-452581833),Sg=new A(null,"position","position",-2011731912),Tg=new A(null,"d","d",1972142424),Ug=new A(null,"rerender","rerender",
-1601192263),Zd=new dc(null,"quote","quote",1377916282,null),Yd=new A(null,"arglists","arglists",1661989754),Xd=new dc(null,"nil-iter","nil-iter",1101030523,null),Vg=new A(null,"main","main",-2117802661),Wg=new A(null,"hierarchy","hierarchy",-1053470341),Uf=new A(null,"alt-impl","alt-impl",670969595),Xg=new A(null,"rect","rect",-108902628),pe=new dc(null,"number?","number?",-1747282210,null),Yg=new A(null,"height","height",1025178622),Zg=new A(null,"left","left",-399115937),$g=new A(null,"foreignObject",
"foreignObject",25502111),ah=new dc(null,"f","f",43394975,null);var bh;var ch;a:{var dh=aa.navigator;if(dh){var eh=dh.userAgent;if(eh){ch=eh;break a}}ch=""};function fh(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function gh(a,b,c,d){this.head=a;this.I=b;this.length=c;this.f=d}gh.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.I];this.f[this.I]=null;this.I=(this.I+1)%this.f.length;--this.length;return a};gh.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};
gh.prototype.resize=function(){var a=Array(2*this.f.length);return this.I<this.head?(fh(this.f,this.I,a,0,this.length),this.I=0,this.head=this.length,this.f=a):this.I>this.head?(fh(this.f,this.I,a,0,this.f.length-this.I),fh(this.f,0,a,this.f.length-this.I,this.head),this.I=0,this.head=this.length,this.f=a):this.I===this.head?(this.head=this.I=0,this.f=a):null};if("undefined"===typeof hh)var hh={};var ih;
function jh(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==ch.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ma(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==ch.indexOf("Trident")&&-1==ch.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Fb;c.Fb=null;a()}};return function(a){d.next={Fb:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var kh;kh=new gh(0,0,0,Array(32));var lh=!1,mh=!1;nh;function oh(){lh=!0;mh=!1;for(var a=0;;){var b=kh.pop();if(null!=b&&(b.u?b.u():b.call(null),1024>a)){a+=1;continue}break}lh=!1;return 0<kh.length?nh.u?nh.u():nh.call(null):null}function nh(){var a=mh;if(y(y(a)?lh:a))return null;mh=!0;"function"!=u(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(ih||(ih=jh()),ih(oh)):aa.setImmediate(oh)};for(var ph=Array(1),qh=0;;)if(qh<ph.length)ph[qh]=null,qh+=1;else break;(function(a){"undefined"===typeof bh&&(bh=function(a,c,d){this.hc=a;this.Qb=c;this.kc=d;this.i=393216;this.B=0},bh.prototype.R=function(a,c){return new bh(this.hc,this.Qb,c)},bh.prototype.O=function(){return this.kc},bh.ic=function(){return new U(null,3,5,V,[ah,vg,sa.zc],null)},bh.Db=!0,bh.mb="cljs.core.async/t_cljs$core$async11301",bh.Mb=function(a,c){return Ab(c,"cljs.core.async/t_cljs$core$async11301")});return new bh(a,!0,$d)})(function(){return null});var rh=VDOM.diff,sh=VDOM.patch,th=VDOM.create;function uh(a){return xe(de(La),xe(de(od),ye(a)))}function vh(a,b,c){return new VDOM.VHtml(Cd(a),cg(b),cg(c))}function wh(a,b,c){return new VDOM.VSvg(Cd(a),cg(b),cg(c))}xh;
var yh=function yh(b){if(null==b)return new VDOM.VText("");if(od(b))return vh(Jg,$d,Q.b(yh,uh(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(ec.b(Og,L(b)))return xh.a?xh.a(b):xh.call(null,b);var c=P(b,0),d=P(b,1);b=Bd(b);return vh(c,d,Q.b(yh,uh(b)))},xh=function xh(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(ec.b($g,L(b))){var c=P(b,0),d=P(b,1);b=Bd(b);return wh(c,d,Q.b(yh,uh(b)))}c=P(b,0);d=P(b,1);b=
Bd(b);return wh(c,d,Q.b(xh,uh(b)))};
function zh(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return ge.a?ge.a(a):ge.call(null,a)}(),c=function(){var a;a=N.a?N.a(b):N.call(null,b);a=th.a?th.a(a):th.call(null,a);return ge.a?ge.a(a):ge.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.u?a.u():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(N.a?N.a(c):N.call(null,c));return function(a,b,c){return function(d){var l=
yh(d);d=function(){var b=N.a?N.a(a):N.call(null,a);return rh.b?rh.b(b,l):rh.call(null,b,l)}();je.b?je.b(a,l):je.call(null,a,l);d=function(a,b,c,d){return function(){return me.c(d,sh,b)}}(l,d,a,b,c);return c.a?c.a(d):c.call(null,d)}}(b,c,d)};function Ah(){0!=Bh&&ba(this);this.Nb=this.Nb;this.nc=this.nc}var Bh=0;Ah.prototype.Nb=!1;function Ch(a,b){Ah.call(this);void 0!==a||(a=Dh++ +na());this.Na=a%2147483646;0>=this.Na&&(this.Na+=2147483646);b&&this.install()}(function(){function a(){}a.prototype=Ah.prototype;Ch.Cc=Ah.prototype;Ch.prototype=new a;Ch.prototype.constructor=Ch;Ch.rb=function(a,c,d){for(var e=Array(arguments.length-2),f=2;f<arguments.length;f++)e[f-2]=arguments[f];return Ah.prototype[c].apply(a,e)}})();var Dh=0,Eh=1/2147483646;Ch.prototype.Na=1;
Ch.prototype.install=function(){this.jc||(Math.random=ma(this.random,this),this.jc=!0)};Ch.prototype.random=function(){var a=this.Na%44488*48271-3399*Math.floor(this.Na/44488);this.Na=0<a?a:a+2147483647;return(this.Na-1)*Eh};function Fh(a,b){return[E("translate("),E(a),E(","),E(b),E(")")].join("")}function Gh(a){var b=P(a,0);a=P(a,1);return[E(b),E(","),E(a)].join("")}function Hh(a){a=Q.b(Gh,a);a=re(1,te.b(se("L"),a));a=cg(a).join("");return[E("M"),E(a)].join("")};var Ih=function Ih(b){if(null!=b&&null!=b.Ob)return b.Ob();var c=Ih[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ih._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IRandom.-rand",b);};Ch.prototype.Ob=function(){return this.random()};var Jh=Math.sin,Kh=Math.cos,Lh=2*Math.PI,Mh=Math.sqrt;function Nh(a,b){var c=P(a,0),d=P(a,1),e=P(b,0),f=P(b,1),c=Math.pow(c-e,2)+Math.pow(d-f,2);return Mh.a?Mh.a(c):Mh.call(null,c)}function Oh(a){return Ra.b(vd,a)/Xc(a)};ua=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new J(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Ia.a?Ia.a(a):Ia.call(null,a))}a.A=0;a.D=function(a){a=K(a);return b(a)};a.l=b;return a}();
va=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new J(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,Ia.a?Ia.a(a):Ia.call(null,a))}a.A=0;a.D=function(a){a=K(a);return b(a)};a.l=b;return a}();
function Ph(a){var b=Mf(function(a){return F.b(xd,a)},function(a){return F.b(wd,a)}),c=function(){var c=Q.b(L,a);return b.a?b.a(c):b.call(null,c)}(),d=P(c,0),c=P(c,1),e=function(){var c=Q.b(Tc,a);return b.a?b.a(c):b.call(null,c)}(),f=P(e,0),e=P(e,1);return new U(null,4,5,V,[d,f,c-d,e-f],null)}
function Qh(){var a=Rh,b=N.a?N.a(Sh):N.call(null,Sh),c=null!=b&&(b.i&64||b.Ia)?F.b(Bc,b):b,d=H.b(c,Lg);return new U(null,3,5,V,[Vg,$d,new U(null,4,5,V,[Jg,$d,new U(null,3,5,V,[Jg,$d,new U(null,3,5,V,[xg,new za(null,2,[Hg,"unprinted",Bg,function(){return function(){return a.a?a.a(zg):a.call(null,zg)}}(600,b,c,c,d)],null),"New Island"],null)],null),new U(null,3,5,V,[Jg,$d,new U(null,4,5,V,[Og,new za(null,2,[Ag,600,Yg,600],null),new U(null,2,5,V,[Xg,new za(null,3,[Ng,"water",Ag,600,Yg,600],null)],null),
function(){var a=Q.b(Sg,d),b=V,c,k=Ph(a),l=new U(null,4,5,V,[0,0,600,600],null);c=P(k,0);var m=P(k,1),n=P(k,2),k=P(k,3),p=P(l,0),q=P(l,1),r=P(l,2),l=P(l,3),t;t=r/n;var v=l/k;t=t<v?t:v;c=[E(Fh(p+r/2,q+l/2)),E("scale("),E(.95*t),E(")"),E(Fh(-(c+n/2),-(m+k/2)))].join("");a=K(a)?[E(Hh(a)),E("Z")].join(""):"";return new U(null,2,5,b,[tg,new za(null,3,[Ng,"island",ug,c,Tg,a],null)],null)}()],null)],null)],null)],null)}function Th(a){return new za(null,3,[wg,Ih(a),Kg,Ih(a),Pg,.05+Ih(a)],null)}
function Uh(a,b){return function d(b){return new Ld(null,function(){for(;;){var f=K(b);if(f){if(kd(f)){var h=Mb(f),k=Xc(h),l=new Od(Array(k),0);return function(){for(var b=0;;)if(b<k){var d=G.b(h,b),e=Th(a),f=e=null!=e&&(e.i&64||e.Ia)?F.b(Bc,e):e,m=H.b(e,wg),n=H.b(e,Kg);Qd(l,Gf.l(oc([f,new za(null,3,[Mg,Yf("radial"),Sg,function(){var a=100*(1+(m-n));return new U(null,2,5,V,[a*(Kh.a?Kh.a(d):Kh.call(null,d)),a*(Jh.a?Jh.a(d):Jh.call(null,d))],null)}(),Eg,new za(null,4,[Dg,Qg,Ig,new U(null,2,5,V,[0,0],
null),Fg,d,Gg,100],null)],null)],0)));b+=1}else return!0}()?Pd(l.za(),d(Nb(f))):Pd(l.za(),null)}var m=L(f),n=Th(a),p=n=null!=n&&(n.i&64||n.Ia)?F.b(Bc,n):n,q=H.b(n,wg),r=H.b(n,Kg);return O(Gf.l(oc([p,new za(null,3,[Mg,Yf("radial"),Sg,function(){var a=100*(1+(q-r));return new U(null,2,5,V,[a*(Kh.a?Kh.a(m):Kh.call(null,m)),a*(Jh.a?Jh.a(m):Jh.call(null,m))],null)}(),Eg,new za(null,4,[Dg,Qg,Ig,new U(null,2,5,V,[0,0],null),Fg,m,Gg,100],null)],null)],0)),d(qc(f)))}return null}},null,null)}(new Lf(null,0,
Lh,Lh/b,null))}
function Vh(a,b,c){var d=P(b,0);b=P(b,1);b=new U(null,2,5,V,[d,b],null);d=P(b,0);b=P(b,1);if(0<=c&&2<=Nh(Sg.a(d),Sg.a(b))){c=Ih(a);var e=Oh(Q.b(Pg,new U(null,2,5,V,[d,b],null))),f=Oh(Q.b(Kg,new U(null,2,5,V,[d,b],null))),h=Yf("midpoint"),k=Sg.a(d),l=P(k,0),m=P(k,1),n=Sg.a(b),p=P(n,0),q=P(n,1),k=Nh(k,n),k=e*k*(c-f),r=new U(null,2,5,V,[Oh(new U(null,2,5,V,[l,p],null)),Oh(new U(null,2,5,V,[m,q],null))],null),n=P(r,0),r=P(r,1),m=new U(null,2,5,V,[-(m-q),l-p],null),l=P(m,0),m=P(m,1),p=Nh(new U(null,2,
5,V,[0,0],null),new U(null,2,5,V,[l,m],null)),m=new U(null,2,5,V,[l/p,m/p],null),l=P(m,0),m=P(m,1);c=new za(null,6,[Mg,h,wg,c,Kg,f,Pg,e,Sg,new U(null,2,5,V,[n+k*l,r+k*m],null),Eg,new za(null,3,[Dg,Cg,Zg,Mg.a(d),Rg,Mg.a(b)],null)],null);a=Td.b(Vh(a,new U(null,2,5,V,[d,c],null),1),Vh(a,new U(null,2,5,V,[c,b],null),1))}else a=new U(null,1,5,V,[d],null);return a}
function Wh(a){var b=17*Ih(a)|0,c=3+b,d=Uh(a,c),e=Td.b(d,new U(null,1,5,V,[L(d)],null)),f=ze(2,1,e);return we(function(){return function(b){return Vh(a,b,15)}}(b,c,d,e,f),oc([f],0))}
function Xh(){var a;a=location.hash;var b=/#/;if("string"===typeof b)a=a.replace(new RegExp(String(b).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08"),"g"),"");else if(b instanceof RegExp)a=a.replace(new RegExp(b.source,"g"),"");else throw[E("Invalid match arg: "),E(b)].join("");a=y(/^[\s\xa0]*$/.test(null==a?"":String(a)))?null:parseInt(a);a=y(a)?a:eg();a=new Ch(a);return new za(null,2,[sg,a,Lg,Wh(a)],null)}var Sh,Yh=Xh();Sh=ge.a?ge.a(Yh):ge.call(null,Yh);
if("undefined"===typeof Rh)var Rh=function(){var a=ge.a?ge.a($d):ge.call(null,$d),b=ge.a?ge.a($d):ge.call(null,$d),c=ge.a?ge.a($d):ge.call(null,$d),d=ge.a?ge.a($d):ge.call(null,$d),e=H.c($d,Wg,gg());return new rg(nc.b("isle.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.A=1;a.D=function(a){var b=L(a);qc(a);return b};a.l=function(a){return a};return a}()}(a,b,c,d,e),yg,e,a,b,c,d)}();
var Zh=Rh;me.o(Zh.$a,ad,zg,function(){var a=eg(),b=new Ch(a);location.hash=a;return me.b(Sh,function(a,b){return function(a){return ad.l(a,sg,b,oc([Lg,Wh(b)],0))}}(a,b))});mg(Zh.pb,Zh.$a,Zh.bb,Zh.nb);if("undefined"===typeof $h)var $h=function(a){return function(){var b=Qh();return a.a?a.a(b):a.call(null,b)}}(zh());if("undefined"===typeof ai){var ai;Db(Sh,Ug,function(a,b,c,d){return $h.a?$h.a(d):$h.call(null,d)});ai=Sh}
if("undefined"===typeof bi)var bi=window.addEventListener("hashchange",function(){var a=Xh();return je.b?je.b(Sh,a):je.call(null,Sh,a)});var ci=N.a?N.a(Sh):N.call(null,Sh);$h.a?$h.a(ci):$h.call(null,ci);