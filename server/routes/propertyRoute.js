const express = require('express')
const propertyDbContext = require('../db/property')
const jwt = require('jsonwebtoken')
const { sendWelcomeEmail, sendCancellationEmail } = require('../middleware/email')

const router = express.Router();