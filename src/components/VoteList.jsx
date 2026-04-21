import { useState } from "react";
import "../assets/css/VoteList.css";

function VoteObject() {
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
        <div className="voteObject">

          <div
            key={product.id} 
            id={object.id} 
            className="divObj"
          >
            {product.name}
            <button className="buttonEdit"
              id={product.id}
            />
          </div>

          

        </div>
      ))}

    </div>
  );
}

export default VoteObject;