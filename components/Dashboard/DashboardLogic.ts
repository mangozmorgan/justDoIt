import { User } from '../../interfaces/UserInterface'
import { useCallback, useEffect, useState } from "react";
import { auth, database } from "../../config/firebaseConfig";
import { Task } from "../../interfaces/TaskInterface";
import {  get, ref } from "firebase/database";
import { useFocusEffect } from '@react-navigation/native';
import { PublicUserInterface } from '../../interfaces/PublicUserInterface';



const DashboardLogic = () => {

    const currentUser = auth.currentUser;

    if( currentUser ){
      
        const [isModalDetailsTaskVisible, setModalDetailsTaskVisible] = useState(false);
        const [data, setData] = useState<Record<string, Task> | null>(null);
        const [user, setUser] = useState<User | null>(null);
        const [houseId, setHouseId] = useState<string | null>(null);
        const [allHouseUsers, setAllHouseUsers] = useState<PublicUserInterface | null>(null);
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

          if( allHouseUsers ){

            task.responsable = task.responsable.map(responsableId => {
              
                const username = allHouseUsers[responsableId]?.name; 
                return username; 
            });
  
            task.createdBy = allHouseUsers[task.createdBy]?.name
          }else{
            console.error("allHouseUsers n'est pas défini")
          }
          
          
          console.log(task);
          // if( realname ){
          //   task.responsable = realname

          // }
          setModalDatas(task)
          handleModal()

        }

        const getAllUsersFromHouse = async (houseId: string) => {
          console.log("getAllUsersFromHouse");
          const snapshot = await get(ref(database, `userByHouse/${houseId}`));

          const data = snapshot.val();
          
          if (typeof data === "object" && data !== null) {
            setAllHouseUsers(data); 
          } else {
            console.log("Données incorrectes pour les utilisateurs de la maison.");
          }          
        }

        const getTasks = async (userUID: string) => {
          
            try {
              
              const snapshot = await get(ref(database, `tasks/${userUID}`));
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

        const getUser = async (userId: string) => {
          const snapshot = await get(ref(database, `users/${userId}`));
          if (snapshot.exists()) {
            setUser(snapshot.val() as User);
          } else {
            setUser(null);
          }
        }

        const getTimeWithoutHours = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const getHouseId = async (userUID: string) => {
            let res = null
            const snapshot = await get(ref(database, `users/${userUID}`));

            if( snapshot.exists() ){
              res = (snapshot.val() as User).houseId
            }
            
            setHouseId(res)
        }

        const fetchData = async () => { 
          
            try {              
              
              await getHouseId(currentUser.uid);
              
              if( houseId ){   

                await getAllUsersFromHouse(houseId)
                
                if (allHouseUsers) {
                  const findedUser = Object.entries(allHouseUsers).find(
                    ([userid, user]) => userid === currentUser.uid
                  );
                  console.log(findedUser);
                } else {
                  console.log("usersList is null or undefined");
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

        useEffect(() => {

          if (houseId) {           
          
            getAllUsersFromHouse(houseId);
            getTasks(houseId);
            getUser(currentUser.uid);
            
          }
        }, [houseId]); 

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