declare global {
  interface SymbolConstructor {
    observable?: Symbol;
  }
}

export default function isObservable<T>(value: any): value is T {
  if (!value) return false;
  if (typeof Symbol.observable === "symbol" && typeof value[Symbol.observable] === "function") {
    return value === value[Symbol.observable]();
  }
  if (typeof value["@@observable"] === "function") {
    return value === value["@@observable"];
  }

  return false;
}
