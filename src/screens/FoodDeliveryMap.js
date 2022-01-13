import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  ToastAndroid,
  StyleSheet,
} from 'react-native';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetch_user_address} from '../../redux/actions';
import BasketIcon from '../component/Home/BasketIcon';
import FireIcon from '../component/Home/FireIcon';

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

const FoodDeliveryMap = ({fetch_user_address, userPosition, userAddress}) => {
  const [address, setAdress] = useState(userAddress);
  const [lat, setLat] = useState(userPosition.latitude);
  const [lon, setLon] = useState(userPosition.longitude);
  const [zoom, setZoom] = useState(userPosition.zoom);
  const [coordExist, setCoordExist] = useState(userPosition.positionExist);
  const [fakeLon, setFakeLon] = useState(53);
  const [fakeLat, setFakeLat] = useState(36);

  const cameraRef = useRef();
  const mapRef = useRef();

  const goTo = () => {
    setFakeLon(fakeLon - 1);
    setFakeLat(fakeLat - 1);
    cameraRef.current.flyTo([fakeLon, fakeLat], 20000);
  };

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

  const geo_success = async position => {
    let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${ACCESS_TOKEN}`;
    setLat(position.coords.latitude);
    setLon(position.coords.longitude);

    axios
      .get(url)
      .then(({data}) => {
        fetch_user_address(
          data.features[0].place_name.slice(
            0,
            data.features[0].place_name.lastIndexOf(','),
          ),
        );
        setAdress(data.features[0].place_name);
        setCoordExist(true);
        // cameraRef.current.flyTo([lon, lat], 6000);
        // cameraRef.current.zoomTo(12);
        cameraRef.current.setCamera({
          centerCoordinate: [lon, lat],
          zoomLevel: 14,
          animationDuration: 2000,
        });
        setZoom(14);
      })
      .catch(err => {
        ToastAndroid.show(
          'Fetching address is not possible!',
          ToastAndroid.LONG,
        );
      });
  };

  // get called when location not retrieved
  const geo_failure = error => {
    switch (error.code) {
      case 1:
        ToastAndroid.show(
          'Location permission is not granted',
          ToastAndroid.LONG,
        );
        break;
      case 2:
        ToastAndroid.show('Location provider not available', ToastAndroid.LONG);
        break;
      case 3:
        ToastAndroid.show('Location request timed out', ToastAndroid.LONG);
        break;
      case 4:
        ToastAndroid.show(
          'Google play service is not installed or has an older version',
          ToastAndroid.LONG,
        );
        break;
      case 5:
        ToastAndroid.show(
          'Location service is not enabled or location mode is not appropriate for the current request',
          ToastAndroid.LONG,
        );
        break;
      case -1:
        ToastAndroid.show('Library crashed for some reason', ToastAndroid.LONG);
        break;
      default:
        ToastAndroid.show(
          'Something went wrong with Geolocation service',
          ToastAndroid.LONG,
        );
    }
  };

  const handleGettingUserLocation = async () => {
    //Handle location permission first
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Device location Permission',
        message: 'This App needs access to your location',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      let geoOptions = {
        enableHighAccuracy: true,
        timeOut: 15000,
        maximumAge: 10000,
      };
      Geolocation.getCurrentPosition(geo_success, geo_failure, geoOptions);
    }
  };

  useEffect(() => {
    // handle_getting_address();
    console.log(`lon: ${lon}\nlat: ${lat}\n address: ${address}`);
  }, [coordExist, address]);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapboxGL.MapView
          ref={mapRef}
          style={styles.map}
          styleURL={mapStyles[0]}
          tintColor="pink"
          zoomEnabled={true}
          attributionEnabled={false}
          logoEnabled={false}
          compassEnabled={true}
          surfaceView={false}>
          {coordExist && (
            // <MapboxGL.PointAnnotation id="1" coordinate={[lon, lat]} />
            // <MapboxGL.MarkerView
            //   coordinate={[lon, lat]}
            //   anchor={{x: 0.5, y: 0.5}}>
            //   <View
            //     style={{
            //       width: responsiveWidth(10),
            //       height: responsiveWidth(10),
            //       backgroundColor: 'transparent',
            //     }}>
            //     <MaterialCommunityIcons
            //       name="map-marker"
            //       size={responsiveWidth(10)}
            //       color="#000"
            //     />
            //   </View>
            // </MapboxGL.MarkerView>
            <MapboxGL.UserLocation
              showsUserHeadingIndicator
              // renderMode="native"
              // androidRenderMode="gps"
            />
          )}

          <MapboxGL.Camera
            ref={cameraRef}
            zoomLevel={zoom}
            centerCoordinate={[lon, lat]}
            heading={0}
            pitch={0}
            // triggerKey={false}
          />
        </MapboxGL.MapView>
      </View>

      <View style={styles.info}>
        <TouchableOpacity
          style={styles.userLocationButtonContainer}
          onPress={
            handleGettingUserLocation
            // goTo
          }>
          <MaterialCommunityIcons
            name={coordExist ? 'crosshairs-gps' : 'crosshairs-question'}
            size={responsiveWidth(10 / 2)}
            color={coordExist ? 'blue' : 'red'}
          />
        </TouchableOpacity>
        <View style={styles.info2}>
          <View style={styles.time}>
            <View style={styles.locationSmileyIconContainer}>
              <MapSmileyMarkerIcon />
            </View>
            <View style={styles.addressContainer}>
              <Text style={styles.addressHeader}>Your delivery address</Text>
              <View style={styles.addressTextContainer}>
                {coordExist ? (
                  <Text
                    style={styles.addressText}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    {`${address?.slice(0, address.lastIndexOf(','))}`}
                  </Text>
                ) : (
                  <Text
                    style={styles.addressText}
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}>
                    not available
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = store => ({
  userPosition: store.userState.userPosition,
  userAddress: store.userState.userAddress,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({fetch_user_address}, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(FoodDeliveryMap);

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
    width: '100%',
    backgroundColor: '#fff',
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
    top: responsiveWidth(-10 * 1.2),
    right: responsiveWidth(10 / 3.5),
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(10 / 2),
    backgroundColor: 'white',
    zIndex: 10,
  },
});
