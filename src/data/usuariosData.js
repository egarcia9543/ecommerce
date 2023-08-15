const usuarios = require('../models/usuarios');

exports.createUser = async (userData) => {
    return await usuarios.create(userData);
}

exports.findByEmail = async (email) => {
    return await usuarios.findOne({email});
}

exports.findByEmailAndUpdate = async (email, userData) => {
    return await usuarios.findOneAndUpdate({email}, userData);
}

exports.deleteByEmail = async (email) => {
    return await usuarios.findOneAndDelete({email});
}