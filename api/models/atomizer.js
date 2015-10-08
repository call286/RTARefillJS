var mongoose = require('mongoose');

var AtomizerSchema = new mongoose.Schema({
 name   : {type: String, index: { unique: true }},
 note   : String,
 volume : Number
});

module.exports = mongoose.model('Atomizer', AtomizerSchema);