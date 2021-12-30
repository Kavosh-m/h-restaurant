import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import Campaign from '../component/FoodCampaign/Campaign';
import {
  fontTypeBold,
  fontTypeRegular,
  resFontSize,
} from '../../constants/fonts';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
// import {Shadow} from 'react-native-neomorph-shadows';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BasketIcon from '../component/Home/BasketIcon';
import SearchIcon from '../component/Home/SearchIcon';
import MenuIcon from '../component/Home/MenuIcon';
import Search from '../component/Home/Search';

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
            borderRadius: responsiveHeight(3),
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
  setSearch,
  isSearchClicked,
}) => {
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
    </View>
  );
};

// if (
//   Platform.OS === 'android' &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

const FoodCampaign = ({navigation, cart, burger, pizza, pasta, drink}) => {
  const [data, setData] = useState();
  const [search, setSearch] = useState('');
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [searchedData, setSearchedData] = useState(null);
  const [searchComplete, setSearchComplete] = useState(false);

  // Add food type to each item
  const addFoodTypeToEachFood = (foodList, type) => {
    let newList = [];
    foodList?.map(v => newList.push({...v, foodType: type}));
    return newList;
  };

  // Get n number of items from an array, randomly
  const getRandom = (arr, n) => {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError('getRandom: more elements taken than available');
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  };

  useEffect(() => {
    if (burger && pizza && pasta && drink) {
      let arr1 = addFoodTypeToEachFood(burger, 'burger');
      let arr2 = addFoodTypeToEachFood(pizza, 'pizza');
      let arr3 = addFoodTypeToEachFood(pasta, 'pasta');
      let arr4 = addFoodTypeToEachFood(drink, 'drink');

      let d = arr1.concat(arr2, arr3);

      d = getRandom(d, 8);
      setData(d);
    }
    // console.log(`getRandom ==> `, getRandom(['a', 'b', 'c', 'd', 'e'], 2));
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
  }

  return (
    <View style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
      {isSearchClicked ? (
        <HeaderSearchState
          handleSearchButton={handleSearchButton}
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
          marginTop: responsiveHeight(3),
          marginBottom: responsiveHeight(3),
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
          Campaigns
        </Text>
      </View>

      {/* {Food campaigns list} */}
      <FlatList
        data={data}
        renderItem={({item}) => (
          <Campaign
            id={item.id}
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
        // ListFooterComponent={() => <View style={{height: 150 * factor}}></View>}
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{paddingVertical:100}}
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
  burger: store.foodState.burger,
  pizza: store.foodState.pizza,
  pasta: store.foodState.pasta,
  drink: store.foodState.drink,
});

export default connect(mapStateToProps, null)(FoodCampaign);

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
  basketContainer: {
    position: 'absolute',
    zIndex: 999,

    bottom: responsiveHeight(3),

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
});
