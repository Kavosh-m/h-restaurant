import {
  GET_BURGER,
  GET_FOOD_ITEM_COMMENTS,
  GET_FOOD_TABLE,
  GET_PIZZA,
  GET_PASTA,
  GET_DRINK,
} from '../constants';

const initialState = {
  foodTable: null,
  burger: null,
  pizza: null,
  pasta: null,
  drink: null,
  comments: null,
};

export const food = (state = initialState, action) => {
  switch (action.type) {
    case GET_FOOD_TABLE:
      return {
        ...state,
        foodTable: action.foodTable,
      };

    case GET_BURGER:
      return {
        ...state,
        burger: action.burger,
      };

    case GET_PIZZA:
      return {
        ...state,
        pizza: action.pizza,
      };

    case GET_PASTA:
      return {
        ...state,
        pasta: action.pasta,
      };

    case GET_DRINK:
      return {
        ...state,
        drink: action.drink,
      };

    case GET_FOOD_ITEM_COMMENTS:
      return {
        ...state,
        comments: action.comments,
      };

    default:
      return state;
  }
};
