import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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
        // Additional passports can be added here
    ];

    for (const p of passports) {
        await prisma.passport.upsert({
            where: { countryCode: p.countryCode },
            update: {},
            create: p,
        });
    }
    console.log('Seeded passports');

    // Create Countries - All World Countries
    const countries = [
        // Africa
        { code: 'DZ', name: 'Algeria', region: 'Africa', description: 'North African country with Mediterranean coast.' },
        { code: 'AO', name: 'Angola', region: 'Africa', description: 'Southern African country rich in oil.' },
        { code: 'BJ', name: 'Benin', region: 'Africa', description: 'West African country with French colonial history.' },
        { code: 'BW', name: 'Botswana', region: 'Africa', description: 'Landlocked Southern African nation known for wildlife.' },
        { code: 'BF', name: 'Burkina Faso', region: 'Africa', description: 'Landlocked West African country.' },
        { code: 'BI', name: 'Burundi', region: 'Africa', description: 'Small East African country in the Great Lakes region.' },
        { code: 'CM', name: 'Cameroon', region: 'Africa', description: 'Central African country with diverse geography.' },
        { code: 'CV', name: 'Cape Verde', region: 'Africa', description: 'Island nation off the coast of West Africa.' },
        { code: 'CF', name: 'Central African Republic', region: 'Africa', description: 'Landlocked country in Central Africa.' },
        { code: 'TD', name: 'Chad', region: 'Africa', description: 'Landlocked country in north-central Africa.' },
        { code: 'KM', name: 'Comoros', region: 'Africa', description: 'Island nation in the Indian Ocean.' },
        { code: 'CG', name: 'Congo', region: 'Africa', description: 'Central African country with Atlantic coast.' },
        { code: 'CD', name: 'Democratic Republic of the Congo', region: 'Africa', description: 'Large Central African country.' },
        { code: 'DJ', name: 'Djibouti', region: 'Africa', description: 'East African country on the Horn of Africa.' },
        { code: 'EG', name: 'Egypt', region: 'Africa', description: 'North African country with ancient civilization.' },
        { code: 'GQ', name: 'Equatorial Guinea', region: 'Africa', description: 'Central African country with Spanish colonial history.' },
        { code: 'ER', name: 'Eritrea', region: 'Africa', description: 'East African country on the Red Sea.' },
        { code: 'SZ', name: 'Eswatini', region: 'Africa', description: 'Landlocked country in Southern Africa.' },
        { code: 'ET', name: 'Ethiopia', region: 'Africa', description: 'East African country with ancient history.' },
        { code: 'GA', name: 'Gabon', region: 'Africa', description: 'Central African country on the equator.' },
        { code: 'GM', name: 'Gambia', region: 'Africa', description: 'Small West African country surrounded by Senegal.' },
        { code: 'GH', name: 'Ghana', region: 'Africa', description: 'West African country with rich cultural heritage.' },
        { code: 'GN', name: 'Guinea', region: 'Africa', description: 'West African country with French colonial history.' },
        { code: 'GW', name: 'Guinea-Bissau', region: 'Africa', description: 'West African country with Portuguese colonial history.' },
        { code: 'CI', name: 'Ivory Coast', region: 'Africa', description: 'West African country with French colonial history.' },
        { code: 'KE', name: 'Kenya', region: 'Africa', description: 'East African country known for safari tourism.' },
        { code: 'LS', name: 'Lesotho', region: 'Africa', description: 'Mountainous landlocked country within South Africa.' },
        { code: 'LR', name: 'Liberia', region: 'Africa', description: 'West African country founded by freed American slaves.' },
        { code: 'LY', name: 'Libya', region: 'Africa', description: 'North African country with Mediterranean coast.' },
        { code: 'MG', name: 'Madagascar', region: 'Africa', description: 'Island nation off the southeast coast of Africa.' },
        { code: 'MW', name: 'Malawi', region: 'Africa', description: 'Landlocked country in Southeastern Africa.' },
        { code: 'ML', name: 'Mali', region: 'Africa', description: 'Landlocked West African country.' },
        { code: 'MR', name: 'Mauritania', region: 'Africa', description: 'Northwest African country with Sahel region.' },
        { code: 'MU', name: 'Mauritius', region: 'Africa', description: 'Island nation in the Indian Ocean.' },
        { code: 'YT', name: 'Mayotte', region: 'Africa', description: 'French overseas department in the Indian Ocean.' },
        { code: 'MA', name: 'Morocco', region: 'Africa', description: 'North African country with Mediterranean and Atlantic coasts.' },
        { code: 'MZ', name: 'Mozambique', region: 'Africa', description: 'Southeastern African country with Indian Ocean coast.' },
        { code: 'NA', name: 'Namibia', region: 'Africa', description: 'Southwestern African country with Namib Desert.' },
        { code: 'NE', name: 'Niger', region: 'Africa', description: 'Landlocked West African country.' },
        { code: 'NG', name: 'Nigeria', region: 'Africa', description: 'West African country and most populous in Africa.' },
        { code: 'RE', name: 'Réunion', region: 'Africa', description: 'French overseas department in the Indian Ocean.' },
        { code: 'RW', name: 'Rwanda', region: 'Africa', description: 'Landlocked East African country in the Great Lakes region.' },
        { code: 'SH', name: 'Saint Helena', region: 'Africa', description: 'British Overseas Territory in the South Atlantic Ocean.' },
        { code: 'ST', name: 'São Tomé and Príncipe', region: 'Africa', description: 'Island nation in the Gulf of Guinea.' },
        { code: 'SN', name: 'Senegal', region: 'Africa', description: 'West African country with French colonial history.' },
        { code: 'SC', name: 'Seychelles', region: 'Africa', description: 'Island nation in the Indian Ocean.' },
        { code: 'SL', name: 'Sierra Leone', region: 'Africa', description: 'West African country with British colonial history.' },
        { code: 'SO', name: 'Somalia', region: 'Africa', description: 'East African country on the Horn of Africa.' },
        { code: 'ZA', name: 'South Africa', region: 'Africa', description: 'Southernmost African country with diverse cultures.' },
        { code: 'SS', name: 'South Sudan', region: 'Africa', description: 'Youngest country in the world, gained independence in 2011.' },
        { code: 'SD', name: 'Sudan', region: 'Africa', description: 'Northeastern African country with Red Sea coast.' },
        { code: 'TZ', name: 'Tanzania', region: 'Africa', description: 'East African country with Mount Kilimanjaro.' },
        { code: 'TG', name: 'Togo', region: 'Africa', description: 'West African country with French colonial history.' },
        { code: 'TN', name: 'Tunisia', region: 'Africa', description: 'North African country with Mediterranean coast.' },
        { code: 'UG', name: 'Uganda', region: 'Africa', description: 'East African country in the Great Lakes region.' },
        { code: 'EH', name: 'Western Sahara', region: 'Africa', description: 'Disputed territory in North Africa.' },
        { code: 'ZM', name: 'Zambia', region: 'Africa', description: 'Landlocked country in Southern Africa.' },
        { code: 'ZW', name: 'Zimbabwe', region: 'Africa', description: 'Landlocked country in Southern Africa.' },

        // Antarctica
        { code: 'AQ', name: 'Antarctica', region: 'Antarctica', description: 'Continent at the South Pole.' },

        // Asia
        { code: 'AF', name: 'Afghanistan', region: 'Asia', description: 'Landlocked country in Central Asia.' },
        { code: 'AM', name: 'Armenia', region: 'Asia', description: 'Landlocked country in the South Caucasus region.' },
        { code: 'AZ', name: 'Azerbaijan', region: 'Asia', description: 'Transcontinental country in the Caucasus region.' },
        { code: 'BH', name: 'Bahrain', region: 'Asia', description: 'Island country in the Persian Gulf.' },
        { code: 'BD', name: 'Bangladesh', region: 'Asia', description: 'South Asian country with rich deltaic landscape.' },
        { code: 'BT', name: 'Bhutan', region: 'Asia', description: 'Landlocked Himalayan country between India and China.' },
        { code: 'BN', name: 'Brunei', region: 'Asia', description: 'Sultanate on the island of Borneo.' },
        { code: 'KH', name: 'Cambodia', region: 'Asia', description: 'Southeast Asian country with Angkor Wat.' },
        { code: 'CN', name: 'China', region: 'Asia', description: 'East Asian country and most populous in the world.' },
        { code: 'CY', name: 'Cyprus', region: 'Asia', description: 'Island country in the Eastern Mediterranean.' },
        { code: 'GE', name: 'Georgia', region: 'Asia', description: 'Transcontinental country in the Caucasus region.' },
        { code: 'IN', name: 'India', region: 'Asia', description: 'South Asian country and second most populous in the world.' },
        { code: 'ID', name: 'Indonesia', region: 'Asia', description: 'Southeast Asian archipelago nation.' },
        { code: 'IR', name: 'Iran', region: 'Asia', description: 'Middle Eastern country with Persian culture.' },
        { code: 'IQ', name: 'Iraq', region: 'Asia', description: 'Middle Eastern country with ancient Mesopotamian history.' },
        { code: 'IL', name: 'Israel', region: 'Asia', description: 'Middle Eastern country with significant religious history.' },
        { code: 'JP', name: 'Japan', region: 'Asia', description: 'East Asian island nation.' },
        { code: 'JO', name: 'Jordan', region: 'Asia', description: 'Middle Eastern country with ancient ruins.' },
        { code: 'KZ', name: 'Kazakhstan', region: 'Asia', description: 'Central Asian country and largest landlocked nation.' },
        { code: 'KP', name: 'North Korea', region: 'Asia', description: 'East Asian country separated from South Korea.' },
        { code: 'KR', name: 'South Korea', region: 'Asia', description: 'East Asian country with advanced technology.' },
        { code: 'KW', name: 'Kuwait', region: 'Asia', description: 'Middle Eastern country with significant oil reserves.' },
        { code: 'KG', name: 'Kyrgyzstan', region: 'Asia', description: 'Landlocked Central Asian country with mountainous terrain.' },
        { code: 'LA', name: 'Laos', region: 'Asia', description: 'Landlocked Southeast Asian country.' },
        { code: 'LB', name: 'Lebanon', region: 'Asia', description: 'Middle Eastern country on the Mediterranean coast.' },
        { code: 'MY', name: 'Malaysia', region: 'Asia', description: 'Southeast Asian country with diverse cultures.' },
        { code: 'MV', name: 'Maldives', region: 'Asia', description: 'Island nation in the Indian Ocean.' },
        { code: 'MN', name: 'Mongolia', region: 'Asia', description: 'Landlocked country between China and Russia.' },
        { code: 'MM', name: 'Myanmar', region: 'Asia', description: 'Southeast Asian country with diverse ethnic groups.' },
        { code: 'NP', name: 'Nepal', region: 'Asia', description: 'Landlocked Himalayan country between India and China.' },
        { code: 'OM', name: 'Oman', region: 'Asia', description: 'Middle Eastern country on the Arabian Peninsula.' },
        { code: 'PK', name: 'Pakistan', region: 'Asia', description: 'South Asian country with diverse landscapes.' },
        { code: 'PS', name: 'Palestine', region: 'Asia', description: 'Geographical region in Western Asia.' },
        { code: 'PH', name: 'Philippines', region: 'Asia', description: 'Southeast Asian archipelago nation.' },
        { code: 'QA', name: 'Qatar', region: 'Asia', description: 'Middle Eastern country on the Arabian Peninsula.' },
        { code: 'SA', name: 'Saudi Arabia', region: 'Asia', description: 'Middle Eastern country and birthplace of Islam.' },
        { code: 'SG', name: 'Singapore', region: 'Asia', description: 'City-state and island country in maritime Southeast Asia.' },
        { code: 'LK', name: 'Sri Lanka', region: 'Asia', description: 'Island nation in the Indian Ocean.' },
        { code: 'SY', name: 'Syria', region: 'Asia', description: 'Middle Eastern country with ancient civilization.' },
        { code: 'TW', name: 'Taiwan', region: 'Asia', description: 'Island in East Asia with complex political status.' },
        { code: 'TJ', name: 'Tajikistan', region: 'Asia', description: 'Landlocked Central Asian country with mountainous terrain.' },
        { code: 'TH', name: 'Thailand', region: 'Asia', description: 'Southeast Asian country with rich cultural heritage.' },
        { code: 'TL', name: 'Timor-Leste', region: 'Asia', description: 'Southeast Asian country on the island of Timor.' },
        { code: 'TR', name: 'Turkey', region: 'Asia', description: 'Transcontinental country bridging Europe and Asia.' },
        { code: 'TM', name: 'Turkmenistan', region: 'Asia', description: 'Landlocked Central Asian country.' },
        { code: 'AE', name: 'United Arab Emirates', region: 'Asia', description: 'Middle Eastern federation of seven emirates.' },
        { code: 'UZ', name: 'Uzbekistan', region: 'Asia', description: 'Landlocked Central Asian country along the Silk Road.' },
        { code: 'VN', name: 'Vietnam', region: 'Asia', description: 'Southeast Asian country with diverse landscapes.' },
        { code: 'YE', name: 'Yemen', region: 'Asia', description: 'Middle Eastern country on the Arabian Peninsula.' },

        // Europe
        { code: 'AL', name: 'Albania', region: 'Europe', description: 'Balkan country on the Adriatic Sea.' },
        { code: 'AD', name: 'Andorra', region: 'Europe', description: 'Microstate between France and Spain.' },
        { code: 'AT', name: 'Austria', region: 'Europe', description: 'Central European country with Alpine landscapes.' },
        { code: 'BY', name: 'Belarus', region: 'Europe', description: 'Landlocked Eastern European country.' },
        { code: 'BE', name: 'Belgium', region: 'Europe', description: 'Western European country with rich cultural heritage.' },
        { code: 'BA', name: 'Bosnia and Herzegovina', region: 'Europe', description: 'Balkan country with diverse ethnic groups.' },
        { code: 'BG', name: 'Bulgaria', region: 'Europe', description: 'Balkan country with Black Sea coast.' },
        { code: 'HR', name: 'Croatia', region: 'Europe', description: 'Balkan country with Adriatic coastline.' },
        { code: 'CY', name: 'Cyprus', region: 'Europe', description: 'Island country in the Eastern Mediterranean.' },
        { code: 'CZ', name: 'Czech Republic', region: 'Europe', description: 'Central European country with Bohemian history.' },
        { code: 'DK', name: 'Denmark', region: 'Europe', description: 'Scandinavian country with Viking heritage.' },
        { code: 'EE', name: 'Estonia', region: 'Europe', description: 'Baltic country with medieval Old Town.' },
        { code: 'FO', name: 'Faroe Islands', region: 'Europe', description: 'Danish autonomous territory in the North Atlantic.' },
        { code: 'FI', name: 'Finland', region: 'Europe', description: 'Nordic country with thousands of lakes.' },
        { code: 'FR', name: 'France', region: 'Europe', description: 'Western European country with rich cultural heritage.' },
        { code: 'DE', name: 'Germany', region: 'Europe', description: 'Central European country and economic powerhouse.' },
        { code: 'GI', name: 'Gibraltar', region: 'Europe', description: 'British Overseas Territory at the southern tip of the Iberian Peninsula.' },
        { code: 'GR', name: 'Greece', region: 'Europe', description: 'Balkan country with ancient civilization.' },
        { code: 'GG', name: 'Guernsey', region: 'Europe', description: 'British Crown Dependency in the English Channel.' },
        { code: 'VA', name: 'Holy See', region: 'Europe', description: 'City-state within Rome, Italy.' },
        { code: 'HU', name: 'Hungary', region: 'Europe', description: 'Landlocked Central European country.' },
        { code: 'IS', name: 'Iceland', region: 'Europe', description: 'Nordic island country with geothermal activity.' },
        { code: 'IE', name: 'Ireland', region: 'Europe', description: 'Island nation in the North Atlantic.' },
        { code: 'IM', name: 'Isle of Man', region: 'Europe', description: 'British Crown Dependency in the Irish Sea.' },
        { code: 'IT', name: 'Italy', region: 'Europe', description: 'Southern European country with rich artistic heritage.' },
        { code: 'JE', name: 'Jersey', region: 'Europe', description: 'British Crown Dependency in the English Channel.' },
        { code: 'LV', name: 'Latvia', region: 'Europe', description: 'Baltic country with Hanseatic history.' },
        { code: 'LI', name: 'Liechtenstein', region: 'Europe', description: 'Microstate between Switzerland and Austria.' },
        { code: 'LT', name: 'Lithuania', region: 'Europe', description: 'Baltic country with medieval heritage.' },
        { code: 'LU', name: 'Luxembourg', region: 'Europe', description: 'Grand Duchy in Western Europe.' },
        { code: 'MT', name: 'Malta', region: 'Europe', description: 'Island nation in the Mediterranean Sea.' },
        { code: 'MD', name: 'Moldova', region: 'Europe', description: 'Landlocked Eastern European country.' },
        { code: 'MC', name: 'Monaco', region: 'Europe', description: 'City-state on the French Riviera.' },
        { code: 'ME', name: 'Montenegro', region: 'Europe', description: 'Balkan country with Adriatic coastline.' },
        { code: 'NL', name: 'Netherlands', region: 'Europe', description: 'Western European country with tulips and windmills.' },
        { code: 'MK', name: 'North Macedonia', region: 'Europe', description: 'Balkan country with ancient history.' },
        { code: 'NO', name: 'Norway', region: 'Europe', description: 'Scandinavian country with fjords and Northern Lights.' },
        { code: 'PL', name: 'Poland', region: 'Europe', description: 'Central European country with rich history.' },
        { code: 'PT', name: 'Portugal', region: 'Europe', description: 'Southwestern European country with maritime heritage.' },
        { code: 'RO', name: 'Romania', region: 'Europe', description: 'Balkan country with medieval castles.' },
        { code: 'RU', name: 'Russia', region: 'Europe', description: 'Transcontinental country spanning Eastern Europe and Asia.' },
        { code: 'SM', name: 'San Marino', region: 'Europe', description: 'Microstate within Italy.' },
        { code: 'RS', name: 'Serbia', region: 'Europe', description: 'Balkan country with rich cultural heritage.' },
        { code: 'SK', name: 'Slovakia', region: 'Europe', description: 'Landlocked Central European country.' },
        { code: 'SI', name: 'Slovenia', region: 'Europe', description: 'Central European country with diverse landscapes.' },
        { code: 'ES', name: 'Spain', region: 'Europe', description: 'Southwestern European country with rich cultural heritage.' },
        { code: 'SJ', name: 'Svalbard and Jan Mayen', region: 'Europe', description: 'Norwegian archipelago in the Arctic Ocean.' },
        { code: 'SE', name: 'Sweden', region: 'Europe', description: 'Scandinavian country with innovative design.' },
        { code: 'CH', name: 'Switzerland', region: 'Europe', description: 'Landlocked country with Alpine landscapes.' },
        { code: 'UA', name: 'Ukraine', region: 'Europe', description: 'Eastern European country with rich cultural heritage.' },
        { code: 'GB', name: 'United Kingdom', region: 'Europe', description: 'Island nation off the northwestern coast of Europe.' },

        // North America
        { code: 'AI', name: 'Anguilla', region: 'North America', description: 'British Overseas Territory in the Caribbean.' },
        { code: 'AG', name: 'Antigua and Barbuda', region: 'North America', description: 'Caribbean island nation.' },
        { code: 'AW', name: 'Aruba', region: 'North America', description: 'Dutch Caribbean island.' },
        { code: 'BS', name: 'Bahamas', region: 'North America', description: 'Island nation in the Lucayan Archipelago.' },
        { code: 'BB', name: 'Barbados', region: 'North America', description: 'Caribbean island nation in the Lesser Antilles.' },
        { code: 'BZ', name: 'Belize', region: 'North America', description: 'Central American country with Caribbean coast.' },
        { code: 'BM', name: 'Bermuda', region: 'North America', description: 'British Overseas Territory in the North Atlantic.' },
        { code: 'VG', name: 'British Virgin Islands', region: 'North America', description: 'British Overseas Territory in the Caribbean.' },
        { code: 'CA', name: 'Canada', region: 'North America', description: 'North American country and second largest in the world.' },
        { code: 'KY', name: 'Cayman Islands', region: 'North America', description: 'British Overseas Territory in the Caribbean.' },
        { code: 'CR', name: 'Costa Rica', region: 'North America', description: 'Central American country with biodiversity.' },
        { code: 'CU', name: 'Cuba', region: 'North America', description: 'Caribbean island nation with communist government.' },
        { code: 'CW', name: 'Curaçao', region: 'North America', description: 'Dutch Caribbean island.' },
        { code: 'DM', name: 'Dominica', region: 'North America', description: 'Island nation in the Lesser Antilles.' },
        { code: 'DO', name: 'Dominican Republic', region: 'North America', description: 'Caribbean country sharing Hispaniola with Haiti.' },
        { code: 'SV', name: 'El Salvador', region: 'North America', description: 'Central American country and smallest in the region.' },
        { code: 'GL', name: 'Greenland', region: 'North America', description: 'Autonomous territory within Denmark.' },
        { code: 'GD', name: 'Grenada', region: 'North America', description: 'Caribbean island nation in the Lesser Antilles.' },
        { code: 'GP', name: 'Guadeloupe', region: 'North America', description: 'French overseas department in the Caribbean.' },
        { code: 'GT', name: 'Guatemala', region: 'North America', description: 'Central American country with Maya heritage.' },
        { code: 'HT', name: 'Haiti', region: 'North America', description: 'Caribbean country sharing Hispaniola with Dominican Republic.' },
        { code: 'HN', name: 'Honduras', region: 'North America', description: 'Central American country with Caribbean and Pacific coasts.' },
        { code: 'JM', name: 'Jamaica', region: 'North America', description: 'Caribbean island nation with reggae music heritage.' },
        { code: 'MQ', name: 'Martinique', region: 'North America', description: 'French overseas department in the Caribbean.' },
        { code: 'MX', name: 'Mexico', region: 'North America', description: 'North American country with rich Aztec heritage.' },
        { code: 'MS', name: 'Montserrat', region: 'North America', description: 'British Overseas Territory in the Caribbean.' },
        { code: 'AN', name: 'Netherlands Antilles', region: 'North America', description: 'Former country in the Caribbean.' },
        { code: 'NI', name: 'Nicaragua', region: 'North America', description: 'Central American country with lakes and volcanoes.' },
        { code: 'PA', name: 'Panama', region: 'North America', description: 'Central American country with Panama Canal.' },
        { code: 'PR', name: 'Puerto Rico', region: 'North America', description: 'Unincorporated territory of the United States.' },
        { code: 'BL', name: 'Saint Barthélemy', region: 'North America', description: 'French overseas collectivity in the Caribbean.' },
        { code: 'KN', name: 'Saint Kitts and Nevis', region: 'North America', description: 'Caribbean island nation in the Lesser Antilles.' },
        { code: 'LC', name: 'Saint Lucia', region: 'North America', description: 'Caribbean island nation in the Lesser Antilles.' },
        { code: 'MF', name: 'Saint Martin', region: 'North America', description: 'French overseas collectivity in the Caribbean.' },
        { code: 'PM', name: 'Saint Pierre and Miquelon', region: 'North America', description: 'French overseas collectivity off the coast of Canada.' },
        { code: 'VC', name: 'Saint Vincent and the Grenadines', region: 'North America', description: 'Caribbean island nation in the Lesser Antilles.' },
        { code: 'SX', name: 'Sint Maarten', region: 'North America', description: 'Dutch constituent country in the Caribbean.' },
        { code: 'TT', name: 'Trinidad and Tobago', region: 'North America', description: 'Caribbean island nation with Carnival festival.' },
        { code: 'TC', name: 'Turks and Caicos Islands', region: 'North America', description: 'British Overseas Territory in the Caribbean.' },
        { code: 'US', name: 'United States', region: 'North America', description: 'North American country and third most populous in the world.' },
        { code: 'VI', name: 'United States Virgin Islands', region: 'North America', description: 'Unincorporated territory of the United States.' },

        // Oceania
        { code: 'AS', name: 'American Samoa', region: 'Oceania', description: 'Unincorporated territory of the United States in the South Pacific.' },
        { code: 'AU', name: 'Australia', region: 'Oceania', description: 'Oceanian country and sixth largest in the world.' },
        { code: 'CK', name: 'Cook Islands', region: 'Oceania', description: 'Self-governing territory in free association with New Zealand.' },
        { code: 'FJ', name: 'Fiji', region: 'Oceania', description: 'Island nation in the South Pacific.' },
        { code: 'PF', name: 'French Polynesia', region: 'Oceania', description: 'French overseas collectivity in the South Pacific.' },
        { code: 'GU', name: 'Guam', region: 'Oceania', description: 'Unincorporated territory of the United States in the Western Pacific.' },
        { code: 'KI', name: 'Kiribati', region: 'Oceania', description: 'Island nation in the Central Pacific.' },
        { code: 'MH', name: 'Marshall Islands', region: 'Oceania', description: 'Island nation in the Central Pacific.' },
        { code: 'FM', name: 'Micronesia', region: 'Oceania', description: 'Island nation in the Western Pacific.' },
        { code: 'NR', name: 'Nauru', region: 'Oceania', description: 'Small island nation in the Central Pacific.' },
        { code: 'NC', name: 'New Caledonia', region: 'Oceania', description: 'French overseas collectivity in the Southwest Pacific.' },
        { code: 'NZ', name: 'New Zealand', region: 'Oceania', description: 'Island nation in the southwestern Pacific Ocean.' },
        { code: 'NU', name: 'Niue', region: 'Oceania', description: 'Self-governing territory in free association with New Zealand.' },
        { code: 'NF', name: 'Norfolk Island', region: 'Oceania', description: 'Australian external territory in the Pacific Ocean.' },
        { code: 'MP', name: 'Northern Mariana Islands', region: 'Oceania', description: 'Commonwealth of the United States in the Western Pacific.' },
        { code: 'PW', name: 'Palau', region: 'Oceania', description: 'Island nation in the Western Pacific.' },
        { code: 'PG', name: 'Papua New Guinea', region: 'Oceania', description: 'Island nation in the southwestern Pacific Ocean.' },
        { code: 'PN', name: 'Pitcairn', region: 'Oceania', description: 'British Overseas Territory in the South Pacific.' },
        { code: 'WS', name: 'Samoa', region: 'Oceania', description: 'Island nation in the South Pacific.' },
        { code: 'SB', name: 'Solomon Islands', region: 'Oceania', description: 'Island nation in the South Pacific.' },
        { code: 'TK', name: 'Tokelau', region: 'Oceania', description: 'Dependent territory of New Zealand in the South Pacific.' },
        { code: 'TO', name: 'Tonga', region: 'Oceania', description: 'Polynesian island nation in the South Pacific.' },
        { code: 'TV', name: 'Tuvalu', region: 'Oceania', description: 'Island nation in the Central Pacific.' },
        { code: 'UM', name: 'United States Minor Outlying Islands', region: 'Oceania', description: 'Group of insular territories of the United States.' },
        { code: 'VU', name: 'Vanuatu', region: 'Oceania', description: 'Island nation in the South Pacific.' },
        { code: 'WF', name: 'Wallis and Futuna', region: 'Oceania', description: 'French overseas collectivity in the South Pacific.' },

        // South America
        { code: 'AR', name: 'Argentina', region: 'South America', description: 'South American country and second largest in Latin America.' },
        { code: 'BO', name: 'Bolivia', region: 'South America', description: 'Landlocked South American country with diverse indigenous cultures.' },
        { code: 'BR', name: 'Brazil', region: 'South America', description: 'South American country and largest in Latin America.' },
        { code: 'CL', name: 'Chile', region: 'South America', description: 'South American country with long Pacific coast.' },
        { code: 'CO', name: 'Colombia', region: 'South America', description: 'Northwestern South American country with Amazon rainforest.' },
        { code: 'EC', name: 'Ecuador', region: 'South America', description: 'Northwestern South American country with Galápagos Islands.' },
        { code: 'FK', name: 'Falkland Islands', region: 'South America', description: 'British Overseas Territory in the South Atlantic.' },
        { code: 'GF', name: 'French Guiana', region: 'South America', description: 'French overseas department in northeastern South America.' },
        { code: 'GY', name: 'Guyana', region: 'South America', description: 'Northern South American country with British colonial history.' },
        { code: 'PY', name: 'Paraguay', region: 'South America', description: 'Landlocked South American country with Guarani culture.' },
        { code: 'PE', name: 'Peru', region: 'South America', description: 'Western South American country with Incan heritage.' },
        { code: 'SR', name: 'Suriname', region: 'South America', description: 'Northern South American country with Dutch colonial history.' },
        { code: 'UY', name: 'Uruguay', region: 'South America', description: 'South American country with beaches and grasslands.' },
        { code: 'VE', name: 'Venezuela', region: 'South America', description: 'Northern South American country with oil reserves.' },
    ];

    for (const c of countries) {
        await prisma.country.upsert({
            where: { code: c.code },
            update: {},
            create: c,
        });
    }
    console.log('Seeded all world countries');

    // Create Visa Rules
    // Get IDs first
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