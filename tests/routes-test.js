const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build()

const url = 'http://linserv1.cims.nyu.edu:21736/'

driver.get(url)

