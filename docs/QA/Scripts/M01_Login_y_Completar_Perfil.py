"""
==================================================================================
Script de Prueba Automatizada para ResQFood
==================================================================================
Módulo: 1 - Autenticación y Perfil de Usuario
Nombre del Script: M01_Login_y_Completar_Perfil.py
----------------------------------------------------------------------------------
Objetivo del Script:
Este script automatiza el flujo de "camino feliz" para un usuario nuevo que
inicia sesión por primera vez y debe completar su perfil.

Casos de Prueba Cubiertos:
- M1-SES-001: (Happy Path) Inicio de sesión exitoso.
- M1-AUT-001: (Happy Path) Completado de perfil como "Usuario General".

Pre-requisitos:
- El usuario (EMAIL_DE_PRUEBA) debe existir previamente en la base de datos de Clerk.
- El usuario NO debe haber completado su perfil en la aplicación.
- Se requiere tener el WebDriver de Chrome correctamente configurado.
----------------------------------------------------------------------------------
"""
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# --- CREAR UNA CUENTA Y NO HACER EL FORMULARIO DE "COMPLETAR PERFIL" ---
# --- INGRESAR AQUI EL CORREO Y LA CONTRASEÑA DE LA CUENTA CREADA ---
EMAIL_DE_PRUEBA = ""
CONTRASENA_DE_PRUEBA = ""

# --- INICIO DEL SCRIPT DE PRUEBA ---
print(">>> Iniciando prueba: Completar perfil de nuevo usuario...")

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

    # --- FLUJO DE COMPLETAR PERFIL  ---
    
    # 8. Esperar a que el formulario cargue
    print("Esperando por el formulario 'Completa tu perfil'...")
    wait.until(EC.visibility_of_element_located((By.XPATH, "//*[contains(text(), 'Tipo de Cuenta')]")))
    print("Formulario de perfil encontrado.")

    # 9. Seleccionar el rol 
    print("Seleccionando el rol...")
    wait.until(EC.element_to_be_clickable((By.ID, "rol"))).click()
    wait.until(EC.element_to_be_clickable((By.XPATH, "//option[text()='Usuario General']"))).click()
    print("Rol seleccionado correctamente.")
    
    # --- SECCIÓN CORREGIDA: BUSCAR CAMPOS POR SU ETIQUETA ---

    # 10. Rellenar el nombre completo
    print("Ingresando nombre completo...")
    driver.find_element(By.XPATH, "//label[contains(., 'Nombre Completo')]/following-sibling::input").send_keys("Usuario de Prueba Definitivo")

    # 11. Rellenar el teléfono
    print("Ingresando número de teléfono...")
    driver.find_element(By.XPATH, "//label[contains(., 'Teléfono')]/following-sibling::input").send_keys("1122334455")

    # 12. Rellenar la ubicación
    print("Ingresando Dirección...")
    driver.find_element(By.XPATH, "//label[contains(., 'Dirección')]/following-sibling::input").send_keys("Avenida Siempreviva 742")

    print("Ingresando Ciudad...")
    driver.find_element(By.XPATH, "//label[contains(., 'Ciudad')]/following-sibling::input").send_keys("Springfield")
    
    print("Ingresando Provincia...")
    driver.find_element(By.XPATH, "//label[contains(., 'Provincia')]/following-sibling::input").send_keys("Provincia de Prueba")

    print("Ingresando País...")
    driver.find_element(By.XPATH, "//label[contains(., 'País')]/following-sibling::input").send_keys("País de Prueba")

    # 13. Hacer clic en el botón "Guardar y Continuar"
    print("Haciendo clic en 'Guardar y Continuar'...")
    save_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Guardar y Continuar')]")))
    save_button.click()

    # --- VERIFICACIÓN FINAL ---
    print("Verificando redirección al Dashboard principal...")
    wait.until(
        EC.visibility_of_element_located((By.XPATH, "//button[contains(text(), 'Crear Donación')]"))
    )
    
    print("\n✅ PRUEBA EXITOSA: El perfil fue completado y se redirigió al Dashboard correctamente.")

except Exception as e:
    print(f"\n❌ ERROR DURANTE LA PRUEBA: {e}")

finally:
    # Pausa final para poder ver el resultado antes de cerrar
    time.sleep(10) 
    
    # Cerrar el navegador
    print(">>> Cerrando el navegador.")
    driver.quit()