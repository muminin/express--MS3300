const mongoose = require('mongoose');
const chalk = require('chalk');

mongoose.connect('mongodb://localhost:27017/ytms3300', () => {
    console.log(chalk.blue('mongodb connected'));
});

module.exports = mongoose;