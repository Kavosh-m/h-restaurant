import {
  USER_DESCRIPTIVE_ADDRESS,
  GET_USER_POSITION,
  USER_ONBOARDING_VIEW_STATUS,
  USER_PROFILE_PIC,
  USER_STATE_CHANGE,
} from '../constants';

const initialState = {
  currentUser: null,
  viewedOnboarding: null,
  userAddress: null,
  userPosition: {latitude: 42, longitude: -42, positionExist: false, zoom: 1},
  profilePIC: null,
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.currentUser,
      };

    case USER_ONBOARDING_VIEW_STATUS:
      return {
        ...state,
        viewedOnboarding: action.viewedOnboarding,
      };

    case USER_DESCRIPTIVE_ADDRESS:
      return {
        ...state,
        userAddress: action.userAddress,
      };

    case GET_USER_POSITION:
      return {
        ...state,
        userPosition: {
          ...state.userPosition,
          latitude: action.userPosition[0],
          longitude: action.userPosition[1],
          zoom: 12,
          positionExist: true,
        },
      };

    case USER_PROFILE_PIC:
      return {
        ...state,
        profilePIC: action.profilePIC,
      };

    default:
      return state;
  }
};
