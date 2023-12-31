import { observer } from 'mobx-react-lite';
import {Button, Header, Item, Segment, Image } from 'semantic-ui-react'
import {IActivity} from "../../../app/models/activity";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useStore } from '../../../app/stores/store';

const activityImageStyle = {
    filter: 'brightness(50%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    activity: IActivity
}

export default observer (function ActivityDetailedHeader({activity}: Props) {
    const { activityStore: {updateAttendance, loading, cancelActivityToggle} } = useStore();
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}
                        label={{color: 'red', content: 'Cancelled', ribbon: true,
                        style: {
                            position: 'ab', 
                            zIndex: 1, 
                            left: -14, 
                            top: 40, 
                            visibility: activity.isCancelled ? 'visible': 'hidden',
                            brightness: 100,
                        }
                    }}
                >
                </Image>

                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{color: 'white'}}
                                />
                                <p>{format(activity.date!, 'dd MMM yyyy')}</p>
                                <p>
                                    Hosted by <strong><Link to={`/profiles/${activity.host?.username}`}>{activity.host?.displayName}</Link></strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {activity.isHost ? (
                    <>
                        <Button 
                            color={activity.isCancelled ? 'green' : 'red'}
                            floated='left'
                            basic
                            content={activity.isCancelled ? 'Re-activate Activity'
                             : 'Cancell activity'}
                            onClick={cancelActivityToggle}
                            loading={loading}
                        />
                        <Button as={Link} to={`/manage/${activity.id}`} 
                            color='orange' 
                            floated='right'
                            disabled={activity.isCancelled}>
                            Manage Event
                        </Button>
                    </>
                ) : activity.isGoing ?(
                    <Button onClick={updateAttendance} loading={loading}>
                        Cancel updateAttendance
                    </Button>
                ) :(
                    <Button onClick={updateAttendance} loading={loading} 
                        color='teal'
                        disabled={activity.isCancelled}>
                            Join Activity
                    </Button>
                )}
            </Segment>
        </Segment.Group>
    )
})
