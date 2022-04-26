import React from "react";
import ReactDOM from "react-dom/client";
import { styled } from "@xiayang/system";

const Box = styled("div")(
  {
    display: "block",
    fontSize: "16px",
  },
);

const App: React.FunctionComponent = () => {
  return (<Box>testasd</Box>);
};


const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<App />);

if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  if (module.hot != null) {
    // @ts-ignore
    module.hot.dispose(() => root.unmount());
    // @ts-ignore
    module.hot.accept(() => root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    ));
  }
}
