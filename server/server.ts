const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const cron = require('node-cron');
const express = require('express');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const apiRouter = require('./api-routes');

const router = express.Router();
const VizController = require('./controllers/VizController');
const orgController = require('./controllers/OrgControllerSocket');
const orgTypeController = require('./controllers/OrgTypeControllerSocket');
const projectCategoryController = require('./controllers/ProjectCategoryControllerSocket');
const projectController = require('./controllers/ProjectControllerSocket');
const responsiblePersonController = require('./controllers/ResponsiblePersonControllerSocket');
const reportController = require('./controllers/ReportController');
const policyPriority = require('./controllers/PolicyPriorityControllerSocket');
const targetBeneficiary = require('./controllers/TargetBeneficiaryControllerSocket');
const location = require('./controllers/LocationControllerSocket');
const PillarController = require('./controllers/VizControllers/PillarController');
const PriorityAreaController = require('./controllers/VizControllers/PriorityAreaController');
const TargetGroupController = require('./controllers/VizControllers/TargetGroupController');
const OneMultiYearController = require('./controllers/VizControllers/OneMultiYearController');
import {
  getUser,
  getAllUsers,
  addUser,
  deleteUser,
  editUser,
  getAuth0DBConnection,
} from './controllers/AuthUserController';
import {
  getUserGroup,
  getUserGroups,
  addUserToGroup,
  getGroup,
  addGroup,
  editGroup,
  deleteGroup,
} from './controllers/AuthGroup';
import {
  getUserRole,
  getUserRoles,
  assignRoleToUser,
} from './controllers/AuthRole';
import { sendForgetPasswordEmail } from './utils/auth';
import { generalSearchSocketAPI } from './controllers/SearchController';

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);

const IO = socketIO(server);

require('dotenv').config();

IO.sockets.on('connection', (socket: any) => {
  // console.log('Client connected...');
  socket.on('testConnection', (data: any, fn: any) => {
    fn('success');
  });
  /* User */
  socket.on('getUser', (data: any, fn: any) => {
    getUser({ query: data }, (res: any) => fn(res));
  });
  socket.on('getAllUsers', (data: any, fn: any) => {
    getAllUsers({ query: data }, (res: any) => fn(res));
  });
  socket.on('addUser', (data: any, fn: any) => {
    addUser({ query: data }, (res: any) => fn(res));
  });
  socket.on('deleteUser', (data: any, fn: any) => {
    deleteUser({ query: data }, (res: any) => fn(res));
  });
  socket.on('editUser', (data: any, fn: any) => {
    editUser({ query: data }, (res: any) => fn(res));
  });
  socket.on('sendForgetPasswordEmail', (data: any, fn: any) => {
    sendForgetPasswordEmail({ query: data }, (res: any) => fn(res));
  });
  socket.on('getAuth0DBConnection', (data: any, fn: any) => {
    getAuth0DBConnection({ query: data }, (res: any) => fn(res));
  });
  /* Group */
  socket.on('getUserGroup', (data: any, fn: any) => {
    getUserGroup({ query: data }, (res: any) => fn(res));
  });
  socket.on('getUserGroups', (data: any, fn: any) => {
    getUserGroups({ query: data }, (res: any) => fn(res));
  });
  socket.on('addUserToGroup', (data: any, fn: any) => {
    addUserToGroup({ query: data }, (res: any) => fn(res));
  });
  socket.on('getGroup', (data: any, fn: any) => {
    getGroup({ query: data }, (res: any) => fn(res));
  });
  socket.on('addGroup', (data: any, fn: any) => {
    addGroup({ query: data }, (res: any) => fn(res));
  });
  socket.on('editGroup', (data: any, fn: any) => {
    editGroup({ query: data }, (res: any) => fn(res));
  });
  socket.on('deleteGroup', (data: any, fn: any) => {
    deleteGroup({ query: data }, (res: any) => fn(res));
  });
  /* Role */
  socket.on('getUserRole', (data: any, fn: any) => {
    getUserRole({ query: data }, (res: any) => fn(res));
  });
  socket.on('getUserRoles', (data: any, fn: any) => {
    getUserRoles({ query: data }, (res: any) => fn(res));
  });
  socket.on('assignRoleToUser', (data: any, fn: any) => {
    assignRoleToUser({ query: data }, (res: any) => fn(res));
  });
  /* Grantee */
  socket.on('allOrg', (data: any, fn: any) => {
    orgController.allOrg({ query: data }, (res: any) => fn(res));
  });
  socket.on('oneOrg', (data: any, fn: any) => {
    orgController.oneOrg({ query: data }, (res: any) => fn(res));
  });
  socket.on('addOrg', (data: any, fn: any) => {
    orgController.AddOrg({ query: data }, (res: any) => fn(res));
  });
  socket.on('updateOrg', (data: any, fn: any) => {
    orgController.UpdateOrg({ query: data }, (res: any) => fn(res));
  });
  socket.on('delOrg', (data: any, fn: any) => {
    orgController.DelOrg({ query: data }, (res: any) => fn(res));
  });
  socket.on('allOrgType', (data: any, fn: any) => {
    orgTypeController.allOrgType({ query: data }, (res: any) => fn(res));
  });
  socket.on('oneOrgType', (data: any, fn: any) => {
    orgTypeController.oneOrgType({ query: data }, (res: any) => fn(res));
  });
  socket.on('addOrgType', (data: any, fn: any) => {
    orgTypeController.addOrgType({ query: data }, (res: any) => fn(res));
  });
  socket.on('updateOrgType', (data: any, fn: any) => {
    orgTypeController.UpdateOrgType({ query: data }, (res: any) => fn(res));
  });
  socket.on('delOrgType', (data: any, fn: any) => {
    orgTypeController.DelOrgType({ query: data }, (res: any) => fn(res));
  });
  /* Project */
  socket.on('allProjectCategory', (data: any, fn: any) => {
    projectCategoryController.allProjectCategory({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('oneProjectCategory', (data: any, fn: any) => {
    projectCategoryController.oneProjectCategory({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('addProjectCategory', (data: any, fn: any) => {
    projectCategoryController.addProjectCategory({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('updateProjectCategory', (data: any, fn: any) => {
    projectCategoryController.UpdateProjectCategory(
      { query: data },
      (res: any) => fn(res)
    );
  });
  socket.on('delProjectCategory', (data: any, fn: any) => {
    projectCategoryController.DelProjectCategory({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('allProject', (data: any, fn: any) => {
    projectController.allProject({ query: data }, (res: any) => fn(res));
  });
  socket.on('oneProject', (data: any, fn: any) => {
    projectController.oneProject({ query: data }, (res: any) => fn(res));
  });
  socket.on('addProject', (data: any, fn: any) => {
    projectController.addProject({ query: data }, (res: any) => fn(res));
  });
  socket.on('editProject', (data: any, fn: any) => {
    projectController.editProject({ query: data }, (res: any) => fn(res));
  });
  socket.on('deleteProject', (data: any, fn: any) => {
    projectController.deleteProject({ query: data }, (res: any) => fn(res));
  });
  socket.on('delProject', (data: any, fn: any) => {
    projectController.DelProject({ query: data }, (res: any) => fn(res));
  });
  socket.on('getProjectBudgetData', (data: any, fn: any) => {
    projectController.getProjectBudgetData({ query: data }, (res: any) =>
      fn(res)
    );
  });
  /* Responsible person */
  socket.on('allPerson', (data: any, fn: any) => {
    responsiblePersonController.allPerson({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('onePerson', (data: any, fn: any) => {
    responsiblePersonController.onePeron({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('addPerson', (data: any, fn: any) => {
    responsiblePersonController.AddPerson({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('updatePerson', (data: any, fn: any) => {
    responsiblePersonController.UpdatePerson({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('delPerson', (data: any, fn: any) => {
    responsiblePersonController.DelPerson({ query: data }, (res: any) =>
      fn(res)
    );
  });
  /* Policy Priority */
  socket.on('allPolicyPriority', (data: any, fn: any) => {
    policyPriority.allPolicyPriority({ query: data }, (res: any) => fn(res));
  });
  socket.on('addPolicyPriority', (data: any, fn: any) => {
    policyPriority.addPolicyPriority({ query: data }, (res: any) => fn(res));
  });
  socket.on('onePolicyPriority', (data: any, fn: any) => {
    policyPriority.onePolicyPriority({ query: data }, (res: any) => fn(res));
  });
  socket.on('updatePolicyPriority', (data: any, fn: any) => {
    policyPriority.updatePolicyPriority({ query: data }, (res: any) => fn(res));
  });
  socket.on('delPolicyPriority', (data: any, fn: any) => {
    policyPriority.delPolicyPriority({ query: data }, (res: any) => fn(res));
  });
  /* Target Beneficiary */
  socket.on('allTargetBeneficiary', (data: any, fn: any) => {
    targetBeneficiary.allTargetBeneficiary({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('oneTargetBeneficiary', (data: any, fn: any) => {
    targetBeneficiary.oneTargetBeneficiary({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('addTargetBeneficiary', (data: any, fn: any) => {
    targetBeneficiary.addTargetBeneficiary({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('updateTargetBeneficiary', (data: any, fn: any) => {
    targetBeneficiary.updateTargetBeneficiary({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('delTargetBeneficiary', (data: any, fn: any) => {
    targetBeneficiary.delTargetBeneficiary({ query: data }, (res: any) =>
      fn(res)
    );
  });
  /* Location */
  socket.on('allLocation', (data: any, fn: any) => {
    location.allLocation({ query: data }, (res: any) => fn(res));
  });
  socket.on('oneLocation', (data: any, fn: any) => {
    location.oneLocation({ query: data }, (res: any) => fn(res));
  });
  socket.on('addLocation', (data: any, fn: any) => {
    location.addLocation({ query: data }, (res: any) => fn(res));
  });
  socket.on('updateLocation', (data: any, fn: any) => {
    location.updateLocation({ query: data }, (res: any) => fn(res));
  });
  socket.on('delLocation', (data: any, fn: any) => {
    location.delLocation({ query: data }, (res: any) => fn(res));
  });
  /* Report */
  socket.on('allReport', (data: any, fn: any) => {
    reportController.getReports({ query: data }, (res: any) => fn(res));
  });
  socket.on('getReport', (data: any, fn: any) => {
    reportController.getReport({ query: data }, (res: any) => fn(res));
  });
  socket.on('addReport', (data: any, fn: any) => {
    reportController.addReport({ query: data }, (res: any) => fn(res));
  });
  socket.on('editReport', (data: any, fn: any) => {
    reportController.editReport({ query: data }, (res: any) => fn(res));
  });
  socket.on('oneReport', (data: any, fn: any) => {
    reportController.getReport({ query: data }, (res: any) => fn(res));
  });
  socket.on('delReport', (data: any, fn: any) => {
    reportController.deleteReport({ query: data }, (res: any) => fn(res));
  });
  /* General search */
  socket.on('search', (data: any, fn: any) => {
    generalSearchSocketAPI({ query: data }, (res: any) => fn(res));
  });
  /* Viz */
  socket.on('getPolicyPriorityBarChart', (data: any, fn: any) => {
    VizController.getPolicyPriorityBarChart({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('getSDGBubbleChart', (data: any, fn: any) => {
    VizController.getSDGBubbleChart({ query: data }, (res: any) => fn(res));
  });
  socket.on('getGeoMapData', (data: any, fn: any) => {
    VizController.getGeoMapData({ query: data }, (res: any) => fn(res));
  });
  socket.on('getPillarDataByBudget', (data: any, fn: any) => {
    PillarController.getPillarDataByBudget({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('getPillarDataByDuration', (data: any, fn: any) => {
    PillarController.getPillarDataByDuration({ query: data }, (res: any) =>
      fn(res)
    );
  });
  socket.on('getPriorityAreaBarChartData', (data: any, fn: any) => {
    PriorityAreaController.getPriorityAreaBarChartData(
      { query: data },
      (res: any) => fn(res)
    );
  });
  socket.on('getTargetGroupBarChartData', (data: any, fn: any) => {
    TargetGroupController.getTargetGroupBarChartData(
      { query: data },
      (res: any) => fn(res)
    );
  });
  socket.on('getOneMultiYearBarChartData', (data: any, fn: any) => {
    OneMultiYearController.getOneMultiYearBarChartData(
      { query: data },
      (res: any) => fn(res)
    );
  });
});

mongoose.connect(process.env.REACT_APP_MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
if (!db) {
  console.log('Error connecting to database.');
} else {
  console.log('connected to database successfully.');
}

app.use('/api', apiRouter);

server.listen(process.env.REACT_APP_BACKEND_PORT, () =>
  console.log(`LISTENING ON PORT ${process.env.REACT_APP_BACKEND_PORT}`)
);

router.get('/redirectToHome', (req: any, res: any) => {
  res.redirect(`${process.env.REACT_APP_PROJECT_URL}/`);
});

// daily cron job to check project status and notify user
cron.schedule('0 0 0 * * *', () => {
  console.log('running');
  exec(
    'yarn check-notify-user-projects',
    (err: any, stdout: string, stderr: string) => {
      if (err) {
        return;
      }
      if (stdout !== '') {
        console.log(`stdout: ${stdout}`);
      }
      if (stderr !== '') {
        console.log(`stderr: ${stderr}`);
      }
    }
  );
});

app.use('/api', router);

export {};
