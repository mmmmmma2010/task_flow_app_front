import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { extractErrorMessage } from '../utils/formatters';
import { FiZap, FiLock, FiUser } from 'react-icons/fi';
import styles from './LoginPage.module.css';

const schema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

const LoginPage = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (isAuthenticated) navigate(from, { replace: true });
    }, [isAuthenticated, navigate, from]);

    const onSubmit = async (data) => {
        try {
            await login(data.username, data.password);
            toast.success('Welcome back!');
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(extractErrorMessage(err));
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <FiZap />
                    </div>
                    <h1 className={styles.title}>TaskFlow</h1>
                    <p className={styles.subtitle}>Sign in to manage your tasks</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
                    <div className={styles.field}>
                        <label htmlFor="username" className={styles.label}>Username</label>
                        <div className={styles.inputWrap}>
                            <FiUser className={styles.inputIcon} />
                            <input
                                id="username"
                                type="text"
                                autoComplete="username"
                                placeholder="Enter your username"
                                className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                                {...register('username')}
                            />
                        </div>
                        {errors.username && <p className={styles.error}>{errors.username.message}</p>}
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <div className={styles.inputWrap}>
                            <FiLock className={styles.inputIcon} />
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                                {...register('password')}
                            />
                        </div>
                        {errors.password && <p className={styles.error}>{errors.password.message}</p>}
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <span className={styles.btnSpinner}></span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
