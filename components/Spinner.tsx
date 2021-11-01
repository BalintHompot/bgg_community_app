import React from 'react'
import { View } from 'react-native'
import ProgressBar from 'react-native-progress/Circle'
import globalStyles from '../shared/styles'
import styleConstants from '../shared/styles/styleconstants'

const Spinner = ({ children }) => {
  return (
    <View style={globalStyles.emptyView}>
        <ProgressBar
          size={50}
          indeterminate={true}
          borderWidth={3}
          style={{ marginBottom: 10 }}
          color={styleConstants.bggorange}
        />
      {children}
    </View>
  )
}

export default Spinner
