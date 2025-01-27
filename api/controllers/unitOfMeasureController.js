import asyncHandler from '../middleware/asyncHandler.js';
import UnitOfMeasure from '../models/unitOfMeasureModel.js';
import isValidUnit from '../models/modelsValidation/MeasureUnitsValidation.js';



// @desc    Fetch all Units Of Measure
// @route   GET /unitsOfMeasure/
// @access  Admin
const getUnitsOfMeasure = asyncHandler(async (req, res) => {
  const UnitsOfMeasure = await UnitOfMeasure.find({});
  res.json(UnitsOfMeasure);
});


// @desc    Create an Unit Of Measure
// @route   POST /unitsOfMeasure
// @access  Admin
const createUnitOfMeasure = asyncHandler(async (req, res) => {
  const unitOfMeasure = await UnitOfMeasure.create({
    name_he: "יחידת מידה חדשה",
    name_en: "New",
  });
  const newUnitOfMeasure = await unitOfMeasure.save();
  res.status(201).json(newUnitOfMeasure);
});


// @desc    Update an Unit Of Measure
// @route   PUT /unitsOfMeasure/:id
// @access  Admin
const updateUnitOfMeasure = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id || !req.body) {
    res.status(400);
    throw new Error("Invalid request");
  }
  // Find the Unit Of Measure
  const unitOfMeasure = await UnitOfMeasure.findById(req.params.id);

  if (!unitOfMeasure) {
    res.status(404);
    throw new Error("No unit Of Measure found");
  }
  // Check validation
  if (isValidUnit(req.body)) {
    // Unit Of Measure's fields
    for (let key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        // Unit Of Measure's fields validation
        if (req.body[key] == "" || (typeof req.body[key] === 'string' && req.body[key].trim() == "")) {
          res.status(400);
          throw new Error(`Invalid ${key}`);
        }
        const value = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
        unitOfMeasure[key] = value;
      }
    }

  }

  const updatedUnitOfMeasure = await unitOfMeasure.save();
  res.status(201).json(updatedUnitOfMeasure);
});

// @desc    Get an Unit Of Measure by Id
// @route   GET /unitsOfMeasure/:id
// @access  Admin
const getUnitOfMeasureById = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  const unitOfMeasure = await UnitOfMeasure.findById(req.params.id);
  if (!unitOfMeasure) {
    res.status(404);
    throw new Error("Unit Of Measure not found");
  }
  res.status(201).json(unitOfMeasure);
});

// @desc    Delete an Unit Of Measure
// @route   DELETE /unitsOfMeasure/:id
// @access  Admin
const deleteUnitsOfMeasure = asyncHandler(async (req, res) => {
  // Request validation
  if (!req.params || !req.params.id) {
    res.status(400);
    throw new Error("Invalid request");
  }
  await UnitOfMeasure.deleteOne({ _id: req.params.id });
  res.json({ message: "unit Of Measure removed" });
});




export {
  getUnitsOfMeasure,
  createUnitOfMeasure,
  updateUnitOfMeasure,
  getUnitOfMeasureById,
  deleteUnitsOfMeasure
};