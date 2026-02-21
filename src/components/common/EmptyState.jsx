import { FiInbox } from 'react-icons/fi';
import styles from './EmptyState.module.css';

const EmptyState = ({ title = 'Nothing here yet', message = '', action }) => (
    <div className={styles.wrapper}>
        <div className={styles.iconWrap}>
            <FiInbox className={styles.icon} />
        </div>
        <h3 className={styles.title}>{title}</h3>
        {message && <p className={styles.message}>{message}</p>}
        {action && (
            <div className={styles.actionWrap}>
                {action}
            </div>
        )}
    </div>
);

export default EmptyState;
