import db from '../dist/db/models/index.js';

const createTransaction = async (transactionData) => {
    const { id_product, measure_type, transaction_type, price, quantity } = transactionData;

    const product = await db.Producto.findOne({ where: { id: id_product } });
    if (!product) {
        return { code: 404, message: 'Producto no encontrado' };
    }

    let updatedStock;
    if (transaction_type === 'Compra') {
        updatedStock = product.stock + quantity;
    } else if (transaction_type === 'Venta') {
        if (product.stock < quantity) {
            return { code: 400, message: 'No hay suficiente stock' };
        }
        updatedStock = product.stock - quantity;
    } else {
        return { code: 400, message: 'Tipo de transaccion invalida' };
    }

    await db.Producto.update({ stock: updatedStock }, { where: { id: id_product } });

    const newTransaction = await db.Transacciones.create({
        id_product,
        measure_type: product.measure_type,
        transaction_type,
        price: product.price,
        quantity,
    });

    return {
        code: 200,
        message: 'Transaccion creada exitosamente',
        transaction: newTransaction,
    };
};

const getTransactionById = async (id) => {
    const transaction = await db.Transacciones.findAll({
        where: { id },
        include: [
            {
                model: db.Producto,
                as: 'product',
            },
        ],
    });

    if (!transaction.length) {
        return { code: 404, message: 'Transaccion no encontrada' };
    }

    return { code: 200, message: transaction };
};

const updateTransaction = async (id, transactionData) => {
    const { id_product, measure_type, transaction_type, price, quantity } = transactionData;

    const existingTransaction = await db.Transacciones.findOne({ where: { id } });
    if (!existingTransaction) {
        return { code: 404, message: 'Transaccion no encontrada' };
    }

    const product = await db.Producto.findOne({ where: { id: id_product || existingTransaction.id_product } });
    if (!product) {
        return { code: 404, message: 'Producto no encontrado' };
    }

    const previousQuantity = existingTransaction.quantity;
    if (existingTransaction.transaction_type === 'Compra') {
        await db.Producto.update(
            { stock: product.stock - previousQuantity },
            { where: { id: product.id } }
        );
    } else if (existingTransaction.transaction_type === 'Venta') {
        await db.Producto.update(
            { stock: product.stock + previousQuantity },
            { where: { id: product.id } }
        );
    }

    let updatedStock;
    if (transaction_type === 'Compra') {
        updatedStock = product.stock + quantity;
    } else if (transaction_type === 'Venta') {
        if (product.stock < quantity) {
            return { code: 400, message: 'No hay suficiente stock' };
        }
        updatedStock = product.stock - quantity;
    } else {
        return { code: 400, message: 'Tipo de transaccion invalida' };
    }

    await db.Producto.update({ stock: updatedStock }, { where: { id: product.id } });

    await db.Transacciones.update(
        {
            id_product: id_product || existingTransaction.id_product,
            measure_type: measure_type || existingTransaction.measure_type,
            transaction_type: transaction_type || existingTransaction.transaction_type,
            price: price || existingTransaction.price,
            quantity: quantity || existingTransaction.quantity,
        },
        { where: { id } }
    );

    return { code: 200, message: 'Transaccion actualizada exitosamente' };
};

const deleteTransaction = async (id) => {
    const transaction = await db.Transacciones.findOne({ where: { id } });
    if (!transaction) {
        return { code: 404, message: 'Transaccion no encontrada' };
    }

    const product = await db.Producto.findOne({ where: { id: transaction.id_product } });
    if (transaction.transaction_type === 'Compra') {
        await db.Producto.update(
            { stock: product.stock - transaction.quantity },
            { where: { id: product.id } }
        );
    } else if (transaction.transaction_type === 'Venta') {
        await db.Producto.update(
            { stock: product.stock + transaction.quantity },
            { where: { id: product.id } }
        );
    }

    await db.Transacciones.destroy({ where: { id } });

    return { code: 200, message: 'Transaccion eliminada exitosamente' };
};

const getAllTransactions = async () => {
    const transactions = await db.Transacciones.findAll();
    return { code: 200, message: transactions };
};

const bulkCreateTransactions = async (transactions) => {
    if (!Array.isArray(transactions)) {
        return {
            code: 400,
            message: 'Invalid request body. Please provide an array of transactions.'
        };
    }

    let successfulTransactions = 0;
    let failedTransactions = 0;
    let totalTransactionPrice = 0;

    try {
        const { transaction_type } = transactions[0];
        const newTransaction = await db.Transacciones.create({
            transaction_type,
        });

        const id_transaction = newTransaction.id;

        for (const transactionData of transactions) {
            const { id_product, quantity } = transactionData;

            const product = await db.Producto.findOne({ where: { id: id_product } });
            if (!product) {
                failedTransactions++;
                continue;
            }

            let updatedStock;
            if (transaction_type === 'Compra') {
                updatedStock = product.stock + quantity;
            } else if (transaction_type === 'Venta') {
                if (product.stock < quantity) {
                    failedTransactions++;
                    continue;
                }
                updatedStock = product.stock - quantity;
            } else {
                failedTransactions++;
                continue;
            }

            await db.Producto.update({ stock: updatedStock }, { where: { id: id_product } });

            const transactionPrice = product.price * quantity;
            totalTransactionPrice += transactionPrice;

            await db.Transacciones.create({
                id_transactions: id_transaction,
                id_product,
                measure_type: product.measure_type,
                transaction_type,
                price: product.price,
                quantity,
            });

            successfulTransactions++;
        }

        await db.TransactionTotal.create({
            id_transaction,
            total: totalTransactionPrice,
        });

        return {
            code: 200,
            message: `Transactions created: ${successfulTransactions}, failed: ${failedTransactions}`,
        };
    } catch (error) {
        console.error('Error creating transactions:', error);
        return {
            code: 500,
            message: 'Error processing transactions: ' + error.message,
        };
    }
};


export default {
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getAllTransactions,
    bulkCreateTransactions,
};

