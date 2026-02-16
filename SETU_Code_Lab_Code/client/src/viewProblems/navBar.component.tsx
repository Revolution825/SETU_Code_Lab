import { Dropdown } from "./dropdown.component";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const logOutClick = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Logout request failed, clearing local state anyway", error);
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  const problemsClick = () => {
    navigate("/problems");
  }

  const leaderboardClick = () => {
    navigate("/leaderboard");
  }

  const profileClick = () => {
    navigate("/profile");
  }
  return (
    <div className="navBar">
      <button onClick={problemsClick} className="logoButton">
        <img className="logo" src="/logo.svg" alt="Logo" />
      </button>
      <h3>
        SETU Code Lab
      </h3>
      <div className="menu">
        <button onClick={leaderboardClick} className="menuButton" style={{ color: isActive("/leaderboard") ? "#626262" : "#dedede" }}>Leaderboard</button>
        |
        <button onClick={problemsClick} className="menuButton" style={{ color: isActive("/problems") ? "#626262" : "#dedede" }}>Problems</button>
        |
        <button onClick={profileClick} className="menuButton" style={{ color: isActive("/profile") ? "#626262" : "#dedede" }}>Profile</button>
      </div>
      <div className="profileDropdown">
        <Dropdown
          className="profileDropdownButton"
          buttonLabel={<img src="/profileIcon.svg" alt="profileIcon" />}
          items={[
            {
              title: "Logout",
              icon: <img src="/logoutIcon.svg" alt="logoutIcon" />,
              action: logOutClick,
              url: "/"
            },
          ]} />
      </div>
    </div>
  );
} 