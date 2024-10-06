import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { auth, storage, db } from '../Firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import * as EmailValidator from 'email-validator';
import PasswordValidator from 'password-validator';
import LoadingPage from './LoadingPage';


export default function Signup() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const [err, setErr] = useState(false)
    const [displayName, setDisplayName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [file, setFile] = useState()

    const [mailerror, setMailError] = useState(false)
    const [passworderror, setPasswordError] = useState(false)

    const schema = new PasswordValidator()
    schema
        .is().min(8)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits(1)                                // Must have at least 2 digits
        .has().not().spaces()

    const handleSubmitCheck = (e) => {
        e.preventDefault();
        EmailValidator.validate(email) ? (schema.validate(password) ? handleSubmit() : setPasswordError(true)) : setMailError(true);
    }

    const handleSubmit = async (e) => {
        // e.preventDefault();
        // const file = e.target[3].files[0];


        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            const storageRef = ref(storage, displayName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                (error) => {
                    setErr(true);
                },
                () => {
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL
                        });
                        await setDoc(doc(db, 'users', res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL
                        });

                        await setDoc(doc(db, "userChats", res.user.uid), {});

                        // for loading page before landing to home page
                        setLoading(true)
                        setTimeout(() => {
                            navigate('/')
                        }, 3000)
                    });
                }
            );



        }
        catch (err) {
            setErr(true)
        }

    }


    // signin with google
    // const handleGoogleSignIn = () => {
    //     const googleProvider = new GoogleAuthProvider();
    //     signInWithPopup(auth, googleProvider)
    //         .then((result) => {
    //             const credential = GoogleAuthProvider.credentialFromResult(result);
    //             const token = credential.accessToken;
    //             const user = result.user;
    //             console.log(user);
    //         }).catch((error) => {
    //             setErr(true)
    //         });
    // }

    return (
        loading ? <LoadingPage /> :
            <div className='register-form'>
                <form onSubmit={handleSubmitCheck}>
                    <h2>Register Yourself</h2>
                    <input type="text" placeholder='Enter displayName' value={displayName} onChange={e => setDisplayName(e.target.value)} required />
                    <input type="email" placeholder='Enter Email' value={email} onChange={e => setEmail(e.target.value)} required />
                    <input type="password" placeholder='Enter Password' value={password} onChange={e => setPassword(e.target.value)} required />
                    <input type="file" id='profile-pic' onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} required />
                    <label htmlFor="profile-pic">
                        <div className="profile">
                            <AddPhotoAlternateOutlinedIcon style={{ cursor: 'pointer', margin: '3px 5px', color: '#678aec' }} />
                            <p>{file ? file.name : "Select Profile"}</p>
                        </div>
                    </label>
                    <button type='submit'>Register</button>

                    <small style={{ textAlign: 'center', marginTop: '5px' }}>Already Registered?? <Link to='/login'>login</Link></small>

                    {!file && <span>Profile Required ! </span>}
                    {mailerror && <span>Incorrect Email. </span>}
                    {passworderror && <span>Password must be 8 characters with no space, with 1 upper, 1 lower, and 1 number.</span>}
                    {err && <span>Something went wrong !!</span>}
                </form>

                <div className="google-signin">
                    {/* <span>---or---</span>
                <button onClick={handleGoogleSignIn}><img src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" />Signup with Google</button> */}
                </div>
            </div>
    )
}
