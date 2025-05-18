const xlsx = require("xlsx");
const fs = require("fs");
const CourseGrades = require("../database/models/CourseGrades"); // Adjust path as needed
const { validateExcelStructure } = require("../utils/excelValidation"); // Optional helper
const { publishGradeData } = require("../services/messagePublisher");

const processInitialGradesFile = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: only instructors can upload grades",
      });
    }

    // Validate request
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dataString = req.body.data;
    const jsonData = JSON.parse(dataString);
    const { courseName, term, numberOfGrades } = jsonData;
    if (!courseName || !term || !numberOfGrades) {
      return res.status(400).json({
        error: "Missing required fields: courseName, term, or numberOfGrades",
      });
    }

    // Parse Excel file using SheetJS
    let workbook;
    try {
      workbook = xlsx.readFile(req.file.path);
    } catch (error) {
      return res.status(400).json({ error: "Invalid Excel file format" });
    } finally {
      // Clean up the uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    // First check if final grades exist
    const grades = await CourseGrades.findOne({
      instructorId: req.user.id,
      courseName,
      term,
      status: "closed",
    });

    if (grades) {
      return res.status(400).json({
        error: "Initial grades cannot be submitted after final grades",
      });
    }

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Validate Excel structure
    const validationError = validateExcelStructure(
      data,
      courseName,
      term,
      numberOfGrades
    );
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Prepare student grades
    const studentGrades = [];

    for (let i = 3; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue; // Skip empty rows

      const studentId = row[0].toString();
      const totalGrade = parseFloat(row[6]);

      // Extract grades by question (columns I to R, index 8 to 17)
      const gradeByQuestion = row
        .slice(8, 8 + parseInt(numberOfGrades))
        .map(Number);

      studentGrades.push({
        studentId,
        totalGrade,
        gradeByQuestion,
      });
    }

    // Create or update course grades document
    const existingGrades = await CourseGrades.findOne({
      instructorId: req.user.id,
      courseName,
      term,
    });

    const gradesData = {
      instructorId: req.user.id,
      courseName,
      term,
      initialSubmissionDate: new Date(),
      status: "open",
      studentGrades,
    };

    let result;
    if (existingGrades) {
      result = await CourseGrades.findOneAndUpdate(
        { _id: existingGrades._id },
        gradesData,
        { new: true }
      );
    } else {
      result = await CourseGrades.create(gradesData);
    }

    // Publish to RabbitMQ for other services
    await publishGradeData(gradesData);

    res.status(201).json({
      message: "Grades processed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error processing grades:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

const processFinalGradesFile = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: only instructors can upload grades",
      });
    }

    // Validate request
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dataString = req.body.data;
    const jsonData = JSON.parse(dataString);
    const { courseName, term, numberOfGrades } = jsonData;
    if (!courseName || !term || !numberOfGrades) {
      return res.status(400).json({
        error: "Missing required fields: courseName, term, or numberOfGrades",
      });
    }

    // Parse Excel file using SheetJS
    let workbook;
    try {
      workbook = xlsx.readFile(req.file.path);
    } catch (error) {
      return res.status(400).json({ error: "Invalid Excel file format" });
    } finally {
      // Clean up the uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    // First check if final grades exist
    const finalGrades = await CourseGrades.findOne({
      instructorId: req.user.id,
      courseName,
      term,
      status: "closed",
    });

    if (finalGrades) {
      return res.status(400).json({
        error: "Final grades have arleady been submitted",
      });
    }

    // Second check if initial grades exist
    const initialGrades = await CourseGrades.findOne({
      instructorId: req.user.id,
      courseName,
      term,
      status: "open",
    });

    if (!initialGrades) {
      return res.status(400).json({
        error: "Initial grades must be submitted before final grades",
      });
    }

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Validate Excel structure
    const validationError = validateExcelStructure(
      data,
      courseName,
      term,
      numberOfGrades
    );
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Prepare student grades
    const studentGrades = [];

    for (let i = 3; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue; // Skip empty rows

      const studentId = row[0].toString();
      const totalGrade = parseFloat(row[6]);

      // Extract grades by question (columns I to R, index 8 to 17)
      const gradeByQuestion = row
        .slice(8, 8 + parseInt(numberOfGrades))
        .map(Number);

      studentGrades.push({
        studentId,
        totalGrade,
        gradeByQuestion,
      });
    }

    const gradesData = {
      instructorId: req.user.id,
      courseName,
      term,
      initialSubmissionDate: initialGrades.initialSubmissionDate,
      finalSubmissionDate: new Date(),
      status: "closed",
      studentGrades,
    };

    // Create or update course grades document
    const existingGrades = await CourseGrades.findOne({
      instructorId: req.user.id,
      courseName,
      term,
      status: "closed",
    });

    let result;
    if (existingGrades) {
      result = await CourseGrades.findOneAndUpdate(
        { _id: existingGrades._id },
        gradesData,
        { new: true }
      );
    } else {
      result = await CourseGrades.create(gradesData);
    }

    // Delete the initial grades after successfully creating/updating final grades
    await CourseGrades.deleteOne({
      _id: initialGrades._id,
    });

    // Publish to RabbitMQ for other services
    await publishGradeData(gradesData);

    res.status(201).json({
      message: "Grades processed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error processing grades:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

module.exports = {
  processInitialGradesFile,
  processFinalGradesFile,
};
