"""
==================================================================================
Script de Prueba Automatizada para ResQFood
==================================================================================
Módulo: 2 - Flujo de Donación
Nombre del Script: M02_Rechazar_Solicitud.py
----------------------------------------------------------------------------------
Objetivo del Script:
Este script automatiza el flujo de un donante que rechaza una solicitud
pendiente y verifica que la lista de solicitudes se actualice correctamente.

Caso de Prueba Cubierto:
- M2-GES-002: (Happy Path) Rechazar una solicitud de donación.
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
NOMBRE_DONACION_PRUEBA = ""

# --- INICIO DEL SCRIPT DE PRUEBA ---
print(f">>> Iniciando prueba: Rechazar una solicitud en la donación '{NOMBRE_DONACION_PRUEBA}'...")

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
    
    # 3. Navegar a "Mis Donaciones"
    print("Navegando a 'Mis Donaciones'...")
    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@aria-label='Opciones de perfil']"))).click()
    wait.until(EC.element_to_be_clickable((By.XPATH, "//a[@href='/mis-donaciones']"))).click()
    
    # --- INICIO DEL FLUJO DE RECHAZO ---

    # 4. Expandir la donación
    print(f"Buscando y expandiendo la donación '{NOMBRE_DONACION_PRUEBA}'...")
    xpath_div_clicable = f"//div[contains(@class, 'cursor-pointer') and .//h3[text()='{NOMBRE_DONACION_PRUEBA}']]"
    wait.until(EC.element_to_be_clickable((By.XPATH, xpath_div_clicable))).click()

    # 5. Hacer clic en el botón "Rechazar"
    print("Haciendo clic en el botón 'Rechazar'...")
    xpath_boton_rechazar = f"//div[.//h3[text()='{NOMBRE_DONACION_PRUEBA}']]//button[text()='Rechazar']"
    wait.until(EC.element_to_be_clickable((By.XPATH, xpath_boton_rechazar))).click()

    # 6. Manejar la alerta
    print("Esperando y aceptando la alerta de confirmación...")
    wait.until(EC.alert_is_present())
    alert = driver.switch_to.alert
    alert.accept()

    # --- VERIFICACIÓN FINAL (CORREGIDA) ---

    # 7. Verificar que la lista de solicitudes ahora está vacía
    print("Verificando que la lista de solicitudes se haya actualizado...")
    # Buscamos el texto "No hay nuevas solicitudes pendientes." DENTRO del acordeón
    xpath_mensaje_vacio = f"{xpath_div_clicable}/following-sibling::div//p[contains(text(), 'No hay nuevas solicitudes pendientes')]"
    mensaje_vacio = wait.until(
        EC.visibility_of_element_located((By.XPATH, xpath_mensaje_vacio))
    )
    
    print(f"Estado final encontrado: '{mensaje_vacio.text}'")
    print("\n✅ PRUEBA EXITOSA: La solicitud fue rechazada y la lista de solicitudes se actualizó correctamente.")

except Exception as e:
    print(f"\n❌ ERROR DURANTE LA PRUEBA: {e}")

finally:
    # Pausa final para poder ver el resultado antes de cerrar
    time.sleep(5) 
    
    # Cerrar el navegador
    print(">>> Cerrando el navegador.")
    driver.quit()