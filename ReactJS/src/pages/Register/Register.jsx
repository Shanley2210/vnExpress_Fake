import { useState } from 'react';
import './Register.scss';
import { useNavigate } from 'react-router-dom';
import { register } from '@services/authService';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
        if (password !== confirmPassword) {
            alert('Mật khẩu và xác nhận mật khẩu không khớp!');
            return;
        }

        const dataRegister = {
            email: email,
            password: password,
            display_name: displayName
        };

        register(dataRegister)
            .then((res) => {
                if (res.data.errCode === 0) {
                    // Đăng ký thành công, chuyển hướng về trang login
                    navigate('/login');
                }
            })
            .catch((err) => {
                console.log('Lỗi đăng ký:', err);
                alert(err.response?.data?.errMessage || 'Đã có lỗi xảy ra');
            });
    };

    return (
        <div className='register-container'>
            <form className='register-form' onSubmit={handleSubmit}>
                <h2>Register</h2>
                <div className='input-group'>
                    <label>Display Name</label>
                    <input
                        type='text'
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        autoComplete='name' // Thêm cho trường tên
                    />
                </div>
                <div className='input-group'>
                    <label>Email</label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete='username' // Thêm cho trường email
                    />
                </div>
                <div className='input-group'>
                    <label>Password</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete='new-password' // Sửa thành camelCase
                    />
                </div>
                <div className='input-group'>
                    <label>Confirm Password</label>
                    <input
                        type='password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete='new-password' // Sửa thành camelCase
                    />
                </div>
                <button type='submit'>Register</button>
                <div onClick={() => navigate('/login')}>
                    Already have an account? Login here
                </div>
            </form>
        </div>
    );
}

export default Register;
