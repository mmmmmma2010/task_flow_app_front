import { FiAlertTriangle } from 'react-icons/fi';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({
    isOpen,
    title = 'Confirm Delete',
    message = 'Are you sure you want to delete this? This action cannot be undone.',
    onConfirm,
    onCancel,
    confirmLabel = 'Delete',
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.iconWrap}>
                    <FiAlertTriangle className={styles.icon} />
                </div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </button>
                    <button className={styles.confirmBtn} onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? 'Deleting…' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
