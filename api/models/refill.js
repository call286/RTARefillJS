var mongoose = require('mongoose');

var RefillSchema = new mongoose.Schema({
 refilldate : { type: Date, default: Date.now },
 atomizer   : { }
});

module.exports = mongoose.model('Refill', RefillSchema);