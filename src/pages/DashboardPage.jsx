import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStatistics, getOverdueTasks } from '../api/tasks';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/formatters';
import {
    FiCheckSquare, FiClock, FiAlertTriangle, FiZap,
    FiTrendingUp, FiList, FiAlertCircle,
} from 'react-icons/fi';
import styles from './DashboardPage.module.css';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className={`${styles.statCard} ${styles[color]}`}>
        <div className={styles.statIcon}>
            <Icon />
        </div>
        <div className={styles.statInfo}>
            <span className={styles.statValue}>{value ?? '—'}</span>
            <span className={styles.statLabel}>{label}</span>
        </div>
    </div>
);

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [overdue, setOverdue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, overdueData] = await Promise.all([
                    getStatistics(),
                    getOverdueTasks(),
                ]);
                setStats(statsData);
                setOverdue(Array.isArray(overdueData) ? overdueData : overdueData.results || []);
            } catch (err) {
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner fullPage />;

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Dashboard</h1>
                <Link to="/tasks/new" className={styles.createBtn}>
                    <FiZap /> New Task
                </Link>
            </div>

            {error && <div className={styles.errorBanner}>{error}</div>}

            {stats && (
                <div className={styles.statsGrid}>
                    <StatCard label="Total Tasks" value={stats.total} icon={FiList} color="indigo" />
                    <StatCard label="Pending" value={stats.pending} icon={FiClock} color="amber" />
                    <StatCard label="In Progress" value={stats.in_progress} icon={FiTrendingUp} color="blue" />
                    <StatCard label="Completed" value={stats.completed} icon={FiCheckSquare} color="green" />
                    <StatCard label="Overdue" value={stats.overdue} icon={FiAlertTriangle} color="red" />
                    <StatCard label="High Priority" value={stats.high_priority} icon={FiAlertCircle} color="orange" />
                </div>
            )}

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                    <FiAlertTriangle className={styles.sectionIcon} /> Overdue Tasks
                </h2>
                {overdue.length === 0 ? (
                    <EmptyState
                        title="No overdue tasks"
                        message="Great job! You're all caught up."
                    />
                ) : (
                    <div className={styles.overdueList}>
                        {overdue.map((task) => (
                            <Link to={`/tasks/${task.id}`} key={task.id} className={styles.overdueCard}>
                                <div className={styles.overdueLeft}>
                                    <span className={styles.overdueTitle}>{task.title}</span>
                                    <span className={styles.overdueDue}>Due: {formatDate(task.due_date)}</span>
                                </div>
                                <div className={styles.overdueRight}>
                                    <StatusBadge status={task.status} />
                                    <PriorityBadge priority={task.priority} />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default DashboardPage;
