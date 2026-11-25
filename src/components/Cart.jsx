import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  cancelCheckout,
  completeCheckout,
  removeFromCart,
  selectCart,
  selectCartSummary,
  selectIsCheckingOut,
  startCheckout,
  updateQuantity,
} from "../store/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const { cartCount, totalPrice } = useSelector(selectCartSummary);
  const isCheckingOut = useSelector(selectIsCheckingOut);

  const [isOpen, setIsOpen] = useState(false);
  const checkoutTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (checkoutTimer.current !== null) {
        clearTimeout(checkoutTimer.current);
        checkoutTimer.current = null;
        dispatch(cancelCheckout());
      }
    };
  }, [dispatch]);

  const handleCheckout = () => {
    if (cart.length === 0 || isCheckingOut || checkoutTimer.current !== null) {
      return;
    }

    dispatch(startCheckout());
    checkoutTimer.current = setTimeout(() => {
      alert("Заказ оформлен!");
      checkoutTimer.current = null;
      dispatch(completeCheckout());
      setIsOpen(false);
    }, 1000);
  };

  return (
    <div className="cart">
      <button
        className="cart-toggle"
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        Корзина ({cartCount})
      </button>

      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-header">
            <h3>Корзина</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <p>Корзина пуста</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>${item.price}</p>
                    <div className="quantity-controls">
                      <button
                        disabled={isCheckingOut}
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity - 1,
                            }),
                          )
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        disabled={isCheckingOut}
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: item.quantity + 1,
                            }),
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-btn"
                    disabled={isCheckingOut}
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Удалить
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cart-footer">
            <div className="total">Итого: ${totalPrice}</div>
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={cart.length === 0 || isCheckingOut}
            >
              {isCheckingOut ? "Оформляем..." : "Оформить заказ"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
