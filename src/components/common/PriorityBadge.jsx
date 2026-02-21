import { PRIORITY_LABELS } from '../../utils/formatters';
import { FiArrowDown, FiMinus, FiArrowUp } from 'react-icons/fi';
import styles from './PriorityBadge.module.css';

const icons = {
    low: <FiArrowDown />,
    medium: <FiMinus />,
    high: <FiArrowUp />,
};

const PriorityBadge = ({ priority }) => {
    const label = PRIORITY_LABELS[priority] || priority;
    return (
        <span className={`${styles.badge} ${styles[priority]}`}>
            {icons[priority]}
            {label}
        </span>
    );
};

export default PriorityBadge;
