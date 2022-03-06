import React from "react";
import ReactDOM from "react-dom";
import {
  createEditor, EditorProvider, Editable, ParagraphPlugin, TitlePlugin, Plugin,
} from "@xiayang/component-editor";

const plugins: Plugin[] = [
  new ParagraphPlugin(),
  new TitlePlugin(),
];

const editor = createEditor({
  plugins: plugins,
});

const Root: React.FunctionComponent = (props) => {
  return (
    <EditorProvider editor={editor} value={[{type: "Paragraph", children: [{text: "??"}]}]} onChange={console.log}>
      <Editable />
    </EditorProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
