import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addToCart, selectIsCheckingOut } from "../store/cartSlice";
import { selectLoading, selectProducts } from "../store/store";

const productComparators = {
  name: (first, second) => first.name.localeCompare(second.name),
  price: (first, second) => first.price - second.price,
};

export default function ProductList() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading);
  const isCheckingOut = useSelector(selectIsCheckingOut);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);

  if (loading) {
    return <div className="loading">Загрузка товаров...</div>;
  }

  const searchQuery = searchTerm.toLowerCase();
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  filteredProducts.sort(productComparators[sortBy]);

  return (
    <div className="product-list">
      <div className="filters">
        <div className="search">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="filter-controls">
          {showFilters && (
            <>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option value="all">Все категории</option>
                <option value="phones">Телефоны</option>
                <option value="laptops">Ноутбуки</option>
                <option value="tablets">Планшеты</option>
              </select>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="name">По названию</option>
                <option value="price">По цене</option>
              </select>
            </>
          )}

          <button onClick={() => setShowFilters((isShown) => !isShown)}>
            {showFilters ? "Скрыть фильтры" : "Показать фильтры"}
          </button>
        </div>
      </div>

      <div className="products">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="price">${product.price}</div>
            <button
              disabled={isCheckingOut}
              onClick={() => dispatch(addToCart(product))}
            >
              Добавить в корзину
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
