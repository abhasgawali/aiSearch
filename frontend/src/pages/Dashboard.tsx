import { useEffect , useState } from "react";
import { Card } from "../components/ui/Card";
import { supabase } from "../utils/supabase";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router";
import type { User } from "@supabase/supabase-js";
import { useToast } from "../lib/ToastContext";
import { SearchIcon } from "../components/svgs/AuthIcons";


export default function Dashboard(){
    const navigate = useNavigate()
    const { addToast } = useToast();
    const [ user , setUser ] = useState<User | null>(null);
    useEffect(()=>{
        
        async function getInfo() {
            const { data } = await supabase.auth.getUser()
            if(data.user){
                setUser(data.user);
            }
            
        }
        getInfo();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
            } else {
                setUser(null);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    },[])
    return (
       <div className="min-h-screen bg-warm-950 flex items-center justify-center px-4">
        {user ? (
            <div className="w-full max-w-sm flex flex-col items-center">
                {/* Logo */}
                <div className="w-11 h-11 rounded-sm bg-warm-800 border border-warm-700 flex items-center justify-center mb-8">
                    <SearchIcon />
                </div>

                {/* Heading */}
                <h1 className="text-warm-50 text-2xl font-bold tracking-tight text-center mb-1">
                    Welcome back
                </h1>
                <p className="text-warm-400 text-lg tracking-widest uppercase text-center mb-10">
                    You're signed in
                </p>

                <Card variant="default" className="w-full mb-6">
                    <p className="text-warm-50 text-center">{user?.email}</p>
                </Card>

                <Button variant="tertiary" onClick={()=>{
                    supabase.auth.signOut();
                    setUser(null);
                    addToast('Successfully logged out!', 'success');
                    navigate("/auth");
                    }} className="w-full">Logout</Button>
            </div>
        ) : (
            <div className="w-full max-w-sm flex flex-col items-center">
                {/* Logo */}
                <div className="w-11 h-11 rounded-sm bg-warm-800 border border-warm-700 flex items-center justify-center mb-8">
                    <SearchIcon />
                </div>

                {/* Heading */}
                <h1 className="text-warm-50 text-2xl font-bold tracking-tight text-center mb-1">
                    Access Required
                </h1>
                <p className="text-warm-400 text-lg tracking-widest uppercase text-center mb-10">
                    Please sign in to continue
                </p>

                <Button onClick={()=>{navigate("/auth")}} className="w-full">Sign in</Button>
            </div>
        )}
       </div>
    )
}