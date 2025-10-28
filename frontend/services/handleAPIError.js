export const handleAPIError = (error) => {
    if (error.response) {
        // Server responded with error
        return {
            message: error.response.data.message || 'An error occurred',
            status: error.response.status
        };
    } else if (error.request) {
        // Request made but no response
        return {
            message: 'No response from server. Check your connection.',
            status: 0
        };
    } else {
        // Error setting up request
        return {
            message: error.message || 'An unexpected error occurred',
            status: -1
        };
    }
};
