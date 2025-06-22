const express = require('express');
const router = express.Router();
const Category = require('../../models/category.js');

// Admin Categories Index Page (Corrected)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('Adminside/view_category.ejs', { categories }); // Corrected path
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Internal Server Error");
  }
});



// Admin Create Category Page (No changes needed)
router.get('/new', (req, res) => {
  res.render('Adminside/new_category.ejs');
});

// Admin Create Category POST Route (No changes needed)
router.post('/', async (req, res) => {
  try {
    const newCategory = new Category(req.body.category);
    await newCategory.save();
    req.flash('success', 'Category created successfully!');
    res.redirect('/category');
  } catch (error) {
    console.error("Error creating category:", error);
    req.flash('error', 'Error creating category. Please check your input.');
    res.redirect('/category');
  }
});

// Admin Edit Category Page (No changes needed)
router.get('/:id/edit', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send("Category not found");
    }
    res.render('Adminside/edit_category.ejs', { category });
  } catch (error) {
    console.error("Error fetching category for edit:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Admin Update Category PUT Route (No changes needed)
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body.category, { new: true, runValidators: true });
    if (!updatedCategory) {
      return res.status(404).send("Category not found");
    }
    req.flash('success', 'Category updated successfully!');
    res.redirect('/category');
  } catch (error) {
    console.error("Error updating category:", error);
    req.flash('error', 'Error updating category. Please check your input.');
    res.redirect(`/category/${req.params.id}/edit`);
  }
});

// Admin Delete Category Route (No changes needed)
router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    req.flash('success', 'Category deleted successfully!');
    res.redirect('/category');
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).send("Internal Server Error");
  }
});

//-----------------------------------------------------------



module.exports = router;