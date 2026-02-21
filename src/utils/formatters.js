/**
 * Utility helpers for formatting dates, labels, etc.
 */
import { format, parseISO } from 'date-fns';

export const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
        return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch {
        return dateStr;
    }
};

export const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    try {
        return format(parseISO(dateStr), 'MMM d, yyyy HH:mm');
    } catch {
        return dateStr;
    }
};

export const STATUS_LABELS = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
};

export const PRIORITY_LABELS = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
};

export const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
];

export const PRIORITY_OPTIONS = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

export const extractErrorMessage = (error) => {
    if (!error) return 'An unexpected error occurred.';
    const data = error.response?.data;
    if (!data) return error.message || 'An unexpected error occurred.';

    if (typeof data === 'string') return data;
    if (Array.isArray(data)) return data[0] || 'An unexpected error occurred.';

    if (data.detail && typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
        return data.non_field_errors[0];
    }

    const fieldErrors = Object.entries(data).filter(([key]) => key !== 'detail' && key !== 'non_field_errors');
    if (fieldErrors.length > 0) {
        const [field, messages] = fieldErrors[0];
        const msg = Array.isArray(messages) ? messages[0] : messages;
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
        return `${fieldName}: ${msg}`;
    }

    return 'An unexpected error occurred.';
};
