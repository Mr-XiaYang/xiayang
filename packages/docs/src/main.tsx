import React from "react";
import ReactDOM from "react-dom";
import { Box } from "@xiayang/box";

const App: React.FunctionComponent = () => {
  return (<Box></Box>);
};

ReactDOM.render(<App />, document.getElementById("app"));

if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  module.hot != null && module.hot.accept();
}
