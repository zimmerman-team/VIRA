const targetBeneficiary = require('../models/targetBeneficiary');

export function allTargetBeneficiary(req: any, res: any) {
  targetBeneficiary.get((err: any, target_beneficiary: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    } else {
      res(JSON.stringify(target_beneficiary));
    }
  });
}

// get one org_type

export function oneTargetBeneficiary(req: any, res: any) {
  targetBeneficiary.findById(
    req.query.id,
    (err: any, target_beneficiary: any) => {
      if (err) {
        res(JSON.stringify({ status: 'error', message: err.message }));
      }
      res(JSON.stringify(target_beneficiary));
    }
  );
}

// add one org

export function addTargetBeneficiary(req: any, res: any) {
  let target_beneficiary = new targetBeneficiary();

  target_beneficiary.name = req.query.name;
  target_beneficiary.value = req.query.value;
  target_beneficiary.save((err: any, target_beneficiary: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    }

    res(
      JSON.stringify({
        message: 'new target_beneficiary type created.',
        data: target_beneficiary,
      })
    );
  });
}

//update

export function updateTargetBeneficiary(req: any, res: any) {
  targetBeneficiary.findById(
    req.query.id,
    (err: any, found_targetBeneficiary: any) => {
      if (err) {
        res.json(err);
      } else if (found_targetBeneficiary) {
        found_targetBeneficiary.name = req.query.name;
        found_targetBeneficiary.value = req.query.value;
        found_targetBeneficiary.save((err: any) => {
          if (err) {
            res(JSON.stringify({ status: 'error', message: err.message }));
          }

          res(
            JSON.stringify({ status: 'success', data: found_targetBeneficiary })
          );
        });
      } else {
        res(
          JSON.stringify({
            status: 'fail',
            message: 'target beneficiary not found',
          })
        );
      }
    }
  );
}

//delete

export function delTargetBeneficiary(req: any, res: any) {
  targetBeneficiary.deleteOne(
    {
      _id: req.query.id,
    },
    (err: any, target_beneficiary: any) => {
      if (err) {
        res(JSON.stringify({ status: 'error', message: err.message }));
      } else {
        res(
          JSON.stringify({
            status:
              target_beneficiary.deletedCount +
              'policy priority successfully deleted',
            message: target_beneficiary,
          })
        );
      }
    }
  );
}
