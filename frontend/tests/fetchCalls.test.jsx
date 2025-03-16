import { describe, it, expect, vi, afterAll, beforeAll } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCheckUser, useFetchData, putData } from "../src/helpers";
import { fetchLogin } from "../src/pages/Login";
import { fetchSignup } from "../src/pages/Signup";
const main = require("../../backend/db/reset-test-db");

/**
 * To run the tests in this file, please first make sure the backend is running
 * You can run the backend app with the command 'node index.js' from the backend directory
 */


let testToken;
let testCurrentUserId;


const mockNavigate = vi.fn((url) => url);
const mockSetCurrentUser = vi.fn((user) => user);
const mockSetServerError = vi.fn((err) => err);
const mockSetInputError = vi.fn((err) => err);
const mockSetData = vi.fn((data) => data);
const mockSetLoading = vi.fn((bool) => bool);


beforeAll(async () => {
    return main()
    .catch(err => console.log(err));
});

afterAll(async () => {
    return main()
    .catch(err => console.log(err));
});

afterAll(() => {
    localStorage.clear();
})


describe("Signup functionality", () => {
    it("receive validation errors for each form field, when given invalid data", async () => {
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
    });

    it("successfully sign up as a new user and get redirected to login page", async () => {
        const formData = {
            name: "someUser",
            username: "someUser",
            password: "Some_password1",
            confirmPassword: "Some_password1"
        }

        await fetchSignup(mockSetInputError, mockSetServerError, mockSetLoading, formData, mockNavigate);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });
})


describe("Authentication functionality", () => {
    it("set currentUser state to null since provided token and user are not real", () => {
        const { result } = renderHook(async () => useCheckUser("token", "someUser", mockSetCurrentUser, mockSetServerError, mockSetLoading, mockNavigate)); 
        
        if (result.current === null) {
            expect(mockSetCurrentUser).toHaveReturnedWith(null);
            expect(mockSetLoading).toHaveReturnedWith(false);
        }
    });
    
    it("receive error message for attempted login with invalid credentials", async () => {
        const formData = {
            username: "nonexistentUser",
            password: "nonexistentPassword"
        }

        await fetchLogin(mockSetCurrentUser, mockSetInputError, mockSetServerError, mockSetLoading, formData, mockNavigate);

        await waitFor(() => {
            expect(mockSetInputError).toHaveBeenCalledWith("Incorrect username or password");
        });
    });

    it("successfully login as @someUser, and store token and user_id in localStorage", async () => {
        const formData = {
            username: "someUser",
            password: "Some_password1"
        }

        await fetchLogin(mockSetCurrentUser, mockSetInputError, mockSetServerError, mockSetLoading, formData, mockNavigate);

        await waitFor(() => {
            expect(mockSetCurrentUser).toHaveBeenCalled();

            testToken = localStorage.getItem("token");
            testCurrentUserId = localStorage.getItem("current_user_id");

            expect(testToken).toBeTruthy();
            expect(testCurrentUserId).toBeTruthy();
        });
    });
});


describe("Authorization functionality", () => {
    it("setData state with fetch data (from protected route) when valid token is provided", async () => {
        renderHook(async () => useFetchData(
            testToken, 
            testCurrentUserId, 
            mockSetCurrentUser, 
            mockSetData, 
            mockSetServerError, 
            mockSetLoading, 
            mockNavigate,
            `${import.meta.env.VITE_BACKEND_URL}/home`
        ));

        await waitFor(() => {
            expect(mockSetData).toHaveBeenCalled();
        })
    });

    it("setError state to '404' when user is authenticated but requests a post that doesn't exist on backend", async () => {
        renderHook(async () => useFetchData(
            testToken,
            testCurrentUserId,
            mockSetCurrentUser,
            mockSetData,
            mockSetServerError,
            mockSetLoading,
            mockNavigate,
            `${import.meta.env.VITE_BACKEND_URL}/users/${testCurrentUserId}/posts/0`
        ));

        await waitFor(() => {
            expect(mockSetServerError).toHaveBeenCalledWith(Error("404"));
        });
    });
    
    it("update the read_status of all of the current user's notifications", async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/users/${testCurrentUserId}/notifications`;

        await putData(
            testToken, 
            testCurrentUserId, 
            mockSetCurrentUser,
            mockSetServerError,
            mockSetLoading,
            mockNavigate,
            url,
            null,
            mockSetData,
            null,
            'updateAllNotifs'
        );

        await waitFor(() => {
            expect(mockSetData).toHaveBeenCalled();
        });
    });
});

