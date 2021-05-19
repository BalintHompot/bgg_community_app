import React, { useGlobal, useEffect, useState, useDispatch, useRef } from 'reactn'
import PropTypes from 'prop-types'
import { View, Text, InteractionManager, ScrollView, FlatList, LayoutAnimation, Keyboard, Dimensions } from 'react-native'
import { Button } from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack'
import SafeAreaView from 'react-native-safe-area-view'
import * as Sentry from 'sentry-expo'

import styleconstants, { layoutAnimation } from '../../../../shared/styles/styleconstants'
import styles from '../../../../shared/styles'
import { SearchBar, Icon } from 'react-native-elements'
var DomParser = require('react-native-html-parser').DOMParser
import { fetchCollectionFromBGG } from '../../../../shared/collection'
import { BarIndicator } from 'react-native-indicators';
import { RateLimit } from "async-sema";
import { useFocusEffect } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';


import UserThumbNail from '../../../../components/UserThumbNail'
import GameStack from '../../../GameStack'
import ProfileStack from '../OtherProfileScreen'
import HTML from "react-native-render-html";

import globalStyles from '../../../../shared/styles'
import { fetchXML } from '../../../../shared/HTTP'
import { TouchableOpacity } from 'react-native-gesture-handler'
var parseString = require('react-native-xml2js').parseString;

let width = Dimensions.get("window").width


let pageNumToRender = 1
const ForumEntry = props => {
    let editdatSplit = props.entry.$.editdate.split("T")
    let editTime
    if (editdatSplit[1].includes("-")) {
        editTime = editdatSplit[1].split("-")
    } else {
        editTime = editdatSplit[1].split("+")
    }
    let editDate = editdatSplit[0] + " " + editTime[0]

    return (
        <View style={{ flexDirection: 'row', backgroundColor: 'white', borderRadius: 10, margin: 5 }}>
            <View>

            </View>
            <View style={{ flexDirection: 'column', padding: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ color: 'dodgerblue' }}>{props.entry.$.username}</Text>
                    <Text style={{ color: 'grey' }}>{editDate}</Text>

                </View>
                <HTML source={{ html: props.entry.body }} contentWidth={300} />
                <View style={{ alignItems: 'flex-end', marginTop: 20, width: width * 0.9 }}>

                    <Icon
                        name="reply"
                        type="entypo"
                        color="grey"
                        containerStyle={{ margin: 4, marginRight: 10 }}
                        size={20}
                        onPress={() => {

                        }}
                    />
                </View>
            </View>



        </View>
    )

}


const ForumScreen = ({ navigation, route }) => {

    async function fetchThread() {
        // getting user info
        console.log('fetching thread')
        const url = "https://boardgamegeek.com/xmlapi2/thread?id=" + thread.id + "&page=" + pageNumToRender


        const t = await fetchXML(url, { method: 'GET' })
        parseString(t, function (err, result) {
            console.log("xml parsed", result)
            console.log("thread list", result.thread.articles[0].article.length)
            setEntries(result.thread.articles[0].article)
            setFetchingOnGoing(false)

        });

    }


    useFocusEffect(
        React.useCallback(() => {
            fetchThread()
        }, [])
    );

    const thread = route.params.thread
    let [entries, setEntries] = useState([])

    return (
        <View>
            <View style={{ padding: 20, backgroundColor: 'gainsboro', margin: 5, borderRadius: 5 }}>
                <Text style={{ fontFamily: styleconstants.primaryFontBold }}>{thread.subject}</Text>
            </View>

            <View>
                {entries.length > 0 ?
                    <FlatList
                        data={entries}
                        renderItem={({ item }) => {
                            return <ForumEntry entry={item} />
                        }}
                    /> :
                    <View style={{ height: 600, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Loading thread...</Text>
                    </View>
                }
            </View>
        </View>
    )


}



export default ForumScreen


