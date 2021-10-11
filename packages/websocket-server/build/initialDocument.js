"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNode = exports.createLeaf = exports.getChildren = exports.getContent = void 0;
const nanoid_1 = require("nanoid");
const yjs_1 = require("yjs");
const getContent = (leaf) => {
    return (0, exports.createLeaf)(leaf);
};
exports.getContent = getContent;
const getChildren = (_a) => {
    var { type, content = [], children = [] } = _a, props = __rest(_a, ["type", "content", "children"]);
    return (0, exports.createNode)(type, Object.assign(Object.assign({}, props), { children: children.map(exports.getChildren), content: content.map(exports.getContent) }));
};
exports.getChildren = getChildren;
const createLeaf = (props) => {
    const leaf = new yjs_1.Map();
    if (props && props.id) {
        leaf.set("id", props.id);
    }
    else {
        leaf.set("id", (0, nanoid_1.nanoid)());
    }
    if (props && props.text) {
        leaf.set("text", new yjs_1.Text(props.text));
    }
    else {
        leaf.set("text", new yjs_1.Text(""));
    }
    if (props) {
        const { id, text, data } = props, marks = __rest(props, ["id", "text", "data"]);
        leaf.set("text", new yjs_1.Text(text || ""));
        data && leaf.set("data", new yjs_1.Map(Object.entries(data)));
        marks &&
            Object.keys(marks).forEach((mark) => {
                leaf.set(mark, marks[mark]);
            });
    }
    return leaf;
};
exports.createLeaf = createLeaf;
const createNode = (type, props) => {
    const node = new yjs_1.Map();
    if (props && props.id) {
        node.set("id", props.id);
    }
    else {
        node.set("id", (0, nanoid_1.nanoid)());
    }
    node.set("type", type);
    if (props && props.data) {
        node.set("data", new yjs_1.Map(Object.entries(props.data)));
    }
    if (props && props.content && props.content instanceof yjs_1.Array) {
        node.set("content", props.content);
    }
    else if (props && props.content) {
        node.set("content", yjs_1.Array.from(props.content));
    }
    else {
        node.set("content", [(0, exports.createLeaf)()]);
    }
    if (props && props.children && props.children instanceof yjs_1.Array) {
        node.set("children", props.children);
    }
    else if (props && props.children) {
        node.set("children", yjs_1.Array.from(props.content));
    }
    else {
        node.set("children", []);
    }
    return node;
};
exports.createNode = createNode;
