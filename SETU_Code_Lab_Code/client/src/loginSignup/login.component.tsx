import { useState } from "react";
import "./loginSignup.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";

function sanitizeEmail(email: string) {
    return email.trim().toLowerCase()
}

export default function Login() {

    const [capsOn, setCapsOn] = useState(false);
    const checkCapsLock = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.getModifierState("CapsLock")) {
            setCapsOn(true);
        } else {
            setCapsOn(false);
        }
    };
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useAuth();

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
            if (res.ok) {
                setUser(data.user);
                navigate("/problems");
            } else {
                setError(data.message);
            }

        } catch (error) {
            console.error(error)
            setError("Something went wrong. Try Again");
        }
    }

    return (
        <div className="authScreen">
            <div className="authBox">
                <form onSubmit={handleSubmit}>
                    <div className="header">
                        <img src="/logo.svg" alt="Logo" />
                        <h3>
                            SETU Code Lab
                        </h3>
                    </div>
                    <p className="error">{error}</p>
                    {capsOn && (
                        <p className="capsMessage" > Caps Lock on!</p>
                    )}
                    <div>
                        <input
                            className="topRounded emailInput loginSignUpInput"
                            type="email"
                            placeholder="email"
                            value={email}
                            onKeyUp={checkCapsLock}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required />
                    </div>
                    <div>
                        <input
                            className="bottomRounded passwordInput loginSignUpInput"
                            type="password"
                            placeholder="password"
                            value={password}
                            onKeyUp={checkCapsLock}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required />
                    </div>
                    <div>
                        <br />
                        <button className="button" type="submit">
                            Log in
                        </button>
                    </div>
                    <p className="message">
                        <a href="/signup">Sign up</a> if you don't have an account already
                    </p>
                </form>
            </div>
        </div>
    );
}
