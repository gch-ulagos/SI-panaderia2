import db from '../dist/db/models/index.js';

const createCategory = async (categoryData) => {
    const {
        name,
    } = categoryData;

    const existingCategory = await db.Categoria.findOne({
        where: {
            name,
        }
    });

    if (existingCategory) {
        return {
            code: 400,
            message: 'Category already exists'
        };
    }

    const newCategory = await db.Categoria.create({
        name,
    });

    return {
        code: 200,
        message: 'Category created successfully with ID: ' + newCategory.id,
    };
};

const getAllCategories = async () => {
    const categorias = await db.Categoria.findAll();
    return {
        code: 200,
        message: categorias,
    };
};

const getCategoryById = async (id) => {
    const categoria = await db.Categoria.findOne({
        where: { id }
    });

    if (!categoria) {
        return {
            code: 404,
            message: 'Category not founded'
        };
    }

    return {
        code: 200,
        message: categoria,
    };
};

const updateCategory = async (id, categoriaData) => {
    const categoria = await db.Categoria.findOne({ where: { id } });

    if (!categoria) {
        return {
            code: 404,
            message: 'Category not founded'
        };
    }

    await db.Categoria.update(categoriaData, { where: { id } });

    return {
        code: 200,
        message: 'Category updated successfully',
    };
};

const deleteCategory = async (id) => {
    const deleted = await db.Categoria.destroy({ where: { id } });

    if (!deleted) {
        return { code: 404, message: 'Category not founded' };
    }

    return { code: 200, message: 'Category deleted successfully' };
};

export default {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};