import React from "react";
import ReactDOM from "react-dom/client";
import { Box } from "@xiayang/box";

const Container = process.env.NODE_ENV === "development" ? React.StrictMode : React.Fragment;
const App: React.FunctionComponent = () => {
  return (
    <Container>
      <Box css={{color:'red'}}>test</Box>
    </Container>
  );
};


const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<App />);

// @ts-ignore
if (module.hot != null) {
  // @ts-ignore
  module.hot.dispose(() => root.unmount());
  // @ts-ignore
  module.hot.accept(() => root.render(<App />));
}
