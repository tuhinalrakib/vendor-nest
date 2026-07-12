const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_HOST || "http://127.0.0.1:8000"

export const API_ENDPOINTS = {
    SIGNUP: `${BACKEND_API}/api/users/register/`,
    LOGIN: `${BACKEND_API}/api/users/login/`,
    LOGOUT: `${BACKEND_API}/api/users/logout/`,
    REFRESH: `${BACKEND_API}/api/users/token/refresh/`,

    // categories
    CATEGORY : `${BACKEND_API}/api/categories/`,

    // seller
    SELLER_PROFILE: `${BACKEND_API}/api/sellers/profile/`,

    // cart
    CART: `${BACKEND_API}/api/products/cart/`,
}