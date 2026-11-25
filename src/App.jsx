import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Cart from "./components/Cart";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import { mockProducts, mockUser } from "./data/mockData";
import { setProducts, setUser } from "./store/store";

import "./App.css";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const productsTimer = setTimeout(
      () => dispatch(setProducts(mockProducts)),
      1000,
    );
    const userTimer = setTimeout(() => dispatch(setUser(mockUser)), 500);

    return () => {
      clearTimeout(productsTimer);
      clearTimeout(userTimer);
    };
  }, [dispatch]);

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <ProductList />
        <Cart />
      </div>
    </div>
  );
}
