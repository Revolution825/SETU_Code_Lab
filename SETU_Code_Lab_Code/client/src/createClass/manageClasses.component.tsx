import { useNavigate } from "react-router-dom";
import LecturerSideBar from "../viewProblems/lecturerSideBar.component";
import NavBar from "../viewProblems/navBar.component";
import { useAuth } from "../authContext";

export default function ManageClasses() {
    const navigate = useNavigate();
    const { user } = useAuth();

    function createClassClick() {
        navigate("/createClass");
    }

    return (
        <div>
            <NavBar />
            {user?.role == "lecturer" ? <div className="sideBar"><LecturerSideBar /></div> : null}
            <div className="manageProblemsBody">
                <div>
                    <button onClick={createClassClick} className="createNew">
                        <img className="plusIcon" src="plusIcon.svg" alt="Plus Icon" />Create New Class
                    </button>
                </div>
                <div className="manageProblems">

                </div>
            </div>
        </div>
    );
}