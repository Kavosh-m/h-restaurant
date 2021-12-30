import {
  NUMBER_ITEM_CHANGE,
  USER_CLEAR_AN_ITEM,
  USER_CLEAR_ORDERS_ALL,
  USER_SHOPPING_CART,
  FOOD_SIZE_NUMBER_STATUS,
} from '../constants';

const initialState = {
  cart: [],
  item_status: [],
};

export const shoppingCart = (state = initialState, action) => {
  switch (action.type) {
    case USER_SHOPPING_CART:
      if (state.cart.length > 0) {
        const itemOfElemination = state.cart.filter(item => {
          // return item.name === action.cart.name;
          return (
            item.price / item.number === action.cart.price / action.cart.number
          );
        });
        if (itemOfElemination.length > 0) {
          const itemOfEleminationIndex = state.cart.indexOf(
            itemOfElemination[0],
          );
          state.cart.splice(itemOfEleminationIndex, 1);
        }
      }

      const SIZE =
        action.cart.price / action.cart.number === action.cart.singlePrice
          ? 'small'
          : action.cart.price / action.cart.number ===
            1.5 * action.cart.singlePrice
          ? 'medium'
          : 'large';

      return {
        ...state,
        cart: [...state.cart, {...action.cart, size: SIZE}],
      };

    case USER_CLEAR_ORDERS_ALL:
      return {
        ...state,
        cart: action.cart,
      };

    case USER_CLEAR_AN_ITEM:
      const name2 = action.cart[0];
      const size2 = action.cart[1];

      const itemOfElemination = state.cart.filter(
        item => item.name === name2 && item.size === size2,
      );
      const itemOfEleminationIndex = state.cart.indexOf(itemOfElemination[0]);
      state.cart.splice(itemOfEleminationIndex, 1);

      return {
        ...state,
        cart: [...state.cart],
      };

    case NUMBER_ITEM_CHANGE:
      const name = action.cart[0];
      const number = action.cart[1];
      const size = action.cart[2];

      const itemOfInterest = state.cart.filter(
        item => item.name === name && item.size === size,
      );
      const itemOfInterestIndex = state.cart.indexOf(itemOfInterest[0]);
      const oneUnitPrice =
        state.cart[itemOfInterestIndex].price /
        state.cart[itemOfInterestIndex].number;
      state.cart[itemOfInterestIndex].number = number;
      state.cart[itemOfInterestIndex].price = number * oneUnitPrice;

      return {
        ...state,
        cart: [...state.cart],
      };

    case FOOD_SIZE_NUMBER_STATUS:
      if (state.item_status.length > 0) {
        const itemOfElemination = state.item_status.filter(item => {
          return item.id === action.item_status.id;
        });
        if (itemOfElemination.length > 0) {
          const itemOfEleminationIndex = state.item_status.indexOf(
            itemOfElemination[0],
          );
          state.item_status.splice(itemOfEleminationIndex, 1);
        }
      }

      return {
        ...state,
        item_status: [...state.item_status, action.item_status],
      };

    default:
      return state;
  }
};
