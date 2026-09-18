// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Get a free hosted Postgres database in seconds: `npx create-db`

generator client {
  provider = "prisma-client"
  output   = "../src/app/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum UserRole {
  CUSTOMER
  ADMIN
  SELLER
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          UserRole  @default(CUSTOMER)
  accounts      Account[]
  sessions      Session[]

  orders        Order[]
  wishlistItems WishlistItem[]
  reviews       Review[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Order {
  id     String      @id @default(cuid())
  status OrderStatus @default(PENDING)
  total  Int

  userId String
  user   User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  items  OrderItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

model OrderItem {
  id       String @id @default(cuid())
  quantity Int
  price    Int    // price at time of purchase, in smallest currency unit

  orderId String
  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)

  // Sanity document _id — no local FK since products live in the CMS.
  // Snapshotted so order history stays intact even if the Sanity doc changes or is deleted.
  productId    String
  productName  String
  productImage String?

  @@index([orderId])
  @@index([productId])
}

model WishlistItem {
  id String @id @default(cuid())

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Sanity document _id — no local FK.
  productId String

  createdAt DateTime @default(now())

  @@unique([userId, productId])
  @@index([productId])
}

model Review {
  id      String  @id @default(cuid())
  rating  Int
  comment String?

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Sanity document _id — no local FK.
  productId String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, productId])
  @@index([productId])
  @@index([userId])
}

$$$$$$$$$$$$$$$$$$$$$$$$$

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Get a free hosted Postgres database in seconds: `npx create-db`

generator client {
  provider = "prisma-client"
  output   = "../src/app/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum UserRole {
  CUSTOMER
  ADMIN
  SELLER
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}

model User {
  id     String   @id @default(cuid())
  name   String?
  email  String   @unique
  image  String?
  role   UserRole @default(CUSTOMER)

  orders        Order[]
  reviews       Review[]
  wishlistItems WishlistItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Order {
  id     String      @id @default(cuid())
  status OrderStatus @default(PENDING)
  total  Int

  userId String
  user   User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  items  OrderItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

model OrderItem {
  id       String @id @default(cuid())
  quantity Int
  price    Int    // price at time of purchase, in smallest currency unit

  orderId String
  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)

  // Sanity document _id — no local FK since products live in the CMS.
  // Snapshotted so order history stays intact even if the Sanity doc changes or is deleted.
  productId    String
  productName  String
  productImage String?

  @@index([orderId])
  @@index([productId])
}

model WishlistItem {
  id String @id @default(cuid())

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Sanity document _id — no local FK.
  productId String

  createdAt DateTime @default(now())

  @@unique([userId, productId])
  @@index([productId])
}

model Review {
  id      String  @id @default(cuid())
  rating  Int
  comment String?

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Sanity document _id — no local FK.
  productId String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, productId])
  @@index([productId])
  @@index([userId])
}