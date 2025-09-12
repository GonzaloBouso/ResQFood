"""
==================================================================================
Script de Prueba Automatizada para ResQFood
==================================================================================
Módulo: 2 - Flujo de Donación
Nombre del Script: M02_Aceptar_Solicitud.py
----------------------------------------------------------------------------------
Objetivo del Script:
Este script automatiza el flujo de un donante que acepta una solicitud pendiente,
confirmando la propuesta de horario con los valores por defecto.
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
print(f">>> Iniciando prueba: Aceptar una solicitud en la donación '{NOMBRE_DONACION_PRUEBA}'...")

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
    
    # 4. Expandir la donación
    print(f"Buscando y expandiendo la donación '{NOMBRE_DONACION_PRUEBA}'...")
    xpath_div_clicable = f"//div[contains(@class, 'cursor-pointer') and .//h3[text()='{NOMBRE_DONACION_PRUEBA}']]"
    wait.until(EC.element_to_be_clickable((By.XPATH, xpath_div_clicable))).click()

    # 5. Hacer clic en el botón "Aceptar"
    print("Haciendo clic en el botón 'Aceptar'...")
    xpath_boton_aceptar = f"//div[.//h3[text()='{NOMBRE_DONACION_PRUEBA}']]//button[text()='Aceptar']"
    wait.until(EC.element_to_be_clickable((By.XPATH, xpath_boton_aceptar))).click()

    # --- ENVIAR PROPUESTA DIRECTAMENTE (LÓGICA FINAL) ---

    # 6. Esperar a que el modal se abra
    print("Esperando a que el modal de horario se abra...")
    wait.until(EC.visibility_of_element_located(
        (By.XPATH, "//h2[text()='Proponer Horario de Entrega']")
    ))
    
    # Pausa de seguridad para que el botón esté listo
    time.sleep(1)

    # 7. Localizar el botón y forzar el clic con JavaScript
    print("Haciendo clic en 'Enviar Propuesta' con JavaScript...")
    submit_button = wait.until(EC.presence_of_element_located(
        (By.XPATH, "//button[@type='submit' and text()='Enviar Propuesta']")
    ))
    driver.execute_script("arguments[0].click();", submit_button)

    # --- VERIFICACIÓN FINAL ---

    # 8. Verificar que apareció un mensaje de éxito
    print("Verificando que aparezca el mensaje de éxito...")
    wait.until(EC.visibility_of_element_located(
        (By.XPATH, "//*[contains(text(), 'Propuesta de horario enviada')]")
    ))
    
    # 9. Verificar que el estado de la donación cambió
    print("Verificando que el estado de la donación se haya actualizado...")
    xpath_estado = f"//div[.//h3[text()='{NOMBRE_DONACION_PRUEBA}']]//div[contains(., 'PENDIENTE-ENTREGA')]"
    wait.until(EC.visibility_of_element_located((By.XPATH, xpath_estado)))

    print("\n✅ PRUEBA EXITOSA: La solicitud fue aceptada y la propuesta de horario fue enviada.")

except Exception as e:
    print(f"\n❌ ERROR DURANTE LA PRUEBA: {e}")

finally:
    # Pausa final para poder ver el resultado antes de cerrar
    time.sleep(5) 
    
    # Cerrar el navegador
    print(">>> Cerrando el navegador.")
    driver.quit()