import Blog from "../models/blog.model.js";

export const createBlog = async (req, res, next) => {
  try {
    const blogData = { ...req.body, author: req.user.id };

    // If file uploaded, add image path
    if (req.file) {
      blogData.image = req.file.path; // or req.file.filename for relative path
    }

    const blog = await Blog.create(blogData);
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
};
