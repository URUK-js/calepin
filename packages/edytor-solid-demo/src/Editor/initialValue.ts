const lorem =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam delectus velit laudantium officiis itaque eveniet, similique assumenda porro voluptatibus eos ducimus reiciendis saepe magnam illum perferendis quas asperiores animi rerum.";
const HEADINGS = 1;
const PARAGRAPHS = 1;

export const initialValue = () => {
  let v = [];
  for (let h = 0; h < HEADINGS; h++) {
    v.push({
      type: "heading",
      content: [{ text: "Lorem ipsum dolor sit amet consectetur adipisicing elit" }]
    });

    for (let p = 0; p < PARAGRAPHS; p++) {
      v.push({
        type: "paragraph",
        content: [{ text: lorem }, { text: "bold", highlight: true, color: "red" }],
        children: [
          {
            type: "paragraph",
            content: [{ text: lorem }, { text: "bold", highlight: true, color: "red" }],
            children: []
          },
          {
            type: "paragraph",
            content: [{ text: lorem }, { text: "bold", highlight: true, color: "red" }],
            children: []
          },
          {
            type: "paragraph",
            content: [{ text: lorem }, { text: "bold", highlight: true, color: "red" }],
            children: []
          }
        ]
      });
      v.push({
        type: "paragraph",
        content: [{ text: lorem }, { text: "bold", highlight: true, color: "blue" }],
        children: []
      });
      v.push({
        type: "paragraph",
        content: [{ text: lorem }, { text: "bold", highlight: true, color: "yellow" }],
        children: []
      });
    }
  }
  return v;
};
