import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FoodCampaign from './FoodCampaign';
import FoodDetail from '../screens/FoodDetail';

const Stack = createNativeStackNavigator();

const CampaignsStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="FoodCampaign" component={FoodCampaign} />
      <Stack.Screen name="FoodDetail" component={FoodDetail} />
    </Stack.Navigator>
  );
};

export default CampaignsStack;
