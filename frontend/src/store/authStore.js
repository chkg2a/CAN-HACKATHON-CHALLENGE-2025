import {create} from "zustand";
import axios from "axios";


axios.defaults.withCredentials = true;

const useAuthStore=create((set)=>({
    user:null,
    isAuth:false,
    login:async (email,password)=>{
        try {
            const res=await axios.post("http://localhost:3000/api/v1/auth/login",{
                email,
                password
            });
        set({user:res.data,isAuth:true});
        return res;
        } catch (error) {
            console.log(error.message);
            return error;
        }
    },
    register:async (email,password,name)=>{
        try {
            const res=await axios.post("http://localhost:3000/api/v1/auth/register",{
                email,
                password,
                name
            });
            set({user:res.data,isAuth:true});
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    checkSession:async()=>{
        try {
            const res=await axios.get("http://localhost:3000/api/v1/auth/checkAuth");
            console.log(res);
            
            set({user:res.data,isAuth:true});
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    logout:async()=>{
        try {
            const res=await axios.get("http://localhost:3000/api/v1/auth/logout");
            set({user:null});
            return res.data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

}))

export default useAuthStore;