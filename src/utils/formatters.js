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
    if (data.detail) return data.detail;
    if (data.non_field_errors) return data.non_field_errors[0];
    // Return first field error
    const firstKey = Object.keys(data)[0];
    if (firstKey) {
        const msg = data[firstKey];
        return Array.isArray(msg) ? `${firstKey}: ${msg[0]}` : `${firstKey}: ${msg}`;
    }
    return 'An unexpected error occurred.';
};
