import React from "react";

type Element<Props extends Object> = keyof JSX.IntrinsicElements | React.ComponentType<Props>
type ComponentStyleType = Object
type StyledElementProps<Props> = {}
type StyledElementState = {}
type StyledElementType<Props extends object> = React.ComponentClass<StyledElementProps<Props>, StyledElementState>

function styled<Props extends Object>(element: Element<Props>) {
  return function (...OwnStyle: ComponentStyleType[]): StyledElementType<Props> {
    class StyledElement extends React.PureComponent<StyledElementProps<Props>, StyledElementState> {

    }

    return StyledElement;
  };
}

export default styled;
