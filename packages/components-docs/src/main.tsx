import { Box } from "@xiayang/box";
import React, { createRef, Fragment, FunctionComponent, StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";

const Container = process.env.NODE_ENV === "development" ? StrictMode : Fragment;
const App: FunctionComponent = () => {
  const ref = createRef<any>();
  useEffect(() => {
    console.log(ref);
  });
  return (
    <Container>
      <Box ref={ref} p={5} fontSize={4} size={[1, 1, 1 / 2]} color={"white"} bg={"black"}>test</Box>
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
