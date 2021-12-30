import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import TrashBinIcon from '../Home/TrashBinIcon';

const RightAction = ({onPress, name, size}) => {
  return (
    <View
      style={{
        marginLeft: responsiveWidth(5),
        marginBottom: responsiveHeight(2),
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        style={{
          width: responsiveWidth(13.8),
          height: responsiveWidth(13.8),
          borderRadius: responsiveWidth(13.8 / 2),
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'black',
        }}
        onPress={() => {
          onPress(name, size);
        }}>
        <View
          style={{
            width: responsiveWidth(8),
            height: responsiveWidth(8),
            borderRadius: responsiveWidth(8),
          }}>
          <TrashBinIcon />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RightAction;
