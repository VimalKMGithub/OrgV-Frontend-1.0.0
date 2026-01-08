import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

interface PageHeaderProps {
    title: string;
    backPath: string;
    backText: string;
}

const PageHeader = ({
    title,
    backPath,
    backText
}: PageHeaderProps) => {
    const navigate = useNavigate();

    return (
        <div className="mb-6 flex justify-between items-center">
            <button
                onClick={() => navigate(backPath)}
                className="flex items-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
                <FaArrowLeft className="mr-2" /> {backText}
            </button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        </div>
    );
};

export default PageHeader;
