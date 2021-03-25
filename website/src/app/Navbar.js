import {Container, Menu} from "semantic-ui-react";
import LoginOrLogoutButton from "./LoginOrLogoutButton";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    return (
        <Container style={{marginBottom: '2em'}}>
            <Menu stackable borderless>
                <Menu.Menu position='right'>
                    <Menu.Item>
                        <LoginOrLogoutButton/>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        </Container>
    );
}