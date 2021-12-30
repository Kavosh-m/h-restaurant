import React from 'react';
import {View, StyleSheet, Animated, useWindowDimensions} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

const Paginator = ({data, scrollX}) => {
  const {width} = useWindowDimensions();
  const {scale} = useWindowDimensions();
  // console.log(
  //   scale,
  //   ' **** ',
  //   PixelRatio.get(),
  //   ' **** ',
  //   PixelRatio.getFontScale(),
  //   PixelRatio.getPixelSizeForLayoutSize(343),
  // );
  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [
            responsiveWidth(4),
            responsiveWidth(14),
            responsiveWidth(4),
          ],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });
        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ['#D3D3D3', '#FFDA80', '#D3D3D3'],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            style={[styles.dot, {width: dotWidth, backgroundColor}]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
};

export default Paginator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: responsiveHeight(8),
    backgroundColor: 'transparent',
    position: 'absolute',
    top: responsiveHeight(50.5),
    // bottom: responsiveHeight(40),
    zIndex: 10,
  },
  dot: {
    height: responsiveHeight(0.4),
    borderRadius: 5,
    marginHorizontal: responsiveWidth(1.5),
    backgroundColor: '#F8D57E',
  },
});
