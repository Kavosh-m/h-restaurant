import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Platform,
  Pressable,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Alert,
  ToastAndroid,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {SkypeIndicator} from 'react-native-indicators';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {fetch_user_profile_pic} from '../../redux/actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import ImageResizer from 'react-native-image-resizer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fontTypeBold,
  fontTypeRegular,
  resFontSize,
} from '../../constants/fonts';

import {Shadow} from 'react-native-neomorph-shadows';

import {launchImageLibrary} from 'react-native-image-picker';
import ModalEditProfile from '../component/MyProfile/ModalEditProfile';
import {myProfileBg} from '../../constants/images';
import LinearGradient from 'react-native-linear-gradient';

const Item = ({title, info, setModalVisible, setFieldType}) => {
  return (
    <View style={styles.itemContainer}>
      <View
        style={[
          styles.itemInnerContainer,
          {width: title === 'Address' ? '100%' : responsiveWidth(83 * 0.75)},
        ]}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text
          style={styles.infoText}
          numberOfLines={1}
          adjustsFontSizeToFit={true}>
          {title === 'Phone' && info
            ? `${info.slice(0, 3)} ${info.slice(4, 7)} ${info.slice(
                7,
                10,
              )} ${info.slice(10, 14)}`
            : info}
        </Text>
      </View>
      {title === 'Address' ? null : title === 'Phone' &&
        auth().currentUser?.providerData[0].providerId ===
          'phone' ? null : title === 'Full Name' &&
        auth().currentUser?.providerData[0].providerId !==
          'phone' ? null : title === 'Email' &&
        auth().currentUser?.providerData[0].providerId !== 'phone' ? null : (
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.6}
          onPress={() => {
            if (
              title !== 'Address' &&
              title !== 'Phone' &&
              auth().currentUser?.providerData[0].providerId === 'phone'
            ) {
              setModalVisible(true);
              setFieldType(
                title === 'Full Name'
                  ? 'name'
                  : title === 'Email'
                  ? 'email'
                  : '',
              );
            }
          }}>
          {/* <Text style={{fontFamily: fontTypeRegular, color: '#000'}}>+</Text> */}
          <MaterialCommunityIcons
            name="pencil"
            color="#000000"
            size={responsiveHeight(5.5 / 2.5)}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const RenderProfileView = ({
  currentUser,
  userAddress,
  profilePIC,
  setDidProfilePicChange,
  setModalVisible,
  setFieldType,
  refresh,
}) => {
  // const [selectedPictureUri, setSelectedPictureUri] = useState(profilePIC);
  const [pickProfileUrl, setPickProfileUrl] = useState(profilePIC);
  const [userCred, setUserCred] = useState({
    fullName: null,
    emailAddress: null,
    phoneDial: null,
  });
  const [uploadedToStorage, setUploadedToStorage] = useState(false);

  const handleChangeProfilePic = () => {
    const options = {
      title: 'Select picture...',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    // console.log('pic profile ===> ', auth().currentUser?.photoURL);

    launchImageLibrary(options, async response => {
      try {
        // auth().currentUser.updateProfile({photoURL: null});
        // setSelectedPictureUri(response.assets[0].uri);
        // await AsyncStorage.setItem('@profilePic', response.assets[0].uri);
        // setDidProfilePicChange(true);

        //Resize image and upload it to firebase storage
        let newWidth = 500;
        let newHeight = 500;
        let compressFormat = 'PNG';
        let quality = 70; //min:0 , max:100
        let rotation = 0;
        let outputPath = null;
        let imageUri = response.assets[0].uri; //selectedPictureUri;

        if (imageUri) {
          auth()
            .currentUser.updateProfile({photoURL: null})
            .then(() => {
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
                  // setPickProfileUrl(uploadUri);

                  //Upload resized image to firebase storage
                  setUploadedToStorage(true);
                  const task = storage().ref(
                    `UsersProfilePics/${
                      auth().currentUser.uid
                    }/profile_pic.png`,
                  );
                  await task.putFile(uploadUri);
                  // .on('state_changed', taskSnap => {
                  //   console.log(`${taskSnap.bytesTransferred}/${taskSnap.totalBytes}`)
                  // })
                  //Generate a download url for uploaded image
                  const downloadURL = await task.getDownloadURL();
                  setPickProfileUrl(downloadURL);
                  // await AsyncStorage.setItem('@profilePic', downloadURL);

                  //Add a pic field in current user document in users firestore
                  firestore()
                    .collection('users')
                    .doc(auth().currentUser.uid)
                    .update({
                      profilePicURL: downloadURL,
                    });
                  auth()
                    .currentUser.updateProfile({photoURL: downloadURL})
                    .then(() => {
                      setUploadedToStorage(false);
                      setDidProfilePicChange(true);
                    });
                })
                .catch(err => {
                  // console.log('image resizing error => ', err);
                  ToastAndroid.show(
                    'Image resizing process failed!',
                    ToastAndroid.LONG,
                  );
                });
            });
        }
      } catch {
        setDidProfilePicChange(false);
        // console.log('user cancel picking');
      }
    });
  };

  // useEffect(() => {
  //   console.log('profile pic changed!');
  // }, [auth().currentUser?.photoURL]);

  const handleRemoveProfilePic = async () => {
    await AsyncStorage.removeItem('@profilePic');

    firestore().collection('users').doc(auth().currentUser.uid).update({
      profilePicURL: '',
    });
    auth()
      .currentUser.updateProfile({photoURL: null})
      .then(() => setIsModalPicProfileVisible(false));
  };

  const handleUserCredentials = async () => {
    let mount = true;

    const cred = await AsyncStorage.getItem('@credentials');
    // console.log('creddddddddd ===> ',cred)
    if (cred) {
      const credParse = JSON.parse(cred);
      setUserCred({
        fullName: credParse.name,
        emailAddress: credParse.email,
        phoneDial: credParse.phonenumber,
      });
    } else {
      setUserCred({
        fullName: currentUser.name,
        emailAddress: currentUser.email,
        phoneDial: currentUser.phonenumber,
      });
    }

    return () => {
      mount = false;
    };
  };

  useEffect(() => {
    handleUserCredentials();
  }, [refresh]);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure about this?', [
      {
        text: 'No',
        // onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => auth().signOut()},
    ]);
  };

  const [isModalPicProfileVisible, setIsModalPicProfileVisible] =
    useState(false);

  return (
    <LinearGradient
      colors={['#F6F6F6', '#FFFFFF', '#FFFFFF']}
      locations={[0.1, 0.27, 1]}
      style={styles.profileMainContainer}
      // behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
    >
      {/* {image} */}
      <View style={styles.profilePicContainer}>
        {auth().currentUser?.providerData[0].providerId === 'phone' && (
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.addProfileButton}
            onPress={() => setIsModalPicProfileVisible(true)}>
            <MaterialCommunityIcons
              name="camera"
              color="#000000"
              size={responsiveHeight(5 / 2)}
              style={{transform: [{rotate: '-45deg'}]}}
            />
          </TouchableOpacity>
        )}
        {!uploadedToStorage && auth().currentUser?.photoURL ? (
          <Image
            source={{uri: auth().currentUser?.photoURL}}
            resizeMode="cover"
            style={styles.profilePic}
          />
        ) : uploadedToStorage ? (
          <SkypeIndicator size={30} color="black" />
        ) : (
          <MaterialCommunityIcons
            name="account"
            size={responsiveWidth(30 / 1.6)}
            color="black"
            style={{
              transform: [{rotate: '-45deg'}],
            }}
          />
        )}
      </View>
      {/* {image end} */}

      {/* Modal for profile picture handling */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalPicProfileVisible}
        onRequestClose={() => {
          setIsModalPicProfileVisible(false);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#00000095',
            // alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <Pressable
            style={{
              width: '100%',
              height: responsiveHeight(85),
              backgroundColor: 'transparent',
            }}
            onPress={() => setIsModalPicProfileVisible(false)}></Pressable>
          <View
            style={{
              width: '100%',
              height: responsiveHeight(15),
              backgroundColor: '#001a09',
              paddingHorizontal: responsiveWidth(3),
              // alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <Text
              style={{
                fontFamily: fontTypeBold,
                fontSize: resFontSize.bigLarge,
                color: '#ffffff',
              }}>
              Profile Photo
            </Text>
            <View style={{width: '100%', flexDirection: 'row'}}>
              {auth().currentUser?.photoURL && (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={handleRemoveProfilePic}
                  style={{
                    width: responsiveHeight(6),
                    height: responsiveHeight(6),
                    borderRadius: responsiveHeight(6),
                    marginRight: responsiveWidth(3),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ff3300',
                  }}>
                  <MaterialCommunityIcons
                    name="delete"
                    color="#ffffff"
                    size={responsiveHeight(6 / 2)}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={0.6}
                style={{
                  width: responsiveHeight(6),
                  height: responsiveHeight(6),
                  borderRadius: responsiveHeight(6),
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#cc0099',
                }}
                onPress={() => {
                  handleChangeProfilePic();
                  setIsModalPicProfileVisible(false);
                }}>
                <MaterialCommunityIcons
                  name="panorama"
                  color="#ffffff"
                  size={responsiveHeight(6 / 2)}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* End of Modal for profile picture handling */}

      <View style={styles.headerAndEditButtonContainer}>
        <Text style={styles.profileText}>My Profile</Text>
        <Text style={styles.profileDetailText}>Profile Detail</Text>
      </View>

      <Item
        title="Full Name"
        info={userCred.fullName}
        setModalVisible={setModalVisible}
        setFieldType={setFieldType}
      />
      {auth().currentUser?.providerData[0].providerId === 'phone' && (
        <Item
          title="Phone"
          info={auth().currentUser?.phoneNumber ? userCred.phoneDial : ''}
        />
      )}
      <Item
        title="Email"
        info={userCred.emailAddress}
        setModalVisible={setModalVisible}
        setFieldType={setFieldType}
      />
      <Item
        title="Address"
        info={userAddress ? userAddress : 'fetching address...'}
      />

      <Shadow
        style={{
          shadowOffset: {width: 6, height: 10},
          shadowOpacity: 0.1,
          shadowColor: '#00000010',
          shadowRadius: 5,
          height: responsiveHeight(8),
          width: responsiveWidth(83),
          marginTop: responsiveHeight(1.56),
          borderRadius: responsiveWidth(8.6),
          borderColor: 'white',
          borderWidth: 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}>
        <Pressable
          android_ripple={{color: 'white'}}
          style={{
            height: '100%',
            width: '100%',

            borderRadius: responsiveWidth(8.6),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
          }}
          onPress={() => handleSignOut()}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </Shadow>
    </LinearGradient>
  );
};

const MyProfile = ({
  navigation,
  currentUser,
  userAddress,
  profilePIC,
  fetch_user_profile_pic,
}) => {
  const [isLoading, setIsloading] = useState(false);
  // const [editMode, setEditMode] = useState(false);
  const [didProfilePicChange, setDidProfilePicChange] = useState(false);
  // Listen to firebase firestore current user document changes
  const [didDatabaseChanged, setDidDatabaseChanged] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fieldType, setFieldType] = useState();
  const [refresh, setRefresh] = useState(true);

  // console.log('pic profile ===> ', auth().currentUser?.photoURL);

  // console.log(
  //   'Provider Id ====> ',
  //   auth().currentUser.providerData[0].providerId,
  // );

  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .onSnapshot(async documentSnapshot => {
        // setDidDatabaseChanged(!didDatabaseChanged);
        if (documentSnapshot.data().profilePicURL) {
          // await AsyncStorage.setItem(
          //   '@profilePic',
          //   documentSnapshot.data().profilePicURL,
          // );
        }
        fetch_user_profile_pic();
        // console.log('User data: ', documentSnapshot.data());
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  useEffect(() => {
    fetch_user_profile_pic();
  }, [didProfilePicChange]);

  // useEffect(() => {
  //   console.log('profile pic changed!');
  // }, [auth().currentUser?.photoURL]);

  if (!auth().currentUser) {
    return (
      <View style={styles.loggingOutContainer}>
        <SkypeIndicator size={80} color="black" />
        <Text style={styles.loggingOutText}>Logging Out</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      style={styles.mainScreenContainer}
      source={myProfileBg}
      resizeMode="cover">
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'pink',
        }}></View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <ModalEditProfile
          refresh={refresh}
          setRefresh={setRefresh}
          setModalVisible={setModalVisible}
          fieldType={fieldType}
        />
      </Modal>
      <RenderProfileView
        setIsloading={setIsloading}
        navigation={navigation}
        currentUser={currentUser}
        userAddress={userAddress}
        profilePIC={profilePIC}
        // setEditMode={setEditMode}
        setDidProfilePicChange={setDidProfilePicChange}
        setModalVisible={setModalVisible}
        setFieldType={setFieldType}
        refresh={refresh}
        fetch_user_profile_pic={fetch_user_profile_pic}
      />
    </ImageBackground>
  );

  // return (
  //   <View style={styles.loggingOutContainer}>
  //     <SkypeIndicator size={80} color="black" />
  //     <Text style={styles.loggingOutText}>Logging Out</Text>
  //   </View>
  // );
};

const mapStateToProps = store => ({
  currentUser: store.userState.currentUser,
  userAddress: store.userState.userAddress,
  profilePIC: store.userState.profilePIC,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({fetch_user_profile_pic}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);

const styles = StyleSheet.create({
  //main
  mainScreenContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#B0B0B0',
  },

  //logging out
  loggingOutContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(1),
  },

  loggingOutText: {
    fontFamily: fontTypeRegular,
    fontSize: responsiveFontSize(2.7),
  },

  //top section

  //renderProfileView
  profileMainContainer: {
    flex: 4,
    alignItems: 'center',
    width: '100%',
    borderTopLeftRadius: responsiveWidth(7),
    borderTopRightRadius: responsiveWidth(7),
    backgroundColor: 'white',
  },

  profilePicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(30 / 2),
    borderWidth: 3,
    borderColor: 'white',
    position: 'absolute',
    top: responsiveWidth(-30 / 2),
    backgroundColor: '#E8E8E8',
    transform: [{rotate: '45deg'}],
  },

  addProfileButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveHeight(5),
    height: responsiveHeight(5),
    borderRadius: responsiveHeight(5),
    alignSelf: 'center',
    position: 'absolute',
    right: responsiveHeight(-5 / 2),
    backgroundColor: '#ffffff',
    // transform: [{rotate: '-45deg'}],
    zIndex: 20,
    elevation: 2,
  },

  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveWidth(15),
    transform: [{rotate: '-45deg'}],
  },

  profileText: {
    fontFamily: fontTypeBold,
    // alignSelf: 'flex-start',
    fontSize: resFontSize.veryLarge2,
    color: 'black',
    // marginTop: responsiveHeight(9.3),
    // marginLeft: responsiveWidth(8.3),
  },

  profileDetailText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.large,
    color: '#00000080',
  },

  logoutButtonContainer: {
    height: responsiveHeight(8),
    width: responsiveWidth(83),
    marginTop: responsiveHeight(1.56),
    borderRadius: responsiveWidth(8.6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },

  logoutText: {
    fontFamily: fontTypeBold,
    fontSize: resFontSize.bigLarge,
    color: 'white',
  },

  itemContainer: {
    flexDirection: 'row',
    width: responsiveWidth(83),
    height: responsiveHeight(8),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(4),
    backgroundColor: '#00000009',
    borderRadius: responsiveHeight(8 / 4),
    marginBottom: responsiveHeight(2),
  },

  itemInnerContainer: {
    height: responsiveHeight(5.5),
    width: responsiveWidth(83 * 0.75),
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },

  addButton: {
    height: responsiveHeight(5.5),
    width: responsiveHeight(5.5),
    borderRadius: responsiveHeight(5.5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  itemTitle: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.large,
    color: '#00000080',
  },

  // infoContainer: {
  //   height: responsiveHeight(3.1),
  //   width: responsiveWidth(55.5),
  //   backgroundColor: 'yellow',
  // },

  infoText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.large,
    color: 'black',
  },

  headerAndEditButtonContainer: {
    // flexDirection: 'row',
    width: responsiveWidth(83),
    height: responsiveHeight(7),
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    marginTop: responsiveHeight(10),
    marginBottom: responsiveHeight(2),
    backgroundColor: 'transparent',
  },

  changeProfileButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    borderRadius: responsiveWidth(12) / 2,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    right: responsiveWidth(6.3),
  },
});
