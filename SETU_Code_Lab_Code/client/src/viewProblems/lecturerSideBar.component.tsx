import "./lecturerSideBar.scss"

export default function LecturerSideBar() {
    return (
        <div className="sideBar">
            <ul>
                <li><button className="option">Manage Problems</button></li>
                <li><button className="option">Manage Classes</button></li>
            </ul>
        </div>
    );
}