import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {fontTypeBold, fontTypeRegular} from '../../../constants/fonts';
import {arrowRightBlack} from '../../../constants/images';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {Shadow} from 'react-native-neomorph-shadows';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import FireIcon from './FireIcon';
import {resFontSize} from '../../../constants/fonts';

const Card = ({
  type,
  idd,
  calories,
  extra,
  name,
  image,
  price,
  navigation,
  foodType,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeButton = () => {
    setIsLiked(!isLiked);

    firestore()
      .collection('foods') // foods collection
      .doc(foodType) // for example pizza document
      .collection('items') // items collection in pizza document
      .doc(idd) // food item, for example Meat
      .collection('likes') // create(if dont exist) comments collection in Meat item
      .doc(auth().currentUser.uid) // create(if dont exist) user_id document in comments
      .set({
        liked: !isLiked,
      })
      .then(() => {
        if (!isLiked) {
          firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .collection('favorites')
            .doc(idd)
            .set({
              name: name,
              price: price,
              extra: extra,
              calories: calories,
              picurl: image,
              type: foodType,
              id: idd,
            });
        } else {
          firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .collection('favorites')
            .doc(idd)
            .delete();
        }
      });
  };

  const getLikeStatus = () => {
    firestore()
      .collection('foods') // foods collection
      .doc(foodType) // for example pizza document
      .collection('items') // items collection in pizza document
      .doc(idd) // food item, for example Meat
      .collection('likes') // create(if dont exist) comments collection in Meat item
      .doc(auth().currentUser.uid)
      .onSnapshot(dc => setIsLiked(dc.data()?.liked));
  };

  useEffect(() => {
    getLikeStatus();
  }, []);

  return (
    <View
      style={[
        styles.itemCardContainer,
        {
          width: type === 'search' ? responsiveWidth(45) : responsiveWidth(50),
          height:
            type === 'search' ? responsiveHeight(38) : responsiveHeight(42),
        },
      ]}>
      <View style={styles.topContainer}>
        <View style={styles.itemCardCaloriContainer}>
          <View style={styles.itemCardFireImage}>
            <FireIcon />
          </View>
          <Text
            style={styles.caloriText}
            adjustsFontSizeToFit={true}
            numberOfLines={1}>
            {calories} calories
          </Text>
        </View>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: responsiveHeight(3),
            height: responsiveHeight(3),
            borderRadius: responsiveHeight(3),
            backgroundColor: 'transparent',
          }}
          onPress={handleLikeButton}
          hitSlop={{
            top: 15,
            bottom: 15,
            left: 7,
            right: 7,
          }}>
          <MaterialCommunityIcons
            name="heart"
            color={isLiked ? 'red' : 'gray'}
            size={responsiveHeight(3)}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.itemCardImageContainer,
          {
            width:
              type === 'search' ? responsiveWidth(30) : responsiveWidth(35),
            height:
              type === 'search' ? responsiveWidth(30) : responsiveWidth(35),
            borderRadius:
              type === 'search' ? responsiveWidth(30) : responsiveWidth(35),
          },
        ]}
        onPress={() =>
          navigation.navigate('FoodDetail', {
            identification: idd,
            cal: calories,
            ext: extra,
            nme: name,
            imge: image,
            prc: price,
            foodType: foodType,
          })
        }
        activeOpacity={0.6}>
        <Image source={image} style={styles.itemCardImage} resizeMode="cover" />
      </TouchableOpacity>
      <View
        style={{
          width: '100%',
          height: '28%',
          paddingHorizontal: responsiveWidth(4),
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
        }}>
        <View style={{width: '100%'}}>
          <Text style={styles.nameText} numberOfLines={1} adjustsFontSizeToFit>
            {name}
          </Text>
          <Text style={styles.extraText} numberOfLines={1} adjustsFontSizeToFit>
            {extra}
          </Text>
        </View>
        <Text style={styles.priceText} numberOfLines={1} adjustsFontSizeToFit>
          ${price.toString().replace('.', ',')}
        </Text>
      </View>
      <Shadow
        style={{
          shadowOffset: {width: 5, height: 5},
          shadowRadius: 2.5,
          shadowColor: '#00000005',
          shadowOpacity: 0.06,
          backgroundColor: '#fafbfd',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          right: responsiveWidth(2.77),
          bottom: responsiveHeight(-2.3),
          width: responsiveWidth(11),
          height: responsiveWidth(11),
          borderRadius: responsiveWidth(5.5),
          // backgroundColor: 'pink',
          zIndex: 20,
        }}>
        <Pressable
          // android_ripple={{color: 'red'}}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: responsiveWidth(11),
            height: responsiveWidth(11),
            borderRadius: responsiveWidth(5.5),
            backgroundColor: '#fafbfd',
          }}
          onPress={() =>
            navigation.navigate('FoodDetail', {
              identification: idd,
              cal: calories,
              ext: extra,
              nme: name,
              imge: image,
              prc: price,
              foodType: foodType,
            })
          }>
          <Image source={arrowRightBlack} />
        </Pressable>
      </Shadow>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  itemCardContainer: {
    width: responsiveWidth(50),
    height: responsiveHeight(42),
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: responsiveWidth(4),
    backgroundColor: '#00000010',
    marginVertical: responsiveHeight(4),
    marginRight: responsiveWidth(3),
    paddingVertical: responsiveHeight(2),
  },

  topContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(4),
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingVertical: 20,
    // paddingHorizontal: 15,
    backgroundColor: 'transparent',
  },

  itemCardCaloriContainer: {
    flexDirection: 'row',
    height: responsiveHeight(3),
    width: responsiveWidth(22),
    backgroundColor: 'transparent',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },

  itemCardFireImage: {
    width: responsiveHeight(2.3),
    height: responsiveHeight(2.3),
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemCardImageContainer: {
    width: responsiveWidth(35),
    height: responsiveWidth(35),
    borderRadius: responsiveWidth(35),
    backgroundColor: 'white',
    // elevation: 5,
    // marginVertical: responsiveHeight(1.6),
  },

  caloriText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.smallLarge,
    color: '#00000090',
    marginLeft: responsiveWidth(1),
  },

  itemCardImage: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveWidth(35),
  },

  nameText: {
    fontFamily: fontTypeRegular,
    color: '#000000',
    // alignSelf: 'flex-start',
    fontSize: resFontSize.bigLarge,
    // marginLeft: responsiveWidth(4),
  },

  extraText: {
    fontFamily: fontTypeRegular,
    // alignSelf: 'flex-start',
    fontSize: resFontSize.large,
    color: '#9B9B9B',
    // marginLeft: responsiveWidth(4),
  },

  priceText: {
    fontFamily: fontTypeRegular,
    color: '#000000',
    // alignSelf: 'flex-start',
    fontSize: resFontSize.bigLarge,
    // marginTop: responsiveHeight(4),
    // marginLeft: responsiveWidth(4),
  },

  itemCardNavigationCircle: {
    position: 'absolute',
    right: responsiveWidth(2.77),
    bottom: responsiveHeight(-2.3),
    width: responsiveWidth(11),
    height: responsiveWidth(11),
    borderRadius: responsiveWidth(5.5),
    backgroundColor: '#fafbfd',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
