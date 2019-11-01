const Apify = require('apify');
const routes = require('./routes');

const {
    utils: { log },
} = Apify;


// Creates category URL with category id
exports.getCategoryURL = (categoryId) => {
    return `https://api.asos.com/product/search/v2/categories/${categoryId}?lang=en&currency=USD&sizeSchema=US&store=us&country=US&channel=mobile-app&keyStoreDataversion=jqvkhhb-21&limit=48&includeGroups=true`;
};

// Strips HTML tags from given text input
exports.stripHTML = (text) => {
    return text.replace(/<[^>]*>?/gm, '');
};

// Retrieves categories
exports.getSources = async () => {
    return {
        url: 'https://api.asos.com/fashion/navigation/v2/tree?keyStoreDataVersion=jqvkhhb-21&lang=en-US&country=US',
        userData: {
            label: 'CATEGORIES',
        },
    };
};

// Create router
exports.createRouter = (globalContext) => {
    return async function (routeName, requestContext) {
        const route = routes[routeName];
        if (!route) throw new Error(`No route for name: ${routeName}`);
        log.debug(`Invoking route: ${routeName}`);
        return route(requestContext, globalContext);
    };
};

// Creates proxy URL with user input
exports.createProxyUrl = () => {
    return `http://session-${Math.random()}:${process.env.APIFY_PROXY_PASSWORD}@proxy.apify.com:8000`;
};
