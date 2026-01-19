import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { CreateProjectScreen } from '@/src/modules/projects/screen';

const EditProject = () => {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  return <CreateProjectScreen projectId={projectId} />;
};

export default EditProject;
