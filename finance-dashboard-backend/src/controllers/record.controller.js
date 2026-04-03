const FinancialRecord = require('../models/FinancialRecord');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const buildRecordFilter = (query) => {
  const filter = { isDeleted: false };

  if (query.type) {
    filter.type = query.type;
  }

  if (query.category) {
    filter.category = { $regex: query.category, $options: 'i' };
  }

  if (query.search) {
    filter.$or = [
      { category: { $regex: query.search, $options: 'i' } },
      { notes: { $regex: query.search, $options: 'i' } },
    ];
  }

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) {
      filter.date.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      filter.date.$lte = new Date(query.endDate);
    }
  }

  return filter;
};

const createRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.create({
      ...req.body,
      createdBy: req.user._id,
    });

    return successResponse(res, 201, 'Financial record created successfully', record);
  } catch (error) {
    next(error);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = buildRecordFilter(req.query);

    const [records, total] = await Promise.all([
      FinancialRecord.find(filter)
        .populate('createdBy', 'name email role')
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      FinancialRecord.countDocuments(filter),
    ]);

    return successResponse(res, 200, 'Financial records fetched successfully', {
      records,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getRecordById = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate('createdBy', 'name email role');

    if (!record) {
      return errorResponse(res, 404, 'Financial record not found');
    }

    return successResponse(res, 200, 'Financial record fetched successfully', record);
  } catch (error) {
    next(error);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return errorResponse(res, 404, 'Financial record not found');
    }

    Object.assign(record, req.body);
    await record.save();

    return successResponse(res, 200, 'Financial record updated successfully', record);
  } catch (error) {
    next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return errorResponse(res, 404, 'Financial record not found');
    }

    record.isDeleted = true;
    record.deletedAt = new Date();
    await record.save();

    return successResponse(res, 200, 'Financial record deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
