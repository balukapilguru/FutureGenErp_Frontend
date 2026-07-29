export const InitialState ={

    TotalUsers:null,
    TotalUsersWithCountellers: null,
    TotalUsersWithOutCountellers:null,
    SingleUser:null,

    EnrolledUsers:{
        PaginatedUsers:[],
        filters:{profile:"",branch:"",department:""},
        currentPage:1,
        perPage:10,
        totalUsers:null,
        totalPages:null,
        loading:false,
        startUser:null,
        searchResultUsers:null,
        endUser:null,
        search:"",
    }

}