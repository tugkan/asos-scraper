# Table of Contents
1. [Description](#description)
2. [Flow](#actor-flow)
3. [Options](#options)
4. [Notes](#notes)
4. [Sample Result](#sample-result)



<a name="description"></a>
## Description
Fetches product details from Asos from their mobile API


<a name="flow"></a>
## Flow
1) Get categories from the navigation API endpoint
2) Get paginated API requests for each categoru
3) Get products details from paginated API requests
4) Get product pairs from product groups API and push to default dataset


<a name="options"></a>
## Options
- maxConcurrency => Maximum concurrency limit that you want actor to use. Default is `500`
- minConcurrency => Minimum concurrency limit that you want actor to use. Default is `1`


<a name="sample-result"></a>
## Sample Result
```
{
  "retailer": "asos",
  "retailerProductId": "11598072",
  "categoryHierarchy": [
    "Men",
    "Accessories"
  ],
  "title": "ASOS DESIGN leather backpack in black and brown with double straps",
  "desc": "Backpack by ASOS DESIGN    For those must-carry essentialsGrab handles    Padded straps and back for comfort    Flap top with buckle fastening    Leather trimsInternal sleeve for laptop or tablet",
  "brand": "ASOS DESIGN",
  "color": "Black",
  "size": [
    "No Size"
  ],
  "retailPrice": 47.5,
  "images": [
    {
      "src": "https://images.asos-media.com/products/asos-design-leather-backpack-in-black-and-brown-with-double-straps/11598072-1-black"
    },
    {
      "src": "https://images.asos-media.com/products/asos-design-leather-backpack-in-black-and-brown-with-double-straps/11598072-2"
    },
    {
      "src": "https://images.asos-media.com/products/asos-design-leather-backpack-in-black-and-brown-with-double-straps/11598072-3"
    },
    {
      "src": "https://images.asos-media.com/products/asos-design-leather-backpack-in-black-and-brown-with-double-straps/11598072-4"
    }
  ],
  "url": "https://www.asos.com/prd/11598072",
  "gender": "Men",
  "relatedProducts": {
    "PAIR_WITH": [
      {
        "retailerProductId": 10308818,
        "url": "https://www.asos.com/prd/10308818"
      },
      {
        "retailerProductId": 9038987,
        "url": "https://www.asos.com/prd/9038987"
      },
      {
        "retailerProductId": 6509149,
        "url": "https://www.asos.com/prd/6509149"
      }
    ],
    "SIMILAR": []
  }
}

```
