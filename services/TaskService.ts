import {  get, ref,remove} from "firebase/database";
import { auth, database } from "../config/firebaseConfig";
import { Task } from "../interfaces/TaskInterface";



const TaskService = () => {

	const removeTaskService = async (houseId: string, taskId: string) => {

		try{

			await remove(ref(database, `tasks/${houseId}/${taskId}`));
			return true

		}catch(error){
			return error
		}
		
	}

	const getTasksService = async (userUID: string, currentUserUID: string) => {
          
		try {
		  
		  const snapshot = await get(ref(database, `tasks/${userUID}`));

		  if (snapshot.exists()) {
			
			const tasksSnapshot = snapshot.val() as Record<string, Task>;
			const finalTasks = Object.fromEntries(
			  Object.entries(tasksSnapshot).filter(([_, task]) => task.nextExecutionUserId === currentUserUID)
			);
			
			return finalTasks;
	
		  } else {
			return {}
		  }
		} catch (error) {
			
		  console.error('Erreur lors de la récupération des données:', error);
		} finally {
		//   setLoading(false);
		}
	};

	return {
		getTasksService,
		removeTaskService
	}

}

export default TaskService;