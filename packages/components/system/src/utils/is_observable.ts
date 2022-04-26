declare interface SymbolConstructor extends Symbol {
  observable?: Symbol;
}

function isObservable<T>(value: any): value is T {
  if (!value) return false;
  if (typeof Symbol.observable === "symbol" && typeof value[Symbol.observable] === "function") {
    return value === value[Symbol.observable]();
  }
  if (typeof value["@@observable"] === "function") {
    return value === value["@@observable"];
  }

  return false;
}
