import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ToastAndroid,
} from 'react-native';
import {Shadow} from 'react-native-neomorph-shadows';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {launchImageLibrary} from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {
  fontTypeBold,
  fontTypeRegular,
  resFontSize,
} from '../../constants/fonts';

import {signupPageBg} from '../../constants/images';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SkypeIndicator} from 'react-native-indicators';
// Sign Up component

const SignUp = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  // console.log(phonenumber);
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading_signUp, setLoading_signUp] = useState(false);
  const [nameFieldEmpty, setNameFieldEmpty] = useState(false);
  const [phonenumberFieldEmpty, setPhonenumberFieldEmpty] = useState(false);
  const [confirmationFieldEmpty, setConfirmationFieldEmpty] = useState(false);
  const [uploadedToStorage, setUploadedToStorage] = useState(false);

  //Image picker
  const [selectedPictureUri, setSelectedPictureUri] = useState(null);
  const [picProfileUrl, setPickProfileUrl] = useState(null); //Pic profile uri after resizing the selected image
  // const [picProfileName, setPickProfileName] = useState(null);

  const options = {
    title: 'Select picture...',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const handleProfilePick = () => {
    launchImageLibrary(options, response => {
      try {
        setSelectedPictureUri(response.assets[0].uri);
      } catch {
        console.log('user cancel picking');
      }
    });
  };
  //End of Image picker

  useEffect(() => {
    //Resize Image here:
    let newWidth = 500;
    let newHeight = 500;
    let compressFormat = 'PNG';
    let quality = 100; //min:0 , max:100
    let rotation = 0;
    let outputPath = null;
    let imageUri = selectedPictureUri;

    if (imageUri) {
      // console.log(typeof imageUri);
      ImageResizer.createResizedImage(
        imageUri,
        newWidth,
        newHeight,
        compressFormat,
        quality,
        rotation,
        outputPath,
      )
        .then(async response => {
          // response.uri is the URI of the new image that can now be displayed, uploaded...
          //resized image uri
          let uri = response.uri;
          //generating image name
          // let imageName = 'profile' + this.state.userId;
          //to resolve file path issue on different platforms
          let uploadUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
          //setting the image name and image uri in the state
          setPickProfileUrl(uploadUri);
          await AsyncStorage.setItem('@profilePic', uploadUri);
        })
        .catch(err => {
          console.log('image resizing error => ', err);
        });
    }

    //End of Resizing image
  }, [selectedPictureUri]);

  async function onSignUp() {
    setLoading_signUp(true);

    if (phonenumber.length === 10 && name.length !== 0) {
      setNameFieldEmpty(false);
      setPhonenumberFieldEmpty(false);
      try {
        //Check with firestore database weather user exist or not:
        firestore()
          .collection('users')
          .where('phonenumber', '==', phonenumber)
          .get()
          .then(async querySnapshot => {
            if (!querySnapshot.empty) {
              setLoading_signUp(false);
              ToastAndroid.show('User already exists!', ToastAndroid.LONG);
            } else {
              const confirmation = await auth().signInWithPhoneNumber(
                '+98' + phonenumber,
              );
              setConfirm(confirmation);
              await AsyncStorage.setItem(
                '@credentials',
                `{"name":"${name}","email":"${email}","phonenumber":"${
                  '+98 ' + phonenumber
                }"}`,
              );
              setTimeout(async () => {
                if (auth().currentUser) {
                  firestore()
                    .collection('users')
                    .doc(auth().currentUser.uid)
                    .set({
                      name,
                      email,
                      phonenumber,
                    });

                  //Upload resized image to firebase storage
                  // if (picProfileUrl) {
                  //   setUploadedToStorage(true);
                  //   const task = storage().ref(
                  //     `UsersProfilePics/${
                  //       auth().currentUser.uid
                  //     }/profile_pic.png`,
                  //   );
                  //   await task.putFile(picProfileUrl);

                  //   //Generate a download url for uploaded image
                  //   const downloadURL = await task.getDownloadURL();
                  //   await AsyncStorage.setItem('@profilePic', downloadURL);

                  //   //Add a pic field in current user document in users firestore
                  //   firestore()
                  //     .collection('users')
                  //     .doc(auth().currentUser.uid)
                  //     .update({
                  //       profilePicURL: downloadURL,
                  //     });
                  //   setUploadedToStorage(false);
                  //   await AsyncStorage.setItem(
                  //     '@didProfilePicUploadedToServer',
                  //     'true',
                  //   );
                  // } else {
                  //   await AsyncStorage.removeItem('@profilePic');
                  //   firestore()
                  //     .collection('users')
                  //     .doc(auth().currentUser.uid)
                  //     .update({
                  //       profilePicURL: '',
                  //     });
                  //   await AsyncStorage.setItem(
                  //     '@didProfilePicUploadedToServer',
                  //     'true',
                  //   );
                  // }
                }
              }, 7000);
            }
          });
      } catch (error) {
        setLoading_signUp(false);
        console.log(error.message);
      }
    } else if (phonenumber.length === 10 && name.length === 0) {
      setLoading_signUp(false);
      setNameFieldEmpty(true);
      setPhonenumberFieldEmpty(false);
      ToastAndroid.show('Name is required', ToastAndroid.LONG);
      // showMessage({
      //   message: 'Enter a name',
      //   type: 'info',
      //   icon: 'info',
      //   backgroundColor: 'black',
      //   color: 'white',
      //   duration: 4000,
      // });
    } else if (phonenumber.length === 0 && name.length === 0) {
      setLoading_signUp(false);
      setNameFieldEmpty(true);
      setPhonenumberFieldEmpty(true);
      ToastAndroid.show('Name and Phone are required', ToastAndroid.LONG);
      // showMessage({
      //   message: 'Required fields must not be empty',
      //   type: 'info',
      //   icon: 'info',
      //   backgroundColor: 'black',
      //   color: 'white',
      //   duration: 4000,
      // });
    } else if (0 < phonenumber.length < 10 && name.length === 0) {
      setLoading_signUp(false);
      setNameFieldEmpty(true);
      setPhonenumberFieldEmpty(true);
      ToastAndroid.show(
        'Name field is required\nPhone number is not valid!',
        ToastAndroid.LONG,
      );
      // showMessage({
      //   message: `Invalid Phone number\nEnter a name`,
      //   type: 'info',
      //   icon: 'info',
      //   backgroundColor: 'black',
      //   color: 'white',
      //   duration: 3000,
      // });
    } else if (phonenumber.length === 0 && name.length !== 0) {
      setNameFieldEmpty(false);
      setLoading_signUp(false);
      setPhonenumberFieldEmpty(true);
      ToastAndroid.show('Phone number is required', ToastAndroid.LONG);
      // showMessage({
      //   message: 'Enter a valid phone number',
      //   type: 'info',
      //   icon: 'info',
      //   backgroundColor: 'black',
      //   color: 'white',
      //   duration: 3000,
      // });
    } else if (0 < phonenumber.length < 10 && name.length !== 0) {
      setNameFieldEmpty(false);
      setLoading_signUp(false);
      setPhonenumberFieldEmpty(true);
      ToastAndroid.show('Phone number is not valid', ToastAndroid.LONG);
      // showMessage({
      //   message: 'Invalid Phone number',
      //   type: 'info',
      //   icon: 'info',
      //   backgroundColor: 'black',
      //   color: 'white',
      //   duration: 3000,
      // });
    }
    // else {
    //   setLoading_signUp(false);
    //   setNameFieldEmpty(true);
    //   setPhonenumberFieldEmpty(false);
    // }
  }

  async function confirmCode() {
    if (code.length === 0) {
      setConfirmationFieldEmpty(true);
    } else {
      setLoading(true);
      setConfirmationFieldEmpty(false);
      try {
        await confirm.confirm(code);
        setConfirm(null);
        await AsyncStorage.setItem('@DidSignUp', 'true');
        await AsyncStorage.setItem(
          '@credentials',
          `{"name":"${name}","email":"${email}","phonenumber":"${
            '+98 ' + phonenumber
          }"}`,
        );

        firestore().collection('users').doc(auth().currentUser.uid).set({
          name,
          email,
          phonenumber,
        });

        //Upload resized image to firebase storage
        // if (picProfileUrl) {
        //   setUploadedToStorage(true);
        //   const task = storage().ref(
        //     `UsersProfilePics/${auth().currentUser.uid}/profile_pic.png`,
        //   );
        //   await task.putFile(picProfileUrl);
        //   // .on('state_changed', taskSnap => {
        //   //   console.log(`${taskSnap.bytesTransferred}/${taskSnap.totalBytes}`)
        //   // })
        //   //Generate a download url for uploaded image
        //   const downloadURL = await task.getDownloadURL();
        //   await AsyncStorage.setItem('@profilePic', downloadURL);
        //   //Add a pic field in current user document in users firestore
        //   firestore().collection('users').doc(auth().currentUser.uid).update({
        //     profilePicURL: downloadURL,
        //   });
        //   setUploadedToStorage(false);
        //   await AsyncStorage.setItem('@didProfilePicUploadedToServer', 'true');
        // } else {
        //   await AsyncStorage.removeItem('@profilePic');
        //   firestore().collection('users').doc(auth().currentUser.uid).update({
        //     profilePicURL: '',
        //   });
        //   await AsyncStorage.setItem('@didProfilePicUploadedToServer', 'true');
        // }
      } catch (error) {
        setLoading(false);
        ToastAndroid.show('Confirmation code is not valid!', ToastAndroid.LONG);
      }
    }
  }

  if (!confirm) {
    return (
      <ImageBackground
        source={signupPageBg}
        resizeMode="cover"
        style={styles.signupMainContainerScreen}
        // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}></View>
        <LinearGradient
          colors={['#F6F6F6', '#FFFFFF', '#FFFFFF']}
          locations={[0.1, 0.27, 1]}
          style={styles.signupFormMainContainer}>
          {/* {image} */}
          <View style={styles.profilePicContainer}>
            {picProfileUrl && (
              <Image
                source={{uri: `${picProfileUrl}`}}
                resizeMode="cover"
                style={styles.profilePic}
              />
            )}
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.profilePicAddButtonContainer}
              onPress={() => handleProfilePick()}>
              <MaterialCommunityIcons
                name="camera"
                size={responsiveHeight(5 / 2)}
                color="#000000"
              />
            </TouchableOpacity>
          </View>
          {/* {image end} */}

          <Text style={styles.signupHeaderText}>Sign up</Text>
          {/* <TextInput
            style={[
              styles.textInput,
              {borderColor: nameFieldEmpty ? 'red' : 'transparent'},
            ]}
            placeholder="Name"
            placeholderTextColor="#B0B0B0"
            value={name}
            onChangeText={text => setName(text)}
          /> */}
          <View
            style={[
              styles.textInput,
              {borderColor: nameFieldEmpty ? 'red' : 'transparent'},
            ]}>
            <FloatingLabelInput
              staticLabel
              hint="Name"
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
              value={name}
              onChangeText={text => setName(text)}
            />
          </View>
          {/* <TextInput
            style={[styles.textInput, {borderColor: 'transparent'}]}
            placeholder="Email"
            placeholderTextColor="#B0B0B0"
            keyboardType="email-address"
            value={email}
            onChangeText={text => setEmail(text)}
          /> */}
          <View style={[styles.textInput, {borderColor: 'transparent'}]}>
            <FloatingLabelInput
              staticLabel
              keyboardType="email-address"
              hint="Email"
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
              value={email}
              onChangeText={text => setEmail(text)}
            />
          </View>
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
              onPress={() => onSignUp()}>
              {!loading_signUp ? (
                <Text style={styles.sendCodeButtonText}>Send Code</Text>
              ) : (
                <SkypeIndicator size={30} color="powderblue" />
              )}
            </TouchableOpacity>
          </Shadow>
          <View style={styles.newuserContainer}>
            <Text style={styles.newuserText}>
              I have account.
              <Text
                style={[styles.newuserText, {color: 'blue'}]}
                onPress={() => navigation.navigate('LoginPage')}>
                {'  Log In'}
              </Text>
            </Text>
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

export default SignUp;

const styles = StyleSheet.create({
  signupMainContainerScreen: {
    flex: 1,
    backgroundColor: '#B0B0B0',
  },

  signupFormMainContainer: {
    flex: 4,
    alignItems: 'center',
    borderTopLeftRadius: responsiveWidth(7),
    borderTopRightRadius: responsiveWidth(7),
  },

  profilePicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(30),
    borderWidth: 3,
    borderColor: 'white',
    position: 'absolute',
    top: responsiveWidth(-30 / 2),
    backgroundColor: '#E8E8E8',
    transform: [{rotate: '45deg'}],
  },

  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveWidth(15),
    transform: [{rotate: '-45deg'}],
  },

  profilePicAddButtonContainer: {
    width: responsiveHeight(5),
    height: responsiveHeight(5),
    borderRadius: responsiveHeight(5),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    right: responsiveHeight(-5 / 2),
    backgroundColor: 'white',
    transform: [{rotate: '-45deg'}],
    elevation: 2,
  },

  addButtonText: {
    fontFamily: fontTypeBold,
    fontSize: responsiveFontSize(2.2),
    color: '#6B6B6B',
  },

  signupHeaderText: {
    fontFamily: fontTypeBold,
    color: 'black',
    // fontSize: responsiveFontSize(2.1),
    fontSize: resFontSize.veryLarge2,
    alignSelf: 'flex-start',
    marginLeft: responsiveWidth(8),
    marginTop: responsiveHeight(10),
    marginBottom: responsiveHeight(3),
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
    marginTop: responsiveHeight(3),
    borderRadius: responsiveWidth(9),
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
  },

  newuserContainer: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    // marginTop: responsiveHeight(2),
    marginLeft: responsiveWidth(17 / 2),
  },

  newuserText: {
    fontFamily: fontTypeRegular,
    // fontSize: responsiveFontSize(1.5),
    fontSize: resFontSize.large,
    color: '#B0B0B0',
  },
});
