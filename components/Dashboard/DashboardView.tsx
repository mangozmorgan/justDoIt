
import styles from './Dashboard.styles'
import TemplateWrapper from "../shared/TemplateWrapper/TemplateWrapperView";
import DashboardLogic from './DashboardLogic';
import { ActivityIndicator, ScrollView, TouchableOpacity, View, Text } from 'react-native';
import NavBar from '../NavBar/NavBarView';
import Cloud1 from '../../assets/svg/cloud1';

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
        loading,
        data,
        getTimeWithoutHours,
        today,
        formatDate
    } = dashboardLogic;
    
    return (
        <TemplateWrapper  withLogo={true}>     
    
            <View style={styles.topContainer}>
            <Text style={styles.subtitle}>Hello {user?.name}</Text>
            <NavBar />
            </View>
            
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
                                <TouchableOpacity key={key} style={styles.task}>
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
                                <TouchableOpacity key={key} style={[styles.task, styles.futurTaskColor]}>
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
                                <TouchableOpacity key={key} style={[styles.task, styles.lateTaskColor]}>
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