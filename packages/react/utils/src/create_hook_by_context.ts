import React from "react";

function createHookByContext<T>(context: React.Context<T>, name: string) {
  return function hook(): T {
    const value = React.useContext(context);
    if (value == null) {
      throw new Error(`Please use \`${name}\` hook only with the provider.`);
    }
    return value;
  };
}

export default createHookByContext;
