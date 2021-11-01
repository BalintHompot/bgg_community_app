import { Text } from 'react-native'
import { WebView, WebViewNavigation } from 'react-native-webview'
import React, { createRef } from 'reactn'
import Spinner from '../components/Spinner'
import { listItemStyles } from '../shared/styles/contentStyles'

export const ModalWebScreen = ({ navigation, route }) => {
  let webViewRef = createRef<WebView>()

  const run = `document.querySelector('header').style.display = 'none';
document.querySelector('footer').style.display = 'none';
true;`

  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    webViewRef.current?.injectJavaScript(run)
  }

  const renderLoadingView = () => {
    return (
      <Spinner>
        <Text style={listItemStyles.subTitleText}>Loading...</Text>
      </Spinner>
    )
  }

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: `https://bgg.cc${route.params.url}` }}
      onNavigationStateChange={onNavigationStateChange}
      renderLoading={renderLoadingView}
      sharedCookiesEnabled={true}
      startInLoadingState={true}
    />
  )
}
