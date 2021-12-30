import React from 'react';
import {PixelRatio} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const PR = PixelRatio.get();
// console.log('Pixel ratio ===> ', PR);

export const fontTypeRegular = 'Gilroy-Regular';
export const fontTypeBold = 'Gilroy-Bold';
export const fontTypeItalic = 'Gilroy-RegularItalic';

export const resFontSize = {
  superTiny:
    PR === 1
      ? responsiveFontSize(0.4)
      : PR === 1.5
      ? responsiveFontSize(0.2)
      : PR === 2
      ? responsiveFontSize(0.09)
      : PR === 3
      ? responsiveFontSize(0.07)
      : responsiveFontSize(0.05),
  tiny:
    PR === 1
      ? responsiveFontSize(0.6)
      : PR === 1.5
      ? responsiveFontSize(0.4)
      : PR === 2
      ? responsiveFontSize(0.2)
      : PR === 3
      ? responsiveFontSize(0.09)
      : responsiveFontSize(0.07),
  superSmall:
    PR === 1
      ? responsiveFontSize(0.8)
      : PR === 1.5
      ? responsiveFontSize(0.6)
      : PR === 2
      ? responsiveFontSize(0.4)
      : PR === 3
      ? responsiveFontSize(0.2)
      : responsiveFontSize(0.09),
  small:
    PR === 1
      ? responsiveFontSize(1)
      : PR === 1.5
      ? responsiveFontSize(0.8)
      : PR === 2
      ? responsiveFontSize(0.6)
      : PR === 3
      ? responsiveFontSize(0.5)
      : responsiveFontSize(0.5),
  smallMedium:
    PR === 1
      ? responsiveFontSize(1.2)
      : PR === 1.5
      ? responsiveFontSize(1)
      : PR === 2
      ? responsiveFontSize(0.8)
      : PR === 3
      ? responsiveFontSize(0.7)
      : responsiveFontSize(0.7),
  medium:
    PR === 1
      ? responsiveFontSize(1.4)
      : PR === 1.5
      ? responsiveFontSize(1.2)
      : PR === 2
      ? responsiveFontSize(1)
      : PR === 3
      ? responsiveFontSize(0.9)
      : responsiveFontSize(0.9),
  bigMedium:
    PR === 1
      ? responsiveFontSize(1.6)
      : PR === 1.5
      ? responsiveFontSize(1.4)
      : PR === 2
      ? responsiveFontSize(1.2)
      : PR === 3
      ? responsiveFontSize(1.1)
      : responsiveFontSize(1.1),
  smallLarge:
    PR === 1
      ? responsiveFontSize(1.8)
      : PR === 1.5
      ? responsiveFontSize(1.6)
      : PR === 2
      ? responsiveFontSize(1.4)
      : PR === 3
      ? responsiveFontSize(1.3)
      : responsiveFontSize(1.3),
  large:
    PR === 1
      ? responsiveFontSize(2)
      : PR === 1.5
      ? responsiveFontSize(1.8)
      : PR === 2
      ? responsiveFontSize(1.6)
      : PR === 3
      ? responsiveFontSize(1.5)
      : responsiveFontSize(1.5),
  bigLarge:
    PR === 1
      ? responsiveFontSize(2.5)
      : PR === 1.5
      ? responsiveFontSize(2.3)
      : PR === 2
      ? responsiveFontSize(2.1)
      : PR === 3
      ? responsiveFontSize(2)
      : responsiveFontSize(2),
  bigLarge2:
    PR === 1
      ? responsiveFontSize(2.7)
      : PR === 1.5
      ? responsiveFontSize(2.5)
      : PR === 2
      ? responsiveFontSize(2.3)
      : PR === 3
      ? responsiveFontSize(2.2)
      : responsiveFontSize(2.2),
  veryLarge:
    PR === 1
      ? responsiveFontSize(3)
      : PR === 1.5
      ? responsiveFontSize(2.8)
      : PR === 2
      ? responsiveFontSize(2.6)
      : PR === 3
      ? responsiveFontSize(2.5)
      : responsiveFontSize(2.5),
  veryLarge2:
    PR === 1
      ? responsiveFontSize(3.3)
      : PR === 1.5
      ? responsiveFontSize(3.1)
      : PR === 2
      ? responsiveFontSize(2.9)
      : PR === 3
      ? responsiveFontSize(2.8)
      : responsiveFontSize(2.8),
};
