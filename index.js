const fs = require('fs')
const express = require('express')
const app = express()
const puerto = 8080

class Contenedor {
	constructor(nombreArchivo) {
		this.nombreArchivo = nombreArchivo
	}

	async save(objeto) {
		let data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
		if (!data) {
			objeto.id = 1
			const arr = [objeto]
			await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(arr))
			return objeto.id
		} else {
			data = JSON.parse(data)
			objeto.id = data.length + 1
			data.push(objeto)
			await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(data))
			return objeto.id
		}
	}

	async getAll() {
		try {
			let data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
			data = JSON.parse(data)

			return data
		} catch {
			console.log('Error de lectura de producto')
		}
	}

	async getRandom() {
		try {
			let dataAlea = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
			dataAlea = JSON.parse(dataAlea)
			const productoAlea = dataAlea[Math.floor(Math.random() * dataAlea.length)]

			return productoAlea
		} catch {
			console.log('Error de lectura en random')
		}
	}
}

const productos = new Contenedor('./productos')

const listaDeProductos = async (req, res) => {
	const respuesta = await productos.getAll()
	res.send(respuesta)
}

const productoAleatorio = async (req, res) => {
	const respuesta = await productos.getRandom()
	res.send(respuesta)
}

app.get('./productos', listaDeProductos)
app.get('./productoAleatorio', productoAleatorio)

app.listen(puerto, () => {
	console.log('Servidor sirviendo')
})