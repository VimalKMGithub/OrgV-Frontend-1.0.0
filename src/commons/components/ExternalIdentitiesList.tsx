import { dateToLocaleString } from '../../commons/utils/dateTimeUtility';
import ExternalIdentityAvatar from './ExternalIdentityAvatar';
import type { ExternalIdentity } from '../../user/api/userApis';

interface ExternalIdentitiesListProps {
    externalIdentities: ExternalIdentity[] | null;
}

const ExternalIdentitiesList = ({
    externalIdentities
}: ExternalIdentitiesListProps) => {
    if (!externalIdentities || externalIdentities.length === 0) {
        return null;
    }
    return (
        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="font-medium block mb-2">External Identities:</span>
            <div className="space-y-3">
                {externalIdentities.map((ext) => (
                    <div key={ext.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md border border-slate-200 dark:border-slate-600">
                        <div className="flex items-center gap-3 mb-2 pb-2 border-b border-slate-200 dark:border-slate-600">
                            <ExternalIdentityAvatar url={ext.profilePictureUrl} provider={ext.provider} />
                            <div className="overflow-hidden">
                                <p className="font-bold capitalize text-slate-800 dark:text-slate-200">{ext.provider}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate" title={ext.email}>{ext.email}</p>
                            </div>
                        </div>
                        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                            <p className="flex justify-between"><span className="font-medium">ID:</span> <span className="font-mono text-[10px] truncate max-w-[120px]" title={ext.id}>{ext.id}</span></p>
                            <p className="flex justify-between"><span className="font-medium">Provider ID:</span> <span className="font-mono text-[10px] truncate max-w-[120px]" title={ext.providerUserId}>{ext.providerUserId}</span></p>
                            <p className="flex justify-between"><span className="font-medium">Linked At:</span> <span>{dateToLocaleString(ext.linkedAt)}</span></p>
                            <p className="flex justify-between"><span className="font-medium">Last Used At:</span> <span>{dateToLocaleString(ext.lastUsedAt)}</span></p>
                            <p className="flex justify-between"><span className="font-medium">Created At:</span> <span>{dateToLocaleString(ext.createdAt)}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExternalIdentitiesList;