import { User } from '../../interfaces/UserInterface'
import { useCallback, useEffect, useState } from "react";
import { auth, database } from "../../config/firebaseConfig";
import { Task } from "../../interfaces/TaskInterface";
import {  get, ref } from "firebase/database";
import { useFocusEffect } from '@react-navigation/native';
import { PublicUserInterface } from '../../interfaces/PublicUserInterface';
import Toast from 'react-native-toast-message';
import TaskService from '../../services/TaskService';

const taskService = TaskService();

const DashboardLogic = () => {

  const dayList = [
    "monday",
    "tuesday",
    "wednesday",
     "thursday",
    "friday",
     "saturday",
    "sunday"
  ];
  
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
              const snapshot = await get(ref(database, `tasks/${userUID}`));
              if (snapshot.exists()) {
                
                const tasksSnapshot = snapshot.val() as Record<string, Task>;
                Object.values(tasksSnapshot).forEach((entry: Task) => {
                  console.log(entry.responsable);
              });
                const finalTasks = Object.fromEntries(
                  Object.entries(tasksSnapshot).filter(([_, task]) => task.nextExecutionUserId === currentUser.uid)
                );
                // console.log(finalTasks);
                setData(finalTasks);
        // console.log(data)
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

        const removeTaskFromDashboard = (taskId: string) => {
          setData((prevData) => {
            if (!prevData) return prevData;
            const updatedData = { ...prevData };
            delete updatedData[taskId];
            return updatedData;
          });
        }

        const removeTask = async (taskId: string) => {

          if( houseId ){
  
              const res = await taskService.removeTaskService(houseId, taskId);

              if( res ){

                removeTaskFromDashboard(taskId)
  
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
        
        const validateTask = async (task: Task) => {
          
          
          if( houseId ){
            if( task.frequency ){
              
              //et plusieurs responsables, alors on passe le nextUtilisateurId au suivant, on donne l'id du responsable actuel à lastExecutionId 
              if( task.responsable && task.responsable.length >= 1 ){
  
                let indexCurrentUser = 0 ;
  
                for( let i = 0 ; i < task.responsable.length ; i++){
  
                  if ( task.responsable[i] !== currentUser.uid){
                    indexCurrentUser++
                  }
  
                }
  
                indexCurrentUser--

                if( task.responsable[indexCurrentUser] ){
                  task.nextExecutionUserId = task.responsable[indexCurrentUser].id
                }else{
                  task.nextExecutionUserId = task.responsable[0].id
                }
  
                // pour passer au prochain responsable de la tâche
                task.lastExecutionUserId = currentUser.uid
                removeTaskFromDashboard(task.id)
                console.log(task);
  
              }
  
              handleModal()
                  
              Toast.show({
                text1: 'Validation de tâche',
                text2: 'Tâche validée avec succès ! 🎉',
                type: 'success',
                position: 'top',
                visibilityTime: 3000,
                topOffset: 50,
                autoHide: true,
              });
  

              //si c'est une recurrence par jours
              if( dayList.includes(task.frequency[0]) ){
                const currentDay = new Date(task.executionDate).toLocaleString('en-US', { weekday: 'long' });
                const currentIndex = dayList.indexOf(currentDay);
                let closestDay = null;
                let closestDistance = Infinity;

                task.frequency.forEach(day => {
                    const dayIndex = dayList.indexOf(day);
                    const distance = (dayIndex - currentIndex + 7) % 7;
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestDay = day;
                    }
                });

                // Calculer la date du prochain jour correspondant
                if( closestDay ){
                  const nextDate = new Date();
                  nextDate.setDate(nextDate.getDate() + closestDistance);
                  task.executionDate = nextDate.toISOString();
                }
                

              }else{
                //TODO : reste a voir que la tache sois directe decallé dans le dashboard
                // repousser la date du chiffre donné
                let date = new Date(task.executionDate);
                date.setDate( date.getDate() + Number(task.frequency[0]) );
                task.executionDate = date.toISOString();
              }
              
              const timestamp = Date.now();
              const date = new Date(timestamp);
              task.lastExecutionDate = date.toISOString(); 
              taskService.updateTaskService(houseId, task.id, task)
  
  
            }else{

              taskService.removeTaskService(houseId, task.id)
  
            }  
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