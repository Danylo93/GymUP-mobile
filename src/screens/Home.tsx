import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FlatList, Heading, HStack, Text, useToast, VStack,Skeleton} from 'native-base';
import { ScrollView } from 'react-native-virtualized-view'
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { ExerciseCard } from '@components/ExerciseCard';

import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { Loading } from '@components/Loading';
import OneSignal, { NotificationReceivedEvent, OSNotification } from 'react-native-onesignal';

export function Home() {

  const [isLoading, setIsLoading] = useState(false);
  const  [groupsLoading, setGroupsLoading] = useState(false);
  const  [exercisesLoading, setExercisesLoading] = useState(false);
  const [groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState('antebraço');

  const toast = useToast();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate('exercise', { exerciseId });
  }

  async function fetchGroups() {
    try {
      setGroupsLoading(true)
      const response = await api.get('/groups');
      setGroups(response.data);
      

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }finally{
      setGroupsLoading(false)
    }
  }

  async function fecthExercisesByGroup() {
    try {
      setExercisesLoading(true);
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
    //console.log(response.data);
      setExercises(response.data);
      
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setExercisesLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  },[])

  useFocusEffect(
    useCallback(() => {
      fecthExercisesByGroup()
    },[groupSelected])
  )

  return (
    <>
    <VStack flex={1}>
      <HomeHeader />

      <HStack>
      <FlatList 
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <>
           {
            groupsLoading ?
              <Skeleton 
              mr={3}
              w={24}
              h={10}
              bg="gray.600"
              rounded="md"
              startColor="gray.500"
              endColor="gray.400"
              />
            :
            <Group 
            name={item}
            isActive={groupSelected.toLocaleUpperCase() == item.toLocaleUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
          }
           
        </>
          
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{
          px: 10,
        }}
        my={10}
        maxH={10}
      />
      </HStack>

      {
        isLoading ? <Loading /> :
        <VStack px={8}>
          <HStack justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="md" fontFamily="heading">
              Exercícios
            </Heading>

            <Text color="gray.200" fontSize="sm">
              {exercises.length}
            </Text>
          </HStack>
          
          
        </VStack>
      }
      <ScrollView style={{ marginHorizontal: 20}}>
        
        <FlatList
        data={exercises}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <>
       {
        exercisesLoading ?
          <Skeleton
          zIndex={1}
          rounded="md"
          mb={3}
          h={20}
          bg="gray.600"
          startColor="gray.500"
          endColor="gray.400"

          />
        :
        <ExerciseCard 
        onPress={() => handleOpenExerciseDetails(item.id)}
        data={item}
      />
      }
       
    </>   
        )}
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{
          paddingBottom: 20
        }}
      />
      
      </ScrollView>
      
    </VStack>
    
    
    </>
    
  );
}