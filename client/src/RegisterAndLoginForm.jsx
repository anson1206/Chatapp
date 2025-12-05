import axios from "axios";
import { useState, useContext } from "react";
import { UserContext } from "./UserContext";
export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {setUsername: setLoggedInUsername, setId} = useContext(UserContext);
    const [isLoginOrRegister, setIsLoginOrRegister] = useState('register');
    
    async function handleSubmit(ev){
        ev.preventDefault();
        const url = isLoginOrRegister === 'register' ? '/register' : '/login';
        const {data} = await axios.post(url, {username, password});
        setLoggedInUsername(username);
        setId(data.id);
    }
    return (
    <div className="bg-blue-50 h-screen flex items-center">
        <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
            <input value={username} 
            onChange={e => setUsername(e.target.value)} 
            type="text" 
            placeholder="username"
            className="block w-full rounded-sm p-2 mb-2 border"/>
            <input value={password} 
            onChange={e => setPassword(e.target.value)} 
            type="password" 
            placeholder="password"
            className="block w-full rounded-sm p-2 mb-2 border"/>
            <button className="block w-full bg-blue-500 text-white rounded-sm p-2" >
                {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                </button>
            <div className="text-center mt-2">
                {isLoginOrRegister === 'register' && (
                    <div>
                        Already a member?
                        <button onClick={() => setIsLoginOrRegister('login')} 
                        className="text-blue-500">
                            Login here.
                        </button>
                    </div>
                )}
                {isLoginOrRegister === 'login' && (
                    <div>
                        Don't have an account?
                        <button onClick={() => setIsLoginOrRegister('register')}
                        className="text-blue-500">
                            Register here.
                        </button>
                    </div>
                )}
            </div>
        </form>
    </div>
    )
}