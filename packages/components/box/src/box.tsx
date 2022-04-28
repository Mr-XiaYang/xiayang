import css, { SystemStyleObject } from "@styled-system/css";
import { styled } from "@xiayang/styled";
import React, { ReactNode } from "react";
import {
  color, ColorProps, compose, display, DisplayProps, flexbox, FlexboxProps, space, SpaceProps, typography,
  TypographyProps,
} from "styled-system";


type StyledSystemProps = SpaceProps & DisplayProps & TypographyProps & ColorProps & FlexboxProps

export interface BoxProps extends StyledSystemProps {
  as?: keyof JSX.IntrinsicElements;
  css?: SystemStyleObject;
  className?: string;
  children?: ReactNode | ReactNode[];
}

const Box = styled<BoxProps>(
  function Box(props: Omit<BoxProps, keyof StyledSystemProps | "css">) {
    const {as: element = "div", className, children} = props;
    return React.createElement(element, {className}, children);
  },
)(
  {boxSizing: "border-box", margin: 0, minWidth: 0},
  props => css(props.css)(props.theme),
  compose(space, display, typography, color, flexbox),
);

export default Box;
