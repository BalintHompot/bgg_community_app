import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  Modal,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native'

import ImageViewer from 'react-native-image-zoom-viewer'

import { fetchJSON } from '../../shared/HTTP'

export default class ImageList extends React.Component {
  state = {
    images: null,
    imageModalIndex: null,
  }

  componentDidUpdate = async (prevProps) => {
    const { objectId } = this.props

    if (prevProps.objectId !== objectId || this.state.images === null) {
      const url = `https://api.geekdo.com/api/images?objectid=${objectId}&ajax=1&galleries%5B%5D=game&galleries%5B%5D=creative&nosession=1&objecttype=thing&showcount=17&size=crop100&sort=hot`
      let { images } = await fetchJSON(url)
      images = images.map((img) => ({ id: img.imageid, url: img.imageurl_lg }))

      this.setState({ images })
    }
  }

  hideImageModal = () => {
    this.setState({ imageModalIndex: null })
  }

  showImageModal = (imageModalIndex) => {
    this.setState({ imageModalIndex })
  }

  render = () => {
    if (this.state.images === null) {
      return null
    }

    return (
      <React.Fragment>
        <FlatList
          style={{ height: 104, backgroundColor: '#ffffff' }}
          data={this.state.images}
          horizontal={true}
          keyExtractor={(img) => img.id}
          renderItem={({ item, index }) => {
            return (
              <TouchableHighlight
                onPress={() => {
                  this.showImageModal(index)
                }}
              >
                <Image
                  source={{ uri: item.url }}
                  style={styles.imageListThumbnail}
                />
              </TouchableHighlight>
            )
          }}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.imageModalIndex !== null}
          onRequestClose={this.hideImageModal}
        >
          <ImageViewer
            renderImage={({ source, style }) => {
              return (
                <Image source={source} style={{ flex: 1 }} imageStyle={style} />
              )
            }}
            renderHeader={() => (
              <SafeAreaView>
                <TouchableHighlight onPress={this.hideImageModal}>
                  <Text style={{ padding: 10, color: 'white' }}>Close</Text>
                </TouchableHighlight>
              </SafeAreaView>
            )}
            imageUrls={this.state.images}
            onCancel={this.hideImageModal}
            index={this.state.imageModalIndex}
            enableSwipeDown={true}
          />
        </Modal>
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  imageListThumbnail: {
    resizeMode: 'cover',
    width: 100,
    height: 100,
    margin: 2,
  },
})
