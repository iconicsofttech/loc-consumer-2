let _db;
module.exports = {
    connectToServer: function (callback) {
        return callback("mock");
    },
    getDb: function () {
        return _db;
    }
};