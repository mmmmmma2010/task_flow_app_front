import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ fullPage = false, size = 'md' }) => {
    const spinner = (
        <div className={`${styles.spinner} ${styles[size]}`}>
            <div className={styles.ring}></div>
        </div>
    );

    if (fullPage) {
        return <div className={styles.overlay}>{spinner}</div>;
    }
    return <div className={styles.inline}>{spinner}</div>;
};

export default LoadingSpinner;
