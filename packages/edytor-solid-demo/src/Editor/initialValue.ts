const lorem =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam delectus velit laudantium officiis itaque eveniet, similique assumenda porro voluptatibus eos ducimus reiciendis saepe magnam illum perferendis quas asperiores animi rerum.";
const HEADINGS = 1;
const PARAGRAPHS = 2;

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
        content: [{ text: lorem }, { text: "bold", bold: true }]
      });
      v.push({
        type: "block-quote",
        content: [{ text: lorem }]
      });
    }
  }
  return v;
};
