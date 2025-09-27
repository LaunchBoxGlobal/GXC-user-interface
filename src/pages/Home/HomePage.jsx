import { useEffect } from "react";
import CommunityList from "./CommunityList";
import ProductList from "./ProductList";

const HomePage = () => {
  useEffect(() => {
    document.title = "Home - GiveXChange";
  }, []);
  return (
    <main className="w-full py-20 text-center padding-x">
      <ProductList />
    </main>
  );
};

export default HomePage;
