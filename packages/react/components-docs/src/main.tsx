import { Box } from "@xiayang/box";
import React, { Fragment, FunctionComponent, StrictMode } from "react";
import { createRoot } from "react-dom/client";

const Container = process.env.NODE_ENV === "development" ? StrictMode : Fragment;
const App: FunctionComponent = () => {
  return (
    <Container>
      <Box p={5} fontSize={4} width={[1, 1, 1 / 2]} color={"white"} bg={"black"}>test</Box>
    </Container>
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
    module.hot.accept(() => root.render(<App />));
  }
}
