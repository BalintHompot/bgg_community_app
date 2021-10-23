import PropTypes from 'prop-types'
import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Button } from 'react-native-elements'
import React, { useGlobal } from 'reactn'
import * as filterOptions from '../shared/data'
import { previewFiltersDefault } from '../shared/store/helpers/initialState'
import styles from '../shared/styles'
import PreviewBadge from './PreviewBadge'
import SelectList from './SelectList'

const sortingOptions = [
  {
    label: 'Publisher, Game',
    value: 'publisherGame',
  },
  {
    label: 'Location, Publisher, Game',
    value: 'locationPublisherGame',
  },
]
const filterTextOnOptions = [
  { label: 'Game Name', value: 'game' },
  {
    label: 'Publisher Name',
    value: 'publisher',
  },
  { label: 'Notes', value: 'note' },
]

const PreviewFilters = (props) => {
  const [previewFilters, setPreviewFilters] = useGlobal('previewFilters')
  const [localFilters, setLocalFilters] = useState(previewFilters)

  const renderPriorityBadge = ({ label, value, onPress }) => {
    const { color } = filterOptions.priorities.find(
      (item) => item.value === value
    )
    return <PreviewBadge name={label} color={color} onPress={onPress} />
  }

  const toggleTags = (name) => {
    const currentLocal = localFilters[name]

    const allOptions = filterOptions[name]
    console.log({ name, currentLocal, allOptions })

    if (currentLocal.length === allOptions.length) {
      setLocalFilters({ ...localFilters, [name]: [] })
    } else {
      setLocalFilters({
        ...localFilters,
        [name]: allOptions.map(({ value }) => value),
      })
    }
  }

  const applyFilters = () => {
    const { pop } = props.navigation

    setPreviewFilters(localFilters)

    pop()
  }

  const reset = () => {
    setLocalFilters(previewFiltersDefault)
  }

  return (
    <ScrollView>
      <View style={styles.mainView}>
        <Text style={styles.formHeader}>Sorting</Text>
        <View
          style={{
            marginLeft: 5,
            marginBottom: 15,
            zIndex: 9,
          }}
        >
          <SelectList
            onChangeValue={(value: string) =>
              setLocalFilters({ ...localFilters, sortBy: value })
            }
            initialValues={[localFilters.sortBy]}
            items={sortingOptions}
            zIndex={9000}
            zIndexInverse={1000}
          />
        </View>

        <Text style={styles.formHeader}>Filters</Text>
        <View style={{ padding: 5 }}>
          <Text style={styles.formLabel}>Text Filter on:</Text>
          <View
            style={{
              marginLeft: 5,
              marginBottom: 15,
              zIndex: 8,
            }}
          >
            <SelectList
              items={filterTextOnOptions}
              onChangeValue={(value: string) =>
                setLocalFilters({ ...localFilters, filterTextOn: value })
              }
              initialValues={[localFilters.filterTextOn]}
              zIndex={8000}
              zIndexInverse={2000}
            />
          </View>

          <TouchableOpacity
            style={styles.formLabelRow}
            onPress={() => toggleTags('priorities')}
          >
            <Text style={styles.formLabel}>Priority</Text>
            <Text style={styles.toggleText}>(Toggle All)</Text>
          </TouchableOpacity>

          <View
            style={{
              marginLeft: 5,
              marginBottom: 15,
              zIndex: 7,
            }}
          >
            <SelectList
              items={filterOptions.priorities}
              onChangeValue={(priorities: any[]) =>
                setLocalFilters({ ...localFilters, priorities })
              }
              initialValues={localFilters.priorities}
              placeholder=""
              multiple={true}
              renderBadgeItem={renderPriorityBadge}
              zIndex={7000}
              zIndexInverse={3000}
            />
          </View>

          {/* change diplay to block when we want to show halls */}
          <View style={{ display: 'none' }}>
            <TouchableOpacity
              style={styles.formLabelRow}
              onPress={() => toggleTags('halls')}
            >
              <Text style={styles.formLabel}>Halls</Text>
              <Text style={styles.toggleText}>(Toggle All)</Text>
            </TouchableOpacity>

            <View
              style={{
                marginLeft: 5,
                marginBottom: 15,
                zIndex: 6,
              }}
            >
              <SelectList
                items={filterOptions.halls}
                onChangeValue={(halls: any[]) =>
                  setLocalFilters({ ...localFilters, halls })
                }
                initialValues={localFilters.halls}
                placeholder=""
                multiple={true}
                zIndex={6000}
                zIndexInverse={4000}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.formLabelRow}
            onPress={() => toggleTags('seen')}
          >
            <Text style={styles.formLabel}>Viewed</Text>
            <Text style={styles.toggleText}>(Toggle All)</Text>
          </TouchableOpacity>

          <View
            style={{
              marginLeft: 5,
              marginBottom: 15,
              zIndex: 5,
            }}
          >
            <SelectList
              items={filterOptions.seen}
              onChangeValue={(seen: any[]) =>
                setLocalFilters({ ...localFilters, seen })
              }
              initialValues={localFilters.seen}
              placeholder=""
              multiple={true}
              zIndex={6000}
              zIndexInverse={5000}
            />
          </View>

          <TouchableOpacity
            style={styles.formLabelRow}
            onPress={() => toggleTags('availability')}
          >
            <Text style={styles.formLabel}>Availability</Text>
            <Text style={styles.toggleText}>(Toggle All)</Text>
          </TouchableOpacity>

          <View style={{ marginLeft: 5, marginBottom: 15, zIndex: 4 }}>
            <SelectList
              items={filterOptions.availability}
              onChangeValue={(availability: any[]) =>
                setLocalFilters({ ...localFilters, availability })
              }
              initialValues={localFilters.availability}
              placeholder=""
              multiple={true}
              zIndex={4000}
              zIndexInverse={4000}
            />
          </View>

          <TouchableOpacity
            style={styles.formLabelRow}
            onPress={() => toggleTags('preorders')}
          >
            <Text style={styles.formLabel}>Preordered</Text>
            <Text style={styles.toggleText}>(Toggle All)</Text>
          </TouchableOpacity>

          <View style={{ marginLeft: 5, zIndex: 3 }}>
            <SelectList
              items={filterOptions.preorders}
              onChangeValue={(preorders: any[]) =>
                setLocalFilters({ ...localFilters, preorders })
              }
              initialValues={localFilters.preorders}
              placeholder=""
              multiple={true}
              zIndex={3000}
              zIndexInverse={5000}
            />
          </View>

          <View style={styles.formButtons}>
            <Button
              style={{ flex: 1, backgroundColor: '#03A9F4' }}
              title="Apply Filters"
              onPress={applyFilters}
              containerStyle={{
                marginHorizontal: 10,
              }}
            />
            <Button style={{ flex: 1 }} title="Reset" onPress={reset} />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

PreviewFilters.propTypes = {
  navigation: PropTypes.shape({
    pop: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
}

export default PreviewFilters
