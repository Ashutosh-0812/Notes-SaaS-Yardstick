# Multi-Tenant SaaS Notes Application

A secure, multi-tenant notes application with role-based access control and subscription plans.

## Features

- Multi-tenancy with strict data isolation
- JWT-based authentication
- Role-based access control (Admin/Member)
- Subscription plans (Free/Pro) with feature gating
- CRUD operations for notes
- Responsive UI with Tailwind CSS

## Multi-Tenancy Approach

This application uses a **shared schema with tenant ID column** approach. All data is stored in a single database, with each record containing a `tenant` field that references the tenant it belongs to. This approach provides:

1. **Data Isolation**: All database queries include a tenant filter
2. **Cost Efficiency**: Single database instance
3. **Maintainability**: Simplified schema management
4. **Scalability**: Easy to scale with indexing on tenant fields

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- Vercel account

### Environment Variables

Create a `.env` file in the backend directory:
