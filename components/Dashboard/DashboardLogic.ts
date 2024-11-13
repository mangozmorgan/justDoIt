import { User } from '../../interfaces/UserInterface'
import { useCallback, useEffect, useState } from "react";
import { auth, database } from "../../config/firebaseConfig";
import { Task } from "../../interfaces/TaskInterface";
import { get, ref } from "firebase/database";
import { useFocusEffect } from '@react-navigation/native';



const DashboardLogic = () => {

    const currentUser = auth.currentUser;

    if( currentUser ){

        const usersFromHouse = async() => {
          const usersList = await get(ref(database, `users/${currentUser.uid}`));
              
              if (usersList.exists()) {
                
                const tasksSnapshot = usersList.val() as Record<string, User>;
                console.log(tasksSnapshot);
              } else {
                setData(null);
              }
        }

        const [isModalDetailsTaskVisible, setModalDetailsTaskVisible] = useState(false);
        const [data, setData] = useState<Record<string, Task> | null>(null);
        const [user, setUser] = useState<User | null>(null);
        const [loading, setLoading] = useState<boolean>(true);
        const timestamp = Date.now();
        const handleModal = () => setModalDetailsTaskVisible(() => !isModalDetailsTaskVisible);
        
        const today = new Date(timestamp); 
        const [modalDatas, setModalDatas] = useState<Task | null>(null);

        const formatDate = (date:string, withHours:boolean = false) => {
          const dateObject = new Date(date)            
          const day = String(dateObject.getDate()).padStart(2, '0');
          const month = String(dateObject.getMonth() + 1).padStart(2, '0'); 
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

        

        const getTaskDetails = (task: Task) => {
          setModalDatas(task)
          handleModal()

        }

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

        useFocusEffect(
            useCallback(() => {
              fetchData();
            }, [])
        );

        return {
            user,
            loading,
            data,
            isModalDetailsTaskVisible,
            getTaskDetails,
            today,
            handleModal,
            modalDatas,
            getTimeWithoutHours,
            formatDate
        }

    }
}

export default DashboardLogic