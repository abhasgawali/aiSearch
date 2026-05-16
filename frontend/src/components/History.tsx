import { useEffect, useState } from "react";
import {api} from "../api/config"
import { Card } from "./ui/Card";
export default function  History() {
    //@ts-ignore
    const { history , setHistory } = useState([])
    useEffect(()=>{
        async function getHistory() {
            const history = await api.get("/conversations")
            setHistory(()=>history)
        }
        getHistory();
    },[])
    return(
        <Card>
            {history}
        </Card>
    )
}