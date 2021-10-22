import { useFocusEffect } from '@react-navigation/native'
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View
} from 'react-native'
import { Icon } from 'react-native-elements'
import { MessageType, showMessage } from 'react-native-flash-message'
import { BarIndicator } from 'react-native-indicators'
import SafeAreaView from 'react-native-safe-area-view'
import React, { useDispatch, useState } from 'reactn'
import { Native as Sentry } from 'sentry-expo'
import { fetchRaw } from '../../../../shared/HTTP'
import { getNumUnreadReducer } from '../../../../shared/store/reducers/geekmail/fetchUnreadCount'
import styleconstants from '../../../../shared/styles/styleconstants'

const showFlash = (message, type: MessageType = 'danger') => {
  showMessage({ message, type, icon: 'auto' })
}

const ReplyScreen = (props) => {
  const [sending, setSending] = useState(false)
  const [messageToSend, setMessageToSend] = useState('')

  const getNumUnread = useDispatch(getNumUnreadReducer)

  const { height, width } = Dimensions.get('window')
  const numLines = Math.floor(height / 4 / 22) /// 22 is the height of the main font
  const maxTextInputHeight = 22 * numLines
  const extraTextInputHeight = Platform.OS === 'ios' ? 10 : 2
  let [textInputHeight, setHeight] = useState(34 + extraTextInputHeight)

  console.log('ReplyScreen')
  async function sendMessage() {
    Keyboard.dismiss()
    setSending(true)

    const subj = props.route.params.subject

    var raw =
      'action=save&messageid=&touser=' +
      encodeURIComponent(props.route.params.user) +
      '&subject=' +
      encodeURIComponent(subj) +
      '&savecopy=1&geek_link_select_1=&sizesel=10&body=' +
      encodeURIComponent(messageToSend) +
      '&B1=Send&folder=inbox&label=&ajax=1&searchid=0&pageID=1'

    var requestOptions = {
      method: 'POST',
      body: raw,
      redirect: 'follow',
    }
    let path = '/geekmail_controller.php'
    fetchRaw(path, requestOptions).then((response) => {
      //console.log("resp status", response.status)
      if (response.status === 200) {
        response
          .text()
          .then((rt) => {
            console.log('resp text', rt)
            setSending(false)
            showFlash(`Your message was sent successfully`, 'success')
            getNumUnread()

            props.navigation.navigate('GeekMail', { refetch: true })
          })
          .catch((error) => {
            console.log('error', error)
            Sentry.captureException(error)
          })
      } else {
        showFlash(`An error has occured`)
        Sentry.captureMessage('Non 200 Response for HTTP request.', {
          extra: { url: path, stauts: response.status },
        })
      }
    })
  }

  useFocusEffect(React.useCallback(() => {}, []))

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ height: '100%', flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? height * 0.1 : 0}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            maxHeight: maxTextInputHeight + 15,
            alignItems: 'flex-end',
          }}
        >
          <View
            style={{
              paddingHorizontal: 10,
              backgroundColor: 'white',
              borderRadius: 15,
              marginVertical: 8,
              height: 120,
              maxHeight: maxTextInputHeight,
              width: width * 0.8,
              marginLeft: 6,
              justifyContent: 'center',
              paddingBottom: 5,
            }}
          >
            <TextInput
              onChangeText={(Msg) => setMessageToSend(Msg)}
              placeholder="Write a message"
              placeholderTextColor={'lightgrey'}
              autoCapitalize="sentences"
              returnKeyType="next"
              multiline={true}
              value={messageToSend}
              textAlignVertical="center"
              onContentSizeChange={(e) => {
                //console.log('content size change, height:', e.nativeEvent.contentSize.height);
                setHeight(
                  e.nativeEvent.contentSize.height + extraTextInputHeight
                )
              }}
            />
          </View>
          {sending ? (
            <View style={{ marginBottom: 0, marginRight: 5 }}>
              <BarIndicator
                size={16}
                color={styleconstants.bggorange}
                count={5}
              />
            </View>
          ) : (
            <Icon
              containerStyle={{ marginRight: 5 }}
              name="paper-plane"
              type="font-awesome"
              color={styleconstants.bggorange}
              size={16}
              style={{
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                sendMessage()
              }}
              reverse
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ReplyScreen
