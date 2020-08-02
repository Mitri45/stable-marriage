// Little helper to make sure that Names of users starts from Uppercase

export const capitalizeFirstLetter = str => {
    if (typeof window !== 'undefined') {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    }
