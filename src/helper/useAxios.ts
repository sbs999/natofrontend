import React from 'react'
import axios from 'axios'
const useAxios = () => {
    const  postData = async (url: string,data: object) => {
       const api = await axios.post(url,data);
       return api.data;
    }
    const  getData = async (url: string) => {
        const api = await axios.get(url);
        return api.data;
     }

    return {postData,getData};
}

export default useAxios
