"""
==================================================================================
Script de Prueba Automatizada para ResQFood
==================================================================================
Módulo: 3 - Flujo de Solicitud
Nombre del Script: M03_Confirmar_Horario.py
----------------------------------------------------------------------------------
Objetivo del Script:
Este script automatiza el flujo de un receptor que confirma un horario
propuesto por un donante.
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
print(f">>> Iniciando prueba: Confirmar horario para la donación '{NOMBRE_DONACION_PRUEBA}'...")

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
    
    # 3. Navegar a "Mis Solicitudes"
    print("Navegando a 'Mis Solicitudes'...")
    wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@aria-label='Opciones de perfil']"))).click()
    wait.until(EC.element_to_be_clickable((By.XPATH, "//a[contains(@href, '/mis-solicitudes')]"))).click()

    # --- INICIO DEL FLUJO DE CONFIRMACIÓN (LÓGICA CORREGIDA FINAL) ---
    
    # 4. Esperar a que la página cargue y encontrar la TARJETA de la solicitud
    print(f"Buscando la solicitud para la donación '{NOMBRE_DONACION_PRUEBA}'...")
    # --- XPATH CORREGIDO ---
    xpath_tarjeta_solicitud = f"//div[contains(@class, 'p-4') and .//h3[text()='{NOMBRE_DONACION_PRUEBA}']]"
    tarjeta_solicitud = wait.until(
        EC.visibility_of_element_located((By.XPATH, xpath_tarjeta_solicitud))
    )

    # 5. Hacer clic en el botón "Confirmar" dentro de esa tarjeta
    print("Haciendo clic en el botón 'Confirmar'...")
    # Buscamos el botón que esté DENTRO del div de la tarjeta
    boton_confirmar = tarjeta_solicitud.find_element(By.XPATH, ".//button[text()='Confirmar']")
    boton_confirmar.click()

    # --- VERIFICACIÓN FINAL ---

    # 6. Verificar que el modal con el código de retiro aparece
    print("Verificando que aparezca el modal con el código de retiro...")
    wait.until(EC.visibility_of_element_located(
        (By.XPATH, "//h3[text()='¡Horario Confirmado!']")
    ))
    
    # 7. Verificar que existe un código de retiro
    codigo_retiro = driver.find_element(By.XPATH, "//div[contains(@class, 'bg-green-100')]//span").text
    print(f"Código de retiro encontrado: '{codigo_retiro}'")
    assert len(codigo_retiro) == 6

    print("\n✅ PRUEBA EXITOSA: El horario fue confirmado y el código de retiro se mostró correctamente.")

except Exception as e:
    print(f"\n❌ ERROR DURANTE LA PRUEBA: {e}")

finally:
    # Pausa final para poder ver el resultado antes de cerrar
    time.sleep(5) 
    
    # Cerrar el navegador
    print(">>> Cerrando el navegador.")
    driver.quit()