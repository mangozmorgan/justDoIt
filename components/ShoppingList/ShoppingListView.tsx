import {  Text } from "react-native";
import TemplateWrapper from "../shared/TemplateWrapper/TemplateWrapperView";
import styles from './ShoppingList.styles'





export default function ShoppingList(){

    return (
        <TemplateWrapper  withLogo={true}>
            <Text style={styles.subtitle}>Shopping List</Text>
        </TemplateWrapper>
    )
}
