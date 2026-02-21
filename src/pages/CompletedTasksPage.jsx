import { useState, useEffect } from 'react';
import { getCompletedTasks, getRecentCompleted } from '../api/tasks';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PriorityBadge from '../components/common/PriorityBadge';
import EmptyState from '../components/common/EmptyState';
import { formatDate, formatDateTime } from '../utils/formatters';
import { FiCheckCircle, FiClock } from 'react-icons/fi';
import styles from './CompletedTasksPage.module.css';

const CompletedTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('all'); // 'all' | 'recent'

    useEffect(() => {
        setLoading(true);
        const fetcher = view === 'recent' ? getRecentCompleted(7) : getCompletedTasks();
        fetcher
            .then((data) => {
                const results = Array.isArray(data) ? data : data.results || [];
                setTasks(results);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [view]);

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Completed Tasks</h1>
                    <p className={styles.pageSubtitle}>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
                </div>
                <div className={styles.toggle}>
                    <button
                        className={`${styles.toggleBtn} ${view === 'all' ? styles.active : ''}`}
                        onClick={() => setView('all')}
                    >All Time</button>
                    <button
                        className={`${styles.toggleBtn} ${view === 'recent' ? styles.active : ''}`}
                        onClick={() => setView('recent')}
                    >Last 7 Days</button>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : tasks.length === 0 ? (
                <EmptyState
                    title="No completed tasks"
                    message={view === 'recent' ? 'No tasks completed in the last 7 days.' : 'No completed tasks yet.'}
                />
            ) : (
                <div className={styles.grid}>
                    {tasks.map((task) => (
                        <div key={task.id} className={styles.card}>
                            <div className={styles.cardTop}>
                                <FiCheckCircle className={styles.checkIcon} />
                                <h3 className={styles.taskTitle}>{task.title}</h3>
                            </div>
                            {task.description && (
                                <p className={styles.description}>{task.description}</p>
                            )}
                            <div className={styles.cardMeta}>
                                <PriorityBadge priority={task.priority} />
                                {task.completed_at && (
                                    <span className={styles.completedAt}>
                                        <FiClock /> {formatDateTime(task.completed_at)}
                                    </span>
                                )}
                            </div>
                            <div className={styles.cardFooter}>
                                <span className={styles.by}>
                                    By: {task.created_by?.username || task.created_by || '—'}
                                </span>
                                {task.due_date && (
                                    <span className={styles.due}>Due was: {formatDate(task.due_date)}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompletedTasksPage;
