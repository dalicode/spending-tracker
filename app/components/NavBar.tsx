import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import { Button } from "./Button";
import { NavButton } from "./NavButton";
import { CalendarDateRangeIcon } from "@heroicons/react/16/solid";
import { redirect, useNavigate } from "react-router";

const navMenus = ["Overview", "Spending", "Summary"];
const navRoutes = ["/", "spending", "summary"];

export const NavBar = () => {
  const navigate = useNavigate();
  const [selectedNav, setSelectedNav] = useState("");

  const onClickHandler = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const selected = (e.currentTarget as HTMLInputElement).value;
      if (selectedNav !== selected) {
        navigate(selected);
        setSelectedNav(selected);
      }
    },
    [navigate, setSelectedNav, selectedNav]
  );

  return (
    <div className="h-full grid grid-rows-8">
      <div className="row-span-1">{}</div>
      <div className="row-span-7 text-sm">
        {navMenus.map((m, index) => (
          <Button
            key={index}
            Icon={CalendarDateRangeIcon}
            iconSize="size-6"
            value={navRoutes[index]}
            onClick={onClickHandler}
            className="w-full text-left py-4"
          >
            {m}
          </Button>
        ))}
      </div>
    </div>
  );
};
