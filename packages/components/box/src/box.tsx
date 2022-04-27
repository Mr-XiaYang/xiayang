import React, { PropsWithChildren } from "react";

// import css, { get } from "@styled-system/css";
// import shouldForwardProp from "@styled-system/should-forward-prop";
// import { useJss, useTheme } from "@xiayang/system";
import {
  compose,
  space,
  SpaceProps,
  display, DisplayProps, typography, TypographyProps, color, ColorProps, flexbox,
  FlexboxProps,
} from "styled-system";

// styled("div", {shouldForwardProp})(
//   props => css(props.sx)(props.system),
//   props => css(get(props.system, `components.${props.variant}`, get(props.system, props.variant)))(props.system),
//   compose(space, display, typography, color, flexbox),
// )

const Root = React.createElement("div");

interface BoxProps extends SpaceProps, DisplayProps, TypographyProps, ColorProps, FlexboxProps {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

const Box: React.FunctionComponent = React.forwardRef<HTMLElement, BoxProps>((props, ref) => {
  const {as = "div", className} = props;
  // const theme = useTheme();
  const Root = React.useCallback<React.FunctionComponent<React.PropsWithRef<PropsWithChildren<any>>>>((props) => React.createElement(as, props), [as]);

  console.log(compose(space, display, typography, color, flexbox)(props));
  return (
    <Root ref={ref}>

    </Root>
  );
});


export default Box;
