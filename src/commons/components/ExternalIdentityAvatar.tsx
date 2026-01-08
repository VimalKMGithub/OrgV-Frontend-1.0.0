import { useState } from "react";

interface ExternalIdentityAvatarProps {
    url: string;
    provider: string;
}

const ExternalIdentityAvatar = ({
    url,
    provider
}: ExternalIdentityAvatarProps) => {
    const [imgError, setImgError] = useState(false);
    if (url && !imgError) {
        return (
            <img
                src={url}
                alt={provider}
                className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-500"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
            />
        );
    }
    return (
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold capitalize">
            {provider[0]}
        </div>
    );
};

export default ExternalIdentityAvatar;
