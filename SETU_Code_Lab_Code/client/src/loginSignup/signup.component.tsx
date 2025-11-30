import { useState } from "react";
import { useNavigate } from "react-router-dom";

function validateEmail(email:string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const sanitizedEmail = email.trim();
    const isValid = emailRegex.test(sanitizedEmail);
    return { isValid, sanitizedEmail };
}

function sanitizeName(name: string) {
    return name.replaceAll(/[^a-zA-Z\s'-]/g, '').trim();
}

export default function SignUp() {

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const { isValid, sanitizedEmail } = validateEmail(email);
        const sanitizedName = sanitizeName(name)
        if(!isValid) setError("Invalid Email input")
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: sanitizedName, role, email: sanitizedEmail, password, confPassword
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
                    <img src="/logo.svg" alt="Logo" />
                    <h3>
                    SETU Code Lab
                    </h3>
                </div>
                <p className="error">{error}</p>
                <div>
                    <input 
                        className="fullyRounded nameInput"
                        type="text"
                        placeholder="name"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        required 
                    />
                </div>
                <br/>
                <div className="radioLabel">
                    <label>
                        <input 
                            type="radio"
                            name="role"
                            value="student"
                            checked={role === "student"}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value)}
                            required 
                        />
                        Student
                    </label>
                </div>
                <div className="radioLabel">
                    <label>
                    <input 
                        type="radio" 
                        name="role"
                        value="lecturer"
                        checked={role === "lecturer"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value)}
                        required 
                    />
                    Lecturer
                    </label>
                </div>
                <br/>
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
                    className="passwordInput"
                        type="password" 
                        placeholder="password" 
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required />
                </div>
                <div>
                    <input 
                        className="bottomRounded passwordInput"
                        type="password" 
                        placeholder="confirm password" 
                        value={confPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfPassword(e.target.value)}
                        required />
                </div>
                <br/>
                <div>
                    <button className="button" type="submit">
                        Sign Up
                    </button>
                </div>
                <p className="message">
                    <a href="/">Log in</a> if you don't have an account already
                </p>
            </form>
            </div>
        );
    }