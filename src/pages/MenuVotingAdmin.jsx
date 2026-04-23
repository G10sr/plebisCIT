import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../assets/css/MenuVoting.css"
import VoteListAdmin from "../components/VoteListAdmin";

function MenuVotingAdmin() {
    return (
        <section>
            <hr />
            <div className="VotingList">
                <VoteListAdmin/>
            </div>
        </section>
    );
}


export default MenuVotingAdmin;