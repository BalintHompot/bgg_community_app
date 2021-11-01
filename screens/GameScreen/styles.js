import { StyleSheet } from 'react-native'
import styleConstants from '../../shared/styles/styleconstants'

export default StyleSheet.create({
  itemContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gameHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    height: 300,
  },
  headerRatings: {
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  headerRatingsText: {
    paddingTop: 2,
    color: '#ffffff',
    fontFamily: styleConstants.primaryFont,
    fontSize: 12,
  },
  headerImage: {
    width: '90%',
    height: '92%',
  },
  headerIconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statsBoxRight: {
    borderRightWidth: 1,
  },
  statsBoxTop: {
    borderTopWidth: 1,
  },
  statsBox: {
    borderColor: '#BEBFC0',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 12,
    width: '50%',
    height: 65,
  },
  statsTitle: {
    fontFamily: styleConstants.primaryFontBold,
    color: '#282D5C',
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
  },
  statsText: {
    fontFamily: styleConstants.primaryFont,
    color: '#004FAE',
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
  },
  creditText: {
    fontFamily: styleConstants.primaryFont,
  },
  creditTitle: {
    fontFamily: styleConstants.primaryFontBold,
  },
  descriptionHeader: {
    borderBottomColor: '#292e62',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  descriptionHeaderText: {
    fontFamily: styleConstants.primaryFontBold,
    fontSize: 18,
    color: '#292e62',
    marginBottom: 10,
  },

  headerBottonRow: {
    flexDirection: 'row',
    backgroundColor: '#E7ECF1',
    paddingTop: 0,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'center',
  },
  headerButton: {
    backgroundColor: '#fff',
  },
  headerButtonText: {
    fontFamily: styleConstants.primaryFontBold,
    fontSize: 14,
    color: '#000',
  },
  headerButtonContainer: {
    borderWidth: 0,
    height: 36,
    width: 130,
    marginRight: 5,
    marginLeft: 0,
    marginTop: 0,
  },
  headerButtonGroup: {
    flexDirection: 'row',
  },
})
