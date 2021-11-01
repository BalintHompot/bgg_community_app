import DropDownPicker, {
  DropDownPickerProps
} from 'react-native-dropdown-picker'
import React, { useState } from 'reactn'

interface CustomSelectProps {
  initialValues?: string[]
}

type SelectListProps = Pick<
  DropDownPickerProps,
  | 'zIndex'
  | 'zIndexInverse'
  | 'items'
  | 'multiple'
  | 'renderBadgeItem'
  | 'placeholder'
  | 'onChangeValue'
> &
  CustomSelectProps

export default ({
  items,
  zIndex,
  zIndexInverse,
  multiple,
  renderBadgeItem,
  placeholder,
  initialValues,
  onChangeValue,
}: SelectListProps) => {
  if (!initialValues) initialValues = multiple ? [] : [null]

  const [listOpen, setListOpen] = useState(false)
  const [listSelection, setListSelection] = useState(
    multiple ? initialValues : initialValues[0]
  )
  React.useEffect(() => {
    setListSelection(multiple ? initialValues : initialValues[0])
  }, [initialValues])

  return (
    <DropDownPicker
      listMode="SCROLLVIEW"
      zIndex={zIndex}
      zIndexInverse={zIndexInverse}
      multiple={multiple}
      mode={multiple ? 'BADGE' : 'SIMPLE'}
      placeholder={placeholder}
      style={{ margin: 0, height: 35 }}
      listItemContainerStyle={{ borderColor: 'red' }}
      items={items}
      open={listOpen}
      setOpen={setListOpen}
      value={listSelection}
      setValue={setListSelection}
      onChangeValue={onChangeValue}
      renderBadgeItem={renderBadgeItem}
      showBadgeDot={false}
    />
  )
}
