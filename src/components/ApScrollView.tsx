import React from 'react';
import { ScrollView, ScrollViewProps, RefreshControl } from 'react-native';
import { ApTheme } from './ApTheme';

interface ApScrollViewProps extends ScrollViewProps {
  refreshing?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export const ApScrollView: React.FC<ApScrollViewProps> = ({
  children,
  refreshing = false,
  onRefresh,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  ...props
}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[
        {
          paddingBottom: ApTheme.Spacing.xl,
        },
        contentContainerStyle,
      ]}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ApTheme.Color.primary}
          />
        ) : undefined
      }
      {...props}
    >
      {children}
    </ScrollView>
  );
};
