"""
==================================================================================
Script de Prueba Automatizada para ResQFood
==================================================================================
Módulo: 1 - Autenticación y Perfil de Usuario
Nombre del Script: M01_Cambiar_Foto_Perfil.py
----------------------------------------------------------------------------------
Objetivo del Script:
Este script automatiza el flujo de "camino feliz" para un usuario existente que
cambia su foto de perfil, usando una ruta de archivo simplificada.
----------------------------------------------------------------------------------
"""

import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains

# --- CONFIGURACIÓN DE LA PRUEBA ---
EMAIL_DE_PRUEBA = ""
CONTRASENA_DE_PRUEBA = ""
# --- RUTA DE IMAGEN SIMPLIFICADA ---
RUTA_IMAGEN = "C:\\test_image.jpg"

# --- INICIO DEL SCRIPT DE PRUEBA ---
print(">>> Iniciando prueba: Cambio de foto de perfil...")

# 1. Inicializar el WebDriver
driver = webdriver.Chrome()
driver.maximize_window()
wait = WebDriverWait(driver, 30)

print(f"Ruta de la imagen de prueba: {RUTA_IMAGEN}")

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

    # --- INICIO DEL FLUJO DE CAMBIO DE FOTO ---
    
    # 4. Obtener la URL de la imagen actual
    print("Esperando la página de perfil...")
    contenedor_imagen = wait.until(
        EC.visibility_of_element_located((By.XPATH, "//div[contains(@class, 'relative w-32 h-32')]"))
    )
    url_imagen_inicial = contenedor_imagen.find_element(By.TAG_NAME, "img").get_attribute("src")
    print(f"URL de la imagen inicial: {url_imagen_inicial}")

    # 5. Mover el ratón sobre la imagen de perfil
    print("Moviendo el ratón sobre la imagen de perfil...")
    actions = ActionChains(driver)
    actions.move_to_element(contenedor_imagen).perform()

    # 6. Hacer clic en el botón para cambiar la foto
    print("Haciendo clic en el botón para cambiar la foto...")
    boton_cambiar_foto = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[@title='Cambiar foto de perfil']"))
    )
    boton_cambiar_foto.click()
    
    # 7. Esperar a que el modal se abra y subir el archivo
    print("Esperando a que el modal para subir foto se abra...")
    input_archivo = wait.until(
        EC.presence_of_element_located((By.XPATH, "//input[@type='file']"))
    )
    
    print(f"Subiendo el archivo desde '{RUTA_IMAGEN}'...")
    input_archivo.send_keys(RUTA_IMAGEN)

    # 8. Esperar y hacer clic en el botón "Guardar Foto"
    print("Esperando y haciendo clic en el botón 'Guardar Foto'...")
    boton_guardar_foto = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Guardar Foto']"))
    )
    boton_guardar_foto.click()

    # --- VERIFICACIÓN FINAL ---

    # 9. Esperar a que la URL de la imagen de perfil cambie
    print("Verificando que la URL de la imagen haya cambiado...")
    wait.until(
        lambda driver: driver.find_element(By.XPATH, "//div[contains(@class, 'rounded-full')]//img").get_attribute("src") != url_imagen_inicial
    )
    
    url_imagen_final = driver.find_element(By.XPATH, "//div[contains(@class, 'rounded-full')]//img").get_attribute("src")
    print(f"URL de la imagen final: {url_imagen_final}")
    
    print("\n✅ PRUEBA EXITOSA: La foto de perfil fue actualizada correctamente.")

except Exception as e:
    print(f"\n❌ ERROR DURANTE LA PRUEBA: {e}")

finally:
    # Pausa final para poder ver el resultado antes de cerrar
    time.sleep(5) 
    
    # Cerrar el navegador
    print(">>> Cerrando el navegador.")
    driver.quit()