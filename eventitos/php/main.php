<?php
header('Content-Type: application/json');
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    if (isset($_GET['type']) && $_GET['type'] == 'eventos') {
        $sql = "SELECT * FROM events";
        $result = $conn->query($sql);

        // Verificar y mostrar resultados
        if ($result->num_rows > 0) {
            $eventos = [];
            while ($row = $result->fetch_assoc()) {
                $eventos[] = [
                    'id' => $row['event_id'],
                    'nombre' => $row['event_name'],
                    'descripcion' => $row['event_description'],
                    'imagen' => $row['event_image'],
                    'fecha' => $row['event_date'],
                    'hora' => $row['event_time'],
                    'lugar' => $row['event_location'],
                    'organizador' => $row['organizer']
                ];
            }
            echo json_encode($eventos);
        } else {
            echo json_encode(['message' => 'No se encontraron eventos.']);
        }
    } elseif (isset($_GET['type']) && $_GET['type'] == 'participantes') {
        $query = "SELECT participants.*, events.event_name AS eventoNombre FROM participants JOIN events ON participants.event_id = events.event_id";
        $result = mysqli_query($conn, $query);
        $participantes = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $participantes[] = [
                'id' => $row['participant_id'],
                'nombre' => $row['participant_name'],
                'correoElectronico' => $row['participant_email'],
                'eventoId' => $row['event_id'],
                'eventoNombre' => $row['eventoNombre'],
                'numAcompanantes' => $row['num_companions'],
                'registrado' => $row['registered'],
                'fechaInscripcion' => $row['registration_date']
            ];
        }
        echo json_encode($participantes);
    }
} elseif ($method == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data['type'] == 'evento') {
        $nombre = $data['nombre'];
        $descripcion = $data['descripcion'];
        $imagen = $data['imagen'];
        $fecha = $data['fecha'];
        $hora = $data['hora'];
        $lugar = $data['lugar'];
        $organizador = $data['organizador'];

        $query = "INSERT INTO events (event_name, event_description, event_image, event_date, event_time, event_location, organizer) VALUES ('$nombre', '$descripcion', '$imagen', '$fecha', '$hora', '$lugar', '$organizador')";
        if (mysqli_query($conn, $query)) {
            echo json_encode(['status' => 'success', 'message' => 'Evento creado']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al crear el evento', 'error' => mysqli_error($conn)]);
        }
    } elseif ($data['type'] == 'updateEvento') {
        $eventoId = $data['id'];
        $nombre = $data['nombre'];
        $descripcion = $data['descripcion'];
        $imagen = $data['imagen'];
        $fecha = $data['fecha'];
        $hora = $data['hora'];
        $lugar = $data['lugar'];
        $organizador = $data['organizador'];

        $query = "UPDATE events SET event_name='$nombre', event_date='$fecha', event_time='$hora', event_location='$lugar', event_description='$descripcion', event_image='$imagen', organizer='$organizador' WHERE event_id = $eventoId";
        if (mysqli_query($conn, $query)) {
            echo json_encode(['status' => 'success', 'message' => 'Evento actualizado']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el evento', 'error' => mysqli_error($conn), 'data' => $data]);
        }
    } elseif ($data['type'] == 'removeEvento') {
        $eventoId = $data['id'];

        $query = "DELETE FROM events WHERE event_id = $eventoId";
        if (mysqli_query($conn, $query)) {
            echo json_encode(['status' => 'success', 'message' => 'Evento eliminado']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al eliminar el evento', 'error' => mysqli_error($conn)]);
        }
    } elseif ($data['type'] == 'participante') {
        $nombre = $data['nombre'];
        $correoElectronico = $data['correoElectronico'];
        $eventoId = $data['eventoId']; // Convert to number
        $numAcompanantes = $data['numAcompanantes'];
        $registrado = $data['registrado'];
        $fechaInscripcion = $data['fechaInscripcion'];

        // Log the value of eventoId
        error_log("eventoId: " . $eventoId);

        // Check if event_id exists in events table
        $checkEventQuery = "SELECT * FROM events WHERE event_id = $eventoId";
        $checkEventResult = mysqli_query($conn, $checkEventQuery);
        if (mysqli_num_rows($checkEventResult) > 0) {
            $query = "INSERT INTO participants (participant_name, participant_email, event_id, num_companions, registered, registration_date) VALUES ('$nombre', '$correoElectronico', '$eventoId', '$numAcompanantes', '$registrado', '$fechaInscripcion')";
            if (mysqli_query($conn, $query)) {
                echo json_encode(['status' => 'success', 'message' => 'Participante creado']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al crear el participante', 'error' => mysqli_error($conn)]);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'El evento no existe', 'query' => $checkEventQuery]);
        }
    } elseif ($data['type'] == 'updateParticipante') {
        $participanteId = $data['id'];
        $nombre = $data['nombre'];
        $correoElectronico = $data['correoElectronico'];
        $eventoId = $data['eventoId'];
        $numAcompanantes = $data['numAcompanantes'];
        $fechaInscripcion = $data['fechaInscripcion'];

        $query = "UPDATE participants SET participant_name='$nombre', participant_email='$correoElectronico', event_id='$eventoId', num_companions='$numAcompanantes', registration_date='$fechaInscripcion' WHERE participant_id = $participanteId";
        if (mysqli_query($conn, $query)) {
            echo json_encode(['status' => 'success', 'message' => 'Participante actualizado']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Error al actualizar el participante', 'error' => mysqli_error($conn), 'data' => $data]);
        }
    } elseif ($data['type'] == 'removeParticipante') {
        $participanteId = $data['id'];

        $query = "DELETE FROM participants WHERE participant_id = $participanteId";
        if (mysqli_query($conn, $query)) {
            echo json_encode(['status' => 'success', 'message' => 'Participante eliminado']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al eliminar el participante', 'error' => mysqli_error($conn)]);
        }
    }
}

mysqli_close($conn);
?>
