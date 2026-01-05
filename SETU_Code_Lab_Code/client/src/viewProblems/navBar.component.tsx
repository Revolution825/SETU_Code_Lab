import { Dropdown } from "./dropdown.component";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
    const navigate = useNavigate();
    const logOutClick = () => {
      localStorage.removeItem("token");
      navigate("/");
    }
    const logoClick = () => {
      navigate("/problems");
    }
    return (
          <div  className="navBar">
            <button onClick={logoClick} className="logoButton">
              <img className="logo" src="/logo.svg" alt="Logo" />
            </button>
            <h3>
              SETU Code Lab
            </h3>
            <div className="profileDropdown">
              <Dropdown 
              className="profileDropdownButton"
              buttonLabel={<img src="/profileIcon.svg" alt="profileIcon" />} 
              items={[
              {
                title: "Logout",
                icon: <img src="/logoutIcon.svg" alt="logoutIcon"/>,
                action: logOutClick,
                url: "/"
              },
              ]}/>
            </div>
          </div>
    );
} 