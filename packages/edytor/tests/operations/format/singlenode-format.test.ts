import { formatText } from "../../..";
import { makeEditorFixture, removeIds } from "../../fixture/editorFixture";

test("format range at same path", () => {
  const initialValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        }
      ]
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
        },
        {
          text: "Rem",
          bold: true
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        }
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, {
    start: { path: [0, 0], offset: 57 },
    end: { path: [0, 0], offset: 60 }
  });
  formatText(editor, { bold: true });
  console.log(JSON.stringify(removeIds(editor.toJSON()), null, 3));

  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

test("add format to already formated node ", () => {
  const initialValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          bold: true
        }
      ]
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          bold: true
        },
        {
          text: "Rem",
          bold: true,
          italic: true
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          bold: true
        }
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, {
    start: { path: [0, 0], offset: 57 },
    end: { path: [0, 0], offset: 60 }
  });
  formatText(editor, { italic: true });

  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

test("format range  at same path 2", () => {
  const initialValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        },
        {
          text: "Coucou",
          bold: true
        }
      ]
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
        },
        {
          text: "Rem",
          bold: true
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        },
        {
          text: "Coucou",
          bold: true
        }
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, {
    start: { path: [0, 0], offset: 57 },
    end: { path: [0, 0], offset: 60 }
  });
  formatText(editor, { bold: true });

  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

test("format range  at same path without remaining text", () => {
  const initialValue = [
    {
      children: [],
      type: "paragraph",
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem"
        }
      ]
    }
  ];

  const expectedValue = [
    {
      children: [],
      type: "paragraph",
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
        },
        {
          text: "Rem",
          bold: true
        }
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, {
    start: { path: [0, 0], offset: 57 },
    end: { path: [0, 0], offset: 60 }
  });
  formatText(editor, { bold: true });
  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

test("format at same path with already formated text", () => {
  const initialValue = [
    {
      children: [],
      type: "paragraph",
      content: [
        {
          text:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          italic: true
        }
      ]
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          italic: true
        },
        {
          text: "Rem",
          bold: true,
          italic: true
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          italic: true
        }
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, {
    start: { path: [0, 0], offset: 57 },
    end: { path: [0, 0], offset: 60 }
  });
  formatText(editor, { bold: true });
  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

test("partial unformat at range", () => {
  const initialValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          italic: true
        }
      ]
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          italic: true
        },
        {
          text: "Rem"
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          italic: true
        }
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, {
    start: { path: [0, 0], offset: 57 },
    end: { path: [0, 0], offset: 60 }
  });
  formatText(editor, { italic: true });
  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

test("format at same path and then unformat", () => {
  const initialValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        }
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, {
    start: { path: [0, 0], offset: 57 },
    end: { path: [0, 0], offset: 60 }
  });
  formatText(editor, { bold: true });

  const editor2 = makeEditorFixture(editor.toJSON(), {
    start: { path: [0, 1], offset: 0 },
    end: { path: [0, 1], offset: 3 }
  });
  formatText(editor2, { bold: true });
  console.log(removeIds(editor2.toJSON()));
  expect(removeIds(editor2.toJSON())).toStrictEqual(initialValue);
});

test("partial unformat at range", () => {
  const initialValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          bold: true
        },
        {
          text: "Rem"
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          bold: true
        }
      ]
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          bold: true
        },
        {
          text: "Rem",
          italic: true
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          bold: true
        }
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, {
    start: { path: [0, 1], offset: 0 },
    end: { path: [0, 1], offset: 3 }
  });
  formatText(editor, { italic: true });
  console.log(removeIds(editor.toJSON()));

  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

test("partial unformat at range", () => {
  const initialValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          bold: true
        },
        {
          text: "Rem"
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          italic: true
        }
      ]
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          bold: true
        },
        {
          text: "Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          italic: true
        }
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, {
    start: { path: [0, 1], offset: 0 },
    end: { path: [0, 1], offset: 3 }
  });
  formatText(editor, { italic: true });

  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

test("partial unformat at range", () => {
  const initialValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          bold: true
        },
        {
          text: "Rem"
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          code: true
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          bold: true
        }
      ]
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          bold: true
        },
        {
          text: "Rem",
          italic: true
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          code: true
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          bold: true
        }
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, {
    start: { path: [0, 1], offset: 0 },
    end: { path: [0, 1], offset: 3 }
  });
  formatText(editor, { italic: true });
  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});

test("partial unformat at range", () => {
  const initialValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          bold: true
        },
        {
          text: "Rem"
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          code: true
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          bold: true
        }
      ]
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          bold: true
        },
        {
          text: "Rem",
          italic: true
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          code: true
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo",
          bold: true
        }
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, {
    start: { path: [0, 1], offset: 0 },
    end: { path: [0, 1], offset: 3 }
  });
  formatText(editor, { italic: true });
  expect(removeIds(editor.toJSON())).toStrictEqual(expectedValue);
});
