import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { auth, database } from '../config/firebaseConfig'; 
import { ref, get } from 'firebase/database';
import TemplateWrapper from './shared/TemplateWrapper';

interface Task {
  name: string;
  status: string;
}

const Dashboard: React.FC = () => {

  const [data, setData] = useState<Record<string, Task> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const fetchData = async () => {
        
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

      fetchData();
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
      <Text style={styles.subtitle}>Dashboard</Text>
      {data ? (
        <View>
          {Object.keys(data).map((key) => (
            <View key={key} style={styles.taskContainer}>
              <Text style={styles.taskName}>Name: {data[key].name}</Text>
              <Text style={styles.taskStatus}>Status: {data[key].status}</Text>
            </View>
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
  taskContainer: {
    marginBottom: 10,
  },
  taskName: {
    fontSize: 18,
    color: '#fff',
  },
  taskStatus: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.7,
  },
});

export default Dashboard;
