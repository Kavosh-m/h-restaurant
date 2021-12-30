import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {UIActivityIndicator, WaveIndicator} from 'react-native-indicators';
import MapboxGL from '@react-native-mapbox-gl/maps';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {fontTypeRegular, resFontSize} from '../../constants/fonts';
import MapSmileyMarkerIcon from '../component/Home/MapSmileyMarkerIcon';
import {MAPBOX_PUBLIC_ACCESS_TOKEN} from '@env';

const ACCESS_TOKEN = MAPBOX_PUBLIC_ACCESS_TOKEN;
MapboxGL.setAccessToken(ACCESS_TOKEN);

const mapStyles = [
  'mapbox://styles/mapbox/streets-v11',
  'mapbox://styles/mapbox/outdoors-v11',
  'mapbox://styles/mapbox/light-v10',
  'mapbox://styles/mapbox/dark-v10',
  'mapbox://styles/mapbox/satellite-v9',
  'mapbox://styles/mapbox/satellite-streets-v11',
  'mapbox://styles/mapbox/navigation-day-v1',
  'mapbox://styles/mapbox/navigation-night-v1',
];

const FoodDeliveryMap = () => {
  const [address, setAdress] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [coordExist, setCoordExist] = useState(false);

  const handle_getting_address = async () => {
    const cor = await AsyncStorage.getItem('@coordinates');
    if (cor) {
      // console.log('coordinate ===> ',cor, typeof cor)
      const corJson = JSON.parse(cor);
      setLat(corJson.latitude);
      setLon(corJson.longitude);

      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${corJson.longitude},${corJson.latitude}.json?access_token=${ACCESS_TOKEN}`;
      axios
        .get(url)
        .then(({data}) =>
          setTimeout(() => {
            setAdress(data.features[0].place_name);
          }, 6000),
        )
        .catch(err => console.log('errrrrrrorr ====>  ', err));

      setCoordExist(true);
    }
  };

  useEffect(() => {
    handle_getting_address();
  }, [coordExist]);

  if (!coordExist) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <WaveIndicator size={60} color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapboxGL.MapView
          // ref={mapRef}
          style={styles.map}
          styleURL={mapStyles[0]}
          tintColor="pink"
          zoomEnabled={true}
          attributionEnabled={false}
          logoEnabled={false}
          compassEnabled={true}
          surfaceView={false}>
          <MapboxGL.PointAnnotation id="1" coordinate={[lon, lat]} />

          <MapboxGL.Camera
            zoomLevel={12}
            centerCoordinate={[lon, lat]}
            heading={0}
            pitch={0}
          />
        </MapboxGL.MapView>
      </View>

      <View style={styles.info}>
        {/* <Pressable
          style={styles.userLocationButtonContainer}
          onPress={() => alert('User location pressed')}
        >
          <MaterialCommunityIcons name='crosshairs-gps' size={responsiveWidth(15)/1.8} color='black' />
        </Pressable> */}
        <View style={styles.info2}>
          <View style={styles.time}>
            <View style={styles.locationSmileyIconContainer}>
              <MapSmileyMarkerIcon />
            </View>
            <View style={styles.addressContainer}>
              <Text style={styles.addressHeader}>Your delivery address</Text>
              {!address ? (
                <UIActivityIndicator size={20} color="purple" />
              ) : (
                <View style={styles.addressTextContainer}>
                  <Text
                    style={styles.addressText}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    {`${address.slice(0, address.lastIndexOf(','))}`}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default FoodDeliveryMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    width: responsiveWidth(100),
    height: responsiveHeight(47),
    flex: 5,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  info: {
    flex: 1.5,
    backgroundColor: 'transparent',
  },
  infoHeader: {
    flexDirection: 'row',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    height: responsiveHeight(15.6),
    width: responsiveWidth(100),
    borderTopRightRadius: responsiveWidth(4),
    borderTopLeftRadius: responsiveWidth(4),
  },

  info2: {
    width: responsiveWidth(77.7),
    height: responsiveHeight(23.4),
    alignSelf: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
  },
  time: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  addressContainer: {
    height: responsiveHeight(8),
    justifyContent: 'space-around',
    marginLeft: responsiveWidth(7),
  },

  addressText: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.bigLarge,
    color: '#000000',
    // textAlign: 'right',
  },

  locationSmileyIconContainer: {
    width: responsiveWidth(8.5),
    height: responsiveWidth(8.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  addressHeader: {
    fontFamily: fontTypeRegular,
    fontSize: resFontSize.bigLarge,
    color: '#9c9c9c',
  },

  addressTextContainer: {
    justifyContent: 'center',
    width: responsiveWidth(66),
    height: responsiveHeight(4),
    backgroundColor: 'transparent',
  },

  userLocationButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -responsiveHeight(10),
    right: -responsiveWidth(10),
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    borderRadius: responsiveWidth(15) / 2,
    backgroundColor: 'white',
    zIndex: 999,
  },
});
