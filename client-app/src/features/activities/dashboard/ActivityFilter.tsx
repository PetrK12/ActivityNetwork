import { observer } from "mobx-react-lite";
import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityFilter() {
    const {activityStore:{predicate, setPredicate}} = useStore();

    return(
        <>
            <Menu vertical size="large" style={{width: '100%', marginTop: 28}}>
                <Header icon='filter' attached color='teal'content='Filters' />
                <Menu.Item 
                    content='All Activities' 
                    active={predicate.has('All')}  
                    onClick={() => setPredicate('All', 'true')}  
                />
                <Menu.Item 
                    content="I'm going" 
                    active={predicate.has('IsGoing')}  
                    onClick={() => setPredicate('IsGoing', 'true')}  
                />
                <Menu.Item 
                    content="I'm hosting" 
                    active={predicate.has('IsHost')}  
                    onClick={() => setPredicate('IsHost', 'true')}  
                />
            </Menu>
            <Header />
            <Calendar 
                onChange={(date) => setPredicate('StartDate', date as Date)}
                value={predicate.get('StartDate') || new Date()}
            />
        </>
    )
})