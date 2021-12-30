import React, {useEffect, useState} from 'react';
import {View, Text, Image, Alert} from 'react-native';

import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {fontTypeRegular, resFontSize} from '../../../constants/fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CustomDrawerContent(props) {
  const [pic, setPic] = useState(null);
  const [userCred, setUserCred] = useState(null);

  const getUserPic = () => {
    setPic(auth().currentUser?.photoURL);
  };

  const handleUserCredentials = async () => {
    const cred = await AsyncStorage.getItem('@credentials');
    // console.log('creddddddddd ===> ',cred)
    if (cred) {
      const credParse = JSON.parse(cred);
      setUserCred({
        fullName: credParse.name,
        emailAddress: credParse.email,
        phoneDial: credParse.phonenumber,
      });
    }
  };

  const formatPhoneNumber = phonenumber => {
    // convert "+98 9111448356" into "+98 911 144 8356"

    return `${phonenumber.slice(0, 7)} ${phonenumber.slice(
      7,
      10,
    )} ${phonenumber.slice(10)}`;
  };
  // console.log('phoneee ====> ', formatPhoneNumber('+98 9111448356'));

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

  useEffect(() => {
    handleUserCredentials();
    // console.log('phoneee ====> ', formatPhoneNumber('+98 9111448356'));
  }, [userCred]);

  useEffect(() => {
    getUserPic();
  }, [auth().currentUser?.photoURL]);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            height: responsiveHeight(15),
            alignItems: 'center',
            backgroundColor: 'transparent',
            paddingLeft: responsiveWidth(4),
            borderBottomWidth: 0.5,
            borderBottomColor: '#00000030',
          }}>
          <View
            style={{
              width: responsiveHeight(8),
              height: responsiveHeight(8),
              borderRadius: responsiveHeight(8),
              borderWidth: 2,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: 'white',
              backgroundColor: '#E6E6E7',
            }}>
            {pic ? (
              <Image
                source={{uri: pic}}
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: responsiveHeight(8),
                }}
              />
            ) : (
              <MaterialCommunityIcons name="account" size={30} color="black" />
            )}
          </View>
          <View
            style={{
              width: '60%',
              height: responsiveHeight(8),
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              paddingTop: responsiveHeight(2),
              marginLeft: responsiveWidth(5),
              backgroundColor: 'transparent',
            }}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontFamily: fontTypeRegular,
                fontSize: resFontSize.large,
                color: 'black',
              }}>
              {userCred && userCred.fullName}
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontFamily: fontTypeRegular,
                fontSize: resFontSize.smallLarge,
              }}>
              {userCred && auth().currentUser?.phoneNumber
                ? formatPhoneNumber(userCred.phoneDial)
                : userCred && auth().currentUser?.email
                ? userCred.emailAddress
                : ''}
            </Text>
          </View>
        </View>

        <DrawerItem
          label="Home"
          onPress={() => props.navigation.navigate('Home')}
          labelStyle={{fontFamily: fontTypeRegular}}
          // focused={true}
          icon={({focused, color, size}) => (
            <Icon
              name={focused ? 'home' : 'home'}
              color="#008060"
              size={size}
            />
          )}
        />
        <DrawerItem
          label="My favorites"
          onPress={() => props.navigation.navigate('My favorites')}
          labelStyle={{fontFamily: fontTypeRegular}}
          // focused={true}
          icon={({focused, color, size}) => (
            <Icon name="heart" color="#008060" size={size} />
          )}
          // activeTintColor="powderblue"
          // activeBackgroundColor="powderblue"
        />
        <DrawerItem
          label="Campaigns"
          onPress={() => props.navigation.navigate('Campaigns')}
          labelStyle={{fontFamily: fontTypeRegular}}
          icon={({focused, color, size}) => (
            <Icon
              name={focused ? 'bullhorn' : 'bullhorn'}
              color="#008060"
              size={size}
            />
          )}
        />
        <DrawerItem
          label="My orders"
          onPress={() => props.navigation.navigate('My orders')}
          labelStyle={{fontFamily: fontTypeRegular}}
          icon={({focused, color, size}) => (
            <Icon
              name={focused ? 'cart' : 'cart'}
              color="#008060"
              size={size}
            />
          )}
        />
        <DrawerItem
          label="Location"
          onPress={() => props.navigation.navigate('Location')}
          labelStyle={{fontFamily: fontTypeRegular}}
          icon={({focused, color, size}) => (
            <Icon
              name={focused ? 'map-marker' : 'map-marker'}
              color="#008060"
              size={size}
            />
          )}
        />
        <DrawerItem
          label="My profile"
          onPress={() => props.navigation.navigate('My profile')}
          labelStyle={{fontFamily: fontTypeRegular}}
          icon={({focused, color, size}) => (
            <Icon
              name={focused ? 'account' : 'account'}
              color="#008060"
              size={size}
            />
          )}
        />
      </DrawerContentScrollView>
      <DrawerItem
        label="Sign Out"
        // onPress={() => auth().signOut()}
        onPress={handleSignOut}
        labelStyle={{fontFamily: fontTypeRegular}}
        icon={({focused, color, size}) => (
          <Icon name="logout-variant" color="#008060" size={size} />
        )}
      />
    </View>
  );
}
