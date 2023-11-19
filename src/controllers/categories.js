export function getAllCategories(categoryService) {
    return async (req, res) => {
        const categories = await categoryService.getAll();

        return res.status(200).json({ categories });
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
        const { name } = req.body;

        const category = await categoryService.create(name);

        return res.status(201).json(category);
    };
}

export function updateCategory(categoryService) {
    return async (req, res) => {
        const { id } = req.params;
        const categoryDetails = req.body;

        // const category = await categoryService.update(id, categoryDetails);

        return res.status(200).json({ id, ...categoryDetails });
    };
}

export function deleteCategory(categoryService) {
    return async (req, res) => {
        const { id } = req.params;

        // const category = await categoryService.delete(id);

        return res.status(204).json();
    };
}
