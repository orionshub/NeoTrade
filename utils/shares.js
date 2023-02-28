const shares = require("../data/shares.json");

const getShareData = shareName => {
    const share = shares.find(share => share.name.toLowerCase() === shareName.toLowerCase());
    if (!share) {
        return null;
    }
    return share;
};

module.exports = {
    getShareData
};
