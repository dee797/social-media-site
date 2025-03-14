import { Link } from 'react-router';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { SearchBar } from './SearchBar';
import { NotificationList } from './NotificationList';


const Navigation = ({ currentUser, setCurrentUser, token, setError }) => {

    return (
        <>
            <Navbar expand="lg" style={{backgroundColor: "lightskyblue", padding: "15px"}}>
                <Container>
                    <Navbar.Brand><Link to="/">Home</Link></Navbar.Brand>
                    <SearchBar />
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav' style={{justifyContent:'flex-end'}}>
                        <Nav style={{columnGap:'20px'}}>
                            <NavDropdown title="Notifications">
                                <NotificationList token={token} currentUser={currentUser} setCurrentUser={setCurrentUser} setError={setError}/>
                            </NavDropdown>
                            <NavDropdown title="User">
                                <Link to={`/${currentUser.handle.slice(1)}`}><NavDropdown.ItemText className='link'>View Profile</NavDropdown.ItemText></Link>
                                <Link to="/settings/profile"><NavDropdown.ItemText className='link'>Edit Profile</NavDropdown.ItemText></Link>
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