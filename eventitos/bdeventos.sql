-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-03-2025 a las 17:06:03
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bdeventos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `events`
--

CREATE TABLE `events` (
  `event_id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_description` text DEFAULT NULL,
  `event_image` varchar(255) DEFAULT NULL,
  `event_date` date NOT NULL DEFAULT current_timestamp(),
  `event_time` time NOT NULL DEFAULT current_timestamp(),
  `event_location` varchar(255) DEFAULT NULL,
  `organizer` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `events`
--

INSERT INTO `events` (`event_id`, `event_name`, `event_description`, `event_image`, `event_date`, `event_time`, `event_location`, `organizer`) VALUES
(14, 'T3chfest ', 'T3chfest combina un programa de lo más variado y completo posible, con charlas divulgativas y técnicas, inspiradoras y de profundidad.', 'https://secture.com/wp-content/uploads/2024/01/image-3.png', '2025-03-14', '12:30:00', 'Madrid', 'In.Tec Madrid'),
(15, 'T3chfest', 'T3chfest combina un programa de lo más variado y completo posible, con charlas divulgativas y técnicas, inspiradoras y de profundidad.', 'https://secture.com/wp-content/uploads/2024/01/image-3.png', '2025-03-15', '12:30:00', 'Madrid', 'Ins.Tec Madrid'),
(16, 'CommitConf', 'Una conferencia española donde se discute de Cloud, Web, Machine Learning, mientras puedes jugar al futbolín o montar un Jenga de metro y medio. ', 'https://secture.com/wp-content/uploads/2024/01/image-4.png', '2025-04-19', '10:00:00', 'Madrid', 'CloudNet'),
(17, 'Salmorejo Tech', 'Un día repleto de charlas, software y networking donde compartir y hacer comunidad.', 'https://secture.com/wp-content/uploads/2024/01/image-6-1536x263.png', '2025-05-20', '11:00:00', 'Córodoba', 'Ayuntamiento de Córdoba'),
(18, 'Pamplona Software Crafters', 'Para desarrolladores que buscan mejorar sus habilidades y discutir sobre el futuro del desarrollo de software.', 'https://secture.com/wp-content/uploads/2024/01/image-7-1536x230.png', '2025-05-18', '17:30:00', 'Pamplona', 'CAFTing'),
(19, 'Codemotion Madrid', 'La conferencia tech internacional más importante del mundo, en Madrid, el 21 y 22 de mayo. Un evento imperdible para desarrolladores y profesionales de TI ansiosos por las últimas perspectivas sobre tecnologías avanzadas, charlas inspiradoras y oportunidades de networking.', 'https://secture.com/wp-content/uploads/2024/01/image-8.png', '2025-03-20', '08:45:00', 'Madrid', 'CodeMotion'),
(20, 'South Summit', 'Un punto de encuentro para startups, inversores y empresas, ideal para quienes buscan las últimas tendencias en el mundo empresarial tecnológico.\n\n', 'https://secture.com/wp-content/uploads/2024/01/image-9.png', '2025-06-05', '09:00:00', 'Valencia', 'South Summit'),
(21, 'LechazoConf', '¿Qué es el Lechazoconf? Un día. Un track. “Un fracaso y un éxito”. 6 charlas de ponentes de todo el país (¡o más allá!) y 6 experiencias elegidas por Call for Papers. Un evento único en Valladolid, el 15 de junio, que mezcla charlas de tecnología con un toque local muy especial.', 'https://secture.com/wp-content/uploads/2024/01/image-10.png', '2025-06-15', '08:30:00', 'Valladolid', 'LechazoConf'),
(22, 'Bits & Pretzels', 'Bits & Pretzels es un evento que recibe a 5000 fundadores, inversores y startups durante tres días llenos de aprendizaje, networking y negocios durante el Oktoberfest de Múnich. Una excusa perfecta para visitar la ciudad desde el 29 de septiembre al 1 de octubre.', 'https://secture.com/wp-content/uploads/2024/01/image-11.png', '2025-09-29', '16:30:00', 'Munich', 'MunchPop'),
(23, 'MorcillaConf', 'Esta conferencia de tecnología en Burgos es referente en Castilla y León, suele celebrarse en octubre y está dirigido por la comunidad y para la comunidad. Es un punto de encuentro para profesionales, estudiantes y aficionados a la tecnología que asisten a conferencias y talleres.', 'https://secture.com/wp-content/uploads/2024/01/image-12.png', '2025-03-16', '10:30:00', 'Burgos', 'Ayto. de Burgos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `participants`
--

CREATE TABLE `participants` (
  `participant_id` int(11) NOT NULL,
  `participant_name` varchar(255) NOT NULL,
  `participant_email` varchar(255) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `num_companions` int(11) DEFAULT NULL,
  `registered` tinyint(1) DEFAULT NULL,
  `registration_date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `participants`
--

INSERT INTO `participants` (`participant_id`, `participant_name`, `participant_email`, `event_id`, `num_companions`, `registered`, `registration_date`) VALUES
(14, 'Pedro Angel', 'p.a@hotmail.com', 15, 0, 0, '2025-03-06'),
(15, 'Manuel Burgos', 'b.manu@yahoo.es', 16, 3, 0, '2025-03-06'),
(16, 'Alejandro Gazpacho', 'a.gazpacho@pixiePio.com', 17, 4, 0, '2025-03-05'),
(17, 'Kiko Calleja', 'callejeros@viajeros.es', 18, 2, 0, '2025-03-04'),
(18, 'Alex Steve', 'creeper@craft.com', 18, 0, 0, '2025-03-05'),
(19, 'Gabriela Soto', 'soto@gmail.com', 19, 5, 0, '2025-03-06'),
(20, 'Hugo Valpuesta', 'val.12@hotmail.com', 20, 1, 0, '2025-03-06'),
(21, 'Burgos de Aria', 'quesosBurgos@aria.es', 23, 15, 0, '2025-03-06'),
(22, 'Lucía Antequera Porras', 'porrantquerana@gmail.com', 17, 2, 0, '2025-03-07');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`);

--
-- Indices de la tabla `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`participant_id`),
  ADD KEY `event_id` (`event_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `participants`
--
ALTER TABLE `participants`
  MODIFY `participant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `participants`
--
ALTER TABLE `participants`
  ADD CONSTRAINT `participants_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
