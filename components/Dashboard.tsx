import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { auth, database } from '../config/firebaseConfig'; 
import { ref, get } from 'firebase/database';
import TemplateWrapper from './shared/TemplateWrapper';
import NavBar from './NavBar';

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
  

  useEffect(() => {

    const user = auth.currentUser;

    if (user) {

      const getTasks = async () => {
        
        try {
          const snapshot = await get(ref(database, `tasks/${user.uid}`));
          
          if (snapshot.exists()) {
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

      getTasks();
      getUser();
    } else {
      setLoading(false); 
    }
  }, []);

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
    <Text style={styles.subtitle}>Hello {user?.name}</Text>
    <NavBar />
    {data ? (
      <View style={styles.container}>
        <View style={styles.tasksContainer}>
          <Text style={styles.today}>Aujourd'hui</Text>
          {Object.keys(data).map((key) => {
            if (data[key].executionDate === today) {
              return (
                <TouchableOpacity key={key} style={styles.task}>
                  <Text style={styles.taskName}>{data[key].name}</Text>
                  <Text style={styles.taskStatus}>{data[key].executionDate}</Text>
                </TouchableOpacity>
              );
            }
            return null; 
          })}
        </View>
        <View style={styles.tasksContainer}>
          <Text style={styles.today}>Tâches à venir</Text>
          {Object.keys(data).map((key) => {
            if (data[key].executionDate !== today) {
              return (
                <TouchableOpacity key={key} style={[styles.task, styles.futurTaskColor]}>
                  <Text style={styles.taskName}>{data[key].name}</Text>
                  <Text style={styles.taskStatus}>{data[key].executionDate}</Text>
                </TouchableOpacity>
              );
            }
            return null; 
          })}
        </View>
      </View>
      
    ) : (
      <Text>No data available</Text>
    )}
  </TemplateWrapper>
);

};


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%'
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 40,
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
  taskName: {
    fontSize: 18,
    color: '#fff',
  },
  today: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10
  },
  tasksContainer: {
    marginTop: 10,
    display: 'flex',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  taskStatus: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.7,
  },
});

export default Dashboard;
