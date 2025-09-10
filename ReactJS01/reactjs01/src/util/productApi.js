import axios from './axios.customize';

// Categories API
export const getCategoriesApi = () => {
    const URL_API = "/v1/api/categories";
    return axios.get(URL_API);
};

export const getCategoryByIdApi = (id) => {
    const URL_API = `/v1/api/categories/${id}`;
    return axios.get(URL_API);
};

// Products API
export const getProductsApi = (categoryId, page = 1, limit = 10, search = '') => {
    const URL_API = "/v1/api/products";
    const params = {
        page,
        limit,
        ...(categoryId && { category_id: categoryId }),
        ...(search && { search })
    };
    return axios.get(URL_API, { params });
};

export const getProductByIdApi = (id) => {
    const URL_API = `/v1/api/products/${id}`;
    return axios.get(URL_API);
};

export const searchProductsApi = (query, page = 1, limit = 10) => {
    const URL_API = "/v1/api/products/search";
    const params = { q: query, page, limit };
    return axios.get(URL_API, { params });
};

export const createProductApi = (productData) => {
    const URL_API = "/v1/api/products";
    return axios.post(URL_API, productData);
};
