import React from 'react'
import axios from 'axios'
const useAxios = () => {
    const  postData = async (url: string,data: object) => {
        const token = localStorage.getItem("tokenShop");
        const header = {headers: {Authorization: token}};
       const api = await axios.post(url,data,header);
       return api.data;
    }
    const  getData = async (url: string) => {
        const token = localStorage.getItem("tokenShop");
        const header = {headers: {Authorization: token}};
        const api = await axios.get(url,header);
        return api.data;
     }

    return {postData,getData};
}

export default useAxios
