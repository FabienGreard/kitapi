exports.checkOldReservation = function(engine){
  if(typeof engine.reserved[0] !== 'undefined'){
    const dateNow = new Date()
    engine.reserved.map((value, key) => {
      const doc = value._doc;
      if(new Date(doc["dateStart"]) < dateNow && new Date(doc["dateEnd"]) < dateNow){
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
