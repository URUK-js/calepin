const lorem =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam delectus velit laudantium officiis itaque eveniet, similique assumenda porro voluptatibus eos ducimus reiciendis saepe magnam illum perferendis quas asperiores animi rerum.";
const HEADINGS = 100;
const PARAGRAPHS = 20;

export const initialValue = () => {
  let v = {
    children: []
  };

  for (let h = 0; h < HEADINGS; h++) {
    v.children.push({
      type: "heading",
      children: [{ text: "Lorem ipsum dolor sit amet consectetur adipisicing elit" }]
    });

    for (let p = 0; p < PARAGRAPHS; p++) {
      v.children.push({
        type: "paragraph",
        children: [{ text: lorem }, { text: "bold", bold: true }]
      });
      v.children.push({
        type: "block-quote",
        children: [{ text: lorem }]
      });
    }
  }
  return v;
};
