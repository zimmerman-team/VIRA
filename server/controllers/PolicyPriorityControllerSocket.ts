const policyPriority = require('../models/policyPriority.ts');

export function allPolicyPriority(req: any, res: any) {
  policyPriority.get((err: any, policy_priority: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    } else {
      res(JSON.stringify(policy_priority));
    }
  });
}

// get one org_type

export function onePolicyPriority(req: any, res: any) {
  policyPriority.findById(req.query.id, (err: any, policy_priority: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    }
    res(JSON.stringify(policy_priority));
  });
}

// add one org

export function addPolicyPriority(req: any, res: any) {
  let policy_priority = new policyPriority();

  policy_priority.name = req.query.name;
  policy_priority.save((err: any, policy_priority: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    }

    res(
      JSON.stringify({
        message: 'new policy priority type created.',
        data: policy_priority,
      })
    );
  });
}

//update

export function updatePolicyPriority(req: any, res: any) {
  policyPriority.findById(
    req.query.id,
    (err: any, found_policyPriority: any) => {
      if (err) {
        res.json(err);
      } else if (found_policyPriority) {
        found_policyPriority.name = req.query.name;
        found_policyPriority.save((err: any) => {
          if (err) {
            res(JSON.stringify({ status: 'error', message: err.message }));
          }

          res(
            JSON.stringify({ status: 'success', data: found_policyPriority })
          );
        });
      } else {
        res(
          JSON.stringify({
            status: 'fale',
            message: 'organisation type not found',
          })
        );
      }
    }
  );
}

//delete

export function delPolicyPriority(req: any, res: any) {
  policyPriority.deleteOne(
    {
      _id: req.query.id,
    },
    (err: any, policy_priority: any) => {
      if (err) {
        res(JSON.stringify({ status: 'error', message: err.message }));
      } else {
        res(
          JSON.stringify({
            status:
              policy_priority.deletedCount +
              'policy priority successfully deleted',
            message: policy_priority,
          })
        );
      }
    }
  );
}
