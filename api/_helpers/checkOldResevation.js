const Record = require('../models/record');

exports.checkOldResevation = function(engine){
  if(typeof engine.reserved[0] !== 'undefined'){
    const dateNow = new Date()
    engine.reserved.map((value, key) => {
      const doc = value._doc;
      if(new Date(doc["dateStart"]) < dateNow && new Date(doc["dateEnd"]) < dateNow){
        const record = new Record(value._doc);
        record.save(function(err, record) {
          if (err) { return next(err); }
        });
        //clean
        engine.reserved.splice(key, 1);
      }
    })
    //console.log(engine);
    engine.save(function(err, engine) {
      if (err) {  return next(err); }
      return engine;
    });
  }
  return engine;
}
