import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { CreateTaskScreen } from '@/src/modules/tasks/screen';

const CreateTask = () => {
  const { taskId } = useLocalSearchParams<{ taskId?: string }>();
  return <CreateTaskScreen taskId={taskId} />;
};

export default CreateTask;
