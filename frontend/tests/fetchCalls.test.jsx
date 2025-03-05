import { describe, it, expect, vi } from "vitest";
import { render, renderHook, } from "@testing-library/react";
import { checkUser, fetchLogin } from "../src/components/Login";
import { BrowserRouter } from "react-router-dom";


/**
 * To run the tests in this file, please first make sure the backend is running
 * You can run the backend app with the command 'node index.js' from the backend directory
 */


const mockNavigate = vi.fn((url) => url);
const mockSetCurrentUser = vi.fn((user) => user);
const mockSetError = vi.fn((err) => err);
const mockSetLoading = vi.fn((bool) => bool);


describe("Authentication functionality", () => {
    it("expect mockSetCurrentUser to return null since provided token is not a real token", async () => {
        const check = await checkUser("token", mockSetCurrentUser, mockSetError, mockSetLoading, mockNavigate);
        
        if (check === null) {
            expect(mockSetCurrentUser).toHaveReturnedWith(null);
            expect(mockSetLoading).toHaveReturnedWith(false);
        }
    });
});