import { useJss } from "@xiayang/styled";
import React, { Fragment, FunctionComponent, ReactNode } from "react";

export interface CSSBaselineProps {
  children?: ReactNode | ReactNode[];
}

const CSSBaseline: FunctionComponent<CSSBaselineProps> = ({children}) => {
  const jss = useJss();
  return (
    <Fragment>
      {children}
    </Fragment>
  );
};

export default CSSBaseline;
