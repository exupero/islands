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

var g,aa=this;function ba(a,b){var c=a.split("."),d=aa;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d=d[e]?d[e]:d[e]={}:d[e]=b}
function u(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}var da="closure_uid_"+(1E9*Math.random()>>>0),ea=0;function ga(a,b,c){return a.call.apply(a.bind,arguments)}function ja(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ma(a,b,c){ma=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ga:ja;return ma.apply(null,arguments)};function na(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function oa(a,b){null!=a&&this.append.apply(this,arguments)}g=oa.prototype;g.Na="";g.set=function(a){this.Na=""+a};g.append=function(a,b,c){this.Na+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Na+=arguments[d];return this};g.clear=function(){this.Na=""};g.toString=function(){return this.Na};function pa(a,b){return a>b?1:a<b?-1:0};var ra={},sa;if("undefined"===typeof ta)var ta=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof ua)var ua=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var va=null;if("undefined"===typeof wa)var wa=null;function xa(){return new ya(null,5,[Aa,!0,Ba,!0,Ca,!1,Da,!1,Ea,null],null)}Ha;function y(a){return null!=a&&!1!==a}Ia;A;function Ja(a){return null==a}function La(a){return a instanceof Array}
function Ma(a){return null==a?!0:!1===a?!0:!1}function B(a,b){return a[u(null==b?null:b)]?!0:a._?!0:!1}function C(a,b){var c=null==b?null:b.constructor,c=y(y(c)?c.Db:c)?c.lb:u(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Na(a){var b=a.lb;return y(b)?b:""+E(a)}var Oa="undefined"!==typeof Symbol&&"function"===u(Symbol)?Symbol.iterator:"@@iterator";function Pa(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}F;Qa;
var Ha=function Ha(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ha.a(arguments[0]);case 2:return Ha.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Ha.a=function(a){return Ha.b(null,a)};Ha.b=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Qa.c?Qa.c(c,d,b):Qa.call(null,c,d,b)};Ha.A=2;function Ra(){}
var Sa=function Sa(b){if(null!=b&&null!=b.X)return b.X(b);var c=Sa[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Sa._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ICounted.-count",b);};function Ta(){}var Ua=function Ua(b,c){if(null!=b&&null!=b.T)return b.T(b,c);var d=Ua[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ua._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("ICollection.-conj",b);};function Va(){}
var H=function H(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return H.b(arguments[0],arguments[1]);case 3:return H.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
H.b=function(a,b){if(null!=a&&null!=a.U)return a.U(a,b);var c=H[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=H._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("IIndexed.-nth",a);};H.c=function(a,b,c){if(null!=a&&null!=a.ta)return a.ta(a,b,c);var d=H[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=H._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IIndexed.-nth",a);};H.A=3;function Xa(){}
var Ya=function Ya(b){if(null!=b&&null!=b.$)return b.$(b);var c=Ya[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ya._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeq.-first",b);},Za=function Za(b){if(null!=b&&null!=b.qa)return b.qa(b);var c=Za[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Za._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeq.-rest",b);};function $a(){}function ab(){}
var bb=function bb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return bb.b(arguments[0],arguments[1]);case 3:return bb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
bb.b=function(a,b){if(null!=a&&null!=a.J)return a.J(a,b);var c=bb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=bb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("ILookup.-lookup",a);};bb.c=function(a,b,c){if(null!=a&&null!=a.H)return a.H(a,b,c);var d=bb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=bb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ILookup.-lookup",a);};bb.A=3;
var cb=function cb(b,c){if(null!=b&&null!=b.yb)return b.yb(b,c);var d=cb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=cb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IAssociative.-contains-key?",b);},db=function db(b,c,d){if(null!=b&&null!=b.Oa)return b.Oa(b,c,d);var e=db[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=db._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IAssociative.-assoc",b);};function fb(){}
function gb(){}var hb=function hb(b){if(null!=b&&null!=b.eb)return b.eb(b);var c=hb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=hb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMapEntry.-key",b);},ib=function ib(b){if(null!=b&&null!=b.fb)return b.fb(b);var c=ib[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ib._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMapEntry.-val",b);};function jb(){}function kb(){}
var lb=function lb(b,c,d){if(null!=b&&null!=b.Pa)return b.Pa(b,c,d);var e=lb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=lb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IVector.-assoc-n",b);},mb=function mb(b){if(null!=b&&null!=b.sb)return b.sb(b);var c=mb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=mb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IDeref.-deref",b);};function nb(){}
var ob=function ob(b){if(null!=b&&null!=b.O)return b.O(b);var c=ob[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ob._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMeta.-meta",b);},pb=function pb(b,c){if(null!=b&&null!=b.R)return b.R(b,c);var d=pb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=pb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IWithMeta.-with-meta",b);};function rb(){}
var sb=function sb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return sb.b(arguments[0],arguments[1]);case 3:return sb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
sb.b=function(a,b){if(null!=a&&null!=a.Y)return a.Y(a,b);var c=sb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=sb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("IReduce.-reduce",a);};sb.c=function(a,b,c){if(null!=a&&null!=a.Z)return a.Z(a,b,c);var d=sb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=sb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IReduce.-reduce",a);};sb.A=3;
var tb=function tb(b,c){if(null!=b&&null!=b.w)return b.w(b,c);var d=tb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=tb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IEquiv.-equiv",b);},ub=function ub(b){if(null!=b&&null!=b.N)return b.N(b);var c=ub[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ub._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IHash.-hash",b);};function vb(){}
var wb=function wb(b){if(null!=b&&null!=b.S)return b.S(b);var c=wb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=wb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeqable.-seq",b);};function xb(){}function yb(){}
var zb=function zb(b,c){if(null!=b&&null!=b.Lb)return b.Lb(0,c);var d=zb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=zb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IWriter.-write",b);},Ab=function Ab(b,c,d){if(null!=b&&null!=b.K)return b.K(b,c,d);var e=Ab[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Ab._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IPrintWithWriter.-pr-writer",b);},Bb=function Bb(b,c,d){if(null!=b&&
null!=b.Kb)return b.Kb(0,c,d);var e=Bb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Bb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-notify-watches",b);},Cb=function Cb(b,c,d){if(null!=b&&null!=b.Jb)return b.Jb(0,c,d);var e=Cb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Cb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-add-watch",b);},Db=function Db(b){if(null!=b&&null!=b.Va)return b.Va(b);
var c=Db[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Db._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEditableCollection.-as-transient",b);},Eb=function Eb(b,c){if(null!=b&&null!=b.jb)return b.jb(b,c);var d=Eb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Eb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("ITransientCollection.-conj!",b);},Fb=function Fb(b){if(null!=b&&null!=b.kb)return b.kb(b);var c=Fb[u(null==b?null:b)];if(null!=c)return c.a?
c.a(b):c.call(null,b);c=Fb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ITransientCollection.-persistent!",b);},Gb=function Gb(b,c,d){if(null!=b&&null!=b.ib)return b.ib(b,c,d);var e=Gb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Gb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientAssociative.-assoc!",b);},Hb=function Hb(b,c,d){if(null!=b&&null!=b.Ib)return b.Ib(0,c,d);var e=Hb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,
b,c,d);e=Hb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientVector.-assoc-n!",b);};function Ib(){}
var Jb=function Jb(b,c){if(null!=b&&null!=b.Ua)return b.Ua(b,c);var d=Jb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Jb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IComparable.-compare",b);},Lb=function Lb(b){if(null!=b&&null!=b.Gb)return b.Gb();var c=Lb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Lb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunk.-drop-first",b);},Mb=function Mb(b){if(null!=b&&null!=b.Ab)return b.Ab(b);var c=
Mb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Mb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedSeq.-chunked-first",b);},Nb=function Nb(b){if(null!=b&&null!=b.Bb)return b.Bb(b);var c=Nb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Nb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedSeq.-chunked-rest",b);},Ob=function Ob(b){if(null!=b&&null!=b.zb)return b.zb(b);var c=Ob[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,
b);c=Ob._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedNext.-chunked-next",b);},Pb=function Pb(b){if(null!=b&&null!=b.gb)return b.gb(b);var c=Pb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Pb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("INamed.-name",b);},Qb=function Qb(b){if(null!=b&&null!=b.hb)return b.hb(b);var c=Qb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Qb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("INamed.-namespace",
b);},Rb=function Rb(b,c){if(null!=b&&null!=b.Yb)return b.Yb(b,c);var d=Rb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Rb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IReset.-reset!",b);},Sb=function Sb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Sb.b(arguments[0],arguments[1]);case 3:return Sb.c(arguments[0],arguments[1],arguments[2]);case 4:return Sb.o(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return Sb.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Sb.b=function(a,b){if(null!=a&&null!=a.$b)return a.$b(a,b);var c=Sb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=Sb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("ISwap.-swap!",a);};
Sb.c=function(a,b,c){if(null!=a&&null!=a.ac)return a.ac(a,b,c);var d=Sb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Sb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ISwap.-swap!",a);};Sb.o=function(a,b,c,d){if(null!=a&&null!=a.bc)return a.bc(a,b,c,d);var e=Sb[u(null==a?null:a)];if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);e=Sb._;if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);throw C("ISwap.-swap!",a);};
Sb.C=function(a,b,c,d,e){if(null!=a&&null!=a.cc)return a.cc(a,b,c,d,e);var f=Sb[u(null==a?null:a)];if(null!=f)return f.C?f.C(a,b,c,d,e):f.call(null,a,b,c,d,e);f=Sb._;if(null!=f)return f.C?f.C(a,b,c,d,e):f.call(null,a,b,c,d,e);throw C("ISwap.-swap!",a);};Sb.A=5;var Ub=function Ub(b){if(null!=b&&null!=b.Da)return b.Da(b);var c=Ub[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ub._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IIterable.-iterator",b);};
function Vb(a){this.lc=a;this.i=1073741824;this.B=0}Vb.prototype.Lb=function(a,b){return this.lc.append(b)};function Wb(a){var b=new oa;a.K(null,new Vb(b),xa());return""+E(b)}var Xb="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function Yb(a){a=Xb(a|0,-862048943);return Xb(a<<15|a>>>-15,461845907)}
function Zb(a,b){var c=(a|0)^(b|0);return Xb(c<<13|c>>>-13,5)+-430675100|0}function $b(a,b){var c=(a|0)^b,c=Xb(c^c>>>16,-2048144789),c=Xb(c^c>>>13,-1028477387);return c^c>>>16}function ac(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=Zb(c,Yb(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^Yb(a.charCodeAt(a.length-1)):b;return $b(b,Xb(2,a.length))}bc;cc;dc;ec;var fc={},gc=0;
function hc(a){255<gc&&(fc={},gc=0);var b=fc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=Xb(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;fc[a]=b;gc+=1}return a=b}function jc(a){null!=a&&(a.i&4194304||a.qc)?a=a.N(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=hc(a),0!==a&&(a=Yb(a),a=Zb(0,a),a=$b(a,4))):a=a instanceof Date?a.valueOf():null==a?0:ub(a);return a}
function kc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Ia(a,b){return b instanceof a}function lc(a,b){if(a.Ga===b.Ga)return 0;var c=Ma(a.ra);if(y(c?b.ra:c))return-1;if(y(a.ra)){if(Ma(b.ra))return 1;c=pa(a.ra,b.ra);return 0===c?pa(a.name,b.name):c}return pa(a.name,b.name)}I;function cc(a,b,c,d,e){this.ra=a;this.name=b;this.Ga=c;this.Ta=d;this.ya=e;this.i=2154168321;this.B=4096}g=cc.prototype;g.toString=function(){return this.Ga};g.equiv=function(a){return this.w(null,a)};
g.w=function(a,b){return b instanceof cc?this.Ga===b.Ga:!1};g.call=function(){function a(a,b,c){return I.c?I.c(b,this,c):I.call(null,b,this,c)}function b(a,b){return I.b?I.b(b,this):I.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};
g.a=function(a){return I.b?I.b(a,this):I.call(null,a,this)};g.b=function(a,b){return I.c?I.c(a,this,b):I.call(null,a,this,b)};g.O=function(){return this.ya};g.R=function(a,b){return new cc(this.ra,this.name,this.Ga,this.Ta,b)};g.N=function(){var a=this.Ta;return null!=a?a:this.Ta=a=kc(ac(this.name),hc(this.ra))};g.gb=function(){return this.name};g.hb=function(){return this.ra};g.K=function(a,b){return zb(b,this.Ga)};
var mc=function mc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return mc.a(arguments[0]);case 2:return mc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};mc.a=function(a){if(a instanceof cc)return a;var b=a.indexOf("/");return-1===b?mc.b(null,a):mc.b(a.substring(0,b),a.substring(b+1,a.length))};mc.b=function(a,b){var c=null!=a?[E(a),E("/"),E(b)].join(""):b;return new cc(a,b,c,null,null)};
mc.A=2;nc;oc;pc;function J(a){if(null==a)return null;if(null!=a&&(a.i&8388608||a.Zb))return a.S(null);if(La(a)||"string"===typeof a)return 0===a.length?null:new pc(a,0);if(B(vb,a))return wb(a);throw Error([E(a),E(" is not ISeqable")].join(""));}function K(a){if(null==a)return null;if(null!=a&&(a.i&64||a.Ia))return a.$(null);a=J(a);return null==a?null:Ya(a)}function qc(a){return null!=a?null!=a&&(a.i&64||a.Ia)?a.qa(null):(a=J(a))?Za(a):rc:rc}
function L(a){return null==a?null:null!=a&&(a.i&128||a.tb)?a.pa(null):J(qc(a))}var dc=function dc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return dc.a(arguments[0]);case 2:return dc.b(arguments[0],arguments[1]);default:return dc.m(arguments[0],arguments[1],new pc(c.slice(2),0))}};dc.a=function(){return!0};dc.b=function(a,b){return null==a?null==b:a===b||tb(a,b)};
dc.m=function(a,b,c){for(;;)if(dc.b(a,b))if(L(c))a=b,b=K(c),c=L(c);else return dc.b(b,K(c));else return!1};dc.G=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return dc.m(b,a,c)};dc.A=2;function sc(a){this.D=a}sc.prototype.next=function(){if(null!=this.D){var a=K(this.D);this.D=L(this.D);return{value:a,done:!1}}return{value:null,done:!0}};function tc(a){return new sc(J(a))}uc;function vc(a,b,c){this.value=a;this.Ya=b;this.vb=c;this.i=8388672;this.B=0}vc.prototype.S=function(){return this};
vc.prototype.$=function(){return this.value};vc.prototype.qa=function(){null==this.vb&&(this.vb=uc.a?uc.a(this.Ya):uc.call(null,this.Ya));return this.vb};function uc(a){var b=a.next();return y(b.done)?rc:new vc(b.value,a,null)}function wc(a,b){var c=Yb(a),c=Zb(0,c);return $b(c,b)}function xc(a){var b=0,c=1;for(a=J(a);;)if(null!=a)b+=1,c=Xb(31,c)+jc(K(a))|0,a=L(a);else return wc(c,b)}var yc=wc(1,0);function zc(a){var b=0,c=0;for(a=J(a);;)if(null!=a)b+=1,c=c+jc(K(a))|0,a=L(a);else return wc(c,b)}
var Ac=wc(0,0);Bc;bc;Cc;Ra["null"]=!0;Sa["null"]=function(){return 0};Date.prototype.w=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.bb=!0;Date.prototype.Ua=function(a,b){if(b instanceof Date)return pa(this.valueOf(),b.valueOf());throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};tb.number=function(a,b){return a===b};Dc;nb["function"]=!0;ob["function"]=function(){return null};ub._=function(a){return a[da]||(a[da]=++ea)};
function Ec(a){return a+1}M;function Fc(a){this.M=a;this.i=32768;this.B=0}Fc.prototype.sb=function(){return this.M};function Gc(a){return a instanceof Fc}function M(a){return mb(a)}function Hc(a,b){var c=Sa(a);if(0===c)return b.u?b.u():b.call(null);for(var d=H.b(a,0),e=1;;)if(e<c){var f=H.b(a,e),d=b.b?b.b(d,f):b.call(null,d,f);if(Gc(d))return mb(d);e+=1}else return d}
function Ic(a,b,c){var d=Sa(a),e=c;for(c=0;;)if(c<d){var f=H.b(a,c),e=b.b?b.b(e,f):b.call(null,e,f);if(Gc(e))return mb(e);c+=1}else return e}function Jc(a,b){var c=a.length;if(0===a.length)return b.u?b.u():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.b?b.b(d,f):b.call(null,d,f);if(Gc(d))return mb(d);e+=1}else return d}function Kc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.b?b.b(e,f):b.call(null,e,f);if(Gc(e))return mb(e);c+=1}else return e}
function Lc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.b?b.b(c,f):b.call(null,c,f);if(Gc(c))return mb(c);d+=1}else return c}Mc;N;Nc;Oc;function Pc(a){return null!=a?a.i&2||a.Pb?!0:a.i?!1:B(Ra,a):B(Ra,a)}function Qc(a){return null!=a?a.i&16||a.Hb?!0:a.i?!1:B(Va,a):B(Va,a)}function Sc(a,b){this.f=a;this.j=b}Sc.prototype.ua=function(){return this.j<this.f.length};Sc.prototype.next=function(){var a=this.f[this.j];this.j+=1;return a};
function pc(a,b){this.f=a;this.j=b;this.i=166199550;this.B=8192}g=pc.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.U=function(a,b){var c=b+this.j;return c<this.f.length?this.f[c]:null};g.ta=function(a,b,c){a=b+this.j;return a<this.f.length?this.f[a]:c};g.Da=function(){return new Sc(this.f,this.j)};g.pa=function(){return this.j+1<this.f.length?new pc(this.f,this.j+1):null};g.X=function(){var a=this.f.length-this.j;return 0>a?0:a};g.N=function(){return xc(this)};
g.w=function(a,b){return Cc.b?Cc.b(this,b):Cc.call(null,this,b)};g.Y=function(a,b){return Lc(this.f,b,this.f[this.j],this.j+1)};g.Z=function(a,b,c){return Lc(this.f,b,c,this.j)};g.$=function(){return this.f[this.j]};g.qa=function(){return this.j+1<this.f.length?new pc(this.f,this.j+1):rc};g.S=function(){return this.j<this.f.length?this:null};g.T=function(a,b){return N.b?N.b(b,this):N.call(null,b,this)};pc.prototype[Oa]=function(){return tc(this)};
var oc=function oc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return oc.a(arguments[0]);case 2:return oc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};oc.a=function(a){return oc.b(a,0)};oc.b=function(a,b){return b<a.length?new pc(a,b):null};oc.A=2;
var nc=function nc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return nc.a(arguments[0]);case 2:return nc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};nc.a=function(a){return oc.b(a,0)};nc.b=function(a,b){return oc.b(a,b)};nc.A=2;Dc;Tc;function Nc(a,b,c){this.rb=a;this.j=b;this.v=c;this.i=32374990;this.B=8192}g=Nc.prototype;g.toString=function(){return Wb(this)};
g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){return 0<this.j?new Nc(this.rb,this.j-1,null):null};g.X=function(){return this.j+1};g.N=function(){return xc(this)};g.w=function(a,b){return Cc.b?Cc.b(this,b):Cc.call(null,this,b)};g.Y=function(a,b){return Tc.b?Tc.b(b,this):Tc.call(null,b,this)};g.Z=function(a,b,c){return Tc.c?Tc.c(b,c,this):Tc.call(null,b,c,this)};g.$=function(){return H.b(this.rb,this.j)};
g.qa=function(){return 0<this.j?new Nc(this.rb,this.j-1,null):rc};g.S=function(){return this};g.R=function(a,b){return new Nc(this.rb,this.j,b)};g.T=function(a,b){return N.b?N.b(b,this):N.call(null,b,this)};Nc.prototype[Oa]=function(){return tc(this)};tb._=function(a,b){return a===b};
var Uc=function Uc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Uc.u();case 1:return Uc.a(arguments[0]);case 2:return Uc.b(arguments[0],arguments[1]);default:return Uc.m(arguments[0],arguments[1],new pc(c.slice(2),0))}};Uc.u=function(){return Vc};Uc.a=function(a){return a};Uc.b=function(a,b){return null!=a?Ua(a,b):Ua(rc,b)};Uc.m=function(a,b,c){for(;;)if(y(c))a=Uc.b(a,b),b=K(c),c=L(c);else return Uc.b(a,b)};
Uc.G=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return Uc.m(b,a,c)};Uc.A=2;function Wc(a){if(null!=a)if(null!=a&&(a.i&2||a.Pb))a=a.X(null);else if(La(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.i&8388608||a.Zb))a:{a=J(a);for(var b=0;;){if(Pc(a)){a=b+Sa(a);break a}a=L(a);b+=1}}else a=Sa(a);else a=0;return a}function Xc(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return J(a)?K(a):c;if(Qc(a))return H.c(a,b,c);if(J(a)){var d=L(a),e=b-1;a=d;b=e}else return c}}
function Yc(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.i&16||a.Hb))return a.U(null,b);if(La(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Ia)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(J(c)){c=K(c);break a}throw Error("Index out of bounds");}if(Qc(c)){c=H.b(c,d);break a}if(J(c))c=L(c),--d;else throw Error("Index out of bounds");
}}return c}if(B(Va,a))return H.b(a,b);throw Error([E("nth not supported on this type "),E(Na(null==a?null:a.constructor))].join(""));}
function O(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.i&16||a.Hb))return a.ta(null,b,null);if(La(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Ia))return Xc(a,b);if(B(Va,a))return H.b(a,b);throw Error([E("nth not supported on this type "),E(Na(null==a?null:a.constructor))].join(""));}
var I=function I(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return I.b(arguments[0],arguments[1]);case 3:return I.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};I.b=function(a,b){return null==a?null:null!=a&&(a.i&256||a.Sb)?a.J(null,b):La(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:B(ab,a)?bb.b(a,b):null};
I.c=function(a,b,c){return null!=a?null!=a&&(a.i&256||a.Sb)?a.H(null,b,c):La(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:B(ab,a)?bb.c(a,b,c):c:c};I.A=3;Zc;var $c=function $c(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return $c.c(arguments[0],arguments[1],arguments[2]);default:return $c.m(arguments[0],arguments[1],arguments[2],new pc(c.slice(3),0))}};
$c.c=function(a,b,c){if(null!=a)a=db(a,b,c);else a:{a=[b];c=[c];b=a.length;var d=0,e;for(e=Db(ad);;)if(d<b){var f=d+1;e=e.ib(null,a[d],c[d]);d=f}else{a=Fb(e);break a}}return a};$c.m=function(a,b,c,d){for(;;)if(a=$c.c(a,b,c),y(d))b=K(d),c=K(L(d)),d=L(L(d));else return a};$c.G=function(a){var b=K(a),c=L(a);a=K(c);var d=L(c),c=K(d),d=L(d);return $c.m(b,a,c,d)};$c.A=3;function bd(a,b){this.g=a;this.v=b;this.i=393217;this.B=0}g=bd.prototype;g.O=function(){return this.v};
g.R=function(a,b){return new bd(this.g,b)};
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,G,S){a=this;return F.cb?F.cb(a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,G,S):F.call(null,a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,G,S)}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,G){a=this;return a.g.ma?a.g.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,G):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,G)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D){a=this;return a.g.la?a.g.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):
a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x){a=this;return a.g.ka?a.g.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){a=this;return a.g.ja?a.g.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){a=this;return a.g.ia?a.g.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.g.call(null,b,
c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){a=this;return a.g.ha?a.g.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)}function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){a=this;return a.g.ga?a.g.ga(b,c,d,e,f,h,k,l,m,n,p,q,r,t):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;return a.g.fa?a.g.fa(b,c,d,e,f,h,k,l,m,n,p,q,r):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;
return a.g.ea?a.g.ea(b,c,d,e,f,h,k,l,m,n,p,q):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;return a.g.da?a.g.da(b,c,d,e,f,h,k,l,m,n,p):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,n){a=this;return a.g.ca?a.g.ca(b,c,d,e,f,h,k,l,m,n):a.g.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;return a.g.oa?a.g.oa(b,c,d,e,f,h,k,l,m):a.g.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;return a.g.na?a.g.na(b,c,
d,e,f,h,k,l):a.g.call(null,b,c,d,e,f,h,k,l)}function t(a,b,c,d,e,f,h,k){a=this;return a.g.W?a.g.W(b,c,d,e,f,h,k):a.g.call(null,b,c,d,e,f,h,k)}function v(a,b,c,d,e,f,h){a=this;return a.g.V?a.g.V(b,c,d,e,f,h):a.g.call(null,b,c,d,e,f,h)}function w(a,b,c,d,e,f){a=this;return a.g.C?a.g.C(b,c,d,e,f):a.g.call(null,b,c,d,e,f)}function z(a,b,c,d,e){a=this;return a.g.o?a.g.o(b,c,d,e):a.g.call(null,b,c,d,e)}function D(a,b,c,d){a=this;return a.g.c?a.g.c(b,c,d):a.g.call(null,b,c,d)}function G(a,b,c){a=this;return a.g.b?
a.g.b(b,c):a.g.call(null,b,c)}function S(a,b){a=this;return a.g.a?a.g.a(b):a.g.call(null,b)}function la(a){a=this;return a.g.u?a.g.u():a.g.call(null)}var x=null,x=function(Fa,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,x,Wa,eb,qb,Kb,ic,Rc,qe){switch(arguments.length){case 1:return la.call(this,Fa);case 2:return S.call(this,Fa,R);case 3:return G.call(this,Fa,R,T);case 4:return D.call(this,Fa,R,T,U);case 5:return z.call(this,Fa,R,T,U,Y);case 6:return w.call(this,Fa,R,T,U,Y,ca);case 7:return v.call(this,Fa,R,
T,U,Y,ca,fa);case 8:return t.call(this,Fa,R,T,U,Y,ca,fa,ha);case 9:return r.call(this,Fa,R,T,U,Y,ca,fa,ha,ia);case 10:return q.call(this,Fa,R,T,U,Y,ca,fa,ha,ia,ka);case 11:return p.call(this,Fa,R,T,U,Y,ca,fa,ha,ia,ka,qa);case 12:return n.call(this,Fa,R,T,U,Y,ca,fa,ha,ia,ka,qa,za);case 13:return m.call(this,Fa,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga);case 14:return l.call(this,Fa,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka);case 15:return k.call(this,Fa,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,x);case 16:return h.call(this,
Fa,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,x,Wa);case 17:return f.call(this,Fa,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,x,Wa,eb);case 18:return e.call(this,Fa,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,x,Wa,eb,qb);case 19:return d.call(this,Fa,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,x,Wa,eb,qb,Kb);case 20:return c.call(this,Fa,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,x,Wa,eb,qb,Kb,ic);case 21:return b.call(this,Fa,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,x,Wa,eb,qb,Kb,ic,Rc);case 22:return a.call(this,Fa,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,
Ga,Ka,x,Wa,eb,qb,Kb,ic,Rc,qe)}throw Error("Invalid arity: "+arguments.length);};x.a=la;x.b=S;x.c=G;x.o=D;x.C=z;x.V=w;x.W=v;x.na=t;x.oa=r;x.ca=q;x.da=p;x.ea=n;x.fa=m;x.ga=l;x.ha=k;x.ia=h;x.ja=f;x.ka=e;x.la=d;x.ma=c;x.Cb=b;x.cb=a;return x}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.u=function(){return this.g.u?this.g.u():this.g.call(null)};g.a=function(a){return this.g.a?this.g.a(a):this.g.call(null,a)};
g.b=function(a,b){return this.g.b?this.g.b(a,b):this.g.call(null,a,b)};g.c=function(a,b,c){return this.g.c?this.g.c(a,b,c):this.g.call(null,a,b,c)};g.o=function(a,b,c,d){return this.g.o?this.g.o(a,b,c,d):this.g.call(null,a,b,c,d)};g.C=function(a,b,c,d,e){return this.g.C?this.g.C(a,b,c,d,e):this.g.call(null,a,b,c,d,e)};g.V=function(a,b,c,d,e,f){return this.g.V?this.g.V(a,b,c,d,e,f):this.g.call(null,a,b,c,d,e,f)};
g.W=function(a,b,c,d,e,f,h){return this.g.W?this.g.W(a,b,c,d,e,f,h):this.g.call(null,a,b,c,d,e,f,h)};g.na=function(a,b,c,d,e,f,h,k){return this.g.na?this.g.na(a,b,c,d,e,f,h,k):this.g.call(null,a,b,c,d,e,f,h,k)};g.oa=function(a,b,c,d,e,f,h,k,l){return this.g.oa?this.g.oa(a,b,c,d,e,f,h,k,l):this.g.call(null,a,b,c,d,e,f,h,k,l)};g.ca=function(a,b,c,d,e,f,h,k,l,m){return this.g.ca?this.g.ca(a,b,c,d,e,f,h,k,l,m):this.g.call(null,a,b,c,d,e,f,h,k,l,m)};
g.da=function(a,b,c,d,e,f,h,k,l,m,n){return this.g.da?this.g.da(a,b,c,d,e,f,h,k,l,m,n):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n)};g.ea=function(a,b,c,d,e,f,h,k,l,m,n,p){return this.g.ea?this.g.ea(a,b,c,d,e,f,h,k,l,m,n,p):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.fa=function(a,b,c,d,e,f,h,k,l,m,n,p,q){return this.g.fa?this.g.fa(a,b,c,d,e,f,h,k,l,m,n,p,q):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){return this.g.ga?this.g.ga(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){return this.g.ha?this.g.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t)};g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){return this.g.ia?this.g.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)};
g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){return this.g.ja?this.g.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)};g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){return this.g.ka?this.g.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)};
g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D){return this.g.la?this.g.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D)};g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G){return this.g.ma?this.g.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G)};
g.Cb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G,S){return F.cb?F.cb(this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G,S):F.call(null,this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G,S)};function Dc(a,b){return"function"==u(a)?new bd(a,b):null==a?null:pb(a,b)}function cd(a){var b=null!=a;return(b?null!=a?a.i&131072||a.Vb||(a.i?0:B(nb,a)):B(nb,a):b)?ob(a):null}function dd(a){return null==a?!1:null!=a?a.i&4096||a.tc?!0:a.i?!1:B(jb,a):B(jb,a)}
function ed(a){return null!=a?a.i&16777216||a.sc?!0:a.i?!1:B(xb,a):B(xb,a)}function fd(a){return null==a?!1:null!=a?a.i&1024||a.Tb?!0:a.i?!1:B(fb,a):B(fb,a)}function gd(a){return null!=a?a.i&16384||a.uc?!0:a.i?!1:B(kb,a):B(kb,a)}hd;id;function jd(a){return null!=a?a.B&512||a.nc?!0:!1:!1}function kd(a){var b=[];na(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function ld(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var md={};
function nd(a){return null==a?!1:null!=a?a.i&64||a.Ia?!0:a.i?!1:B(Xa,a):B(Xa,a)}function od(a){return null==a?!1:!1===a?!1:!0}function pd(a,b){return I.c(a,b,md)===md?!1:!0}
function ec(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return pa(a,b);throw Error([E("Cannot compare "),E(a),E(" to "),E(b)].join(""));}if(null!=a?a.B&2048||a.bb||(a.B?0:B(Ib,a)):B(Ib,a))return Jb(a,b);if("string"!==typeof a&&!La(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([E("Cannot compare "),E(a),E(" to "),E(b)].join(""));return pa(a,b)}
function qd(a,b){var c=Wc(a),d=Wc(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=ec(Yc(a,d),Yc(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}rd;var Tc=function Tc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Tc.b(arguments[0],arguments[1]);case 3:return Tc.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Tc.b=function(a,b){var c=J(b);if(c){var d=K(c),c=L(c);return Qa.c?Qa.c(a,d,c):Qa.call(null,a,d,c)}return a.u?a.u():a.call(null)};Tc.c=function(a,b,c){for(c=J(c);;)if(c){var d=K(c);b=a.b?a.b(b,d):a.call(null,b,d);if(Gc(b))return mb(b);c=L(c)}else return b};Tc.A=3;sd;
var Qa=function Qa(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Qa.b(arguments[0],arguments[1]);case 3:return Qa.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Qa.b=function(a,b){return null!=b&&(b.i&524288||b.Xb)?b.Y(null,a):La(b)?Jc(b,a):"string"===typeof b?Jc(b,a):B(rb,b)?sb.b(b,a):Tc.b(a,b)};
Qa.c=function(a,b,c){return null!=c&&(c.i&524288||c.Xb)?c.Z(null,a,b):La(c)?Kc(c,a,b):"string"===typeof c?Kc(c,a,b):B(rb,c)?sb.c(c,a,b):Tc.c(a,b,c)};Qa.A=3;function td(a){return a}var ud=function ud(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ud.u();case 1:return ud.a(arguments[0]);case 2:return ud.b(arguments[0],arguments[1]);default:return ud.m(arguments[0],arguments[1],new pc(c.slice(2),0))}};ud.u=function(){return 0};
ud.a=function(a){return a};ud.b=function(a,b){return a+b};ud.m=function(a,b,c){return Qa.c(ud,a+b,c)};ud.G=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return ud.m(b,a,c)};ud.A=2;ra.xc;vd;function vd(a,b){return(a%b+b)%b}function wd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function xd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function yd(a){var b=2;for(a=J(a);;)if(a&&0<b)--b,a=L(a);else return a}
var E=function E(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return E.u();case 1:return E.a(arguments[0]);default:return E.m(arguments[0],new pc(c.slice(1),0))}};E.u=function(){return""};E.a=function(a){return null==a?"":""+a};E.m=function(a,b){for(var c=new oa(""+E(a)),d=b;;)if(y(d))c=c.append(""+E(K(d))),d=L(d);else return c.toString()};E.G=function(a){var b=K(a);a=L(a);return E.m(b,a)};E.A=1;P;zd;
function Cc(a,b){var c;if(ed(b))if(Pc(a)&&Pc(b)&&Wc(a)!==Wc(b))c=!1;else a:{c=J(a);for(var d=J(b);;){if(null==c){c=null==d;break a}if(null!=d&&dc.b(K(c),K(d)))c=L(c),d=L(d);else{c=!1;break a}}}else c=null;return od(c)}function Mc(a){if(J(a)){var b=jc(K(a));for(a=L(a);;){if(null==a)return b;b=kc(b,jc(K(a)));a=L(a)}}else return 0}Ad;Bd;zd;Cd;Dd;function Oc(a,b,c,d,e){this.v=a;this.first=b;this.sa=c;this.count=d;this.s=e;this.i=65937646;this.B=8192}g=Oc.prototype;g.toString=function(){return Wb(this)};
g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){return 1===this.count?null:this.sa};g.X=function(){return this.count};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Tc.b(b,this)};g.Z=function(a,b,c){return Tc.c(b,c,this)};g.$=function(){return this.first};g.qa=function(){return 1===this.count?rc:this.sa};g.S=function(){return this};
g.R=function(a,b){return new Oc(b,this.first,this.sa,this.count,this.s)};g.T=function(a,b){return new Oc(this.v,b,this,this.count+1,null)};Oc.prototype[Oa]=function(){return tc(this)};function Ed(a){this.v=a;this.i=65937614;this.B=8192}g=Ed.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){return null};g.X=function(){return 0};g.N=function(){return yc};
g.w=function(a,b){return(null!=b?b.i&33554432||b.rc||(b.i?0:B(yb,b)):B(yb,b))||ed(b)?null==J(b):!1};g.Y=function(a,b){return Tc.b(b,this)};g.Z=function(a,b,c){return Tc.c(b,c,this)};g.$=function(){return null};g.qa=function(){return rc};g.S=function(){return null};g.R=function(a,b){return new Ed(b)};g.T=function(a,b){return new Oc(this.v,b,null,1,null)};var rc=new Ed(null);Ed.prototype[Oa]=function(){return tc(this)};
var bc=function bc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return bc.m(0<c.length?new pc(c.slice(0),0):null)};bc.m=function(a){var b;if(a instanceof pc&&0===a.j)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.$(null)),a=a.pa(null);else break a;a=b.length;for(var c=rc;;)if(0<a){var d=a-1,c=c.T(null,b[a-1]);a=d}else return c};bc.A=0;bc.G=function(a){return bc.m(J(a))};function Fd(a,b,c,d){this.v=a;this.first=b;this.sa=c;this.s=d;this.i=65929452;this.B=8192}
g=Fd.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){return null==this.sa?null:J(this.sa)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Tc.b(b,this)};g.Z=function(a,b,c){return Tc.c(b,c,this)};g.$=function(){return this.first};g.qa=function(){return null==this.sa?rc:this.sa};g.S=function(){return this};
g.R=function(a,b){return new Fd(b,this.first,this.sa,this.s)};g.T=function(a,b){return new Fd(null,b,this,this.s)};Fd.prototype[Oa]=function(){return tc(this)};function N(a,b){var c=null==b;return(c?c:null!=b&&(b.i&64||b.Ia))?new Fd(null,a,b,null):new Fd(null,a,J(b),null)}function Gd(a,b){if(a.Ea===b.Ea)return 0;var c=Ma(a.ra);if(y(c?b.ra:c))return-1;if(y(a.ra)){if(Ma(b.ra))return 1;c=pa(a.ra,b.ra);return 0===c?pa(a.name,b.name):c}return pa(a.name,b.name)}
function A(a,b,c,d){this.ra=a;this.name=b;this.Ea=c;this.Ta=d;this.i=2153775105;this.B=4096}g=A.prototype;g.toString=function(){return[E(":"),E(this.Ea)].join("")};g.equiv=function(a){return this.w(null,a)};g.w=function(a,b){return b instanceof A?this.Ea===b.Ea:!1};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return I.b(c,this);case 3:return I.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return I.b(c,this)};a.c=function(a,c,d){return I.c(c,this,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return I.b(a,this)};g.b=function(a,b){return I.c(a,this,b)};
g.N=function(){var a=this.Ta;return null!=a?a:this.Ta=a=kc(ac(this.name),hc(this.ra))+2654435769|0};g.gb=function(){return this.name};g.hb=function(){return this.ra};g.K=function(a,b){return zb(b,[E(":"),E(this.Ea)].join(""))};var Hd=function Hd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Hd.a(arguments[0]);case 2:return Hd.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Hd.a=function(a){if(a instanceof A)return a;if(a instanceof cc){var b;if(null!=a&&(a.B&4096||a.Wb))b=a.hb(null);else throw Error([E("Doesn't support namespace: "),E(a)].join(""));return new A(b,zd.a?zd.a(a):zd.call(null,a),a.Ga,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new A(b[0],b[1],a,null):new A(null,b[0],a,null)):null};Hd.b=function(a,b){return new A(a,b,[E(y(a)?[E(a),E("/")].join(""):null),E(b)].join(""),null)};Hd.A=2;
function Id(a,b,c,d){this.v=a;this.Xa=b;this.D=c;this.s=d;this.i=32374988;this.B=0}g=Id.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};function Jd(a){null!=a.Xa&&(a.D=a.Xa.u?a.Xa.u():a.Xa.call(null),a.Xa=null);return a.D}g.O=function(){return this.v};g.pa=function(){wb(this);return null==this.D?null:L(this.D)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Tc.b(b,this)};
g.Z=function(a,b,c){return Tc.c(b,c,this)};g.$=function(){wb(this);return null==this.D?null:K(this.D)};g.qa=function(){wb(this);return null!=this.D?qc(this.D):rc};g.S=function(){Jd(this);if(null==this.D)return null;for(var a=this.D;;)if(a instanceof Id)a=Jd(a);else return this.D=a,J(this.D)};g.R=function(a,b){return new Id(b,this.Xa,this.D,this.s)};g.T=function(a,b){return N(b,this)};Id.prototype[Oa]=function(){return tc(this)};Kd;function Ld(a,b){this.xb=a;this.end=b;this.i=2;this.B=0}
Ld.prototype.add=function(a){this.xb[this.end]=a;return this.end+=1};Ld.prototype.za=function(){var a=new Kd(this.xb,0,this.end);this.xb=null;return a};Ld.prototype.X=function(){return this.end};function Kd(a,b,c){this.f=a;this.ba=b;this.end=c;this.i=524306;this.B=0}g=Kd.prototype;g.X=function(){return this.end-this.ba};g.U=function(a,b){return this.f[this.ba+b]};g.ta=function(a,b,c){return 0<=b&&b<this.end-this.ba?this.f[this.ba+b]:c};
g.Gb=function(){if(this.ba===this.end)throw Error("-drop-first of empty chunk");return new Kd(this.f,this.ba+1,this.end)};g.Y=function(a,b){return Lc(this.f,b,this.f[this.ba],this.ba+1)};g.Z=function(a,b,c){return Lc(this.f,b,c,this.ba)};function hd(a,b,c,d){this.za=a;this.Fa=b;this.v=c;this.s=d;this.i=31850732;this.B=1536}g=hd.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};
g.pa=function(){if(1<Sa(this.za))return new hd(Lb(this.za),this.Fa,this.v,null);var a=wb(this.Fa);return null==a?null:a};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.$=function(){return H.b(this.za,0)};g.qa=function(){return 1<Sa(this.za)?new hd(Lb(this.za),this.Fa,this.v,null):null==this.Fa?rc:this.Fa};g.S=function(){return this};g.Ab=function(){return this.za};g.Bb=function(){return null==this.Fa?rc:this.Fa};
g.R=function(a,b){return new hd(this.za,this.Fa,b,this.s)};g.T=function(a,b){return N(b,this)};g.zb=function(){return null==this.Fa?null:this.Fa};hd.prototype[Oa]=function(){return tc(this)};function Md(a,b){return 0===Sa(a)?b:new hd(a,b,null,null)}function Nd(a,b){a.add(b)}function Cd(a){return Mb(a)}function Dd(a){return Nb(a)}function rd(a){for(var b=[];;)if(J(a))b.push(K(a)),a=L(a);else return b}
function Od(a,b){if(Pc(a))return Wc(a);for(var c=a,d=b,e=0;;)if(0<d&&J(c))c=L(c),--d,e+=1;else return e}var Pd=function Pd(b){return null==b?null:null==L(b)?J(K(b)):N(K(b),Pd(L(b)))},Qd=function Qd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Qd.u();case 1:return Qd.a(arguments[0]);case 2:return Qd.b(arguments[0],arguments[1]);default:return Qd.m(arguments[0],arguments[1],new pc(c.slice(2),0))}};
Qd.u=function(){return new Id(null,function(){return null},null,null)};Qd.a=function(a){return new Id(null,function(){return a},null,null)};Qd.b=function(a,b){return new Id(null,function(){var c=J(a);return c?jd(c)?Md(Mb(c),Qd.b(Nb(c),b)):N(K(c),Qd.b(qc(c),b)):b},null,null)};Qd.m=function(a,b,c){return function e(a,b){return new Id(null,function(){var c=J(a);return c?jd(c)?Md(Mb(c),e(Nb(c),b)):N(K(c),e(qc(c),b)):y(b)?e(K(b),L(b)):null},null,null)}(Qd.b(a,b),c)};
Qd.G=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return Qd.m(b,a,c)};Qd.A=2;var Rd=function Rd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Rd.u();case 1:return Rd.a(arguments[0]);case 2:return Rd.b(arguments[0],arguments[1]);default:return Rd.m(arguments[0],arguments[1],new pc(c.slice(2),0))}};Rd.u=function(){return Db(Vc)};Rd.a=function(a){return a};Rd.b=function(a,b){return Eb(a,b)};
Rd.m=function(a,b,c){for(;;)if(a=Eb(a,b),y(c))b=K(c),c=L(c);else return a};Rd.G=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return Rd.m(b,a,c)};Rd.A=2;
function Sd(a,b,c){var d=J(c);if(0===b)return a.u?a.u():a.call(null);c=Ya(d);var e=Za(d);if(1===b)return a.a?a.a(c):a.a?a.a(c):a.call(null,c);var d=Ya(e),f=Za(e);if(2===b)return a.b?a.b(c,d):a.b?a.b(c,d):a.call(null,c,d);var e=Ya(f),h=Za(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=Ya(h),k=Za(h);if(4===b)return a.o?a.o(c,d,e,f):a.o?a.o(c,d,e,f):a.call(null,c,d,e,f);var h=Ya(k),l=Za(k);if(5===b)return a.C?a.C(c,d,e,f,h):a.C?a.C(c,d,e,f,h):a.call(null,c,d,e,f,h);var k=Ya(l),
m=Za(l);if(6===b)return a.V?a.V(c,d,e,f,h,k):a.V?a.V(c,d,e,f,h,k):a.call(null,c,d,e,f,h,k);var l=Ya(m),n=Za(m);if(7===b)return a.W?a.W(c,d,e,f,h,k,l):a.W?a.W(c,d,e,f,h,k,l):a.call(null,c,d,e,f,h,k,l);var m=Ya(n),p=Za(n);if(8===b)return a.na?a.na(c,d,e,f,h,k,l,m):a.na?a.na(c,d,e,f,h,k,l,m):a.call(null,c,d,e,f,h,k,l,m);var n=Ya(p),q=Za(p);if(9===b)return a.oa?a.oa(c,d,e,f,h,k,l,m,n):a.oa?a.oa(c,d,e,f,h,k,l,m,n):a.call(null,c,d,e,f,h,k,l,m,n);var p=Ya(q),r=Za(q);if(10===b)return a.ca?a.ca(c,d,e,f,h,
k,l,m,n,p):a.ca?a.ca(c,d,e,f,h,k,l,m,n,p):a.call(null,c,d,e,f,h,k,l,m,n,p);var q=Ya(r),t=Za(r);if(11===b)return a.da?a.da(c,d,e,f,h,k,l,m,n,p,q):a.da?a.da(c,d,e,f,h,k,l,m,n,p,q):a.call(null,c,d,e,f,h,k,l,m,n,p,q);var r=Ya(t),v=Za(t);if(12===b)return a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q,r):a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q,r):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r);var t=Ya(v),w=Za(v);if(13===b)return a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r,t):a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r,t):a.call(null,c,d,e,f,h,k,l,m,n,p,q,
r,t);var v=Ya(w),z=Za(w);if(14===b)return a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v);var w=Ya(z),D=Za(z);if(15===b)return a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w);var z=Ya(D),G=Za(D);if(16===b)return a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z);var D=Ya(G),
S=Za(G);if(17===b)return a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D);var G=Ya(S),la=Za(S);if(18===b)return a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G):a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G);S=Ya(la);la=Za(la);if(19===b)return a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G,S):a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G,S):a.call(null,c,d,e,f,h,k,
l,m,n,p,q,r,t,v,w,z,D,G,S);var x=Ya(la);Za(la);if(20===b)return a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G,S,x):a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G,S,x):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G,S,x);throw Error("Only up to 20 arguments supported on functions");}
var F=function F(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return F.b(arguments[0],arguments[1]);case 3:return F.c(arguments[0],arguments[1],arguments[2]);case 4:return F.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return F.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return F.m(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new pc(c.slice(5),0))}};
F.b=function(a,b){var c=a.A;if(a.G){var d=Od(b,c+1);return d<=c?Sd(a,d,b):a.G(b)}return a.apply(a,rd(b))};F.c=function(a,b,c){b=N(b,c);c=a.A;if(a.G){var d=Od(b,c+1);return d<=c?Sd(a,d,b):a.G(b)}return a.apply(a,rd(b))};F.o=function(a,b,c,d){b=N(b,N(c,d));c=a.A;return a.G?(d=Od(b,c+1),d<=c?Sd(a,d,b):a.G(b)):a.apply(a,rd(b))};F.C=function(a,b,c,d,e){b=N(b,N(c,N(d,e)));c=a.A;return a.G?(d=Od(b,c+1),d<=c?Sd(a,d,b):a.G(b)):a.apply(a,rd(b))};
F.m=function(a,b,c,d,e,f){b=N(b,N(c,N(d,N(e,Pd(f)))));c=a.A;return a.G?(d=Od(b,c+1),d<=c?Sd(a,d,b):a.G(b)):a.apply(a,rd(b))};F.G=function(a){var b=K(a),c=L(a);a=K(c);var d=L(c),c=K(d),e=L(d),d=K(e),f=L(e),e=K(f),f=L(f);return F.m(b,a,c,d,e,f)};F.A=5;
var Td=function Td(){"undefined"===typeof sa&&(sa=function(b,c){this.jc=b;this.ic=c;this.i=393216;this.B=0},sa.prototype.R=function(b,c){return new sa(this.jc,c)},sa.prototype.O=function(){return this.ic},sa.prototype.ua=function(){return!1},sa.prototype.next=function(){return Error("No such element")},sa.prototype.remove=function(){return Error("Unsupported operation")},sa.fc=function(){return new Q(null,2,5,V,[Dc(Ud,new ya(null,1,[Vd,bc(Wd,bc(Vc))],null)),ra.wc],null)},sa.Db=!0,sa.lb="cljs.core/t_cljs$core15371",
sa.Mb=function(b,c){return zb(c,"cljs.core/t_cljs$core15371")});return new sa(Td,Xd)};Yd;function Yd(a,b,c,d){this.$a=a;this.first=b;this.sa=c;this.v=d;this.i=31719628;this.B=0}g=Yd.prototype;g.R=function(a,b){return new Yd(this.$a,this.first,this.sa,b)};g.T=function(a,b){return N(b,wb(this))};g.w=function(a,b){return null!=wb(this)?Cc(this,b):ed(b)&&null==J(b)};g.N=function(){return xc(this)};g.S=function(){null!=this.$a&&this.$a.step(this);return null==this.sa?null:this};
g.$=function(){null!=this.$a&&wb(this);return null==this.sa?null:this.first};g.qa=function(){null!=this.$a&&wb(this);return null==this.sa?rc:this.sa};g.pa=function(){null!=this.$a&&wb(this);return null==this.sa?null:wb(this.sa)};Yd.prototype[Oa]=function(){return tc(this)};function Zd(a,b){for(;;){if(null==J(b))return!0;var c;c=K(b);c=a.a?a.a(c):a.call(null,c);if(y(c)){c=a;var d=L(b);a=c;b=d}else return!1}}
function $d(a){for(var b=td;;)if(J(a)){var c;c=K(a);c=b.a?b.a(c):b.call(null,c);if(y(c))return c;a=L(a)}else return null}
function ae(a){return function(){function b(b,c){return Ma(a.b?a.b(b,c):a.call(null,b,c))}function c(b){return Ma(a.a?a.a(b):a.call(null,b))}function d(){return Ma(a.u?a.u():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new pc(h,0)}return c.call(this,a,d,f)}function c(b,d,e){return Ma(F.o(a,b,d,e))}b.A=2;b.G=function(a){var b=K(a);a=L(a);var d=K(a);a=qc(a);return c(b,d,a)};b.m=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new pc(n,0)}return f.m(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.A=2;e.G=f.G;e.u=d;e.a=c;e.b=b;e.m=f.m;return e}()}be;function ce(a,b,c,d){this.state=a;this.v=b;this.mc=c;this.ub=d;this.B=16386;this.i=6455296}g=ce.prototype;
g.equiv=function(a){return this.w(null,a)};g.w=function(a,b){return this===b};g.sb=function(){return this.state};g.O=function(){return this.v};g.Kb=function(a,b,c){a=J(this.ub);for(var d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f),k=O(h,0),h=O(h,1);h.o?h.o(k,this,b,c):h.call(null,k,this,b,c);f+=1}else if(a=J(a))jd(a)?(d=Mb(a),a=Nb(a),k=d,e=Wc(d),d=k):(d=K(a),k=O(d,0),h=O(d,1),h.o?h.o(k,this,b,c):h.call(null,k,this,b,c),a=L(a),d=null,e=0),f=0;else return null};
g.Jb=function(a,b,c){this.ub=$c.c(this.ub,b,c);return this};g.N=function(){return this[da]||(this[da]=++ea)};var W=function W(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return W.a(arguments[0]);default:return W.m(arguments[0],new pc(c.slice(1),0))}};W.a=function(a){return new ce(a,null,null,null)};W.m=function(a,b){var c=null!=b&&(b.i&64||b.Ia)?F.b(Bc,b):b,d=I.b(c,Ca),c=I.b(c,de);return new ce(a,d,c,null)};
W.G=function(a){var b=K(a);a=L(a);return W.m(b,a)};W.A=1;ee;function fe(a,b){if(a instanceof ce){var c=a.mc;if(null!=c&&!y(c.a?c.a(b):c.call(null,b)))throw Error([E("Assert failed: "),E("Validator rejected reference state"),E("\n"),E(function(){var a=bc(ge,he);return ee.a?ee.a(a):ee.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.ub&&Bb(a,c,b);return b}return Rb(a,b)}
var ie=function ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ie.b(arguments[0],arguments[1]);case 3:return ie.c(arguments[0],arguments[1],arguments[2]);case 4:return ie.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return ie.m(arguments[0],arguments[1],arguments[2],arguments[3],new pc(c.slice(4),0))}};ie.b=function(a,b){var c;a instanceof ce?(c=a.state,c=b.a?b.a(c):b.call(null,c),c=fe(a,c)):c=Sb.b(a,b);return c};
ie.c=function(a,b,c){if(a instanceof ce){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=fe(a,b)}else a=Sb.c(a,b,c);return a};ie.o=function(a,b,c,d){if(a instanceof ce){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=fe(a,b)}else a=Sb.o(a,b,c,d);return a};ie.m=function(a,b,c,d,e){return a instanceof ce?fe(a,F.C(b,a.state,c,d,e)):Sb.C(a,b,c,d,e)};ie.G=function(a){var b=K(a),c=L(a);a=K(c);var d=L(c),c=K(d),e=L(d),d=K(e),e=L(e);return ie.m(b,a,c,d,e)};ie.A=4;
function je(a){this.state=a;this.i=32768;this.B=0}je.prototype.sb=function(){return this.state};function be(a){return new je(a)}
var P=function P(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return P.a(arguments[0]);case 2:return P.b(arguments[0],arguments[1]);case 3:return P.c(arguments[0],arguments[1],arguments[2]);case 4:return P.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return P.m(arguments[0],arguments[1],arguments[2],arguments[3],new pc(c.slice(4),0))}};
P.a=function(a){return function(b){return function(){function c(c,d){var e=a.a?a.a(d):a.call(null,d);return b.b?b.b(c,e):b.call(null,c,e)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.u?b.u():b.call(null)}var f=null,h=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new pc(h,0)}return d.call(this,a,b,f)}function d(c,e,f){e=F.c(a,e,f);return b.b?b.b(c,e):b.call(null,c,e)}c.A=2;c.G=function(a){var b=
K(a);a=L(a);var c=K(a);a=qc(a);return d(b,c,a)};c.m=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new pc(p,0)}return h.m(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.A=2;f.G=h.G;f.u=e;f.a=d;f.b=c;f.m=h.m;return f}()}};
P.b=function(a,b){return new Id(null,function(){var c=J(b);if(c){if(jd(c)){for(var d=Mb(c),e=Wc(d),f=new Ld(Array(e),0),h=0;;)if(h<e)Nd(f,function(){var b=H.b(d,h);return a.a?a.a(b):a.call(null,b)}()),h+=1;else break;return Md(f.za(),P.b(a,Nb(c)))}return N(function(){var b=K(c);return a.a?a.a(b):a.call(null,b)}(),P.b(a,qc(c)))}return null},null,null)};
P.c=function(a,b,c){return new Id(null,function(){var d=J(b),e=J(c);if(d&&e){var f=N,h;h=K(d);var k=K(e);h=a.b?a.b(h,k):a.call(null,h,k);d=f(h,P.c(a,qc(d),qc(e)))}else d=null;return d},null,null)};P.o=function(a,b,c,d){return new Id(null,function(){var e=J(b),f=J(c),h=J(d);if(e&&f&&h){var k=N,l;l=K(e);var m=K(f),n=K(h);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=k(l,P.o(a,qc(e),qc(f),qc(h)))}else e=null;return e},null,null)};
P.m=function(a,b,c,d,e){var f=function k(a){return new Id(null,function(){var b=P.b(J,a);return Zd(td,b)?N(P.b(K,b),k(P.b(qc,b))):null},null,null)};return P.b(function(){return function(b){return F.b(a,b)}}(f),f(Uc.m(e,d,nc([c,b],0))))};P.G=function(a){var b=K(a),c=L(a);a=K(c);var d=L(c),c=K(d),e=L(d),d=K(e),e=L(e);return P.m(b,a,c,d,e)};P.A=4;
function ke(a,b){if("number"!==typeof a)throw Error([E("Assert failed: "),E(function(){var a=bc(le,me);return ee.a?ee.a(a):ee.call(null,a)}())].join(""));return new Id(null,function(){if(0<a){var c=J(b);return c?N(K(c),ke(a-1,qc(c))):null}return null},null,null)}
function ne(a,b){if("number"!==typeof a)throw Error([E("Assert failed: "),E(function(){var a=bc(le,me);return ee.a?ee.a(a):ee.call(null,a)}())].join(""));return new Id(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=J(b);if(0<a&&e){var f=a-1,e=qc(e);a=f;b=e}else return e}}),null,null)}function oe(a){return new Id(null,function(){return N(a,oe(a))},null,null)}
var pe=function pe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return pe.b(arguments[0],arguments[1]);default:return pe.m(arguments[0],arguments[1],new pc(c.slice(2),0))}};pe.b=function(a,b){return new Id(null,function(){var c=J(a),d=J(b);return c&&d?N(K(c),N(K(d),pe.b(qc(c),qc(d)))):null},null,null)};
pe.m=function(a,b,c){return new Id(null,function(){var d=P.b(J,Uc.m(c,b,nc([a],0)));return Zd(td,d)?Qd.b(P.b(K,d),F.b(pe,P.b(qc,d))):null},null,null)};pe.G=function(a){var b=K(a),c=L(a);a=K(c);c=L(c);return pe.m(b,a,c)};pe.A=2;re;function se(a,b){return F.b(Qd,F.c(P,a,b))}
function te(a,b){return new Id(null,function(){var c=J(b);if(c){if(jd(c)){for(var d=Mb(c),e=Wc(d),f=new Ld(Array(e),0),h=0;;)if(h<e){var k;k=H.b(d,h);k=a.a?a.a(k):a.call(null,k);y(k)&&(k=H.b(d,h),f.add(k));h+=1}else break;return Md(f.za(),te(a,Nb(c)))}d=K(c);c=qc(c);return y(a.a?a.a(d):a.call(null,d))?N(d,te(a,c)):te(a,c)}return null},null,null)}
function ue(a){return function c(a){return new Id(null,function(){return N(a,y(nd.a?nd.a(a):nd.call(null,a))?se(c,nc([J.a?J.a(a):J.call(null,a)],0)):null)},null,null)}(a)}function ve(a,b,c){return new Id(null,function(){var d=J(c);if(d){var e=ke(a,d);return a===Wc(e)?N(e,ve(a,b,ne(b,d))):null}return null},null,null)}function we(a,b){this.L=a;this.f=b}
function xe(a){return new we(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function ye(a){a=a.l;return 32>a?0:a-1>>>5<<5}function ze(a,b,c){for(;;){if(0===b)return c;var d=xe(a);d.f[0]=c;c=d;b-=5}}var Ae=function Ae(b,c,d,e){var f=new we(d.L,Pa(d.f)),h=b.l-1>>>c&31;5===c?f.f[h]=e:(d=d.f[h],b=null!=d?Ae(b,c-5,d,e):ze(null,c-5,e),f.f[h]=b);return f};
function Be(a,b){throw Error([E("No item "),E(a),E(" in vector of length "),E(b)].join(""));}function Ce(a,b){if(b>=ye(a))return a.I;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function De(a,b){return 0<=b&&b<a.l?Ce(a,b):Be(b,a.l)}var Ee=function Ee(b,c,d,e,f){var h=new we(d.L,Pa(d.f));if(0===c)h.f[e&31]=f;else{var k=e>>>c&31;b=Ee(b,c-5,d.f[k],e,f);h.f[k]=b}return h};function Fe(a,b,c,d,e,f){this.j=a;this.wb=b;this.f=c;this.Ha=d;this.start=e;this.end=f}
Fe.prototype.ua=function(){return this.j<this.end};Fe.prototype.next=function(){32===this.j-this.wb&&(this.f=Ce(this.Ha,this.j),this.wb+=32);var a=this.f[this.j&31];this.j+=1;return a};Ge;He;Ie;M;Je;Ke;Le;function Q(a,b,c,d,e,f){this.v=a;this.l=b;this.shift=c;this.root=d;this.I=e;this.s=f;this.i=167668511;this.B=8196}g=Q.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.J=function(a,b){return bb.c(this,b,null)};
g.H=function(a,b,c){return"number"===typeof b?H.c(this,b,c):c};g.U=function(a,b){return De(this,b)[b&31]};g.ta=function(a,b,c){return 0<=b&&b<this.l?Ce(this,b)[b&31]:c};g.Pa=function(a,b,c){if(0<=b&&b<this.l)return ye(this)<=b?(a=Pa(this.I),a[b&31]=c,new Q(this.v,this.l,this.shift,this.root,a,null)):new Q(this.v,this.l,this.shift,Ee(this,this.shift,this.root,b,c),this.I,null);if(b===this.l)return Ua(this,c);throw Error([E("Index "),E(b),E(" out of bounds  [0,"),E(this.l),E("]")].join(""));};
g.Da=function(){var a=this.l;return new Fe(0,0,0<Wc(this)?Ce(this,0):null,this,0,a)};g.O=function(){return this.v};g.X=function(){return this.l};g.eb=function(){return H.b(this,0)};g.fb=function(){return H.b(this,1)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){if(b instanceof Q)if(this.l===Wc(b))for(var c=Ub(this),d=Ub(b);;)if(y(c.ua())){var e=c.next(),f=d.next();if(!dc.b(e,f))return!1}else return!0;else return!1;else return Cc(this,b)};
g.Va=function(){return new Ie(this.l,this.shift,Ge.a?Ge.a(this.root):Ge.call(null,this.root),He.a?He.a(this.I):He.call(null,this.I))};g.Y=function(a,b){return Hc(this,b)};g.Z=function(a,b,c){a=0;for(var d=c;;)if(a<this.l){var e=Ce(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=e[f],d=b.b?b.b(d,h):b.call(null,d,h);if(Gc(d)){e=d;break a}f+=1}else{e=d;break a}if(Gc(e))return M.a?M.a(e):M.call(null,e);a+=c;d=e}else return d};
g.Oa=function(a,b,c){if("number"===typeof b)return lb(this,b,c);throw Error("Vector's key for assoc must be a number.");};g.S=function(){if(0===this.l)return null;if(32>=this.l)return new pc(this.I,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return Le.o?Le.o(this,a,0,0):Le.call(null,this,a,0,0)};g.R=function(a,b){return new Q(b,this.l,this.shift,this.root,this.I,this.s)};
g.T=function(a,b){if(32>this.l-ye(this)){for(var c=this.I.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.I[e],e+=1;else break;d[c]=b;return new Q(this.v,this.l+1,this.shift,this.root,d,null)}c=(d=this.l>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=xe(null),d.f[0]=this.root,e=ze(null,this.shift,new we(null,this.I)),d.f[1]=e):d=Ae(this,this.shift,this.root,new we(null,this.I));return new Q(this.v,this.l+1,c,d,[b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.U(null,c);case 3:return this.ta(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.U(null,c)};a.c=function(a,c,d){return this.ta(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.U(null,a)};g.b=function(a,b){return this.ta(null,a,b)};
var V=new we(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Vc=new Q(null,0,5,V,[],yc);Q.prototype[Oa]=function(){return tc(this)};function sd(a){if(La(a))a:{var b=a.length;if(32>b)a=new Q(null,b,5,V,a,null);else for(var c=32,d=(new Q(null,32,5,V,a.slice(0,32),null)).Va(null);;)if(c<b)var e=c+1,d=Rd.b(d,a[c]),c=e;else{a=Fb(d);break a}}else a=Fb(Qa.c(Eb,Db(Vc),a));return a}Me;
function id(a,b,c,d,e,f){this.xa=a;this.node=b;this.j=c;this.ba=d;this.v=e;this.s=f;this.i=32375020;this.B=1536}g=id.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){if(this.ba+1<this.node.length){var a;a=this.xa;var b=this.node,c=this.j,d=this.ba+1;a=Le.o?Le.o(a,b,c,d):Le.call(null,a,b,c,d);return null==a?null:a}return Ob(this)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};
g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){var c;c=this.xa;var d=this.j+this.ba,e=Wc(this.xa);c=Me.c?Me.c(c,d,e):Me.call(null,c,d,e);return Hc(c,b)};g.Z=function(a,b,c){a=this.xa;var d=this.j+this.ba,e=Wc(this.xa);a=Me.c?Me.c(a,d,e):Me.call(null,a,d,e);return Ic(a,b,c)};g.$=function(){return this.node[this.ba]};g.qa=function(){if(this.ba+1<this.node.length){var a;a=this.xa;var b=this.node,c=this.j,d=this.ba+1;a=Le.o?Le.o(a,b,c,d):Le.call(null,a,b,c,d);return null==a?rc:a}return Nb(this)};
g.S=function(){return this};g.Ab=function(){var a=this.node;return new Kd(a,this.ba,a.length)};g.Bb=function(){var a=this.j+this.node.length;if(a<Sa(this.xa)){var b=this.xa,c=Ce(this.xa,a);return Le.o?Le.o(b,c,a,0):Le.call(null,b,c,a,0)}return rc};g.R=function(a,b){return Le.C?Le.C(this.xa,this.node,this.j,this.ba,b):Le.call(null,this.xa,this.node,this.j,this.ba,b)};g.T=function(a,b){return N(b,this)};
g.zb=function(){var a=this.j+this.node.length;if(a<Sa(this.xa)){var b=this.xa,c=Ce(this.xa,a);return Le.o?Le.o(b,c,a,0):Le.call(null,b,c,a,0)}return null};id.prototype[Oa]=function(){return tc(this)};
var Le=function Le(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Le.c(arguments[0],arguments[1],arguments[2]);case 4:return Le.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Le.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Le.c=function(a,b,c){return new id(a,De(a,b),b,c,null,null)};
Le.o=function(a,b,c,d){return new id(a,b,c,d,null,null)};Le.C=function(a,b,c,d,e){return new id(a,b,c,d,e,null)};Le.A=5;Ne;function Oe(a,b,c,d,e){this.v=a;this.Ha=b;this.start=c;this.end=d;this.s=e;this.i=167666463;this.B=8192}g=Oe.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?H.c(this,b,c):c};
g.U=function(a,b){return 0>b||this.end<=this.start+b?Be(b,this.end-this.start):H.b(this.Ha,this.start+b)};g.ta=function(a,b,c){return 0>b||this.end<=this.start+b?c:H.c(this.Ha,this.start+b,c)};g.Pa=function(a,b,c){var d=this.start+b;a=this.v;c=$c.c(this.Ha,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Ne.C?Ne.C(a,c,b,d,null):Ne.call(null,a,c,b,d,null)};g.O=function(){return this.v};g.X=function(){return this.end-this.start};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};
g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Hc(this,b)};g.Z=function(a,b,c){return Ic(this,b,c)};g.Oa=function(a,b,c){if("number"===typeof b)return lb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};g.S=function(){var a=this;return function(b){return function d(e){return e===a.end?null:N(H.b(a.Ha,e),new Id(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
g.R=function(a,b){return Ne.C?Ne.C(b,this.Ha,this.start,this.end,this.s):Ne.call(null,b,this.Ha,this.start,this.end,this.s)};g.T=function(a,b){var c=this.v,d=lb(this.Ha,this.end,b),e=this.start,f=this.end+1;return Ne.C?Ne.C(c,d,e,f,null):Ne.call(null,c,d,e,f,null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.U(null,c);case 3:return this.ta(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.U(null,c)};a.c=function(a,c,d){return this.ta(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.U(null,a)};g.b=function(a,b){return this.ta(null,a,b)};Oe.prototype[Oa]=function(){return tc(this)};
function Ne(a,b,c,d,e){for(;;)if(b instanceof Oe)c=b.start+c,d=b.start+d,b=b.Ha;else{var f=Wc(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Oe(a,b,c,d,e)}}var Me=function Me(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Me.b(arguments[0],arguments[1]);case 3:return Me.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Me.b=function(a,b){return Me.c(a,b,Wc(a))};Me.c=function(a,b,c){return Ne(null,a,b,c,null)};Me.A=3;function Pe(a,b){return a===b.L?b:new we(a,Pa(b.f))}function Ge(a){return new we({},Pa(a.f))}function He(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];ld(a,0,b,0,a.length);return b}
var Qe=function Qe(b,c,d,e){d=Pe(b.root.L,d);var f=b.l-1>>>c&31;if(5===c)b=e;else{var h=d.f[f];b=null!=h?Qe(b,c-5,h,e):ze(b.root.L,c-5,e)}d.f[f]=b;return d};function Ie(a,b,c,d){this.l=a;this.shift=b;this.root=c;this.I=d;this.B=88;this.i=275}g=Ie.prototype;
g.jb=function(a,b){if(this.root.L){if(32>this.l-ye(this))this.I[this.l&31]=b;else{var c=new we(this.root.L,this.I),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.I=d;if(this.l>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=ze(this.root.L,this.shift,c);this.root=new we(this.root.L,d);this.shift=e}else this.root=Qe(this,this.shift,this.root,c)}this.l+=1;return this}throw Error("conj! after persistent!");};g.kb=function(){if(this.root.L){this.root.L=null;var a=this.l-ye(this),b=Array(a);ld(this.I,0,b,0,a);return new Q(null,this.l,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
g.ib=function(a,b,c){if("number"===typeof b)return Hb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
g.Ib=function(a,b,c){var d=this;if(d.root.L){if(0<=b&&b<d.l)return ye(this)<=b?d.I[b&31]=c:(a=function(){return function f(a,k){var l=Pe(d.root.L,k);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.l)return Eb(this,c);throw Error([E("Index "),E(b),E(" out of bounds for TransientVector of length"),E(d.l)].join(""));}throw Error("assoc! after persistent!");};
g.X=function(){if(this.root.L)return this.l;throw Error("count after persistent!");};g.U=function(a,b){if(this.root.L)return De(this,b)[b&31];throw Error("nth after persistent!");};g.ta=function(a,b,c){return 0<=b&&b<this.l?H.b(this,b):c};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?H.c(this,b,c):c};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};function Re(){this.i=2097152;this.B=0}
Re.prototype.equiv=function(a){return this.w(null,a)};Re.prototype.w=function(){return!1};var Se=new Re;function Te(a,b){return od(fd(b)?Wc(a)===Wc(b)?Zd(td,P.b(function(a){return dc.b(I.c(b,K(a),Se),K(L(a)))},a)):null:null)}function Ue(a){this.D=a}Ue.prototype.next=function(){if(null!=this.D){var a=K(this.D),b=O(a,0),a=O(a,1);this.D=L(this.D);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Ve(a){return new Ue(J(a))}function We(a){this.D=a}
We.prototype.next=function(){if(null!=this.D){var a=K(this.D);this.D=L(this.D);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Xe(a,b){var c;if(b instanceof A)a:{c=a.length;for(var d=b.Ea,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof A&&d===a[e].Ea){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof cc)a:for(c=a.length,d=b.Ga,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof cc&&d===a[e].Ga){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(dc.b(b,a[d])){c=d;break a}d+=2}return c}Ye;function Ze(a,b,c){this.f=a;this.j=b;this.ya=c;this.i=32374990;this.B=0}g=Ze.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.ya};g.pa=function(){return this.j<this.f.length-2?new Ze(this.f,this.j+2,this.ya):null};g.X=function(){return(this.f.length-this.j)/2};g.N=function(){return xc(this)};g.w=function(a,b){return Cc(this,b)};
g.Y=function(a,b){return Tc.b(b,this)};g.Z=function(a,b,c){return Tc.c(b,c,this)};g.$=function(){return new Q(null,2,5,V,[this.f[this.j],this.f[this.j+1]],null)};g.qa=function(){return this.j<this.f.length-2?new Ze(this.f,this.j+2,this.ya):rc};g.S=function(){return this};g.R=function(a,b){return new Ze(this.f,this.j,b)};g.T=function(a,b){return N(b,this)};Ze.prototype[Oa]=function(){return tc(this)};$e;af;function bf(a,b,c){this.f=a;this.j=b;this.l=c}bf.prototype.ua=function(){return this.j<this.l};
bf.prototype.next=function(){var a=new Q(null,2,5,V,[this.f[this.j],this.f[this.j+1]],null);this.j+=2;return a};function ya(a,b,c,d){this.v=a;this.l=b;this.f=c;this.s=d;this.i=16647951;this.B=8196}g=ya.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.keys=function(){return tc($e.a?$e.a(this):$e.call(null,this))};g.entries=function(){return Ve(J(this))};g.values=function(){return tc(af.a?af.a(this):af.call(null,this))};g.has=function(a){return pd(this,a)};
g.get=function(a,b){return this.H(null,a,b)};g.forEach=function(a){for(var b=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=O(f,0),f=O(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=J(b))jd(b)?(c=Mb(b),b=Nb(b),h=c,d=Wc(c),c=h):(c=K(b),h=O(c,0),f=O(c,1),a.b?a.b(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){a=Xe(this.f,b);return-1===a?c:this.f[a+1]};g.Da=function(){return new bf(this.f,0,2*this.l)};g.O=function(){return this.v};
g.X=function(){return this.l};g.N=function(){var a=this.s;return null!=a?a:this.s=a=zc(this)};g.w=function(a,b){if(null!=b&&(b.i&1024||b.Tb)){var c=this.f.length;if(this.l===b.X(null))for(var d=0;;)if(d<c){var e=b.H(null,this.f[d],md);if(e!==md)if(dc.b(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Te(this,b)};g.Va=function(){return new Ye({},this.f.length,Pa(this.f))};g.Y=function(a,b){return Tc.b(b,this)};g.Z=function(a,b,c){return Tc.c(b,c,this)};
g.Oa=function(a,b,c){a=Xe(this.f,b);if(-1===a){if(this.l<cf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new ya(this.v,this.l+1,e,null)}a=ad;null!=a?null!=a&&(a.B&4||a.pc)?(d=Qa.c(Eb,Db(a),this),d=Fb(d),a=Dc(d,cd(a))):a=Qa.c(Ua,a,this):a=Qa.c(Uc,rc,this);return pb(db(a,b,c),this.v)}if(c===this.f[a+1])return this;b=Pa(this.f);b[a+1]=c;return new ya(this.v,this.l,b,null)};g.yb=function(a,b){return-1!==Xe(this.f,b)};
g.S=function(){var a=this.f;return 0<=a.length-2?new Ze(a,0,null):null};g.R=function(a,b){return new ya(b,this.l,this.f,this.s)};g.T=function(a,b){if(gd(b))return db(this,H.b(b,0),H.b(b,1));for(var c=this,d=J(b);;){if(null==d)return c;var e=K(d);if(gd(e))c=db(c,H.b(e,0),H.b(e,1)),d=L(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};var Xd=new ya(null,0,[],Ac),cf=8;ya.prototype[Oa]=function(){return tc(this)};
df;function Ye(a,b,c){this.Wa=a;this.Sa=b;this.f=c;this.i=258;this.B=56}g=Ye.prototype;g.X=function(){if(y(this.Wa))return wd(this.Sa);throw Error("count after persistent!");};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){if(y(this.Wa))return a=Xe(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
g.jb=function(a,b){if(y(this.Wa)){if(null!=b?b.i&2048||b.Ub||(b.i?0:B(gb,b)):B(gb,b))return Gb(this,Ad.a?Ad.a(b):Ad.call(null,b),Bd.a?Bd.a(b):Bd.call(null,b));for(var c=J(b),d=this;;){var e=K(c);if(y(e))c=L(c),d=Gb(d,Ad.a?Ad.a(e):Ad.call(null,e),Bd.a?Bd.a(e):Bd.call(null,e));else return d}}else throw Error("conj! after persistent!");};g.kb=function(){if(y(this.Wa))return this.Wa=!1,new ya(null,wd(this.Sa),this.f,null);throw Error("persistent! called twice");};
g.ib=function(a,b,c){if(y(this.Wa)){a=Xe(this.f,b);if(-1===a){if(this.Sa+2<=2*cf)return this.Sa+=2,this.f.push(b),this.f.push(c),this;a=df.b?df.b(this.Sa,this.f):df.call(null,this.Sa,this.f);return Gb(a,b,c)}c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};ef;Zc;function df(a,b){for(var c=Db(ad),d=0;;)if(d<a)c=Gb(c,b[d],b[d+1]),d+=2;else return c}function ff(){this.M=!1}gf;hf;fe;jf;W;M;
function kf(a,b){return a===b?!0:a===b||a instanceof A&&b instanceof A&&a.Ea===b.Ea?!0:dc.b(a,b)}function lf(a,b,c){a=Pa(a);a[b]=c;return a}function mf(a,b,c,d){a=a.Qa(b);a.f[c]=d;return a}nf;function of(a,b,c,d){this.f=a;this.j=b;this.qb=c;this.Ca=d}of.prototype.advance=function(){for(var a=this.f.length;;)if(this.j<a){var b=this.f[this.j],c=this.f[this.j+1];null!=b?b=this.qb=new Q(null,2,5,V,[b,c],null):null!=c?(b=Ub(c),b=b.ua()?this.Ca=b:!1):b=!1;this.j+=2;if(b)return!0}else return!1};
of.prototype.ua=function(){var a=null!=this.qb;return a?a:(a=null!=this.Ca)?a:this.advance()};of.prototype.next=function(){if(null!=this.qb){var a=this.qb;this.qb=null;return a}if(null!=this.Ca)return a=this.Ca.next(),this.Ca.ua()||(this.Ca=null),a;if(this.advance())return this.next();throw Error("No such element");};of.prototype.remove=function(){return Error("Unsupported operation")};function pf(a,b,c){this.L=a;this.aa=b;this.f=c}g=pf.prototype;
g.Qa=function(a){if(a===this.L)return this;var b=xd(this.aa),c=Array(0>b?4:2*(b+1));ld(this.f,0,c,0,2*b);return new pf(a,this.aa,c)};g.ob=function(){return gf.a?gf.a(this.f):gf.call(null,this.f)};g.La=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.aa&e))return d;var f=xd(this.aa&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.La(a+5,b,c,d):kf(c,e)?f:d};
g.Ba=function(a,b,c,d,e,f){var h=1<<(c>>>b&31),k=xd(this.aa&h-1);if(0===(this.aa&h)){var l=xd(this.aa);if(2*l<this.f.length){a=this.Qa(a);b=a.f;f.M=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.aa|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=qf.Ba(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.aa>>>d&1)&&(k[d]=null!=this.f[e]?qf.Ba(a,b+5,jc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new nf(a,l+1,k)}b=Array(2*(l+4));ld(this.f,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;ld(this.f,2*k,b,2*(k+1),2*(l-k));f.M=!0;a=this.Qa(a);a.f=b;a.aa|=h;return a}l=this.f[2*k];h=this.f[2*k+1];if(null==l)return l=h.Ba(a,b+5,c,d,e,f),l===h?this:mf(this,a,2*k+1,l);if(kf(d,l))return e===h?this:mf(this,a,2*k+1,e);f.M=!0;f=b+5;d=jf.W?jf.W(a,f,l,h,c,d,e):jf.call(null,a,f,l,h,c,d,e);e=2*
k;k=2*k+1;a=this.Qa(a);a.f[e]=null;a.f[k]=d;return a};
g.Aa=function(a,b,c,d,e){var f=1<<(b>>>a&31),h=xd(this.aa&f-1);if(0===(this.aa&f)){var k=xd(this.aa);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=qf.Aa(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.aa>>>c&1)&&(h[c]=null!=this.f[d]?qf.Aa(a+5,jc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new nf(null,k+1,h)}a=Array(2*(k+1));ld(this.f,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;ld(this.f,2*h,a,2*(h+1),2*(k-h));e.M=!0;return new pf(null,this.aa|f,a)}var l=this.f[2*h],f=this.f[2*h+1];if(null==l)return k=f.Aa(a+5,b,c,d,e),k===f?this:new pf(null,this.aa,lf(this.f,2*h+1,k));if(kf(c,l))return d===f?this:new pf(null,this.aa,lf(this.f,2*h+1,d));e.M=!0;e=this.aa;k=this.f;a+=5;a=jf.V?jf.V(a,l,f,b,c,d):jf.call(null,a,l,f,b,c,d);c=2*h;h=2*h+1;d=Pa(k);d[c]=null;d[h]=a;return new pf(null,e,d)};g.Da=function(){return new of(this.f,0,null,null)};
var qf=new pf(null,0,[]);function rf(a,b,c){this.f=a;this.j=b;this.Ca=c}rf.prototype.ua=function(){for(var a=this.f.length;;){if(null!=this.Ca&&this.Ca.ua())return!0;if(this.j<a){var b=this.f[this.j];this.j+=1;null!=b&&(this.Ca=Ub(b))}else return!1}};rf.prototype.next=function(){if(this.ua())return this.Ca.next();throw Error("No such element");};rf.prototype.remove=function(){return Error("Unsupported operation")};function nf(a,b,c){this.L=a;this.l=b;this.f=c}g=nf.prototype;
g.Qa=function(a){return a===this.L?this:new nf(a,this.l,Pa(this.f))};g.ob=function(){return hf.a?hf.a(this.f):hf.call(null,this.f)};g.La=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.La(a+5,b,c,d):d};g.Ba=function(a,b,c,d,e,f){var h=c>>>b&31,k=this.f[h];if(null==k)return a=mf(this,a,h,qf.Ba(a,b+5,c,d,e,f)),a.l+=1,a;b=k.Ba(a,b+5,c,d,e,f);return b===k?this:mf(this,a,h,b)};
g.Aa=function(a,b,c,d,e){var f=b>>>a&31,h=this.f[f];if(null==h)return new nf(null,this.l+1,lf(this.f,f,qf.Aa(a+5,b,c,d,e)));a=h.Aa(a+5,b,c,d,e);return a===h?this:new nf(null,this.l,lf(this.f,f,a))};g.Da=function(){return new rf(this.f,0,null)};function sf(a,b,c){b*=2;for(var d=0;;)if(d<b){if(kf(c,a[d]))return d;d+=2}else return-1}function tf(a,b,c,d){this.L=a;this.Ka=b;this.l=c;this.f=d}g=tf.prototype;
g.Qa=function(a){if(a===this.L)return this;var b=Array(2*(this.l+1));ld(this.f,0,b,0,2*this.l);return new tf(a,this.Ka,this.l,b)};g.ob=function(){return gf.a?gf.a(this.f):gf.call(null,this.f)};g.La=function(a,b,c,d){a=sf(this.f,this.l,c);return 0>a?d:kf(c,this.f[a])?this.f[a+1]:d};
g.Ba=function(a,b,c,d,e,f){if(c===this.Ka){b=sf(this.f,this.l,d);if(-1===b){if(this.f.length>2*this.l)return b=2*this.l,c=2*this.l+1,a=this.Qa(a),a.f[b]=d,a.f[c]=e,f.M=!0,a.l+=1,a;c=this.f.length;b=Array(c+2);ld(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.M=!0;d=this.l+1;a===this.L?(this.f=b,this.l=d,a=this):a=new tf(this.L,this.Ka,d,b);return a}return this.f[b+1]===e?this:mf(this,a,b+1,e)}return(new pf(a,1<<(this.Ka>>>b&31),[null,this,null,null])).Ba(a,b,c,d,e,f)};
g.Aa=function(a,b,c,d,e){return b===this.Ka?(a=sf(this.f,this.l,c),-1===a?(a=2*this.l,b=Array(a+2),ld(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.M=!0,new tf(null,this.Ka,this.l+1,b)):dc.b(this.f[a],d)?this:new tf(null,this.Ka,this.l,lf(this.f,a+1,d))):(new pf(null,1<<(this.Ka>>>a&31),[null,this])).Aa(a,b,c,d,e)};g.Da=function(){return new of(this.f,0,null,null)};
var jf=function jf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return jf.V(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return jf.W(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
jf.V=function(a,b,c,d,e,f){var h=jc(b);if(h===d)return new tf(null,h,2,[b,c,e,f]);var k=new ff;return qf.Aa(a,h,b,c,k).Aa(a,d,e,f,k)};jf.W=function(a,b,c,d,e,f,h){var k=jc(c);if(k===e)return new tf(null,k,2,[c,d,f,h]);var l=new ff;return qf.Ba(a,b,k,c,d,l).Ba(a,b,e,f,h,l)};jf.A=7;function uf(a,b,c,d,e){this.v=a;this.Ma=b;this.j=c;this.D=d;this.s=e;this.i=32374860;this.B=0}g=uf.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};
g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Tc.b(b,this)};g.Z=function(a,b,c){return Tc.c(b,c,this)};g.$=function(){return null==this.D?new Q(null,2,5,V,[this.Ma[this.j],this.Ma[this.j+1]],null):K(this.D)};g.qa=function(){if(null==this.D){var a=this.Ma,b=this.j+2;return gf.c?gf.c(a,b,null):gf.call(null,a,b,null)}var a=this.Ma,b=this.j,c=L(this.D);return gf.c?gf.c(a,b,c):gf.call(null,a,b,c)};g.S=function(){return this};
g.R=function(a,b){return new uf(b,this.Ma,this.j,this.D,this.s)};g.T=function(a,b){return N(b,this)};uf.prototype[Oa]=function(){return tc(this)};var gf=function gf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return gf.a(arguments[0]);case 3:return gf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};gf.a=function(a){return gf.c(a,0,null)};
gf.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new uf(null,a,b,null,null);var d=a[b+1];if(y(d)&&(d=d.ob(),y(d)))return new uf(null,a,b+2,d,null);b+=2}else return null;else return new uf(null,a,b,c,null)};gf.A=3;function vf(a,b,c,d,e){this.v=a;this.Ma=b;this.j=c;this.D=d;this.s=e;this.i=32374860;this.B=0}g=vf.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};
g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Tc.b(b,this)};g.Z=function(a,b,c){return Tc.c(b,c,this)};g.$=function(){return K(this.D)};g.qa=function(){var a=this.Ma,b=this.j,c=L(this.D);return hf.o?hf.o(null,a,b,c):hf.call(null,null,a,b,c)};g.S=function(){return this};g.R=function(a,b){return new vf(b,this.Ma,this.j,this.D,this.s)};g.T=function(a,b){return N(b,this)};vf.prototype[Oa]=function(){return tc(this)};
var hf=function hf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return hf.a(arguments[0]);case 4:return hf.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};hf.a=function(a){return hf.o(null,a,0,null)};
hf.o=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(y(e)&&(e=e.ob(),y(e)))return new vf(a,b,c+1,e,null);c+=1}else return null;else return new vf(a,b,c,d,null)};hf.A=4;ef;function wf(a,b,c){this.wa=a;this.Nb=b;this.Eb=c}wf.prototype.ua=function(){return this.Eb&&this.Nb.ua()};wf.prototype.next=function(){if(this.Eb)return this.Nb.next();this.Eb=!0;return this.wa};wf.prototype.remove=function(){return Error("Unsupported operation")};
function Zc(a,b,c,d,e,f){this.v=a;this.l=b;this.root=c;this.va=d;this.wa=e;this.s=f;this.i=16123663;this.B=8196}g=Zc.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.keys=function(){return tc($e.a?$e.a(this):$e.call(null,this))};g.entries=function(){return Ve(J(this))};g.values=function(){return tc(af.a?af.a(this):af.call(null,this))};g.has=function(a){return pd(this,a)};g.get=function(a,b){return this.H(null,a,b)};
g.forEach=function(a){for(var b=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=O(f,0),f=O(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=J(b))jd(b)?(c=Mb(b),b=Nb(b),h=c,d=Wc(c),c=h):(c=K(b),h=O(c,0),f=O(c,1),a.b?a.b(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){return null==b?this.va?this.wa:c:null==this.root?c:this.root.La(0,jc(b),b,c)};
g.Da=function(){var a=this.root?Ub(this.root):Td;return this.va?new wf(this.wa,a,!1):a};g.O=function(){return this.v};g.X=function(){return this.l};g.N=function(){var a=this.s;return null!=a?a:this.s=a=zc(this)};g.w=function(a,b){return Te(this,b)};g.Va=function(){return new ef({},this.root,this.l,this.va,this.wa)};
g.Oa=function(a,b,c){if(null==b)return this.va&&c===this.wa?this:new Zc(this.v,this.va?this.l:this.l+1,this.root,!0,c,null);a=new ff;b=(null==this.root?qf:this.root).Aa(0,jc(b),b,c,a);return b===this.root?this:new Zc(this.v,a.M?this.l+1:this.l,b,this.va,this.wa,null)};g.yb=function(a,b){return null==b?this.va:null==this.root?!1:this.root.La(0,jc(b),b,md)!==md};g.S=function(){if(0<this.l){var a=null!=this.root?this.root.ob():null;return this.va?N(new Q(null,2,5,V,[null,this.wa],null),a):a}return null};
g.R=function(a,b){return new Zc(b,this.l,this.root,this.va,this.wa,this.s)};g.T=function(a,b){if(gd(b))return db(this,H.b(b,0),H.b(b,1));for(var c=this,d=J(b);;){if(null==d)return c;var e=K(d);if(gd(e))c=db(c,H.b(e,0),H.b(e,1)),d=L(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};var ad=new Zc(null,0,null,!1,null,Ac);Zc.prototype[Oa]=function(){return tc(this)};
function ef(a,b,c,d,e){this.L=a;this.root=b;this.count=c;this.va=d;this.wa=e;this.i=258;this.B=56}function xf(a,b,c){if(a.L){if(null==b)a.wa!==c&&(a.wa=c),a.va||(a.count+=1,a.va=!0);else{var d=new ff;b=(null==a.root?qf:a.root).Ba(a.L,0,jc(b),b,c,d);b!==a.root&&(a.root=b);d.M&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}g=ef.prototype;g.X=function(){if(this.L)return this.count;throw Error("count after persistent!");};
g.J=function(a,b){return null==b?this.va?this.wa:null:null==this.root?null:this.root.La(0,jc(b),b)};g.H=function(a,b,c){return null==b?this.va?this.wa:c:null==this.root?c:this.root.La(0,jc(b),b,c)};
g.jb=function(a,b){var c;a:if(this.L)if(null!=b?b.i&2048||b.Ub||(b.i?0:B(gb,b)):B(gb,b))c=xf(this,Ad.a?Ad.a(b):Ad.call(null,b),Bd.a?Bd.a(b):Bd.call(null,b));else{c=J(b);for(var d=this;;){var e=K(c);if(y(e))c=L(c),d=xf(d,Ad.a?Ad.a(e):Ad.call(null,e),Bd.a?Bd.a(e):Bd.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};g.kb=function(){var a;if(this.L)this.L=null,a=new Zc(null,this.count,this.root,this.va,this.wa,null);else throw Error("persistent! called twice");return a};
g.ib=function(a,b,c){return xf(this,b,c)};yf;zf;function zf(a,b,c,d,e){this.key=a;this.M=b;this.left=c;this.right=d;this.s=e;this.i=32402207;this.B=0}g=zf.prototype;g.replace=function(a,b,c,d){return new zf(a,b,c,d,null)};g.J=function(a,b){return H.c(this,b,null)};g.H=function(a,b,c){return H.c(this,b,c)};g.U=function(a,b){return 0===b?this.key:1===b?this.M:null};g.ta=function(a,b,c){return 0===b?this.key:1===b?this.M:c};
g.Pa=function(a,b,c){return(new Q(null,2,5,V,[this.key,this.M],null)).Pa(null,b,c)};g.O=function(){return null};g.X=function(){return 2};g.eb=function(){return this.key};g.fb=function(){return this.M};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Hc(this,b)};g.Z=function(a,b,c){return Ic(this,b,c)};g.Oa=function(a,b,c){return $c.c(new Q(null,2,5,V,[this.key,this.M],null),b,c)};g.S=function(){return Ua(Ua(rc,this.M),this.key)};
g.R=function(a,b){return Dc(new Q(null,2,5,V,[this.key,this.M],null),b)};g.T=function(a,b){return new Q(null,3,5,V,[this.key,this.M,b],null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};
g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};zf.prototype[Oa]=function(){return tc(this)};function yf(a,b,c,d,e){this.key=a;this.M=b;this.left=c;this.right=d;this.s=e;this.i=32402207;this.B=0}g=yf.prototype;g.replace=function(a,b,c,d){return new yf(a,b,c,d,null)};g.J=function(a,b){return H.c(this,b,null)};g.H=function(a,b,c){return H.c(this,b,c)};g.U=function(a,b){return 0===b?this.key:1===b?this.M:null};
g.ta=function(a,b,c){return 0===b?this.key:1===b?this.M:c};g.Pa=function(a,b,c){return(new Q(null,2,5,V,[this.key,this.M],null)).Pa(null,b,c)};g.O=function(){return null};g.X=function(){return 2};g.eb=function(){return this.key};g.fb=function(){return this.M};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Hc(this,b)};g.Z=function(a,b,c){return Ic(this,b,c)};
g.Oa=function(a,b,c){return $c.c(new Q(null,2,5,V,[this.key,this.M],null),b,c)};g.S=function(){return Ua(Ua(rc,this.M),this.key)};g.R=function(a,b){return Dc(new Q(null,2,5,V,[this.key,this.M],null),b)};g.T=function(a,b){return new Q(null,3,5,V,[this.key,this.M,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};yf.prototype[Oa]=function(){return tc(this)};Ad;
var Bc=function Bc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Bc.m(0<c.length?new pc(c.slice(0),0):null)};Bc.m=function(a){for(var b=J(a),c=Db(ad);;)if(b){a=L(L(b));var d=K(b),b=K(L(b)),c=Gb(c,d,b),b=a}else return Fb(c)};Bc.A=0;Bc.G=function(a){return Bc.m(J(a))};function Af(a,b){this.F=a;this.ya=b;this.i=32374988;this.B=0}g=Af.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.ya};
g.pa=function(){var a=(null!=this.F?this.F.i&128||this.F.tb||(this.F.i?0:B($a,this.F)):B($a,this.F))?this.F.pa(null):L(this.F);return null==a?null:new Af(a,this.ya)};g.N=function(){return xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Tc.b(b,this)};g.Z=function(a,b,c){return Tc.c(b,c,this)};g.$=function(){return this.F.$(null).eb(null)};
g.qa=function(){var a=(null!=this.F?this.F.i&128||this.F.tb||(this.F.i?0:B($a,this.F)):B($a,this.F))?this.F.pa(null):L(this.F);return null!=a?new Af(a,this.ya):rc};g.S=function(){return this};g.R=function(a,b){return new Af(this.F,b)};g.T=function(a,b){return N(b,this)};Af.prototype[Oa]=function(){return tc(this)};function $e(a){return(a=J(a))?new Af(a,null):null}function Ad(a){return hb(a)}function Bf(a,b){this.F=a;this.ya=b;this.i=32374988;this.B=0}g=Bf.prototype;g.toString=function(){return Wb(this)};
g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.ya};g.pa=function(){var a=(null!=this.F?this.F.i&128||this.F.tb||(this.F.i?0:B($a,this.F)):B($a,this.F))?this.F.pa(null):L(this.F);return null==a?null:new Bf(a,this.ya)};g.N=function(){return xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Tc.b(b,this)};g.Z=function(a,b,c){return Tc.c(b,c,this)};g.$=function(){return this.F.$(null).fb(null)};
g.qa=function(){var a=(null!=this.F?this.F.i&128||this.F.tb||(this.F.i?0:B($a,this.F)):B($a,this.F))?this.F.pa(null):L(this.F);return null!=a?new Bf(a,this.ya):rc};g.S=function(){return this};g.R=function(a,b){return new Bf(this.F,b)};g.T=function(a,b){return N(b,this)};Bf.prototype[Oa]=function(){return tc(this)};function af(a){return(a=J(a))?new Bf(a,null):null}function Bd(a){return ib(a)}
var Cf=function Cf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Cf.m(0<c.length?new pc(c.slice(0),0):null)};Cf.m=function(a){return y($d(a))?Qa.b(function(a,c){return Uc.b(y(a)?a:Xd,c)},a):null};Cf.A=0;Cf.G=function(a){return Cf.m(J(a))};Df;function Ef(a){this.Ya=a}Ef.prototype.ua=function(){return this.Ya.ua()};Ef.prototype.next=function(){if(this.Ya.ua())return this.Ya.next().I[0];throw Error("No such element");};Ef.prototype.remove=function(){return Error("Unsupported operation")};
function Ff(a,b,c){this.v=a;this.Ra=b;this.s=c;this.i=15077647;this.B=8196}g=Ff.prototype;g.toString=function(){return Wb(this)};g.equiv=function(a){return this.w(null,a)};g.keys=function(){return tc(J(this))};g.entries=function(){var a=J(this);return new We(J(a))};g.values=function(){return tc(J(this))};g.has=function(a){return pd(this,a)};
g.forEach=function(a){for(var b=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=O(f,0),f=O(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=J(b))jd(b)?(c=Mb(b),b=Nb(b),h=c,d=Wc(c),c=h):(c=K(b),h=O(c,0),f=O(c,1),a.b?a.b(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){return cb(this.Ra,b)?b:c};g.Da=function(){return new Ef(Ub(this.Ra))};g.O=function(){return this.v};g.X=function(){return Sa(this.Ra)};
g.N=function(){var a=this.s;return null!=a?a:this.s=a=zc(this)};g.w=function(a,b){return dd(b)&&Wc(this)===Wc(b)&&Zd(function(a){return function(b){return pd(a,b)}}(this),b)};g.Va=function(){return new Df(Db(this.Ra))};g.S=function(){return $e(this.Ra)};g.R=function(a,b){return new Ff(b,this.Ra,this.s)};g.T=function(a,b){return new Ff(this.v,$c.c(this.Ra,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};Ff.prototype[Oa]=function(){return tc(this)};
function Df(a){this.Ja=a;this.B=136;this.i=259}g=Df.prototype;g.jb=function(a,b){this.Ja=Gb(this.Ja,b,null);return this};g.kb=function(){return new Ff(null,Fb(this.Ja),null)};g.X=function(){return Wc(this.Ja)};g.J=function(a,b){return bb.c(this,b,null)};g.H=function(a,b,c){return bb.c(this.Ja,b,md)===md?c:b};
g.call=function(){function a(a,b,c){return bb.c(this.Ja,b,md)===md?c:b}function b(a,b){return bb.c(this.Ja,b,md)===md?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};g.a=function(a){return bb.c(this.Ja,a,md)===md?null:a};g.b=function(a,b){return bb.c(this.Ja,a,md)===md?b:a};
function zd(a){if(null!=a&&(a.B&4096||a.Wb))return a.gb(null);if("string"===typeof a)return a;throw Error([E("Doesn't support name: "),E(a)].join(""));}function Gf(a,b,c){this.j=a;this.end=b;this.step=c}Gf.prototype.ua=function(){return 0<this.step?this.j<this.end:this.j>this.end};Gf.prototype.next=function(){var a=this.j;this.j+=this.step;return a};function Hf(a,b,c,d,e){this.v=a;this.start=b;this.end=c;this.step=d;this.s=e;this.i=32375006;this.B=8192}g=Hf.prototype;g.toString=function(){return Wb(this)};
g.equiv=function(a){return this.w(null,a)};g.U=function(a,b){if(b<Sa(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};g.ta=function(a,b,c){return b<Sa(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};g.Da=function(){return new Gf(this.start,this.end,this.step)};g.O=function(){return this.v};
g.pa=function(){return 0<this.step?this.start+this.step<this.end?new Hf(this.v,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Hf(this.v,this.start+this.step,this.end,this.step,null):null};g.X=function(){return Ma(wb(this))?0:Math.ceil((this.end-this.start)/this.step)};g.N=function(){var a=this.s;return null!=a?a:this.s=a=xc(this)};g.w=function(a,b){return Cc(this,b)};g.Y=function(a,b){return Hc(this,b)};
g.Z=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.b?b.b(c,a):b.call(null,c,a);if(Gc(c))return M.a?M.a(c):M.call(null,c);a+=this.step}else return c};g.$=function(){return null==wb(this)?null:this.start};g.qa=function(){return null!=wb(this)?new Hf(this.v,this.start+this.step,this.end,this.step,null):rc};g.S=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};
g.R=function(a,b){return new Hf(b,this.start,this.end,this.step,this.s)};g.T=function(a,b){return N(b,this)};Hf.prototype[Oa]=function(){return tc(this)};
function Je(a,b,c,d,e,f,h){var k=va;va=null==va?null:va-1;try{if(null!=va&&0>va)return zb(a,"#");zb(a,c);if(0===Ea.a(f))J(h)&&zb(a,function(){var a=If.a(f);return y(a)?a:"..."}());else{if(J(h)){var l=K(h);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=L(h),n=Ea.a(f)-1;;)if(!m||null!=n&&0===n){J(m)&&0===n&&(zb(a,d),zb(a,function(){var a=If.a(f);return y(a)?a:"..."}()));break}else{zb(a,d);var p=K(m);c=a;h=f;b.c?b.c(p,c,h):b.call(null,p,c,h);var q=L(m);c=n-1;m=q;n=c}}return zb(a,e)}finally{va=k}}
function Jf(a,b){for(var c=J(b),d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f);zb(a,h);f+=1}else if(c=J(c))d=c,jd(d)?(c=Mb(d),e=Nb(d),d=c,h=Wc(c),c=e,e=h):(h=K(d),zb(a,h),c=L(d),d=null,e=0),f=0;else return null}var Kf={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Lf(a){return[E('"'),E(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Kf[a]})),E('"')].join("")}Mf;
function Nf(a,b){var c=od(I.b(a,Ca));return c?(c=null!=b?b.i&131072||b.Vb?!0:!1:!1)?null!=cd(b):c:c}
function Of(a,b,c){if(null==a)return zb(b,"nil");if(Nf(c,a)){zb(b,"^");var d=cd(a);Ke.c?Ke.c(d,b,c):Ke.call(null,d,b,c);zb(b," ")}if(a.Db)return a.Mb(a,b,c);if(null!=a&&(a.i&2147483648||a.P))return a.K(null,b,c);if(!0===a||!1===a||"number"===typeof a)return zb(b,""+E(a));if(null!=a&&a.constructor===Object)return zb(b,"#js "),d=P.b(function(b){return new Q(null,2,5,V,[Hd.a(b),a[b]],null)},kd(a)),Mf.o?Mf.o(d,Ke,b,c):Mf.call(null,d,Ke,b,c);if(La(a))return Je(b,Ke,"#js ["," ","]",c,a);if("string"==typeof a)return y(Ba.a(c))?
zb(b,Lf(a)):zb(b,a);if("function"==u(a)){var e=a.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Jf(b,nc(["#object[",c,' "',""+E(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+E(a);;)if(Wc(c)<b)c=[E("0"),E(c)].join("");else return c},Jf(b,nc(['#inst "',""+E(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),
3),"-",'00:00"'],0));if(a instanceof RegExp)return Jf(b,nc(['#"',a.source,'"'],0));if(null!=a&&(a.i&2147483648||a.P))return Ab(a,b,c);if(y(a.constructor.lb))return Jf(b,nc(["#object[",a.constructor.lb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Jf(b,nc(["#object[",c," ",""+E(a),"]"],0))}function Ke(a,b,c){var d=Pf.a(c);return y(d)?(c=$c.c(c,Qf,Of),d.c?d.c(a,b,c):d.call(null,a,b,c)):Of(a,b,c)}
var ee=function ee(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ee.m(0<c.length?new pc(c.slice(0),0):null)};ee.m=function(a){var b=xa();if(null==a||Ma(J(a)))b="";else{var c=E,d=new oa;a:{var e=new Vb(d);Ke(K(a),e,b);a=J(L(a));for(var f=null,h=0,k=0;;)if(k<h){var l=f.U(null,k);zb(e," ");Ke(l,e,b);k+=1}else if(a=J(a))f=a,jd(f)?(a=Mb(f),h=Nb(f),f=a,l=Wc(a),a=h,h=l):(l=K(f),zb(e," "),Ke(l,e,b),a=L(f),f=null,h=0),k=0;else break a}b=""+c(d)}return b};
ee.A=0;ee.G=function(a){return ee.m(J(a))};function Mf(a,b,c,d){return Je(c,function(a,c,d){var k=hb(a);b.c?b.c(k,c,d):b.call(null,k,c,d);zb(c," ");a=ib(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,J(a))}je.prototype.P=!0;je.prototype.K=function(a,b,c){zb(b,"#object [cljs.core.Volatile ");Ke(new ya(null,1,[Rf,this.state],null),b,c);return zb(b,"]")};pc.prototype.P=!0;pc.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};Id.prototype.P=!0;
Id.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};uf.prototype.P=!0;uf.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};zf.prototype.P=!0;zf.prototype.K=function(a,b,c){return Je(b,Ke,"["," ","]",c,this)};Ze.prototype.P=!0;Ze.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};vc.prototype.P=!0;vc.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};id.prototype.P=!0;id.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};
Fd.prototype.P=!0;Fd.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};Nc.prototype.P=!0;Nc.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};Zc.prototype.P=!0;Zc.prototype.K=function(a,b,c){return Mf(this,Ke,b,c)};vf.prototype.P=!0;vf.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};Oe.prototype.P=!0;Oe.prototype.K=function(a,b,c){return Je(b,Ke,"["," ","]",c,this)};Ff.prototype.P=!0;Ff.prototype.K=function(a,b,c){return Je(b,Ke,"#{"," ","}",c,this)};
hd.prototype.P=!0;hd.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};ce.prototype.P=!0;ce.prototype.K=function(a,b,c){zb(b,"#object [cljs.core.Atom ");Ke(new ya(null,1,[Rf,this.state],null),b,c);return zb(b,"]")};Bf.prototype.P=!0;Bf.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};yf.prototype.P=!0;yf.prototype.K=function(a,b,c){return Je(b,Ke,"["," ","]",c,this)};Q.prototype.P=!0;Q.prototype.K=function(a,b,c){return Je(b,Ke,"["," ","]",c,this)};Ed.prototype.P=!0;
Ed.prototype.K=function(a,b){return zb(b,"()")};Yd.prototype.P=!0;Yd.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};ya.prototype.P=!0;ya.prototype.K=function(a,b,c){return Mf(this,Ke,b,c)};Hf.prototype.P=!0;Hf.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};Af.prototype.P=!0;Af.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};Oc.prototype.P=!0;Oc.prototype.K=function(a,b,c){return Je(b,Ke,"("," ",")",c,this)};cc.prototype.bb=!0;
cc.prototype.Ua=function(a,b){if(b instanceof cc)return lc(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};A.prototype.bb=!0;A.prototype.Ua=function(a,b){if(b instanceof A)return Gd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};Oe.prototype.bb=!0;Oe.prototype.Ua=function(a,b){if(gd(b))return qd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};Q.prototype.bb=!0;
Q.prototype.Ua=function(a,b){if(gd(b))return qd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};var Sf=null;function Tf(a){null==Sf&&(Sf=W.a?W.a(0):W.call(null,0));return mc.a([E(a),E(ie.b(Sf,Ec))].join(""))}function Uf(a){return function(b,c){var d=a.b?a.b(b,c):a.call(null,b,c);return Gc(d)?new Fc(d):d}}
function re(a){return function(b){return function(){function c(a,c){return Qa.c(b,a,c)}function d(b){return a.a?a.a(b):a.call(null,b)}function e(){return a.u?a.u():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.u=e;f.a=d;f.b=c;return f}()}(Uf(a))}Vf;function Wf(){}
var Xf=function Xf(b){if(null!=b&&null!=b.Rb)return b.Rb(b);var c=Xf[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Xf._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEncodeJS.-clj-\x3ejs",b);};Yf;function Zf(a){return(null!=a?a.Qb||(a.dc?0:B(Wf,a)):B(Wf,a))?Xf(a):"string"===typeof a||"number"===typeof a||a instanceof A||a instanceof cc?Yf.a?Yf.a(a):Yf.call(null,a):ee.m(nc([a],0))}
var Yf=function Yf(b){if(null==b)return null;if(null!=b?b.Qb||(b.dc?0:B(Wf,b)):B(Wf,b))return Xf(b);if(b instanceof A)return zd(b);if(b instanceof cc)return""+E(b);if(fd(b)){var c={};b=J(b);for(var d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f),k=O(h,0),h=O(h,1);c[Zf(k)]=Yf(h);f+=1}else if(b=J(b))jd(b)?(e=Mb(b),b=Nb(b),d=e,e=Wc(e)):(e=K(b),d=O(e,0),e=O(e,1),c[Zf(d)]=Yf(e),b=L(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.i&8||b.oc||(b.i?0:B(Ta,b)):B(Ta,b)){c=[];b=J(P.b(Yf,b));d=null;for(f=
e=0;;)if(f<e)k=d.U(null,f),c.push(k),f+=1;else if(b=J(b))d=b,jd(d)?(b=Mb(d),f=Nb(d),d=b,e=Wc(b),b=f):(b=K(d),c.push(b),b=L(d),d=null,e=0),f=0;else break;return c}return b},Vf=function Vf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Vf.u();case 1:return Vf.a(arguments[0]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Vf.u=function(){return Vf.a(1)};Vf.a=function(a){return Math.random()*a};Vf.A=1;var $f=null;
function ag(){if(null==$f){var a=new ya(null,3,[bg,Xd,cg,Xd,dg,Xd],null);$f=W.a?W.a(a):W.call(null,a)}return $f}function eg(a,b,c){var d=dc.b(b,c);if(!d&&!(d=pd(dg.a(a).call(null,b),c))&&(d=gd(c))&&(d=gd(b)))if(d=Wc(c)===Wc(b))for(var d=!0,e=0;;)if(d&&e!==Wc(c))d=eg(a,b.a?b.a(e):b.call(null,e),c.a?c.a(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function fg(a){var b;b=ag();b=M.a?M.a(b):M.call(null,b);a=I.b(bg.a(b),a);return J(a)?a:null}
function gg(a,b,c,d){ie.b(a,function(){return M.a?M.a(b):M.call(null,b)});ie.b(c,function(){return M.a?M.a(d):M.call(null,d)})}var hg=function hg(b,c,d){var e=(M.a?M.a(d):M.call(null,d)).call(null,b),e=y(y(e)?e.a?e.a(c):e.call(null,c):e)?!0:null;if(y(e))return e;e=function(){for(var e=fg(c);;)if(0<Wc(e))hg(b,K(e),d),e=qc(e);else return null}();if(y(e))return e;e=function(){for(var e=fg(b);;)if(0<Wc(e))hg(K(e),c,d),e=qc(e);else return null}();return y(e)?e:!1};
function jg(a,b,c){c=hg(a,b,c);if(y(c))a=c;else{c=eg;var d;d=ag();d=M.a?M.a(d):M.call(null,d);a=c(d,a,b)}return a}
var kg=function kg(b,c,d,e,f,h,k){var l=Qa.c(function(e,h){var k=O(h,0);O(h,1);if(eg(M.a?M.a(d):M.call(null,d),c,k)){var l;l=(l=null==e)?l:jg(k,K(e),f);l=y(l)?h:e;if(!y(jg(K(l),k,f)))throw Error([E("Multiple methods in multimethod '"),E(b),E("' match dispatch value: "),E(c),E(" -\x3e "),E(k),E(" and "),E(K(l)),E(", and neither is preferred")].join(""));return l}return e},null,M.a?M.a(e):M.call(null,e));if(y(l)){if(dc.b(M.a?M.a(k):M.call(null,k),M.a?M.a(d):M.call(null,d)))return ie.o(h,$c,c,K(L(l))),
K(L(l));gg(h,e,k,d);return kg(b,c,d,e,f,h,k)}return null};function X(a,b){throw Error([E("No method in multimethod '"),E(a),E("' for dispatch value: "),E(b)].join(""));}function lg(a,b,c,d,e,f,h,k){this.name=a;this.h=b;this.ec=c;this.nb=d;this.Za=e;this.kc=f;this.pb=h;this.ab=k;this.i=4194305;this.B=4352}g=lg.prototype;
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,G,S){a=this;var la=F.m(a.h,b,c,d,e,nc([f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,G,S],0)),ig=Z(this,la);y(ig)||X(a.name,la);return F.m(ig,b,c,d,e,nc([f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,G,S],0))}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,G){a=this;var S=a.h.ma?a.h.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,G):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,G),la=Z(this,S);y(la)||X(a.name,S);return la.ma?la.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,
v,w,z,x,D,G):la.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,G)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D){a=this;var G=a.h.la?a.h.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D),S=Z(this,G);y(S)||X(a.name,G);return S.la?S.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):S.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x){a=this;var D=a.h.ka?a.h.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):a.h.call(null,
b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x),G=Z(this,D);y(G)||X(a.name,D);return G.ka?G.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):G.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){a=this;var x=a.h.ja?a.h.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z),D=Z(this,x);y(D)||X(a.name,x);return D.ja?D.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):D.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,
w){a=this;var z=a.h.ia?a.h.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w),x=Z(this,z);y(x)||X(a.name,z);return x.ia?x.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):x.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){a=this;var w=a.h.ha?a.h.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v),z=Z(this,w);y(z)||X(a.name,w);return z.ha?z.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):z.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)}
function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){a=this;var v=a.h.ga?a.h.ga(b,c,d,e,f,h,k,l,m,n,p,q,r,t):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t),w=Z(this,v);y(w)||X(a.name,v);return w.ga?w.ga(b,c,d,e,f,h,k,l,m,n,p,q,r,t):w.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;var t=a.h.fa?a.h.fa(b,c,d,e,f,h,k,l,m,n,p,q,r):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r),v=Z(this,t);y(v)||X(a.name,t);return v.fa?v.fa(b,c,d,e,f,h,k,l,m,n,p,q,r):v.call(null,b,c,d,e,f,h,k,l,m,n,p,
q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;var r=a.h.ea?a.h.ea(b,c,d,e,f,h,k,l,m,n,p,q):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q),t=Z(this,r);y(t)||X(a.name,r);return t.ea?t.ea(b,c,d,e,f,h,k,l,m,n,p,q):t.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;var q=a.h.da?a.h.da(b,c,d,e,f,h,k,l,m,n,p):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p),r=Z(this,q);y(r)||X(a.name,q);return r.da?r.da(b,c,d,e,f,h,k,l,m,n,p):r.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,
n){a=this;var p=a.h.ca?a.h.ca(b,c,d,e,f,h,k,l,m,n):a.h.call(null,b,c,d,e,f,h,k,l,m,n),q=Z(this,p);y(q)||X(a.name,p);return q.ca?q.ca(b,c,d,e,f,h,k,l,m,n):q.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;var n=a.h.oa?a.h.oa(b,c,d,e,f,h,k,l,m):a.h.call(null,b,c,d,e,f,h,k,l,m),p=Z(this,n);y(p)||X(a.name,n);return p.oa?p.oa(b,c,d,e,f,h,k,l,m):p.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;var m=a.h.na?a.h.na(b,c,d,e,f,h,k,l):a.h.call(null,b,c,d,e,f,h,k,l),n=
Z(this,m);y(n)||X(a.name,m);return n.na?n.na(b,c,d,e,f,h,k,l):n.call(null,b,c,d,e,f,h,k,l)}function t(a,b,c,d,e,f,h,k){a=this;var l=a.h.W?a.h.W(b,c,d,e,f,h,k):a.h.call(null,b,c,d,e,f,h,k),m=Z(this,l);y(m)||X(a.name,l);return m.W?m.W(b,c,d,e,f,h,k):m.call(null,b,c,d,e,f,h,k)}function v(a,b,c,d,e,f,h){a=this;var k=a.h.V?a.h.V(b,c,d,e,f,h):a.h.call(null,b,c,d,e,f,h),l=Z(this,k);y(l)||X(a.name,k);return l.V?l.V(b,c,d,e,f,h):l.call(null,b,c,d,e,f,h)}function w(a,b,c,d,e,f){a=this;var h=a.h.C?a.h.C(b,c,
d,e,f):a.h.call(null,b,c,d,e,f),k=Z(this,h);y(k)||X(a.name,h);return k.C?k.C(b,c,d,e,f):k.call(null,b,c,d,e,f)}function z(a,b,c,d,e){a=this;var f=a.h.o?a.h.o(b,c,d,e):a.h.call(null,b,c,d,e),h=Z(this,f);y(h)||X(a.name,f);return h.o?h.o(b,c,d,e):h.call(null,b,c,d,e)}function D(a,b,c,d){a=this;var e=a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d),f=Z(this,e);y(f)||X(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function G(a,b,c){a=this;var d=a.h.b?a.h.b(b,c):a.h.call(null,b,c),e=Z(this,d);y(e)||X(a.name,
d);return e.b?e.b(b,c):e.call(null,b,c)}function S(a,b){a=this;var c=a.h.a?a.h.a(b):a.h.call(null,b),d=Z(this,c);y(d)||X(a.name,c);return d.a?d.a(b):d.call(null,b)}function la(a){a=this;var b=a.h.u?a.h.u():a.h.call(null),c=Z(this,b);y(c)||X(a.name,b);return c.u?c.u():c.call(null)}var x=null,x=function(x,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,Tb,Wa,eb,qb,Kb,ic,Rc,qe){switch(arguments.length){case 1:return la.call(this,x);case 2:return S.call(this,x,R);case 3:return G.call(this,x,R,T);case 4:return D.call(this,
x,R,T,U);case 5:return z.call(this,x,R,T,U,Y);case 6:return w.call(this,x,R,T,U,Y,ca);case 7:return v.call(this,x,R,T,U,Y,ca,fa);case 8:return t.call(this,x,R,T,U,Y,ca,fa,ha);case 9:return r.call(this,x,R,T,U,Y,ca,fa,ha,ia);case 10:return q.call(this,x,R,T,U,Y,ca,fa,ha,ia,ka);case 11:return p.call(this,x,R,T,U,Y,ca,fa,ha,ia,ka,qa);case 12:return n.call(this,x,R,T,U,Y,ca,fa,ha,ia,ka,qa,za);case 13:return m.call(this,x,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga);case 14:return l.call(this,x,R,T,U,Y,ca,fa,ha,ia,
ka,qa,za,Ga,Ka);case 15:return k.call(this,x,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,Tb);case 16:return h.call(this,x,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,Tb,Wa);case 17:return f.call(this,x,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,Tb,Wa,eb);case 18:return e.call(this,x,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,Tb,Wa,eb,qb);case 19:return d.call(this,x,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,Tb,Wa,eb,qb,Kb);case 20:return c.call(this,x,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,Tb,Wa,eb,qb,Kb,ic);case 21:return b.call(this,x,R,T,
U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,Tb,Wa,eb,qb,Kb,ic,Rc);case 22:return a.call(this,x,R,T,U,Y,ca,fa,ha,ia,ka,qa,za,Ga,Ka,Tb,Wa,eb,qb,Kb,ic,Rc,qe)}throw Error("Invalid arity: "+arguments.length);};x.a=la;x.b=S;x.c=G;x.o=D;x.C=z;x.V=w;x.W=v;x.na=t;x.oa=r;x.ca=q;x.da=p;x.ea=n;x.fa=m;x.ga=l;x.ha=k;x.ia=h;x.ja=f;x.ka=e;x.la=d;x.ma=c;x.Cb=b;x.cb=a;return x}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Pa(b)))};
g.u=function(){var a=this.h.u?this.h.u():this.h.call(null),b=Z(this,a);y(b)||X(this.name,a);return b.u?b.u():b.call(null)};g.a=function(a){var b=this.h.a?this.h.a(a):this.h.call(null,a),c=Z(this,b);y(c)||X(this.name,b);return c.a?c.a(a):c.call(null,a)};g.b=function(a,b){var c=this.h.b?this.h.b(a,b):this.h.call(null,a,b),d=Z(this,c);y(d)||X(this.name,c);return d.b?d.b(a,b):d.call(null,a,b)};
g.c=function(a,b,c){var d=this.h.c?this.h.c(a,b,c):this.h.call(null,a,b,c),e=Z(this,d);y(e)||X(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};g.o=function(a,b,c,d){var e=this.h.o?this.h.o(a,b,c,d):this.h.call(null,a,b,c,d),f=Z(this,e);y(f)||X(this.name,e);return f.o?f.o(a,b,c,d):f.call(null,a,b,c,d)};g.C=function(a,b,c,d,e){var f=this.h.C?this.h.C(a,b,c,d,e):this.h.call(null,a,b,c,d,e),h=Z(this,f);y(h)||X(this.name,f);return h.C?h.C(a,b,c,d,e):h.call(null,a,b,c,d,e)};
g.V=function(a,b,c,d,e,f){var h=this.h.V?this.h.V(a,b,c,d,e,f):this.h.call(null,a,b,c,d,e,f),k=Z(this,h);y(k)||X(this.name,h);return k.V?k.V(a,b,c,d,e,f):k.call(null,a,b,c,d,e,f)};g.W=function(a,b,c,d,e,f,h){var k=this.h.W?this.h.W(a,b,c,d,e,f,h):this.h.call(null,a,b,c,d,e,f,h),l=Z(this,k);y(l)||X(this.name,k);return l.W?l.W(a,b,c,d,e,f,h):l.call(null,a,b,c,d,e,f,h)};
g.na=function(a,b,c,d,e,f,h,k){var l=this.h.na?this.h.na(a,b,c,d,e,f,h,k):this.h.call(null,a,b,c,d,e,f,h,k),m=Z(this,l);y(m)||X(this.name,l);return m.na?m.na(a,b,c,d,e,f,h,k):m.call(null,a,b,c,d,e,f,h,k)};g.oa=function(a,b,c,d,e,f,h,k,l){var m=this.h.oa?this.h.oa(a,b,c,d,e,f,h,k,l):this.h.call(null,a,b,c,d,e,f,h,k,l),n=Z(this,m);y(n)||X(this.name,m);return n.oa?n.oa(a,b,c,d,e,f,h,k,l):n.call(null,a,b,c,d,e,f,h,k,l)};
g.ca=function(a,b,c,d,e,f,h,k,l,m){var n=this.h.ca?this.h.ca(a,b,c,d,e,f,h,k,l,m):this.h.call(null,a,b,c,d,e,f,h,k,l,m),p=Z(this,n);y(p)||X(this.name,n);return p.ca?p.ca(a,b,c,d,e,f,h,k,l,m):p.call(null,a,b,c,d,e,f,h,k,l,m)};g.da=function(a,b,c,d,e,f,h,k,l,m,n){var p=this.h.da?this.h.da(a,b,c,d,e,f,h,k,l,m,n):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n),q=Z(this,p);y(q)||X(this.name,p);return q.da?q.da(a,b,c,d,e,f,h,k,l,m,n):q.call(null,a,b,c,d,e,f,h,k,l,m,n)};
g.ea=function(a,b,c,d,e,f,h,k,l,m,n,p){var q=this.h.ea?this.h.ea(a,b,c,d,e,f,h,k,l,m,n,p):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p),r=Z(this,q);y(r)||X(this.name,q);return r.ea?r.ea(a,b,c,d,e,f,h,k,l,m,n,p):r.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.fa=function(a,b,c,d,e,f,h,k,l,m,n,p,q){var r=this.h.fa?this.h.fa(a,b,c,d,e,f,h,k,l,m,n,p,q):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q),t=Z(this,r);y(t)||X(this.name,r);return t.fa?t.fa(a,b,c,d,e,f,h,k,l,m,n,p,q):t.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){var t=this.h.ga?this.h.ga(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r),v=Z(this,t);y(v)||X(this.name,t);return v.ga?v.ga(a,b,c,d,e,f,h,k,l,m,n,p,q,r):v.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};
g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){var v=this.h.ha?this.h.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t),w=Z(this,v);y(w)||X(this.name,v);return w.ha?w.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):w.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t)};
g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){var w=this.h.ia?this.h.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v),z=Z(this,w);y(z)||X(this.name,w);return z.ia?z.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):z.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)};
g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){var z=this.h.ja?this.h.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w),D=Z(this,z);y(D)||X(this.name,z);return D.ja?D.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):D.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)};
g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){var D=this.h.ka?this.h.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z),G=Z(this,D);y(G)||X(this.name,D);return G.ka?G.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):G.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)};
g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D){var G=this.h.la?this.h.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D),S=Z(this,G);y(S)||X(this.name,G);return S.la?S.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):S.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D)};
g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G){var S=this.h.ma?this.h.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G),la=Z(this,S);y(la)||X(this.name,S);return la.ma?la.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G):la.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G)};
g.Cb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G,S){var la=F.m(this.h,a,b,c,d,nc([e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G,S],0)),x=Z(this,la);y(x)||X(this.name,la);return F.m(x,a,b,c,d,nc([e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,G,S],0))};
function Z(a,b){dc.b(M.a?M.a(a.ab):M.call(null,a.ab),M.a?M.a(a.nb):M.call(null,a.nb))||gg(a.pb,a.Za,a.ab,a.nb);var c=(M.a?M.a(a.pb):M.call(null,a.pb)).call(null,b);if(y(c))return c;c=kg(a.name,b,a.nb,a.Za,a.kc,a.pb,a.ab);return y(c)?c:(M.a?M.a(a.Za):M.call(null,a.Za)).call(null,a.ec)}g.gb=function(){return Pb(this.name)};g.hb=function(){return Qb(this.name)};g.N=function(){return this[da]||(this[da]=++ea)};var mg=new A(null,"path","path",-188191168),ng=new A(null,"hookAutoZoom","hookAutoZoom",774705056),Ca=new A(null,"meta","meta",1499536964),og=new cc(null,"blockable","blockable",-28395259,null),Da=new A(null,"dup","dup",556298533),pg=new A(null,"offset","offset",296498311),qg=new A(null,"button","button",1456579943),he=new cc(null,"new-value","new-value",-1567397401,null),de=new A(null,"validator","validator",-1966190681),rg=new A(null,"default","default",-1987822328),sg=new A(null,"reset-points",
"reset-points",-5234839),tg=new A(null,"width","width",-384071477),ug=new A(null,"onclick","onclick",1297553739),vg=new A(null,"midpoint","midpoint",-36269525),Rf=new A(null,"val","val",128701612),wg=new A(null,"type","type",1174270348),ge=new cc(null,"validate","validate",1439230700,null),Qf=new A(null,"fallback-impl","fallback-impl",-1501286995),xg=new A(null,"source","source",-433931539),Aa=new A(null,"flush-on-newline","flush-on-newline",-151457939),yg=new A(null,"angle","angle",1622094254),zg=
new A(null,"radius","radius",-2073122258),cg=new A(null,"descendants","descendants",1824886031),Ag=new A(null,"center","center",-748944368),dg=new A(null,"ancestors","ancestors",-776045424),me=new cc(null,"n","n",-2092305744,null),Bg=new A(null,"div","div",1057191632),Ba=new A(null,"readably","readably",1129599760),If=new A(null,"more-marker","more-marker",-14717935),Cg=new A(null,"balance","balance",418967409),Dg=new A(null,"island","island",623473715),Ea=new A(null,"print-length","print-length",
1931866356),Eg=new A(null,"id","id",-1388402092),Fg=new A(null,"class","class",-2030961996),bg=new A(null,"parents","parents",-2027538891),Gg=new A(null,"svg","svg",856789142),Hg=new A(null,"max-offset","max-offset",-851769098),Ig=new A(null,"radial","radial",-1334240714),Jg=new A(null,"right","right",-452581833),Kg=new A(null,"position","position",-2011731912),Lg=new A(null,"d","d",1972142424),Mg=new A(null,"depth","depth",1768663640),Ng=new A(null,"rerender","rerender",-1601192263),Wd=new cc(null,
"quote","quote",1377916282,null),Vd=new A(null,"arglists","arglists",1661989754),Ud=new cc(null,"nil-iter","nil-iter",1101030523,null),Og=new A(null,"main","main",-2117802661),Pg=new A(null,"hierarchy","hierarchy",-1053470341),Pf=new A(null,"alt-impl","alt-impl",670969595),Qg=new A(null,"rect","rect",-108902628),le=new cc(null,"number?","number?",-1747282210,null),Rg=new A(null,"height","height",1025178622),Sg=new A(null,"left","left",-399115937),Tg=new A(null,"foreignObject","foreignObject",25502111),
Ug=new cc(null,"f","f",43394975,null);var Vg;var Wg;a:{var Xg=aa.navigator;if(Xg){var Yg=Xg.userAgent;if(Yg){Wg=Yg;break a}}Wg=""};function Zg(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function $g(a,b,c,d){this.head=a;this.I=b;this.length=c;this.f=d}$g.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.I];this.f[this.I]=null;this.I=(this.I+1)%this.f.length;--this.length;return a};$g.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};
$g.prototype.resize=function(){var a=Array(2*this.f.length);return this.I<this.head?(Zg(this.f,this.I,a,0,this.length),this.I=0,this.head=this.length,this.f=a):this.I>this.head?(Zg(this.f,this.I,a,0,this.f.length-this.I),Zg(this.f,0,a,this.f.length-this.I,this.head),this.I=0,this.head=this.length,this.f=a):this.I===this.head?(this.head=this.I=0,this.f=a):null};if("undefined"===typeof ah)var ah={};var bh;
function ch(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==Wg.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ma(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==Wg.indexOf("Trident")&&-1==Wg.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Fb;c.Fb=null;a()}};return function(a){d.next={Fb:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var dh;dh=new $g(0,0,0,Array(32));var eh=!1,fh=!1;gh;function hh(){eh=!0;fh=!1;for(var a=0;;){var b=dh.pop();if(null!=b&&(b.u?b.u():b.call(null),1024>a)){a+=1;continue}break}eh=!1;return 0<dh.length?gh.u?gh.u():gh.call(null):null}function gh(){var a=fh;if(y(y(a)?eh:a))return null;fh=!0;"function"!=u(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(bh||(bh=ch()),bh(hh)):aa.setImmediate(hh)};for(var ih=Array(1),jh=0;;)if(jh<ih.length)ih[jh]=null,jh+=1;else break;(function(a){"undefined"===typeof Vg&&(Vg=function(a,c,d){this.mb=a;this.Ob=c;this.hc=d;this.i=393216;this.B=0},Vg.prototype.R=function(a,c){return new Vg(this.mb,this.Ob,c)},Vg.prototype.O=function(){return this.hc},Vg.fc=function(){return new Q(null,3,5,V,[Ug,og,ra.vc],null)},Vg.Db=!0,Vg.lb="cljs.core.async/t_cljs$core$async11301",Vg.Mb=function(a,c){return zb(c,"cljs.core.async/t_cljs$core$async11301")});return new Vg(a,!0,Xd)})(function(){return null});var kh=VDOM.diff,lh=VDOM.patch,mh=VDOM.create;function nh(a){return te(ae(Ja),te(ae(nd),ue(a)))}function oh(a,b,c){return new VDOM.VHtml(zd(a),Yf(b),Yf(c))}function ph(a,b,c){return new VDOM.VSvg(zd(a),Yf(b),Yf(c))}qh;
var rh=function rh(b){if(null==b)return new VDOM.VText("");if(nd(b))return oh(Bg,Xd,P.b(rh,nh(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(dc.b(Gg,K(b)))return qh.a?qh.a(b):qh.call(null,b);var c=O(b,0),d=O(b,1);b=yd(b);return oh(c,d,P.b(rh,nh(b)))},qh=function qh(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(dc.b(Tg,K(b))){var c=O(b,0),d=O(b,1);b=yd(b);return ph(c,d,P.b(rh,nh(b)))}c=O(b,0);d=O(b,1);b=
yd(b);return ph(c,d,P.b(qh,nh(b)))};
function sh(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return W.a?W.a(a):W.call(null,a)}(),c=function(){var a;a=M.a?M.a(b):M.call(null,b);a=mh.a?mh.a(a):mh.call(null,a);return W.a?W.a(a):W.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.u?a.u():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(M.a?M.a(c):M.call(null,c));return function(a,b,c){return function(d){var l=
rh(d);d=function(){var b=M.a?M.a(a):M.call(null,a);return kh.b?kh.b(b,l):kh.call(null,b,l)}();fe.b?fe.b(a,l):fe.call(null,a,l);d=function(a,b,c,d){return function(){return ie.c(d,lh,b)}}(l,d,a,b,c);return c.a?c.a(d):c.call(null,d)}}(b,c,d)};function th(a){this.mb=a}th.prototype.gc=function(a){return this.mb.a?this.mb.a(a):this.mb.call(null,a)};function uh(a){return new th(a)}ba("Hook",th);ba("Hook.prototype.hook",th.prototype.gc);var vh=Math.sin,wh=Math.cos,xh=2*Math.PI,yh=Math.sqrt;function zh(a,b){var c=O(a,0),d=O(a,1),e=O(b,0),f=O(b,1),c=Math.pow(c-e,2)+Math.pow(d-f,2);return yh.a?yh.a(c):yh.call(null,c)}function Ah(a){return Qa.b(ud,a)/Wc(a)};function Bh(a,b){return[E("translate("),E(a),E(","),E(b),E(")")].join("")}function Ch(a){var b=O(a,0);a=O(a,1);return[E(b),E(","),E(a)].join("")}function Dh(a){a=P.b(Ch,a);a=ne(1,pe.b(oe("L"),a));a=Yf(a).join("");return[E("M"),E(a)].join("")};ta=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new pc(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Ha.a?Ha.a(a):Ha.call(null,a))}a.A=0;a.G=function(a){a=J(a);return b(a)};a.m=b;return a}();
ua=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new pc(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,Ha.a?Ha.a(a):Ha.call(null,a))}a.A=0;a.G=function(a){a=J(a);return b(a)};a.m=b;return a}();function Eh(a){a=a.yc();return new Q(null,4,5,V,[a.x,a.y,a.width,a.height],null)}
function Fh(a,b){var c=O(a,0),d=O(a,1),e=O(a,2),f=O(a,3),h=O(b,0),k=O(b,1),l=O(b,2),m=O(b,3),n;n=l/e;var p=m/f;n=n<p?n:p;return[E(Bh(h+l/2,k+m/2)),E("scale("),E(.95*n),E(")"),E(Bh(-(c+e/2),-(d+f/2)))].join("")}
function Gh(a){return function(){function b(a){var b=null;if(0<arguments.length){for(var b=0,f=Array(arguments.length-0);b<f.length;)f[b]=arguments[b+0],++b;b=new pc(f,0)}return c.call(this,b)}function c(b){return setTimeout(function(){return F.b(a,b)},0)}b.A=0;b.G=function(a){a=J(a);return c(a)};b.m=c;return b}()}
function Hh(){var a=Ih,b=M.a?M.a(Jh):M.call(null,Jh),c=null!=b&&(b.i&64||b.Ia)?F.b(Bc,b):b,d=I.b(c,Dg);return new Q(null,3,5,V,[Og,Xd,new Q(null,4,5,V,[Bg,Xd,new Q(null,3,5,V,[Bg,Xd,new Q(null,3,5,V,[qg,new ya(null,1,[ug,function(){return function(){return a.a?a.a(sg):a.call(null,sg)}}(600,b,c,c,d)],null),"New Island"],null)],null),new Q(null,3,5,V,[Bg,Xd,new Q(null,4,5,V,[Gg,new ya(null,2,[tg,600,Rg,600],null),new Q(null,2,5,V,[Qg,new ya(null,3,[Fg,"water",tg,600,Rg,600],null)],null),new Q(null,
2,5,V,[mg,new ya(null,3,[Fg,"island",Lg,function(){var a=P.b(Kg,d);return J(a)?[E(Dh(a)),E("Z")].join(""):""}(),ng,uh(Gh(function(a){return function(b){return b.setAttribute("transform",Fh(Eh(b),new Q(null,4,5,V,[0,0,a,a],null)))}}(600,b,c,c,d)))],null)],null)],null)],null)],null)],null)}function Kh(){return new ya(null,3,[pg,Vf.u(),Cg,Vf.u(),Hg,.05+Vf.u()],null)}
function Lh(a){return function c(a){return new Id(null,function(){for(;;){var e=J(a);if(e){if(jd(e)){var f=Mb(e),h=Wc(f),k=new Ld(Array(h),0);return function(){for(var a=0;;)if(a<h){var c=H.b(f,a),d=Kh(),e=d=null!=d&&(d.i&64||d.Ia)?F.b(Bc,d):d,l=I.b(d,pg),m=I.b(d,Cg);Nd(k,Cf.m(nc([e,new ya(null,3,[Eg,Tf("radial"),Kg,function(){var a=100*(1+(l-m));return new Q(null,2,5,V,[a*(wh.a?wh.a(c):wh.call(null,c)),a*(vh.a?vh.a(c):vh.call(null,c))],null)}(),xg,new ya(null,4,[wg,Ig,Ag,new Q(null,2,5,V,[0,0],null),
yg,c,zg,100],null)],null)],0)));a+=1}else return!0}()?Md(k.za(),c(Nb(e))):Md(k.za(),null)}var l=K(e),m=Kh(),n=m=null!=m&&(m.i&64||m.Ia)?F.b(Bc,m):m,p=I.b(m,pg),q=I.b(m,Cg);return N(Cf.m(nc([n,new ya(null,3,[Eg,Tf("radial"),Kg,function(){var a=100*(1+(p-q));return new Q(null,2,5,V,[a*(wh.a?wh.a(l):wh.call(null,l)),a*(vh.a?vh.a(l):vh.call(null,l))],null)}(),xg,new ya(null,4,[wg,Ig,Ag,new Q(null,2,5,V,[0,0],null),yg,l,zg,100],null)],null)],0)),c(qc(e)))}return null}},null,null)}(new Hf(null,0,xh,xh/
a,null))}
function Mh(a,b){var c=O(a,0),d=O(a,1);d=new Q(null,2,5,V,[c,d],null);c=O(d,0);d=O(d,1);if(0<=b&&2<=zh(Kg.a(c),Kg.a(d))){var e;e=Vf.u();var f=Ah(P.b(Hg,new Q(null,2,5,V,[c,d],null))),h=Ah(P.b(Cg,new Q(null,2,5,V,[c,d],null))),k=Tf("midpoint"),l=Kg.a(c),m=O(l,0),n=O(l,1),p=Kg.a(d),q=O(p,0),r=O(p,1),l=zh(l,p),l=f*l*(e-h),t=new Q(null,2,5,V,[Ah(new Q(null,2,5,V,[m,q],null)),Ah(new Q(null,2,5,V,[n,r],null))],null),p=O(t,0),t=O(t,1),n=new Q(null,2,5,V,[-(n-r),m-q],null),m=O(n,0),n=O(n,1),q=zh(new Q(null,2,
5,V,[0,0],null),new Q(null,2,5,V,[m,n],null)),n=new Q(null,2,5,V,[m/q,n/q],null),m=O(n,0),n=O(n,1);e=new ya(null,6,[Eg,k,pg,e,Cg,h,Hg,f,Kg,new Q(null,2,5,V,[p+l*m,t+l*n],null),xg,new ya(null,3,[wg,vg,Sg,Eg.a(c),Jg,Eg.a(d)],null)],null);c=Qd.b(Mh(new Q(null,2,5,V,[c,e],null),1),Mh(new Q(null,2,5,V,[e,d],null),1))}else c=new Q(null,1,5,V,[c],null);return c}
function Nh(){var a=Math.floor(17*Math.random()),b=3+a,c=Lh(b),d=Qd.b(c,new Q(null,1,5,V,[K(c)],null)),e=ve(2,1,d);return se(function(){return function(a){return Mh(a,15)}}(a,b,c,d,e),nc([e],0))}if("undefined"===typeof Jh){var Jh,Oh=new ya(null,1,[Mg,20],null);Jh=W.a?W.a(Oh):W.call(null,Oh)}
if("undefined"===typeof Ih)var Ih=function(){var a=W.a?W.a(Xd):W.call(null,Xd),b=W.a?W.a(Xd):W.call(null,Xd),c=W.a?W.a(Xd):W.call(null,Xd),d=W.a?W.a(Xd):W.call(null,Xd),e=I.c(Xd,Pg,ag());return new lg(mc.b("isle.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.A=1;a.G=function(a){var b=K(a);qc(a);return b};a.m=function(a){return a};return a}()}(a,b,c,d,e),rg,e,a,b,c,d)}();
var Ph=Ih;ie.o(Ph.Za,$c,sg,function(){return ie.b(Jh,function(a){return $c.c(a,Dg,Nh())})});gg(Ph.pb,Ph.Za,Ph.ab,Ph.nb);if("undefined"===typeof Qh)var Qh=function(a){return function(){var b=Hh();return a.a?a.a(b):a.call(null,b)}}(sh());if("undefined"===typeof Rh){var Rh,Sh=Jh;Cb(Sh,Ng,function(a,b,c,d){return Qh.a?Qh.a(d):Qh.call(null,d)});Rh=Sh}var Th=M.a?M.a(Jh):M.call(null,Jh);Qh.a?Qh.a(Th):Qh.call(null,Th);