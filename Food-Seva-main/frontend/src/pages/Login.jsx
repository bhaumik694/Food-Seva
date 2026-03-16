import React , { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [role, setRole] = useState('donor');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password , role });
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            if( role === 'donor' ){
            await axios.post("http://localhost:5000/api/auth/loginwithweb3",{email})
            }
            alert("Login Successful!");
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="container mx-auto mt-20 bg-white max-w-md p-8 border  border-gray-300 rounded-lg shadow-lg">
            <div className='py-4'>
            <h1 className="text-3xl font-bold text-center p-2 underline">Login</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4 py-4">
                    <input
                        type="email"
                        id="email"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 shadow-xl"
                        placeholder="Email id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4 py-4">
                    <input
                        type="password"
                        id="password"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 shadow-xl"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4 py-4">
                    <label className="block text-gray-700 font-bold mb-2">Login as:</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input 
                                type="radio" 
                                name="role" 
                                value="donor" 
                                checked={role === "donor"} 
                                onChange={(e) => setRole(e.target.value)} 
                                className="form-radio"
                            />
                            <span>Donor</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input 
                                type="radio" 
                                name="role" 
                                value="ngo" 
                                checked={role === "ngo"} 
                                onChange={(e) => setRole(e.target.value)} 
                                className="form-radio"
                            />
                            <span>NGO</span>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col mb-4">
                    <a href="#" className="text-purple-500 text-left hover:underline mb-4 mt-0">
                        Forgot Password?
                    </a>
                    <button
                        type="submit"
                        className="w-full bg-[#454646] text-white py-4 rounded-lg hover:bg-[#77797A] transition duration-300 mb-4 text-[15px]"
                    >
                        Login
                    </button>
                    <a href="/register" className="text-purple-500 text-center hover:underline">
                        New User?
                    </a>
                </div>
            </form>
        </div>
    );
};

export default Login;