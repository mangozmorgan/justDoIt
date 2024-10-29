import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { auth, database } from '../config/firebaseConfig'; 
import { ref, get } from 'firebase/database';
import TemplateWrapper from './shared/TemplateWrapper';
import NavBar from './NavBar';

interface Task {
  name: string;
  status: string;
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
      <TemplateWrapper>
        <ActivityIndicator size="large" color="#0000ff" />
      </TemplateWrapper>
    );
  }

  return (
    <TemplateWrapper>
      <Text style={styles.subtitle}>Hello {user?.name}</Text>
        <NavBar></NavBar>
        {data ? (
          <View style={styles.tasksContainer}>
            <Text style={styles.today}>Aujourdhui</Text>
            {Object.keys(data).map((key) => (
              <TouchableOpacity key={key} style={styles.task}>
                <Text style={styles.taskName}>Name: {data[key].name}</Text>
                <Text style={styles.taskStatus}>Status: {data[key].status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text>No data available</Text>
        )}
      
      
    </TemplateWrapper>
  );
};


const styles = StyleSheet.create({
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
    marginBottom: 10,
    width: '90%',
    paddingVertical: 10, 
    paddingHorizontal: 20,
    backgroundColor: '#A9C6FF',
    borderRadius: 10
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  taskStatus: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.7,
  },
});

export default Dashboard;
