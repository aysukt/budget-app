import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { useNavigate } from 'react-router-dom';
import "./styles.scss";

export const Auth = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signInWithEmailAndPasswordHandler = async () => {
        try {
            // E-posta ve şifre ile giriş yapma
            const results = await signInWithEmailAndPassword(auth, email, password);

            // Giriş başarılı ise, auth bilgilerini localStorage'e kaydet ve yönlendir
            const authInfo = {
                userID: results.user.uid,
                name: results.user.displayName,
                profilephoto: results.user.photoURL,
                isAuth: true,
            };
            localStorage.setItem("auth", JSON.stringify(authInfo));
            navigate("/expense-tracker");
        } catch (error) {
            console.error("Giriş sırasında bir hata oluştu", error.message);
            // Hata durumunda kullanıcıya bilgi verebilirsiniz.
        }
    };

    const signUpWithEmailAndPasswordHandler = async () => {
        try {
            // E-posta ve şifre ile yeni kullanıcı kaydı oluşturma
            const results = await createUserWithEmailAndPassword(auth, email, password);

            // Yeni kullanıcı oluşturulduktan sonra otomatik olarak giriş yap
            await signInWithEmailAndPassword(auth, email, password);

            // Giriş başarılı ise, auth bilgilerini localStorage'e kaydet ve yönlendir
            const authInfo = {
                userID: results.user.uid,
                name: results.user.displayName,
                profilephoto: results.user.photoURL,
                isAuth: true,
            };
            localStorage.setItem("auth", JSON.stringify(authInfo));
            navigate("/expense-tracker");
        } catch (error) {
            console.error("Kullanıcı kaydı sırasında bir hata oluştu", error.message);
            // Hata durumunda kullanıcıya bilgi verebilirsiniz.
        }
    };

    return (
        <div className="login-page">
            <p>Bütçe Takip Sistemi</p>
            <div className="form-group">
                <label>Email:</label>
                <input 
                    type="email" 
                    placeholder="example@gmail.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
            </div>
            <div className="form-group">
                <label>Password:</label>
                <input 
                    type="password" 
                    placeholder="min 6 letters." 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </div>
            <button className="login-with-email-btn" onClick={signInWithEmailAndPasswordHandler}>
                Sign In!
            </button>
            <button className="sign-up-with-email-btn" onClick={signUpWithEmailAndPasswordHandler}>
                Sign Up
            </button>
        </div>
    );
};
