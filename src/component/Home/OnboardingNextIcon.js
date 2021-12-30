import React from 'react';
import {View} from 'react-native';
import Svg, {Path, G} from 'react-native-svg';

export default function OnboardingNextIcon() {
  return (
    <View style={{aspectRatio: 1}}>
      <Svg width="100%" height="100%" viewBox="0 0 23 13" fill="none">
        <Path
          d="M3.75412 9.11479C2.04295 9.11479 0.655762 7.72761 0.655762 6.01643C0.655762 4.30525 2.04294 2.91807 3.75412 2.91807L8.91806 2.91807C10.6292 2.91807 12.0164 4.30525 12.0164 6.01643C12.0164 7.72761 10.6292 9.11479 8.91806 9.11479H3.75412Z"
          fill="#efc151"
        />
        <Path
          d="M22.8447 6.7304C23.0262 6.54886 23.0262 6.29469 22.8447 6.11315L17.5072 0.73943C17.362 0.557885 17.0715 0.557885 16.89 0.73943L16.2001 1.46561C16.0186 1.61084 16.0186 1.90132 16.2001 2.08286L20.4846 6.40362L16.2001 10.7607C16.0186 10.9422 16.0186 11.1964 16.2001 11.3779L16.89 12.1041C17.0715 12.2857 17.362 12.2857 17.5072 12.1041L22.8447 6.7304Z"
          fill="black"
        />
      </Svg>
    </View>
  );
}