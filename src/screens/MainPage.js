// This component is the main page of the app after user logged-In.
// and consist of three tabs like a Home tab, a profile tab and a basket tab.
// In home tab we have advertise and main foods (Pizza, Burger, etc).
// In basket tab, we have all orders and total price and a navigation to
// the payment gate.

import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';

// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import OrderAndPaymentStack from './OrderAndPaymentStack';
import HomeTab from '../screens/HomeTab';
import MyProfile from '../screens/MyProfile';
import FoodDeliveryMap from '../screens/FoodDeliveryMap';
import CampaignsStack from './CampaignsStack';
import CustomDrawerContent from '../component/MainPage/CustomDrawerContent';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  fetchFood,
  fetchUser,
  fetchBurgers,
  fetchPizzas,
  fetchPastas,
  fetchDrinks,
  fetch_user_profile_pic,
} from '../../redux/actions';

import {SkypeIndicator} from 'react-native-indicators';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {fontTypeBold, fontTypeRegular} from '../../constants/fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MyFavorite from './MyFavorite';
import {resFontSize} from '../../constants/fonts';

const Drawer = createDrawerNavigator();

// function CustomDrawerContent(props, {userInfo}) {
//   const [pic, setPic] = useState(null);
//   const [userCred, setUserCred] = useState(null);

//   // useEffect(() => {
//   //   setUserCred(userInfo);
//   //   console.log('creddd ===> ', userCred);
//   // }, [userInfo]);

//   const getUserPic = () => {
//     // const picURL = await AsyncStorage.getItem('@profilePic');
//     // if (!picURL) {
//     setPic(auth().currentUser?.photoURL);
//     // } else {
//     //   setPic(picURL);
//     // }
//   };

//   const handleUserCredentials = async () => {
//     const cred = await AsyncStorage.getItem('@credentials');
//     // console.log('creddddddddd ===> ',cred)
//     if (cred) {
//       const credParse = JSON.parse(cred);
//       setUserCred({
//         fullName: credParse.name,
//         emailAddress: credParse.email,
//         phoneDial: credParse.phonenumber,
//       });
//     }
//   };

//   const formatPhoneNumber = phonenumber => {
//     // convert "+98 9111448356" into "+98 911 144 8356"

//     return `${phonenumber.slice(0, 7)} ${phonenumber.slice(
//       7,
//       10,
//     )} ${phonenumber.slice(10)}`;
//   };
//   // console.log('phoneee ====> ', formatPhoneNumber('+98 9111448356'));

//   useEffect(() => {
//     handleUserCredentials();
//     // console.log('phoneee ====> ', formatPhoneNumber('+98 9111448356'));
//   }, [userCred]);

//   useEffect(() => {
//     getUserPic();
//   }, [auth().currentUser?.photoURL]);

//   return (
//     <View style={{flex: 1}}>
//       <DrawerContentScrollView
//         // contentContainerStyle={{flex: 1, backgroundColor: 'white'}}
//         {...props}>
//         <View
//           style={{
//             flexDirection: 'row',
//             width: '100%',
//             height: responsiveHeight(15),
//             alignItems: 'center',
//             backgroundColor: 'transparent',
//             paddingLeft: responsiveWidth(4),
//             borderBottomWidth: 0.5,
//             borderBottomColor: '#00000030',
//           }}>
//           <View
//             style={{
//               width: responsiveHeight(8),
//               height: responsiveHeight(8),
//               borderRadius: responsiveHeight(8),
//               borderWidth: 2,
//               alignItems: 'center',
//               justifyContent: 'center',
//               borderColor: 'white',
//               backgroundColor: '#E6E6E7',
//             }}>
//             {pic ? (
//               <Image
//                 source={{uri: pic}}
//                 resizeMode="cover"
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   borderRadius: responsiveHeight(8),
//                 }}
//               />
//             ) : (
//               <MaterialCommunityIcons name="account" size={30} color="black" />
//             )}
//           </View>
//           <View
//             style={{
//               width: '60%',
//               height: responsiveHeight(8),
//               alignItems: 'flex-start',
//               justifyContent: 'space-between',
//               paddingTop: responsiveHeight(2),
//               marginLeft: responsiveWidth(5),
//               backgroundColor: 'transparent',
//             }}>
//             <Text
//               numberOfLines={1}
//               adjustsFontSizeToFit
//               style={{
//                 fontFamily: fontTypeRegular,
//                 fontSize: resFontSize.large,
//                 color: 'black',
//               }}>
//               {userCred && userCred.fullName}
//             </Text>
//             <Text
//               numberOfLines={1}
//               adjustsFontSizeToFit
//               style={{
//                 fontFamily: fontTypeRegular,
//                 fontSize: resFontSize.smallLarge,
//               }}>
//               {userCred && auth().currentUser.phoneNumber
//                 ? formatPhoneNumber(userCred.phoneDial)
//                 : userCred && auth().currentUser.email
//                 ? userCred.emailAddress
//                 : ''}
//             </Text>
//           </View>
//         </View>

//         <DrawerItem
//           label="Home"
//           onPress={() => props.navigation.navigate('Home')}
//           labelStyle={{fontFamily: fontTypeRegular}}
//           // focused={true}
//           icon={({focused, color, size}) => (
//             <Icon
//               name={focused ? 'home' : 'home'}
//               color="#008060"
//               size={size}
//             />
//           )}
//           // activeTintColor="powderblue"
//           // activeBackgroundColor="powderblue"
//         />
//         <DrawerItem
//           label="My favorites"
//           onPress={() => props.navigation.navigate('My favorites')}
//           labelStyle={{fontFamily: fontTypeRegular}}
//           // focused={true}
//           icon={({focused, color, size}) => (
//             <Icon name="heart" color="#008060" size={size} />
//           )}
//           // activeTintColor="powderblue"
//           // activeBackgroundColor="powderblue"
//         />
//         <DrawerItem
//           label="Campaigns"
//           onPress={() => props.navigation.navigate('Campaigns')}
//           labelStyle={{fontFamily: fontTypeRegular}}
//           icon={({focused, color, size}) => (
//             <Icon
//               name={focused ? 'bullhorn' : 'bullhorn'}
//               color="#008060"
//               size={size}
//             />
//           )}
//         />
//         <DrawerItem
//           label="My orders"
//           onPress={() => props.navigation.navigate('My orders')}
//           labelStyle={{fontFamily: fontTypeRegular}}
//           icon={({focused, color, size}) => (
//             <Icon
//               name={focused ? 'cart' : 'cart'}
//               color="#008060"
//               size={size}
//             />
//           )}
//         />
//         <DrawerItem
//           label="Location"
//           onPress={() => props.navigation.navigate('Location')}
//           labelStyle={{fontFamily: fontTypeRegular}}
//           icon={({focused, color, size}) => (
//             <Icon
//               name={focused ? 'map-marker' : 'map-marker'}
//               color="#008060"
//               size={size}
//             />
//           )}
//         />
//         <DrawerItem
//           label="My profile"
//           onPress={() => props.navigation.navigate('My profile')}
//           labelStyle={{fontFamily: fontTypeRegular}}
//           icon={({focused, color, size}) => (
//             <Icon
//               name={focused ? 'account' : 'account'}
//               color="#008060"
//               size={size}
//             />
//           )}
//         />
//       </DrawerContentScrollView>
//       <DrawerItem
//         label="Sign Out"
//         onPress={() => auth().signOut()}
//         labelStyle={{fontFamily: fontTypeRegular}}
//         icon={({focused, color, size}) => (
//           <Icon name="logout-variant" color="#008060" size={size} />
//         )}
//       />
//     </View>
//   );
// }

function MainPage(props) {
  const [loading, setLoading] = useState(true);
  const [isUploadingProcessFinished, setIsUploadingProcessFinished] =
    useState(false);

  const handleFetchNecessaryDataFromServer = async () => {
    await props.fetchUser();
    await props.fetchFood();
    await props.fetchBurgers();
    await props.fetchPizzas();
    await props.fetchPastas();
    await props.fetchDrinks();

    setLoading(false);
  };

  useEffect(() => {
    handleFetchNecessaryDataFromServer();
  }, []);

  const handleUploadPicToServer = async () => {
    const picc = await AsyncStorage.getItem('@profilePic');
    // await AsyncStorage.removeItem('@profilePic');
    // console.log('Still there?!', picc);
    if (auth().currentUser && picc) {
      const task = storage().ref(
        `UsersProfilePics/${auth().currentUser.uid}/profile_pic.png`,
      );
      await task.putFile(picc);

      //Generate a download url for uploaded image

      const downloadURL = await task.getDownloadURL();

      firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .update({
          profilePicURL: downloadURL,
        })
        .then(() => {
          auth()
            .currentUser.updateProfile({photoURL: downloadURL})
            .then(async () => {
              await AsyncStorage.removeItem('@profilePic');
              setIsUploadingProcessFinished(true);
            });
        });
    } else {
      setIsUploadingProcessFinished(true);
    }
  };

  useEffect(() => {
    handleUploadPicToServer();
  }, []);

  if (loading || !isUploadingProcessFinished) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
        }}>
        <SkypeIndicator color="black" size={60} />
      </View>
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}
      drawerContent={props => (
        <CustomDrawerContent userInfo={props.currentUser} {...props} />
      )}>
      <Drawer.Screen name="Home" component={HomeTab} />
      <Drawer.Screen name="My favorites" component={MyFavorite} />
      <Drawer.Screen name="Campaigns" component={CampaignsStack} />
      <Drawer.Screen name="My orders" component={OrderAndPaymentStack} />
      <Drawer.Screen name="Location" component={FoodDeliveryMap} />
      <Drawer.Screen name="My profile" component={MyProfile} />
    </Drawer.Navigator>
  );
}

const mapStateToProps = store => ({
  currentUser: store.userState.currentUser,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchFood,
      fetchUser,
      fetchBurgers,
      fetchPizzas,
      fetchPastas,
      fetchDrinks,
      fetch_user_profile_pic,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
