import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';

import { Center, Heading, Text, VStack, SectionList, useToast, Skeleton } from 'native-base';
import { useAuth } from '@hooks/useAuth';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { Loading } from '@components/Loading';
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';



export function History(){

    const [isLoading, setIsLoading] = useState(true);
    const [isHistoryLoading, setHistoryIsLoading] = useState(true);
    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);
  
    const toast = useToast();
    const { refreshedToken } = useAuth();
  
    async function fetchHistory() {
      try {
        setHistoryIsLoading(true);
        const response = await api.get('/history');
  
        setExercises(response.data);
  
      } catch (error) {
        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercício';
  
        toast.show({
          title,
          placement: 'top',
          bgColor: 'red.500'
        });
      } finally {
        setHistoryIsLoading(false);
      }
    }

     useFocusEffect(
      useCallback(() => {
        fetchHistory()
      },[refreshedToken])
    )

    return(
        <VStack flex={1}>
           <ScreenHeader title='Histórico de Exercícios'/>

           
        
            {exercises.length > 0 ?
              
              <SectionList 
              sections={exercises}
              keyExtractor={item => item.id}
              renderItem={({ item }) => 
              
              <>
              {
               isHistoryLoading ?
              <Skeleton
              w="full"
              h={20}
              px={5}
              py={4} 
              mb={3}  
              rounded="md"
              bg="gray.600"
              startColor="gray.500"
              endColor="gray.400"
              />
            :
            <HistoryCard data={item} />
          }
          </>
             
            }
              renderSectionHeader={({ section }) => (
                <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
                  {section.title}
                </Heading>
              )}
              px={8}
              contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
              showsVerticalScrollIndicator={false}
            />  :
           <Center flex={1}>
            <Text color="gray.100" textAlign="center">
              Não há exercícios registrados ainda. {'\n'}
              Vamos fazer exercícios hoje?
            </Text>
          </Center>}
          
           
        
        
      
          
        </VStack>
        
    )
}