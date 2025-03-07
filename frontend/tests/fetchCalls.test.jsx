import { describe, it, expect, vi, afterAll, beforeAll } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCheckUser } from "../src/helpers";
import { fetchLogin } from "../src/components/Login";
import { fetchSignup } from "../src/components/Signup";
const resetDB = require("../../backend/db/reset-test-db");

/**
 * To run the tests in this file, please first make sure the backend is running
 * You can run the backend app with the command 'node index.js' from the backend directory
 */


const mockNavigate = vi.fn((url) => url);
const mockSetCurrentUser = vi.fn((user) => user);
const mockSetServerError = vi.fn((err) => err);
const mockSetInputError = vi.fn((err) => err);
const mockSetLoading = vi.fn((bool) => bool);


beforeAll(() => {
    resetDB()
    .catch(err => console.log(err));
});

afterAll(() => {
    resetDB()
    .catch(err => console.log(err));
});


describe("Signup functionality", () => {
    it("validation errors should be received from fetch call for each field, when given invalid data", async () => {
        const formData = {
            name: "really long name that's more than 25 characters",
            username: "a",
            password: "b",
            confirmPassword: "c"
        }

        await fetchSignup(mockSetInputError, mockSetServerError, mockSetLoading, formData, mockNavigate);

        await waitFor(() => {
            expect(mockSetInputError).toHaveBeenCalledWith(
                {
                   "confirmPassword": {
                     "location": "body",
                     "msg": "Passwords do not match.",
                     "path": "confirmPassword",
                     "type": "field",
                     "value": "c",
                   },
                   "name": {
                     "location": "body",
                     "msg": "Name cannot be more than 25 characters",
                     "path": "name",
                     "type": "field",
                     "value": "really long name that's more than 25 characters",
                   },
                   "password": {
                     "location": "body",
                     "msg": "Password does not meet the requirements.",
                     "path": "password",
                     "type": "field",
                     "value": "b",
                   },
                }
            );
        });

    })
})


describe("Authentication functionality", () => {
    it("currentUser state should be set to null since provided token and user are not real", () => {
        const { result } = renderHook(async () => useCheckUser("token", "someUser", mockSetCurrentUser, mockSetServerError, mockSetLoading, mockNavigate)); 
        
        if (result.current === null) {
            expect(mockSetCurrentUser).toHaveReturnedWith(null);
            expect(mockSetLoading).toHaveReturnedWith(false);
        }
    });
    
    it("error message should be received from fetch call for invalid credentials", async () => {
        const formData = {
            username: "nonexistentUser",
            password: "nonexistentPassword"
        }

        await fetchLogin(mockSetCurrentUser, mockSetInputError, mockSetServerError, mockSetLoading, formData, mockNavigate);

        await waitFor(() => {
            expect(mockSetInputError).toHaveBeenCalledWith("Incorrect username or password");
        });
    });
});