import React from 'react';



import { debounce } from "../../../utils/Utils.jsx"

function Usedebounce(dispatch) {

  const debouncesetSearch = debounce((searchData) => {
    dispatch({
      type: "SET_SEARCH",
      payload: searchData
    })
  }, 1000)

  const debouncesetPage = debounce((customPage) => {
    dispatch({
      type: "SET_CUSTOM_PAGE",
      payload: customPage
    })
  }, 500)


  return {
    debouncesetSearch,
    debouncesetPage
  }

}


export default Usedebounce;

