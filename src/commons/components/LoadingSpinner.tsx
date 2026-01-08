const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-primary dark:border-t-primary"></div>
                <p className="text-slate-600 dark:text-slate-400 font-medium animate-pulse">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;
