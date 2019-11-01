# Actor - Asos Scraper

## Asos scraper

Since Asos doesn't provide an API, this actor should help you to retrieve data from it.

The Asos data scraper supports the following features:

- Scrape product details - you can scrape attributes like images, metadata. You can find details below.

Features **not** available in this scraper:

- Scrape similar products of a single product


## Input Parameters

The input of this scraper should be JSON containing the list of pages on Asos that should be visited. Required fields are:

| Field | Type | Description |
| ----- | ---- | ----------- |
| startUrls | Array | (optional) List of Asos URLs. You should only provide category detail URLs |
| maxConcurrency | Number | (optional) Maximum concurrency that actor uses at a moment. It helps users to not getting blocked |
| proxy | Object | Proxy configuration |

This solution requires the use of **Proxy servers**, either your own proxy servers or you can use <a href="https://www.apify.com/docs/proxy">Apify Proxy</a>.


### Compute Unit Consumption
The actor optimized to run blazing fast and scrape many product as possible. Therefore, it forefronts all product detail requests. If actor doesn't block very often it'll scrape ~4,5K products in 20 minutes with ~2.0-2.5 compute units.

### Asos Scraper Input example
```json
{
	"proxy":{"useApifyProxy": true},
	"startUrls":   [
		{ "url": "https://www.asos.com/us/women/new-in/cat/?cid=27108&nlid=ww|new+in|new+products" },
    { "url": "https://www.asos.com/us/men/new-in/cat/?cid=27110&nlid=mw|new+in|new+products" }
  ],
  "maxConcurrency": 500
}

```

## During the Run

During the run, the actor will output messages letting you know what is going on. Each message always contains a short label specifying which page from the provided list is currently specified.
When items are loaded from the page, you should see a message about this event with a loaded item count and total item count for each page.

If you provide incorrect input to the actor, it will immediately stop with failure state and output an explanation of
what is wrong.

## Asos Export

During the run, the actor stores results into a dataset. Each item is a separate item in the dataset.

You can manage the results in any languague (Python, PHP, Node JS/NPM). See the FAQ or <a href="https://www.apify.com/docs/api" target="blank">our API reference</a> to learn more about getting results from this Asos actor.

## Scraped Asos Products
The structure of each item in Asos products looks like this:

```json
{
  "retailer": "asos",
  "lastUpdated": 1572616252021,
  "retailerProductId": "12812244",
  "categoryHierarchy": [
    "men",
    "new-in"
  ],
  "title": "ASOS DESIGN organic long sleeve jersey polo in khaki",
  "desc": "Polo shirt by ASOS DESIGN    Part of our responsible editPolo collar with triple-button fasteningLong sleevesRegular fitJust select your usual size",
  "brand": "ASOS DESIGN",
  "color": "lizard",
  "size": [
    "XXS",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL"
  ],
  "retailPrice": 19,
  "images": [
    {
      "src": "https://images.asos-media.com/products/asos-design-organic-long-sleeve-jersey-polo-in-khaki/12812244-1-lizard"
    },
    {
      "src": "https://images.asos-media.com/products/asos-design-organic-long-sleeve-jersey-polo-in-khaki/12812244-2"
    },
    {
      "src": "https://images.asos-media.com/products/asos-design-organic-long-sleeve-jersey-polo-in-khaki/12812244-3"
    },
    {
      "src": "https://images.asos-media.com/products/asos-design-organic-long-sleeve-jersey-polo-in-khaki/12812244-4"
    }
  ],
  "url": "https://www.asos.com/prd/12812244",
  "gender": "male",
  "relatedProducts": {
    "PAIR_WITH": [
      {
        "retailerProductId": "7917036",
        "url": "https://www.asos.com/prd/7917036"
      },
      {
        "retailerProductId": "12404966",
        "url": "https://www.asos.com/prd/12404966"
      },
      {
        "retailerProductId": "12271458",
        "url": "https://www.asos.com/prd/12271458"
      }
    ]
  }
}

```
