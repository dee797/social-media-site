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
            <Form method="get" onSubmit={(event) => {
                event.preventDefault();
                navigate({
                    pathname: "/search",
                    search: `?${createSearchParams({
                        handle: formData.handle
                    })}`
                })
            }}>
                <Form.Control type="text" name="handle" maxLength={255} placeholder="Search for users" onChange={
                    (event) => {
                        handleInputChange(event, setFormData);
                    }}/>
            </Form>
        </>
    );
}

export {
    SearchBar
}