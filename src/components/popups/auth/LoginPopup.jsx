import React, { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext';
import Inputbox from '../../common/Inputbox';
import ButtonBox from '../../common/ButtonBox';

export default function LoginPopup({ setShowLoginModal }) {

    const { login } = useAuth();
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState("")

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setLoginForm({ ...loginForm, [name]: value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await login(loginForm.email, loginForm.password);
        if (result?.success) {
            setShowLoginModal(false);
            setLoginForm({ email: '', password: '' });
        } else {
            alert(result?.error || 'Login failed');
        }
    };
    return (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Login</h2>
                <div>
                    <div className="form-group">
                        <Inputbox type="email" name="email" value={loginForm.email} isRequired={true} onChangeHandler={handleTextChange} labelText="Username/Email"></Inputbox>
                    </div>
                    <div className="form-group">
                        <Inputbox type="password" name="password" value={loginForm.password} isRequired={true} onChangeHandler={handleTextChange} labelText="Password"></Inputbox>

                    </div>
                    <div className="form-actions">
                        <ButtonBox type="save" text="Login" onClickHandler={handleLogin} className="btn btn-primary"></ButtonBox>
                        <ButtonBox type="cancel" onClick={() => setShowLoginModal(false)} />
                    </div>
                </div>
                <p className="demo-credentials">
                    {loginError && <span className="text-danger">{loginError}</span>}
                </p>
            </div>
        </div>
    )
} 