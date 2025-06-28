const { isValidObjectId } = require("mongoose")

const categoryModel = require("./category.model");
const categoryValidator = require("../validators/category");


exports.addCategory = async (req, res) => {
    const validationResult = categoryValidator(req.body);
    if (validationResult !== true) {
        return res.status(422).json(validationResult)
    }

    const { title, href, isSubCategory, mainCategory } = req.body;

    const similarCategory = await categoryModel.findOne({ title })
    if (similarCategory) {
        return res.status(409).json({ message: "There is a category with this title" })
    }

    if (isSubCategory && mainCategory) {
        const categoryExist = await categoryModel.findById(mainCategory)
        if (!categoryExist) {
            return res.status(404).json({ message: "Main category not found!" })
        }
    }

    if (isSubCategory && !mainCategory) {
        return res.status(422).json({ message: "Main category is required" })
    }

    await categoryModel.create({
        title,
        href,
        isSubCategory,
        mainCategory
    });

    res.status(201).json({ message: "New category added successfully" })
}

exports.allCategories = async (req, res) => {
    const categories = await categoryModel.find({})
        .populate("mainCategory", "title").lean()

    res.json(categories);
}

exports.editCategory = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(422).json({ message: "User id is not valid!" })
    }

    const categoryExist = await categoryModel.findById(id)
    if (!categoryExist) {
        return res.status(404).json({ message: "Category not found!" })
    }

    const { title, href, isSubCategory, mainCategory } = req.body;

    const similarCategory = await categoryModel.findOne({ title })
    if (similarCategory) {
        return res.status(409).json({ message: "There is a category with this title" })
    }

    if (isSubCategory && mainCategory) {
        const categoryExist = await categoryModel.findById(mainCategory)
        if (!categoryExist) {
            return res.status(404).json({ message: "Main category not found!" })
        }
    }

    if (isSubCategory && !mainCategory) {
        return res.status(422).json({ message: "Main category is required" })
    }

    await categoryModel.findByIdAndUpdate(id, {
        $set: { href }
    })
    // await categoryModel.findByIdAndUpdate(id, {
    //     title,
    //     href,
    //     isSubCategory,
    //     mainCategory
    // })

    res.json({ message: "Category updated successfully" })
}

exports.removeCategory = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(422).json({ message: "User id is not valid!" })
    }

    const categoryExist = await categoryModel.findByIdAndDelete(id)
    if (!categoryExist) {
        return res.status(404).json({ message: "Category not found!" })
    }

    res.json({ message: "Category removed successfully" })
}
