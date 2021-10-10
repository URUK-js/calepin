const lorem =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam delectus velit laudantium officiis itaque eveniet, similique assumenda porro voluptatibus eos ducimus reiciendis saepe magnam illum perferendis quas asperiores animi rerum.";
const HEADINGS = 1000;
const PARAGRAPHS = 1000;

export const initialValue = () => {
  let v = [];
  for (let h = 0; h < HEADINGS; h++) {
    v.push({
      type: "heading",
      content: [{ text: "Lorem ipsum dolor sit amet consectetur adipisicing elit" }]
    });
    v.push({
      type: "paragraph",
      content: [
        {
          bold: true,
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
    for (let p = 0; p < PARAGRAPHS; p++) {
      // v.push({
      //   type: "embed",
      //   content: [{ text: lorem }, { text: "bold", highlight: true, color: "red" }],
      //   children: [],
      //   data: {
      //     url: "https://www.slatejs.org/examples/embeds"
      //   }
      // });
      // v.push({
      //   type: "layout",
      //   content: [],
      //   children: [
      //     {
      //       type: "layoutColumn",
      //       content: [],
      //       children: [
      //         {
      //           type: "paragraph",
      //           content: [{ text: lorem }, { text: "bold", highlight: true, color: "red" }],
      //           children: []
      //         }
      //       ]
      //     },
      //     {
      //       type: "layoutColumn",
      //       content: [],
      //       children: [
      //         {
      //           type: "paragraph",
      //           content: [{ text: lorem }, { text: "bold", highlight: true, color: "red" }],
      //           children: []
      //         }
      //       ]
      //     }
      //   ]
      // });
    }
  }
  return v;
};
