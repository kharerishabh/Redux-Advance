import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const res = await fetch(
        "https://advance-redux-project-9eb3b-default-rtdb.firebaseio.com/cart.json"
      );
      if(!res.ok) {
        throw new Error('Could not fetch cart data')
      }
      const data = await res.json()
      return data
    };
    try{
        const cartData = await fetchData()
        dispatch(cartActions.replaceCart({
            items: cartData.items || [],
            totalQuantity: cartData.totalQuantity
        }))
    }catch(err){
        dispatch(
            uiActions.showNotification({
              status: "Error",
              title: "Error",
              message: "Fetching Cart Data failed",
            })
          );
    }
  };
};

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "Pending",
        title: "Sending..",
        message: "Sending cart data",
      })
    );
    const sendRequest = async () => {
      const res = await fetch(
        "https://advance-redux-project-9eb3b-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify({items: cart.items, totalQuantity: cart.totalQuantity}),
        }
      );
      if (!res.ok) {
        throw new Error("Sending Cart Data Failed.");
      }
    };
    try {
      await sendRequest();
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
          message: "Sending Cart Data failed",
        })
      );
    }
  };
};
