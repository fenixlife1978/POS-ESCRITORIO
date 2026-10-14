# Base de datos de POS El Pistón

## Modo Turso (web y escritorio conectado)

Configure en **Vercel → Project → Settings → Environment Variables**, al menos para Production:

- TURSO_DATABASE_URL: URL libsql://... de la base de datos.
- TURSO_AUTH_TOKEN: token de acceso a Turso.
- POS_API_KEY: clave aleatoria larga para proteger las rutas API del POS.

No use prefijos VITE_ para estos secretos. No los coloque en index.html, el repositorio ni el instalador. Después de cambiar variables de entorno, vuelva a desplegar Production.

En el POS, abra **Base de datos**, seleccione **Turso por API de Vercel**, escriba la URL de producción y la misma POS_API_KEY, y pruebe la conexión. La API crea automáticamente las tablas de estado y documentos cuando se utiliza por primera vez.

## Modo SQLite local (Windows .exe)

Al abrir el programa por primera vez, el escritorio pregunta si desea **SQLite local** o **Turso mediante Vercel**. SQLite usa el motor SQLite integrado (sql.js) y persiste el archivo de base de datos en la carpeta de datos del usuario de Windows. No requiere internet ni sincroniza operaciones con Turso.

La selección también puede cambiarse desde **Base de datos**. No cambie de motor esperando que los datos se mezclen o sincronicen: son fuentes de datos independientes. Antes de cambiar de modo, exporte o respalde la información por los medios disponibles en el sistema.

## Documentos fiscales

En **Documentos**, seleccione una venta o compra, use **Subir documento desde el dispositivo** para elegir un PDF/imagen, o **Tomar foto con la cámara** en dispositivos móviles compatibles. El adjunto queda vinculado al número de la operación seleccionada. El límite actual es 3 MB por archivo.

El almacenamiento y la asociación del documento no equivalen a una validación de autenticidad fiscal ni a una comparación OCR de todos los campos. La declaración y pago oficial siguen realizándose por los canales del SENIAT.

## Artefactos de Windows

GitHub Actions compila el instalador de Windows y la versión portátil .exe en cada push a main. Los archivos se publican como activos de una versión preliminar en GitHub Releases (etiqueta windows-build-N); abre la versión más reciente y descarga POS-El-Piston-Setup-*.exe para instalar o POS-El-Piston-Portable.exe para ejecutar sin instalación. La ejecución debe terminar en éxito para que aparezca la publicación.
