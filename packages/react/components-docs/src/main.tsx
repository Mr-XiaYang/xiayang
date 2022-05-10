import { Box } from "@xiayang/box";
import React, { Fragment, FunctionComponent, StrictMode } from "react";
import { createRoot } from "react-dom/client";

const Container = process.env.NODE_ENV === "development" ? Fragment : Fragment;
const App: FunctionComponent = () => {

  return (
    <div>
      <Box>test</Box>
    </div>
  );
};

const root = createRoot(document.getElementById("app")!);
root.render(<App />);

if (process.env.NODE_ENV !== "production") {
// @ts-ignore
  if (module.hot != null) {
    // @ts-ignore
    module.hot.dispose(() => root.unmount());
    // @ts-ignore
    module.hot.accept(() => root.render(<StrictMode><App /></StrictMode>));
  }
}
