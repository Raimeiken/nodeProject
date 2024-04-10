import { useEffect } from "react"
import axios from "axios"

const useAxiosFetch = () => {
    const axiosInstance = axios.create({
        baseURL:'http://localhost:5000/',
    })

    // Interceptors
    useEffect(()=>{

        // request interceptor
        const requestInterceptor = axios.interceptors.request.use(function (config){
            return config
        }, function (error){
            return Promise.reject(error)
        })

        // Response Interceptor
        const responseInterceptor = axios.interceptors.response.use((response)=>{
            return response
        }, function (error){
            return Promise.reject(error)
        })

        return ()=>{
            axiosInstance.interceptors.request.eject(requestInterceptor)
            axiosInstance.interceptors.request.eject(responseInterceptor)
        }
        
    },[axiosInstance])
  return axiosInstance
}

export default useAxiosFetch
