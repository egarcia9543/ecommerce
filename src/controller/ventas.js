const producto = require('../models/productos');
const venta = require('../models/ventas');
const cliente = require('../models/clientes');
const usuario = require('../models/usuarios');
const vendedor = require('../models/vendedores');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET

exports.verificarUsuario = async (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, secret, async (err, decoded) => {        
        if (err) {
            res.redirect('/store/v1/signin');
        } else {
            const id = decoded.id;
            const infoCliente = await cliente.findById(id);
    
            res.render('compra', {
                "usuario": infoCliente
            });
        }
    })
}

exports.finalizarCompra = async (req, res) => {    
    console.log(req.body);
    const fechaVenta = new Date();
    const dia = fechaVenta.getDate(); 
    const year = fechaVenta.getFullYear(); 
    const mes = fechaVenta.getMonth() + 1;
    const fecha = `${year}-${mes}-${dia}`;
    let productosVenta = []
    try {
        let comprador = await cliente.findOne({ email: req.body.emailEnvio });
        let carrito = JSON.parse(req.body.listaDeProductos);
        carrito.forEach(producto => {
            productosVenta.push({
                id: producto.id,
                precio: parseFloat(producto.precio),
                nombre: producto.nombre,
                imagen: producto.imagen,
                cantidad: producto.cantidad
            })
        });
        const registroVenta = new venta({
            productosVenta: productosVenta,
            subtotal: req.body.subtotalVenta,
            fechaVenta: new Date(),
            impuesto: 19,
            totalVenta: (req.body.subtotalVenta * 1.19).toFixed(2),
            cliente: comprador.email,
            vendedor: 'portal@gmail.com'
        });
        await registroVenta.save();

        const vendedorVenta = await vendedor.findOne({ correo: 'portal@gmail.com' });
        vendedorVenta.ventasDespachadas.push({
            productosVenta: carrito,
            totalVenta: (req.body.subtotalVenta * 1.19).toFixed(2),
            fechaVenta: new Date(),
        })
        await vendedorVenta.save(); 

        for (let i = 0; i < carrito.length; i++) {
            let productoComprado = await producto.findOne({ _id: carrito[i].id });
            let stockRestante = productoComprado.stock -= carrito[i].cantidad;
            if (stockRestante < 1) {
                productoComprado.habilitado = false;
            }
            await productoComprado.save();
        }
        comprador.historialCompras.push(fecha);
        

        comprador.totalComprado += parseFloat(req.body.subtotalVenta);

        await comprador.save();
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'egarcia9543@misena.edu.co',
                pass: `${process.env.GPASS}`
            }
        });
    } catch (error) {
        console.log(error);
    }
}