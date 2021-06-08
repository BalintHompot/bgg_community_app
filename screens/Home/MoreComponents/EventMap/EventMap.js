import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Callout, UrlTile } from 'react-native-maps'
import { createStackNavigator } from '@react-navigation/stack'

const EventMap = (props) => {

    return (
        <View>
            <MapView
                provider="google"
                style={styles.map}
                showsPointsOfInterest={false}
                showsUserLocation={true}
                showsMyLocationButton={true}
                // cacheEnabled={true}
                region={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                }}
                // minZoomLevel={16}
                maxZoomLevel={20}

            >

                {/* <Marker
            draggable
            coordinate={startingCoordinate}
            onDragEnd={e => console.log(e.nativeEvent.coordinate)}
          >
            <PreviewMapMarker amount="x" />
          </Marker> */}
            </MapView>
        </View>

    );

}
export default EventMap


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    map: {
        ...StyleSheet.absoluteFillObject
    }
})