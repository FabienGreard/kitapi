const Record = require('../models/record');

exports.create = function(from, engine, dateStart, dateEnd){
  let record = new Record({
    "from": from,
    "engine": engine,
    "dateStart": dateStart,
    "dateEnd": dateEnd,
  });

  record.save(function(err, record) {
    if (err) { return next(err); }
  });
}

exports.getByUserId = function (req, res, next) {
  const userId = req.params.id;

  Record.find((err, records) => {
    if (err) {
      res.status(400).json({ error: 'Something gone wrong.' });
      return next(err);
    }

    let recordsUser = records.filter(record => record.from === userId);

    return res.status(200).json({ engines: enginesRecords });
  });
};

exports.update = function (req, res, next) {
  if(req){
    Record.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, record,recordUpdate) => {
      if (err) {
        res.status(400).json({ error: 'Something gone wrong.' });
        return next(err);
      }

      return res.status(200).json({ record: record });
    });
  }
};
