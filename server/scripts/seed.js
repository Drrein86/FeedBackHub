import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@feedbackhub.com' },
    update: {},
    create: {
      email: 'admin@feedbackhub.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('👤 Admin user created:', admin.email);

  // Create sample stores with translations
  const stores = [
    {
      translations: [
        { language: 'en', name: 'Downtown Store', location: '123 Main St, City Center' },
        { language: 'he', name: 'חנות מרכז העיר', location: 'רחוב ראשי 123, מרכז העיר' }
      ]
    },
    {
      translations: [
        { language: 'en', name: 'Westside Location', location: '456 West Ave, Westside' },
        { language: 'he', name: 'סניף מערב העיר', location: 'שדרות מערב 456, מערב העיר' }
      ]
    },
    {
      translations: [
        { language: 'en', name: 'Airport Branch', location: '789 Airport Rd, Terminal 2' },
        { language: 'he', name: 'סניף שדה התעופה', location: 'רחוב שדה התעופה 789, טרמינל 2' }
      ]
    },
    {
      translations: [
        { language: 'en', name: 'Northgate Mall', location: '321 Mall Dr, Northgate' },
        { language: 'he', name: 'קניון צפון השער', location: 'דרך הקניון 321, צפון השער' }
      ]
    }
  ];

  for (const storeData of stores) {
    const store = await prisma.store.create({
      data: {
        translations: {
          create: storeData.translations
        }
      }
    });
    console.log('🏪 Store created:', store.id);
  }

  // Create sample reviews
  const sampleReviews = [
    {
      storeId: '', // Will be filled with actual store ID
      rating: 5,
      comment: 'Excellent service! The staff was very helpful and friendly.',
      language: 'en'
    },
    {
      storeId: '',
      rating: 4,
      comment: 'Good experience overall. Clean store and quick checkout.',
      language: 'en'
    },
    {
      storeId: '',
      rating: 3,
      comment: 'Average experience. Wait time was a bit long.',
      language: 'en'
    },
    {
      storeId: '',
      rating: 5,
      comment: 'Love this location! Always stocked and organized.',
      language: 'en'
    },
    {
      storeId: '',
      rating: 4,
      comment: 'Great product selection. Would recommend to others.',
      language: 'en'
    }
  ];

  // Get all stores to assign reviews
  const allStores = await prisma.store.findMany();
  
  for (let i = 0; i < sampleReviews.length; i++) {
    const storeIndex = i % allStores.length;
    await prisma.review.create({
      data: {
        ...sampleReviews[i],
        storeId: allStores[storeIndex].id
      }
    });
  }

  console.log('📝 Sample reviews created');

  // Create default settings
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      webhookUrl: 'https://api.example.com/webhook',
      notificationEmail: 'admin@feedbackhub.com',
      autoApprove: true,
      minRating: 1
    }
  });

  console.log('⚙️ Default settings created');
  console.log('✅ Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
