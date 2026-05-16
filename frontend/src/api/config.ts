import axios from "axios";
import { supabase } from "../utils/supabase";

export const api = axios.create({
    baseURL: "http://localhost:3000"
});

api.interceptors.request.use(async (config) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

