import React from 'react';

const CoursePackageReducer=(state, action)=> {
 
    switch (action.type) {
        case "SET_COURSE_PACKAGES":
            return{
                ...state,
                 coursepackages: action?.payload,

            }
        case "CREATE_COURSE_PACKAGE":
            return {
              ...state,
               coursepackages: [...state.coursepackages, action?.payload],
            };

        case "DELETE_COURSE_PACKAGE":
            let id = action?.payload?.id;
            id = parseInt(id);

        return{
            ...state,
             coursepackages: (state.coursepackages || []).filter(cp => cp.id  !== id)
        }

        default:
            return state;
    }
}

export default CoursePackageReducer;