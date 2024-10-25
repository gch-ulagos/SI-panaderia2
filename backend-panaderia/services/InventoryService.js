import db from '../dist/db/models/index.js';

const addProductToInventory = async (productId, stock) => {
    try {
        const source = production ? 'Producción' : 'Compra';

        await db.Inventario.create({
            id_product: productId,
            source: source,
            stock: stock,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return {
            code: 200,
            message: 'Product added to inventory successfully.'
        };
    } catch (error) {
        console.error('Error adding product to inventory:', error);
        return {
            code: 500,
            message: 'Error adding product to inventory.'
        };
    }
}

const getInventory = async () => {
    const inventory = await db.Inventario.findAll();
    return {
        code: 200,
        message: inventory
    };
};

export default {
    addProductToInventory,
    getInventory
}