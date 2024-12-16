import type { MouseEventHandler, ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  value?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const Button = ({
  children,
  className,
  Icon,
  onClick,
  value,
}: Props) => {
  return (
    <button
      type="button"
      value={value}
      onClick={onClick}
      className={`hover:bg-slate-700 text-white py-1 px-2 ${className}`}
    >
      {Icon && <Icon className="size-5 inline-block align-bottom" />}
      <span className={children ? `ml-2` : ""}>{children}</span>
    </button>
  );
};
