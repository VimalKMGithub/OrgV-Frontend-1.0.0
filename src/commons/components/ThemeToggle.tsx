import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none transition-colors duration-200"
            aria-label="Toggle Theme"
        >
            {theme === 'light' ? <FaMoon className="text-xl" /> : <FaSun className="text-xl" />}
        </button>
    );
};

export default ThemeToggle;
