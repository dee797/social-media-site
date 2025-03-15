import { useState } from "react";
import { useNavigate, createSearchParams } from "react-router";
import { handleInputChange } from '../helpers';

import Form from "react-bootstrap/Form";


const SearchBar = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
            handle: "",
        });

    return (
        <>
            <Form 
                method="get" 
                onSubmit={(event) => {
                    event.preventDefault();
                    navigate({
                        pathname: "/search",
                        search: `?${createSearchParams({
                            handle: formData.handle
                        })}`
                    })
                }}
                style={{flexGrow: 1, display: "flex", maxHeight: "50px"}}
            >

                <Form.Control
                    id="search"
                    type="text" 
                    name="handle" 
                    maxLength={255} 
                    placeholder="Search for users" 
                    onChange={
                    (event) => {
                        handleInputChange(event, setFormData);
                    }}
                    style={{borderRadius: "20px 0px 0px 20px", paddingLeft: "20px"}}
                />
                <button style={{backgroundColor: "royalblue", borderRadius: "0px 20px 20px 0px"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="white" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                    </svg>
                </button>
            </Form>
        </>
    );
}

export {
    SearchBar
}