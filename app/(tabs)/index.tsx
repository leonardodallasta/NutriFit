import { Redirect } from 'expo-router';
import React from 'react';

// redireciona depois do login!!!
export default function TabIndex() {
  return <Redirect href={'/(tabs)/metas'} />;
}
