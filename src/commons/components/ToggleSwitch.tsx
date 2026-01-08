interface ToggleSwitchProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    color?: 'primary' | 'red' | 'green';
}

const ToggleSwitch = ({
    label,
    checked,
    onChange,
    color = 'primary'
}: ToggleSwitchProps) => {
    const getBgColor = () => {
        switch (color) {
            case 'red': return 'peer-checked:bg-red-600';
            case 'green': return 'peer-checked:bg-green-600';
            default: return 'peer-checked:bg-primary';
        }
    };
    return (
        <label className="flex items-center space-x-2 cursor-pointer">
            <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-slate-200 dark:bg-slate-700">
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${getBgColor()}`}></div>
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
        </label>
    );
};

export default ToggleSwitch;
