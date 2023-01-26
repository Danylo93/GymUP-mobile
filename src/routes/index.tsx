import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { Box, useTheme } from 'native-base'
import { Notification } from '@components/Notification'
import { useAuth } from '@hooks/useAuth'
import { AppRoutes } from './app.routes'
import { AuthRoutes } from './auth.routes'
import { Loading } from '@components/Loading'
import { useEffect, useState } from 'react'
import OneSignal, { NotificationReceivedEvent, OSNotification } from 'react-native-onesignal'

export function Routes() {

	const [notifications, setNotifications] = useState<OSNotification>();

	OneSignal.promptForPushNotificationsWithUserResponse();
  
	  useEffect(() => {
		  const unsubscribe = OneSignal
		  .setNotificationWillShowInForegroundHandler((notificationReceivedEvent: NotificationReceivedEvent) => {
			  const response = notificationReceivedEvent.getNotification();
		setNotifications(response);
		  });
		  return () => unsubscribe;
	  
	  }, [])
	const { colors } = useTheme()

	const { user, isLoadingUserStorageData } = useAuth()

	const theme = DefaultTheme
	theme.colors.background = colors.gray[700]

	if (isLoadingUserStorageData) {
		return <Loading />
	}

	return (
		<Box flex={1} bg="gray.700">
			<NavigationContainer theme={theme}>
				{user.id ? <AppRoutes /> : <AuthRoutes />}
				{
				notifications?.title &&
				<Notification 
					title={notifications.title}
					onClose={() => setNotifications(undefined)} 
					/>
   				}
			</NavigationContainer>
		</Box>
	)
}
