import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  useWindowDimensions,
  ImageBackground,
  ToastAndroid,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Shadow} from 'react-native-neomorph-shadows';
import {SkypeIndicator} from 'react-native-indicators';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

import {
  fontTypeBold,
  fontTypeRegular,
  resFontSize,
} from '../../constants/fonts';
import {login, loginPageBg} from '../../constants/images';

// import {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import LinearGradient from 'react-native-linear-gradient';
import LoginArrowDoorIcon from '../component/Home/LoginArrowDoorIcon';

GoogleSignin.configure({
  webClientId:
    '326941434701-d7c5julaaclmqooooq3cr41d7ubmsaeg.apps.googleusercontent.com',
});

const LoginPage = ({navigation}) => {
  const {width} = useWindowDimensions();

  const [phonenumber, setPhonenumber] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loading_signUp, setLoading_signUp] = useState(false);
  const [phonenumberFieldEmpty, setPhonenumberFieldEmpty] = useState(false);
  const [confirmationFieldEmpty, setConfirmationFieldEmpty] = useState(false);

  // const test = async () => {
  //   await AsyncStorage.removeItem('@viewedOnboarding');
  // };

  // useEffect(() => {
  //   test();
  // }, []);

  //Onboarding viewed or not

  const onGoogleButtonPress = async () => {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };

  const onFacebookButtonPress = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      console('User cancelled the login process');
      setLoadingFacebook(false);
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  };

  async function onSignIn() {
    setLoading_signUp(true);

    if (phonenumber.length === 10) {
      setPhonenumberFieldEmpty(false);
      try {
        //Check with firestore database weather user exist or not:
        firestore()
          .collection('users')
          .where('phonenumber', '==', phonenumber)
          .get()
          .then(async querySnapshot => {
            if (querySnapshot.empty) {
              setLoading_signUp(false);
              ToastAndroid.show('User does not exist!', ToastAndroid.LONG);
            } else {
              querySnapshot.forEach(async docSnap => {
                await AsyncStorage.setItem(
                  '@credentials',
                  `{"name":"${docSnap.data().name}","email":"${
                    docSnap.data().email
                  }","phonenumber":"${'+98 ' + docSnap.data().phonenumber}"}`,
                );

                if (docSnap.data().profilePicURL) {
                  console.log('profile pic exists');
                  // await AsyncStorage.setItem(
                  //   '@profilePic',
                  //   docSnap.data().profilePicURL,
                  // );
                } else {
                  await AsyncStorage.removeItem('@profilePic');
                }

                await AsyncStorage.setItem(
                  '@didProfilePicUploadedToServer',
                  'true',
                );
              });

              const confirmation = await auth().signInWithPhoneNumber(
                '+98' + phonenumber,
              );
              setConfirm(confirmation);
            }
          });
      } catch (error) {
        setLoading_signUp(false);
        console.log(error.message);
      }
    } else if (phonenumber.length === 0) {
      setLoading_signUp(false);
      setPhonenumberFieldEmpty(true);
      ToastAndroid.show('Phone number is required', ToastAndroid.LONG);
    } else {
      setLoading_signUp(false);
      setPhonenumberFieldEmpty(true);
      ToastAndroid.show('Phone number is not valid', ToastAndroid.LONG);
    }
  }

  async function confirmCode() {
    if (code.length !== 0) {
      setLoading(true);
      try {
        await confirm.confirm(code);
        setConfirm(null);
      } catch (error) {
        setLoading(false);
        setConfirmationFieldEmpty(false);
        ToastAndroid.show('Confirmation code is not valid!', ToastAndroid.LONG);
      }
    } else {
      setConfirmationFieldEmpty(true);
    }
  }

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  if (!confirm) {
    return (
      <ImageBackground
        source={loginPageBg}
        resizeMode="cover"
        style={styles.loginMainScreenContainer}>
        <View style={{flex: 1, backgroundColor: 'transparent'}}></View>
        <LinearGradient
          colors={['#F6F6F6', '#FFFFFF', '#FFFFFF']}
          locations={[0.1, 0.27, 1]}
          style={styles.loginFormContainer}>
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              width: responsiveWidth(19),
              height: responsiveWidth(19),
              borderRadius: responsiveWidth(19),
              borderWidth: responsiveWidth(1),
              borderColor: 'white',
              position: 'absolute',
              top: responsiveHeight(-3.5),
              backgroundColor: '#E8E8E8',
            }}>
            <View
              style={{
                width: responsiveWidth(7),
                height: responsiveWidth(7),
                borderRadius: responsiveWidth(7),
              }}>
              <LoginArrowDoorIcon />
            </View>
          </View>
          <Text style={styles.signinHeaderText}>Login</Text>
          {/* <TextInput
            style={[
              styles.textInput,
              {borderColor: phonenumberFieldEmpty ? 'red' : 'transparent'},
            ]}
            placeholder="Phone Number (e.g. 9806662255)"
            keyboardType="phone-pad"
            placeholderTextColor="#B0B0B0"
            value={phonenumber}
            onChangeText={text => setPhonenumber(text)}
          /> */}
          <View
            style={[
              styles.textInput,
              {borderColor: phonenumberFieldEmpty ? 'red' : 'transparent'},
            ]}>
            <FloatingLabelInput
              staticLabel
              keyboardType="phone-pad"
              hint="Phone (e.g. 9118998888)"
              hintTextColor="#B0B0B0"
              inputStyles={{
                fontFamily: fontTypeRegular,
                color: 'black',
                // fontSize: responsiveFontSize(1.4),
                fontSize: resFontSize.large,
              }}
              containerStyles={{
                backgroundColor: 'transparent',
                borderRadius: responsiveHeight(9),
                paddingLeft: responsiveWidth(3),
              }}
              value={phonenumber}
              onChangeText={text => setPhonenumber(text)}
            />
          </View>
          <Shadow
            style={{
              shadowOffset: {width: 6, height: 10},
              shadowOpacity: 0.1,
              shadowColor: '#00000010',
              shadowRadius: 5,
              height: responsiveHeight(9),
              width: responsiveWidth(83),
              marginVertical: responsiveHeight(4),
              borderRadius: responsiveHeight(9),
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'black',
            }}>
            <TouchableOpacity
              // style={styles.sendCodeButtonContainer}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: responsiveHeight(9),
                width: responsiveWidth(83),
                borderRadius: responsiveHeight(9),
                borderWidth: 2,
                borderColor: 'white',
              }}
              activeOpacity={0.6}
              onPress={() => onSignIn()}>
              {!loading_signUp ? (
                <Text style={styles.sendCodeButtonText}>Send Code</Text>
              ) : (
                <SkypeIndicator size={30} color="powderblue" />
              )}
            </TouchableOpacity>
          </Shadow>
          <View style={styles.newuserContainer}>
            <Text style={styles.newuserText}>
              I dont have account.
              <Text
                style={[styles.newuserText, {color: 'blue'}]}
                onPress={() => navigation.navigate('SignUp')}>
                {'  Sign up'}
              </Text>
            </Text>
          </View>
          <View
            style={{
              width,
              paddingHorizontal: responsiveWidth(8.5),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'absolute',
              bottom: responsiveHeight(3),
            }}>
            <TouchableOpacity
              style={{
                width: responsiveWidth(39),
                height: responsiveHeight(9),
                borderRadius: responsiveHeight(9),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#5C75FB',
              }}
              activeOpacity={0.6}
              onPress={() => {
                setLoadingFacebook(true);
                onFacebookButtonPress()
                  .then(async () => {
                    firestore()
                      .collection('users')
                      .doc(auth().currentUser.uid)
                      .set({
                        name: auth().currentUser.displayName,
                        email: auth().currentUser.email,
                        phonenumber: '',
                        profilePicURL: auth().currentUser.photoURL,
                      });

                    // await AsyncStorage.setItem(
                    //   '@profilePic',
                    //   auth().currentUser.photoURL,
                    // );

                    await AsyncStorage.setItem(
                      '@credentials',
                      `{"name":"${auth().currentUser.displayName}","email":"${
                        auth().currentUser.email
                      }","phonenumber":""}`,
                    );

                    setLoadingFacebook(false);
                  })
                  .catch(e => {
                    console.log('Error on facebook sign in ====> ', e);
                    setLoadingFacebook(false);
                  });
              }}>
              {loadingFacebook ? (
                <SkypeIndicator size={25} color="white" />
              ) : (
                <Text
                  style={{
                    // fontSize: responsiveFontSize(1.6),
                    fontSize: resFontSize.large,
                    color: 'white',
                    fontWeight: '700',
                  }}>
                  Facebook
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: responsiveWidth(39),
                height: responsiveHeight(9),
                borderRadius: responsiveHeight(9),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FF4E3F',
              }}
              activeOpacity={0.6}
              onPress={() => {
                setLoadingGoogle(true);
                onGoogleButtonPress()
                  .then(async () => {
                    // console.log('Signed in with Google!')

                    firestore()
                      .collection('users')
                      .doc(auth().currentUser.uid)
                      .set({
                        name: auth().currentUser.displayName,
                        email: auth().currentUser.email,
                        phonenumber: '',
                        profilePicURL: auth().currentUser.photoURL,
                      });

                    // await AsyncStorage.setItem(
                    //   '@profilePic',
                    //   auth().currentUser.photoURL,
                    // );

                    await AsyncStorage.setItem(
                      '@credentials',
                      `{"name":"${auth().currentUser.displayName}","email":"${
                        auth().currentUser.email
                      }","phonenumber":""}`,
                    );

                    setLoadingGoogle(false);
                  })
                  .catch(e => {
                    console.log('Error on google sign in ===>', e);
                    setLoadingGoogle(false);
                  });
              }}>
              {loadingGoogle ? (
                <SkypeIndicator size={25} color="white" />
              ) : (
                <Text
                  style={{
                    // fontSize: responsiveFontSize(1.6),
                    fontSize: resFontSize.large,
                    color: 'white',
                    fontWeight: '700',
                  }}>
                  Google
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      {/* <TextInput
        style={[
          styles.confirmTextInput,
          {borderColor: confirmationFieldEmpty ? 'red' : 'transparent'},
        ]}
        placeholder="Enter confirmation code..."
        placeholderTextColor="#B0B0B0"
        keyboardType="number-pad"
        value={code}
        onChangeText={txt => setCode(txt)}
      /> */}
      <FloatingLabelInput
        staticLabel
        keyboardType="number-pad"
        hint="Enter confirmation code..."
        hintTextColor="#B0B0B0"
        inputStyles={{
          fontFamily: fontTypeRegular,
          color: 'black',
          // fontSize: responsiveFontSize(1.4),
          fontSize: resFontSize.large,
        }}
        containerStyles={{
          height: responsiveHeight(9),
          backgroundColor: '#00000010',
          borderRadius: responsiveHeight(9),
          paddingLeft: responsiveWidth(3),
          marginHorizontal: responsiveWidth(17 / 2),
          borderWidth: 2,
          borderColor: confirmationFieldEmpty ? 'red' : 'transparent',
        }}
        value={code}
        onChangeText={txt => setCode(txt)}
      />
      <Shadow
        style={{
          shadowOffset: {width: 6, height: 10},
          shadowOpacity: 0.1,
          shadowColor: '#00000010',
          shadowRadius: 5,
          height: responsiveHeight(9),
          width: responsiveWidth(83),
          marginVertical: responsiveHeight(1.5),
          borderRadius: responsiveHeight(9),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
        }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: responsiveHeight(9),
            width: responsiveWidth(83),
            borderRadius: responsiveHeight(9),
            borderWidth: 2,
            borderColor: 'white',
          }}
          activeOpacity={0.6}
          onPress={() => confirmCode()}>
          {!loading ? (
            <Text style={styles.sendCodeButtonText}>Confirm</Text>
          ) : (
            <SkypeIndicator size={30} color="powderblue" />
          )}
        </TouchableOpacity>
      </Shadow>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  loginMainScreenContainer: {
    flex: 1,
    backgroundColor: '#B0B0B0',
  },

  loginFormContainer: {
    flex: 4,
    alignItems: 'center',
    borderTopLeftRadius: responsiveWidth(7),
    borderTopRightRadius: responsiveWidth(7),
    backgroundColor: 'white',
  },

  signinHeaderText: {
    fontFamily: fontTypeBold,
    // fontSize: responsiveFontSize(2.1),
    fontSize: resFontSize.veryLarge2,
    color: 'black',
    alignSelf: 'flex-start',
    marginLeft: responsiveWidth(8),
    marginTop: responsiveHeight(9.5),
    marginBottom: responsiveHeight(5),
  },

  textInput: {
    backgroundColor: '#00000010',
    height: responsiveHeight(9),
    width: responsiveWidth(83),
    marginTop: responsiveHeight(1.5),
    borderWidth: 2,
    borderRadius: responsiveHeight(9),
    alignItems: 'center',
    justifyContent: 'center',
    // padding: responsiveWidth(4),
  },

  sendCodeButtonContainer: {
    height: responsiveHeight(9),
    width: responsiveWidth(83),
    marginTop: responsiveHeight(2),
    borderRadius: responsiveHeight(9),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },

  sendCodeButtonText: {
    fontFamily: fontTypeBold,
    // fontSize: responsiveFontSize(1.8),
    fontSize: resFontSize.bigLarge,
    color: 'white',
  },

  confirmTextInput: {
    height: responsiveHeight(9),
    width: responsiveWidth(83),
    padding: responsiveWidth(4),
    borderWidth: 1,
    borderRadius: responsiveHeight(9),
    backgroundColor: '#00000009',
  },

  newuserContainer: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: responsiveWidth(17 / 2),
  },

  newuserText: {
    fontFamily: fontTypeRegular,
    // fontSize: responsiveFontSize(1.5),
    fontSize: resFontSize.large,
    color: '#B0B0B0',
  },
});
