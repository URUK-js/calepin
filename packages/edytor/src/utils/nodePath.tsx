type X = PropertyDescriptor & ThisType<Element>;

(function(constructor) {
  "use strict";
  Object.defineProperty(constructor.prototype, "index", {
    get: function() {
      var searchParent = this.parentNode;
      if (searchParent === null) return -1;
      var childElements = searchParent.children,
        lo = -1,
        mi,
        hi = childElements.length;
      while (1 + lo !== hi) {
        mi = (hi + lo) >> 1;
        if (!(this.compareDocumentPosition(childElements[mi]) & 0x2)) {
          hi = mi;
          continue;
        }
        lo = mi;
      }
      const index = childElements[hi] === this ? hi : -1;
      this.setAttribute("data-edytor-index", index.toString());
      return index;
    }
  });
})(Element || Node);

(function(constructor) {
  "use strict";
  Object.defineProperty(constructor.prototype, "path", {
    get: function() {
      let parent = this.parentNode;
      let path = [this.index];
      while (parent) {
        if (!parent.hasAttribute("data-edytor-editor")) {
          path.push(parent.index);
          parent = parent.parentNode;
        } else {
          parent = false;
        }
      }
      path.reverse();
      this.setAttribute("data-edytor-path", path.toString());
      return path;
    }
  });
})(Element || Node);
