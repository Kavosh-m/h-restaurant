import React, {useRef, useState} from 'react';
import {View, StyleSheet, Animated, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingItem from '../component/Onboarding/OnboardingItem';
import Paginator from '../component/Onboarding/Paginator';
import NextButton from '../component/Onboarding/NextButton';
import {o1, o2, o3} from '../../constants/images';

const pages = [
  {
    id: '1',
    title: 'Delicious food',
    description: 'You will have an exceptional experience with our foods',
    img: o1,
  },
  {
    id: '2',
    title: 'Fast Delivery',
    description: 'We know your time is priceless, so get your food, ASAP!',
    img: o2,
  },
  {
    id: '3',
    title: 'Certified Chef',
    description: 'We are professional, so you can trust us',
    img: o3,
  },
];

const OnBoardingScreen = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  const scrollTo = async () => {
    if (currentIndex < pages.length - 1) {
      slidesRef.current.scrollToIndex({index: currentIndex + 1});
    } else {
      try {
        // console.log('last page');
        await AsyncStorage.setItem('@viewedOnboarding', 'true');
        navigation.navigate('RegisterScreen');
        // const c = await AsyncStorage.getItem('@viewedOnboarding');
        // console.log('ccc ===> ', c);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 3}}>
        <FlatList
          data={pages}
          renderItem={({item}) => <OnboardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={item => item.id}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
      <Paginator data={pages} scrollX={scrollX} />
      <NextButton scrollTo={scrollTo} />
    </View>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
