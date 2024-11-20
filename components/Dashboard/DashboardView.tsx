
import styles from './Dashboard.styles'
import TemplateWrapper from "../shared/TemplateWrapper/TemplateWrapperView";
import DashboardLogic from './DashboardLogic';
import { ActivityIndicator, ScrollView, TouchableOpacity, View, Text, Button } from 'react-native';
import Modal from 'react-native-modal'
import NavBar from '../NavBar/NavBarView';
import moment from 'moment';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const DashBoard = () => {

    const dashboardLogic = DashboardLogic();

    if (!dashboardLogic) {
        return (
            <TemplateWrapper withLogo={true}>
                <ActivityIndicator size="large" color="#0000ff" />
            </TemplateWrapper>
        );
    }

    

    

    const {
        user,
        data,    
        isModalDetailsTaskVisible,    
        getTimeWithoutHours,      
        today,
        handleModal,
        getTaskDetails,
        formatDate,
        validateTask,
        removeTask,
        modalDatas
    } = dashboardLogic;
    
    return (
        <TemplateWrapper  withLogo={true}>     
    
            <View style={styles.topContainer}>
            <Text style={styles.subtitle}>Hello {user?.name}</Text>
            <NavBar />
            </View>
            <Modal isVisible={isModalDetailsTaskVisible } onBackdropPress={handleModal}>

                <View style={styles.modalContainer}>
                    <View style={styles.modalTask}>
                        <View style={styles.modalTaskHeader}>
                            <Ionicons
                            name="close-outline" 
                            size={24} 
                            onPress={() =>handleModal()}
                            color="black"></Ionicons>
                        </View>
                        
                        <Text style={styles.modalTitle}>
                            {modalDatas?.name}
                        </Text>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.littleBold}>Responsable : </Text>
                            <Text>{modalDatas?.responsable.join(', ')}</Text>
                        </View>
                        <View style={{flexDirection:'row'}} >
                            <Text style={styles.littleBold}>Dernière exécution : </Text>
                            <Text>{modalDatas?.lastExecutionUserId}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.littleBold}>Créé par : </Text>   
                            <Text>{modalDatas?.createdBy}</Text>       
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.littleBold}>Quand : </Text>
                            <Text>{moment(modalDatas?.executionDate).format('DD MMM YYYY')}</Text>
                              
                        </View>
                        <View style={{alignItems:'center', marginTop:20}}>
                            {/* <TouchableOpacity style={[styles.buttonBase, styles.buttonGrey]} onPress={() =>handleModal()}>
                                <Text style={styles.buttonText}>Fermer</Text>
                            </TouchableOpacity> */}
                            {modalDatas &&
                            <View >
                                <TouchableOpacity style={[styles.buttonBase, styles.buttonValidation]} onPress={() =>validateTask(modalDatas?.id)}>
                                    <Text style={styles.buttonText}>Valider la tâche</Text>
                                </TouchableOpacity>
                                 <TouchableOpacity style={[styles.buttonBase, styles.buttonRemove]} onPress={() =>removeTask(modalDatas?.id)}>
                                    <Text style={styles.buttonText}>Supprimer</Text>
                                </TouchableOpacity>
                            </View>
                               
                            
                            }
                            
                        </View>
                          
                    </View>
               
                </View>
            </Modal>
            {data ? (
            <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false} 
            snapToAlignment="center"
            snapToInterval={360} 
            decelerationRate="fast"  >
                <View style={styles.container}>
                    <View style={styles.tasksContainer}>
                    <Text style={styles.today}>Aujourd'hui</Text>
                    <ScrollView style={styles.scrollPart}>
                        <View style={styles.thereTasks}>
                        {Object.keys(data).map((key) => {
                            if (getTimeWithoutHours(new Date(data[key].executionDate)).getTime() === getTimeWithoutHours(today).getTime()) {
                            return (
                                <TouchableOpacity
                                 key={key} 
                                 onPress={() =>getTaskDetails(data[key])}
                                 style={styles.task}>
                                <Text  numberOfLines={1} style={styles.taskName}>{data[key].name}</Text>
                                <Text style={styles.taskStatus}>{formatDate(data[key].executionDate)}</Text>
                                </TouchableOpacity>
                            );
                            }
                            return null; 
                        })}
                        </View>
                        
                    </ScrollView>
                    
                    </View>
                    
                    <View style={styles.tasksContainer}>
                    <Text style={styles.today}>Tâches à venir</Text>
                    <ScrollView style={styles.scrollPart}>
                        <View style={styles.thereTasks}>
                        {Object.keys(data).map((key) => {
                            if (getTimeWithoutHours(new Date(data[key].executionDate)).getTime() > getTimeWithoutHours(today).getTime()) {
                            return (
                                <TouchableOpacity 
                                    key={key} 
                                    onPress={() =>getTaskDetails(data[key])}
                                    style={[styles.task, styles.futurTaskColor]}>
                                    <Text numberOfLines={1} style={styles.taskName}>{data[key].name}</Text>
                                    <Text style={styles.taskStatus}>{formatDate(data[key].executionDate)}</Text>
                                </TouchableOpacity>
                            );
                            }
                            return null; 
                        })}
                        </View>
                        
                    </ScrollView>
                    
                    </View>

                    <View style={styles.tasksContainer}>
                    <Text style={styles.today}>Tâches en retard</Text>
                    <ScrollView style={styles.scrollPart}>
                        <View style={styles.thereTasks}>
                        {Object.keys(data).map((key) => {
                            if (getTimeWithoutHours(new Date(data[key].executionDate)).getTime() < getTimeWithoutHours(today).getTime()) {
                            return (
                                <TouchableOpacity
                                 key={key} 
                                 onPress={() =>getTaskDetails(data[key])}
                                 style={[styles.task, styles.lateTaskColor]}>
                                <Text numberOfLines={1} style={styles.taskName}>{data[key].name}</Text>
                                <Text style={styles.taskStatus}>{formatDate(data[key].executionDate)}</Text>
                                </TouchableOpacity>
                            );
                            }
                            return null; 
                        })}
                        </View>
                        
                    </ScrollView>
                    
                    </View>

                </View>
            </ScrollView>
            
            
            ) : (
            <Text style={styles.today} >Aucunes tâches de prévues</Text>
            )}
        </TemplateWrapper>
    )
        

    

}

export default DashBoard