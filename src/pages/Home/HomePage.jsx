import { useEffect } from "react";
import CommunityList from "./CommunityList";
import ProductList from "./ProductList";
import { useAppContext } from "../../context/AppContext";

const HomePage = () => {
  const { communities } = useAppContext();

  useEffect(() => {
    document.title = "Home - GiveXChange";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="w-full py-20 text-center padding-x">
      {communities && communities?.length > 0 ? (
        <ProductList />
      ) : (
        <div className="w-full min-h-screen">
          No have not joined any community yet.
        </div>
      )}
    </main>
  );
};

export default HomePage;
