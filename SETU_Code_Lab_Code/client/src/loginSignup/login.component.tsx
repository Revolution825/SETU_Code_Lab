import { useState } from "react";
import "./loginSignup.scss";
import { useNavigate } from "react-router-dom";

function sanitizeEmail(email:string) {
    return email.trim().toLowerCase()
}

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const sanitizedEmail = sanitizeEmail(email);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: sanitizedEmail, password
                    })
                });
                const data = await res.json();
                if(res.ok) {
                    localStorage.setItem("token", data.token);
                    navigate("/problems");
                } else {
                    setError(data.message);
                }
                
        } catch (error) {
            console.error(error)
            setError("Something went wrong. Try Again");
        }
    }

        return(
        <div className="authBox">
            <form onSubmit={handleSubmit}>
                <div className="header">
                    <img src="../../public/logo.svg" alt="Logo" />
                    <h3>
                    SETU Code Lab
                    </h3>
                </div>
                    <p className="error">{error}</p>
                <div>
                    <input
                        className="topRounded emailInput"
                        type="email" 
                        placeholder="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required />
                </div>
                <div>
                    <input 
                        className="bottomRounded passwordInput"
                        type="password" 
                        placeholder="password" 
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required />
                </div>
                <div>
                    <br/>
                    <button className="button" type="submit">
                        Log in
                    </button>
                </div>
                <p className="message">
                    <a href="/signup">Sign up</a> if you don't have an account already
                </p>
            </form>
            </div>
        );
    }
