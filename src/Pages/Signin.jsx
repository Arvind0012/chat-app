import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../Firebase';
import { Link } from 'react-router-dom'
import LoadingPage from './LoadingPage';


export default function Signin() {

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password).then( setLoading(true));

            // for loading page
           
            setTimeout(() => {
                navigate('/')
            }, 2000)

        }
        catch (err) {
            setErr(true)
        }
    }

    return (
        loading ? <LoadingPage /> :
        <div className='login-form'>
            <form onSubmit={handleSubmit}>
                <h2>Login User</h2>
                <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type='submit'>Sign In</button>
                <small style={{textAlign:'center', marginTop:'5px'}}>Not Registered?? <Link to='/register'>Register Now</Link></small>
                {err && <span>Something went wrong</span>}
            </form>
        </div>
    )
}
