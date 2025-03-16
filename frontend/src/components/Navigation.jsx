import { Link } from 'react-router';
import { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';

import { SearchBar } from './SearchBar';
import { NotificationList } from './NotificationList';


const Navigation = ({ currentUser, setCurrentUser, token, setError }) => {
    const [unreadNotifCount, setUnreadNotifCount] = useState(0);


    return (
        <>
            <Navbar expand="lg" style={{backgroundColor: "lightskyblue", padding: "15px"}}>
                <Container style={{padding: "0px 30px"}}>
                    <Navbar style= {{columnGap: "40px"}}>
                        <Link to="/" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-house-door-fill" viewBox="0 0 16 16">
                            <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
                            </svg>
                        </Link>
                        <Link to="/post" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                            <Nav.Item>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-feather" viewBox="0 0 16 16" >
                            <path d="M15.807.531c-.174-.177-.41-.289-.64-.363a3.8 3.8 0 0 0-.833-.15c-.62-.049-1.394 0-2.252.175C10.365.545 8.264 1.415 6.315 3.1S3.147 6.824 2.557 8.523c-.294.847-.44 1.634-.429 2.268.005.316.05.62.154.88q.025.061.056.122A68 68 0 0 0 .08 15.198a.53.53 0 0 0 .157.72.504.504 0 0 0 .705-.16 68 68 0 0 1 2.158-3.26c.285.141.616.195.958.182.513-.02 1.098-.188 1.723-.49 1.25-.605 2.744-1.787 4.303-3.642l1.518-1.55a.53.53 0 0 0 0-.739l-.729-.744 1.311.209a.5.5 0 0 0 .443-.15l.663-.684c.663-.68 1.292-1.325 1.763-1.892.314-.378.585-.752.754-1.107.163-.345.278-.773.112-1.188a.5.5 0 0 0-.112-.172M3.733 11.62C5.385 9.374 7.24 7.215 9.309 5.394l1.21 1.234-1.171 1.196-.027.03c-1.5 1.789-2.891 2.867-3.977 3.393-.544.263-.99.378-1.324.39a1.3 1.3 0 0 1-.287-.018Zm6.769-7.22c1.31-1.028 2.7-1.914 4.172-2.6a7 7 0 0 1-.4.523c-.442.533-1.028 1.134-1.681 1.804l-.51.524zm3.346-3.357C9.594 3.147 6.045 6.8 3.149 10.678c.007-.464.121-1.086.37-1.806.533-1.535 1.65-3.415 3.455-4.976 1.807-1.561 3.746-2.36 5.31-2.68a8 8 0 0 1 1.564-.173"/>
                            </svg>
                            </Nav.Item>
                        </Link>
                        
                        <NavDropdown id="notificationDropdown" title={
                                (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-bell-fill" viewBox="0 0 16 16">
                                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2m.995-14.901a1 1 0 1 0-1.99 0A5 5 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901"/>
                                        </svg>
                                        {
                                            unreadNotifCount > 0 ?
                                            <Badge bg="light" style={{width: "30px", color: "var(--bs-secondary-color)", marginLeft: "10px"}}>{unreadNotifCount}</Badge> 
                                            :
                                            <div id="badgePlaceholder" style={{paddingLeft: "40px", display: "inline"}}></div>
                                        }
                                    </>
                                )
                        }>
                            <NotificationList token={token} currentUser={currentUser} setCurrentUser={setCurrentUser} setError={setError} setUnreadNotifCount={setUnreadNotifCount}/>
                        </NavDropdown>
                    </Navbar>

                    <Navbar id='basic-navbar-nav' style={{justifyContent:'flex-end',  flexGrow: 0.75}}>
                        <Nav style={{columnGap:'30px', width: "100%", alignItems: "center"}}>

                            <SearchBar />

                            <NavDropdown 
                                id='userDropdown'
                                title={
                                    <div style={{display: "flex", alignItems: "center", textAlign: "left", fontSize: "15px", columnGap: "15px"}}>
                                        <div style={{gridTemplate: "1fr 1fr / 55px 1fr", display: "grid"}}>
                                            <img src={currentUser.profile_pic_url} style={{gridRow: "1 / 3"}}></img>
                                            <div>{currentUser.name}</div>
                                            <div>{currentUser.handle}</div>
                                        </div>
                                        <div style={{borderTop: ".3em solid", borderRight: ".3em solid transparent", borderBottom: 0, borderLeft: ".3em solid transparent", display: "inline", height: "1px"}}></div>
                                    </div>
                                }
                            >
                                <Link to={`/${currentUser.handle.slice(1)}`}><NavDropdown.ItemText className='link'>View Profile</NavDropdown.ItemText></Link>
                                <Link to="/settings/profile"><NavDropdown.ItemText className='link'>Edit Profile</NavDropdown.ItemText></Link>
                                <NavDropdown.Item>Logout</NavDropdown.Item>
                            </NavDropdown>
                        
                        </Nav>
                    </Navbar>
                </Container>

            </Navbar>
        </>
    )
}


export { 
    Navigation
}