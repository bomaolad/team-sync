import React, { useState, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { ApText } from './ApText';
import { ApInput } from './ApInput';
import Icon from '@expo/vector-icons/Feather';
import { useAppTheme } from '../hooks/useAppTheme';
import { ApTheme } from './ApTheme';

interface ApSelectProps<T> {
  label?: string;
  value?: string | number | null | (string | number)[];
  options: T[];
  onChange: (value: any) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  multiple?: boolean;
  getLabel?: (item: T) => string;
  getValue?: (item: T) => string | number;
  renderItem?: (item: T, isSelected: boolean) => React.ReactNode;
  renderTrigger?: (selectedItem: T | T[] | undefined) => React.ReactNode;
  error?: string;
  disabled?: boolean;
}

export const ApSelect = <T extends any>({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  searchPlaceholder = 'Search...',
  multiple = false,
  getLabel = (item: any) => item.label || item.toString(),
  getValue = (item: any) => item.value || item.id || item.toString(),
  renderItem,
  renderTrigger,
  error,
  disabled = false,
}: ApSelectProps<T>) => {
  const { colors } = useAppTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedItems = useMemo(() => {
    if (multiple) {
      if (Array.isArray(value)) {
        return options.filter(item => value.includes(getValue(item)));
      }
      return [];
    }
    return options.find(item => getValue(item) === value);
  }, [options, value, getValue, multiple]);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery) return options;
    return options.filter(item =>
      getLabel(item).toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery, searchable, getLabel]);

  const handleSelect = (item: T) => {
    const itemValue = getValue(item);
    if (multiple) {
      let currentValues = Array.isArray(value) ? [...value] : [];
      if (currentValues.includes(itemValue)) {
        currentValues = currentValues.filter(v => v !== itemValue);
      } else {
        currentValues.push(itemValue);
      }
      onChange(currentValues);
    } else {
      onChange(itemValue);
      setModalVisible(false);
      setSearchQuery('');
    }
  };

  const defaultRenderItem = ({ item }: { item: T }) => {
    const isSelected = multiple
      ? Array.isArray(value) && value.includes(getValue(item))
      : getValue(item) === value;

    return (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        className="flex-row items-center justify-between p-4 border-b"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: isSelected
            ? ApTheme.Color.primary + '10'
            : 'transparent',
        }}
      >
        {renderItem ? (
          renderItem(item, isSelected)
        ) : (
          <ApText
            size="md"
            weight={isSelected ? 'semibold' : 'normal'}
            color={isSelected ? ApTheme.Color.primary : colors.text.primary}
          >
            {getLabel(item)}
          </ApText>
        )}
        {isSelected && (
          <Icon name="check" size={20} color={ApTheme.Color.primary} />
        )}
      </TouchableOpacity>
    );
  };

  const getTriggerLabel = () => {
    if (multiple) {
      const items = selectedItems as T[];
      if (items.length > 0) {
        if (items.length === 1) return getLabel(items[0]);
        return `${items.length} selected`;
      }
      return placeholder;
    } else {
      const item = selectedItems as T | undefined;
      return item ? getLabel(item) : placeholder;
    }
  };

  const hasSelection = multiple
    ? (selectedItems as T[]).length > 0
    : !!selectedItems;

  return (
    <View className="mb-4">
      {label && (
        <ApText
          size="sm"
          weight="medium"
          color={colors.text.secondary}
          className="mb-1"
        >
          {label}
        </ApText>
      )}

      <TouchableOpacity
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
        className="flex-row items-center justify-between px-4 h-12 rounded-lg border"
        style={{
          backgroundColor: disabled ? colors.background : colors.surface,
          borderColor: error ? ApTheme.Color.danger : colors.border,
          opacity: disabled ? 0.7 : 1,
        }}
      >
        {renderTrigger ? (
          renderTrigger(selectedItems)
        ) : (
          <ApText
            size="md"
            color={hasSelection ? colors.text.primary : colors.text.muted}
            numberOfLines={1}
            className="flex-1"
          >
            {getTriggerLabel()}
          </ApText>
        )}
        <Icon
          name="chevron-down"
          size={20}
          color={colors.text.muted}
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      {error && (
        <ApText size="xs" color={ApTheme.Color.danger} className="mt-1">
          {error}
        </ApText>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            className="flex-1 justify-end"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <TouchableWithoutFeedback>
              <View
                className="w-full rounded-t-2xl pt-4 max-h-[80%]"
                style={{ backgroundColor: colors.surface }}
              >
                <View
                  className="px-4 pb-2 flex-row justify-between items-center border-b"
                  style={{
                    borderBottomColor: colors.border,
                    paddingBottom: 16,
                  }}
                >
                  <ApText size="lg" weight="bold">
                    {label || placeholder}
                  </ApText>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Icon name="x" size={24} color={colors.text.primary} />
                  </TouchableOpacity>
                </View>

                {searchable && (
                  <View className="px-4 pt-4">
                    <ApInput
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      leftIcon="search"
                      autoFocus={false}
                    />
                  </View>
                )}

                <FlatList
                  data={filteredOptions}
                  keyExtractor={item => String(getValue(item))}
                  renderItem={defaultRenderItem}
                  contentContainerStyle={{ paddingBottom: 40 }}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    <View className="p-8 items-center">
                      <ApText color={colors.text.muted}>
                        No options found
                      </ApText>
                    </View>
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
