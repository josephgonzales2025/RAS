<?php
// Configuración de la conexión a la base de datos
$host = "localhost"; // o tu servidor de base de datos
$usuario = "root"; // tu usuario de base de datos
$clave = ""; // tu contraseña de base de datos
$base_datos = "servitrans";

// Conexión a la base de datos

$conn = new mysqli($host, $usuario, $clave, $base_datos);

if ($conn->connect_error) {
    die("Error de conexión: ". $conn->connect_error);
}

// Verificar si el formulario ha sido enviado
if($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener los datos del formulario
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $edad = $_POST['edad'];
    $correo = $_POST['email'];

    // Insertar los datos en la base de datos
    $sql = "INSERT INTO clientes (nombre, apellido, edad, correo)
            VALUES ('$nombre', '$apellido', $edad, '$correo')";

    if ($conn->query($sql) === TRUE) {
        echo "Datos guardados correctamente";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Cerrar la conexión
$conn->close();
?>