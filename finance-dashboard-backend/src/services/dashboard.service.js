const FinancialRecord = require('../models/FinancialRecord');

const baseMatch = (startDate, endDate) => {
  const match = { isDeleted: false };

  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  return match;
};

const getSummary = async ({ startDate, endDate }) => {
  const match = baseMatch(startDate, endDate);

  const result = await FinancialRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
      },
    },
  ]);

  const totalIncome = result.find((item) => item._id === 'income')?.total || 0;
  const totalExpenses = result.find((item) => item._id === 'expense')?.total || 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
  };
};

const getCategoryTotals = async ({ startDate, endDate }) => {
  const match = baseMatch(startDate, endDate);

  return FinancialRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          type: '$type',
          category: '$category',
        },
        total: { $sum: '$amount' },
      },
    },
    {
      $project: {
        _id: 0,
        type: '$_id.type',
        category: '$_id.category',
        total: 1,
      },
    },
    { $sort: { type: 1, total: -1 } },
  ]);
};

const getRecentActivity = async () => {
  return FinancialRecord.find({ isDeleted: false })
    .populate('createdBy', 'name email role')
    .sort({ date: -1, createdAt: -1 })
    .limit(5);
};

const getTrends = async ({ startDate, endDate, groupBy = 'month' }) => {
  const match = baseMatch(startDate, endDate);

  const format = groupBy === 'week' ? '%G-W%V' : '%Y-%m';

  return FinancialRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          period: { $dateToString: { format, date: '$date' } },
          type: '$type',
        },
        total: { $sum: '$amount' },
      },
    },
    {
      $group: {
        _id: '$_id.period',
        income: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        period: '$_id',
        income: 1,
        expense: 1,
        net: { $subtract: ['$income', '$expense'] },
      },
    },
    { $sort: { period: 1 } },
  ]);
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getRecentActivity,
  getTrends,
};
