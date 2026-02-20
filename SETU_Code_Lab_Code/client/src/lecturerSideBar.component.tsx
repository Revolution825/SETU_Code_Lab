import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./sidebar.scss";

export default function LecturerSideBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="sidebarDropdown">
            <div className="titleWrapper">
                <button
                    className="dropdownTitle"
                    onClick={() => setOpen(prev => !prev)}
                >
                    Lecturer Menu<img className={open ? "arrow open" : "arrow"} src="/dropdown.svg" alt="dropdown" />
                </button>
            </div>
            {open && (
                <ul className="dropdownList">
                    <li>
                        <button
                            onClick={() => navigate("/manageProblems")}
                            className={`option ${isActive("/manageProblems") ||
                                isActive("/createProblem") ? "active" : ""}`}
                            style={{
                                color:
                                    isActive("/manageProblems") ||
                                        isActive("/createProblem")
                                        ? "#626262"
                                        : "#dedede",
                            }}
                        >
                            Manage Problems
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => navigate("/manageClasses")}
                            className={`option ${isActive("/manageClasses") ||
                                isActive("/createClass") ? "active" : ""}`}
                            style={{
                                color:
                                    isActive("/manageClasses") ||
                                        isActive("/createClass")
                                        ? "#626262"
                                        : "#dedede",
                            }}
                        >
                            Manage Courses
                        </button>
                    </li>
                </ul>
            )}
        </div>
    );
}