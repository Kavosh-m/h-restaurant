import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {change_number_of_item_in_cart} from '../../../redux/actions';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {
  fontTypeBold,
  fontTypeRegular,
  resFontSize,
} from '../../../constants/fonts';
import {Shadow} from 'react-native-neomorph-shadows';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import RightAction from './RightAction';
import Animated, {RollOutLeft} from 'react-native-reanimated';

const NumberIndicator = ({numberr, name, size, setNumberr, changeNumber}) => {
  const handleIncrement = () => {
    setNumberr(numberr + 1);
    changeNumber(name, numberr + 1, size);
  };

  const handleDecrement = () => {
    if (numberr > 1) {
      setNumberr(numberr - 1);
      changeNumber(name, numberr - 1, size);
    }
  };

  return (
    <View style={styles.numberIndicatorBigCircle}>
      <Text style={styles.numOfItemText}>{numberr}</Text>
      <Shadow
        style={{
          shadowOffset: {width: 5, height: 4},
          shadowOpacity: 0.1,
          shadowColor: 'grey',
          shadowRadius: 2,
          position: 'absolute',
          right: responsiveWidth(-1),
          top: responsiveHeight(9 / 1.8),
          width: responsiveHeight(8 / 2),
          height: responsiveHeight(8 / 2),
          borderRadius: responsiveHeight(8 / 4),
          backgroundColor: '#FAFBFD',
          // backgroundColor: 'powderblue',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
        <TouchableOpacity
          hitSlop={{
            bottom: 10,
            left: 20,
            right: 20,
            top: 0,
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: responsiveHeight(8 / 4),
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            elevation: 1,
          }}
          activeOpacity={numberr > 1 ? 0.6 : 1}
          onPress={handleDecrement}>
          <Text style={styles.decreamentText}>−</Text>
        </TouchableOpacity>
      </Shadow>
      <Shadow
        style={{
          shadowOffset: {width: 5, height: 4},
          shadowOpacity: 0.1,
          shadowColor: 'grey',
          shadowRadius: 2,
          position: 'absolute',
          right: responsiveWidth(-1),
          top: 0,
          width: responsiveHeight(8 / 2),
          height: responsiveHeight(8 / 2),
          borderRadius: responsiveHeight(8 / 4),
          backgroundColor: '#FAFBFD',
          // backgroundColor: 'powderblue',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          hitSlop={{
            bottom: 0,
            left: 20,
            right: 20,
            top: 10,
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: responsiveHeight(8 / 4),
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            elevation: 1,
          }}
          onPress={handleIncrement}>
          <Text style={styles.decreamentText}>+</Text>
        </TouchableOpacity>
      </Shadow>
    </View>
  );
};

const ItemCard = ({
  name,
  extra,
  number,
  size,
  image,
  price,
  clear_an_item_of_orders,
  change_number_of_item_in_cart,
}) => {
  const [numberr, setNumberr] = useState(number);

  return (
    <Swipeable
      renderRightActions={() => (
        <RightAction
          name={name}
          size={size}
          onPress={clear_an_item_of_orders}
        />
      )}>
      <View style={styles.itemContainer}>
        <View style={styles.itemInnerContainer}>
          <View style={styles.itemInnerContainer2}>
            <View style={styles.itemImageContainer}>
              <View
                style={{
                  width: responsiveWidth(6),
                  height: responsiveWidth(6),
                  borderRadius: responsiveWidth(6),
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#001a09',
                  position: 'absolute',
                  top: responsiveWidth(10 - 3),
                  right: responsiveWidth(-3 / 2),
                  zIndex: 10,
                }}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    color: 'white',
                    fontFamily: fontTypeRegular,
                    fontSize: resFontSize.veryLarge,
                    transform: [{rotate: '135deg'}],
                  }}>{`${size[0].toUpperCase()}`}</Text>
              </View>
              <Image
                source={image}
                resizeMode="cover"
                style={styles.itemImage}
              />
            </View>
            <View
              style={{
                width: '58%',
                height: '100%',
                justifyContent: 'space-evenly',
                // backgroundColor: 'powderblue',
              }}>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'space-around',
                  // backgroundColor: 'yellow',
                }}>
                <Text
                  style={styles.itemName}
                  numberOfLines={1}
                  adjustsFontSizeToFit>{`${name}`}</Text>
                <Text
                  style={styles.itemExtra}
                  numberOfLines={1}
                  adjustsFontSizeToFit>
                  {extra}
                </Text>
              </View>
              <Text
                style={styles.itemPrice}
                numberOfLines={1}
                adjustsFontSizeToFit>
                {`$${price.toFixed(2).toString().replace('.', ',')}`}
              </Text>
            </View>
          </View>

          {/* <View style={styles.itemNumberContainer}>
            <Text style={styles.itemNumberText}>{number}</Text>
          </View> */}
          <NumberIndicator
            name={name}
            numberr={numberr}
            size={size}
            setNumberr={setNumberr}
            changeNumber={change_number_of_item_in_cart}
          />
        </View>
      </View>
    </Swipeable>
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({change_number_of_item_in_cart}, dispatch);

export default connect(null, mapDispatchToProps)(ItemCard);

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#ffffff',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    width: responsiveWidth(91.5),
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginBottom: responsiveHeight(2),
  },

  itemInnerContainer: {
    backgroundColor: '#00000009',
    borderRadius: responsiveWidth(4),
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: responsiveWidth(83),
    height: responsiveHeight(13.2),
    // elevation: 1,
    // marginRight: responsiveWidth(8),
    // transform: [{translateX: 60}],
  },

  itemInnerContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: responsiveWidth(55),
    // backgroundColor: 'pink',
    // paddingRight: responsiveWidth(5),
  },

  itemImageContainer: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(20 / 2),
    backgroundColor: 'transparent',
    transform: [{rotate: '-135deg'}],
    // marginRight: responsiveWidth(5),
  },

  itemImage: {
    width: '85%',
    height: '85%',
    borderRadius: responsiveWidth(19.4) / 2,
    transform: [{rotate: '135deg'}],
  },

  itemName: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.bigLarge,
    color: 'black',
  },

  itemExtra: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.smallLarge,
    color: '#9c9c9c',
    // marginTop: responsiveHeight(0.7),
  },

  itemPrice: {
    fontFamily: fontTypeRegular,
    color: 'black',
    fontSize: resFontSize.bigLarge,
    // marginTop: responsiveHeight(0.9),
  },

  itemNumberContainer: {
    width: responsiveWidth(13.8),
    height: responsiveWidth(13.8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(13.8) / 2,
    backgroundColor: 'pink',
    marginLeft: responsiveWidth(14),
    marginRight: responsiveWidth(7),
  },

  itemNumberText: {
    fontFamily: fontTypeRegular,
    fontSize: responsiveFontSize(2),
  },

  itemRemoveButtonContainer: {
    width: responsiveWidth(13.8),
    height: responsiveWidth(13.8),
    borderRadius: responsiveWidth(13.8) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    // marginLeft: responsiveWidth(1.3),
    // marginRight: responsiveWidth(10),
  },

  numberIndicatorBigCircle: {
    width: responsiveWidth(19),
    height: responsiveHeight(9),
    borderRadius: responsiveHeight(9),
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: responsiveWidth(4),
    backgroundColor: '#ffffff',
    // elevation: 1,
    // backgroundColor: 'pink',
    // borderWidth: 1,
    // borderColor: 'white',
  },
  numOfItemText: {
    fontFamily: fontTypeBold,
    fontSize: resFontSize.bigLarge,
    fontWeight: '800',
    color: 'black',
    // alignSelf: 'center',
    // marginTop: responsiveHeight(3.5),
    // marginRight: responsiveWidth(3),
  },
  decreamentText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.bigLarge,
    color: '#000000',
  },
});
