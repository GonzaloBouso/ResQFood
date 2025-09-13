"""
==================================================================================
Script de Prueba Automatizada para ResQFood
==================================================================================
Módulo: 3 - Flujo de Solicitud
Nombre del Script: M03_Solicitar_Donacion.py
----------------------------------------------------------------------------------
Objetivo del Script:
Este script automatiza el flujo de "camino feliz" para un usuario (receptor)
que solicita una donación disponible desde el dashboard.

Caso de Prueba Cubierto:
- M3-SOL-001: (Happy Path) Solicitar una donación disponible.

Pre-requisitos:
- El usuario receptor (EMAIL_DE_PRUEBA) no debe ser el dueño de la donación.
- La donación "PRUEBAAA2" debe existir y estar en estado "DISPONIBLE".
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
NOMBRE_DONACION_A_SOLICITAR = ""

# --- INICIO DEL SCRIPT DE PRUEBA ---
print(f">>> Iniciando prueba: Solicitar la donación '{NOMBRE_DONACION_A_SOLICITAR}'...")

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
    
    # --- INICIO DEL FLUJO DE SOLICITUD ---
    
    # 3. Esperar a que el dashboard cargue y encontrar la tarjeta de la donación
    print(f"Buscando la donación '{NOMBRE_DONACION_A_SOLICITAR}' en el dashboard...")
    # Este XPath encuentra el div de la tarjeta que contiene un h3 con el texto específico
    xpath_tarjeta_donacion = f"//div[contains(@class, 'border-gray-200') and .//h3[text()='{NOMBRE_DONACION_A_SOLICITAR}']]"
    tarjeta_donacion = wait.until(
        EC.visibility_of_element_located((By.XPATH, xpath_tarjeta_donacion))
    )
    
    # Hacer scroll hasta que la tarjeta sea visible
    driver.execute_script("arguments[0].scrollIntoView(true);", tarjeta_donacion)
    time.sleep(1) # Pequeña pausa para que el scroll termine

    # 4. Hacer clic en el botón "Solicitar" dentro de esa tarjeta
    print("Haciendo clic en el botón 'Solicitar'...")
    # Buscamos el botón que esté DENTRO del div de la tarjeta
    boton_solicitar = tarjeta_donacion.find_element(By.XPATH, ".//button[text()='Solicitar']")
    boton_solicitar.click()

    # 5. Esperar a que el modal de confirmación aparezca
    print("Esperando el modal de confirmación...")
    wait.until(EC.visibility_of_element_located(
        (By.XPATH, f"//*[contains(text(), '¿Estás seguro de que quieres solicitar la donación')]")
    ))

    # 6. Hacer clic en el botón "Sí, Solicitar"
    print("Confirmando la solicitud...")
    boton_confirmar = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[text()='Sí, Solicitar']")
    ))
    boton_confirmar.click()

    # --- VERIFICACIÓN FINAL ---

    # 7. Verificar que apareció un mensaje de éxito (Toast)
    print("Verificando que aparezca el mensaje de éxito...")
    wait.until(EC.visibility_of_element_located(
        (By.XPATH, "//*[contains(text(), 'Solicitud enviada con éxito')]")
    ))
    
    print("\n✅ PRUEBA EXITOSA: La donación fue solicitada correctamente.")

except Exception as e:
    print(f"\n❌ ERROR DURANTE LA PRUEBA: {e}")

finally:
    # Pausa final para poder ver el resultado antes de cerrar
    time.sleep(5) 
    
    # Cerrar el navegador
    print(">>> Cerrando el navegador.")
    driver.quit()