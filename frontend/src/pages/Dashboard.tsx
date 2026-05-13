import { useEffect } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { supabase } from "../utils/supabase";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router";

export default function Dashboard(){
    const navigate = useNavigate()
    const [ user , setUser ] = useState<User | null>(null);
    useEffect(()=>{
        
        async function getInfo() {
            const { data , error } = await supabase.auth.getUser()
            if(data.user){
                setUser(data.user);
            }
            
        }
        getInfo();
    },[])
    return (
       <div>
        {!user && <button onClick={()=>{
            navigate("auth")
        }}>Sign in</button>}
        {user && <div>
            {user?.email}
            <button onClick={()=>{
                supabase.auth.signOut();
                setUser(null);
                }} >Logout</button>
            </div>}
       </div>
    )
}