import api from './api';

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (email: string, password: string) => {
        const response = await api.post('/auth/register', { email, password });
        return response.data;
    },
};

export const userService = {
    getProfile: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },

    updateProfile: async (data: any) => {
        const response = await api.put('/users/me', data);
        return response.data;
    },
};

export const passportService = {
    getRankings: async () => {
        const response = await api.get('/passports');
        return response.data;
    },

    getPassportDetails: async (code: string) => {
        const response = await api.get(`/passports/${code}`);
        return response.data;
    },
};

export const countryService = {
    listCountries: async () => {
        const response = await api.get('/countries');
        return response.data;
    },

    getCountryDetails: async (code: string) => {
        const response = await api.get(`/countries/${code}`);
        return response.data;
    },

    getVisaRequirements: async (passportCode: string, countryCode: string) => {
        const response = await api.get(`/countries/visa/${passportCode}/${countryCode}`);
        return response.data;
    },
};

export const aiService = {
    planTrip: async (data: any) => {
        const response = await api.post('/ai/plan-trip', data);
        return response.data;
    },

    optimizeRoute: async (destinations: string[]) => {
        const response = await api.post('/ai/optimize-route', { destinations });
        return response.data;
    },

    getHotels: async (country: string) => {
        const response = await api.get(`/ai/hotels?country=${encodeURIComponent(country)}`);
        return response.data;
    },
};
