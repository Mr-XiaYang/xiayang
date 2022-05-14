import { SheetStyle } from "./create_style_hook";

test("dev sheetStyle", () => {
  const style = new SheetStyle<any>({
    ".Box": {
      color: (data) => data.color,
      "&:hover": {
        background: "blue",
      },
      "&.clear": {
        clear: "both",
      },
      // Reference a global .button scoped to the container.
      "& .button": {
        background: "red",
      },
      // Use multiple container refs in one selector
      "&.selected, &.active": {
        border: "1px solid red",
      },
    },
  });
  console.log(style);
});
