import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiPlus, FiZap, FiLogOut, FiUser } from 'react-icons/fi';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <Link to="/dashboard" className={styles.brand}>
                    <FiZap className={styles.brandIcon} />
                    <span>TaskFlow</span>
                </Link>

                <ul className={styles.links}>
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tasks" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                            Tasks
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/completed" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
                            Completed
                        </NavLink>
                    </li>
                </ul>

                <div className={styles.user}>
                    <Link to="/tasks/new" className={styles.navbarCreateBtn} title="New Task">
                        <FiPlus />
                    </Link>
                    <div className={styles.avatar}>
                        <FiUser />
                    </div>
                    <span className={styles.username}>{user?.username || 'User'}</span>
                    <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
                        <FiLogOut />
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
