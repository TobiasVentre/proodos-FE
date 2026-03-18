# 📌 Documentación Componentes Proodos

##  Entry Points Big
Configuraciones particulares del componente


## 🧩 Funciones y Procedimientos
### `Orden de contenido`
- **Descripción**: Existen 2 modelos, uno con el box grande sobre la izquierda y otro con el box grande sobre la derecha del componente.
Por defecto el box grande se posiciona sobre la izquierda y los boxes chicos sobre la derecha, si se solicita invertir este orden la forma de configurarlo es mediante una clase.
- **Configuración**:
  - Al div contenido agregar la clase `reverse`.

### `Imagenes box-grande`
- **Descripción**: Cada componente en su respectivo box-grande lleva una imagen particular del segmento en el que se está
trabajando.
- **Configuración**:
  - Al div con la clase `box-grande` se le agrega la clase de dicha imagen: llevara `img- ` y la palabra que elijamos que haga referencia al segmento. Ejemplo: `img-fibra`
  - Al finalizar el style.scss se agregara la clase creada con el background-image correspondiente.

