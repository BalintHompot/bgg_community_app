import React, { useState, useEffect, useGlobal } from 'reactn'

import SafeAreaView from 'react-native-safe-area-view'
import { createStackNavigator } from '@react-navigation/stack'
import { useFocusEffect } from '@react-navigation/native';
import { getNumUnread } from '../../../../shared/FetchWithCookie'

import { fetchRaw } from '../../../../shared/HTTP'
import { View, Text, ScrollView, FlatList, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import styles from '../../../../shared/styles'

import { Icon } from 'react-native-elements'
import { BarIndicator } from 'react-native-indicators';
import { showMessage } from 'react-native-flash-message'
import * as Sentry from 'sentry-expo'

import HTML from "react-native-render-html";
import styleconstants from '../../../../shared/styles/styleconstants';


const showFlash = (message, type = 'danger') => {
  showMessage({ message, type, icon: 'auto' })
}

const ReplyScreen = props => {

  let [sending, setSending] = useState(false)

  let [messageToSend, setMessageToSend] = useState('');


  const { height, width } = Dimensions.get("window")
  const numLines = Math.floor((height / 4) / 22)      /// 22 is the height of the main font
  const maxTextInputHeight = 22 * numLines
  const extraTextInputHeight = Platform.OS === 'ios' ? 10 : 2
  let [textInputHeight, setHeight] = useState(34 + extraTextInputHeight)


  async function sendMessage() {
    Keyboard.dismiss()
    setSending(true)

    const subj = isNewMessage ? subjectToSend : props.route.params.subject


    var myHeaders = new Headers();
    myHeaders.append("authority", "boardgamegeek.com");
    myHeaders.append("sec-ch-ua", "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"");
    myHeaders.append("accept", "text/javascript, text/html, application/xml, text/xml, */*");
    myHeaders.append("x-requested-with", "XMLHttpRequest");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36");
    myHeaders.append("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    myHeaders.append("origin", "https://boardgamegeek.com");
    myHeaders.append("sec-fetch-site", "same-origin");
    myHeaders.append("sec-fetch-mode", "cors");
    myHeaders.append("sec-fetch-dest", "empty");
    myHeaders.append("referer", "https://boardgamegeek.com/geekmail");
    myHeaders.append("accept-language", "en-US,en;q=0.9");
    myHeaders.append("cookie", global.cookie);

    var raw = "action=save&messageid=&touser=" + encodeURIComponent(props.route.params.user) + "&subject=" + encodeURIComponent(subj) + "&savecopy=1&geek_link_select_1=&sizesel=10&body=" + encodeURIComponent(messageToSend) + getPastMessagesString() + "&B1=Send&folder=inbox&label=&ajax=1&searchid=0&pageID=1";

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
      credentials: 'omit'
    };
    let path = "https://boardgamegeek.com/geekmail_controller.php"
    fetch(path, requestOptions)
      .then(response => {
        //console.log("resp status", response.status)
        if (response.status === 200) {
          response.text()
            .then(rt => {
              //console.log("resp text", rt)
              setSending(false)
              showFlash(`Your message was sent successfully`, 'success')
              getNumUnread()
              if (isNewMessage) {
                props.navigation.navigate("User")

              } else {
                props.navigation.navigate("GeekMail", { "refetch": true })

              }
            })
            .catch(error => {
              console.log('error', error)
              Sentry.captureException(error)

            });

        } else {
          showFlash(`An error has occured`, 'error')
          Sentry.captureMessage('Non 200 Response for HTTP request.', {
            extra: { url: path, stauts: response.status }
          })

        }

      })

  }

  useFocusEffect(
    React.useCallback(() => {



    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ height: '100%', flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : null} keyboardVerticalOffset={Platform.OS === 'ios' ? height * 0.1 : 0}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxHeight: maxTextInputHeight + 15, alignItems: 'flex-end' }}>
          <View style={{ paddingHorizontal: 10, backgroundColor: 'white', borderRadius: 15, marginVertical: 8, height: 120, maxHeight: maxTextInputHeight, width: width * 0.8, marginLeft: 6, justifyContent: isNewMessage ? 'flex-start' : 'center', paddingBottom: 5 }}>
            <TextInput
              onChangeText={Msg => setMessageToSend(Msg)}
              placeholder="Write a message"
              placeholderTextColor={'lightgrey'}
              autoCapitalize="sentences"
              returnKeyType="next"
              multiline={true}
              maxHeight={maxTextInputHeight}
              value={messageToSend}
              returnKeyType='default'
              textAlignVertical='center'
              onContentSizeChange={e => {
                //console.log('content size change, height:', e.nativeEvent.contentSize.height);
                setHeight(e.nativeEvent.contentSize.height + extraTextInputHeight)
              }}


            />
          </View>
          {sending ?
            <View style={{ marginBottom: 0, marginRight: 5 }}>
              <BarIndicator size={16} color={styleconstants.bggorange} count={5} />
            </View>
            :

            <Icon
              containerStyle={{ marginRight: 5 }}
              name='paper-plane'
              type='font-awesome'
              color={styleconstants.bggorange}
              size={16}
              style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}
              onPress={() => { sendMessage() }}
              reverse
            />
          }

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )

}


export default ReplyScreen