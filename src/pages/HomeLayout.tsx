import { Outlet } from "react-router-dom";
import { Header, Navbar } from "../components";

export const HomeLayout = () => {
  return (
    <>
      <Header />

      <Navbar />

      <section className="align-element py-20">
        <Outlet />
      </section>
    </>
  );
};
