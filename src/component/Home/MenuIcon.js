import React from 'react';
import {PixelRatio, useWindowDimensions, View} from 'react-native';
import Svg, {Rect, G} from 'react-native-svg';

export default function MenuIcon() {
  const scale = PixelRatio.get();
  const {width, height} = useWindowDimensions();
  // console.log(
  //   `scale ===> ${scale}\nwidth ===> ${width}\nheight ===> ${height}`,
  // );

  return (
    <View style={{aspectRatio: 1}}>
      <Svg width="100%" height="100%" viewBox="0 0 17 17" fill="none">
        <Rect
          y="8.86963"
          width="2.21739"
          height="10.3478"
          rx="1.1087"
          transform="rotate(-90 0 8.86963)"
          fill="#EDC461"
        />
        <Rect
          y="2.21729"
          width="2.21739"
          height="17"
          rx="1.1087"
          transform="rotate(-90 0 2.21729)"
          fill="#272727"
        />
        <Rect
          y="15.5217"
          width="2.21739"
          height="17"
          rx="1.1087"
          transform="rotate(-90 0 15.5217)"
          fill="#272727"
        />
      </Svg>
    </View>
  );
}
