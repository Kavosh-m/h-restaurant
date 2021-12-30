import { combineReducers } from "redux";
import {user} from './user';
import { food } from "./food";
import { shoppingCart } from "./shoppingCart";

const rootReducers = combineReducers({
    userState: user,
    foodState: food,
    shoppingCartState: shoppingCart
})

export default rootReducers;