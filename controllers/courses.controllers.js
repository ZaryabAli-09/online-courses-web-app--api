import { Category } from "../models/category.model.js";
import { Courses } from "../models/course.model.js";

const createCourse = async (req, res) => {
  try {
    let {
      title,
      category_id,
      description,
      price,
      sortBy,
      activate,
      isPopular,
      preRequisites,
    } = req.body;
    if (
      !title ||
      title === "" ||
      !category_id ||
      category_id === "" ||
      !description ||
      description === "" ||
      !price ||
      price === ""
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const isCategoryTrue = await Category.findById(category_id);

    if (!isCategoryTrue) {
      return res.status(400).json({
        message: "Invalid category id",
      });
    }
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    // this piece of code will give the maximum sorting value that courses category have
    const maxSortValue = await Courses.findOne()
      .sort({ sortBy: -1 })
      .select("sortBy");

    // adding 10 to the maximum sortBy value
    if (maxSortValue) {
      sortBy = maxSortValue.sortBy + 10;
    } else {
      sortBy = 10;
    }

    const savedCourse = Courses({
      title: trimmedTitle,
      category_id,
      description: trimmedDescription,
      sortBy,
      activate,
      isPopular,
      price,
      preRequisites,
    });

    await savedCourse.save();

    res.status(200).json({
      Course: savedCourse,
      message: "Course successfully created",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getCourse = async (req, res) => {
  try {
    const courses = await Courses.find({
      ...(req.query.popular && { isPopular: req.query.popular }),
    });
    const totalCourses = await Courses.countDocuments();

    return res.status(200).json({
      courses: courses,
      totalCourses: totalCourses,
      message: "Successfully get all courses",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getSpecificCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "We don't have this course.",
      });
    }
    res.status(200).json({
      course: course,
      message: "Successfully get specific course",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      title,
      description,
      sortBy,
      activate,
      isPopular,
      price,
      preRequisites,
    } = req.body;

    const updatedCourse = await Courses.findByIdAndUpdate(
      courseId,
      {
        $set: {
          title,
          description,
          sortBy,
          activate,
          isPopular,
          price,
          preRequisites,
        },
      },
      { new: true }
    );
    if (!updateCourse) {
      return res.status(404).json({
        message: "We don't have this course.",
      });
    }
    res.status(200).json({
      updatedCourse: updatedCourse,
      message: "Course updated successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteCourse = async (req, res) => {
  const { courseId } = req.params;

  const deletedCourse = await Courses.findByIdAndDelete(courseId);
  if (!deletedCourse) {
    return res.status(404).json({
      message: "We don't have this course.",
    });
  }
  res.status(200).json({
    deletedCourse: deletedCourse,
    message: "Course deleted successfully",
  });
};
export {
  createCourse,
  getCourse,
  getSpecificCourse,
  updateCourse,
  deleteCourse,
};