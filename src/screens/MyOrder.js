import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  FlatList,
  StyleSheet,
  Linking,
  ToastAndroid,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import ItemCard from '../component/MyOrder/ItemCard';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  clear_all_of_orders,
  clear_an_item_of_orders,
} from '../../redux/actions';
import {
  fontTypeBold,
  fontTypeRegular,
  resFontSize,
} from '../../constants/fonts';

import axios from 'axios';
import {SkypeIndicator} from 'react-native-indicators';
import BasketIcon from '../component/Home/BasketIcon';
import {Shadow} from 'react-native-neomorph-shadows';
import {ZARINPAL_MERCHANT_ID} from '@env';
import Animated, {RollOutLeft, Layout} from 'react-native-reanimated';

const Top = ({clear, cart}) => {
  return (
    <View style={styles.topMainContainer}>
      <View style={styles.topButtonsContainer}>
        <Pressable
        // onPress={() => {
        //   clear();
        //   showMessage({
        //     message: 'All items deleted from cart',
        //     type: 'info',
        //     icon: 'success',
        //     backgroundColor: 'green',
        //   });
        // }}
        >
          <Text style={styles.clearAllText}>Clear All</Text>
        </Pressable>
        <TouchableOpacity
          hitSlop={{
            bottom: 8,
            left: 25,
            right: 25,
            top: 8,
          }}
          activeOpacity={0.6}
          onPress={() => {
            // LayoutAnimation.configureNext(
            //   LayoutAnimation.create(
            //     300,
            //     LayoutAnimation.Types.easeIn,
            //     LayoutAnimation.Properties.scaleXY,
            //   ),
            // );
            if (cart.length > 0) {
              clear();
              ToastAndroid.show(
                'All items deleted from cart',
                ToastAndroid.LONG,
              );
            }
            // showMessage({
            //   message: 'All items deleted from cart',
            //   type: 'info',
            //   icon: 'success',
            //   backgroundColor: 'green',
            // });
          }}>
          <Text style={styles.crossButton}>×</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.myorderText}>My Orders</Text>
    </View>
  );
};

const Middle = ({cart, clear_an_item_of_orders}) => {
  // const [displacement, setDisplacement] = useState(300*factor);

  return (
    <View style={styles.middleMainContainer}>
      {/* item card */}
      <View
        style={{
          width: '100%',
          height: '100%',
          transform: [{translateX: responsiveWidth(-17 / 2)}],
          backgroundColor: 'white',
          // alignItems: 'flex-start',
          // justifyContent: 'flex-end',
        }}>
        <FlatList
          // layout={Layout.duration(3000)}
          // contentContainerStyle={{marginRight: responsiveWidth(17 / 2)}}
          data={cart}
          renderItem={({item}) => (
            <ItemCard
              name={item.name}
              extra={item.extra}
              number={item.number}
              image={item.picture}
              price={item.price}
              size={item.size}
              clear_an_item_of_orders={clear_an_item_of_orders}
            />
          )}
          keyExtractor={(item, index) => item.id + Math.random().toString(36)}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.middleListEmptyContainer}>
              <Text style={styles.listEmptyText}>Nothing to show !</Text>
            </View>
          }
        />
      </View>
      {/* end of item card */}
    </View>
  );
};

const Bottom = ({totalPrice, cart, navigation}) => {
  const [buyClicked, setBuyClicked] = useState(false);

  const handleNavigateToPayment = async price => {
    if (price !== 0 && price) {
      setBuyClicked(true);

      axios
        .post('https://api.zarinpal.com/pg/v4/payment/request.json', {
          merchant_id: ZARINPAL_MERCHANT_ID,
          amount: price.toFixed(2) * 10000,
          description: 'Payment bill for Happy Restaurant',
          callback_url: 'return://zarinpal',
        })
        .then(async function (response) {
          // console.log('zarrinpal response ===> ', response.data);

          //Put authority at the end of the url and redirect user to the payment gate

          const url = `https://www.zarinpal.com/pg/StartPay/Authority=${response.data.data.authority}`;

          // Checking if the link is supported for links with custom URL scheme.
          // const supported = await Linking.canOpenURL(url);

          // if (supported) {
          //   // Opening the link with some app, if the URL scheme is "http" the web link should be opened
          //   // by some browser in the mobile
          //   await Linking.openURL(url);
          // } else {
          //   // Alert.alert(`Don't know how to open this URL: ${url}`);
          //   ToastAndroid.show('Something went wrong!', ToastAndroid.LONG);
          //   setBuyClicked(false);
          // }

          await Linking.openURL(url);

          //End...
          setBuyClicked(false);
        })
        .catch(function (error) {
          // console.log(error);
          setBuyClicked(false);
          ToastAndroid.show(
            'ZarinPal is not responding. check your connection and try again!',
            ToastAndroid.LONG,
          );
        });
    } else {
      ToastAndroid.show('Order something', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.bottomMainContainer}>
      <View style={styles.bottomInnerContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.bottomPriceText}>Total Price</Text>
          <View style={styles.bottomPriceContainer}>
            <Text
              style={styles.priceText2}
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              selectable={true}
              selectionColor="orange">
              ${totalPrice.toFixed(2).toString().replace('.', ',')}
            </Text>
          </View>
        </View>

        {/* Black Button */}
        <Shadow
          style={{
            shadowOffset: {width: 4, height: 5},
            shadowOpacity: 0.3,
            shadowColor: '#666666',
            shadowRadius: 10,
            height: responsiveHeight(7.8),
            width: responsiveWidth(30),
            borderWidth: 1,
            borderColor: 'white',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            borderRadius: responsiveHeight(7.8),
          }}
          // onStartShouldSetResponder={() => handleNavigateToPayment(totalPrice)}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              borderRadius: responsiveHeight(7.8),
              backgroundColor: 'black',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}
            activeOpacity={cart.length === 0 ? 1 : 0.6}
            onPress={() => handleNavigateToPayment(totalPrice)}>
            {!buyClicked ? (
              <>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.buyNowText}>
                  Buy Now
                </Text>
                <View style={styles.basketContainer}>
                  <View style={styles.basketIconWrapper}>
                    <BasketIcon rotate="0deg" />
                  </View>
                </View>
              </>
            ) : (
              <SkypeIndicator size={30} color="powderblue" />
            )}
          </TouchableOpacity>
        </Shadow>
        {/* End of Black Button */}
      </View>
    </View>
  );
};

// if (
//   Platform.OS === 'android' &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

const MyOrder = ({
  cart,
  clear_all_of_orders,
  clear_an_item_of_orders,
  navigation,
}) => {
  // const [totalPrice, setTotalPrice] = useState(0);
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  // useEffect(() => {
  //   console.log('Cart ====> ', cart);
  //   // setTotalPrice(cart.reduce((total, item) => total + item.price, 0));
  // }, [cart]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Top clear={clear_all_of_orders} cart={cart} />
      <Middle cart={cart} clear_an_item_of_orders={clear_an_item_of_orders} />
      <Bottom totalPrice={totalPrice} navigation={navigation} cart={cart} />
    </View>
  );
};

const mapStateToProps = store => ({
  cart: store.shoppingCartState.cart,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({clear_all_of_orders, clear_an_item_of_orders}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MyOrder);

const styles = StyleSheet.create({
  //Top
  topMainContainer: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
  },

  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: responsiveWidth(83),
  },

  clearAllText: {
    fontFamily: fontTypeRegular,
    color: '#c9c9c9',
    fontSize: resFontSize.bigLarge,
  },

  crossButton: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.veryLarge,
    color: 'black',
  },

  myorderText: {
    fontFamily: fontTypeBold,
    fontSize: resFontSize.veryLarge2,
    color: 'black',
    alignSelf: 'flex-start',
    paddingLeft: responsiveWidth(17 / 2),
  },

  //Middle
  middleMainContainer: {
    flex: 3,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  middleListEmptyContainer: {
    alignSelf: 'center',
    marginTop: responsiveHeight(16),
    marginLeft: responsiveWidth(10),
  },

  listEmptyText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.veryLarge,
    color: 'gray',
  },

  itemContainer: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    width: responsiveWidth(100) * 1.27,
    flexDirection: 'row',
  },

  itemInnerContainer: {
    backgroundColor: '#fafbfd',
    borderRadius: responsiveWidth(2.7),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: responsiveWidth(83),
    height: responsiveHeight(13.2),
    // transform:[{translateX:-100}]
  },

  itemInnerContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: responsiveWidth(46),
  },

  itemImageContainer: {
    width: responsiveWidth(19.4),
    height: responsiveWidth(19.4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(19.4) / 2,
    backgroundColor: 'transparent',
  },

  itemImage: {
    width: '85%',
    height: '85%',
    borderRadius: responsiveWidth(19.4) / 2,
  },

  itemName: {
    fontFamily: fontTypeRegular,
    fontSize: responsiveFontSize(2),
  },

  itemExtra: {
    fontFamily: fontTypeRegular,
    fontSize: responsiveFontSize(1.3),
    color: '#9c9c9c',
    marginTop: responsiveHeight(0.7),
  },

  itemPrice: {
    fontFamily: fontTypeBold,
    fontSize: responsiveFontSize(2.2),
    marginTop: responsiveHeight(0.9),
  },

  itemNumberContainer: {
    width: responsiveWidth(13.8),
    height: responsiveWidth(13.8),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(13.8) / 2,
    backgroundColor: 'white',
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
    marginLeft: responsiveWidth(1.3),
  },

  //Bottom
  bottomMainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  bottomInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: responsiveWidth(83),
    // backgroundColor: 'powderblue',
  },

  priceContainer: {
    width: responsiveWidth(35),
    height: responsiveHeight(7.8),
    justifyContent: 'space-between',
    // backgroundColor: 'white',
  },

  bottomPriceText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.large,
    color: '#00000055',
  },

  bottomPriceContainer: {
    width: '100%',
    // height: responsiveHeight(7.8),
    justifyContent: 'center',
    // backgroundColor: 'yellow',
  },

  priceText2: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.bigLarge,
    color: 'black',
  },

  bottomButtonBuyContainer: {
    height: responsiveHeight(7.8),
    width: responsiveWidth(30),
    borderWidth: 1,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'black',
    borderRadius: responsiveHeight(7.8),
  },

  buyNowText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.smallLarge,
    color: 'white',
  },

  basketContainer: {
    width: responsiveHeight(4),
    height: responsiveHeight(4),
    borderRadius: responsiveHeight(4 / 2),
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFDA80',
  },

  basketIconWrapper: {
    width: responsiveHeight(2.6),
    height: responsiveHeight(2.6),
    borderRadius: responsiveHeight(2.6),
  },
});
