import { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ActivityFormValues } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import CustomTextInput from "../../../app/common/form/CustomTextInput";
import CustomTextArea from "../../../app/common/form/CustomTextArea";
import CustomSelectInput from "../../../app/common/form/CustomSelectInput";
import { categoryOptions } from "../../../app/common/options/CategoryOptions";
import CustomDateInput from "../../../app/common/form/CustomDateInput";
import { v4 as uuid } from "uuid";

export default observer(function ActivityForm() {

    const {activityStore} = useStore();
    const {loadActivitity, createActivity, updateActivity, loadingInitial} = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required('Activity title is required'),
        description: Yup.string().required('Activity description is required'),
        category: Yup.string().required('Activity category is required'),
        date: Yup.string().required('Activity date is required').nullable(),
        city: Yup.string().required('Activity city is required'),
        venue: Yup.string().required('Activity venue is required')
    })

    useEffect(() => {
        if (id) loadActivitity(id).then(activity => setActivity(new ActivityFormValues(activity)));
    }, [id, loadActivitity])

    function handleFormSubmit(activity: ActivityFormValues){
        if (!activity.id){
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() => {navigate(`/activities/${newActivity.id}`)});
        } else {
            updateActivity(activity).then(() => {navigate(`/activities/${activity.id}`)});
        }
        activity.id ? updateActivity(activity) : createActivity(activity);
    }

    if (loadingInitial) return <LoadingComponent content="Loading activity ..."/>

    return(
        <Segment clearing>
            <Header content='Activty Details' sub color='teal'/>
            <Formik enableReinitialize 
            validationSchema={validationSchema}
            initialValues={activity} 
            onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                        <CustomTextInput placeholder='Title' name='title' />
                        <CustomTextArea rows={3} placeholder='Description' name="description"/>
                        <CustomSelectInput options={categoryOptions} placeholder='Category'  name="category"/>
                        <CustomDateInput 
                            placeholderText='Date' 
                            name="date"
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color='teal'/>
                        <CustomTextInput placeholder='City' name="city"/>
                        <CustomTextInput placeholder='Venue' name="venue"/>
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting} 
                            floated='right' 
                            positive type='submit' content='Submit' />
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})


