import css, { get, SystemStyleObject } from "@styled-system/css";
import { styled } from "@xiayang/styled";
import React, { createElement, ComponentType, FunctionComponent, ReactNode, forwardRef, Ref } from "react";
import {
  compose, color, ColorProps, flexbox, FlexboxProps, space, SpaceProps, typography,
  TypographyProps, layout, LayoutProps, border, BorderProps, position, PositionProps
} from "styled-system";
import shouldForwardProp from '@styled-system/should-forward-prop'

type StyledProps = SpaceProps & TypographyProps & ColorProps & FlexboxProps & LayoutProps & BorderProps & PositionProps & {
  sx?: SystemStyleObject;
}

export interface BoxProps extends StyledProps {
  ref?: Ref<HTMLElement>
  as?: keyof JSX.IntrinsicElements | ComponentType<any>;
  className?: string;
  children?: ReactNode | ReactNode[];
}

const InnerBox = forwardRef<HTMLElement, Omit<BoxProps, keyof StyledProps | 'ref'>>((props, ref) => {
  const { as: element = "div", className, children } = props;
  return createElement(element, { ref, className }, children);
})

const Box = styled<BoxProps>(InnerBox, { tagName: "Box", shouldForwardProp })(
  { boxSizing: "border-box", margin: 0, minWidth: 0 },
  props => props.theme ? css(get(props.theme, "components.Box"))(props.theme) : null,
  props => props.theme ? css(props.sx)(props.theme) : null,
  compose(space, typography, color, flexbox, layout, border, position),
);

export default Box;
