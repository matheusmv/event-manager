export function getAllCategories(categoryService) {
    return async (req, res) => {
        // const categories = await categoryService.getAll();

        return res.status(200).json({ categories: [] });
    };
}

export function getCategoryById(categoryService) {
    return async (req, res) => {
        const { id } = req.params;

        // const category = await categoryService.getById(id);

        return res.status(200).json({ id });
    };
}

export function createCategory(categoryService) {
    return async (req, res) => {
        const categoryDetails = req.body;

        // const category = await categoryService.create(categoryDetails);

        return res.status(201).json(categoryDetails);
    };
}

export function updateCategory(categoryService) {
    return async (req, res) => {
        const { id } = req.params;
        const categoryDetails = req.body;

        const category = await categoryService.update.findUnique({where:{id,categoryDetails},});
        if (!category){
            throw errors.notfound('category with id ${id} does not exists');
            }
    
        return res.status(200).json({ id, ...categoryDetails });
    };
}

export function deleteCategory(categoryService) {
    return async (req, res) => {
        const { id } = req.params;

        const category = await categoryService.delete.findUnique({where:{id,}})
        if(!category){
            throw Errors.notFound(`category with id ${id} does not exists`);
        }

        
        return res.status(204).json();
    };
}
