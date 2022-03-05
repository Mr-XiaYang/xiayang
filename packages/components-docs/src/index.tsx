import React from "react";
import ReactDOM from "react-dom";
import { createEditor, EditorProvider, Editable, ParagraphPlugin, TitlePlugin } from "@xiayang/component-editor";

const editor = createEditor({
  plugins: [
    new ParagraphPlugin(),
    new TitlePlugin(),
  ],
});

const Root: React.FunctionComponent = (props) => {
  return (
    <EditorProvider editor={editor} value={[{type: "Paragraph", children: [{text: "??"}]}]} onChange={console.log}>
      <Editable />
    </EditorProvider>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
