import { ScrollView } from 'react-native'
import React, { useEffect, useState } from 'reactn'
import Hero from '../../components/Home/Hero'
import ThreadsSummary from '../../components/Home/ThreadsSummary'
import { fetchJSON } from '../../shared/HTTP'
import AllTimeList from './ExploreComponents/AllTimeList'
import CrowdFunding from './ExploreComponents/CrowdFunding'
import HomeList from './ExploreComponents/HomeList'
import Hotness from './ExploreComponents/Hotness'

const ExploreScreen = (props) => {
  let [homeListId, setHomeListId] = useState(null)
  let [homeListId2, setHomeListId2] = useState(null)

  useEffect(() => {
    if (!homeListId && !homeListId2) {
      fetchHomeListIds()
    }
  })

  const fetchHomeListIds = async () => {
    const homepageLists = await fetchJSON('/api/homegamelists')

    const randInd = Math.floor(Math.random() * (homepageLists.length - 1))
    setHomeListId(homepageLists[randInd].id)
    setHomeListId2(homepageLists[randInd + 1].id)
  }

  return (
    <ScrollView>
      <Hero/>
      <Hotness navigation={props.navigation} />
      <CrowdFunding navigation={props.navigation} />
      <ThreadsSummary />
      <AllTimeList navigation={props.navigation} />
      {homeListId ? (
        <HomeList navigation={props.navigation} listId={homeListId} />
      ) : null}
      {homeListId2 ? (
        <HomeList navigation={props.navigation} listId={homeListId2} />
      ) : null}
    </ScrollView>
  )
}

export default ExploreScreen
