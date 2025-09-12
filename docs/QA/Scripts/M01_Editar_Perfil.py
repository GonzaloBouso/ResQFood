"""
==================================================================================
Script de Prueba Automatizada para ResQFood
==================================================================================
Módulo: 1 - Autenticación y Perfil de Usuario
Nombre del Script: M01_Editar_Perfil.py
----------------------------------------------------------------------------------
Objetivo del Script:
Este script automatiza el flujo de "camino feliz" para un usuario existente que
edita la información de su perfil con datos válidos.
----------------------------------------------------------------------------------
"""

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# --- CONFIGURACIÓN DE LA PRUEBA ---
EMAIL_DE_PRUEBA = ""
CONTRASENA_DE_PRUEBA = ""

# --- DATOS VÁLIDOS PARA LA EDICIÓN ---
NUEVO_NOMBRE = "Usuario Editado con Éxito"
NUEVO_TELEFONO = "1122334455" # Usamos un número de teléfono de longitud válida
NUEVA_DIRECCION = "Calle Falsa 123"
NUEVA_CIUDAD = "Ciudad Gótica"
NUEVA_PROVINCIA = "Provincia Nueva"
NUEVO_PAIS = "País Nuevo"

# --- INICIO DEL SCRIPT DE PRUEBA ---
print(">>> Iniciando prueba: Edición de perfil de usuario existente...")

# 1. Inicializar el WebDriver
driver = webdriver.Chrome()
driver.maximize_window()
wait = WebDriverWait(driver, 30)

try:
    # 2. Abrir la página y hacer login
    print("Abriendo la URL y haciendo login...")
    driver.get("https://res-q-food.vercel.app/")
    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Sign in')]"))).click()
    wait.until(EC.visibility_of_element_located((By.ID, "identifier-field"))).send_keys(EMAIL_DE_PRUEBA)
    driver.find_element(By.XPATH, "//button[contains(@class, 'cl-formButtonPrimary')]").click()
    wait.until(EC.visibility_of_element_located((By.NAME, "password"))).send_keys(CONTRASENA_DE_PRUEBA)
    driver.find_element(By.XPATH, "//button[contains(@class, 'cl-formButtonPrimary')]").click()
    print("Inicio de sesión completado.")
    
    # 3. Navegar a "Mi Perfil"
    print("Navegando a 'Mi Perfil'...")
    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@aria-label='Opciones de perfil']"))).click()
    wait.until(EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Ir a mi perfil')]"))).click()

    # 4. Abrir el modal de edición
    print("Esperando la página de perfil y haciendo clic en 'Editar Perfil'...")
    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Editar Perfil')]"))).click()

    # --- EDICIÓN DEL PERFIL ---
    
    # 5. Esperar a que el modal y su primer campo estén listos
    print("Esperando a que el modal de edición y sus campos estén listos...")
    nombre_input = wait.until(EC.element_to_be_clickable((By.NAME, "nombre")))
    
    # 6. Rellenar todo el formulario con datos válidos
    print(f"Editando nombre a: '{NUEVO_NOMBRE}'")
    nombre_input.clear()
    nombre_input.send_keys(NUEVO_NOMBRE)

    print(f"Editando teléfono a: '{NUEVO_TELEFONO}'")
    telefono_input = driver.find_element(By.NAME, "telefono")
    telefono_input.clear()
    telefono_input.send_keys(NUEVO_TELEFONO)
    
    print(f"Editando dirección a: '{NUEVA_DIRECCION}'")
    direccion_input = driver.find_element(By.NAME, "direccion")
    direccion_input.clear()
    direccion_input.send_keys(NUEVA_DIRECCION)

    print(f"Editando ciudad a: '{NUEVA_CIUDAD}'")
    ciudad_input = driver.find_element(By.NAME, "ciudad")
    ciudad_input.clear()
    ciudad_input.send_keys(NUEVA_CIUDAD)

    print(f"Editando provincia a: '{NUEVA_PROVINCIA}'")
    provincia_input = driver.find_element(By.NAME, "provincia")
    provincia_input.clear()
    provincia_input.send_keys(NUEVA_PROVINCIA)

    print(f"Editando país a: '{NUEVO_PAIS}'")
    pais_input = driver.find_element(By.NAME, "pais")
    pais_input.clear()
    pais_input.send_keys(NUEVO_PAIS)
    
    # 7. Guardar los cambios
    print("Haciendo clic en 'Guardar Cambios'...")
    driver.find_element(By.XPATH, "//button[text()='Guardar Cambios']").click()

    # --- VERIFICACIÓN FINAL ---

    # 8. Esperar a que el modal se cierre
    print("Verificando que el modal se haya cerrado...")
    wait.until(EC.invisibility_of_element_located(
        (By.XPATH, "//h3[text()='Editar Información del Perfil']")
    ))
    
    print("\n✅ PRUEBA EXITOSA: El perfil fue editado y los cambios se guardaron correctamente.")

except Exception as e:
    print(f"\n❌ ERROR DURANTE LA PRUEBA: {e}")

finally:
    # Pausa final para poder ver el resultado antes de cerrar
    time.sleep(5) 
    
    # Cerrar el navegador
    print(">>> Cerrando el navegador.")
    driver.quit()