import { transform } from '@babel/core';
import db from '../dist/db/models/index.js';

const createTransaction = async (transactionData) => {
    const { id_product, transaction_type, quantity } = transactionData;

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
        transaction_type,
        price: product.price,
        quantity,
    });

    const transactionWithProduct = {
        ...newTransaction.toJSON(),
        product: product.toJSON(),
    };

    return {
        code: 200,
        message: 'Transaccion creada exitosamente',
        transaction: transactionWithProduct,
    };
};

const getTransactionById = async (id) => {
    const transaction = await db.Transacciones.findAll({
        where: { id_transactions: id },
        include: [
            {
                model: db.Producto,
                as: 'product',
            },
        ],
    });

    const transactionTotal = await db.TransactionTotal.findAll({
        where: { id_transaction: id },
    });

    if (!transaction.length) {
        return { code: 404, message: 'Transaccion no encontrada' };
    }

    return { 
        code: 200, 
        message: {
            transaction,
            transactionTotal,
        },
    };
};

const getGhostTransactions = async () => {
    const transaction = await db.Transacciones.findAll({
        where: { price: null },
    });

    const transactionTotals = await db.TransactionTotal.findAll({
        where: {
            id_transaction: transaction.map((t) => t.id),
        },
    });

    if (!transaction.length) {
        return { code: 404, message: 'Transaccion no encontrada' };
    }

    return { code: 200, message: {transaction: transaction,
        transactionTotals: transactionTotals
    }
    };
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
    try {
        const transaction = await db.Transacciones.findOne({ where: { id } });

        if (!transaction) {
            return { code: 404, message: 'Transaccion no encontrada' };
        }

        const product = await db.Producto.findOne({ where: { id: transaction.id_product } });

        if (!product) {
            return { code: 404, message: 'Producto asociado a la transaccion no encontrado' };
        }

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
    } catch (error) {
        console.error('Error al eliminar la transaccion:', error);
        return { code: 500, message: 'Error interno del servidor' };
    }
};


const getAllTransactions = async () => {
    try {
        const ghostTransactions = await db.Transacciones.findAll({
            where: {
                price: null,
            },
            include: [
                {
                    model: db.Producto,
                    as: 'product',
                },
            ],
        });

        if (!ghostTransactions.length) {
            return { code: 404, message: 'No se encontraron transacciones fantasmas' };
        }

        const realTransactions = [];
        for (let ghost of ghostTransactions) {
            const realTransaction = await db.Transacciones.findAll({
                where: {
                    id_transactions: ghost.id,
                },
                include: [
                    {
                        model: db.Producto,
                        as: 'product',
                    },
                ],
            });

            if (realTransaction.length) {
                realTransactions.push(...realTransaction);
            }
        }

        return { code: 200, message: realTransactions };
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return { code: 500, message: 'Error fetching transactions' };
    }
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
    getGhostTransactions,
};

