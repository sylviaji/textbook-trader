from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time

base_url = 'http://linserv1.cims.nyu.edu:21736/'
driver = webdriver.Chrome()

username = 'test_user'
email = 'test_user@gmail.com'
pwd = 'test_user_123456'
keywords = ['','JavaScript: The Good Parts', 'soledad', 'mit 3rd', 'nonexist']

title_sell = 'Shooting an Elephant: And Other Essays'
isbn_sell = '9780141187396'
price_sell = '13.09'

title_buy = 'Nineteen Eighty-Four'
isbn_buy = '978-0679417392'
price_buy = '15.99'

def search():
	driver.get(base_url)
	time.sleep(10)
	for keyword in keywords:
		try:
			element = WebDriverWait(driver, 10).until(
				EC.presence_of_element_located((By.CLASS_NAME, 'btn-search'))
		)
		finally:
			driver.find_element_by_name('title').send_keys(keyword)
			time.sleep(2)
			driver.find_element_by_class_name('btn-search').click()
			time.sleep(4)


def register():
	driver.get(base_url + 'mine')
	try:
		element = WebDriverWait(driver, 10).until(
        	EC.presence_of_element_located((By.ID, 'register'))
    )
	finally:
		driver.find_element_by_id('username-register').send_keys(username)
		driver.find_element_by_id('email').send_keys(email)
		driver.find_element_by_id('password-register').send_keys(pwd)
		driver.find_element_by_id('password2').send_keys(pwd)
		time.sleep(2)
		driver.find_element_by_id('register').click()
		time.sleep(6)


def login():
	driver.get(base_url + 'mine')
	try:
		element = WebDriverWait(driver, 10).until(
        	EC.presence_of_element_located((By.ID, 'signin'))
    )
	finally:
		driver.find_element_by_id('username').send_keys(username)
		driver.find_element_by_id('password').send_keys(pwd)
		time.sleep(2)
		driver.find_element_by_id('signin').click()
		time.sleep(4)


def add_sell():
	driver.find_element_by_xpath('//*[@id="navbarNavAltMarkup"]/div/a[2]').click()
	try:
		element = WebDriverWait(driver, 10).until(
        	EC.presence_of_element_located((By.XPATH, '/html/body/div[1]/div/div/div/a'))
    )
	finally:
		time.sleep(3)
		driver.find_element_by_xpath('/html/body/div[1]/div/div/div/a').click()

		try:
			element = WebDriverWait(driver, 10).until(
        		EC.presence_of_element_located((By.XPATH, '/html/body/div[1]/div[2]/div[2]/form/button'))
  		  )
		finally:
			driver.find_element_by_id('title').send_keys(title_sell)
			driver.find_element_by_id('ISBN').send_keys(isbn_sell)
			driver.find_element_by_id('price').send_keys(price_sell)
			time.sleep(2)
			driver.find_element_by_xpath('/html/body/div[1]/div[2]/div[2]/form/button').click()
			time.sleep(4)
			

def add_buy():
	driver.find_element_by_xpath('//*[@id="navbarNavAltMarkup"]/div/a[3]').click()
	try:
		element = WebDriverWait(driver, 10).until(
        	EC.presence_of_element_located((By.XPATH, '/html/body/div[1]/div/div/div/a'))
    )
	finally:
		time.sleep(3)
		driver.find_element_by_xpath('/html/body/div[1]/div/div/div/a').click()

		try:
			element = WebDriverWait(driver, 10).until(
        		EC.presence_of_element_located((By.XPATH, '/html/body/div[1]/div[2]/div[2]/form/button'))
  		  )
		finally:
			driver.find_element_by_id('title').send_keys(title_buy)
			driver.find_element_by_id('ISBN').send_keys(isbn_buy)
			driver.find_element_by_id('price').send_keys(price_buy)
			time.sleep(1)
			driver.find_element_by_xpath('/html/body/div[1]/div[2]/div[2]/form/button').click()
			time.sleep(4)


def logout():
	driver.get(base_url + 'mine')
	try:
		element = WebDriverWait(driver, 10).until(
        	EC.presence_of_element_located((By.ID, 'logout'))
    )
	finally:
		time.sleep(1)
		driver.find_element_by_id('logout').click()
		time.sleep(2)


def main():
	search()
	register()
	register() # test error page with duplicate username upon registering
	login()
	add_sell()
	add_buy()
	logout()
	driver.quit()

main()
