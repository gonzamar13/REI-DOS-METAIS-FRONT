# Usar una imagen ligera de Nginx
FROM nginx:alpine

# Copiar todos los archivos de tu proyecto a la carpeta pública de Nginx
COPY . /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80