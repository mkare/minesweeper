import clsx from "clsx";

export const Button = ({ variant, size, className, children, ...props }) => {
  const baseClasses =
    "mb-4 rounded-lg bg-slate-800 px-4 py-2 font-semibold text-slate-100 shadow-lg hover:bg-gray-300 hover:text-slate-800";
  const variantClasses =
    variant === "primary"
      ? "bg-slate-800 text-slate-100"
      : "bg-gray-200 text-gray-700";

  const classes = clsx(baseClasses, variantClasses, className);

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
