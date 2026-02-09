import { useNavigate } from "react-router-dom";
import "./lecturerSideBar.scss"

export default function LecturerSideBar() {
    const navigate = useNavigate();
    const isActive = (path: string) => location.pathname === path;
    const manageProblemsClick = () => {
        navigate("/manageProblems");
    }
    const manageClassesClick = () => {
        navigate("/manageClasses");
    }

    return (
        <div>
            <h3 className="lecturerMenuTitle">Lecturer Menu</h3>
            <ul>
                <li><button onClick={manageProblemsClick} className="option" style={{ color: isActive("/manageProblems") || isActive("/createProblem") ? "#626262" : "#dedede" }}>Manage Problems</button></li>
                <li><button onClick={manageClassesClick} className="option" style={{ color: isActive("/manageClasses") || isActive("/createClass") ? "#626262" : "#dedede" }}>Manage Courses</button></li>
            </ul>
        </div>
    );
}