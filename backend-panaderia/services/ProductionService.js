import db from '../dist/db/models/index.js';
import InventoryService from './InventoryService.js';

const addProduction = async (productionData) => {
    const {
        productName,
        measure_type,
        quantity
    } = productionData;

    if (typeof quantity !== 'number' || quantity <= 0) {
        return {
            code: 400,
            message: 'Cantidad inválida.'
        };
    }

    const product = await db.Producto.findOne({
        where: { name: productName }
    });

    if (!product) {
        return {
            code: 404,
            message: 'Producto no encontrado'
        };
    }

    const newProduction = await db.Produccion.create({
        product: product.id,
        measure_type,
        quantity
    });

    const updatedStock = product.stock + quantity;
    await db.Producto.update({ stock: updatedStock }, {
        where: { id: product.id }
    });

    const inventoryResponse = await InventoryService.addProductToInventory(product.id, quantity);
    if (inventoryResponse.code !== 200) {
        return {
            code: 500,
            message: 'Producción añadida, pero no se pudo añadir al inventario.'
        };
    }

    return {
        code: 200,
        message: `Producción añadida al inventario. Producto: ${productName}, Nuevo Stock: ${updatedStock}`
    };
};

const getProductionById = async (id) => {
    const production = await db.Produccion.findOne({
        where: { id }
    });

    if (!production) {
        return {
            code: 404,
            message: 'Producción no encontrada'
        };
    }

    return {
        code: 200,
        message: production
    };
};

const getAllProductions = async () => {
    const productions = await db.Produccion.findAll({
        include: {
            model: db.producto,
            attributes: ['name']
        }
    });

    return {
        code: 200,
        message: productions.map(production => ({
            productionId: production.id,
            productName: production.Producto.name,
            measure_type: production.measure_type,
            quantity: production.quantity,
            createdAt: production.createdAt,
        }))
    };
};

const updateProduction = async (req) => {
    const productionId = req.params.id;
    const production = await db.Produccion.findOne({
        where: { id: productionId }
    });

    if (!production) {
        return {
            code: 404,
            message: 'Producción'
        };
    }

    const payload = {
        product: req.body.product ?? production.product,
        measure_type: req.body.measure_type ?? production.measure_type,
        quantity: req.body.quantity ?? production.quantity,
    };

    await db.Produccion.update(payload, {
        where: { id: productionId }
    });

    return {
        code: 200,
        message: 'Producción no encontrada'
    };
};

const deleteProduction = async (id) => {
    try {
        const deleted = await db.Produccion.destroy({
            where: { id }
        });

        if (!deleted) {
            return { code: 404, message: 'Producción no encontrada' };
        }

        return { code: 200, message: 'Producción eliminada correctamente' };
    } catch (error) {
        throw new Error('Error al eliminar la producción: ' + error.message);
    }
};

const bulkCreateProduction = async (productionsToCreate) => {
    if (!Array.isArray(productionsToCreate)) {
        return {
            code: 400,
            message: 'Tipo de cuerpo inválido.'
        };
    }

    let successfulProductions = 0;
    let failedProductions = 0;

    for (const production of productionsToCreate) {
        try {
            const response = await addProduction(production);
            if (response.code === 200) {
                successfulProductions++;
            } else {
                failedProductions++;
            }
        } catch (error) {
            console.error('Error creando la producción:', error);
            failedProductions++;
        }
    }

    let message = 'Productiones creadas: ' + successfulProductions + '\n';
    message += 'Productiones no creadas: ' + failedProductions;

    return {
        code: 200,
        message: message,
    };
};

export default {
    addProduction,
    getProductionById,
    getAllProductions,
    updateProduction,
    deleteProduction,
    bulkCreateProduction
};
