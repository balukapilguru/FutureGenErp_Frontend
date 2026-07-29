
export const setAllUsers=(data)=>({
    type: "SET_ALL_USERS",
    payload:data,
})

export const setAllCouncellers=(data)=>({
    type: "SET_ALL_COUNCELLERS",
    payload:data,
})

export const setAllUsersWithOutCouncellers=(data)=>({
    type: "SET_ALL_USERS_WITHOUT_COUNCELLERS",
    payload:data,
})


export const setLoading=(data)=>{
    return {
        type: "SET_LOADING",
        payload:{context:data},
    }
}

export const setPaginatedUsers =(data, context)=>{
    return {
        type: "SET_PAGINATED_USERS",
        payload:{  context:context, data:data}
    }
}

export const createUser=(data, context)=>({
    type: "CREATE_USER",
    payload:{data:data, context:context}
})

export const setSingleUser=(data, context)=>({
    type: "GET_SINGLE_USER",
    payload:{data:data, context:context}
})

