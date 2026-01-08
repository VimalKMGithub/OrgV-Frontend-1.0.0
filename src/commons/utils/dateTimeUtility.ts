export const dateToLocaleString = (dateString: string | null | undefined) => {
    if (!dateString) {
        return 'N/A';
    }
    return new Date(dateString).toLocaleString();
};

export const timestampToLocaleString = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
};
