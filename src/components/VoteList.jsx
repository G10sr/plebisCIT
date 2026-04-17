import { useState } from "react";
import "../assets/css/VoteList.css";

function VoteObject() {
  // 1. Defined the 'items' array (or you could pass this in as a prop)
  const [items] = useState([
    { id: 1, name: "Option A" },
    { id: 2, name: "Option B" },
    { id: 3, name: "Option C" },
    { id: 4, name: "Option D" }
  ]);

  const [object] = useState({
    id: 1
  });

  return (
    <div className="voteListContainer">
      {items.map((product) => (
        <div 
          key={product.id} 
          id={object.id} 
          className="divObj"
        >
          {product.name}
        </div>
      ))}

    </div>
  );
}

export default VoteObject;