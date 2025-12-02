const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding ...');

    // Create Users
    const passwordHash = await bcrypt.hash('password123', 10);
    const user1 = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            passwordHash,
            passportCode: 'US',
        },
    });

    console.log(`Created user with id: ${user1.id}`);

    // Create Passports
    const passports = [
        { countryCode: 'JP', rank: 1, mobilityScore: 193 },
        { countryCode: 'SG', rank: 1, mobilityScore: 193 },
        { countryCode: 'DE', rank: 2, mobilityScore: 192 },
        { countryCode: 'US', rank: 7, mobilityScore: 186 },
        { countryCode: 'MA', rank: 73, mobilityScore: 67 },
        { countryCode: 'QA', rank: 55, mobilityScore: 100 },
    ];

    for (const p of passports) {
        await prisma.passport.upsert({
            where: { countryCode: p.countryCode },
            update: {},
            create: p,
        });
    }
    console.log('Seeded passports');

    // Create Countries
    const countries = [
        { code: 'JP', name: 'Japan', region: 'Asia', description: 'Land of the rising sun.' },
        { code: 'FR', name: 'France', region: 'Europe', description: 'Art, fashion, and food.' },
        { code: 'MA', name: 'Morocco', region: 'Africa', description: 'Gateway to Africa.' },
        { code: 'QA', name: 'Qatar', region: 'Middle East', description: 'Modern architecture and heritage.' },
        { code: 'US', name: 'United States', region: 'North America', description: 'Land of the free.' },
    ];

    for (const c of countries) {
        await prisma.country.upsert({
            where: { code: c.code },
            update: {},
            create: c,
        });
    }
    console.log('Seeded countries');

    // Create Visa Rules
    const usPassport = await prisma.passport.findUnique({ where: { countryCode: 'US' } });
    const maPassport = await prisma.passport.findUnique({ where: { countryCode: 'MA' } });

    const jpCountry = await prisma.country.findUnique({ where: { code: 'JP' } });
    const frCountry = await prisma.country.findUnique({ where: { code: 'FR' } });
    const maCountry = await prisma.country.findUnique({ where: { code: 'MA' } });
    const qaCountry = await prisma.country.findUnique({ where: { code: 'QA' } });

    if (usPassport && jpCountry && frCountry && maCountry && qaCountry) {
        await prisma.visaRule.createMany({
            data: [
                { originPassportId: usPassport.id, destinationCountryId: jpCountry.id, type: 'visa-free', duration: 90 },
                { originPassportId: usPassport.id, destinationCountryId: frCountry.id, type: 'visa-free', duration: 90 },
                { originPassportId: usPassport.id, destinationCountryId: maCountry.id, type: 'visa-free', duration: 90 },
                { originPassportId: usPassport.id, destinationCountryId: qaCountry.id, type: 'visa-free', duration: 30 },
            ],
            skipDuplicates: true,
        });
    }

    if (maPassport && jpCountry && frCountry && qaCountry) {
        await prisma.visaRule.createMany({
            data: [
                { originPassportId: maPassport.id, destinationCountryId: jpCountry.id, type: 'visa-required' },
                { originPassportId: maPassport.id, destinationCountryId: frCountry.id, type: 'visa-required' },
                { originPassportId: maPassport.id, destinationCountryId: qaCountry.id, type: 'visa-free', duration: 30 },
            ],
            skipDuplicates: true,
        });
    }
    console.log('Seeded visa rules');

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
