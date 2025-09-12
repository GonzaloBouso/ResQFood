"""
==================================================================================
Script de Prueba Automatizada para ResQFood
==================================================================================
Módulo: 2 - Flujo de Donación
Nombre del Script: M02_Validacion_Sin_Fecha.py
----------------------------------------------------------------------------------
Objetivo del Script:
Este script verifica que el formulario de creación de donación muestra un error
de validación cuando se intenta publicar sin haber seleccionado una fecha.

Caso de Prueba Cubierto:
- Modificación de M2-DON-02: (Validación) Crear donación sin fecha de publicación.
----------------------------------------------------------------------------------
"""

import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC

# --- CONFIGURACIÓN DE LA PRUEBA ---
EMAIL_DE_PRUEBA = ""
CONTRASENA_DE_PRUEBA = ""
RUTA_IMAGEN = "C:\\test_image.jpg"

# --- INICIO DEL SCRIPT DE PRUEBA ---
print(">>> Iniciando prueba: Validación de 'Crear Donación' sin fecha...")

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
    
    # 3. Navegar al formulario de creación de donación
    print("Navegando al formulario de creación de donación...")
    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Publicar una donación']"))).click()

    # 4. Rellenar TODOS los campos EXCEPTO la fecha
    print("Rellenando todos los campos excepto la fecha...")
    wait.until(EC.visibility_of_element_located((By.ID, "titulo"))).send_keys("Validación Sin Fecha")
    driver.find_element(By.ID, "descripcion").send_keys("Esta es una prueba de validación sin fecha de publicación.")
    Select(driver.find_element(By.ID, "categoria")).select_by_visible_text("Otros")
    Select(driver.find_element(By.ID, "estadoAlimento")).select_by_visible_text("No Perecedero")
    
    # Rellenar ubicación
    autocomplete_input = wait.until(EC.visibility_of_element_located((By.ID, "autocomplete_address")))
    autocomplete_input.send_keys("Obelisco, Buenos Aires")
    wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "pac-container")))
    time.sleep(1) 
    autocomplete_input.send_keys(Keys.ARROW_DOWN)
    time.sleep(0.5)
    autocomplete_input.send_keys(Keys.ENTER)
    time.sleep(2)

    # Subir una imagen
    print(f"Subiendo imagen desde: {RUTA_IMAGEN}")
    input_archivo = driver.find_element(By.XPATH, "//input[@type='file']")
    input_archivo.send_keys(RUTA_IMAGEN)
    print("Esperando a que la imagen se cargue...")
    time.sleep(3)

    # 5. Hacer clic en "Publicar Donación"
    print("Haciendo clic en 'Publicar Donación'...")
    submit_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Publicar Donación']")))
    submit_button.click()
    
    # --- VERIFICACIÓN FINAL (CORREGIDA) ---

    # 6. Verificar que aparece el mensaje de error "Completa este campo"
    print("Verificando que aparezca el mensaje de error de validación...")
    # Buscamos cualquier elemento que contenga el texto exacto que nos mostraste
    error_message = wait.until(EC.visibility_of_element_located(
        (By.XPATH, "//*[contains(text(), 'Completa este campo')]")
    ))
    
    print(f"Mensaje de error encontrado: '{error_message.text}'")
    print("\n✅ PRUEBA EXITOSA: El formulario mostró el error de validación esperado al intentar publicar sin fecha.")

except Exception as e:
    print(f"\n❌ ERROR DURANTE LA PRUEBA: {e}")

finally:
    # Pausa final para poder ver el resultado antes de cerrar
    time.sleep(5) 
    
    # Cerrar el navegador
    print(">>> Cerrando el navegador.")
    driver.quit()