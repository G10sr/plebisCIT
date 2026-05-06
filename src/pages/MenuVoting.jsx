import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../assets/css/MenuVoting.css"
import VoteList from "../components/VoteList";

function MenuVoting() {
    return (
        <section>
            <hr />
            <div className="VotingList">
                <VoteList />
            </div>
        </section>
    );
}


export default MenuVoting;