import { PrismaClient } from '@prisma/client';

async function testConnection() {
    const prisma = new PrismaClient();
    
    try {
        // Tenta conectar ao banco de dados
        await prisma.$connect();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
        
        // Tenta fazer uma query simples
        const productCount = await prisma.product.count();
        console.log(`📊 Número de produtos no banco: ${productCount}`);
        
    } catch (error) {
        console.error('❌ Erro ao conectar com o banco de dados:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
