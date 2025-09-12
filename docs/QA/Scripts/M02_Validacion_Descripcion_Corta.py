"""
==================================================================================
Script de Prueba Automatizada para ResQFood
==================================================================================
Módulo: 2 - Flujo de Donación
Nombre del Script: M02_Validacion_Descripcion_Corta.py
----------------------------------------------------------------------------------
Objetivo del Script:
Este script verifica que el formulario de creación de donación muestra un
error de validación cuando la descripción es demasiado corta.

Caso de Prueba Cubierto:
- M2-DON-003: (Validación) Descripción con menos caracteres del mínimo requerido.
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
EMAIL_DE_PRUEBA = "gonzalobouso002+z@gmail.com"
CONTRASENA_DE_PRUEBA = "24090765"
RUTA_IMAGEN = "C:\\test_image.jpg"
DESCRIPCION_CORTA = "Corta" # Texto intencionadamente corto

# --- INICIO DEL SCRIPT DE PRUEBA ---
print(">>> Iniciando prueba: Validación de descripción corta...")

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

    # --- INICIO DEL FLUJO DE VALIDACIÓN ---

    # 4. Rellenar el formulario, usando una descripción corta
    print("Rellenando el formulario...")
    wait.until(EC.visibility_of_element_located((By.ID, "titulo"))).send_keys("Prueba Descripción Corta")
    
    print(f"Ingresando descripción corta: '{DESCRIPCION_CORTA}'")
    driver.find_element(By.ID, "descripcion").send_keys(DESCRIPCION_CORTA)

    Select(driver.find_element(By.ID, "categoria")).select_by_visible_text("Otros")
    Select(driver.find_element(By.ID, "estadoAlimento")).select_by_visible_text("No Perecedero")

    # Rellenar fecha
    date_input_element = driver.find_element(By.NAME, "fechaExpiracionPublicacion")
    driver.execute_script("arguments[0].click();", date_input_element)
    wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "react-datepicker-popper")))
    day_element_xpath = "//div[contains(@class, 'react-datepicker__day') and not(contains(@class, '--disabled')) and text()='20']"
    day_element = wait.until(EC.presence_of_element_located((By.XPATH, day_element_xpath)))
    driver.execute_script("arguments[0].click();", day_element)
    
    # Rellenar ubicación
    autocomplete_input = wait.until(EC.visibility_of_element_located((By.ID, "autocomplete_address")))
    autocomplete_input.send_keys("Obelisco, Buenos Aires")
    wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "pac-container")))
    time.sleep(1) 
    autocomplete_input.send_keys(Keys.ARROW_DOWN)
    time.sleep(0.5)
    autocomplete_input.send_keys(Keys.ENTER)
    time.sleep(2)

    # Subir imagen
    driver.find_element(By.XPATH, "//input[@type='file']").send_keys(RUTA_IMAGEN)
    time.sleep(3)

    # 5. Intentar publicar la donación
    print("Intentando publicar la donación...")
    submit_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@type='submit']")))
    submit_button.click()
    
    # --- VERIFICACIÓN FINAL ---

    # 6. Verificar que aparece el mensaje de error de validación para la descripción
    print("Verificando que aparezca el mensaje de error de descripción...")
    # Buscamos un <p> de error que está justo después del <textarea> de descripción
    error_message = wait.until(EC.visibility_of_element_located(
        (By.XPATH, "//textarea[@id='descripcion']/following-sibling::p")
    ))
    
    # Opcional pero recomendado: Verificar que el texto del error es el esperado
    assert "caracteres" in error_message.text
    
    print(f"Mensaje de error encontrado: '{error_message.text}'")
    print("\n✅ PRUEBA EXITOSA: El formulario mostró el error de validación para descripción corta correctamente.")

except Exception as e:
    print(f"\n❌ ERROR DURANTE LA PRUEBA: {e}")

finally:
    # Pausa final para poder ver el resultado antes de cerrar
    time.sleep(5) 
    
    # Cerrar el navegador
    print(">>> Cerrando el navegador.")
    driver.quit()