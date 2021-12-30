import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Text,
  useWindowDimensions,
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {fontTypeRegular, resFontSize} from '../../../constants/fonts';
import {food_bg} from '../../../constants/images';

const OnboardingItem = ({item}) => {
  const {width} = useWindowDimensions();
  return (
    <View style={[styles.container, {width}]}>
      <ImageBackground
        style={{
          flex: 0.7,
          width,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        source={food_bg}
        resizeMode="contain">
        <View style={styles.container1}>
          <View style={styles.container2}>
            <MaterialCommunityIcons
              name="silverware-variant"
              size={responsiveWidth(11.11 / 2.5)}
              color="white"
            />
          </View>
          <Image source={item.img} resizeMode="cover" style={styles.image2} />
        </View>
      </ImageBackground>
      <View style={{flex: 0.3, backgroundColor: 'transparent'}}>
        <Text style={styles.title}>{item.title}</Text>
        <Text adjustsFontSizeToFit numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>
      </View>
    </View>
  );
};

export default OnboardingItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.veryLarge,
    marginBottom: responsiveHeight(1),
    marginTop: responsiveHeight(6),
    color: '#000',
    textAlign: 'center',
  },
  description: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.large,
    color: '#000',
    opacity: 0.4,
    textAlign: 'center',
    paddingHorizontal: responsiveWidth(18),
    marginTop: responsiveHeight(2.3),
  },
  container1: {
    backgroundColor: '#F8D57E',
    height: responsiveWidth(60.6),
    width: responsiveWidth(60.6),
    borderRadius: responsiveWidth(60.6),
  },

  container2: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    position: 'absolute',
    bottom: '68%',
    left: '84%',
    zIndex: 999,
    height: responsiveWidth(11.11),
    width: responsiveWidth(11.11),
    borderWidth: responsiveWidth(0.7),
    borderColor: 'white',
    borderRadius: responsiveWidth(11.11 / 2),
  },
  image2: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveWidth(60.6 / 2),
  },
});
