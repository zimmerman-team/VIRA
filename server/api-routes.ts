const router = require('express').Router();
const orgController = require('./controllers/OrgController');
const projectController = require('./controllers/ProjectController');
const orgTypeController = require('./controllers/OrgTypeController');
const projectCategoryController = require('./controllers/ProjectCategoryController.ts');
const responsiblePersonController = require('./controllers/ResponsiblePersonController');
import { uploadFiles } from './utils/upload';

router.get('/', (req: any, res: any) => {
  res.json({ status: 200, message: 'api working' });
});

router.route('/organisation').get(orgController.allOrg);

router.route('/organisation/:_id').get(orgController.oneOrg);

router.route('/project').get(projectController.allProject);

router.route('/project/:_id').get(projectController.oneProject);

router.route('/org_type').get(orgTypeController.allOrgType);

router.route('/org_type/:_id').get(orgTypeController.oneOrgType);

router
  .route('/project_category')
  .get(projectCategoryController.allProjectCategory);

router
  .route('/project_category/:_id')
  .get(projectCategoryController.oneProjectCategory);

router.route('/responsible_person').get(responsiblePersonController.allPerson);

router
  .route('/responsible_person/:_id')
  .get(responsiblePersonController.onePeron);

router.route('/upload').post(uploadFiles);

module.exports = router;

export {};
