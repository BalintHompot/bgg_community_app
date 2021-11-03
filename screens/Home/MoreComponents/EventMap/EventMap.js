import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import MapView, { Marker, Callout, UrlTile } from 'react-native-maps'
import { createStackNavigator } from '@react-navigation/stack'
import SlidingPanel from 'react-native-sliding-up-down-panels';
import styleconstants from "../../../../shared/styles/styleconstants";
const { width, height } = Dimensions.get('window');

const EventMap = (props) => {

    return (
        <View style={styles.container}>
            <View style={styles.bodyViewStyle}>
                <MapView
                    provider="google"
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            </View>

            <SlidingPanel
                headerLayoutHeight={40}
                headerLayout={() =>
                    <View style={styles.headerLayoutStyle}>
                        <Text style={styles.commonTextStyle}>My Awesome sliding panel</Text>
                    </View>
                }
                slidingPanelLayout={() =>
                    <View style={styles.slidingPanelLayoutStyle}>
                        <Text style={styles.commonTextStyle}>The best thing about me is you</Text>
                    </View>
                }
            />
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
    },

    bodyViewStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerLayoutStyle: {
        width,
        height: 100,
        backgroundColor: styleconstants.bggorange,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slidingPanelLayoutStyle: {
        width,
        height,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    commonTextStyle: {
        color: 'white',
        fontSize: 18,
    },
})