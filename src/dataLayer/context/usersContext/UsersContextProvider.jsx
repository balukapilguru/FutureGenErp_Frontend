import React, { createContext, useEffect, useReducer } from "react";
import { InitialState } from "./utils/UsersInitialState";
import * as Api from "./utils/UsersAPIs";
import * as Actions from "./utils/UsersActions"
import UsersReducer from "./UsersReducer";


export const UsersContext = createContext();

const UserContextProvider = ({ children }) => {
    const [UsersState, DispatchUsers] = useReducer(UsersReducer, InitialState);

    const getAllUsers = async () => {
        try {
            const { data, status } = await Api.getAllUsers();
            if (status === 200) {
                DispatchUsers(Actions.setAllUsers(data))
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    const getAllCouncellers = async () => {
        try {
            const { data, status } = await Api.getAllCouncellers();
            if (status === 200) {
                DispatchUsers(Actions.setAllCouncellers(data))
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    const getAllUsersWithOutCouncellers = async () => {
        try {
            const { data, status } = await Api.getAllUsersWithOutCouncellers();
            if (status === 200) {
                DispatchUsers(Actions.setAllUsersWithOutCouncellers(data))
            }
        }
        catch (error) {
            console.error(error)
        }
    }



    const PaginatedUsers = async () => {
        const { currentPage, perPage, search, filters } = UsersState.EnrolledUsers;
        DispatchUsers(Actions.setLoading("ENROLLED_USERS"))
        try {
            const { status, data } = await Api.getPaginatedUsers(currentPage, perPage, search, filters);
            if (status === 200) {
                DispatchUsers(Actions.setPaginatedUsers(data, "ENROLLED_USERS"))
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            DispatchUsers(Actions.setLoading("ENROLLED_USERS"))
        }
    }


    const CreateUser = async (userdata) => {
        try {
            const { data, status } = await Api.createUser(userdata);
            getAllUsers()
            PaginatedUsers()
            if (status === 200) {
                DispatchUsers(Actions.createUser(data, "ENROLLED_USERS"))
                getAllUsers()
                PaginatedUsers()
            }
        }
        catch (error) {
            console.error(error)
        }
    }


    const getUserbyId = async (userId) => {
        try {
            const { status, data } = await Api.getSingleUserById(userId);
            if (status === 200) {
                DispatchUsers(Actions.setSingleUser(data, "SINGLE_ENROLLED_USERS"))
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    

    // useEffect(() => {
    //     getAllUsers()
    //     // PaginatedUsers()
    //     getAllCouncellers();
    //     getAllUsersWithOutCouncellers();
    //     getUserbyId();
    // }, [])



    // useEffect(() => {

    //     PaginatedUsers()
    // }, [UsersState?.EnrolledUsers?.search,
    // UsersState?.EnrolledUsers?.currentPage,
    // UsersState?.EnrolledUsers?.perPage,
    // UsersState?.EnrolledUsers?.filters,
    // UsersState?.EnrolledUsers?.filters.branch,
    // UsersState?.EnrolledUsers?.filters.profile,
    // UsersState?.EnrolledUsers?.filters.department
    // ])


    return (
        <UsersContext.Provider value={{ UsersState, DispatchUsers, getAllUsers, CreateUser, getAllCouncellers, getAllUsersWithOutCouncellers }}>
            {children}
        </UsersContext.Provider>
    )
}
export default UserContextProvider;





