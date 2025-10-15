# 📤 Cómo Subir al Git - ALMA Kids

## ⚠️ IMPORTANTE - Seguridad

**NO subas `ai-chat-config.js` con tu API key real**

El archivo `.gitignore` ya está configurado para proteger tu API key.

---

## 🚀 Pasos para Subir al Git

### Paso 1: Verificar archivos

Asegúrate de que estos archivos existen:
- ✅ `index.html` (actualizado con el chat)
- ✅ `ai-chat-widget.html`
- ✅ `ai-chat.js`
- ✅ `ai-chat.css`
- ✅ `ai-chat-config.example.js`
- ✅ `.gitignore`
- ⚠️ `ai-chat-config.js` (NO se subirá, está protegido)

### Paso 2: Inicializar Git (si no lo has hecho)

```bash
# Desde la carpeta del proyecto
cd "/Users/venegascarlos/Documents/BackUp/ALMA kids Web"

# Inicializar repositorio
git init

# Agregar el .gitignore primero
git add .gitignore
git commit -m "Agregar .gitignore para proteger API key"
```

### Paso 3: Agregar archivos

```bash
# Agregar todos los archivos (el .gitignore excluirá ai-chat-config.js)
git add .

# Verificar qué se va a subir
git status
```

**IMPORTANTE:** Verifica que `ai-chat-config.js` NO aparezca en la lista.

### Paso 4: Hacer Commit

```bash
git commit -m "Implementar chat con IA y corregir problema del video"
```

### Paso 5: Conectar con GitHub

```bash
# Agregar el repositorio remoto (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/tu-repositorio.git

# Cambiar a la rama main
git branch -M main

# Subir al repositorio
git push -u origin main
```

---

## 🔒 Verificación de Seguridad

### Antes de hacer push:

```bash
# Ver qué archivos se van a subir
git status

# Ver el contenido del .gitignore
cat .gitignore
```

### Debe aparecer:
- ✅ `ai-chat-config.example.js` (sin API key)
- ✅ Todos los demás archivos del proyecto

### NO debe aparecer:
- ❌ `ai-chat-config.js` (con tu API key real)

---

## 📋 Checklist Antes de Subir

- [ ] Verificaste que `.gitignore` existe
- [ ] Verificaste que `ai-chat-config.js` NO se va a subir
- [ ] Ejecutaste `git status` y verificaste los archivos
- [ ] Hiciste commit con un mensaje descriptivo
- [ ] Estás listo para hacer push

---

## 🎯 Comandos Rápidos

```bash
# Verificar estado
git status

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Mensaje descriptivo"

# Subir al repositorio
git push
```

---

## 📝 Archivos que se Subirán

### Archivos del Chat con IA:
- ✅ `ai-chat-widget.html`
- ✅ `ai-chat.js`
- ✅ `ai-chat.css`
- ✅ `ai-chat-config.example.js`

### Archivos NO subidos (protegidos):
- ❌ `ai-chat-config.js` (con tu API key)

### Archivos del Sitio:
- ✅ `index.html` (actualizado)
- ✅ Todos los demás archivos del sitio

---

## 🚨 Si Ya Subiste la API Key por Error

### Opción 1: Eliminar del historial

```bash
# Eliminar el archivo del historial
git rm --cached ai-chat-config.js

# Hacer commit
git commit -m "Eliminar API key del repositorio"

# Forzar push
git push --force
```

### Opción 2: Revocar la API Key

1. Ve a: https://platform.openai.com/api-keys
2. Elimina la API key comprometida
3. Crea una nueva API key
4. Actualiza `ai-chat-config.js` con la nueva key

---

## 📞 ¿Necesitas Ayuda?

Si tienes dudas:
1. Revisa el `.gitignore`
2. Ejecuta `git status` para verificar
3. Contacta a tu desarrollador

---

**¡Listo para subir al Git de forma segura!** 🚀

