import NewTaskForm from "../shared/NewTaskForm/NewTaskFormView";
import TemplateWrapper from "../shared/TemplateWrapper/TemplateWrapperView";




export default function AddTask(){
    return(
        <TemplateWrapper withLogo={true}>
            <NewTaskForm></NewTaskForm>
        </TemplateWrapper>
    )
}