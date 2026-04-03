const dashboardService = require('../services/dashboard.service');
const { successResponse } = require('../utils/apiResponse');

const getSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary(req.query);
    return successResponse(res, 200, 'Dashboard summary fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

const getCategoryTotals = async (req, res, next) => {
  try {
    const data = await dashboardService.getCategoryTotals(req.query);
    return successResponse(res, 200, 'Category totals fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const data = await dashboardService.getRecentActivity();
    return successResponse(res, 200, 'Recent activity fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

const getTrends = async (req, res, next) => {
  try {
    const data = await dashboardService.getTrends(req.query);
    return successResponse(res, 200, 'Trend data fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getRecentActivity,
  getTrends,
};
