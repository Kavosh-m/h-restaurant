import React, {useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FloatingLabelInput} from 'react-native-floating-label-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {fontTypeRegular, resFontSize} from '../../../constants/fonts';

export default function ModalEditProfile({
  setModalVisible,
  fieldType,
  refresh,
  setRefresh,
}) {
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  //   useEffect(() => {
  //     console.log('New Name ==> ', newName);
  //   }, [newName]);

  const handleSaveChange = async () => {
    let cred = await AsyncStorage.getItem('@credentials');
    console.log(cred);
    if (!cred) {
      await AsyncStorage.setItem(
        '@credentials',
        `{"name":"","email":"","phonenumber":"${
          auth().currentUser.phoneNumber
        }"}`,
      );
      cred = await AsyncStorage.getItem('@credentials');
    }

    if (newName.length > 0 && fieldType === 'name') {
      //   console.log('Name');
      firestore().collection('users').doc(auth().currentUser.uid).update({
        name: newName,
      });

      await AsyncStorage.setItem(
        '@credentials',
        `{"name":"${newName}","email":"${
          JSON.parse(cred).email
        }","phonenumber":"${JSON.parse(cred).phonenumber}"}`,
      );

      let r = await AsyncStorage.getItem('@credentials');
      console.log('Credential ===> ', r);

      setRefresh(!refresh);
      setModalVisible(false);

      //   setNewName('');
    }

    if (newEmail.length > 0 && fieldType === 'email') {
      //   console.log('Email');
      firestore().collection('users').doc(auth().currentUser.uid).update({
        email: newEmail,
      });

      await AsyncStorage.setItem(
        '@credentials',
        `{"name":"${
          JSON.parse(cred).name
        }","email":"${newEmail}","phonenumber":"${
          JSON.parse(cred).phonenumber
        }"}`,
      );

      // let r = await AsyncStorage.getItem('@credentials');
      // console.log('Credential ===> ', r);

      setRefresh(!refresh);
      setModalVisible(false);

      //   setNewEmail('');
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#00000060',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: responsiveWidth(85),
          height: responsiveHeight(20),
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'space-around',
          borderRadius: responsiveHeight(1.5),
          //   borderBottomLeftRadius: responsiveHeight(7),
          //   borderBottomRightRadius: responsiveHeight(7),
        }}>
        <View
          style={{
            width: '95%',
            alignItems: 'center',
            justifyContent: 'center',
            height: responsiveHeight(6),
          }}>
          <FloatingLabelInput
            staticLabel
            keyboardType={fieldType === 'email' ? 'email-address' : 'default'}
            hint={
              fieldType === 'name'
                ? 'New Name . . .'
                : fieldType === 'email'
                ? 'New Email . . .'
                : ''
            }
            hintTextColor="gray"
            containerStyles={{
              borderBottomWidth: 1,
              height: '100%',
              backgroundColor: '#FAFBFD',
            }}
            inputStyles={{
              fontFamily: fontTypeRegular,
              fontSize: resFontSize.large,
              color: 'black',
            }}
            autoFocus={true}
            isPassword={false}
            value={fieldType === 'name' ? newName : newEmail}
            onChangeText={txt =>
              fieldType === 'name' ? setNewName(txt) : setNewEmail(txt)
            }
          />
        </View>
        <View
          style={{
            width: '95%',
            height: responsiveHeight(5),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            backgroundColor: 'transparent',
          }}>
          <TouchableOpacity
            style={{
              width: '20%',
              height: '100%',
              borderRadius: responsiveHeight(7),
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              marginRight: responsiveWidth(3),
            }}
            activeOpacity={0.6}
            onPress={handleSaveChange}>
            <Text
              style={{
                fontFamily: fontTypeRegular,
                fontSize: resFontSize.large,
                color: 'black',
              }}>
              Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '20%',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              borderRadius: responsiveHeight(7),
              backgroundColor: 'transparent',
            }}
            activeOpacity={0.6}
            onPress={() => setModalVisible(false)}>
            <Text
              style={{
                fontFamily: fontTypeRegular,
                fontSize: resFontSize.large,
                color: 'black',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
