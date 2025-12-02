import prisma from '../utils/prisma';

export const listCountries = async () => {
    const countries = await prisma.country.findMany({
        select: { code: true, name: true },
        orderBy: { name: 'asc' }
    });
    // Ensure consistent shape
    return countries.map(c => ({ code: c.code, name: c.name }));
};

export const getCountryByCode = async (code: string) => {
    const country = await prisma.country.findUnique({
        where: { code: code.toUpperCase() }
    });
    return country || null;
};

export const getCountryByName = async (name: string) => {
    const country = await prisma.country.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } }
    });
    return country || null;
};

export const getVisaRule = async (passportCode: string, countryCode: string) => {
    const [passport, country] = await Promise.all([
        prisma.passport.findUnique({ where: { countryCode: passportCode.toUpperCase() } }),
        prisma.country.findUnique({ where: { code: countryCode.toUpperCase() } })
    ]);

    if (!passport || !country) {
        return { type: 'unknown' };
    }

    const visaRule = await prisma.visaRule.findUnique({
        where: {
            originPassportId_destinationCountryId: {
                originPassportId: passport.id,
                destinationCountryId: country.id
            }
        }
    });

    if (!visaRule) {
        return { type: 'unknown' };
    }

    return {
        type: visaRule.type,
        duration: visaRule.duration ?? undefined,
        notes: visaRule.notes ?? undefined
    };
};
