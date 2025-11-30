import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email, password})
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
                    <br/>
                    <button type="submit">
                        Log in
                    </button>
                </div>
                <p>
                    <a href="/signup">Sign up</a> if you don't have an account already
                </p>
            </form>
        );
    }
