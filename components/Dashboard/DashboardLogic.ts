import { User } from '../../interfaces/UserInterface'
import { useCallback, useEffect, useState } from "react";
import { auth, database } from "../../config/firebaseConfig";
import { Task } from "../../interfaces/TaskInterface";
import {  get, ref,remove} from "firebase/database";
import { useFocusEffect } from '@react-navigation/native';
import { PublicUserInterface } from '../../interfaces/PublicUserInterface';
import Toast from 'react-native-toast-message';
import TaskService from '../../services/TaskService';


const taskService = TaskService();

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
          
          setModalDatas(task)
          handleModal()

        }

        const getAllUsersFromHouse = async (houseId: string) => {
          
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
              console.log('on recup les tasks')
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

        

        const removeTask = async (taskId: string) => {

          if( houseId ){

              // await remove(ref(database, `tasks/${houseId}/${taskId}`));
  
              const res = await taskService.removeTaskService(houseId, taskId);

              if( res ){

                setData((prevData) => {
                  if (!prevData) return prevData;
                  const updatedData = { ...prevData };
                  delete updatedData[taskId];
                  return updatedData;
                });
  
                handleModal()
                
                Toast.show({
                  text1: 'Suppression de tâche',
                  text2: 'Tâche supprimée avec succès ! 🎉',
                  type: 'success',
                  position: 'top',
                  visibilityTime: 3000,
                  topOffset: 50,
                  autoHide: true,
                });

              }else{

                Toast.show({
                  text1: 'Suppression de tâche',
                  text2: 'Oups il y à eu un problème.. Veuillez recommencer',
                  type: 'error',
                  position: 'top',
                  visibilityTime: 3000,
                  topOffset: 50,
                  autoHide: true,
                });

              }
            
          }else{
            console.error("no houseId")
          }   
          

        }
        
        const validateTask = async (taskId: string) => {
          
          
          //TODO :  doit checker :

          //si la tache est recurrente           

          //si OUI :
            //et plusieurs responsables, alors on passe le nextUtilisateurId au suivant, on donne l'id du responsable actuel à lastExecutionId 
          
            //on gère la prochaine date d'execution en fonction de la récurrence et on met a jour la tache dans dashboard (data)
          
          //si NON :
            // on peut la supprimer de la DB définitivement 

          // Toast pour valider l'action de user

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
            // getTasks(houseId);
            getUser(currentUser.uid);
            
          }
        }, [houseId]); 

        useFocusEffect(
            useCallback(() => {            

            if( houseId ){
              getTasks(houseId);
              
            }

              fetchData();  

            }, [houseId])
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
            formatDate,
            removeTask,
            validateTask
        }

    }
}

export default DashboardLogic