const Location = require('../models/location');

export function allLocation(req: any, res: any) {
  Location.get((err: any, location: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    } else {
      res(JSON.stringify(location));
    }
  });
}

// get one org_type

export function oneLocation(req: any, res: any) {
  Location.findById(req.query.id, (err: any, location: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    }
    res(JSON.stringify(location));
  });
}

// add one org

export function addLocation(req: any, res: any) {
  const location = new Location();

  location.lat = req.query.lat;
  location.long = req.query.long;
  location.save((err: any, loc: any) => {
    if (err) {
      res(JSON.stringify({ status: 'error', message: err.message }));
    }

    res(
      JSON.stringify({
        message: 'new location created.',
        data: loc,
      })
    );
  });
}

//update

export function updateLocation(req: any, res: any) {
  Location.findById(req.query.id, (err: any, found_location: any) => {
    if (err) {
      res.json(err);
    } else if (found_location) {
      found_location.lat = req.query.lat;
      found_location.long = req.query.long;
      found_location.save((err2: any) => {
        if (err2) {
          res(JSON.stringify({ status: 'error', message: err2.message }));
        }

        res(JSON.stringify({ status: 'success', data: location }));
      });
    } else {
      res(
        JSON.stringify({
          status: 'fail',
          message: 'location not found',
        })
      );
    }
  });
}

//delete

export function delLocation(req: any, res: any) {
  Location.deleteOne(
    {
      _id: req.query.id,
    },
    (err: any, location: any) => {
      if (err) {
        res(JSON.stringify({ status: 'error', message: err.message }));
      } else {
        res(
          JSON.stringify({
            status: `${location.deletedCount} location successfully deleted`,
            message: location,
          })
        );
      }
    }
  );
}
