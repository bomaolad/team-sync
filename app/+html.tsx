import { ScrollViewStyleReset } from 'expo-router/html';
import React from 'react';

const Root = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>TeamSync</title>
        <meta
          name="description"
          content="Team collaboration and project management app"
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
};

export default Root;
