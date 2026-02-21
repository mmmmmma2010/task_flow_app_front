import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';
import styles from './Layout.module.css';

const Layout = ({ children }) => (
    <div className={styles.root}>
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    background: '#1e2540',
                    color: '#f1f5f9',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                },
                success: { iconTheme: { primary: '#10b981', secondary: '#1e2540' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#1e2540' } },
            }}
        />
        <Navbar />
        <main className={styles.main}>{children}</main>
    </div>
);

export default Layout;
