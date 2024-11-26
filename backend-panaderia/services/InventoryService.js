import db from '../dist/db/models/index.js';

const addProductToInventory = async (productId, stock, production = true) => {
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
            message: 'Producto añadido al inventario correctamente.'
        };
    } catch (error) {
        console.error('Error al añadir producto al inventario:', error);
        return {
            code: 500,
            message: 'Error al añadir producto al inventario.'
        };
    }
};

const getInventory = async () => {
    try {
        const inventory = await db.Inventario.findAll();
        return {
            code: 200,
            message: inventory
        };
    } catch (error) {
        console.error('Error al obtener inventario:', error);
        return {
            code: 500,
            message: 'Error al obtener inventario.'
        };
    }
};

export default {
    addProductToInventory,
    getInventory
};
