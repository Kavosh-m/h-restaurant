import { USER_DESCRIPTIVE_ADDRESS, USER_ONBOARDING_VIEW_STATUS, USER_PROFILE_PIC, USER_STATE_CHANGE } from "../constants"

const initialState = {
    currentUser: null,
    viewedOnboarding: null,
    userAddress: null,
    profilePIC: null
}


export const user = (state=initialState, action) => {

    switch(action.type) {

        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        
        case USER_ONBOARDING_VIEW_STATUS:
            return {
                ...state,
                viewedOnboarding: action.viewedOnboarding
            }
        
        case USER_DESCRIPTIVE_ADDRESS:
            return {
                ...state,
                userAddress: action.userAddress
            }
        
        case USER_PROFILE_PIC:
            return {
                ...state,
                profilePIC: action.profilePIC
            }
        
        default:
            return state
    }
}