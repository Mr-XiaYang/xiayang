import React from "react";
import ReactDOM from "react-dom/client";
import { styled } from "@xiayang/system";

const Box = styled("div")(
  {
    root: {
      display: "block",
      color: "yellow",
    },
  },
);

const App: React.FunctionComponent = () => {
  return (<Box>test</Box>);
};

ReactDOM.createRoot(document.getElementById("app")!).render(<App />);

// if (process.env.NODE_ENV === "development") {
//   // @ts-ignore
//   module.hot != null && module.hot.accept();
// }
