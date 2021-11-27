import { Dynamic } from "solid-js/web";
import { renderHandle } from ".";
const Wrapper = ({ props, children, focused, content, component, node }: any) => {
  return (
    <div {...props} className="relative">
      {renderHandle(node)}
      <Dynamic data-edytor-focused={focused()} component={component}>
        {content}
      </Dynamic>
      {children}
    </div>
  );
};
export const defaultBlocks = {
  paragraph: { component: (props: any) => <Wrapper {...props} component={"p"} /> },
  blockquote: { component: (props: any) => <Wrapper {...props} component={"blockquote"} /> },
  "heading-1": { component: (props: any) => <Wrapper {...props} component={"h1"} /> },
  "heading-2": { component: (props: any) => <Wrapper {...props} component={"h2"} /> },
  "heading-3": { component: (props: any) => <Wrapper {...props} component={"h3"} /> },
  "heading-4": { component: (props: any) => <Wrapper {...props} component={"h4"} /> },
  "heading-5": { component: (props: any) => <Wrapper {...props} component={"h5"} /> },
  "heading-6": { component: (props: any) => <Wrapper {...props} component={"h6"} /> },
  hr: { component: (props: any) => <Wrapper {...props} component={"hr"} /> },
  table: { component: (props: any) => <Wrapper {...props} component={"table"} /> },
  "table-row": { component: (props: any) => <Wrapper {...props} component={"tr"} /> },
  "table-cell": { component: (props: any) => <Wrapper {...props} component={"td"} /> },
  "ordered-list": { component: (props: any) => <Wrapper {...props} component={"ol"} /> },
  "unordered-list": { component: (props: any) => <Wrapper {...props} component={"ul"} /> },
  "list-item": { component: (props: any) => <Wrapper {...props} component={"li"} /> },
  "code-block": { component: (props: any) => <Wrapper {...props} component={"pre"} /> }
};
