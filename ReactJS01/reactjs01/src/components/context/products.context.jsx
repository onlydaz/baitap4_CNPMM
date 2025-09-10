import { createContext, useContext, useState } from 'react';

export const ProductsContext = createContext({
    products: [],
    categories: [],
    loading: false,
    pagination: {},
    searchQuery: '',
    selectedCategory: null,
    setProducts: () => {},
    setCategories: () => {},
    setLoading: () => {},
    setPagination: () => {},
    setSearchQuery: () => {},
    setSelectedCategory: () => {}
});

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <ProductsContext.Provider value={{
            products,
            categories,
            loading,
            pagination,
            searchQuery,
            selectedCategory,
            setProducts,
            setCategories,
            setLoading,
            setPagination,
            setSearchQuery,
            setSelectedCategory
        }}>
            {children}
        </ProductsContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
};
