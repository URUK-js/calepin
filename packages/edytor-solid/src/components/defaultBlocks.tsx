import { Dynamic } from "solid-js/web";

const Wrapper = ({ props, children, focused, node, content, component }) => {
  return (
    <div {...props}>
      <Dynamic data-edytor-focused={focused()} component={component}>
        {content}
      </Dynamic>
      {children}
    </div>
  );
};
export const defaultBlocks = {
  paragraph: (props) => <Wrapper {...props} component={"p"} />,
  blockquote: (props) => <Wrapper {...props} component={"blockquote"} />,
  "heading-1": (props) => <Wrapper {...props} component={"h1"} />,
  "heading-2": (props) => <Wrapper {...props} component={"h2"} />,
  "heading-3": (props) => <Wrapper {...props} component={"h3"} />,
  "heading-4": (props) => <Wrapper {...props} component={"h4"} />,
  "heading-5": (props) => <Wrapper {...props} component={"h5"} />,
  "heading-6": (props) => <Wrapper {...props} component={"h6"} />,
  hr: (props) => <Wrapper {...props} component={"hr"} />,
  table: (props) => <Wrapper {...props} component={"table"} />,
  "table-row": (props) => <Wrapper {...props} component={"tr"} />,
  "table-cell": (props) => <Wrapper {...props} component={"td"} />,
  "ordered-list": (props) => <Wrapper {...props} component={"ol"} />,
  "unordered-list": (props) => <Wrapper {...props} component={"ul"} />,
  "list-item": (props) => <Wrapper {...props} component={"li"} />,
  "code-block": (props) => <Wrapper {...props} component={"pre"} />
};
