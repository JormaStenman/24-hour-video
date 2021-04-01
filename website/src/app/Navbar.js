import {Container, Menu} from "semantic-ui-react";
import LoginOrLogoutButton from "./LoginOrLogoutButton";
import {NavLink} from "react-router-dom";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    return (
        <Container style={{marginBottom: '2em'}}>
            <Menu stackable borderless>
                <Menu.Item as={NavLink} to='/main' replace>
                    Main
                </Menu.Item>
                <Menu.Item as={NavLink} to='/videos' replace>
                    Videos
                </Menu.Item>
                <Menu.Menu position='right'>
                    <Menu.Item>
                        <LoginOrLogoutButton/>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        </Container>
    );
}