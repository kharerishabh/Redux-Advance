import { useSelector, useDispatch } from "react-redux";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { Fragment, useEffect } from "react";
import { uiActions } from "./store/ui-slice";
import Notification from "./components/UI/Notification";

let isInitial = true;
function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);
  const dispatch = useDispatch();

  useEffect(() => {
    const sentCartData = async () => {
      dispatch(
        uiActions.showNotification({
          status: "Pending",
          title: "Sending..",
          message: "Sending cart data",
        })
      );
      try {
        const res = await fetch(
          "https://advance-redux-project-9eb3b-default-rtdb.firebaseio.com/cart.json",
          {
            method: "PUT",
            body: JSON.stringify(cart),
          }
        );
        if (!res.ok) {
          throw new Error("Sending Cart Data Failed.");
        }
        dispatch(
          uiActions.showNotification({
            status: "Success",
            title: "Success",
            message: "Sent cart data successfully",
          })
        );
      } catch (err) {
        dispatch(
          uiActions.showNotification({
            status: "Error",
            title: "Error",
            message: 'Sending Cart Data failed',
          })
        );
      }
    };
    if(isInitial){
      isInitial = false;
      return;
    }
    sentCartData();
  }, [cart, dispatch]);
  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
