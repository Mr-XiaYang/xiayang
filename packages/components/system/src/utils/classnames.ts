type ClassName = ArrayLike<string | number> | Record<string, boolean> | string | number


function classnames(...names: ClassName[]): string {
  const classes: Array<string | number> = [];

  for (const name of names) {
    if (!name) continue;
    const nameType = typeof name;
    if (nameType === "string" || nameType === "number") {
      classes.push(name.toString());
    } else if (Array.isArray(name)) {
      if (name.length > 0) {
        classes.push(classnames(...name));
      }
    } else if (name.toString === Object.prototype.toString) {
      for (const [key, bool] of Object.entries(name)) {
        bool && classes.push(key);
      }
    } else {
      classes.push(name.toString());
    }
  }

  return classes.join(" ");
}

export default classnames;
