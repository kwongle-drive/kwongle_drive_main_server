const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const CustomError = require('../errors/CustomError');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
