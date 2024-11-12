
import { ScrollView, View, Text, TextInput, TouchableOpacity, } from 'react-native';
import  useNewTaskFormLogic  from './NewTaskFormLogic';
import styles from  './NewTaskForm.styles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Controller } from 'react-hook-form';
import Cat from '../../../assets/svg/cat';
import Cleaning from '../../../assets/svg/cleaning';
import EveryUser from '../../../assets/svg/everyUser';
import Man from '../../../assets/svg/man';
import Woman from '../../../assets/svg/woman';
import CustomMultiPicker from "react-native-multiple-select-list";
import DateTimePicker from '@react-native-community/datetimepicker';
import Cloud3 from '../../../assets/svg/cloud3';


export default function NewTaskForm() {  

  const {
    control,
    errors,
    handleSubmit,
    selectedType,
    isSubmitting,
    checkForm,
    taskName,
    setTaskName,
    setIsExpandedUser,
    isExpandedUser,
    selectedUser ,
    handleUserSelect,
    selectedFrequency,
    setIsExpandedSchedule,
    isExpandedSchedule,
    setIsExpandedType,
    isExpandedType,
    isFrequencyPickerVisible,
    toggleFrequencyPicker,
    selectedDays,
    handleTypeSelect,
    selectedDate,
    setIsExpandedHour,
    isExpandedHour,
    dateIsChanged,
    description,
    formatTime,
    handleHourChange,
    toggleDaysPicker,
    handleFrequencyChange,
    isDaysPickerVisible,
    handleDaysChange,
    toggleDate,
    showDatepicker,
    showDateInput,
    handleDateChange,
    isDateVisible,
    userList,
    dayList,    
    itemSchedule,
    setDescription,
    onSubmit,
    showHourInput,
    setShowHourInput,
    selectedHour,
  } = useNewTaskFormLogic();

  return (
    <View style={styles.pageWidth}>
      {/* <Cloud3></Cloud3>  */}
      <Text style={styles.subtitle}>Créer une nouvelle tâche</Text>
      <ScrollView style={styles.scrollable} contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={styles.formContainer}>
            <View style={styles.blocForm}>
              <View style={styles.headerValidation}>
                <Ionicons size={24}
                  style={{ color: taskName  ? '#6CC81D' : '#D9D9D9', marginRight: 8 }}
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
                    onChangeText={(text) => {
                      onChange(text);
                      setTaskName(text); 
                    }}
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
                  )}
                  {/* Heure  */}
                  {/* <TouchableOpacity style={styles.buttonPickers} onPress={toggleDate}>
                    <Text style={[styles.labelPicker, dateIsChanged ? styles.selectedIconBox : null]}>
                      {selectedHour}
                    </Text>
                  </TouchableOpacity>
                  {isDateVisible && (
                    <View style={styles.dateContainer}>
                          <Text >{selectedHour}</Text>
                        {showDateInput && (
                          <DateTimePicker
                            value={selectedDate}
                            mode="time"
                            display="spinner"
                            onChange={handleDateChange}
                          />
                        )}
                    </View>
                  )} */}



                </View>
              )}
            </View>

            {/* bloc heure */}
            <View style={styles.blocForm}>
              <View style={styles.headerBloc}>
                <View style={styles.headerValidation}>
                  <Ionicons
                    size={24}
                    style={{
                      color: selectedHour && selectedHour instanceof Date && !isNaN(selectedHour.getTime())
                        ? selectedHour.getHours() !== 0 || selectedHour.getMinutes() !== 0
                          ? '#6CC81D'
                          : '#D9D9D9'
                        : '#D9D9D9',
                      marginRight: 8,
                    }}
                    name="checkmark-circle-outline"
                  />
                  <Text style={styles.labelHeader}>
                    Heure : 
                    {selectedHour && selectedHour instanceof Date && !isNaN(selectedHour.getTime())
                      ? selectedHour.getHours() !== 0 || selectedHour.getMinutes() !== 0
                        ? ` ${selectedHour.getHours()}H${selectedHour.getMinutes()}`
                        : ' Non définie'
                      : ' Non définie'}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => setIsExpandedHour(!isExpandedHour)} style={styles.toggleButton}>
                  {isExpandedHour ? (
                    <Ionicons name="chevron-up-outline" size={24} color="black" />
                  ) : (
                    <Ionicons name="chevron-down-outline" size={24} color="black" />
                  )}
                </TouchableOpacity>
              </View>

              {isExpandedHour && (
                <View style={styles.containPicker}>
                  <View style={styles.dateContainer}>
                    <TouchableOpacity onPress={showDatepicker} style={styles.pickerInput}>
                      <Text>
                        {selectedHour instanceof Date && !isNaN(selectedHour.getTime()) 
                          ? formatTime(selectedHour)
                          : 'Non définie'}
                      </Text>
                    </TouchableOpacity>

                    {showDateInput && (
                      <DateTimePicker
                        value={selectedHour || new Date()} 
                        mode="time"
                        display="spinner"
                        onChange={handleHourChange}
                        />
                      )}
                      </View>
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
    </View>  

  );
}