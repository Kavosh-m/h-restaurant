import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SkypeIndicator} from 'react-native-indicators';
import {showMessage} from 'react-native-flash-message';
import {FloatingLabelInput} from 'react-native-floating-label-input';

import FireIcon from '../component/Home/FireIcon';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getFoodDetail, get_item_temp_status} from '../../redux/actions';
import {
  fontTypeBold,
  fontTypeRegular,
  resFontSize,
} from '../../constants/fonts';
import {Shadow} from 'react-native-neomorph-shadows';
import BasketIcon from '../component/Home/BasketIcon';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Top = ({
  navigation,
  foodType,
  identification,
  name,
  extra,
  calories,
  price,
  image,
}) => {
  const [like, setLike] = useState(false);

  const handleLikeButton = () => {
    setLike(!like);

    firestore()
      .collection('foods') // foods collection
      .doc(foodType) // for example pizza document
      .collection('items') // items collection in pizza document
      .doc(identification) // food item, for example Meat
      .collection('likes') // create(if dont exist) comments collection in Meat item
      .doc(auth().currentUser.uid) // create(if dont exist) user_id document in comments
      .set({
        liked: !like,
      })
      .then(() => {
        if (!like) {
          firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .collection('favorites')
            .doc(identification)
            .set({
              name: name,
              price: price,
              extra: extra,
              calories: calories,
              picurl: image,
              type: foodType,
              id: identification,
            });
        } else {
          firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .collection('favorites')
            .doc(identification)
            .delete();
        }
      });
  };

  const getLikeStatus = () => {
    firestore()
      .collection('foods') // foods collection
      .doc(foodType) // for example pizza document
      .collection('items') // items collection in pizza document
      .doc(identification) // food item, for example Meat
      .collection('likes') // create(if dont exist) comments collection in Meat item
      .doc(auth().currentUser.uid)
      .onSnapshot(dc => setLike(dc.data()?.liked));
  };

  useEffect(() => {
    getLikeStatus();
  }, []);

  return (
    <View style={styles.topMainContainer}>
      <TouchableOpacity
        hitSlop={{
          bottom: 3,
          left: 25,
          right: 25,
          top: 3,
        }}
        activeOpacity={0.6}
        onPress={() => navigation.pop()}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={responsiveWidth(8)}
          color="#131313"
        />
      </TouchableOpacity>
      <Shadow
        style={{
          shadowOffset: {width: 4, height: 5},
          shadowOpacity: 0.2,
          shadowColor: '#666666',
          shadowRadius: 5,
          backgroundColor: '#fafbfd',
          width: responsiveWidth(8),
          height: responsiveWidth(8),
          borderRadius: responsiveWidth(4),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={handleLikeButton}
          style={{
            backgroundColor: '#fafbfd',
            width: responsiveWidth(8),
            height: responsiveWidth(8),
            borderRadius: responsiveWidth(4),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialCommunityIcons
            name="heart"
            size={responsiveWidth(8 / 1.7)}
            color={like ? 'red' : 'gray'}
          />
        </TouchableOpacity>
      </Shadow>
    </View>
  );
};

const Header = ({name, extra, calories}) => {
  return (
    <View style={styles.headerMainContainer}>
      <Text style={styles.nameText}>{name}</Text>
      <Text style={styles.extraText}>{extra}</Text>
      <View style={styles.fireImageContainer}>
        <View
          style={{
            width: responsiveHeight(2),
            height: responsiveHeight(2),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FireIcon />
        </View>
        <Text style={styles.caloriText} numberOfLines={1} adjustsFontSizeToFit>
          {calories} calories
        </Text>
      </View>
    </View>
  );
};

const NumberIndicator = ({
  numOfItem,
  setNumOfItem,
  setButtons,
  buttons,
  size,
}) => {
  useEffect(() => {}, [buttons]);
  const handleIncrement = () => {
    setNumOfItem(numOfItem + 1);

    if (size === 's') {
      let newButtons = [...buttons];
      newButtons[0] = {...newButtons[0], num_of_item: numOfItem + 1};
      setButtons(newButtons);
    } else if (size === 'm') {
      let newButtons = [...buttons];
      newButtons[1] = {...newButtons[1], num_of_item: numOfItem + 1};
      setButtons(newButtons);
    } else {
      let newButtons = [...buttons];
      newButtons[2] = {...newButtons[2], num_of_item: numOfItem + 1};
      setButtons(newButtons);
    }
  };

  const handleDecrement = () => {
    if (numOfItem > 0) {
      setNumOfItem(numOfItem > 0 ? numOfItem - 1 : numOfItem);

      if (size === 's') {
        let newButtons = [...buttons];
        newButtons[0] = {
          ...newButtons[0],
          num_of_item: numOfItem > 0 ? numOfItem - 1 : numOfItem,
        };
        setButtons(newButtons);
      } else if (size === 'm') {
        let newButtons = [...buttons];
        newButtons[1] = {
          ...newButtons[1],
          num_of_item: numOfItem > 0 ? numOfItem - 1 : numOfItem,
        };
        setButtons(newButtons);
      } else {
        let newButtons = [...buttons];
        newButtons[2] = {
          ...newButtons[2],
          num_of_item: numOfItem > 0 ? numOfItem - 1 : numOfItem,
        };
        setButtons(newButtons);
      }
    }
  };

  return (
    <View style={styles.numberIndicatorBigCircle}>
      <Text style={styles.numOfItemText}>{numOfItem}</Text>
      <Shadow
        style={{
          shadowOffset: {width: 5, height: 4},
          shadowOpacity: 0.1,
          shadowColor: 'grey',
          shadowRadius: 2,
          position: 'absolute',
          right: responsiveWidth(-1),
          top: responsiveHeight(9 / 1.85),
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
            backgroundColor: '#fafbfd',
            elevation: 4,
            // borderWidth: 1,
          }}
          // onPress={() =>
          //   numOfItem > 1
          //     ? setNumOfItem(numOfItem - 1)
          //     : setNumOfItem(numOfItem)
          // }
          activeOpacity={numOfItem > 0 ? 0.6 : 1}
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
            backgroundColor: '#fafbfd',
            elevation: 4,
          }}
          onPress={handleIncrement}>
          <Text style={styles.decreamentText}>+</Text>
        </TouchableOpacity>
      </Shadow>
    </View>
  );
};

const Middle = ({
  image,
  numOfItem,
  setNumOfItem,
  buttons,
  setButtons,
  size,
}) => {
  useEffect(() => {}, [buttons]);
  return (
    <View
      style={{
        width: responsiveWidth(83),
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Shadow
        style={{
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.6,
          shadowColor: '#666666',
          shadowRadius: 2,
          width: responsiveWidth(64),
          height: responsiveWidth(64),
          borderRadius: responsiveWidth(32),
          marginVertical: responsiveHeight(1.5),
          marginLeft: responsiveWidth(17),
          backgroundColor: '#fafbfd',
          alignItems: 'center',
          // alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <Image style={styles.middleImage} source={image} />
        <View style={styles.middleNumberIndicatorMainContainer}>
          <NumberIndicator
            size={size}
            numOfItem={numOfItem}
            setNumOfItem={setNumOfItem}
            buttons={buttons}
            setButtons={setButtons}
          />
        </View>
      </Shadow>
    </View>
  );
};

const Size = ({buttons, setButtons, setSize, setNumOfItem}) => {
  const pushAction = n => {
    if (n === 'S') {
      let newButtons = [...buttons];
      newButtons[0] = {...newButtons[0], color: '#ffda80', fontColor: 'black'};
      newButtons[1] = {
        ...newButtons[1],
        color: '#fafbfd',
        fontColor: '#9c9c9c',
      };
      newButtons[2] = {
        ...newButtons[2],
        color: '#fafbfd',
        fontColor: '#9c9c9c',
      };

      setButtons(newButtons);
      setSize('s');
      setNumOfItem(newButtons[0].num_of_item);
    } else if (n === 'M') {
      let newButtons = [...buttons];
      newButtons[0] = {
        ...newButtons[0],
        color: '#fafbfd',
        fontColor: '#9c9c9c',
      };
      newButtons[1] = {
        ...newButtons[1],
        color: '#ffda80',
        fontColor: 'black',
      };
      newButtons[2] = {
        ...newButtons[2],
        color: '#fafbfd',
        fontColor: '#9c9c9c',
      };

      setButtons(newButtons);
      setSize('m');
      setNumOfItem(newButtons[1].num_of_item);
    } else {
      let newButtons = [...buttons];
      newButtons[0] = {
        ...newButtons[0],
        color: '#fafbfd',
        fontColor: '#9c9c9c',
      };
      newButtons[1] = {
        ...newButtons[1],
        color: '#fafbfd',
        fontColor: '#9c9c9c',
      };
      newButtons[2] = {
        ...newButtons[2],
        color: '#ffda80',
        fontColor: 'black',
      };

      setButtons(newButtons);
      setSize('l');
      setNumOfItem(newButtons[2].num_of_item);
    }
  };

  return (
    <View style={styles.sizeMainContainer}>
      {buttons.map(item => {
        return (
          <TouchableOpacity
            style={[styles.sizeButtonContainer, {backgroundColor: item.color}]}
            key={item.id}
            onPress={() => pushAction(item.sizeName)}>
            <Text style={[styles.sizeText, {color: item.fontColor}]}>
              {item.sizeName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Footer = ({
  fee,
  id,
  nme,
  ext,
  imge,
  singlePrice,
  totalPrice,
  numOfItem,
  cart,
  getFoodDetail,
  buttons,
  get_item_temp_status,
}) => {
  // Send item to shopping cart using redux state

  const handleAddToCart = () => {
    if (totalPrice > 0) {
      getFoodDetail({
        id: id,
        name: nme,
        extra: ext,
        picture: imge,
        singlePrice: singlePrice,
        price: totalPrice,
        number: numOfItem,
      });

      // console.log('butttonsssss =====> ', buttons);

      get_item_temp_status({id: id, data: buttons});

      ToastAndroid.show('Added to cart successfully', ToastAndroid.SHORT);

      // showMessage({
      //   message: 'Added to cart successfully',
      //   type: 'info',
      //   icon: 'success',
      //   backgroundColor: 'green',
      // });
    }
  };

  return (
    <View style={styles.footerMainContainer}>
      <View style={styles.priceContainer}>
        <Text style={styles.priceTitleHeader}>Price</Text>
        <Text style={styles.priceText}>${fee}</Text>
      </View>
      <Shadow
        style={{
          shadowOffset: {width: 4, height: 5},
          shadowOpacity: 0.4,
          shadowColor: '#666666',
          shadowRadius: 6,
          width: responsiveWidth(16),
          height: responsiveHeight(7),
          borderRadius: responsiveHeight(8),
          borderWidth: 1.5,
          borderColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
        }}>
        <TouchableOpacity
          style={{
            width: '100%',
            height: '100%',
            borderRadius: responsiveHeight(8),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
          activeOpacity={totalPrice > 0 ? 0.6 : 1}
          onPress={handleAddToCart}>
          <View style={styles.basketIconContainer}>
            <View style={styles.basketIconWrapper}>
              <BasketIcon rotate="0deg" />
            </View>
          </View>
        </TouchableOpacity>
      </Shadow>
    </View>
  );
};

const FoodDetail = ({
  route,
  navigation,
  getFoodDetail,
  get_item_temp_status,
  cart,
  item_status,
}) => {
  const {identification, cal, ext, nme, imge, prc, foodType} = route.params;

  const price = prc;

  const [customersComment, setCustomersComment] = useState(null);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);
  const [postSent, setPostSent] = useState(false);
  const [totalPrice, setTotalPrice] = useState();
  const [numOfItem, setNumOfItem] = useState(0);
  const [size, setSize] = useState('s');
  const [buttons, setButtons] = useState([
    {
      id: 0,
      sizeName: 'S',
      color: '#ffda80',
      fontColor: 'black',
      num_of_item: 0,
    },
    {
      id: 1,
      sizeName: 'M',
      color: '#fafbfd',
      fontColor: '#9c9c9c',
      num_of_item: 0,
    },
    {
      id: 2,
      sizeName: 'L',
      color: '#fafbfd',
      fontColor: '#9c9c9c',
      num_of_item: 0,
    },
  ]);

  // useEffect(() => {
  //   // console.log('buttons ==> ', buttons);
  //   console.log('item_status', item_status[0].data);
  // }, [item_status]);

  useEffect(() => {
    let initialButtons = item_status?.filter(
      item => item.id === identification,
    );
    if (initialButtons.length > 0) {
      setButtons(initialButtons[0].data);
      let f = initialButtons[0].data;
      let interest = f.filter(item => item.fontColor === 'black');
      setNumOfItem(interest[0].num_of_item);
      setSize(interest[0].sizeName.toLowerCase());
    }
  }, [identification]);

  useEffect(() => {
    if (size === 's') {
      setTotalPrice(price * numOfItem);
    } else if (size === 'm') {
      setTotalPrice(1.5 * price * numOfItem);
    } else {
      setTotalPrice(2 * price * numOfItem);
    }
  }, [numOfItem, size]);

  const handle_load_comments = async () => {
    firestore()
      .collection('foods')
      .doc(foodType)
      .collection('items')
      .doc(identification)
      .collection('comments')
      .orderBy('uploadTime', 'desc')
      .get()
      .then(async querySnapshot => {
        //  console.log('Total comments: ', querySnapshot.size);
        // setNumberOfComments(querySnapshot.size)
        let comments = [];

        querySnapshot.docs.map(async documentSnapshot => {
          // console.log('comments times ====> ', documentSnapshot.data().uploadTime.toDate().getFullYear());
          comments.push({
            customerId: documentSnapshot.id,
            customerName: documentSnapshot.data().username,
            customerComment: documentSnapshot.data().commentString,
            time: documentSnapshot.data().uploadTime,
          });
        });

        setCustomersComment(comments);
      });
  };

  useEffect(() => {
    handle_load_comments();
  }, [sent]);

  const handleSubmitComment = async () => {
    if (comment.length !== 0) {
      setPostSent(true);
      const cred = await AsyncStorage.getItem('@credentials');
      // console.log('creddddddddd ===> ',cred)
      if (cred) {
        const credParse = JSON.parse(cred);

        firestore()
          .collection('foods') // foods collection
          .doc(foodType) // for example pizza document
          .collection('items') // items collection in pizza document
          .doc(identification) // food item, for example Meat
          .collection('comments') // create(if dont exist) comments collection in Meat item
          .doc(auth().currentUser.uid) // create(if dont exist) user_id document in comments
          .set({
            commentString: comment,
            username: credParse.name,
            uploadTime: firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            setPostSent(false);
            setComment('');
            setSent(!sent);
          })
          .catch(() => {
            setPostSent(false);
            ToastAndroid.show('Something went wrong!', ToastAndroid.LONG);
          });
      }
    }
  };

  return (
    <View style={styles.mainScreenContainer}>
      <ScrollView
        style={{
          backgroundColor: 'transparent',
          width: '100%',
          // marginTop: responsiveHeight(2),
        }}
        showsVerticalScrollIndicator={false}>
        <Top
          navigation={navigation}
          foodType={foodType}
          identification={identification}
          extra={ext}
          name={nme}
          image={imge}
          calories={cal}
          price={prc}
        />
        <Header name={nme} extra={ext} calories={cal} />
        <Middle
          image={imge}
          numOfItem={numOfItem}
          setNumOfItem={setNumOfItem}
          setButtons={setButtons}
          buttons={buttons}
          size={size}
        />
        <Size
          buttons={buttons}
          setButtons={setButtons}
          size={size}
          setSize={setSize}
          setNumOfItem={setNumOfItem}
        />
        <Footer
          fee={totalPrice?.toFixed(2).toString().replace('.', ',')}
          getFoodDetail={getFoodDetail}
          id={identification}
          ext={ext}
          nme={nme}
          imge={imge}
          singlePrice={prc}
          totalPrice={totalPrice}
          numOfItem={numOfItem}
          cart={cart}
          buttons={buttons}
          get_item_temp_status={get_item_temp_status}
        />
        <Text
          style={{
            fontFamily: fontTypeRegular,
            color: 'black',
            fontSize: resFontSize.bigLarge,
            marginLeft: responsiveWidth(17 / 2),
          }}>
          Comments
        </Text>
        <View
          style={{
            width: responsiveWidth(83),
            height: responsiveHeight(4),
            borderTopWidth: 1,
            marginLeft: responsiveWidth(17 / 2),
          }}></View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: responsiveWidth(83),
            height: responsiveHeight(6),
            borderRadius: responsiveHeight(6),
            paddingHorizontal: responsiveWidth(2),
            marginBottom: responsiveHeight(2.5),
            borderWidth: 0.7,
            borderColor: '#00000090',
            marginLeft: responsiveWidth(17 / 2),
            backgroundColor: '#ffffff',
            elevation: 1.5,
          }}>
          <View
            style={{
              width: responsiveWidth(55),
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
            }}>
            <FloatingLabelInput
              staticLabel
              keyboardType="default"
              hint="Write a comment..."
              hintTextColor="gray"
              containerStyles={{backgroundColor: 'transparent'}}
              inputStyles={{
                fontFamily: fontTypeRegular,
                fontSize: resFontSize.large,
                color: 'black',
              }}
              isPassword={false}
              value={comment}
              onChangeText={txt => setComment(txt)}
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmitComment}
            style={{
              width: responsiveHeight(6),
              height: responsiveHeight(6),
              alignItems: 'flex-end',
              justifyContent: 'center',
              borderRadius: responsiveHeight(6),
              backgroundColor: 'transparent',
            }}>
            {postSent ? (
              <SkypeIndicator size={30} color="black" />
            ) : (
              <MaterialCommunityIcons name="send" size={25} color="#000000" />
            )}
          </TouchableOpacity>
        </View>
        {customersComment?.map((item, index) => {
          return (
            <View style={styles.commentsFlatlistContainer} key={index}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // backgroundColor: '#ccccb3',
                }}>
                <View
                  style={{
                    width: responsiveWidth(6),
                    height: responsiveWidth(6),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                  }}>
                  <MaterialCommunityIcons
                    name="account-circle"
                    size={responsiveWidth(5)}
                    color="black"
                  />
                </View>
                <Text style={styles.commentFlatListNameText}>
                  {item.customerName}
                </Text>
                <Text style={styles.dateString}>
                  {`${item.time?.toDate().getDate()}/${
                    item.time?.toDate().getMonth() + 1
                  }/${item.time?.toDate().getFullYear()}`}
                </Text>
              </View>
              <Text style={styles.commentFlatListCommentText}>
                {item.customerComment}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const mapStateToProps = store => ({
  cart: store.shoppingCartState.cart,
  item_status: store.shoppingCartState.item_status,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({getFoodDetail, get_item_temp_status}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FoodDetail);

const styles = StyleSheet.create({
  //Main
  mainScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    // paddingTop: responsiveHeight(2),
  },

  //Top
  topMainContainer: {
    flexDirection: 'row',
    width: responsiveWidth(100),
    paddingRight: responsiveWidth(17 / 2),
    paddingLeft: responsiveWidth(17 / 4),
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
  },

  likeImageContainer: {
    backgroundColor: '#fafbfd',
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    borderRadius: responsiveWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
  },

  likeImage: {
    width: '80%',
    height: '80%',
  },

  //Header
  headerMainContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: responsiveHeight(1.56),
    backgroundColor: 'white',
  },

  nameText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.veryLarge,
    color: 'black',
  },

  extraText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.large,
    marginBottom: responsiveHeight(0.5),
    marginTop: responsiveHeight(0.6),
    color: '#9c9c9c',
  },

  fireImageContainer: {
    width: responsiveWidth(25),
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    marginTop: responsiveHeight(0.6),
    backgroundColor: 'transparent',
  },

  caloriText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.smallLarge,
    marginLeft: responsiveWidth(1),
    color: '#9c9c9c',
  },

  //Middle
  middleMainContainer: {
    width: responsiveWidth(64),
    height: responsiveWidth(64),
    borderRadius: responsiveWidth(32),
    marginVertical: responsiveHeight(1.5),
    backgroundColor: '#fafbfd',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },

  middleImage: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveWidth(32),
  },

  middleNumberIndicatorMainContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  numberIndicatorBigCircle: {
    width: responsiveWidth(19),
    height: responsiveHeight(9),
    borderRadius: responsiveHeight(9),
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: responsiveWidth(4),
    backgroundColor: '#fafbfd',
    // backgroundColor: 'pink',
    // borderBottomWidth: 3,
    // borderBottomColor: '#e6e6e6',
    // borderColor: '#00000020',
    elevation: 1,
    transform: [
      {translateY: responsiveHeight(-2)},
      {translateX: responsiveWidth(-4)},
    ],
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

  decreamentCircle: {
    position: 'absolute',
    right: 0,
    top: responsiveHeight(7 / 2),
    width: responsiveHeight(7 / 2),
    height: responsiveHeight(7 / 2),
    borderRadius: responsiveHeight(7 / 4),
    backgroundColor: '#FAFBFD',
    // backgroundColor: 'powderblue',
    alignItems: 'center',
    justifyContent: 'center',
  },

  decreamentText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.bigLarge,
    color: '#000000',
  },

  //Size
  sizeMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-around',
    width: responsiveWidth(56),
  },

  sizeButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveHeight(9),
    height: responsiveHeight(8),
    borderRadius: responsiveHeight(8),
  },

  sizeText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.bigLarge,
  },

  //Footer
  footerMainContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: responsiveHeight(3),
    justifyContent: 'space-between',
    width: responsiveWidth(83),
    // backgroundColor: 'pink',
  },

  priceContainer: {
    height: responsiveHeight(7),
    justifyContent: 'space-between',
  },

  priceTitleHeader: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.large,
  },

  priceText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.veryLarge,
    color: 'black',
  },

  basketContainer: {
    width: responsiveWidth(16),
    height: responsiveHeight(7),
    borderRadius: responsiveHeight(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },

  basketIconContainer: {
    width: responsiveHeight(3.8),
    height: responsiveHeight(3.8),
    borderRadius: responsiveHeight(3.8),
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '#FFDA80',
    alignItems: 'center',
    justifyContent: 'center',
  },

  basketIconWrapper: {
    width: responsiveHeight(2.1),
    height: responsiveHeight(2.1),
    borderRadius: responsiveHeight(2.1),
  },

  //Comment section
  commentMainContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: responsiveWidth(83),
    height: responsiveHeight(12),
    backgroundColor: 'pink',
  },

  commentAndPostButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },

  commentTextInput: {
    width: responsiveWidth(67),
    height: responsiveHeight(5.7),
    // borderWidth: 2,
  },

  commentSubmitButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'black',
    width: responsiveWidth(15),
    height: responsiveHeight(5.7),
    borderRadius: 15,
  },

  submitButtonText: {
    fontFamily: fontTypeBold,
    fontSize: responsiveFontSize(1.7),
    color: 'blue',
  },

  commentsFlatlistContainer: {
    width: responsiveWidth(83),
    // marginRight: responsiveWidth(15),
    // marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
    marginLeft: responsiveWidth(17 / 2),
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveWidth(1.5),
    paddingBottom: responsiveHeight(0.5),
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#00000015',
    elevation: 1,
  },

  commentFlatListNameText: {
    fontFamily: fontTypeBold,
    fontSize: resFontSize.large,
    marginLeft: responsiveWidth(2),
    // alignSelf: 'center'
  },

  dateString: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.large,
    marginLeft: responsiveWidth(3),
    color: '#00000090',
  },

  commentFlatListCommentText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.smallLarge,
    textAlign: 'justify',
    marginTop: responsiveHeight(2),
    paddingLeft: responsiveWidth(8),
    paddingRight: responsiveWidth(2),
    paddingBottom: responsiveHeight(1),
    color: 'black',
  },

  viewCommentsText: {
    fontFamily: fontTypeBold,
    fontSize: responsiveFontSize(2),
  },
});
