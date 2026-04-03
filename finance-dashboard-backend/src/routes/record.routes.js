const express = require('express');
const recordController = require('../controllers/record.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createRecordValidator,
  updateRecordValidator,
  recordFilterValidator,
} = require('../validators/record.validator');

const router = express.Router();

router.use(authMiddleware);

router.post('/', authorizeRoles('admin'), createRecordValidator, validate, recordController.createRecord);
router.get('/', authorizeRoles('analyst', 'admin'), recordFilterValidator, validate, recordController.getRecords);
router.get('/:id', authorizeRoles('analyst', 'admin'), recordController.getRecordById);
router.put('/:id', authorizeRoles('admin'), updateRecordValidator, validate, recordController.updateRecord);
router.delete('/:id', authorizeRoles('admin'), recordController.deleteRecord);

module.exports = router;
