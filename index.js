import { AppRegistry } from 'react-native';
import App from './App';
import { YellowBox } from 'react-native';
import SearchTeam from "./Components/Team/SearchTeam";
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

AppRegistry.registerComponent('Reackathon', () => App)