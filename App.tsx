import {
	Roboto_400Regular,
	Roboto_700Bold,
	useFonts
} from '@expo-google-fonts/roboto'
import { NativeBaseProvider } from 'native-base'
import { StatusBar } from 'react-native'

import { Loading } from '@components/Loading'
import { AuthContextProvider } from '@contexts/AuthContext'
import { Routes } from '@routes/index'
import { THEME } from './src/theme'
import OneSignal from 'react-native-onesignal';

OneSignal.setAppId('5e02a7ed-9bd8-407f-9568-3f84725e39c2');

export default function App() {
	const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })
	return (
		<NativeBaseProvider theme={THEME}>
			<StatusBar
				barStyle="light-content"
				backgroundColor="transparent"
				translucent
			/>
			<AuthContextProvider>
				{fontsLoaded ? <Routes /> : <Loading />}
			</AuthContextProvider>
		</NativeBaseProvider>
	)
}
