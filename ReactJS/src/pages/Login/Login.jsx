import { useState } from 'react';
import './Login.scss';
import { signIn } from '@services/authService';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { loginWithGoogle } from '@services/authService';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataSignin = {
            email: email,
            password: password
        };

        signIn(dataSignin)
            .then((res) => {
                Cookies.set('accessToken', res.data.accessToken, {
                    expires: 1
                });
                Cookies.set('refreshToken', res.data.refreshToken, {
                    expires: 1
                });

                if (res.data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleLoginWithGoogle = () => {
        loginWithGoogle();
    };

    return (
        <div className='login-container'>
            <form className='login-form' onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className='input-group'>
                    <label>Email</label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='input-group'>
                    <label>Password</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type='submit'>Login</button>
                <div onClick={handleLoginWithGoogle}>Đăng nhập với google</div>
            </form>
        </div>
    );
}

export default Login;
