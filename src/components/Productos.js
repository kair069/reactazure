import React, { Component } from 'react';
import axios from 'axios';

class Productos extends Component {
  state = {
    productos: [],
    nuevoProducto: {
      nombre: '',
      descripcion: '',
      precio: 0,
    },
    
    productoAEditar: null,
    
  };

  componentDidMount() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    // Realiza una solicitud GET al servidor para obtener la lista de productos
    axios.get('http://localhost:5000/productos')
      .then((response) => {
        // Actualiza el estado con los datos de la respuesta
        this.setState({ productos: response.data });
      })
      .catch((error) => {
        console.error('Error al obtener la lista de productos:', error);
      });
  }

  // Función para manejar cambios en el formulario de nuevo producto
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      nuevoProducto: {
        ...this.state.nuevoProducto,
        [name]: value,
      },
    });
  };

  // Función para enviar datos al servidor (POST)
  handleSubmit = (event) => {
    event.preventDefault();

    const { nombre, descripcion, precio } = this.state.nuevoProducto;

    // Realiza una solicitud POST para agregar un nuevo producto
    axios.post('http://localhost:5000/productos', {
      nombre,
      descripcion,
      precio,
    })
    .then((response) => {
      console.log(response.data);
      // Actualiza la lista de productos después de agregar uno nuevo
      this.obtenerProductos();
      this.setState({
        nuevoProducto: {
          nombre: '',
          descripcion: '',
          precio: 0,
        },
      });
    })
    .catch((error) => {
      console.error('Error al agregar producto:', error);
    });
  };

  // Función para activar la edición de un producto
  activarEdicion = (producto) => {
    this.setState({ productoAEditar: producto });
  };

  // Función para cancelar la edición de un producto
  cancelarEdicion = () => {
    this.setState({ productoAEditar: null });
  };

  // Función para enviar datos actualizados al servidor (PUT)
  actualizarProducto = () => {
    const { id, nombre, descripcion, precio } = this.state.productoAEditar;

    axios.put(`http://localhost:5000/productos/${id}`, {
      nombre,
      descripcion,
      precio,
    })
    .then((response) => {
      console.log(response.data);
      this.obtenerProductos();
      this.setState({ productoAEditar: null });
    })
    .catch((error) => {
      console.error('Error al actualizar producto:', error);
    });
  };

  // Función para eliminar un producto (DELETE)
  eliminarProducto = (id) => {
    axios.delete(`http://localhost:5000/productos/${id}`)
      .then((response) => {
        console.log(response.data);
        this.obtenerProductos();
      })
      .catch((error) => {
        console.error('Error al eliminar producto:', error);
      });
  };

   // Función para realizar la predicción de precios
   realizarPrediccion = () => {
    // Obtén los datos necesarios para la predicción desde el estado de tu componente
    const { nombre, descripcion, precio } = this.state.nuevoProducto;

    // Realiza una solicitud POST al servidor Flask para obtener la predicción
    axios.post('http://localhost:5000/prediccion-precio', {
      nombre,
      descripcion,
      precio,
    })
    .then((response) => {
      // Maneja la respuesta del servidor, que debería contener la predicción de precio
      const prediccionPrecio = response.data.prediccion;
      // Actualiza el estado para mostrar la predicción en la interfaz
      this.setState({ prediccionPrecio });
    })
    .catch((error) => {
      console.error('Error al realizar la predicción de precio:', error);
    });
  };

  exportToCSV = () => {
    axios.get('http://localhost:5000/productos/export-csv', { responseType: 'arraybuffer' })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'productos.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error('Error exporting to CSV:', error);
      });
  };
  
  exportToExcel = () => {
    axios.get('http://localhost:5000/productos/export-excel', { responseType: 'arraybuffer' })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'productos.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error('Error exporting to Excel:', error);
      });
  };






  render() {
    const { productos, nuevoProducto, productoAEditar, prediccionPrecio } = this.state;

    return (
        <div className="container">
        <h1 className="mt-4">Lista de Productos</h1>
        
        {/* Formulario para agregar un nuevo producto */}
        <form onSubmit={this.handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            Nombre:
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={nuevoProducto.nombre}
              onChange={this.handleInputChange}
              required
            />
          </label>
          </div>
          <div className="mb-3">

          <label className="form-label">
            Descripción:
            <input
              type="text"
              name="descripcion"
              className="form-control"
              value={nuevoProducto.descripcion}
              onChange={this.handleInputChange}
              required
            />
          </label>

          </div>
          <div className="mb-3">
          <label className="form-label">
            Precio:
            <input
              type="number"
              name="precio"
              className="form-control"
              value={nuevoProducto.precio}
              onChange={this.handleInputChange}
              required
            />
          </label>

          </div>

          
          
          <button type="submit" className="btn btn-primary">Agregar Producto</button>
          
          
          
          


        </form>
        <button className="btn btn-primary mb-4" onClick={this.realizarPrediccion}>
          Realizar Predicción de Precio
        </button>
        <button className="btn btn-success" onClick={this.exportToCSV}>
          Exportar a CSV
        </button>
        <button className="btn btn-success" onClick={this.exportToExcel}>
          Exportar a Excel
        </button>

        {prediccionPrecio !== null && (
          <div className="alert alert-success">
            Predicción de Precio: {prediccionPrecio}
          </div>
        )}

        <ul className="list-group mt-4">
          {/* Renderiza la lista de productos */}
          {productos.map((producto) => (
            <li className="list-group-item" key={producto.id}>
              {productoAEditar === producto ? (
                <div className="mb-3">
                  <strong>Nombre:</strong>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={producto.nombre}
                    onChange={(e) => this.setState({ productoAEditar: { ...producto, nombre: e.target.value } })}
                  />
                  <br />
                  <strong>Descripción:</strong>
                  <input
                    type="text"
                    name="descripcion"
                    className="form-control"
                    value={producto.descripcion}
                    onChange={(e) => this.setState({ productoAEditar: { ...producto, descripcion: e.target.value } })}
                  />
                  <br />
                  <strong>Precio:</strong>
                  <input
                    type="number"
                    name="precio"
                    className="form-control"
                    value={producto.precio}
                    onChange={(e) => this.setState({ productoAEditar: { ...producto, precio: e.target.value } })}
                  />
                  <br />
                  
                  <button className="btn btn-warning mx-2" onClick={() => this.actualizarProducto()}>Guardar</button>
                  <button className="btn btn-warning mx-2" onClick={() => this.cancelarEdicion()}>Cancelar</button>

                  
                </div>
              ) : (
                <div className="mb-3">
                  <strong>Nombre:</strong> {producto.nombre}, <strong>Precio:</strong> {producto.precio}
                  <button className="btn btn-warning mx-2" onClick={() => this.activarEdicion(producto)}>Editar</button>
                  <button  className="btn btn-warning mx-2" onClick={() => this.eliminarProducto(producto.id)}>Eliminar</button>
                  
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      
    );
  }
}

export default Productos;
