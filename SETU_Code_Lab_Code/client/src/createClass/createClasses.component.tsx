import { useNavigate } from "react-router-dom";
import LecturerSideBar from "../viewProblems/lecturerSideBar.component";
import NavBar from "../viewProblems/navBar.component";
import { useAuth } from "../authContext";

export default function CreateClass() {
    const navigate = useNavigate();
    const { user } = useAuth();
    return (
        <div>
            <NavBar />
            {user?.role == "lecturer" ? <LecturerSideBar /> : null}
        </div>
    );
}