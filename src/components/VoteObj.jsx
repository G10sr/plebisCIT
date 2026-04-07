import { useState } from "react";
import "../assets/css/VoteObject.css"


function VoteObject (){
    const [object, setObject] = useState({
        id: 1
    });
    return(
        <div id={object.id} className="divObj">
            
        </div>
    )
}

export default VoteObject