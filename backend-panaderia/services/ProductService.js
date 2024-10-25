import db from '../dist/db/models/index.js';
import InventoryService from './InventoryService.js';

const createProduct = async (productData) => {
    const {
        name,
        category,
        brand,
        price,
        measure_type,
        stock,
        production
    } = productData;

    if (typeof price !== 'number' || price <= 0) {
        return {
            code: 400,
            message: 'Invalid price. It must be a positive number.'
        };
    }

    if (typeof stock !== 'number' || stock < 0) {
        return {
            code: 400,
            message: 'Invalid stock. It cannot be negative.'
        };
    }

    const existingProduct = await db.Producto.findOne({
        where: {
            name
        }
    });

    if (existingProduct) {
        return {
            code: 400,
            message: 'Product already exists'
        };
    }

    const newProduct = await db.Producto.create({
        name,
        category,
        brand,
        price,
        measure_type,
        stock,
        production
    });

    const inventoryResponse = await InventoryService.addProductToInventory(newProduct.id, stock);
    if (inventoryResponse.code !== 200) {
        return {
            code: 500,
            message: 'Product created, but failed to add to inventory.'
        };
    }


    return {
        code: 200,
        message: 'Product created successfully with ID: ' + newProduct.id,
    };
};

const getProductById = async (id) => {
    const product = await db.Producto.findOne({
        where: {
            id: id
        }
    });

    if (!product) {
        return {
            code: 404,
            message: 'Product not found'
        };
    }

    return {
        code: 200,
        message: product
    };
};

const updateProduct = async (req) => {
    const productId = req.params.id;
    const product = await db.Producto.findOne({
        where: {
            id: productId
        }
    });

    if (!product) {
        return {
            code: 404,
            message: 'Product not found'
        };
    }

    const payload = {
        category: req.body.category ?? product.category,
        brand: req.body.brand ?? product.brand,
        price: req.body.price ?? product.price,
        measure_type: req.body.measure_type ?? product.measure_type,
        stock: req.body.stock ?? product.stock,
        production: req.body.production ?? product.production,
    };

    await db.Producto.update(payload, {
        where: {
            id: productId
        }
    });

    if (req.body.production !== undefined && req.body.production !== product.production) {
        const newSource = req.body.production ? 'Producción' : 'Compra';

        await db.Inventario.update(
            { source: newSource },
            { where: { id_product: productId } }
        );
    }

    return {
        code: 200,
        message: 'Product updated successfully'
    };
};

const deleteProduct = async (id) => {
    try {
        await db.Inventario.destroy({
            where: { id_product: id }
        });

        const deleted = await db.Producto.destroy({
            where: { id: id }
        });

        if (!deleted) {
            return { code: 404, message: 'Product not found' };
        }

        return { code: 200, message: 'Product deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting product: ' + error.message);
    }
};

const getAllProducts = async () => {
    const products = await db.Producto.findAll();
    return {
        code: 200,
        message: products
    };
};

const bulkCreate = async (productsToCreate) => {
    if (!Array.isArray(productsToCreate)) {
        return {
            code: 400,
            message: 'Invalid request body. Please provide an array of products.'
        };
    }

    let successfulProducts = 0;
    let failedProducts = 0;

    for (const product of productsToCreate) {
        try {
            const response = await createProduct(product);
            if (response.code === 200) {
                successfulProducts++;
            } else {
                failedProducts++;
            }
        } catch (error) {
            console.error('Error creating products:', error);
            failedProducts++;
        }
    }

    let message = 'Products created: ' + successfulProducts + '\n';
    message += 'Products not created: ' + failedProducts;

    return {
        code: 200,
        message: message,
    };
};

export default {
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllProducts,
    bulkCreate,
};
