import { useState } from "react";
import { useNavigate, createSearchParams } from "react-router";
import { handleInputChange } from '../helpers';


const SearchBar = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
            handle: "",
        });

    return (
        <>
            <form method="get" onSubmit={(event) => {
                event.preventDefault();
                navigate({
                    pathname: "/search",
                    search: `?${createSearchParams({
                        handle: formData.handle
                    })}`
                })
            }}>
                <input
                    name= "handle"
                    type="text"
                    maxLength={255}
                    onChange={(event) => {
                        handleInputChange(event, setFormData);
                    }}
                />
            </form>
        </>
    );
}

export {
    SearchBar
}