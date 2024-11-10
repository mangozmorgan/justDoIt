import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, update, get, push, set  } from 'firebase/database';
import { TaskFormValues } from '../../interfaces/TaskFormValuesInterface';
import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import Cat from '../../assets/svg/cat';
import Cleaning from '../../assets/svg/cleaning';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import CustomMultiPicker from "react-native-multiple-select-list";
import { ScrollView } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Man from '../../assets/svg/man';
import Woman from '../../assets/svg/woman';
import EveryUser from '../../assets/svg/everyUser';
import Cloud3 from '../../assets/svg/cloud3';
import { database, auth } from '../../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';


interface User {
  name: string;
  email: string;
  type: string;
  houseId: string;
}

export default function NewTaskForm() {


  const MyForm = () => {
    
    const { control, formState: { errors, isSubmitting }, getValues, handleSubmit } = useForm<TaskFormValues>({
      defaultValues: {
        name: '',
        type: '',
        schedule: '',
        who: '',
        description: '',
      },
    });

    const [selectedType, setSelectedType] = useState('');
    const [description, setDescription] = useState('');
    const [selectedUser, handleUserSelect] = useState<string[]>([]);
    const [isExpandedType, setIsExpandedType] = useState(false);
    const [isExpandedUser, setIsExpandedUser] = useState(false);
    const [isExpandedSchedule, setIsExpandedSchedule] = useState(false);
    const [isFrequencyPickerVisible, setIsFrequencyPickerVisible] = useState(false);
    const [isDaysPickerVisible, setIsDaysPickerVisible] = useState(false);
    const [isDateVisible, setDateVisible] = useState(false);
    const [selectedFrequency, setSelectedFrequency] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateIsChanged, setDateIsChanged] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [showDateInput, setShowDateInput] = useState<boolean>(false);

    type NavigationProp = StackNavigationProp<RootStackParamList, 'AddTask'>;
    const navigation = useNavigation<NavigationProp>();

    

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
      console.log(res);
      setSelectedFrequency(res);
      setSelectedDays([]);
      setDateIsChanged(false)
    };

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
      console.log('day until : ' +minDaysUntilNext)
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
              return true;
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
    

    useEffect(() => {
      if (!dateIsChanged && selectedFrequency.length > 0) {
        const executionDate = getNextExecutionDateByFrequency(selectedFrequency[0]);
        setSelectedDate(executionDate);
      }
    }, [selectedFrequency]);
    
    useEffect(() => {
      if (!dateIsChanged && selectedDays.length > 0) {
        const executionDate = getNextExecutionDateByDays(selectedDays);
        setSelectedDate(executionDate);
      }
    }, [selectedDays]);

    const getHouseId = async (userUID: string) => {
      let res = null
      const snapshot = await get(ref(database, `users/${userUID}`));
      if( snapshot.exists() ){
        res = (snapshot.val() as User).houseId
      }
  
      return res
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
          userArray = Object.keys(userList).map(user => user)  
        }
        
        //TODO : faire passer en TS Task
        const task = {
          id: `${Date.now()}${user?.uid}`,
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
        }

        console.log(task);

        if( user?.uid ){

          const houseId = await getHouseId(user.uid)
          const taskRef = push(ref(database, `tasks/${houseId}`));
        
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

    const handleTypeSelect = (type:any) => {
      setSelectedType(prevType => (prevType === type ? '' : type));
    };

    //TODO : Récuperer les vrais utilisateur de la maison 
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

    return (
      <ScrollView style={styles.scrollable} contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.formContainer}>
          <View style={styles.blocForm}>
            <View style={styles.headerValidation}>
              <Ionicons size={24}
                style={{ color: getValues('name') ? '#6CC81D' : '#D9D9D9', marginRight: 8 }}
                name='checkmark-circle-outline'
              />
              <Text style={styles.labelHeader}>Nom de la tâche</Text>
            </View>
            <Controller
              control={control}
              rules={{
                required: 'Nom de la tâche requis',
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value || ''}
                  autoCapitalize="sentences"
                  autoComplete="name"
                  textContentType="name"
                />
              )}
              name="name"
            />
            {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
          </View>

          {/* bloc type */}
          <View style={styles.blocForm}>
            <View style={styles.headerBloc}>
              <View style={styles.headerValidation}>
                <Ionicons size={24}
                  style={{ color: selectedType ? '#6CC81D' : '#D9D9D9', marginRight: 8 }}
                  name='checkmark-circle-outline'
                />
                <Text style={styles.labelHeader}>Type</Text>
              </View>
              <TouchableOpacity onPress={() => setIsExpandedType(!isExpandedType)} style={styles.toggleButton}>
                {isExpandedType ? (
                  <Ionicons name="chevron-up-outline" size={24} color="black" />
                ) : (
                  <Ionicons name="chevron-down-outline" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>

            {isExpandedType && (
              <View style={styles.typeContainer}>

                <TouchableOpacity
                  style={[styles.iconBox, selectedType === 'cat' && styles.selectedIconBox]}
                  onPress={() => handleTypeSelect('cat')}
                >
                  <Cat stroke={selectedType === 'cat' ? '#6CC81D' : '#D9D9D9'} />
                  <Text style={[styles.labelIcon, selectedType === 'cat' && styles.selectedIconBox]}>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.iconBox, selectedType === 'cleaning' && styles.selectedIconBox]}
                  onPress={() => handleTypeSelect('cleaning')}
                >
                  <Cleaning stroke={selectedType === 'cleaning' ? '#6CC81D' : '#D9D9D9'} />
                  <Text style={[styles.labelIcon, selectedType === 'cleaning' && styles.selectedIconBox]}>Ménage</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

           {/* bloc schedule */}
           <View style={styles.blocForm}>
            <View style={styles.headerBloc}>
              <View style={styles.headerValidation}>
                <Ionicons
                  size={24}
                  style={{ color: selectedFrequency.length > 0 || selectedDays.length > 0 || dateIsChanged ? '#6CC81D' : '#D9D9D9', marginRight: 8 }}
                  name='checkmark-circle-outline'
                />
                <Text style={styles.labelHeader}>Récurrence</Text>
              </View>
              <TouchableOpacity onPress={() => setIsExpandedSchedule(!isExpandedSchedule)} style={styles.toggleButton}>
                {isExpandedSchedule ? (
                  <Ionicons name="chevron-up-outline" size={24} color="black" />
                ) : (
                  <Ionicons name="chevron-down-outline" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>

            {isExpandedSchedule && (
              <View style={styles.containPicker}>
                {/* Frequency Picker */}
                <TouchableOpacity style={styles.buttonPickers} onPress={toggleFrequencyPicker}>
                  <Text style={[styles.labelPicker, selectedFrequency.length > 0 ? styles.selectedIconBox : null]}>
                    Fréquence
                  </Text>
                </TouchableOpacity>
                {isFrequencyPickerVisible && (
                  <CustomMultiPicker
                    key={`frequency-${selectedFrequency.join(',')}`}
                    options={itemSchedule}
                    placeholderTextColor={'#757575'}
                    returnValue={"key"}
                    callback={handleFrequencyChange}
                    rowBackgroundColor={"#eee"}
                    rowHeight={50}
                    rowRadius={5}
                    iconColor={"#00a2dd"}
                    iconSize={20}
                    selectedIconName={"checkmark-circle"}
                    unselectedIconName={"checkmark-circle-outline"}
                    containerStyle={{ padding: 0, flexGrow: 1 }}
                    selected={selectedFrequency}
                  />
                )}

                {/* Days Picker */}
                <TouchableOpacity style={styles.buttonPickers} onPress={toggleDaysPicker}>
                  <Text style={[styles.labelPicker, selectedDays.length > 0 ? styles.selectedIconBox : null]}>
                    Jours
                  </Text>
                </TouchableOpacity>
                {isDaysPickerVisible && (
                  <CustomMultiPicker
                    key={`day-${selectedDays.join(',')}`}
                    options={dayList}
                    multiple={true}
                    placeholder={"Search"}
                    placeholderTextColor={'#757575'}
                    returnValue={"key"}
                    callback={handleDaysChange}
                    rowBackgroundColor={"#eee"}
                    rowHeight={50}
                    rowRadius={5}
                    iconColor={"#00a2dd"}
                    iconSize={20}
                    selectedIconName={"checkmark-circle"}
                    unselectedIconName={"checkmark-circle-outline"}
                    containerStyle={{ padding: 0, flexGrow: 1 }}
                    selected={selectedDays}
                  />
                )}

                {/* Date  */}
                <TouchableOpacity style={styles.buttonPickers} onPress={toggleDate}>
                  <Text style={[styles.labelPicker, dateIsChanged ? styles.selectedIconBox : null]}>
                    Date fixe
                  </Text>
                </TouchableOpacity>
                {isDateVisible && (
                  <View style={styles.dateContainer}>
                      <TouchableOpacity onPress={showDatepicker} style={styles.pickerInput}>
                        <Text >{selectedDate.toLocaleDateString()}</Text>
                      </TouchableOpacity>
                      {showDateInput && (
                        <DateTimePicker
                          value={selectedDate}
                          mode="date"
                          display="default"
                          onChange={handleDateChange}
                        />
                      )}
                  </View>
                )
                }



              </View>
            )}
          </View>


          {/* bloc responsable */}
          <View style={styles.blocForm}>
            <View style={styles.headerBloc}>
              <View style={styles.headerValidation}>
                <Ionicons size={24}
                  style={{ color: selectedUser.length > 0 ? '#6CC81D' : '#D9D9D9', marginRight: 8 }}
                  name='checkmark-circle-outline'
                />
                <Text style={styles.labelHeader}>Responsable</Text>
              </View>
              <TouchableOpacity onPress={() => setIsExpandedUser(!isExpandedUser)} style={styles.toggleButton}>
                {isExpandedUser ? (
                  <Ionicons name="chevron-up-outline" size={24} color="black" />
                ) : (
                  <Ionicons name="chevron-down-outline" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>

            {isExpandedUser && (
              <View style={styles.typeContainer}>
                {Object.keys(userList).map((key) => {
                  return (
                    <TouchableOpacity key={key} style={[styles.iconBox, selectedUser.includes(key)  && styles.selectedIconBox]}
                    onPress={() => handleUserSelect([key])}>
                      {userList[key].type == 'man'? (
                          <Man stroke={selectedUser.includes(key) ? '#6CC81D' : '#D9D9D9'} />
                        ) : (
                          <Woman stroke={selectedUser.includes(key) ? '#6CC81D' : '#D9D9D9'} />
                        )

                      }
                      
                      <Text style={[styles.labelIcon, selectedUser.includes(key) && styles.selectedIconBox]}> {userList[key].name}</Text> 
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity  style={[styles.iconBox, selectedUser.includes('all')  && styles.selectedIconBox]}
                    onPress={() => handleUserSelect(['all'])}>
                      <EveryUser stroke={selectedUser.includes('all') ? '#6CC81D' : '#D9D9D9'}></EveryUser>
                      
                      
                      <Text style={[styles.labelIcon, selectedUser.includes('all') && styles.selectedIconBox]}>A tour de rôle</Text> 
                    </TouchableOpacity>
              </View>
            )}
          </View>


          {/* bloc description */}
          <View style={styles.blocForm}>
              <Text style={styles.labelHeader}>Description (Facultatif)</Text>
              <TextInput

                value={description}
                onChangeText={setDescription}
                placeholder="Entrez votre texte ici..."
                multiline={true}
                numberOfLines={4}
              />
          </View>

          <TouchableOpacity style={[styles.button, checkForm() ? styles.activatedButton :  styles.buttonDisabled]}  onPress={handleSubmit(onSubmit)} disabled={isSubmitting || !checkForm(false) }>
            <Text style={styles.buttonText}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.pageWidth}>
      <Cloud3></Cloud3> 
      <Text style={styles.subtitle}>Créer une nouvelle tâche</Text>
      <MyForm />
    </View>
  );
}

const styles = StyleSheet.create({
  selectedText: {
    marginTop: 16,
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#D9D9D9', 
    opacity: 0.5, 
  },
  activatedButton : {
    backgroundColor: '#6CC81D',
    color: 'white'
  },
  blocForm: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: "100%",
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15.5,
    marginLeft: 10,
    color: 'white'
  },
  headerValidation: {
    flexDirection: 'row',
    maxWidth: '70%',
    alignItems: 'center'
  },
  pickerInput: {
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    color: 'black',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  buttonPickers: {
      marginVertical: 5,
  },
  pageWidth: {
    paddingVertical: 80,
    width: "100%",
    alignItems: 'center',
  },
  dateContainer: {
    width: "100%",
  },
  containPicker: {
    padding: 10,
    marginTop: 15
  },
  headerBloc: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-between', 
  },
  toggleButton: {
    padding: 5, 
  },
  iconBox: {
    borderColor: '#D9D9D9',
    alignItems: 'center',
    borderRadius: 10,
    width: '35%',
    margin: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  selectedIconBox: {
    borderColor: '#6CC81D', 
    color: '#6CC81D', 
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-around',
    width: "100%",
  },
  input: {
    color: 'black',
    height: 50,
    borderColor: "#D9D9D9",
    borderWidth: 1,
    backgroundColor: 'white',
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  scrollable: {
    width: '90%',

  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    position: 'relative',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
    width: "100%",
  },
  labelPicker: {
    fontSize: 14,
    color: "#D9D9D9",
    borderColor: "#D9D9D9",
    textAlign: 'center',
    padding: 5 ,
    width:'95%',
    borderWidth: 1,
    borderRadius: 5,    
    marginLeft:5
  },

  labelHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
    width: "80%",
  },
  labelIcon: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 5,
    color: '#D9D9D9',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 24,
    color: '#fff',
    marginBottom: 40,
  },
});
