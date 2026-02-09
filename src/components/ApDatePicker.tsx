import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { ApText } from './ApText';
import { ApButton } from './ApButton';
import Icon from '@expo/vector-icons/Feather';
import { useAppTheme } from '../hooks/useAppTheme';
import { ApTheme } from './ApTheme';

interface ApDatePickerProps {
  label?: string;
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  error?: string;
  minDate?: string;
  maxDate?: string;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const formatDisplayDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const ApDatePicker: React.FC<ApDatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  error,
  minDate,
  maxDate,
}) => {
  const { colors } = useAppTheme();
  const [showPicker, setShowPicker] = useState(false);

  const today = new Date();
  const initialDate = value ? new Date(value) : today;

  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());

  const handleOpen = () => {
    if (value) {
      const date = new Date(value);
      setSelectedYear(date.getFullYear());
      setSelectedMonth(date.getMonth());
      setSelectedDay(date.getDate());
    } else {
      setSelectedYear(today.getFullYear());
      setSelectedMonth(today.getMonth());
      setSelectedDay(today.getDate());
    }
    setShowPicker(true);
  };

  const handleConfirm = () => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(
      2,
      '0',
    )}-${String(selectedDay).padStart(2, '0')}`;
    onChange(dateStr);
    setShowPicker(false);
  };

  const handleClear = () => {
    onChange('');
    setShowPicker(false);
  };

  const changeMonth = (delta: number) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);

    const daysInNewMonth = getDaysInMonth(newYear, newMonth);
    if (selectedDay > daysInNewMonth) {
      setSelectedDay(daysInNewMonth);
    }
  };

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

  const renderCalendar = () => {
    const days = [];
    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    for (let i = 0; i < 7; i++) {
      days.push(
        <View
          key={`header-${i}`}
          className="w-10 h-10 items-center justify-center"
        >
          <ApText size="xs" color={colors.text.muted} weight="medium">
            {weekDays[i]}
          </ApText>
        </View>,
      );
    }

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} className="w-10 h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDay;
      const isToday =
        day === today.getDate() &&
        selectedMonth === today.getMonth() &&
        selectedYear === today.getFullYear();

      days.push(
        <TouchableOpacity
          key={`day-${day}`}
          onPress={() => setSelectedDay(day)}
          className="w-10 h-10 items-center justify-center rounded-full"
          style={{
            backgroundColor: isSelected ? ApTheme.Color.primary : 'transparent',
          }}
        >
          <ApText
            size="sm"
            weight={isSelected || isToday ? 'semibold' : 'normal'}
            color={
              isSelected
                ? '#FFFFFF'
                : isToday
                ? ApTheme.Color.primary
                : colors.text.primary
            }
          >
            {day}
          </ApText>
        </TouchableOpacity>,
      );
    }

    return days;
  };

  if (Platform.OS === 'web') {
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
        <View
          className="flex-row items-center rounded-lg px-4 h-12"
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: error ? ApTheme.Color.danger : colors.border,
          }}
        >
          <Icon
            name="calendar"
            size={20}
            color={colors.text.muted}
            style={{ marginRight: 8 }}
          />
          <input
            type="date"
            value={value}
            onChange={e => onChange(e.target.value)}
            min={minDate}
            max={maxDate}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: value ? colors.text.primary : colors.text.muted,
              fontSize: 16,
              fontFamily: 'inherit',
            }}
          />
        </View>
        {error && (
          <ApText size="xs" color={ApTheme.Color.danger} className="mt-1">
            {error}
          </ApText>
        )}
      </View>
    );
  }

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
        onPress={handleOpen}
        className="flex-row items-center rounded-lg px-4 h-12"
        style={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: error ? ApTheme.Color.danger : colors.border,
        }}
      >
        <Icon
          name="calendar"
          size={20}
          color={colors.text.muted}
          style={{ marginRight: 8 }}
        />
        <ApText
          size="md"
          color={value ? colors.text.primary : colors.text.muted}
          className="flex-1"
        >
          {value ? formatDisplayDate(value) : placeholder}
        </ApText>
        <Icon name="chevron-down" size={20} color={colors.text.muted} />
      </TouchableOpacity>
      {error && (
        <ApText size="xs" color={ApTheme.Color.danger} className="mt-1">
          {error}
        </ApText>
      )}

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            className="rounded-2xl p-4 mx-6"
            style={{
              backgroundColor: colors.background,
              width: 320,
            }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <TouchableOpacity onPress={() => changeMonth(-1)} className="p-2">
                <Icon
                  name="chevron-left"
                  size={24}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
              <ApText size="lg" weight="semibold" color={colors.text.primary}>
                {MONTHS[selectedMonth]} {selectedYear}
              </ApText>
              <TouchableOpacity onPress={() => changeMonth(1)} className="p-2">
                <Icon
                  name="chevron-right"
                  size={24}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap justify-center">
              {renderCalendar()}
            </View>

            <View className="flex-row mt-4 gap-2">
              <ApButton
                title="Clear"
                variant="outline"
                onPress={handleClear}
                className="flex-1"
              />
              <ApButton
                title="Confirm"
                onPress={handleConfirm}
                className="flex-1"
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
