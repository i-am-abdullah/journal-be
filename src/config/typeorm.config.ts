import { DataSource, DataSourceOptions } from 'typeorm';

require('dotenv').config()

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};
  console.log('=== Environment Variables Debug ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_HOST:', process.env.DATABASE_HOST);
  console.log('DATABASE_USER:', process.env.DATABASE_USER);
  console.log('DATABASE_NAME:', process.env.DATABASE_NAME);
  console.log('DATABASE_NAME:', process.env.DATABASE_PASSWORD);
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
  console.log('AWS_REGION:', process.env.AWS_REGION);
  console.log('================================');

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;