import { Dropdown } from "./dropdown.component";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
    const navigate = useNavigate();
    const handleClick = () => {
      localStorage.removeItem("token");
      navigate("/");
    }   
    return (
          <div className="navBar">
            <img className="logo" src="/logo.svg" alt="Logo" />
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
                action: () => handleClick,
                url: "/"
              },
              ]}/>
            </div>
          </div>
    );
} 