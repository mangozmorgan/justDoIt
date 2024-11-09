import { Text, TextInput, View, StyleSheet, TouchableOpacity, Platform, Button, Touchable } from 'react-native';
import { ref, update  } from 'firebase/database';
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

type User = {
  name: string;
  type:string
};

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
    const [selectedUser, handleUserSelect] = useState('');
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


    
    const checkForm = (formCheck = false) => {

      let error =''
      
      if (selectedFrequency.length > 0 ||selectedDays.length > 0 || dateIsChanged) {

        if( selectedType !== '' ){

          if( selectedUser !== '' ){
              return true;
          }else{
            error = 'Responsable'
          }

        }else{
          error = 'Type'
        }
        
      }else{
        error = 'Féquence'
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
      console.log("selectedFrequency:", selectedFrequency);
    }, [selectedFrequency]);
    
    useEffect(() => {
      console.log("selectedDays:", selectedDays);
    }, [selectedDays]);

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
          frequency = selectedDate
        }

        

        const task = {
          id: `${Date.now()}`,
          name : data.name,
          status : "En attente",
          executionDate : "",
          responsable : selectedUser,
          type : selectedType,
          frequency : frequency,
          description : data.description,
        }

        

        console.log(task);
        const user = auth.currentUser;
        const updates: Record<string, any> = {};
        updates[`tasks/${user?.uid}/${`${Date.now()}`}`] = task;
        
        try {
          update(ref(database), updates)
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


      
    };

    const handleTypeSelect = (type:any) => {
      setSelectedType(prevType => (prevType === type ? '' : type));
    };

    const userList: { [key: string]: User } = {
      'Wyn0uVKrIsZ4pbriHzugzOLAxAn1': {
        name: 'Morgan',
        type: 'man',
      },
      'user2': {
        name: 'Valérie',
        type: 'woman',
      },
    };

    const dayList = {
      "1": "Lundi",
      "2": "Mardi",
      "3": "Mercredi",
      "4": "Jeudi",
      "5": "Vendredi",
      "6": "Samedi",
      "7": "Dimanche"
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
                  autoCapitalize="characters"
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
                  style={{ color: selectedUser ? '#6CC81D' : '#D9D9D9', marginRight: 8 }}
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
                    <TouchableOpacity key={key} style={[styles.iconBox, selectedUser === userList[key].name && styles.selectedIconBox]}
                    onPress={() => handleUserSelect(userList[key].name)}>
                      {userList[key].type == 'man'? (
                          <Man stroke={selectedUser === userList[key].name ? '#6CC81D' : '#D9D9D9'} />
                        ) : (
                          <Woman stroke={selectedUser === userList[key].name ? '#6CC81D' : '#D9D9D9'} />
                        )

                      }
                      
                      <Text style={[styles.labelIcon, selectedUser === userList[key].name && styles.selectedIconBox]}> {userList[key].name}</Text> 
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity  style={[styles.iconBox, selectedUser === 'all' && styles.selectedIconBox]}
                    onPress={() => handleUserSelect('all')}>
                      <EveryUser stroke={selectedUser === "all" ? '#6CC81D' : '#D9D9D9'}></EveryUser>
                      
                      
                      <Text style={[styles.labelIcon, selectedUser === 'all' && styles.selectedIconBox]}>A tour de rôle</Text> 
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
