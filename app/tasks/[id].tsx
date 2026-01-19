import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { TaskDetailScreen } from '@/src/modules/tasks/screen';

const TaskDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <TaskDetailScreen taskId={id} />;
};

export default TaskDetail;
