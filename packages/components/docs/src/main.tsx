import React from "react";
import ReactDOM from "react-dom/client";
// import { styled } from "@xiayang/system";
//
// const Box = styled("div")(
//   {
//     display: "block",
//     fontSize: "16px",
//   },
// );

const Container = process.env.NODE_ENV === "development" ? React.StrictMode : React.Fragment;
const App: React.FunctionComponent = () => {
  return (
    <Container>
      <div>1231asdad23</div>
    </Container>
  );
};


const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<App />);

// @ts-ignore
if (module.hot != null) {
  // @ts-ignore
  module.hot.dispose(() => {
    root.unmount();
  });
  // @ts-ignore
  module.hot.accept(() => {
    root.render(React.createElement(App));
  });
}
