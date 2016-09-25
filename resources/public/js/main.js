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
b&&"undefined"==typeof a.call)return"object";return b}var ba="closure_uid_"+(1E9*Math.random()>>>0),ca=0;function ea(a,b,c){return a.call.apply(a.bind,arguments)}function ga(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ja(a,b,c){ja=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ea:ga;return ja.apply(null,arguments)};function ma(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function na(a,b){null!=a&&this.append.apply(this,arguments)}g=na.prototype;g.Na="";g.set=function(a){this.Na=""+a};g.append=function(a,b,c){this.Na+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Na+=arguments[d];return this};g.clear=function(){this.Na=""};g.toString=function(){return this.Na};function oa(a,b){return a>b?1:a<b?-1:0};var pa={},ra;if("undefined"===typeof sa)var sa=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof ta)var ta=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var ua=null;if("undefined"===typeof va)var va=null;function wa(){return new xa(null,5,[ya,!0,za,!0,Ba,!1,Ca,!1,Da,null],null)}Ea;function y(a){return null!=a&&!1!==a}Ha;A;function Ia(a){return null==a}function Ja(a){return a instanceof Array}
function La(a){return null==a?!0:!1===a?!0:!1}function B(a,b){return a[u(null==b?null:b)]?!0:a._?!0:!1}function C(a,b){var c=null==b?null:b.constructor,c=y(y(c)?c.Cb:c)?c.lb:u(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Ma(a){var b=a.lb;return y(b)?b:""+E(a)}var Na="undefined"!==typeof Symbol&&"function"===u(Symbol)?Symbol.iterator:"@@iterator";function Oa(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}F;Pa;
var Ea=function Ea(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ea.a(arguments[0]);case 2:return Ea.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Ea.a=function(a){return Ea.b(null,a)};Ea.b=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Pa.c?Pa.c(c,d,b):Pa.call(null,c,d,b)};Ea.A=2;function Qa(){}
var Ra=function Ra(b){if(null!=b&&null!=b.X)return b.X(b);var c=Ra[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ra._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ICounted.-count",b);};function Sa(){}var Ta=function Ta(b,c){if(null!=b&&null!=b.T)return b.T(b,c);var d=Ta[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ta._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("ICollection.-conj",b);};function Ua(){}
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return G.b(arguments[0],arguments[1]);case 3:return G.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
G.b=function(a,b){if(null!=a&&null!=a.U)return a.U(a,b);var c=G[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=G._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("IIndexed.-nth",a);};G.c=function(a,b,c){if(null!=a&&null!=a.ta)return a.ta(a,b,c);var d=G[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=G._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IIndexed.-nth",a);};G.A=3;function Va(){}
var Xa=function Xa(b){if(null!=b&&null!=b.$)return b.$(b);var c=Xa[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Xa._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeq.-first",b);},Ya=function Ya(b){if(null!=b&&null!=b.qa)return b.qa(b);var c=Ya[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ya._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeq.-rest",b);};function Za(){}function $a(){}
var ab=function ab(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ab.b(arguments[0],arguments[1]);case 3:return ab.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
ab.b=function(a,b){if(null!=a&&null!=a.J)return a.J(a,b);var c=ab[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=ab._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("ILookup.-lookup",a);};ab.c=function(a,b,c){if(null!=a&&null!=a.H)return a.H(a,b,c);var d=ab[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=ab._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ILookup.-lookup",a);};ab.A=3;
var bb=function bb(b,c){if(null!=b&&null!=b.xb)return b.xb(b,c);var d=bb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=bb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IAssociative.-contains-key?",b);},cb=function cb(b,c,d){if(null!=b&&null!=b.Oa)return b.Oa(b,c,d);var e=cb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=cb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IAssociative.-assoc",b);};function db(){}
function fb(){}var gb=function gb(b){if(null!=b&&null!=b.eb)return b.eb(b);var c=gb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=gb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMapEntry.-key",b);},hb=function hb(b){if(null!=b&&null!=b.fb)return b.fb(b);var c=hb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=hb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMapEntry.-val",b);};function ib(){}function jb(){}
var kb=function kb(b,c,d){if(null!=b&&null!=b.Pa)return b.Pa(b,c,d);var e=kb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=kb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IVector.-assoc-n",b);},lb=function lb(b){if(null!=b&&null!=b.rb)return b.rb(b);var c=lb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=lb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IDeref.-deref",b);};function mb(){}
var nb=function nb(b){if(null!=b&&null!=b.O)return b.O(b);var c=nb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=nb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IMeta.-meta",b);},ob=function ob(b,c){if(null!=b&&null!=b.R)return b.R(b,c);var d=ob[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=ob._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IWithMeta.-with-meta",b);};function pb(){}
var qb=function qb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return qb.b(arguments[0],arguments[1]);case 3:return qb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
qb.b=function(a,b){if(null!=a&&null!=a.Y)return a.Y(a,b);var c=qb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=qb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("IReduce.-reduce",a);};qb.c=function(a,b,c){if(null!=a&&null!=a.Z)return a.Z(a,b,c);var d=qb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=qb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("IReduce.-reduce",a);};qb.A=3;
var rb=function rb(b,c){if(null!=b&&null!=b.w)return b.w(b,c);var d=rb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=rb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IEquiv.-equiv",b);},tb=function tb(b){if(null!=b&&null!=b.N)return b.N(b);var c=tb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=tb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IHash.-hash",b);};function ub(){}
var vb=function vb(b){if(null!=b&&null!=b.S)return b.S(b);var c=vb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=vb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ISeqable.-seq",b);};function wb(){}function xb(){}
var yb=function yb(b,c){if(null!=b&&null!=b.Kb)return b.Kb(0,c);var d=yb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=yb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IWriter.-write",b);},zb=function zb(b,c,d){if(null!=b&&null!=b.K)return b.K(b,c,d);var e=zb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=zb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IPrintWithWriter.-pr-writer",b);},Ab=function Ab(b,c,d){if(null!=b&&
null!=b.Jb)return b.Jb(0,c,d);var e=Ab[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Ab._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-notify-watches",b);},Bb=function Bb(b,c,d){if(null!=b&&null!=b.Ib)return b.Ib(0,c,d);var e=Bb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Bb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("IWatchable.-add-watch",b);},Cb=function Cb(b){if(null!=b&&null!=b.Va)return b.Va(b);
var c=Cb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Cb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEditableCollection.-as-transient",b);},Db=function Db(b,c){if(null!=b&&null!=b.jb)return b.jb(b,c);var d=Db[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Db._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("ITransientCollection.-conj!",b);},Eb=function Eb(b){if(null!=b&&null!=b.kb)return b.kb(b);var c=Eb[u(null==b?null:b)];if(null!=c)return c.a?
c.a(b):c.call(null,b);c=Eb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("ITransientCollection.-persistent!",b);},Fb=function Fb(b,c,d){if(null!=b&&null!=b.ib)return b.ib(b,c,d);var e=Fb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Fb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientAssociative.-assoc!",b);},Gb=function Gb(b,c,d){if(null!=b&&null!=b.Hb)return b.Hb(0,c,d);var e=Gb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,
b,c,d);e=Gb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw C("ITransientVector.-assoc-n!",b);};function Hb(){}
var Ib=function Ib(b,c){if(null!=b&&null!=b.Ua)return b.Ua(b,c);var d=Ib[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ib._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IComparable.-compare",b);},Jb=function Jb(b){if(null!=b&&null!=b.Fb)return b.Fb();var c=Jb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Jb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunk.-drop-first",b);},Kb=function Kb(b){if(null!=b&&null!=b.zb)return b.zb(b);var c=
Kb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Kb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedSeq.-chunked-first",b);},Lb=function Lb(b){if(null!=b&&null!=b.Ab)return b.Ab(b);var c=Lb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Lb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedSeq.-chunked-rest",b);},Nb=function Nb(b){if(null!=b&&null!=b.yb)return b.yb(b);var c=Nb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,
b);c=Nb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IChunkedNext.-chunked-next",b);},Ob=function Ob(b){if(null!=b&&null!=b.gb)return b.gb(b);var c=Ob[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ob._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("INamed.-name",b);},Pb=function Pb(b){if(null!=b&&null!=b.hb)return b.hb(b);var c=Pb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Pb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("INamed.-namespace",
b);},Qb=function Qb(b,c){if(null!=b&&null!=b.Xb)return b.Xb(b,c);var d=Qb[u(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Qb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw C("IReset.-reset!",b);},Rb=function Rb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Rb.b(arguments[0],arguments[1]);case 3:return Rb.c(arguments[0],arguments[1],arguments[2]);case 4:return Rb.s(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return Rb.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Rb.b=function(a,b){if(null!=a&&null!=a.Zb)return a.Zb(a,b);var c=Rb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=Rb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw C("ISwap.-swap!",a);};
Rb.c=function(a,b,c){if(null!=a&&null!=a.$b)return a.$b(a,b,c);var d=Rb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Rb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw C("ISwap.-swap!",a);};Rb.s=function(a,b,c,d){if(null!=a&&null!=a.ac)return a.ac(a,b,c,d);var e=Rb[u(null==a?null:a)];if(null!=e)return e.s?e.s(a,b,c,d):e.call(null,a,b,c,d);e=Rb._;if(null!=e)return e.s?e.s(a,b,c,d):e.call(null,a,b,c,d);throw C("ISwap.-swap!",a);};
Rb.C=function(a,b,c,d,e){if(null!=a&&null!=a.bc)return a.bc(a,b,c,d,e);var f=Rb[u(null==a?null:a)];if(null!=f)return f.C?f.C(a,b,c,d,e):f.call(null,a,b,c,d,e);f=Rb._;if(null!=f)return f.C?f.C(a,b,c,d,e):f.call(null,a,b,c,d,e);throw C("ISwap.-swap!",a);};Rb.A=5;var Sb=function Sb(b){if(null!=b&&null!=b.Da)return b.Da(b);var c=Sb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Sb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IIterable.-iterator",b);};
function Tb(a){this.kc=a;this.i=1073741824;this.B=0}Tb.prototype.Kb=function(a,b){return this.kc.append(b)};function Ub(a){var b=new na;a.K(null,new Tb(b),wa());return""+E(b)}var Wb="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function Xb(a){a=Wb(a|0,-862048943);return Wb(a<<15|a>>>-15,461845907)}
function Yb(a,b){var c=(a|0)^(b|0);return Wb(c<<13|c>>>-13,5)+-430675100|0}function Zb(a,b){var c=(a|0)^b,c=Wb(c^c>>>16,-2048144789),c=Wb(c^c>>>13,-1028477387);return c^c>>>16}function $b(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=Yb(c,Xb(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^Xb(a.charCodeAt(a.length-1)):b;return Zb(b,Wb(2,a.length))}ac;bc;cc;dc;var ec={},fc=0;
function gc(a){255<fc&&(ec={},fc=0);var b=ec[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=Wb(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;ec[a]=b;fc+=1}return a=b}function hc(a){null!=a&&(a.i&4194304||a.pc)?a=a.N(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=gc(a),0!==a&&(a=Xb(a),a=Yb(0,a),a=Zb(a,4))):a=a instanceof Date?a.valueOf():null==a?0:tb(a);return a}
function ic(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Ha(a,b){return b instanceof a}function jc(a,b){if(a.Ga===b.Ga)return 0;var c=La(a.ra);if(y(c?b.ra:c))return-1;if(y(a.ra)){if(La(b.ra))return 1;c=oa(a.ra,b.ra);return 0===c?oa(a.name,b.name):c}return oa(a.name,b.name)}H;function bc(a,b,c,d,e){this.ra=a;this.name=b;this.Ga=c;this.Ta=d;this.ya=e;this.i=2154168321;this.B=4096}g=bc.prototype;g.toString=function(){return this.Ga};g.equiv=function(a){return this.w(null,a)};
g.w=function(a,b){return b instanceof bc?this.Ga===b.Ga:!1};g.call=function(){function a(a,b,c){return H.c?H.c(b,this,c):H.call(null,b,this,c)}function b(a,b){return H.b?H.b(b,this):H.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};
g.a=function(a){return H.b?H.b(a,this):H.call(null,a,this)};g.b=function(a,b){return H.c?H.c(a,this,b):H.call(null,a,this,b)};g.O=function(){return this.ya};g.R=function(a,b){return new bc(this.ra,this.name,this.Ga,this.Ta,b)};g.N=function(){var a=this.Ta;return null!=a?a:this.Ta=a=ic($b(this.name),gc(this.ra))};g.gb=function(){return this.name};g.hb=function(){return this.ra};g.K=function(a,b){return yb(b,this.Ga)};
var lc=function lc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return lc.a(arguments[0]);case 2:return lc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};lc.a=function(a){if(a instanceof bc)return a;var b=a.indexOf("/");return-1===b?lc.b(null,a):lc.b(a.substring(0,b),a.substring(b+1,a.length))};lc.b=function(a,b){var c=null!=a?[E(a),E("/"),E(b)].join(""):b;return new bc(a,b,c,null,null)};
lc.A=2;mc;nc;J;function K(a){if(null==a)return null;if(null!=a&&(a.i&8388608||a.Yb))return a.S(null);if(Ja(a)||"string"===typeof a)return 0===a.length?null:new J(a,0);if(B(ub,a))return vb(a);throw Error([E(a),E(" is not ISeqable")].join(""));}function L(a){if(null==a)return null;if(null!=a&&(a.i&64||a.Ia))return a.$(null);a=K(a);return null==a?null:Xa(a)}function oc(a){return null!=a?null!=a&&(a.i&64||a.Ia)?a.qa(null):(a=K(a))?Ya(a):pc:pc}
function M(a){return null==a?null:null!=a&&(a.i&128||a.sb)?a.pa(null):K(oc(a))}var cc=function cc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return cc.a(arguments[0]);case 2:return cc.b(arguments[0],arguments[1]);default:return cc.m(arguments[0],arguments[1],new J(c.slice(2),0))}};cc.a=function(){return!0};cc.b=function(a,b){return null==a?null==b:a===b||rb(a,b)};
cc.m=function(a,b,c){for(;;)if(cc.b(a,b))if(M(c))a=b,b=L(c),c=M(c);else return cc.b(b,L(c));else return!1};cc.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return cc.m(b,a,c)};cc.A=2;function qc(a){this.F=a}qc.prototype.next=function(){if(null!=this.F){var a=L(this.F);this.F=M(this.F);return{value:a,done:!1}}return{value:null,done:!0}};function rc(a){return new qc(K(a))}sc;function tc(a,b,c){this.value=a;this.Ya=b;this.ub=c;this.i=8388672;this.B=0}tc.prototype.S=function(){return this};
tc.prototype.$=function(){return this.value};tc.prototype.qa=function(){null==this.ub&&(this.ub=sc.a?sc.a(this.Ya):sc.call(null,this.Ya));return this.ub};function sc(a){var b=a.next();return y(b.done)?pc:new tc(b.value,a,null)}function uc(a,b){var c=Xb(a),c=Yb(0,c);return Zb(c,b)}function vc(a){var b=0,c=1;for(a=K(a);;)if(null!=a)b+=1,c=Wb(31,c)+hc(L(a))|0,a=M(a);else return uc(c,b)}var wc=uc(1,0);function xc(a){var b=0,c=0;for(a=K(a);;)if(null!=a)b+=1,c=c+hc(L(a))|0,a=M(a);else return uc(c,b)}
var yc=uc(0,0);zc;ac;Ac;Qa["null"]=!0;Ra["null"]=function(){return 0};Date.prototype.w=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.bb=!0;Date.prototype.Ua=function(a,b){if(b instanceof Date)return oa(this.valueOf(),b.valueOf());throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};rb.number=function(a,b){return a===b};Bc;mb["function"]=!0;nb["function"]=function(){return null};tb._=function(a){return a[ba]||(a[ba]=++ca)};
function Cc(a){return a+1}N;function Dc(a){this.M=a;this.i=32768;this.B=0}Dc.prototype.rb=function(){return this.M};function Ec(a){return a instanceof Dc}function N(a){return lb(a)}function Fc(a,b){var c=Ra(a);if(0===c)return b.o?b.o():b.call(null);for(var d=G.b(a,0),e=1;;)if(e<c){var f=G.b(a,e),d=b.b?b.b(d,f):b.call(null,d,f);if(Ec(d))return lb(d);e+=1}else return d}
function Gc(a,b,c){var d=Ra(a),e=c;for(c=0;;)if(c<d){var f=G.b(a,c),e=b.b?b.b(e,f):b.call(null,e,f);if(Ec(e))return lb(e);c+=1}else return e}function Hc(a,b){var c=a.length;if(0===a.length)return b.o?b.o():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.b?b.b(d,f):b.call(null,d,f);if(Ec(d))return lb(d);e+=1}else return d}function Ic(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.b?b.b(e,f):b.call(null,e,f);if(Ec(e))return lb(e);c+=1}else return e}
function Jc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.b?b.b(c,f):b.call(null,c,f);if(Ec(c))return lb(c);d+=1}else return c}Kc;O;Lc;Mc;function Nc(a){return null!=a?a.i&2||a.Ob?!0:a.i?!1:B(Qa,a):B(Qa,a)}function Oc(a){return null!=a?a.i&16||a.Gb?!0:a.i?!1:B(Ua,a):B(Ua,a)}function Pc(a,b){this.f=a;this.j=b}Pc.prototype.ua=function(){return this.j<this.f.length};Pc.prototype.next=function(){var a=this.f[this.j];this.j+=1;return a};
function J(a,b){this.f=a;this.j=b;this.i=166199550;this.B=8192}g=J.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};g.U=function(a,b){var c=b+this.j;return c<this.f.length?this.f[c]:null};g.ta=function(a,b,c){a=b+this.j;return a<this.f.length?this.f[a]:c};g.Da=function(){return new Pc(this.f,this.j)};g.pa=function(){return this.j+1<this.f.length?new J(this.f,this.j+1):null};g.X=function(){var a=this.f.length-this.j;return 0>a?0:a};g.N=function(){return vc(this)};
g.w=function(a,b){return Ac.b?Ac.b(this,b):Ac.call(null,this,b)};g.Y=function(a,b){return Jc(this.f,b,this.f[this.j],this.j+1)};g.Z=function(a,b,c){return Jc(this.f,b,c,this.j)};g.$=function(){return this.f[this.j]};g.qa=function(){return this.j+1<this.f.length?new J(this.f,this.j+1):pc};g.S=function(){return this.j<this.f.length?this:null};g.T=function(a,b){return O.b?O.b(b,this):O.call(null,b,this)};J.prototype[Na]=function(){return rc(this)};
var nc=function nc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return nc.a(arguments[0]);case 2:return nc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};nc.a=function(a){return nc.b(a,0)};nc.b=function(a,b){return b<a.length?new J(a,b):null};nc.A=2;
var mc=function mc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return mc.a(arguments[0]);case 2:return mc.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};mc.a=function(a){return nc.b(a,0)};mc.b=function(a,b){return nc.b(a,b)};mc.A=2;Bc;Qc;function Lc(a,b,c){this.qb=a;this.j=b;this.v=c;this.i=32374990;this.B=8192}g=Lc.prototype;g.toString=function(){return Ub(this)};
g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){return 0<this.j?new Lc(this.qb,this.j-1,null):null};g.X=function(){return this.j+1};g.N=function(){return vc(this)};g.w=function(a,b){return Ac.b?Ac.b(this,b):Ac.call(null,this,b)};g.Y=function(a,b){return Qc.b?Qc.b(b,this):Qc.call(null,b,this)};g.Z=function(a,b,c){return Qc.c?Qc.c(b,c,this):Qc.call(null,b,c,this)};g.$=function(){return G.b(this.qb,this.j)};
g.qa=function(){return 0<this.j?new Lc(this.qb,this.j-1,null):pc};g.S=function(){return this};g.R=function(a,b){return new Lc(this.qb,this.j,b)};g.T=function(a,b){return O.b?O.b(b,this):O.call(null,b,this)};Lc.prototype[Na]=function(){return rc(this)};function Rc(a){return L(M(a))}rb._=function(a,b){return a===b};
var Sc=function Sc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Sc.o();case 1:return Sc.a(arguments[0]);case 2:return Sc.b(arguments[0],arguments[1]);default:return Sc.m(arguments[0],arguments[1],new J(c.slice(2),0))}};Sc.o=function(){return Tc};Sc.a=function(a){return a};Sc.b=function(a,b){return null!=a?Ta(a,b):Ta(pc,b)};Sc.m=function(a,b,c){for(;;)if(y(c))a=Sc.b(a,b),b=L(c),c=M(c);else return Sc.b(a,b)};
Sc.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return Sc.m(b,a,c)};Sc.A=2;function Vc(a){if(null!=a)if(null!=a&&(a.i&2||a.Ob))a=a.X(null);else if(Ja(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.i&8388608||a.Yb))a:{a=K(a);for(var b=0;;){if(Nc(a)){a=b+Ra(a);break a}a=M(a);b+=1}}else a=Ra(a);else a=0;return a}function Wc(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return K(a)?L(a):c;if(Oc(a))return G.c(a,b,c);if(K(a)){var d=M(a),e=b-1;a=d;b=e}else return c}}
function Xc(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.i&16||a.Gb))return a.U(null,b);if(Ja(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Ia)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(K(c)){c=L(c);break a}throw Error("Index out of bounds");}if(Oc(c)){c=G.b(c,d);break a}if(K(c))c=M(c),--d;else throw Error("Index out of bounds");
}}return c}if(B(Ua,a))return G.b(a,b);throw Error([E("nth not supported on this type "),E(Ma(null==a?null:a.constructor))].join(""));}
function P(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.i&16||a.Gb))return a.ta(null,b,null);if(Ja(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Ia))return Wc(a,b);if(B(Ua,a))return G.b(a,b);throw Error([E("nth not supported on this type "),E(Ma(null==a?null:a.constructor))].join(""));}
var H=function H(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return H.b(arguments[0],arguments[1]);case 3:return H.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};H.b=function(a,b){return null==a?null:null!=a&&(a.i&256||a.Rb)?a.J(null,b):Ja(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:B($a,a)?ab.b(a,b):null};
H.c=function(a,b,c){return null!=a?null!=a&&(a.i&256||a.Rb)?a.H(null,b,c):Ja(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:B($a,a)?ab.c(a,b,c):c:c};H.A=3;Yc;var Zc=function Zc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Zc.c(arguments[0],arguments[1],arguments[2]);default:return Zc.m(arguments[0],arguments[1],arguments[2],new J(c.slice(3),0))}};
Zc.c=function(a,b,c){if(null!=a)a=cb(a,b,c);else a:{a=[b];c=[c];b=a.length;var d=0,e;for(e=Cb($c);;)if(d<b){var f=d+1;e=e.ib(null,a[d],c[d]);d=f}else{a=Eb(e);break a}}return a};Zc.m=function(a,b,c,d){for(;;)if(a=Zc.c(a,b,c),y(d))b=L(d),c=Rc(d),d=M(M(d));else return a};Zc.D=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),d=M(d);return Zc.m(b,a,c,d)};Zc.A=3;function ad(a,b){this.g=a;this.v=b;this.i=393217;this.B=0}g=ad.prototype;g.O=function(){return this.v};
g.R=function(a,b){return new ad(this.g,b)};
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I,S){a=this;return F.cb?F.cb(a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I,S):F.call(null,a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I,S)}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I){a=this;return a.g.ma?a.g.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D){a=this;return a.g.la?a.g.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):
a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x){a=this;return a.g.ka?a.g.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){a=this;return a.g.ja?a.g.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){a=this;return a.g.ia?a.g.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.g.call(null,b,
c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){a=this;return a.g.ha?a.g.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)}function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){a=this;return a.g.ga?a.g.ga(b,c,d,e,f,h,k,l,m,n,p,q,r,t):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;return a.g.fa?a.g.fa(b,c,d,e,f,h,k,l,m,n,p,q,r):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;
return a.g.ea?a.g.ea(b,c,d,e,f,h,k,l,m,n,p,q):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;return a.g.da?a.g.da(b,c,d,e,f,h,k,l,m,n,p):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,n){a=this;return a.g.ca?a.g.ca(b,c,d,e,f,h,k,l,m,n):a.g.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;return a.g.oa?a.g.oa(b,c,d,e,f,h,k,l,m):a.g.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;return a.g.na?a.g.na(b,c,
d,e,f,h,k,l):a.g.call(null,b,c,d,e,f,h,k,l)}function t(a,b,c,d,e,f,h,k){a=this;return a.g.W?a.g.W(b,c,d,e,f,h,k):a.g.call(null,b,c,d,e,f,h,k)}function v(a,b,c,d,e,f,h){a=this;return a.g.V?a.g.V(b,c,d,e,f,h):a.g.call(null,b,c,d,e,f,h)}function w(a,b,c,d,e,f){a=this;return a.g.C?a.g.C(b,c,d,e,f):a.g.call(null,b,c,d,e,f)}function z(a,b,c,d,e){a=this;return a.g.s?a.g.s(b,c,d,e):a.g.call(null,b,c,d,e)}function D(a,b,c,d){a=this;return a.g.c?a.g.c(b,c,d):a.g.call(null,b,c,d)}function I(a,b,c){a=this;return a.g.b?
a.g.b(b,c):a.g.call(null,b,c)}function S(a,b){a=this;return a.g.a?a.g.a(b):a.g.call(null,b)}function la(a){a=this;return a.g.o?a.g.o():a.g.call(null)}var x=null,x=function(Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x,Wa,eb,sb,Mb,kc,Uc,se){switch(arguments.length){case 1:return la.call(this,Fa);case 2:return S.call(this,Fa,R);case 3:return I.call(this,Fa,R,T);case 4:return D.call(this,Fa,R,T,W);case 5:return z.call(this,Fa,R,T,W,Z);case 6:return w.call(this,Fa,R,T,W,Z,da);case 7:return v.call(this,Fa,R,
T,W,Z,da,fa);case 8:return t.call(this,Fa,R,T,W,Z,da,fa,ha);case 9:return r.call(this,Fa,R,T,W,Z,da,fa,ha,ia);case 10:return q.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka);case 11:return p.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa);case 12:return n.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa);case 13:return m.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga);case 14:return l.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka);case 15:return k.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x);case 16:return h.call(this,
Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x,Wa);case 17:return f.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x,Wa,eb);case 18:return e.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x,Wa,eb,sb);case 19:return d.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x,Wa,eb,sb,Mb);case 20:return c.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x,Wa,eb,sb,Mb,kc);case 21:return b.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,x,Wa,eb,sb,Mb,kc,Uc);case 22:return a.call(this,Fa,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,
Ga,Ka,x,Wa,eb,sb,Mb,kc,Uc,se)}throw Error("Invalid arity: "+arguments.length);};x.a=la;x.b=S;x.c=I;x.s=D;x.C=z;x.V=w;x.W=v;x.na=t;x.oa=r;x.ca=q;x.da=p;x.ea=n;x.fa=m;x.ga=l;x.ha=k;x.ia=h;x.ja=f;x.ka=e;x.la=d;x.ma=c;x.Bb=b;x.cb=a;return x}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.o=function(){return this.g.o?this.g.o():this.g.call(null)};g.a=function(a){return this.g.a?this.g.a(a):this.g.call(null,a)};
g.b=function(a,b){return this.g.b?this.g.b(a,b):this.g.call(null,a,b)};g.c=function(a,b,c){return this.g.c?this.g.c(a,b,c):this.g.call(null,a,b,c)};g.s=function(a,b,c,d){return this.g.s?this.g.s(a,b,c,d):this.g.call(null,a,b,c,d)};g.C=function(a,b,c,d,e){return this.g.C?this.g.C(a,b,c,d,e):this.g.call(null,a,b,c,d,e)};g.V=function(a,b,c,d,e,f){return this.g.V?this.g.V(a,b,c,d,e,f):this.g.call(null,a,b,c,d,e,f)};
g.W=function(a,b,c,d,e,f,h){return this.g.W?this.g.W(a,b,c,d,e,f,h):this.g.call(null,a,b,c,d,e,f,h)};g.na=function(a,b,c,d,e,f,h,k){return this.g.na?this.g.na(a,b,c,d,e,f,h,k):this.g.call(null,a,b,c,d,e,f,h,k)};g.oa=function(a,b,c,d,e,f,h,k,l){return this.g.oa?this.g.oa(a,b,c,d,e,f,h,k,l):this.g.call(null,a,b,c,d,e,f,h,k,l)};g.ca=function(a,b,c,d,e,f,h,k,l,m){return this.g.ca?this.g.ca(a,b,c,d,e,f,h,k,l,m):this.g.call(null,a,b,c,d,e,f,h,k,l,m)};
g.da=function(a,b,c,d,e,f,h,k,l,m,n){return this.g.da?this.g.da(a,b,c,d,e,f,h,k,l,m,n):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n)};g.ea=function(a,b,c,d,e,f,h,k,l,m,n,p){return this.g.ea?this.g.ea(a,b,c,d,e,f,h,k,l,m,n,p):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.fa=function(a,b,c,d,e,f,h,k,l,m,n,p,q){return this.g.fa?this.g.fa(a,b,c,d,e,f,h,k,l,m,n,p,q):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){return this.g.ga?this.g.ga(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){return this.g.ha?this.g.ha(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t)};g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){return this.g.ia?this.g.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)};
g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w){return this.g.ja?this.g.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)};g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){return this.g.ka?this.g.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)};
g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D){return this.g.la?this.g.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D)};g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I){return this.g.ma?this.g.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I)};
g.Bb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S){return F.cb?F.cb(this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S):F.call(null,this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S)};function Bc(a,b){return"function"==u(a)?new ad(a,b):null==a?null:ob(a,b)}function bd(a){var b=null!=a;return(b?null!=a?a.i&131072||a.Ub||(a.i?0:B(mb,a)):B(mb,a):b)?nb(a):null}function cd(a){return null==a?!1:null!=a?a.i&4096||a.sc?!0:a.i?!1:B(ib,a):B(ib,a)}
function dd(a){return null!=a?a.i&16777216||a.rc?!0:a.i?!1:B(wb,a):B(wb,a)}function ed(a){return null==a?!1:null!=a?a.i&1024||a.Sb?!0:a.i?!1:B(db,a):B(db,a)}function fd(a){return null!=a?a.i&16384||a.tc?!0:a.i?!1:B(jb,a):B(jb,a)}gd;hd;function id(a){return null!=a?a.B&512||a.mc?!0:!1:!1}function jd(a){var b=[];ma(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function kd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var ld={};
function md(a){return null==a?!1:null!=a?a.i&64||a.Ia?!0:a.i?!1:B(Va,a):B(Va,a)}function nd(a){return null==a?!1:!1===a?!1:!0}function od(a,b){return H.c(a,b,ld)===ld?!1:!0}
function dc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return oa(a,b);throw Error([E("Cannot compare "),E(a),E(" to "),E(b)].join(""));}if(null!=a?a.B&2048||a.bb||(a.B?0:B(Hb,a)):B(Hb,a))return Ib(a,b);if("string"!==typeof a&&!Ja(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([E("Cannot compare "),E(a),E(" to "),E(b)].join(""));return oa(a,b)}
function pd(a,b){var c=Vc(a),d=Vc(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=dc(Xc(a,d),Xc(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}qd;var Qc=function Qc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Qc.b(arguments[0],arguments[1]);case 3:return Qc.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Qc.b=function(a,b){var c=K(b);if(c){var d=L(c),c=M(c);return Pa.c?Pa.c(a,d,c):Pa.call(null,a,d,c)}return a.o?a.o():a.call(null)};Qc.c=function(a,b,c){for(c=K(c);;)if(c){var d=L(c);b=a.b?a.b(b,d):a.call(null,b,d);if(Ec(b))return lb(b);c=M(c)}else return b};Qc.A=3;rd;
var Pa=function Pa(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Pa.b(arguments[0],arguments[1]);case 3:return Pa.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Pa.b=function(a,b){return null!=b&&(b.i&524288||b.Wb)?b.Y(null,a):Ja(b)?Hc(b,a):"string"===typeof b?Hc(b,a):B(pb,b)?qb.b(b,a):Qc.b(a,b)};
Pa.c=function(a,b,c){return null!=c&&(c.i&524288||c.Wb)?c.Z(null,a,b):Ja(c)?Ic(c,a,b):"string"===typeof c?Ic(c,a,b):B(pb,c)?qb.c(c,a,b):Qc.c(a,b,c)};Pa.A=3;function sd(a){return a}var td=function td(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return td.o();case 1:return td.a(arguments[0]);case 2:return td.b(arguments[0],arguments[1]);default:return td.m(arguments[0],arguments[1],new J(c.slice(2),0))}};td.o=function(){return 0};
td.a=function(a){return a};td.b=function(a,b){return a+b};td.m=function(a,b,c){return Pa.c(td,a+b,c)};td.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return td.m(b,a,c)};td.A=2;pa.wc;var ud=function ud(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ud.a(arguments[0]);case 2:return ud.b(arguments[0],arguments[1]);default:return ud.m(arguments[0],arguments[1],new J(c.slice(2),0))}};ud.a=function(a){return a};
ud.b=function(a,b){return a>b?a:b};ud.m=function(a,b,c){return Pa.c(ud,a>b?a:b,c)};ud.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return ud.m(b,a,c)};ud.A=2;var vd=function vd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return vd.a(arguments[0]);case 2:return vd.b(arguments[0],arguments[1]);default:return vd.m(arguments[0],arguments[1],new J(c.slice(2),0))}};vd.a=function(a){return a};vd.b=function(a,b){return a<b?a:b};
vd.m=function(a,b,c){return Pa.c(vd,a<b?a:b,c)};vd.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return vd.m(b,a,c)};vd.A=2;wd;function wd(a,b){return(a%b+b)%b}function xd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function yd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function zd(a){var b=2;for(a=K(a);;)if(a&&0<b)--b,a=M(a);else return a}
var E=function E(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return E.o();case 1:return E.a(arguments[0]);default:return E.m(arguments[0],new J(c.slice(1),0))}};E.o=function(){return""};E.a=function(a){return null==a?"":""+a};E.m=function(a,b){for(var c=new na(""+E(a)),d=b;;)if(y(d))c=c.append(""+E(L(d))),d=M(d);else return c.toString()};E.D=function(a){var b=L(a);a=M(a);return E.m(b,a)};E.A=1;Q;Ad;
function Ac(a,b){var c;if(dd(b))if(Nc(a)&&Nc(b)&&Vc(a)!==Vc(b))c=!1;else a:{c=K(a);for(var d=K(b);;){if(null==c){c=null==d;break a}if(null!=d&&cc.b(L(c),L(d)))c=M(c),d=M(d);else{c=!1;break a}}}else c=null;return nd(c)}function Kc(a){if(K(a)){var b=hc(L(a));for(a=M(a);;){if(null==a)return b;b=ic(b,hc(L(a)));a=M(a)}}else return 0}Bd;Cd;Ad;Dd;Ed;function Mc(a,b,c,d,e){this.v=a;this.first=b;this.sa=c;this.count=d;this.u=e;this.i=65937646;this.B=8192}g=Mc.prototype;g.toString=function(){return Ub(this)};
g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){return 1===this.count?null:this.sa};g.X=function(){return this.count};g.N=function(){var a=this.u;return null!=a?a:this.u=a=vc(this)};g.w=function(a,b){return Ac(this,b)};g.Y=function(a,b){return Qc.b(b,this)};g.Z=function(a,b,c){return Qc.c(b,c,this)};g.$=function(){return this.first};g.qa=function(){return 1===this.count?pc:this.sa};g.S=function(){return this};
g.R=function(a,b){return new Mc(b,this.first,this.sa,this.count,this.u)};g.T=function(a,b){return new Mc(this.v,b,this,this.count+1,null)};Mc.prototype[Na]=function(){return rc(this)};function Fd(a){this.v=a;this.i=65937614;this.B=8192}g=Fd.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){return null};g.X=function(){return 0};g.N=function(){return wc};
g.w=function(a,b){return(null!=b?b.i&33554432||b.qc||(b.i?0:B(xb,b)):B(xb,b))||dd(b)?null==K(b):!1};g.Y=function(a,b){return Qc.b(b,this)};g.Z=function(a,b,c){return Qc.c(b,c,this)};g.$=function(){return null};g.qa=function(){return pc};g.S=function(){return null};g.R=function(a,b){return new Fd(b)};g.T=function(a,b){return new Mc(this.v,b,null,1,null)};var pc=new Fd(null);Fd.prototype[Na]=function(){return rc(this)};
var ac=function ac(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ac.m(0<c.length?new J(c.slice(0),0):null)};ac.m=function(a){var b;if(a instanceof J&&0===a.j)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.$(null)),a=a.pa(null);else break a;a=b.length;for(var c=pc;;)if(0<a){var d=a-1,c=c.T(null,b[a-1]);a=d}else return c};ac.A=0;ac.D=function(a){return ac.m(K(a))};function Gd(a,b,c,d){this.v=a;this.first=b;this.sa=c;this.u=d;this.i=65929452;this.B=8192}g=Gd.prototype;
g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){return null==this.sa?null:K(this.sa)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=vc(this)};g.w=function(a,b){return Ac(this,b)};g.Y=function(a,b){return Qc.b(b,this)};g.Z=function(a,b,c){return Qc.c(b,c,this)};g.$=function(){return this.first};g.qa=function(){return null==this.sa?pc:this.sa};g.S=function(){return this};
g.R=function(a,b){return new Gd(b,this.first,this.sa,this.u)};g.T=function(a,b){return new Gd(null,b,this,this.u)};Gd.prototype[Na]=function(){return rc(this)};function O(a,b){var c=null==b;return(c?c:null!=b&&(b.i&64||b.Ia))?new Gd(null,a,b,null):new Gd(null,a,K(b),null)}function Hd(a,b){if(a.Ea===b.Ea)return 0;var c=La(a.ra);if(y(c?b.ra:c))return-1;if(y(a.ra)){if(La(b.ra))return 1;c=oa(a.ra,b.ra);return 0===c?oa(a.name,b.name):c}return oa(a.name,b.name)}
function A(a,b,c,d){this.ra=a;this.name=b;this.Ea=c;this.Ta=d;this.i=2153775105;this.B=4096}g=A.prototype;g.toString=function(){return[E(":"),E(this.Ea)].join("")};g.equiv=function(a){return this.w(null,a)};g.w=function(a,b){return b instanceof A?this.Ea===b.Ea:!1};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return H.b(c,this);case 3:return H.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return H.b(c,this)};a.c=function(a,c,d){return H.c(c,this,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return H.b(a,this)};g.b=function(a,b){return H.c(a,this,b)};
g.N=function(){var a=this.Ta;return null!=a?a:this.Ta=a=ic($b(this.name),gc(this.ra))+2654435769|0};g.gb=function(){return this.name};g.hb=function(){return this.ra};g.K=function(a,b){return yb(b,[E(":"),E(this.Ea)].join(""))};var Id=function Id(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Id.a(arguments[0]);case 2:return Id.b(arguments[0],arguments[1]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Id.a=function(a){if(a instanceof A)return a;if(a instanceof bc){var b;if(null!=a&&(a.B&4096||a.Vb))b=a.hb(null);else throw Error([E("Doesn't support namespace: "),E(a)].join(""));return new A(b,Ad.a?Ad.a(a):Ad.call(null,a),a.Ga,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new A(b[0],b[1],a,null):new A(null,b[0],a,null)):null};Id.b=function(a,b){return new A(a,b,[E(y(a)?[E(a),E("/")].join(""):null),E(b)].join(""),null)};Id.A=2;
function Jd(a,b,c,d){this.v=a;this.Xa=b;this.F=c;this.u=d;this.i=32374988;this.B=0}g=Jd.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};function Kd(a){null!=a.Xa&&(a.F=a.Xa.o?a.Xa.o():a.Xa.call(null),a.Xa=null);return a.F}g.O=function(){return this.v};g.pa=function(){vb(this);return null==this.F?null:M(this.F)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=vc(this)};g.w=function(a,b){return Ac(this,b)};g.Y=function(a,b){return Qc.b(b,this)};
g.Z=function(a,b,c){return Qc.c(b,c,this)};g.$=function(){vb(this);return null==this.F?null:L(this.F)};g.qa=function(){vb(this);return null!=this.F?oc(this.F):pc};g.S=function(){Kd(this);if(null==this.F)return null;for(var a=this.F;;)if(a instanceof Jd)a=Kd(a);else return this.F=a,K(this.F)};g.R=function(a,b){return new Jd(b,this.Xa,this.F,this.u)};g.T=function(a,b){return O(b,this)};Jd.prototype[Na]=function(){return rc(this)};Ld;function Md(a,b){this.wb=a;this.end=b;this.i=2;this.B=0}
Md.prototype.add=function(a){this.wb[this.end]=a;return this.end+=1};Md.prototype.za=function(){var a=new Ld(this.wb,0,this.end);this.wb=null;return a};Md.prototype.X=function(){return this.end};function Ld(a,b,c){this.f=a;this.ba=b;this.end=c;this.i=524306;this.B=0}g=Ld.prototype;g.X=function(){return this.end-this.ba};g.U=function(a,b){return this.f[this.ba+b]};g.ta=function(a,b,c){return 0<=b&&b<this.end-this.ba?this.f[this.ba+b]:c};
g.Fb=function(){if(this.ba===this.end)throw Error("-drop-first of empty chunk");return new Ld(this.f,this.ba+1,this.end)};g.Y=function(a,b){return Jc(this.f,b,this.f[this.ba],this.ba+1)};g.Z=function(a,b,c){return Jc(this.f,b,c,this.ba)};function gd(a,b,c,d){this.za=a;this.Fa=b;this.v=c;this.u=d;this.i=31850732;this.B=1536}g=gd.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};
g.pa=function(){if(1<Ra(this.za))return new gd(Jb(this.za),this.Fa,this.v,null);var a=vb(this.Fa);return null==a?null:a};g.N=function(){var a=this.u;return null!=a?a:this.u=a=vc(this)};g.w=function(a,b){return Ac(this,b)};g.$=function(){return G.b(this.za,0)};g.qa=function(){return 1<Ra(this.za)?new gd(Jb(this.za),this.Fa,this.v,null):null==this.Fa?pc:this.Fa};g.S=function(){return this};g.zb=function(){return this.za};g.Ab=function(){return null==this.Fa?pc:this.Fa};
g.R=function(a,b){return new gd(this.za,this.Fa,b,this.u)};g.T=function(a,b){return O(b,this)};g.yb=function(){return null==this.Fa?null:this.Fa};gd.prototype[Na]=function(){return rc(this)};function Nd(a,b){return 0===Ra(a)?b:new gd(a,b,null,null)}function Od(a,b){a.add(b)}function Dd(a){return Kb(a)}function Ed(a){return Lb(a)}function qd(a){for(var b=[];;)if(K(a))b.push(L(a)),a=M(a);else return b}
function Pd(a,b){if(Nc(a))return Vc(a);for(var c=a,d=b,e=0;;)if(0<d&&K(c))c=M(c),--d,e+=1;else return e}var Qd=function Qd(b){return null==b?null:null==M(b)?K(L(b)):O(L(b),Qd(M(b)))},Rd=function Rd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Rd.o();case 1:return Rd.a(arguments[0]);case 2:return Rd.b(arguments[0],arguments[1]);default:return Rd.m(arguments[0],arguments[1],new J(c.slice(2),0))}};
Rd.o=function(){return new Jd(null,function(){return null},null,null)};Rd.a=function(a){return new Jd(null,function(){return a},null,null)};Rd.b=function(a,b){return new Jd(null,function(){var c=K(a);return c?id(c)?Nd(Kb(c),Rd.b(Lb(c),b)):O(L(c),Rd.b(oc(c),b)):b},null,null)};Rd.m=function(a,b,c){return function e(a,b){return new Jd(null,function(){var c=K(a);return c?id(c)?Nd(Kb(c),e(Lb(c),b)):O(L(c),e(oc(c),b)):y(b)?e(L(b),M(b)):null},null,null)}(Rd.b(a,b),c)};
Rd.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return Rd.m(b,a,c)};Rd.A=2;var Sd=function Sd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Sd.o();case 1:return Sd.a(arguments[0]);case 2:return Sd.b(arguments[0],arguments[1]);default:return Sd.m(arguments[0],arguments[1],new J(c.slice(2),0))}};Sd.o=function(){return Cb(Tc)};Sd.a=function(a){return a};Sd.b=function(a,b){return Db(a,b)};
Sd.m=function(a,b,c){for(;;)if(a=Db(a,b),y(c))b=L(c),c=M(c);else return a};Sd.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return Sd.m(b,a,c)};Sd.A=2;
function Td(a,b,c){var d=K(c);if(0===b)return a.o?a.o():a.call(null);c=Xa(d);var e=Ya(d);if(1===b)return a.a?a.a(c):a.a?a.a(c):a.call(null,c);var d=Xa(e),f=Ya(e);if(2===b)return a.b?a.b(c,d):a.b?a.b(c,d):a.call(null,c,d);var e=Xa(f),h=Ya(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=Xa(h),k=Ya(h);if(4===b)return a.s?a.s(c,d,e,f):a.s?a.s(c,d,e,f):a.call(null,c,d,e,f);var h=Xa(k),l=Ya(k);if(5===b)return a.C?a.C(c,d,e,f,h):a.C?a.C(c,d,e,f,h):a.call(null,c,d,e,f,h);var k=Xa(l),
m=Ya(l);if(6===b)return a.V?a.V(c,d,e,f,h,k):a.V?a.V(c,d,e,f,h,k):a.call(null,c,d,e,f,h,k);var l=Xa(m),n=Ya(m);if(7===b)return a.W?a.W(c,d,e,f,h,k,l):a.W?a.W(c,d,e,f,h,k,l):a.call(null,c,d,e,f,h,k,l);var m=Xa(n),p=Ya(n);if(8===b)return a.na?a.na(c,d,e,f,h,k,l,m):a.na?a.na(c,d,e,f,h,k,l,m):a.call(null,c,d,e,f,h,k,l,m);var n=Xa(p),q=Ya(p);if(9===b)return a.oa?a.oa(c,d,e,f,h,k,l,m,n):a.oa?a.oa(c,d,e,f,h,k,l,m,n):a.call(null,c,d,e,f,h,k,l,m,n);var p=Xa(q),r=Ya(q);if(10===b)return a.ca?a.ca(c,d,e,f,h,
k,l,m,n,p):a.ca?a.ca(c,d,e,f,h,k,l,m,n,p):a.call(null,c,d,e,f,h,k,l,m,n,p);var q=Xa(r),t=Ya(r);if(11===b)return a.da?a.da(c,d,e,f,h,k,l,m,n,p,q):a.da?a.da(c,d,e,f,h,k,l,m,n,p,q):a.call(null,c,d,e,f,h,k,l,m,n,p,q);var r=Xa(t),v=Ya(t);if(12===b)return a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q,r):a.ea?a.ea(c,d,e,f,h,k,l,m,n,p,q,r):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r);var t=Xa(v),w=Ya(v);if(13===b)return a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r,t):a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q,r,t):a.call(null,c,d,e,f,h,k,l,m,n,p,q,
r,t);var v=Xa(w),z=Ya(w);if(14===b)return a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v);var w=Xa(z),D=Ya(z);if(15===b)return a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w);var z=Xa(D),I=Ya(D);if(16===b)return a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z);var D=Xa(I),
S=Ya(I);if(17===b)return a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D);var I=Xa(S),la=Ya(S);if(18===b)return a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I):a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I);S=Xa(la);la=Ya(la);if(19===b)return a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S):a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S):a.call(null,c,d,e,f,h,k,
l,m,n,p,q,r,t,v,w,z,D,I,S);var x=Xa(la);Ya(la);if(20===b)return a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S,x):a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S,x):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S,x);throw Error("Only up to 20 arguments supported on functions");}
var F=function F(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return F.b(arguments[0],arguments[1]);case 3:return F.c(arguments[0],arguments[1],arguments[2]);case 4:return F.s(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return F.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return F.m(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new J(c.slice(5),0))}};
F.b=function(a,b){var c=a.A;if(a.D){var d=Pd(b,c+1);return d<=c?Td(a,d,b):a.D(b)}return a.apply(a,qd(b))};F.c=function(a,b,c){b=O(b,c);c=a.A;if(a.D){var d=Pd(b,c+1);return d<=c?Td(a,d,b):a.D(b)}return a.apply(a,qd(b))};F.s=function(a,b,c,d){b=O(b,O(c,d));c=a.A;return a.D?(d=Pd(b,c+1),d<=c?Td(a,d,b):a.D(b)):a.apply(a,qd(b))};F.C=function(a,b,c,d,e){b=O(b,O(c,O(d,e)));c=a.A;return a.D?(d=Pd(b,c+1),d<=c?Td(a,d,b):a.D(b)):a.apply(a,qd(b))};
F.m=function(a,b,c,d,e,f){b=O(b,O(c,O(d,O(e,Qd(f)))));c=a.A;return a.D?(d=Pd(b,c+1),d<=c?Td(a,d,b):a.D(b)):a.apply(a,qd(b))};F.D=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),e=M(d),d=L(e),f=M(e),e=L(f),f=M(f);return F.m(b,a,c,d,e,f)};F.A=5;
var Ud=function Ud(){"undefined"===typeof ra&&(ra=function(b,c){this.ic=b;this.hc=c;this.i=393216;this.B=0},ra.prototype.R=function(b,c){return new ra(this.ic,c)},ra.prototype.O=function(){return this.hc},ra.prototype.ua=function(){return!1},ra.prototype.next=function(){return Error("No such element")},ra.prototype.remove=function(){return Error("Unsupported operation")},ra.fc=function(){return new U(null,2,5,V,[Bc(Vd,new xa(null,1,[Wd,ac(Xd,ac(Tc))],null)),pa.vc],null)},ra.Cb=!0,ra.lb="cljs.core/t_cljs$core15371",
ra.Lb=function(b,c){return yb(c,"cljs.core/t_cljs$core15371")});return new ra(Ud,Yd)};Zd;function Zd(a,b,c,d){this.$a=a;this.first=b;this.sa=c;this.v=d;this.i=31719628;this.B=0}g=Zd.prototype;g.R=function(a,b){return new Zd(this.$a,this.first,this.sa,b)};g.T=function(a,b){return O(b,vb(this))};g.w=function(a,b){return null!=vb(this)?Ac(this,b):dd(b)&&null==K(b)};g.N=function(){return vc(this)};g.S=function(){null!=this.$a&&this.$a.step(this);return null==this.sa?null:this};
g.$=function(){null!=this.$a&&vb(this);return null==this.sa?null:this.first};g.qa=function(){null!=this.$a&&vb(this);return null==this.sa?pc:this.sa};g.pa=function(){null!=this.$a&&vb(this);return null==this.sa?null:vb(this.sa)};Zd.prototype[Na]=function(){return rc(this)};function $d(a,b){for(;;){if(null==K(b))return!0;var c;c=L(b);c=a.a?a.a(c):a.call(null,c);if(y(c)){c=a;var d=M(b);a=c;b=d}else return!1}}
function ae(a){for(var b=sd;;)if(K(a)){var c;c=L(a);c=b.a?b.a(c):b.call(null,c);if(y(c))return c;a=M(a)}else return null}
function be(a){return function(){function b(b,c){return La(a.b?a.b(b,c):a.call(null,b,c))}function c(b){return La(a.a?a.a(b):a.call(null,b))}function d(){return La(a.o?a.o():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new J(h,0)}return c.call(this,a,d,f)}function c(b,d,e){return La(F.s(a,b,d,e))}b.A=2;b.D=function(a){var b=L(a);a=M(a);var d=L(a);a=oc(a);return c(b,d,a)};b.m=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new J(n,0)}return f.m(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.A=2;e.D=f.D;e.o=d;e.a=c;e.b=b;e.m=f.m;return e}()}ce;function de(a,b,c,d){this.state=a;this.v=b;this.lc=c;this.tb=d;this.B=16386;this.i=6455296}g=de.prototype;
g.equiv=function(a){return this.w(null,a)};g.w=function(a,b){return this===b};g.rb=function(){return this.state};g.O=function(){return this.v};g.Jb=function(a,b,c){a=K(this.tb);for(var d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f),k=P(h,0),h=P(h,1);h.s?h.s(k,this,b,c):h.call(null,k,this,b,c);f+=1}else if(a=K(a))id(a)?(d=Kb(a),a=Lb(a),k=d,e=Vc(d),d=k):(d=L(a),k=P(d,0),h=P(d,1),h.s?h.s(k,this,b,c):h.call(null,k,this,b,c),a=M(a),d=null,e=0),f=0;else return null};
g.Ib=function(a,b,c){this.tb=Zc.c(this.tb,b,c);return this};g.N=function(){return this[ba]||(this[ba]=++ca)};var ee=function ee(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ee.a(arguments[0]);default:return ee.m(arguments[0],new J(c.slice(1),0))}};ee.a=function(a){return new de(a,null,null,null)};ee.m=function(a,b){var c=null!=b&&(b.i&64||b.Ia)?F.b(zc,b):b,d=H.b(c,Ba),c=H.b(c,fe);return new de(a,d,c,null)};
ee.D=function(a){var b=L(a);a=M(a);return ee.m(b,a)};ee.A=1;ge;function he(a,b){if(a instanceof de){var c=a.lc;if(null!=c&&!y(c.a?c.a(b):c.call(null,b)))throw Error([E("Assert failed: "),E("Validator rejected reference state"),E("\n"),E(function(){var a=ac(ie,je);return ge.a?ge.a(a):ge.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.tb&&Ab(a,c,b);return b}return Qb(a,b)}
var ke=function ke(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ke.b(arguments[0],arguments[1]);case 3:return ke.c(arguments[0],arguments[1],arguments[2]);case 4:return ke.s(arguments[0],arguments[1],arguments[2],arguments[3]);default:return ke.m(arguments[0],arguments[1],arguments[2],arguments[3],new J(c.slice(4),0))}};ke.b=function(a,b){var c;a instanceof de?(c=a.state,c=b.a?b.a(c):b.call(null,c),c=he(a,c)):c=Rb.b(a,b);return c};
ke.c=function(a,b,c){if(a instanceof de){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=he(a,b)}else a=Rb.c(a,b,c);return a};ke.s=function(a,b,c,d){if(a instanceof de){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=he(a,b)}else a=Rb.s(a,b,c,d);return a};ke.m=function(a,b,c,d,e){return a instanceof de?he(a,F.C(b,a.state,c,d,e)):Rb.C(a,b,c,d,e)};ke.D=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),e=M(d),d=L(e),e=M(e);return ke.m(b,a,c,d,e)};ke.A=4;
function le(a){this.state=a;this.i=32768;this.B=0}le.prototype.rb=function(){return this.state};function ce(a){return new le(a)}
var Q=function Q(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Q.a(arguments[0]);case 2:return Q.b(arguments[0],arguments[1]);case 3:return Q.c(arguments[0],arguments[1],arguments[2]);case 4:return Q.s(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Q.m(arguments[0],arguments[1],arguments[2],arguments[3],new J(c.slice(4),0))}};
Q.a=function(a){return function(b){return function(){function c(c,d){var e=a.a?a.a(d):a.call(null,d);return b.b?b.b(c,e):b.call(null,c,e)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.o?b.o():b.call(null)}var f=null,h=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new J(h,0)}return d.call(this,a,b,f)}function d(c,e,f){e=F.c(a,e,f);return b.b?b.b(c,e):b.call(null,c,e)}c.A=2;c.D=function(a){var b=
L(a);a=M(a);var c=L(a);a=oc(a);return d(b,c,a)};c.m=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new J(p,0)}return h.m(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.A=2;f.D=h.D;f.o=e;f.a=d;f.b=c;f.m=h.m;return f}()}};
Q.b=function(a,b){return new Jd(null,function(){var c=K(b);if(c){if(id(c)){for(var d=Kb(c),e=Vc(d),f=new Md(Array(e),0),h=0;;)if(h<e)Od(f,function(){var b=G.b(d,h);return a.a?a.a(b):a.call(null,b)}()),h+=1;else break;return Nd(f.za(),Q.b(a,Lb(c)))}return O(function(){var b=L(c);return a.a?a.a(b):a.call(null,b)}(),Q.b(a,oc(c)))}return null},null,null)};
Q.c=function(a,b,c){return new Jd(null,function(){var d=K(b),e=K(c);if(d&&e){var f=O,h;h=L(d);var k=L(e);h=a.b?a.b(h,k):a.call(null,h,k);d=f(h,Q.c(a,oc(d),oc(e)))}else d=null;return d},null,null)};Q.s=function(a,b,c,d){return new Jd(null,function(){var e=K(b),f=K(c),h=K(d);if(e&&f&&h){var k=O,l;l=L(e);var m=L(f),n=L(h);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=k(l,Q.s(a,oc(e),oc(f),oc(h)))}else e=null;return e},null,null)};
Q.m=function(a,b,c,d,e){var f=function k(a){return new Jd(null,function(){var b=Q.b(K,a);return $d(sd,b)?O(Q.b(L,b),k(Q.b(oc,b))):null},null,null)};return Q.b(function(){return function(b){return F.b(a,b)}}(f),f(Sc.m(e,d,mc([c,b],0))))};Q.D=function(a){var b=L(a),c=M(a);a=L(c);var d=M(c),c=L(d),e=M(d),d=L(e),e=M(e);return Q.m(b,a,c,d,e)};Q.A=4;
function me(a,b){if("number"!==typeof a)throw Error([E("Assert failed: "),E(function(){var a=ac(ne,oe);return ge.a?ge.a(a):ge.call(null,a)}())].join(""));return new Jd(null,function(){if(0<a){var c=K(b);return c?O(L(c),me(a-1,oc(c))):null}return null},null,null)}
function pe(a,b){if("number"!==typeof a)throw Error([E("Assert failed: "),E(function(){var a=ac(ne,oe);return ge.a?ge.a(a):ge.call(null,a)}())].join(""));return new Jd(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=K(b);if(0<a&&e){var f=a-1,e=oc(e);a=f;b=e}else return e}}),null,null)}function qe(a){return new Jd(null,function(){return O(a,qe(a))},null,null)}
var re=function re(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return re.b(arguments[0],arguments[1]);default:return re.m(arguments[0],arguments[1],new J(c.slice(2),0))}};re.b=function(a,b){return new Jd(null,function(){var c=K(a),d=K(b);return c&&d?O(L(c),O(L(d),re.b(oc(c),oc(d)))):null},null,null)};
re.m=function(a,b,c){return new Jd(null,function(){var d=Q.b(K,Sc.m(c,b,mc([a],0)));return $d(sd,d)?Rd.b(Q.b(L,d),F.b(re,Q.b(oc,d))):null},null,null)};re.D=function(a){var b=L(a),c=M(a);a=L(c);c=M(c);return re.m(b,a,c)};re.A=2;te;function ue(a,b){return F.b(Rd,F.c(Q,a,b))}
function ve(a,b){return new Jd(null,function(){var c=K(b);if(c){if(id(c)){for(var d=Kb(c),e=Vc(d),f=new Md(Array(e),0),h=0;;)if(h<e){var k;k=G.b(d,h);k=a.a?a.a(k):a.call(null,k);y(k)&&(k=G.b(d,h),f.add(k));h+=1}else break;return Nd(f.za(),ve(a,Lb(c)))}d=L(c);c=oc(c);return y(a.a?a.a(d):a.call(null,d))?O(d,ve(a,c)):ve(a,c)}return null},null,null)}
function we(a){return function c(a){return new Jd(null,function(){return O(a,y(md.a?md.a(a):md.call(null,a))?ue(c,mc([K.a?K.a(a):K.call(null,a)],0)):null)},null,null)}(a)}function xe(a,b,c){return new Jd(null,function(){var d=K(c);if(d){var e=me(a,d);return a===Vc(e)?O(e,xe(a,b,pe(b,d))):null}return null},null,null)}function ye(a,b){this.L=a;this.f=b}
function ze(a){return new ye(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function Ae(a){a=a.l;return 32>a?0:a-1>>>5<<5}function Be(a,b,c){for(;;){if(0===b)return c;var d=ze(a);d.f[0]=c;c=d;b-=5}}var Ce=function Ce(b,c,d,e){var f=new ye(d.L,Oa(d.f)),h=b.l-1>>>c&31;5===c?f.f[h]=e:(d=d.f[h],b=null!=d?Ce(b,c-5,d,e):Be(null,c-5,e),f.f[h]=b);return f};
function De(a,b){throw Error([E("No item "),E(a),E(" in vector of length "),E(b)].join(""));}function Ee(a,b){if(b>=Ae(a))return a.I;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function Fe(a,b){return 0<=b&&b<a.l?Ee(a,b):De(b,a.l)}var Ge=function Ge(b,c,d,e,f){var h=new ye(d.L,Oa(d.f));if(0===c)h.f[e&31]=f;else{var k=e>>>c&31;b=Ge(b,c-5,d.f[k],e,f);h.f[k]=b}return h};function He(a,b,c,d,e,f){this.j=a;this.vb=b;this.f=c;this.Ha=d;this.start=e;this.end=f}
He.prototype.ua=function(){return this.j<this.end};He.prototype.next=function(){32===this.j-this.vb&&(this.f=Ee(this.Ha,this.j),this.vb+=32);var a=this.f[this.j&31];this.j+=1;return a};Ie;Je;Ke;N;Le;Me;Ne;function U(a,b,c,d,e,f){this.v=a;this.l=b;this.shift=c;this.root=d;this.I=e;this.u=f;this.i=167668511;this.B=8196}g=U.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};g.J=function(a,b){return ab.c(this,b,null)};
g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};g.U=function(a,b){return Fe(this,b)[b&31]};g.ta=function(a,b,c){return 0<=b&&b<this.l?Ee(this,b)[b&31]:c};g.Pa=function(a,b,c){if(0<=b&&b<this.l)return Ae(this)<=b?(a=Oa(this.I),a[b&31]=c,new U(this.v,this.l,this.shift,this.root,a,null)):new U(this.v,this.l,this.shift,Ge(this,this.shift,this.root,b,c),this.I,null);if(b===this.l)return Ta(this,c);throw Error([E("Index "),E(b),E(" out of bounds  [0,"),E(this.l),E("]")].join(""));};
g.Da=function(){var a=this.l;return new He(0,0,0<Vc(this)?Ee(this,0):null,this,0,a)};g.O=function(){return this.v};g.X=function(){return this.l};g.eb=function(){return G.b(this,0)};g.fb=function(){return G.b(this,1)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=vc(this)};g.w=function(a,b){if(b instanceof U)if(this.l===Vc(b))for(var c=Sb(this),d=Sb(b);;)if(y(c.ua())){var e=c.next(),f=d.next();if(!cc.b(e,f))return!1}else return!0;else return!1;else return Ac(this,b)};
g.Va=function(){return new Ke(this.l,this.shift,Ie.a?Ie.a(this.root):Ie.call(null,this.root),Je.a?Je.a(this.I):Je.call(null,this.I))};g.Y=function(a,b){return Fc(this,b)};g.Z=function(a,b,c){a=0;for(var d=c;;)if(a<this.l){var e=Ee(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=e[f],d=b.b?b.b(d,h):b.call(null,d,h);if(Ec(d)){e=d;break a}f+=1}else{e=d;break a}if(Ec(e))return N.a?N.a(e):N.call(null,e);a+=c;d=e}else return d};
g.Oa=function(a,b,c){if("number"===typeof b)return kb(this,b,c);throw Error("Vector's key for assoc must be a number.");};g.S=function(){if(0===this.l)return null;if(32>=this.l)return new J(this.I,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return Ne.s?Ne.s(this,a,0,0):Ne.call(null,this,a,0,0)};g.R=function(a,b){return new U(b,this.l,this.shift,this.root,this.I,this.u)};
g.T=function(a,b){if(32>this.l-Ae(this)){for(var c=this.I.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.I[e],e+=1;else break;d[c]=b;return new U(this.v,this.l+1,this.shift,this.root,d,null)}c=(d=this.l>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=ze(null),d.f[0]=this.root,e=Be(null,this.shift,new ye(null,this.I)),d.f[1]=e):d=Ce(this,this.shift,this.root,new ye(null,this.I));return new U(this.v,this.l+1,c,d,[b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.U(null,c);case 3:return this.ta(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.U(null,c)};a.c=function(a,c,d){return this.ta(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.U(null,a)};g.b=function(a,b){return this.ta(null,a,b)};
var V=new ye(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Tc=new U(null,0,5,V,[],wc);U.prototype[Na]=function(){return rc(this)};function rd(a){if(Ja(a))a:{var b=a.length;if(32>b)a=new U(null,b,5,V,a,null);else for(var c=32,d=(new U(null,32,5,V,a.slice(0,32),null)).Va(null);;)if(c<b)var e=c+1,d=Sd.b(d,a[c]),c=e;else{a=Eb(d);break a}}else a=Eb(Pa.c(Db,Cb(Tc),a));return a}Oe;
function hd(a,b,c,d,e,f){this.xa=a;this.node=b;this.j=c;this.ba=d;this.v=e;this.u=f;this.i=32375020;this.B=1536}g=hd.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};g.pa=function(){if(this.ba+1<this.node.length){var a;a=this.xa;var b=this.node,c=this.j,d=this.ba+1;a=Ne.s?Ne.s(a,b,c,d):Ne.call(null,a,b,c,d);return null==a?null:a}return Nb(this)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=vc(this)};
g.w=function(a,b){return Ac(this,b)};g.Y=function(a,b){var c;c=this.xa;var d=this.j+this.ba,e=Vc(this.xa);c=Oe.c?Oe.c(c,d,e):Oe.call(null,c,d,e);return Fc(c,b)};g.Z=function(a,b,c){a=this.xa;var d=this.j+this.ba,e=Vc(this.xa);a=Oe.c?Oe.c(a,d,e):Oe.call(null,a,d,e);return Gc(a,b,c)};g.$=function(){return this.node[this.ba]};g.qa=function(){if(this.ba+1<this.node.length){var a;a=this.xa;var b=this.node,c=this.j,d=this.ba+1;a=Ne.s?Ne.s(a,b,c,d):Ne.call(null,a,b,c,d);return null==a?pc:a}return Lb(this)};
g.S=function(){return this};g.zb=function(){var a=this.node;return new Ld(a,this.ba,a.length)};g.Ab=function(){var a=this.j+this.node.length;if(a<Ra(this.xa)){var b=this.xa,c=Ee(this.xa,a);return Ne.s?Ne.s(b,c,a,0):Ne.call(null,b,c,a,0)}return pc};g.R=function(a,b){return Ne.C?Ne.C(this.xa,this.node,this.j,this.ba,b):Ne.call(null,this.xa,this.node,this.j,this.ba,b)};g.T=function(a,b){return O(b,this)};
g.yb=function(){var a=this.j+this.node.length;if(a<Ra(this.xa)){var b=this.xa,c=Ee(this.xa,a);return Ne.s?Ne.s(b,c,a,0):Ne.call(null,b,c,a,0)}return null};hd.prototype[Na]=function(){return rc(this)};
var Ne=function Ne(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Ne.c(arguments[0],arguments[1],arguments[2]);case 4:return Ne.s(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Ne.C(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Ne.c=function(a,b,c){return new hd(a,Fe(a,b),b,c,null,null)};
Ne.s=function(a,b,c,d){return new hd(a,b,c,d,null,null)};Ne.C=function(a,b,c,d,e){return new hd(a,b,c,d,e,null)};Ne.A=5;Pe;function Qe(a,b,c,d,e){this.v=a;this.Ha=b;this.start=c;this.end=d;this.u=e;this.i=167666463;this.B=8192}g=Qe.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};g.J=function(a,b){return ab.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
g.U=function(a,b){return 0>b||this.end<=this.start+b?De(b,this.end-this.start):G.b(this.Ha,this.start+b)};g.ta=function(a,b,c){return 0>b||this.end<=this.start+b?c:G.c(this.Ha,this.start+b,c)};g.Pa=function(a,b,c){var d=this.start+b;a=this.v;c=Zc.c(this.Ha,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Pe.C?Pe.C(a,c,b,d,null):Pe.call(null,a,c,b,d,null)};g.O=function(){return this.v};g.X=function(){return this.end-this.start};g.N=function(){var a=this.u;return null!=a?a:this.u=a=vc(this)};
g.w=function(a,b){return Ac(this,b)};g.Y=function(a,b){return Fc(this,b)};g.Z=function(a,b,c){return Gc(this,b,c)};g.Oa=function(a,b,c){if("number"===typeof b)return kb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};g.S=function(){var a=this;return function(b){return function d(e){return e===a.end?null:O(G.b(a.Ha,e),new Jd(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
g.R=function(a,b){return Pe.C?Pe.C(b,this.Ha,this.start,this.end,this.u):Pe.call(null,b,this.Ha,this.start,this.end,this.u)};g.T=function(a,b){var c=this.v,d=kb(this.Ha,this.end,b),e=this.start,f=this.end+1;return Pe.C?Pe.C(c,d,e,f,null):Pe.call(null,c,d,e,f,null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.U(null,c);case 3:return this.ta(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.U(null,c)};a.c=function(a,c,d){return this.ta(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.U(null,a)};g.b=function(a,b){return this.ta(null,a,b)};Qe.prototype[Na]=function(){return rc(this)};
function Pe(a,b,c,d,e){for(;;)if(b instanceof Qe)c=b.start+c,d=b.start+d,b=b.Ha;else{var f=Vc(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Qe(a,b,c,d,e)}}var Oe=function Oe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Oe.b(arguments[0],arguments[1]);case 3:return Oe.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
Oe.b=function(a,b){return Oe.c(a,b,Vc(a))};Oe.c=function(a,b,c){return Pe(null,a,b,c,null)};Oe.A=3;function Re(a,b){return a===b.L?b:new ye(a,Oa(b.f))}function Ie(a){return new ye({},Oa(a.f))}function Je(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];kd(a,0,b,0,a.length);return b}
var Se=function Se(b,c,d,e){d=Re(b.root.L,d);var f=b.l-1>>>c&31;if(5===c)b=e;else{var h=d.f[f];b=null!=h?Se(b,c-5,h,e):Be(b.root.L,c-5,e)}d.f[f]=b;return d};function Ke(a,b,c,d){this.l=a;this.shift=b;this.root=c;this.I=d;this.B=88;this.i=275}g=Ke.prototype;
g.jb=function(a,b){if(this.root.L){if(32>this.l-Ae(this))this.I[this.l&31]=b;else{var c=new ye(this.root.L,this.I),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.I=d;if(this.l>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=Be(this.root.L,this.shift,c);this.root=new ye(this.root.L,d);this.shift=e}else this.root=Se(this,this.shift,this.root,c)}this.l+=1;return this}throw Error("conj! after persistent!");};g.kb=function(){if(this.root.L){this.root.L=null;var a=this.l-Ae(this),b=Array(a);kd(this.I,0,b,0,a);return new U(null,this.l,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
g.ib=function(a,b,c){if("number"===typeof b)return Gb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
g.Hb=function(a,b,c){var d=this;if(d.root.L){if(0<=b&&b<d.l)return Ae(this)<=b?d.I[b&31]=c:(a=function(){return function f(a,k){var l=Re(d.root.L,k);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.l)return Db(this,c);throw Error([E("Index "),E(b),E(" out of bounds for TransientVector of length"),E(d.l)].join(""));}throw Error("assoc! after persistent!");};
g.X=function(){if(this.root.L)return this.l;throw Error("count after persistent!");};g.U=function(a,b){if(this.root.L)return Fe(this,b)[b&31];throw Error("nth after persistent!");};g.ta=function(a,b,c){return 0<=b&&b<this.l?G.b(this,b):c};g.J=function(a,b){return ab.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?G.c(this,b,c):c};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};function Te(){this.i=2097152;this.B=0}
Te.prototype.equiv=function(a){return this.w(null,a)};Te.prototype.w=function(){return!1};var Ue=new Te;function Ve(a,b){return nd(ed(b)?Vc(a)===Vc(b)?$d(sd,Q.b(function(a){return cc.b(H.c(b,L(a),Ue),Rc(a))},a)):null:null)}function We(a){this.F=a}We.prototype.next=function(){if(null!=this.F){var a=L(this.F),b=P(a,0),a=P(a,1);this.F=M(this.F);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Xe(a){return new We(K(a))}function Ye(a){this.F=a}
Ye.prototype.next=function(){if(null!=this.F){var a=L(this.F);this.F=M(this.F);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Ze(a,b){var c;if(b instanceof A)a:{c=a.length;for(var d=b.Ea,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof A&&d===a[e].Ea){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof bc)a:for(c=a.length,d=b.Ga,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof bc&&d===a[e].Ga){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(cc.b(b,a[d])){c=d;break a}d+=2}return c}$e;function af(a,b,c){this.f=a;this.j=b;this.ya=c;this.i=32374990;this.B=0}g=af.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.ya};g.pa=function(){return this.j<this.f.length-2?new af(this.f,this.j+2,this.ya):null};g.X=function(){return(this.f.length-this.j)/2};g.N=function(){return vc(this)};g.w=function(a,b){return Ac(this,b)};
g.Y=function(a,b){return Qc.b(b,this)};g.Z=function(a,b,c){return Qc.c(b,c,this)};g.$=function(){return new U(null,2,5,V,[this.f[this.j],this.f[this.j+1]],null)};g.qa=function(){return this.j<this.f.length-2?new af(this.f,this.j+2,this.ya):pc};g.S=function(){return this};g.R=function(a,b){return new af(this.f,this.j,b)};g.T=function(a,b){return O(b,this)};af.prototype[Na]=function(){return rc(this)};bf;cf;function df(a,b,c){this.f=a;this.j=b;this.l=c}df.prototype.ua=function(){return this.j<this.l};
df.prototype.next=function(){var a=new U(null,2,5,V,[this.f[this.j],this.f[this.j+1]],null);this.j+=2;return a};function xa(a,b,c,d){this.v=a;this.l=b;this.f=c;this.u=d;this.i=16647951;this.B=8196}g=xa.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};g.keys=function(){return rc(bf.a?bf.a(this):bf.call(null,this))};g.entries=function(){return Xe(K(this))};g.values=function(){return rc(cf.a?cf.a(this):cf.call(null,this))};g.has=function(a){return od(this,a)};
g.get=function(a,b){return this.H(null,a,b)};g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=P(f,0),f=P(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=K(b))id(b)?(c=Kb(b),b=Lb(b),h=c,d=Vc(c),c=h):(c=L(b),h=P(c,0),f=P(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return ab.c(this,b,null)};g.H=function(a,b,c){a=Ze(this.f,b);return-1===a?c:this.f[a+1]};g.Da=function(){return new df(this.f,0,2*this.l)};g.O=function(){return this.v};
g.X=function(){return this.l};g.N=function(){var a=this.u;return null!=a?a:this.u=a=xc(this)};g.w=function(a,b){if(null!=b&&(b.i&1024||b.Sb)){var c=this.f.length;if(this.l===b.X(null))for(var d=0;;)if(d<c){var e=b.H(null,this.f[d],ld);if(e!==ld)if(cc.b(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Ve(this,b)};g.Va=function(){return new $e({},this.f.length,Oa(this.f))};g.Y=function(a,b){return Qc.b(b,this)};g.Z=function(a,b,c){return Qc.c(b,c,this)};
g.Oa=function(a,b,c){a=Ze(this.f,b);if(-1===a){if(this.l<ef){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new xa(this.v,this.l+1,e,null)}a=$c;null!=a?null!=a&&(a.B&4||a.oc)?(d=Pa.c(Db,Cb(a),this),d=Eb(d),a=Bc(d,bd(a))):a=Pa.c(Ta,a,this):a=Pa.c(Sc,pc,this);return ob(cb(a,b,c),this.v)}if(c===this.f[a+1])return this;b=Oa(this.f);b[a+1]=c;return new xa(this.v,this.l,b,null)};g.xb=function(a,b){return-1!==Ze(this.f,b)};
g.S=function(){var a=this.f;return 0<=a.length-2?new af(a,0,null):null};g.R=function(a,b){return new xa(b,this.l,this.f,this.u)};g.T=function(a,b){if(fd(b))return cb(this,G.b(b,0),G.b(b,1));for(var c=this,d=K(b);;){if(null==d)return c;var e=L(d);if(fd(e))c=cb(c,G.b(e,0),G.b(e,1)),d=M(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};var Yd=new xa(null,0,[],yc),ef=8;xa.prototype[Na]=function(){return rc(this)};
ff;function $e(a,b,c){this.Wa=a;this.Sa=b;this.f=c;this.i=258;this.B=56}g=$e.prototype;g.X=function(){if(y(this.Wa))return xd(this.Sa);throw Error("count after persistent!");};g.J=function(a,b){return ab.c(this,b,null)};g.H=function(a,b,c){if(y(this.Wa))return a=Ze(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
g.jb=function(a,b){if(y(this.Wa)){if(null!=b?b.i&2048||b.Tb||(b.i?0:B(fb,b)):B(fb,b))return Fb(this,Bd.a?Bd.a(b):Bd.call(null,b),Cd.a?Cd.a(b):Cd.call(null,b));for(var c=K(b),d=this;;){var e=L(c);if(y(e))c=M(c),d=Fb(d,Bd.a?Bd.a(e):Bd.call(null,e),Cd.a?Cd.a(e):Cd.call(null,e));else return d}}else throw Error("conj! after persistent!");};g.kb=function(){if(y(this.Wa))return this.Wa=!1,new xa(null,xd(this.Sa),this.f,null);throw Error("persistent! called twice");};
g.ib=function(a,b,c){if(y(this.Wa)){a=Ze(this.f,b);if(-1===a){if(this.Sa+2<=2*ef)return this.Sa+=2,this.f.push(b),this.f.push(c),this;a=ff.b?ff.b(this.Sa,this.f):ff.call(null,this.Sa,this.f);return Fb(a,b,c)}c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};gf;Yc;function ff(a,b){for(var c=Cb($c),d=0;;)if(d<a)c=Fb(c,b[d],b[d+1]),d+=2;else return c}function hf(){this.M=!1}jf;kf;he;lf;ee;N;
function mf(a,b){return a===b?!0:a===b||a instanceof A&&b instanceof A&&a.Ea===b.Ea?!0:cc.b(a,b)}function nf(a,b,c){a=Oa(a);a[b]=c;return a}function of(a,b,c,d){a=a.Qa(b);a.f[c]=d;return a}pf;function qf(a,b,c,d){this.f=a;this.j=b;this.pb=c;this.Ca=d}qf.prototype.advance=function(){for(var a=this.f.length;;)if(this.j<a){var b=this.f[this.j],c=this.f[this.j+1];null!=b?b=this.pb=new U(null,2,5,V,[b,c],null):null!=c?(b=Sb(c),b=b.ua()?this.Ca=b:!1):b=!1;this.j+=2;if(b)return!0}else return!1};
qf.prototype.ua=function(){var a=null!=this.pb;return a?a:(a=null!=this.Ca)?a:this.advance()};qf.prototype.next=function(){if(null!=this.pb){var a=this.pb;this.pb=null;return a}if(null!=this.Ca)return a=this.Ca.next(),this.Ca.ua()||(this.Ca=null),a;if(this.advance())return this.next();throw Error("No such element");};qf.prototype.remove=function(){return Error("Unsupported operation")};function rf(a,b,c){this.L=a;this.aa=b;this.f=c}g=rf.prototype;
g.Qa=function(a){if(a===this.L)return this;var b=yd(this.aa),c=Array(0>b?4:2*(b+1));kd(this.f,0,c,0,2*b);return new rf(a,this.aa,c)};g.nb=function(){return jf.a?jf.a(this.f):jf.call(null,this.f)};g.La=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.aa&e))return d;var f=yd(this.aa&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.La(a+5,b,c,d):mf(c,e)?f:d};
g.Ba=function(a,b,c,d,e,f){var h=1<<(c>>>b&31),k=yd(this.aa&h-1);if(0===(this.aa&h)){var l=yd(this.aa);if(2*l<this.f.length){a=this.Qa(a);b=a.f;f.M=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.aa|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=sf.Ba(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.aa>>>d&1)&&(k[d]=null!=this.f[e]?sf.Ba(a,b+5,hc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new pf(a,l+1,k)}b=Array(2*(l+4));kd(this.f,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;kd(this.f,2*k,b,2*(k+1),2*(l-k));f.M=!0;a=this.Qa(a);a.f=b;a.aa|=h;return a}l=this.f[2*k];h=this.f[2*k+1];if(null==l)return l=h.Ba(a,b+5,c,d,e,f),l===h?this:of(this,a,2*k+1,l);if(mf(d,l))return e===h?this:of(this,a,2*k+1,e);f.M=!0;f=b+5;d=lf.W?lf.W(a,f,l,h,c,d,e):lf.call(null,a,f,l,h,c,d,e);e=2*
k;k=2*k+1;a=this.Qa(a);a.f[e]=null;a.f[k]=d;return a};
g.Aa=function(a,b,c,d,e){var f=1<<(b>>>a&31),h=yd(this.aa&f-1);if(0===(this.aa&f)){var k=yd(this.aa);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=sf.Aa(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.aa>>>c&1)&&(h[c]=null!=this.f[d]?sf.Aa(a+5,hc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new pf(null,k+1,h)}a=Array(2*(k+1));kd(this.f,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;kd(this.f,2*h,a,2*(h+1),2*(k-h));e.M=!0;return new rf(null,this.aa|f,a)}var l=this.f[2*h],f=this.f[2*h+1];if(null==l)return k=f.Aa(a+5,b,c,d,e),k===f?this:new rf(null,this.aa,nf(this.f,2*h+1,k));if(mf(c,l))return d===f?this:new rf(null,this.aa,nf(this.f,2*h+1,d));e.M=!0;e=this.aa;k=this.f;a+=5;a=lf.V?lf.V(a,l,f,b,c,d):lf.call(null,a,l,f,b,c,d);c=2*h;h=2*h+1;d=Oa(k);d[c]=null;d[h]=a;return new rf(null,e,d)};g.Da=function(){return new qf(this.f,0,null,null)};
var sf=new rf(null,0,[]);function tf(a,b,c){this.f=a;this.j=b;this.Ca=c}tf.prototype.ua=function(){for(var a=this.f.length;;){if(null!=this.Ca&&this.Ca.ua())return!0;if(this.j<a){var b=this.f[this.j];this.j+=1;null!=b&&(this.Ca=Sb(b))}else return!1}};tf.prototype.next=function(){if(this.ua())return this.Ca.next();throw Error("No such element");};tf.prototype.remove=function(){return Error("Unsupported operation")};function pf(a,b,c){this.L=a;this.l=b;this.f=c}g=pf.prototype;
g.Qa=function(a){return a===this.L?this:new pf(a,this.l,Oa(this.f))};g.nb=function(){return kf.a?kf.a(this.f):kf.call(null,this.f)};g.La=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.La(a+5,b,c,d):d};g.Ba=function(a,b,c,d,e,f){var h=c>>>b&31,k=this.f[h];if(null==k)return a=of(this,a,h,sf.Ba(a,b+5,c,d,e,f)),a.l+=1,a;b=k.Ba(a,b+5,c,d,e,f);return b===k?this:of(this,a,h,b)};
g.Aa=function(a,b,c,d,e){var f=b>>>a&31,h=this.f[f];if(null==h)return new pf(null,this.l+1,nf(this.f,f,sf.Aa(a+5,b,c,d,e)));a=h.Aa(a+5,b,c,d,e);return a===h?this:new pf(null,this.l,nf(this.f,f,a))};g.Da=function(){return new tf(this.f,0,null)};function uf(a,b,c){b*=2;for(var d=0;;)if(d<b){if(mf(c,a[d]))return d;d+=2}else return-1}function vf(a,b,c,d){this.L=a;this.Ka=b;this.l=c;this.f=d}g=vf.prototype;
g.Qa=function(a){if(a===this.L)return this;var b=Array(2*(this.l+1));kd(this.f,0,b,0,2*this.l);return new vf(a,this.Ka,this.l,b)};g.nb=function(){return jf.a?jf.a(this.f):jf.call(null,this.f)};g.La=function(a,b,c,d){a=uf(this.f,this.l,c);return 0>a?d:mf(c,this.f[a])?this.f[a+1]:d};
g.Ba=function(a,b,c,d,e,f){if(c===this.Ka){b=uf(this.f,this.l,d);if(-1===b){if(this.f.length>2*this.l)return b=2*this.l,c=2*this.l+1,a=this.Qa(a),a.f[b]=d,a.f[c]=e,f.M=!0,a.l+=1,a;c=this.f.length;b=Array(c+2);kd(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.M=!0;d=this.l+1;a===this.L?(this.f=b,this.l=d,a=this):a=new vf(this.L,this.Ka,d,b);return a}return this.f[b+1]===e?this:of(this,a,b+1,e)}return(new rf(a,1<<(this.Ka>>>b&31),[null,this,null,null])).Ba(a,b,c,d,e,f)};
g.Aa=function(a,b,c,d,e){return b===this.Ka?(a=uf(this.f,this.l,c),-1===a?(a=2*this.l,b=Array(a+2),kd(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.M=!0,new vf(null,this.Ka,this.l+1,b)):cc.b(this.f[a],d)?this:new vf(null,this.Ka,this.l,nf(this.f,a+1,d))):(new rf(null,1<<(this.Ka>>>a&31),[null,this])).Aa(a,b,c,d,e)};g.Da=function(){return new qf(this.f,0,null,null)};
var lf=function lf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return lf.V(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return lf.W(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};
lf.V=function(a,b,c,d,e,f){var h=hc(b);if(h===d)return new vf(null,h,2,[b,c,e,f]);var k=new hf;return sf.Aa(a,h,b,c,k).Aa(a,d,e,f,k)};lf.W=function(a,b,c,d,e,f,h){var k=hc(c);if(k===e)return new vf(null,k,2,[c,d,f,h]);var l=new hf;return sf.Ba(a,b,k,c,d,l).Ba(a,b,e,f,h,l)};lf.A=7;function wf(a,b,c,d,e){this.v=a;this.Ma=b;this.j=c;this.F=d;this.u=e;this.i=32374860;this.B=0}g=wf.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};
g.N=function(){var a=this.u;return null!=a?a:this.u=a=vc(this)};g.w=function(a,b){return Ac(this,b)};g.Y=function(a,b){return Qc.b(b,this)};g.Z=function(a,b,c){return Qc.c(b,c,this)};g.$=function(){return null==this.F?new U(null,2,5,V,[this.Ma[this.j],this.Ma[this.j+1]],null):L(this.F)};g.qa=function(){if(null==this.F){var a=this.Ma,b=this.j+2;return jf.c?jf.c(a,b,null):jf.call(null,a,b,null)}var a=this.Ma,b=this.j,c=M(this.F);return jf.c?jf.c(a,b,c):jf.call(null,a,b,c)};g.S=function(){return this};
g.R=function(a,b){return new wf(b,this.Ma,this.j,this.F,this.u)};g.T=function(a,b){return O(b,this)};wf.prototype[Na]=function(){return rc(this)};var jf=function jf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return jf.a(arguments[0]);case 3:return jf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};jf.a=function(a){return jf.c(a,0,null)};
jf.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new wf(null,a,b,null,null);var d=a[b+1];if(y(d)&&(d=d.nb(),y(d)))return new wf(null,a,b+2,d,null);b+=2}else return null;else return new wf(null,a,b,c,null)};jf.A=3;function xf(a,b,c,d,e){this.v=a;this.Ma=b;this.j=c;this.F=d;this.u=e;this.i=32374860;this.B=0}g=xf.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.v};
g.N=function(){var a=this.u;return null!=a?a:this.u=a=vc(this)};g.w=function(a,b){return Ac(this,b)};g.Y=function(a,b){return Qc.b(b,this)};g.Z=function(a,b,c){return Qc.c(b,c,this)};g.$=function(){return L(this.F)};g.qa=function(){var a=this.Ma,b=this.j,c=M(this.F);return kf.s?kf.s(null,a,b,c):kf.call(null,null,a,b,c)};g.S=function(){return this};g.R=function(a,b){return new xf(b,this.Ma,this.j,this.F,this.u)};g.T=function(a,b){return O(b,this)};xf.prototype[Na]=function(){return rc(this)};
var kf=function kf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return kf.a(arguments[0]);case 4:return kf.s(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};kf.a=function(a){return kf.s(null,a,0,null)};
kf.s=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(y(e)&&(e=e.nb(),y(e)))return new xf(a,b,c+1,e,null);c+=1}else return null;else return new xf(a,b,c,d,null)};kf.A=4;gf;function yf(a,b,c){this.wa=a;this.Mb=b;this.Db=c}yf.prototype.ua=function(){return this.Db&&this.Mb.ua()};yf.prototype.next=function(){if(this.Db)return this.Mb.next();this.Db=!0;return this.wa};yf.prototype.remove=function(){return Error("Unsupported operation")};
function Yc(a,b,c,d,e,f){this.v=a;this.l=b;this.root=c;this.va=d;this.wa=e;this.u=f;this.i=16123663;this.B=8196}g=Yc.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};g.keys=function(){return rc(bf.a?bf.a(this):bf.call(null,this))};g.entries=function(){return Xe(K(this))};g.values=function(){return rc(cf.a?cf.a(this):cf.call(null,this))};g.has=function(a){return od(this,a)};g.get=function(a,b){return this.H(null,a,b)};
g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=P(f,0),f=P(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=K(b))id(b)?(c=Kb(b),b=Lb(b),h=c,d=Vc(c),c=h):(c=L(b),h=P(c,0),f=P(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return ab.c(this,b,null)};g.H=function(a,b,c){return null==b?this.va?this.wa:c:null==this.root?c:this.root.La(0,hc(b),b,c)};
g.Da=function(){var a=this.root?Sb(this.root):Ud;return this.va?new yf(this.wa,a,!1):a};g.O=function(){return this.v};g.X=function(){return this.l};g.N=function(){var a=this.u;return null!=a?a:this.u=a=xc(this)};g.w=function(a,b){return Ve(this,b)};g.Va=function(){return new gf({},this.root,this.l,this.va,this.wa)};
g.Oa=function(a,b,c){if(null==b)return this.va&&c===this.wa?this:new Yc(this.v,this.va?this.l:this.l+1,this.root,!0,c,null);a=new hf;b=(null==this.root?sf:this.root).Aa(0,hc(b),b,c,a);return b===this.root?this:new Yc(this.v,a.M?this.l+1:this.l,b,this.va,this.wa,null)};g.xb=function(a,b){return null==b?this.va:null==this.root?!1:this.root.La(0,hc(b),b,ld)!==ld};g.S=function(){if(0<this.l){var a=null!=this.root?this.root.nb():null;return this.va?O(new U(null,2,5,V,[null,this.wa],null),a):a}return null};
g.R=function(a,b){return new Yc(b,this.l,this.root,this.va,this.wa,this.u)};g.T=function(a,b){if(fd(b))return cb(this,G.b(b,0),G.b(b,1));for(var c=this,d=K(b);;){if(null==d)return c;var e=L(d);if(fd(e))c=cb(c,G.b(e,0),G.b(e,1)),d=M(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};var $c=new Yc(null,0,null,!1,null,yc);Yc.prototype[Na]=function(){return rc(this)};
function gf(a,b,c,d,e){this.L=a;this.root=b;this.count=c;this.va=d;this.wa=e;this.i=258;this.B=56}function zf(a,b,c){if(a.L){if(null==b)a.wa!==c&&(a.wa=c),a.va||(a.count+=1,a.va=!0);else{var d=new hf;b=(null==a.root?sf:a.root).Ba(a.L,0,hc(b),b,c,d);b!==a.root&&(a.root=b);d.M&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}g=gf.prototype;g.X=function(){if(this.L)return this.count;throw Error("count after persistent!");};
g.J=function(a,b){return null==b?this.va?this.wa:null:null==this.root?null:this.root.La(0,hc(b),b)};g.H=function(a,b,c){return null==b?this.va?this.wa:c:null==this.root?c:this.root.La(0,hc(b),b,c)};
g.jb=function(a,b){var c;a:if(this.L)if(null!=b?b.i&2048||b.Tb||(b.i?0:B(fb,b)):B(fb,b))c=zf(this,Bd.a?Bd.a(b):Bd.call(null,b),Cd.a?Cd.a(b):Cd.call(null,b));else{c=K(b);for(var d=this;;){var e=L(c);if(y(e))c=M(c),d=zf(d,Bd.a?Bd.a(e):Bd.call(null,e),Cd.a?Cd.a(e):Cd.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};g.kb=function(){var a;if(this.L)this.L=null,a=new Yc(null,this.count,this.root,this.va,this.wa,null);else throw Error("persistent! called twice");return a};
g.ib=function(a,b,c){return zf(this,b,c)};Af;Bf;function Bf(a,b,c,d,e){this.key=a;this.M=b;this.left=c;this.right=d;this.u=e;this.i=32402207;this.B=0}g=Bf.prototype;g.replace=function(a,b,c,d){return new Bf(a,b,c,d,null)};g.J=function(a,b){return G.c(this,b,null)};g.H=function(a,b,c){return G.c(this,b,c)};g.U=function(a,b){return 0===b?this.key:1===b?this.M:null};g.ta=function(a,b,c){return 0===b?this.key:1===b?this.M:c};
g.Pa=function(a,b,c){return(new U(null,2,5,V,[this.key,this.M],null)).Pa(null,b,c)};g.O=function(){return null};g.X=function(){return 2};g.eb=function(){return this.key};g.fb=function(){return this.M};g.N=function(){var a=this.u;return null!=a?a:this.u=a=vc(this)};g.w=function(a,b){return Ac(this,b)};g.Y=function(a,b){return Fc(this,b)};g.Z=function(a,b,c){return Gc(this,b,c)};g.Oa=function(a,b,c){return Zc.c(new U(null,2,5,V,[this.key,this.M],null),b,c)};g.S=function(){return Ta(Ta(pc,this.M),this.key)};
g.R=function(a,b){return Bc(new U(null,2,5,V,[this.key,this.M],null),b)};g.T=function(a,b){return new U(null,3,5,V,[this.key,this.M,b],null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};
g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};Bf.prototype[Na]=function(){return rc(this)};function Af(a,b,c,d,e){this.key=a;this.M=b;this.left=c;this.right=d;this.u=e;this.i=32402207;this.B=0}g=Af.prototype;g.replace=function(a,b,c,d){return new Af(a,b,c,d,null)};g.J=function(a,b){return G.c(this,b,null)};g.H=function(a,b,c){return G.c(this,b,c)};g.U=function(a,b){return 0===b?this.key:1===b?this.M:null};
g.ta=function(a,b,c){return 0===b?this.key:1===b?this.M:c};g.Pa=function(a,b,c){return(new U(null,2,5,V,[this.key,this.M],null)).Pa(null,b,c)};g.O=function(){return null};g.X=function(){return 2};g.eb=function(){return this.key};g.fb=function(){return this.M};g.N=function(){var a=this.u;return null!=a?a:this.u=a=vc(this)};g.w=function(a,b){return Ac(this,b)};g.Y=function(a,b){return Fc(this,b)};g.Z=function(a,b,c){return Gc(this,b,c)};
g.Oa=function(a,b,c){return Zc.c(new U(null,2,5,V,[this.key,this.M],null),b,c)};g.S=function(){return Ta(Ta(pc,this.M),this.key)};g.R=function(a,b){return Bc(new U(null,2,5,V,[this.key,this.M],null),b)};g.T=function(a,b){return new U(null,3,5,V,[this.key,this.M,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};Af.prototype[Na]=function(){return rc(this)};Bd;
var zc=function zc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return zc.m(0<c.length?new J(c.slice(0),0):null)};zc.m=function(a){for(var b=K(a),c=Cb($c);;)if(b){a=M(M(b));var d=L(b),b=Rc(b),c=Fb(c,d,b),b=a}else return Eb(c)};zc.A=0;zc.D=function(a){return zc.m(K(a))};function Cf(a,b){this.G=a;this.ya=b;this.i=32374988;this.B=0}g=Cf.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.ya};
g.pa=function(){var a=(null!=this.G?this.G.i&128||this.G.sb||(this.G.i?0:B(Za,this.G)):B(Za,this.G))?this.G.pa(null):M(this.G);return null==a?null:new Cf(a,this.ya)};g.N=function(){return vc(this)};g.w=function(a,b){return Ac(this,b)};g.Y=function(a,b){return Qc.b(b,this)};g.Z=function(a,b,c){return Qc.c(b,c,this)};g.$=function(){return this.G.$(null).eb(null)};
g.qa=function(){var a=(null!=this.G?this.G.i&128||this.G.sb||(this.G.i?0:B(Za,this.G)):B(Za,this.G))?this.G.pa(null):M(this.G);return null!=a?new Cf(a,this.ya):pc};g.S=function(){return this};g.R=function(a,b){return new Cf(this.G,b)};g.T=function(a,b){return O(b,this)};Cf.prototype[Na]=function(){return rc(this)};function bf(a){return(a=K(a))?new Cf(a,null):null}function Bd(a){return gb(a)}function Df(a,b){this.G=a;this.ya=b;this.i=32374988;this.B=0}g=Df.prototype;g.toString=function(){return Ub(this)};
g.equiv=function(a){return this.w(null,a)};g.O=function(){return this.ya};g.pa=function(){var a=(null!=this.G?this.G.i&128||this.G.sb||(this.G.i?0:B(Za,this.G)):B(Za,this.G))?this.G.pa(null):M(this.G);return null==a?null:new Df(a,this.ya)};g.N=function(){return vc(this)};g.w=function(a,b){return Ac(this,b)};g.Y=function(a,b){return Qc.b(b,this)};g.Z=function(a,b,c){return Qc.c(b,c,this)};g.$=function(){return this.G.$(null).fb(null)};
g.qa=function(){var a=(null!=this.G?this.G.i&128||this.G.sb||(this.G.i?0:B(Za,this.G)):B(Za,this.G))?this.G.pa(null):M(this.G);return null!=a?new Df(a,this.ya):pc};g.S=function(){return this};g.R=function(a,b){return new Df(this.G,b)};g.T=function(a,b){return O(b,this)};Df.prototype[Na]=function(){return rc(this)};function cf(a){return(a=K(a))?new Df(a,null):null}function Cd(a){return hb(a)}
var Ef=function Ef(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ef.m(0<c.length?new J(c.slice(0),0):null)};Ef.m=function(a){return y(ae(a))?Pa.b(function(a,c){return Sc.b(y(a)?a:Yd,c)},a):null};Ef.A=0;Ef.D=function(a){return Ef.m(K(a))};Ff;function Gf(a){this.Ya=a}Gf.prototype.ua=function(){return this.Ya.ua()};Gf.prototype.next=function(){if(this.Ya.ua())return this.Ya.next().I[0];throw Error("No such element");};Gf.prototype.remove=function(){return Error("Unsupported operation")};
function Hf(a,b,c){this.v=a;this.Ra=b;this.u=c;this.i=15077647;this.B=8196}g=Hf.prototype;g.toString=function(){return Ub(this)};g.equiv=function(a){return this.w(null,a)};g.keys=function(){return rc(K(this))};g.entries=function(){var a=K(this);return new Ye(K(a))};g.values=function(){return rc(K(this))};g.has=function(a){return od(this,a)};
g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.U(null,e),h=P(f,0),f=P(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=K(b))id(b)?(c=Kb(b),b=Lb(b),h=c,d=Vc(c),c=h):(c=L(b),h=P(c,0),f=P(c,1),a.b?a.b(f,h):a.call(null,f,h),b=M(b),c=null,d=0),e=0;else return null};g.J=function(a,b){return ab.c(this,b,null)};g.H=function(a,b,c){return bb(this.Ra,b)?b:c};g.Da=function(){return new Gf(Sb(this.Ra))};g.O=function(){return this.v};g.X=function(){return Ra(this.Ra)};
g.N=function(){var a=this.u;return null!=a?a:this.u=a=xc(this)};g.w=function(a,b){return cd(b)&&Vc(this)===Vc(b)&&$d(function(a){return function(b){return od(a,b)}}(this),b)};g.Va=function(){return new Ff(Cb(this.Ra))};g.S=function(){return bf(this.Ra)};g.R=function(a,b){return new Hf(b,this.Ra,this.u)};g.T=function(a,b){return new Hf(this.v,Zc.c(this.Ra,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.J(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.J(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return this.J(null,a)};g.b=function(a,b){return this.H(null,a,b)};Hf.prototype[Na]=function(){return rc(this)};
function Ff(a){this.Ja=a;this.B=136;this.i=259}g=Ff.prototype;g.jb=function(a,b){this.Ja=Fb(this.Ja,b,null);return this};g.kb=function(){return new Hf(null,Eb(this.Ja),null)};g.X=function(){return Vc(this.Ja)};g.J=function(a,b){return ab.c(this,b,null)};g.H=function(a,b,c){return ab.c(this.Ja,b,ld)===ld?c:b};
g.call=function(){function a(a,b,c){return ab.c(this.Ja,b,ld)===ld?c:b}function b(a,b){return ab.c(this.Ja,b,ld)===ld?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};g.a=function(a){return ab.c(this.Ja,a,ld)===ld?null:a};g.b=function(a,b){return ab.c(this.Ja,a,ld)===ld?b:a};
function Ad(a){if(null!=a&&(a.B&4096||a.Vb))return a.gb(null);if("string"===typeof a)return a;throw Error([E("Doesn't support name: "),E(a)].join(""));}function If(a,b,c){this.j=a;this.end=b;this.step=c}If.prototype.ua=function(){return 0<this.step?this.j<this.end:this.j>this.end};If.prototype.next=function(){var a=this.j;this.j+=this.step;return a};function Jf(a,b,c,d,e){this.v=a;this.start=b;this.end=c;this.step=d;this.u=e;this.i=32375006;this.B=8192}g=Jf.prototype;g.toString=function(){return Ub(this)};
g.equiv=function(a){return this.w(null,a)};g.U=function(a,b){if(b<Ra(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};g.ta=function(a,b,c){return b<Ra(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};g.Da=function(){return new If(this.start,this.end,this.step)};g.O=function(){return this.v};
g.pa=function(){return 0<this.step?this.start+this.step<this.end?new Jf(this.v,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Jf(this.v,this.start+this.step,this.end,this.step,null):null};g.X=function(){return La(vb(this))?0:Math.ceil((this.end-this.start)/this.step)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=vc(this)};g.w=function(a,b){return Ac(this,b)};g.Y=function(a,b){return Fc(this,b)};
g.Z=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.b?b.b(c,a):b.call(null,c,a);if(Ec(c))return N.a?N.a(c):N.call(null,c);a+=this.step}else return c};g.$=function(){return null==vb(this)?null:this.start};g.qa=function(){return null!=vb(this)?new Jf(this.v,this.start+this.step,this.end,this.step,null):pc};g.S=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};
g.R=function(a,b){return new Jf(b,this.start,this.end,this.step,this.u)};g.T=function(a,b){return O(b,this)};Jf.prototype[Na]=function(){return rc(this)};
function Kf(a,b){return function(){function c(c,d,e){return new U(null,2,5,V,[a.c?a.c(c,d,e):a.call(null,c,d,e),b.c?b.c(c,d,e):b.call(null,c,d,e)],null)}function d(c,d){return new U(null,2,5,V,[a.b?a.b(c,d):a.call(null,c,d),b.b?b.b(c,d):b.call(null,c,d)],null)}function e(c){return new U(null,2,5,V,[a.a?a.a(c):a.call(null,c),b.a?b.a(c):b.call(null,c)],null)}function f(){return new U(null,2,5,V,[a.o?a.o():a.call(null),b.o?b.o():b.call(null)],null)}var h=null,k=function(){function c(a,b,e,f){var h=null;
if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new J(k,0)}return d.call(this,a,b,e,h)}function d(c,e,f,h){return new U(null,2,5,V,[F.C(a,c,e,f,h),F.C(b,c,e,f,h)],null)}c.A=3;c.D=function(a){var b=L(a);a=M(a);var c=L(a);a=M(a);var e=L(a);a=oc(a);return d(b,c,e,a)};c.m=d;return c}(),h=function(a,b,h,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,h);
default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new J(r,0)}return k.m(a,b,h,q)}throw Error("Invalid arity: "+arguments.length);};h.A=3;h.D=k.D;h.o=f;h.a=e;h.b=d;h.c=c;h.m=k.m;return h}()}
function Le(a,b,c,d,e,f,h){var k=ua;ua=null==ua?null:ua-1;try{if(null!=ua&&0>ua)return yb(a,"#");yb(a,c);if(0===Da.a(f))K(h)&&yb(a,function(){var a=Lf.a(f);return y(a)?a:"..."}());else{if(K(h)){var l=L(h);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=M(h),n=Da.a(f)-1;;)if(!m||null!=n&&0===n){K(m)&&0===n&&(yb(a,d),yb(a,function(){var a=Lf.a(f);return y(a)?a:"..."}()));break}else{yb(a,d);var p=L(m);c=a;h=f;b.c?b.c(p,c,h):b.call(null,p,c,h);var q=M(m);c=n-1;m=q;n=c}}return yb(a,e)}finally{ua=k}}
function Mf(a,b){for(var c=K(b),d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f);yb(a,h);f+=1}else if(c=K(c))d=c,id(d)?(c=Kb(d),e=Lb(d),d=c,h=Vc(c),c=e,e=h):(h=L(d),yb(a,h),c=M(d),d=null,e=0),f=0;else return null}var Nf={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Of(a){return[E('"'),E(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Nf[a]})),E('"')].join("")}Pf;
function Qf(a,b){var c=nd(H.b(a,Ba));return c?(c=null!=b?b.i&131072||b.Ub?!0:!1:!1)?null!=bd(b):c:c}
function Rf(a,b,c){if(null==a)return yb(b,"nil");if(Qf(c,a)){yb(b,"^");var d=bd(a);Me.c?Me.c(d,b,c):Me.call(null,d,b,c);yb(b," ")}if(a.Cb)return a.Lb(a,b,c);if(null!=a&&(a.i&2147483648||a.P))return a.K(null,b,c);if(!0===a||!1===a||"number"===typeof a)return yb(b,""+E(a));if(null!=a&&a.constructor===Object)return yb(b,"#js "),d=Q.b(function(b){return new U(null,2,5,V,[Id.a(b),a[b]],null)},jd(a)),Pf.s?Pf.s(d,Me,b,c):Pf.call(null,d,Me,b,c);if(Ja(a))return Le(b,Me,"#js ["," ","]",c,a);if("string"==typeof a)return y(za.a(c))?
yb(b,Of(a)):yb(b,a);if("function"==u(a)){var e=a.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Mf(b,mc(["#object[",c,' "',""+E(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+E(a);;)if(Vc(c)<b)c=[E("0"),E(c)].join("");else return c},Mf(b,mc(['#inst "',""+E(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),
3),"-",'00:00"'],0));if(a instanceof RegExp)return Mf(b,mc(['#"',a.source,'"'],0));if(null!=a&&(a.i&2147483648||a.P))return zb(a,b,c);if(y(a.constructor.lb))return Mf(b,mc(["#object[",a.constructor.lb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Mf(b,mc(["#object[",c," ",""+E(a),"]"],0))}function Me(a,b,c){var d=Sf.a(c);return y(d)?(c=Zc.c(c,Tf,Rf),d.c?d.c(a,b,c):d.call(null,a,b,c)):Rf(a,b,c)}
var ge=function ge(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ge.m(0<c.length?new J(c.slice(0),0):null)};ge.m=function(a){var b=wa();if(null==a||La(K(a)))b="";else{var c=E,d=new na;a:{var e=new Tb(d);Me(L(a),e,b);a=K(M(a));for(var f=null,h=0,k=0;;)if(k<h){var l=f.U(null,k);yb(e," ");Me(l,e,b);k+=1}else if(a=K(a))f=a,id(f)?(a=Kb(f),h=Lb(f),f=a,l=Vc(a),a=h,h=l):(l=L(f),yb(e," "),Me(l,e,b),a=M(f),f=null,h=0),k=0;else break a}b=""+c(d)}return b};ge.A=0;
ge.D=function(a){return ge.m(K(a))};function Pf(a,b,c,d){return Le(c,function(a,c,d){var k=gb(a);b.c?b.c(k,c,d):b.call(null,k,c,d);yb(c," ");a=hb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,K(a))}le.prototype.P=!0;le.prototype.K=function(a,b,c){yb(b,"#object [cljs.core.Volatile ");Me(new xa(null,1,[Uf,this.state],null),b,c);return yb(b,"]")};J.prototype.P=!0;J.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};Jd.prototype.P=!0;
Jd.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};wf.prototype.P=!0;wf.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};Bf.prototype.P=!0;Bf.prototype.K=function(a,b,c){return Le(b,Me,"["," ","]",c,this)};af.prototype.P=!0;af.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};tc.prototype.P=!0;tc.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};hd.prototype.P=!0;hd.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};
Gd.prototype.P=!0;Gd.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};Lc.prototype.P=!0;Lc.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};Yc.prototype.P=!0;Yc.prototype.K=function(a,b,c){return Pf(this,Me,b,c)};xf.prototype.P=!0;xf.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};Qe.prototype.P=!0;Qe.prototype.K=function(a,b,c){return Le(b,Me,"["," ","]",c,this)};Hf.prototype.P=!0;Hf.prototype.K=function(a,b,c){return Le(b,Me,"#{"," ","}",c,this)};
gd.prototype.P=!0;gd.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};de.prototype.P=!0;de.prototype.K=function(a,b,c){yb(b,"#object [cljs.core.Atom ");Me(new xa(null,1,[Uf,this.state],null),b,c);return yb(b,"]")};Df.prototype.P=!0;Df.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};Af.prototype.P=!0;Af.prototype.K=function(a,b,c){return Le(b,Me,"["," ","]",c,this)};U.prototype.P=!0;U.prototype.K=function(a,b,c){return Le(b,Me,"["," ","]",c,this)};Fd.prototype.P=!0;
Fd.prototype.K=function(a,b){return yb(b,"()")};Zd.prototype.P=!0;Zd.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};xa.prototype.P=!0;xa.prototype.K=function(a,b,c){return Pf(this,Me,b,c)};Jf.prototype.P=!0;Jf.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};Cf.prototype.P=!0;Cf.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};Mc.prototype.P=!0;Mc.prototype.K=function(a,b,c){return Le(b,Me,"("," ",")",c,this)};bc.prototype.bb=!0;
bc.prototype.Ua=function(a,b){if(b instanceof bc)return jc(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};A.prototype.bb=!0;A.prototype.Ua=function(a,b){if(b instanceof A)return Hd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};Qe.prototype.bb=!0;Qe.prototype.Ua=function(a,b){if(fd(b))return pd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};U.prototype.bb=!0;
U.prototype.Ua=function(a,b){if(fd(b))return pd(this,b);throw Error([E("Cannot compare "),E(this),E(" to "),E(b)].join(""));};var Vf=null;function Wf(a){null==Vf&&(Vf=ee.a?ee.a(0):ee.call(null,0));return lc.a([E(a),E(ke.b(Vf,Cc))].join(""))}function Xf(a){return function(b,c){var d=a.b?a.b(b,c):a.call(null,b,c);return Ec(d)?new Dc(d):d}}
function te(a){return function(b){return function(){function c(a,c){return Pa.c(b,a,c)}function d(b){return a.a?a.a(b):a.call(null,b)}function e(){return a.o?a.o():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.o=e;f.a=d;f.b=c;return f}()}(Xf(a))}Yf;function Zf(){}
var $f=function $f(b){if(null!=b&&null!=b.Qb)return b.Qb(b);var c=$f[u(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=$f._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw C("IEncodeJS.-clj-\x3ejs",b);};ag;function bg(a){return(null!=a?a.Pb||(a.cc?0:B(Zf,a)):B(Zf,a))?$f(a):"string"===typeof a||"number"===typeof a||a instanceof A||a instanceof bc?ag.a?ag.a(a):ag.call(null,a):ge.m(mc([a],0))}
var ag=function ag(b){if(null==b)return null;if(null!=b?b.Pb||(b.cc?0:B(Zf,b)):B(Zf,b))return $f(b);if(b instanceof A)return Ad(b);if(b instanceof bc)return""+E(b);if(ed(b)){var c={};b=K(b);for(var d=null,e=0,f=0;;)if(f<e){var h=d.U(null,f),k=P(h,0),h=P(h,1);c[bg(k)]=ag(h);f+=1}else if(b=K(b))id(b)?(e=Kb(b),b=Lb(b),d=e,e=Vc(e)):(e=L(b),d=P(e,0),e=P(e,1),c[bg(d)]=ag(e),b=M(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.i&8||b.nc||(b.i?0:B(Sa,b)):B(Sa,b)){c=[];b=K(Q.b(ag,b));d=null;for(f=
e=0;;)if(f<e)k=d.U(null,f),c.push(k),f+=1;else if(b=K(b))d=b,id(d)?(b=Kb(d),f=Lb(d),d=b,e=Vc(b),b=f):(b=L(d),c.push(b),b=M(d),d=null,e=0),f=0;else break;return c}return b},Yf=function Yf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Yf.o();case 1:return Yf.a(arguments[0]);default:throw Error([E("Invalid arity: "),E(c.length)].join(""));}};Yf.o=function(){return Yf.a(1)};Yf.a=function(a){return Math.random()*a};Yf.A=1;var cg=null;
function dg(){if(null==cg){var a=new xa(null,3,[eg,Yd,fg,Yd,gg,Yd],null);cg=ee.a?ee.a(a):ee.call(null,a)}return cg}function hg(a,b,c){var d=cc.b(b,c);if(!d&&!(d=od(gg.a(a).call(null,b),c))&&(d=fd(c))&&(d=fd(b)))if(d=Vc(c)===Vc(b))for(var d=!0,e=0;;)if(d&&e!==Vc(c))d=hg(a,b.a?b.a(e):b.call(null,e),c.a?c.a(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function ig(a){var b;b=dg();b=N.a?N.a(b):N.call(null,b);a=H.b(eg.a(b),a);return K(a)?a:null}
function kg(a,b,c,d){ke.b(a,function(){return N.a?N.a(b):N.call(null,b)});ke.b(c,function(){return N.a?N.a(d):N.call(null,d)})}var lg=function lg(b,c,d){var e=(N.a?N.a(d):N.call(null,d)).call(null,b),e=y(y(e)?e.a?e.a(c):e.call(null,c):e)?!0:null;if(y(e))return e;e=function(){for(var e=ig(c);;)if(0<Vc(e))lg(b,L(e),d),e=oc(e);else return null}();if(y(e))return e;e=function(){for(var e=ig(b);;)if(0<Vc(e))lg(L(e),c,d),e=oc(e);else return null}();return y(e)?e:!1};
function mg(a,b,c){c=lg(a,b,c);if(y(c))a=c;else{c=hg;var d;d=dg();d=N.a?N.a(d):N.call(null,d);a=c(d,a,b)}return a}
var ng=function ng(b,c,d,e,f,h,k){var l=Pa.c(function(e,h){var k=P(h,0);P(h,1);if(hg(N.a?N.a(d):N.call(null,d),c,k)){var l;l=(l=null==e)?l:mg(k,L(e),f);l=y(l)?h:e;if(!y(mg(L(l),k,f)))throw Error([E("Multiple methods in multimethod '"),E(b),E("' match dispatch value: "),E(c),E(" -\x3e "),E(k),E(" and "),E(L(l)),E(", and neither is preferred")].join(""));return l}return e},null,N.a?N.a(e):N.call(null,e));if(y(l)){if(cc.b(N.a?N.a(k):N.call(null,k),N.a?N.a(d):N.call(null,d)))return ke.s(h,Zc,c,Rc(l)),
Rc(l);kg(h,e,k,d);return ng(b,c,d,e,f,h,k)}return null};function X(a,b){throw Error([E("No method in multimethod '"),E(a),E("' for dispatch value: "),E(b)].join(""));}function og(a,b,c,d,e,f,h,k){this.name=a;this.h=b;this.dc=c;this.mb=d;this.Za=e;this.jc=f;this.ob=h;this.ab=k;this.i=4194305;this.B=4352}g=og.prototype;
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I,S){a=this;var la=F.m(a.h,b,c,d,e,mc([f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I,S],0)),jg=Y(this,la);y(jg)||X(a.name,la);return F.m(jg,b,c,d,e,mc([f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I,S],0))}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I){a=this;var S=a.h.ma?a.h.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I),la=Y(this,S);y(la)||X(a.name,S);return la.ma?la.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,t,
v,w,z,x,D,I):la.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D,I)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D){a=this;var I=a.h.la?a.h.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D),S=Y(this,I);y(S)||X(a.name,I);return S.la?S.la(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D):S.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x,D)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x){a=this;var D=a.h.ka?a.h.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):a.h.call(null,
b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x),I=Y(this,D);y(I)||X(a.name,D);return I.ka?I.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x):I.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,x)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z){a=this;var x=a.h.ja?a.h.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z),D=Y(this,x);y(D)||X(a.name,x);return D.ja?D.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z):D.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,
w){a=this;var z=a.h.ia?a.h.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w),x=Y(this,z);y(x)||X(a.name,z);return x.ia?x.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w):x.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v){a=this;var w=a.h.ha?a.h.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v),z=Y(this,w);y(z)||X(a.name,w);return z.ha?z.ha(b,c,d,e,f,h,k,l,m,n,p,q,r,t,v):z.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v)}
function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t){a=this;var v=a.h.ga?a.h.ga(b,c,d,e,f,h,k,l,m,n,p,q,r,t):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t),w=Y(this,v);y(w)||X(a.name,v);return w.ga?w.ga(b,c,d,e,f,h,k,l,m,n,p,q,r,t):w.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;var t=a.h.fa?a.h.fa(b,c,d,e,f,h,k,l,m,n,p,q,r):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r),v=Y(this,t);y(v)||X(a.name,t);return v.fa?v.fa(b,c,d,e,f,h,k,l,m,n,p,q,r):v.call(null,b,c,d,e,f,h,k,l,m,n,p,
q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;var r=a.h.ea?a.h.ea(b,c,d,e,f,h,k,l,m,n,p,q):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,q),t=Y(this,r);y(t)||X(a.name,r);return t.ea?t.ea(b,c,d,e,f,h,k,l,m,n,p,q):t.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;var q=a.h.da?a.h.da(b,c,d,e,f,h,k,l,m,n,p):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p),r=Y(this,q);y(r)||X(a.name,q);return r.da?r.da(b,c,d,e,f,h,k,l,m,n,p):r.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,
n){a=this;var p=a.h.ca?a.h.ca(b,c,d,e,f,h,k,l,m,n):a.h.call(null,b,c,d,e,f,h,k,l,m,n),q=Y(this,p);y(q)||X(a.name,p);return q.ca?q.ca(b,c,d,e,f,h,k,l,m,n):q.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;var n=a.h.oa?a.h.oa(b,c,d,e,f,h,k,l,m):a.h.call(null,b,c,d,e,f,h,k,l,m),p=Y(this,n);y(p)||X(a.name,n);return p.oa?p.oa(b,c,d,e,f,h,k,l,m):p.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;var m=a.h.na?a.h.na(b,c,d,e,f,h,k,l):a.h.call(null,b,c,d,e,f,h,k,l),n=
Y(this,m);y(n)||X(a.name,m);return n.na?n.na(b,c,d,e,f,h,k,l):n.call(null,b,c,d,e,f,h,k,l)}function t(a,b,c,d,e,f,h,k){a=this;var l=a.h.W?a.h.W(b,c,d,e,f,h,k):a.h.call(null,b,c,d,e,f,h,k),m=Y(this,l);y(m)||X(a.name,l);return m.W?m.W(b,c,d,e,f,h,k):m.call(null,b,c,d,e,f,h,k)}function v(a,b,c,d,e,f,h){a=this;var k=a.h.V?a.h.V(b,c,d,e,f,h):a.h.call(null,b,c,d,e,f,h),l=Y(this,k);y(l)||X(a.name,k);return l.V?l.V(b,c,d,e,f,h):l.call(null,b,c,d,e,f,h)}function w(a,b,c,d,e,f){a=this;var h=a.h.C?a.h.C(b,c,
d,e,f):a.h.call(null,b,c,d,e,f),k=Y(this,h);y(k)||X(a.name,h);return k.C?k.C(b,c,d,e,f):k.call(null,b,c,d,e,f)}function z(a,b,c,d,e){a=this;var f=a.h.s?a.h.s(b,c,d,e):a.h.call(null,b,c,d,e),h=Y(this,f);y(h)||X(a.name,f);return h.s?h.s(b,c,d,e):h.call(null,b,c,d,e)}function D(a,b,c,d){a=this;var e=a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d),f=Y(this,e);y(f)||X(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function I(a,b,c){a=this;var d=a.h.b?a.h.b(b,c):a.h.call(null,b,c),e=Y(this,d);y(e)||X(a.name,
d);return e.b?e.b(b,c):e.call(null,b,c)}function S(a,b){a=this;var c=a.h.a?a.h.a(b):a.h.call(null,b),d=Y(this,c);y(d)||X(a.name,c);return d.a?d.a(b):d.call(null,b)}function la(a){a=this;var b=a.h.o?a.h.o():a.h.call(null),c=Y(this,b);y(c)||X(a.name,b);return c.o?c.o():c.call(null)}var x=null,x=function(x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Vb,Wa,eb,sb,Mb,kc,Uc,se){switch(arguments.length){case 1:return la.call(this,x);case 2:return S.call(this,x,R);case 3:return I.call(this,x,R,T);case 4:return D.call(this,
x,R,T,W);case 5:return z.call(this,x,R,T,W,Z);case 6:return w.call(this,x,R,T,W,Z,da);case 7:return v.call(this,x,R,T,W,Z,da,fa);case 8:return t.call(this,x,R,T,W,Z,da,fa,ha);case 9:return r.call(this,x,R,T,W,Z,da,fa,ha,ia);case 10:return q.call(this,x,R,T,W,Z,da,fa,ha,ia,ka);case 11:return p.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa);case 12:return n.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa);case 13:return m.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga);case 14:return l.call(this,x,R,T,W,Z,da,fa,ha,ia,
ka,qa,Aa,Ga,Ka);case 15:return k.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Vb);case 16:return h.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Vb,Wa);case 17:return f.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Vb,Wa,eb);case 18:return e.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Vb,Wa,eb,sb);case 19:return d.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Vb,Wa,eb,sb,Mb);case 20:return c.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Vb,Wa,eb,sb,Mb,kc);case 21:return b.call(this,x,R,T,
W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Vb,Wa,eb,sb,Mb,kc,Uc);case 22:return a.call(this,x,R,T,W,Z,da,fa,ha,ia,ka,qa,Aa,Ga,Ka,Vb,Wa,eb,sb,Mb,kc,Uc,se)}throw Error("Invalid arity: "+arguments.length);};x.a=la;x.b=S;x.c=I;x.s=D;x.C=z;x.V=w;x.W=v;x.na=t;x.oa=r;x.ca=q;x.da=p;x.ea=n;x.fa=m;x.ga=l;x.ha=k;x.ia=h;x.ja=f;x.ka=e;x.la=d;x.ma=c;x.Bb=b;x.cb=a;return x}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Oa(b)))};
g.o=function(){var a=this.h.o?this.h.o():this.h.call(null),b=Y(this,a);y(b)||X(this.name,a);return b.o?b.o():b.call(null)};g.a=function(a){var b=this.h.a?this.h.a(a):this.h.call(null,a),c=Y(this,b);y(c)||X(this.name,b);return c.a?c.a(a):c.call(null,a)};g.b=function(a,b){var c=this.h.b?this.h.b(a,b):this.h.call(null,a,b),d=Y(this,c);y(d)||X(this.name,c);return d.b?d.b(a,b):d.call(null,a,b)};
g.c=function(a,b,c){var d=this.h.c?this.h.c(a,b,c):this.h.call(null,a,b,c),e=Y(this,d);y(e)||X(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};g.s=function(a,b,c,d){var e=this.h.s?this.h.s(a,b,c,d):this.h.call(null,a,b,c,d),f=Y(this,e);y(f)||X(this.name,e);return f.s?f.s(a,b,c,d):f.call(null,a,b,c,d)};g.C=function(a,b,c,d,e){var f=this.h.C?this.h.C(a,b,c,d,e):this.h.call(null,a,b,c,d,e),h=Y(this,f);y(h)||X(this.name,f);return h.C?h.C(a,b,c,d,e):h.call(null,a,b,c,d,e)};
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
g.Bb=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S){var la=F.m(this.h,a,b,c,d,mc([e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S],0)),x=Y(this,la);y(x)||X(this.name,la);return F.m(x,a,b,c,d,mc([e,f,h,k,l,m,n,p,q,r,t,v,w,z,D,I,S],0))};
function Y(a,b){cc.b(N.a?N.a(a.ab):N.call(null,a.ab),N.a?N.a(a.mb):N.call(null,a.mb))||kg(a.ob,a.Za,a.ab,a.mb);var c=(N.a?N.a(a.ob):N.call(null,a.ob)).call(null,b);if(y(c))return c;c=ng(a.name,b,a.mb,a.Za,a.jc,a.ob,a.ab);return y(c)?c:(N.a?N.a(a.Za):N.call(null,a.Za)).call(null,a.dc)}g.gb=function(){return Ob(this.name)};g.hb=function(){return Pb(this.name)};g.N=function(){return this[ba]||(this[ba]=++ca)};var pg=new A(null,"path","path",-188191168),qg=new A(null,"transform","transform",1381301764),Ba=new A(null,"meta","meta",1499536964),rg=new bc(null,"blockable","blockable",-28395259,null),Ca=new A(null,"dup","dup",556298533),sg=new A(null,"offset","offset",296498311),tg=new A(null,"button","button",1456579943),je=new bc(null,"new-value","new-value",-1567397401,null),fe=new A(null,"validator","validator",-1966190681),ug=new A(null,"default","default",-1987822328),vg=new A(null,"reset-points","reset-points",
-5234839),wg=new A(null,"width","width",-384071477),xg=new A(null,"onclick","onclick",1297553739),yg=new A(null,"midpoint","midpoint",-36269525),Uf=new A(null,"val","val",128701612),zg=new A(null,"type","type",1174270348),ie=new bc(null,"validate","validate",1439230700,null),Tf=new A(null,"fallback-impl","fallback-impl",-1501286995),Ag=new A(null,"source","source",-433931539),ya=new A(null,"flush-on-newline","flush-on-newline",-151457939),Bg=new A(null,"angle","angle",1622094254),Cg=new A(null,"radius",
"radius",-2073122258),Dg=new A(null,"className","className",-1983287057),fg=new A(null,"descendants","descendants",1824886031),Eg=new A(null,"center","center",-748944368),gg=new A(null,"ancestors","ancestors",-776045424),oe=new bc(null,"n","n",-2092305744,null),Fg=new A(null,"div","div",1057191632),za=new A(null,"readably","readably",1129599760),Lf=new A(null,"more-marker","more-marker",-14717935),Gg=new A(null,"balance","balance",418967409),Hg=new A(null,"island","island",623473715),Da=new A(null,
"print-length","print-length",1931866356),Ig=new A(null,"id","id",-1388402092),Jg=new A(null,"class","class",-2030961996),eg=new A(null,"parents","parents",-2027538891),Kg=new A(null,"svg","svg",856789142),Lg=new A(null,"max-offset","max-offset",-851769098),Mg=new A(null,"radial","radial",-1334240714),Ng=new A(null,"right","right",-452581833),Og=new A(null,"position","position",-2011731912),Pg=new A(null,"d","d",1972142424),Qg=new A(null,"depth","depth",1768663640),Rg=new A(null,"rerender","rerender",
-1601192263),Xd=new bc(null,"quote","quote",1377916282,null),Wd=new A(null,"arglists","arglists",1661989754),Vd=new bc(null,"nil-iter","nil-iter",1101030523,null),Sg=new A(null,"main","main",-2117802661),Tg=new A(null,"hierarchy","hierarchy",-1053470341),Sf=new A(null,"alt-impl","alt-impl",670969595),Ug=new A(null,"rect","rect",-108902628),ne=new bc(null,"number?","number?",-1747282210,null),Vg=new A(null,"height","height",1025178622),Wg=new A(null,"left","left",-399115937),Xg=new A(null,"foreignObject",
"foreignObject",25502111),Yg=new bc(null,"f","f",43394975,null);var Zg;var $g;a:{var ah=aa.navigator;if(ah){var bh=ah.userAgent;if(bh){$g=bh;break a}}$g=""};function ch(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function dh(a,b,c,d){this.head=a;this.I=b;this.length=c;this.f=d}dh.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.I];this.f[this.I]=null;this.I=(this.I+1)%this.f.length;--this.length;return a};dh.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};
dh.prototype.resize=function(){var a=Array(2*this.f.length);return this.I<this.head?(ch(this.f,this.I,a,0,this.length),this.I=0,this.head=this.length,this.f=a):this.I>this.head?(ch(this.f,this.I,a,0,this.f.length-this.I),ch(this.f,0,a,this.f.length-this.I,this.head),this.I=0,this.head=this.length,this.f=a):this.I===this.head?(this.head=this.I=0,this.f=a):null};if("undefined"===typeof eh)var eh={};var fh;
function gh(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==$g.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ja(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==$g.indexOf("Trident")&&-1==$g.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Eb;c.Eb=null;a()}};return function(a){d.next={Eb:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var hh;hh=new dh(0,0,0,Array(32));var ih=!1,jh=!1;kh;function lh(){ih=!0;jh=!1;for(var a=0;;){var b=hh.pop();if(null!=b&&(b.o?b.o():b.call(null),1024>a)){a+=1;continue}break}ih=!1;return 0<hh.length?kh.o?kh.o():kh.call(null):null}function kh(){var a=jh;if(y(y(a)?ih:a))return null;jh=!0;"function"!=u(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(fh||(fh=gh()),fh(lh)):aa.setImmediate(lh)};for(var mh=Array(1),nh=0;;)if(nh<mh.length)mh[nh]=null,nh+=1;else break;(function(a){"undefined"===typeof Zg&&(Zg=function(a,c,d){this.ec=a;this.Nb=c;this.gc=d;this.i=393216;this.B=0},Zg.prototype.R=function(a,c){return new Zg(this.ec,this.Nb,c)},Zg.prototype.O=function(){return this.gc},Zg.fc=function(){return new U(null,3,5,V,[Yg,rg,pa.uc],null)},Zg.Cb=!0,Zg.lb="cljs.core.async/t_cljs$core$async11301",Zg.Lb=function(a,c){return yb(c,"cljs.core.async/t_cljs$core$async11301")});return new Zg(a,!0,Yd)})(function(){return null});var oh=VDOM.diff,ph=VDOM.patch,qh=VDOM.create;function rh(a){return ve(be(Ia),ve(be(md),we(a)))}function sh(a,b,c){return new VDOM.VHtml(Ad(a),ag(b),ag(c))}function th(a,b,c){return new VDOM.VSvg(Ad(a),ag(b),ag(c))}uh;
var vh=function vh(b){if(null==b)return new VDOM.VText("");if(md(b))return sh(Fg,Yd,Q.b(vh,rh(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(cc.b(Kg,L(b)))return uh.a?uh.a(b):uh.call(null,b);var c=P(b,0),d=P(b,1);b=zd(b);return sh(c,d,Q.b(vh,rh(b)))},uh=function uh(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(cc.b(Xg,L(b))){var c=P(b,0),d=P(b,1);b=zd(b);return th(c,d,Q.b(vh,rh(b)))}c=P(b,0);d=P(b,1);b=
zd(b);return th(c,d,Q.b(uh,rh(b)))};
function wh(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return ee.a?ee.a(a):ee.call(null,a)}(),c=function(){var a;a=N.a?N.a(b):N.call(null,b);a=qh.a?qh.a(a):qh.call(null,a);return ee.a?ee.a(a):ee.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.o?a.o():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(N.a?N.a(c):N.call(null,c));return function(a,b,c){return function(d){var l=
vh(d);d=function(){var b=N.a?N.a(a):N.call(null,a);return oh.b?oh.b(b,l):oh.call(null,b,l)}();he.b?he.b(a,l):he.call(null,a,l);d=function(a,b,c,d){return function(){return ke.c(d,ph,b)}}(l,d,a,b,c);return c.a?c.a(d):c.call(null,d)}}(b,c,d)};function xh(a,b){return[E("translate("),E(a),E(","),E(b),E(")")].join("")}function yh(a){var b=P(a,0);a=P(a,1);return[E(b),E(","),E(a)].join("")}function zh(a){a=Q.b(yh,a);a=pe(1,re.b(qe("L"),a));a=ag(a).join("");return[E("M"),E(a)].join("")};var Ah=Math.sin,Bh=Math.cos,Ch=2*Math.PI,Dh=Math.sqrt;function Eh(a,b){var c=P(a,0),d=P(a,1),e=P(b,0),f=P(b,1),c=Math.pow(c-e,2)+Math.pow(d-f,2);return Dh.a?Dh.a(c):Dh.call(null,c)}function Fh(a){return Pa.b(td,a)/Vc(a)};sa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new J(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Ea.a?Ea.a(a):Ea.call(null,a))}a.A=0;a.D=function(a){a=K(a);return b(a)};a.m=b;return a}();
ta=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new J(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,Ea.a?Ea.a(a):Ea.call(null,a))}a.A=0;a.D=function(a){a=K(a);return b(a)};a.m=b;return a}();
function Gh(a){var b=Kf(function(a){return F.b(vd,a)},function(a){return F.b(ud,a)}),c=function(){var c=Q.b(L,a);return b.a?b.a(c):b.call(null,c)}(),d=P(c,0),c=P(c,1),e=function(){var c=Q.b(Rc,a);return b.a?b.a(c):b.call(null,c)}(),f=P(e,0),e=P(e,1);return new U(null,4,5,V,[d,f,c-d,e-f],null)}
function Hh(){var a=Ih,b=N.a?N.a(Jh):N.call(null,Jh),c=null!=b&&(b.i&64||b.Ia)?F.b(zc,b):b,d=H.b(c,Hg);return new U(null,3,5,V,[Sg,Yd,new U(null,4,5,V,[Fg,Yd,new U(null,3,5,V,[Fg,Yd,new U(null,3,5,V,[tg,new xa(null,2,[Dg,"unprinted",xg,function(){return function(){return a.a?a.a(vg):a.call(null,vg)}}(600,b,c,c,d)],null),"New Island"],null)],null),new U(null,3,5,V,[Fg,Yd,new U(null,4,5,V,[Kg,new xa(null,2,[wg,600,Vg,600],null),new U(null,2,5,V,[Ug,new xa(null,3,[Jg,"water",wg,600,Vg,600],null)],null),
function(){var a=Q.b(Og,d),b=V,c,k=Gh(a),l=new U(null,4,5,V,[0,0,600,600],null);c=P(k,0);var m=P(k,1),n=P(k,2),k=P(k,3),p=P(l,0),q=P(l,1),r=P(l,2),l=P(l,3),t;t=r/n;var v=l/k;t=t<v?t:v;c=[E(xh(p+r/2,q+l/2)),E("scale("),E(.95*t),E(")"),E(xh(-(c+n/2),-(m+k/2)))].join("");a=K(a)?[E(zh(a)),E("Z")].join(""):"";return new U(null,2,5,b,[pg,new xa(null,3,[Jg,"island",qg,c,Pg,a],null)],null)}()],null)],null)],null)],null)}function Kh(){return new xa(null,3,[sg,Yf.o(),Gg,Yf.o(),Lg,.05+Yf.o()],null)}
function Lh(a){return function c(a){return new Jd(null,function(){for(;;){var e=K(a);if(e){if(id(e)){var f=Kb(e),h=Vc(f),k=new Md(Array(h),0);return function(){for(var a=0;;)if(a<h){var c=G.b(f,a),d=Kh(),e=d=null!=d&&(d.i&64||d.Ia)?F.b(zc,d):d,l=H.b(d,sg),m=H.b(d,Gg);Od(k,Ef.m(mc([e,new xa(null,3,[Ig,Wf("radial"),Og,function(){var a=100*(1+(l-m));return new U(null,2,5,V,[a*(Bh.a?Bh.a(c):Bh.call(null,c)),a*(Ah.a?Ah.a(c):Ah.call(null,c))],null)}(),Ag,new xa(null,4,[zg,Mg,Eg,new U(null,2,5,V,[0,0],null),
Bg,c,Cg,100],null)],null)],0)));a+=1}else return!0}()?Nd(k.za(),c(Lb(e))):Nd(k.za(),null)}var l=L(e),m=Kh(),n=m=null!=m&&(m.i&64||m.Ia)?F.b(zc,m):m,p=H.b(m,sg),q=H.b(m,Gg);return O(Ef.m(mc([n,new xa(null,3,[Ig,Wf("radial"),Og,function(){var a=100*(1+(p-q));return new U(null,2,5,V,[a*(Bh.a?Bh.a(l):Bh.call(null,l)),a*(Ah.a?Ah.a(l):Ah.call(null,l))],null)}(),Ag,new xa(null,4,[zg,Mg,Eg,new U(null,2,5,V,[0,0],null),Bg,l,Cg,100],null)],null)],0)),c(oc(e)))}return null}},null,null)}(new Jf(null,0,Ch,Ch/
a,null))}
function Mh(a,b){var c=P(a,0),d=P(a,1);d=new U(null,2,5,V,[c,d],null);c=P(d,0);d=P(d,1);if(0<=b&&2<=Eh(Og.a(c),Og.a(d))){var e;e=Yf.o();var f=Fh(Q.b(Lg,new U(null,2,5,V,[c,d],null))),h=Fh(Q.b(Gg,new U(null,2,5,V,[c,d],null))),k=Wf("midpoint"),l=Og.a(c),m=P(l,0),n=P(l,1),p=Og.a(d),q=P(p,0),r=P(p,1),l=Eh(l,p),l=f*l*(e-h),t=new U(null,2,5,V,[Fh(new U(null,2,5,V,[m,q],null)),Fh(new U(null,2,5,V,[n,r],null))],null),p=P(t,0),t=P(t,1),n=new U(null,2,5,V,[-(n-r),m-q],null),m=P(n,0),n=P(n,1),q=Eh(new U(null,2,
5,V,[0,0],null),new U(null,2,5,V,[m,n],null)),n=new U(null,2,5,V,[m/q,n/q],null),m=P(n,0),n=P(n,1);e=new xa(null,6,[Ig,k,sg,e,Gg,h,Lg,f,Og,new U(null,2,5,V,[p+l*m,t+l*n],null),Ag,new xa(null,3,[zg,yg,Wg,Ig.a(c),Ng,Ig.a(d)],null)],null);c=Rd.b(Mh(new U(null,2,5,V,[c,e],null),1),Mh(new U(null,2,5,V,[e,d],null),1))}else c=new U(null,1,5,V,[c],null);return c}
function Nh(){var a=Math.floor(17*Math.random()),b=3+a,c=Lh(b),d=Rd.b(c,new U(null,1,5,V,[L(c)],null)),e=xe(2,1,d);return ue(function(){return function(a){return Mh(a,15)}}(a,b,c,d,e),mc([e],0))}if("undefined"===typeof Jh){var Jh,Oh=new xa(null,1,[Qg,20],null);Jh=ee.a?ee.a(Oh):ee.call(null,Oh)}
if("undefined"===typeof Ih)var Ih=function(){var a=ee.a?ee.a(Yd):ee.call(null,Yd),b=ee.a?ee.a(Yd):ee.call(null,Yd),c=ee.a?ee.a(Yd):ee.call(null,Yd),d=ee.a?ee.a(Yd):ee.call(null,Yd),e=H.c(Yd,Tg,dg());return new og(lc.b("isle.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.A=1;a.D=function(a){var b=L(a);oc(a);return b};a.m=function(a){return a};return a}()}(a,b,c,d,e),ug,e,a,b,c,d)}();
var Ph=Ih;ke.s(Ph.Za,Zc,vg,function(){return ke.b(Jh,function(a){return Zc.c(a,Hg,Nh())})});kg(Ph.ob,Ph.Za,Ph.ab,Ph.mb);if("undefined"===typeof Qh)var Qh=function(a){return function(){var b=Hh();return a.a?a.a(b):a.call(null,b)}}(wh());if("undefined"===typeof Rh){var Rh,Sh=Jh;Bb(Sh,Rg,function(a,b,c,d){return Qh.a?Qh.a(d):Qh.call(null,d)});Rh=Sh}var Th=N.a?N.a(Jh):N.call(null,Jh);Qh.a?Qh.a(Th):Qh.call(null,Th);