import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SkypeIndicator} from 'react-native-indicators';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetch_user_address} from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {fontTypeBold, fontTypeRegular} from '../../constants/fonts';
import Card from '../component/Home/Card';
import Search from '../component/Home/Search';
import MenuIcon from '../component/Home/MenuIcon';
import SearchIcon from '../component/Home/SearchIcon';
import BasketIcon from '../component/Home/BasketIcon';
import {resFontSize} from '../../constants/fonts';
import {MAPBOX_PUBLIC_ACCESS_TOKEN} from '@env';
import {FloatingLabelInput} from 'react-native-floating-label-input';
// import Animated, {
//   FadeOutUp,
//   FlipOutXDown,
//   SlideInUp,
//   SlideOutDown,
//   SlideOutUp,
//   ZoomOutDown,
//   ZoomOutUp,
// } from 'react-native-reanimated';

const ACCESS_TOKEN = MAPBOX_PUBLIC_ACCESS_TOKEN;

const HeaderMainState = ({navigation, handleSearchButton}) => {
  return (
    <View style={styles.searchBarContainer}>
      <TouchableOpacity
        style={{
          width: responsiveHeight(3),
          height: responsiveHeight(3),
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        hitSlop={{
          top: responsiveHeight(2),
          bottom: responsiveHeight(2),
          left: responsiveWidth(7),
          right: responsiveWidth(7),
        }}
        onPress={() => navigation.toggleDrawer()}>
        <MenuIcon />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          height: responsiveWidth(8),
          width: responsiveWidth(8),
          // backgroundColor: 'pink',
          borderRadius: responsiveWidth(8),
          alignItems: 'center',
          justifyContent: 'space-between',
          borderLeftWidth: 3,
          borderLeftColor: '#F0F0F0',
        }}>
        <TouchableOpacity
          style={{
            height: responsiveHeight(3),
            width: responsiveHeight(3),
            borderRadius: responsiveHeight(3.5),
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            right: 0,
            // backgroundColor: 'powderblue',
          }}
          hitSlop={{
            top: responsiveHeight(2),
            bottom: responsiveHeight(2),
            left: responsiveWidth(5),
            right: responsiveWidth(5),
          }}
          onPress={handleSearchButton}>
          <SearchIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HeaderSearchState = ({
  handleSearchButton,
  search,
  setSearch,
  isSearchClicked,
}) => {
  // const [tempSearch, setTempSearch] = useState('');
  // const handleSearchEvent = eve => {
  //   if (tempSearch.length > 0) {
  //     setTempSearch(eve.nativeEvent.text);
  //     setSearch(tempSearch);
  //   }
  // };
  return (
    <View
      style={[
        styles.searchBarContainer,
        {
          paddingHorizontal: responsiveWidth(3),
          borderBottomWidth: 1,
          borderBottomColor: '#F0F0F0',
          marginTop: 0,
          height: responsiveHeight(8),
          // backgroundColor: 'pink',
        },
      ]}>
      <TouchableOpacity
        onPress={handleSearchButton}
        hitSlop={{top: 3, bottom: 3, left: 10, right: 0}}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={responsiveHeight(3 * 1.4)}
          color="gray"
        />
      </TouchableOpacity>
      <TextInput
        placeholder="Search..."
        placeholderTextColor="gray"
        autoFocus={isSearchClicked ? true : false}
        returnKeyType="search"
        onSubmitEditing={({nativeEvent}) => setSearch(nativeEvent.text)}
        style={{
          width: responsiveWidth(85),
          height: responsiveHeight(5),
          paddingVertical: responsiveHeight(0.5),
          paddingHorizontal: responsiveWidth(5),
          borderRadius: responsiveHeight(5),
        }}
      />
      {/* <View
        style={{
          width: responsiveWidth(85),
          height: '100%',
          // paddingVertical: responsiveHeight(0.5),
          paddingHorizontal: responsiveWidth(2),
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'pink',
        }}>
        <FloatingLabelInput
          staticLabel
          hint="Search..."
          hintTextColor="gray"
          autoFocus={isSearchClicked ? true : false}
          autoCorrect={false}
          // returnKeyType="search"
          // value={search}
          // onChangeText={txt => setSearch(txt)}
          containerStyles={{
            backgroundColor: 'transparent',
            height: '100%',
          }}
          inputStyles={{
            fontFamily: fontTypeRegular,
            fontSize: resFontSize.large,
            color: 'black',
          }}
          // isPassword={false}
          value={search}
          onSubmitEditing={({nativeEvent}) => setSearch(nativeEvent.text)}
        />
      </View> */}
    </View>
  );
};

// if (
//   Platform.OS === 'android' &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

const FoodList = ({
  navigation,
  cart,
  pizza,
  burger,
  pasta,
  drink,
  fetch_user_address,
}) => {
  const [data, setData] = useState();
  const [tempCategory, setTempCategory] = useState({
    burger: null,
    pizza: null,
    pasta: null,
    drink: null,
  });
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState();
  const [suggestionData, setSuggestionData] = useState([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [searchedData, setSearchedData] = useState(null);
  const [searchComplete, setSearchComplete] = useState(false);
  const [ready, setReady] = useState(false);

  // console.log('Google user info ===> ', auth().currentUser.displayName);
  // console.log('Google user info ===> ', auth().currentUser.email);
  // console.log('Google user info ===> ', auth().currentUser.phoneNumber);
  // console.log('Google user info ===> ', auth().currentUser.photoURL);

  const categories = [
    {key: '2', title: 'Burger'},
    {key: '3', title: 'Pizza'},
    {key: '4', title: 'Pasta'},
    {key: '5', title: 'Drink'},
  ];

  // Add food type to each item
  const addFoodTypeToEachFood = (foodList, type) => {
    let newList = [];
    foodList?.map(v => newList.push({...v, foodType: type}));
    return newList;
  };

  useEffect(() => {
    if (burger && pizza && pasta && drink) {
      // setData([
      //   {title: 'Burgers', data: addFoodTypeToEachFood(burger, 'burger')},
      //   {title: 'Pizzas', data: addFoodTypeToEachFood(pizza, 'pizza')},
      // ]);

      // console.log('foodlist pasta ===> ', pasta);

      let arr1 = addFoodTypeToEachFood(burger, 'burger');
      let arr2 = addFoodTypeToEachFood(pizza, 'pizza');
      let arr3 = addFoodTypeToEachFood(pasta, 'pasta');
      // console.log('zzzzzz =====> ', arr3);
      let arr4 = addFoodTypeToEachFood(drink, 'drink');

      let combinedArrays = arr1.concat(arr2, arr3, arr4);
      // console.log('zzzzzz =====> ', combinedArrays);

      // setTempCategory((tempCategory.pizza = arr2));
      // setTempCategory((tempCategory.pasta = arr3));
      // setTempCategory((tempCategory.drink = arr4));

      setData(combinedArrays);

      setFilteredData(arr1);

      setTempCategory({
        ...tempCategory,
        burger: arr1,
        pizza: arr2,
        pasta: arr3,
        drink: arr4,
      });

      // console.log('temp =====> ', tempCategory);
      // console.log(
      //   `All Data : \n${data}\n*************************************************************`,
      // );
    }
  }, [burger, pizza, pasta, drink]);

  useEffect(() => {
    if (data) {
      // console.log('data ===> ', data);
      setSearchedData(
        data.filter(item =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
      // console.log('searched data ===> ', searchedData);
      setSearchComplete(true);
    }
  }, [search, burger, data]);

  const handleCategoryTabMenu = category => {
    // let temp = {a: null, b: 'null', c: 'null', d: 'null'};
    // console.log('temp.a ===> ', !temp['k']);

    setFilteredData(tempCategory[category.toLowerCase()]);

    // setFilteredData(
    //   data.filter(item => item.foodType === category.toLowerCase()),
    // );
  };

  useEffect(() => {
    if (data) {
      setSuggestionData([data[0], data[data.length - 1]]);
      // console.log(suggestionData);
    }
  }, [data]);

  const handleSearchButton = () => {
    // LayoutAnimation.configureNext(
    //   LayoutAnimation.create(
    //     400,
    //     LayoutAnimation.Types.easeIn,
    //     LayoutAnimation.Properties.scaleXY,
    //   ),
    // );

    setIsSearchClicked(!isSearchClicked);
  };

  // Location permission and fetching stuff, goes here

  const geo_success = async position => {
    // console.log('posi ***** ==>   ', position);

    setReady(true);

    //**********************************************

    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${ACCESS_TOKEN}`;
    axios
      .get(url)
      .then(({data}) => {
        fetch_user_address(
          data.features[0].place_name.slice(
            0,
            data.features[0].place_name.lastIndexOf(','),
          ),
        );
        setReady(true);
      })
      .catch(err => {
        // console.log('errrrrrrorr ====>  ', err);
        ToastAndroid.show(
          'Fetching address is not possible! check your connection',
          ToastAndroid.LONG,
        );
        setReady(true);
      });

    //Set Lat and Long in async storage
    AsyncStorage.setItem(
      '@coordinates',
      `{"latitude":${position.coords.latitude},"longitude":${position.coords.longitude}}`,
    );

    //**********************************************
  };

  // get called when location not retrieved
  const geo_failure = err => {
    // console.log('******^^^^  ', err);
    ToastAndroid.show(
      'Fetching address is not possible! check your connection',
      ToastAndroid.LONG,
    );
  };

  const handleLocationPermission = async () => {
    //Handle location permission first
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Device location Permission',
        message: 'This App needs access to your location',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      let geoOptions = {
        enableHighAccuracy: true,
        timeOut: 60000,
        maximumAge: 60 * 60 * 24,
      };
      Geolocation.getCurrentPosition(geo_success, geo_failure, geoOptions);
    } else {
      const async_coord = await AsyncStorage.getItem('@coordinates');
      if (async_coord) {
        AsyncStorage.removeItem('@coordinates');
      }
    }
  };

  useEffect(() => {
    handleLocationPermission();
  }, []);

  // ************************************************************

  if (search.length > 0 && searchComplete) {
    return (
      <Search
        backToHome={setSearch}
        keyWord={search}
        colapseSearchField={setIsSearchClicked}
        searchedData={searchedData}
        navigation={navigation}
      />
    );
  } else if (data) {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {isSearchClicked ? (
          <HeaderSearchState
            handleSearchButton={handleSearchButton}
            search={search}
            setSearch={setSearch}
            isSearchClicked={isSearchClicked}
          />
        ) : (
          <HeaderMainState
            navigation={navigation}
            handleSearchButton={handleSearchButton}
          />
        )}

        <View
          style={{
            width: '100%',
            paddingHorizontal: responsiveWidth(12 / 2),
            marginVertical: responsiveHeight(4),
            // backgroundColor: 'pink',
          }}>
          <Text
            style={{
              fontFamily: fontTypeRegular,
              fontSize: resFontSize.veryLarge2,
              color: '#9c9c9c',
            }}>
            Food
          </Text>
          <Text
            style={{
              fontFamily: fontTypeBold,
              fontSize: resFontSize.veryLarge2,
              color: 'black',
            }}>
            Special for you
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* {Food categories tab menu} */}
          <FlatList
            data={categories}
            keyExtractor={item => item.key}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              width: '100%',
              // marginTop: responsiveHeight(4),
              paddingHorizontal: responsiveWidth(12 / 2),
              // backgroundColor: 'pink',
              zIndex: 10,
            }}
            horizontal
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    height: responsiveHeight(5),
                    alignItems: 'center',
                    justifyContent:
                      filteredData[0].foodType === item.title.toLowerCase()
                        ? 'space-around'
                        : 'space-evenly',
                    backgroundColor: 'white',
                    marginRight: responsiveWidth(6),
                  }}>
                  <TouchableOpacity
                    hitSlop={{
                      top: 13,
                      bottom: 13,
                      left: 3,
                      right: 3,
                    }}
                    onPress={() => handleCategoryTabMenu(item.title)}
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text
                      style={{
                        fontFamily:
                          filteredData[0].foodType === item.title.toLowerCase()
                            ? fontTypeBold
                            : fontTypeRegular,
                        fontSize:
                          filteredData[0].foodType === item.title.toLowerCase()
                            ? resFontSize.bigLarge
                            : resFontSize.large,
                        color:
                          filteredData[0].foodType === item.title.toLowerCase()
                            ? 'black'
                            : '#9c9c9c',
                      }}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      width: '30%',
                      height: responsiveHeight(1),
                      backgroundColor:
                        filteredData[0].foodType === item.title.toLowerCase()
                          ? '#EFC151'
                          : 'white',
                      borderRadius: responsiveHeight(1),
                    }}
                  />
                </View>
              );
            }}
          />

          {/* {Food campaigns list} */}
          <FlatList
            contentContainerStyle={{
              paddingLeft: responsiveWidth(12 / 2),
              paddingRight: responsiveWidth(0),
            }}
            data={filteredData}
            renderItem={({item}) => (
              <Card
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
            horizontal
            showsHorizontalScrollIndicator={false}
            key={item => item.id}
          />
          <View
            style={{
              width: '100%',
              paddingHorizontal: responsiveWidth(12 / 2),
              marginTop: responsiveHeight(4),
              // backgroundColor: 'pink',
            }}>
            <Text
              style={{
                fontFamily: fontTypeBold,
                fontSize: resFontSize.veryLarge2,
                color: 'black',
              }}>
              Today's suggestion
            </Text>
          </View>
          {suggestionData && (
            <FlatList
              contentContainerStyle={{
                paddingLeft: responsiveWidth(12 / 2),
                paddingRight: responsiveWidth(0),
              }}
              data={suggestionData}
              renderItem={({item}) => (
                <Card
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
              horizontal
              showsHorizontalScrollIndicator={false}
              // key={item => item.id}
            />
          )}
        </ScrollView>

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
            width:
              cart.length === 0 ? responsiveWidth(25) : responsiveWidth(35),
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
            width:
              cart.length === 0 ? responsiveWidth(25) : responsiveWidth(35),
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
            {cart.length !== 0 && (
              <View style={styles.itemExistanceIndicator} />
            )}
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
              {cart.length === 1
                ? `${cart.length} item`
                : `${cart.length} items`}
            </Text>
          ) : null}
        </TouchableOpacity>
        {/* </Shadow> */}
        {/* {Basket end} */}
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
        }}>
        <SkypeIndicator size={60} color="black" />
      </View>
    );
  }
};

const mapStateToProps = store => ({
  cart: store.shoppingCartState.cart,
  burger: store.foodState.burger,
  pizza: store.foodState.pizza,
  pasta: store.foodState.pasta,
  drink: store.foodState.drink,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({fetch_user_address}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FoodList);

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderWidth: 1,
    // borderRadius: responsiveWidth(5),
    width: responsiveWidth(100),
    paddingHorizontal: responsiveWidth(12 / 2),
    marginTop: responsiveHeight(3),
    // backgroundColor: 'pink',
  },

  searchInput: {
    height: responsiveHeight(7),
    width: responsiveWidth(72),
    padding: responsiveWidth(2),
    borderColor: 'black',
  },

  searchIconContainer: {
    height: responsiveHeight(7),
    width: responsiveHeight(7),
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },

  basketContainer: {
    position: 'absolute',
    zIndex: 999,
    // top: responsiveHeight(85),
    bottom: responsiveHeight(3),
    // right: responsiveWidth(30),
    paddingHorizontal: responsiveWidth(5.5),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    width: responsiveWidth(35),
    height: responsiveHeight(8),
    borderRadius: responsiveHeight(10),
    backgroundColor: 'black',
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

  searchResultText: {
    fontFamily: fontTypeRegular,
    fontSize: responsiveFontSize(2.5),
    fontWeight: '100',
    alignSelf: 'flex-start',
    marginLeft: responsiveWidth(9),
    marginTop: responsiveHeight(4.5),
    color: 'black',
  },
});
