import { useState } from "react";
import "../assets/css/VoteList.css";

function VoteObject() {
  // 1. Defined the 'items' array (or you could pass this in as a prop)
  const [items] = useState([
    { id: 1, name: "Option A" },
    { id: 2, name: "Option B" },
    { id: 3, name: "Option C" }
  ]);

  const [object] = useState({
    id: 1
  });

  return (
    // 2. Added a fragment <> or <div> to wrap the map function
    <>
      {items.map((product) => (
        <div 
          key={product.id} 
          id={object.id} 
          className="divObj"
        >
          {product.name}
        </div>
      ))}
    </>
  );
}

export default VoteObject;