# Database Migration Guide

This guide explains how to manage database schema changes in the Onvent application using Flyway.

## Configuration

The application is configured to preserve data across restarts with the following settings in `application.properties`:

```properties
# Database schema management
spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.baseline-on-migrate=true
```

## Migration Process

### 1. Creating New Migrations

All database schema changes must be done through migration scripts located in:
```
src/main/resources/db/migration/
```

Migration files must follow the naming convention:
```
V<version>__<description>.sql
```

Example:
```
V1__Initial_Schema.sql
V2__Add_User_Phone_Number.sql
V3__Create_Indexes.sql
```

### 2. Writing Migration Scripts

Migration scripts should:
- Be idempotent (safe to run multiple times)
- Include both forward and rollback changes when possible
- Follow database best practices
- Be well documented with comments

Example migration script:
```sql
-- Add phone number column to users table
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);

-- Add index for faster lookups
CREATE INDEX idx_users_phone ON users(phone_number);

-- Remove index and column in rollback
-- DROP INDEX idx_users_phone;
-- ALTER TABLE users DROP COLUMN phone_number;
```

### 3. Applying Migrations

Migrations are automatically applied when the application starts. To manually apply migrations:

```bash
./mvnw flyway:migrate
```

### 4. Checking Migration Status

To check the status of migrations:

```bash
./mvnw flyway:info
```

### 5. Rolling Back Migrations

To rollback the last migration:

```bash
./mvnw flyway:undo
```

Note: This requires undo scripts to be created.

## Best Practices

1. **Never modify existing migration scripts** - Create new migrations for changes
2. **Test migrations thoroughly** - Use a separate database for testing
3. **Backup production data** - Always backup before applying migrations
4. **Use transactions** - Wrap related changes in transactions when possible
5. **Document changes** - Include clear descriptions of what each migration does

## Data Preservation

With the current configuration:
- Database tables and data are preserved across application restarts
- Schema validation ensures the database structure matches the entity definitions
- Flyway manages schema changes in a controlled, versioned manner
- No data is automatically deleted when the application stops
- Conflicting SQL files (schema.sql, schema-updated.sql) have been removed to prevent interference with Flyway

## Troubleshooting

### Common Issues

1. **Validation failed**: The database schema doesn't match entity definitions
   - Solution: Create a new migration to align the schema

2. **Migration failed**: A migration script contains errors
   - Solution: Fix the script and retry, or create a new migration to correct the issue

3. **Out of order migrations**: Migrations were applied out of sequence
   - Solution: Use `flyway.repair` to fix the metadata

### Commands for Troubleshooting

```bash
# Repair migration metadata
./mvnw flyway:repair

# Clean the database (WARNING: This deletes all data)
./mvnw flyway:clean

# Validate current schema
./mvnw flyway:validate
```

## Production Considerations

1. **Backup**: Always backup production data before migrations
2. **Maintenance windows**: Schedule migrations during low-traffic periods
3. **Rollback plans**: Prepare rollback procedures for critical migrations
4. **Monitoring**: Monitor application health after migrations
5. **Testing**: Test migrations in staging environment first