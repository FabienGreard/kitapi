const Engine = require('../models/engine');

//= =======================================
// Engine Routes
//= =======================================

exports.create = function(req, res, next){
  // Check for registration errors
  const name = req.body.name;
  const price = req.body.price;
  const level = req.body.level || 0;

  // Return error if no email provided
  if (!name) {
    return res.status(422).send({ error: 'Veuillez nommer votre machine.'});//You must enter a name.
  }

  // Return error if no price provided
  if (!price) {
    return res.status(422).send({ error: 'Veuillez entrer un ordre de prix.'});//You must enter a price.
  }

  // Return error if no level provided
  if (!level) {
    return res.status(422).send({ error: 'Veuillez spécifier le niveau requis.'});//You must enter a level.
  }

  Engine.findOne({ name: name }, function(err, existingEngine) {
      if (err) { return next(err); }

      // If engine is not unique, return error
      if (existingEngine) {
        return res.status(422).send({ error: 'Cette machine existe déja.' });//That name is already in use.
      }

      // If name is unique create account
      let engine = new Engine({
        name: name,
        price: price,
        level: level,
      });

      engine.save(function(err, engine) {
        if (err) { return next(err); }

        //create an engine
        res.status(201).json({
          engine: engine
        });
      });
  });

};

exports.getById = function (req, res, next) {
  const engineId = req.params.id;

  if (req.engine.id.toString() !== engineId) { return res.status(401).json({ error: 'You are not authorized to view this engine profile.' }); }
  Engine.findById(engineId, (err, engine) => {
    if (err) {
      res.status(400).json({ error: 'No engine could be found for this ID.' });
      return next(err);
    }

    return res.status(200).json({ engine: engine });
  });
};

exports.getAll = function (req, res, next) {
  Engine.find((err, engines) => {
    if (err) {
      res.status(400).json({ error: 'Something gone wrong.' });
      return next(err);
    }

    return res.status(200).json({ engines: engines });
  });
};

exports.delete = function (req, res, next) {
  if(req){
    Engine.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        res.status(400).json({ error: 'Something gone wrong.' });
        return next(err);
      }

      return res.status(200).json({ msg: "done" });
    });
  }
};

exports.update = function (req, res, next) {
  if(req){
    Engine.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, engine, engineUpdate) => {
      if (err) {
        res.status(400).json({ error: 'Something gone wrong.' });
        return next(err);
      }

      return res.status(200).json({ engine: engine });
    });
  }
};

exports.reservation = function (req, res, next) {
  if(req){
    const from = req.body.from;
    const dateStart = req.body.dateStart;
    const dateEnd = req.body.dateEnd;

    Engine.findOne({ _id: req.params.id }, function(err, existingEngine) {
        if (err) { return next(err); }

        if(typeof existingEngine.reserved[0] === 'undefined'){
          existingEngine.reserved.push({
            "from": from,
            "dateStart": dateStart,
            "dateEnd": dateEnd,
          })
        }else{
          const before = existingEngine.reserved.length;

          existingEngine.reserved.map(value => {
            const doc = value._doc;
            if(new Date(doc["dateStart"]) < new Date(dateStart)){
              if(new Date(doc["dateEnd"]) <= new Date(dateStart)){
                existingEngine.reserved.push({
                  "from": from,
                  "dateStart": dateStart,
                  "dateEnd": dateEnd,
                })
              }
            }else{
              if(new Date(doc["dateStart"]) >= new Date(dateEnd)){
                existingEngine.reserved.push({
                  "from": from,
                  "dateStart": dateStart,
                  "dateEnd": dateEnd,
                })
              }
            }
          });

          if(before >= existingEngine.reserved.length){
            return res.status(400).json({ error: 'Date déjà prise.' });
          }
        }

        existingEngine.save(function(err, engine) {
          if (err) { return res.status(400).json({ error: err }); }

          //update
          res.status(201).json({
            engine: engine
          });
        });
    });
  }
};
