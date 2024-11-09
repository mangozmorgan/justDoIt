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
  executionDate: string;
}


interface User {
  name: string;
  email: string;
}

const Dashboard: React.FC = () => {

  const [data, setData] = useState<Record<string, Task> | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getTasks = async (userId: string) => {
        
    try {
      const snapshot = await get(ref(database, `tasks/${userId}`));
      
      if (snapshot.exists()) {
        console.log(snapshot.val());
        setData(snapshot.val());
      } else {
        console.log('Aucune donnée disponible');
        setData(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {

    const user = auth.currentUser;

    if (user) {

      getTasks(user.uid)
      
      

      const getUser = async () => {
        try {
          const snapshot = await get(ref(database, `users/${user.uid}`));
          
          if (snapshot.exists()) {
            setUser(snapshot.val() as User);
          } else {
            
            setUser(null);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données user:', error);
        } finally {
          setLoading(false);
        }
      }

      getUser();
    } else {
      setLoading(false); 
    }

    
  }, []);

  
 // Utilise useFocusEffect pour appeler getTasks chaque fois que le composant est affiché
 useFocusEffect(
  useCallback(() => {
    const user = auth.currentUser;
    getTasks(user ? user.uid : '' );
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
  const date = new Date(timestamp);  
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

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
      snapToInterval={355} 
      decelerationRate="fast"  >
          <View style={styles.container}>
            <View style={styles.tasksContainer}>
              <Text style={styles.today}>Aujourd'hui</Text>
              <ScrollView style={styles.scrollPart}>
                <View style={styles.thereTasks}>
                  {Object.keys(data).map((key) => {
                    if (data[key].executionDate !== today) {
                      return (
                        <TouchableOpacity key={key} style={styles.task}>
                          <Text  numberOfLines={1} style={styles.taskName}>{data[key].name}</Text>
                          <Text style={styles.taskStatus}>{data[key].executionDate}</Text>
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
                    if (data[key].executionDate !== today) {
                      return (
                        <TouchableOpacity key={key} style={[styles.task, styles.lateTaskColor]}>
                          <Text numberOfLines={1} style={styles.taskName}>{data[key].name}</Text>
                          <Text style={styles.taskStatus}>{data[key].executionDate}</Text>
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
                    if (data[key].executionDate !== today) {
                      return (
                        <TouchableOpacity key={key} style={[styles.task, styles.futurTaskColor]}>
                          <Text numberOfLines={1} style={styles.taskName}>{data[key].name}</Text>
                          <Text style={styles.taskStatus}>{data[key].executionDate}</Text>
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
      <Text>No data available</Text>
    )}
  </TemplateWrapper>
);

};


const styles = StyleSheet.create({
  topContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '20%'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'scroll',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingRight: 130,
    paddingLeft: 10,
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
    width: '90%',
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
    width: '65%',
    color: '#fff',
  },
  today: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10
  },
  tasksContainer: {
    marginRight: 10,
    display: 'flex',
    paddingVertical: 10,
    paddingBottom: 30,
    alignItems: 'center',
    borderRadius: 10,    
    width: '37%',
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
