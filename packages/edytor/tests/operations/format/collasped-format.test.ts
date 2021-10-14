import { formatText } from "../../..";
import { makeEditorFixture } from "../../fixture/editorFixture";

test("format at same path", () => {
  const initialValue = [
    {
      type: "paragraph",
      content: [
        {
          text:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        }
      ],
      children: []
    }
  ];

  const expectedValue = [
    {
      type: "paragraph",
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
        },
        {
          text: "",
          bold: true
        },
        {
          text: "Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        }
      ],
      children: []
    }
  ];

  const editor = makeEditorFixture(initialValue, { start: { path: [0, 0], offset: 57 } });
  formatText(editor, { bold: true });
  console.log(JSON.stringify(editor.toJSON(), null, 2));
  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

test("format at same path", () => {
  const initialValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
        },
        {
          text: "",
          bold: true
        },
        {
          text: "Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
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
          text:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        }
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, { start: { path: [0, 1], offset: 0 } });
  formatText(editor, { bold: true });
  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

test("format at same path", () => {
  const initialValue = [
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

  const expectedValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
        },
        {
          text: "R",
          bold: true
        },
        {
          text: ""
        },
        {
          text: "em",
          bold: true
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
        }
      ]
    }
  ];

  const editor = makeEditorFixture(initialValue, { start: { path: [0, 1], offset: 1 } });
  formatText(editor, { bold: true });
  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

test("format at path and merge around", () => {
  const initialValue = [
    {
      type: "paragraph",
      children: [],
      content: [
        {
          text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. "
        },
        {
          text: "R",
          bold: true
        },
        {
          text: ""
        },
        {
          text: "em",
          bold: true
        },
        {
          text: " eius nisi quam molestias laudantium distinctio mollitia excepturi autem consequatur quo"
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

  const editor = makeEditorFixture(initialValue, { start: { path: [0, 2], offset: 0 } });
  formatText(editor, { bold: true });
  expect(editor.toJSON()).toStrictEqual(expectedValue);
});

test("format at same path", () => {
  const initialValue = [
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

  const editor = makeEditorFixture(initialValue, { start: { path: [0, 1], offset: 0 } });
  formatText(editor, { bold: true });
  expect(editor.toJSON()).toStrictEqual(expectedValue);
});
