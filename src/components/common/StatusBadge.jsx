import { STATUS_LABELS } from '../../utils/formatters';
import styles from './StatusBadge.module.css';

const StatusBadge = ({ status }) => {
    const label = STATUS_LABELS[status] || status;
    return (
        <span className={`${styles.badge} ${styles[status]}`}>
            {label}
        </span>
    );
};

export default StatusBadge;
