import { Button, Container, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
    useStore();

    return(
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}} />
                    Task Network
                </Menu.Item>
                <Menu.Item name='TaskNetwork' as={NavLink} to='/activities'/>
                <Menu.Item name='Errors' as={NavLink} to='/errors'/>
                <Menu.Item>
                    <Button as={NavLink} to='/createActivity' positive content='Create Activity'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}