import { Image, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import React, { useDispatch, useEffect, useState } from 'reactn'
import { fetchXML } from '../shared/HTTP'
import { logOutReducer } from '../shared/store/reducers/authorization'
import styleconstants from '../shared/styles/styleconstants'


var parseString = require('react-native-xml2js').parseString

const ProfileCard = (props) => {
  let [profileDetails, setProfileDetails] = useState(null)
  let [userFetched, setUserFetched] = useState(false)
  const logOut = useDispatch(logOutReducer)

  let userName = props.userName

  const fetchUserDetails = async () => {
    // getting user info
    const url = 'https://boardgamegeek.com/xmlapi2/users?name=' + userName

    const userDetails = await fetchXML(url, { method: 'GET' })
    parseString(userDetails, function (err, result) {
      //console.log("xml parsed", result)

      setProfileDetails(result)
      setUserFetched(true)
    })
  }

  useEffect(() => {
    if (!userFetched) {
      fetchUserDetails()
    }
  }, [])

  const handleLogOut = () => {
    //tells global store we've logged in
    props.navigation.navigate('Login')
    logOut()
  }

  return (
    <View>
      {userFetched ? (
        <View style={{ flexDirection: 'column' }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  marginRight: 20,
                }}
              >
                {profileDetails.user.avatarlink[0].$.value == 'N/A' ? (
                  <Image
                    resizeMode={'contain'}
                    style={{ width: 64, height: 64 }}
                    source={{
                      uri: 'https://ynnovate.it/wp-content/uploads/2015/07/default-avatar1.png',
                    }}
                  />
                ) : (
                  <Image
                    resizeMode={'contain'}
                    style={{ width: 64, height: 64 }}
                    source={{
                      uri: profileDetails.user.avatarlink[0].$.value,
                    }}
                  />
                )}
              </View>

              <View
                style={{ flexDirection: 'column', justifyContent: 'center' }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name="id-card-o"
                    color="dodgerblue"
                    type="font-awesome"
                    containerStyle={{ margin: 4 }}
                    size={16}
                  />
                  <Text>{profileDetails.user.firstname[0].$.value}</Text>
                  <Text> </Text>
                  <Text>{profileDetails.user.lastname[0].$.value}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name="id-card"
                    color="dodgerblue"
                    type="font-awesome"
                    containerStyle={{ margin: 4 }}
                    size={16}
                  />
                  <Text>{profileDetails.user.$.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name="globe"
                    color="dodgerblue"
                    type="font-awesome"
                    containerStyle={{ margin: 4 }}
                    size={16}
                  />
                  <Text>{profileDetails.user.country[0].$.value}</Text>
                  <Text> / </Text>
                  <Text>{profileDetails.user.stateorprovince[0].$.value}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon
                    name="exchange"
                    color="dodgerblue"
                    type="font-awesome"
                    containerStyle={{ margin: 4 }}
                    size={16}
                  />
                  <Text>{profileDetails.user.traderating[0].$.value}</Text>
                  <Icon
                    name="cube"
                    color="dodgerblue"
                    type="font-awesome"
                    containerStyle={{ margin: 4 }}
                    size={16}
                  />
                  <Text>{profileDetails.user.marketrating[0].$.value}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 30,
              }}
            >
              {profileDetails.user.$.name != global.username ? (
                <Icon
                  name="mail"
                  color={styleconstants.bggorange}
                  type="ionicons"
                  containerStyle={{ margin: 4 }}
                  size={30}
                  onPress={() => {
                    props.navigation.navigate('Compose', {
                      messageid: null,
                      subject: 'New message',
                      user: profileDetails.user.$.name,
                    })
                  }}
                />
              ) : null}
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Loading profile...</Text>
        </View>
      )}
    </View>
  )
}

export default ProfileCard
