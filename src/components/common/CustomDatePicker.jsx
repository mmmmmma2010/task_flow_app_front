import { useState, useRef, useEffect } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    parseISO,
    setHours,
    setMinutes,
    getHours,
    getMinutes
} from 'date-fns';
import { FiCalendar, FiClock, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import styles from './CustomDatePicker.module.css';

const CustomDatePicker = ({ value, onChange, label, error, placeholder = 'Select date & time' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const containerRef = useRef(null);

    const selectedDate = value ? (typeof value === 'string' ? parseISO(value) : value) : null;

    useEffect(() => {
        if (selectedDate) {
            setCurrentMonth(selectedDate);
        }
    }, [isOpen]); // Reset month view when opening

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateClick = (day) => {
        let newDate = day;
        if (selectedDate) {
            newDate = setHours(newDate, getHours(selectedDate));
            newDate = setMinutes(newDate, getMinutes(selectedDate));
        }
        onChange(format(newDate, "yyyy-MM-dd'T'HH:mm"));
    };

    const handleTimeChange = (type, val) => {
        if (!selectedDate) return;
        let newDate = new Date(selectedDate);
        if (type === 'hours') newDate = setHours(newDate, parseInt(val));
        if (type === 'minutes') newDate = setMinutes(newDate, parseInt(val));
        onChange(format(newDate, "yyyy-MM-dd'T'HH:mm"));
    };

    const renderHeader = () => {
        return (
            <div className={styles.header}>
                <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className={styles.navBtn}>
                    <FiChevronLeft />
                </button>
                <span className={styles.currentMonth}>{format(currentMonth, 'MMMM yyyy')}</span>
                <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className={styles.navBtn}>
                    <FiChevronRight />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className={styles.daysRow}>
                {days.map(day => <div key={day} className={styles.dayLabel}>{day}</div>)}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                days.push(
                    <div
                        key={day.toString()}
                        className={`${styles.cell} ${!isSameMonth(day, monthStart) ? styles.disabled :
                                isSameDay(day, selectedDate) ? styles.selected : ''
                            }`}
                        onClick={() => handleDateClick(cloneDay)}
                    >
                        <span className={styles.number}>{format(day, 'd')}</span>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(<div className={styles.row} key={day.toString()}>{days}</div>);
            days = [];
        }
        return <div className={styles.body}>{rows}</div>;
    };

    const renderTimePicker = () => {
        if (!selectedDate) return null;
        return (
            <div className={styles.timePicker}>
                <FiClock className={styles.timeIcon} />
                <div className={styles.timeInputs}>
                    <select
                        value={getHours(selectedDate)}
                        onChange={(e) => handleTimeChange('hours', e.target.value)}
                        className={styles.timeSelect}
                    >
                        {Array.from({ length: 24 }).map((_, i) => (
                            <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                        ))}
                    </select>
                    <span className={styles.timeSeparator}>:</span>
                    <select
                        value={getMinutes(selectedDate)}
                        onChange={(e) => handleTimeChange('minutes', e.target.value)}
                        className={styles.timeSelect}
                    >
                        {Array.from({ length: 60 }).map((_, i) => (
                            <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                        ))}
                    </select>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container} ref={containerRef}>
            {label && <label className={styles.label}>{label}</label>}

            <div
                className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''} ${error ? styles.triggerError : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={selectedDate ? styles.value : styles.placeholder}>
                    {selectedDate ? format(selectedDate, 'PPP HH:mm') : placeholder}
                </span>
                <div className={styles.triggerIcons}>
                    {selectedDate && (
                        <FiX
                            className={styles.clearIcon}
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange('');
                            }}
                        />
                    )}
                    <FiCalendar className={styles.calendarIcon} />
                </div>
            </div>

            {isOpen && (
                <div className={styles.popover}>
                    {renderHeader()}
                    {renderDays()}
                    {renderCells()}
                    {renderTimePicker()}
                </div>
            )}

            {error && <p className={styles.errorText}>{error}</p>}
        </div>
    );
};

export default CustomDatePicker;
