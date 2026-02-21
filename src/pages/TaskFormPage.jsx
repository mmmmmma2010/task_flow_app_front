import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getTask, createTask, updateTask } from '../api/tasks';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { extractErrorMessage, STATUS_OPTIONS, PRIORITY_OPTIONS } from '../utils/formatters';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import styles from './TaskFormPage.module.css';

const schema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
    description: z.string().optional().default(''),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
    due_date: z.string().optional().default(''),
    assigned_to_id: z.preprocess(
        (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
        z.number().int().positive('Must be a valid user ID').nullable().optional()
    ),
});

const TaskFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const [initialLoading, setInitialLoading] = useState(isEditing);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            priority: 'medium',
            status: 'pending',
            due_date: '',
            assigned_to_id: '',
        },
    });

    useEffect(() => {
        if (!isEditing) return;
        getTask(id)
            .then((task) => {
                reset({
                    title: task.title || '',
                    description: task.description || '',
                    priority: task.priority || 'medium',
                    status: task.status || 'pending',
                    due_date: task.due_date ? task.due_date.substring(0, 16) : '',
                    assigned_to_id: task.assigned_to?.id || task.assigned_to_id || '',
                });
            })
            .catch(() => toast.error('Failed to load task'))
            .finally(() => setInitialLoading(false));
    }, [id, isEditing, reset]);

    const onSubmit = async (data) => {
        // Clean up empty values
        const payload = { ...data };
        if (!payload.due_date) delete payload.due_date;
        if (!payload.assigned_to_id) delete payload.assigned_to_id;

        try {
            if (isEditing) {
                await updateTask(id, payload);
                toast.success('Task updated!');
                navigate(`/tasks/${id}`);
            } else {
                const created = await createTask(payload);
                toast.success('Task created!');
                navigate(`/tasks/${created.id}`);
            }
        } catch (err) {
            toast.error(extractErrorMessage(err));
        }
    };

    if (initialLoading) return <LoadingSpinner fullPage />;

    return (
        <div className={styles.page}>
            <div className={styles.topBar}>
                <Link to={isEditing ? `/tasks/${id}` : '/tasks'} className={styles.backBtn}>
                    <FiArrowLeft /> {isEditing ? 'Back to Task' : 'Back to Tasks'}
                </Link>
            </div>

            <div className={styles.card}>
                <h1 className={styles.title}>{isEditing ? 'Edit Task' : 'New Task'}</h1>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
                    {/* Title */}
                    <div className={styles.field}>
                        <label className={styles.label}>Title <span className={styles.required}>*</span></label>
                        <input
                            type="text"
                            placeholder="Task title…"
                            className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                            {...register('title')}
                        />
                        {errors.title && <p className={styles.error}>{errors.title.message}</p>}
                    </div>

                    {/* Description */}
                    <div className={styles.field}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            placeholder="Optional description…"
                            rows={4}
                            className={styles.textarea}
                            {...register('description')}
                        />
                    </div>

                    {/* Row: Priority + Status */}
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Priority</label>
                            <select className={styles.select} {...register('priority')}>
                                {PRIORITY_OPTIONS.filter((o) => o.value).map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Status</label>
                            <select className={styles.select} {...register('status')}>
                                {STATUS_OPTIONS.filter((o) => o.value).map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Row: Due date + Assigned to */}
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Due Date</label>
                            <input
                                type="datetime-local"
                                className={styles.input}
                                {...register('due_date')}
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Assign To (User ID)</label>
                            <input
                                type="number"
                                placeholder="User ID (optional)"
                                className={`${styles.input} ${errors.assigned_to_id ? styles.inputError : ''}`}
                                {...register('assigned_to_id')}
                            />
                            {errors.assigned_to_id && <p className={styles.error}>{errors.assigned_to_id.message}</p>}
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <Link to={isEditing ? `/tasks/${id}` : '/tasks'} className={styles.cancelBtn}>
                            Cancel
                        </Link>
                        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                            {isSubmitting
                                ? <span className={styles.btnSpinner}></span>
                                : <><FiSave /> {isEditing ? 'Save Changes' : 'Create Task'}</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskFormPage;
