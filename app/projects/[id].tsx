import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ProjectDetailScreen } from '@/src/modules/projects/screen';

const ProjectDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ProjectDetailScreen projectId={id} />;
};

export default ProjectDetail;
