import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Text,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Card from '../component/Home/Card';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {fontTypeBold, resFontSize} from '../../constants/fonts';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MyFavorite = ({navigation}) => {
  const [favoriteFoods, setFavoriteFoods] = useState(null);

  const getUserFavoritesFoods = () => {
    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('favorites')
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          let favorits = [];
          querySnapshot.forEach(docSnapshot =>
            favorits.push(docSnapshot.data()),
          );
          setFavoriteFoods(favorits);
        }
      });
  };

  useEffect(() => {
    // getUserFavoritesFoods();
    // console.log(favoriteFoods);

    const subscriber = firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .collection('favorites')
      .onSnapshot(querySnapshot => {
        if (!querySnapshot.empty) {
          let favorits = [];
          querySnapshot.forEach(docSnapshot =>
            favorits.push(docSnapshot.data()),
          );
          setFavoriteFoods(favorits);
        } else {
          setFavoriteFoods(null);
        }
      });
    // console.log(favoriteFoods);

    return () => subscriber();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          width: responsiveWidth(100),
          height: responsiveHeight(10),
          paddingLeft: responsiveWidth(6),
          //   alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
        }}>
        <Text
          style={{
            fontFamily: fontTypeBold,
            fontSize: resFontSize.veryLarge2,
            color: 'black',
          }}>
          My favorites
        </Text>
      </View>
      <FlatList
        data={favoriteFoods}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        horizontal
        // showsVerticalScrollIndicator={false}
        // ListHeaderComponent={
        //   <View
        //     style={{
        //       width: responsiveWidth(100),
        //       height: responsiveHeight(7),
        //       paddingLeft: responsiveWidth(6),
        //       //   alignItems: 'center',
        //       justifyContent: 'center',
        //       backgroundColor: 'transparent',
        //     }}>
        //     <Text
        //       style={{
        //         fontFamily: fontTypeBold,
        //         fontSize: resFontSize.bigLarge,
        //         color: 'black',
        //       }}>
        //       My favorites
        //     </Text>
        //   </View>
        // }
        contentContainerStyle={{
          paddingLeft: responsiveWidth(6),
          //   width: '100%',
          //   alignItems: 'center',
          backgroundColor: 'transparent',
        }}
        renderItem={({item}) => (
          <Card
            idd={item.id}
            calories={item.calories}
            name={item.name}
            image={item.picurl}
            extra={item.extra}
            price={item.price}
            foodType={item.type}
            navigation={navigation}
            type="favorite"
          />
        )}
      />
    </View>
  );
};

export default MyFavorite;
