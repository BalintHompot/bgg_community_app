import { useFocusEffect } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import React, { useState } from 'reactn'
import { Native as Sentry } from 'sentry-expo'
import { fetchRaw } from '../../shared/HTTP'
import styles from '../../shared/styles'
import styleconstants from '../../shared/styles/styleconstants'
import MessageThumbNail from '../MessageThumbNail'
import ConversationScreen from './ConversationScreen'

const folders = [
  {
    label: 'inbox',
    value: 'inbox',
  },
  {
    label: 'outbox',
    value: 'outbox',
  },
]

const MessagesScreen = (props) => {
  const [loading, setLoading] = useState(true)

  const [messages, setMessages] = useState([])
  const [folderListOpen, setFolderListOpen] = useState(false)
  const [folder, setFolder] = useState('inbox')
  const [readUpdateDummy, setReadUpdate] = useState(0)

  async function getMessages(folderName) {
    setLoading(true)

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    }

    let path =
      '/geekmail_controller.php?action=viewfolder&ajax=1&folder=' +
      folderName +
      '&pageID=1&searchid=0&label='
    fetchRaw(path, requestOptions)
      .then((resp) => {
        if (resp.status === 200) {
          resp.text().then((rText) => {
            try {
              let mainTable = rText.match(/mychecks(.*)</g)[0]
              let msgIDs = rText.match(/GetMessage(.*?)return/g)
              let msgRead = rText.match(
                /(font-style:|font-weight:)(.*?)subject_/g
              )

              let regexMsgs = mainTable.match(/>(.*?)</g)
              let msgs = []
              let counter = 0
              let msgCounter = 0
              let subject = ''
              let user = ''
              let date = ''
              let dateStr = ''
              for (var ind in regexMsgs) {
                if (!regexMsgs[ind].startsWith('>\\')) {
                  if (counter == 6) {
                    msgs.push({
                      user: user,
                      subject: subject,
                      date: date,
                      id: msgIDs[msgCounter].substring(
                        12,
                        msgIDs[msgCounter].length - 10
                      ),
                      read: msgRead[msgCounter].startsWith('font-weight:bold')
                        ? false
                        : true,
                    })
                    counter = 0
                    msgCounter += 1
                  } else {
                    if (counter == 1) {
                      user = regexMsgs[ind].substring(
                        1,
                        regexMsgs[ind].length - 1
                      )
                    } else if (counter == 3) {
                      subject = regexMsgs[ind].substring(
                        1,
                        regexMsgs[ind].length - 1
                      )
                    } else if (counter == 5) {
                      dateStr = regexMsgs[ind].substring(
                        1,
                        regexMsgs[ind].length - 1
                      )
                      date = dateStr.replace(/&nbsp/g, '')
                    }
                    counter += 1
                  }
                }
              }

              setMessages(msgs)
              setLoading(false)
            } catch (error) {
              console.warn('problem processing the messages', error)
              setMessages([])
              setLoading(false)
              Sentry.captureException(error)
            }
          })
        } else {
          Sentry.captureMessage('Non 200 Response for HTTP request.', {
            extra: { url: path, stauts: resp.status },
          })
        }
      })
      .catch((error) => {
        console.error(error)
        Sentry.captureException(error)
      })
  }

  useFocusEffect(
    React.useCallback(() => {
      if (!folder) return null

      // console.log("fetching messages", folder)
      getMessages(folder)
    }, [folder])
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View
        style={{
          backgroundColor: styleconstants.bggpurple,
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        <Text
          style={{
            fontFamily: styleconstants.primaryFontBold,
            color: 'white',
            fontSize: 16,
          }}
        >
          Folder:{' '}
        </Text>
        <DropDownPicker
          listMode="SCROLLVIEW"
          // placeholder={folder?.label}
          containerStyle={{ width: 100, margin: 0, height: 30 }}
          style={{ margin: 0, height: 30 }}
          items={folders}
          open={folderListOpen}
          setOpen={setFolderListOpen}
          value={folder}
          setValue={setFolder}
        />

        {/* onChangeText={f => {
            setFolder(f)
            getMessages(f)
          }} */}
      </View>
      {loading ? (
        <View style={styles.emptyView}>
          <Text>Loading your messages...</Text>
        </View>
      ) : (
        <View style={{ height: '100%' }}>
          {messages.length == 0 ? (
            <View style={[styles.emptyView]}>
              <Text>This folder is empty</Text>
            </View>
          ) : (
            <View style={{ backgroundColor: 'gainsboro' }}>
              <FlatList
                onRefresh={() => {
                  getMessages(folder)
                }}
                refreshing={loading}
                data={messages}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        if (!item.read) {
                          item.read = true
                          setReadUpdate(readUpdateDummy + 1)
                        }
                        props.navigation.navigate('Conversation', {
                          messageid: item.id,
                          subject: item.subject,
                          user: item.user,
                          folder: folder,
                        })
                      }}
                    >
                      <MessageThumbNail messageObj={item} />
                    </TouchableOpacity>
                  )
                }}
              />
            </View>
          )}
        </View>
      )}
    </View>
  )
}
const Stack = createStackNavigator()

export default () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#403c64',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen name="GeekMail" component={MessagesScreen} />
    <Stack.Screen
      name="Conversation"
      component={ConversationScreen}
      options={({ route }) => ({
        title: route.params.subject,
      })}
    />
  </Stack.Navigator>
)
