import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTask, deleteTask, completeTask } from '../api/tasks';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import ConfirmModal from '../components/common/ConfirmModal';
import { formatDate, formatDateTime, extractErrorMessage } from '../utils/formatters';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiCheckCircle, FiArrowLeft, FiClock, FiUser, FiCalendar } from 'react-icons/fi';
import styles from './TaskDetailPage.module.css';

const TaskDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDelete, setShowDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        getTask(id)
            .then(setTask)
            .catch(() => toast.error('Task not found'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleComplete = async () => {
        try {
            const updated = await completeTask(id);
            setTask(updated);
            toast.success('Task marked as complete!');
        } catch (err) {
            toast.error(extractErrorMessage(err));
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteTask(id);
            toast.success('Task deleted');
            navigate('/tasks');
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) return <LoadingSpinner fullPage />;
    if (!task) return null;

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <Link to="/tasks" className={styles.backBtn}>
                    <FiArrowLeft /> Back to Tasks
                </Link>
                <div className={styles.topActions}>
                    {task.status !== 'completed' && (
                        <button className={`${styles.actionBtn} ${styles.completeBtn}`} onClick={handleComplete}>
                            <FiCheckCircle /> Mark Complete
                        </button>
                    )}
                    <Link to={`/tasks/${id}/edit`} className={`${styles.actionBtn} ${styles.editBtn}`}>
                        <FiEdit2 /> Edit
                    </Link>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => setShowDelete(true)}>
                        <FiTrash2 /> Delete
                    </button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h1 className={styles.title}>{task.title}</h1>
                    <div className={styles.badges}>
                        <StatusBadge status={task.status} />
                        <PriorityBadge priority={task.priority} />
                        {task.is_overdue && <span className={styles.overdueTag}>Overdue</span>}
                    </div>
                </div>

                {task.description && (
                    <p className={styles.description}>{task.description}</p>
                )}

                <div className={styles.meta}>
                    <div className={styles.metaItem}>
                        <FiCalendar className={styles.metaIcon} />
                        <span className={styles.metaLabel}>Due Date</span>
                        <span className={task.is_overdue ? styles.overdue : styles.metaValue}>
                            {formatDate(task.due_date)}
                            {task.days_until_due !== null && task.days_until_due !== undefined && (
                                <span className={styles.daysHint}>
                                    {task.days_until_due < 0
                                        ? ` (${Math.abs(task.days_until_due)}d overdue)`
                                        : ` (${task.days_until_due}d left)`}
                                </span>
                            )}
                        </span>
                    </div>

                    <div className={styles.metaItem}>
                        <FiUser className={styles.metaIcon} />
                        <span className={styles.metaLabel}>Created By</span>
                        <span className={styles.metaValue}>
                            {task.created_by?.username || task.created_by || '—'}
                        </span>
                    </div>

                    <div className={styles.metaItem}>
                        <FiUser className={styles.metaIcon} />
                        <span className={styles.metaLabel}>Assigned To</span>
                        <span className={styles.metaValue}>
                            {task.assigned_to?.username || task.assigned_to || '—'}
                        </span>
                    </div>

                    <div className={styles.metaItem}>
                        <FiClock className={styles.metaIcon} />
                        <span className={styles.metaLabel}>Created</span>
                        <span className={styles.metaValue}>{formatDateTime(task.created_at)}</span>
                    </div>

                    {task.completed_at && (
                        <div className={styles.metaItem}>
                            <FiCheckCircle className={styles.metaIcon} />
                            <span className={styles.metaLabel}>Completed</span>
                            <span className={styles.metaValue}>{formatDateTime(task.completed_at)}</span>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={showDelete}
                title="Delete Task"
                message={`Are you sure you want to delete "${task.title}"?`}
                onConfirm={handleDelete}
                onCancel={() => setShowDelete(false)}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default TaskDetailPage;
