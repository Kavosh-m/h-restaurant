// In App.js in a new project
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// import OnBoardingPage from './src/screens/OnBoardingPage';
import OnBoardingScreen from './src/screens/OnBoardingScreen';

import MainPage from './src/screens/MainPage';
import RegisterScreen from './src/screens/RegisterScreen';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk'; //for using dispatch

import AsyncStorage from '@react-native-async-storage/async-storage';
import {View} from 'react-native';
import {SkypeIndicator} from 'react-native-indicators';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';

const store = createStore(rootReducer, applyMiddleware(thunk));

const Stack = createNativeStackNavigator();

const Loading = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <SkypeIndicator size={60} color="#000000" />
    </View>
  );
};

function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // OnBoarding, viewed or not?
  const [viewedOnboarding, setViewedOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sign Up, done or not
  const [didSignUp, setDidSignUp] = useState(false);

  // Profile pic uploaded to server or not
  const [didProfilePicUploadedToServer, setDidProfilePicUploadedToServer] =
    useState(null);

  const check_profile_pic_uploaded_to_server = async () => {
    const b = await AsyncStorage.getItem('@didProfilePicUploadedToServer');
    setDidProfilePicUploadedToServer(b);
  };

  useEffect(() => {
    check_profile_pic_uploaded_to_server();
  }, []);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    // console.log(user, '\n\n');
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const checkOnBoarding = async () => {
    try {
      const value = await AsyncStorage.getItem('@viewedOnboarding');

      if (value === 'true') {
        // console.log('async key', value);
        setViewedOnboarding(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      // console.log('@checkOnboarding: ', err);
    }
  };

  const checkSignUp = async () => {
    try {
      const value = await AsyncStorage.getItem('@DidSignUp');

      if (value !== null) {
        setDidSignUp(true);
      }
    } catch (err) {
      // console.log('@checkOnboarding: ', err);
    }
  };

  useEffect(() => {
    checkOnBoarding();
  }, [auth().currentUser]);

  useEffect(() => {
    checkSignUp();
  }, []);

  useEffect(() => {
    setTimeout(() => SplashScreen.hide(), 2000);
  }, []);

  if (!user && !viewedOnboarding) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {loading ? (
            <Stack.Screen name="Loading" component={Loading} />
          ) : (
            <>
              <Stack.Screen
                name="OnBoardingScreen"
                component={OnBoardingScreen}
              />
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
        <FlashMessage position="top" />
      </NavigationContainer>
    );
  } else if (!user && viewedOnboarding) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {loading ? (
            <Stack.Screen name="Loading" component={Loading} />
          ) : (
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          )}
        </Stack.Navigator>
        <FlashMessage position="top" />
      </NavigationContainer>
    );
  } else {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="MainPage" component={MainPage} />
          </Stack.Navigator>
        </NavigationContainer>

        <FlashMessage position="top" />
      </Provider>
    );
  }
}

export default App;
