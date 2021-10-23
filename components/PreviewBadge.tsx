import { Text } from 'react-native'
import { Badge } from 'react-native-elements'
import React from 'reactn'

interface PreviewBadgeProps  {
  color: string
  name: string
  onPress?: () => void
}

const PreviewBadge = ({ color, name, onPress }: PreviewBadgeProps) => {
  return (
    <Badge
      // style={{fontSize: 14}}
      value={
        <Text
          style={{
            paddingHorizontal: 10,
            color: '#ffffff',
            fontSize: 9,
          }}
        >
          {name}
        </Text>
      }
      badgeStyle={{ backgroundColor: color }}
      onPress={onPress}
    />
  )
}

export default PreviewBadge
