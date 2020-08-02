// Little helper to make sure that Names of users starts from Uppercase

export const capitalizeFirstLetter = str => {
    return typeof window !== 'undefined' && str.charAt(0).toUpperCase() + str.slice(1);
    }
