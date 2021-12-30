import React, {useRef} from 'react';
import {View, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {Shadow} from 'react-native-neomorph-shadows';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import OnboardingNextIcon from '../Home/OnboardingNextIcon';

const NextButton = ({scrollTo}) => {
  const progressAnimation = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <Shadow
        inner={false} // <- enable inner shadow
        useArt // <- set this prop to use non-native shadow on ios
        style={{
          shadowOffset: {width: 15, height: 15},
          shadowOpacity: 0.1,
          shadowColor: '#00000010',
          shadowRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          width: responsiveWidth(20),
          height: responsiveWidth(20),
          borderRadius: responsiveWidth(20),
          backgroundColor: '#FAFBFD',
        }}>
        <TouchableOpacity
          onPress={scrollTo}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: responsiveWidth(6),
              height: responsiveWidth(6),
              borderRadius: responsiveWidth(6),
            }}>
            <OnboardingNextIcon />
          </View>
        </TouchableOpacity>
      </Shadow>
    </View>
  );
};

export default NextButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#FAFBFD',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
