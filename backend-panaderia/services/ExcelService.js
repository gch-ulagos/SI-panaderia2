import db from '../dist/db/models/index.js';
import XLSX from 'xlsx';



const getProducts = () => {
    return db.Producto.findAll({
        include: [
            {
                model: db.Categoria,   
                attributes: ['name'],   
                required: false          
            }
        ]
    })  
    .then((productos) => {
        return productos.map(producto => {
            const productoJSON = producto.toJSON();

            
            const categoriaName = productoJSON.Categorium ? productoJSON.Categorium.name : 'Sin categoría';

            return {
                ...productoJSON,   
                category: categoriaName,  
            };
        });
    })
    .catch((err) => {
        throw new Error('Error al obtener los datos: ' + err.message);
    });
};


const getAllProducts = async () => {
    try {
        const datos = await getProducts(); 


        if (!datos || datos.length === 0) {
            return { code: 404, message: "No hay datos para exportar." };
        }

  
        const encabezados = [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Nombre' },
            { key: 'category', label: 'Categoría' },
            { key: 'brand', label: 'Marca' },
            { key: 'price', label: 'Precio' },
            { key: 'measure_type', label: 'Unidad de medida' },
            { key: 'stock', label: 'Stock' },
            { key: 'production', label: 'Es producción' },
            { key: 'createdAt', label: 'Fecha de creación' },
            { key: 'updatedAt', label: 'Fecha de actualización' },
        ];

        const datosConEncabezados = datos.map(item => {
            const nuevoItem = {};
            encabezados.forEach(encabezado => {
                nuevoItem[encabezado.label] = item[encabezado.key]; 
            });
            return nuevoItem;
        });

        const hoja = XLSX.utils.json_to_sheet(datosConEncabezados, {
            header: encabezados.map(encabezado => encabezado.label) 
        });
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

        const buffer = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' });

        return { code: 200, buffer }; 
    } catch (err) {
        console.error('Error al exportar a Excel:', err.message);
        return { code: 500, message: "Error al generar el archivo Excel." };
    }
};



const FilteredProducts = (query) => {
    const { brand, name, category, minPrice, maxPrice, minUpdatedAt, maxUpdatedAt } = query;
    const filters = {}; 

    
    if (brand) {
        filters.brand = {
            [db.Sequelize.Op.like]: `%${brand}%`, 
        };
    }

    
    if (name) {
        filters.name = {
            [db.Sequelize.Op.like]: `%${name}%`,
        };
    }

    
    if (category) {
        filters['$Categorium.name$'] = {
            [db.Sequelize.Op.like]: `%${category}%`, 
        };
    }

    
    if (minPrice || maxPrice) {
        filters.price = {};  

        
        if (minPrice) {
            filters.price[db.Sequelize.Op.gte] = minPrice; 
        }

        
        if (maxPrice) {
            filters.price[db.Sequelize.Op.lte] = maxPrice; 
        }
    }

    
    if (minUpdatedAt || maxUpdatedAt) {
        filters.updatedAt = {}; 

        
        if (minUpdatedAt) {
            
            const minDate = new Date(minUpdatedAt);
            minDate.setUTCHours(0, 0, 0, 0);  
            filters.updatedAt[db.Sequelize.Op.gte] = minDate; 
        }

        
        if (maxUpdatedAt) {
            
            const maxDate = new Date(maxUpdatedAt);
            maxDate.setUTCHours(23, 59, 59, 999);  

           
            maxDate.setUTCDate(maxDate.getUTCDate() + 1);  

            filters.updatedAt[db.Sequelize.Op.lte] = maxDate; 
        }
    }


    return db.Producto.findAll({
        where: filters, 
        include: [
            {
                model: db.Categoria, 
                attributes: ['name'], 
                as: 'Categorium', 
                required: false, 
            },
        ],
    })
        .then((productos) => {
            return productos.map((producto) => {
                const productoJSON = producto.toJSON();

                // Sustituir el ID de la categoría por su nombre
                const categoriaName = productoJSON.Categorium ? productoJSON.Categorium.name : 'Sin categoría';

                return {
                    ...productoJSON,
                    category: categoriaName, 
                };
            });
        })
        .catch((err) => {
            throw new Error('Error al obtener los datos: ' + err.message);
        });
};


















const getFilteredProducts = async (query) => {
    try {
        const datos = await FilteredProducts(query); 
        if (!datos || datos.length === 0) {
            return { code: 404, message: "No hay datos para exportar." };
        }

        const encabezados = [
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Nombre' },
            { key: 'category', label: 'Categoría' },
            { key: 'brand', label: 'Marca' },
            { key: 'price', label: 'Precio' },
            { key: 'measure_type', label: 'Unidad de medida' },
            { key: 'stock', label: 'Stock' },
            { key: 'production', label: 'Es producción' },
            { key: 'createdAt', label: 'Fecha de creación' },
            { key: 'updatedAt', label: 'Fecha de actualización' },
        ];

        const datosConEncabezados = datos.map(item => {
            const nuevoItem = {};
            encabezados.forEach(encabezado => {
                nuevoItem[encabezado.label] = item[encabezado.key]; 
            });
            return nuevoItem;
        });

        const hoja = XLSX.utils.json_to_sheet(datosConEncabezados, {
            header: encabezados.map(encabezado => encabezado.label) 
        });
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

        const buffer = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' });

        return { code: 200, buffer }; 
    } catch (err) {
        console.error('Error al exportar a Excel:', err.message);
        return { code: 500, message: "Error al generar el archivo Excel." };
    }
};


















const getProduction = () => {
    return db.Produccion.findAll({
        include: [
            {
                model: db.Producto,   
                attributes: ['name'], 
            }
        ]
    })
    .then((produccions) => {
        return produccions.map(produccion => {
            const produccionJSON = produccion.toJSON();
            return {
                ...produccionJSON, 
                product: produccionJSON.Producto.name, 
            };
        });
    })
    .catch((err) => {
        throw new Error('Error al obtener los datos: ' + err.message);
    });
};


const getAllProduccions = async () => {
    try {
        const datos = await getProduction(); 


        if (!datos || datos.length === 0) {
            return { code: 404, message: "No hay datos para exportar." };
        }

  
        const encabezados = [
            { key: 'id', label: 'ID' },
            { key: 'product', label: 'Producto' },
            { key: 'measure_type', label: 'Unidad de medida' },
            { key: 'quantity', label: 'Cantidad' },
            { key: 'createdAt', label: 'Fecha de creación' },
            { key: 'updatedAt', label: 'Fecha de actualización' },
        ];

        const datosConEncabezados = datos.map(item => {
            const nuevoItem = {};
            encabezados.forEach(encabezado => {
                nuevoItem[encabezado.label] = item[encabezado.key]; 
            });
            return nuevoItem;
        });

        const hoja = XLSX.utils.json_to_sheet(datosConEncabezados, {
            header: encabezados.map(encabezado => encabezado.label) 
        });
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

        const buffer = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' });

        return { code: 200, buffer }; 
    } catch (err) {
        console.error('Error al exportar a Excel:', err.message);
        return { code: 500, message: "Error al generar el archivo Excel." };
    }
};





const filteredProduccion = (query) => {
    const { name, minCreatedAt, maxCreatedAt } = query; 
    const filters = {};  // Objeto de filtros dinámicos

    // Si se proporciona un nombre, filtramos por el nombre del producto
    if (name) {
        filters['$Producto.name$'] = {
            [db.Sequelize.Op.like]: `%${name}%`,  // Coincidencia parcial en el nombre usando LIKE
        };
    }

    // Si se proporciona minCreatedAt, filtramos por la fecha mínima en createdAt
    if (minCreatedAt) {
        const minDate = new Date(minCreatedAt);  // Utilizamos minCreatedAt correctamente
        minDate.setUTCHours(0, 0, 0, 0);  // Establecer la hora a 00:00:00 UTC
        filters.createdAt = {
            [db.Sequelize.Op.gte]: minDate,  // Mayor o igual que minCreatedAt
        };
    }

    // Si se proporciona maxCreatedAt, filtramos por la fecha máxima en createdAt
    if (maxCreatedAt) {
        const maxDate = new Date(maxCreatedAt);  // Utilizamos maxCreatedAt correctamente
        maxDate.setUTCHours(23, 59, 59, 999);  // Establecer la hora a 23:59:59.999 UTC
        if (!filters.createdAt) filters.createdAt = {};  // Si no hay filtro previo, inicializamos el objeto
        filters.createdAt[db.Sequelize.Op.lte] = maxDate;  // Menor o igual que maxCreatedAt
    }

    // Realizamos la consulta a la base de datos
    return db.Produccion.findAll({
        where: filters,  // Aplicamos los filtros dinámicos
        include: [
            {
                model: db.Producto,  // Relación con la tabla Producto
                attributes: ['name'],  // Solo obtener el nombre del producto
            }
        ]
    })
    .then((produccions) => {
        // Mapeamos los resultados para añadir el nombre del producto
        return produccions.map(produccion => {
            const produccionJSON = produccion.toJSON();
            return {
                ...produccionJSON,
                product: produccionJSON.Producto.name,  // Devolver el nombre del producto
            };
        });
    })
    .catch((err) => {
        throw new Error('Error al obtener los datos: ' + err.message);  // Manejo de errores
    });
};




const getFilteredProduccions = async (query) => {
    try {
        const datos = await filteredProduccion(query); 


        if (!datos || datos.length === 0) {
            return { code: 404, message: "No hay datos para exportar." };
        }

  
        const encabezados = [
            { key: 'id', label: 'ID' },
            { key: 'product', label: 'Producto' },
            { key: 'measure_type', label: 'Unidad de medida' },
            { key: 'quantity', label: 'Cantidad' },
            { key: 'createdAt', label: 'Fecha de creación' },
            { key: 'updatedAt', label: 'Fecha de actualización' },
        ];

        const datosConEncabezados = datos.map(item => {
            const nuevoItem = {};
            encabezados.forEach(encabezado => {
                nuevoItem[encabezado.label] = item[encabezado.key]; 
            });
            return nuevoItem;
        });

        const hoja = XLSX.utils.json_to_sheet(datosConEncabezados, {
            header: encabezados.map(encabezado => encabezado.label) 
        });
        const libro = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(libro, hoja, 'Productos');

        const buffer = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' });

        return { code: 200, buffer }; 
    } catch (err) {
        console.error('Error al exportar a Excel:', err.message);
        return { code: 500, message: "Error al generar el archivo Excel." };
    }
};











export default {
    getAllProducts,
    getAllProduccions,
    getFilteredProducts,
    getFilteredProduccions

};