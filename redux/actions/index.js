import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  USER_STATE_CHANGE,
  GET_FOOD_TABLE,
  GET_BURGER,
  GET_PIZZA,
  GET_PASTA,
  GET_DRINK,
  USER_SHOPPING_CART,
  USER_CLEAR_ORDERS_ALL,
  USER_CLEAR_AN_ITEM,
  USER_ONBOARDING_VIEW_STATUS,
  USER_DESCRIPTIVE_ADDRESS,
  USER_PROFILE_PIC,
  GET_FOOD_ITEM_COMMENTS,
  NUMBER_ITEM_CHANGE,
  FOOD_SIZE_NUMBER_STATUS,
} from '../constants';

export function fetchUser() {
  return dispatch => {
    firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          // console.log(snapshot.data())
          dispatch({
            type: USER_STATE_CHANGE,
            currentUser: snapshot.data(),
          });
        } else {
          // console.log('does not exist!!!!');
        }
      });
  };
}

export function fetchFood() {
  return dispatch => {
    firestore()
      .collection('foods')
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          // console.log(querySnapshot.docs.map(item => item._data))
          dispatch({
            type: GET_FOOD_TABLE,
            foodTable: querySnapshot.docs.map(item => item._data),
          });
        } else {
          // console.log('does not exist!!!!');
        }
      });
  };
}

export function fetchBurgers() {
  return dispatch => {
    firestore()
      .collection('foods')
      .doc('burger')
      .collection('items')
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const burgerIDs = [];
          querySnapshot.forEach(docsnap => burgerIDs.push(docsnap.id));
          // console.log(burgerIDs)
          const burger = querySnapshot.docs.map((item, index) => {
            return {
              ...item._data,
              id: burgerIDs[index],
            };
          });

          // console.log('fetch burgers from firestore ==> ', burger);

          dispatch({
            type: GET_BURGER,
            burger: burger,
          });
        }
      });
  };
}

export function fetchPizzas() {
  return dispatch => {
    firestore()
      .collection('foods')
      .doc('pizza')
      .collection('items')
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const pizzaIDs = [];
          querySnapshot.forEach(docsnap => pizzaIDs.push(docsnap.id));
          // console.log(pizzaIDs)
          const pizza = querySnapshot.docs.map((item, index) => {
            return {
              ...item._data,
              id: pizzaIDs[index],
            };
          });

          // console.log(pizza);

          dispatch({
            type: GET_PIZZA,
            pizza: pizza,
          });
        }
      });
  };
}

export function fetchPastas() {
  return dispatch => {
    firestore()
      .collection('foods')
      .doc('pasta')
      .collection('items')
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const pastaIDs = [];
          querySnapshot.forEach(docsnap => pastaIDs.push(docsnap.id));
          // console.log(pizzaIDs)
          const pasta = querySnapshot.docs.map((item, index) => {
            return {
              ...item._data,
              id: pastaIDs[index],
            };
          });

          // console.log('pasta action', pasta);

          dispatch({
            type: GET_PASTA,
            pasta: pasta,
          });
        }
      });
  };
}

export function fetchDrinks() {
  return dispatch => {
    firestore()
      .collection('foods')
      .doc('drink')
      .collection('items')
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const drinkIDs = [];
          querySnapshot.forEach(docsnap => drinkIDs.push(docsnap.id));
          // console.log(pizzaIDs)
          const drink = querySnapshot.docs.map((item, index) => {
            return {
              ...item._data,
              id: drinkIDs[index],
            };
          });

          // console.log('drink action', drink);

          dispatch({
            type: GET_DRINK,
            drink: drink,
          });
        }
      });
  };
}

// Get food detail from FoodDetail screen and add it to shoppingCartState in redux store
export function getFoodDetail(infoObject) {
  return dispatch => {
    dispatch({
      type: USER_SHOPPING_CART,
      cart: infoObject,
    });
  };
}

export function change_number_of_item_in_cart(name, number, size) {
  return dispatch => {
    dispatch({
      type: NUMBER_ITEM_CHANGE,
      cart: [name, number, size],
    });
  };
}

export function clear_all_of_orders() {
  return dispatch => {
    dispatch({
      type: USER_CLEAR_ORDERS_ALL,
      cart: [],
    });
  };
}

export function clear_an_item_of_orders(name, size) {
  return dispatch => {
    dispatch({
      type: USER_CLEAR_AN_ITEM,
      cart: [name, size],
    });
  };
}

export function get_item_temp_status(status) {
  return dispatch => {
    dispatch({
      type: FOOD_SIZE_NUMBER_STATUS,
      item_status: status,
    });
  };
}

// Get value from async storage to determine onboarding view status
export function check_onboarding_view_status() {
  return async dispatch => {
    const value = await AsyncStorage.getItem('@viewedOnboarding');

    dispatch({
      type: USER_ONBOARDING_VIEW_STATUS,
      viewedOnboarding: value,
    });
  };
}

//Get user descriptive address (reverse geocoding)
export function fetch_user_address(address) {
  return dispatch => {
    dispatch({
      type: USER_DESCRIPTIVE_ADDRESS,
      userAddress: address,
    });
  };
}

// Fetch user profile picture
export function fetch_user_profile_pic() {
  return async dispatch => {
    const picURL = await AsyncStorage.getItem('@profilePic');

    dispatch({
      type: USER_PROFILE_PIC,
      profilePIC: picURL,
    });
  };
}

// Fetch comments of a food item
export function fetch_comments(foodType, identification) {
  return dispatch => {
    let comments = [];

    firestore()
      .collection('foods')
      .doc(foodType)
      .collection('items')
      .doc(identification)
      .collection('comments')
      .get()
      .then(querySnapshot => {
        // console.log('Total comments: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          firestore()
            .collection('users')
            .doc(documentSnapshot.id)
            .get()
            .then(document => {
              // let comments = [];
              comments.push({
                customerId: documentSnapshot.id,
                customerName: document.data().name,
                customerComment: documentSnapshot.data().commentString,
              });
              // console.log('all comments for this food ====> ', comments)
            });
          // console.log('User ID: ', documentSnapshot.id, documentSnapshot.data().commentString);
        });
      });

    dispatch({
      type: GET_FOOD_ITEM_COMMENTS,
      comments: comments,
    });
  };
}
