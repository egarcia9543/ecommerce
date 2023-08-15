const createSellerUsecase = require('../usecases/Vendedor/create');
const listSellerUsecase = require('../usecases/Vendedor/list');
const updateSellerUsecase = require('../usecases/Vendedor/update');
const deleteSelerUsecase = require('../usecases/Vendedor/delete');

exports.renderSignupForm = (req, res) => {
    res.render('admin/formularioRegistroVendedor');
}

exports.registerNewSeller = async (req, res) => {
    try {
        const resultado = await createSellerUsecase.createNewSeller(req.body);
        if (resultado.error){
            return res.status(400).json({
                error: resultado.error
            });
        }
        return res.redirect('/store/v1/datatablevendedores');
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error al registrar el vendedor'
        });
    }
}

exports.listSellers = async (req, res) => {
    try {
        const resultado = await listSellerUsecase.listAllSellers();
        return res.render('admin/listOfWorkers', {
            'vendedores': resultado
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error al listar los vendedores'
        });
    }
}

exports.updateSellerInfo = async (req, res) => {
    try {
        const resultado = await updateSellerUsecase.updateSeller(req.body);
        if (!resultado){
            return res.status(400).json({
                error: resultado.error
            });
        }
        return res.redirect('/store/v1/datatablevendedores');
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error al actualizar el vendedor'
        });
    }
}

exports.deleteSeller = async (req, res) => {
    try {
        await deleteSelerUsecase.deleteSeller(req.params.id);
        return res.redirect('/store/v1/datatablevendedores');
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error al eliminar el vendedor'
        });
    }
}