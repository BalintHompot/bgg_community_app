import { StyleSheet } from 'react-native'
import styleConstants from './styleconstants'

export const contentBlockStyles = StyleSheet.create({
  container: {
    marginVertical: 3,
    backgroundColor: 'white',
    padding: 15,
    paddingBottom: 0,
  },
  headingText: { fontFamily: styleConstants.primaryFontBold, fontSize: 20 },
})

const subTitleText = {
  fontSize: 13,
  fontFamily: styleConstants.primaryFont,
  color: styleConstants.subtitleTextColor,
  marginTop: 5,
  marginRight: 5,
  height: 22,
}

export const listItemStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: 'white',
    marginBottom: 3,
    borderBottomColor: 'gainsboro',
    borderBottomWidth: 0,
  },
  titleText: {
    fontFamily: styleConstants.primaryFontBold,
    fontSize: 15,
    width: '100%',
    marginTop: 5,
  },
  subTitleText,
  subTitleLink: {
    ...subTitleText,
    textDecorationLine: 'underline',
  },
  subTitleTextStrong: {
    ...subTitleText,
    marginTop: 0,
    color: styleConstants.subtitleStrongColor,
  },

  subTitleIcon: { marginTop: 4, marginRight: 5 },
})

export const bottomBorderOnAllButLastItem = (i: number, list: any[]) => ({
  ...listItemStyles.container,
  ...(i < list.length - 1 ? { borderBottomWidth: 1 } : {}),
})
