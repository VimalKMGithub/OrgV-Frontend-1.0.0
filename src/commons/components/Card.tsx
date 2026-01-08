import { type ReactNode } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
}

const Card = ({
    children,
    className,
    title
}: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={classNames(
                'bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6',
                className
            )}
        >
            {title && (
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                    {title}
                </h2>
            )}
            {children}
        </motion.div>
    );
};

export default Card;
