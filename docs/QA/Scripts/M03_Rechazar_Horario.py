"""
==================================================================================
Script de Prueba Automatizada para ResQFood
==================================================================================
Módulo: 3 - Flujo de Solicitud
Nombre del Script: M03_Rechazar_Horario.py
----------------------------------------------------------------------------------
Objetivo del Script:
Este script automatiza el flujo de un receptor que rechaza un horario de
entrega propuesto por un donante.

Caso de Prueba Cubierto:
- M3-GES-002: (Happy Path) Rechazar horario propuesto ("No puedo").

Pre-requisitos:
- El usuario receptor (EMAIL_DE_PRUEBA) debe tener una solicitud aprobada
  para la donación "PRUEBAAA2", esperando su confirmación de horario.
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
print(f">>> Iniciando prueba: Rechazar horario para la donación '{NOMBRE_DONACION_PRUEBA}'...")

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

    # --- INICIO DEL FLUJO DE RECHAZO ---
    
    # 4. Esperar a que la página cargue y encontrar la tarjeta de la solicitud
    print(f"Buscando la solicitud para la donación '{NOMBRE_DONACION_PRUEBA}'...")
    xpath_tarjeta_solicitud = f"//div[contains(@class, 'p-4') and .//h3[text()='{NOMBRE_DONACION_PRUEBA}']]"
    tarjeta_solicitud = wait.until(
        EC.visibility_of_element_located((By.XPATH, xpath_tarjeta_solicitud))
    )

    # 5. Hacer clic en el botón "No puedo" dentro de esa tarjeta
    print("Haciendo clic en el botón 'No puedo'...")
    # Buscamos el botón que esté DENTRO del div de la tarjeta
    boton_rechazar = tarjeta_solicitud.find_element(By.XPATH, ".//button[text()='No puedo']")
    boton_rechazar.click()

    # --- VERIFICACIÓN FINAL ---

    # 6. Verificar que apareció un mensaje de éxito
    print("Verificando que aparezca el mensaje de éxito...")
    wait.until(EC.visibility_of_element_located(
        (By.XPATH, "//*[contains(text(), 'Horario rechazado. El donante será notificado')]") # Asumimos este texto, lo podemos ajustar si es diferente
    ))
    
    # 7. Opcional pero recomendado: Verificar que la tarjeta desaparece o cambia de estado
    # En este caso, lo más simple es verificar que el botón "Confirmar" ya no es visible
    print("Verificando que la tarjeta de solicitud haya cambiado de estado...")
    wait.until(EC.invisibility_of_element_located(
        (By.XPATH, f"{xpath_tarjeta_solicitud}//button[text()='Confirmar']")
    ))

    print("\n✅ PRUEBA EXITOSA: El horario fue rechazado y la solicitud se actualizó correctamente.")

except Exception as e:
    print(f"\n❌ ERROR DURANTE LA PRUEBA: {e}")

finally:
    # Pausa final para poder ver el resultado antes de cerrar
    time.sleep(5) 
    
    # Cerrar el navegador
    print(">>> Cerrando el navegador.")
    driver.quit()