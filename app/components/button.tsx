import type { MouseEventHandler, ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  value?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconSize?: string;
};

export const Button = ({
  children,
  className,
  Icon,
  iconSize,
  onClick,
  value,
}: Props) => {
  return (
    <button
      type="button"
      value={value}
      onClick={onClick}
      className={`flex gap-3 py-1.5 px-3 hover:bg-bray-500/20 ${className}`}
    >
      {Icon && <Icon className={`size-4 ${iconSize}`} />}
      <span>{children}</span>
    </button>
  );
};
