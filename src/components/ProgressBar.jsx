function ProgressBar({ value = 0, indeterminate = false, className = '' }) {
    return (
        <div className={`progress-bar ${indeterminate ? 'indeterminate' : ''} ${className}`}>
            <div
                className="progress-bar-inner"
                style={{ width: indeterminate ? '30%' : `${Math.min(100, Math.max(0, value))}%` }}
            />
        </div>
    )
}

export default ProgressBar
