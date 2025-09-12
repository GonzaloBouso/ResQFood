"""
==================================================================================
Script de Prueba Automatizada para ResQFood
==================================================================================
Módulo: 1 - Autenticación y Perfil de Usuario
Nombre del Script: M01_Cierre_de_Sesion.py
----------------------------------------------------------------------------------
Objetivo del Script:
Este script automatiza el flujo de "camino feliz" para un usuario existente que
inicia sesión y luego cierra su sesión correctamente a través del menú de Clerk.

Caso de Prueba Cubierto:
- M1-SES-002: (Happy Path) Cierre de sesión exitoso.
----------------------------------------------------------------------------------
"""

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# --- CONFIGURACIÓN DE LA PRUEBA ---
EMAIL_DE_PRUEBA = "gonzalobouso002+z@gmail.com"
CONTRASENA_DE_PRUEBA = "24090765"

# --- INICIO DEL SCRIPT DE PRUEBA ---
print(">>> Iniciando prueba: Cierre de sesión de usuario...")

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
    
    # 3. Verificación de que el login fue exitoso
    print("Inicio de sesión completado. Verificando estado 'logueado'...")
    user_avatar_button = wait.until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "button.cl-userButtonTrigger"))
    )
    print("Usuario logueado correctamente.")

    # --- INICIO DEL FLUJO DE CIERRE DE SESIÓN (LÓGICA CORREGIDA FINAL) ---
    
    # 4. Hacer clic en el avatar del usuario para desplegar el menú
    print("Desplegando el menú de usuario de Clerk...")
    user_avatar_button.click()

    # 5. Esperar y hacer clic en el botón "Sign out" BUSCANDO POR SU CLASE ESPECÍFICA
    print("Haciendo clic en 'Sign out' (buscando por su clase)...")
    # --- LÍNEA CORREGIDA ---
    sign_out_button = wait.until(EC.element_to_be_clickable(
        (By.CSS_SELECTOR, "button.cl-button__signOut")
    ))
    sign_out_button.click()

    # --- VERIFICACIÓN FINAL ---

    # 6. Verificar que el cierre de sesión fue exitoso
    print("Verificando que el cierre de sesión fue exitoso (esperando el botón 'Sign in')...")
    wait.until(
        EC.visibility_of_element_located((By.XPATH, "//button[contains(text(), 'Sign in')]"))
    )
    
    print("\n✅ PRUEBA EXITOSA: El cierre de sesión se completó y se redirigió a la página principal correctamente.")

except Exception as e:
    print(f"\n❌ ERROR DURANTE LA PRUEBA: {e}")

finally:
    # Pausa final para poder ver el resultado antes de cerrar
    time.sleep(5) 
    
    # Cerrar el navegador
    print(">>> Cerrando el navegador.")
    driver.quit()