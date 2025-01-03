import { Outlet } from "react-router";
import { NavBar } from "~/components/NavBar";

const Layout = () => {
  return (
    <main className="h-screen w-screen bg-black text-white p-1">
      <div className="w-full h-full grid grid-rows-8 grid-cols-12 grid-flow-col gap-1">
        <div className="row-span-8 col-span-2 bg-granite-900">
          <NavBar />
        </div>
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
