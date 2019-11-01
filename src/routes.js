/* eslint camelcase:0 */
// routes.js
const Apify = require('apify');
const tools = require('./tools');

const {
    utils: { log },
} = Apify;

process
    .on('unhandledRejection', (reason, p) => {
        log.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', (err) => {
        log.error(err, 'Uncaught Exception thrown');
    });


// Add all category pages to the request queue for pagination
exports.INITIAL_LIST = async ({ data, request }, { requestQueue }) => {
    const { itemCount } = data;
    const { url } = request;
    const { gender, categoryId, category1, category2 } = request.userData;

    const page = Math.ceil(itemCount / 48);

    log.info(`CRAWLER -- Getting paginate urls. categoryId: ${categoryId} - itemCount: ${itemCount} - pageCount: ${page}`);

    for (let index = 0; index <= page; index++) {
        const offset = index * 48;
        await requestQueue.addRequest({
            url: `${url}&offset=${offset}`,
            userData: {
                label: 'LIST',
                offset,
                gender,
                category1,
                category2,
                categoryId,
            },
        });
    }

    log.debug('CRAWLER -- Got paginated urls. Fetching lists');
};

// Add all product urls to the request queue from given paginated category
exports.LIST = async ({ data, request }, { requestQueue }) => {
    const { offset, gender, category1, category2, categoryId } = request.userData;
    log.info(`CRAWLER -- Getting products for categoryId: ${categoryId} with offset ${offset}`);
    const { products } = data;

    for (const product of products) {
        await requestQueue.addRequest({
            url: `https://api.asos.com/product/catalogue/v3/products/${product.id}?keyStoreDataversion=jqvkhhb-21&store=US&currency=USD&lang=en-US&sizeSchema=US`,
            userData: {
                label: 'PRODUCT',
                productId: product.id,
                gender,
                category1,
                category2,
            },
        }, { forefront: true });
    }

    log.debug(`CRAWLER -- Got products for ${offset}`);
};

// Create product from the response and add product group to the response queue to get pairs
exports.PRODUCT = async ({ data, request }, { requestQueue }) => {
    const { productId, category1, category2 } = request.userData;
    log.info(`CRAWLER -- Getting product details for ${productId}`);

    const product = {
        retailer: 'asos',
        lastUpdated: Date.now(),
        retailerProductId: `${productId}`,
        categoryHierarchy: [
            category1,
            category2,
        ],
        title: data.name,
        desc: tools.stripHTML(data.description),
        brand: data.brand.name,
        color: data.variants[0].colour.toLocaleLowerCase(),
        size: data.variants.map((variant) => {
            return variant.brandSize;
        }),
        retailPrice: data.price.current.value,
        images: data.media.images.map((image) => {
            return { src: `https://${image.url}` };
        }),
        url: `https://www.asos.com/prd/${productId}`,
        gender: data.gender === 'Men' ? 'male' : 'female',
        relatedProducts: {},
    };

    await requestQueue.addRequest({
        url: `https://api.asos.com/product/catalogue/v3/productgroups/ctl/${productId}?store=US&currency=USD&lang=en-US&sizeSchema=US&keyStoreDataversion=jqvkhhb-21`,
        uniqueKey: `${productId}`,
        noRetry: true,
        userData: {
            label: 'PRODUCT_GROUP',
            product,
        },
    }, { forefront: true });

    log.debug(`CRAWLER -- Got product details for ${productId}.`);
};

// Add pairs to the product and push data
exports.PRODUCT_GROUP = async ({ data, request }) => {
    const { product } = request.userData;
    log.debug(`CRAWLER -- Getting product groups for ${product.retailerProductId}`);

    const PAIR_WITH = data.products.map((p) => {
        return {
            retailerProductId: `${p.product.id}`,
            url: `https://www.asos.com/prd/${p.product.id}`,
        };
    });

    product.relatedProducts = {
        PAIR_WITH,
    };

    await Apify.pushData({ ...product });

    log.debug(`CRAWLER -- Got product groups for ${product.retailerProductId}.`);
};
