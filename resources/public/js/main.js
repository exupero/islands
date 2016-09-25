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
b&&"undefined"==typeof a.call)return"object";return b}var ba="closure_uid_"+(1E9*Math.random()>>>0),ca=0;function da(a,b,c){return a.call.apply(a.bind,arguments)}function fa(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ga(a,b,c){ga=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?da:fa;return ga.apply(null,arguments)};function ha(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function ia(a,b){null!=a&&this.append.apply(this,arguments)}g=ia.prototype;g.Pa="";g.set=function(a){this.Pa=""+a};g.append=function(a,b,c){this.Pa+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Pa+=arguments[d];return this};g.clear=function(){this.Pa=""};g.toString=function(){return this.Pa};function la(a,b){return a>b?1:a<b?-1:0};var ma;if("undefined"===typeof pa)var pa=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof ra)var ra=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var sa=null;if("undefined"===typeof ta)var ta=null;function ua(){return new va(null,5,[xa,!0,ya,!0,za,!1,Aa,!1,Ba,null],null)}Ca;function y(a){return null!=a&&!1!==a}Ea;A;function Fa(a){return null==a}function Ga(a){return a instanceof Array}
function Ia(a){return null==a?!0:!1===a?!0:!1}function B(a,b){return a[u(null==b?null:b)]?!0:a._?!0:!1}function C(a,b){var c=null==b?null:b.constructor,c=y(y(c)?c.Ib:c)?c.pb:u(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Ja(a){var b=a.pb;return y(b)?b:""+F(a)}var Ka="undefined"!==typeof Symbol&&"function"===u(Symbol)?Symbol.iterator:"@@iterator";function Ma(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}G;Na;
var Ca=function Ca(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ca.b(arguments[0]);case 2:return Ca.a(arguments[0],arguments[1]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};Ca.b=function(a){return Ca.a(null,a)};Ca.a=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Na.c?Na.c(c,d,b):Na.call(null,c,d,b)};Ca.A=2;function Oa(){}
var Pa=function Pa(b){if(null!=b&&null!=b.Y)return b.Y(b);var c=Pa[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Pa._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("ICounted.-count",b);},Qa=function Qa(b){if(null!=b&&null!=b.Z)return b.Z(b);var c=Qa[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Qa._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("IEmptyableCollection.-empty",b);};function Ra(){}
var Sa=function Sa(b,c){if(null!=b&&null!=b.V)return b.V(b,c);var d=Sa[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Sa._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw C("ICollection.-conj",b);};function Ta(){}
var H=function H(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return H.a(arguments[0],arguments[1]);case 3:return H.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};
H.a=function(a,b){if(null!=a&&null!=a.X)return a.X(a,b);var c=H[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=H._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw C("IIndexed.-nth",a);};H.c=function(a,b,c){if(null!=a&&null!=a.ya)return a.ya(a,b,c);var d=H[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=H._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IIndexed.-nth",a);};H.A=3;function Ua(){}
var Va=function Va(b){if(null!=b&&null!=b.ba)return b.ba(b);var c=Va[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Va._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("ISeq.-first",b);},Wa=function Wa(b){if(null!=b&&null!=b.sa)return b.sa(b);var c=Wa[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Wa._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("ISeq.-rest",b);};function Ya(){}function Za(){}
var $a=function $a(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return $a.a(arguments[0],arguments[1]);case 3:return $a.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};
$a.a=function(a,b){if(null!=a&&null!=a.J)return a.J(a,b);var c=$a[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=$a._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw C("ILookup.-lookup",a);};$a.c=function(a,b,c){if(null!=a&&null!=a.G)return a.G(a,b,c);var d=$a[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=$a._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ILookup.-lookup",a);};$a.A=3;
var ab=function ab(b,c){if(null!=b&&null!=b.Db)return b.Db(b,c);var d=ab[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=ab._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw C("IAssociative.-contains-key?",b);},bb=function bb(b,c,d){if(null!=b&&null!=b.Ma)return b.Ma(b,c,d);var e=bb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=bb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IAssociative.-assoc",b);};function cb(){}
var db=function db(b,c){if(null!=b&&null!=b.xb)return b.xb(b,c);var d=db[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=db._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw C("IMap.-dissoc",b);};function eb(){}
var fb=function fb(b){if(null!=b&&null!=b.ib)return b.ib(b);var c=fb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=fb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("IMapEntry.-key",b);},hb=function hb(b){if(null!=b&&null!=b.jb)return b.jb(b);var c=hb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=hb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("IMapEntry.-val",b);};function ib(){}function jb(){}
var kb=function kb(b,c,d){if(null!=b&&null!=b.Ra)return b.Ra(b,c,d);var e=kb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=kb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IVector.-assoc-n",b);},lb=function lb(b){if(null!=b&&null!=b.wb)return b.wb(b);var c=lb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=lb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("IDeref.-deref",b);};function mb(){}
var nb=function nb(b){if(null!=b&&null!=b.P)return b.P(b);var c=nb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=nb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("IMeta.-meta",b);},ob=function ob(b,c){if(null!=b&&null!=b.R)return b.R(b,c);var d=ob[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=ob._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw C("IWithMeta.-with-meta",b);};function pb(){}
var qb=function qb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return qb.a(arguments[0],arguments[1]);case 3:return qb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};
qb.a=function(a,b){if(null!=a&&null!=a.$)return a.$(a,b);var c=qb[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=qb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw C("IReduce.-reduce",a);};qb.c=function(a,b,c){if(null!=a&&null!=a.aa)return a.aa(a,b,c);var d=qb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=qb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IReduce.-reduce",a);};qb.A=3;
var rb=function rb(b,c){if(null!=b&&null!=b.v)return b.v(b,c);var d=rb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=rb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw C("IEquiv.-equiv",b);},tb=function tb(b){if(null!=b&&null!=b.N)return b.N(b);var c=tb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=tb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("IHash.-hash",b);};function ub(){}
var vb=function vb(b){if(null!=b&&null!=b.U)return b.U(b);var c=vb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=vb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("ISeqable.-seq",b);};function wb(){}function xb(){}
var yb=function yb(b,c){if(null!=b&&null!=b.Sb)return b.Sb(0,c);var d=yb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=yb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw C("IWriter.-write",b);},zb=function zb(b,c,d){if(null!=b&&null!=b.K)return b.K(b,c,d);var e=zb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=zb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IPrintWithWriter.-pr-writer",b);},Ab=function Ab(b,c,d){if(null!=b&&
null!=b.Rb)return b.Rb(0,c,d);var e=Ab[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Ab._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-notify-watches",b);},Bb=function Bb(b,c,d){if(null!=b&&null!=b.Qb)return b.Qb(0,c,d);var e=Bb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Bb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-add-watch",b);},Cb=function Cb(b){if(null!=b&&null!=b.Xa)return b.Xa(b);
var c=Cb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Cb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("IEditableCollection.-as-transient",b);},Db=function Db(b,c){if(null!=b&&null!=b.nb)return b.nb(b,c);var d=Db[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Db._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw C("ITransientCollection.-conj!",b);},Eb=function Eb(b){if(null!=b&&null!=b.ob)return b.ob(b);var c=Eb[u(null==b?null:b)];if(null!=c)return c.b?
c.b(b):c.call(null,b);c=Eb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("ITransientCollection.-persistent!",b);},Fb=function Fb(b,c,d){if(null!=b&&null!=b.mb)return b.mb(b,c,d);var e=Fb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Fb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientAssociative.-assoc!",b);},Gb=function Gb(b,c,d){if(null!=b&&null!=b.Pb)return b.Pb(0,c,d);var e=Gb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,
b,c,d);e=Gb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientVector.-assoc-n!",b);};function Hb(){}
var Ib=function Ib(b,c){if(null!=b&&null!=b.Wa)return b.Wa(b,c);var d=Ib[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Ib._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw C("IComparable.-compare",b);},Jb=function Jb(b){if(null!=b&&null!=b.Mb)return b.Mb();var c=Jb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Jb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("IChunk.-drop-first",b);},Kb=function Kb(b){if(null!=b&&null!=b.Fb)return b.Fb(b);var c=
Kb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Kb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("IChunkedSeq.-chunked-first",b);},Lb=function Lb(b){if(null!=b&&null!=b.Gb)return b.Gb(b);var c=Lb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Lb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("IChunkedSeq.-chunked-rest",b);},Mb=function Mb(b){if(null!=b&&null!=b.Eb)return b.Eb(b);var c=Mb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,
b);c=Mb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("IChunkedNext.-chunked-next",b);},Ob=function Ob(b){if(null!=b&&null!=b.kb)return b.kb(b);var c=Ob[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ob._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("INamed.-name",b);},Pb=function Pb(b){if(null!=b&&null!=b.lb)return b.lb(b);var c=Pb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Pb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("INamed.-namespace",
b);},Qb=function Qb(b,c){if(null!=b&&null!=b.ec)return b.ec(b,c);var d=Qb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Qb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw C("IReset.-reset!",b);},Rb=function Rb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Rb.a(arguments[0],arguments[1]);case 3:return Rb.c(arguments[0],arguments[1],arguments[2]);case 4:return Rb.o(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return Rb.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};Rb.a=function(a,b){if(null!=a&&null!=a.gc)return a.gc(a,b);var c=Rb[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Rb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw C("ISwap.-swap!",a);};
Rb.c=function(a,b,c){if(null!=a&&null!=a.hc)return a.hc(a,b,c);var d=Rb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Rb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ISwap.-swap!",a);};Rb.o=function(a,b,c,d){if(null!=a&&null!=a.ic)return a.ic(a,b,c,d);var e=Rb[u(null==a?null:a)];if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);e=Rb._;if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);throw C("ISwap.-swap!",a);};
Rb.C=function(a,b,c,d,e){if(null!=a&&null!=a.jc)return a.jc(a,b,c,d,e);var f=Rb[u(null==a?null:a)];if(null!=f)return f.C?f.C(a,b,c,d,e):f.call(null,a,b,c,d,e);f=Rb._;if(null!=f)return f.C?f.C(a,b,c,d,e):f.call(null,a,b,c,d,e);throw C("ISwap.-swap!",a);};Rb.A=5;var Sb=function Sb(b){if(null!=b&&null!=b.Fa)return b.Fa(b);var c=Sb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Sb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("IIterable.-iterator",b);};
function Tb(a){this.uc=a;this.i=1073741824;this.B=0}Tb.prototype.Sb=function(a,b){return this.uc.append(b)};function Ub(a){var b=new ia;a.K(null,new Tb(b),ua());return""+F(b)}var Vb="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function Wb(a){a=Vb(a|0,-862048943);return Vb(a<<15|a>>>-15,461845907)}
function Xb(a,b){var c=(a|0)^(b|0);return Vb(c<<13|c>>>-13,5)+-430675100|0}function Zb(a,b){var c=(a|0)^b,c=Vb(c^c>>>16,-2048144789),c=Vb(c^c>>>13,-1028477387);return c^c>>>16}function $b(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=Xb(c,Wb(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^Wb(a.charCodeAt(a.length-1)):b;return Zb(b,Vb(2,a.length))}ac;bc;cc;dc;var ec={},fc=0;
function gc(a){255<fc&&(ec={},fc=0);var b=ec[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=Vb(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;ec[a]=b;fc+=1}return a=b}function hc(a){null!=a&&(a.i&4194304||a.zc)?a=a.N(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=gc(a),0!==a&&(a=Wb(a),a=Xb(0,a),a=Zb(a,4))):a=a instanceof Date?a.valueOf():null==a?0:tb(a);return a}
function ic(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Ea(a,b){return b instanceof a}function jc(a,b){if(a.Ha===b.Ha)return 0;var c=Ia(a.qa);if(y(c?b.qa:c))return-1;if(y(a.qa)){if(Ia(b.qa))return 1;c=la(a.qa,b.qa);return 0===c?la(a.name,b.name):c}return la(a.name,b.name)}I;function bc(a,b,c,d,e){this.qa=a;this.name=b;this.Ha=c;this.Va=d;this.wa=e;this.i=2154168321;this.B=4096}g=bc.prototype;g.toString=function(){return this.Ha};g.equiv=function(a){return this.v(null,a)};
g.v=function(a,b){return b instanceof bc?this.Ha===b.Ha:!1};g.call=function(){function a(a,b,c){return I.c?I.c(b,this,c):I.call(null,b,this,c)}function b(a,b){return I.a?I.a(b,this):I.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};
g.b=function(a){return I.a?I.a(a,this):I.call(null,a,this)};g.a=function(a,b){return I.c?I.c(a,this,b):I.call(null,a,this,b)};g.P=function(){return this.wa};g.R=function(a,b){return new bc(this.qa,this.name,this.Ha,this.Va,b)};g.N=function(){var a=this.Va;return null!=a?a:this.Va=a=ic($b(this.name),gc(this.qa))};g.kb=function(){return this.name};g.lb=function(){return this.qa};g.K=function(a,b){return yb(b,this.Ha)};
var kc=function kc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return kc.b(arguments[0]);case 2:return kc.a(arguments[0],arguments[1]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};kc.b=function(a){if(a instanceof bc)return a;var b=a.indexOf("/");return-1===b?kc.a(null,a):kc.a(a.substring(0,b),a.substring(b+1,a.length))};kc.a=function(a,b){var c=null!=a?[F(a),F("/"),F(b)].join(""):b;return new bc(a,b,c,null,null)};
kc.A=2;lc;mc;oc;function J(a){if(null==a)return null;if(null!=a&&(a.i&8388608||a.fc))return a.U(null);if(Ga(a)||"string"===typeof a)return 0===a.length?null:new oc(a,0);if(B(ub,a))return vb(a);throw Error([F(a),F(" is not ISeqable")].join(""));}function K(a){if(null==a)return null;if(null!=a&&(a.i&64||a.Qa))return a.ba(null);a=J(a);return null==a?null:Va(a)}function pc(a){return null!=a?null!=a&&(a.i&64||a.Qa)?a.sa(null):(a=J(a))?Wa(a):qc:qc}
function L(a){return null==a?null:null!=a&&(a.i&128||a.yb)?a.ra(null):J(pc(a))}var cc=function cc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return cc.b(arguments[0]);case 2:return cc.a(arguments[0],arguments[1]);default:return cc.m(arguments[0],arguments[1],new oc(c.slice(2),0))}};cc.b=function(){return!0};cc.a=function(a,b){return null==a?null==b:a===b||rb(a,b)};
cc.m=function(a,b,c){for(;;)if(cc.a(a,b))if(L(c))a=b,b=K(c),c=L(c);else return cc.a(b,K(c));else return!1};cc.H=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return cc.m(b,a,c)};cc.A=2;function rc(a){this.D=a}rc.prototype.next=function(){if(null!=this.D){var a=K(this.D);this.D=L(this.D);return{value:a,done:!1}}return{value:null,done:!0}};function sc(a){return new rc(J(a))}tc;function uc(a,b,c){this.value=a;this.ab=b;this.Ab=c;this.i=8388672;this.B=0}uc.prototype.U=function(){return this};
uc.prototype.ba=function(){return this.value};uc.prototype.sa=function(){null==this.Ab&&(this.Ab=tc.b?tc.b(this.ab):tc.call(null,this.ab));return this.Ab};function tc(a){var b=a.next();return y(b.done)?qc:new uc(b.value,a,null)}function vc(a,b){var c=Wb(a),c=Xb(0,c);return Zb(c,b)}function wc(a){var b=0,c=1;for(a=J(a);;)if(null!=a)b+=1,c=Vb(31,c)+hc(K(a))|0,a=L(a);else return vc(c,b)}var xc=vc(1,0);function yc(a){var b=0,c=0;for(a=J(a);;)if(null!=a)b+=1,c=c+hc(K(a))|0,a=L(a);else return vc(c,b)}
var zc=vc(0,0);Ac;ac;Bc;Oa["null"]=!0;Pa["null"]=function(){return 0};Date.prototype.v=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.gb=!0;Date.prototype.Wa=function(a,b){if(b instanceof Date)return la(this.valueOf(),b.valueOf());throw Error([F("Cannot compare "),F(this),F(" to "),F(b)].join(""));};rb.number=function(a,b){return a===b};Cc;mb["function"]=!0;nb["function"]=function(){return null};tb._=function(a){return a[ba]||(a[ba]=++ca)};M;
function Dc(a){this.M=a;this.i=32768;this.B=0}Dc.prototype.wb=function(){return this.M};function Ec(a){return a instanceof Dc}function M(a){return lb(a)}function Fc(a,b){var c=Pa(a);if(0===c)return b.w?b.w():b.call(null);for(var d=H.a(a,0),e=1;;)if(e<c){var f=H.a(a,e),d=b.a?b.a(d,f):b.call(null,d,f);if(Ec(d))return lb(d);e+=1}else return d}function Gc(a,b,c){var d=Pa(a),e=c;for(c=0;;)if(c<d){var f=H.a(a,c),e=b.a?b.a(e,f):b.call(null,e,f);if(Ec(e))return lb(e);c+=1}else return e}
function Hc(a,b){var c=a.length;if(0===a.length)return b.w?b.w():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.a?b.a(d,f):b.call(null,d,f);if(Ec(d))return lb(d);e+=1}else return d}function Ic(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.a?b.a(e,f):b.call(null,e,f);if(Ec(e))return lb(e);c+=1}else return e}function Jc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.a?b.a(c,f):b.call(null,c,f);if(Ec(c))return lb(c);d+=1}else return c}Kc;N;Lc;Mc;
function Nc(a){return null!=a?a.i&2||a.Xb?!0:a.i?!1:B(Oa,a):B(Oa,a)}function Oc(a){return null!=a?a.i&16||a.Nb?!0:a.i?!1:B(Ta,a):B(Ta,a)}function Pc(a,b){this.f=a;this.l=b}Pc.prototype.ta=function(){return this.l<this.f.length};Pc.prototype.next=function(){var a=this.f[this.l];this.l+=1;return a};function oc(a,b){this.f=a;this.l=b;this.i=166199550;this.B=8192}g=oc.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};
g.X=function(a,b){var c=b+this.l;return c<this.f.length?this.f[c]:null};g.ya=function(a,b,c){a=b+this.l;return a<this.f.length?this.f[a]:c};g.Fa=function(){return new Pc(this.f,this.l)};g.ra=function(){return this.l+1<this.f.length?new oc(this.f,this.l+1):null};g.Y=function(){var a=this.f.length-this.l;return 0>a?0:a};g.N=function(){return wc(this)};g.v=function(a,b){return Bc.a?Bc.a(this,b):Bc.call(null,this,b)};g.Z=function(){return qc};
g.$=function(a,b){return Jc(this.f,b,this.f[this.l],this.l+1)};g.aa=function(a,b,c){return Jc(this.f,b,c,this.l)};g.ba=function(){return this.f[this.l]};g.sa=function(){return this.l+1<this.f.length?new oc(this.f,this.l+1):qc};g.U=function(){return this.l<this.f.length?this:null};g.V=function(a,b){return N.a?N.a(b,this):N.call(null,b,this)};oc.prototype[Ka]=function(){return sc(this)};
var mc=function mc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return mc.b(arguments[0]);case 2:return mc.a(arguments[0],arguments[1]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};mc.b=function(a){return mc.a(a,0)};mc.a=function(a,b){return b<a.length?new oc(a,b):null};mc.A=2;
var lc=function lc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return lc.b(arguments[0]);case 2:return lc.a(arguments[0],arguments[1]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};lc.b=function(a){return mc.a(a,0)};lc.a=function(a,b){return mc.a(a,b)};lc.A=2;Cc;Q;function Lc(a,b,c){this.vb=a;this.l=b;this.s=c;this.i=32374990;this.B=8192}g=Lc.prototype;g.toString=function(){return Ub(this)};
g.equiv=function(a){return this.v(null,a)};g.P=function(){return this.s};g.ra=function(){return 0<this.l?new Lc(this.vb,this.l-1,null):null};g.Y=function(){return this.l+1};g.N=function(){return wc(this)};g.v=function(a,b){return Bc.a?Bc.a(this,b):Bc.call(null,this,b)};g.Z=function(){var a=qc,b=this.s;return Cc.a?Cc.a(a,b):Cc.call(null,a,b)};g.$=function(a,b){return Q.a?Q.a(b,this):Q.call(null,b,this)};g.aa=function(a,b,c){return Q.c?Q.c(b,c,this):Q.call(null,b,c,this)};
g.ba=function(){return H.a(this.vb,this.l)};g.sa=function(){return 0<this.l?new Lc(this.vb,this.l-1,null):qc};g.U=function(){return this};g.R=function(a,b){return new Lc(this.vb,this.l,b)};g.V=function(a,b){return N.a?N.a(b,this):N.call(null,b,this)};Lc.prototype[Ka]=function(){return sc(this)};rb._=function(a,b){return a===b};
var Qc=function Qc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Qc.w();case 1:return Qc.b(arguments[0]);case 2:return Qc.a(arguments[0],arguments[1]);default:return Qc.m(arguments[0],arguments[1],new oc(c.slice(2),0))}};Qc.w=function(){return Rc};Qc.b=function(a){return a};Qc.a=function(a,b){return null!=a?Sa(a,b):Sa(qc,b)};Qc.m=function(a,b,c){for(;;)if(y(c))a=Qc.a(a,b),b=K(c),c=L(c);else return Qc.a(a,b)};
Qc.H=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return Qc.m(b,a,c)};Qc.A=2;function Sc(a){if(null!=a)if(null!=a&&(a.i&2||a.Xb))a=a.Y(null);else if(Ga(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.i&8388608||a.fc))a:{a=J(a);for(var b=0;;){if(Nc(a)){a=b+Pa(a);break a}a=L(a);b+=1}}else a=Pa(a);else a=0;return a}function Tc(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return J(a)?K(a):c;if(Oc(a))return H.c(a,b,c);if(J(a)){var d=L(a),e=b-1;a=d;b=e}else return c}}
function Vc(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.i&16||a.Nb))return a.X(null,b);if(Ga(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Qa)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(J(c)){c=K(c);break a}throw Error("Index out of bounds");}if(Oc(c)){c=H.a(c,d);break a}if(J(c))c=L(c),--d;else throw Error("Index out of bounds");
}}return c}if(B(Ta,a))return H.a(a,b);throw Error([F("nth not supported on this type "),F(Ja(null==a?null:a.constructor))].join(""));}
function Wc(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.i&16||a.Nb))return a.ya(null,b,null);if(Ga(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Qa))return Tc(a,b);if(B(Ta,a))return H.a(a,b);throw Error([F("nth not supported on this type "),F(Ja(null==a?null:a.constructor))].join(""));}
var I=function I(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return I.a(arguments[0],arguments[1]);case 3:return I.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};I.a=function(a,b){return null==a?null:null!=a&&(a.i&256||a.Ob)?a.J(null,b):Ga(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:B(Za,a)?$a.a(a,b):null};
I.c=function(a,b,c){return null!=a?null!=a&&(a.i&256||a.Ob)?a.G(null,b,c):Ga(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:B(Za,a)?$a.c(a,b,c):c:c};I.A=3;Xc;var Yc=function Yc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Yc.c(arguments[0],arguments[1],arguments[2]);default:return Yc.m(arguments[0],arguments[1],arguments[2],new oc(c.slice(3),0))}};
Yc.c=function(a,b,c){if(null!=a)a=bb(a,b,c);else a:{a=[b];c=[c];b=a.length;var d=0,e;for(e=Cb(Zc);;)if(d<b){var f=d+1;e=e.mb(null,a[d],c[d]);d=f}else{a=Eb(e);break a}}return a};Yc.m=function(a,b,c,d){for(;;)if(a=Yc.c(a,b,c),y(d))b=K(d),c=K(L(d)),d=L(L(d));else return a};Yc.H=function(a){var b=K(a),c=L(a);a=K(c);var d=L(c),c=K(d),d=L(d);return Yc.m(b,a,c,d)};Yc.A=3;
var $c=function $c(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return $c.b(arguments[0]);case 2:return $c.a(arguments[0],arguments[1]);default:return $c.m(arguments[0],arguments[1],new oc(c.slice(2),0))}};$c.b=function(a){return a};$c.a=function(a,b){return null==a?null:db(a,b)};$c.m=function(a,b,c){for(;;){if(null==a)return null;a=$c.a(a,b);if(y(c))b=K(c),c=L(c);else return a}};
$c.H=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return $c.m(b,a,c)};$c.A=2;function ad(a,b){this.g=a;this.s=b;this.i=393217;this.B=0}g=ad.prototype;g.P=function(){return this.s};g.R=function(a,b){return new ad(this.g,b)};
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,E,P){a=this;return G.hb?G.hb(a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,E,P):G.call(null,a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,E,P)}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,E){a=this;return a.g.na?a.g.na(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,E):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,E)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D){a=this;return a.g.ma?a.g.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):
a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x){a=this;return a.g.la?a.g.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){a=this;return a.g.ka?a.g.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){a=this;return a.g.ja?a.g.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.g.call(null,b,
c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){a=this;return a.g.ia?a.g.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)}function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){a=this;return a.g.ha?a.g.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;return a.g.ga?a.g.ga(b,c,d,e,f,h,k,l,m,n,p,q,r):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;
return a.g.fa?a.g.fa(b,c,d,e,f,h,k,l,m,n,p,q):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;return a.g.ea?a.g.ea(b,c,d,e,f,h,k,l,m,n,p):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,n){a=this;return a.g.da?a.g.da(b,c,d,e,f,h,k,l,m,n):a.g.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;return a.g.pa?a.g.pa(b,c,d,e,f,h,k,l,m):a.g.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;return a.g.oa?a.g.oa(b,c,
d,e,f,h,k,l):a.g.call(null,b,c,d,e,f,h,k,l)}function t(a,b,c,d,e,f,h,k){a=this;return a.g.W?a.g.W(b,c,d,e,f,h,k):a.g.call(null,b,c,d,e,f,h,k)}function v(a,b,c,d,e,f,h){a=this;return a.g.S?a.g.S(b,c,d,e,f,h):a.g.call(null,b,c,d,e,f,h)}function w(a,b,c,d,e,f){a=this;return a.g.C?a.g.C(b,c,d,e,f):a.g.call(null,b,c,d,e,f)}function z(a,b,c,d,e){a=this;return a.g.o?a.g.o(b,c,d,e):a.g.call(null,b,c,d,e)}function D(a,b,c,d){a=this;return a.g.c?a.g.c(b,c,d):a.g.call(null,b,c,d)}function E(a,b,c){a=this;return a.g.a?
a.g.a(b,c):a.g.call(null,b,c)}function P(a,b){a=this;return a.g.b?a.g.b(b):a.g.call(null,b)}function oa(a){a=this;return a.g.w?a.g.w():a.g.call(null)}var x=null,x=function(Da,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,x,Xa,gb,sb,Nb,nc,Uc,qe){switch(arguments.length){case 1:return oa.call(this,Da);case 2:return P.call(this,Da,O);case 3:return E.call(this,Da,O,R);case 4:return D.call(this,Da,O,R,T);case 5:return z.call(this,Da,O,R,T,U);case 6:return w.call(this,Da,O,R,T,U,Z);case 7:return v.call(this,Da,O,R,
T,U,Z,ea);case 8:return t.call(this,Da,O,R,T,U,Z,ea,ja);case 9:return r.call(this,Da,O,R,T,U,Z,ea,ja,ka);case 10:return q.call(this,Da,O,R,T,U,Z,ea,ja,ka,na);case 11:return p.call(this,Da,O,R,T,U,Z,ea,ja,ka,na,qa);case 12:return n.call(this,Da,O,R,T,U,Z,ea,ja,ka,na,qa,wa);case 13:return m.call(this,Da,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha);case 14:return l.call(this,Da,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La);case 15:return k.call(this,Da,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,x);case 16:return h.call(this,Da,O,R,
T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,x,Xa);case 17:return f.call(this,Da,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,x,Xa,gb);case 18:return e.call(this,Da,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,x,Xa,gb,sb);case 19:return d.call(this,Da,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,x,Xa,gb,sb,Nb);case 20:return c.call(this,Da,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,x,Xa,gb,sb,Nb,nc);case 21:return b.call(this,Da,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,x,Xa,gb,sb,Nb,nc,Uc);case 22:return a.call(this,Da,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,x,Xa,gb,
sb,Nb,nc,Uc,qe)}throw Error("Invalid arity: "+arguments.length);};x.b=oa;x.a=P;x.c=E;x.o=D;x.C=z;x.S=w;x.W=v;x.oa=t;x.pa=r;x.da=q;x.ea=p;x.fa=n;x.ga=m;x.ha=l;x.ia=k;x.ja=h;x.ka=f;x.la=e;x.ma=d;x.na=c;x.Hb=b;x.hb=a;return x}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};g.w=function(){return this.g.w?this.g.w():this.g.call(null)};g.b=function(a){return this.g.b?this.g.b(a):this.g.call(null,a)};g.a=function(a,b){return this.g.a?this.g.a(a,b):this.g.call(null,a,b)};
g.c=function(a,b,c){return this.g.c?this.g.c(a,b,c):this.g.call(null,a,b,c)};g.o=function(a,b,c,d){return this.g.o?this.g.o(a,b,c,d):this.g.call(null,a,b,c,d)};g.C=function(a,b,c,d,e){return this.g.C?this.g.C(a,b,c,d,e):this.g.call(null,a,b,c,d,e)};g.S=function(a,b,c,d,e,f){return this.g.S?this.g.S(a,b,c,d,e,f):this.g.call(null,a,b,c,d,e,f)};g.W=function(a,b,c,d,e,f,h){return this.g.W?this.g.W(a,b,c,d,e,f,h):this.g.call(null,a,b,c,d,e,f,h)};
g.oa=function(a,b,c,d,e,f,h,k){return this.g.oa?this.g.oa(a,b,c,d,e,f,h,k):this.g.call(null,a,b,c,d,e,f,h,k)};g.pa=function(a,b,c,d,e,f,h,k,l){return this.g.pa?this.g.pa(a,b,c,d,e,f,h,k,l):this.g.call(null,a,b,c,d,e,f,h,k,l)};g.da=function(a,b,c,d,e,f,h,k,l,m){return this.g.da?this.g.da(a,b,c,d,e,f,h,k,l,m):this.g.call(null,a,b,c,d,e,f,h,k,l,m)};g.ea=function(a,b,c,d,e,f,h,k,l,m,n){return this.g.ea?this.g.ea(a,b,c,d,e,f,h,k,l,m,n):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n)};
g.fa=function(a,b,c,d,e,f,h,k,l,m,n,p){return this.g.fa?this.g.fa(a,b,c,d,e,f,h,k,l,m,n,p):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p,q){return this.g.ga?this.g.ga(a,b,c,d,e,f,h,k,l,m,n,p,q):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){return this.g.ha?this.g.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};
g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){return this.g.ia?this.g.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t)};g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){return this.g.ja?this.g.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)};g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){return this.g.ka?this.g.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)};
g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){return this.g.la?this.g.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)};g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D){return this.g.ma?this.g.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D)};
g.na=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E){return this.g.na?this.g.na(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E)};g.Hb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E,P){return G.hb?G.hb(this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E,P):G.call(null,this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E,P)};function Cc(a,b){return"function"==u(a)?new ad(a,b):null==a?null:ob(a,b)}
function bd(a){var b=null!=a;return(b?null!=a?a.i&131072||a.bc||(a.i?0:B(mb,a)):B(mb,a):b)?nb(a):null}function cd(a){return null==a?!1:null!=a?a.i&4096||a.Cc?!0:a.i?!1:B(ib,a):B(ib,a)}function dd(a){return null!=a?a.i&16777216||a.Bc?!0:a.i?!1:B(wb,a):B(wb,a)}function ed(a){return null==a?!1:null!=a?a.i&1024||a.$b?!0:a.i?!1:B(cb,a):B(cb,a)}function fd(a){return null!=a?a.i&16384||a.Dc?!0:a.i?!1:B(jb,a):B(jb,a)}gd;hd;function id(a){return null!=a?a.B&512||a.wc?!0:!1:!1}
function jd(a){var b=[];ha(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function kd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var ld={};function md(a){return null==a?!1:null!=a?a.i&64||a.Qa?!0:a.i?!1:B(Ua,a):B(Ua,a)}function nd(a){return null==a?!1:!1===a?!1:!0}function od(a,b){return I.c(a,b,ld)===ld?!1:!0}
function dc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return la(a,b);throw Error([F("Cannot compare "),F(a),F(" to "),F(b)].join(""));}if(null!=a?a.B&2048||a.gb||(a.B?0:B(Hb,a)):B(Hb,a))return Ib(a,b);if("string"!==typeof a&&!Ga(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([F("Cannot compare "),F(a),F(" to "),F(b)].join(""));return la(a,b)}
function pd(a,b){var c=Sc(a),d=Sc(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=dc(Vc(a,d),Vc(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}qd;var Q=function Q(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Q.a(arguments[0],arguments[1]);case 3:return Q.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};
Q.a=function(a,b){var c=J(b);if(c){var d=K(c),c=L(c);return Na.c?Na.c(a,d,c):Na.call(null,a,d,c)}return a.w?a.w():a.call(null)};Q.c=function(a,b,c){for(c=J(c);;)if(c){var d=K(c);b=a.a?a.a(b,d):a.call(null,b,d);if(Ec(b))return lb(b);c=L(c)}else return b};Q.A=3;rd;
var Na=function Na(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Na.a(arguments[0],arguments[1]);case 3:return Na.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};Na.a=function(a,b){return null!=b&&(b.i&524288||b.dc)?b.$(null,a):Ga(b)?Hc(b,a):"string"===typeof b?Hc(b,a):B(pb,b)?qb.a(b,a):Q.a(a,b)};
Na.c=function(a,b,c){return null!=c&&(c.i&524288||c.dc)?c.aa(null,a,b):Ga(c)?Ic(c,a,b):"string"===typeof c?Ic(c,a,b):B(pb,c)?qb.c(c,a,b):Q.c(a,b,c)};Na.A=3;function sd(a){return a}({}).Ec;td;function td(a,b){return(a%b+b)%b}function ud(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function vd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function wd(a){var b=2;for(a=J(a);;)if(a&&0<b)--b,a=L(a);else return a}
var F=function F(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return F.w();case 1:return F.b(arguments[0]);default:return F.m(arguments[0],new oc(c.slice(1),0))}};F.w=function(){return""};F.b=function(a){return null==a?"":""+a};F.m=function(a,b){for(var c=new ia(""+F(a)),d=b;;)if(y(d))c=c.append(""+F(K(d))),d=L(d);else return c.toString()};F.H=function(a){var b=K(a);a=L(a);return F.m(b,a)};F.A=1;S;xd;
function Bc(a,b){var c;if(dd(b))if(Nc(a)&&Nc(b)&&Sc(a)!==Sc(b))c=!1;else a:{c=J(a);for(var d=J(b);;){if(null==c){c=null==d;break a}if(null!=d&&cc.a(K(c),K(d)))c=L(c),d=L(d);else{c=!1;break a}}}else c=null;return nd(c)}function Kc(a){if(J(a)){var b=hc(K(a));for(a=L(a);;){if(null==a)return b;b=ic(b,hc(K(a)));a=L(a)}}else return 0}yd;zd;xd;Ad;Bd;function Mc(a,b,c,d,e){this.s=a;this.first=b;this.va=c;this.count=d;this.u=e;this.i=65937646;this.B=8192}g=Mc.prototype;g.toString=function(){return Ub(this)};
g.equiv=function(a){return this.v(null,a)};g.P=function(){return this.s};g.ra=function(){return 1===this.count?null:this.va};g.Y=function(){return this.count};g.N=function(){var a=this.u;return null!=a?a:this.u=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(){return ob(qc,this.s)};g.$=function(a,b){return Q.a(b,this)};g.aa=function(a,b,c){return Q.c(b,c,this)};g.ba=function(){return this.first};g.sa=function(){return 1===this.count?qc:this.va};g.U=function(){return this};
g.R=function(a,b){return new Mc(b,this.first,this.va,this.count,this.u)};g.V=function(a,b){return new Mc(this.s,b,this,this.count+1,null)};Mc.prototype[Ka]=function(){return sc(this)};function Cd(a){this.s=a;this.i=65937614;this.B=8192}g=Cd.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};g.P=function(){return this.s};g.ra=function(){return null};g.Y=function(){return 0};g.N=function(){return xc};
g.v=function(a,b){return(null!=b?b.i&33554432||b.Ac||(b.i?0:B(xb,b)):B(xb,b))||dd(b)?null==J(b):!1};g.Z=function(){return this};g.$=function(a,b){return Q.a(b,this)};g.aa=function(a,b,c){return Q.c(b,c,this)};g.ba=function(){return null};g.sa=function(){return qc};g.U=function(){return null};g.R=function(a,b){return new Cd(b)};g.V=function(a,b){return new Mc(this.s,b,null,1,null)};var qc=new Cd(null);Cd.prototype[Ka]=function(){return sc(this)};
var ac=function ac(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ac.m(0<c.length?new oc(c.slice(0),0):null)};ac.m=function(a){var b;if(a instanceof oc&&0===a.l)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.ba(null)),a=a.ra(null);else break a;a=b.length;for(var c=qc;;)if(0<a){var d=a-1,c=c.V(null,b[a-1]);a=d}else return c};ac.A=0;ac.H=function(a){return ac.m(J(a))};
function Dd(a,b,c,d){this.s=a;this.first=b;this.va=c;this.u=d;this.i=65929452;this.B=8192}g=Dd.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};g.P=function(){return this.s};g.ra=function(){return null==this.va?null:J(this.va)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(){return Cc(qc,this.s)};g.$=function(a,b){return Q.a(b,this)};g.aa=function(a,b,c){return Q.c(b,c,this)};g.ba=function(){return this.first};
g.sa=function(){return null==this.va?qc:this.va};g.U=function(){return this};g.R=function(a,b){return new Dd(b,this.first,this.va,this.u)};g.V=function(a,b){return new Dd(null,b,this,this.u)};Dd.prototype[Ka]=function(){return sc(this)};function N(a,b){var c=null==b;return(c?c:null!=b&&(b.i&64||b.Qa))?new Dd(null,a,b,null):new Dd(null,a,J(b),null)}
function Ed(a,b){if(a.Aa===b.Aa)return 0;var c=Ia(a.qa);if(y(c?b.qa:c))return-1;if(y(a.qa)){if(Ia(b.qa))return 1;c=la(a.qa,b.qa);return 0===c?la(a.name,b.name):c}return la(a.name,b.name)}function A(a,b,c,d){this.qa=a;this.name=b;this.Aa=c;this.Va=d;this.i=2153775105;this.B=4096}g=A.prototype;g.toString=function(){return[F(":"),F(this.Aa)].join("")};g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return b instanceof A?this.Aa===b.Aa:!1};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return I.a(c,this);case 3:return I.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return I.a(c,this)};a.c=function(a,c,d){return I.c(c,this,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};g.b=function(a){return I.a(a,this)};g.a=function(a,b){return I.c(a,this,b)};
g.N=function(){var a=this.Va;return null!=a?a:this.Va=a=ic($b(this.name),gc(this.qa))+2654435769|0};g.kb=function(){return this.name};g.lb=function(){return this.qa};g.K=function(a,b){return yb(b,[F(":"),F(this.Aa)].join(""))};function Fd(a,b){return a===b?!0:a instanceof A&&b instanceof A?a.Aa===b.Aa:!1}
var Gd=function Gd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Gd.b(arguments[0]);case 2:return Gd.a(arguments[0],arguments[1]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};
Gd.b=function(a){if(a instanceof A)return a;if(a instanceof bc){var b;if(null!=a&&(a.B&4096||a.cc))b=a.lb(null);else throw Error([F("Doesn't support namespace: "),F(a)].join(""));return new A(b,xd.b?xd.b(a):xd.call(null,a),a.Ha,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new A(b[0],b[1],a,null):new A(null,b[0],a,null)):null};Gd.a=function(a,b){return new A(a,b,[F(y(a)?[F(a),F("/")].join(""):null),F(b)].join(""),null)};Gd.A=2;
function Hd(a,b,c,d){this.s=a;this.$a=b;this.D=c;this.u=d;this.i=32374988;this.B=0}g=Hd.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};function Id(a){null!=a.$a&&(a.D=a.$a.w?a.$a.w():a.$a.call(null),a.$a=null);return a.D}g.P=function(){return this.s};g.ra=function(){vb(this);return null==this.D?null:L(this.D)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(){return Cc(qc,this.s)};
g.$=function(a,b){return Q.a(b,this)};g.aa=function(a,b,c){return Q.c(b,c,this)};g.ba=function(){vb(this);return null==this.D?null:K(this.D)};g.sa=function(){vb(this);return null!=this.D?pc(this.D):qc};g.U=function(){Id(this);if(null==this.D)return null;for(var a=this.D;;)if(a instanceof Hd)a=Id(a);else return this.D=a,J(this.D)};g.R=function(a,b){return new Hd(b,this.$a,this.D,this.u)};g.V=function(a,b){return N(b,this)};Hd.prototype[Ka]=function(){return sc(this)};Jd;
function Kd(a,b){this.Cb=a;this.end=b;this.i=2;this.B=0}Kd.prototype.add=function(a){this.Cb[this.end]=a;return this.end+=1};Kd.prototype.Ea=function(){var a=new Jd(this.Cb,0,this.end);this.Cb=null;return a};Kd.prototype.Y=function(){return this.end};function Jd(a,b,c){this.f=a;this.ca=b;this.end=c;this.i=524306;this.B=0}g=Jd.prototype;g.Y=function(){return this.end-this.ca};g.X=function(a,b){return this.f[this.ca+b]};g.ya=function(a,b,c){return 0<=b&&b<this.end-this.ca?this.f[this.ca+b]:c};
g.Mb=function(){if(this.ca===this.end)throw Error("-drop-first of empty chunk");return new Jd(this.f,this.ca+1,this.end)};g.$=function(a,b){return Jc(this.f,b,this.f[this.ca],this.ca+1)};g.aa=function(a,b,c){return Jc(this.f,b,c,this.ca)};function gd(a,b,c,d){this.Ea=a;this.Ga=b;this.s=c;this.u=d;this.i=31850732;this.B=1536}g=gd.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};g.P=function(){return this.s};
g.ra=function(){if(1<Pa(this.Ea))return new gd(Jb(this.Ea),this.Ga,this.s,null);var a=vb(this.Ga);return null==a?null:a};g.N=function(){var a=this.u;return null!=a?a:this.u=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(){return Cc(qc,this.s)};g.ba=function(){return H.a(this.Ea,0)};g.sa=function(){return 1<Pa(this.Ea)?new gd(Jb(this.Ea),this.Ga,this.s,null):null==this.Ga?qc:this.Ga};g.U=function(){return this};g.Fb=function(){return this.Ea};
g.Gb=function(){return null==this.Ga?qc:this.Ga};g.R=function(a,b){return new gd(this.Ea,this.Ga,b,this.u)};g.V=function(a,b){return N(b,this)};g.Eb=function(){return null==this.Ga?null:this.Ga};gd.prototype[Ka]=function(){return sc(this)};function Ld(a,b){return 0===Pa(a)?b:new gd(a,b,null,null)}function Md(a,b){a.add(b)}function Ad(a){return Kb(a)}function Bd(a){return Lb(a)}function qd(a){for(var b=[];;)if(J(a))b.push(K(a)),a=L(a);else return b}
function Nd(a,b){if(Nc(a))return Sc(a);for(var c=a,d=b,e=0;;)if(0<d&&J(c))c=L(c),--d,e+=1;else return e}var Od=function Od(b){return null==b?null:null==L(b)?J(K(b)):N(K(b),Od(L(b)))},Pd=function Pd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Pd.w();case 1:return Pd.b(arguments[0]);case 2:return Pd.a(arguments[0],arguments[1]);default:return Pd.m(arguments[0],arguments[1],new oc(c.slice(2),0))}};
Pd.w=function(){return new Hd(null,function(){return null},null,null)};Pd.b=function(a){return new Hd(null,function(){return a},null,null)};Pd.a=function(a,b){return new Hd(null,function(){var c=J(a);return c?id(c)?Ld(Kb(c),Pd.a(Lb(c),b)):N(K(c),Pd.a(pc(c),b)):b},null,null)};Pd.m=function(a,b,c){return function e(a,b){return new Hd(null,function(){var c=J(a);return c?id(c)?Ld(Kb(c),e(Lb(c),b)):N(K(c),e(pc(c),b)):y(b)?e(K(b),L(b)):null},null,null)}(Pd.a(a,b),c)};
Pd.H=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return Pd.m(b,a,c)};Pd.A=2;var Qd=function Qd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Qd.w();case 1:return Qd.b(arguments[0]);case 2:return Qd.a(arguments[0],arguments[1]);default:return Qd.m(arguments[0],arguments[1],new oc(c.slice(2),0))}};Qd.w=function(){return Cb(Rc)};Qd.b=function(a){return a};Qd.a=function(a,b){return Db(a,b)};
Qd.m=function(a,b,c){for(;;)if(a=Db(a,b),y(c))b=K(c),c=L(c);else return a};Qd.H=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return Qd.m(b,a,c)};Qd.A=2;
function Rd(a,b,c){var d=J(c);if(0===b)return a.w?a.w():a.call(null);c=Va(d);var e=Wa(d);if(1===b)return a.b?a.b(c):a.b?a.b(c):a.call(null,c);var d=Va(e),f=Wa(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=Va(f),h=Wa(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=Va(h),k=Wa(h);if(4===b)return a.o?a.o(c,d,e,f):a.o?a.o(c,d,e,f):a.call(null,c,d,e,f);var h=Va(k),l=Wa(k);if(5===b)return a.C?a.C(c,d,e,f,h):a.C?a.C(c,d,e,f,h):a.call(null,c,d,e,f,h);var k=Va(l),
m=Wa(l);if(6===b)return a.S?a.S(c,d,e,f,h,k):a.S?a.S(c,d,e,f,h,k):a.call(null,c,d,e,f,h,k);var l=Va(m),n=Wa(m);if(7===b)return a.W?a.W(c,d,e,f,h,k,l):a.W?a.W(c,d,e,f,h,k,l):a.call(null,c,d,e,f,h,k,l);var m=Va(n),p=Wa(n);if(8===b)return a.oa?a.oa(c,d,e,f,h,k,l,m):a.oa?a.oa(c,d,e,f,h,k,l,m):a.call(null,c,d,e,f,h,k,l,m);var n=Va(p),q=Wa(p);if(9===b)return a.pa?a.pa(c,d,e,f,h,k,l,m,n):a.pa?a.pa(c,d,e,f,h,k,l,m,n):a.call(null,c,d,e,f,h,k,l,m,n);var p=Va(q),r=Wa(q);if(10===b)return a.da?a.da(c,d,e,f,h,
k,l,m,n,p):a.da?a.da(c,d,e,f,h,k,l,m,n,p):a.call(null,c,d,e,f,h,k,l,m,n,p);var q=Va(r),t=Wa(r);if(11===b)return a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q):a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q):a.call(null,c,d,e,f,h,k,l,m,n,p,q);var r=Va(t),v=Wa(t);if(12===b)return a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r):a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r);var t=Va(v),w=Wa(v);if(13===b)return a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,t):a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,t):a.call(null,c,d,e,f,h,k,l,m,n,p,q,
r,t);var v=Va(w),z=Wa(w);if(14===b)return a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v);var w=Va(z),D=Wa(z);if(15===b)return a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w);var z=Va(D),E=Wa(D);if(16===b)return a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z);var D=Va(E),
P=Wa(E);if(17===b)return a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D);var E=Va(P),oa=Wa(P);if(18===b)return a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E):a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E);P=Va(oa);oa=Wa(oa);if(19===b)return a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E,P):a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E,P):a.call(null,c,d,e,f,h,k,
l,m,n,p,q,r,t,v,w,z,D,E,P);var x=Va(oa);Wa(oa);if(20===b)return a.na?a.na(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E,P,x):a.na?a.na(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E,P,x):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E,P,x);throw Error("Only up to 20 arguments supported on functions");}
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return G.a(arguments[0],arguments[1]);case 3:return G.c(arguments[0],arguments[1],arguments[2]);case 4:return G.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return G.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return G.m(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new oc(c.slice(5),0))}};
G.a=function(a,b){var c=a.A;if(a.H){var d=Nd(b,c+1);return d<=c?Rd(a,d,b):a.H(b)}return a.apply(a,qd(b))};G.c=function(a,b,c){b=N(b,c);c=a.A;if(a.H){var d=Nd(b,c+1);return d<=c?Rd(a,d,b):a.H(b)}return a.apply(a,qd(b))};G.o=function(a,b,c,d){b=N(b,N(c,d));c=a.A;return a.H?(d=Nd(b,c+1),d<=c?Rd(a,d,b):a.H(b)):a.apply(a,qd(b))};G.C=function(a,b,c,d,e){b=N(b,N(c,N(d,e)));c=a.A;return a.H?(d=Nd(b,c+1),d<=c?Rd(a,d,b):a.H(b)):a.apply(a,qd(b))};
G.m=function(a,b,c,d,e,f){b=N(b,N(c,N(d,N(e,Od(f)))));c=a.A;return a.H?(d=Nd(b,c+1),d<=c?Rd(a,d,b):a.H(b)):a.apply(a,qd(b))};G.H=function(a){var b=K(a),c=L(a);a=K(c);var d=L(c),c=K(d),e=L(d),d=K(e),f=L(e),e=K(f),f=L(f);return G.m(b,a,c,d,e,f)};G.A=5;function Sd(a){return J(a)?a:null}
var Td=function Td(){"undefined"===typeof ma&&(ma=function(b,c){this.rc=b;this.qc=c;this.i=393216;this.B=0},ma.prototype.R=function(b,c){return new ma(this.rc,c)},ma.prototype.P=function(){return this.qc},ma.prototype.ta=function(){return!1},ma.prototype.next=function(){return Error("No such element")},ma.prototype.remove=function(){return Error("Unsupported operation")},ma.oc=function(){return new V(null,2,5,W,[Cc(Ud,new va(null,1,[Vd,ac(Wd,ac(Rc))],null)),Xd],null)},ma.Ib=!0,ma.pb="cljs.core/t_cljs$core15371",
ma.Tb=function(b,c){return yb(c,"cljs.core/t_cljs$core15371")});return new ma(Td,Yd)};Zd;function Zd(a,b,c,d){this.cb=a;this.first=b;this.va=c;this.s=d;this.i=31719628;this.B=0}g=Zd.prototype;g.R=function(a,b){return new Zd(this.cb,this.first,this.va,b)};g.V=function(a,b){return N(b,vb(this))};g.Z=function(){return qc};g.v=function(a,b){return null!=vb(this)?Bc(this,b):dd(b)&&null==J(b)};g.N=function(){return wc(this)};g.U=function(){null!=this.cb&&this.cb.step(this);return null==this.va?null:this};
g.ba=function(){null!=this.cb&&vb(this);return null==this.va?null:this.first};g.sa=function(){null!=this.cb&&vb(this);return null==this.va?qc:this.va};g.ra=function(){null!=this.cb&&vb(this);return null==this.va?null:vb(this.va)};Zd.prototype[Ka]=function(){return sc(this)};function $d(a,b){for(;;){if(null==J(b))return!0;var c;c=K(b);c=a.b?a.b(c):a.call(null,c);if(y(c)){c=a;var d=L(b);a=c;b=d}else return!1}}
function ae(a){return function(){function b(b,c){return Ia(a.a?a.a(b,c):a.call(null,b,c))}function c(b){return Ia(a.b?a.b(b):a.call(null,b))}function d(){return Ia(a.w?a.w():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new oc(h,0)}return c.call(this,a,d,f)}function c(b,d,e){return Ia(G.o(a,b,d,e))}b.A=2;b.H=function(a){var b=K(a);a=L(a);var d=K(a);a=pc(a);return c(b,d,a)};b.m=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new oc(n,0)}return f.m(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.A=2;e.H=f.H;e.w=d;e.b=c;e.a=b;e.m=f.m;return e}()}be;function ce(a,b,c,d){this.state=a;this.s=b;this.vc=c;this.zb=d;this.B=16386;this.i=6455296}g=ce.prototype;
g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return this===b};g.wb=function(){return this.state};g.P=function(){return this.s};g.Rb=function(a,b,c){a=J(this.zb);for(var d=null,e=0,f=0;;)if(f<e){var h=d.X(null,f),k=Wc(h,0),h=Wc(h,1);h.o?h.o(k,this,b,c):h.call(null,k,this,b,c);f+=1}else if(a=J(a))id(a)?(d=Kb(a),a=Lb(a),k=d,e=Sc(d),d=k):(d=K(a),k=Wc(d,0),h=Wc(d,1),h.o?h.o(k,this,b,c):h.call(null,k,this,b,c),a=L(a),d=null,e=0),f=0;else return null};
g.Qb=function(a,b,c){this.zb=Yc.c(this.zb,b,c);return this};g.N=function(){return this[ba]||(this[ba]=++ca)};var de=function de(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return de.b(arguments[0]);default:return de.m(arguments[0],new oc(c.slice(1),0))}};de.b=function(a){return new ce(a,null,null,null)};de.m=function(a,b){var c=null!=b&&(b.i&64||b.Qa)?G.a(Ac,b):b,d=I.a(c,za),c=I.a(c,ee);return new ce(a,d,c,null)};
de.H=function(a){var b=K(a);a=L(a);return de.m(b,a)};de.A=1;fe;function ge(a,b){if(a instanceof ce){var c=a.vc;if(null!=c&&!y(c.b?c.b(b):c.call(null,b)))throw Error([F("Assert failed: "),F("Validator rejected reference state"),F("\n"),F(function(){var a=ac(he,ie);return fe.b?fe.b(a):fe.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.zb&&Ab(a,c,b);return b}return Qb(a,b)}
var je=function je(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return je.a(arguments[0],arguments[1]);case 3:return je.c(arguments[0],arguments[1],arguments[2]);case 4:return je.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return je.m(arguments[0],arguments[1],arguments[2],arguments[3],new oc(c.slice(4),0))}};je.a=function(a,b){var c;a instanceof ce?(c=a.state,c=b.b?b.b(c):b.call(null,c),c=ge(a,c)):c=Rb.a(a,b);return c};
je.c=function(a,b,c){if(a instanceof ce){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=ge(a,b)}else a=Rb.c(a,b,c);return a};je.o=function(a,b,c,d){if(a instanceof ce){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=ge(a,b)}else a=Rb.o(a,b,c,d);return a};je.m=function(a,b,c,d,e){return a instanceof ce?ge(a,G.C(b,a.state,c,d,e)):Rb.C(a,b,c,d,e)};je.H=function(a){var b=K(a),c=L(a);a=K(c);var d=L(c),c=K(d),e=L(d),d=K(e),e=L(e);return je.m(b,a,c,d,e)};je.A=4;
function ke(a){this.state=a;this.i=32768;this.B=0}ke.prototype.wb=function(){return this.state};function be(a){return new ke(a)}
var S=function S(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return S.b(arguments[0]);case 2:return S.a(arguments[0],arguments[1]);case 3:return S.c(arguments[0],arguments[1],arguments[2]);case 4:return S.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return S.m(arguments[0],arguments[1],arguments[2],arguments[3],new oc(c.slice(4),0))}};
S.b=function(a){return function(b){return function(){function c(c,d){var e=a.b?a.b(d):a.call(null,d);return b.a?b.a(c,e):b.call(null,c,e)}function d(a){return b.b?b.b(a):b.call(null,a)}function e(){return b.w?b.w():b.call(null)}var f=null,h=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new oc(h,0)}return d.call(this,a,b,f)}function d(c,e,f){e=G.c(a,e,f);return b.a?b.a(c,e):b.call(null,c,e)}c.A=2;c.H=function(a){var b=
K(a);a=L(a);var c=K(a);a=pc(a);return d(b,c,a)};c.m=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new oc(p,0)}return h.m(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.A=2;f.H=h.H;f.w=e;f.b=d;f.a=c;f.m=h.m;return f}()}};
S.a=function(a,b){return new Hd(null,function(){var c=J(b);if(c){if(id(c)){for(var d=Kb(c),e=Sc(d),f=new Kd(Array(e),0),h=0;;)if(h<e)Md(f,function(){var b=H.a(d,h);return a.b?a.b(b):a.call(null,b)}()),h+=1;else break;return Ld(f.Ea(),S.a(a,Lb(c)))}return N(function(){var b=K(c);return a.b?a.b(b):a.call(null,b)}(),S.a(a,pc(c)))}return null},null,null)};
S.c=function(a,b,c){return new Hd(null,function(){var d=J(b),e=J(c);if(d&&e){var f=N,h;h=K(d);var k=K(e);h=a.a?a.a(h,k):a.call(null,h,k);d=f(h,S.c(a,pc(d),pc(e)))}else d=null;return d},null,null)};S.o=function(a,b,c,d){return new Hd(null,function(){var e=J(b),f=J(c),h=J(d);if(e&&f&&h){var k=N,l;l=K(e);var m=K(f),n=K(h);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=k(l,S.o(a,pc(e),pc(f),pc(h)))}else e=null;return e},null,null)};
S.m=function(a,b,c,d,e){var f=function k(a){return new Hd(null,function(){var b=S.a(J,a);return $d(sd,b)?N(S.a(K,b),k(S.a(pc,b))):null},null,null)};return S.a(function(){return function(b){return G.a(a,b)}}(f),f(Qc.m(e,d,lc([c,b],0))))};S.H=function(a){var b=K(a),c=L(a);a=K(c);var d=L(c),c=K(d),e=L(d),d=K(e),e=L(e);return S.m(b,a,c,d,e)};S.A=4;
function le(a){return new Hd(null,function(b){return function(){return b(1,a)}}(function(a,c){for(;;){var d=J(c);if(0<a&&d){var e=a-1,d=pc(d);a=e;c=d}else return d}}),null,null)}function me(a){return new Hd(null,function(){return N(a,me(a))},null,null)}var ne=function ne(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ne.a(arguments[0],arguments[1]);default:return ne.m(arguments[0],arguments[1],new oc(c.slice(2),0))}};
ne.a=function(a,b){return new Hd(null,function(){var c=J(a),d=J(b);return c&&d?N(K(c),N(K(d),ne.a(pc(c),pc(d)))):null},null,null)};ne.m=function(a,b,c){return new Hd(null,function(){var d=S.a(J,Qc.m(c,b,lc([a],0)));return $d(sd,d)?Pd.a(S.a(K,d),G.a(ne,S.a(pc,d))):null},null,null)};ne.H=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return ne.m(b,a,c)};ne.A=2;oe;
function pe(a,b){return new Hd(null,function(){var c=J(b);if(c){if(id(c)){for(var d=Kb(c),e=Sc(d),f=new Kd(Array(e),0),h=0;;)if(h<e){var k;k=H.a(d,h);k=a.b?a.b(k):a.call(null,k);y(k)&&(k=H.a(d,h),f.add(k));h+=1}else break;return Ld(f.Ea(),pe(a,Lb(c)))}d=K(c);c=pc(c);return y(a.b?a.b(d):a.call(null,d))?N(d,pe(a,c)):pe(a,c)}return null},null,null)}
function re(a){return function c(a){return new Hd(null,function(){var e=N,f;y(md.b?md.b(a):md.call(null,a))?(f=lc([J.b?J.b(a):J.call(null,a)],0),f=G.a(Pd,G.c(S,c,f))):f=null;return e(a,f)},null,null)}(a)}function se(a,b){var c;null!=a?null!=a&&(a.B&4||a.yc)?(c=Na.c(Db,Cb(a),b),c=Eb(c),c=Cc(c,bd(a))):c=Na.c(Sa,a,b):c=Na.c(Qc,qc,b);return c}
function te(a,b){var c;a:{c=ld;for(var d=a,e=J(b);;)if(e)if(null!=d?d.i&256||d.Ob||(d.i?0:B(Za,d)):B(Za,d)){d=I.c(d,K(e),c);if(c===d){c=null;break a}e=L(e)}else{c=null;break a}else{c=d;break a}}return c}
var ue=function ue(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return ue.c(arguments[0],arguments[1],arguments[2]);case 4:return ue.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return ue.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return ue.S(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);default:return ue.m(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5],new oc(c.slice(6),0))}};ue.c=function(a,b,c){return Yc.c(a,b,function(){var d=I.a(a,b);return c.b?c.b(d):c.call(null,d)}())};ue.o=function(a,b,c,d){return Yc.c(a,b,function(){var e=I.a(a,b);return c.a?c.a(e,d):c.call(null,e,d)}())};ue.C=function(a,b,c,d,e){return Yc.c(a,b,function(){var f=I.a(a,b);return c.c?c.c(f,d,e):c.call(null,f,d,e)}())};ue.S=function(a,b,c,d,e,f){return Yc.c(a,b,function(){var h=I.a(a,b);return c.o?c.o(h,d,e,f):c.call(null,h,d,e,f)}())};
ue.m=function(a,b,c,d,e,f,h){return Yc.c(a,b,G.m(c,I.a(a,b),d,e,f,lc([h],0)))};ue.H=function(a){var b=K(a),c=L(a);a=K(c);var d=L(c),c=K(d),e=L(d),d=K(e),f=L(e),e=K(f),h=L(f),f=K(h),h=L(h);return ue.m(b,a,c,d,e,f,h)};ue.A=6;function ve(a,b){this.L=a;this.f=b}function we(a){return new ve(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function xe(a){a=a.j;return 32>a?0:a-1>>>5<<5}
function ye(a,b,c){for(;;){if(0===b)return c;var d=we(a);d.f[0]=c;c=d;b-=5}}var ze=function ze(b,c,d,e){var f=new ve(d.L,Ma(d.f)),h=b.j-1>>>c&31;5===c?f.f[h]=e:(d=d.f[h],b=null!=d?ze(b,c-5,d,e):ye(null,c-5,e),f.f[h]=b);return f};function Ae(a,b){throw Error([F("No item "),F(a),F(" in vector of length "),F(b)].join(""));}function Be(a,b){if(b>=xe(a))return a.I;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function Ce(a,b){return 0<=b&&b<a.j?Be(a,b):Ae(b,a.j)}
var De=function De(b,c,d,e,f){var h=new ve(d.L,Ma(d.f));if(0===c)h.f[e&31]=f;else{var k=e>>>c&31;b=De(b,c-5,d.f[k],e,f);h.f[k]=b}return h};function Ee(a,b,c,d,e,f){this.l=a;this.Bb=b;this.f=c;this.Ia=d;this.start=e;this.end=f}Ee.prototype.ta=function(){return this.l<this.end};Ee.prototype.next=function(){32===this.l-this.Bb&&(this.f=Be(this.Ia,this.l),this.Bb+=32);var a=this.f[this.l&31];this.l+=1;return a};Fe;Ge;He;M;Ie;Je;Ke;
function V(a,b,c,d,e,f){this.s=a;this.j=b;this.shift=c;this.root=d;this.I=e;this.u=f;this.i=167668511;this.B=8196}g=V.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};g.J=function(a,b){return $a.c(this,b,null)};g.G=function(a,b,c){return"number"===typeof b?H.c(this,b,c):c};g.X=function(a,b){return Ce(this,b)[b&31]};g.ya=function(a,b,c){return 0<=b&&b<this.j?Be(this,b)[b&31]:c};
g.Ra=function(a,b,c){if(0<=b&&b<this.j)return xe(this)<=b?(a=Ma(this.I),a[b&31]=c,new V(this.s,this.j,this.shift,this.root,a,null)):new V(this.s,this.j,this.shift,De(this,this.shift,this.root,b,c),this.I,null);if(b===this.j)return Sa(this,c);throw Error([F("Index "),F(b),F(" out of bounds  [0,"),F(this.j),F("]")].join(""));};g.Fa=function(){var a=this.j;return new Ee(0,0,0<Sc(this)?Be(this,0):null,this,0,a)};g.P=function(){return this.s};g.Y=function(){return this.j};
g.ib=function(){return H.a(this,0)};g.jb=function(){return H.a(this,1)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=wc(this)};g.v=function(a,b){if(b instanceof V)if(this.j===Sc(b))for(var c=Sb(this),d=Sb(b);;)if(y(c.ta())){var e=c.next(),f=d.next();if(!cc.a(e,f))return!1}else return!0;else return!1;else return Bc(this,b)};g.Xa=function(){return new He(this.j,this.shift,Fe.b?Fe.b(this.root):Fe.call(null,this.root),Ge.b?Ge.b(this.I):Ge.call(null,this.I))};g.Z=function(){return Cc(Rc,this.s)};
g.$=function(a,b){return Fc(this,b)};g.aa=function(a,b,c){a=0;for(var d=c;;)if(a<this.j){var e=Be(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=e[f],d=b.a?b.a(d,h):b.call(null,d,h);if(Ec(d)){e=d;break a}f+=1}else{e=d;break a}if(Ec(e))return M.b?M.b(e):M.call(null,e);a+=c;d=e}else return d};g.Ma=function(a,b,c){if("number"===typeof b)return kb(this,b,c);throw Error("Vector's key for assoc must be a number.");};
g.U=function(){if(0===this.j)return null;if(32>=this.j)return new oc(this.I,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return Ke.o?Ke.o(this,a,0,0):Ke.call(null,this,a,0,0)};g.R=function(a,b){return new V(b,this.j,this.shift,this.root,this.I,this.u)};
g.V=function(a,b){if(32>this.j-xe(this)){for(var c=this.I.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.I[e],e+=1;else break;d[c]=b;return new V(this.s,this.j+1,this.shift,this.root,d,null)}c=(d=this.j>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=we(null),d.f[0]=this.root,e=ye(null,this.shift,new ve(null,this.I)),d.f[1]=e):d=ze(this,this.shift,this.root,new ve(null,this.I));return new V(this.s,this.j+1,c,d,[b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.X(null,c);case 3:return this.ya(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.X(null,c)};a.c=function(a,c,d){return this.ya(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};g.b=function(a){return this.X(null,a)};g.a=function(a,b){return this.ya(null,a,b)};
var W=new ve(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Rc=new V(null,0,5,W,[],xc);V.prototype[Ka]=function(){return sc(this)};function rd(a){if(Ga(a))a:{var b=a.length;if(32>b)a=new V(null,b,5,W,a,null);else for(var c=32,d=(new V(null,32,5,W,a.slice(0,32),null)).Xa(null);;)if(c<b)var e=c+1,d=Qd.a(d,a[c]),c=e;else{a=Eb(d);break a}}else a=Eb(Na.c(Db,Cb(Rc),a));return a}Le;
function hd(a,b,c,d,e,f){this.za=a;this.node=b;this.l=c;this.ca=d;this.s=e;this.u=f;this.i=32375020;this.B=1536}g=hd.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};g.P=function(){return this.s};g.ra=function(){if(this.ca+1<this.node.length){var a;a=this.za;var b=this.node,c=this.l,d=this.ca+1;a=Ke.o?Ke.o(a,b,c,d):Ke.call(null,a,b,c,d);return null==a?null:a}return Mb(this)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=wc(this)};
g.v=function(a,b){return Bc(this,b)};g.Z=function(){return Cc(Rc,this.s)};g.$=function(a,b){var c;c=this.za;var d=this.l+this.ca,e=Sc(this.za);c=Le.c?Le.c(c,d,e):Le.call(null,c,d,e);return Fc(c,b)};g.aa=function(a,b,c){a=this.za;var d=this.l+this.ca,e=Sc(this.za);a=Le.c?Le.c(a,d,e):Le.call(null,a,d,e);return Gc(a,b,c)};g.ba=function(){return this.node[this.ca]};
g.sa=function(){if(this.ca+1<this.node.length){var a;a=this.za;var b=this.node,c=this.l,d=this.ca+1;a=Ke.o?Ke.o(a,b,c,d):Ke.call(null,a,b,c,d);return null==a?qc:a}return Lb(this)};g.U=function(){return this};g.Fb=function(){var a=this.node;return new Jd(a,this.ca,a.length)};g.Gb=function(){var a=this.l+this.node.length;if(a<Pa(this.za)){var b=this.za,c=Be(this.za,a);return Ke.o?Ke.o(b,c,a,0):Ke.call(null,b,c,a,0)}return qc};
g.R=function(a,b){return Ke.C?Ke.C(this.za,this.node,this.l,this.ca,b):Ke.call(null,this.za,this.node,this.l,this.ca,b)};g.V=function(a,b){return N(b,this)};g.Eb=function(){var a=this.l+this.node.length;if(a<Pa(this.za)){var b=this.za,c=Be(this.za,a);return Ke.o?Ke.o(b,c,a,0):Ke.call(null,b,c,a,0)}return null};hd.prototype[Ka]=function(){return sc(this)};
var Ke=function Ke(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Ke.c(arguments[0],arguments[1],arguments[2]);case 4:return Ke.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Ke.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};Ke.c=function(a,b,c){return new hd(a,Ce(a,b),b,c,null,null)};
Ke.o=function(a,b,c,d){return new hd(a,b,c,d,null,null)};Ke.C=function(a,b,c,d,e){return new hd(a,b,c,d,e,null)};Ke.A=5;Me;function Ne(a,b,c,d,e){this.s=a;this.Ia=b;this.start=c;this.end=d;this.u=e;this.i=167666463;this.B=8192}g=Ne.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};g.J=function(a,b){return $a.c(this,b,null)};g.G=function(a,b,c){return"number"===typeof b?H.c(this,b,c):c};
g.X=function(a,b){return 0>b||this.end<=this.start+b?Ae(b,this.end-this.start):H.a(this.Ia,this.start+b)};g.ya=function(a,b,c){return 0>b||this.end<=this.start+b?c:H.c(this.Ia,this.start+b,c)};g.Ra=function(a,b,c){var d=this.start+b;a=this.s;c=Yc.c(this.Ia,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Me.C?Me.C(a,c,b,d,null):Me.call(null,a,c,b,d,null)};g.P=function(){return this.s};g.Y=function(){return this.end-this.start};g.N=function(){var a=this.u;return null!=a?a:this.u=a=wc(this)};
g.v=function(a,b){return Bc(this,b)};g.Z=function(){return Cc(Rc,this.s)};g.$=function(a,b){return Fc(this,b)};g.aa=function(a,b,c){return Gc(this,b,c)};g.Ma=function(a,b,c){if("number"===typeof b)return kb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};g.U=function(){var a=this;return function(b){return function d(e){return e===a.end?null:N(H.a(a.Ia,e),new Hd(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
g.R=function(a,b){return Me.C?Me.C(b,this.Ia,this.start,this.end,this.u):Me.call(null,b,this.Ia,this.start,this.end,this.u)};g.V=function(a,b){var c=this.s,d=kb(this.Ia,this.end,b),e=this.start,f=this.end+1;return Me.C?Me.C(c,d,e,f,null):Me.call(null,c,d,e,f,null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.X(null,c);case 3:return this.ya(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.X(null,c)};a.c=function(a,c,d){return this.ya(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};g.b=function(a){return this.X(null,a)};g.a=function(a,b){return this.ya(null,a,b)};Ne.prototype[Ka]=function(){return sc(this)};
function Me(a,b,c,d,e){for(;;)if(b instanceof Ne)c=b.start+c,d=b.start+d,b=b.Ia;else{var f=Sc(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Ne(a,b,c,d,e)}}var Le=function Le(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Le.a(arguments[0],arguments[1]);case 3:return Le.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};
Le.a=function(a,b){return Le.c(a,b,Sc(a))};Le.c=function(a,b,c){return Me(null,a,b,c,null)};Le.A=3;function Oe(a,b){return a===b.L?b:new ve(a,Ma(b.f))}function Fe(a){return new ve({},Ma(a.f))}function Ge(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];kd(a,0,b,0,a.length);return b}
var Pe=function Pe(b,c,d,e){d=Oe(b.root.L,d);var f=b.j-1>>>c&31;if(5===c)b=e;else{var h=d.f[f];b=null!=h?Pe(b,c-5,h,e):ye(b.root.L,c-5,e)}d.f[f]=b;return d};function He(a,b,c,d){this.j=a;this.shift=b;this.root=c;this.I=d;this.B=88;this.i=275}g=He.prototype;
g.nb=function(a,b){if(this.root.L){if(32>this.j-xe(this))this.I[this.j&31]=b;else{var c=new ve(this.root.L,this.I),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.I=d;if(this.j>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=ye(this.root.L,this.shift,c);this.root=new ve(this.root.L,d);this.shift=e}else this.root=Pe(this,this.shift,this.root,c)}this.j+=1;return this}throw Error("conj! after persistent!");};g.ob=function(){if(this.root.L){this.root.L=null;var a=this.j-xe(this),b=Array(a);kd(this.I,0,b,0,a);return new V(null,this.j,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
g.mb=function(a,b,c){if("number"===typeof b)return Gb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
g.Pb=function(a,b,c){var d=this;if(d.root.L){if(0<=b&&b<d.j)return xe(this)<=b?d.I[b&31]=c:(a=function(){return function f(a,k){var l=Oe(d.root.L,k);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.j)return Db(this,c);throw Error([F("Index "),F(b),F(" out of bounds for TransientVector of length"),F(d.j)].join(""));}throw Error("assoc! after persistent!");};
g.Y=function(){if(this.root.L)return this.j;throw Error("count after persistent!");};g.X=function(a,b){if(this.root.L)return Ce(this,b)[b&31];throw Error("nth after persistent!");};g.ya=function(a,b,c){return 0<=b&&b<this.j?H.a(this,b):c};g.J=function(a,b){return $a.c(this,b,null)};g.G=function(a,b,c){return"number"===typeof b?H.c(this,b,c):c};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.G(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.G(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};g.b=function(a){return this.J(null,a)};g.a=function(a,b){return this.G(null,a,b)};function Qe(){this.i=2097152;this.B=0}
Qe.prototype.equiv=function(a){return this.v(null,a)};Qe.prototype.v=function(){return!1};var Re=new Qe;function Se(a,b){return nd(ed(b)?Sc(a)===Sc(b)?$d(sd,S.a(function(a){return cc.a(I.c(b,K(a),Re),K(L(a)))},a)):null:null)}function Te(a,b,c,d,e){this.l=a;this.tc=b;this.Kb=c;this.nc=d;this.Ub=e}Te.prototype.ta=function(){var a=this.l<this.Kb;return a?a:this.Ub.ta()};Te.prototype.next=function(){if(this.l<this.Kb){var a=Vc(this.nc,this.l);this.l+=1;return new V(null,2,5,W,[a,$a.a(this.tc,a)],null)}return this.Ub.next()};
Te.prototype.remove=function(){return Error("Unsupported operation")};function Ue(a){this.D=a}Ue.prototype.next=function(){if(null!=this.D){var a=K(this.D),b=Wc(a,0),a=Wc(a,1);this.D=L(this.D);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Ve(a){return new Ue(J(a))}function We(a){this.D=a}We.prototype.next=function(){if(null!=this.D){var a=K(this.D);this.D=L(this.D);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Xe(a,b){var c;if(b instanceof A)a:{c=a.length;for(var d=b.Aa,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof A&&d===a[e].Aa){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof bc)a:for(c=a.length,d=b.Ha,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof bc&&d===a[e].Ha){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(cc.a(b,a[d])){c=d;break a}d+=2}return c}Ye;function Ze(a,b,c){this.f=a;this.l=b;this.wa=c;this.i=32374990;this.B=0}g=Ze.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};g.P=function(){return this.wa};g.ra=function(){return this.l<this.f.length-2?new Ze(this.f,this.l+2,this.wa):null};g.Y=function(){return(this.f.length-this.l)/2};g.N=function(){return wc(this)};g.v=function(a,b){return Bc(this,b)};
g.Z=function(){return Cc(qc,this.wa)};g.$=function(a,b){return Q.a(b,this)};g.aa=function(a,b,c){return Q.c(b,c,this)};g.ba=function(){return new V(null,2,5,W,[this.f[this.l],this.f[this.l+1]],null)};g.sa=function(){return this.l<this.f.length-2?new Ze(this.f,this.l+2,this.wa):qc};g.U=function(){return this};g.R=function(a,b){return new Ze(this.f,this.l,b)};g.V=function(a,b){return N(b,this)};Ze.prototype[Ka]=function(){return sc(this)};$e;af;function bf(a,b,c){this.f=a;this.l=b;this.j=c}
bf.prototype.ta=function(){return this.l<this.j};bf.prototype.next=function(){var a=new V(null,2,5,W,[this.f[this.l],this.f[this.l+1]],null);this.l+=2;return a};function va(a,b,c,d){this.s=a;this.j=b;this.f=c;this.u=d;this.i=16647951;this.B=8196}g=va.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return sc($e.b?$e.b(this):$e.call(null,this))};g.entries=function(){return Ve(J(this))};
g.values=function(){return sc(af.b?af.b(this):af.call(null,this))};g.has=function(a){return od(this,a)};g.get=function(a,b){return this.G(null,a,b)};g.forEach=function(a){for(var b=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.X(null,e),h=Wc(f,0),f=Wc(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=J(b))id(b)?(c=Kb(b),b=Lb(b),h=c,d=Sc(c),c=h):(c=K(b),h=Wc(c,0),f=Wc(c,1),a.a?a.a(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return $a.c(this,b,null)};
g.G=function(a,b,c){a=Xe(this.f,b);return-1===a?c:this.f[a+1]};g.Fa=function(){return new bf(this.f,0,2*this.j)};g.P=function(){return this.s};g.Y=function(){return this.j};g.N=function(){var a=this.u;return null!=a?a:this.u=a=yc(this)};g.v=function(a,b){if(null!=b&&(b.i&1024||b.$b)){var c=this.f.length;if(this.j===b.Y(null))for(var d=0;;)if(d<c){var e=b.G(null,this.f[d],ld);if(e!==ld)if(cc.a(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Se(this,b)};
g.Xa=function(){return new Ye({},this.f.length,Ma(this.f))};g.Z=function(){return ob(Yd,this.s)};g.$=function(a,b){return Q.a(b,this)};g.aa=function(a,b,c){return Q.c(b,c,this)};g.xb=function(a,b){if(0<=Xe(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return Qa(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new va(this.s,this.j-1,d,null);cc.a(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
g.Ma=function(a,b,c){a=Xe(this.f,b);if(-1===a){if(this.j<cf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new va(this.s,this.j+1,e,null)}return ob(bb(se(Zc,this),b,c),this.s)}if(c===this.f[a+1])return this;b=Ma(this.f);b[a+1]=c;return new va(this.s,this.j,b,null)};g.Db=function(a,b){return-1!==Xe(this.f,b)};g.U=function(){var a=this.f;return 0<=a.length-2?new Ze(a,0,null):null};g.R=function(a,b){return new va(b,this.j,this.f,this.u)};
g.V=function(a,b){if(fd(b))return bb(this,H.a(b,0),H.a(b,1));for(var c=this,d=J(b);;){if(null==d)return c;var e=K(d);if(fd(e))c=bb(c,H.a(e,0),H.a(e,1)),d=L(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.G(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.G(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};g.b=function(a){return this.J(null,a)};g.a=function(a,b){return this.G(null,a,b)};var Yd=new va(null,0,[],zc),cf=8;va.prototype[Ka]=function(){return sc(this)};
df;function Ye(a,b,c){this.Ya=a;this.Ua=b;this.f=c;this.i=258;this.B=56}g=Ye.prototype;g.Y=function(){if(y(this.Ya))return ud(this.Ua);throw Error("count after persistent!");};g.J=function(a,b){return $a.c(this,b,null)};g.G=function(a,b,c){if(y(this.Ya))return a=Xe(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
g.nb=function(a,b){if(y(this.Ya)){if(null!=b?b.i&2048||b.ac||(b.i?0:B(eb,b)):B(eb,b))return Fb(this,yd.b?yd.b(b):yd.call(null,b),zd.b?zd.b(b):zd.call(null,b));for(var c=J(b),d=this;;){var e=K(c);if(y(e))c=L(c),d=Fb(d,yd.b?yd.b(e):yd.call(null,e),zd.b?zd.b(e):zd.call(null,e));else return d}}else throw Error("conj! after persistent!");};g.ob=function(){if(y(this.Ya))return this.Ya=!1,new va(null,ud(this.Ua),this.f,null);throw Error("persistent! called twice");};
g.mb=function(a,b,c){if(y(this.Ya)){a=Xe(this.f,b);if(-1===a){if(this.Ua+2<=2*cf)return this.Ua+=2,this.f.push(b),this.f.push(c),this;a=df.a?df.a(this.Ua,this.f):df.call(null,this.Ua,this.f);return Fb(a,b,c)}c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};ef;Xc;function df(a,b){for(var c=Cb(Zc),d=0;;)if(d<a)c=Fb(c,b[d],b[d+1]),d+=2;else return c}function ff(){this.M=!1}gf;hf;ge;jf;de;M;function kf(a,b){return a===b?!0:Fd(a,b)?!0:cc.a(a,b)}
function lf(a,b,c){a=Ma(a);a[b]=c;return a}function mf(a,b){var c=Array(a.length-2);kd(a,0,c,0,2*b);kd(a,2*(b+1),c,2*b,c.length-2*b);return c}function nf(a,b,c,d){a=a.Sa(b);a.f[c]=d;return a}of;function pf(a,b,c,d){this.f=a;this.l=b;this.ub=c;this.Da=d}pf.prototype.advance=function(){for(var a=this.f.length;;)if(this.l<a){var b=this.f[this.l],c=this.f[this.l+1];null!=b?b=this.ub=new V(null,2,5,W,[b,c],null):null!=c?(b=Sb(c),b=b.ta()?this.Da=b:!1):b=!1;this.l+=2;if(b)return!0}else return!1};
pf.prototype.ta=function(){var a=null!=this.ub;return a?a:(a=null!=this.Da)?a:this.advance()};pf.prototype.next=function(){if(null!=this.ub){var a=this.ub;this.ub=null;return a}if(null!=this.Da)return a=this.Da.next(),this.Da.ta()||(this.Da=null),a;if(this.advance())return this.next();throw Error("No such element");};pf.prototype.remove=function(){return Error("Unsupported operation")};function qf(a,b,c){this.L=a;this.O=b;this.f=c}g=qf.prototype;
g.Sa=function(a){if(a===this.L)return this;var b=vd(this.O),c=Array(0>b?4:2*(b+1));kd(this.f,0,c,0,2*b);return new qf(a,this.O,c)};g.rb=function(){return gf.b?gf.b(this.f):gf.call(null,this.f)};g.Na=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.O&e))return d;var f=vd(this.O&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.Na(a+5,b,c,d):kf(c,e)?f:d};
g.Ca=function(a,b,c,d,e,f){var h=1<<(c>>>b&31),k=vd(this.O&h-1);if(0===(this.O&h)){var l=vd(this.O);if(2*l<this.f.length){a=this.Sa(a);b=a.f;f.M=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.O|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=rf.Ca(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.O>>>d&1)&&(k[d]=null!=this.f[e]?rf.Ca(a,b+5,hc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new of(a,l+1,k)}b=Array(2*(l+4));kd(this.f,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;kd(this.f,2*k,b,2*(k+1),2*(l-k));f.M=!0;a=this.Sa(a);a.f=b;a.O|=h;return a}l=this.f[2*k];h=this.f[2*k+1];if(null==l)return l=h.Ca(a,b+5,c,d,e,f),l===h?this:nf(this,a,2*k+1,l);if(kf(d,l))return e===h?this:nf(this,a,2*k+1,e);f.M=!0;f=b+5;d=jf.W?jf.W(a,f,l,h,c,d,e):jf.call(null,a,f,l,h,c,d,e);e=2*k;
k=2*k+1;a=this.Sa(a);a.f[e]=null;a.f[k]=d;return a};
g.Ba=function(a,b,c,d,e){var f=1<<(b>>>a&31),h=vd(this.O&f-1);if(0===(this.O&f)){var k=vd(this.O);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=rf.Ba(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.O>>>c&1)&&(h[c]=null!=this.f[d]?rf.Ba(a+5,hc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new of(null,k+1,h)}a=Array(2*(k+1));kd(this.f,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;kd(this.f,2*h,a,2*(h+1),2*(k-h));e.M=!0;return new qf(null,this.O|f,a)}var l=this.f[2*h],f=this.f[2*h+1];if(null==l)return k=f.Ba(a+5,b,c,d,e),k===f?this:new qf(null,this.O,lf(this.f,2*h+1,k));if(kf(c,l))return d===f?this:new qf(null,this.O,lf(this.f,2*h+1,d));e.M=!0;e=this.O;k=this.f;a+=5;a=jf.S?jf.S(a,l,f,b,c,d):jf.call(null,a,l,f,b,c,d);c=2*h;h=2*h+1;d=Ma(k);d[c]=null;d[h]=a;return new qf(null,e,d)};
g.sb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.O&d))return this;var e=vd(this.O&d-1),f=this.f[2*e],h=this.f[2*e+1];return null==f?(a=h.sb(a+5,b,c),a===h?this:null!=a?new qf(null,this.O,lf(this.f,2*e+1,a)):this.O===d?null:new qf(null,this.O^d,mf(this.f,e))):kf(c,f)?new qf(null,this.O^d,mf(this.f,e)):this};g.Fa=function(){return new pf(this.f,0,null,null)};var rf=new qf(null,0,[]);function sf(a,b,c){this.f=a;this.l=b;this.Da=c}
sf.prototype.ta=function(){for(var a=this.f.length;;){if(null!=this.Da&&this.Da.ta())return!0;if(this.l<a){var b=this.f[this.l];this.l+=1;null!=b&&(this.Da=Sb(b))}else return!1}};sf.prototype.next=function(){if(this.ta())return this.Da.next();throw Error("No such element");};sf.prototype.remove=function(){return Error("Unsupported operation")};function of(a,b,c){this.L=a;this.j=b;this.f=c}g=of.prototype;g.Sa=function(a){return a===this.L?this:new of(a,this.j,Ma(this.f))};
g.rb=function(){return hf.b?hf.b(this.f):hf.call(null,this.f)};g.Na=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.Na(a+5,b,c,d):d};g.Ca=function(a,b,c,d,e,f){var h=c>>>b&31,k=this.f[h];if(null==k)return a=nf(this,a,h,rf.Ca(a,b+5,c,d,e,f)),a.j+=1,a;b=k.Ca(a,b+5,c,d,e,f);return b===k?this:nf(this,a,h,b)};
g.Ba=function(a,b,c,d,e){var f=b>>>a&31,h=this.f[f];if(null==h)return new of(null,this.j+1,lf(this.f,f,rf.Ba(a+5,b,c,d,e)));a=h.Ba(a+5,b,c,d,e);return a===h?this:new of(null,this.j,lf(this.f,f,a))};
g.sb=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.sb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.j)a:{e=this.f;a=e.length;b=Array(2*(this.j-1));c=0;for(var f=1,h=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,h|=1<<c),c+=1;else{d=new qf(null,h,b);break a}}else d=new of(null,this.j-1,lf(this.f,d,a));else d=new of(null,this.j,lf(this.f,d,a));return d}return this};g.Fa=function(){return new sf(this.f,0,null)};
function tf(a,b,c){b*=2;for(var d=0;;)if(d<b){if(kf(c,a[d]))return d;d+=2}else return-1}function uf(a,b,c,d){this.L=a;this.Ka=b;this.j=c;this.f=d}g=uf.prototype;g.Sa=function(a){if(a===this.L)return this;var b=Array(2*(this.j+1));kd(this.f,0,b,0,2*this.j);return new uf(a,this.Ka,this.j,b)};g.rb=function(){return gf.b?gf.b(this.f):gf.call(null,this.f)};g.Na=function(a,b,c,d){a=tf(this.f,this.j,c);return 0>a?d:kf(c,this.f[a])?this.f[a+1]:d};
g.Ca=function(a,b,c,d,e,f){if(c===this.Ka){b=tf(this.f,this.j,d);if(-1===b){if(this.f.length>2*this.j)return b=2*this.j,c=2*this.j+1,a=this.Sa(a),a.f[b]=d,a.f[c]=e,f.M=!0,a.j+=1,a;c=this.f.length;b=Array(c+2);kd(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.M=!0;d=this.j+1;a===this.L?(this.f=b,this.j=d,a=this):a=new uf(this.L,this.Ka,d,b);return a}return this.f[b+1]===e?this:nf(this,a,b+1,e)}return(new qf(a,1<<(this.Ka>>>b&31),[null,this,null,null])).Ca(a,b,c,d,e,f)};
g.Ba=function(a,b,c,d,e){return b===this.Ka?(a=tf(this.f,this.j,c),-1===a?(a=2*this.j,b=Array(a+2),kd(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.M=!0,new uf(null,this.Ka,this.j+1,b)):cc.a(this.f[a],d)?this:new uf(null,this.Ka,this.j,lf(this.f,a+1,d))):(new qf(null,1<<(this.Ka>>>a&31),[null,this])).Ba(a,b,c,d,e)};g.sb=function(a,b,c){a=tf(this.f,this.j,c);return-1===a?this:1===this.j?null:new uf(null,this.Ka,this.j-1,mf(this.f,ud(a)))};g.Fa=function(){return new pf(this.f,0,null,null)};
var jf=function jf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return jf.S(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return jf.W(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};
jf.S=function(a,b,c,d,e,f){var h=hc(b);if(h===d)return new uf(null,h,2,[b,c,e,f]);var k=new ff;return rf.Ba(a,h,b,c,k).Ba(a,d,e,f,k)};jf.W=function(a,b,c,d,e,f,h){var k=hc(c);if(k===e)return new uf(null,k,2,[c,d,f,h]);var l=new ff;return rf.Ca(a,b,k,c,d,l).Ca(a,b,e,f,h,l)};jf.A=7;function vf(a,b,c,d,e){this.s=a;this.Oa=b;this.l=c;this.D=d;this.u=e;this.i=32374860;this.B=0}g=vf.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};g.P=function(){return this.s};
g.N=function(){var a=this.u;return null!=a?a:this.u=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(){return Cc(qc,this.s)};g.$=function(a,b){return Q.a(b,this)};g.aa=function(a,b,c){return Q.c(b,c,this)};g.ba=function(){return null==this.D?new V(null,2,5,W,[this.Oa[this.l],this.Oa[this.l+1]],null):K(this.D)};
g.sa=function(){if(null==this.D){var a=this.Oa,b=this.l+2;return gf.c?gf.c(a,b,null):gf.call(null,a,b,null)}var a=this.Oa,b=this.l,c=L(this.D);return gf.c?gf.c(a,b,c):gf.call(null,a,b,c)};g.U=function(){return this};g.R=function(a,b){return new vf(b,this.Oa,this.l,this.D,this.u)};g.V=function(a,b){return N(b,this)};vf.prototype[Ka]=function(){return sc(this)};
var gf=function gf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return gf.b(arguments[0]);case 3:return gf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};gf.b=function(a){return gf.c(a,0,null)};
gf.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new vf(null,a,b,null,null);var d=a[b+1];if(y(d)&&(d=d.rb(),y(d)))return new vf(null,a,b+2,d,null);b+=2}else return null;else return new vf(null,a,b,c,null)};gf.A=3;function wf(a,b,c,d,e){this.s=a;this.Oa=b;this.l=c;this.D=d;this.u=e;this.i=32374860;this.B=0}g=wf.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};g.P=function(){return this.s};
g.N=function(){var a=this.u;return null!=a?a:this.u=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(){return Cc(qc,this.s)};g.$=function(a,b){return Q.a(b,this)};g.aa=function(a,b,c){return Q.c(b,c,this)};g.ba=function(){return K(this.D)};g.sa=function(){var a=this.Oa,b=this.l,c=L(this.D);return hf.o?hf.o(null,a,b,c):hf.call(null,null,a,b,c)};g.U=function(){return this};g.R=function(a,b){return new wf(b,this.Oa,this.l,this.D,this.u)};g.V=function(a,b){return N(b,this)};
wf.prototype[Ka]=function(){return sc(this)};var hf=function hf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return hf.b(arguments[0]);case 4:return hf.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};hf.b=function(a){return hf.o(null,a,0,null)};
hf.o=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(y(e)&&(e=e.rb(),y(e)))return new wf(a,b,c+1,e,null);c+=1}else return null;else return new wf(a,b,c,d,null)};hf.A=4;ef;function xf(a,b,c){this.xa=a;this.Vb=b;this.Jb=c}xf.prototype.ta=function(){return this.Jb&&this.Vb.ta()};xf.prototype.next=function(){if(this.Jb)return this.Vb.next();this.Jb=!0;return this.xa};xf.prototype.remove=function(){return Error("Unsupported operation")};
function Xc(a,b,c,d,e,f){this.s=a;this.j=b;this.root=c;this.ua=d;this.xa=e;this.u=f;this.i=16123663;this.B=8196}g=Xc.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return sc($e.b?$e.b(this):$e.call(null,this))};g.entries=function(){return Ve(J(this))};g.values=function(){return sc(af.b?af.b(this):af.call(null,this))};g.has=function(a){return od(this,a)};g.get=function(a,b){return this.G(null,a,b)};
g.forEach=function(a){for(var b=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.X(null,e),h=Wc(f,0),f=Wc(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=J(b))id(b)?(c=Kb(b),b=Lb(b),h=c,d=Sc(c),c=h):(c=K(b),h=Wc(c,0),f=Wc(c,1),a.a?a.a(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return $a.c(this,b,null)};g.G=function(a,b,c){return null==b?this.ua?this.xa:c:null==this.root?c:this.root.Na(0,hc(b),b,c)};
g.Fa=function(){var a=this.root?Sb(this.root):Td;return this.ua?new xf(this.xa,a,!1):a};g.P=function(){return this.s};g.Y=function(){return this.j};g.N=function(){var a=this.u;return null!=a?a:this.u=a=yc(this)};g.v=function(a,b){return Se(this,b)};g.Xa=function(){return new ef({},this.root,this.j,this.ua,this.xa)};g.Z=function(){return ob(Zc,this.s)};
g.xb=function(a,b){if(null==b)return this.ua?new Xc(this.s,this.j-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.sb(0,hc(b),b);return c===this.root?this:new Xc(this.s,this.j-1,c,this.ua,this.xa,null)};g.Ma=function(a,b,c){if(null==b)return this.ua&&c===this.xa?this:new Xc(this.s,this.ua?this.j:this.j+1,this.root,!0,c,null);a=new ff;b=(null==this.root?rf:this.root).Ba(0,hc(b),b,c,a);return b===this.root?this:new Xc(this.s,a.M?this.j+1:this.j,b,this.ua,this.xa,null)};
g.Db=function(a,b){return null==b?this.ua:null==this.root?!1:this.root.Na(0,hc(b),b,ld)!==ld};g.U=function(){if(0<this.j){var a=null!=this.root?this.root.rb():null;return this.ua?N(new V(null,2,5,W,[null,this.xa],null),a):a}return null};g.R=function(a,b){return new Xc(b,this.j,this.root,this.ua,this.xa,this.u)};
g.V=function(a,b){if(fd(b))return bb(this,H.a(b,0),H.a(b,1));for(var c=this,d=J(b);;){if(null==d)return c;var e=K(d);if(fd(e))c=bb(c,H.a(e,0),H.a(e,1)),d=L(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.G(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.G(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};g.b=function(a){return this.J(null,a)};g.a=function(a,b){return this.G(null,a,b)};var Zc=new Xc(null,0,null,!1,null,zc);Xc.prototype[Ka]=function(){return sc(this)};
function ef(a,b,c,d,e){this.L=a;this.root=b;this.count=c;this.ua=d;this.xa=e;this.i=258;this.B=56}function yf(a,b,c){if(a.L){if(null==b)a.xa!==c&&(a.xa=c),a.ua||(a.count+=1,a.ua=!0);else{var d=new ff;b=(null==a.root?rf:a.root).Ca(a.L,0,hc(b),b,c,d);b!==a.root&&(a.root=b);d.M&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}g=ef.prototype;g.Y=function(){if(this.L)return this.count;throw Error("count after persistent!");};
g.J=function(a,b){return null==b?this.ua?this.xa:null:null==this.root?null:this.root.Na(0,hc(b),b)};g.G=function(a,b,c){return null==b?this.ua?this.xa:c:null==this.root?c:this.root.Na(0,hc(b),b,c)};
g.nb=function(a,b){var c;a:if(this.L)if(null!=b?b.i&2048||b.ac||(b.i?0:B(eb,b)):B(eb,b))c=yf(this,yd.b?yd.b(b):yd.call(null,b),zd.b?zd.b(b):zd.call(null,b));else{c=J(b);for(var d=this;;){var e=K(c);if(y(e))c=L(c),d=yf(d,yd.b?yd.b(e):yd.call(null,e),zd.b?zd.b(e):zd.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};g.ob=function(){var a;if(this.L)this.L=null,a=new Xc(null,this.count,this.root,this.ua,this.xa,null);else throw Error("persistent! called twice");return a};
g.mb=function(a,b,c){return yf(this,b,c)};zf;Af;function Af(a,b,c,d,e){this.key=a;this.M=b;this.left=c;this.right=d;this.u=e;this.i=32402207;this.B=0}g=Af.prototype;g.replace=function(a,b,c,d){return new Af(a,b,c,d,null)};g.J=function(a,b){return H.c(this,b,null)};g.G=function(a,b,c){return H.c(this,b,c)};g.X=function(a,b){return 0===b?this.key:1===b?this.M:null};g.ya=function(a,b,c){return 0===b?this.key:1===b?this.M:c};
g.Ra=function(a,b,c){return(new V(null,2,5,W,[this.key,this.M],null)).Ra(null,b,c)};g.P=function(){return null};g.Y=function(){return 2};g.ib=function(){return this.key};g.jb=function(){return this.M};g.N=function(){var a=this.u;return null!=a?a:this.u=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(){return Rc};g.$=function(a,b){return Fc(this,b)};g.aa=function(a,b,c){return Gc(this,b,c)};g.Ma=function(a,b,c){return Yc.c(new V(null,2,5,W,[this.key,this.M],null),b,c)};
g.U=function(){return Sa(Sa(qc,this.M),this.key)};g.R=function(a,b){return Cc(new V(null,2,5,W,[this.key,this.M],null),b)};g.V=function(a,b){return new V(null,3,5,W,[this.key,this.M,b],null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.G(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.G(null,c,d)};return a}();
g.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};g.b=function(a){return this.J(null,a)};g.a=function(a,b){return this.G(null,a,b)};Af.prototype[Ka]=function(){return sc(this)};function zf(a,b,c,d,e){this.key=a;this.M=b;this.left=c;this.right=d;this.u=e;this.i=32402207;this.B=0}g=zf.prototype;g.replace=function(a,b,c,d){return new zf(a,b,c,d,null)};g.J=function(a,b){return H.c(this,b,null)};g.G=function(a,b,c){return H.c(this,b,c)};
g.X=function(a,b){return 0===b?this.key:1===b?this.M:null};g.ya=function(a,b,c){return 0===b?this.key:1===b?this.M:c};g.Ra=function(a,b,c){return(new V(null,2,5,W,[this.key,this.M],null)).Ra(null,b,c)};g.P=function(){return null};g.Y=function(){return 2};g.ib=function(){return this.key};g.jb=function(){return this.M};g.N=function(){var a=this.u;return null!=a?a:this.u=a=wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(){return Rc};g.$=function(a,b){return Fc(this,b)};
g.aa=function(a,b,c){return Gc(this,b,c)};g.Ma=function(a,b,c){return Yc.c(new V(null,2,5,W,[this.key,this.M],null),b,c)};g.U=function(){return Sa(Sa(qc,this.M),this.key)};g.R=function(a,b){return Cc(new V(null,2,5,W,[this.key,this.M],null),b)};g.V=function(a,b){return new V(null,3,5,W,[this.key,this.M,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.G(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.G(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};g.b=function(a){return this.J(null,a)};g.a=function(a,b){return this.G(null,a,b)};zf.prototype[Ka]=function(){return sc(this)};yd;
var Ac=function Ac(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ac.m(0<c.length?new oc(c.slice(0),0):null)};Ac.m=function(a){for(var b=J(a),c=Cb(Zc);;)if(b){a=L(L(b));var d=K(b),b=K(L(b)),c=Fb(c,d,b),b=a}else return Eb(c)};Ac.A=0;Ac.H=function(a){return Ac.m(J(a))};function Bf(a,b){this.F=a;this.wa=b;this.i=32374988;this.B=0}g=Bf.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};g.P=function(){return this.wa};
g.ra=function(){var a=(null!=this.F?this.F.i&128||this.F.yb||(this.F.i?0:B(Ya,this.F)):B(Ya,this.F))?this.F.ra(null):L(this.F);return null==a?null:new Bf(a,this.wa)};g.N=function(){return wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(){return Cc(qc,this.wa)};g.$=function(a,b){return Q.a(b,this)};g.aa=function(a,b,c){return Q.c(b,c,this)};g.ba=function(){return this.F.ba(null).ib(null)};
g.sa=function(){var a=(null!=this.F?this.F.i&128||this.F.yb||(this.F.i?0:B(Ya,this.F)):B(Ya,this.F))?this.F.ra(null):L(this.F);return null!=a?new Bf(a,this.wa):qc};g.U=function(){return this};g.R=function(a,b){return new Bf(this.F,b)};g.V=function(a,b){return N(b,this)};Bf.prototype[Ka]=function(){return sc(this)};function $e(a){return(a=J(a))?new Bf(a,null):null}function yd(a){return fb(a)}function Cf(a,b){this.F=a;this.wa=b;this.i=32374988;this.B=0}g=Cf.prototype;g.toString=function(){return Ub(this)};
g.equiv=function(a){return this.v(null,a)};g.P=function(){return this.wa};g.ra=function(){var a=(null!=this.F?this.F.i&128||this.F.yb||(this.F.i?0:B(Ya,this.F)):B(Ya,this.F))?this.F.ra(null):L(this.F);return null==a?null:new Cf(a,this.wa)};g.N=function(){return wc(this)};g.v=function(a,b){return Bc(this,b)};g.Z=function(){return Cc(qc,this.wa)};g.$=function(a,b){return Q.a(b,this)};g.aa=function(a,b,c){return Q.c(b,c,this)};g.ba=function(){return this.F.ba(null).jb(null)};
g.sa=function(){var a=(null!=this.F?this.F.i&128||this.F.yb||(this.F.i?0:B(Ya,this.F)):B(Ya,this.F))?this.F.ra(null):L(this.F);return null!=a?new Cf(a,this.wa):qc};g.U=function(){return this};g.R=function(a,b){return new Cf(this.F,b)};g.V=function(a,b){return N(b,this)};Cf.prototype[Ka]=function(){return sc(this)};function af(a){return(a=J(a))?new Cf(a,null):null}function zd(a){return hb(a)}Df;function Ef(a){this.ab=a}Ef.prototype.ta=function(){return this.ab.ta()};
Ef.prototype.next=function(){if(this.ab.ta())return this.ab.next().I[0];throw Error("No such element");};Ef.prototype.remove=function(){return Error("Unsupported operation")};function Ff(a,b,c){this.s=a;this.Ta=b;this.u=c;this.i=15077647;this.B=8196}g=Ff.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return sc(J(this))};g.entries=function(){var a=J(this);return new We(J(a))};g.values=function(){return sc(J(this))};
g.has=function(a){return od(this,a)};g.forEach=function(a){for(var b=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.X(null,e),h=Wc(f,0),f=Wc(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=J(b))id(b)?(c=Kb(b),b=Lb(b),h=c,d=Sc(c),c=h):(c=K(b),h=Wc(c,0),f=Wc(c,1),a.a?a.a(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return $a.c(this,b,null)};g.G=function(a,b,c){return ab(this.Ta,b)?b:c};g.Fa=function(){return new Ef(Sb(this.Ta))};g.P=function(){return this.s};g.Y=function(){return Pa(this.Ta)};
g.N=function(){var a=this.u;return null!=a?a:this.u=a=yc(this)};g.v=function(a,b){return cd(b)&&Sc(this)===Sc(b)&&$d(function(a){return function(b){return od(a,b)}}(this),b)};g.Xa=function(){return new Df(Cb(this.Ta))};g.Z=function(){return Cc(Gf,this.s)};g.U=function(){return $e(this.Ta)};g.R=function(a,b){return new Ff(b,this.Ta,this.u)};g.V=function(a,b){return new Ff(this.s,Yc.c(this.Ta,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.G(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.G(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};g.b=function(a){return this.J(null,a)};g.a=function(a,b){return this.G(null,a,b)};var Gf=new Ff(null,Yd,zc);Ff.prototype[Ka]=function(){return sc(this)};
function Df(a){this.La=a;this.B=136;this.i=259}g=Df.prototype;g.nb=function(a,b){this.La=Fb(this.La,b,null);return this};g.ob=function(){return new Ff(null,Eb(this.La),null)};g.Y=function(){return Sc(this.La)};g.J=function(a,b){return $a.c(this,b,null)};g.G=function(a,b,c){return $a.c(this.La,b,ld)===ld?c:b};
g.call=function(){function a(a,b,c){return $a.c(this.La,b,ld)===ld?c:b}function b(a,b){return $a.c(this.La,b,ld)===ld?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};g.b=function(a){return $a.c(this.La,a,ld)===ld?null:a};g.a=function(a,b){return $a.c(this.La,a,ld)===ld?b:a};
function xd(a){if(null!=a&&(a.B&4096||a.cc))return a.kb(null);if("string"===typeof a)return a;throw Error([F("Doesn't support name: "),F(a)].join(""));}function Hf(a,b){for(var c=Cb(Yd),d=J(a),e=J(b);;)if(d&&e)var f=K(d),h=K(e),c=Fb(c,f,h),d=L(d),e=L(e);else return Eb(c)}
function Ie(a,b,c,d,e,f,h){var k=sa;sa=null==sa?null:sa-1;try{if(null!=sa&&0>sa)return yb(a,"#");yb(a,c);if(0===Ba.b(f))J(h)&&yb(a,function(){var a=If.b(f);return y(a)?a:"..."}());else{if(J(h)){var l=K(h);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=L(h),n=Ba.b(f)-1;;)if(!m||null!=n&&0===n){J(m)&&0===n&&(yb(a,d),yb(a,function(){var a=If.b(f);return y(a)?a:"..."}()));break}else{yb(a,d);var p=K(m);c=a;h=f;b.c?b.c(p,c,h):b.call(null,p,c,h);var q=L(m);c=n-1;m=q;n=c}}return yb(a,e)}finally{sa=k}}
function Jf(a,b){for(var c=J(b),d=null,e=0,f=0;;)if(f<e){var h=d.X(null,f);yb(a,h);f+=1}else if(c=J(c))d=c,id(d)?(c=Kb(d),e=Lb(d),d=c,h=Sc(c),c=e,e=h):(h=K(d),yb(a,h),c=L(d),d=null,e=0),f=0;else return null}var Kf={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Lf(a){return[F('"'),F(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Kf[a]})),F('"')].join("")}Mf;
function Nf(a,b){var c=nd(I.a(a,za));return c?(c=null!=b?b.i&131072||b.bc?!0:!1:!1)?null!=bd(b):c:c}
function Of(a,b,c){if(null==a)return yb(b,"nil");if(Nf(c,a)){yb(b,"^");var d=bd(a);Je.c?Je.c(d,b,c):Je.call(null,d,b,c);yb(b," ")}if(a.Ib)return a.Tb(a,b,c);if(null!=a&&(a.i&2147483648||a.T))return a.K(null,b,c);if(!0===a||!1===a||"number"===typeof a)return yb(b,""+F(a));if(null!=a&&a.constructor===Object)return yb(b,"#js "),d=S.a(function(b){return new V(null,2,5,W,[Gd.b(b),a[b]],null)},jd(a)),Mf.o?Mf.o(d,Je,b,c):Mf.call(null,d,Je,b,c);if(Ga(a))return Ie(b,Je,"#js ["," ","]",c,a);if("string"==typeof a)return y(ya.b(c))?
yb(b,Lf(a)):yb(b,a);if("function"==u(a)){var e=a.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Jf(b,lc(["#object[",c,' "',""+F(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+F(a);;)if(Sc(c)<b)c=[F("0"),F(c)].join("");else return c},Jf(b,lc(['#inst "',""+F(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),
3),"-",'00:00"'],0));if(a instanceof RegExp)return Jf(b,lc(['#"',a.source,'"'],0));if(null!=a&&(a.i&2147483648||a.T))return zb(a,b,c);if(y(a.constructor.pb))return Jf(b,lc(["#object[",a.constructor.pb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Jf(b,lc(["#object[",c," ",""+F(a),"]"],0))}function Je(a,b,c){var d=Pf.b(c);return y(d)?(c=Yc.c(c,Qf,Of),d.c?d.c(a,b,c):d.call(null,a,b,c)):Of(a,b,c)}
var fe=function fe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return fe.m(0<c.length?new oc(c.slice(0),0):null)};fe.m=function(a){var b=ua();if(null==a||Ia(J(a)))b="";else{var c=F,d=new ia;a:{var e=new Tb(d);Je(K(a),e,b);a=J(L(a));for(var f=null,h=0,k=0;;)if(k<h){var l=f.X(null,k);yb(e," ");Je(l,e,b);k+=1}else if(a=J(a))f=a,id(f)?(a=Kb(f),h=Lb(f),f=a,l=Sc(a),a=h,h=l):(l=K(f),yb(e," "),Je(l,e,b),a=L(f),f=null,h=0),k=0;else break a}b=""+c(d)}return b};
fe.A=0;fe.H=function(a){return fe.m(J(a))};function Mf(a,b,c,d){return Ie(c,function(a,c,d){var k=fb(a);b.c?b.c(k,c,d):b.call(null,k,c,d);yb(c," ");a=hb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,J(a))}ke.prototype.T=!0;ke.prototype.K=function(a,b,c){yb(b,"#object [cljs.core.Volatile ");Je(new va(null,1,[Rf,this.state],null),b,c);return yb(b,"]")};oc.prototype.T=!0;oc.prototype.K=function(a,b,c){return Ie(b,Je,"("," ",")",c,this)};Hd.prototype.T=!0;
Hd.prototype.K=function(a,b,c){return Ie(b,Je,"("," ",")",c,this)};vf.prototype.T=!0;vf.prototype.K=function(a,b,c){return Ie(b,Je,"("," ",")",c,this)};Af.prototype.T=!0;Af.prototype.K=function(a,b,c){return Ie(b,Je,"["," ","]",c,this)};Ze.prototype.T=!0;Ze.prototype.K=function(a,b,c){return Ie(b,Je,"("," ",")",c,this)};uc.prototype.T=!0;uc.prototype.K=function(a,b,c){return Ie(b,Je,"("," ",")",c,this)};hd.prototype.T=!0;hd.prototype.K=function(a,b,c){return Ie(b,Je,"("," ",")",c,this)};
Dd.prototype.T=!0;Dd.prototype.K=function(a,b,c){return Ie(b,Je,"("," ",")",c,this)};Lc.prototype.T=!0;Lc.prototype.K=function(a,b,c){return Ie(b,Je,"("," ",")",c,this)};Xc.prototype.T=!0;Xc.prototype.K=function(a,b,c){return Mf(this,Je,b,c)};wf.prototype.T=!0;wf.prototype.K=function(a,b,c){return Ie(b,Je,"("," ",")",c,this)};Ne.prototype.T=!0;Ne.prototype.K=function(a,b,c){return Ie(b,Je,"["," ","]",c,this)};Ff.prototype.T=!0;Ff.prototype.K=function(a,b,c){return Ie(b,Je,"#{"," ","}",c,this)};
gd.prototype.T=!0;gd.prototype.K=function(a,b,c){return Ie(b,Je,"("," ",")",c,this)};ce.prototype.T=!0;ce.prototype.K=function(a,b,c){yb(b,"#object [cljs.core.Atom ");Je(new va(null,1,[Rf,this.state],null),b,c);return yb(b,"]")};Cf.prototype.T=!0;Cf.prototype.K=function(a,b,c){return Ie(b,Je,"("," ",")",c,this)};zf.prototype.T=!0;zf.prototype.K=function(a,b,c){return Ie(b,Je,"["," ","]",c,this)};V.prototype.T=!0;V.prototype.K=function(a,b,c){return Ie(b,Je,"["," ","]",c,this)};Cd.prototype.T=!0;
Cd.prototype.K=function(a,b){return yb(b,"()")};Zd.prototype.T=!0;Zd.prototype.K=function(a,b,c){return Ie(b,Je,"("," ",")",c,this)};va.prototype.T=!0;va.prototype.K=function(a,b,c){return Mf(this,Je,b,c)};Bf.prototype.T=!0;Bf.prototype.K=function(a,b,c){return Ie(b,Je,"("," ",")",c,this)};Mc.prototype.T=!0;Mc.prototype.K=function(a,b,c){return Ie(b,Je,"("," ",")",c,this)};bc.prototype.gb=!0;
bc.prototype.Wa=function(a,b){if(b instanceof bc)return jc(this,b);throw Error([F("Cannot compare "),F(this),F(" to "),F(b)].join(""));};A.prototype.gb=!0;A.prototype.Wa=function(a,b){if(b instanceof A)return Ed(this,b);throw Error([F("Cannot compare "),F(this),F(" to "),F(b)].join(""));};Ne.prototype.gb=!0;Ne.prototype.Wa=function(a,b){if(fd(b))return pd(this,b);throw Error([F("Cannot compare "),F(this),F(" to "),F(b)].join(""));};V.prototype.gb=!0;
V.prototype.Wa=function(a,b){if(fd(b))return pd(this,b);throw Error([F("Cannot compare "),F(this),F(" to "),F(b)].join(""));};function Sf(a){return function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return Ec(d)?new Dc(d):d}}
function oe(a){return function(b){return function(){function c(a,c){return Na.c(b,a,c)}function d(b){return a.b?a.b(b):a.call(null,b)}function e(){return a.w?a.w():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.w=e;f.b=d;f.a=c;return f}()}(Sf(a))}Tf;function Vf(){}
var Wf=function Wf(b){if(null!=b&&null!=b.Zb)return b.Zb(b);var c=Wf[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Wf._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw C("IEncodeJS.-clj-\x3ejs",b);};Xf;function Yf(a){return(null!=a?a.Yb||(a.kc?0:B(Vf,a)):B(Vf,a))?Wf(a):"string"===typeof a||"number"===typeof a||a instanceof A||a instanceof bc?Xf.b?Xf.b(a):Xf.call(null,a):fe.m(lc([a],0))}
var Xf=function Xf(b){if(null==b)return null;if(null!=b?b.Yb||(b.kc?0:B(Vf,b)):B(Vf,b))return Wf(b);if(b instanceof A)return xd(b);if(b instanceof bc)return""+F(b);if(ed(b)){var c={};b=J(b);for(var d=null,e=0,f=0;;)if(f<e){var h=d.X(null,f),k=Wc(h,0),h=Wc(h,1);c[Yf(k)]=Xf(h);f+=1}else if(b=J(b))id(b)?(e=Kb(b),b=Lb(b),d=e,e=Sc(e)):(e=K(b),d=Wc(e,0),e=Wc(e,1),c[Yf(d)]=Xf(e),b=L(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.i&8||b.xc||(b.i?0:B(Ra,b)):B(Ra,b)){c=[];b=J(S.a(Xf,b));d=null;
for(f=e=0;;)if(f<e)k=d.X(null,f),c.push(k),f+=1;else if(b=J(b))d=b,id(d)?(b=Kb(d),f=Lb(d),d=b,e=Sc(b),b=f):(b=K(d),c.push(b),b=L(d),d=null,e=0),f=0;else break;return c}return b},Tf=function Tf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Tf.w();case 1:return Tf.b(arguments[0]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};Tf.w=function(){return Tf.b(1)};Tf.b=function(a){return Math.random()*a};Tf.A=1;
var Zf=null;function $f(){if(null==Zf){var a=new va(null,3,[ag,Yd,bg,Yd,cg,Yd],null);Zf=de.b?de.b(a):de.call(null,a)}return Zf}function dg(a,b,c){var d=cc.a(b,c);if(!d&&!(d=od(cg.b(a).call(null,b),c))&&(d=fd(c))&&(d=fd(b)))if(d=Sc(c)===Sc(b))for(var d=!0,e=0;;)if(d&&e!==Sc(c))d=dg(a,b.b?b.b(e):b.call(null,e),c.b?c.b(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function eg(a){var b;b=$f();b=M.b?M.b(b):M.call(null,b);return Sd(I.a(ag.b(b),a))}
function fg(a,b,c,d){je.a(a,function(){return M.b?M.b(b):M.call(null,b)});je.a(c,function(){return M.b?M.b(d):M.call(null,d)})}var gg=function gg(b,c,d){var e=(M.b?M.b(d):M.call(null,d)).call(null,b),e=y(y(e)?e.b?e.b(c):e.call(null,c):e)?!0:null;if(y(e))return e;e=function(){for(var e=eg(c);;)if(0<Sc(e))gg(b,K(e),d),e=pc(e);else return null}();if(y(e))return e;e=function(){for(var e=eg(b);;)if(0<Sc(e))gg(K(e),c,d),e=pc(e);else return null}();return y(e)?e:!1};
function hg(a,b,c){c=gg(a,b,c);if(y(c))a=c;else{c=dg;var d;d=$f();d=M.b?M.b(d):M.call(null,d);a=c(d,a,b)}return a}
var ig=function ig(b,c,d,e,f,h,k){var l=Na.c(function(e,h){var k=Wc(h,0);Wc(h,1);if(dg(M.b?M.b(d):M.call(null,d),c,k)){var l;l=(l=null==e)?l:hg(k,K(e),f);l=y(l)?h:e;if(!y(hg(K(l),k,f)))throw Error([F("Multiple methods in multimethod '"),F(b),F("' match dispatch value: "),F(c),F(" -\x3e "),F(k),F(" and "),F(K(l)),F(", and neither is preferred")].join(""));return l}return e},null,M.b?M.b(e):M.call(null,e));if(y(l)){if(cc.a(M.b?M.b(k):M.call(null,k),M.b?M.b(d):M.call(null,d)))return je.o(h,Yc,c,K(L(l))),
K(L(l));fg(h,e,k,d);return ig(b,c,d,e,f,h,k)}return null};function X(a,b){throw Error([F("No method in multimethod '"),F(a),F("' for dispatch value: "),F(b)].join(""));}function jg(a,b,c,d,e,f,h,k){this.name=a;this.h=b;this.lc=c;this.qb=d;this.bb=e;this.sc=f;this.tb=h;this.fb=k;this.i=4194305;this.B=4352}g=jg.prototype;
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,E,P){a=this;var oa=G.m(a.h,b,c,d,e,lc([f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,E,P],0)),Uf=Y(this,oa);y(Uf)||X(a.name,oa);return G.m(Uf,b,c,d,e,lc([f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,E,P],0))}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,E){a=this;var P=a.h.na?a.h.na(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,E):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,E),oa=Y(this,P);y(oa)||X(a.name,P);return oa.na?oa.na(b,c,d,e,f,h,k,l,m,n,p,q,r,t,
v,w,z,x,D,E):oa.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,E)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D){a=this;var E=a.h.ma?a.h.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D),P=Y(this,E);y(P)||X(a.name,E);return P.ma?P.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):P.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x){a=this;var D=a.h.la?a.h.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):a.h.call(null,
b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x),E=Y(this,D);y(E)||X(a.name,D);return E.la?E.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):E.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){a=this;var x=a.h.ka?a.h.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z),D=Y(this,x);y(D)||X(a.name,x);return D.ka?D.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):D.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,
w){a=this;var z=a.h.ja?a.h.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w),x=Y(this,z);y(x)||X(a.name,z);return x.ja?x.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):x.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){a=this;var w=a.h.ia?a.h.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v),z=Y(this,w);y(z)||X(a.name,w);return z.ia?z.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):z.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)}
function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){a=this;var v=a.h.ha?a.h.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t),w=Y(this,v);y(w)||X(a.name,v);return w.ha?w.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t):w.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;var t=a.h.ga?a.h.ga(b,c,d,e,f,h,k,l,m,n,p,q,r):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r),v=Y(this,t);y(v)||X(a.name,t);return v.ga?v.ga(b,c,d,e,f,h,k,l,m,n,p,q,r):v.call(null,b,c,d,e,f,h,k,l,m,n,p,
q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;var r=a.h.fa?a.h.fa(b,c,d,e,f,h,k,l,m,n,p,q):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q),t=Y(this,r);y(t)||X(a.name,r);return t.fa?t.fa(b,c,d,e,f,h,k,l,m,n,p,q):t.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;var q=a.h.ea?a.h.ea(b,c,d,e,f,h,k,l,m,n,p):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p),r=Y(this,q);y(r)||X(a.name,q);return r.ea?r.ea(b,c,d,e,f,h,k,l,m,n,p):r.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,
n){a=this;var p=a.h.da?a.h.da(b,c,d,e,f,h,k,l,m,n):a.h.call(null,b,c,d,e,f,h,k,l,m,n),q=Y(this,p);y(q)||X(a.name,p);return q.da?q.da(b,c,d,e,f,h,k,l,m,n):q.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;var n=a.h.pa?a.h.pa(b,c,d,e,f,h,k,l,m):a.h.call(null,b,c,d,e,f,h,k,l,m),p=Y(this,n);y(p)||X(a.name,n);return p.pa?p.pa(b,c,d,e,f,h,k,l,m):p.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;var m=a.h.oa?a.h.oa(b,c,d,e,f,h,k,l):a.h.call(null,b,c,d,e,f,h,k,l),n=
Y(this,m);y(n)||X(a.name,m);return n.oa?n.oa(b,c,d,e,f,h,k,l):n.call(null,b,c,d,e,f,h,k,l)}function t(a,b,c,d,e,f,h,k){a=this;var l=a.h.W?a.h.W(b,c,d,e,f,h,k):a.h.call(null,b,c,d,e,f,h,k),m=Y(this,l);y(m)||X(a.name,l);return m.W?m.W(b,c,d,e,f,h,k):m.call(null,b,c,d,e,f,h,k)}function v(a,b,c,d,e,f,h){a=this;var k=a.h.S?a.h.S(b,c,d,e,f,h):a.h.call(null,b,c,d,e,f,h),l=Y(this,k);y(l)||X(a.name,k);return l.S?l.S(b,c,d,e,f,h):l.call(null,b,c,d,e,f,h)}function w(a,b,c,d,e,f){a=this;var h=a.h.C?a.h.C(b,c,
d,e,f):a.h.call(null,b,c,d,e,f),k=Y(this,h);y(k)||X(a.name,h);return k.C?k.C(b,c,d,e,f):k.call(null,b,c,d,e,f)}function z(a,b,c,d,e){a=this;var f=a.h.o?a.h.o(b,c,d,e):a.h.call(null,b,c,d,e),h=Y(this,f);y(h)||X(a.name,f);return h.o?h.o(b,c,d,e):h.call(null,b,c,d,e)}function D(a,b,c,d){a=this;var e=a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d),f=Y(this,e);y(f)||X(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function E(a,b,c){a=this;var d=a.h.a?a.h.a(b,c):a.h.call(null,b,c),e=Y(this,d);y(e)||X(a.name,
d);return e.a?e.a(b,c):e.call(null,b,c)}function P(a,b){a=this;var c=a.h.b?a.h.b(b):a.h.call(null,b),d=Y(this,c);y(d)||X(a.name,c);return d.b?d.b(b):d.call(null,b)}function oa(a){a=this;var b=a.h.w?a.h.w():a.h.call(null),c=Y(this,b);y(c)||X(a.name,b);return c.w?c.w():c.call(null)}var x=null,x=function(x,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,Yb,Xa,gb,sb,Nb,nc,Uc,qe){switch(arguments.length){case 1:return oa.call(this,x);case 2:return P.call(this,x,O);case 3:return E.call(this,x,O,R);case 4:return D.call(this,
x,O,R,T);case 5:return z.call(this,x,O,R,T,U);case 6:return w.call(this,x,O,R,T,U,Z);case 7:return v.call(this,x,O,R,T,U,Z,ea);case 8:return t.call(this,x,O,R,T,U,Z,ea,ja);case 9:return r.call(this,x,O,R,T,U,Z,ea,ja,ka);case 10:return q.call(this,x,O,R,T,U,Z,ea,ja,ka,na);case 11:return p.call(this,x,O,R,T,U,Z,ea,ja,ka,na,qa);case 12:return n.call(this,x,O,R,T,U,Z,ea,ja,ka,na,qa,wa);case 13:return m.call(this,x,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha);case 14:return l.call(this,x,O,R,T,U,Z,ea,ja,ka,na,qa,wa,
Ha,La);case 15:return k.call(this,x,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,Yb);case 16:return h.call(this,x,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,Yb,Xa);case 17:return f.call(this,x,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,Yb,Xa,gb);case 18:return e.call(this,x,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,Yb,Xa,gb,sb);case 19:return d.call(this,x,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,Yb,Xa,gb,sb,Nb);case 20:return c.call(this,x,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,Yb,Xa,gb,sb,Nb,nc);case 21:return b.call(this,x,O,R,T,U,Z,ea,ja,ka,
na,qa,wa,Ha,La,Yb,Xa,gb,sb,Nb,nc,Uc);case 22:return a.call(this,x,O,R,T,U,Z,ea,ja,ka,na,qa,wa,Ha,La,Yb,Xa,gb,sb,Nb,nc,Uc,qe)}throw Error("Invalid arity: "+arguments.length);};x.b=oa;x.a=P;x.c=E;x.o=D;x.C=z;x.S=w;x.W=v;x.oa=t;x.pa=r;x.da=q;x.ea=p;x.fa=n;x.ga=m;x.ha=l;x.ia=k;x.ja=h;x.ka=f;x.la=e;x.ma=d;x.na=c;x.Hb=b;x.hb=a;return x}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ma(b)))};
g.w=function(){var a=this.h.w?this.h.w():this.h.call(null),b=Y(this,a);y(b)||X(this.name,a);return b.w?b.w():b.call(null)};g.b=function(a){var b=this.h.b?this.h.b(a):this.h.call(null,a),c=Y(this,b);y(c)||X(this.name,b);return c.b?c.b(a):c.call(null,a)};g.a=function(a,b){var c=this.h.a?this.h.a(a,b):this.h.call(null,a,b),d=Y(this,c);y(d)||X(this.name,c);return d.a?d.a(a,b):d.call(null,a,b)};
g.c=function(a,b,c){var d=this.h.c?this.h.c(a,b,c):this.h.call(null,a,b,c),e=Y(this,d);y(e)||X(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};g.o=function(a,b,c,d){var e=this.h.o?this.h.o(a,b,c,d):this.h.call(null,a,b,c,d),f=Y(this,e);y(f)||X(this.name,e);return f.o?f.o(a,b,c,d):f.call(null,a,b,c,d)};g.C=function(a,b,c,d,e){var f=this.h.C?this.h.C(a,b,c,d,e):this.h.call(null,a,b,c,d,e),h=Y(this,f);y(h)||X(this.name,f);return h.C?h.C(a,b,c,d,e):h.call(null,a,b,c,d,e)};
g.S=function(a,b,c,d,e,f){var h=this.h.S?this.h.S(a,b,c,d,e,f):this.h.call(null,a,b,c,d,e,f),k=Y(this,h);y(k)||X(this.name,h);return k.S?k.S(a,b,c,d,e,f):k.call(null,a,b,c,d,e,f)};g.W=function(a,b,c,d,e,f,h){var k=this.h.W?this.h.W(a,b,c,d,e,f,h):this.h.call(null,a,b,c,d,e,f,h),l=Y(this,k);y(l)||X(this.name,k);return l.W?l.W(a,b,c,d,e,f,h):l.call(null,a,b,c,d,e,f,h)};
g.oa=function(a,b,c,d,e,f,h,k){var l=this.h.oa?this.h.oa(a,b,c,d,e,f,h,k):this.h.call(null,a,b,c,d,e,f,h,k),m=Y(this,l);y(m)||X(this.name,l);return m.oa?m.oa(a,b,c,d,e,f,h,k):m.call(null,a,b,c,d,e,f,h,k)};g.pa=function(a,b,c,d,e,f,h,k,l){var m=this.h.pa?this.h.pa(a,b,c,d,e,f,h,k,l):this.h.call(null,a,b,c,d,e,f,h,k,l),n=Y(this,m);y(n)||X(this.name,m);return n.pa?n.pa(a,b,c,d,e,f,h,k,l):n.call(null,a,b,c,d,e,f,h,k,l)};
g.da=function(a,b,c,d,e,f,h,k,l,m){var n=this.h.da?this.h.da(a,b,c,d,e,f,h,k,l,m):this.h.call(null,a,b,c,d,e,f,h,k,l,m),p=Y(this,n);y(p)||X(this.name,n);return p.da?p.da(a,b,c,d,e,f,h,k,l,m):p.call(null,a,b,c,d,e,f,h,k,l,m)};g.ea=function(a,b,c,d,e,f,h,k,l,m,n){var p=this.h.ea?this.h.ea(a,b,c,d,e,f,h,k,l,m,n):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n),q=Y(this,p);y(q)||X(this.name,p);return q.ea?q.ea(a,b,c,d,e,f,h,k,l,m,n):q.call(null,a,b,c,d,e,f,h,k,l,m,n)};
g.fa=function(a,b,c,d,e,f,h,k,l,m,n,p){var q=this.h.fa?this.h.fa(a,b,c,d,e,f,h,k,l,m,n,p):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p),r=Y(this,q);y(r)||X(this.name,q);return r.fa?r.fa(a,b,c,d,e,f,h,k,l,m,n,p):r.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p,q){var r=this.h.ga?this.h.ga(a,b,c,d,e,f,h,k,l,m,n,p,q):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q),t=Y(this,r);y(t)||X(this.name,r);return t.ga?t.ga(a,b,c,d,e,f,h,k,l,m,n,p,q):t.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){var t=this.h.ha?this.h.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r),v=Y(this,t);y(v)||X(this.name,t);return v.ha?v.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r):v.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};
g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){var v=this.h.ia?this.h.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t),w=Y(this,v);y(w)||X(this.name,v);return w.ia?w.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):w.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t)};
g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){var w=this.h.ja?this.h.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v),z=Y(this,w);y(z)||X(this.name,w);return z.ja?z.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):z.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)};
g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){var z=this.h.ka?this.h.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w),D=Y(this,z);y(D)||X(this.name,z);return D.ka?D.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):D.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)};
g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){var D=this.h.la?this.h.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z),E=Y(this,D);y(E)||X(this.name,D);return E.la?E.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):E.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)};
g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D){var E=this.h.ma?this.h.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D),P=Y(this,E);y(P)||X(this.name,E);return P.ma?P.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):P.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D)};
g.na=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E){var P=this.h.na?this.h.na(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E),oa=Y(this,P);y(oa)||X(this.name,P);return oa.na?oa.na(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E):oa.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E)};
g.Hb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E,P){var oa=G.m(this.h,a,b,c,d,lc([e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E,P],0)),x=Y(this,oa);y(x)||X(this.name,oa);return G.m(x,a,b,c,d,lc([e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,E,P],0))};
function Y(a,b){cc.a(M.b?M.b(a.fb):M.call(null,a.fb),M.b?M.b(a.qb):M.call(null,a.qb))||fg(a.tb,a.bb,a.fb,a.qb);var c=(M.b?M.b(a.tb):M.call(null,a.tb)).call(null,b);if(y(c))return c;c=ig(a.name,b,a.qb,a.bb,a.sc,a.tb,a.fb);return y(c)?c:(M.b?M.b(a.bb):M.call(null,a.bb)).call(null,a.lc)}g.kb=function(){return Ob(this.name)};g.lb=function(){return Pb(this.name)};g.N=function(){return this[ba]||(this[ba]=++ca)};var kg=new A(null,"path","path",-188191168),lg=new A(null,"els","els",-1382351487),mg=new A(null,"transform","transform",1381301764),za=new A(null,"meta","meta",1499536964),ng=new bc(null,"blockable","blockable",-28395259,null),Aa=new A(null,"dup","dup",556298533),og=new A(null,"button","button",1456579943),ie=new bc(null,"new-value","new-value",-1567397401,null),ee=new A(null,"validator","validator",-1966190681),pg=new A(null,"default","default",-1987822328),qg=new A(null,"reset-points","reset-points",
-5234839),rg=new bc(null,"meta11302","meta11302",-1243130966,null),sg=new A(null,"width","width",-384071477),tg=new A(null,"onclick","onclick",1297553739),ug=new A(null,"midpoint","midpoint",-36269525),Rf=new A(null,"val","val",128701612),vg=new A(null,"type","type",1174270348),he=new bc(null,"validate","validate",1439230700,null),Qf=new A(null,"fallback-impl","fallback-impl",-1501286995),wg=new A(null,"source","source",-433931539),xa=new A(null,"flush-on-newline","flush-on-newline",-151457939),bg=
new A(null,"descendants","descendants",1824886031),cg=new A(null,"ancestors","ancestors",-776045424),xg=new A(null,"div","div",1057191632),ya=new A(null,"readably","readably",1129599760),If=new A(null,"more-marker","more-marker",-14717935),yg=new A(null,"g","g",1738089905),zg=new A(null,"island","island",623473715),Xd=new bc(null,"meta15372","meta15372",-510327629,null),Ba=new A(null,"print-length","print-length",1931866356),Ag=new A(null,"id","id",-1388402092),Bg=new A(null,"class","class",-2030961996),
Cg=new A(null,"set-depth","set-depth",1159922548),ag=new A(null,"parents","parents",-2027538891),Dg=new A(null,"svg","svg",856789142),Eg=new A(null,"radial","radial",-1334240714),Fg=new A(null,"right","right",-452581833),Gg=new A(null,"position","position",-2011731912),Hg=new A(null,"d","d",1972142424),Ig=new A(null,"depth","depth",1768663640),Jg=new A(null,"rerender","rerender",-1601192263),Wd=new bc(null,"quote","quote",1377916282,null),Vd=new A(null,"arglists","arglists",1661989754),Ud=new bc(null,
"nil-iter","nil-iter",1101030523,null),Kg=new A(null,"hierarchy","hierarchy",-1053470341),Pf=new A(null,"alt-impl","alt-impl",670969595),Lg=new A(null,"rect","rect",-108902628),Mg=new A(null,"height","height",1025178622),Ng=new A(null,"left","left",-399115937),Og=new A(null,"foreignObject","foreignObject",25502111),Pg=new bc(null,"f","f",43394975,null);var Qg;function Rg(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function Sg(a,b,c,d){this.head=a;this.I=b;this.length=c;this.f=d}Sg.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.I];this.f[this.I]=null;this.I=(this.I+1)%this.f.length;--this.length;return a};Sg.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};
Sg.prototype.resize=function(){var a=Array(2*this.f.length);return this.I<this.head?(Rg(this.f,this.I,a,0,this.length),this.I=0,this.head=this.length,this.f=a):this.I>this.head?(Rg(this.f,this.I,a,0,this.f.length-this.I),Rg(this.f,0,a,this.f.length-this.I,this.head),this.I=0,this.head=this.length,this.f=a):this.I===this.head?(this.head=this.I=0,this.f=a):null};if("undefined"===typeof Tg)var Tg={};var Ug;a:{var Vg=aa.navigator;if(Vg){var Wg=Vg.userAgent;if(Wg){Ug=Wg;break a}}Ug=""};var Xg;
function Yg(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==Ug.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ga(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==Ug.indexOf("Trident")&&-1==Ug.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Lb;c.Lb=null;a()}};return function(a){d.next={Lb:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var Zg;Zg=new Sg(0,0,0,Array(32));var $g=!1,ah=!1;bh;function ch(){$g=!0;ah=!1;for(var a=0;;){var b=Zg.pop();if(null!=b&&(b.w?b.w():b.call(null),1024>a)){a+=1;continue}break}$g=!1;return 0<Zg.length?bh.w?bh.w():bh.call(null):null}function bh(){var a=ah;if(y(y(a)?$g:a))return null;ah=!0;"function"!=u(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(Xg||(Xg=Yg()),Xg(ch)):aa.setImmediate(ch)};for(var dh=Array(1),eh=0;;)if(eh<dh.length)dh[eh]=null,eh+=1;else break;(function(a){"undefined"===typeof Qg&&(Qg=function(a,c,d){this.mc=a;this.Wb=c;this.pc=d;this.i=393216;this.B=0},Qg.prototype.R=function(a,c){return new Qg(this.mc,this.Wb,c)},Qg.prototype.P=function(){return this.pc},Qg.oc=function(){return new V(null,3,5,W,[Pg,ng,rg],null)},Qg.Ib=!0,Qg.pb="cljs.core.async/t_cljs$core$async11301",Qg.Tb=function(a,c){return yb(c,"cljs.core.async/t_cljs$core$async11301")});return new Qg(a,!0,Yd)})(function(){return null});var fh=VDOM.diff,gh=VDOM.patch,hh=VDOM.create;function ih(a){return pe(ae(Fa),pe(ae(md),re(a)))}function jh(a,b,c){return new VDOM.VHtml(xd(a),Xf(b),Xf(c))}function kh(a,b,c){return new VDOM.VSvg(xd(a),Xf(b),Xf(c))}lh;
var mh=function mh(b){if(null==b)return new VDOM.VText("");if(md(b))return jh(xg,Yd,S.a(mh,ih(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(cc.a(Dg,K(b)))return lh.b?lh.b(b):lh.call(null,b);var c=Wc(b,0),d=Wc(b,1);b=wd(b);return jh(c,d,S.a(mh,ih(b)))},lh=function lh(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(cc.a(Og,K(b))){var c=Wc(b,0),d=Wc(b,1);b=wd(b);return kh(c,d,S.a(mh,ih(b)))}c=Wc(b,0);d=Wc(b,
1);b=wd(b);return kh(c,d,S.a(lh,ih(b)))};
function nh(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return de.b?de.b(a):de.call(null,a)}(),c=function(){var a;a=M.b?M.b(b):M.call(null,b);a=hh.b?hh.b(a):hh.call(null,a);return de.b?de.b(a):de.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.w?a.w():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(M.b?M.b(c):M.call(null,c));return function(a,b,c){return function(d){var l=
mh(d);d=function(){var b=M.b?M.b(a):M.call(null,a);return fh.a?fh.a(b,l):fh.call(null,b,l)}();ge.a?ge.a(a,l):ge.call(null,a,l);d=function(a,b,c,d){return function(){return je.c(d,gh,b)}}(l,d,a,b,c);return c.b?c.b(d):c.call(null,d)}}(b,c,d)};function oh(a){var b=Wc(a,0);a=Wc(a,1);return[F(b),F(","),F(a)].join("")}function ph(a){a=S.a(oh,a);a=le(ne.a(me("L"),a));a=Xf(a).join("");return[F("M"),F(a)].join("")};qh;function rh(a,b,c,d){this.Za=a;this.eb=b;this.Ja=c;this.u=d;this.i=2229667594;this.B=8192}g=rh.prototype;g.J=function(a,b){return $a.c(this,b,null)};g.G=function(a,b,c){switch(b instanceof A?b.Aa:null){case "els":return this.Za;default:return I.c(this.Ja,b,c)}};g.K=function(a,b,c){return Ie(b,function(){return function(a){return Ie(b,Je,""," ","",c,a)}}(this),"#isle.vector.Vector{",", ","}",c,Pd.a(new V(null,1,5,W,[new V(null,2,5,W,[lg,this.Za],null)],null),this.Ja))};
g.Fa=function(){return new Te(0,this,1,new V(null,1,5,W,[lg],null),Sb(this.Ja))};g.P=function(){return this.eb};g.Y=function(){return 1+Sc(this.Ja)};g.N=function(){var a=this.u;if(null!=a)return a;a:for(var a=0,b=J(this);;)if(b)var c=K(b),a=(a+(hc(yd.b?yd.b(c):yd.call(null,c))^hc(zd.b?zd.b(c):zd.call(null,c))))%4503599627370496,b=L(b);else break a;return this.u=a};g.v=function(a,b){var c;c=y(b)?(c=this.constructor===b.constructor)?Se(this,b):c:b;return y(c)?!0:!1};
g.xb=function(a,b){return od(new Ff(null,new va(null,1,[lg,null],null),null),b)?$c.a(Cc(se(Yd,this),this.eb),b):new rh(this.Za,this.eb,Sd($c.a(this.Ja,b)),null)};g.Ma=function(a,b,c){return y(Fd.a?Fd.a(lg,b):Fd.call(null,lg,b))?new rh(c,this.eb,this.Ja,null):new rh(this.Za,this.eb,Yc.c(this.Ja,b,c),null)};g.U=function(){return J(Pd.a(new V(null,1,5,W,[new V(null,2,5,W,[lg,this.Za],null)],null),this.Ja))};g.R=function(a,b){return new rh(this.Za,b,this.Ja,this.u)};
g.V=function(a,b){return fd(b)?bb(this,H.a(b,0),H.a(b,1)):Na.c(Sa,this,b)};function qh(a){return new rh(a,null,null,null)};var pa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new oc(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Ca.b?Ca.b(a):Ca.call(null,a))}a.A=0;a.H=function(a){a=J(a);return b(a)};a.m=b;return a}(),ra=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new oc(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,
Ca.b?Ca.b(a):Ca.call(null,a))}a.A=0;a.H=function(a){a=J(a);return b(a)};a.m=b;return a}(),sh=function sh(b,c){var d=te(c,new V(null,2,5,W,[wg,vg],null));if(y(cc.a?cc.a(Eg,d):cc.call(null,Eg,d)))return 1;if(y(cc.a?cc.a(ug,d):cc.call(null,ug,d)))return function(){var d=sh(b,function(){var d=te(c,new V(null,2,5,W,[wg,Ng],null));return b.b?b.b(d):b.call(null,d)}()),f=sh(b,function(){var d=te(c,new V(null,2,5,W,[wg,Fg],null));return b.b?b.b(d):b.call(null,d)}());return d>f?d:f}()+1;throw Error([F("No matching clause: "),
F(d)].join(""));};function th(a,b){var c=Hf(S.a(Ag,b),b);return pe(function(b){return function(c){return sh(b,c)<=a}}(c),b)}
function uh(){var a=vh,b=M.b?M.b(wh):M.call(null,wh),c=null!=b&&(b.i&64||b.Qa)?G.a(Ac,b):b,d=I.a(c,zg),e=I.a(c,Ig);return new V(null,3,5,W,[xg,Yd,new V(null,4,5,W,[xg,Yd,new V(null,3,5,W,[xg,Yd,new V(null,3,5,W,[og,new va(null,1,[tg,function(){return function(){return a.b?a.b(qg):a.call(null,qg)}}(500,b,c,c,d,e)],null),"New Island"],null)],null),new V(null,3,5,W,[xg,Yd,new V(null,4,5,W,[Dg,new va(null,2,[sg,500,Mg,500],null),new V(null,2,5,W,[Lg,new va(null,3,[Bg,"water",sg,500,Mg,500],null)],null),
new V(null,3,5,W,[yg,new va(null,1,[mg,[F("translate("),F(250),F(","),F(250),F(")")].join("")],null),new V(null,2,5,W,[kg,new va(null,2,[Bg,"island",Hg,function(){var a=th(e,d),a=S.a(Gg,a);return J(a)?[F(ph(a)),F("Z")].join(""):""}()],null)],null)],null)],null)],null)],null)],null)}if("undefined"===typeof wh){var wh,xh=new va(null,1,[Ig,20],null);wh=de.b?de.b(xh):de.call(null,xh)}
if("undefined"===typeof vh)var vh=function(){var a=de.b?de.b(Yd):de.call(null,Yd),b=de.b?de.b(Yd):de.call(null,Yd),c=de.b?de.b(Yd):de.call(null,Yd),d=de.b?de.b(Yd):de.call(null,Yd),e=I.c(Yd,Kg,$f());return new jg(kc.a("isle.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.A=1;a.H=function(a){var b=K(a);pc(a);return b};a.m=function(a){return a};return a}()}(a,b,c,d,e),pg,e,a,b,c,d)}();
var yh=vh;je.o(yh.bb,Yc,Cg,function(a,b){return je.o(wh,ue,Ig,function(a){return 0<a&&21>a?b:a})});fg(yh.tb,yh.bb,yh.fb,yh.qb);if("undefined"===typeof zh)var zh=function(a){return function(){var b=uh();return a.b?a.b(b):a.call(null,b)}}(nh());if("undefined"===typeof Ah){var Ah,Bh=wh;Bb(Bh,Jg,function(a,b,c,d){return zh.b?zh.b(d):zh.call(null,d)});Ah=Bh}var Ch=M.b?M.b(wh):M.call(null,wh);zh.b?zh.b(Ch):zh.call(null,Ch);