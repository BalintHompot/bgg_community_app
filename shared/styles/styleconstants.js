import { LayoutAnimation, Platform } from 'react-native'


export default {
    bggpurple: '#403c64',
    bggorange: '#ff5001',
    primaryFont: 'lato',
    primaryFontBold: 'lato-bold'

}

export function layoutAnimation() {
    if (Platform.OS === 'android') {
        if (!global.layoutAnimationActive) {
            global.layoutAnimationActive = true;
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut
                , () => { global.layoutAnimationActive = false; });
        }
    } else {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }

}