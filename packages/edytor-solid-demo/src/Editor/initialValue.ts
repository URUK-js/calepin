import { jsonNode } from "edytor/src";

const HEADINGS = 2;
const PARAGRAPHS = 2;

export const initialValue = (): jsonNode[] => {
  let v = [];
  for (let h = 0; h < HEADINGS; h++) {
    v.push({
      type: "heading-1",
      content: [{ text: "Lorem ipsum dolor sit amet consectetur adipisicing elit" }]
    });

    v.push({
      type: "paragraph",
      content: [
        {
          text:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel fugiat corrupti id accusantium fugit labore totam, vero quasi pariatur harum impedit distinctio nostrum error necessitatibus? Blanditiis cumque veritatis fugiat magnam!"
        },
        {
          text: "",
          reference: true
        },
        {
          text:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel fugiat corrupti id accusantium fugit labore totam, vero quasi pariatur harum impedit distinctio nostrum error necessitatibus? Blanditiis cumque veritatis fugiat magnam!"
        }
      ]
    });
    v.push({
      type: "blockquote",
      content: [
        {
          text:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel fugiat corrupti id accusantium fugit labore totam, vero quasi pariatur harum impedit distinctio nostrum error necessitatibus? Blanditiis cumque veritatis fugiat magnam!"
        }
      ]
    });
  }
  return v;
};
