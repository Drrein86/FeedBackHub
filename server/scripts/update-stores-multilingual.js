import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateStoresMultilingual() {
  console.log('🔄 Updating stores to have both English and Hebrew translations...');

  try {
    // Get all stores
    const stores = await prisma.store.findMany({
      include: {
        translations: true
      }
    });

    console.log(`Found ${stores.length} stores to update`);

    for (const store of stores) {
      const existingTranslations = store.translations;
      const hasEnglish = existingTranslations.some(t => t.language === 'en');
      const hasHebrew = existingTranslations.some(t => t.language === 'he');

      console.log(`Processing store ${store.id}:`);
      console.log(`  - Has English: ${hasEnglish}`);
      console.log(`  - Has Hebrew: ${hasHebrew}`);

      // If store only has one language, create the other
      if (hasEnglish && !hasHebrew) {
        const englishTranslation = existingTranslations.find(t => t.language === 'en');
        await prisma.storeTranslation.create({
          data: {
            storeId: store.id,
            language: 'he',
            name: `חנות ${englishTranslation.name}`,
            location: `מיקום ${englishTranslation.location}`
          }
        });
        console.log(`  ✅ Added Hebrew translation for ${englishTranslation.name}`);
      } else if (hasHebrew && !hasEnglish) {
        const hebrewTranslation = existingTranslations.find(t => t.language === 'he');
        await prisma.storeTranslation.create({
          data: {
            storeId: store.id,
            language: 'en',
            name: `Store ${hebrewTranslation.name}`,
            location: `Location ${hebrewTranslation.location}`
          }
        });
        console.log(`  ✅ Added English translation for ${hebrewTranslation.name}`);
      } else if (!hasEnglish && !hasHebrew) {
        // If store has no translations, create both
        await prisma.storeTranslation.createMany({
          data: [
            {
              storeId: store.id,
              language: 'en',
              name: 'Default Store',
              location: 'Default Location'
            },
            {
              storeId: store.id,
              language: 'he',
              name: 'חנות ברירת מחדל',
              location: 'מיקום ברירת מחדל'
            }
          ]
        });
        console.log(`  ✅ Added both English and Hebrew translations for store ${store.id}`);
      } else {
        console.log(`  ✅ Store ${store.id} already has both translations`);
      }
    }

    console.log('🎉 All stores updated successfully!');
    
    // Show final results
    const updatedStores = await prisma.store.findMany({
      include: {
        translations: true
      }
    });

    console.log('\n📊 Final store translations:');
    for (const store of updatedStores) {
      console.log(`Store ${store.id}:`);
      store.translations.forEach(translation => {
        console.log(`  - ${translation.language}: ${translation.name} (${translation.location})`);
      });
    }

  } catch (error) {
    console.error('❌ Error updating stores:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateStoresMultilingual();
