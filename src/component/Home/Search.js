import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {FloatingLabelInput} from 'react-native-floating-label-input';
// import {SkypeIndicator} from 'react-native-indicators';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Shadow} from 'react-native-neomorph-shadows';
import {
  fontTypeBold,
  fontTypeRegular,
  resFontSize,
} from '../../../constants/fonts';
import {connect} from 'react-redux';
import Card from './Card';
import BasketIcon from './BasketIcon';

const Search = ({
  backToHome,
  colapseSearchField,
  searchedData,
  navigation,
  keyWord,
  cart,
}) => {
  const [data, setData] = useState(searchedData);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [filterClicked, setFilterClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(searchedData);
  }, [searchedData]);

  const handlePriceFilter = () => {
    // console.log(searchedData);
    // console.log(searchedData.length);
    if (min.length > 0 && max.length > 0) {
      // setLoading(true);
      setData(
        searchedData.filter(
          item =>
            item.price >= parseFloat(min) && item.price <= parseFloat(max),
        ),
      );
      // setLoading(false);
    }
  };

  const handleClearFilter = () => {
    // setLoading(true);
    setData(searchedData);
    // setLoading(false);
  };

  const handleFilterClick = () => {
    setFilterClicked(!filterClicked);
  };

  return (
    <View style={{flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingRight: responsiveWidth(5),
          paddingLeft: responsiveWidth(2),
          marginTop: responsiveHeight(2),
          //   backgroundColor: 'pink',
        }}>
        <TouchableOpacity
          onPress={() => {
            colapseSearchField(true);
            backToHome('');
          }}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={responsiveHeight(3 * 1.4)}
            color="gray"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleFilterClick}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: responsiveWidth(8),
            height: responsiveWidth(8),
            borderRadius: responsiveWidth(8),
            // borderLeftWidth: 3,
            // borderLeftColor: '#F0F0F0',
            // backgroundColor: 'pink',
          }}>
          <MaterialCommunityIcons
            name="tune"
            size={responsiveHeight(3 * 1.4)}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* filter price goes here */}
      {filterClicked && (
        <View style={styles.filterContainer}>
          <Text
            style={{
              fontFamily: fontTypeRegular,
              fontSize: resFontSize.bigLarge,
              color: 'black',
            }}>
            Filter by price
          </Text>
          <View style={styles.minMaxContainer}>
            <View style={styles.bandContainer}>
              <Text
                style={{
                  fontFamily: fontTypeRegular,
                  fontSize: resFontSize.large,
                }}>
                Min
              </Text>
              <View
                style={{
                  height: '100%',
                  width: responsiveWidth(20),
                  // backgroundColor: 'pink',
                  borderRadius: 500,
                }}>
                <FloatingLabelInput
                  staticLabel
                  keyboardType="decimal-pad"
                  hint="$7"
                  maxDecimalPlaces={2}
                  hintTextColor="gray"
                  containerStyles={{
                    // borderWidth: 1,
                    backgroundColor: '#FAFBFD',
                    // alignItems: 'flex-end',
                    paddingLeft: '50%',
                  }}
                  inputStyles={{
                    fontSize: resFontSize.large,
                    textAlign: 'left',
                  }}
                  isPassword={false}
                  value={min}
                  onChangeText={txt => setMin(txt)}
                />
              </View>
            </View>

            <View style={styles.bandContainer}>
              <Text
                style={{
                  fontFamily: fontTypeRegular,
                  fontSize: resFontSize.large,
                }}>
                Max
              </Text>
              <View
                style={{
                  height: '100%',
                  width: responsiveWidth(20),
                  // backgroundColor: 'pink',
                  borderRadius: 500,
                }}>
                <FloatingLabelInput
                  staticLabel
                  keyboardType="decimal-pad"
                  hint="$20"
                  hintTextColor="gray"
                  containerStyles={{
                    // borderWidth: 1,
                    backgroundColor: '#FAFBFD',
                    // alignItems: 'flex-end',
                    paddingLeft: '50%',
                  }}
                  inputStyles={{
                    fontSize: resFontSize.large,
                    textAlign: 'left',
                  }}
                  isPassword={false}
                  value={max}
                  onChangeText={txt => setMax(txt)}
                />
              </View>
            </View>
          </View>
          <View
            style={styles.applyAndClearButtonContainer}
            onPress={handlePriceFilter}>
            <TouchableOpacity onPress={handlePriceFilter} style={styles.button}>
              <Text
                style={{
                  fontFamily: fontTypeRegular,
                  fontSize: resFontSize.bigLarge,
                  color: 'white',
                }}>
                Apply
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleClearFilter} style={styles.button}>
              <Text
                style={{
                  fontFamily: fontTypeRegular,
                  fontSize: resFontSize.bigLarge,
                  color: 'white',
                }}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View
        style={{
          width: '100%',
          paddingHorizontal: responsiveWidth(4),
          marginTop: responsiveHeight(3),
        }}>
        <Text
          style={{
            fontFamily: fontTypeRegular,
            fontSize: resFontSize.veryLarge,
          }}>{`"${keyWord}"`}</Text>
        <Text
          style={{fontFamily: fontTypeBold, fontSize: resFontSize.veryLarge}}>
          {data.length === 0
            ? 'Nothing found!'
            : data.length === 1
            ? '1 item found'
            : `${data.length} items found`}
        </Text>
      </View>
      <FlatList
        contentContainerStyle={{
          marginTop: responsiveHeight(3),
          paddingLeft: responsiveWidth(3),
          paddingBottom: responsiveHeight(4),
        }}
        data={data}
        renderItem={({item}) => (
          <Card
            type="search"
            idd={item.id}
            calories={item.calories}
            extra={item.extra}
            name={item.name}
            image={{uri: item.picurl}}
            price={item.price}
            navigation={navigation}
            foodType={item.foodType}
          />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        // horizontal
        showsVerticalScrollIndicator={false}
        key={item => item.id}
      />

      {/* {Basket} */}

      {/* <Shadow
        style={{
          shadowOffset: {width: 5, height: 5},
          shadowRadius: 2.5,
          shadowColor: '#00000005',
          shadowOpacity: 0.16,
          // backgroundColor: '#fafbfd',
          position: 'absolute',
          zIndex: 10,
          // top: responsiveHeight(85),
          bottom: responsiveHeight(3),
          right:
            cart.length === 0
              ? responsiveWidth(50 - 25 / 2)
              : responsiveWidth(50 - 35 / 2),
          // paddingHorizontal: responsiveWidth(5.5),
          // flexDirection: 'row',
          alignItems: 'center',
          // alignSelf: 'center',
          // justifyContent: 'space-between',
          // width: responsiveWidth(35),
          height: responsiveHeight(8),
          borderRadius: responsiveHeight(10),
          borderWidth: 1.5,
          borderColor: 'white',
          backgroundColor: 'black',
          justifyContent: 'center',
          width: cart.length === 0 ? responsiveWidth(25) : responsiveWidth(35),
        }}> */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          zIndex: 10,
          bottom: responsiveHeight(3),
          right:
            cart.length === 0
              ? responsiveWidth(50 - 25 / 2)
              : responsiveWidth(50 - 35 / 2),
          height: responsiveHeight(8),
          width: cart.length === 0 ? responsiveWidth(25) : responsiveWidth(35),
          borderRadius: responsiveHeight(10),
          paddingHorizontal: responsiveWidth(5.5),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: cart.length === 0 ? 'center' : 'space-between',
          backgroundColor: 'black',
          borderWidth: 1.5,
          borderColor: 'white',
        }}
        onPress={() => navigation.navigate('My orders')}
        activeOpacity={0.6}>
        <View style={styles.basketIconContainer}>
          {cart.length !== 0 && <View style={styles.itemExistanceIndicator} />}
          <View style={styles.basketIconWrapper}>
            <BasketIcon rotate="-45deg" />
          </View>
        </View>
        {cart.length !== 0 ? (
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              color: 'white',
              fontFamily: fontTypeRegular,
              fontSize: resFontSize.large,
            }}>
            {cart.length === 1 ? `${cart.length} item` : `${cart.length} items`}
          </Text>
        ) : null}
      </TouchableOpacity>
      {/* </Shadow> */}

      {/* {Basket end} */}
    </View>
  );
};

const mapStateToProps = store => ({
  cart: store.shoppingCartState.cart,
});

export default connect(mapStateToProps, null)(Search);

const styles = StyleSheet.create({
  filterContainer: {
    width: responsiveWidth(94),
    height: responsiveHeight(16),
    justifyContent: 'space-between',
    marginTop: responsiveHeight(3),
    // backgroundColor: 'pink',
  },
  minMaxContainer: {
    flexDirection: 'row',
    width: '100%',
    height: responsiveHeight(6),
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'powderblue',
  },
  bandContainer: {
    flexDirection: 'row',
    width: responsiveWidth(40),
    height: '100%',
    borderRadius: 500,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    backgroundColor: '#FAFBFD',
  },
  input: {
    width: 5,
    height: '100%',
    borderWidth: 1,
    // paddingHorizontal: responsiveWidth(2),
  },
  applyAndClearButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    height: responsiveHeight(6),
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: responsiveHeight(6),
  },
  button: {
    width: '48%',
    height: '100%',
    borderRadius: responsiveHeight(5),
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  basketIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveHeight(4.5),
    height: responsiveHeight(4.5),
    borderRadius: responsiveHeight(4.5),
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '#FFDA80',
    transform: [{rotate: '45deg'}],
  },

  basketIconWrapper: {
    width: responsiveHeight(2.6),
    height: responsiveHeight(2.6),
    borderRadius: responsiveHeight(2.6),
  },

  itemExistanceIndicator: {
    width: responsiveHeight(1),
    height: responsiveHeight(1),
    borderRadius: responsiveHeight(1),
    position: 'absolute',
    backgroundColor: 'red',
    top: responsiveHeight(-1 / 2),
    zIndex: 10000,
  },
});
