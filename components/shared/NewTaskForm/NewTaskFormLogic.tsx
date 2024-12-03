import {  useState } from 'react';
import { useForm } from 'react-hook-form';
import { ref, get, push, set } from 'firebase/database';
import { database, auth } from '../../../config/firebaseConfig';
import Toast from 'react-native-toast-message';
import { TaskFormValues } from '../../../interfaces/TaskFormValuesInterface';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { User } from '../../../interfaces/UserInterface';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AddTask'>;


const UseNewTaskFormLogic = () => {
  const navigation = useNavigation<NavigationProp>();

  const { control, formState: { errors, isSubmitting }, getValues, handleSubmit } = useForm<TaskFormValues>({
    defaultValues: {
      name: '',
      type: '',
      schedule: '',
      who: '',
      description: '',
    },
  });

  const userList: { [key: string]: User } = {

    Wyn0uVKrIsZ4pbriHzugzOLAxAn1: {
        "name": "Morgan",
        "email": "devendev.pro@gmail.com",
        "houseId": '1',
        "type": "man"

      },
      oiursgWIIUY57KJGdff: {
        "name": "Valérie",
        "email": "val.lavril@gmail.com",
        "houseId": '1',
        "type": "woman"

      }
  };

  const dayList = {
    "monday": "Lundi",
    "tuesday": "Mardi",
    "wednesday": "Mercredi",
    "thursday": "Jeudi",
    "friday": "Vendredi",
    "saturday": "Samedi",
    "sunday": "Dimanche"
  };

  const itemSchedule = {
    'daily': 'Tout les jours',
    '5': 'Tout les 5 jours',
    '10': 'Tout les 10 jours',
    'monthly': 'Tout les mois',
  }

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? '0' : ''}${hours}H${minutes < 10 ? '0' : ''}${minutes}`;
  };

  

  const [taskName, setTaskName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUser, handleUserSelect] = useState<string[]>([]);
  const [isExpandedType, setIsExpandedType] = useState(false);
  const [isExpandedUser, setIsExpandedUser] = useState(false);
  const [isExpandedHour, setIsExpandedHour] = useState(false);
  const [isExpandedSchedule, setIsExpandedSchedule] = useState(false);
  const [isFrequencyPickerVisible, setIsFrequencyPickerVisible] = useState(false);
  const [isDaysPickerVisible, setIsDaysPickerVisible] = useState(false);
  const [isDateVisible, setDateVisible] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState<Date | null>(null);

  const [dateIsChanged, setDateIsChanged] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [showDateInput, setShowDateInput] = useState<boolean>(false);
  const [showHourInput, setShowHourInput] = useState<boolean>(false);

  

  const toggleFrequencyPicker = () => {
    setDateVisible(false)
    setIsFrequencyPickerVisible(!isFrequencyPickerVisible);
    setIsDaysPickerVisible(false);
  };

  const toggleDaysPicker = () => {
    setDateVisible(false)
    setIsDaysPickerVisible(!isDaysPickerVisible);
    setIsFrequencyPickerVisible(false);

  };
  
  const toggleDate = () => {
    setDateVisible(!isDateVisible);
    setIsFrequencyPickerVisible(false);
    setIsDaysPickerVisible(false);

  };

  const showDatepicker = () => {
    setShowDateInput(true);
  }; 
  
  const handleTypeSelect = (type:any) => {
    setSelectedType(prevType => (prevType === type ? '' : type));
  };
  
  const handleDaysChange = (res: any) => {
    setDateIsChanged(false)
    setSelectedDays(res);
    setSelectedFrequency([]); 
    setIsExpandedUser(false);

  };

  const handleDateChange = ( event: DateTimePickerEvent, date: Date | undefined) => {

    if (date) {
      setSelectedDate(date);
      setDateIsChanged(true)
      setShowDateInput(false);
      setSelectedDays([]);
      setSelectedFrequency([]); 
    }
    
  };

  

  const handleFrequencyChange = (res:any) => {
    setSelectedFrequency(res);
    setSelectedDays([]);
    setDateIsChanged(false)
  };
  
  const handleHourChange = (event: any, date?: Date) => {
    if (date) {
      // Si une date est sélectionnée, mettre à jour selectedHour
      setSelectedHour(date);
    } else if (event?.nativeEvent?.timestamp) {
      // Si on reçoit un timestamp, le convertir en Date
      setSelectedHour(new Date(event.nativeEvent.timestamp));
    }

    setShowDateInput(!showDateInput)
  };

  const getHouseId = async (userUID: string) => {
    let res = null
    const snapshot = await get(ref(database, `users/${userUID}`));
    if( snapshot.exists() ){
      res = (snapshot.val() as User).houseId
    }

    return res
  }

  const getNextExecutionDateByFrequency = (frequency: string) => {
    const today = new Date();
    let nextExecutionDate = new Date(today);
    
    switch (frequency) {
      case 'daily':
        // Prochaine exécution demain
        nextExecutionDate.setDate(today.getDate() + 1);
        break;
        
      case '5':
        // Prochaine exécution dans 5 jours
        nextExecutionDate.setDate(today.getDate() + 5);
        break;
        
      case '10':
        // Prochaine exécution dans 10 jours
        nextExecutionDate.setDate(today.getDate() + 10);
        break;
        
      case 'monthly':
        // Prochaine exécution dans un mois
        const currentMonth = today.getMonth();
        nextExecutionDate.setMonth(currentMonth + 1);
        // Si le jour du mois suivant n'existe pas (exemple : 31 février), on obtient le dernier jour du mois
        if (nextExecutionDate.getDate() < today.getDate()) {
          nextExecutionDate.setDate(0); // Reculer au dernier jour du mois précédent
        }
        break;
        
      default:
        return today;
    }
  
    return nextExecutionDate;
  };

  const getNextExecutionDateByDays = (selectedDays:Array<string>) => {
    // Map pour les jours de la semaine
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    
    // Obtenir l'index du jour actuel (0 pour dimanche, 6 pour samedi)
    const today = new Date();
    const todayIndex = today.getDay();
  
    // Convertir les jours sélectionnés en leurs indices
    const selectedIndices = selectedDays.map(day => daysOfWeek.indexOf(day.toLowerCase()));
  
    // Trouver le prochain jour d'exécution
    let minDaysUntilNext = 7;
    let nextDayIndex = todayIndex;
  
    selectedIndices.forEach(dayIndex => {
      const daysUntilNext = (dayIndex - todayIndex + 7) % 7;
      if (daysUntilNext > 0 && daysUntilNext < minDaysUntilNext) {
        minDaysUntilNext = daysUntilNext;
        nextDayIndex = dayIndex;
      }
    });
    
    // Calculer la date de la prochaine exécution
    const nextExecutionDate = new Date();
    nextExecutionDate.setDate(today.getDate() + minDaysUntilNext);
    
    console.log('nextExecutionDate : '+nextExecutionDate);
    return nextExecutionDate
  }

  const checkForm = (formCheck = false) => {

    let error =''
    
    if (selectedFrequency.length > 0 ||selectedDays.length > 0 || dateIsChanged) {

      if( selectedType !== '' ){

        if( selectedUser[0] ){

            if( selectedHour ){
              return true;
            }else{
              error = 'Heure'
            }
        }else{
          error = 'Responsable'
        }

      }else{
        error = 'Type'
      }
      
    }else{
      error = 'Fréquence'
    }      
    if (formCheck){
      Toast.show({
        text1: '⛔ Ajout d\'une tâche',
        text2: 'La partie '+error+" n'est pas valide",
        type: 'error',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 50,
        autoHide: true,
      });
    }
    

    return false
    
  }
  


  const onSubmit = async (data: TaskFormValues) => {
      
    const validForm = checkForm()

    if(validForm){
      // make task 
      let frequency 

      if( selectedFrequency.length > 0 ){

        frequency = selectedFrequency
      }
      
      if( selectedDays.length > 0 ){
        frequency = selectedDays
      }
      
      if( selectedDays.length > 0 ){
        frequency = selectedDays
      }

      if( dateIsChanged ){
        frequency = null
      }

      const user = auth.currentUser;
      let userArray = selectedUser
      
      if( selectedUser[0] === 'all'){
        console.log(userList);
        userArray = Object.keys(userList).map(user => user)  
        console.log(userList);

      }
      const taskId = Date.now()
      //TODO : faire passer en TS Task
      const task = {
        id: taskId,
        name : data.name,
        status : "En attente",
        responsable : userArray,
        houseId: "1234",
        type : selectedType,
        frequency : frequency,
        description : data.description,
        lastExecutionUserId : '',
        createdBy: user?.uid,
        createdDate: Date.now(),
        nextExecutionUserId : userArray[0],
        executionDate : selectedDate.toISOString(),
        executionHour : selectedHour?.toISOString().slice(11, 16),
      }

      if( user?.uid ){

        
        const houseId = await getHouseId(user.uid)
        const taskRef = ref(database, `tasks/${houseId}/${taskId}`);
      
        try {
          set(taskRef, task)
            .then(() => {
              Toast.show({
                text1: 'Ajout de tâche',
                text2: 'Tâche ajoutée avec succès ! 🎉',
                type: 'success',
                position: 'top',
                visibilityTime: 3000,
                topOffset: 50,
                autoHide: true,
              });
              navigation.navigate('Dashboard');
            })
            .catch((error) => {
              console.error("Erreur lors de l'ajout de la tâche :", error);
            });

        } catch (error) {
          Toast.show({
            text1: '⛔ Ajout de tâche',
            type: 'error',
            position: 'top',
            visibilityTime: 3000,
            topOffset: 50,
            autoHide: true,
          });
          console.error(error);
        }
      }
      
    }


    
  };

  return {
    control,
    errors,
    taskName,
    setTaskName,
    userList,
    checkForm,
    dayList, 
    itemSchedule,
    isSubmitting,
    toggleFrequencyPicker, 
    toggleDaysPicker, 
    toggleDate, 
    handleFrequencyChange, 
    handleDaysChange, 
    getNextExecutionDateByFrequency, 
    handleDateChange, 
    getNextExecutionDateByDays, 
    showDatepicker, 
    setIsExpandedUser,
    handleHourChange,
    setIsExpandedHour,
    isExpandedHour,
    isExpandedUser,
    handleSubmit,
    showHourInput,
    setShowHourInput,
    handleTypeSelect,
    isExpandedSchedule,
    setIsExpandedSchedule,
    isFrequencyPickerVisible, 
    setIsFrequencyPickerVisible,
    isDaysPickerVisible,
    setIsDaysPickerVisible,
    isDateVisible,
    setDateVisible,
    isExpandedType,
    setIsExpandedType,
    selectedType,
    setSelectedType,
    showDateInput,
    formatTime,
    setShowDateInput,
    selectedUser ,
    handleUserSelect,
    selectedFrequency,
    setSelectedFrequency,
    selectedDays,
    setSelectedDays,
    selectedDate,
    setSelectedDate,
    dateIsChanged,
    setDateIsChanged,
    description,
    setDescription,
    onSubmit,
    selectedHour,
    setSelectedHour,
    getCurrentTime
  };
};

export default UseNewTaskFormLogic