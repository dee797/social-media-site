import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { SearchBar } from './SearchBar';
import { NotificationList } from './NotificationList';


const Navigation = ({ currentUser, setCurrentUser, token, setError }) => {

    return (
        <>
            <Navbar expand="lg" id='navbar'>
                <Container>
                    <Navbar.Brand href="/">Home</Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='me-auto'>
                            <NavDropdown title="Notifications">
                                <NotificationList token={token} currentUser={currentUser} setCurrentUser={setCurrentUser} setError={setError}/>
                            </NavDropdown>
                            <SearchBar />
                            <NavDropdown title="User">
                                <NavDropdown.Item href={`/${currentUser.handle}`}>View Profile</NavDropdown.Item>
                                <NavDropdown.Item href="/settings/profile">Edit Profile</NavDropdown.Item>
                                <NavDropdown.Item>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>

            </Navbar>
        </>
    )
}


export { 
    Navigation
}