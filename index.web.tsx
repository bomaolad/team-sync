import { AppRegistry } from 'react-native';
import App from './App.web';

const appName = 'TeamSyncApp';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
