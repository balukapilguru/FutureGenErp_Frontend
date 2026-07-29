
import React from "react";
const LeadSourceReducer = (state, action) => {

    switch (action.type) {
        case "SET_LEAD_SOURCE":
            return {
                ...state,
                leadSources: action?.payload
            };
        case "CREATE_LEAD_SOURCE":
            return {
                ...state,
                leadSources: [...state.leadSources, action?.payload],
            };


        case "DELETE_LEAD_SOURCE":

            let id = action?.payload?.id;
            id = parseInt(id);

            return {
                ...state,
                leadSources: (state.leadSources || []).filter((leadSource) => leadSource.id !== id)
            }

        default:
            return state;
    }
}

export default LeadSourceReducer;