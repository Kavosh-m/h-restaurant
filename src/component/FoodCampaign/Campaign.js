import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, Pressable, Text} from 'react-native';
import {
  fontTypeBold,
  fontTypeRegular,
  resFontSize,
} from '../../../constants/fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const Campaign = ({
  image,
  price,
  navigation,
  foodType,
  name,
  extra,
  calories,
  id,
}) => {
  const [isliked, setIsliked] = useState(false);
  const off = 50;

  const handleLikeButton = () => {
    setIsliked(!isliked);

    firestore()
      .collection('foods') // foods collection
      .doc(foodType) // for example pizza document
      .collection('items') // items collection in pizza document
      .doc(id) // food item, for example Meat
      .collection('likes') // create(if dont exist) comments collection in Meat item
      .doc(auth().currentUser.uid) // create(if dont exist) user_id document in comments
      .set({
        liked: !isliked,
      })
      .then(() => {
        if (!isliked) {
          firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .collection('favorites')
            .doc(id)
            .set({
              name: name,
              price: price,
              extra: extra,
              calories: calories,
              picurl: image,
              type: foodType,
              id: id,
            });
        } else {
          firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .collection('favorites')
            .doc(id)
            .delete();
        }
      });
  };

  const getLikeStatus = () => {
    firestore()
      .collection('foods') // foods collection
      .doc(foodType) // for example pizza document
      .collection('items') // items collection in pizza document
      .doc(id) // food item, for example Meat
      .collection('likes') // create(if dont exist) comments collection in Meat item
      .doc(auth().currentUser.uid)
      .onSnapshot(dc => setIsliked(dc.data()?.liked));
  };

  useEffect(() => {
    getLikeStatus();
  }, []);

  return (
    <View
      style={{
        width: responsiveWidth(85),
        height: responsiveHeight(32),
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: responsiveHeight(1.5),
        borderRadius: responsiveHeight(2),
        backgroundColor: '#00000010',
        marginVertical: responsiveHeight(2),
      }}>
      <TouchableOpacity
        style={{
          width: responsiveWidth(80),
          height: responsiveHeight(25),
          borderRadius: responsiveHeight(2),
          backgroundColor: '#aaaaaa',
          marginVertical: responsiveHeight(2),
        }}
        onPress={() =>
          navigation.navigate('FoodDetail', {
            identification: id,
            cal: calories,
            ext: extra,
            nme: name,
            imge: image,
            prc: (price * (1 - off / 100)).toFixed(2),
            foodType: foodType,
          })
        }>
        <Image
          source={image}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: responsiveHeight(2),
          }}
          resizeMode="cover"
        />
        <Pressable
          style={{
            position: 'absolute',
            right: responsiveHeight(5 / 2),
            top: responsiveHeight(5 / 2),
            width: responsiveHeight(5),
            height: responsiveHeight(5),
            borderRadius: responsiveHeight(5),
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={handleLikeButton}>
          <MaterialCommunityIcons
            name="heart"
            size={isliked ? responsiveHeight(5 / 1.8) : responsiveHeight(5 / 2)}
            color={isliked ? 'red' : 'gray'}
          />
        </Pressable>
      </TouchableOpacity>
      {/* // {caption} */}
      <View
        style={{
          // alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          // marginLeft: 0,
          width: responsiveWidth(80),
          backgroundColor: 'transparent',
        }}>
        <Text
          style={{
            fontSize: resFontSize.bigLarge,
            fontFamily: fontTypeBold,
            color: '#2F2F2F',
          }}>
          Sale off {`${off}`}%
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            width: responsiveWidth(18),
            backgroundColor: 'transparent',
            // paddingHorizontal: 8,
          }}>
          <Text
            numberOfLines={1}
            style={{
              textDecorationLine: 'line-through',
              color: '#2F2F2F',
              fontFamily: fontTypeRegular,
              fontSize: resFontSize.large,
              marginRight: responsiveWidth(2),
            }}>
            {`$${price}`}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: resFontSize.bigLarge,
              fontFamily: fontTypeBold,
              color: '#2F2F2F',
            }}>{`$${(price * (1 - off / 100))
            .toFixed(2)
            .toString()
            .replace('.', ',')}`}</Text>
        </View>
      </View>
      {/* // {caption end} */}
    </View>
  );
};

export default Campaign;
