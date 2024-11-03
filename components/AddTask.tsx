import NewTaskForm from "./shared/NewTaskForm";
import TemplateWrapper from "./shared/TemplateWrapper";




export default function AddTask(){
    return(
        <TemplateWrapper withLogo={false}>
            <NewTaskForm></NewTaskForm>
        </TemplateWrapper>
    )
}