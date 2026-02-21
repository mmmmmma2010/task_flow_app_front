import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTasks, deleteTask, completeTask } from '../api/tasks';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CustomSelect from '../components/common/CustomSelect';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import ConfirmModal from '../components/common/ConfirmModal';
import EmptyState from '../components/common/EmptyState';
import { formatDate, STATUS_OPTIONS, PRIORITY_OPTIONS, extractErrorMessage } from '../utils/formatters';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiSearch, FiFilter, FiEye } from 'react-icons/fi';
import styles from './TaskListPage.module.css';

const ORDERING_OPTIONS = [
    { value: '-created_at', label: 'Newest First' },
    { value: 'created_at', label: 'Oldest First' },
    { value: '-due_date', label: 'Due Date (Latest)' },
    { value: 'due_date', label: 'Due Date (Earliest)' },
    { value: 'priority', label: 'Priority' },
];

const TaskListPage = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, page: 1 });
    const [filters, setFilters] = useState({ status: '', priority: '', search: '', ordering: '-created_at' });
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchTasks = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = { page, page_size: 10, ...filters };
            Object.keys(params).forEach((k) => { if (params[k] === '') delete params[k]; });
            const data = await getTasks(params);
            const results = Array.isArray(data) ? data : data.results || [];
            setTasks(results);
            setPagination((prev) => ({
                count: data.count || results.length,
                next: data.next || null,
                previous: data.previous || null,
                page,
            }));
        } catch (err) {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { fetchTasks(1); }, [fetchTasks]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            await deleteTask(deleteTarget.id);
            toast.success(`"${deleteTarget.title}" deleted`);
            setDeleteTarget(null);
            fetchTasks(pagination.page);
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleComplete = async (task) => {
        try {
            await completeTask(task.id);
            toast.success(`"${task.title}" marked as complete!`);
            fetchTasks(pagination.page);
        } catch (err) {
            toast.error(extractErrorMessage(err));
        }
    };

    const totalPages = Math.ceil(pagination.count / 10);

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Tasks</h1>
                    <p className={styles.pageSubtitle}>{pagination.count} task{pagination.count !== 1 ? 's' : ''} total</p>
                </div>
                <Link to="/tasks/new" className={styles.createBtn}>
                    <FiPlus /> New Task
                </Link>
            </div>

            {/* Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.searchWrap}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search tasks…"
                        className={styles.searchInput}
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>
                <div className={styles.filterRight}>
                    <FiFilter className={styles.filterIcon} />
                    <div className={styles.selectGroup}>
                        <CustomSelect
                            value={filters.status}
                            onChange={(val) => handleFilterChange('status', val)}
                            options={STATUS_OPTIONS}
                            placeholder="All Statuses"
                        />
                        <CustomSelect
                            value={filters.priority}
                            onChange={(val) => handleFilterChange('priority', val)}
                            options={PRIORITY_OPTIONS}
                            placeholder="All Priorities"
                        />
                        <CustomSelect
                            value={filters.ordering}
                            onChange={(val) => handleFilterChange('ordering', val)}
                            options={ORDERING_OPTIONS}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : tasks.length === 0 ? (
                <EmptyState
                    title="No tasks found"
                    message="Try adjusting your filters or create a new task."
                    action={<Link to="/tasks/new" className={styles.createBtn}><FiPlus /> New Task</Link>}
                />
            ) : (
                <>
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Due Date</th>
                                    <th>Assigned To</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr key={task.id} className={task.is_overdue ? styles.overdueRow : ''}>
                                        <td>
                                            <Link to={`/tasks/${task.id}`} className={styles.taskTitle}>
                                                {task.title}
                                                {task.is_overdue && <span className={styles.overdueTag}>Overdue</span>}
                                            </Link>
                                        </td>
                                        <td><StatusBadge status={task.status} /></td>
                                        <td><PriorityBadge priority={task.priority} /></td>
                                        <td className={task.is_overdue ? styles.overdueDate : styles.dateCell}>
                                            {formatDate(task.due_date)}
                                        </td>
                                        <td className={styles.assignee}>
                                            {task.assigned_to_username || task.assigned_to?.username || '—'}
                                        </td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.viewBtn}`}
                                                    onClick={() => navigate(`/tasks/${task.id}`)}
                                                    title="View"
                                                ><FiEye /></button>
                                                <button
                                                    className={`${styles.actionBtn} ${styles.editBtn}`}
                                                    onClick={() => navigate(`/tasks/${task.id}/edit`)}
                                                    title="Edit"
                                                ><FiEdit2 /></button>
                                                {task.status !== 'completed' && (
                                                    <button
                                                        className={`${styles.actionBtn} ${styles.completeBtn}`}
                                                        onClick={() => handleComplete(task)}
                                                        title="Mark Complete"
                                                    ><FiCheckCircle /></button>
                                                )}
                                                <button
                                                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                    onClick={() => setDeleteTarget(task)}
                                                    title="Delete"
                                                ><FiTrash2 /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.pageBtn}
                                disabled={!pagination.previous}
                                onClick={() => fetchTasks(pagination.page - 1)}
                            >← Prev</button>
                            <span className={styles.pageInfo}>
                                Page {pagination.page} of {totalPages}
                            </span>
                            <button
                                className={styles.pageBtn}
                                disabled={!pagination.next}
                                onClick={() => fetchTasks(pagination.page + 1)}
                            >Next →</button>
                        </div>
                    )}
                </>
            )}

            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Task"
                message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default TaskListPage;
