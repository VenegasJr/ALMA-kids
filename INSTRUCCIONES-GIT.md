# 📤 Instrucciones para Subir al Git

## ⚠️ IMPORTANTE - Seguridad

**NO subas `ai-chat-config.js` con tu API key real**

El archivo `.gitignore` ya está configurado para proteger tu API key.

---

## 🚀 Pasos para Subir al Git

### Paso 1: Verificar el .gitignore

El archivo `.gitignore` ya está creado y protege:
- ✅ `ai-chat-config.js` (tu API key)
- ✅ Archivos temporales
- ✅ Archivos del sistema

### Paso 2: Crear un archivo de ejemplo para Git

Crea una copia sin la API key real:

```bash
# En la terminal, desde la carpeta del proyecto:
cp ai-chat-config.js ai-chat-config.example.js
```

Luego edita `ai-chat-config.example.js` y reemplaza la API key con:
```javascript
apiKey: 'TU_API_KEY_AQUI',
```

### Paso 3: Inicializar Git (si no lo has hecho)

```bash
# Inicializar repositorio
git init

# Agregar el .gitignore
git add .gitignore

# Hacer commit inicial
git commit -m "Agregar .gitignore para proteger API key"
```

### Paso 4: Agregar archivos al Git

```bash
# Agregar todos los archivos (el .gitignore excluirá ai-chat-config.js)
git add .

# Verificar qué se va a subir
git status
```

**IMPORTANTE:** Verifica que `ai-chat-config.js` NO aparezca en la lista.

### Paso 5: Hacer Commit

```bash
# Hacer commit
git commit -m "Implementar chat con IA y corregir problema del video"
```

### Paso 6: Conectar con GitHub/GitLab

```bash
# Agregar el repositorio remoto
git remote add origin https://github.com/tu-usuario/tu-repositorio.git

# Cambiar a la rama main
git branch -M main

# Subir al repositorio
git push -u origin main
```

---

## 🔒 Verificación de Seguridad

### Antes de hacer push, verifica:

```bash
# Ver qué archivos se van a subir
git status

# Ver el contenido del .gitignore
cat .gitignore
```

### Verifica que NO aparezca:
- ❌ `ai-chat-config.js` (con tu API key real)

### Debe aparecer:
- ✅ `ai-chat-config.example.js` (sin API key)
- ✅ Todos los demás archivos del proyecto

---

## 📝 Comandos Rápidos

```bash
# Verificar estado
git status

# Agregar todos los archivos
git add .

# Ver qué se agregó
git status

# Hacer commit
git commit -m "Mensaje descriptivo"

# Subir al repositorio
git push
```

---

## 🚨 Si Ya Subiste la API Key por Error

### Opción 1: Eliminar el archivo del historial

```bash
# Eliminar el archivo del historial de Git
git rm --cached ai-chat-config.js

# Hacer commit
git commit -m "Eliminar API key del repositorio"

# Forzar push (cuidado: esto reescribe el historial)
git push --force
```

### Opción 2: Revocar la API Key

1. Ve a: https://platform.openai.com/api-keys
2. Elimina la API key comprometida
3. Crea una nueva API key
4. Actualiza `ai-chat-config.js` con la nueva key

---

## 📋 Checklist Antes de Subir

- [ ] Verificaste que `.gitignore` existe
- [ ] Verificaste que `ai-chat-config.js` NO se va a subir
- [ ] Creaste `ai-chat-config.example.js` como ejemplo
- [ ] Hiciste `git status` y verificaste los archivos
- [ ] Hiciste commit con un mensaje descriptivo
- [ ] Estás listo para hacer push

---

## 🎯 Resumen

1. ✅ `.gitignore` protege tu API key
2. ✅ `ai-chat-config.example.js` es el ejemplo público
3. ✅ `ai-chat-config.js` con tu API key real NO se sube
4. ✅ Todos los demás archivos se suben normalmente

---

## 📞 ¿Necesitas Ayuda?

Si tienes dudas:
1. Revisa el `.gitignore`
2. Ejecuta `git status` para verificar
3. Contacta a tu desarrollador

---

**¡Listo para subir al Git de forma segura!** 🚀

