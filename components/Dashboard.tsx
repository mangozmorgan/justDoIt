import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { auth, database } from '../config/firebaseConfig'; 
import { ref, get } from 'firebase/database';
import TemplateWrapper from './shared/TemplateWrapper';
import NavBar from './NavBar';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

interface Task {
  name: string;
  status: string;
  responsable : string[],
  houseId: string,
  type : string,
  frequency : string,
  description : string,
  lastExecutionUserId : string,
  createdBy: string,
  nextExecutionUserId : string,
  executionDate : string
}


interface User {
  name: string;
  email: string;
  houseId: string;
  type: string;
}

const Dashboard: React.FC = () => {

  const currentUser = auth.currentUser;

  if(currentUser){

    const [data, setData] = useState<Record<string, Task> | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const formatDate = (date:string, withHours:boolean = false) => {
    const dateObject = new Date(date)
    
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const year = dateObject.getFullYear();
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');
    const seconds = String(dateObject.getSeconds()).padStart(2, '0');

    let stringDate = `${day}/${month}/${year}`;

    if( withHours ){
      stringDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
  
    return stringDate
  };

  const getTasks = async (userHouseId: string) => {
    
    try {
      const snapshot = await get(ref(database, `tasks/${userHouseId}`));
      
      if (snapshot.exists()) {
        
        const tasksSnapshot = snapshot.val() as Record<string, Task>;
        const finalTasks = Object.fromEntries(
          Object.entries(tasksSnapshot).filter(([_, task]) => task.nextExecutionUserId === currentUser.uid)
        );
        
        setData(finalTasks);

      } else {
        setData(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeWithoutHours = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const getHouseId = async (userUID: string) => {

    let res = null
    const snapshot = await get(ref(database, `users/${userUID}`));

    if( snapshot.exists() ){
      res = (snapshot.val() as User).houseId
    }

    return res
  }

  const fetchData = async () => { 

      try {
        
        const userHouseId = await getHouseId(currentUser.uid);

        if( userHouseId ){

          await getTasks(userHouseId);     
          const snapshot = await get(ref(database, `users/${currentUser.uid}`));
          if (snapshot.exists()) {
            setUser(snapshot.val() as User);
          } else {
            setUser(null);
          }
        }
        
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      } finally {
        setLoading(false);
      }
    
  };
  

  useEffect(() => {   
  
    fetchData();

  }, []);
  

  
  // Utilise useFocusEffect pour appeler getTasks chaque fois que le composant est affiché
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  if (loading) {
    return (
      <TemplateWrapper withLogo={true}>
        <ActivityIndicator size="large" color="#0000ff" />
      </TemplateWrapper>
    );
  }

  const timestamp = Date.now();
  const today = new Date(timestamp);  

  return (
  <TemplateWrapper  withLogo={true}>
    
    <View style={styles.topContainer}>
      <Text style={styles.subtitle}>Hello {user?.name}</Text>
      <NavBar />
    </View>
    
    {data ? (
      <ScrollView
       horizontal
       showsHorizontalScrollIndicator={false} 
       snapToAlignment="center"
      snapToInterval={360} 
      decelerationRate="fast"  >
          <View style={styles.container}>
            <View style={styles.tasksContainer}>
              <Text style={styles.today}>Aujourd'hui</Text>
              <ScrollView style={styles.scrollPart}>
                <View style={styles.thereTasks}>
                  {Object.keys(data).map((key) => {
                    if (getTimeWithoutHours(new Date(data[key].executionDate)).getTime() === getTimeWithoutHours(today).getTime()) {
                      return (
                        <TouchableOpacity key={key} style={styles.task}>
                          <Text  numberOfLines={1} style={styles.taskName}>{data[key].name}</Text>
                          <Text style={styles.taskStatus}>{formatDate(data[key].executionDate)}</Text>
                        </TouchableOpacity>
                      );
                    }
                    return null; 
                  })}
                </View>
                
              </ScrollView>
              
            </View>
            
            <View style={styles.tasksContainer}>
              <Text style={styles.today}>Tâches à venir</Text>
              <ScrollView style={styles.scrollPart}>
                <View style={styles.thereTasks}>
                  {Object.keys(data).map((key) => {
                    if (getTimeWithoutHours(new Date(data[key].executionDate)).getTime() > getTimeWithoutHours(today).getTime()) {
                      return (
                        <TouchableOpacity key={key} style={[styles.task, styles.futurTaskColor]}>
                          <Text numberOfLines={1} style={styles.taskName}>{data[key].name}</Text>
                          <Text style={styles.taskStatus}>{formatDate(data[key].executionDate)}</Text>
                        </TouchableOpacity>
                      );
                    }
                    return null; 
                  })}
                </View>
                
              </ScrollView>
            
            </View>

            <View style={styles.tasksContainer}>
              <Text style={styles.today}>Tâches en retard</Text>
              <ScrollView style={styles.scrollPart}>
                <View style={styles.thereTasks}>
                  {Object.keys(data).map((key) => {
                    if (getTimeWithoutHours(new Date(data[key].executionDate)).getTime() < getTimeWithoutHours(today).getTime()) {
                      return (
                        <TouchableOpacity key={key} style={[styles.task, styles.lateTaskColor]}>
                          <Text numberOfLines={1} style={styles.taskName}>{data[key].name}</Text>
                          <Text style={styles.taskStatus}>{formatDate(data[key].executionDate)}</Text>
                        </TouchableOpacity>
                      );
                    }
                    return null; 
                  })}
                </View>
                
              </ScrollView>
              
            </View>

        </View>
      </ScrollView>
      
      
    ) : (
      <Text style={styles.today} >Aucunes tâches de prévues</Text>
    )}
  </TemplateWrapper>
  );

  }
  

};


const styles = StyleSheet.create({
  topContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '20%',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    overflow: 'scroll',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  cloudContainer: {
    color: '#fff',
    opacity: 0.6,
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  task: {   
    display: 'flex',
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '95%',
    paddingVertical: 10, 
    paddingHorizontal: 15,
    backgroundColor: '#A9C6FF',
    borderRadius: 10
  },
  futurTaskColor: {
    backgroundColor: "#D0ABFD"
  },
  lateTaskColor: {
    backgroundColor: "#F7D794"
  },
  taskName: {
    fontSize: 18,
    width: '60%',
    color: '#fff',
  },
  today: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10
  },
  tasksContainer: {
    display: 'flex',
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 30,
    alignItems: 'center',
    borderRadius: 10,  
    width: 320,
    height:'90%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  scrollPart: {
    height:'15%',
    overflow: 'scroll',
  },
  thereTasks:{
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  taskStatus: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.7,
  },
});

export default Dashboard;
