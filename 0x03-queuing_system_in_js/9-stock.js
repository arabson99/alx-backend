import express, { json, response } from 'express';
import { request } from 'http';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const port = 1245;

const client = redis.createClient();
client.get = promisify(client.get);

const listProducts = [
    {
      itemId: 1,
      itemName: 'Suitcase 250',
      price: 50,
      initialAvailableQuantity: 4,
    },
    {
      itemId: 2,
      itemName: 'Suitcase 450',
      price: 100,
      initialAvailableQuantity: 10,
    },
    {
      itemId: 3,
      itemName: 'Suitcase 650',
      price: 350,
      initialAvailableQuantity: 2,
    },
    {
      itemId: 4,
      itemName: 'Suitcase 1050',
      price: 550,
      initialAvailableQuantity: 5,
    },
  ];
  


const getItemById = (itemId) => listProducts.find((item) => item.itemId === itemId);

const reservedStockById = async (itemId, stock) => {
    await client.set(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
        const reservedStock = await client.get(`item.${itemId}`);
        return reservedStock ? parseInt(reservedStock) : 0;
};




app.get('/list_products', (request, response) => {
    response.json(listProducts);
});

app.get('/list_products/:itemId', async (request, response) => {
    const product = getItemById(Number(request.params.itemId));
    if (!product) return response.status(404).json({status: 'Product not found'});

    const currentQuantity = await getCurrentReservedStockById(product.itemId);
    response.json({
        ...product,
        currentQuantity: currentQuantity || product.initialAvailableQuantity,
    });
});


app.get('/reserve_product/:itemId', async (request, response) => {
    const product = getItemById(Number(request.params.itemId));
    if (!product) return response.status(404).json({status: 'Product not found'});

    const reservedStock = await getCurrentReservedStockById(product.itemId);
    if (reservedStock >= product.initialAvailableQuantity) {
        return response.json({ status: 'Not enough stock available', itemId: product.itemId });
    }
    
    await reservedStockById(product.itemId, reservedStock + 1);
    response.json({ status: 'Reservation confirmed', itemId: product.itemId });
});


app.listen(port);