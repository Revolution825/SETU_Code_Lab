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
        if(!isValid) throw new Error("Invalid Email input")
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sanitizedName, role, sanitizedEmail, password, confPassword})
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
            <form onSubmit={handleSubmit}>
                <h3>
                    SETU Code Lab
                </h3>

                <p>{error}</p>
                <div>
                    <input 
                        type="text"
                        placeholder="name"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        required 
                    />
                </div>
                <br/>
                <div>
                    <label>
                        <input 
                            type="radio"
                            name="role"
                            value="student"
                            checked={role === "student"}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value)}
                            required 
                        />
                        student
                    </label>
                </div>
                <div>
                    <label>
                    <input 
                        type="radio" 
                        name="role"
                        value="lecturer"
                        checked={role === "lecturer"}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value)}
                        required 
                    />
                    lecturer
                    </label>
                </div>
                <br/>
                <div>
                    <input 
                        type="email" 
                        placeholder="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required />
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="password" 
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required />
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="confirm password" 
                        value={confPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfPassword(e.target.value)}
                        required />
                </div>
                <br/>
                <div>
                    <button type="submit">
                        Sign Up
                    </button>
                </div>
                <p>
                    <a href="/">Log in</a> if you don't have an account already
                </p>
            </form>
        );
    }