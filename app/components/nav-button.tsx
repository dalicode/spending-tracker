export const NavButton = ({ value }: { value: string }) => {
  return (
    <button className="py-4 w-full font-medium text-left hover:bg-slate-700 text-white py-2 px-4">
      {value}
    </button>
  );
};
