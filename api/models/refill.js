var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var RefillSchema = new mongoose.Schema({
 refilldate : { type: Date, default: Date.now },
 atomizer   : { }
});

RefillSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Refill', RefillSchema);